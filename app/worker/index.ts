// AP Learning backend: Google sign-in → session, cross-device sync, subscriptions (Stripe),
// learning statistics, calendar feeds, admin content editing, admin dashboard, feedback,
// and anonymous visitor counts for the welcome page.
// Everything that is not /api/* is the static app, served from ./dist by the ASSETS binding;
// on admin.* hosts the admin portal (admin.html) is served instead.

import { isTelemetry, KEY_PATTERN, maxItemSize, mergeItem, type SyncItem } from '../shared/sync'
import { CATALOG_IDS, checkPickChange, PLANS, trimPicks, type PlanId } from '../shared/catalog'
import { planToIcs, type StudyPlan } from '../shared/plan'
import { channelOf, hostOf, VID_PATTERN, VISIT_EVENTS, type VisitBody } from '../shared/visit'
import { PAID_STATUSES, priceId, readSubscription, stripe, StripeError, verifyStripeSignature, type StripeEnv } from './stripe'

interface Env extends StripeEnv {
  DB: D1Database
  ASSETS: Fetcher
  GOOGLE_CLIENT_ID: string
  OWNER_EMAIL: string
  /** main app address, e.g. https://www.aplearning.app (used for links in emails, calendars, Stripe) */
  APP_URL?: string
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
const CONTENT_KEY = /^(video|yt|card|check|flash|lesson):[\w.\-]{1,60}(:\d{1,3})?$/
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

async function startSession(env: Env, u: User, req: Request) {
  const t = now()
  const cf = (req as Request & { cf?: { country?: string; region?: string } }).cf
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (sub, email, name, picture, created_at, last_seen, country, region) VALUES (?1, ?2, ?3, ?4, ?5, ?5, ?6, ?7)
       ON CONFLICT(sub) DO UPDATE SET email=excluded.email, name=excluded.name, picture=excluded.picture, last_seen=excluded.last_seen,
         country=COALESCE(users.country, excluded.country), region=COALESCE(users.region, excluded.region)`,
    ).bind(u.sub, u.email, u.name, u.picture, t, cf?.country ?? null, cf?.region ?? null),
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

const day = (iso: unknown) => (typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : now().slice(0, 10))
const str = (x: unknown, max = 80) => (typeof x === 'string' && x ? x.slice(0, max) : null)
const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) ? x : 0)

/** Running totals for the statistics tables, filled while a sync is processed. */
class Stats {
  daily = new Map<string, { seconds: number; attempts: number; correct: number; lessons: number }>()
  topic = new Map<string, { course: string | null; seconds: number; attempts: number; ftc: number; wrong: number; tips: number; at: string }>()
  events = new Map<string, number>()

  user(d: string) {
    let x = this.daily.get(d)
    if (!x) this.daily.set(d, (x = { seconds: 0, attempts: 0, correct: 0, lessons: 0 }))
    return x
  }
  lesson(id: string, course: string | null, at: string) {
    let x = this.topic.get(id)
    if (!x) this.topic.set(id, (x = { course, seconds: 0, attempts: 0, ftc: 0, wrong: 0, tips: 0, at }))
    if (at > x.at) x.at = at
    if (course) x.course = course
    return x
  }

  /** A new answer (ev:a item). */
  attempt(d: Record<string, unknown>) {
    const at = String(d.at ?? now())
    const ok = num(d.correct) === 1
    const u = this.user(day(at))
    u.attempts++
    if (ok) u.correct++
    const ctx = str(d.context) ?? ''
    const lesson = str(d.lesson) ?? (ctx.startsWith('checkpoint:') ? `unit:${ctx.slice(11)}` : ctx && !ctx.includes(':') ? ctx : null)
    if (!lesson) return
    const t = this.lesson(lesson, str(d.course, 20), at)
    t.attempts++
    if (ok && num(d.first_try) === 1) t.ftc++
    if (!ok) t.wrong++
  }

  /** An analytics upload (t:time or t:ev item). */
  telemetry(key: string, d: Record<string, unknown>) {
    const at = String(d.at ?? now())
    const lesson = str(d.lesson)
    const course = str(d.course, 20)
    if (key.startsWith('t:time:')) {
      const sec = Math.max(0, Math.min(num(d.s), 4 * 3600))
      this.user(day(at)).seconds += sec
      if (lesson) this.lesson(lesson, course, at).seconds += sec
    } else {
      const name = str(d.name, 40)
      if (!name || !/^[\w.-]+$/.test(name)) return
      const k = `${day(at)}|${name}|${course ?? ''}`
      this.events.set(k, (this.events.get(k) ?? 0) + 1)
      if (name === 'tip' && lesson) this.lesson(lesson, course, at).tips++
    }
  }

  statements(env: Env, sub: string): D1PreparedStatement[] {
    const out: D1PreparedStatement[] = []
    for (const [d, x] of this.daily)
      out.push(
        env.DB.prepare(
          `INSERT INTO daily_user (user_sub, day, seconds, attempts, correct, lessons_done) VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_sub, day) DO UPDATE SET seconds = seconds + excluded.seconds, attempts = attempts + excluded.attempts,
             correct = correct + excluded.correct, lessons_done = lessons_done + excluded.lessons_done`,
        ).bind(sub, d, Math.round(x.seconds), x.attempts, x.correct, x.lessons),
      )
    for (const [id, x] of this.topic)
      out.push(
        env.DB.prepare(
          `INSERT INTO topic_user (lesson_id, user_sub, course, seconds, attempts, first_try_correct, wrong, tips, last_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(lesson_id, user_sub) DO UPDATE SET course = COALESCE(excluded.course, course), seconds = seconds + excluded.seconds,
             attempts = attempts + excluded.attempts, first_try_correct = first_try_correct + excluded.first_try_correct,
             wrong = wrong + excluded.wrong, tips = tips + excluded.tips, last_at = MAX(COALESCE(last_at, ''), excluded.last_at)`,
        ).bind(id, sub, x.course, Math.round(x.seconds), x.attempts, x.ftc, x.wrong, x.tips, x.at),
      )
    for (const [k, n] of this.events) {
      const [d, name, course] = k.split('|')
      out.push(
        env.DB.prepare(
          `INSERT INTO event_daily (day, name, course, count) VALUES (?, ?, ?, ?)
           ON CONFLICT(day, name, course) DO UPDATE SET count = count + excluded.count`,
        ).bind(d, name, course, n),
      )
    }
    return out
  }
}

async function runBatches(env: Env, stmts: D1PreparedStatement[]) {
  const results: D1Result[] = []
  for (let i = 0; i < stmts.length; i += 100) results.push(...(await env.DB.batch(stmts.slice(i, i + 100))))
  return results
}

async function sync(req: Request, env: Env) {
  const user = await currentUser(req, env)
  const body = await readJson<{ since?: number; items?: SyncItem[] }>(req)
  const since = Number.isSafeInteger(body.since) && body.since! >= 0 ? body.since! : 0
  const incoming = Array.isArray(body.items) ? body.items : []
  if (incoming.length > 2000) throw new HttpError(413, 'Too many items in one sync')

  // Validate, and collapse duplicates of the same key within this request.
  const batch = new Map<string, SyncItem>()
  const telemetry: SyncItem[] = []
  for (const it of incoming) {
    if (!it || typeof it.key !== 'string' || !KEY_PATTERN.test(it.key)) throw new HttpError(400, `Bad item key`)
    if (typeof it.data !== 'object' || it.data === null || Array.isArray(it.data)) throw new HttpError(400, 'Bad item data')
    if (typeof it.updated_at !== 'string' || it.updated_at.length > 40) throw new HttpError(400, 'Bad item time')
    if (JSON.stringify(it.data).length > maxItemSize(it.key)) throw new HttpError(413, 'Item too large')
    if (isTelemetry(it.key)) {
      telemetry.push(it)
      continue
    }
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

  const stats = new Stats()
  const stmts: D1PreparedStatement[] = []
  const answers: (Record<string, unknown> | null)[] = [] // parallel to stmts: answers to count if newly inserted
  for (const it of batch.values()) {
    if (it.key.startsWith('ev:')) {
      stmts.push(
        env.DB.prepare('INSERT OR IGNORE INTO items (user_sub, key, data, updated_at) VALUES (?, ?, ?, ?)').bind(
          user.sub, it.key, JSON.stringify(it.data), it.updated_at,
        ),
      )
      answers.push(it.key.startsWith('ev:a:') ? it.data : null)
      continue
    }
    const old = stored.get(it.key)
    const winner = mergeItem(old, it)
    if (!winner) continue
    // REPLACE deletes and re-inserts, so the row gets a fresh seq and other devices will pull it.
    stmts.push(
      env.DB.prepare('INSERT OR REPLACE INTO items (user_sub, key, data, updated_at) VALUES (?, ?, ?, ?)').bind(
        user.sub, winner.key, JSON.stringify(winner.data), winner.updated_at,
      ),
    )
    answers.push(null)
    if (winner.key.startsWith('lesson:') && winner.data.status === 'done' && old?.data.status !== 'done')
      stats.user(day(winner.data.completed_at)).lessons++
  }
  const results = await runBatches(env, stmts)
  results.forEach((r, i) => {
    const a = answers[i]
    if (a && r.meta.changes > 0) stats.attempt(a)
  })

  // Analytics: count each upload once (its uid is remembered for 30 days); it is never stored or returned.
  if (telemetry.length) {
    const seen = await runBatches(
      env,
      telemetry.map((t) => env.DB.prepare('INSERT OR IGNORE INTO telemetry_ids (uid, at) VALUES (?, ?)').bind(t.key, now())),
    )
    seen.forEach((r, i) => r.meta.changes > 0 && stats.telemetry(telemetry[i].key, telemetry[i].data))
    if (Math.random() < 0.02)
      await env.DB.prepare('DELETE FROM telemetry_ids WHERE at < ?').bind(new Date(Date.now() - 30 * 86400_000).toISOString()).run()
  }
  await runBatches(env, stats.statements(env, user.sub))

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

/** This user's own per-topic statistics (all devices), for "tricky topics" and time spent. */
async function myInsights(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const rows = await env.DB.prepare(
    'SELECT lesson_id, seconds, attempts, first_try_correct, wrong, tips, last_at FROM topic_user WHERE user_sub = ?',
  )
    .bind(u.sub)
    .all()
  const week = await env.DB.prepare('SELECT day, seconds FROM daily_user WHERE user_sub = ? AND day >= ? ORDER BY day')
    .bind(u.sub, new Date(Date.now() - 35 * 86400_000).toISOString().slice(0, 10))
    .all()
  return json({ topics: rows.results, days: week.results })
}

// ---------- accounts & subscriptions ----------

interface AccountRow {
  user_sub: string
  plan: PlanId
  status: string
  comp_plan: PlanId | null
  stripe_customer: string | null
  stripe_subscription: string | null
  current_period_end: string | null
  cancel_at_period_end: number
  courses: string
  courses_switched_at: string | null
}

const RANK: Record<PlanId, number> = { free: 0, three: 1, all: 2 }
const better = (a: PlanId, b: PlanId | null) => (b && RANK[b] > RANK[a] ? b : a)

async function getAccount(env: Env, sub: string): Promise<AccountRow> {
  const row = await env.DB.prepare('SELECT * FROM accounts WHERE user_sub = ?').bind(sub).first<AccountRow>()
  return (
    row ?? {
      user_sub: sub, plan: 'free', status: 'none', comp_plan: null, stripe_customer: null, stripe_subscription: null,
      current_period_end: null, cancel_at_period_end: 0, courses: '[]', courses_switched_at: null,
    }
  )
}

/** The plan in force: the paid plan (while Stripe says it's paid) or an admin-granted plan, whichever is bigger. */
function effectivePlan(a: AccountRow): PlanId {
  return better(PAID_STATUSES.has(a.status) ? a.plan : 'free', a.comp_plan)
}

async function saveAccount(env: Env, a: AccountRow) {
  await env.DB.prepare(
    `INSERT INTO accounts (user_sub, plan, status, comp_plan, stripe_customer, stripe_subscription, current_period_end,
       cancel_at_period_end, courses, courses_switched_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_sub) DO UPDATE SET plan=excluded.plan, status=excluded.status, comp_plan=excluded.comp_plan,
       stripe_customer=excluded.stripe_customer, stripe_subscription=excluded.stripe_subscription,
       current_period_end=excluded.current_period_end, cancel_at_period_end=excluded.cancel_at_period_end,
       courses=excluded.courses, courses_switched_at=excluded.courses_switched_at, updated_at=excluded.updated_at`,
  )
    .bind(
      a.user_sub, a.plan, a.status, a.comp_plan, a.stripe_customer, a.stripe_subscription, a.current_period_end,
      a.cancel_at_period_end, a.courses, a.courses_switched_at, now(),
    )
    .run()
}

/** Save a change and log it when the plan in force changed; trims picked courses after a downgrade. */
async function updateAccount(env: Env, before: AccountRow, after: AccountRow) {
  const from = effectivePlan(before)
  const to = effectivePlan(after)
  if (RANK[to] < RANK[from]) after.courses = JSON.stringify(trimPicks(to, JSON.parse(after.courses)))
  await saveAccount(env, after)
  if (from !== to)
    await env.DB.prepare('INSERT INTO plan_changes (user_sub, from_plan, to_plan, at) VALUES (?, ?, ?, ?)')
      .bind(after.user_sub, from, to, now())
      .run()
}

async function accountView(env: Env, u: User) {
  const a = await getAccount(env, u.sub)
  const admin = await isAdmin(env, u.email)
  const interest = await env.DB.prepare('SELECT course_id FROM course_interest WHERE user_sub = ?').bind(u.sub).all<{ course_id: string }>()
  const plan = effectivePlan(a)
  const switchAt = a.courses_switched_at ? new Date(new Date(a.courses_switched_at).getTime() + 30 * 86400_000).toISOString() : null
  return {
    // admins can open every course so they can check content
    plan: admin ? 'all' : plan,
    ownPlan: plan,
    paidPlan: PAID_STATUSES.has(a.status) ? a.plan : 'free',
    compPlan: a.comp_plan,
    admin,
    status: a.status,
    courses: JSON.parse(a.courses) as string[],
    switchAvailableAt: switchAt && switchAt > now() ? switchAt : null,
    periodEnd: a.current_period_end,
    cancelAtPeriodEnd: !!a.cancel_at_period_end,
    billing: !!env.STRIPE_SECRET_KEY,
    interest: interest.results.map((r) => r.course_id),
  }
}

async function setCourses(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const { courses } = await readJson<{ courses: string[] }>(req)
  if (!Array.isArray(courses) || courses.some((c) => typeof c !== 'string')) throw new HttpError(400, 'Bad course list')
  const a = await getAccount(env, u.sub)
  const before = JSON.parse(a.courses) as string[]
  const plan = (await isAdmin(env, u.email)) ? 'all' : effectivePlan(a)
  const err = checkPickChange(plan, before, courses, a.courses_switched_at)
  if (err) throw new HttpError(400, err)
  const removed = before.some((c) => !courses.includes(c))
  await saveAccount(env, { ...a, courses: JSON.stringify(courses), courses_switched_at: removed && plan !== 'all' ? now() : a.courses_switched_at })
  return json(await accountView(env, u))
}

async function setInterest(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const { course, on } = await readJson<{ course: string; on: boolean }>(req)
  if (!CATALOG_IDS.has(course)) throw new HttpError(400, 'Unknown course')
  if (on) await env.DB.prepare('INSERT OR IGNORE INTO course_interest (user_sub, course_id, at) VALUES (?, ?, ?)').bind(u.sub, course, now()).run()
  else await env.DB.prepare('DELETE FROM course_interest WHERE user_sub = ? AND course_id = ?').bind(u.sub, course).run()
  return json({ ok: true })
}

const appUrl = (env: Env, req: Request) => env.APP_URL ?? new URL(req.url).origin

async function syncSubscription(env: Env, subscriptionId: string, userHint?: string) {
  const s = readSubscription(await stripe(env, 'GET', `subscriptions/${subscriptionId}`))
  let row = await env.DB.prepare('SELECT * FROM accounts WHERE stripe_customer = ?').bind(s.customer).first<AccountRow>()
  const sub = row?.user_sub ?? s.userSub ?? userHint
  if (!sub) return
  row = row ?? (await getAccount(env, sub))
  // a customer can only have one live subscription with us; ignore stale events about an older one
  if (row.stripe_subscription && row.stripe_subscription !== s.id && !PAID_STATUSES.has(s.status) && PAID_STATUSES.has(row.status)) return
  await updateAccount(env, row, {
    ...row,
    stripe_customer: s.customer,
    stripe_subscription: s.id,
    status: s.status,
    plan: s.plan ?? row.plan,
    current_period_end: s.periodEnd,
    cancel_at_period_end: s.cancelAtPeriodEnd ? 1 : 0,
  })
}

async function checkout(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const { plan } = await readJson<{ plan: PlanId }>(req)
  if (plan !== 'three' && plan !== 'all') throw new HttpError(400, 'Pick a paid plan')
  const a = await getAccount(env, u.sub)
  const base = appUrl(env, req)

  // Already paying: switch the existing subscription (prorated) instead of starting a second one.
  if (a.stripe_subscription && PAID_STATUSES.has(a.status)) {
    const s = readSubscription(await stripe(env, 'GET', `subscriptions/${a.stripe_subscription}`))
    await stripe(env, 'POST', `subscriptions/${s.id}`, {
      items: [{ id: s.itemId, price: await priceId(env, plan) }],
      proration_behavior: 'create_prorations',
      cancel_at_period_end: 'false',
      metadata: { plan, user_sub: u.sub },
    })
    await syncSubscription(env, s.id, u.sub)
    return json({ changed: true, account: await accountView(env, u) })
  }

  const session = await stripe<{ url: string }>(env, 'POST', 'checkout/sessions', {
    mode: 'subscription',
    line_items: [{ price: await priceId(env, plan), quantity: 1 }],
    client_reference_id: u.sub,
    ...(a.stripe_customer ? { customer: a.stripe_customer } : { customer_email: u.email }),
    subscription_data: { metadata: { plan, user_sub: u.sub } },
    metadata: { user_sub: u.sub, plan },
    allow_promotion_codes: 'true',
    success_url: `${base}/#/plans?checkout=done`,
    cancel_url: `${base}/#/plans?checkout=cancelled`,
  })
  return json({ url: session.url })
}

