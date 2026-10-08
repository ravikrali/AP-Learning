// Local-only storage: a real SQLite database (sql.js / WebAssembly) kept in memory
// and persisted to the browser's IndexedDB. One database per signed-in user.
// Nothing ever leaves the device.

import initSqlJs, { type Database, type SqlValue } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

const IDB_NAME = 'ap-learning'
const IDB_STORE = 'sqlite'
const SCHEMA_VERSION = 1

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'started',   -- started | done
  card_index INTEGER NOT NULL DEFAULT 0,
  check_correct INTEGER NOT NULL DEFAULT 0,
  check_total INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  completed_at TEXT
);
CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL,
  context TEXT NOT NULL,                    -- lesson id, checkpoint id or exam id
  correct INTEGER NOT NULL,
  first_try INTEGER NOT NULL,
  at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (lesson_id TEXT PRIMARY KEY, body TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS xp_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  day TEXT NOT NULL,
  at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS badges (badge_id TEXT PRIMARY KEY, earned_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS cards (
  card_id TEXT PRIMARY KEY,
  box INTEGER NOT NULL DEFAULT 0,
  due TEXT NOT NULL,
  reviews INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  last_review TEXT
);
CREATE TABLE IF NOT EXISTS checkpoints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  minutes INTEGER,
  at TEXT NOT NULL
);
`

let sqlPromise: ReturnType<typeof initSqlJs> | null = null
function getSql() {
  if (!sqlPromise) {
    if (wasmUrl.startsWith('data:')) {
      // single-file preview build: the wasm is embedded as base64, so pass the bytes directly
      const bin = Uint8Array.from(atob(wasmUrl.split(',')[1]), (c) => c.charCodeAt(0))
      sqlPromise = initSqlJs({ wasmBinary: bin.buffer as ArrayBuffer })
    } else sqlPromise = initSqlJs({ locateFile: () => wasmUrl })
  }
  return sqlPromise
}

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(key: string): Promise<Uint8Array | undefined> {
  const db = await idb()
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(key)
    req.onsuccess = () => resolve(req.result as Uint8Array | undefined)
    req.onerror = () => reject(req.error)
  })
}

async function idbPut(key: string, value: Uint8Array): Promise<void> {
  const db = await idb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export function today(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export type Row = Record<string, SqlValue>

export class LocalDB {
  private db: Database
  private key: string
  private saveTimer: number | undefined
  private listeners = new Set<() => void>()
  version = 0

  private constructor(db: Database, key: string) {
    this.db = db
    this.key = key
  }

  static async open(userKey: string): Promise<LocalDB> {
    const SQL = await getSql()
    const key = `user:${userKey}`
    const bytes = await idbGet(key)
    const db = bytes ? new SQL.Database(bytes) : new SQL.Database()
    db.exec(SCHEMA)
    db.run('INSERT OR IGNORE INTO meta(key, value) VALUES (?, ?)', ['schema_version', String(SCHEMA_VERSION)])
    db.run('INSERT OR IGNORE INTO meta(key, value) VALUES (?, ?)', ['created_at', new Date().toISOString()])
    const ldb = new LocalDB(db, key)
    await ldb.flush()
    // Ask the browser not to evict our data under storage pressure.
    navigator.storage?.persist?.().catch(() => undefined)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') void ldb.flush()
    })
    return ldb
  }

  all(sql: string, params: SqlValue[] = []): Row[] {
    const stmt = this.db.prepare(sql)
    stmt.bind(params)
    const rows: Row[] = []
    while (stmt.step()) rows.push(stmt.getAsObject())
    stmt.free()
    return rows
  }

  get(sql: string, params: SqlValue[] = []): Row | undefined {
    return this.all(sql, params)[0]
  }

  run(sql: string, params: SqlValue[] = []) {
    this.db.run(sql, params)
    this.changed()
  }

  /** Run several writes as one transaction. */
  tx(fn: () => void) {
    this.db.exec('BEGIN')
    try {
      fn()
      this.db.exec('COMMIT')
    } catch (e) {
      this.db.exec('ROLLBACK')
      throw e
    }
    this.changed()
  }

  /** for use inside tx(): write without notifying */
  exec(sql: string, params: SqlValue[] = []) {
    this.db.run(sql, params)
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private changed() {
    this.version++
    this.listeners.forEach((fn) => fn())
    window.clearTimeout(this.saveTimer)
    this.saveTimer = window.setTimeout(() => void this.flush(), 400)
  }

  async flush() {
    await idbPut(this.key, this.db.export())
  }

  exportBytes(): Uint8Array {
    return this.db.export()
  }

  /** Replace all data with a backup file. Validates it is one of our databases first. */
  async importBytes(bytes: Uint8Array) {
    const SQL = await getSql()
    let incoming
    try {
      incoming = new SQL.Database(bytes)
      const ok = incoming.exec("SELECT value FROM meta WHERE key='schema_version'")
      if (!ok.length) throw new Error('missing meta')
    } catch {
      incoming?.close()
      throw new Error('This file is not an AP Learning backup.')
    }
    incoming.exec(SCHEMA)
    this.db.close()
    this.db = incoming
    this.changed()
    await this.flush()
  }
}
