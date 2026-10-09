import { useRef, useState, useSyncExternalStore } from 'react'
import { syncNow, syncStore } from '../lib/sync'
import { Link } from 'react-router-dom'
import { COURSES } from '../content'
import { PLANS } from '../../shared/catalog'
import { courseTitle, openable, useAccount } from '../lib/account'
import { minutesByDay } from '../lib/track'
import type { Course } from '../content/types'
import { useApp } from '../lib/app'
import { Progress, TopBar } from '../components/bits'
import { MASCOTS, Mascot } from '../components/Mascot'
import { useMascotLook } from '../components/Cheer'
import { applyTheme } from '../lib/theme'
import {
  badgeProgress,
  getSetting,
  lessonStatuses,
  levelInfo,
  setSetting,
  streak,
  totalXp,
  type BadgeProgress,
} from '../lib/progress'

const ADMIN_URL = import.meta.env.DEV ? '/admin.html' : 'https://admin.aplearning.app/'

export function MePage() {
  const { db, user, signOut } = useApp()
  const xp = totalXp(db)
  const lv = levelInfo(xp)
  const theme = getSetting(db, 'theme', 'dark')
  const goal = getSetting(db, 'weeklyGoal', '4')
  const look = useMascotLook()
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const statuses = lessonStatuses(db)
  const lessonsDone = [...statuses.values()].filter((s) => s === 'done').length
  const cards = Number(db.get('SELECT COALESCE(SUM(reviews),0) AS n FROM cards')?.n ?? 0)
  const studyDays = Number(db.get('SELECT COUNT(DISTINCT day) AS n FROM xp_log')?.n ?? 0)
  const milestones = badgeProgress(db, COURSES[0]).milestones
  const account = useAccount()
  const mine = COURSES.filter((c) => openable(account, c.id))
  const weekMinutes = minutesByDay(db, 7).reduce((n, d) => n + d.minutes, 0)

  function flash(t: string) {
    setToast(t)
    window.setTimeout(() => setToast(null), 2600)
  }

  async function share() {
    const course = mine[0] ?? COURSES[0]
    const total = course.units.reduce((n, u) => n + u.lessons.length, 0)
    const st = streak(db).days
    const text =
      `I'm learning ${course.title} on AP Learning! 📚 ${lessonsDone} of ${total} lessons done, ` +
      `Level ${lv.level} (${lv.title})${st > 1 ? `, ${st}-day streak 🔥` : ''}.`
    const url = window.location.origin
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My AP Learning progress', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      flash('Copied! Paste it into a message. 📋')
    } catch (e) {
      if ((e as Error).name !== 'AbortError') flash("Couldn't share from this browser.")
    }
  }

  function setTheme(t: string) {
    setSetting(db, 'theme', t)
    applyTheme(t)
  }

  function exportBackup() {
    const bytes = db.exportBytes()
    const blob = new Blob([bytes.slice().buffer as ArrayBuffer], { type: 'application/x-sqlite3' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ap-learning-backup-${new Date().toISOString().slice(0, 10)}.sqlite`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    setMsg('Backup saved to your downloads. ✓')
  }

  async function importBackup(file: File) {
    if (!confirm('Replace the progress on this device with the backup file? This cannot be undone.')) return
    try {
      await db.importBytes(new Uint8Array(await file.arrayBuffer()))
      setMsg('Backup restored. ✓')
    } catch (e) {
      setMsg(String((e as Error).message))
    }
  }

  return (
    <div>
      <TopBar title="Me" />
      <div className="card row">
        {user.picture ? (
          <img src={user.picture} alt="" width={56} height={56} style={{ borderRadius: '50%' }} referrerPolicy="no-referrer" />
        ) : (
          <div className="unit-num" style={{ borderRadius: '50%' }}>
            {user.name[0]}
          </div>
        )}
        <div className="grow">
          <h3>{user.name}</h3>
          <div className="small muted">{user.guest ? 'Guest (this device only)' : user.email}</div>
          <div className="small" style={{ marginTop: 4 }}>
            <b>Level {lv.level}</b> · {lv.title} · {xp} XP
          </div>
          <div style={{ marginTop: 6 }}>
            <Progress pct={lv.pct} />
          </div>
        </div>
      </div>

      <div className="quick">
        <button onClick={share}>
          <span className="qi">📤</span>Share
        </button>
        <Link to="/me/help">
          <span className="qi">🧭</span>Help
        </Link>
        <Link to="/me/faq">
          <span className="qi">❓</span>FAQ
        </Link>
        <Link to="/me/feedback">
          <span className="qi">💬</span>Feedback
        </Link>
      </div>
      {toast && <div className="toast">{toast}</div>}
      <Link to="/plans" className="card row" style={{ marginTop: 10, textDecoration: 'none', color: 'inherit', padding: 14 }}>
        <span style={{ fontSize: 24 }}>⭐</span>
        <span className="grow">
          <b>{PLANS[account.ownPlan].name} plan</b>
          <span className="small muted" style={{ display: 'block' }}>
            {account.plan === 'all'
              ? 'Every course included'
              : account.courses.length
                ? account.courses.map(courseTitle).join(', ')
                : 'Choose your free course'}
          </span>
        </span>
        <span className="muted">›</span>
      </Link>
      {user.isAdmin && user.token && (
        <a href={ADMIN_URL} target="_blank" rel="noreferrer" className="card row" style={{ marginTop: 10, textDecoration: 'none', color: 'inherit', padding: 14 }}>
          <span style={{ fontSize: 24 }}>🛠️</span>
          <span className="grow">
            <b>Admin portal</b>
            <span className="small muted" style={{ display: 'block' }}>
              Dashboard, content, videos, users, feedback and admins
            </span>
          </span>
          <span className="muted">↗</span>
        </a>
      )}

      <div className="stats" style={{ marginTop: 14 }}>
        <div className="stat">
          <b>{lessonsDone}</b>
          <span>lessons</span>
        </div>
        <div className="stat">
          <b>{weekMinutes}</b>
          <span>min this week</span>
        </div>
        <div className="stat">
          <b>{cards}</b>
          <span>cards reviewed</span>
        </div>
        <div className="stat">
          <b>{studyDays}</b>
          <span>study days</span>
        </div>
      </div>

      <div className="section-title">My courses</div>
      <div className="stack">
        {mine.map((c) => (
          <CourseProgress key={c.id} course={c} />
        ))}
        <Link to="/learn" className="btn ghost block">
          ＋ {mine.length ? 'Browse more courses' : 'Choose a course'}
        </Link>
      </div>

      <div className="section-title">
        Milestones · {milestones.filter((m) => m.earned).length}/{milestones.length}
      </div>
      <div className="badges">
        {milestones.map((m) => (
          <BadgeTile key={m.badge.id} item={m} />
        ))}
      </div>

      <div className="section-title">Settings</div>
      <div className="card stack">
        <div>
          <b>Appearance</b>
          <div className="seg" style={{ marginTop: 6 }}>
            {['dark', 'light', 'auto'].map((t) => (
              <button key={t} className={theme === t ? 'on' : ''} onClick={() => setTheme(t)}>
                {t === 'auto' ? '📱 Phone' : t === 'light' ? '☀️ Light' : '🌙 Dark'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <b>Study buddy</b>
          <div className="buddies" style={{ marginTop: 6 }}>
            {MASCOTS.map((m) => (
              <button
                key={m.id}
                className={look === m.id ? 'on' : ''}
                onClick={() => setSetting(db, 'mascot', m.id)}
                aria-label={`Choose ${m.name}`}
                aria-pressed={look === m.id}
              >
                <Mascot look={m.id} size={58} animate={look === m.id} />
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <b>Weekly goal</b> <span className="small muted">(study days per week)</span>
          <div className="seg" style={{ marginTop: 6 }}>
            {['2', '3', '4', '5', '6', '7'].map((g) => (
              <button key={g} className={goal === g ? 'on' : ''} onClick={() => setSetting(db, 'weeklyGoal', g)}>
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-title">Your data</div>
      <div className="card stack">
        <SyncStatusRow />
        <p className="small muted" style={{ margin: 0 }}>
          {user.guest
            ? '🔒 As a guest, progress and notes stay only on this device. Sign in with Google to keep them on all your devices.'
            : '🔒 Progress and notes are saved on this device first, so everything works offline, and kept in step with your private account so they follow you to any phone or computer you sign in on.'}{' '}
          A backup file is an extra copy you control.
        </p>
        <button className="btn secondary block" onClick={exportBackup}>
          ⬇️ Save a backup file
        </button>
        <button className="btn secondary block" onClick={() => fileRef.current?.click()}>
          ⬆️ Restore from a backup file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".sqlite,.db,application/octet-stream,application/x-sqlite3"
          hidden
          onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])}
        />
        {msg && <p className="small">{msg}</p>}
        <Link to="/me/privacy" className="small">
          Privacy & terms ›
        </Link>
      </div>

      <div className="section-title">About the content</div>
      <div className="card small">
        <p style={{ marginTop: 0 }}>
          Lessons follow the official <b>AP Chemistry Course and Exam Description (effective Fall 2024)</b> from College Board. Each
          lesson lists the CED topic it covers. Constants match the AP Chemistry Equations &amp; Constants sheet. Every answer
          that involves a calculation is re-checked automatically by the app's test suite.
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>
          AP® is a trademark of College Board, which is not affiliated with this app.
        </p>
      </div>

      <button className="btn ghost block" style={{ marginTop: 16 }} onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}

function ago(iso?: string) {
  if (!iso) return ''
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  return new Date(iso).toLocaleString()
}

function SyncStatusRow() {
  const { user, signOut } = useApp()
  const s = useSyncExternalStore(syncStore.subscribe, syncStore.get)
  if (user.guest) return null
  if (!user.token)
    return (
      <div className="sync-card">
        <span className="sync-dot signin" />
        <span className="grow small">
          <b>Sync is off on this device.</b> Sign out and sign in again with Google to turn it on.
        </span>
        <button className="btn secondary" onClick={signOut}>
          Sign in
        </button>
      </div>
    )
  const text =
    s.state === 'syncing'
      ? 'Syncing…'
      : s.state === 'idle'
        ? `Synced ${ago(s.last)} ✓`
        : s.state === 'offline'
          ? "Offline. Your progress is safe here and will sync when you're back online."
          : s.state === 'error'
            ? `Couldn't sync yet (${s.message}). Trying again soon.`
            : 'Starting sync…'
  return (
    <div className="sync-card">
      <span className={`sync-dot ${s.state}`} />
      <span className="grow small">
        <b>Sync</b> · {text}
      </span>
      <button className="btn secondary" onClick={syncNow} disabled={s.state === 'syncing'}>
        Sync now
      </button>
    </div>
  )
}

/** A course's overall progress; tap to see the badge for each unit and how close each one is. */
function CourseProgress({ course }: { course: Course }) {
  const { db } = useApp()
  const [open, setOpen] = useState(false)
  const items = badgeProgress(db, course).course
  const champ = items[items.length - 1]
  const pct = champ.goal ? Math.round((champ.value / champ.goal) * 100) : 0
  const earned = items.filter((b) => b.earned).length
  return (
    <div className="card course-card">
      <button className="course-head row" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="course-emoji">{course.emoji}</span>
        <span className="grow" style={{ textAlign: 'left' }}>
          <b>{course.title}</b>
          <span className="small muted" style={{ display: 'block' }}>
            {champ.value} of {champ.goal} lessons · {earned}/{items.length} badges
          </span>
          <span style={{ display: 'block', marginTop: 6 }}>
            <Progress pct={pct} />
          </span>
        </span>
        <span className="course-pct">{pct}%</span>
        <span className={`chev ${open ? 'open' : ''}`} aria-hidden>
          ›
        </span>
      </button>
      {open && (
        <div className="badge-rows">
          {items.map((b, i) => {
            const unit = course.units[i]
            return (
              <div key={b.badge.id} className={`badge-row ${b.earned ? 'earned' : ''}`}>
                <span className="e">{b.badge.emoji}</span>
                <div className="grow">
                  <div className="row" style={{ gap: 6 }}>
                    <b className="grow">{b.badge.name}</b>
                    <span className="small muted">
                      {b.earned ? 'Earned ✓' : `${b.value}/${b.goal}`}
                    </span>
                  </div>
                  <div className="small muted">
                    {unit ? (unit.number === 0 ? unit.title : `Unit ${unit.number}: ${unit.title}`) : 'Every lesson in the course'}
                  </div>
                  <Progress pct={b.goal ? (b.value / b.goal) * 100 : 0} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function BadgeTile({ item }: { item: BadgeProgress }) {
  const { badge, earned, value, goal } = item
  return (
    <div className={`badge ${earned ? '' : 'locked'}`} title={badge.desc}>
      <span className="e">{badge.emoji}</span>
      <b>{badge.name}</b>
      <div className="small muted" style={{ fontSize: 11, lineHeight: 1.2, marginTop: 2 }}>
        {badge.desc}
      </div>
      {!earned && goal > 1 && (
        <div className="mini">
          <Progress pct={(value / goal) * 100} />
          <span>
            {value}/{goal}
          </span>
        </div>
      )}
    </div>
  )
}
