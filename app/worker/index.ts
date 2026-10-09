// AP Learning backend: Google sign-in → session, cross-device sync, admin content editing, feedback.
// Everything that is not /api/* is the static app, served from ./dist by the ASSETS binding.

import { KEY_PATTERN, mergeItem, type SyncItem } from '../shared/sync'

interface Env {
  DB: D1Database
  ASSETS: Fetcher
  GOOGLE_CLIENT_ID: string
  OWNER_EMAIL: string
  DEV_AUTH?: string // "1" only in local .dev.vars: enables /api/auth/dev for local testing
}

interface User {
  sub: string
  email: string
  name: string | null
  picture: string | null
}

class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const SESSION_DAYS = 90
const MAX_BODY = 2_000_000
const PULL_PAGE = 1000
const CONTENT_KEY = /^(video|card|check|flash|lesson):[\w.\-]{1,60}(:\d{1,3})?$/
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/

const now = () => new Date().toISOString()

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

async function readJson<T>(req: Request): Promise<T> {
  const text = await req.text()
  if (text.length > MAX_BODY) throw new HttpError(413, 'Request too large')
  try {
    return JSON.parse(text) as T
  } catch {
    throw new HttpError(400, 'Invalid JSON')
  }
}

// ---------- crypto helpers ----------

function b64urlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

function bytesToB64url(b: Uint8Array): string {
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

// ---------- Google ID token verification ----------

let jwksCache: { keys: (JsonWebKey & { kid: string })[]; until: number } | null = null

async function googleKeys(force = false) {
  if (!force && jwksCache && jwksCache.until > Date.now()) return jwksCache.keys
  const res = await fetch('https://www.googleapis.com/oauth2/v3/certs')
  if (!res.ok) throw new HttpError(502, 'Could not reach Google')
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get('cache-control') ?? '')?.[1] ?? 3600)
  const body = (await res.json()) as { keys: (JsonWebKey & { kid: string })[] }
  jwksCache = { keys: body.keys, until: Date.now() + maxAge * 1000 }
  return body.keys
}

async function verifyGoogleToken(credential: string, clientId: string) {
  const parts = credential.split('.')
  if (parts.length !== 3) throw new HttpError(401, 'Bad sign-in token')
  const dec = new TextDecoder()
  let header: { alg: string; kid: string }
  try {
    header = JSON.parse(dec.decode(b64urlToBytes(parts[0])))
  } catch {
    throw new HttpError(401, 'Bad sign-in token')
  }
  if (header.alg !== 'RS256') throw new HttpError(401, 'Bad sign-in token')
  let jwk = (await googleKeys()).find((k) => k.kid === header.kid)
  if (!jwk) jwk = (await googleKeys(true)).find((k) => k.kid === header.kid)
  if (!jwk) throw new HttpError(401, 'Unknown signing key')
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'])
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  )
  if (!ok) throw new HttpError(401, 'Bad sign-in token')
  const c = JSON.parse(dec.decode(b64urlToBytes(parts[1]))) as Record<string, unknown>
  const t = Math.floor(Date.now() / 1000)
  if (c.aud !== clientId) throw new HttpError(401, 'Token is for another app')
  if (c.iss !== 'accounts.google.com' && c.iss !== 'https://accounts.google.com') throw new HttpError(401, 'Bad issuer')
  if (typeof c.exp !== 'number' || c.exp < t - 60) throw new HttpError(401, 'Sign-in expired. Please sign in again.')
  if (c.email_verified !== true) throw new HttpError(401, 'Google email is not verified')
  return {
    sub: String(c.sub),
    email: String(c.email).toLowerCase(),
    name: typeof c.given_name === 'string' ? c.given_name : typeof c.name === 'string' ? c.name : null,
    picture: typeof c.picture === 'string' ? c.picture : null,
  }
}

// ---------- sessions ----------

