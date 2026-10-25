// The course she is working in: picked from a course card on Home, and kept (on this device)
// until she picks a different one. Pages without a course in their address (Review, More,
// Glossary…) show only this course; pages with one (a lesson, a unit) make it the current one.

import { useSyncExternalStore } from 'react'
import { COURSES, findLesson } from '../content'
import type { Course } from '../content/types'
import { openable, useAccount } from './account'

const KEY = 'ap-learning-course'
const listeners = new Set<() => void>()

function saved(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

let current: string | null = saved()

export const courseStore = {
  get: () => current,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

export function setCurrentCourse(id: string) {
  if (id === current) return
  current = id
  try {
    localStorage.setItem(KEY, id)
  } catch {
    /* private mode */
  }
  listeners.forEach((fn) => fn())
}

/** The current course, if it is still one of hers. */
export function useCurrentCourse(): Course | null {
  const id = useSyncExternalStore(courseStore.subscribe, courseStore.get)
  const account = useAccount()
  const course = COURSES.find((c) => c.id === id)
  return course && openable(account, course.id) ? course : null
}

/** The course a page's address is about: /home/<id>, /course/<id>/…, /plan/<id>, /exam/<id>/…, /lesson/<lesson>. */
export function courseInPath(pathname: string): string | null {
  const [, first, second] = pathname.split('/')
  if (first === 'lesson') return findLesson(second)?.course.id ?? null
  if (first === 'exam') return COURSES.some((c) => c.id === second) ? second : 'chem' // /exam/mc/… are the original Chemistry links
  if (['home', 'course', 'plan'].includes(first)) return COURSES.some((c) => c.id === second) ? second : null
  return null
}

/** Home for a course (or the course list when there is none). */
export const courseHome = (id?: string | null) => (id ? `/home/${id}` : '/')
