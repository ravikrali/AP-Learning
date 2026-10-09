// Subscription plan and picked courses for the signed-in person.
// The server is the source of truth (GET /api/account); a copy is kept on the device so courses
// open offline. Guests keep their one free pick on the device.

import { useSyncExternalStore } from 'react'
import { canOpen, CATALOG, checkPickChange, type PlanId } from '../../shared/catalog'
import { api } from './api'
import { loadSession } from './auth'

export interface Account {
  plan: PlanId
  ownPlan: PlanId
  paidPlan: PlanId
  compPlan: PlanId | null
  admin: boolean
  status: string
  courses: string[]
  switchAvailableAt: string | null
  periodEnd: string | null
  cancelAtPeriodEnd: boolean
  /** payments are set up on the server */
  billing: boolean
  interest: string[]
}

const FREE: Account = {
  plan: 'free', ownPlan: 'free', paidPlan: 'free', compPlan: null, admin: false, status: 'none', courses: [],
  switchAvailableAt: null, periodEnd: null, cancelAtPeriodEnd: false, billing: false, interest: [],
}

const keyFor = (sub: string) => `ap-learning-account:${sub}`
let current: Account = FREE
let currentSub = ''
const listeners = new Set<() => void>()

function set(a: Account) {
  current = a
  try {
    localStorage.setItem(keyFor(currentSub), JSON.stringify(a))
  } catch {
    /* private mode */
  }
  listeners.forEach((fn) => fn())
}

export const accountStore = {
  get: () => current,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

export function useAccount(): Account {
  return useSyncExternalStore(accountStore.subscribe, accountStore.get)
}

/** Load the saved copy for this person (call when someone signs in). */
export function loadAccount(sub: string) {
  currentSub = sub
  try {
    const raw = localStorage.getItem(keyFor(sub))
    current = raw ? { ...FREE, ...(JSON.parse(raw) as Account) } : FREE
  } catch {
    current = FREE
  }
  listeners.forEach((fn) => fn())
}

const signedIn = () => !!loadSession()?.token

export async function refreshAccount(): Promise<Account> {
  if (!signedIn()) return current
  const a = await api<Account>('/api/account')
  set(a)
  return a
}

export const openable = (a: Account, courseId: string) => canOpen(a, courseId)

/** Error text if this change isn't allowed (same rule the server uses). */
export function pickProblem(a: Account, next: string[]) {
  return checkPickChange(a.plan, a.courses, next, a.switchAvailableAt ? new Date(Date.parse(a.switchAvailableAt) - 30 * 86400_000).toISOString() : null)
}

export async function setPicks(next: string[]): Promise<Account> {
  const err = pickProblem(current, next)
  if (err) throw new Error(err)
  if (!signedIn()) {
    set({ ...current, courses: next })
    return current
  }
  const a = await api<Account>('/api/account/courses', { body: { courses: next } })
  set(a)
  return a
}

export async function addCourse(id: string) {
  if (current.courses.includes(id)) return current
  return setPicks([...current.courses, id])
}

export async function toggleInterest(course: string) {
  const on = !current.interest.includes(course)
  set({ ...current, interest: on ? [...current.interest, course] : current.interest.filter((c) => c !== course) })
  if (signedIn()) await api('/api/interest', { body: { course, on } }).catch(() => undefined)
}

/** Start paying for a plan (or switch plans). Returns a Stripe Checkout URL to open, or null when done in place. */
export async function choosePlan(plan: 'three' | 'all'): Promise<string | null> {
  const r = await api<{ url?: string; account?: Account }>('/api/billing/checkout', { body: { plan } })
  if (r.account) set(r.account)
  return r.url ?? null
}

export async function billingPortal(): Promise<string> {
  return (await api<{ url: string }>('/api/billing/portal', { body: {} })).url
}

export async function cancelPlan(resume = false) {
  set(await api<Account>('/api/billing/cancel', { body: { resume } }))
}

export const courseTitle = (id: string) => CATALOG.find((c) => c.id === id)?.title ?? id
