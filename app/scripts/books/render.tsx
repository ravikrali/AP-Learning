// Turns one course into the HTML of one product. Loaded by build.mjs through Vite, so it can use
// the app's content and components as they are.
import { renderToStaticMarkup } from 'react-dom/server'
import { COURSES, cedInfo, examInfo, glossary } from '../../src/content'
import type { CourseBook } from '../../src/content/types'
import { setPages, type Manifest } from './common'
import { examBook } from './exam'
import { flashcards } from './flashcards'
import { textbook } from './textbook'
import type { Product } from './config'
import css from './book.css?raw'

const BOOKS = import.meta.glob<{ BOOK: CourseBook }>('../../src/content/*/book.ts', { eager: true })

export const COURSE_IDS = COURSES.map((c) => c.id)

export function render(product: Product, courseId: string, opts: { pages: Record<string, number>; pad: boolean; fontCss: string }) {
  const course = COURSES.find((c) => c.id === courseId)
  if (!course) throw new Error(`No course "${courseId}"`)
  const ced = cedInfo(courseId)!
  const exam = examInfo(courseId)!
  const book = BOOKS[`../../src/content/${courseId}/book.ts`]?.BOOK ?? null
  setPages(opts.pages)
  const full = exam.formats.find((f) => f.id === 'full')!
  const built =
    product === 'textbook'
      ? textbook({ course, book, glossary: glossary(courseId), frqs: exam.frqs, frqKinds: exam.frqKinds, examAbout: exam.about, ced })
      : product === 'flashcards'
        ? flashcards({ course, glossary: glossary(courseId), cedVersion: ced.version, pad: opts.pad })
        : examBook({ course, frqs: exam.frqs, frqKinds: exam.frqKinds, examAbout: exam.about, section1: { count: full.count, minutes: full.minutes }, ced })
  // Chrome only records where an anchor landed if something links to it, so link every bookmark
  // target once from a 1-pixel strip at the very end (finish.py deletes these links again).
  const targets = [...new Set([...built.manifest.outline.map((e) => e.id), ...built.manifest.heads.map((h) => h.id), built.manifest.toc])]
  const body =
    renderToStaticMarkup(built.body) + `<nav class="anchor-links">${targets.map((id) => `<a href="#${id}">.</a>`).join('')}</nav>`
  // Chrome lays every page out at the width of a normal page, so a full-bleed cover would shrink.
  // The cover is printed on its own (margin 0) and finish.py puts it on the blank first page.
  const cover = body.match(/<section class="cover"[\s\S]*?<\/section>/)
  if (!cover) throw new Error('No cover')
  const page = (title: string, extra: string, content: string) =>
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${opts.fontCss}\n${css}\n${extra}</style></head><body class="${product}">${content}</body></html>`
  const main = body.replace(cover[0], '<section class="cover-slot" id="cover"></section>')
  return {
    html: page(built.manifest.title, '', main),
    coverHtml: page('Cover', '@page { margin: 0 }', cover[0]),
    manifest: inDocumentOrder(built.manifest, main),
    hasBook: !!book,
  }
}

/** Components add outline entries as they render, which is not reading order; sort by where each anchor is. */
function inDocumentOrder(m: Manifest, body: string): Manifest {
  const at = (id: string) => {
    const i = body.indexOf(`id="${id}"`)
    if (i < 0) throw new Error(`Outline anchor #${id} is missing from the page`)
    return i
  }
  const outline = m.outline.map((e, k) => ({ e, k, i: at(e.id) })).sort((a, b) => a.i - b.i || a.k - b.k).map((x) => x.e)
  const heads = [...m.heads].sort((a, b) => at(a.id) - at(b.id))
  return { ...m, outline, heads }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
