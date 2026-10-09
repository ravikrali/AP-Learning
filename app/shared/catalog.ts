// Every AP course the app will offer, and the subscription plans. Shared by the app and the Worker.
// A course listed here but not built yet shows as "coming soon"; the app decides which are built
// (src/content/index.ts COURSES).

export type Category = 'History and Social Sciences' | 'Math and Computer Science' | 'Sciences'

export interface CatalogCourse {
  id: string
  title: string
  short: string
  emoji: string
  category: Category
  /** 2027 regular exam date and start time (local), from College Board's AP Central exam calendar */
  exam: { date: string; time: '08:00' | '12:00' }
}

const H: Category = 'History and Social Sciences'
const M: Category = 'Math and Computer Science'
const S: Category = 'Sciences'

export const CATEGORIES: Category[] = [H, M, S]

export const CATALOG: CatalogCourse[] = [
  { id: 'afam', title: 'AP African American Studies', short: 'AP AAS', emoji: '✊🏾', category: H, exam: { date: '2027-05-06', time: '12:00' } },
  { id: 'hug', title: 'AP Human Geography', short: 'AP HuG', emoji: '🗺️', category: H, exam: { date: '2027-05-03', time: '08:00' } },
  { id: 'macro', title: 'AP Macroeconomics', short: 'AP Macro', emoji: '🏦', category: H, exam: { date: '2027-05-07', time: '12:00' } },
  { id: 'micro', title: 'AP Microeconomics', short: 'AP Micro', emoji: '🛒', category: H, exam: { date: '2027-05-04', time: '12:00' } },
  { id: 'psych', title: 'AP Psychology', short: 'AP Psych', emoji: '🧠', category: H, exam: { date: '2027-05-14', time: '12:00' } },
  { id: 'usgov', title: 'AP United States Government and Politics', short: 'AP Gov', emoji: '🏛️', category: H, exam: { date: '2027-05-04', time: '08:00' } },
  { id: 'apush', title: 'AP United States History', short: 'APUSH', emoji: '🦅', category: H, exam: { date: '2027-05-07', time: '08:00' } },
  { id: 'world', title: 'AP World History: Modern', short: 'AP World', emoji: '🌍', category: H, exam: { date: '2027-05-06', time: '08:00' } },
  { id: 'calcab', title: 'AP Calculus AB', short: 'Calc AB', emoji: '∫', category: M, exam: { date: '2027-05-10', time: '08:00' } },
  { id: 'calcbc', title: 'AP Calculus BC', short: 'Calc BC', emoji: '∑', category: M, exam: { date: '2027-05-10', time: '08:00' } },
  { id: 'csa', title: 'AP Computer Science A', short: 'AP CSA', emoji: '☕', category: M, exam: { date: '2027-05-12', time: '12:00' } },
  { id: 'csp', title: 'AP Computer Science Principles', short: 'AP CSP', emoji: '💻', category: M, exam: { date: '2027-05-14', time: '08:00' } },
  { id: 'precalc', title: 'AP Precalculus', short: 'AP Precalc', emoji: '📐', category: M, exam: { date: '2027-05-11', time: '08:00' } },
  { id: 'stats', title: 'AP Statistics', short: 'AP Stats', emoji: '📊', category: M, exam: { date: '2027-05-11', time: '12:00' } },
  { id: 'chem', title: 'AP Chemistry', short: 'AP Chem', emoji: '⚗️', category: S, exam: { date: '2027-05-06', time: '12:00' } },
  { id: 'bio', title: 'AP Biology', short: 'AP Bio', emoji: '🧬', category: S, exam: { date: '2027-05-03', time: '12:00' } },
  { id: 'apes', title: 'AP Environmental Science', short: 'APES', emoji: '🌱', category: S, exam: { date: '2027-05-13', time: '12:00' } },
  { id: 'phys1', title: 'AP Physics 1: Algebra-Based', short: 'Physics 1', emoji: '🎢', category: S, exam: { date: '2027-05-05', time: '12:00' } },
  { id: 'phys2', title: 'AP Physics 2: Algebra-Based', short: 'Physics 2', emoji: '💡', category: S, exam: { date: '2027-05-06', time: '08:00' } },
  { id: 'physcem', title: 'AP Physics C: Electricity and Magnetism', short: 'Physics C: E&M', emoji: '🧲', category: S, exam: { date: '2027-05-05', time: '12:00' } },
  { id: 'physcm', title: 'AP Physics C: Mechanics', short: 'Physics C: Mech', emoji: '⚙️', category: S, exam: { date: '2027-05-03', time: '08:00' } },
]

export const CATALOG_IDS = new Set(CATALOG.map((c) => c.id))
export const catalogCourse = (id: string) => CATALOG.find((c) => c.id === id)

// ---------- plans ----------

export type PlanId = 'free' | 'three' | 'all'

export interface Plan {
  id: PlanId
  name: string
  /** US dollars per month */
  price: number
  /** how many courses she can pick; null = every course */
  courses: number | null
  blurb: string
}

export const PLANS: Record<PlanId, Plan> = {
  free: { id: 'free', name: 'Free', price: 0, courses: 1, blurb: 'Any 1 course, every lesson and practice exam' },
  three: { id: 'three', name: 'Trio', price: 5.99, courses: 3, blurb: 'Any 3 courses' },
  all: { id: 'all', name: 'Everything', price: 12.99, courses: null, blurb: 'Every course, including new ones as they arrive' },
}

export const PLAN_ORDER: PlanId[] = ['free', 'three', 'all']

/** Removing a course from your picks is allowed once per this many days (adding into a free slot is always fine). */
export const SWITCH_DAYS = 30

export interface Entitlement {
  plan: PlanId
  /** courses she picked (ignored for the "all" plan) */
  courses: string[]
}

export function pickLimit(plan: PlanId): number {
  return PLANS[plan].courses ?? CATALOG.length
}

export function canOpen(e: Entitlement, courseId: string): boolean {
  return e.plan === 'all' || e.courses.includes(courseId)
}

/** Picks that still fit after a downgrade: keep the earliest ones. */
export function trimPicks(plan: PlanId, courses: string[]): string[] {
  return plan === 'all' ? courses : courses.slice(0, pickLimit(plan))
}

/**
 * Check a change of picked courses. Returns an error message, or null when it's allowed.
 * lastSwitch: when she last removed a course (ISO), if ever.
 */
export function checkPickChange(plan: PlanId, before: string[], after: string[], lastSwitch: string | null, now = new Date()): string | null {
  if (new Set(after).size !== after.length) return 'A course is listed twice'
  if (after.some((id) => !CATALOG_IDS.has(id))) return 'Unknown course'
  if (plan !== 'all' && after.length > pickLimit(plan))
    return `Your plan includes ${pickLimit(plan)} course${pickLimit(plan) === 1 ? '' : 's'}. Upgrade to add more.`
  const removed = before.filter((id) => !after.includes(id))
  if (removed.length && plan !== 'all' && lastSwitch) {
    const next = new Date(new Date(lastSwitch).getTime() + SWITCH_DAYS * 86400_000)
    if (next > now) return `You can switch courses again on ${next.toISOString().slice(0, 10)}.`
  }
  return null
}

/** Monthly price in cents (for Stripe). */
export const priceCents = (plan: PlanId) => Math.round(PLANS[plan].price * 100)
