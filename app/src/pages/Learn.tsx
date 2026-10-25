import { Link, useParams } from 'react-router-dom'
import { BUILT, CATALOG, COURSES, examInfo } from '../content'
import { CATEGORIES } from '../../shared/catalog'
import { pickLimit, planOf, promoCourses, unlimited } from '../../shared/pricing'
import { usePricing } from '../lib/pricing'
import { openable, toggleInterest, useAccount } from '../lib/account'
import { getPlan } from '../lib/plans'
import { CourseGate } from './Plans'
import { Trademark } from '../components/Legal'
import { useApp, useCourse } from '../lib/app'
import { Progress, TopBar } from '../components/bits'
import type { Course } from '../content/types'
import { bestCheckpoint, lessonStatuses, stars, unitProgress } from '../lib/progress'
import { SearchButton, courseRefs } from '../components/Search'

export function LearnPage() {
  const { db } = useApp()
  const a = useAccount()
  const pricing = usePricing()
  const promo = promoCourses(pricing)
  const statuses = lessonStatuses(db)
  const mine = COURSES.filter((c) => openable(a, c.id, pricing))
  const ready = CATALOG.filter((c) => BUILT.has(c.id) && !mine.some((m) => m.id === c.id))
  const soon = CATALOG.filter((c) => !BUILT.has(c.id))
  const slots = unlimited(pricing, a.plan) ? 0 : pickLimit(pricing, a.plan) - a.courses.length
  const freeCount = planOf(pricing, 'free').courses ?? 0
  return (
    <div>
      <TopBar title="Learn" />
      {mine.length > 0 && <div className="section-title" style={{ marginTop: 0 }}>My courses</div>}
      <div className="stack">
        {mine.map((c) => {
          const all = c.units.flatMap((u) => u.lessons)
          const done = all.filter((l) => statuses.get(l.id) === 'done').length
          const plan = getPlan(db, c.id)
          return (
            <Link key={c.id} to={`/course/${c.id}`} className="card unit-card">
              <div className="unit-num" style={{ fontSize: 28 }}>
                {c.emoji}
              </div>
              <div className="grow">
                <h3>{c.title}</h3>
                <div className="small muted">
                  {done} of {all.length} lessons{plan ? ' · 🗓️ study plan on' : ''}
                </div>
                {promo.has(c.id) && !a.courses.includes(c.id) && !unlimited(pricing, a.plan) && !a.admin && (
                  <div className="small" style={{ color: 'var(--good)' }}>
                    🎁 Free for everyone until {new Date(promo.get(c.id)!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                )}
                <div style={{ marginTop: 6 }}>
                  <Progress pct={all.length ? (done / all.length) * 100 : 0} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {mine.length === 0 && (
        <div className="card notice">
          <b>Pick your first course</b>
          <div className="small">
            Your free plan includes any {freeCount === 1 ? 'one course' : `${freeCount} courses`}. Tap a course under Ready now to start.
          </div>
        </div>
      )}

      {ready.length > 0 && (
        <>
          <div className="section-title">Ready now</div>
          <div className="catalog">
            {ready.map((c) => (
              <Link key={c.id} to={`/course/${c.id}`} className="cat-item">
                <span className="cat-emoji">{c.emoji}</span>
                <span className="grow">
                  <b>{c.title}</b>
                  <span className="small muted">{slots > 0 ? `Tap to add · ${slots} free slot${slots === 1 ? '' : 's'} left` : 'Tap to see how to add it'}</span>
                </span>
                <span className="muted">›</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div className="section-title">Coming soon</div>
      <p className="small muted" style={{ marginTop: -4 }}>
        Tap the ones you want. The most-wanted courses are written first.
      </p>
      {CATEGORIES.map((cat) => {
        const list = soon.filter((c) => c.category === cat)
        if (!list.length) return null
        return (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div className="small muted" style={{ fontWeight: 800, margin: '6px 0' }}>
              {cat}
            </div>
            <div className="soon-grid">
              {list.map((c) => {
                const wanted = a.interest.includes(c.id)
                return (
                  <button key={c.id} className={`cat-item soon ${wanted ? 'want' : ''}`} onClick={() => toggleInterest(c.id)} aria-pressed={wanted}>
                    <span className="cat-emoji">{c.emoji}</span>
                    <span className="grow">
                      <b>{c.short}</b>
                      <span className="small muted">{wanted ? '★ Wanted' : 'Want it?'}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
      <Link to="/plans" className="small center" style={{ display: 'block', marginTop: 16 }}>
        Plans & course choices ›
      </Link>
      <Trademark className="tiny muted center" style={{ marginTop: 16 }} />
    </div>
  )
}

export function CoursePage() {
  const { courseId } = useParams()
  const course = useCourse(courseId)
  if (!course) return <TopBar title="Not found" back="/learn" />
  return (
    <CourseGate courseId={course.id}>
      <CourseMap course={course} />
    </CourseGate>
  )
}

function CourseMap({ course }: { course: Course }) {
  const { db } = useApp()
  const plan = getPlan(db, course.id)
  const statuses = lessonStatuses(db)

  return (
    <div>
      <TopBar title={course.title} back={`/home/${course.id}`} right={<SearchButton course={course} scopes={[{ label: 'Whole course', refs: courseRefs(course) }]} />} />
      <p className="muted small" style={{ marginTop: 0 }}>
        Units go from foundations to advanced ideas. Everything is open, so go in order or jump to what your class is doing.
      </p>
      <Link to={`/plan/${course.id}`} className="card row plan-cta">
        <span style={{ fontSize: 26 }}>🗓️</span>
        <span className="grow">
          <b>{plan ? 'My study plan' : 'Make my study plan'}</b>
          <span className="small muted" style={{ display: 'block' }}>
            {plan ? `${plan.sessions.length} sessions until your exam on ${new Date(plan.examDate + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : 'Answer 6 quick questions and get a day-by-day plan, with calendar reminders'}
          </span>
        </span>
        <span className="muted">›</span>
      </Link>
      <div className="row" style={{ marginBottom: 14 }}>
        <Link to={examInfo(course.id)?.path ?? '/exam'} className="btn secondary grow">🎓 Practice exams</Link>
        <Link to={`/course/${course.id}/syllabus`} className="btn secondary grow">📋 Syllabus</Link>
      </div>
      <div className="stack">
        {course.units.map((u) => {
          const p = unitProgress(u, statuses)
          const best = bestCheckpoint(db, u.id)
          return (
            <Link key={u.id} to={`/course/${course.id}/unit/${u.id}`} className="card unit-card">
              <div className={`unit-num ${p.pct === 100 ? 'done' : ''}`}>{p.pct === 100 ? u.badge.emoji : u.number}</div>
              <div className="grow">
                <div className="row" style={{ gap: 8 }}>
                  <h3 className="grow" style={{ fontSize: 17 }}>
                    {u.title}
                  </h3>
                  {u.weight && <span className="weight">{u.weight}</span>}
                </div>
                <div className="small muted">
                  {p.done}/{p.total} lessons
                  {best ? ` · checkpoint ${'★'.repeat(stars(best.score, best.total))}${'☆'.repeat(3 - stars(best.score, best.total))}` : ''}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Progress pct={p.pct} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      <p className="small muted" style={{ textAlign: 'center', marginTop: 16 }}>
        Orange tags show each unit's share of the AP® exam's multiple-choice section.
      </p>
    </div>
  )
}
