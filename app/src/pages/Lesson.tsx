import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { findLesson, type LessonRef } from '../content'
import type { Card, Question } from '../content/types'
import { useApp } from '../lib/app'
import { RichText } from '../lib/RichText'
import { QuestionView } from '../components/QuestionView'
import { Cheer } from '../components/Cheer'
import { BookmarkIcon, NotesSheet, Progress, TopBar, VideoPlayer, useVideo, type VideoEntry } from '../components/bits'
import { Diagram } from '../content/diagrams'
import { completeLesson, evaluateBadges, isBookmarked, lessonRow, recordAttempt, saveCardIndex, setBookmark, type BadgeDef } from '../lib/progress'
import { SearchSheet, courseRefs, unitRefs } from '../components/Search'
import { track, useStudyTimer } from '../lib/track'
import { TipSheet, TopicVideos } from '../components/Help'
import { CourseGate } from './Plans'

type Step =
  | { t: 'card'; card: Card }
  | { t: 'video'; video: VideoEntry }
  | { t: 'check'; q: Question; n: number; of: number }
  | { t: 'finish' }

const KIND_LABEL: Record<string, string> = {
  hook: '🤔 Think about it',
  concept: '💡 Key idea',
  example: '🧪 Worked example',
  try: '✋ Your turn',
  hack: '🪄 Smart trick',
  trap: '⚠️ Watch out',
  frq: '✍️ FRQ corner',
  summary: '📌 Remember',
  video: '🎬 Watch',
  check: '✅ Quick check',
}

export function LessonPage() {
  const { lessonId } = useParams()
  const ref = findLesson(lessonId)
  if (!ref) return <TopBar title="Lesson not found" back="/learn" />
  return (
    <CourseGate courseId={ref.course.id}>
      <Player key={ref.lesson.id} refx={ref} />
    </CourseGate>
  )
}

