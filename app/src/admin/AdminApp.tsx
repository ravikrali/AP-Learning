// The admin portal (admin.aplearning.app): its own sign-in, then dashboard and tools.

import { useEffect, useRef, useState } from 'react'
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { clearSession, GOOGLE_CLIENT_ID, loadSession, renderGoogleButton, saveSession, type User } from '../lib/auth'
import { api } from '../lib/api'
import { refreshContent } from '../lib/overrides'
import { AdminContext } from './context'
import { Dashboard } from './Dashboard'
import { UsersTab } from './Users'
import { AudienceTab } from './Audience'
import { AdminsTab, ContentTab, FeedbackTab, VideosTab } from './Tools'

const APP_URL = import.meta.env.DEV ? '/' : 'https://www.aplearning.app/'

function SignIn({ onUser, note }: { onUser: (u: User) => void; note?: string }) {
  const btn = useRef<HTMLDivElement>(null)
  const [err, setErr] = useState<string | null>(null)
  const [email, setEmail] = useState('devt309@gmail.com')
  useEffect(() => {
    if (btn.current && GOOGLE_CLIENT_ID) renderGoogleButton(btn.current, onUser).catch((e) => setErr(String(e.message ?? e)))
  }, [onUser])

  async function devSignIn() {
    try {
      const r = await api<{ token: string; isAdmin: boolean; user: { sub: string; email: string; name: string } }>('/api/auth/dev', { body: { email, name: 'Dev admin' } })
      const u: User = { sub: r.user.sub, email: r.user.email, name: r.user.name, token: r.token, isAdmin: r.isAdmin }
      saveSession(u)
      onUser(u)
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <div className="admin-login">
      <div className="logo">🛠️</div>
      <h1>AP Learning Admin</h1>
      <p className="muted">Sign in with an admin Google account.</p>
      {note && <p className="notice small">{note}</p>}
      {GOOGLE_CLIENT_ID && <div ref={btn} className="gbtn" />}
      {import.meta.env.DEV && (
        <div className="row" style={{ marginTop: 12 }}>
          <input className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn secondary" onClick={devSignIn}>
            Dev sign-in
          </button>
        </div>
      )}
      {err && <p className="small" style={{ color: 'var(--oops)' }}>{err}</p>}
      <a className="small" href={APP_URL}>
        ← Back to the app
      </a>
    </div>
  )
}

const TABS = [
  { to: '/', label: '📊 Dashboard', end: true },
  { to: '/audience', label: '🧭 Audience' },
  { to: '/content', label: '📝 Content' },
  { to: '/videos', label: '🎬 Videos' },
  { to: '/users', label: '👥 Students' },
  { to: '/feedback', label: '💬 Feedback' },
  { to: '/admins', label: '🔑 Admins' },
]

export function AdminApp() {
  const [user, setUser] = useState<User | null>(() => loadSession())
  const [note, setNote] = useState<string | undefined>()

  // Confirm the session is still valid and still an admin.
  useEffect(() => {
    if (!user?.token) return
    api<{ isAdmin: boolean }>('/api/me')
      .then((r) => {
        if (!r.isAdmin) {
          setNote(`${user.email} is not an admin.`)
          clearSession()
          setUser(null)
        }
      })
      .catch((e) => {
        if (e?.status === 401) {
          clearSession()
          setUser(null)
        }
      })
    refreshContent().catch(() => undefined)
  }, [user])

  if (!user?.token || user.isAdmin === false)
    return (
      <SignIn
        note={note ?? (user && !user.token ? "Couldn't reach the server to sign in. Try again." : undefined)}
        onUser={(u) => {
          if (!u.isAdmin) {
            setNote(u.token ? `${u.email} is not an admin.` : "Couldn't reach the server to sign in. Try again.")
            clearSession()
            setUser(null)
          } else setUser(u)
        }}
      />
    )

  const signOut = () => {
    void api('/api/auth/logout', { body: {} }).catch(() => undefined)
    clearSession()
    setUser(null)
  }

  return (
    <AdminContext.Provider value={{ user, signOut }}>
      <HashRouter>
        <div className="admin">
          <header className="admin-top">
            <b className="grow">🛠️ AP Learning Admin</b>
            <span className="small muted hide-narrow">{user.email}</span>
            <a className="btn ghost" href={APP_URL}>
              App ↗
            </a>
            <button className="btn ghost" onClick={signOut}>
              Sign out
            </button>
          </header>
          <nav className="admin-nav">
            {TABS.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'on' : '')}>
                {t.label}
              </NavLink>
            ))}
          </nav>
          <main className="admin-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/audience" element={<AudienceTab />} />
              <Route path="/content" element={<ContentTab />} />
              <Route path="/videos" element={<VideosTab />} />
              <Route path="/users" element={<UsersTab />} />
              <Route path="/feedback" element={<FeedbackTab />} />
              <Route path="/admins" element={<AdminsTab />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AdminContext.Provider>
  )
}
