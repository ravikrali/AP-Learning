// Print-and-cut flashcards: 8 cards per sheet, the answers on the back of the same sheet (mirrored
// for double-sided printing), then the same cards as a compact review list for reading on screen.
import type { Course, GlossaryEntry } from '../../src/content/types'
import { COURSE_BOOKS } from './config'
import { BackPage, CopyrightPage, Cover, Inl, Logo, Mark, Outline, TocRow, plain, type Manifest } from './common'
import { unitLabel } from './textbook'

interface FlashCard {
  n: number
  front: string
  back: string
  tag: string
}

interface Deck {
  id: string
  title: string
  head: string
  cards: FlashCard[]
}

const PER_SHEET = 8

export function flashcards({ course, glossary, cedVersion, pad }: { course: Course; glossary: GlossaryEntry[]; cedVersion: string; pad: boolean }): {
  body: JSX.Element
  manifest: Manifest
} {
  const info = COURSE_BOOKS[course.id]
  const out = new Outline()
  let n = 0
  const decks: Deck[] = course.units.map((u) => ({
    id: `deck-${u.id}`,
    title: `${unitLabel(u)}: ${plain(u.title)}`,
    head: `${unitLabel(u)} · ${plain(u.title)}`,
    cards: u.lessons.flatMap((l, i) => l.flashcards.map((f) => ({ n: ++n, front: f.front, back: f.back, tag: `${u.number}.${i + 1} ${plain(l.title)}` }))),
  }))
  decks.push({
    id: 'deck-glossary',
    title: 'Key Terms (Glossary)',
    head: 'Key Terms',
    cards: glossary.map((g) => ({ n: ++n, front: g.term, back: g.def, tag: 'Key term' })),
  })
  const total = n

  out.add(1, 'Cover', 'cover')
  out.add(1, 'Copyright and notices', 'copyright')
  out.add(1, 'Contents', 'toc', 'Contents')
  out.add(1, 'How to Use These Cards', 'how-to', 'How to Use These Cards')
  out.add(1, 'Part 1: Cut-Out Flashcards', 'part-cards', 'Part 1 · Cut-Out Flashcards')
  for (const d of decks) out.add(2, d.title, d.id, `Flashcards · ${d.head}`)
  out.add(1, 'Part 2: Review Lists', 'part-lists', 'Part 2 · Review Lists')
  for (const d of decks) out.add(2, d.title, `list-${d.id}`, `Review List · ${d.head}`)
  out.add(1, 'About EzIQ', 'about-eziq', 'About EzIQ')

  const body = (
    <>
      <Cover course={course.id} product="flashcards" cedVersion={cedVersion} units={course.units.filter((u) => u.number > 0).length} extra={`${total} cards`} />
      <CopyrightPage course={course.id} product="flashcards" cedVersion={cedVersion} />
      <section className="front toc" id="toc">
        <h1 className="front-h">Contents</h1>
        <TocRow id="how-to" level={1}>How to Use These Cards</TocRow>
        <TocRow id="part-cards" level={0} num="1">Cut-Out Flashcards</TocRow>
        {decks.map((d) => (
          <TocRow key={d.id} id={d.id} level={2}>
            {d.title} <span className="muted">({d.cards.length} cards)</span>
          </TocRow>
        ))}
        <TocRow id="part-lists" level={0} num="2">Review Lists</TocRow>
        {decks.map((d) => (
          <TocRow key={d.id} id={`list-${d.id}`} level={2}>
            {d.title}
          </TocRow>
        ))}
      </section>
      <section className="front" id="how-to">
        <h1 className="front-h">How to Use These Cards</h1>
        <p className="lead">
          This set has {total} flashcards for {info.subject}: the key facts from every lesson, then every term in the glossary.
        </p>
        <h3>Printing</h3>
        <ol>
          <li>
            Print <b>Part 1</b> double-sided, and choose <b>flip on long edge</b>. Each sheet has 8 questions on the front and their 8 answers on the back,
            arranged so that each answer lands behind its question.
          </li>
          <li>Use card stock or heavier paper (about 65–110 lb) if your printer allows it, so the answers do not show through.</li>
          <li>Cut along the dashed lines. Every card shows its number on both sides, so you can check that they line up.</li>
        </ol>
        <p>
          Studying on a screen instead? Use <b>Part 2</b>, where every card is listed with its answer, unit by unit. Cover the right-hand column and test
          yourself.
        </p>
        <h3>Studying</h3>
        <ul>
          <li>
            <b>Say the answer out loud</b> before you flip the card. Recalling is what makes facts stick, not rereading.
          </li>
          <li>
            <b>Use three piles:</b> knew it, almost, and missed it. Review the missed pile every day, the almost pile every few days, and the knew-it pile
            once a week.
          </li>
          <li>
            <b>Mix units</b> once you have finished a few of them. The exam does not tell you which unit a question comes from.
          </li>
        </ul>
        <p className="muted small">The card fronts are labelled with the lesson they come from, numbered the same way as the {info.subject} textbook in this series.</p>
      </section>

      <section className="part-title" id="part-cards">
        <div className="chapter-kicker">Part 1</div>
        <h1 className="chapter-h">Cut-Out Flashcards</h1>
        <p className="lead">Print double-sided, flip on long edge, then cut along the dashed lines.</p>
      </section>
      {pad && BLANK_PAGE}
      {decks.map((d) => (
        <DeckSheets key={d.id} deck={d} />
      ))}

      <section className="part-title" id="part-lists">
        <div className="chapter-kicker">Part 2</div>
        <h1 className="chapter-h">Review Lists</h1>
        <p className="lead">Every card with its answer. Cover the answer column and quiz yourself.</p>
      </section>
      {decks.map((d) => (
        <section className="deck-list" key={d.id} id={`list-${d.id}`}>
          <h2 className="section-h">{d.title}</h2>
          <table className="data list">
            <tbody>
              {d.cards.map((c) => (
                <tr key={c.n}>
                  <td className="ln">{c.n}</td>
                  <td>
                    <Inl t={c.front} />
                  </td>
                  <td>
                    <Inl t={c.back} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      <BackPage course={course.id} cedVersion={cedVersion} />
    </>
  )
  return {
    body,
    manifest: {
      title: `EzIQ ${info.subject}: Flashcards`,
      subject: `${total} flashcards aligned to the ${info.ap} course framework (CED effective ${cedVersion})`,
      keywords: `${info.ap}, ${info.subject}, flashcards, EzIQ`,
      outline: out.entries,
      heads: out.heads,
      toc: 'toc',
    },
  }
}

function DeckSheets({ deck }: { deck: Deck }) {
  const sheets: FlashCard[][] = []
  for (let i = 0; i < deck.cards.length; i += PER_SHEET) sheets.push(deck.cards.slice(i, i + PER_SHEET))
  return (
    <>
      {sheets.map((s, k) => (
        <div key={k}>
          <div className="sheet-page front-side" id={k === 0 ? deck.id : undefined}>
            <div className="sheet-cap">
              {deck.title} · sheet {k + 1} of {sheets.length} · <b>questions</b>
            </div>
            <div className="sheet">
              {Array.from({ length: PER_SHEET }, (_, i) => (
                <CardFace key={i} card={s[i]} side="front" />
              ))}
            </div>
          </div>
          <div className="sheet-page back-side">
            <div className="sheet-cap">
              {deck.title} · sheet {k + 1} of {sheets.length} · <b>answers</b> (print on the back)
            </div>
            <div className="sheet">
              {Array.from({ length: PER_SHEET }, (_, i) => {
                // mirror left and right so each answer prints behind its question (long-edge flip)
                const j = i % 2 === 0 ? i + 1 : i - 1
                return <CardFace key={i} card={s[j]} side="back" />
              })}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

function CardFace({ card, side }: { card?: FlashCard; side: 'front' | 'back' }) {
  if (!card) return <div className="fcard empty" />
  const text = side === 'front' ? card.front : card.back
  const long = plain(text).length > 150
  return (
    <div className={`fcard fc-${side}`}>
      <div className="fc-top">
        <span className="fc-tag">{side === 'front' ? card.tag : 'Answer'}</span>
        <span className="fc-n">#{card.n}</span>
      </div>
      <div className={long ? 'fc-text long' : 'fc-text'}>
        {/* one span, so bold words and superscripts stay inline instead of becoming flex items */}
        <span>
          <Inl t={text} />
        </span>
      </div>
      <div className="fc-foot">
        {side === 'front' ? <Mark size={11} /> : <Logo size={10} />}
      </div>
    </div>
  )
}

/** Card sheets must start on an odd page so each front and its back share one sheet of paper (see build.mjs). */
const BLANK_PAGE = (
  <section className="blank-page">
    <p>This page is intentionally blank so the flashcard sheets print correctly on both sides.</p>
  </section>
)
