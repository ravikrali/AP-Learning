// Progress, XP, streaks, badges and spaced-review cards.
// Design rule: gentle. XP is never taken away, a single missed day never breaks a
// streak, and the daily review pile is capped so it can never become a wall.

import type { Course, Lesson, Unit } from '../content/types'
import { today, type LocalDB } from './db'

export const XP = {
  lessonDone: 50,
  firstTry: 10,
  afterHint: 5,
  card: 2,
  checkpointCorrect: 5,
  examCorrect: 5,
}

// ---------- XP & levels ----------

export function addXp(db: LocalDB, amount: number, reason: string) {
  db.exec('INSERT INTO xp_log(amount, reason, day, at) VALUES (?,?,?,?)', [amount, reason, today(), new Date().toISOString()])
}

export function totalXp(db: LocalDB): number {
  return Number(db.get('SELECT COALESCE(SUM(amount),0) AS t FROM xp_log')?.t ?? 0)
}

export function xpToday(db: LocalDB): number {
  return Number(db.get('SELECT COALESCE(SUM(amount),0) AS t FROM xp_log WHERE day=?', [today()])?.t ?? 0)
}

const LEVEL_TITLES = [
  'Curious Beginner', 'Spark', 'Explorer', 'Builder', 'Problem Solver', 'Pattern Finder',
  'Deep Thinker', 'Rising Expert', 'Scholar', 'Master', 'Legend',
]

/** Level L needs 50·L·(L−1) total XP: 0, 100, 300, 600, 1000, 1500 ... */
export function levelInfo(xp: number) {
  let level = 1
  while (50 * (level + 1) * level <= xp) level++
  const floor = 50 * level * (level - 1)
  const next = 50 * (level + 1) * level
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    into: xp - floor,
    span: next - floor,
    pct: Math.round(((xp - floor) / (next - floor)) * 100),
  }
}

// ---------- Streaks (kind version) ----------

function shiftDay(day: string, delta: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return today(new Date(y, m - 1, d + delta))
}

export function activeDays(db: LocalDB): Set<string> {
  return new Set(db.all('SELECT DISTINCT day FROM xp_log').map((r) => String(r.day)))
}

/**
 * Counts study days in the current chain. A single rest day is forgiven;
 * two missed days in a row end the chain. Today never counts as missed (it isn't over).
 */
export function streak(db: LocalDB): { days: number; studiedToday: boolean } {
  const days = activeDays(db)
  const t = today()
  let d = t
  let count = 0
  let misses = 0
  for (let i = 0; i < 3650; i++) {
    if (days.has(d)) {
      count++
      misses = 0
    } else if (d !== t) {
      misses++
      if (misses >= 2) break
    }
    d = shiftDay(d, -1)
  }
  return { days: count, studiedToday: days.has(t) }
}

/** Study days in the current Monday–Sunday week. */
export function weekDays(db: LocalDB): { done: boolean[]; count: number } {
  const days = activeDays(db)
  const now = new Date()
  const dow = (now.getDay() + 6) % 7 // Monday = 0
  const done: boolean[] = []
  for (let i = 0; i < 7; i++) done.push(days.has(today(new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + i))))
  return { done, count: done.filter(Boolean).length }
}

export function getSetting(db: LocalDB, key: string, fallback: string): string {
  const r = db.get('SELECT value FROM meta WHERE key=?', [`setting:${key}`])
  return r ? String(r.value) : fallback
}

export function setSetting(db: LocalDB, key: string, value: string) {
  db.run('INSERT INTO meta(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', [`setting:${key}`, value])
}

// ---------- Lessons ----------

export type LessonStatus = 'new' | 'started' | 'done'

export function lessonStatuses(db: LocalDB): Map<string, LessonStatus> {
  const m = new Map<string, LessonStatus>()
  for (const r of db.all('SELECT lesson_id, status FROM lesson_progress')) m.set(String(r.lesson_id), r.status as LessonStatus)
  return m
}

export function lessonRow(db: LocalDB, lessonId: string) {
  return db.get('SELECT * FROM lesson_progress WHERE lesson_id=?', [lessonId])
}

export function saveCardIndex(db: LocalDB, lessonId: string, idx: number) {
  db.run(
    `INSERT INTO lesson_progress(lesson_id, status, card_index, started_at) VALUES (?, 'started', ?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET card_index=excluded.card_index`,
    [lessonId, idx, new Date().toISOString()],
  )
}

