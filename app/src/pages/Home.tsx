import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useApp, useCourse } from '../lib/app'
import { openable, useAccount } from '../lib/account'
import { setCurrentCourse } from '../lib/course'
import { getPlan } from '../lib/plans'
import { planStatus } from '../lib/schedule'
import { today } from '../lib/db'
import { usePricing } from '../lib/pricing'
import { planOf } from '../../shared/pricing'
import { trickyTopics } from '../lib/tips'
import { TipSheet, TrickyTopics } from '../components/Help'
import { ICON, ScheduleCards, TodayCard } from './Schedule'
import { CourseGate } from './Plans'
import { InstallCard } from '../components/Install'
import { COURSES, examInfo } from '../content'
import type { Course } from '../content/types'
import { Progress } from '../components/bits'
import { dueCount, getSetting, lessonStatuses, levelInfo, nextLesson, streak, totalXp, weekDays, xpToday } from '../lib/progress'

const GREETINGS = ['Hi', 'Hey', 'Welcome back', 'Good to see you']

/** Home: a card for each of her courses, with its progress and today's plan. Tapping one opens that course's Home. */
export function HomePage() {
  const freeCount = planOf(usePricing(), 'free').courses ?? 0
  const account = useAccount()
  const mine = COURSES.filter((c) => openable(account, c.id))

  return (
    <div className="stack" style={{ paddingTop: 12 }}>
      <Hello />
      <InstallCard />

      {!mine.length ? (
        <div className="card continue">
          <h3 style={{ marginTop: 0 }}>Choose your first course</h3>
          <p className="muted small">Your free plan includes any {freeCount === 1 ? 'one course' : `${freeCount} courses`}. More are on the way.</p>
          <Link className="btn block" to="/learn">
            Browse courses ▶
          </Link>
        </div>
      ) : (
        <>
          <h3 className="section-title">My courses</h3>
          {mine.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
          <Link to="/learn" className="small" style={{ textAlign: 'center' }}>
            ＋ Add or change courses
          </Link>
        </>
      )}
    </div>
  )
}

function Hello() {
  const { db, user } = useApp()
  const lv = levelInfo(totalXp(db))
  const greet = GREETINGS[new Date().getDate() % GREETINGS.length]
  return (
    <div className="hello">
      <div className="row">
        <h2 className="grow">
          {greet}, {user.name.split(' ')[0]}! 👋
        </h2>
        <Link to="/me" className="avatar-link" aria-label="My profile and settings" title="My profile">
          {user.picture ? <img src={user.picture} alt="" width={40} height={40} className="avatar" referrerPolicy="no-referrer" /> : <span className="avatar ph">🙂</span>}
        </Link>
      </div>
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
  )
}

/** One course on Home: how far along it is, and what today holds (the study plan's session, else the next lesson). */
function CourseCard({ course }: { course: Course }) {
  const { db } = useApp()
  const statuses = lessonStatuses(db)
  const done = new Set([...statuses].filter(([, s]) => s === 'done').map(([id]) => id))
  const lessons = course.units.flatMap((u) => u.lessons)
  const doneCount = lessons.filter((l) => done.has(l.id)).length
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0
  const due = dueCount(db, course.id)
  const plan = getPlan(db, course.id)
  const st = plan ? planStatus(plan, done) : null
  const session = st ? (st.todays ?? st.next) : undefined
  const next = nextLesson(course, statuses)
  const reviewInPlan = session?.date === today() && session.items.some((i) => i.k === 'cards')

  return (
    <Link to={`/home/${course.id}`} onClick={() => setCurrentCourse(course.id)} className="card home-course plain-link">
      <div className="row">
        <span className="course-emoji">{course.emoji}</span>
        <span className="grow">
          <b>{course.title}</b>
          <span className="small muted" style={{ display: 'block' }}>
            {doneCount} of {lessons.length} lessons done
          </span>
        </span>
        <span className="course-pct">{pct}%</span>
      </div>
      <div style={{ marginTop: 10 }}>
        <Progress pct={pct} />
      </div>

      <div className="today-block">
        <div className="row small">
          <span className="grow muted" style={{ fontWeight: 800 }}>
            ☀️ {!plan ? 'Today' : session?.date === today() ? "Today's plan" : session ? `Next session ${new Date(`${session.date}T12:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}` : 'Study plan finished'}
          </span>
          {st && st.behind > 0 && <span className="pill warn small">{st.behind} behind</span>}
        </div>
        {session ? (
          session.items.map((i, n) => {
            const finished = i.k === 'lesson' && done.has(i.id!)
            return (
              <div key={n} className={`session-item ${finished ? 'done' : ''}`}>
                <span className="dot">{finished ? '✓' : ICON[i.k]}</span>
                <span className="grow">
                  {i.t}
                  {i.k === 'cards' && session.date === today() && <span className="small muted"> · {due ? `${due} due` : 'all caught up'}</span>}
                </span>
                <span className="small muted">{i.m}′</span>
              </div>
            )
          })
        ) : next ? (
          <div className="session-item">
            <span className="dot">📖</span>
            <span className="grow">
              {statuses.get(next.lesson.id) === 'started' ? 'Continue: ' : 'Up next: '}
              {next.lesson.title}
            </span>
            <span className="small muted">{next.lesson.minutes}′</span>
          </div>
        ) : (
          <div className="session-item">
            <span className="dot">🏆</span>
            <span className="grow">Every lesson done!</span>
          </div>
        )}
        {!reviewInPlan && due > 0 && (
          <div className="session-item">
            <span className="dot">🃏</span>
            <span className="grow">
              Review cards <span className="small muted">· {due} due</span>
            </span>
          </div>
        )}
      </div>
      <div className="small home-course-go">Open {course.short} ›</div>
    </Link>
  )
}

/** A course's Home: today's plan, what's next, the study schedule and tricky topics, for this course only. */
export function CourseHomePage() {
  const { courseId } = useParams()
  const course = useCourse(courseId)
  if (!course) return <Navigate to="/" replace />
  return (
    <CourseGate courseId={course.id}>
      <CourseHome course={course} />
    </CourseGate>
  )
}

function CourseHome({ course }: { course: Course }) {
  const { db } = useApp()
  const st = streak(db)
  const wk = weekDays(db)
  const goal = Number(getSetting(db, 'weeklyGoal', '4'))
  const statuses = lessonStatuses(db)
  const due = dueCount(db, course.id)
  const next = nextLesson(course, statuses)
  const lessons = course.units.flatMap((u) => u.lessons)
  const doneCount = lessons.filter((l) => statuses.get(l.id) === 'done').length
  const tricky = trickyTopics(db, [course.id])
  const [tip, setTip] = useState<string | null>(null)

  return (
    <div className="stack" style={{ paddingTop: 4 }}>
      <Hello />

      <TodayCard due={due} course={course} />

      {next ? (
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

      <div className="row course-links">
        <Link to={`/course/${course.id}`} className="btn secondary grow">
          📚 Units
        </Link>
        <Link to={examInfo(course.id)?.path ?? `/exam/${course.id}`} className="btn secondary grow">
          🎓 Exams
        </Link>
        <Link to={`/course/${course.id}/syllabus`} className="btn secondary grow">
          📋 Syllabus
        </Link>
      </div>

      <ScheduleCards courses={[course]} />

      <TrickyTopics items={tricky} onTip={setTip} />
      {tip && <TipSheet lessonId={tip} onClose={() => setTip(null)} />}

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
          <span>of {lessons.length} lessons</span>
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
