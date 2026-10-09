// Saved study plans (one per course), kept in the local database and synced as "plan:<course>".

import type { StudyPlan } from '../../shared/plan'
import type { LocalDB } from './db'

export function getPlan(db: LocalDB, courseId: string): StudyPlan | null {
  const r = db.get('SELECT data FROM plans WHERE course_id=?', [courseId])
  if (!r) return null
  try {
    const p = JSON.parse(String(r.data)) as StudyPlan & { deleted?: boolean }
    return p.deleted || !Array.isArray(p.sessions) ? null : p
  } catch {
    return null
  }
}

export function allPlans(db: LocalDB): StudyPlan[] {
  return db
    .all('SELECT course_id FROM plans')
    .map((r) => getPlan(db, String(r.course_id)))
    .filter((p): p is StudyPlan => !!p)
}

export function savePlan(db: LocalDB, plan: StudyPlan) {
  db.run(
    'INSERT INTO plans(course_id, data, updated_at) VALUES (?,?,?) ON CONFLICT(course_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at',
    [plan.course, JSON.stringify(plan), new Date().toISOString()],
  )
}

/** Deleting keeps a tombstone so the deletion syncs to other devices. */
export function deletePlan(db: LocalDB, courseId: string) {
  db.run('UPDATE plans SET data=?, updated_at=? WHERE course_id=?', [JSON.stringify({ deleted: true }), new Date().toISOString(), courseId])
}