async function startSession(env: Env, u: User) {
  const t = now()
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (sub, email, name, picture, created_at, last_seen) VALUES (?1, ?2, ?3, ?4, ?5, ?5)
       ON CONFLICT(sub) DO UPDATE SET email=excluded.email, name=excluded.name, picture=excluded.picture, last_seen=excluded.last_seen`,
    ).bind(u.sub, u.email, u.name, u.picture, t),
    env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(t),
  ])
  const token = bytesToB64url(crypto.getRandomValues(new Uint8Array(32)))
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString()
  await env.DB.prepare('INSERT INTO sessions (token_hash, sub, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256Hex(token), u.sub, t, expires)
    .run()
  return { token, user: u, isAdmin: await isAdmin(env, u.email) }
}

async function currentUser(req: Request, env: Env): Promise<User> {
  const m = /^Bearer (.+)$/.exec(req.headers.get('authorization') ?? '')
  if (!m) throw new HttpError(401, 'Not signed in')
  const row = await env.DB.prepare(
    `SELECT u.sub, u.email, u.name, u.picture FROM sessions s JOIN users u ON u.sub = s.sub
     WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256Hex(m[1]), now())
    .first<User>()
  if (!row) throw new HttpError(401, 'Session expired. Please sign in again.')
  return row
}

async function isAdmin(env: Env, email: string) {
  if (email.toLowerCase() === env.OWNER_EMAIL.toLowerCase()) return true
  return !!(await env.DB.prepare('SELECT 1 FROM admins WHERE email = ?').bind(email.toLowerCase()).first())
}

async function requireAdmin(req: Request, env: Env) {
  const u = await currentUser(req, env)
  if (!(await isAdmin(env, u.email))) throw new HttpError(403, 'Admins only')
  return u
}

// ---------- sync ----------

async function sync(req: Request, env: Env) {
  const user = await currentUser(req, env)
  const body = await readJson<{ since?: number; items?: SyncItem[] }>(req)
  const since = Number.isSafeInteger(body.since) && body.since! >= 0 ? body.since! : 0
  const incoming = Array.isArray(body.items) ? body.items : []
  if (incoming.length > 2000) throw new HttpError(413, 'Too many items in one sync')

  // Validate, and collapse duplicates of the same key within this request.
  const batch = new Map<string, SyncItem>()
  for (const it of incoming) {
    if (!it || typeof it.key !== 'string' || !KEY_PATTERN.test(it.key)) throw new HttpError(400, `Bad item key`)
    if (typeof it.data !== 'object' || it.data === null || Array.isArray(it.data)) throw new HttpError(400, 'Bad item data')
    if (typeof it.updated_at !== 'string' || it.updated_at.length > 40) throw new HttpError(400, 'Bad item time')
    if (JSON.stringify(it.data).length > 40_000) throw new HttpError(413, 'Item too large')
    const prev = batch.get(it.key)
    batch.set(it.key, prev ? (mergeItem(prev, it) ?? prev) : it)
  }

  // Load the stored copies of the non-event keys, then keep whichever copy the merge rules pick.
  const kvKeys = [...batch.keys()].filter((k) => !k.startsWith('ev:'))
  const stored = new Map<string, SyncItem>()
  for (let i = 0; i < kvKeys.length; i += 90) {
    const chunk = kvKeys.slice(i, i + 90)
    const rows = await env.DB.prepare(
      `SELECT key, data, updated_at FROM items WHERE user_sub = ? AND key IN (${chunk.map(() => '?').join(',')})`,
    )
      .bind(user.sub, ...chunk)
      .all<{ key: string; data: string; updated_at: string }>()
    for (const r of rows.results) stored.set(r.key, { key: r.key, data: JSON.parse(r.data), updated_at: r.updated_at })
  }

  const stmts: D1PreparedStatement[] = []
  for (const it of batch.values()) {
    if (it.key.startsWith('ev:')) {
      stmts.push(
        env.DB.prepare('INSERT OR IGNORE INTO items (user_sub, key, data, updated_at) VALUES (?, ?, ?, ?)').bind(
          user.sub, it.key, JSON.stringify(it.data), it.updated_at,
        ),
      )
      continue
    }
    const winner = mergeItem(stored.get(it.key), it)
    if (winner)
      // REPLACE deletes and re-inserts, so the row gets a fresh seq and other devices will pull it.
      stmts.push(
        env.DB.prepare('INSERT OR REPLACE INTO items (user_sub, key, data, updated_at) VALUES (?, ?, ?, ?)').bind(
          user.sub, winner.key, JSON.stringify(winner.data), winner.updated_at,
        ),
      )
  }
  for (let i = 0; i < stmts.length; i += 100) await env.DB.batch(stmts.slice(i, i + 100))

  const rows = await env.DB.prepare(
    'SELECT seq, key, data, updated_at FROM items WHERE user_sub = ? AND seq > ? ORDER BY seq LIMIT ?',
  )
    .bind(user.sub, since, PULL_PAGE)
    .all<{ seq: number; key: string; data: string; updated_at: string }>()
  const items = rows.results.map((r) => ({ key: r.key, data: JSON.parse(r.data), updated_at: r.updated_at }))
  const cursor = rows.results.length ? rows.results[rows.results.length - 1].seq : since
  await env.DB.prepare('UPDATE users SET last_seen = ? WHERE sub = ?').bind(now(), user.sub).run()
  return json({ items, cursor, more: rows.results.length === PULL_PAGE })
}

