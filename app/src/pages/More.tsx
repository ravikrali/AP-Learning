import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COURSES, findLesson, glossary, glossaryCard, plainText } from '../content'
import { openable, useAccount } from '../lib/account'
import { useApp } from '../lib/app'
import { renderInline } from '../lib/RichText'
import { TopBar } from '../components/bits'
import { track } from '../lib/track'

/** The course whose glossary to show: her first course, or the first one that is built. */
function useMainCourse() {
  const a = useAccount()
  return COURSES.find((c) => openable(a, c.id)) ?? COURSES[0]
}

export function MorePage() {
  const { user } = useApp()
  const course = useMainCourse()
  const terms = glossary(course.id).length
  return (
    <div>
      <TopBar title="More" />
      <div className="more-grid">
        <Link to="/more/periodic-table" className="more-btn">
          <span className="more-ico" aria-hidden>
            <PeriodicIcon />
          </span>
          <b>Periodic table</b>
          <span className="small muted">Tap any element for quick facts</span>
        </Link>
        <Link to="/more/glossary" className="more-btn">
          <span className="more-ico" aria-hidden>
            📖
          </span>
          <b>Glossary</b>
          <span className="small muted">
            {terms} key terms · {course.short}
          </span>
        </Link>
      </div>

      <Link to="/me" className="card row plain-link" style={{ marginTop: 18 }}>
        {user.picture ? <img src={user.picture} alt="" width={40} height={40} className="avatar" referrerPolicy="no-referrer" /> : <span className="avatar ph">🙂</span>}
        <span className="grow">
          <b>{user.name}</b>
          <span className="small muted" style={{ display: 'block' }}>
            Profile, badges, plan, settings and help
          </span>
        </span>
        <span className="muted">›</span>
      </Link>
    </div>
  )
}

/** A tiny periodic-table outline. */
function PeriodicIcon() {
  const cells: [number, number][] = [
    [0, 0], [7, 0],
    [0, 1], [1, 1], [5, 1], [6, 1], [7, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
  ]
  return (
    <svg viewBox="0 0 34 18" width={56} height={30} aria-hidden>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * 4.2 + 0.4} y={y * 4.4 + 0.4} width={3.4} height={3.6} rx={0.8} fill="currentColor" opacity={y === 0 ? 0.55 : 0.9} />
      ))}
    </svg>
  )
}

export function GlossaryPage() {
  const course = useMainCourse()
  const { db } = useApp()
  useEffect(() => track(db, 'glossary', { course: course.id }), [db, course.id])
  const [q, setQ] = useState('')
  const all = useMemo(() => glossary(course.id).map((g) => ({ ...g, plain: plainText(g.term), low: `${plainText(g.term)} ${plainText(g.def)}`.toLowerCase() })), [course.id])
  const t = q.trim().toLowerCase()
  // term matches first, then matches inside definitions
  const rows = t ? [...all.filter((g) => g.plain.toLowerCase().includes(t)), ...all.filter((g) => !g.plain.toLowerCase().includes(t) && g.low.includes(t))] : all
  const letters = [...new Set(all.map((g) => g.plain[0].toUpperCase()))]

  return (
    <div>
      <TopBar title="Glossary" back="/more" />
      <p className="small muted" style={{ marginTop: 0 }}>
        {course.title}: {all.length} key terms. Tap a term to open the topic that explains it.
      </p>
      <input className="search-input" type="search" placeholder="Find a term" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a term" />
      {!t && (
        <div className="az" aria-label="Jump to a letter">
          {letters.map((l) => (
            <button key={l} onClick={() => document.getElementById(`az-${l}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })}>
              {l}
            </button>
          ))}
        </div>
      )}
      {rows.length === 0 && (
        <div className="empty">
          <div className="e">📖</div>
          <p>No term matches “{q.trim()}”.</p>
        </div>
      )}
      <div className="glossary">
        {rows.map((g, i) => {
          const ref = findLesson(g.lesson)
          const letter = g.plain[0].toUpperCase()
          const card = glossaryCard(g)
          const first = !t && (i === 0 || rows[i - 1].plain[0].toUpperCase() !== letter)
          return (
            <div key={g.term}>
              {first && (
                <div className="az-head" id={`az-${letter}`}>
                  {letter}
                </div>
              )}
              <Link to={`/lesson/${g.lesson}${card === null ? '' : `?card=${card}`}`} className="term">
                <b>{renderInline(g.term)}</b>
                <span>{renderInline(g.def)}</span>
                {ref && (
                  <span className="tiny muted">
                    {ref.unit.number === 0 ? ref.unit.title : `Unit ${ref.unit.number}`} · {ref.lesson.title} ›
                  </span>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
