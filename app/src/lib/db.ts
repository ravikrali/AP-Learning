// Local-only storage: a real SQLite database (sql.js / WebAssembly) kept in memory
// and persisted to the browser's IndexedDB. One database per signed-in user.
// Nothing ever leaves the device.

import initSqlJs, { type Database, type SqlValue } from 'sql.js'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

const IDB_NAME = 'ap-learning'
const IDB_STORE = 'sqlite'
const SCHEMA_VERSION = 2

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
  at TEXT NOT NULL,
  uid TEXT
);
CREATE TABLE IF NOT EXISTS notes (lesson_id TEXT PRIMARY KEY, body TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS xp_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  day TEXT NOT NULL,
  at TEXT NOT NULL,
  uid TEXT
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
  at TEXT NOT NULL,
  uid TEXT
);
CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  minutes INTEGER,
  at TEXT NOT NULL,
  uid TEXT
);
`

// ---------- sync support ----------
// Triggers copy every change into sync_outbox (as the item the server expects, see shared/sync.ts),
// except while remote changes are being applied (meta 'sync_applying' is set).
// Events get a random uid so the same answer is never counted twice across devices.

const EVENT_TABLES: { table: string; kind: string; fields: string[] }[] = [
  { table: 'attempts', kind: 'a', fields: ['question_id', 'context', 'correct', 'first_try', 'at'] },
  { table: 'xp_log', kind: 'x', fields: ['amount', 'reason', 'day', 'at'] },
  { table: 'checkpoints', kind: 'c', fields: ['unit_id', 'score', 'total', 'at'] },
  { table: 'exams', kind: 'e', fields: ['exam_id', 'score', 'total', 'minutes', 'at'] },
]

const NOW_TS = "strftime('%Y-%m-%dT%H:%M:%fZ','now')"
const NOT_APPLYING = "(SELECT 1 FROM meta WHERE key='sync_applying') IS NULL"
const jsonOf = (prefix: string, fields: string[]) => `json_object(${fields.map((f) => `'${f}', ${prefix}${f}`).join(', ')})`

const LESSON_FIELDS = ['status', 'card_index', 'check_correct', 'check_total', 'started_at', 'completed_at']
const CARD_FIELDS = ['box', 'due', 'reviews', 'lapses', 'last_review']

/** Outbox SQL for each kind of row, written once and reused by the triggers and by enqueueAll(). */
const OUTBOX = {
  lesson: (p: string) => `'lesson:' || ${p}lesson_id, ${jsonOf(p, LESSON_FIELDS)}`,
  note: (p: string) => `'note:' || ${p}lesson_id, json_object('body', ${p}body, 'updated_at', ${p}updated_at)`,
  card: (p: string) => `'card:' || ${p}card_id, ${jsonOf(p, CARD_FIELDS)}`,
  badge: (p: string) => `'badge:' || ${p}badge_id, json_object('earned_at', ${p}earned_at)`,
  setting: (p: string) => `'set:' || substr(${p}key, 9), json_object('value', ${p}value)`,
}

function syncSql(): string {
  const out: string[] = ['CREATE TABLE IF NOT EXISTS sync_outbox (key TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL);']
  for (const { table, kind, fields } of EVENT_TABLES) {
    out.push(`CREATE UNIQUE INDEX IF NOT EXISTS ${table}_uid ON ${table}(uid);`)
    out.push(`CREATE TRIGGER IF NOT EXISTS sync_${table}_ins AFTER INSERT ON ${table} WHEN ${NOT_APPLYING} BEGIN
      UPDATE ${table} SET uid = lower(hex(randomblob(10))) WHERE id = NEW.id AND uid IS NULL;
      INSERT OR REPLACE INTO sync_outbox(key, data, updated_at)
        SELECT 'ev:${kind}:' || uid, ${jsonOf('', fields)}, at FROM ${table} WHERE id = NEW.id;
    END;`)
  }
  const upsert = (name: string, table: string, item: string, when = '') =>
    ['INSERT', 'UPDATE'].map(
      (op) => `CREATE TRIGGER IF NOT EXISTS sync_${name}_${op.toLowerCase()} AFTER ${op} ON ${table} WHEN ${NOT_APPLYING}${when} BEGIN
        INSERT OR REPLACE INTO sync_outbox(key, data, updated_at) VALUES (${item}, ${NOW_TS});
      END;`,
    )
  out.push(...upsert('lesson', 'lesson_progress', OUTBOX.lesson('NEW.')))
  out.push(...upsert('note', 'notes', OUTBOX.note('NEW.')))
  out.push(`CREATE TRIGGER IF NOT EXISTS sync_note_delete AFTER DELETE ON notes WHEN ${NOT_APPLYING} BEGIN
    INSERT OR REPLACE INTO sync_outbox(key, data, updated_at)
      VALUES ('note:' || OLD.lesson_id, json_object('body', '', 'updated_at', ${NOW_TS}), ${NOW_TS});
  END;`)
  out.push(...upsert('card', 'cards', OUTBOX.card('NEW.')))
  out.push(...upsert('badge', 'badges', OUTBOX.badge('NEW.')))
  out.push(...upsert('setting', 'meta', OUTBOX.setting('NEW.'), " AND NEW.key LIKE 'setting:%'"))
  return out.join('\n')
}

/** Create tables, add columns that older versions lacked, and install the sync triggers. */
function prepareSchema(db: Database) {
  db.exec(SCHEMA)
  for (const { table } of EVENT_TABLES) {
    const cols = db.exec(`PRAGMA table_info(${table})`)[0]?.values.map((r) => r[1]) ?? []
    if (!cols.includes('uid')) db.exec(`ALTER TABLE ${table} ADD COLUMN uid TEXT`)
  }
  db.exec(syncSql())
}

/** Queue every existing row for upload (first sync on a device that already has progress). */
function enqueueAllSql(): string {
  const parts: string[] = []
  for (const { table, kind, fields } of EVENT_TABLES) {
    parts.push(`UPDATE ${table} SET uid = lower(hex(randomblob(10))) WHERE uid IS NULL;`)
    parts.push(`INSERT OR REPLACE INTO sync_outbox(key, data, updated_at) SELECT 'ev:${kind}:' || uid, ${jsonOf('', fields)}, at FROM ${table};`)
  }
  const all = (table: string, item: string, where = '') =>
    `INSERT OR REPLACE INTO sync_outbox(key, data, updated_at) SELECT ${item}, ${NOW_TS} FROM ${table}${where};`
  parts.push(all('lesson_progress', OUTBOX.lesson('')))
  parts.push(all('notes', OUTBOX.note('')))
  parts.push(all('cards', OUTBOX.card('')))
  parts.push(all('badges', OUTBOX.badge('')))
  parts.push(all('meta', OUTBOX.setting(''), " WHERE key LIKE 'setting:%'"))
  return parts.join('\n')
}

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
    prepareSchema(db)
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

  // ---------- sync helpers (see lib/sync.ts) ----------

  /** Queue everything on this device for upload, and pull everything again on the next sync. */
  enqueueAll() {
    this.db.exec(enqueueAllSql())
    this.db.run("DELETE FROM meta WHERE key='sync_cursor'")
    this.changed()
  }

  outbox(limit = 1500): { key: string; data: string; updated_at: string }[] {
    return this.all('SELECT key, data, updated_at FROM sync_outbox ORDER BY updated_at LIMIT ?', [limit]) as never
  }

  outboxCount(): number {
    return Number(this.get('SELECT COUNT(*) AS n FROM sync_outbox')?.n ?? 0)
  }

  /** Remove sent items, unless they changed again while the upload was in flight. */
  markSent(items: { key: string; updated_at: string }[]) {
    this.db.exec('BEGIN')
    for (const it of items) this.db.run('DELETE FROM sync_outbox WHERE key = ? AND updated_at = ?', [it.key, it.updated_at])
    this.db.exec('COMMIT')
  }

  /** Apply changes that came from the server without queueing them for upload again. */
  applyRemote(fn: () => void) {
    this.tx(() => {
      this.db.run("INSERT OR REPLACE INTO meta(key, value) VALUES ('sync_applying', '1')")
      try {
        fn()
      } finally {
        this.db.run("DELETE FROM meta WHERE key='sync_applying'")
      }
    })
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
    prepareSchema(incoming)
    this.db.close()
    this.db = incoming
    // A restored backup is merged into the account on the next sync.
    this.enqueueAll()
    await this.flush()
  }
}

/** For tests only. */
export const __testing = { prepareSchema, enqueueAllSql }