// ---------- content (public read, admin write) ----------

async function getContent(env: Env) {
  const rows = await env.DB.prepare('SELECT key, data, updated_at FROM content ORDER BY key').all<{
    key: string
    data: string
    updated_at: string
  }>()
  const items = rows.results.map((r) => ({ key: r.key, data: JSON.parse(r.data), updated_at: r.updated_at }))
  const version = items.reduce((v, r) => (r.updated_at > v ? r.updated_at : v), '')
  return json({ items, version, count: items.length })
}

async function putContent(req: Request, env: Env) {
  const admin = await requireAdmin(req, env)
  const { key, data } = await readJson<{ key: string; data: Record<string, unknown> }>(req)
  if (typeof key !== 'string' || !CONTENT_KEY.test(key)) throw new HttpError(400, 'Bad content key')
  if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new HttpError(400, 'Bad content data')
  const text = JSON.stringify(data)
  if (text.length > 60_000) throw new HttpError(413, 'Content too large')
  const t = now()
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO content (key, data, updated_by, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET data=excluded.data, updated_by=excluded.updated_by, updated_at=excluded.updated_at`,
    ).bind(key, text, admin.email, t),
    env.DB.prepare('INSERT INTO content_history (key, data, changed_by, changed_at) VALUES (?, ?, ?, ?)').bind(key, text, admin.email, t),
  ])
  return json({ ok: true, updated_at: t })
}

async function deleteContent(req: Request, env: Env, url: URL) {
  const admin = await requireAdmin(req, env)
  const key = url.searchParams.get('key') ?? ''
  if (!CONTENT_KEY.test(key)) throw new HttpError(400, 'Bad content key')
  await env.DB.batch([
    env.DB.prepare('DELETE FROM content WHERE key = ?').bind(key),
    env.DB.prepare('INSERT INTO content_history (key, data, changed_by, changed_at) VALUES (?, NULL, ?, ?)').bind(key, admin.email, now()),
  ])
  return json({ ok: true })
}

async function contentHistory(req: Request, env: Env, url: URL) {
  await requireAdmin(req, env)
  const key = url.searchParams.get('key')
  const rows = key
    ? await env.DB.prepare('SELECT id, key, data, changed_by, changed_at FROM content_history WHERE key = ? ORDER BY id DESC LIMIT 50').bind(key).all()
    : await env.DB.prepare('SELECT id, key, data, changed_by, changed_at FROM content_history ORDER BY id DESC LIMIT 100').all()
  return json({ items: rows.results })
}

// ---------- admins ----------

async function listAdmins(req: Request, env: Env) {
  await requireAdmin(req, env)
  const rows = await env.DB.prepare('SELECT email, added_by, added_at FROM admins ORDER BY added_at').all<{ email: string; added_by: string; added_at: string }>()
  const owner = env.OWNER_EMAIL.toLowerCase()
  const list = rows.results.map((r) => ({ ...r, owner: r.email === owner }))
  if (!list.some((a) => a.owner)) list.unshift({ email: owner, added_by: 'system', added_at: '', owner: true })
  return json({ items: list })
}

async function addAdmin(req: Request, env: Env) {
  const admin = await requireAdmin(req, env)
  const { email } = await readJson<{ email: string }>(req)
  const e = String(email ?? '').trim().toLowerCase()
  if (!EMAIL.test(e)) throw new HttpError(400, 'That does not look like an email address')
  await env.DB.prepare('INSERT OR IGNORE INTO admins (email, added_by, added_at) VALUES (?, ?, ?)').bind(e, admin.email, now()).run()
  return json({ ok: true })
}

async function removeAdmin(req: Request, env: Env, url: URL) {
  const admin = await requireAdmin(req, env)
  const e = (url.searchParams.get('email') ?? '').toLowerCase()
  if (e === env.OWNER_EMAIL.toLowerCase()) throw new HttpError(400, 'The owner is always an admin')
  if (e === admin.email) throw new HttpError(400, 'You cannot remove yourself')
  await env.DB.prepare('DELETE FROM admins WHERE email = ?').bind(e).run()
  return json({ ok: true })
}

// ---------- feedback ----------

async function postFeedback(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const { kind, mood, body } = await readJson<{ kind: string; mood?: string; body: string }>(req)
  const text = String(body ?? '').trim()
  if (!text) throw new HttpError(400, 'Feedback is empty')
  if (text.length > 5000) throw new HttpError(413, 'Feedback is too long')
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM feedback WHERE user_sub = ? AND created_at > ?')
    .bind(u.sub, new Date(Date.now() - 3600_000).toISOString())
    .first<{ n: number }>()
  if ((recent?.n ?? 0) >= 20) throw new HttpError(429, 'Thanks! That is plenty for this hour.')
  await env.DB.prepare('INSERT INTO feedback (user_sub, email, name, kind, mood, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(u.sub, u.email, u.name, String(kind ?? 'Other').slice(0, 40), mood ? String(mood).slice(0, 8) : null, text, now())
    .run()
  return json({ ok: true })
}

async function listFeedback(req: Request, env: Env) {
  await requireAdmin(req, env)
  const rows = await env.DB.prepare('SELECT * FROM feedback ORDER BY resolved, id DESC LIMIT 200').all()
  return json({ items: rows.results })
}

async function resolveFeedback(req: Request, env: Env) {
  await requireAdmin(req, env)
  const { id, resolved } = await readJson<{ id: number; resolved: boolean }>(req)
  await env.DB.prepare('UPDATE feedback SET resolved = ? WHERE id = ?').bind(resolved ? 1 : 0, Number(id)).run()
  return json({ ok: true })
}

// ---------- router ----------

async function route(req: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname
  const m = req.method

  if (p === '/api/auth/google' && m === 'POST') {
    const { credential } = await readJson<{ credential: string }>(req)
    return json(await startSession(env, await verifyGoogleToken(String(credential ?? ''), env.GOOGLE_CLIENT_ID)))
  }
  if (p === '/api/auth/dev' && m === 'POST') {
    // Local testing only: DEV_AUTH=1 comes from .dev.vars, which `wrangler dev` reads and `wrangler deploy`
    // never uploads, so this route does not exist in production.
    if (env.DEV_AUTH !== '1') throw new HttpError(404, 'Not found')
    const { email, name } = await readJson<{ email: string; name?: string }>(req)
    const e = String(email).toLowerCase()
    return json(await startSession(env, { sub: `dev:${e}`, email: e, name: name ?? 'Dev', picture: null }))
  }
  if (p === '/api/auth/logout' && m === 'POST') {
    const tok = /^Bearer (.+)$/.exec(req.headers.get('authorization') ?? '')?.[1]
    if (tok) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(tok)).run()
    return json({ ok: true })
  }
  if (p === '/api/me' && m === 'GET') {
    const u = await currentUser(req, env)
    return json({ user: u, isAdmin: await isAdmin(env, u.email) })
  }
  if (p === '/api/sync' && m === 'POST') return sync(req, env)
  if (p === '/api/content' && m === 'GET') return getContent(env)
  if (p === '/api/feedback' && m === 'POST') return postFeedback(req, env)

  if (p === '/api/admin/content' && m === 'PUT') return putContent(req, env)
  if (p === '/api/admin/content' && m === 'DELETE') return deleteContent(req, env, url)
  if (p === '/api/admin/history' && m === 'GET') return contentHistory(req, env, url)
  if (p === '/api/admin/admins' && m === 'GET') return listAdmins(req, env)
  if (p === '/api/admin/admins' && m === 'POST') return addAdmin(req, env)
  if (p === '/api/admin/admins' && m === 'DELETE') return removeAdmin(req, env, url)
  if (p === '/api/admin/feedback' && m === 'GET') return listFeedback(req, env)
  if (p === '/api/admin/feedback' && m === 'POST') return resolveFeedback(req, env)

  throw new HttpError(404, 'Not found')
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    // One address for everyone: Google sign-in only works on origins registered in Google Cloud,
    // so send the bare domain to www.
    if (url.hostname === 'aplearning.app') {
      url.hostname = 'www.aplearning.app'
      return Response.redirect(url.toString(), 301)
    }
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req)
    try {
      return await route(req, env, url)
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status)
      console.error(e)
      return json({ error: 'Something went wrong on the server' }, 500)
    }
  },
} satisfies ExportedHandler<Env>
