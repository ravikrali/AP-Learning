// "Sign in with Google" using Google Identity Services.
// The Google ID token is checked by our server (/api/auth/google), which returns a session
// token used for syncing. If the server can't be reached, sign-in still works on this device
// and sync starts after the next sign-in.

import { signupTags } from './visit'

export interface User {
  sub: string
  email: string
  name: string
  picture?: string
  guest?: boolean
  /** session token from our server; missing = this device isn't syncing */
  token?: string
  isAdmin?: boolean
}

interface GoogleId {
  initialize(cfg: {
    client_id: string
    callback: (r: { credential: string }) => void
    auto_select?: boolean
    use_fedcm_for_prompt?: boolean
  }): void
  renderButton(el: HTMLElement, opts: Record<string, unknown>): void
  disableAutoSelect(): void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } }
  }
}

export const GOOGLE_CLIENT_ID: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined
const SESSION_KEY = 'ap-learning-session'

export function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function saveSession(u: User) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(u))
  } catch {
    /* private mode: session lasts until tab closes */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  window.google?.accounts.id.disableAutoSelect()
}

function decodeJwt(token: string): Record<string, unknown> {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(payload)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(''),
  )
  return JSON.parse(json)
}

let scriptPromise: Promise<void> | null = null
function loadGsi(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://accounts.google.com/gsi/client'
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => {
        scriptPromise = null
        reject(new Error('Could not reach Google. Check your internet connection.'))
      }
      document.head.appendChild(s)
    })
  }
  return scriptPromise
}

// ---------- the age question at sign-up ----------

const AGE_BLOCK_KEY = 'ap-learning-age-block'
const AGE_BLOCK_DAYS = 30

/** True when this browser was recently told the app is not open to under-13s (so the answer can't simply be changed). */
export function ageBlocked(): boolean {
  try {
    const until = Number(localStorage.getItem(AGE_BLOCK_KEY) ?? 0)
    return until > Date.now()
  } catch {
    return false
  }
}

function markAgeBlocked() {
  try {
    localStorage.setItem(AGE_BLOCK_KEY, String(Date.now() + AGE_BLOCK_DAYS * 86400_000))
  } catch {
    /* private mode */
  }
}

export interface Birth {
  year: number
  month: number
}

export interface SignInOptions {
  /** Ask a new student when they were born; resolve null if they close the question. */
  askAge?: () => Promise<Birth | null>
  /** The student is under 13: no account was made. */
  onBlocked?: () => void
}

/**
 * Ask our server for a session. A new student is asked their age on the way; the account is
 * only made once we know they are old enough.
 * Returns the session, null when the server can't be reached, or 'stop' when there must be no
 * sign-in at all (under 13, or the age question was closed).
 */
async function serverSignIn(path: string, proof: Record<string, unknown>, opts: SignInOptions): Promise<{ token: string; isAdmin?: boolean } | null | 'stop'> {
  type Reply = { token?: string; isAdmin?: boolean; needAge?: boolean; underAge?: boolean }
  const send = async (birth?: Birth) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...proof, utm: signupTags(), birthYear: birth?.year, birthMonth: birth?.month }),
    })
    return { res, d: (await res.json().catch(() => ({}))) as Reply }
  }
  try {
    let { res, d } = await send()
    if (res.ok && d.needAge) {
      const birth = (await opts.askAge?.()) ?? null
      if (!birth) return 'stop'
      ;({ res, d } = await send(birth))
    }
    if (res.status === 403 && d.underAge) {
      markAgeBlocked()
      opts.onBlocked?.()
      return 'stop'
    }
    return res.ok && d.token ? { token: d.token, isAdmin: d.isAdmin } : null
  } catch {
    return null
  }
}

/** Local testing only (the server route exists only with DEV_AUTH=1): sign in as any email, through the same steps as Google sign-in. */
export async function devSignIn(email: string, onUser: (u: User) => void, opts: SignInOptions = {}) {
  const session = await serverSignIn('/api/auth/dev', { email, name: email.split('@')[0] }, opts)
  if (!session || session === 'stop') return
  const user: User = { sub: `dev:${email.toLowerCase()}`, email, name: email.split('@')[0], ...session }
  saveSession(user)
  onUser(user)
}

export async function renderGoogleButton(el: HTMLElement, onUser: (u: User) => void, opts: SignInOptions = {}) {
  if (!GOOGLE_CLIENT_ID) throw new Error('Google sign-in is not configured yet (missing VITE_GOOGLE_CLIENT_ID).')
  await loadGsi()
  const gid = window.google!.accounts.id
  gid.initialize({
    client_id: GOOGLE_CLIENT_ID,
    use_fedcm_for_prompt: true,
    callback: async ({ credential }) => {
      const p = decodeJwt(credential)
      let user: User = {
        sub: String(p.sub),
        email: String(p.email),
        name: String(p.given_name ?? p.name ?? p.email),
        picture: typeof p.picture === 'string' ? p.picture : undefined,
      }
      const session = await serverSignIn('/api/auth/google', { credential }, opts)
      if (session === 'stop') {
        gid.disableAutoSelect()
        return
      }
      // no session = the server could not be reached: sign in locally, sync after the next sign-in
      if (session) user = { ...user, ...session }
      saveSession(user)
      onUser(user)
    },
  })
  gid.renderButton(el, { theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', width: 280 })
}
