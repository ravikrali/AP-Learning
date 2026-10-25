// The complete course textbook: every unit and lesson of a course, laid out as a printed book.
import type { Card, Course, CourseBook, Frq, GlossaryEntry, Lesson, Question, Unit } from '../../src/content/types'
import { Diagram } from '../../src/content/diagrams'
import { COURSE_BOOKS } from './config'
import {
  AnswerLine,
  BackPage,
  Callout,
  CopyrightPage,
  Cover,
  Icon,
  Inl,
  Outline,
  Pg,
  QuestionBody,
  Rich,
  TocRow,
  plain,
  type Manifest,
} from './common'
import { ExamFacts, FrqAnswers, FrqBlock, Reference, referenceTitle } from './shared-sections'

const LEVEL = { foundation: 'Foundation', core: 'Core', advanced: 'Advanced' } as const

export interface TextbookInput {
  course: Course
  book: CourseBook | null
  glossary: GlossaryEntry[]
  frqs: Frq[]
  frqKinds: Record<string, string>
  examAbout: string
  ced: { version: string; units: { number: number; title: string; weight: string }[]; topics: Record<string, string> }
}

export const unitLabel = (u: Unit) => (u.number === 0 ? 'Getting Started' : `Unit ${u.number}`)

/** Numbers every question, example and figure in a unit, in reading order. */
function numbering(unit: Unit) {
  const q = new Map<string, string>()
  let n = 0
  const tag = (id: string) => q.set(id, `${unit.number}-${++n}`)
  for (const l of unit.lessons) {
    for (const c of l.cards) if (c.kind === 'try') tag(c.question.id)
    l.check.forEach((x) => tag(x.id))
  }
  unit.checkpoint.forEach((x) => tag(x.id))
  return q
}

