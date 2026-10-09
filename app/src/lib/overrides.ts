// Content edits published from the Admin area, applied on top of the built-in lessons.
// The last copy is kept in localStorage so edits also show offline and on the very first paint.
//
// Keys:  lesson:<lessonId>          { title }
//        card:<lessonId>:<i>        text fields of card i (title, body, problem, steps, answer, points; question for "try" cards)
//        check:<lessonId>:<i>       quick-check question i (prompt, hint, explain, choices, answer [multiple choice only])
//        flash:<lessonId>:<i>       flashcard i (front, back)
//        video:<lessonId>           { url?, src?, title? } (an empty url removes the lesson's video)

import { findLesson } from '../content'
import type { Question } from '../content/types'
import { api } from './api'

export interface ContentItem {
  key: string
  data: Record<string, unknown>
  updated_at: string
  updated_by?: string
}

const CACHE_KEY = 'ap-learning-content'
const TEXT_FIELDS = ['title', 'body', 'problem', 'answer', 'prompt', 'hint', 'explain', 'front', 'back']
const LIST_FIELDS = ['steps', 'points', 'choices']

type Obj = Record<string, unknown>
const originals = new Map<string, Obj>()
const videoOverrides = new Map<string, { url?: string; src?: string; title?: string }>()
let current: ContentItem[] = []
let version = 0
const listeners = new Set<() => void>()

export const contentStore = {
  get: () => version,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

export function contentItems() {
  return current
}

export function contentItem(key: string) {
  return current.find((c) => c.key === key)
}

export function videoOverride(lessonId: string) {
  return videoOverrides.get(lessonId)
}

/** The live object a key edits (lesson, card, question or flashcard), or undefined. */
export function contentTarget(key: string): Obj | undefined {
  const [kind, lessonId, idx] = key.split(':')
  const ref = findLesson(lessonId)
  if (!ref) return undefined
  const i = Number(idx)
  if (kind === 'lesson') return ref.lesson as unknown as Obj
  if (kind === 'card') return ref.lesson.cards[i] as unknown as Obj
  if (kind === 'check') return ref.lesson.check[i] as unknown as Obj
  if (kind === 'flash') return ref.lesson.flashcards[i] as unknown as Obj
  return undefined
}

export function editableFields(obj: Obj): string[] {
  const isQuestion = 'prompt' in obj
  const optionalTitle = ['hook', 'trap', 'frq'].includes(String(obj.kind))
  const fields = [...TEXT_FIELDS, ...LIST_FIELDS].filter(
    (f) => f in obj || (f === 'hint' && isQuestion) || (f === 'title' && optionalTitle),
  )
  // A numeric question's answer is computed and verified in code; it can't be edited here.
  return (obj as unknown as Question).type === 'num' ? fields.filter((f) => f !== 'answer') : fields
}

function snapshot(obj: Obj): Obj {
  const s: Obj = {}
  for (const f of editableFields(obj)) s[f] = Array.isArray(obj[f]) ? [...(obj[f] as unknown[])] : obj[f]
  if (obj.question && typeof obj.question === 'object') s.question = snapshot(obj.question as Obj)
  return s
}

function restore(obj: Obj, snap: Obj) {
  for (const [f, val] of Object.entries(snap)) {
    if (f === 'question') restore(obj.question as Obj, val as Obj)
    else if (val === undefined) delete obj[f]
    else obj[f] = val
  }
}

/** Copy allowed, well-typed fields from an edit onto the live object. */
function assign(obj: Obj, data: Obj) {
  for (const f of editableFields(obj)) {
    if (!(f in data)) continue
    const val = data[f]
    if (LIST_FIELDS.includes(f)) {
      if (!Array.isArray(val) || !val.every((x) => typeof x === 'string')) continue
      if (f === 'choices' && val.length !== (obj.choices as unknown[]).length) continue
      obj[f] = [...val]
    } else if (f === 'answer' && typeof obj.answer === 'number') {
      if (typeof val === 'number' && Number.isInteger(val) && val >= 0 && val < ((obj.choices as unknown[]) ?? []).length) obj.answer = val
    } else if (typeof val === 'string') {
      if (f === 'hint' && val.trim() === '') delete obj.hint
      else obj[f] = val
    }
  }
  if (obj.question && data.question && typeof data.question === 'object') assign(obj.question as Obj, data.question as Obj)
}

/** Original (built-in) values for a key, whether or not it is currently edited. */
export function originalOf(key: string): Obj | undefined {
  const t = contentTarget(key)
  if (!t) return undefined
  return originals.get(key) ?? snapshot(t)
}

export function applyContent(items: ContentItem[]) {
  for (const [key, snap] of originals) {
    const t = contentTarget(key)
    if (t) restore(t, snap)
  }
  originals.clear()
  videoOverrides.clear()
  for (const it of items) {
    if (it.key.startsWith('video:')) {
      videoOverrides.set(it.key.slice(6), it.data as { url?: string; src?: string; title?: string })
      continue
    }
    const t = contentTarget(it.key)
    if (!t) continue
    originals.set(it.key, snapshot(t))
    assign(t, it.data)
  }
  current = items
  version++
  listeners.forEach((fn) => fn())
}

/** Apply the cached copy immediately (call before the first render). */
export function applyCachedContent() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) applyContent((JSON.parse(raw) as { items: ContentItem[] }).items)
  } catch {
    /* no cache yet */
  }
}

/** Fetch the latest published edits; applies and caches them when they changed. */
export async function refreshContent() {
  const res = await api<{ items: ContentItem[]; version: string }>('/api/content')
  const fresh = JSON.stringify(res.items)
  if (fresh !== JSON.stringify(current)) applyContent(res.items)
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ items: res.items, version: res.version }))
  } catch {
    /* storage full or blocked */
  }
}