async function billingPortal(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const a = await getAccount(env, u.sub)
  if (!a.stripe_customer) throw new HttpError(400, 'No billing account yet')
  const s = await stripe<{ url: string }>(env, 'POST', 'billing_portal/sessions', {
    customer: a.stripe_customer,
    return_url: `${appUrl(env, req)}/#/plans`,
  })
  return json({ url: s.url })
}

/** Cancel at the end of the paid month (or undo that). */
async function cancelPlan(req: Request, env: Env) {
  const u = await currentUser(req, env)
  const { resume } = await readJson<{ resume?: boolean }>(req)
  const a = await getAccount(env, u.sub)
  if (!a.stripe_subscription) throw new HttpError(400, 'No subscription')
  await stripe(env, 'POST', `subscriptions/${a.stripe_subscription}`, { cancel_at_period_end: resume ? 'false' : 'true' })
  await syncSubscription(env, a.stripe_subscription, u.sub)
  return json(await accountView(env, u))
}

async function stripeWebhook(req: Request, env: Env) {
  if (!env.STRIPE_WEBHOOK_SECRET) throw new HttpError(503, 'Payments are not set up yet')
  const payload = await req.text()
  if (!(await verifyStripeSignature(payload, req.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET)))
    throw new HttpError(400, 'Bad signature')
  const ev = JSON.parse(payload) as { id: string; type: string; data: { object: Record<string, unknown> } }
  const fresh = await env.DB.prepare('INSERT OR IGNORE INTO stripe_events (id, type, received_at) VALUES (?, ?, ?)').bind(ev.id, ev.type, now()).run()
  if (!fresh.meta.changes) return json({ ok: true, duplicate: true })
  const o = ev.data.object
  try {
    if (ev.type === 'checkout.session.completed' && o.mode === 'subscription' && o.subscription) {
      const sub = String(o.client_reference_id ?? (o.metadata as Record<string, string> | undefined)?.user_sub ?? '')
      if (sub) {
        const a = await getAccount(env, sub)
        await saveAccount(env, { ...a, stripe_customer: String(o.customer) })
      }
      await syncSubscription(env, String(o.subscription), sub || undefined)
    } else if (ev.type.startsWith('customer.subscription.')) {
      await syncSubscription(env, String(o.id))
    } else if (ev.type === 'invoice.paid' || ev.type === 'invoice.payment_succeeded') {
      const row = await env.DB.prepare('SELECT user_sub, plan FROM accounts WHERE stripe_customer = ?').bind(String(o.customer)).first<{ user_sub: string; plan: string }>()
      const paidAt = Number((o.status_transitions as Record<string, number> | undefined)?.paid_at ?? o.created ?? Date.now() / 1000)
      if (num(o.amount_paid) > 0)
        await env.DB.prepare('INSERT OR IGNORE INTO payments (id, user_sub, plan, amount, currency, paid_at) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(String(o.id), row?.user_sub ?? null, row?.plan ?? null, num(o.amount_paid), String(o.currency ?? 'usd'), new Date(paidAt * 1000).toISOString())
          .run()
    }
  } catch (e) {
    // let Stripe retry later
    await env.DB.prepare('DELETE FROM stripe_events WHERE id = ?').bind(ev.id).run()
    throw e
  }
  return json({ ok: true })
}

// ---------- calendar feed ----------

async function calendarLink(req: Request, env: Env, reset: boolean) {
  const u = await currentUser(req, env)
  let row = reset ? null : await env.DB.prepare('SELECT token FROM calendar_tokens WHERE user_sub = ?').bind(u.sub).first<{ token: string }>()
  if (!row) {
    const token = bytesToB64url(crypto.getRandomValues(new Uint8Array(18)))
    await env.DB.prepare('INSERT OR REPLACE INTO calendar_tokens (token, user_sub, created_at) VALUES (?, ?, ?)').bind(token, u.sub, now()).run()
    row = { token }
  }
  const base = new URL(appUrl(env, req))
  return json({ url: `${base.origin}/api/cal/${row.token}.ics` })
}

async function calendarFeed(env: Env, req: Request, token: string) {
  const row = await env.DB.prepare('SELECT user_sub FROM calendar_tokens WHERE token = ?').bind(token).first<{ user_sub: string }>()
  if (!row) return new Response('Calendar link not found. Make a new one in AP Learning.', { status: 404 })
  const plans = await env.DB.prepare("SELECT data FROM items WHERE user_sub = ? AND key LIKE 'plan:%'").bind(row.user_sub).all<{ data: string }>()
  const list = plans.results.map((r) => JSON.parse(r.data) as StudyPlan).filter((p) => Array.isArray(p.sessions) && !('deleted' in p))
  const ics = planToIcs(list, { baseUrl: appUrl(env, req) })
  return new Response(ics, {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': 'inline; filename="ap-learning.ics"',
      'cache-control': 'max-age=900',
    },
  })
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

// ---------- visitors who have not signed in (welcome page) ----------

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|facebookexternalhit|whatsapp|python|curl|wget/i
const cfOf = (req: Request) => (req as Request & { cf?: { country?: string; region?: string } }).cf

/** Count one welcome-page event. Anonymous: a random browser ID, no name, email or IP address is stored. */
async function recordVisit(req: Request, env: Env) {
  const text = await req.text()
  if (text.length > 2000) throw new HttpError(413, 'Request too large')
  let b: VisitBody
  try {
    b = JSON.parse(text) as VisitBody
  } catch {
    throw new HttpError(400, 'Invalid JSON')
  }
  if (!b || typeof b.vid !== 'string' || !VID_PATTERN.test(b.vid)) throw new HttpError(400, 'Bad visitor')
  if (!(VISIT_EVENTS as readonly string[]).includes(b.event)) throw new HttpError(400, 'Bad event')
  // crawlers and link previews are not people
  if (BOT.test(req.headers.get('user-agent') ?? '')) return json({ ok: true })

  const t = now()
  const cf = cfOf(req)
  const referrer = hostOf(str(b.referrer, 120)) || null
  const source = str(b.source, 80) ?? referrer
  const medium = str(b.medium, 80)
  const device = b.device === 'phone' || b.device === 'tablet' || b.device === 'desktop' ? b.device : null
  const stmts = [
    // attribution is first-touch: later visits never overwrite where the visitor first came from
    env.DB.prepare(
      `INSERT INTO visitors (vid, first_seen, last_seen, visits, country, region, channel, source, medium, campaign, referrer, device, lang)
       VALUES (?1, ?2, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
       ON CONFLICT(vid) DO UPDATE SET last_seen = excluded.last_seen, visits = visitors.visits + excluded.visits,
         country = COALESCE(visitors.country, excluded.country), region = COALESCE(visitors.region, excluded.region),
         device = COALESCE(excluded.device, visitors.device)`,
    ).bind(
      b.vid, t, b.event === 'view' ? 1 : 0, cf?.country ?? null, cf?.region ?? null,
      channelOf({ source: str(b.source, 80), medium, referrer }), source, medium, str(b.campaign, 80), referrer, device, str(b.lang, 12),
    ),
    env.DB.prepare(
      'INSERT INTO visit_events (day, vid, event, n) VALUES (?, ?, ?, 1) ON CONFLICT(day, vid, event) DO UPDATE SET n = MIN(visit_events.n + 1, 1000)',
    ).bind(t.slice(0, 10), b.vid, b.event),
  ]
  if (b.event === 'signin') {
    // the browser just signed in: remember which account this visitor became
    const u = await currentUser(req, env).catch(() => null)
    if (u) stmts.push(env.DB.prepare('UPDATE visitors SET user_sub = ?, signed_in_at = COALESCE(signed_in_at, ?) WHERE vid = ?').bind(u.sub, t, b.vid))
  }
  if (Math.random() < 0.01) stmts.push(env.DB.prepare('DELETE FROM visit_events WHERE day < ?').bind(daysAgo(400)))
  await env.DB.batch(stmts)
  return json({ ok: true })
}

/** "Tell me when my course is ready": an email typed into the welcome page. */
async function recordLead(req: Request, env: Env) {
  const text = await req.text()
  if (text.length > 2000) throw new HttpError(413, 'Request too large')
  let b: { email?: string; name?: string; course?: string; vid?: string }
  try {
    b = JSON.parse(text)
  } catch {
    throw new HttpError(400, 'Invalid JSON')
  }
  const email = String(b.email ?? '').trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 254) throw new HttpError(400, 'That email address does not look right.')
  const course = typeof b.course === 'string' && CATALOG_IDS.has(b.course) ? b.course : null
  const vid = typeof b.vid === 'string' && VID_PATTERN.test(b.vid) ? b.vid : null
  const t = now()
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE created_at > ?').bind(new Date(Date.now() - 3600_000).toISOString()).first<{ n: number }>()
  if ((recent?.n ?? 0) >= 300) throw new HttpError(429, 'Too many sign-ups right now. Please try again later.')
  const v = vid ? await env.DB.prepare('SELECT channel, source FROM visitors WHERE vid = ?').bind(vid).first<{ channel: string; source: string | null }>() : null
  await env.DB.prepare(
    `INSERT INTO leads (email, name, course, vid, country, channel, source, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)
     ON CONFLICT(email) DO UPDATE SET name = COALESCE(excluded.name, leads.name), course = COALESCE(excluded.course, leads.course), updated_at = excluded.updated_at`,
  )
    .bind(email, str(String(b.name ?? '').trim(), 80), course, vid, cfOf(req)?.country ?? null, v?.channel ?? null, v?.source ?? null, t)
    .run()
  return json({ ok: true })
}