export function textbook(input: TextbookInput): { body: JSX.Element; manifest: Manifest } {
  const { course, book, glossary, frqs, ced } = input
  const info = COURSE_BOOKS[course.id]
  const out = new Outline()
  const lessonCount = course.units.reduce((s, u) => s + u.lessons.length, 0)
  const termsByLesson = new Map<string, GlossaryEntry[]>()
  for (const g of glossary) termsByLesson.set(g.lesson, [...(termsByLesson.get(g.lesson) ?? []), g])
  const lessonHome = new Map<string, { unit: Unit; index: number }>()
  course.units.forEach((u) => u.lessons.forEach((l, i) => lessonHome.set(l.id, { unit: u, index: i })))

  out.add(1, 'Cover', 'cover')
  out.add(1, 'Copyright and notices', 'copyright')
  out.add(1, 'Contents', 'toc', 'Contents')
  out.add(1, 'How to Use This Book', 'how-to', 'How to Use This Book')
  out.add(1, `About the ${info.ap} Exam`, 'exam-facts', `About the ${info.ap} Exam`)

  const body = (
    <>
      <Cover course={course.id} product="textbook" cedVersion={ced.version} units={course.units.filter((u) => u.number > 0).length} extra={`${lessonCount} lessons`} />
      <CopyrightPage course={course.id} product="textbook" cedVersion={ced.version} />

      <section className="front toc" id="toc">
        <h1 className="front-h">Contents</h1>
        <TocRow id="how-to" level={1}>How to Use This Book</TocRow>
        <TocRow id="exam-facts" level={1}>About the {info.ap} Exam</TocRow>
        {course.units.map((u) => (
          <div className="toc-unit" key={u.id}>
            <TocRow id={`u-${u.id}`} level={0} num={u.number === 0 ? '0' : String(u.number)}>
              {plain(u.title)}
            </TocRow>
            {u.lessons.map((l, i) => (
              <TocRow key={l.id} id={`l-${l.id}`} level={2} num={`${u.number}.${i + 1}`}>
                {plain(l.title)}
              </TocRow>
            ))}
            <TocRow id={`ur-${u.id}`} level={2}>{unitLabel(u)} Review</TocRow>
            <TocRow id={`ua-${u.id}`} level={2}>Answers and Explanations</TocRow>
          </div>
        ))}
        <div className="toc-unit">
          <TocRow id="appendix-frq" level={0} num="A">Free-Response Practice</TocRow>
          <TocRow id="appendix-frq-answers" level={2}>Free-Response Scoring Guides</TocRow>
          <TocRow id="glossary" level={0} num="B">Glossary</TocRow>
          <TocRow id="reference" level={0} num="C">{referenceTitle(info.reference)}</TocRow>
        </div>
      </section>

      <HowTo />
      <ExamFacts about={input.examAbout} ap={info.ap} ced={ced} frqKinds={input.frqKinds} />

      {course.units.map((u) => (
        <UnitChapter key={u.id} unit={u} book={book} out={out} ced={ced} termsByLesson={termsByLesson} />
      ))}

      <section className="appendix" id="appendix-frq">
        {out.add(1, 'Appendix A: Free-Response Practice', 'appendix-frq', 'Appendix A · Free-Response Practice') && null}
        <div className="chapter-kicker">Appendix A</div>
        <h1 className="chapter-h">Free-Response Practice</h1>
        <p className="lead">
          These original questions follow the format of the free-response section of the {info.ap} exam. Answer each part on paper, then score yourself
          with the scoring guides that follow. Each rubric point is worth 1 point.
        </p>
        {frqs.map((f, i) => (
          <FrqBlock key={f.id} frq={f} n={i + 1} kinds={input.frqKinds} answerId={`fa-${f.id}`} />
        ))}
      </section>
      <section className="appendix-sub" id="appendix-frq-answers">
        {out.add(2, 'Free-Response Scoring Guides', 'appendix-frq-answers') && null}
        <h1 className="section-h">Free-Response Scoring Guides</h1>
        {frqs.map((f, i) => (
          <FrqAnswers key={f.id} frq={f} n={i + 1} id={`fa-${f.id}`} back={`frq-${f.id}`} />
        ))}
      </section>

      <Glossary entries={glossary} lessonHome={lessonHome} out={out} />

      <section className="appendix" id="reference">
        {out.add(1, `Appendix C: ${referenceTitle(info.reference)}`, 'reference', `Appendix C · ${referenceTitle(info.reference)}`) && null}
        <div className="chapter-kicker">Appendix C</div>
        <h1 className="chapter-h">{referenceTitle(info.reference)}</h1>
        <Reference kind={info.reference} />
      </section>

      {out.add(1, `About ${'EzIQ'}`, 'about-eziq', 'About EzIQ') && null}
      <BackPage course={course.id} cedVersion={ced.version} />
    </>
  )

  return {
    body,
    manifest: {
      title: `EzIQ ${info.subject}: Complete Course Textbook`,
      subject: `A complete textbook aligned to the ${info.ap} course framework (CED effective ${ced.version})`,
      keywords: `${info.ap}, ${info.subject}, textbook, study guide, EzIQ`,
      outline: out.entries,
      heads: out.heads,
      toc: 'toc',
    },
  }
}

function HowTo() {
  return (
    <section className="front" id="how-to">
      <h1 className="front-h">How to Use This Book</h1>
      <p className="lead">
        This book teaches the whole course, one lesson at a time. Each unit opens with an overview and a map of its lessons, and closes with a unit review and
        fully explained answers.
      </p>
      <h3>Inside every lesson</h3>
      <ul>
        <li>
          <b>The big idea.</b> A short opening that tells you why the topic matters, followed by the main explanations.
        </li>
        <li>
          <b>Worked examples.</b> Problems solved step by step, the way you should write them on the exam.
        </li>
        <li>
          <b>A closer look.</b> Extra depth: the reasoning behind the rules, connections to other topics, and the details exam questions like to test.
        </li>
        <li>
          <b>Check your understanding.</b> A quick question in the middle of the lesson. Try it before reading on.
        </li>
        <li>
          <b>Key takeaways, key terms and quick recall.</b> What to remember, the vocabulary to know, and a few rapid-fire facts.
        </li>
        <li>
          <b>Review questions.</b> End-of-lesson practice. Answers and explanations are at the end of each unit.
        </li>
      </ul>
      <h3>Look out for these boxes</h3>
      <Callout kind="tip" label="Tip & Trick" title="A shortcut worth knowing">
        <p>Memory aids, shortcuts, and smart ways to think about a problem.</p>
      </Callout>
      <Callout kind="caution" label="Caution" title="A common mistake">
        <p>The errors students make most often, and how to avoid them.</p>
      </Callout>
      <Callout kind="exam" label="Exam Strategy">
        <p>How a topic shows up on the exam, and what graders look for in a full-credit answer.</p>
      </Callout>
      <Callout kind="key" label="Key Takeaways">
        <p>The few points from each lesson you should be able to recall without looking.</p>
      </Callout>
      <h3>Finding your way around</h3>
      <p>
        Everything in this book is linked. In the contents, the glossary, and every "see page" reference, click a title or page number to jump there. The
        running head at the top of each page links back to the contents, and your PDF reader's bookmarks panel shows the full outline. Each lesson is tagged
        with the CED topic numbers it covers, so you can match it to your class.
      </p>
    </section>
  )
}

