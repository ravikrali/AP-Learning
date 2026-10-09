// "Sign in with Google" using Google Identity Services.
// The Google ID token is checked by our server (/api/auth/google), which returns a session
// token used for syncing. If the server can't be reached, sign-in still works on this device
// and sync starts after the next sign-in.

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

export async function renderGoogleButton(el: HTMLElement, onUser: (u: User) => void) {
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
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ credential }),
        })
        if (res.ok) {
          const d = (await res.json()) as { token: string; isAdmin: boolean }
          user = { ...user, token: d.token, isAdmin: d.isAdmin }
        }
      } catch {
        /* offline: sign in locally, sync after the next sign-in */
      }
      saveSession(user)
      onUser(user)
    },
  })
  gid.renderButton(el, { theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', width: 280 })
}
