import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { COURSES, unitQuestions } from '../content'
import type { McqQuestion, Unit } from '../content/types'
import { CHEM_FRQS } from '../content/chem/frq'
import { useApp } from '../lib/app'
import { RichText, renderInline } from '../lib/RichText'
import { Progress, TopBar } from '../components/bits'
import { Cheer } from '../components/Cheer'
import { evaluateBadges, recordAttempt, saveExam, type BadgeDef } from '../lib/progress'
import { shuffle } from './Checkpoint'
import { choiceOrder } from '../lib/choices'

const course = COURSES[0]

const FORMATS = [
  { id: 'quick', name: 'Quick mix', count: 15, minutes: 22, desc: '15 multiple-choice questions from every unit' },
  { id: 'half', name: 'Half section', count: 30, minutes: 45, desc: '30 questions, about half of Section I' },
  { id: 'full', name: 'Full Section I', count: 60, minutes: 90, desc: '60 questions, like the real multiple-choice section' },
]

/** Pick MCQs across units in proportion to the official exam weighting (midpoints). */
function buildExam(count: number): McqQuestion[] {
  const units = course.units.filter((u) => u.weight)
  const mid = (u: Unit) => {
    const [a, b] = u.weight!.replace('%', '').split('–').map(Number)
    return (a + b) / 2
  }
  const total = units.reduce((s, u) => s + mid(u), 0)
  const picked: McqQuestion[] = []
  const quotas = units.map((u) => ({ u, n: Math.round((count * mid(u)) / total) }))
  let diff = count - quotas.reduce((s, q) => s + q.n, 0)
  for (let i = 0; diff !== 0; i = (i + 1) % quotas.length) {
    quotas[i].n += diff > 0 ? 1 : -1
    diff += diff > 0 ? -1 : 1
  }
  for (const { u, n } of quotas) {
    const pool = shuffle(unitQuestions(u).filter((q): q is McqQuestion => q.type === 'mcq'))
    picked.push(...pool.slice(0, n))
  }
  return shuffle(picked)
}

