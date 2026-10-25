// Practice exams and answer keys: full-length practice exams in the format of the real exam, then
// every other question in the course as a topic-by-topic question bank. Each question appears once.
import type { Course, Frq, McqQuestion, Question, Unit } from '../../src/content/types'
import { COURSE_BOOKS } from './config'
import { AnswerLine, BackPage, Callout, CopyrightPage, Cover, LETTERS, Outline, Pg, QuestionBody, Rich, TocRow, plain, type Manifest } from './common'
import { ExamFacts, FrqAnswers, FrqBlock, Reference, referenceTitle } from './shared-sections'
import { unitLabel } from './textbook'

export interface ExamInput {
  course: Course
  frqs: Frq[]
  frqKinds: Record<string, string>
  examAbout: string
  /** the real Section I: question count and minutes */
  section1: { count: number; minutes: number }
  ced: { version: string; units: { number: number; title: string; weight: string }[]; topics: Record<string, string> }
}

interface Item {
  q: Question
  unit: Unit
  lesson: string
}

interface PracticeExam {
  id: string
  name: string
  mcq: Item[]
  frqs: Frq[]
}

/** A small seeded random generator, so every build picks the same questions. */
function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 3432918353)
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function shuffle<T>(xs: T[], r: () => number) {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** "7–9%" → 8 */
const midWeight = (w?: string) => {
  const m = (w ?? '').match(/(\d+)\D+(\d+)/)
  return m ? (Number(m[1]) + Number(m[2])) / 2 : 0
}

/** How many questions each unit gets: proportional to its weight (largest remainders). */
function allocate(units: Unit[], count: number, available: Map<string, number>) {
  const w = units.map((u) => midWeight(u.weight))
  const total = w.reduce((s, x) => s + x, 0)
  const raw = units.map((_, i) => (count * w[i]) / total)
  const n = raw.map(Math.floor)
  const order = raw.map((x, i) => [x - Math.floor(x), i] as const).sort((a, b) => b[0] - a[0])
  for (let k = 0; k < count - n.reduce((s, x) => s + x, 0); k++) n[order[k % order.length][1]]++
  // never ask for more than a unit has; give the rest to the units with spare questions
  let spare = 0
  units.forEach((u, i) => {
    const have = available.get(u.id) ?? 0
    if (n[i] > have) {
      spare += n[i] - have
      n[i] = have
    }
  })
  while (spare > 0) {
    const i = units.findIndex((u, k) => (available.get(u.id) ?? 0) > n[k])
    if (i < 0) break
    n[i]++
    spare--
  }
  return n
}

export function plan(input: ExamInput) {
  const { course, frqs, section1 } = input
  const info = COURSE_BOOKS[course.id]
  const r = rng(`eziq-${course.id}-exams`)
  const items: Item[] = []
  for (const u of course.units)
    for (const l of u.lessons) {
      for (const c of l.cards) if (c.kind === 'try') items.push({ q: c.question, unit: u, lesson: l.title })
      for (const q of l.check) items.push({ q, unit: u, lesson: l.title })
    }
  for (const u of course.units) for (const q of u.checkpoint) items.push({ q, unit: u, lesson: `${unitLabel(u)} Review` })

  const examUnits = course.units.filter((u) => u.number > 0 && u.weight)
  const pool = new Map<string, Item[]>()
  for (const u of examUnits)
    pool.set(
      u.id,
      shuffle(
        items.filter((it) => it.unit === u && it.q.type === 'mcq'),
        r,
      ),
    )
  const used = new Set<string>()
  const kinds = [...new Set(frqs.map((f) => f.kind))]
  const exams: PracticeExam[] = info.exams.map((e, k) => {
    const avail = new Map([...pool].map(([id, xs]) => [id, xs.filter((x) => !used.has(x.q.id)).length]))
    const counts = allocate(examUnits, section1.count, avail)
    const mcq: Item[] = []
    examUnits.forEach((u, i) => {
      const take = pool.get(u.id)!.filter((x) => !used.has(x.q.id)).slice(0, counts[i])
      take.forEach((x) => used.add(x.q.id))
      mcq.push(...take)
    })
    let picked: Frq[] = []
    for (const rule of e.frqs) {
      if (rule === '*') picked = frqs
      else if (rule === 'first-of-each-kind') picked = kinds.map((kd) => frqs.find((f) => f.kind === kd)!).filter(Boolean)
      else if (rule === 'rest') {
        const first = new Set(kinds.map((kd) => frqs.find((f) => f.kind === kd)!.id))
        picked = frqs.filter((f) => !first.has(f.id))
      } else picked.push(...frqs.filter((f) => f.id === rule))
    }
    return { id: `exam${k + 1}`, name: e.name, mcq: shuffle(mcq, r), frqs: picked }
  })
  const bank = course.units.map((u) => ({ unit: u, items: items.filter((it) => it.unit === u && !used.has(it.q.id)) })).filter((b) => b.items.length > 0)
  return { exams, bank }
}

export function examBook(input: ExamInput): { body: JSX.Element; manifest: Manifest } {
  const { course, ced, frqKinds } = input
  const info = COURSE_BOOKS[course.id]
  const out = new Outline()
  const { exams, bank } = plan(input)
  const total = exams.reduce((s, e) => s + e.mcq.length, 0) + bank.reduce((s, b) => s + b.items.length, 0)
  const frqTotal = exams.reduce((s, e) => s + e.frqs.length, 0)

  out.add(1, 'Cover', 'cover')
  out.add(1, 'Copyright and notices', 'copyright')
  out.add(1, 'Contents', 'toc', 'Contents')
  out.add(1, 'How to Use This Book', 'how-to', 'How to Use This Book')
  out.add(1, `About the ${info.ap} Exam`, 'exam-facts', `About the ${info.ap} Exam`)

  const body = (
    <>
      <Cover
        course={course.id}
        product="exam"
        cedVersion={ced.version}
        units={course.units.filter((u) => u.number > 0).length}
        extra={`${total + frqTotal} questions, all explained`}
      />
      <CopyrightPage course={course.id} product="exam" cedVersion={ced.version} />
      <section className="front toc" id="toc">
        <h1 className="front-h">Contents</h1>
        <TocRow id="how-to" level={1}>How to Use This Book</TocRow>
        <TocRow id="exam-facts" level={1}>About the {info.ap} Exam</TocRow>
        {exams.map((e, k) => (
          <div className="toc-unit" key={e.id}>
            <TocRow id={e.id} level={0} num={String(k + 1)}>
              {e.name}
            </TocRow>
            <TocRow id={`${e.id}-s1`} level={2}>Section I: Multiple Choice ({e.mcq.length} questions)</TocRow>
            {e.frqs.length > 0 && <TocRow id={`${e.id}-s2`} level={2}>Section II: Free Response ({e.frqs.length} questions)</TocRow>}
            <TocRow id={`${e.id}-key`} level={2}>Answer Key and Explanations</TocRow>
            {e.frqs.length > 0 && <TocRow id={`${e.id}-frq-key`} level={2}>Free-Response Scoring Guides</TocRow>}
          </div>
        ))}
        <div className="toc-unit">
          <TocRow id="bank" level={0} num={String(exams.length + 1)}>Question Bank by Unit</TocRow>
          {bank.map((b) => (
            <TocRow key={b.unit.id} id={`bank-${b.unit.id}`} level={2}>
              {unitLabel(b.unit)}: {plain(b.unit.title)} ({b.items.length})
            </TocRow>
          ))}
          <TocRow id="bank-answers" level={2}>Question Bank Answers and Explanations</TocRow>
        </div>
        <div className="toc-unit">
          <TocRow id="reference" level={0} num="A">{referenceTitle(info.reference)}</TocRow>
        </div>
      </section>

      <section className="front" id="how-to">
        <h1 className="front-h">How to Use This Book</h1>
        <p className="lead">
          This book has {exams.length} full-length practice exams and a question bank, {total + frqTotal} questions in all. Every question has a full
          explanation, and no question appears twice.
        </p>
        <h3>Taking a practice exam</h3>
        <ol>
          <li>
            Set a timer. Section I: {input.section1.count} questions in {input.section1.minutes} minutes, about{' '}
            {Math.round((input.section1.minutes * 60) / input.section1.count)} seconds per question.
          </li>
          <li>Work without notes. Use only the tools the real exam allows (see the facts on the next page), and the reference pages at the back of this book.</li>
          <li>Mark your answers on paper, then check them with the answer key.</li>
          <li>
            Fill in the <b>score by unit</b> table after each answer key. It shows which units to study next.
          </li>
          <li>Read the explanation for every question you missed, and for any you guessed.</li>
        </ol>
        <h3>Using the question bank</h3>
        <p>
          The question bank is grouped by unit, so you can practice a unit as soon as you finish studying it. Multiple-choice questions have four or five
          choices; numeric questions ask you to work out a number, the way free-response questions do.
        </p>
        <Callout kind="tip" label="Tip & Trick" title="Make every mistake count">
          <p>
            Keep a list of the questions you miss and why (a concept you did not know, a careless slip, or running out of time). Each kind of mistake has a
            different fix.
          </p>
        </Callout>
        <p className="small muted">
          Everything is linked: click a question number to jump to its answer, and an answer number to jump back. Your PDF reader's bookmarks panel shows the
          full outline.
        </p>
      </section>

      <ExamFacts about={input.examAbout} ap={info.ap} ced={ced} frqKinds={frqKinds} />

      {exams.map((e, k) => (
        <ExamSection key={e.id} exam={e} k={k} out={out} input={input} />
      ))}

      <Bank bank={bank} out={out} />

      <section className="appendix" id="reference">
        {out.add(1, `Appendix A: ${referenceTitle(info.reference)}`, 'reference', `Appendix A · ${referenceTitle(info.reference)}`) && null}
        <div className="chapter-kicker">Appendix A</div>
        <h1 className="chapter-h">{referenceTitle(info.reference)}</h1>
        <Reference kind={info.reference} />
      </section>
      {out.add(1, 'About EzIQ', 'about-eziq', 'About EzIQ') && null}
      <BackPage course={course.id} cedVersion={ced.version} />
    </>
  )
  return {
    body,
    manifest: {
      title: `EzIQ ${info.subject}: Practice Exams & Answer Keys`,
      subject: `Practice exams and a question bank aligned to the ${info.ap} course framework (CED effective ${ced.version})`,
      keywords: `${info.ap}, ${info.subject}, practice exam, answer key, EzIQ`,
      outline: out.entries,
      heads: out.heads,
      toc: 'toc',
    },
  }
}

function ExamSection({ exam, k, out, input }: { exam: PracticeExam; k: number; out: Outline; input: ExamInput }) {
  const ids = new Map(exam.mcq.map((it, i) => [it.q.id, i + 1]))
  out.add(1, exam.name, exam.id, exam.name)
  out.add(2, 'Section I: Multiple Choice', `${exam.id}-s1`)
  if (exam.frqs.length) out.add(2, 'Section II: Free Response', `${exam.id}-s2`)
  out.add(2, 'Answer Key and Explanations', `${exam.id}-key`, `${exam.name} · Answer Key`)
  if (exam.frqs.length) out.add(2, 'Free-Response Scoring Guides', `${exam.id}-frq-key`)
  const units = [...new Set(exam.mcq.map((it) => it.unit))].sort((a, b) => a.number - b.number)
  return (
    <>
      <section className="exam-title" id={exam.id}>
        <div className="chapter-kicker">Part {k + 1}</div>
        <h1 className="chapter-h">{exam.name}</h1>
        <div className="exam-box" id={`${exam.id}-s1`}>
          <h3>Section I: Multiple Choice</h3>
          <p>
            <b>{exam.mcq.length} questions · {input.section1.minutes} minutes</b>
          </p>
          <p>
            Choose the one best answer for each question. There is no penalty for guessing, so answer every question. Questions come from every unit, in
            proportion to the exam weights.
          </p>
        </div>
        {exam.frqs.length > 0 && (
          <div className="exam-box">
            <h3>Section II: Free Response</h3>
            <p>
              <b>{exam.frqs.length} questions</b> · see page <Pg to={`${exam.id}-s2`} />
            </p>
            <p>Show all your work. Credit depends on the quality and completeness of your reasoning, not only on the final answer.</p>
          </div>
        )}
        <div className="answer-sheet">
          <h3>Answer sheet</h3>
          <div className="bubbles">
            {exam.mcq.map((it, i) => (
              <div key={it.q.id} className="bubble-row">
                <span className="bn">{i + 1}</span>
                {(it.q as McqQuestion).choices.map((_, c) => (
                  <span key={c} className="bubble">
                    {LETTERS[c]}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="exam-qs">
        <div className="qlist two-col">
          {exam.mcq.map((it, i) => (
            <div className="qitem" key={it.q.id} id={`q-${it.q.id}`}>
              <div className="qnum">
                <a href={`#a-${it.q.id}`}>{i + 1}</a>
              </div>
              <div className="qbody">
                <QuestionBody q={it.q} />
              </div>
            </div>
          ))}
        </div>
        <p className="end-mark">End of Section I</p>
      </section>
      {exam.frqs.length > 0 && (
        <section className="exam-frqs" id={`${exam.id}-s2`}>
          <h1 className="section-h">{exam.name} · Section II: Free Response</h1>
          {exam.frqs.map((f, i) => (
            <FrqBlock key={f.id} frq={f} n={i + 1} kinds={input.frqKinds} answerId={`${exam.id}-fa-${f.id}`} />
          ))}
          <p className="end-mark">End of {exam.name}</p>
        </section>
      )}
      <section className="answers" id={`${exam.id}-key`}>
        <h1 className="section-h">{exam.name} · Answer Key</h1>
        <table className="data keygrid">
          <tbody>
            {chunk(exam.mcq, 10).map((row, ri) => (
              <tr key={ri}>
                {row.map((it, ci) => (
                  <td key={ci}>
                    <a href={`#a-${it.q.id}`}>
                      <b>{ri * 10 + ci + 1}</b> {LETTERS[(it.q as McqQuestion).answer]}
                    </a>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Score by unit</h3>
        <table className="data">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Questions</th>
              <th className="r">Number</th>
              <th className="r">Your score</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const qs = exam.mcq.filter((it) => it.unit === u)
              return (
                <tr key={u.id}>
                  <td>
                    {u.number}. {plain(u.title)}
                  </td>
                  <td className="small">{qs.map((it) => ids.get(it.q.id)).sort((a, b) => a! - b!).join(', ')}</td>
                  <td className="r">{qs.length}</td>
                  <td className="r">____ / {qs.length}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <h3>Explanations</h3>
        <div className="ans-list">
          {exam.mcq.map((it, i) => (
            <Answer key={it.q.id} it={it} num={String(i + 1)} />
          ))}
        </div>
      </section>
      {exam.frqs.length > 0 && (
        <section className="answers" id={`${exam.id}-frq-key`}>
          <h1 className="section-h">{exam.name} · Free-Response Scoring Guides</h1>
          <p className="muted">Each rubric point is worth 1 point. Award a point only when the answer clearly does what the rubric line says.</p>
          {exam.frqs.map((f, i) => (
            <FrqAnswers key={f.id} frq={f} n={i + 1} id={`${exam.id}-fa-${f.id}`} back={`frq-${f.id}`} />
          ))}
        </section>
      )}
    </>
  )
}

function Answer({ it, num }: { it: Item; num: string }) {
  return (
    <div className="aitem" id={`a-${it.q.id}`}>
      <div className="ahead">
        <a href={`#q-${it.q.id}`} className="anum">
          {num}
        </a>
        <AnswerLine q={it.q} />
        <span className="awhere">
          {unitLabel(it.unit)} · {plain(it.lesson)}
        </span>
      </div>
      <Rich t={it.q.explain} className="aexplain" />
    </div>
  )
}

function Bank({ bank, out }: { bank: { unit: Unit; items: Item[] }[]; out: Outline }) {
  out.add(1, 'Question Bank by Unit', 'bank', 'Question Bank')
  for (const b of bank) out.add(2, `${unitLabel(b.unit)}: ${b.unit.title}`, `bank-${b.unit.id}`, `Question Bank · ${unitLabel(b.unit)}`)
  out.add(2, 'Answers and Explanations', 'bank-answers', 'Question Bank · Answers')
  const num = new Map<string, string>()
  for (const b of bank) b.items.forEach((it, i) => num.set(it.q.id, `${b.unit.number}-${i + 1}`))
  return (
    <>
      <section className="part-title" id="bank">
        <div className="chapter-kicker">Question Bank</div>
        <h1 className="chapter-h">Question Bank by Unit</h1>
        <p className="lead">
          Practice each unit as you finish it. Questions are numbered unit–question; answers and explanations start on page <Pg to="bank-answers" />.
        </p>
      </section>
      {bank.map((b) => (
        <section className="bank-unit" key={b.unit.id} id={`bank-${b.unit.id}`}>
          <div className="chapter-kicker">{unitLabel(b.unit)}</div>
          <h1 className="section-h">{plain(b.unit.title)}</h1>
          <div className="qlist two-col">
            {b.items.map((it) => (
              <div className="qitem" key={it.q.id} id={`q-${it.q.id}`}>
                <div className="qnum">
                  <a href={`#a-${it.q.id}`}>{num.get(it.q.id)}</a>
                </div>
                <div className="qbody">
                  <QuestionBody q={it.q} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="answers" id="bank-answers">
        <h1 className="section-h">Question Bank: Answers and Explanations</h1>
        {bank.map((b) => (
          <div key={b.unit.id}>
            <h2 className="ans-unit">
              {unitLabel(b.unit)}: {plain(b.unit.title)}
            </h2>
            <div className="ans-list">
              {b.items.map((it) => (
                <Answer key={it.q.id} it={it} num={num.get(it.q.id)!} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

const chunk = <T,>(xs: T[], n: number) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n))
