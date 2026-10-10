import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { findLesson, glossaryCard, type LessonRef } from '../content'
import type { Course, Unit } from '../content/types'
import { renderInline } from '../lib/RichText'
import { searchGlossary, searchLessons, words, type Hit } from '../lib/search'
import { useApp } from '../lib/app'
import { track } from '../lib/track'

export interface SearchScope {
  label: string
  refs: LessonRef[]
}

export const courseRefs = (course: Course): LessonRef[] =>
  course.units.flatMap((unit) => unit.lessons.map((lesson, index) => ({ course, unit, lesson, index })))
export const unitRefs = (course: Course, unit: Unit): LessonRef[] => unit.lessons.map((lesson, index) => ({ course, unit, lesson, index }))

/** Mark the typed words inside a result. */
function Marked({ text, query }: { text: string; query: string }) {
  const ws = words(query).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!ws.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${ws.join('|')})`, 'gi'))
  return <>{parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</>
}

/**
 * Search sheet for the course, unit and topic pages. `scopes` go from narrow to wide; the first is
 * selected. `onJump` handles a hit inside the lesson that is already open.
 */
export function SearchSheet({
  course,
  scopes,
  onClose,
  currentLesson,
  onJump,
}: {
  course: Course
  scopes: SearchScope[]
  onClose: () => void
  currentLesson?: string
  onJump?: (card: number | null) => void
}) {
  const nav = useNavigate()
  const { db } = useApp()
  useEffect(() => track(db, 'search', { course: course.id }), [db, course.id])
  const [q, setQ] = useState('')
  const [scope, setScope] = useState(0)
  const hits = useMemo(() => searchLessons(scopes[scope].refs, q), [scopes, scope, q])
  const terms = useMemo(() => searchGlossary(course.id, q), [course.id, q])
  // when the narrow scope finds nothing, say how many the widest one would find
  const wider = useMemo(
    () => (hits.length || scope === scopes.length - 1 ? 0 : searchLessons(scopes[scopes.length - 1].refs, q).length),
    [hits.length, scope, scopes, q],
  )

  function open(h: Hit) {
    onClose()
    if (h.lessonId === currentLesson && onJump) onJump(h.card)
    else nav(`/lesson/${h.lessonId}${h.card === null ? '' : `?card=${h.card}`}`)
  }

  const typed = q.trim().length >= 2
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet search-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search">
        <div className="row">
          <input className="search-input grow" type="search" autoFocus placeholder={`Search ${scopes[scope].label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          <button className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
        {scopes.length > 1 && (
          <div className="seg" role="tablist" aria-label="Where to search">
            {scopes.map((s, i) => (
              <button key={s.label} role="tab" aria-selected={scope === i} className={scope === i ? 'on' : ''} onClick={() => setScope(i)}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="search-results">
          {!typed && <p className="small muted center">Type a word or two: a topic, a formula name, a term like “limiting reactant”.</p>}

          {typed && terms.length > 0 && (
            <>
              <div className="search-group">Glossary</div>
              {terms.map((g) => {
                const ref = findLesson(g.lesson)
                return (
                  <button key={g.term} className="search-hit" onClick={() => open({ lessonId: g.lesson, card: glossaryCard(g) } as Hit)}>
                    <b>
                      📖 {renderInline(g.term)}
                    </b>
                    <span className="small">
                      {renderInline(g.def)}
                    </span>
                    {ref && <span className="tiny muted">Explained in {ref.lesson.title} ›</span>}
                  </button>
                )
              })}
            </>
          )}

          {typed && hits.length > 0 && (
            <>
              <div className="search-group">
                {hits.length === 40 ? 'Top 40 matches' : `${hits.length} match${hits.length === 1 ? '' : 'es'}`} in {scopes[scope].label.toLowerCase()}
              </div>
              {hits.map((h) => (
                <button key={`${h.lessonId}:${h.card}`} className="search-hit" onClick={() => open(h)}>
                  <b>
                    <Marked text={h.card === null ? h.lessonTitle : h.heading} query={q} />
                  </b>
                  <span className="small">
                    <Marked text={h.snippet} query={q} />
                  </span>
                  <span className="tiny muted">
                    {h.where}
                    {h.card === null ? '' : ` · ${h.lessonTitle}`} ›
                  </span>
                </button>
              ))}
            </>
          )}

          {typed && !hits.length && !terms.length && (
            <div className="empty" style={{ padding: '20px 10px' }}>
              <p>Nothing found for “{q.trim()}” in {scopes[scope].label.toLowerCase()}.</p>
              {wider > 0 && (
                <button className="btn secondary" onClick={() => setScope(scopes.length - 1)}>
                  Show {wider} in {scopes[scopes.length - 1].label.toLowerCase()}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** The 🔍 button and its sheet, ready to drop into a top bar. */
export function SearchButton(props: Omit<Parameters<typeof SearchSheet>[0], 'onClose'>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="icon-btn" aria-label="Search" onClick={() => setOpen(true)}>
        🔍
      </button>
      {/* outside the sticky top bar, so the sheet sits above the bottom menu */}
      {open && createPortal(<SearchSheet {...props} onClose={() => setOpen(false)} />, document.body)}
    </>
  )
}
