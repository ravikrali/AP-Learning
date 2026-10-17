import { Link, useParams } from 'react-router-dom'
import { COURSES, cedInfo } from '../content'
import { useApp } from '../lib/app'
import { TopBar } from '../components/bits'
import { lessonStatuses } from '../lib/progress'

/** Every official College Board topic, the lesson(s) that teach it, and whether it's done. */
export function SyllabusPage() {
  const { db } = useApp()
  const { courseId } = useParams()
  const course = COURSES.find((c) => c.id === courseId)
  const ced = cedInfo(course?.id)
  const statuses = lessonStatuses(db)
  if (!course || !ced) return <TopBar title="Not found" back="/learn" />
  const { topics: CED_TOPICS, units: CED_UNITS } = ced
  const lessons = course.units.flatMap((u) => u.lessons)
  const byTopic = (t: string) => lessons.filter((l) => l.ced.includes(t))
  const topics = Object.keys(CED_TOPICS)
  const doneTopics = topics.filter((t) => byTopic(t).length && byTopic(t).every((l) => statuses.get(l.id) === 'done')).length

  return (
    <div>
      <TopBar title="Syllabus checklist" back={`/course/${course.id}`} />
      <p className="small muted" style={{ marginTop: 0 }}>
        All {topics.length} topics from the official {course.title} Course and Exam Description (College Board, effective {ced.version}),
        each linked to the lesson that teaches it. {doneTopics} of {topics.length} topics completed.
      </p>
      {CED_UNITS.map((u) => (
        <div key={u.number}>
          <div className="section-title">
            Unit {u.number}: {u.title} · {u.weight}
          </div>
          <div className="card small" style={{ padding: '6px 14px' }}>
            {topics
              .filter((t) => t.startsWith(`${u.number}.`))
              .map((t) => {
                const ls = byTopic(t)
                const done = ls.length > 0 && ls.every((l) => statuses.get(l.id) === 'done')
                return (
                  <div key={t} className="row" style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                    <span style={{ width: 22 }}>{done ? '✅' : '⬜'}</span>
                    <span className="grow">
                      <b>{t}</b> {CED_TOPICS[t]}
                      <div>
                        {ls.length ? (
                          ls.map((l) => (
                            <Link key={l.id} to={`/lesson/${l.id}`} style={{ marginRight: 10 }}>
                              {l.title}
                            </Link>
                          ))
                        ) : (
                          <span style={{ color: 'var(--oops)' }}>No lesson yet</span>
                        )}
                      </div>
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
