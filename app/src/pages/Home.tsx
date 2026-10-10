import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../lib/app'
import { openable, useAccount } from '../lib/account'
import { trickyTopics } from '../lib/tips'
import { TipSheet, TrickyTopics } from '../components/Help'
import { TodayPlan } from './Schedule'
import { InstallCard } from '../components/Install'
import { COURSES } from '../content'
import { Progress } from '../components/bits'
import { dueCount, getSetting, lessonStatuses, levelInfo, nextLesson, streak, totalXp, weekDays, xpToday } from '../lib/progress'

const GREETINGS = ['Hi', 'Hey', 'Welcome back', 'Good to see you']

export function HomePage() {
  const { db, user } = useApp()
  const xp = totalXp(db)
  const lv = levelInfo(xp)
  const st = streak(db)
  const wk = weekDays(db)
  const goal = Number(getSetting(db, 'weeklyGoal', '4'))
  const statuses = lessonStatuses(db)
  const due = dueCount(db)
  const account = useAccount()
  const mine = COURSES.filter((c) => openable(account, c.id))
  const course = mine[0]
  const next = course ? nextLesson(course, statuses) : null
  const doneCount = [...statuses.values()].filter((s) => s === 'done').length
  const totalLessons = mine.reduce((n, c) => n + c.units.reduce((m, u) => m + u.lessons.length, 0), 0)
  const tricky = trickyTopics(db, mine.map((c) => c.id))
  const [tip, setTip] = useState<string | null>(null)
  const greet = GREETINGS[new Date().getDate() % GREETINGS.length]

  return (
    <div className="stack" style={{ paddingTop: 12 }}>
      <div className="hello">
        <h2>
          {greet}, {user.name.split(' ')[0]}! 👋
        </h2>
        <div className="muted">
          Level {lv.level} · {lv.title}
        </div>
        <div style={{ marginTop: 8 }}>
          <Progress pct={lv.pct} />
          <div className="small muted" style={{ marginTop: 4 }}>
            {lv.span - lv.into} XP to level {lv.level + 1}
          </div>
        </div>
      </div>

      <InstallCard />

      <TodayPlan />

      {!course ? (
        <div className="card continue">
          <h3 style={{ marginTop: 0 }}>Choose your first course</h3>
          <p className="muted small">Your free plan includes any one AP course. More are on the way.</p>
          <Link className="btn block" to="/learn">
            Browse courses ▶
          </Link>
        </div>
      ) : next ? (
        <div className="card continue">
          <div className="small" style={{ fontWeight: 800, opacity: 0.9 }}>
            {statuses.get(next.lesson.id) === 'started' ? 'PICK UP WHERE YOU LEFT OFF' : 'UP NEXT'}
          </div>
          <h3 style={{ margin: '6px 0 2px', fontSize: 20 }}>{next.lesson.title}</h3>
          <div className="muted small" style={{ marginBottom: 12 }}>
            {next.unit.number === 0 ? next.unit.title : `Unit ${next.unit.number}: ${next.unit.title}`} · about {next.lesson.minutes} min
          </div>
          <Link className="btn block" to={`/lesson/${next.lesson.id}`}>
            {statuses.get(next.lesson.id) === 'started' ? 'Continue' : 'Start'} ▶
          </Link>
        </div>
      ) : (
        <div className="card continue">
          <h3>🏆 You've finished every lesson!</h3>
          <p className="muted">Keep your memory fresh with daily review.</p>
        </div>
      )}

      <TrickyTopics items={tricky} onTip={setTip} />
      {tip && <TipSheet lessonId={tip} onClose={() => setTip(null)} />}

      <Link to="/review" className="card row" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ fontSize: 30 }}>🃏</div>
        <div className="grow">
          <b>Today's review</b>
          <div className="small muted">
            {due ? `${due} quick card${due === 1 ? '' : 's'}, about ${Math.max(1, Math.round(due / 4))} min` : 'All caught up. Nice!'}
          </div>
        </div>
        <span className="muted">›</span>
      </Link>

      <div className="stats">
        <div className="stat">
          <b>🔥 {st.days}</b>
          <span>day streak</span>
        </div>
        <div className="stat">
          <b>⚡ {xpToday(db)}</b>
          <span>XP today</span>
        </div>
        <div className="stat">
          <b>📘 {doneCount}</b>
          <span>of {totalLessons} lessons</span>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <b className="grow">This week</b>
          <span className="small muted">
            {wk.count}/{goal} study days {wk.count >= goal ? '🎉' : ''}
          </span>
        </div>
        <div className="week">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i}>
              <i className={wk.done[i] ? 'on' : ''} />
              {d}
            </div>
          ))}
        </div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>
          {st.studiedToday
            ? 'You studied today. Great job! 🌟'
            : 'Even one 5-minute lesson counts. Rest days are fine too: one missed day never breaks your streak.'}
        </p>
      </div>
    </div>
  )
}
