import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { findFlashcard, findLesson } from '../content'
import { useApp } from '../lib/app'
import { RichText } from '../lib/RichText'
import { BookmarkIcon, NoteEditor, Progress, TopBar } from '../components/bits'
import { Cheer } from '../components/Cheer'
import { pick, REVIEW_CHEERS } from '../lib/cheer'
import { bookmarks, dueCards, dueCount, evaluateBadges, lessonStatuses, reviewCard, setBookmark } from '../lib/progress'
import { useStudyTimer } from '../lib/track'

type Tab = 'cards' | 'bookmarks' | 'notes'
const TABS: Tab[] = ['cards', 'bookmarks', 'notes']

/** Everything to look at again, in one place: today's flashcards, bookmarked topics and her notes. */
export function ReviewPage() {
  const { db } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = (TABS.includes(params.get('tab') as Tab) ? params.get('tab') : 'cards') as Tab
  const due = dueCount(db)
  const nMarks = bookmarks(db).filter((b) => findLesson(b.lessonId)).length
  const nNotes = Number(db.get('SELECT COUNT(*) AS n FROM notes')?.n ?? 0)
  const labels: Record<Tab, string> = {
    cards: `🃏 Cards${due ? ` ${due}` : ''}`,
    bookmarks: `🔖 Bookmarks${nMarks ? ` ${nMarks}` : ''}`,
    notes: `📝 Notes${nNotes ? ` ${nNotes}` : ''}`,
  }
  return (
    <div>
      <TopBar title="Review" />
      <div className="seg" role="tablist" aria-label="What to review">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setParams(t === 'cards' ? {} : { tab: t }, { replace: true })}>
            {labels[t]}
          </button>
        ))}
      </div>
      {tab === 'cards' && <Flashcards />}
      {tab === 'bookmarks' && <BookmarkList />}
      {tab === 'notes' && <NotesList />}
    </div>
  )
}

function Flashcards() {
  const { db } = useApp()
  useStudyTimer(db, { kind: 'review' })
  const [queue, setQueue] = useState<string[]>(() => dueCards(db).filter((id) => findFlashcard(id)))
  const [total] = useState(queue.length)
  const [flipped, setFlipped] = useState(false)
  const [doneCount, setDoneCount] = useState(0)
  const [retried, setRetried] = useState<Set<string>>(new Set())

  const current = queue[0]
  const fc = current ? findFlashcard(current) : undefined

  function answer(knew: boolean) {
    if (!current) return
    if (!retried.has(current)) reviewCard(db, current, knew)
    const rest = queue.slice(1)
    // If she didn't know it, show it once more at the end of this session.
    if (!knew && !retried.has(current)) {
      rest.push(current)
      setRetried(new Set(retried).add(current))
    } else setDoneCount((n) => n + 1)
    setQueue(rest)
    setFlipped(false)
    if (!rest.length) evaluateBadges(db, fc!.course)
  }

  if (total === 0)
    return (
      <div className="empty">
        <div className="e">🌤️</div>
        <h3>Nothing due right now</h3>
        <p>Cards appear here after you finish lessons, then come back just before you'd forget them.</p>
        <Link to="/" className="btn">
          Back home
        </Link>
      </div>
    )

  if (!fc)
    return (
      <div className="celebrate">
        <Cheer message={pick(REVIEW_CHEERS)} headline="All done for today!">
          <div className="sub">You reviewed {doneCount} cards. Each review makes the memory last longer.</div>
        </Cheer>
        <Link to="/" className="btn" style={{ marginTop: 16 }}>
          Back home
        </Link>
      </div>
    )

  return (
    <div>
      <Progress pct={(doneCount / total) * 100} />
      <p className="small muted">
        {doneCount} of {total} · from <b>{fc.lesson.title}</b>
      </p>
      <div className="flash" onClick={() => setFlipped((f) => !f)} role="button" aria-label="Flip card">
        <div className={`flash-inner ${flipped ? 'flipped' : ''}`}>
          <div className="card flash-face">
            <RichText text={fc.card.front} />
            <p className="small muted" style={{ marginTop: 16 }}>
              Think of the answer, then tap to flip
            </p>
          </div>
          <div className="card flash-face back">
            <RichText text={fc.card.back} />
          </div>
        </div>
      </div>
      {flipped ? (
        <div className="player-nav with-tabs">
          <button className="btn warm" onClick={() => answer(false)}>
            Not yet 🔁
          </button>
          <button className="btn good" onClick={() => answer(true)}>
            Got it ✓
          </button>
        </div>
      ) : (
        <div className="player-nav with-tabs">
          <button className="btn" onClick={() => setFlipped(true)}>
            Show answer
          </button>
        </div>
      )}
    </div>
  )
}

