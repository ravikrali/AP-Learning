import { useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID, renderGoogleButton, saveSession, type User } from '../lib/auth'

export function LoginPage({ onUser }: { onUser: (u: User) => void }) {
  const btn = useRef<HTMLDivElement>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!btn.current || !GOOGLE_CLIENT_ID) return
    renderGoogleButton(btn.current, onUser).catch((e) => setErr(String(e.message ?? e)))
  }, [onUser])

  const guest = () => {
    const u: User = { sub: 'guest', email: 'guest@local', name: 'Friend', guest: true }
    saveSession(u)
    onUser(u)
  }

  return (
    <div className="login">
      <div className="logo">⚗️📊</div>
      <h1>AP Learning</h1>
      <p className="muted" style={{ maxWidth: 360 }}>
        Short lessons, smart tricks and friendly practice for AP Chemistry. One small step at a time.
      </p>
      {GOOGLE_CLIENT_ID ? <div ref={btn} /> : null}
      {err && <p className="small" style={{ color: 'var(--oops)' }}>{err}</p>}
      {(!GOOGLE_CLIENT_ID || import.meta.env.DEV) && (
        <button className="btn secondary" onClick={guest}>
          Continue without Google {import.meta.env.DEV ? '(dev)' : ''}
        </button>
      )}
      <p className="small muted" style={{ maxWidth: 340 }}>
        🔒 Everything you do here is saved only on this device. Google sign-in just tells the app whose progress to open.
      </p>
    </div>
  )
}