function Player({ refx }: { refx: LessonRef }) {
  const { lesson, unit, course } = refx
  const { db } = useApp()
  const nav = useNavigate()
  const video = useVideo(lesson.id)
  useStudyTimer(db, { lesson: lesson.id, course: course.id, kind: 'lesson' })
  const [tipOpen, setTipOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [params] = useSearchParams()
  const marked = isBookmarked(db, lesson.id)

  const steps: Step[] = useMemo(() => {
    const s: Step[] = []
    let videoPlaced = false
    for (const card of lesson.cards) {
      s.push({ t: 'card', card })
      if (video && !videoPlaced && card.kind === 'concept') {
        s.push({ t: 'video', video })
        videoPlaced = true
      }
    }
    if (video && !videoPlaced) s.splice(1, 0, { t: 'video', video })
    lesson.check.forEach((q, n) => s.push({ t: 'check', q, n: n + 1, of: lesson.check.length }))
    s.push({ t: 'finish' })
    return s
  }, [lesson, video])

  const [idx, setIdx] = useState(() => {
    // opened from search or the glossary: start at that card
    const want = Number(params.get('card') ?? NaN)
    if (Number.isInteger(want) && want >= 0 && want < lesson.cards.length) return want
    const row = lessonRow(db, lesson.id)
    const saved = row && row.status !== 'done' ? Number(row.card_index) : 0
    return Math.min(saved, lesson.cards.length) // resume at most at the first quick-check question
  })
  const [resolved, setResolved] = useState<Record<string, { correct: boolean; firstTry: boolean }>>({})
  const [notesOpen, setNotesOpen] = useState(false)
  const [result, setResult] = useState<{ xp: number; badges: BadgeDef[]; correct: number; total: number } | null>(null)

  // After two questions missed on the first try, offer the lesson's own quick tips.
  const misses = Object.values(resolved).filter((r) => !(r.correct && r.firstTry)).length
  const openTip = () => {
    setTipOpen(true)
    track(db, 'tip', { course: course.id, lesson: lesson.id })
  }

  const step = steps[Math.min(idx, steps.length - 1)]
  const pct = (idx / (steps.length - 1)) * 100

  const needsAnswer =
    (step.t === 'card' && step.card.kind === 'try' && !resolved[step.card.question.id]) || (step.t === 'check' && !resolved[step.q.id])

  function go(to: number) {
    const clamped = Math.max(0, Math.min(to, steps.length - 1))
    if (steps[clamped].t === 'finish' && !result) finish()
    setIdx(clamped)
    if (steps[clamped].t !== 'finish') saveCardIndex(db, lesson.id, clamped)
    window.scrollTo(0, 0)
  }

  function finish() {
    const checks = lesson.check
    const correct = checks.filter((q) => resolved[q.id]?.correct).length
    const xp = completeLesson(db, lesson, correct, checks.length)
    const badges = evaluateBadges(db, course)
    setResult({ xp, badges, correct, total: checks.length })
  }

  function onResolved(q: Question) {
    return (correct: boolean, firstTry: boolean) => {
      setResolved((r) => ({ ...r, [q.id]: { correct, firstTry } }))
      return recordAttempt(db, q.id, lesson.id, correct, firstTry)
    }
  }

  const next = unit.lessons[refx.index + 1]

  /** Jump to one of this lesson's cards (from search). */
  function jump(card: number | null) {
    const at = card === null ? 0 : steps.findIndex((s) => s.t === 'card' && s.card === lesson.cards[card])
    go(Math.max(0, at))
  }

  return (
    <div className="player">
      <div className="player-top">
        <button className="icon-btn" aria-label="Close lesson" onClick={() => nav(`/course/${course.id}/unit/${unit.id}`)}>
          ✕
        </button>
        <Progress pct={pct} />
        <button className="icon-btn" aria-label="Search this topic" onClick={() => setSearchOpen(true)}>
          🔍
        </button>
        <button
          className={`icon-btn mark ${marked ? 'on' : ''}`}
          aria-label={marked ? 'Remove bookmark' : 'Bookmark this topic to review later'}
          aria-pressed={marked}
          onClick={() => setBookmark(db, lesson.id, !marked)}
        >
          <BookmarkIcon filled={marked} />
        </button>
        <button className="icon-btn" aria-label="My notes" onClick={() => setNotesOpen(true)}>
          📝
        </button>
      </div>

      <div className="lcard" key={idx}>
        {idx === 0 && (
          <div className="small muted" style={{ marginBottom: 6, fontWeight: 700 }}>
            {lesson.title} {lesson.ced.length ? `· CED ${lesson.ced.join(', ')}` : ''}
          </div>
        )}

        {step.t === 'card' && <CardView card={step.card} onResolved={onResolved} />}

        {step.t === 'video' && (
          <div className="card">
            <span className="kind video">{KIND_LABEL.video}</span>
            {step.video.title && <h2>{step.video.title}</h2>}
            <VideoPlayer video={step.video} />
          </div>
        )}

        {step.t === 'check' && (
          <div className="card">
            <span className="kind check">
              {KIND_LABEL.check} {step.n}/{step.of}
            </span>
            <QuestionView question={step.q} onResolved={onResolved(step.q)} />
          </div>
        )}

        {step.t === 'finish' && result && (
          <div className="celebrate">
            <Cheer score={result.correct} total={result.total} headline="Lesson complete!">
              {result.total > 0 && (
                <div className="sub">
                  Quick check: {result.correct} of {result.total}
                </div>
              )}
            </Cheer>
            {result.xp > 0 && <p className="xp-pop" style={{ fontSize: 22 }}>+{result.xp} XP</p>}
            {result.badges.map((b) => (
              <div key={b.id} className="card" style={{ margin: '10px 0' }}>
                <div style={{ fontSize: 40 }}>{b.emoji}</div>
                <b>New badge: {b.name}</b>
              </div>
            ))}
            {result.total > 0 && result.correct / result.total < 0.7 && (
              <button className="btn secondary block" style={{ marginTop: 12 }} onClick={openTip}>
                💡 Quick tips for this topic
              </button>
            )}
            <div style={{ marginTop: 14, textAlign: 'left' }}>
              <TopicVideos lessonId={lesson.id} />
            </div>
            <div className="stack" style={{ marginTop: 16 }}>
              <button className="btn secondary block" onClick={() => setNotesOpen(true)}>
                📝 Jot down what you learned
              </button>
              <button className="btn secondary block" onClick={() => setBookmark(db, lesson.id, !marked)}>
                {marked ? '🔖 Bookmarked · tap to remove' : '🔖 Bookmark to review later'}
              </button>
              {next ? (
                <Link className="btn block" to={`/lesson/${next.id}`}>
                  Next: {next.title} ▶
                </Link>
              ) : (
                <Link className="btn block" to={`/course/${course.id}/unit/${unit.id}/checkpoint`}>
                  🎯 Try the unit checkpoint
                </Link>
              )}
              <Link className="btn ghost block" to={`/course/${course.id}/unit/${unit.id}`}>
                Back to unit
              </Link>
            </div>
          </div>
        )}
      </div>

      {step.t !== 'finish' && misses >= 2 && (
        <button className="tip-fab" onClick={openTip}>
          💡 Quick tip
        </button>
      )}

      {step.t !== 'finish' && (
        <div className="player-nav">
          {idx > 0 && (
            <button className="btn secondary" style={{ flex: '0 0 auto' }} onClick={() => go(idx - 1)} aria-label="Previous">
              ←
            </button>
          )}
          <button className="btn" disabled={needsAnswer} onClick={() => go(idx + 1)}>
            {needsAnswer ? 'Answer to continue' : steps[idx + 1]?.t === 'finish' ? 'Finish 🎉' : 'Next →'}
          </button>
        </div>
      )}

      {searchOpen && (
        <SearchSheet
          course={course}
          currentLesson={lesson.id}
          onJump={jump}
          onClose={() => setSearchOpen(false)}
          scopes={[
            { label: 'This topic', refs: [refx] },
            { label: 'This unit', refs: unitRefs(course, unit) },
            { label: 'Whole course', refs: courseRefs(course) },
          ]}
        />
      )}
      {notesOpen && <NotesSheet lessonId={lesson.id} title={lesson.title} onClose={() => setNotesOpen(false)} />}
      {tipOpen && <TipSheet lessonId={lesson.id} onClose={() => setTipOpen(false)} />}
    </div>
  )
}

function CardView({ card, onResolved }: { card: Card; onResolved: (q: Question) => (c: boolean, f: boolean) => number }) {
  const label = <span className={`kind ${card.kind}`}>{KIND_LABEL[card.kind]}</span>
  switch (card.kind) {
    case 'hook':
    case 'hack':
    case 'trap':
    case 'frq':
      return (
        <div className="card">
          {label}
          {'title' in card && card.title && <h2>{card.title}</h2>}
          <RichText text={card.body} />
        </div>
      )
    case 'concept':
      return (
        <div className="card">
          {label}
          <h2>{card.title}</h2>
          <RichText text={card.body} />
          {card.diagram && <Diagram id={card.diagram} />}
        </div>
      )
    case 'example':
      return <ExampleView card={card} label={label} />
    case 'try':
      return (
        <div className="card">
          {label}
          <QuestionView question={card.question} onResolved={onResolved(card.question)} />
        </div>
      )
    case 'summary':
      return (
        <div className="card">
          {label}
          <ul className="rich" style={{ paddingLeft: 22, margin: 0 }}>
            {card.points.map((p, i) => (
              <li key={i} style={{ margin: '8px 0' }}>
                <RichText text={p} />
              </li>
            ))}
          </ul>
        </div>
      )
  }
}

/** Worked example with steps revealed one at a time, so she can predict each step first. */
function ExampleView({ card, label }: { card: Extract<Card, { kind: 'example' }>; label: React.ReactNode }) {
  const [shown, setShown] = useState(0)
  const allShown = shown >= card.steps.length
  return (
    <div className="card">
      {label}
      <h2>{card.title}</h2>
      <RichText text={card.problem} />
      {card.steps.slice(0, shown).map((s, i) => (
        <div className="step" key={i}>
          <span className="n">{i + 1}</span>
          <div className="grow">
            <RichText text={s} />
          </div>
        </div>
      ))}
      {!allShown ? (
        <button className="reveal" onClick={() => setShown((n) => n + 1)}>
          {shown === 0 ? '🤔 Think first, then tap for step 1' : `Tap for step ${shown + 1}`}
        </button>
      ) : (
        <div className="answer-box">
          <RichText text={`**Answer:** ${card.answer}`} />
        </div>
      )}
    </div>
  )
}
