import { useRef, useState } from 'react'
import { COURSES } from '../content'
import { useApp } from '../lib/app'
import { Progress, TopBar } from '../components/bits'
import { allBadges, earnedBadges, getSetting, levelInfo, setSetting, streak, totalXp } from '../lib/progress'

export function MePage() {
  const { db, user, signOut } = useApp()
  const xp = totalXp(db)
  const lv = levelInfo(xp)
  const earned = earnedBadges(db)
  const course = COURSES[0]
  const badges = allBadges(course)
  const theme = getSetting(db, 'theme', 'auto')
  const goal = getSetting(db, 'weeklyGoal', '4')
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const lessonsDone = Number(db.get("SELECT COUNT(*) AS n FROM lesson_progress WHERE status='done'")?.n ?? 0)
  const cards = Number(db.get('SELECT COALESCE(SUM(reviews),0) AS n FROM cards')?.n ?? 0)
  const studyDays = Number(db.get('SELECT COUNT(DISTINCT day) AS n FROM xp_log')?.n ?? 0)

  function setTheme(t: string) {
    setSetting(db, 'theme', t)
    if (t === 'auto') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = t
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

      <div className="stats" style={{ marginTop: 14 }}>
        <div className="stat">
          <b>{lessonsDone}</b>
          <span>lessons</span>
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

      <div className="section-title">
        Badges · {earned.size}/{badges.length}
      </div>
      <div className="badges">
        {badges.map((b) => (
          <div key={b.id} className={`badge ${earned.has(b.id) ? '' : 'locked'}`} title={b.desc}>
            <span className="e">{b.emoji}</span>
            <b>{b.name}</b>
            <div className="small muted" style={{ fontSize: 11, lineHeight: 1.2, marginTop: 2 }}>
              {b.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Settings</div>
      <div className="card stack">
        <div>
          <b>Appearance</b>
          <div className="seg" style={{ marginTop: 6 }}>
            {['auto', 'light', 'dark'].map((t) => (
              <button key={t} className={theme === t ? 'on' : ''} onClick={() => setTheme(t)}>
                {t === 'auto' ? 'Auto' : t === 'light' ? '☀️ Light' : '🌙 Dark'}
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
        <p className="small muted" style={{ margin: 0 }}>
          🔒 Progress and notes are stored only on this device, in a private database inside your browser. Save a backup now and
          then. It also lets you move your progress to another device.
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
      </div>

      <div className="section-title">About the content</div>
      <div className="card small">
        <p style={{ marginTop: 0 }}>
          Lessons follow the official <b>AP Chemistry Course and Exam Description (effective Fall 2024)</b> from College Board. Each
          lesson lists the CED topic it covers. Constants match the AP Chemistry Equations &amp; Constants sheet. Every answer
          that involves a calculation is re-checked automatically by the app's test suite.
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>
          AP® is a trademark of College Board, which is not affiliated with this app. Study streak today:{' '}
          {streak(db).studiedToday ? 'yes ✓' : 'not yet'}.
        </p>
      </div>

      <button className="btn ghost block" style={{ marginTop: 16 }} onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}
