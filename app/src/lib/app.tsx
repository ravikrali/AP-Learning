import { createContext, useContext, useSyncExternalStore } from 'react'
import type { User } from './auth'
import type { LocalDB } from './db'
import { COURSES, findLesson } from '../content'
import type { Course } from '../content/types'

export interface AppCtx {
  user: User
  db: LocalDB
  signOut: () => void
}

export const AppContext = createContext<AppCtx | null>(null)

/** Access the signed-in user and database; re-renders whenever the database changes. */
export function useApp(): AppCtx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp outside provider')
  useSyncExternalStore(
    (fn) => ctx.db.subscribe(fn),
    () => ctx.db.version,
  )
  return ctx
}

export function useCourse(id: string | undefined): Course | undefined {
  return COURSES.find((c) => c.id === id)
}

export { findLesson }
