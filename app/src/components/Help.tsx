import { useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { builtInYoutube, findLesson } from '../content'
import type { Unit } from '../content/types'
import { contentStore, youtubeOverride } from '../lib/overrides'
import { useApp } from '../lib/app'
import { track } from '../lib/track'
import { previousLesson, tipsFor, type Tricky } from '../lib/tips'
import { RichText } from '../lib/RichText'
import { Mascot } from './Mascot'
import { useMascotLook } from './Cheer'

export function useYoutube(lessonId: string) {
  useSyncExternalStore(contentStore.subscribe, contentStore.get)
  return youtubeOverride(lessonId) ?? builtInYoutube(lessonId)
}

/** Popular YouTube explanations of this topic (open in YouTube), or a search link when there are none. */
export function TopicVideos({ lessonId, compact }: { lessonId: string; compact?: boolean }) {
  const { db } = useApp()
  const ref = findLesson(lessonId)
  const videos = useYoutube(lessonId)
  if (!ref) return null
  const q = encodeURIComponent(`${ref.course.title} ${ref.lesson.ced[0] ?? ''} ${ref.lesson.title}`.replace(/\s+/g, ' '))
  const opened = () => track(db, 'video', { course: ref.course.id, lesson: lessonId })
  return (
    <div className={`yt ${compact ? 'compact' : ''}`}>
      <div className="yt-head">
        <b>▶️ More ways to learn it</b>
        <span className="small muted">Popular on YouTube</span>
      </div>
      {videos.map((v) => (
        <a key={v.id} className="yt-item" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" onClick={opened}>
          <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" width={120} height={68} />
          <span className="grow">
            <span className="yt-title">{v.title}</span>
            <span className="small muted">{v.channel}</span>
          </span>
        </a>
      ))}
      <a className="small yt-search" href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noreferrer" onClick={opened}>
        🔎 {videos.length ? 'Search YouTube for more' : 'Find videos on YouTube'}
      </a>
      <p className="tiny muted" style={{ margin: '6px 0 0' }}>
        Outside videos aren't checked line by line like our lessons. If one disagrees with a lesson, trust the lesson and tell us in Feedback.
      </p>
    </div>
  )
}

/** The quick-tip sheet: the lesson's own smart tricks and traps, a step back, and videos. */
export function TipSheet({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const ref = findLesson(lessonId)
  const look = useMascotLook()
  if (!ref) return null
  const tips = tipsFor(ref.lesson)
  const prev = previousLesson(lessonId)
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet tip-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Quick tips">
        <div className="row" style={{ alignItems: 'center' }}>
          <Mascot look={look} mood="encourage" size={64} />
          <div className="grow">
            <h3 style={{ margin: 0 }}>Quick tips</h3>
            <div className="small muted">
              Tricky topics are normal. Every expert got stuck here once. Here's what helps with <b>{ref.lesson.title}</b>:
            </div>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        {tips.tricks.map((t, i) => (
          <div key={`h${i}`} className="tip hack">
            <span className="kind hack">🪄 Smart trick</span>
            <b>{t.title}</b>
            <RichText text={t.body} />
          </div>
        ))}
        {tips.traps.map((t, i) => (
          <div key={`t${i}`} className="tip trap">
            <span className="kind trap">⚠️ Watch out</span>
            {t.title && <b>{t.title}</b>}
            <RichText text={t.body} />
          </div>
        ))}
        {!tips.tricks.length && !tips.traps.length && tips.summary.length > 0 && (
          <div className="tip">
            <span className="kind summary">📌 The key points</span>
            <ul className="rich" style={{ paddingLeft: 20, margin: 0 }}>
              {tips.summary.map((p, i) => (
                <li key={i}>
                  <RichText text={p} />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="tip">
          <b>Try this</b>
          <ul className="rich" style={{ paddingLeft: 20, margin: '4px 0 0' }}>
            <li>Re-read the worked example and cover the steps. Predict each one before you reveal it.</li>
            {prev && (
              <li>
                Feeling shaky on the basics? A quick look at{' '}
                <Link to={`/lesson/${prev.lesson.id}`} onClick={onClose}>
                  {prev.lesson.title}
                </Link>{' '}
                can make this one click.
              </li>
            )}
            <li>Watch one of the videos below, then come back and try the question again.</li>
          </ul>
        </div>
        <TopicVideos lessonId={lessonId} compact />
      </div>
    </div>
  )
}

/** Every smart trick and trap in a unit, in lesson order: the sheet behind the 💡 on the unit page. */
export function UnitTipsSheet({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const [show, setShow] = useState<'all' | 'tricks' | 'traps'>('all')
  const groups = unit.lessons
    .map((lesson) => ({ lesson, tips: tipsFor(lesson) }))
    .map((g) => ({ ...g, tricks: show === 'traps' ? [] : g.tips.tricks, traps: show === 'tricks' ? [] : g.tips.traps }))
    .filter((g) => g.tricks.length + g.traps.length > 0)
  const nTricks = unit.lessons.reduce((n, l) => n + tipsFor(l).tricks.length, 0)
  const nTraps = unit.lessons.reduce((n, l) => n + tipsFor(l).traps.length, 0)
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet tip-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Tips and tricks for this unit">
        <div className="row" style={{ alignItems: 'center' }}>
          <div className="grow">
            <h3 style={{ margin: 0 }}>💡 Tips, tricks & shortcuts</h3>
            <div className="small muted">{unit.number === 0 ? unit.title : `Unit ${unit.number}: ${unit.title}`}</div>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="seg" role="tablist" aria-label="Show">
          <button role="tab" aria-selected={show === 'all'} className={show === 'all' ? 'on' : ''} onClick={() => setShow('all')}>
            All {nTricks + nTraps}
          </button>
          <button role="tab" aria-selected={show === 'tricks'} className={show === 'tricks' ? 'on' : ''} onClick={() => setShow('tricks')}>
            🪄 Tricks {nTricks}
          </button>
          <button role="tab" aria-selected={show === 'traps'} className={show === 'traps' ? 'on' : ''} onClick={() => setShow('traps')}>
            ⚠️ Traps {nTraps}
          </button>
        </div>
        {groups.length === 0 && <p className="small muted center">Nothing here yet.</p>}
        {groups.map((g) => (
          <div key={g.lesson.id} className="tip-group">
            <Link to={`/lesson/${g.lesson.id}`} className="tip-group-head" onClick={onClose}>
              <b className="grow">{g.lesson.title}</b>
              <span className="small">Open ›</span>
            </Link>
            {g.tricks.map((t, i) => (
              <div key={`h${i}`} className="tip hack">
                <span className="kind hack">🪄 Smart trick</span>
                <b>{t.title}</b>
                <RichText text={t.body} />
              </div>
            ))}
            {g.traps.map((t, i) => (
              <div key={`t${i}`} className="tip trap">
                <span className="kind trap">⚠️ Watch out</span>
                {t.title && <b>{t.title}</b>}
                <RichText text={t.body} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Home-screen card: topics that seem hard right now. */
export function TrickyTopics({ items, onTip }: { items: Tricky[]; onTip: (lessonId: string) => void }) {
  if (!items.length) return null
  return (
    <div className="card">
      <div className="row">
        <b className="grow">💪 Topics to give some extra love</b>
      </div>
      <p className="small muted" style={{ margin: '4px 0 8px' }}>
        These have been tricky. That's how learning works: a quick tip and a second look usually do it.
      </p>
      <div className="stack" style={{ gap: 8 }}>
        {items.map((t) => (
          <div key={t.ref.lesson.id} className="tricky">
            <div className="grow">
              <b>{t.ref.lesson.title}</b>
              <div className="small muted">
                {t.why === 'accuracy'
                  ? `${t.stat.firstTryRight} of ${t.stat.attempts} right on the first try`
                  : `${Math.round(t.stat.seconds / 60)} min spent so far`}
              </div>
            </div>
            <button className="btn secondary" onClick={() => onTip(t.ref.lesson.id)}>
              💡 Tips
            </button>
            <Link className="btn ghost" to={`/lesson/${t.ref.lesson.id}`}>
              Review
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
