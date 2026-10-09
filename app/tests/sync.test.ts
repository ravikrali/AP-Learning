import { describe, expect, it } from 'vitest'
import initSqlJs, { type Database, type SqlValue } from 'sql.js'
import { mergeItem, KEY_PATTERN, type SyncItem } from '../shared/sync'
import { __testing } from '../src/lib/db'
import { applyItem } from '../src/lib/sync'
import type { LocalDB } from '../src/lib/db'

const item = (key: string, data: Record<string, unknown>, updated_at: string): SyncItem => ({ key, data, updated_at })

describe('merge rules', () => {
  it('events are written once', () => {
    expect(mergeItem(undefined, item('ev:a:1', { x: 1 }, 't1'))).not.toBeNull()
    expect(mergeItem(item('ev:a:1', { x: 1 }, 't1'), item('ev:a:1', { x: 2 }, 't2'))).toBeNull()
  })
  it('a finished lesson never goes back to started', () => {
    const done = item('lesson:L', { status: 'done', completed_at: '2026-01-02' }, '2026-01-02')
    const started = item('lesson:L', { status: 'started', card_index: 3 }, '2026-01-05')
    expect(mergeItem(done, started)).toBeNull()
    expect(mergeItem(started, done)?.data.status).toBe('done')
  })
  it('two finished copies keep the earliest completion', () => {
    const a = item('lesson:L', { status: 'done', completed_at: '2026-01-02', check_correct: 1 }, '2026-01-02')
    const b = item('lesson:L', { status: 'done', completed_at: '2026-01-04', check_correct: 3 }, '2026-01-04')
    const m = mergeItem(a, b)!
    expect(m.data.completed_at).toBe('2026-01-02')
    expect(m.data.check_correct).toBe(3)
  })
  it('badges keep the earliest time; everything else newest wins', () => {
    expect(mergeItem(item('badge:x', { earned_at: '1' }, '1'), item('badge:x', { earned_at: '2' }, '2'))).toBeNull()
    expect(mergeItem(item('note:L', { body: 'old' }, '1'), item('note:L', { body: 'new' }, '2'))?.data.body).toBe('new')
    expect(mergeItem(item('note:L', { body: 'new' }, '2'), item('note:L', { body: 'old' }, '1'))).toBeNull()
  })
  it('accepts the real key shapes', () => {
    for (const k of ['ev:a:3f9c01ab22', 'lesson:chem-2.7a', 'card:chem-1.1#0', 'note:chem-9.11', 'badge:unit-u3', 'set:weeklyGoal'])
      expect(KEY_PATTERN.test(k), k).toBe(true)
    expect(KEY_PATTERN.test('drop table')).toBe(false)
  })
})

/** A minimal LocalDB stand-in over a raw sql.js database (enough for applyItem). */
function fake(db: Database): LocalDB {
  const all = (sql: string, params: SqlValue[] = []) => {
    const st = db.prepare(sql)
    st.bind(params)
    const rows: Record<string, SqlValue>[] = []
    while (st.step()) rows.push(st.getAsObject())
    st.free()
    return rows
  }
  return { exec: (sql: string, p: SqlValue[] = []) => db.run(sql, p), get: (sql: string, p: SqlValue[] = []) => all(sql, p)[0] } as unknown as LocalDB
}

