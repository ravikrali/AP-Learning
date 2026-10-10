import type { Course, Lesson, Question, Unit } from './types'
import { chemistry } from './chem'
import { CATALOG } from '../../shared/catalog'

/** Courses that are built. Every other course in the catalog shows as "coming soon". */
export const COURSES: Course[] = [chemistry]

export const BUILT = new Set(COURSES.map((c) => c.id))
export const UPCOMING = CATALOG.filter((c) => !BUILT.has(c.id))
export { CATALOG }

export interface LessonRef {
  course: Course
  unit: Unit
  lesson: Lesson
  index: number
}

const lessonIndex = new Map<string, LessonRef>()
for (const course of COURSES)
  for (const unit of course.units) unit.lessons.forEach((lesson, index) => lessonIndex.set(lesson.id, { course, unit, lesson, index }))

export function findLesson(id: string | undefined): LessonRef | undefined {
  return id ? lessonIndex.get(id) : undefined
}

export function findUnit(courseId: string | undefined, unitId: string | undefined) {
  const course = COURSES.find((c) => c.id === courseId)
  const unit = course?.units.find((u) => u.id === unitId)
  return course && unit ? { course, unit } : undefined
}

// Which lesson (or unit checkpoint) each question belongs to, for per-topic statistics.
const questionHome = new Map<string, { lesson: string; course: string }>()
for (const course of COURSES)
  for (const unit of course.units) {
    for (const l of unit.lessons)
      for (const q of [...l.check, ...l.cards.flatMap((c) => (c.kind === 'try' ? [c.question] : []))])
        questionHome.set(q.id, { lesson: l.id, course: course.id })
    for (const q of unit.checkpoint) questionHome.set(q.id, { lesson: `unit:${unit.id}`, course: course.id })
  }

export function questionTopic(questionId: string) {
  return questionHome.get(questionId)
}

/** Look up a flashcard by its id "lessonId#index". */
export function findFlashcard(cardId: string) {
  const [lessonId, idx] = cardId.split('#')
  const ref = lessonIndex.get(lessonId)
  const card = ref?.lesson.flashcards[Number(idx)]
  return ref && card ? { ...ref, card } : undefined
}

/** Every question in a unit (lesson checks + checkpoint extras). */
export function unitQuestions(unit: Unit): Question[] {
  return [...unit.lessons.flatMap((l) => [...l.check, ...l.cards.flatMap((c) => (c.kind === 'try' ? [c.question] : []))]), ...unit.checkpoint]
}

// ---------- popular YouTube videos per lesson ----------

import { CHEM_YOUTUBE } from './chem/youtube'
const BUILT_IN_YOUTUBE: Record<string, [string, string, string][]> = { ...CHEM_YOUTUBE }

export function builtInYoutube(lessonId: string) {
  return (BUILT_IN_YOUTUBE[lessonId] ?? []).map(([id, title, channel]) => ({ id, title, channel }))
}

// ---------- practice for the review weeks of a study plan ----------

import { CHEM_FRQS } from './chem/frq'
import type { PlanExtras } from '../lib/schedule'

export function planExtras(courseId: string): PlanExtras {
  if (courseId === 'chem')
    return {
      exams: [
        { id: 'quick', name: 'Quick mix (15 questions)', minutes: 22 },
        { id: 'half', name: 'Half section (30 questions)', minutes: 45 },
        { id: 'full', name: 'Full Section I (60 questions)', minutes: 90 },
      ],
      frqs: CHEM_FRQS.map((f) => ({ id: f.id, title: f.title })),
    }
  return {}
}

// ---------- plain text of lessons (search, glossary checks) ----------

/** Markup removed, for matching what the student sees. */
export function plainText(s: string): string {
  return s
    .replace(/\[\[eq:\s*([^\]]*)\]\]/g, '$1')
    .replace(/\{\{([^}]*)\}\}/g, '$1')
    .replace(/[_^]\{([^}]*)\}/g, '$1')
    .replace(/\*\*?/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** The readable text of one card (questions excluded, so search never reveals an answer). */
export function cardText(card: Lesson['cards'][number]): { title: string; body: string } {
  switch (card.kind) {
    case 'example':
      return { title: card.title, body: [card.problem, ...card.steps, card.answer].join(' ') }
    case 'summary':
      return { title: 'Remember', body: card.points.join(' ') }
    case 'try':
      return { title: 'Your turn', body: card.question.prompt }
    default:
      return { title: ('title' in card && card.title) || '', body: card.body }
  }
}

export function lessonText(lesson: Lesson): string {
  return plainText([lesson.title, ...lesson.cards.flatMap((c) => Object.values(cardText(c))), ...lesson.flashcards.flatMap((f) => [f.front, f.back])].join(' '))
}

// ---------- glossary ----------

import { CHEM_GLOSSARY } from './chem/glossary'
import type { GlossaryEntry } from './types'
const GLOSSARIES: Record<string, GlossaryEntry[]> = { chem: CHEM_GLOSSARY }

export function glossary(courseId: string): GlossaryEntry[] {
  return [...(GLOSSARIES[courseId] ?? [])].sort((a, b) => plainText(a.term).localeCompare(plainText(b.term), undefined, { sensitivity: 'base' }))
}

/** The card of its lesson where a glossary term first appears, so links can open right there. */
export function glossaryCard(g: GlossaryEntry): number | null {
  const ref = findLesson(g.lesson)
  if (!ref) return null
  const needle = plainText(g.find ?? g.term).toLowerCase()
  const i = ref.lesson.cards.findIndex((c) => plainText(Object.values(cardText(c)).join(' ')).toLowerCase().includes(needle))
  return i < 0 ? null : i
}
