// Pieces shared by the textbook, the flashcards and the practice-exam book.
import type { ReactNode } from 'react'
import { RichText, renderInline } from '../../src/lib/RichText'
import type { Question } from '../../src/content/types'
import { BRAND_INFO, COURSE_BOOKS, PRODUCT_NAMES, PUBLISHER, notices, type Product } from './config'
import markSvg from './brand/eziq-mark.svg?raw'
import markWhiteSvg from './brand/eziq-mark-white.svg?raw'

// ---------- page numbers ----------
// The first print leaves "000" where a page number goes; the build reads where every anchor landed
// and prints again with the real numbers (see build.mjs).

let PAGES: Record<string, number> = {}
export function setPages(p: Record<string, number>) {
  PAGES = p
}
export function Pg({ to }: { to: string }) {
  return <span className="pgnum">{PAGES[to] ?? '000'}</span>
}

// ---------- the outline (PDF bookmarks and running heads) ----------

export interface OutlineEntry {
  level: number
  title: string
  id: string
}
export interface Manifest {
  title: string
  subject: string
  keywords: string
  outline: OutlineEntry[]
  /** anchors where the running head changes, in reading order */
  heads: { id: string; text: string }[]
  /** anchor of the contents page (the running head links there) */
  toc: string
}

export class Outline {
  entries: OutlineEntry[] = []
  heads: { id: string; text: string }[] = []
  add(level: number, title: string, id: string, head?: string) {
    this.entries.push({ level, title: plain(title), id })
    if (head) this.heads.push({ id, text: plain(head) })
    return id
  }
}

// ---------- text ----------

/** Emoji are fine on a phone but look out of place in a printed book. ®, ©, ™ and arrows stay. */
export function noEmoji(s: string) {
  return s
    .replace(/\p{Emoji_Presentation}|[\u{FE0F}\u{200D}]|.\u{FE0F}/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ +([.,!?;:)])/g, '$1')
    .trim()
}

export function plain(s: string) {
  return noEmoji(s)
    .replace(/\[\[eq:\s*([^\]]*)\]\]/g, '$1')
    .replace(/\{\{([^}]*)\}\}/g, '$1')
    .replace(/[_^]\{([^}]*)\}/g, '$1')
    .replace(/\*\*?/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const Rich = ({ t, className }: { t: string; className?: string }) => <RichText text={noEmoji(t)} className={className} />
export const Inl = ({ t }: { t: string }) => <>{renderInline(noEmoji(t))}</>

export const LETTERS = 'ABCDEFGH'

// ---------- brand ----------

export const Mark = ({ white = false, size = 28 }: { white?: boolean; size?: number }) => (
  <span className="mark" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: white ? markWhiteSvg : markSvg }} />
)

export const Logo = ({ white = false, size = 28 }: { white?: boolean; size?: number }) => (
  <span className={white ? 'logo white' : 'logo'} style={{ fontSize: size * 0.8 }}>
    <Mark white={white} size={size} />
    <span className="word">
      Ez<b>IQ</b>
    </span>
  </span>
)

export const MARK_SVG = markSvg

// ---------- front matter ----------

export function Cover({ course, product, cedVersion, units, extra }: { course: string; product: Product; cedVersion: string; units: number; extra: string }) {
  const info = COURSE_BOOKS[course]
  const p = PRODUCT_NAMES[product]
  return (
    <section className="cover" id="cover" style={{ background: `linear-gradient(150deg, ${info.cover[0]} 0%, ${info.cover[0]} 45%, ${info.cover[1]} 140%)` }}>
      <div className="cover-pattern" />
      <div className="cover-top">
        <Logo white size={46} />
        <span className="cover-site">{BRAND_INFO.domain}</span>
      </div>
      <div className="cover-mid">
        <div className="cover-kicker">{info.subject}</div>
        <h1 className="cover-title">{p.title}</h1>
        <p className="cover-tag">{p.tagline}</p>
        <div className="cover-chips">
          <span>Aligned to the {info.ap} course framework</span>
          <span>CED effective {cedVersion}</span>
          <span>{units} units</span>
          <span>{extra}</span>
        </div>
      </div>
      <div className="cover-bottom">
        <div>
          <b>{PUBLISHER.edition}</b> · {PUBLISHER.date}
        </div>
        <div className="cover-pub">{PUBLISHER.name}</div>
      </div>
    </section>
  )
}

