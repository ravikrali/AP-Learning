import { Link } from 'react-router-dom'
import { COURSES } from '../content'
import { CED_TOPICS, CED_UNITS } from '../content/chem/ced'
import { useApp } from '../lib/app'
import { TopBar } from '../components/bits'
import { lessonStatuses } from '../lib/progress'

/** Every official College Board topic, the lesson(s) that teach it, and whether it's done. */
export function SyllabusPage() {
  const { db } = useApp()
  const statuses = lessonStatuses(db)
  const lessons = COURSES[0].units.flatMap((u) => u.lessons)
  const byTopic = (t: string) => lessons.filter((l) => l.ced.includes(t))
  const topics = Object.keys(CED_TOPICS)
  const doneTopics = topics.filter((t) => byTopic(t).length && byTopic(t).every((l) => statuses.get(l.id) === 'done')).length

  return (
    <div>
      <TopBar title="Syllabus checklist" back="/course/chem" />
      <p className="small muted" style={{ marginTop: 0 }}>
        All {topics.length} topics from the official AP Chemistry Course and Exam Description (College Board, effective Fall 2024),
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
