// Builds a personal study plan: lessons she hasn't finished, in course order, packed into her study
// days up to a final review period before the exam, which is filled with practice exams,
// free-response practice, checkpoint retakes and flashcards.

import type { Course } from '../content/types'
import type { PlanItem, PlanSession, StudyPlan } from '../../shared/plan'
import { today } from './db'

export interface PlanAnswers {
  examDate: string
  examTime: string
  /** 0 = Monday … 6 = Sunday */
  days: number[]
  minutes: number
  time: string
  /** unit id to start from ("" = the beginning) */
  start: string
  reviewWeeks: number
}

export interface PlanExtras {
  exams?: { id: string; name: string; minutes: number }[]
  frqs?: { id: string; title: string }[]
}

const CARDS_MIN = 5 // flashcard review at the start of each session (sessions of 20+ minutes)
const CHECKPOINT_MIN = 10
const FRQ_MIN = 20

export function parseDay(d: string) {
  const [y, m, dd] = d.split('-').map(Number)
  return new Date(y, m - 1, dd)
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const weekday = (d: Date) => (d.getDay() + 6) % 7

function studyDates(from: Date, untilExclusive: Date, days: number[]): string[] {
  const out: string[] = []
  for (let d = from; d < untilExclusive; d = addDays(d, 1)) if (days.includes(weekday(d))) out.push(today(d))
  return out
}

/** Lessons (and a checkpoint after each unit) still to do, from the chosen start unit. */
export function learningItems(course: Course, start: string, done: Set<string>): PlanItem[] {
  const from = Math.max(0, course.units.findIndex((u) => u.id === start))
  const items: PlanItem[] = []
  for (const unit of course.units.slice(from)) {
    const todo = unit.lessons.filter((l) => !done.has(l.id))
    for (const l of todo) items.push({ k: 'lesson', id: l.id, t: l.title, m: l.minutes, to: `/lesson/${l.id}` })
    if (todo.length && unit.checkpoint.length)
      items.push({
        k: 'checkpoint',
        id: unit.id,
        t: unit.number === 0 ? `${unit.title} checkpoint` : `Unit ${unit.number} checkpoint`,
        m: CHECKPOINT_MIN,
        to: `/course/${course.id}/unit/${unit.id}/checkpoint`,
      })
  }
  return items
}

export function buildPlan(course: Course, a: PlanAnswers, done: Set<string>, extras: PlanExtras = {}, now = new Date()): StudyPlan {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const exam = parseDay(a.examDate)
  const reviewStart = addDays(exam, -7 * a.reviewWeeks)
  const learnDates = studyDates(start, reviewStart < start ? start : reviewStart, a.days)
  const reviewDates = studyDates(reviewStart < start ? start : reviewStart, exam, a.days)
  const withCards = a.minutes >= 20
  const capacity = Math.max(5, a.minutes - (withCards ? CARDS_MIN : 0))

  const queue = learningItems(course, a.start, done)
  const sessions: PlanSession[] = []
  let anyLessonsDone = done.size > 0

  // Spread the work evenly over the days left (never more than the session length), so there is
  // a steady, comfortable pace instead of a rush and then nothing.
  const pack = (daysLeft: number) => {
    const items: PlanItem[] = []
    if (withCards && anyLessonsDone) items.push({ k: 'cards', t: 'Flashcard review', m: CARDS_MIN, to: '/review' })
    const left = queue.reduce((n, i) => n + i.m, 0)
    const target = Math.min(capacity, left / Math.max(1, daysLeft))
    let used = 0
    while (queue.length && (used === 0 || (used + queue[0].m / 2 <= target && used + queue[0].m <= capacity))) {
      const it = queue.shift()!
      items.push(it)
      used += it.m
    }
    if (items.some((i) => i.k === 'lesson')) anyLessonsDone = true
    return items
  }

  learnDates.forEach((date, i) => {
    if (queue.length) sessions.push({ date, items: pack(learnDates.length - i) })
  })
  const overflow = queue.filter((i) => i.k === 'lesson').length

  // Review period (and any leftover lessons first, if they didn't fit).
  const exams = extras.exams ?? []
  const frqs = extras.frqs ?? []
  const units = course.units.filter((u) => u.number > 0 && u.checkpoint.length)
  const examFor = (mins: number) => [...exams].sort((x, y) => y.minutes - x.minutes).find((e) => e.minutes <= mins) ?? exams[exams.length - 1]
  let r = 0
  for (const date of reviewDates) {
    if (queue.length) {
      sessions.push({ date, items: pack(1) })
      continue
    }
    const items: PlanItem[] = []
    const slot = r % 3
    const e = examFor(a.minutes)
    if (slot === 0 && e) items.push({ k: 'exam', id: e.id, t: `Practice exam: ${e.name}`, m: e.minutes, to: `/exam/mc/${e.id}` })
    else if (slot === 1 && frqs.length) {
      const f = frqs[Math.floor(r / 3) % frqs.length]
      items.push({ k: 'frq', id: f.id, t: `Free response: ${f.title}`, m: FRQ_MIN, to: `/exam/frq/${f.id}` })
    } else if (units.length) {
      const u = units[r % units.length]
      items.push({ k: 'review', id: u.id, t: `Review Unit ${u.number}: ${u.title} (checkpoint)`, m: CHECKPOINT_MIN, to: `/course/${course.id}/unit/${u.id}/checkpoint` })
    }
    if (withCards) items.push({ k: 'cards', t: 'Flashcard review', m: CARDS_MIN, to: '/review' })
    if (items.length) sessions.push({ date, items })
    r++
  }

  return {
    course: course.id,
    courseTitle: course.title,
    examDate: a.examDate,
    examTime: a.examTime,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
    time: a.time,
    minutes: a.minutes,
    days: [...a.days].sort(),
    start: a.start,
    reviewWeeks: a.reviewWeeks,
    createdAt: now.toISOString(),
    sessions,
    ...(overflow ? { overflow } : {}),
  }
}

/** Shortest session (in 5-minute steps) that fits every remaining lesson before the review period. */
export function minutesNeeded(course: Course, a: PlanAnswers, done: Set<string>, now = new Date()): number | null {
  for (let m = a.minutes; m <= 120; m += 5) {
    const p = buildPlan(course, { ...a, minutes: m }, done, {}, now)
    if (!p.overflow) return m
  }
  return null
}

export interface PlanStatus {
  todays?: PlanSession
  next?: PlanSession
  /** scheduled lessons from earlier days that aren't done yet */
  behind: number
  /** lessons done ahead of schedule */
  ahead: number
  lessonsPlanned: number
}

export function planStatus(p: StudyPlan, done: Set<string>, now = new Date()): PlanStatus {
  const t = today(now)
  let behind = 0
  let ahead = 0
  let lessonsPlanned = 0
  for (const s of p.sessions)
    for (const i of s.items) {
      if (i.k !== 'lesson') continue
      lessonsPlanned++
      if (s.date < t && !done.has(i.id!)) behind++
      if (s.date > t && done.has(i.id!)) ahead++
    }
  return {
    todays: p.sessions.find((s) => s.date === t),
    next: p.sessions.find((s) => s.date > t),
    behind,
    ahead,
    lessonsPlanned,
  }
}