describe('device database ↔ sync items', async () => {
  const SQL = await initSqlJs()
  const fresh = () => {
    const d = new SQL.Database()
    __testing.prepareSchema(d)
    return d
  }
  const outbox = (d: Database) => {
    const r = d.exec('SELECT key, data, updated_at FROM sync_outbox ORDER BY key')[0]
    return (r?.values ?? []).map(([key, data, updated_at]) => item(String(key), JSON.parse(String(data)), String(updated_at)))
  }

  it('local changes queue the right items, and applying them on another device recreates the data', () => {
    const a = fresh()
    a.run("INSERT INTO attempts(question_id, context, correct, first_try, at) VALUES ('q1','chem-1.1',1,1,'2026-10-08T10:00:00Z')")
    a.run("INSERT INTO xp_log(amount, reason, day, at) VALUES (10,'q:q1','2026-10-08','2026-10-08T10:00:00Z')")
    a.run("INSERT INTO lesson_progress(lesson_id, status, card_index, started_at) VALUES ('chem-1.1','started',2,'2026-10-08')")
    a.run("UPDATE lesson_progress SET status='done', completed_at='2026-10-08T10:05:00Z' WHERE lesson_id='chem-1.1'")
    a.run("INSERT INTO notes(lesson_id, body, updated_at) VALUES ('chem-1.1','moles!','2026-10-08')")
    a.run("INSERT INTO cards(card_id, box, due) VALUES ('chem-1.1#0', 0, '2026-10-08')")
    a.run("INSERT INTO badges(badge_id, earned_at) VALUES ('first-step','2026-10-08')")
    a.run("INSERT INTO meta(key, value) VALUES ('setting:theme','light')")
    a.run("INSERT INTO meta(key, value) VALUES ('sync_cursor','5')") // not a setting: not synced

    const items = outbox(a)
    const keys = items.map((i) => i.key)
    expect(keys.filter((k) => k.startsWith('ev:a:'))).toHaveLength(1)
    expect(keys.filter((k) => k.startsWith('ev:x:'))).toHaveLength(1)
    expect(keys).toEqual(expect.arrayContaining(['lesson:chem-1.1', 'note:chem-1.1', 'card:chem-1.1#0', 'badge:first-step', 'set:theme']))
    expect(keys).not.toContain('set:sync_cursor')
    for (const k of keys) expect(KEY_PATTERN.test(k), k).toBe(true)
    expect(items.find((i) => i.key === 'lesson:chem-1.1')!.data.status).toBe('done')

    // Device B applies them with the "applying" flag set: data appears, nothing is re-queued.
    const b = fresh()
    b.run("INSERT INTO meta(key, value) VALUES ('sync_applying','1')")
    for (const it of items) applyItem(fake(b), it)
    for (const it of items) applyItem(fake(b), it) // applying twice changes nothing
    b.run("DELETE FROM meta WHERE key='sync_applying'")
    expect(outbox(b)).toHaveLength(0)
    expect(b.exec('SELECT COUNT(*) FROM attempts')[0].values[0][0]).toBe(1)
    expect(b.exec('SELECT COUNT(*) FROM xp_log')[0].values[0][0]).toBe(1)
    expect(b.exec("SELECT status FROM lesson_progress WHERE lesson_id='chem-1.1'")[0].values[0][0]).toBe('done')
    expect(b.exec("SELECT body FROM notes")[0].values[0][0]).toBe('moles!')
    expect(b.exec("SELECT value FROM meta WHERE key='setting:theme'")[0].values[0][0]).toBe('light')

    // Deleting a note on B queues a tombstone; applying it on A removes the note there.
    b.run("DELETE FROM notes WHERE lesson_id='chem-1.1'")
    const tomb = outbox(b).find((i) => i.key === 'note:chem-1.1')!
    expect(tomb.data.body).toBe('')
    a.run("INSERT INTO meta(key, value) VALUES ('sync_applying','1')")
    applyItem(fake(a), tomb)
    expect(a.exec('SELECT COUNT(*) FROM notes')[0].values[0][0]).toBe(0)
  })

  it('a remote "started" never undoes a local finished lesson', () => {
    const d = fresh()
    d.run("INSERT INTO lesson_progress(lesson_id, status, completed_at) VALUES ('L','done','t')")
    applyItem(fake(d), item('lesson:L', { status: 'started', card_index: 4 }, 'z'))
    expect(d.exec("SELECT status FROM lesson_progress WHERE lesson_id='L'")[0].values[0][0]).toBe('done')
  })

  it('first sync queues everything already on the device', () => {
    const d = new SQL.Database()
    // an older database: tables without uid columns or triggers
    d.run('CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT)')
    d.run('CREATE TABLE attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, question_id TEXT NOT NULL, context TEXT NOT NULL, correct INTEGER NOT NULL, first_try INTEGER NOT NULL, at TEXT NOT NULL)')
    d.run("INSERT INTO attempts(question_id, context, correct, first_try, at) VALUES ('q','c',1,1,'t')")
    __testing.prepareSchema(d)
    expect(outbox(d)).toHaveLength(0)
    d.exec(__testing.enqueueAllSql())
    expect(outbox(d).filter((i) => i.key.startsWith('ev:a:'))).toHaveLength(1)
  })
})
