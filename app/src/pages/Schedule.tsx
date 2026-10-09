import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { catalogCourse } from '../../shared/catalog'
import { planToIcs, sessionMinutes, type PlanSession, type StudyPlan } from '../../shared/plan'
import { planExtras } from '../content'
import type { Course } from '../content/types'
import { useApp, useCourse } from '../lib/app'
import { api } from '../lib/api'
import { today } from '../lib/db'
import { deletePlan, getPlan, savePlan } from '../lib/plans'
import { lessonStatuses } from '../lib/progress'
import { buildPlan, minutesNeeded, parseDay, planStatus, type PlanAnswers } from '../lib/schedule'
import { track } from '../lib/track'
import { TopBar } from '../components/bits'
import { Mascot } from '../components/Mascot'
import { useMascotLook } from '../components/Cheer'
import { CourseGate } from './Plans'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const fmt = (d: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  parseDay(d).toLocaleDateString(undefined, opts)
const daysUntil = (d: string) => Math.round((parseDay(d).getTime() - parseDay(today()).getTime()) / 86400_000)

export function SchedulePage() {
  const { courseId } = useParams()
  const course = useCourse(courseId)
  if (!course) return <TopBar title="Not found" back="/learn" />
  return (
    <CourseGate courseId={course.id}>
      <Schedule course={course} />
    </CourseGate>
  )
}

function Schedule({ course }: { course: Course }) {
  const { db } = useApp()
  const plan = getPlan(db, course.id)
  const [editing, setEditing] = useState(!plan)
  if (editing || !plan) return <Wizard course={course} initial={plan} onDone={() => setEditing(false)} />
  return <PlanView course={course} plan={plan} onEdit={() => setEditing(true)} />
}

// ---------- the questions ----------

function defaults(course: Course, p: StudyPlan | null): PlanAnswers {
  const exam = catalogCourse(course.id)?.exam
  return p
    ? { examDate: p.examDate, examTime: p.examTime, days: p.days, minutes: p.minutes, time: p.time, start: p.start, reviewWeeks: p.reviewWeeks }
    : {
        examDate: exam && exam.date > today() ? exam.date : today(new Date(Date.now() + 120 * 86400_000)),
        examTime: exam?.time ?? '08:00',
        days: [0, 1, 2, 3, 6],
        minutes: 30,
        time: '16:30',
        start: '',
        reviewWeeks: 3,
      }
}

function Wizard({ course, initial, onDone }: { course: Course; initial: StudyPlan | null; onDone: () => void }) {
  const { db } = useApp()
  const look = useMascotLook()
  const [a, setA] = useState<PlanAnswers>(() => defaults(course, initial))
  const [step, setStep] = useState(0)
  const set = (patch: Partial<PlanAnswers>) => setA((x) => ({ ...x, ...patch }))
  const statuses = lessonStatuses(db)
  const done = useMemo(() => new Set([...statuses].filter(([, s]) => s === 'done').map(([id]) => id)), [statuses])
  const official = catalogCourse(course.id)?.exam

  const questions = [
    {
      q: 'When is your exam?',
      body: (
        <>
          <input type="date" className="admin-input" value={a.examDate} min={today()} onChange={(e) => e.target.value && set({ examDate: e.target.value })} />
          {official && (
            <p className="small muted">
              College Board's 2027 date for {course.title}: <b>{fmt(official.date, { weekday: 'long', month: 'long', day: 'numeric' })}</b>,{' '}
              {official.time === '08:00' ? '8 AM' : '12 PM'} local time. Your AP coordinator confirms the exact time and room.
            </p>
          )}
        </>
      ),
    },
    {
      q: 'Which days can you study?',
      body: (
        <>
          <div className="chips">
            {DAY_NAMES.map((d, i) => (
              <button
                key={d}
                className={`chip ${a.days.includes(i) ? 'on' : ''}`}
                onClick={() => set({ days: a.days.includes(i) ? a.days.filter((x) => x !== i) : [...a.days, i] })}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="small muted">Leave a day or two free. Rest days help memory, and one missed day never breaks your streak.</p>
        </>
      ),
      ok: a.days.length > 0,
    },
    {
      q: 'How long is a study session?',
      body: (
        <div className="seg">
          {[15, 20, 30, 45, 60].map((m) => (
            <button key={m} className={a.minutes === m ? 'on' : ''} onClick={() => set({ minutes: m })}>
              {m} min
            </button>
          ))}
        </div>
      ),
    },
    {
      q: 'What time do you usually study?',
      body: (
        <>
          <input type="time" className="admin-input" value={a.time} onChange={(e) => e.target.value && set({ time: e.target.value })} />
          <p className="small muted">Your calendar will remind you 10 minutes before.</p>
        </>
      ),
    },
    {
      q: 'Where do you want to start?',
      body: (
        <>
          <select className="admin-input" value={a.start} onChange={(e) => set({ start: e.target.value })}>
            <option value="">From the very beginning</option>
            {course.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.number === 0 ? u.title : `Unit ${u.number}: ${u.title}`}
              </option>
            ))}
          </select>
          <p className="small muted">Lessons you've already finished are skipped. Starting from the beginning is a great way to rebuild strong foundations.</p>
        </>
      ),
    },
    {
      q: 'How long do you want for final review?',
      body: (
        <>
          <div className="seg">
            {[1, 2, 3, 4].map((w) => (
              <button key={w} className={a.reviewWeeks === w ? 'on' : ''} onClick={() => set({ reviewWeeks: w })}>
                {w} wk{w > 1 ? 's' : ''}
              </button>
            ))}
          </div>
          <p className="small muted">The last weeks before the exam are for practice exams, free-response practice and fixing weak spots.</p>
        </>
      ),
    },
  ]

  const preview = step === questions.length
  const plan = useMemo(() => (preview ? buildPlan(course, a, done, planExtras(course.id)) : null), [preview, course, a, done])
  const need = useMemo(() => (plan?.overflow ? minutesNeeded(course, a, done) : null), [plan, course, a, done])

  function save() {
    if (!plan) return
    savePlan(db, plan)
    track(db, initial ? 'plan_update' : 'plan_create', { course: course.id })
    onDone()
  }

  return (
    <div>
      <TopBar title="My study plan" back={`/course/${course.id}`} />
      {!preview ? (
        <div className="card wizard">
          <div className="row" style={{ alignItems: 'center' }}>
            <Mascot look={look} mood="happy" size={56} />
            <div className="grow">
              <div className="small muted">
                Question {step + 1} of {questions.length}
              </div>
              <h2 style={{ margin: '2px 0 0' }}>{questions[step].q}</h2>
            </div>
          </div>
          <div className="stack" style={{ marginTop: 12 }}>
            {questions[step].body}
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            {step > 0 && (
              <button className="btn secondary" onClick={() => setStep(step - 1)}>
                ←
              </button>
            )}
            <button className="btn grow" disabled={questions[step].ok === false} onClick={() => setStep(step + 1)}>
              {step === questions.length - 1 ? 'Build my plan ✨' : 'Next →'}
            </button>
          </div>
        </div>
      ) : (
        plan && (
          <div className="stack">
            <div className="card">
              <h2 style={{ marginTop: 0 }}>Here's your plan 🎉</h2>
              <PlanSummary plan={plan} />
              {plan.overflow ? (
                <div className="notice" style={{ marginTop: 10 }}>
                  ⚠️ {plan.overflow} lesson{plan.overflow === 1 ? '' : 's'} didn't fit before your review weeks, so they were moved into them.{' '}
                  {need ? `Sessions of ${need} minutes would fit everything.` : 'Adding a study day or a shorter review period would help.'}
                </div>
              ) : (
                <p className="small" style={{ marginBottom: 0 }}>✅ Everything fits, with time to review before the exam.</p>
              )}
            </div>
            <SessionList sessions={plan.sessions.slice(0, 6)} plan={plan} done={new Set()} />
            <div className="row">
              <button className="btn secondary" onClick={() => setStep(0)}>
                Change answers
              </button>
              <button className="btn grow" onClick={save}>
                Save my plan
              </button>
            </div>
            {initial && (
              <button className="btn ghost" onClick={onDone}>
                Keep my current plan
              </button>
            )}
          </div>
        )
      )}
    </div>
  )
}

function PlanSummary({ plan }: { plan: StudyPlan }) {
  const lessons = plan.sessions.reduce((n, s) => n + s.items.filter((i) => i.k === 'lesson').length, 0)
  const reviewFrom = plan.sessions.find((s) => s.items.every((i) => i.k !== 'lesson' && i.k !== 'checkpoint'))
  return (
    <div className="plan-summary">
      <div>
        <b>{plan.sessions.length}</b>
        <span>sessions</span>
      </div>
      <div>
        <b>{lessons}</b>
        <span>lessons</span>
      </div>
      <div>
        <b>{daysUntil(plan.examDate)}</b>
        <span>days to exam</span>
      </div>
      <p className="small muted" style={{ gridColumn: '1 / -1', margin: '6px 0 0' }}>
        {plan.days.map((d) => DAY_NAMES[d]).join(', ')} at {plan.time}, up to {plan.minutes} min. Lessons are spread evenly, so most days are
        short; do extra any day to get ahead.
        {reviewFrom && ` Final review starts ${fmt(reviewFrom.date)}.`} Exam: {fmt(plan.examDate, { weekday: 'long', month: 'long', day: 'numeric' })}.
      </p>
    </div>
  )
}

function SessionList({ sessions, plan, done }: { sessions: PlanSession[]; plan: StudyPlan; done: Set<string> }) {
  const t = today()
  return (
    <div className="stack" style={{ gap: 8 }}>
      {sessions.map((s) => (
        <div key={s.date} className={`card session ${s.date === t ? 'today' : ''} ${s.date < t ? 'past' : ''}`}>
          <div className="row">
            <b className="grow">{s.date === t ? 'Today' : fmt(s.date)}</b>
            <span className="small muted">
              {plan.time} · {sessionMinutes(s)} min
            </span>
          </div>
          {s.items.map((i, n) => {
            const finished = i.k === 'lesson' && done.has(i.id!)
            return (
              <Link key={n} to={i.to ?? '/'} className={`session-item ${finished ? 'done' : ''}`}>
                <span className="dot">{finished ? '✓' : ICON[i.k]}</span>
                <span className="grow">{i.t}</span>
                <span className="small muted">{i.m}′</span>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

const ICON: Record<string, string> = { lesson: '📖', checkpoint: '🎯', exam: '🎓', frq: '✍️', cards: '🃏', review: '🔁' }

// ---------- the saved plan ----------

function PlanView({ course, plan, onEdit }: { course: Course; plan: StudyPlan; onEdit: () => void }) {
  const { db, user } = useApp()
  const nav = useNavigate()
  const [showAll, setShowAll] = useState(false)
  const [cal, setCal] = useState<{ url?: string; err?: string; busy?: boolean }>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const statuses = lessonStatuses(db)
  const done = new Set([...statuses].filter(([, s]) => s === 'done').map(([id]) => id))
  const st = planStatus(plan, done)
  const t = today()
  const upcoming = plan.sessions.filter((s) => s.date >= t)
  const toShow = showAll ? upcoming : upcoming.slice(0, 7)

  function rebuild() {
    const fresh = buildPlan(course, { ...plan }, done, planExtras(course.id))
    savePlan(db, fresh)
    track(db, 'plan_rebuild', { course: course.id })
  }

  async function calendarLink() {
    setCal({ busy: true })
    try {
      const r = await api<{ url: string }>('/api/calendar/link')
      setCal({ url: r.url })
      track(db, 'calendar_link', { course: course.id })
    } catch (e) {
      setCal({ err: (e as Error).message })
    }
  }

  function download() {
    const ics = planToIcs([plan], { baseUrl: window.location.origin, name: `${course.title} study plan` })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
    a.download = `${course.id}-study-plan.ics`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
    track(db, 'calendar_download', { course: course.id })
  }

  const webcal = cal.url?.replace(/^https?:/, 'webcal:')
  return (
    <div>
      <TopBar title="My study plan" back={`/course/${course.id}`} />
      <div className="card">
        <div className="row">
          <div className="grow">
            <b>{course.title}</b>
            <div className="small muted">Exam in {daysUntil(plan.examDate)} days · {fmt(plan.examDate, { month: 'long', day: 'numeric' })}</div>
          </div>
          <span className={`pill ${st.behind ? 'warn' : 'good'}`}>
            {st.behind ? `${st.behind} behind` : st.ahead ? `${st.ahead} ahead 🚀` : 'On track ✓'}
          </span>
        </div>
        {st.behind > 2 && (
          <p className="small" style={{ margin: '10px 0 0' }}>
            Life happens! Tap <b>Re-plan from today</b> and the remaining lessons are spread out again. No catching up all at once.
          </p>
        )}
      </div>

      <div className="section-title">Add to your calendar</div>
      <div className="card stack">
        {user.token ? (
          cal.url ? (
            <>
              <p className="small" style={{ margin: 0 }}>
                Subscribe once and your calendar stays up to date when the plan changes (calendar apps refresh every few hours).
              </p>
              <a className="btn secondary block" href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal!)}`} target="_blank" rel="noreferrer">
                Google Calendar
              </a>
              <a className="btn secondary block" href={webcal}>
                Apple Calendar (iPhone, iPad, Mac)
              </a>
              <a
                className="btn secondary block"
                href={`https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(cal.url)}&name=${encodeURIComponent('AP Learning')}`}
                target="_blank"
                rel="noreferrer"
              >
                Outlook
              </a>
              <details className="small muted">
                <summary>Other calendar apps</summary>
                Add a calendar "from URL" and paste: <code style={{ wordBreak: 'break-all' }}>{cal.url}</code>. Keep this link private; it
                shows your study plan.
              </details>
            </>
          ) : (
            <button className="btn block" disabled={cal.busy} onClick={calendarLink}>
              📅 Add study sessions to my calendar
            </button>
          )
        ) : null}
        {cal.err && <p className="small" style={{ color: 'var(--oops)', margin: 0 }}>{cal.err}</p>}
        <button className="btn ghost block" onClick={download}>
          ⬇️ Download as a calendar file (.ics)
        </button>
        {!user.token && <p className="small muted" style={{ margin: 0 }}>Sign in with Google to get a calendar that updates by itself.</p>}
      </div>

      <div className="section-title">Coming up</div>
      {upcoming.length ? (
        <SessionList sessions={toShow} plan={plan} done={done} />
      ) : (
        <div className="card">🎯 All sessions are done. Good luck on the exam!</div>
      )}
      {upcoming.length > toShow.length && (
        <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setShowAll(true)}>
          Show all {upcoming.length} sessions
        </button>
      )}

      <div className="stack" style={{ marginTop: 16 }}>
        <button className="btn secondary block" onClick={rebuild}>
          🔄 Re-plan from today
        </button>
        <button className="btn ghost block" onClick={onEdit}>
          ✏️ Change my answers
        </button>
        {confirmDelete ? (
          <div className="row">
            <button className="btn ghost grow" onClick={() => setConfirmDelete(false)}>
              Keep it
            </button>
            <button
              className="btn danger grow"
              onClick={() => {
                deletePlan(db, course.id)
                nav(`/course/${course.id}`)
              }}
            >
              Delete plan
            </button>
          </div>
        ) : (
          <button className="btn ghost block" onClick={() => setConfirmDelete(true)}>
            🗑️ Delete this plan
          </button>
        )}
      </div>
    </div>
  )
}

/** Today's session from any plan, for the Home screen. */
export function TodayPlan() {
  const { db } = useApp()
  const statuses = lessonStatuses(db)
  const done = new Set([...statuses].filter(([, s]) => s === 'done').map(([id]) => id))
  const rows = db.all('SELECT course_id FROM plans').map((r) => getPlan(db, String(r.course_id))).filter((p): p is StudyPlan => !!p)
  if (!rows.length) return null
  return (
    <>
      {rows.map((plan) => {
        const st = planStatus(plan, done)
        const s = st.todays ?? st.next
        if (!s) return null
        const isToday = s.date === today()
        const left = s.items.filter((i) => !(i.k === 'lesson' && done.has(i.id!)))
        return (
          <div key={plan.course} className="card">
            <div className="row">
              <b className="grow">🗓️ {isToday ? "Today's plan" : `Next session · ${fmt(s.date)}`}</b>
              <Link to={`/plan/${plan.course}`} className="small">
                {plan.courseTitle.replace(/^AP /, '')} ›
              </Link>
            </div>
            <div className="stack" style={{ gap: 6, marginTop: 8 }}>
              {s.items.map((i, n) => {
                const finished = i.k === 'lesson' && done.has(i.id!)
                return (
                  <Link key={n} to={i.to ?? '/'} className={`session-item ${finished ? 'done' : ''}`}>
                    <span className="dot">{finished ? '✓' : ICON[i.k]}</span>
                    <span className="grow">{i.t}</span>
                    <span className="small muted">{i.m}′</span>
                  </Link>
                )
              })}
            </div>
            {isToday && !left.length && <p className="small" style={{ margin: '8px 0 0' }}>🌟 Today's plan is done. Amazing!</p>}
            {st.behind > 0 && (
              <p className="small muted" style={{ margin: '8px 0 0' }}>
                {st.behind} planned lesson{st.behind === 1 ? '' : 's'} from earlier days still waiting. No stress: they're at the top of your list.
              </p>
            )}
          </div>
        )
      })}
    </>
  )
}