export function CopyrightPage({ course, product, cedVersion }: { course: string; product: Product; cedVersion: string }) {
  const info = COURSE_BOOKS[course]
  const n = notices(info, cedVersion)
  return (
    <section className="front copyright" id="copyright">
      <div className="title-block">
        <Logo size={40} />
        <h1>
          {BRAND_INFO.name} {info.subject}
        </h1>
        <h2>{PRODUCT_NAMES[product].title}</h2>
        <p className="muted">
          {PUBLISHER.edition} · {PUBLISHER.date}
        </p>
      </div>
      <div className="legal">
        <h3>Important notice about this book</h3>
        <div className="notice">
          <p>
            <b>Course framework.</b> {n.framework}
          </p>
          <p>
            <b>Original content.</b> {n.ownership}
          </p>
          <p>
            <b>Trademarks.</b> {n.trademark}
          </p>
          <p>{n.noPromise}</p>
        </div>
        <p>
          <b>{n.copyright}</b>
        </p>
        <p>{n.license}</p>
        <p>
          Published by {PUBLISHER.name} under the {BRAND_INFO.name} brand · {BRAND_INFO.domain}
        </p>
        <p>{n.errata}</p>
        <p className="small muted">
          Typeset in Source Serif 4, Nunito and Noto (SIL Open Font License). Every page carries the {BRAND_INFO.name} mark; removing it is not permitted.
        </p>
      </div>
    </section>
  )
}

export function TocRow({ id, level, children, num }: { id: string; level: number; children: ReactNode; num?: string }) {
  return (
    <a className={`toc-row l${level}`} href={`#${id}`}>
      {num && <span className="toc-num">{num}</span>}
      <span className="toc-t">{children}</span>
      <span className="toc-dots" />
      <Pg to={id} />
    </a>
  )
}

// ---------- questions ----------

export function QuestionBody({ q }: { q: Question }) {
  return (
    <>
      <Rich t={q.prompt} className="q-prompt" />
      {q.type === 'mcq' ? (
        <ol className="choices">
          {q.choices.map((c, i) => (
            <li key={i}>
              <span className="letter">{LETTERS[i]}</span>
              <span>
                <Inl t={c} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="numeric">
          Answer: <span className="blank" /> {q.unit && <span className="unit">{noEmoji(q.unit)}</span>}
        </div>
      )}
    </>
  )
}

/** The answer line: "(B) 22.0 g" or "0.250 mol (accepted within 2%)". */
export function AnswerLine({ q }: { q: Question }) {
  if (q.type === 'mcq')
    return (
      <span className="ans-key">
        ({LETTERS[q.answer]}) <Inl t={q.choices[q.answer]} />
      </span>
    )
  return (
    <span className="ans-key">
      {fmtNum(q.answer)}
      {q.unit ? ` ${noEmoji(q.unit)}` : ''}
    </span>
  )
}

/** Answers are stored as numbers; print them the way a student would write them. */
export function fmtNum(x: number) {
  if (x !== 0 && (Math.abs(x) >= 1e5 || Math.abs(x) < 1e-3)) {
    const [m, e] = x.toExponential(3).split('e')
    return `${Number(m)} × 10${toSup(e.replace('+', ''))}`
  }
  return String(Number(x.toPrecision(4))).replace('-', '−')
}
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
const toSup = (s: string) => [...s].map((c) => SUP[c] ?? c).join('')

// ---------- callouts ----------

const ICONS: Record<string, string> = {
  tip: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  caution:
    '<svg viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  exam: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',
  key: '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  check:
    '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7.5 12.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  deeper:
    '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  example:
    '<svg viewBox="0 0 24 24"><path d="M4 20l4-1L19 8l-3-3L5 16l-1 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
}

export function Icon({ name }: { name: keyof typeof ICONS | string }) {
  return <span className="icon" dangerouslySetInnerHTML={{ __html: ICONS[name] ?? '' }} />
}

export function Callout({ kind, label, title, children }: { kind: string; label: string; title?: string; children: ReactNode }) {
  return (
    <aside className={`callout ${kind}`}>
      <div className="callout-head">
        <Icon name={kind} />
        <span className="callout-label">{label}</span>
        {title && <span className="callout-title">{plain(title)}</span>}
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  )
}

// ---------- closing page ----------

export function BackPage({ course, cedVersion }: { course: string; cedVersion: string }) {
  const info = COURSE_BOOKS[course]
  const n = notices(info, cedVersion)
  return (
    <section className="backpage" id="about-eziq">
      <Logo size={54} />
      <h2>Keep going with {BRAND_INFO.name}</h2>
      <p>
        The {BRAND_INFO.name} app turns this course into short, friendly lessons on your phone, with quick checks after every lesson, flashcards, a
        study plan built around your exam date, and practice exams you can take again and again.
      </p>
      <p className="big-url">{BRAND_INFO.domain}</p>
      <div className="notice small">
        <p>{n.framework}</p>
        <p>{n.ownership}</p>
        <p>{n.trademark}</p>
        <p>
          {n.copyright} {n.license}
        </p>
      </div>
    </section>
  )
}