function BookmarkList() {
  const { db } = useApp()
  const statuses = lessonStatuses(db)
  const rows = bookmarks(db)
    .map((b) => ({ ...b, ref: findLesson(b.lessonId) }))
    .filter((b) => b.ref)
  if (!rows.length)
    return (
      <div className="empty">
        <div className="e">🔖</div>
        <h3>No bookmarks yet</h3>
        <p>
          Inside any topic, tap the bookmark at the top to save it for later. It will be waiting for you here.
        </p>
        <Link to="/learn" className="btn">
          Go to my courses
        </Link>
      </div>
    )
  return (
    <div className="stack">
      {rows.map((b) => {
        const { lesson, unit } = b.ref!
        const s = statuses.get(lesson.id) ?? 'new'
        return (
          <div key={lesson.id} className="card row bookmark-row">
            <Link to={`/lesson/${lesson.id}`} className="grow plain-link">
              <b>{lesson.title}</b>
              <div className="small muted">
                {unit.number === 0 ? unit.title : `Unit ${unit.number}`} · {lesson.minutes} min · {s === 'done' ? 'finished ✓' : s === 'started' ? 'in progress' : 'not started'}
              </div>
              <div className="tiny muted">Saved {new Date(b.at).toLocaleDateString()}</div>
            </Link>
            <button className="icon-btn mark on" aria-label={`Remove bookmark: ${lesson.title}`} onClick={() => setBookmark(db, lesson.id, false)}>
              <BookmarkIcon filled />
            </button>
          </div>
        )
      })}
    </div>
  )
}

function NotesList() {
  const { db } = useApp()
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const all = db
    .all('SELECT lesson_id, body, updated_at FROM notes ORDER BY updated_at DESC')
    .map((r) => ({ id: String(r.lesson_id), body: String(r.body), at: String(r.updated_at), ref: findLesson(String(r.lesson_id)) }))
    .filter((r) => r.ref)
  const rows = all.filter((r) => !q || (r.body + r.ref!.lesson.title).toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      {all.length > 0 && <input className="search-input" type="search" placeholder="Search my notes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search my notes" />}
      {rows.length === 0 && (
        <div className="empty">
          <div className="e">📝</div>
          <p>{q ? 'No notes match.' : 'Notes you write in lessons (tap 📝) show up here. Writing ideas in your own words is one of the best ways to remember them.'}</p>
        </div>
      )}
      <div className="stack">
        {rows.map((r) => (
          <div key={r.id} className="card">
            <div className="row" onClick={() => setOpen(open === r.id ? null : r.id)} style={{ cursor: 'pointer' }}>
              <div className="grow">
                <b>{r.ref!.lesson.title}</b>
                <div className="small muted">
                  {r.ref!.unit.number === 0 ? r.ref!.unit.title : `Unit ${r.ref!.unit.number}`} · edited {new Date(r.at).toLocaleDateString()}
                </div>
              </div>
              <span className="muted">{open === r.id ? '▾' : '▸'}</span>
            </div>
            {open === r.id ? (
              <div style={{ marginTop: 10 }}>
                <NoteEditor lessonId={r.id} />
                <Link to={`/lesson/${r.id}`} className="small">
                  Open lesson →
                </Link>
              </div>
            ) : (
              <p className="small" style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', maxHeight: 66, overflow: 'hidden' }}>
                {r.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
