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
