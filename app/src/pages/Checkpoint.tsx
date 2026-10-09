import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { findUnit, unitQuestions } from '../content'
import type { Question } from '../content/types'
import { useApp } from '../lib/app'
import { QuestionView } from '../components/QuestionView'
import { Progress, TopBar } from '../components/bits'
import { Cheer } from '../components/Cheer'
import { evaluateBadges, recordAttempt, saveCheckpoint, stars, type BadgeDef } from '../lib/progress'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function CheckpointPage() {
  const { courseId, unitId } = useParams()
  const found = findUnit(courseId, unitId)
  const { db } = useApp()
  const [round, setRound] = useState(0)
  const questions: Question[] = useMemo(() => (found ? shuffle(unitQuestions(found.unit)).slice(0, 10) : []), [found, round])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState<{ score: number; badges: BadgeDef[] } | null>(null)

  if (!found) return <TopBar title="Not found" back="/learn" />
  const { course, unit } = found
  const back = `/course/${course.id}/unit/${unit.id}`
  const q = questions[idx]
  const answered = q && q.id in answers

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1)
      window.scrollTo(0, 0)
      return
    }
    const score = Object.values(answers).filter(Boolean).length
    saveCheckpoint(db, unit.id, score, questions.length)
    setDone({ score, badges: evaluateBadges(db, course) })
  }

  if (done) {
    const s = stars(done.score, questions.length)
    return (
      <div>
        <TopBar title="Checkpoint" back={back} />
        <div className="celebrate">
          <Cheer score={done.score} total={questions.length} headline={`${done.score} / ${questions.length}`}>
            <div style={{ fontSize: 30 }}>{'⭐'.repeat(s)}</div>
            <div className="sub">
              {s === 3
                ? 'Three stars! This unit is really sticking.'
                : s === 2
                  ? 'A quick look back at the lessons you missed will get you to 3 stars.'
                  : "Checkpoints aren't grades. They just show what to review next."}
            </div>
          </Cheer>
          {done.badges.map((b) => (
            <div key={b.id} className="card" style={{ margin: '10px 0' }}>
              <div style={{ fontSize: 40 }}>{b.emoji}</div>
              <b>New badge: {b.name}</b>
            </div>
          ))}
          <div className="stack" style={{ marginTop: 16 }}>
            <button
              className="btn block"
              onClick={() => {
                setRound((r) => r + 1)
                setIdx(0)
                setAnswers({})
                setDone(null)
              }}
            >
              Try a fresh set
            </button>
            <Link className="btn secondary block" to={back}>
              Back to unit
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!q)
    return (
      <div>
        <TopBar title="Checkpoint" back={back} />
        <div className="empty">
          <div className="e">🛠️</div>
          <p>Questions for this unit are on the way.</p>
        </div>
      </div>
    )

  return (
    <div>
      <TopBar title={`Checkpoint · ${unit.number === 0 ? unit.title : `Unit ${unit.number}`}`} back={back} />
      <Progress pct={(idx / questions.length) * 100} />
      <p className="small muted">
        Question {idx + 1} of {questions.length} · no timer, one try each
      </p>
      <div className="card" key={`${round}-${idx}`}>
        <QuestionView
          question={q}
          oneTry
          onResolved={(correct, firstTry) => {
            setAnswers((a) => ({ ...a, [q.id]: correct }))
            recordAttempt(db, q.id, `checkpoint:${unit.id}`, correct, firstTry)
          }}
        />
      </div>
      <div className="player-nav">
        <button className="btn" disabled={!answered} onClick={next}>
          {idx + 1 < questions.length ? 'Next →' : 'See my stars ⭐'}
        </button>
      </div>
    </div>
  )
}