function UnitChapter({
  unit,
  book,
  out,
  ced,
  termsByLesson,
}: {
  unit: Unit
  book: CourseBook | null
  out: Outline
  ced: TextbookInput['ced']
  termsByLesson: Map<string, GlossaryEntry[]>
}) {
  const nums = numbering(unit)
  const head = `${unitLabel(unit)}${unit.number === 0 ? ':' : ' ·'} ${unit.title}`
  out.add(1, `${unit.number === 0 ? 'Getting Started' : `Unit ${unit.number}`}: ${unit.title}`, `u-${unit.id}`, head)
  const topics = [...new Set(unit.lessons.flatMap((l) => l.ced))].sort((a, b) => Number(a.split('.')[1]) - Number(b.split('.')[1]))
  const examples = { n: 0 }
  const answerQs: { q: Question; where: string }[] = []
  for (const l of unit.lessons) {
    for (const c of l.cards) if (c.kind === 'try') answerQs.push({ q: c.question, where: l.title })
    for (const q of l.check) answerQs.push({ q, where: l.title })
  }
  return (
    <>
      <section className="unit-opener" id={`u-${unit.id}`}>
        <div className="unit-num">{unit.number === 0 ? '0' : unit.number}</div>
        <div className="chapter-kicker">{unit.number === 0 ? 'Getting Started · Foundations for the course' : `Unit ${unit.number}${unit.weight ? ` · ${unit.weight} of the multiple-choice section` : ''}`}</div>
        <h1 className="chapter-h">{plain(unit.title)}</h1>
        <p className="lead">
          <Inl t={unit.blurb} />
        </p>
        {book?.units[unit.id] && <Rich t={book.units[unit.id].overview} className="overview" />}
        <div className="unit-map">
          <h3>In this unit</h3>
          {unit.lessons.map((l, i) => (
            <a className="map-row" href={`#l-${l.id}`} key={l.id}>
              <span className="map-num">
                {unit.number}.{i + 1}
              </span>
              <span className="map-t">{plain(l.title)}</span>
              <span className={`lvl ${l.level}`}>{LEVEL[l.level]}</span>
              <span className="map-pg">
                p. <Pg to={`l-${l.id}`} />
              </span>
            </a>
          ))}
        </div>
        {topics.length > 0 && (
          <div className="ced-box">
            <h3>CED topics covered</h3>
            <ul className="ced-list">
              {topics.map((t) => (
                <li key={t}>
                  <b>{t}</b> {ced.topics[t]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <div className="unit-body" style={{ counterReset: `fig 0 unit ${unit.number}` }}>
        {unit.lessons.map((l, i) => (
          <LessonSection
            key={l.id}
            lesson={l}
            unit={unit}
            index={i}
            book={book}
            out={out}
            nums={nums}
            examples={examples}
            terms={termsByLesson.get(l.id) ?? []}
          />
        ))}
      </div>
      <section className="unit-review" id={`ur-${unit.id}`}>
        {out.add(2, `${unitLabel(unit)} Review`, `ur-${unit.id}`) && null}
        <div className="chapter-kicker">{unitLabel(unit)}</div>
        <h1 className="section-h">{unitLabel(unit)} Review</h1>
        <p className="muted">These questions mix the whole unit. Answers and explanations start on page <Pg to={`ua-${unit.id}`} />.</p>
        <div className="qlist">
          {unit.checkpoint.map((q) => (
            <QItem key={q.id} q={q} num={nums.get(q.id)!} />
          ))}
        </div>
      </section>
      <section className="answers" id={`ua-${unit.id}`}>
        {out.add(2, 'Answers and Explanations', `ua-${unit.id}`) && null}
        <h1 className="section-h">
          {unitLabel(unit)}: Answers and Explanations
        </h1>
        <div className="ans-list">
          {[...answerQs, ...unit.checkpoint.map((q) => ({ q, where: `${unitLabel(unit)} Review` }))].map(({ q, where }) => (
            <AnswerItem key={q.id} q={q} num={nums.get(q.id)!} where={where} />
          ))}
        </div>
      </section>
    </>
  )
}

function QItem({ q, num }: { q: Question; num: string }) {
  return (
    <div className="qitem" id={`q-${q.id}`}>
      <div className="qnum">
        <a href={`#a-${q.id}`}>{num}</a>
      </div>
      <div className="qbody">
        <QuestionBody q={q} />
      </div>
    </div>
  )
}

function AnswerItem({ q, num, where }: { q: Question; num: string; where: string }) {
  return (
    <div className="aitem" id={`a-${q.id}`}>
      <div className="ahead">
        <a href={`#q-${q.id}`} className="anum">
          {num}
        </a>
        <AnswerLine q={q} />
        <span className="awhere">
          {plain(where)} · <a href={`#q-${q.id}`}>p. <Pg to={`q-${q.id}`} /></a>
        </span>
      </div>
      <Rich t={q.explain} className="aexplain" />
    </div>
  )
}

function LessonSection({
  lesson,
  unit,
  index,
  book,
  out,
  nums,
  examples,
  terms,
}: {
  lesson: Lesson
  unit: Unit
  index: number
  book: CourseBook | null
  out: Outline
  nums: Map<string, string>
  examples: { n: number }
  terms: GlossaryEntry[]
}) {
  const id = `l-${lesson.id}`
  out.add(2, `${unit.number}.${index + 1} ${lesson.title}`, id)
  const extra = book?.lessons[lesson.id]
  const summary = lesson.cards.filter((c): c is Extract<Card, { kind: 'summary' }> => c.kind === 'summary')
  const cards = lesson.cards.filter((c) => c.kind !== 'summary')
  const hooks = cards.filter((c) => c.kind === 'hook')
  const rest = cards.filter((c) => c.kind !== 'hook')
  return (
    <section className="lesson" id={id}>
      <div className="lesson-head">
        <div className="kicker">
          <span className="lnum">
            Lesson {unit.number}.{index + 1}
          </span>
          {lesson.ced.length > 0 && <span>CED Topic{lesson.ced.length > 1 ? 's' : ''} {lesson.ced.join(', ')}</span>}
          <span className={`lvl ${lesson.level}`}>{LEVEL[lesson.level]}</span>
        </div>
        <h2 className="lesson-h">{plain(lesson.title)}</h2>
      </div>
      {hooks.map((h, i) => (
        <Rich key={i} t={(h as { body: string }).body} className="lead hook" />
      ))}
      {extra?.intro && <Rich t={extra.intro} />}
      {rest.map((c, i) => (
        <CardBlock key={i} card={c} nums={nums} examples={examples} unit={unit} />
      ))}
      {extra && extra.deeper.length > 0 && (
        <div className="deeper">
          {extra.deeper.map((d, i) => (
            <div className="deeper-sec" key={i}>
              <h3>
                <span className="deeper-tag">
                  <Icon name="deeper" />A closer look
                </span>
                {plain(d.title)}
              </h3>
              <Rich t={d.body} />
            </div>
          ))}
        </div>
      )}
      {summary.length > 0 && (
        <Callout kind="key" label="Key Takeaways">
          <ul>
            {summary.flatMap((s) => s.points).map((p, i) => (
              <li key={i}>
                <Inl t={p} />
              </li>
            ))}
          </ul>
        </Callout>
      )}
      {(terms.length > 0 || lesson.flashcards.length > 0) && (
        <div className="recall">
          {terms.length > 0 && (
            <div className="terms">
              <h4>Key terms</h4>
              <p>
                {terms.map((t, i) => (
                  <span key={t.term}>
                    {i > 0 && ' · '}
                    <a href={`#g-${slug(t.term)}`}>{plain(t.term)}</a>
                  </span>
                ))}
              </p>
            </div>
          )}
          {lesson.flashcards.length > 0 && (
            <div className="quick">
              <h4>Quick recall</h4>
              <table>
                <tbody>
                  {lesson.flashcards.map((f, i) => (
                    <tr key={i}>
                      <td>
                        <Inl t={f.front} />
                      </td>
                      <td>
                        <Inl t={f.back} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {lesson.check.length > 0 && (
        <div className="review-qs">
          <h3 className="rq-h">
            Review Questions <span className="muted small">· answers start on page <Pg to={`ua-${unit.id}`} /></span>
          </h3>
          <div className="qlist">
            {lesson.check.map((q) => (
              <QItem key={q.id} q={q} num={nums.get(q.id)!} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function CardBlock({ card, nums, examples, unit }: { card: Card; nums: Map<string, string>; examples: { n: number }; unit: Unit }) {
  switch (card.kind) {
    case 'concept':
      return (
        <div className="concept">
          <h3>{plain(card.title)}</h3>
          <Rich t={card.body} />
          {card.diagram && (
            <div className="fig">
              <Diagram id={card.diagram} />
            </div>
          )}
        </div>
      )
    case 'hack':
      return (
        <Callout kind="tip" label="Tip & Trick" title={card.title}>
          <Rich t={card.body} />
        </Callout>
      )
    case 'trap':
      return (
        <Callout kind="caution" label="Caution" title={card.title}>
          <Rich t={card.body} />
        </Callout>
      )
    case 'frq':
      return (
        <Callout kind="exam" label="Exam Strategy" title={card.title}>
          <Rich t={card.body} />
        </Callout>
      )
    case 'example': {
      const n = ++examples.n
      return (
        <div className="example">
          <div className="ex-head">
            <Icon name="example" />
            <span className="ex-label">
              Worked Example {unit.number}-{n}
            </span>
            <span className="ex-title">{plain(card.title)}</span>
          </div>
          <div className="ex-problem">
            <Rich t={card.problem} />
          </div>
          <div className="ex-sol">
            <div className="ex-sub">Solution</div>
            <ol className="steps">
              {card.steps.map((s, i) => (
                <li key={i}>
                  <Rich t={s} />
                </li>
              ))}
            </ol>
            <div className="ex-answer">
              <b>Answer:</b> <Inl t={card.answer} />
            </div>
          </div>
        </div>
      )
    }
    case 'try': {
      const q = card.question
      return (
        <div className="check" id={`q-${q.id}`}>
          <div className="check-head">
            <Icon name="check" />
            <span>Check Your Understanding</span>
            <span className="check-num">{nums.get(q.id)}</span>
          </div>
          <QuestionBody q={q} />
          {q.hint && (
            <p className="hint">
              <b>Hint:</b> <Inl t={q.hint} />
            </p>
          )}
          <p className="see">
            <a href={`#a-${q.id}`}>
              Answer and explanation: page <Pg to={`a-${q.id}`} />
            </a>
          </p>
        </div>
      )
    }
    default:
      return null
  }
}

export const slug = (s: string) =>
  plain(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function Glossary({ entries, lessonHome, out }: { entries: GlossaryEntry[]; lessonHome: Map<string, { unit: Unit; index: number }>; out: Outline }) {
  out.add(1, 'Appendix B: Glossary', 'glossary', 'Appendix B · Glossary')
  const groups = new Map<string, GlossaryEntry[]>()
  for (const g of entries) {
    const first = plain(g.term)[0].toUpperCase()
    const k = /[A-Z]/.test(first) ? first : '#'
    groups.set(k, [...(groups.get(k) ?? []), g])
  }
  return (
    <section className="appendix glossary" id="glossary">
      <div className="chapter-kicker">Appendix B</div>
      <h1 className="chapter-h">Glossary</h1>
      <p className="muted">Each term links to the lesson that teaches it.</p>
      <div className="gloss-cols">
        {[...groups].map(([k, gs]) => (
          <div key={k} className="gloss-group">
            <div className="gloss-letter">{k}</div>
            {gs.map((g) => {
              const home = lessonHome.get(g.lesson)
              return (
                <div className="gloss" key={g.term} id={`g-${slug(g.term)}`}>
                  <b>
                    <Inl t={g.term} />
                  </b>{' '}
                  <Inl t={g.def} />
                  {home && (
                    <a className="gloss-ref" href={`#l-${g.lesson}`}>
                      {' '}
                      → Lesson {home.unit.number}.{home.index + 1}, p. <Pg to={`l-${g.lesson}`} />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}