/** Record an answer. Returns XP awarded (only the first time a question is answered right). */
export function recordAttempt(db: LocalDB, questionId: string, context: string, correct: boolean, firstTry: boolean): number {
  let award = 0
  db.tx(() => {
    const before = db.get('SELECT 1 AS x FROM attempts WHERE question_id=? AND correct=1', [questionId])
    db.exec('INSERT INTO attempts(question_id, context, correct, first_try, at) VALUES (?,?,?,?,?)', [
      questionId, context, correct ? 1 : 0, firstTry ? 1 : 0, new Date().toISOString(),
    ])
    if (correct && !before) {
      award = firstTry ? XP.firstTry : XP.afterHint
      addXp(db, award, `q:${questionId}`)
    }
  })
  return award
}

export function cardId(lessonId: string, i: number) {
  return `${lessonId}#${i}`
}

/** Mark a lesson done (XP only the first time) and unlock its flashcards. */
export function completeLesson(db: LocalDB, lesson: Lesson, correct: number, total: number): number {
  let award = 0
  db.tx(() => {
    const row = db.get('SELECT status FROM lesson_progress WHERE lesson_id=?', [lesson.id])
    const now = new Date().toISOString()
    if (row?.status !== 'done') {
      award = XP.lessonDone
      addXp(db, award, `lesson:${lesson.id}`)
    }
    db.exec(
      `INSERT INTO lesson_progress(lesson_id, status, card_index, check_correct, check_total, started_at, completed_at)
       VALUES (?, 'done', 0, ?, ?, ?, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET status='done', card_index=0, check_correct=excluded.check_correct,
         check_total=excluded.check_total, completed_at=COALESCE(lesson_progress.completed_at, excluded.completed_at)`,
      [lesson.id, correct, total, now, now],
    )
    lesson.flashcards.forEach((_, i) => {
      db.exec('INSERT OR IGNORE INTO cards(card_id, box, due) VALUES (?, 0, ?)', [cardId(lesson.id, i), today()])
    })
  })
  return award
}

// ---------- Notes ----------

export function getNote(db: LocalDB, lessonId: string): string {
  return String(db.get('SELECT body FROM notes WHERE lesson_id=?', [lessonId])?.body ?? '')
}

export function saveNote(db: LocalDB, lessonId: string, body: string) {
  if (body.trim() === '') db.run('DELETE FROM notes WHERE lesson_id=?', [lessonId])
  else
    db.run(
      'INSERT INTO notes(lesson_id, body, updated_at) VALUES (?,?,?) ON CONFLICT(lesson_id) DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at',
      [lessonId, body, new Date().toISOString()],
    )
}

// ---------- Spaced review (Leitner boxes) ----------

/** Days until next review for each box. */
export const BOX_INTERVALS = [0, 1, 3, 7, 14, 30, 60]
export const DAILY_CARD_CAP = 15

export function dueCards(db: LocalDB, limit = DAILY_CARD_CAP): string[] {
  return db
    .all('SELECT card_id FROM cards WHERE due <= ? ORDER BY due ASC, box ASC LIMIT ?', [today(), limit])
    .map((r) => String(r.card_id))
}

export function dueCount(db: LocalDB): number {
  const n = Number(db.get('SELECT COUNT(*) AS n FROM cards WHERE due <= ?', [today()])?.n ?? 0)
  return Math.min(n, DAILY_CARD_CAP)
}

export function reviewCard(db: LocalDB, id: string, knewIt: boolean) {
  db.tx(() => {
    const row = db.get('SELECT box FROM cards WHERE card_id=?', [id])
    const box = Number(row?.box ?? 0)
    const nextBox = knewIt ? Math.min(box + 1, BOX_INTERVALS.length - 1) : 1
    const due = shiftDay(today(), BOX_INTERVALS[nextBox] || 1)
    db.exec(
      'UPDATE cards SET box=?, due=?, reviews=reviews+1, lapses=lapses+?, last_review=? WHERE card_id=?',
      [nextBox, due, knewIt ? 0 : 1, new Date().toISOString(), id],
    )
    addXp(db, XP.card, `card:${id}`)
  })
}

// ---------- Checkpoints & exams ----------

export function saveCheckpoint(db: LocalDB, unitId: string, score: number, total: number) {
  db.tx(() => {
    db.exec('INSERT INTO checkpoints(unit_id, score, total, at) VALUES (?,?,?,?)', [unitId, score, total, new Date().toISOString()])
    if (score > 0) addXp(db, score * XP.checkpointCorrect, `checkpoint:${unitId}`)
  })
}

