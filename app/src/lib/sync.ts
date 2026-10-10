// Keeps this device's database in step with the account on the server.
// Offline-first: everything is written locally first; changes queue in sync_outbox and are
// uploaded a few seconds later, and changes from her other devices are pulled at the same time.

import type { SyncItem } from '../../shared/sync'
import type { LocalDB } from './db'
import { api, ApiError } from './api'

export type SyncState = 'off' | 'idle' | 'syncing' | 'offline' | 'signin' | 'error'
export interface SyncStatus {
  state: SyncState
  last?: string
  message?: string
}

let status: SyncStatus = { state: 'off' }
const listeners = new Set<() => void>()
function setStatus(s: SyncStatus) {
  status = s
  listeners.forEach((fn) => fn())
}
export const syncStore = {
  get: () => status,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

let syncNowFn: (() => void) | null = null
/** True while this device syncs with an account; analytics are only queued then (guests stay private). */
export let syncing = false
/** Ask for a sync right away (e.g. a "Sync now" button). */
export function syncNow() {
  syncNowFn?.()
}

type Val = string | number | null
const v = (x: unknown): Val => (x === undefined || x === null ? null : typeof x === 'number' ? x : String(x))

/** Write one item from the server into the local tables (inside db.applyRemote). */
export function applyItem(db: LocalDB, it: SyncItem) {
  const d = it.data
  const [prefix, ...rest] = it.key.split(':')
  const id = rest.join(':')
  switch (prefix) {
    case 'ev': {
      const kind = rest[0]
      const uid = rest.slice(1).join(':')
      if (kind === 'a')
        db.exec('INSERT OR IGNORE INTO attempts(question_id, context, correct, first_try, at, uid, lesson, course) VALUES (?,?,?,?,?,?,?,?)', [
          v(d.question_id), v(d.context), v(d.correct), v(d.first_try), v(d.at), uid, v(d.lesson), v(d.course),
        ])
      else if (kind === 'x')
        db.exec('INSERT OR IGNORE INTO xp_log(amount, reason, day, at, uid) VALUES (?,?,?,?,?)', [v(d.amount), v(d.reason), v(d.day), v(d.at), uid])
      else if (kind === 'c')
        db.exec('INSERT OR IGNORE INTO checkpoints(unit_id, score, total, at, uid) VALUES (?,?,?,?,?)', [v(d.unit_id), v(d.score), v(d.total), v(d.at), uid])
      else if (kind === 'e')
        db.exec('INSERT OR IGNORE INTO exams(exam_id, score, total, minutes, at, uid) VALUES (?,?,?,?,?,?)', [
          v(d.exam_id), v(d.score), v(d.total), v(d.minutes), v(d.at), uid,
        ])
      return
    }
    case 'lesson': {
      const local = db.get('SELECT status FROM lesson_progress WHERE lesson_id=?', [id])
      if (local?.status === 'done' && d.status !== 'done') return // a finished lesson stays finished
      db.exec(
        `INSERT INTO lesson_progress(lesson_id, status, card_index, check_correct, check_total, started_at, completed_at)
         VALUES (?,?,?,?,?,?,?)
         ON CONFLICT(lesson_id) DO UPDATE SET status=excluded.status, card_index=excluded.card_index,
           check_correct=excluded.check_correct, check_total=excluded.check_total,
           started_at=COALESCE(lesson_progress.started_at, excluded.started_at), completed_at=excluded.completed_at`,
        [id, v(d.status) ?? 'started', v(d.card_index) ?? 0, v(d.check_correct) ?? 0, v(d.check_total) ?? 0, v(d.started_at), v(d.completed_at)],
      )
      return
    }
    case 'note':
      if (!d.body) db.exec('DELETE FROM notes WHERE lesson_id=?', [id])
      else
        db.exec(
          'INSERT INTO notes(lesson_id, body, updated_at) VALUES (?,?,?) ON CONFLICT(lesson_id) DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at',
          [id, v(d.body), v(d.updated_at) ?? it.updated_at],
        )
      return
    case 'card':
      db.exec(
        `INSERT INTO cards(card_id, box, due, reviews, lapses, last_review) VALUES (?,?,?,?,?,?)
         ON CONFLICT(card_id) DO UPDATE SET box=excluded.box, due=excluded.due, reviews=excluded.reviews,
           lapses=excluded.lapses, last_review=excluded.last_review`,
        [id, v(d.box) ?? 0, v(d.due), v(d.reviews) ?? 0, v(d.lapses) ?? 0, v(d.last_review)],
      )
      return
    case 'badge':
      db.exec(
        'INSERT INTO badges(badge_id, earned_at) VALUES (?,?) ON CONFLICT(badge_id) DO UPDATE SET earned_at=MIN(badges.earned_at, excluded.earned_at)',
        [id, v(d.earned_at)],
      )
      return
    case 'set':
      db.exec('INSERT INTO meta(key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', [`setting:${id}`, v(d.value)])
      return
    case 'mark':
      db.exec(
        'INSERT INTO bookmarks(lesson_id, saved, updated_at) VALUES (?,?,?) ON CONFLICT(lesson_id) DO UPDATE SET saved=excluded.saved, updated_at=excluded.updated_at',
        [id, d.saved ? 1 : 0, v(d.updated_at) ?? it.updated_at],
      )
      return
    case 'plan':
      db.exec(
        'INSERT INTO plans(course_id, data, updated_at) VALUES (?,?,?) ON CONFLICT(course_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at',
        [id, JSON.stringify(d), it.updated_at],
      )
      return
  }
}

/**
 * Start syncing this database. Returns a stop function.
 * onAuthLost: the server rejected the session (expired) → the app asks her to sign in again.
 * onApplied: changes from another device were written locally.
 */
export function startSync(db: LocalDB, onAuthLost: () => void, onApplied: () => void): () => void {
  let running = false
  let again = false
  let stopped = false
  let timer: number | undefined

  // First sync on a device that already has progress: upload all of it once.
  if (!db.get("SELECT 1 AS x FROM meta WHERE key='sync_enqueued'")) {
    db.enqueueAll()
    db.run("INSERT OR REPLACE INTO meta(key, value) VALUES ('sync_enqueued', ?)", [new Date().toISOString()])
  }

  const schedule = (ms: number) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      timer = undefined
      void run()
    }, ms)
  }

  async function run() {
    if (stopped) return
    if (running) {
      again = true
      return
    }
    if (!navigator.onLine) {
      setStatus({ ...status, state: 'offline' })
      return
    }
    running = true
    setStatus({ ...status, state: 'syncing' })
    try {
      for (let round = 0; round < 50 && !stopped; round++) {
        const out = db.outbox()
        const since = Number(db.get("SELECT value FROM meta WHERE key='sync_cursor'")?.value ?? 0)
        const res = await api<{ items: SyncItem[]; cursor: number; more: boolean }>('/api/sync', {
          body: { since, items: out.map((o) => ({ key: o.key, data: JSON.parse(o.data), updated_at: o.updated_at })) },
        })
        db.markSent(out)
        if (res.items.length) db.applyRemote(() => res.items.forEach((it) => applyItem(db, it)))
        db.run("INSERT OR REPLACE INTO meta(key, value) VALUES ('sync_cursor', ?)", [String(res.cursor)])
        if (res.items.length) onApplied()
        if (!res.more && db.outboxCount() === 0) break
      }
      setStatus({ state: 'idle', last: new Date().toISOString() })
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setStatus({ state: 'signin', message: e.message })
        stopped = true
        onAuthLost()
        return
      }
      setStatus({ ...status, state: navigator.onLine ? 'error' : 'offline', message: (e as Error).message })
      schedule(60_000) // try again in a minute
    } finally {
      running = false
      if (again && !stopped) {
        again = false
        schedule(1500)
      }
    }
  }

  // Real changes go up a few seconds later; analytics alone can wait a couple of minutes.
  const unsub = db.subscribe(() => {
    if (running) return
    const real = Number(db.get("SELECT COUNT(*) AS n FROM sync_outbox WHERE key NOT LIKE 't:%'")?.n ?? 0)
    if (real > 0) schedule(4000)
    else if (db.outboxCount() > 0 && timer === undefined) schedule(120_000)
  })
  const onVis = () => void run()
  const onOnline = () => void run()
  document.addEventListener('visibilitychange', onVis)
  window.addEventListener('online', onOnline)
  const poll = window.setInterval(() => document.visibilityState === 'visible' && void run(), 3 * 60_000)
  syncNowFn = () => void run()
  syncing = true
  void run()

  return () => {
    stopped = true
    unsub()
    window.clearTimeout(timer)
    window.clearInterval(poll)
    document.removeEventListener('visibilitychange', onVis)
    window.removeEventListener('online', onOnline)
    syncNowFn = null
    syncing = false
    setStatus({ state: 'off' })
  }
}
