import { Link, useParams } from 'react-router-dom'
import { COURSES, UPCOMING } from '../content'
import { useApp, useCourse } from '../lib/app'
import { Progress, TopBar } from '../components/bits'
import { bestCheckpoint, lessonStatuses, stars, unitProgress } from '../lib/progress'

export function LearnPage() {
  const { db } = useApp()
  const statuses = lessonStatuses(db)
  // Only one course so far: go straight to its map, but keep a picker for later.
  return (
    <div>
      <TopBar title="Learn" />
      <div className="stack">
        {COURSES.map((c) => {
          const all = c.units.flatMap((u) => u.lessons)
          const done = all.filter((l) => statuses.get(l.id) === 'done').length
          return (
            <Link key={c.id} to={`/course/${c.id}`} className="card unit-card">
              <div className="unit-num" style={{ fontSize: 28 }}>
                {c.emoji}
              </div>
              <div className="grow">
                <h3>{c.title}</h3>
                <div className="small muted">
                  {done} of {all.length} lessons
                </div>
                <div style={{ marginTop: 6 }}>
                  <Progress pct={all.length ? (done / all.length) * 100 : 0} />
                </div>
              </div>
            </Link>
          )
        })}
        {UPCOMING.map((c) => (
          <div key={c.id} className="card unit-card" style={{ opacity: 0.6 }}>
            <div className="unit-num" style={{ fontSize: 28 }}>
              {c.emoji}
            </div>
            <div className="grow">
              <h3>{c.title}</h3>
              <div className="small muted">Coming soon</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CoursePage() {
  const { courseId } = useParams()
  const course = useCourse(courseId)
  const { db } = useApp()
  if (!course) return <TopBar title="Not found" back="/learn" />
  const statuses = lessonStatuses(db)

  return (
    <div>
      <TopBar title={course.title} back="/learn" />
      <p className="muted small" style={{ marginTop: 0 }}>
        Units go from foundations to advanced ideas. Everything is open, so go in order or jump to what your class is doing.
      </p>
      <div className="row" style={{ marginBottom: 14 }}>
        <Link to="/exam" className="btn secondary grow">🎓 Practice exams</Link>
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
        Orange tags show each unit's share of the AP exam's multiple-choice section.
      </p>
    </div>
  )
}