export function bestCheckpoint(db: LocalDB, unitId: string): { score: number; total: number } | null {
  const r = db.get('SELECT score, total FROM checkpoints WHERE unit_id=? ORDER BY (score*1.0/total) DESC LIMIT 1', [unitId])
  return r ? { score: Number(r.score), total: Number(r.total) } : null
}

export function stars(score: number, total: number): number {
  const p = total ? score / total : 0
  return p >= 0.9 ? 3 : p >= 0.7 ? 2 : p > 0 ? 1 : 0
}

export function saveExam(db: LocalDB, examId: string, score: number, total: number, minutes: number | null) {
  db.tx(() => {
    db.exec('INSERT INTO exams(exam_id, score, total, minutes, at) VALUES (?,?,?,?,?)', [examId, score, total, minutes, new Date().toISOString()])
    if (score > 0) addXp(db, score * XP.examCorrect, `exam:${examId}`)
  })
}

// ---------- Unit progress ----------

export function unitProgress(unit: Unit, statuses: Map<string, LessonStatus>) {
  const done = unit.lessons.filter((l) => statuses.get(l.id) === 'done').length
  return { done, total: unit.lessons.length, pct: unit.lessons.length ? Math.round((done / unit.lessons.length) * 100) : 0 }
}

/** The first lesson not yet done, in course order (started ones first). */
export function nextLesson(course: Course, statuses: Map<string, LessonStatus>): { unit: Unit; lesson: Lesson } | null {
  for (const unit of course.units) for (const lesson of unit.lessons) if (statuses.get(lesson.id) === 'started') return { unit, lesson }
  for (const unit of course.units) for (const lesson of unit.lessons) if (statuses.get(lesson.id) !== 'done') return { unit, lesson }
  return null
}

// ---------- Badges ----------

export interface BadgeDef {
  id: string
  name: string
  emoji: string
  desc: string
}

interface Stats {
  lessonsDone: number
  streakDays: number
  cardsReviewed: number
  notes: number
  perfectCheckpoints: number
  exams: number
  xp: number
}

const GENERAL_BADGES: (BadgeDef & { stat: keyof Stats; goal: number })[] = [
  { id: 'first-step', name: 'First Step', emoji: '🌱', desc: 'Finish your first lesson', stat: 'lessonsDone', goal: 1 },
  { id: 'ten-lessons', name: 'Getting Into It', emoji: '📚', desc: 'Finish 10 lessons', stat: 'lessonsDone', goal: 10 },
  { id: 'thirty-lessons', name: 'Steady Learner', emoji: '🧗', desc: 'Finish 30 lessons', stat: 'lessonsDone', goal: 30 },
  { id: 'sixty-lessons', name: 'Unstoppable', emoji: '🚀', desc: 'Finish 60 lessons', stat: 'lessonsDone', goal: 60 },
  { id: 'streak-3', name: 'Warming Up', emoji: '🔥', desc: 'Reach a 3-day streak', stat: 'streakDays', goal: 3 },
  { id: 'streak-7', name: 'One Great Week', emoji: '🌟', desc: 'Reach a 7-day streak', stat: 'streakDays', goal: 7 },
  { id: 'streak-21', name: 'Habit Formed', emoji: '🏅', desc: 'Reach a 21-day streak', stat: 'streakDays', goal: 21 },
  { id: 'cards-50', name: 'Memory Builder', emoji: '🧠', desc: 'Review 50 flashcards', stat: 'cardsReviewed', goal: 50 },
  { id: 'cards-300', name: 'Memory Palace', emoji: '🏛️', desc: 'Review 300 flashcards', stat: 'cardsReviewed', goal: 300 },
  { id: 'notes-5', name: 'Note Taker', emoji: '📝', desc: 'Write notes on 5 lessons', stat: 'notes', goal: 5 },
  { id: 'perfect-checkpoint', name: 'Flawless', emoji: '💎', desc: 'Get every question right on a unit checkpoint', stat: 'perfectCheckpoints', goal: 1 },
  { id: 'first-exam', name: 'Exam Ready', emoji: '🎓', desc: 'Complete a practice exam', stat: 'exams', goal: 1 },
  { id: 'xp-1000', name: 'Thousand Club', emoji: '⚡', desc: 'Earn 1,000 XP', stat: 'xp', goal: 1000 },
  { id: 'xp-5000', name: 'Powerhouse', emoji: '🌋', desc: 'Earn 5,000 XP', stat: 'xp', goal: 5000 },
]

