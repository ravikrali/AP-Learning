import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findUnit } from '../content'
import type { Level } from '../content/types'
import { useApp } from '../lib/app'
import { Progress, TopBar } from '../components/bits'
import { bestCheckpoint, bookmarks, lessonStatuses, stars, unitProgress } from '../lib/progress'
import { UnitTipsSheet } from '../components/Help'
import { SearchButton, courseRefs, unitRefs } from '../components/Search'
import { track } from '../lib/track'

const LEVELS: { id: Level; label: string; desc: string }[] = [
  { id: 'foundation', label: 'Foundation', desc: 'The building blocks' },
  { id: 'core', label: 'Core', desc: 'The main ideas the exam tests' },
  { id: 'advanced', label: 'Advanced', desc: 'Putting it all together' },
]

export function UnitPage() {
  const { courseId, unitId } = useParams()
  const found = findUnit(courseId, unitId)
  const { db } = useApp()
  const [tips, setTips] = useState(false)
  if (!found) return <TopBar title="Not found" back="/learn" />
  const { course, unit } = found
  const statuses = lessonStatuses(db)
  const p = unitProgress(unit, statuses)
  const best = bestCheckpoint(db, unit.id)
  const marked = new Set(bookmarks(db).map((b) => b.lessonId))
  const openTips = () => {
    setTips(true)
    track(db, 'unit_tips', { course: course.id, lesson: `unit:${unit.id}` })
  }

  return (
    <div>
      <TopBar
        title={unit.number === 0 ? unit.title : `Unit ${unit.number}`}
        back={`/course/${course.id}`}
        right={
          <>
            <SearchButton
              course={course}
              scopes={[
                { label: 'This unit', refs: unitRefs(course, unit) },
                { label: 'Whole course', refs: courseRefs(course) },
              ]}
            />
            <button className="icon-btn bulb" aria-label="Tips, tricks and shortcuts for this unit" onClick={openTips}>
              💡
            </button>
          </>
        }
      />
      {tips && <UnitTipsSheet unit={unit} onClose={() => setTips(false)} />}
      <div className="card">
        {unit.number > 0 && <h2>{unit.title}</h2>}
        <p className="muted" style={{ margin: '0 0 10px' }}>
          {unit.blurb}
        </p>
        <Progress pct={p.pct} />
        <div className="row small muted" style={{ marginTop: 6 }}>
          <span className="grow">
            {p.done}/{p.total} lessons done
          </span>
          {unit.weight && <span className="weight">{unit.weight} of exam</span>}
        </div>
      </div>

      {LEVELS.map((lv) => {
        const lessons = unit.lessons.filter((l) => l.level === lv.id)
        if (!lessons.length) return null
        return (
          <div key={lv.id}>
            <div className="level-head">
              <span className={`level-chip ${lv.id}`}>{lv.label}</span>
              <span className="small muted">{lv.desc}</span>
            </div>
            {lessons.map((l) => {
              const s = statuses.get(l.id) ?? 'new'
              return (
                <Link key={l.id} to={`/lesson/${l.id}`} className="lesson-item">
                  <span className={`status ${s}`}>{s === 'done' ? '✓' : s === 'started' ? '…' : ''}</span>
                  <span className="grow">
                    <b>{l.title}</b>
                    {marked.has(l.id) && <span className="mark-flag" aria-label="Bookmarked"> 🔖</span>}
                    <div className="ced">
                      {l.ced.length ? `CED ${l.ced.join(', ')} · ` : ''}
                      {l.minutes} min
                    </div>
                  </span>
                  <span className="muted">›</span>
                </Link>
              )
            })}
          </div>
        )
      })}

      <div className="level-head">
        <span className="level-chip core">Checkpoint</span>
        <span className="small muted">Optional: see how much has stuck</span>
      </div>
      <Link to={`/course/${course.id}/unit/${unit.id}/checkpoint`} className="lesson-item">
        <span className="status">🎯</span>
        <span className="grow">
          <b>Unit checkpoint</b>
          <div className="ced">
            {best
              ? `Best: ${best.score}/${best.total} ${'★'.repeat(stars(best.score, best.total))}`
              : '10 mixed questions · no timer · earn up to 3 stars'}
          </div>
        </span>
        <span className="muted">›</span>
      </Link>
    </div>
  )
}
