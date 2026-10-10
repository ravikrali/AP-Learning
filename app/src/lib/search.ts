// Search inside lessons. Matches what the student reads (markup removed); every word typed must
// appear in the same card or in the lesson title. Titles rank above body text.

import { cardText, glossary, plainText, type LessonRef } from '../content'
import type { GlossaryEntry } from '../content/types'

export interface Hit {
  lessonId: string
  lessonTitle: string
  where: string
  /** index into lesson.cards, or null when the lesson title itself matched */
  card: number | null
  heading: string
  snippet: string
  score: number
}

const KIND_NAME: Record<string, string> = {
  hook: 'Think about it',
  concept: 'Key idea',
  example: 'Worked example',
  try: 'Your turn',
  hack: 'Smart trick',
  trap: 'Watch out',
  frq: 'FRQ corner',
  summary: 'Remember',
}

const cache = new WeakMap<object, { title: string; body: string; low: string }[]>()
function cardsOf(ref: LessonRef) {
  let c = cache.get(ref.lesson)
  if (!c) {
    c = ref.lesson.cards.map((card) => {
      const t = cardText(card)
      const title = plainText(t.title)
      const body = plainText(t.body)
      return { title, body, low: `${title} ${body}`.toLowerCase() }
    })
    cache.set(ref.lesson, c)
  }
  return c
}

export const words = (q: string) => q.toLowerCase().split(/\s+/).filter((w) => w.length > 0)

function snippet(body: string, word: string, around = 54): string {
  const i = body.toLowerCase().indexOf(word)
  if (i < 0) return body.slice(0, around * 2) + (body.length > around * 2 ? '…' : '')
  const start = Math.max(0, i - around)
  const end = Math.min(body.length, i + word.length + around)
  return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '')
}

export function searchLessons(refs: LessonRef[], query: string, limit = 40): Hit[] {
  const ws = words(query)
  if (!ws.length || ws.join('').length < 2) return []
  const hits: Hit[] = []
  for (const ref of refs) {
    const where = ref.unit.number === 0 ? ref.unit.title : `Unit ${ref.unit.number}`
    const lessonLow = ref.lesson.title.toLowerCase()
    if (ws.every((w) => lessonLow.includes(w)))
      hits.push({ lessonId: ref.lesson.id, lessonTitle: ref.lesson.title, where, card: null, heading: 'Topic', snippet: `${ref.lesson.minutes} min lesson`, score: 100 })
    cardsOf(ref).forEach((c, i) => {
      if (!ws.every((w) => c.low.includes(w))) return
      const inTitle = ws.every((w) => c.title.toLowerCase().includes(w))
      const kind = ref.lesson.cards[i].kind
      hits.push({
        lessonId: ref.lesson.id,
        lessonTitle: ref.lesson.title,
        where,
        card: i,
        heading: c.title || KIND_NAME[kind],
        snippet: snippet(c.body, ws[0]),
        score: (inTitle ? 50 : 10) + (kind === 'concept' ? 5 : kind === 'summary' ? 3 : 0),
      })
    })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit)
}

export function searchGlossary(courseId: string, query: string, limit = 5): GlossaryEntry[] {
  const ws = words(query)
  if (!ws.length || ws.join('').length < 2) return []
  return glossary(courseId)
    .filter((g) => ws.every((w) => plainText(g.term).toLowerCase().includes(w)))
    .slice(0, limit)
}