export function allBadges(course: Course): BadgeDef[] {
  return [
    ...GENERAL_BADGES.map(({ id, name, emoji, desc }) => ({ id, name, emoji, desc })),
    ...course.units.map((u) => ({
      id: `unit-${u.id}`,
      name: u.badge.name,
      emoji: u.badge.emoji,
      desc: `Finish every lesson in ${u.number === 0 ? u.title : `Unit ${u.number}: ${u.title}`}`,
    })),
    { id: `course-${course.id}`, name: `${course.short} Champion`, emoji: '🏆', desc: `Finish every lesson in ${course.title}` },
  ]
}

export function earnedBadges(db: LocalDB): Map<string, string> {
  return new Map(db.all('SELECT badge_id, earned_at FROM badges').map((r) => [String(r.badge_id), String(r.earned_at)]))
}

/** Award any badges newly earned; returns them so the UI can celebrate. */
function badgeStats(db: LocalDB, statuses: Map<string, LessonStatus>): Stats {
  return {
    lessonsDone: [...statuses.values()].filter((s) => s === 'done').length,
    streakDays: streak(db).days,
    cardsReviewed: Number(db.get('SELECT COALESCE(SUM(reviews),0) AS n FROM cards')?.n ?? 0),
    notes: Number(db.get('SELECT COUNT(*) AS n FROM notes')?.n ?? 0),
    perfectCheckpoints: Number(db.get('SELECT COUNT(*) AS n FROM checkpoints WHERE score=total AND total>0')?.n ?? 0),
    exams: Number(db.get('SELECT COUNT(*) AS n FROM exams')?.n ?? 0),
    xp: totalXp(db),
  }
}

export interface BadgeProgress {
  badge: BadgeDef
  earned: boolean
  value: number
  goal: number
}

/** Every badge with how far along she is: course badges (one per unit + champion) and general milestones. */
export function badgeProgress(db: LocalDB, course: Course): { course: BadgeProgress[]; milestones: BadgeProgress[] } {
  const statuses = lessonStatuses(db)
  const stats = badgeStats(db, statuses)
  const have = earnedBadges(db)
  const defs = new Map(allBadges(course).map((b) => [b.id, b]))
  const courseItems: BadgeProgress[] = course.units.map((u) => {
    const p = unitProgress(u, statuses)
    const id = `unit-${u.id}`
    return { badge: defs.get(id)!, earned: have.has(id), value: p.done, goal: p.total }
  })
  const lessons = course.units.flatMap((u) => u.lessons)
  const champ = `course-${course.id}`
  courseItems.push({
    badge: defs.get(champ)!,
    earned: have.has(champ),
    value: lessons.filter((l) => statuses.get(l.id) === 'done').length,
    goal: lessons.length,
  })
  const milestones = GENERAL_BADGES.map((b) => ({
    badge: defs.get(b.id)!,
    earned: have.has(b.id),
    value: Math.min(stats[b.stat], b.goal),
    goal: b.goal,
  }))
  return { course: courseItems, milestones }
}

export function evaluateBadges(db: LocalDB, course: Course): BadgeDef[] {
  const statuses = lessonStatuses(db)
  const stats = badgeStats(db, statuses)
  const have = earnedBadges(db)
  const fresh: BadgeDef[] = []
  for (const b of GENERAL_BADGES) if (!have.has(b.id) && stats[b.stat] >= b.goal) fresh.push(b)
  for (const u of course.units) {
    const id = `unit-${u.id}`
    if (!have.has(id) && u.lessons.length && u.lessons.every((l) => statuses.get(l.id) === 'done'))
      fresh.push({ id, name: u.badge.name, emoji: u.badge.emoji, desc: '' })
  }
  const all = course.units.flatMap((u) => u.lessons)
  if (!have.has(`course-${course.id}`) && all.length && all.every((l) => statuses.get(l.id) === 'done'))
    fresh.push({ id: `course-${course.id}`, name: `${course.short} Champion`, emoji: '🏆', desc: '' })
  if (fresh.length) {
    const now = new Date().toISOString()
    db.tx(() => fresh.forEach((b) => db.exec('INSERT OR IGNORE INTO badges(badge_id, earned_at) VALUES (?,?)', [b.id, now])))
  }
  return fresh
}
