import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findFlashcard } from '../content'
import { useApp } from '../lib/app'
import { RichText } from '../lib/RichText'
import { Progress, TopBar } from '../components/bits'
import { Cheer } from '../components/Cheer'
import { pick, REVIEW_CHEERS } from '../lib/cheer'
import { dueCards, evaluateBadges, reviewCard } from '../lib/progress'

export function ReviewPage() {
  const { db } = useApp()
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
      <div>
        <TopBar title="Review" />
        <div className="empty">
          <div className="e">🌤️</div>
          <h3>Nothing due right now</h3>
          <p>Cards appear here after you finish lessons, then come back just before you'd forget them.</p>
          <Link to="/" className="btn">
            Back home
          </Link>
        </div>
      </div>
    )

  if (!fc)
    return (
      <div>
        <TopBar title="Review" />
        <div className="celebrate">
          <Cheer message={pick(REVIEW_CHEERS)} headline="All done for today!">
            <div className="sub">You reviewed {doneCount} cards. Each review makes the memory last longer.</div>
          </Cheer>
          <Link to="/" className="btn" style={{ marginTop: 16 }}>
            Back home
          </Link>
        </div>
      </div>
    )

  return (
    <div>
      <TopBar title="Today's review" />
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
