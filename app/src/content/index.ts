import type { Course, Lesson, Question, Unit } from './types'
import { chemistry } from './chem'

export const COURSES: Course[] = [chemistry]

export const UPCOMING = [{ id: 'stats', title: 'AP Statistics', emoji: '📊' }]

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
