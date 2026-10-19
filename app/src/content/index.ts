import type { Course, Lesson, Question, Unit } from './types'
import { chemistry } from './chem'
import { statistics } from './stats'
import { CATALOG } from '../../shared/catalog'

/** Courses that are built. Every other course in the catalog shows as "coming soon". */
export const COURSES: Course[] = [chemistry, statistics]

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
import { STATS_YOUTUBE } from './stats/youtube'
const BUILT_IN_YOUTUBE: Record<string, [string, string, string][]> = { ...CHEM_YOUTUBE, ...STATS_YOUTUBE }

export function builtInYoutube(lessonId: string) {
  return (BUILT_IN_YOUTUBE[lessonId] ?? []).map(([id, title, channel]) => ({ id, title, channel }))
}

// ---------- practice exams, free response and the CED topic list, per course ----------

import { CHEM_FRQS } from './chem/frq'
import { STATS_FRQS } from './stats/frq'
import * as CHEM_CED from './chem/ced'
import * as STATS_CED from './stats/ced'
import type { PlanExtras } from '../lib/schedule'
import type { Frq } from './types'

export interface ExamFormat {
  id: string
  name: string
  count: number
  minutes: number
  desc: string
}

export interface ExamInfo {
  /** one-line description of the real exam */
  about: string
  formats: ExamFormat[]
  frqs: Frq[]
  /** label for each FRQ kind, with its points */
  frqKinds: Record<string, string>
  /** where this course's practice exams live */
  path: string
  /** prefix for saved multiple-choice exam ids (Chemistry keeps its original unprefixed ids) */
  idPrefix: string
}

const EXAMS: Record<string, ExamInfo> = {
  chem: {
    about: 'The real AP® Chemistry exam has 60 multiple-choice questions (90 min) and 7 free-response questions (105 min).',
    formats: [
      { id: 'quick', name: 'Quick mix', count: 15, minutes: 22, desc: '15 multiple-choice questions from every unit' },
      { id: 'half', name: 'Half section', count: 30, minutes: 45, desc: '30 questions, about half of Section I' },
      { id: 'full', name: 'Full Section I', count: 60, minutes: 90, desc: '60 questions, like the real multiple-choice section' },
    ],
    frqs: CHEM_FRQS,
    frqKinds: { long: 'Long · 10 points', short: 'Short · 4 points' },
    path: '/exam',
    idPrefix: '',
  },
  stats: {
    about:
      'The real AP® Statistics exam has 42 multiple-choice questions (90 min) and 4 free-response questions worth 10 points each (90 min). A graphing calculator and the formula sheet and tables are allowed on both sections.',
    formats: [
      { id: 'quick', name: 'Quick mix', count: 14, minutes: 30, desc: '14 multiple-choice questions from every unit' },
      { id: 'half', name: 'Half section', count: 21, minutes: 45, desc: '21 questions, half of Section I' },
      { id: 'full', name: 'Full Section I', count: 42, minutes: 90, desc: '42 questions, like the real multiple-choice section' },
    ],
    frqs: STATS_FRQS,
    frqKinds: {
      q1: 'Question 1 type · Formulate questions & collect data · 10 points',
      q2: 'Question 2 type · Analyze data & interpret results · 10 points',
      q3: 'Question 3 type · Inference · 10 points',
      q4: 'Question 4 type · Several topics · 10 points',
    },
    path: '/exam/stats',
    idPrefix: 'stats-',
  },
}

export function examInfo(courseId: string | undefined): ExamInfo | undefined {
  return courseId ? EXAMS[courseId] : undefined
}

/** The course a saved exam id belongs to. */
export function examCourse(examId: string): string {
  for (const [id, e] of Object.entries(EXAMS)) if (e.idPrefix && examId.startsWith(e.idPrefix)) return id
  for (const [id, e] of Object.entries(EXAMS)) if (e.frqs.some((f) => f.id === examId)) return id
  return 'chem'
}

export interface CedInfo {
  version: string
  units: { number: number; title: string; weight: string }[]
  topics: Record<string, string>
}

const CEDS: Record<string, CedInfo> = {
  chem: { version: CHEM_CED.CED_VERSION, units: CHEM_CED.CED_UNITS, topics: CHEM_CED.CED_TOPICS },
  stats: { version: STATS_CED.CED_VERSION, units: STATS_CED.CED_UNITS, topics: STATS_CED.CED_TOPICS },
}

export function cedInfo(courseId: string | undefined): CedInfo | undefined {
  return courseId ? CEDS[courseId] : undefined
}

export function planExtras(courseId: string): PlanExtras {
  const e = EXAMS[courseId]
  if (!e) return {}
  return {
    exams: e.formats.map((f) => ({ id: f.id, name: `${f.name} (${f.count} questions)`, minutes: f.minutes })),
    frqs: e.frqs.map((f) => ({ id: f.id, title: f.title })),
    path: e.path,
  }
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
import { STATS_GLOSSARY } from './stats/glossary'
import type { GlossaryEntry } from './types'
const GLOSSARIES: Record<string, GlossaryEntry[]> = { chem: CHEM_GLOSSARY, stats: STATS_GLOSSARY }

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