export function ExamHub() {
  const { db } = useApp()
  const history = db.all('SELECT exam_id, score, total, at FROM exams ORDER BY at DESC LIMIT 8')
  return (
    <div>
      <TopBar title="Practice exams" back="/learn" />
      <p className="muted small" style={{ marginTop: 0 }}>
        The real AP Chemistry exam has 60 multiple-choice questions (90 min) and 7 free-response questions (105 min).
        Practice here at your own pace. The timer is optional, and nothing here affects your lessons.
      </p>
      <div className="section-title">Multiple choice</div>
      <div className="stack">
        {FORMATS.map((f) => (
          <Link key={f.id} to={`/exam/mc/${f.id}`} className="lesson-item" style={{ marginBottom: 0 }}>
            <span className="status">📝</span>
            <span className="grow">
              <b>{f.name}</b>
              <div className="ced">
                {f.desc} · ~{f.minutes} min
              </div>
            </span>
            <span className="muted">›</span>
          </Link>
        ))}
      </div>
      <div className="section-title">Free response (self-scored)</div>
      <div className="stack">
        {CHEM_FRQS.map((f) => (
          <Link key={f.id} to={`/exam/frq/${f.id}`} className="lesson-item" style={{ marginBottom: 0 }}>
            <span className="status">✍️</span>
            <span className="grow">
              <b>{f.title}</b>
              <div className="ced">
                {f.kind === 'long' ? 'Long · 10 points' : 'Short · 4 points'} · Units {f.units.join(', ')}
              </div>
            </span>
            <span className="muted">›</span>
          </Link>
        ))}
      </div>
      {history.length > 0 && (
        <>
          <div className="section-title">Recent results</div>
          <div className="card small">
            {history.map((h, i) => (
              <div key={i} className="row" style={{ padding: '4px 0' }}>
                <span className="grow">{examName(String(h.exam_id))}</span>
                <b>
                  {String(h.score)}/{String(h.total)}
                </b>
                <span className="muted">{new Date(String(h.at)).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function examName(id: string) {
  const f = FORMATS.find((x) => `mc-${x.id}` === id)
  if (f) return f.name
  return CHEM_FRQS.find((x) => x.id === id)?.title ?? id
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function McExamPage() {
  const { format } = useParams()
  const f = FORMATS.find((x) => x.id === format) ?? FORMATS[0]
  const { db } = useApp()
  const [questions] = useState(() => buildExam(f.count))
  const [orders] = useState(() => Object.fromEntries(questions.map((q) => [q.id, choiceOrder(q.choices)])))
  const [started, setStarted] = useState(false)
  const [timer, setTimer] = useState(false)
  const [left, setLeft] = useState(f.minutes * 60)
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<Record<string, number>>({})
  const [result, setResult] = useState<{ score: number; badges: BadgeDef[]; mins: number } | null>(null)
  const [startAt] = useState(() => Date.now())

  useEffect(() => {
    if (!started || !timer || result) return
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [started, timer, result])

  function submit() {
    let score = 0
    for (const q of questions) {
      const ok = picks[q.id] === q.answer
      if (ok) score++
      if (q.id in picks) recordAttempt(db, q.id, `exam:mc-${f.id}`, ok, true)
    }
    const mins = Math.round((Date.now() - startAt) / 60000)
    saveExam(db, `mc-${f.id}`, score, questions.length, mins)
    setResult({ score, badges: evaluateBadges(db, course), mins })
    window.scrollTo(0, 0)
  }

  if (!started)
    return (
      <div>
        <TopBar title={f.name} back="/exam" />
        <div className="card stack">
          <h2>{f.name}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {f.count} questions drawn from all nine units, weighted like the real exam. You can move back and forth and change
            answers. You&apos;ll see your score and explanations at the end.
          </p>
          <label className="row" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={timer} onChange={(e) => setTimer(e.target.checked)} />
            <span>
              Show a countdown timer ({f.minutes} min) <span className="small muted">(optional)</span>
            </span>
          </label>
          <button className="btn block" onClick={() => setStarted(true)}>
            Start ▶
          </button>
        </div>
      </div>
    )

  if (result) {
    const pct = Math.round((result.score / questions.length) * 100)
    return (
      <div>
        <TopBar title="Results" back="/exam" />
        <div className="celebrate">
          <Cheer score={result.score} total={questions.length} headline={`${result.score} / ${questions.length} (${pct}%)`}>
            <div className="sub">
              {pct >= 80
                ? 'Excellent work under exam conditions!'
                : 'The questions you missed are listed below, with explanations. Reviewing them is how scores go up.'}
            </div>
          </Cheer>
          {result.badges.map((b) => (
            <div key={b.id} className="card" style={{ margin: '10px 0' }}>
              <div style={{ fontSize: 40 }}>{b.emoji}</div>
              <b>New badge: {b.name}</b>
            </div>
          ))}
        </div>
        <div className="section-title">Review</div>
        <div className="stack">
          {questions.map((q, i) => {
            const ok = picks[q.id] === q.answer
            return (
              <details key={q.id} className="card" open={!ok}>
                <summary style={{ cursor: 'pointer', fontWeight: 700 }}>
                  {ok ? '✅' : '🔁'} Question {i + 1}
                </summary>
                <div style={{ marginTop: 8 }}>
                  <RichText text={q.prompt} />
                  <p className="small">
                    Your answer: <b>{q.id in picks ? renderInline(q.choices[picks[q.id]]) : '(skipped)'}</b>
                    <br />
                    Correct: <b>{renderInline(q.choices[q.answer])}</b>
                  </p>
                  <div className="feedback show">
                    <RichText text={q.explain} />
                  </div>
                </div>
              </details>
            )
          })}
        </div>
        <Link to="/exam" className="btn secondary block" style={{ marginTop: 16 }}>
          Back to practice exams
        </Link>
      </div>
    )
  }

  const q = questions[idx]
  const answered = Object.keys(picks).length
  return (
    <div>
      <TopBar
        title={`${f.name}`}
        back="/exam"
        right={timer ? <span className="pill">⏱ {fmtTime(left)}</span> : undefined}
      />
      <Progress pct={(answered / questions.length) * 100} />
      <p className="small muted">
        Question {idx + 1} of {questions.length} · {answered} answered
        {timer && left === 0 ? ' · time is up (you can still finish)' : ''}
      </p>
      <div className="card" key={q.id}>
        <RichText text={q.prompt} />
        <div className="choices">
          {orders[q.id].map((i, pos) => (
            <button
              key={i}
              className="choice"
              onClick={() => setPicks((p) => ({ ...p, [q.id]: i }))}
              style={picks[q.id] === i ? { borderColor: 'var(--primary)', background: 'var(--primary-soft)' } : undefined}
            >
              <span className="letter">{'ABCDEFGH'[pos]}</span>
              <span>{renderInline(q.choices[i])}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="player-nav">
        <button className="btn secondary" style={{ flex: '0 0 auto' }} disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
          ←
        </button>
        {idx + 1 < questions.length ? (
          <button className="btn" onClick={() => setIdx(idx + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn good" onClick={submit}>
            Submit ({answered}/{questions.length}) ✓
          </button>
        )}
      </div>
    </div>
  )
}

export function FrqPage() {
  const { frqId } = useParams()
  const frq = useMemo(() => CHEM_FRQS.find((f) => f.id === frqId), [frqId])
  const { db } = useApp()
  const [shown, setShown] = useState<Record<number, boolean>>({})
  const [earned, setEarned] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState<{ score: number; badges: BadgeDef[] } | null>(null)
  if (!frq) return <TopBar title="Not found" back="/exam" />
  const total = frq.parts.reduce((n, p) => n + p.rubric.length, 0)
  const score = Object.values(earned).filter(Boolean).length
  const allShown = frq.parts.every((_, i) => shown[i])

  function finish() {
    saveExam(db, frq!.id, score, total, null)
    setDone({ score, badges: evaluateBadges(db, course) })
    window.scrollTo(0, 0)
  }

  if (done)
    return (
      <div>
        <TopBar title="FRQ score" back="/exam" />
        <div className="celebrate">
          <Cheer score={done.score} total={total} headline={`${done.score} / ${total} points`}>
            <div className="sub">Scoring yourself against a rubric teaches you to think like an AP grader.</div>
          </Cheer>
          {done.badges.map((b) => (
            <div key={b.id} className="card" style={{ margin: '10px 0' }}>
              <div style={{ fontSize: 40 }}>{b.emoji}</div>
              <b>New badge: {b.name}</b>
            </div>
          ))}
          <Link to="/exam" className="btn block" style={{ marginTop: 16 }}>
            Back to practice exams
          </Link>
        </div>
      </div>
    )

  return (
    <div>
      <TopBar title={frq.title} back="/exam" />
      <div className="card">
        <span className="kind frq">✍️ {frq.kind === 'long' ? 'Long FRQ · 10 pts' : 'Short FRQ · 4 pts'}</span>
        <RichText text={frq.intro} />
        <p className="small muted" style={{ marginBottom: 0 }}>
          Work each part on paper first (the real FRQs are handwritten), then reveal the model answer and tick the points you earned.
        </p>
      </div>
      <div className="stack" style={{ marginTop: 14 }}>
        {frq.parts.map((p, i) => (
          <div key={i} className="card">
            <b>{p.label}</b>
            <RichText text={p.prompt} />
            {!shown[i] ? (
              <button className="reveal" style={{ marginTop: 8 }} onClick={() => setShown((s) => ({ ...s, [i]: true }))}>
                I've written my answer. Show the model answer.
              </button>
            ) : (
              <div style={{ marginTop: 8 }}>
                <div className="answer-box">
                  <RichText text={p.answer} />
                </div>
                <div className="small" style={{ marginTop: 8, fontWeight: 700 }}>
                  Scoring guide: tick each point you earned
                </div>
                {p.rubric.map((r, j) => {
                  const key = `${i}-${j}`
                  return (
                    <label key={key} className="row" style={{ alignItems: 'flex-start', margin: '6px 0', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!earned[key]}
                        onChange={(e) => setEarned((s) => ({ ...s, [key]: e.target.checked }))}
                        style={{ marginTop: 5 }}
                      />
                      <span className="small">
                        <b>1 pt:</b> {renderInline(r)}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="player-nav">
        <button className="btn good" disabled={!allShown} onClick={finish}>
          {allShown ? `Save my score: ${score}/${total}` : 'Reveal every part to finish'}
        </button>
      </div>
    </div>
  )
}
