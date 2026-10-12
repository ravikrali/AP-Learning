// The admin portal (admin.aplearning.app): its own sign-in, then dashboard and tools.

import { useEffect, useRef, useState, type ComponentType } from 'react'
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { clearSession, GOOGLE_CLIENT_ID, loadSession, renderGoogleButton, saveSession, type User } from '../lib/auth'
import { api } from '../lib/api'
import { refreshContent } from '../lib/overrides'
import { can, ROLES, SECTIONS, type Access, type Section } from '../../shared/roles'
import { AdminContext } from './context'
import { Dashboard } from './Dashboard'
import { UsersTab } from './Users'
import { AudienceTab } from './Audience'
import { ContentTab, FeedbackTab, VideosTab } from './Tools'
import { TeamTab } from './Team'

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

// One tab per section; a tab is only shown to people whose role can view that section.
const PATHS: Record<Section, string> = {
  dashboard: '/dashboard',
  audience: '/audience',
  content: '/content',
  videos: '/videos',
  students: '/users',
  feedback: '/feedback',
  team: '/admins',
}
const PAGES: Record<Section, ComponentType> = {
  dashboard: Dashboard,
  audience: AudienceTab,
  content: ContentTab,
  videos: VideosTab,
  students: UsersTab,
  feedback: FeedbackTab,
  team: TeamTab,
}

export function AdminApp() {
  const [user, setUser] = useState<User | null>(() => loadSession())
  const [note, setNote] = useState<string | undefined>()
  const [access, setAccess] = useState<Access | null>(null)

  // Confirm the session is still valid and still an admin, and load this person's role.
  useEffect(() => {
    if (!user?.token) return
    api<{ isAdmin: boolean; access: Access | null }>('/api/me')
      .then((r) => {
        setAccess(r.access)
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
        } else setNote("Couldn't reach the server. Check your connection and reload.")
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
          } else {
            setNote(undefined)
            setAccess(null)
            setUser(u)
          }
        }}
      />
    )

  if (!access)
    return (
      <div className="admin-login">
        <div className="logo">🛠️</div>
        <p className="muted">{note ?? 'Loading…'}</p>
      </div>
    )

  const tabs = SECTIONS.filter((s) => can(access.privs, s.id, 'view'))
  const home = tabs.length ? PATHS[tabs[0].id] : '/'

  const signOut = () => {
    void api('/api/auth/logout', { body: {} }).catch(() => undefined)
    clearSession()
    setAccess(null)
    setUser(null)
  }

  return (
    <AdminContext.Provider value={{ user, signOut, access, can: (s, a) => can(access.privs, s, a) }}>
      <HashRouter>
        <div className="admin">
          <header className="admin-top">
            <b className="grow">🛠️ AP Learning Admin</b>
            <span className="small muted hide-narrow">{user.email}</span>
            <span className="weight" title={ROLES[access.role].about}>
              {ROLES[access.role].name}
            </span>
            <a className="btn ghost" href={APP_URL}>
              App ↗
            </a>
            <button className="btn ghost" onClick={signOut}>
              Sign out
            </button>
          </header>
          <nav className="admin-nav">
            {tabs.map((t) => (
              <NavLink key={t.id} to={PATHS[t.id]} className={({ isActive }) => (isActive ? 'on' : '')}>
                {t.icon} {t.label}
              </NavLink>
            ))}
          </nav>
          <main className="admin-main">
            <Routes>
              {tabs.map((t) => {
                const Page = PAGES[t.id]
                return <Route key={t.id} path={PATHS[t.id]} element={<Page />} />
              })}
              <Route
                path="*"
                element={tabs.length ? <Navigate to={home} replace /> : <div className="empty">Your role has no sections yet. Ask an admin to give you access.</div>}
              />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AdminContext.Provider>
  )
}
