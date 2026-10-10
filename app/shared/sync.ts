// Shared by the app and the Worker: what a synced item looks like and how two versions merge.
//
// Item keys
//   ev:a:<uid>  answer attempt      ev:x:<uid>  XP entry
//   ev:c:<uid>  checkpoint result   ev:e:<uid>  exam result        (events: written once, never change)
//   lesson:<id> lesson progress     note:<id>   note (body "" = deleted)
//   card:<id>   flashcard schedule  badge:<id>  earned badge       set:<name>  a setting
//   plan:<course> study plan (see shared/plan.ts)
//   mark:<lesson> bookmark (saved 1 = bookmarked, 0 = removed)
//   t:time:<uid> / t:ev:<uid>  learning analytics (upload only: the server adds them to its
//               statistics and never stores or returns them)
//
// Merge rules (the same on every device and on the server, so everyone converges):
//   events      first copy wins (they never change)
//   lesson      "done" is sticky: a finished lesson never goes back to "started";
//               two finished copies keep the earliest completion time
//   badge       earliest earned time wins
//   everything else: the most recently changed copy wins

export interface SyncItem {
  key: string
  data: Record<string, unknown>
  updated_at: string
}

export const KEY_PATTERN = /^(ev:[axce]:[\w.\-:]{1,80}|t:(time|ev):\w{1,40}|(lesson|note|card|badge|set|plan|mark):[\w.#\-:]{1,120})$/

export const isTelemetry = (key: string) => key.startsWith('t:')

/** Largest allowed item, in characters of JSON (study plans are the big ones). */
export const maxItemSize = (key: string) => (key.startsWith('plan:') ? 150_000 : 40_000)

function minStr(a: unknown, b: unknown): unknown {
  if (typeof a !== 'string') return b
  if (typeof b !== 'string') return a
  return a < b ? a : b
}

function sameData(a: Record<string, unknown>, b: Record<string, unknown>) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** Returns the item that should be stored, or null when the existing copy already wins. */
export function mergeItem(existing: SyncItem | undefined, incoming: SyncItem): SyncItem | null {
  if (!existing) return incoming
  const key = incoming.key
  if (key.startsWith('ev:')) return null

  if (key.startsWith('lesson:')) {
    const oldDone = existing.data.status === 'done'
    const newDone = incoming.data.status === 'done'
    if (oldDone && !newDone) return null
    if (newDone && !oldDone) return incoming
    if (oldDone && newDone) {
      const newer = incoming.updated_at > existing.updated_at ? incoming : existing
      const merged: SyncItem = {
        ...newer,
        data: { ...newer.data, completed_at: minStr(existing.data.completed_at, incoming.data.completed_at) },
      }
      return sameData(merged.data, existing.data) ? null : merged
    }
  }

  if (key.startsWith('badge:')) {
    const a = String(existing.data.earned_at ?? '')
    const b = String(incoming.data.earned_at ?? '')
    return b && (!a || b < a) ? incoming : null
  }

  if (incoming.updated_at > existing.updated_at && !sameData(incoming.data, existing.data)) return incoming
  return null
}
