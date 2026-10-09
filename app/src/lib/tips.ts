// Spotting topics she finds hard, and the quick tips to offer.
// Tips are never generated: they are the lesson's own checked "smart trick" and "watch out" cards,
// plus its summary, so they carry the same accuracy guarantees as the lessons.

import { findLesson, type LessonRef } from '../content'
import type { Card, Lesson } from '../content/types'
import type { LocalDB } from './db'
import { timeByLesson } from './track'

export interface TopicStat {
  lesson: string
  attempts: number
  firstTryRight: number
  wrong: number
  seconds: number
  /** the last few answers were right first time */
  recovered: boolean
}

export function topicStats(db: LocalDB): Map<string, TopicStat> {
  const out = new Map<string, TopicStat>()
  const rows = db.all(
    `SELECT COALESCE(lesson, context) AS lesson, correct, first_try FROM attempts
     WHERE COALESCE(lesson, context) NOT LIKE '%:%' ORDER BY at`,
  )
  const recent = new Map<string, boolean[]>()
  for (const r of rows) {
    const id = String(r.lesson)
    let s = out.get(id)
    if (!s) out.set(id, (s = { lesson: id, attempts: 0, firstTryRight: 0, wrong: 0, seconds: 0, recovered: false }))
    const right = Number(r.correct) === 1 && Number(r.first_try) === 1
    s.attempts++
    if (right) s.firstTryRight++
    if (Number(r.correct) !== 1) s.wrong++
    const list = recent.get(id) ?? []
    list.push(right)
    recent.set(id, list.slice(-3))
  }
  for (const [id, sec] of timeByLesson(db)) {
    const s = out.get(id) ?? { lesson: id, attempts: 0, firstTryRight: 0, wrong: 0, seconds: 0, recovered: false }
    s.seconds = sec
    out.set(id, s)
  }
  for (const [id, list] of recent) out.get(id)!.recovered = list.length === 3 && list.every(Boolean)
  return out
}

export type Struggle = 'accuracy' | 'time'

export function struggle(s: TopicStat | undefined, lesson: Lesson): Struggle | null {
  if (!s || s.recovered) return null
  if (s.attempts >= 3 && s.firstTryRight / s.attempts < 0.5) return 'accuracy'
  if (s.seconds > lesson.minutes * 60 * 2.5 && s.seconds > 15 * 60) return 'time'
  return null
}

export interface Tricky {
  ref: LessonRef
  stat: TopicStat
  why: Struggle
}

/** Lessons she seems to find hard, hardest first. */
export function trickyTopics(db: LocalDB, courseIds?: string[], limit = 3): Tricky[] {
  const stats = topicStats(db)
  const out: Tricky[] = []
  for (const [id, s] of stats) {
    const ref = findLesson(id)
    if (!ref || (courseIds && !courseIds.includes(ref.course.id))) continue
    const why = struggle(s, ref.lesson)
    if (why) out.push({ ref, stat: s, why })
  }
  const acc = (t: Tricky) => (t.stat.attempts ? t.stat.firstTryRight / t.stat.attempts : 1)
  return out.sort((a, b) => acc(a) - acc(b)).slice(0, limit)
}

export interface Tips {
  tricks: Extract<Card, { kind: 'hack' }>[]
  traps: Extract<Card, { kind: 'trap' }>[]
  summary: string[]
}

export function tipsFor(lesson: Lesson): Tips {
  return {
    tricks: lesson.cards.filter((c): c is Extract<Card, { kind: 'hack' }> => c.kind === 'hack'),
    traps: lesson.cards.filter((c): c is Extract<Card, { kind: 'trap' }> => c.kind === 'trap'),
    summary: lesson.cards.flatMap((c) => (c.kind === 'summary' ? c.points : [])),
  }
}

/** The lesson just before this one in the same unit (units build step by step), for "go back one step" advice. */
export function previousLesson(lessonId: string): LessonRef | undefined {
  const ref = findLesson(lessonId)
  if (!ref || ref.index === 0) return undefined
  return findLesson(ref.unit.lessons[ref.index - 1].id)
}