// ---------- admin dashboard ----------

const daysAgo = (n: number) => new Date(Date.now() - n * 86400_000).toISOString().slice(0, 10)

// Plan in force per user (same rule as effectivePlan, in SQL).
const PLAN_SQL = `CASE
    WHEN a.comp_plan = 'all' OR (a.plan = 'all' AND a.status IN ('active','trialing','past_due')) THEN 'all'
    WHEN a.comp_plan = 'three' OR (a.plan = 'three' AND a.status IN ('active','trialing','past_due')) THEN 'three'
    ELSE 'free' END`

/** Admin: visitors who have not signed in, where they come from, the welcome-page funnel, leads, and students on the free plan. */
async function audience(req: Request, env: Env) {
  await requireAdmin(req, env)
  const q = <T>(sql: string, ...args: unknown[]) =>
    env.DB.prepare(sql)
      .bind(...args)
      .all<T>()
      .then((r) => r.results)
  const one = async <T>(sql: string, ...args: unknown[]) => (await q<T>(sql, ...args))[0]
  const since = daysAgo(89)
  const group = (col: string) =>
    q<{ label: string | null; visitors: number; anonymous: number; signed: number }>(
      `SELECT ${col} AS label, COUNT(*) AS visitors, SUM(user_sub IS NULL) AS anonymous, SUM(user_sub IS NOT NULL) AS signed
       FROM visitors WHERE last_seen >= ? GROUP BY 1 ORDER BY 2 DESC LIMIT 25`,
      since,
    )
  const [totals, byDay, byCountry, byRegion, byChannel, bySource, byCampaign, byDevice, byLang, funnel, leads, leadCount, free, freeByCountry, freeActive] = await Promise.all([
    one<{ all_time: number; d30: number; d7: number; anon30: number; signed30: number; returning30: number }>(
      `SELECT COUNT(*) AS all_time, SUM(last_seen >= ?1) AS d30, SUM(last_seen >= ?2) AS d7,
              SUM(last_seen >= ?1 AND user_sub IS NULL) AS anon30, SUM(last_seen >= ?1 AND user_sub IS NOT NULL) AS signed30,
              SUM(last_seen >= ?1 AND visits >= 2) AS returning30
       FROM visitors`,
      daysAgo(29), daysAgo(6),
    ),
    q<{ day: string; visitors: number; signins: number; leads: number }>(
      `SELECT day, COUNT(DISTINCT CASE WHEN event = 'view' THEN vid END) AS visitors,
              COUNT(DISTINCT CASE WHEN event = 'signin' THEN vid END) AS signins,
              COUNT(DISTINCT CASE WHEN event = 'lead' THEN vid END) AS leads
       FROM visit_events WHERE day >= ? GROUP BY day ORDER BY day`,
      daysAgo(59),
    ),
    group("COALESCE(country, '??')"),
    q<{ country: string; region: string; visitors: number }>(
      `SELECT country, region, COUNT(*) AS visitors FROM visitors
       WHERE last_seen >= ? AND user_sub IS NULL AND region IS NOT NULL AND region != '' GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 12`,
      since,
    ),
    group('channel'),
    group("COALESCE(source, '(direct)')"),
    group('campaign'),
    group("COALESCE(device, 'unknown')"),
    group("COALESCE(substr(lang, 1, 2), '??')"),
    q<{ event: string; visitors: number }>('SELECT event, COUNT(DISTINCT vid) AS visitors FROM visit_events WHERE day >= ? GROUP BY 1', daysAgo(29)),
    q<{ email: string; name: string | null; course: string | null; country: string | null; channel: string | null; source: string | null; created_at: string; signed_up: number }>(
      `SELECT l.email, l.name, l.course, l.country, l.channel, l.source, l.created_at,
              EXISTS (SELECT 1 FROM users u WHERE u.email = l.email) AS signed_up
       FROM leads l ORDER BY l.created_at DESC LIMIT 1000`,
    ),
    one<{ n: number; d30: number }>('SELECT COUNT(*) AS n, SUM(created_at >= ?) AS d30 FROM leads', daysAgo(29)),
    one<{ n: number; new30: number }>(
      `SELECT COUNT(*) AS n, SUM(u.created_at >= ?) AS new30 FROM users u LEFT JOIN accounts a ON a.user_sub = u.sub WHERE ${PLAN_SQL} = 'free'`,
      daysAgo(29),
    ),
    q<{ country: string; n: number }>(
      `SELECT COALESCE(u.country, '??') AS country, COUNT(*) AS n FROM users u LEFT JOIN accounts a ON a.user_sub = u.sub
       WHERE ${PLAN_SQL} = 'free' GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
    ),
    one<{ wau: number; mau: number; minutes30: number | null; lessons30: number | null }>(
      `SELECT COUNT(DISTINCT CASE WHEN d.day >= ?1 THEN d.user_sub END) AS wau, COUNT(DISTINCT d.user_sub) AS mau,
              SUM(d.seconds) / 60.0 AS minutes30, SUM(d.lessons_done) AS lessons30
       FROM daily_user d LEFT JOIN accounts a ON a.user_sub = d.user_sub
       WHERE d.day >= ?2 AND (d.seconds > 0 OR d.attempts > 0 OR d.lessons_done > 0) AND ${PLAN_SQL} = 'free'`,
      daysAgo(6), daysAgo(29),
    ),
  ])
  return json({
    generatedAt: now(),
    visitors: { ...totals, byDay, byCountry, byRegion, byChannel, bySource, byCampaign: byCampaign.filter((c) => c.label), byDevice, byLang, funnel },
    leads: { total: leadCount?.n ?? 0, d30: leadCount?.d30 ?? 0, items: leads },
    free: { ...free, ...freeActive, byCountry: freeByCountry },
  })
}

async function metrics(req: Request, env: Env) {
  await requireAdmin(req, env)
  const q = <T>(sql: string, ...args: unknown[]) =>
    env.DB.prepare(sql)
      .bind(...args)
      .all<T>()
      .then((r) => r.results)
  const one = async <T>(sql: string, ...args: unknown[]) => (await q<T>(sql, ...args))[0]

  const planSql = PLAN_SQL
  const paidSql = `CASE WHEN a.status IN ('active','trialing','past_due') THEN a.plan ELSE 'free' END`

  const [
    totals, signups, byCountry, byPlan, subsByCountry, changes, revenue, active, activeByDay, topics, picks, interest, events, regions,
  ] = await Promise.all([
    one<{ users: number; new7: number; new30: number }>(
      'SELECT COUNT(*) AS users, SUM(created_at >= ?) AS new7, SUM(created_at >= ?) AS new30 FROM users', daysAgo(7), daysAgo(30),
    ),
    q<{ day: string; n: number }>('SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n FROM users WHERE created_at >= ? GROUP BY 1 ORDER BY 1', daysAgo(89)),
    q<{ country: string; n: number }>("SELECT COALESCE(country, '??') AS country, COUNT(*) AS n FROM users GROUP BY 1 ORDER BY 2 DESC LIMIT 30"),
    q<{ plan: string; paid: string; n: number }>(
      `SELECT ${planSql} AS plan, ${paidSql} AS paid, COUNT(*) AS n FROM users u LEFT JOIN accounts a ON a.user_sub = u.sub GROUP BY 1, 2`,
    ),
    q<{ country: string; plan: string; n: number }>(
      `SELECT COALESCE(u.country, '??') AS country, ${planSql} AS plan, COUNT(*) AS n
       FROM users u LEFT JOIN accounts a ON a.user_sub = u.sub GROUP BY 1, 2`,
    ),
    q<{ month: string; from_plan: string; to_plan: string; n: number }>(
      'SELECT substr(at, 1, 7) AS month, from_plan, to_plan, COUNT(*) AS n FROM plan_changes WHERE at >= ? GROUP BY 1, 2, 3 ORDER BY 1',
      daysAgo(400),
    ),
    q<{ month: string; amount: number; n: number }>(
      'SELECT substr(paid_at, 1, 7) AS month, SUM(amount) AS amount, COUNT(*) AS n FROM payments WHERE paid_at >= ? GROUP BY 1 ORDER BY 1',
      daysAgo(400),
    ),
    one<{ dau: number; wau: number; mau: number; minutes30: number; days30: number }>(
      `SELECT COUNT(DISTINCT CASE WHEN day >= ? THEN user_sub END) AS dau,
              COUNT(DISTINCT CASE WHEN day >= ? THEN user_sub END) AS wau,
              COUNT(DISTINCT user_sub) AS mau,
              SUM(seconds) / 60.0 AS minutes30,
              COUNT(*) AS days30
       FROM daily_user WHERE day >= ? AND (seconds > 0 OR attempts > 0 OR lessons_done > 0)`,
      daysAgo(0), daysAgo(6), daysAgo(29),
    ),
    q<{ day: string; users: number; minutes: number; lessons: number; attempts: number }>(
      `SELECT day, COUNT(*) AS users, SUM(seconds) / 60.0 AS minutes, SUM(lessons_done) AS lessons, SUM(attempts) AS attempts
       FROM daily_user WHERE day >= ? AND (seconds > 0 OR attempts > 0 OR lessons_done > 0) GROUP BY day ORDER BY day`,
      daysAgo(59),
    ),
    q<{ lesson_id: string; course: string | null; users: number; seconds: number; attempts: number; ftc: number; wrong: number; tips: number }>(
      `SELECT lesson_id, MAX(course) AS course, COUNT(*) AS users, SUM(seconds) AS seconds, SUM(attempts) AS attempts,
              SUM(first_try_correct) AS ftc, SUM(wrong) AS wrong, SUM(tips) AS tips
       FROM topic_user GROUP BY lesson_id ORDER BY attempts DESC LIMIT 400`,
    ),
    q<{ course: string; n: number }>(
      `SELECT j.value AS course, COUNT(*) AS n FROM accounts a, json_each(a.courses) j GROUP BY 1 ORDER BY 2 DESC`,
    ),
    q<{ course: string; n: number }>('SELECT course_id AS course, COUNT(*) AS n FROM course_interest GROUP BY 1 ORDER BY 2 DESC'),
    q<{ name: string; n: number }>('SELECT name, SUM(count) AS n FROM event_daily WHERE day >= ? GROUP BY 1 ORDER BY 2 DESC', daysAgo(29)),
    q<{ country: string; region: string; n: number }>(
      `SELECT u.country, COALESCE(u.region, '') AS region, COUNT(*) AS n FROM users u
       LEFT JOIN accounts a ON a.user_sub = u.sub WHERE ${planSql} != 'free' GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 20`,
    ),
  ])

  // Monthly recurring revenue now: paying subscriptions × list price (admin-granted plans are free).
  const mrr = byPlan.reduce((s, r) => s + (r.paid === 'free' ? 0 : r.n * Math.round(PLANS[r.paid as PlanId].price * 100)), 0)
  return json({
    generatedAt: now(),
    users: { ...totals, byDay: signups, byCountry },
    plans: { byPlan, byCountry: subsByCountry, changes, paidRegions: regions },
    revenue: { mrr, currency: 'usd', byMonth: revenue },
    engagement: { ...active, byDay: activeByDay, events },
    topics,
    courses: { picks, interest },
  })
}

async function listUsers(req: Request, env: Env, url: URL) {
  await requireAdmin(req, env)
  const term = `%${(url.searchParams.get('q') ?? '').trim().toLowerCase()}%`
  const rows = await env.DB.prepare(
    `SELECT u.sub, u.email, u.name, u.country, u.region, u.created_at, u.last_seen,
            a.plan, a.status, a.comp_plan, a.courses, a.current_period_end, a.cancel_at_period_end
     FROM users u LEFT JOIN accounts a ON a.user_sub = u.sub
     WHERE lower(u.email) LIKE ? OR lower(COALESCE(u.name, '')) LIKE ?
     ORDER BY u.last_seen DESC LIMIT 100`,
  )
    .bind(term, term)
    .all()
  return json({ items: rows.results })
}

/** Give someone a plan without payment (family, teachers, testers), or take it back. */
async function grantPlan(req: Request, env: Env) {
  await requireAdmin(req, env)
  const { sub, plan } = await readJson<{ sub: string; plan: PlanId | null }>(req)
  if (plan !== null && plan !== 'three' && plan !== 'all') throw new HttpError(400, 'Bad plan')
  const exists = await env.DB.prepare('SELECT 1 FROM users WHERE sub = ?').bind(String(sub)).first()
  if (!exists) throw new HttpError(404, 'No such user')
  const a = await getAccount(env, String(sub))
  await updateAccount(env, a, { ...a, comp_plan: plan })
  return json({ ok: true })
}

/** Look a YouTube video up (title and channel); fails for missing or private videos. */
async function youtubeInfo(req: Request, env: Env, url: URL) {
  await requireAdmin(req, env)
  const id = url.searchParams.get('id') ?? ''
  if (!/^[\w-]{11}$/.test(id)) throw new HttpError(400, 'Bad video id')
  const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`)
  if (res.status === 404 || res.status === 400) throw new HttpError(404, 'YouTube says this video does not exist or is private')
  if (!res.ok && res.status !== 401) throw new HttpError(502, 'Could not reach YouTube')
  // 401 = the owner turned off embedding; the video exists, and we only link to it
  const d = res.ok ? ((await res.json()) as { title?: string; author_name?: string }) : {}
  return json({ title: d.title ?? `YouTube video ${id}`, channel: d.author_name ?? '' })
}

// ---------- router ----------

async function route(req: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname
  const m = req.method

  if (p === '/api/auth/google' && m === 'POST') {
    const { credential } = await readJson<{ credential: string }>(req)
    return json(await startSession(env, await verifyGoogleToken(String(credential ?? ''), env.GOOGLE_CLIENT_ID), req))
  }
  if (p === '/api/auth/dev' && m === 'POST') {
    // Local testing only: DEV_AUTH=1 comes from .dev.vars, which `wrangler dev` reads and `wrangler deploy`
    // never uploads, so this route does not exist in production.
    if (env.DEV_AUTH !== '1') throw new HttpError(404, 'Not found')
    const { email, name } = await readJson<{ email: string; name?: string }>(req)
    const e = String(email).toLowerCase()
    return json(await startSession(env, { sub: `dev:${e}`, email: e, name: name ?? 'Dev', picture: null }, req))
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
  if (p === '/api/insights' && m === 'GET') return myInsights(req, env)
  if (p === '/api/content' && m === 'GET') return getContent(env)
  if (p === '/api/feedback' && m === 'POST') return postFeedback(req, env)
  if (p === '/api/visit' && m === 'POST') return recordVisit(req, env)
  if (p === '/api/lead' && m === 'POST') return recordLead(req, env)

  if (p === '/api/account' && m === 'GET') return json(await accountView(env, await currentUser(req, env)))
  if (p === '/api/account/courses' && m === 'POST') return setCourses(req, env)
  if (p === '/api/interest' && m === 'POST') return setInterest(req, env)
  if (p === '/api/billing/checkout' && m === 'POST') return checkout(req, env)
  if (p === '/api/billing/portal' && m === 'POST') return billingPortal(req, env)
  if (p === '/api/billing/cancel' && m === 'POST') return cancelPlan(req, env)
  if (p === '/api/billing/webhook' && m === 'POST') return stripeWebhook(req, env)
  if (p === '/api/calendar/link' && (m === 'GET' || m === 'POST')) return calendarLink(req, env, m === 'POST')
  const cal = /^\/api\/cal\/([\w-]{16,40})\.ics$/.exec(p)
  if (cal && m === 'GET') return calendarFeed(env, req, cal[1])

  if (p === '/api/admin/metrics' && m === 'GET') return metrics(req, env)
  if (p === '/api/admin/audience' && m === 'GET') return audience(req, env)
  if (p === '/api/admin/users' && m === 'GET') return listUsers(req, env, url)
  if (p === '/api/admin/users/plan' && m === 'POST') return grantPlan(req, env)
  if (p === '/api/admin/youtube' && m === 'GET') return youtubeInfo(req, env, url)

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
    if (!url.pathname.startsWith('/api/')) {
      // The admin portal lives at admin.<domain>; its page is admin.html, served at "/admin".
      if (url.hostname.startsWith('admin.') && (url.pathname === '/' || url.pathname === '/index.html'))
        return env.ASSETS.fetch(new Request(new URL('/admin', url), req))
      if (url.hostname === 'www.aplearning.app' && (url.pathname === '/admin' || url.pathname === '/admin.html'))
        return Response.redirect('https://admin.aplearning.app/', 302)
      return env.ASSETS.fetch(req)
    }
    try {
      return await route(req, env, url)
    } catch (e) {
      if (e instanceof HttpError || e instanceof StripeError) return json({ error: e.message }, e.status)
      console.error(e)
      return json({ error: 'Something went wrong on the server' }, 500)
    }
  },
} satisfies ExportedHandler<Env>
