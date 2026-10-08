import { useState } from 'react'
import type { Question } from '../content/types'
import { RichText, renderInline } from '../lib/RichText'
import { choiceOrder } from '../lib/choices'

/** Accepts "0.0015", "1.5e-3", "1.5 x 10^-3", "1.5×10^(-3)", "1,250", with or without units after. */
export function parseNumber(input: string): number | null {
  let s = input.trim().replace(/,/g, '').replace(/\s+/g, '').replace(/−/g, '-')
  s = s.replace(/[×xX*]10\^\(?([+-]?\d+)\)?/, 'e$1')
  s = s.replace(/^10\^\(?([+-]?\d+)\)?/, '1e$1')
  const m = s.match(/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i)
  if (!m) return null
  const v = Number(m[0])
  return Number.isFinite(v) ? v : null
}

/** 0.00153 -> "1.53 × 10^{-3}", 18.015 -> "18.02" (markup for renderInline) */
export function fmtNum(v: number): string {
  const a = Math.abs(v)
  if (a !== 0 && (a < 1e-3 || a >= 1e5)) {
    const [m, e] = v.toExponential(2).split('e')
    return `${m} × 10^{${Number(e)}}`
  }
  return String(Number(v.toPrecision(4)))
}

export function numMatches(value: number, answer: number, tolerance = 0.02): boolean {
  if (answer === 0) return Math.abs(value) < 1e-9
  return Math.abs(value - answer) / Math.abs(answer) <= tolerance
}

type Status = 'open' | 'hint' | 'correct' | 'revealed'

interface Props {
  question: Question
  /** called once when the question is resolved */
  onResolved: (correct: boolean, firstTry: boolean) => number | void
  /** single attempt, no hint (checkpoints/exams) */
  oneTry?: boolean
}

const LETTERS = 'ABCDEFGH'

export function QuestionView({ question: q, onResolved, oneTry }: Props) {
  const [status, setStatus] = useState<Status>('open')
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [text, setText] = useState('')
  const [xp, setXp] = useState(0)
  const [bad, setBad] = useState(false)
  const [order] = useState(() => (q.type === 'mcq' ? choiceOrder(q.choices) : []))

  const finished = status === 'correct' || status === 'revealed'

  function resolve(correct: boolean, attemptsBefore: number) {
    const award = onResolved(correct, attemptsBefore === 0)
    if (typeof award === 'number') setXp(award)
  }

  function submit(correct: boolean, pick?: number) {
    const attemptsBefore = status === 'hint' ? 1 : 0
    if (correct) {
      setStatus('correct')
      resolve(true, attemptsBefore)
      return
    }
    if (pick !== undefined) setWrongPicks((w) => [...w, pick])
    if (attemptsBefore === 0 && !oneTry) {
      setStatus('hint')
    } else {
      setStatus('revealed')
      resolve(false, attemptsBefore)
    }
  }

  function checkNum() {
    if (q.type !== 'num') return
    const v = parseNumber(text)
    if (v === null) {
      setBad(true)
      return
    }
    setBad(false)
    submit(numMatches(v, q.answer, q.tolerance))
  }

  return (
    <div>
      <RichText text={q.prompt} />
      {q.type === 'mcq' ? (
        <div className="choices">
          {order.map((i, pos) => {
            const isRight = finished && i === q.answer
            const isWrong = wrongPicks.includes(i)
            return (
              <button
                key={i}
                className={`choice ${isRight ? 'right' : ''} ${isWrong ? 'picked-wrong' : ''}`}
                disabled={finished || isWrong}
                onClick={() => submit(i === q.answer, i)}
              >
                <span className="letter">{LETTERS[pos]}</span>
                <span>{renderInline(q.choices[i], `c${i}`)}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <>
          <div className="numrow">
            <input
              inputMode="decimal"
              placeholder="Your answer"
              value={text}
              disabled={finished}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !finished && checkNum()}
              aria-label="Your answer"
            />
            {q.unit && <span className="unit-tag">{renderInline(q.unit)}</span>}
            {!finished && (
              <button className="btn" onClick={checkNum} disabled={!text.trim()}>
                Check
              </button>
            )}
          </div>
          {bad && <p className="small muted">Type a number, like 0.25, 1.5e-3 or 1.5 x 10^-3.</p>}
        </>
      )}

      {status === 'hint' && (
        <div className="feedback hint">
          <b>Not quite, and that's okay!</b> {q.hint ? <RichText text={`💡 ${q.hint}`} /> : 'Take another look and try once more.'}
        </div>
      )}
      {status === 'correct' && (
        <div className="feedback good">
          <b>✅ Nice work!</b> {xp > 0 && <span className="xp-pop">+{xp} XP</span>}
          <RichText text={q.explain} />
        </div>
      )}
      {status === 'revealed' && (
        <div className="feedback show">
          <b>Here's how it works:</b>
          {q.type === 'num' && (
            <p>
              Answer: <b>{renderInline(fmtNum(q.answer))}</b> {q.unit && renderInline(q.unit)}
            </p>
          )}
          <RichText text={q.explain} />
          <p className="small muted">Mistakes are a normal part of learning. Reading the fix now is what makes it stick.</p>
        </div>
      )}
    </div>
  )
}
