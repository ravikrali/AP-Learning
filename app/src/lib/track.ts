// Learning analytics: how long she actively studies each topic, and a few app events.
// Time only counts while the page is visible and she has touched/scrolled/typed in the last
// 90 seconds, so a phone left open on a lesson doesn't inflate anything.
// Every device keeps its own totals (study_time). Signed-in devices also send them to the account,
// where they feed "tricky topics" and the admin dashboard; guests' data stays on the device.

import { useEffect } from 'react'
import { today, type LocalDB } from './db'
import { syncing } from './sync'

const IDLE_MS = 90_000
const FLUSH_MS = 30_000

const uid = () => [...crypto.getRandomValues(new Uint8Array(10))].map((b) => b.toString(16).padStart(2, '0')).join('')

function queue(db: LocalDB, kind: 'time' | 'ev', data: Record<string, unknown>) {
  if (!syncing) return
  db.run('INSERT INTO sync_outbox(key, data, updated_at) VALUES (?,?,?)', [`t:${kind}:${uid()}`, JSON.stringify(data), new Date().toISOString()])
}

/** Count an app event (e.g. "video", "tip", "plan"). */
export function track(db: LocalDB, name: string, extra: { course?: string; lesson?: string } = {}) {
  queue(db, 'ev', { name, ...extra, at: new Date().toISOString() })
}

export function addStudyTime(db: LocalDB, seconds: number, ctx: { lesson?: string; course?: string; kind: string }) {
  const s = Math.round(seconds)
  if (s < 1) return
  db.run(
    `INSERT INTO study_time(day, lesson_id, course, kind, seconds) VALUES (?,?,?,?,?)
     ON CONFLICT(day, lesson_id, kind) DO UPDATE SET seconds = seconds + excluded.seconds`,
    [today(), ctx.lesson ?? '', ctx.course ?? null, ctx.kind, s],
  )
  queue(db, 'time', { s, lesson: ctx.lesson, course: ctx.course, kind: ctx.kind, at: new Date().toISOString() })
}

/** Measure active time on this screen. */
export function useStudyTimer(db: LocalDB, ctx: { lesson?: string; course?: string; kind: string }) {
  const { lesson, course, kind } = ctx
  useEffect(() => {
    let lastInput = Date.now()
    let lastTick = Date.now()
    let pending = 0
    const tick = () => {
      const t = Date.now()
      if (document.visibilityState === 'visible' && t - lastInput < IDLE_MS) pending += Math.min(t - lastTick, 5000)
      lastTick = t
    }
    const flush = () => {
      tick()
      if (pending >= 1000) addStudyTime(db, pending / 1000, { lesson, course, kind })
      pending = 0
    }
    const onInput = () => {
      tick()
      lastInput = Date.now()
    }
    const onVis = () => (document.visibilityState === 'hidden' ? flush() : ((lastTick = Date.now()), (lastInput = Date.now())))
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, onInput, { passive: true }))
    document.addEventListener('visibilitychange', onVis)
    const t1 = window.setInterval(tick, 1000)
    const t2 = window.setInterval(flush, FLUSH_MS)
    return () => {
      flush()
      events.forEach((e) => window.removeEventListener(e, onInput))
      document.removeEventListener('visibilitychange', onVis)
      window.clearInterval(t1)
      window.clearInterval(t2)
    }
  }, [db, lesson, course, kind])
}

/** Seconds studied per lesson on this device. */
export function timeByLesson(db: LocalDB): Map<string, number> {
  return new Map(
    db.all("SELECT lesson_id, SUM(seconds) AS s FROM study_time WHERE lesson_id != '' GROUP BY lesson_id").map((r) => [String(r.lesson_id), Number(r.s)]),
  )
}

/** Minutes studied per day for the last `days` days (this device). */
export function minutesByDay(db: LocalDB, days = 7): { day: string; minutes: number }[] {
  const out: { day: string; minutes: number }[] = []
  const rows = new Map(db.all('SELECT day, SUM(seconds) AS s FROM study_time GROUP BY day').map((r) => [String(r.day), Number(r.s)]))
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = today(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i))
    out.push({ day: d, minutes: Math.round((rows.get(d) ?? 0) / 60) })
  }
  return out
}
