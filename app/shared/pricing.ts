// Plans and prices, free-course promotions and discount codes. Shared by the app, the admin
// portal and the Worker.
//
// The live set is kept in the database and edited in the admin portal (Pricing tab).
// DEFAULT_PRICING is what a fresh database starts with (migration 0006) and what the app shows
// until it has heard from the server.
//
// Prices are in cents. Changing a price only affects new subscriptions: Stripe keeps everyone
// already subscribed on the price they signed up at. The number of courses a plan includes
// applies to everyone on the plan.

import { CATALOG, CATALOG_IDS } from './catalog'

export type PlanId = string
export const FREE_PLAN: PlanId = 'free'
/** a plan id is part of Stripe price keys, so it is short and plain */
export const PLAN_ID_PATTERN = /^[a-z][a-z0-9]{1,19}$/
/** codes are typed by students: letters, digits, - and _ */
export const CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,29}$/

export type Interval = 'month' | 'year'

export interface Plan {
  id: PlanId
  name: string
  blurb: string
  /** how many courses can be picked; null = every course */
  courses: number | null
  /** cents per month */
  monthly: number
  /** cents per year, when a yearly option is offered */
  yearly: number | null
  /** free days before the first payment (new subscribers only) */
  trialDays: number
  /** order on the plans page */
  sort: number
  /** false = retired: not offered any more, people already on it keep it */
  active: boolean
}

/** Courses that open for everyone, without using a plan slot, between two times. */
export interface CoursePromo {
  id: number
  label: string
  courses: string[]
  /** ISO times; the promotion runs from `starts` up to (not including) `ends` */
  starts: string
  ends: string
}

export interface Pricing {
  plans: Plan[]
  promos: CoursePromo[]
}

export const DEFAULT_PRICING: Pricing = {
  plans: [
    { id: 'free', name: 'Free', blurb: 'Any 2 courses, every lesson and practice exam', courses: 2, monthly: 0, yearly: null, trialDays: 0, sort: 0, active: true },
    { id: 'three', name: 'Trio', blurb: 'Any 3 courses', courses: 3, monthly: 599, yearly: null, trialDays: 0, sort: 1, active: true },
    { id: 'all', name: 'Everything', blurb: 'Every course, including new ones as they arrive', courses: null, monthly: 1299, yearly: null, trialDays: 0, sort: 2, active: true },
  ],
  promos: [],
}

/** Removing a course from your picks is allowed once per this many days (adding into a free slot is always fine). */
export const SWITCH_DAYS = 30

export const money = (cents: number) => (cents === 0 ? 'Free' : `$${(cents / 100).toFixed(2)}`)

// ---------- plans ----------

/** The plan with this id; an unknown id counts as the free plan. */
export function planOf(p: Pricing, id: PlanId | null | undefined): Plan {
  return p.plans.find((x) => x.id === id) ?? p.plans.find((x) => x.id === FREE_PLAN) ?? DEFAULT_PRICING.plans[0]
}

/** Plans in the order they are shown. */
export const sortedPlans = (p: Pricing) => [...p.plans].sort((a, b) => a.sort - b.sort || rankKey(a) - rankKey(b))

/** Plans offered to new subscribers, in order. */
export const offeredPlans = (p: Pricing) => sortedPlans(p).filter((x) => x.active)

const rankKey = (pl: Plan) => (pl.courses ?? 10_000) * 100_000 + pl.monthly

/** How big a plan is: more courses wins, then the higher price. Free is always 0. */
export function planRank(p: Pricing, id: PlanId | null | undefined): number {
  if (!id || id === FREE_PLAN) return 0
  const pl = p.plans.find((x) => x.id === id)
  return pl ? 1 + [...p.plans].filter((x) => x.id !== FREE_PLAN).sort((a, b) => rankKey(a) - rankKey(b)).indexOf(pl) : 0
}

/** The bigger of two plans (b may be missing). */
export const biggerPlan = (p: Pricing, a: PlanId, b: PlanId | null | undefined): PlanId => (b && planRank(p, b) > planRank(p, a) ? b : a)

export const unlimited = (p: Pricing, plan: PlanId) => planOf(p, plan).courses === null

export function pickLimit(p: Pricing, plan: PlanId): number {
  return planOf(p, plan).courses ?? CATALOG.length
}

/** What the plans page lists for a plan. */
export function planFeatures(pl: Plan): string[] {
  const n = pl.courses
  return [
    n === null ? 'Every course, including new ones as they arrive' : `Any ${n} course${n === 1 ? '' : 's'} you choose`,
    'Every lesson, checkpoint and practice exam',
    'Study plan with calendar reminders',
    'Sync across your devices',
  ]
}

/** Clean up a plan typed into the admin portal. Returns the plan, or an error message. */
export function validatePlan(input: unknown): Plan | string {
  const b = (input ?? {}) as Record<string, unknown>
  const id = String(b.id ?? '').trim().toLowerCase()
  if (!PLAN_ID_PATTERN.test(id)) return 'The plan id is 2 to 20 lowercase letters or digits, starting with a letter (for example "duo").'
  const name = String(b.name ?? '').trim()
  if (!name || name.length > 30) return 'Give the plan a name (up to 30 characters).'
  const blurb = String(b.blurb ?? '').trim().slice(0, 120)
  const courses = b.courses === null || b.courses === '' || b.courses === undefined ? null : Number(b.courses)
  if (courses !== null && !(Number.isInteger(courses) && courses >= 1 && courses <= CATALOG.length))
    return `Courses is a whole number from 1 to ${CATALOG.length}, or empty for every course.`
  const cents = (x: unknown) => (x === null || x === '' || x === undefined ? null : Math.round(Number(x)))
  const monthly = cents(b.monthly) ?? 0
  const yearly = cents(b.yearly)
  if (!Number.isFinite(monthly) || monthly < 0 || monthly > 100_000) return 'The monthly price is between $0 and $1,000.'
  if (yearly !== null && (!Number.isFinite(yearly) || yearly < 50 || yearly > 1_000_000)) return 'The yearly price is between $0.50 and $10,000, or empty for none.'
  if (id === FREE_PLAN && (monthly !== 0 || yearly !== null)) return 'The free plan has no price.'
  if (id !== FREE_PLAN && monthly < 50) return 'A paid plan costs at least $0.50 a month (the smallest charge Stripe allows).'
  const trialDays = Number(b.trialDays ?? 0)
  if (!Number.isInteger(trialDays) || trialDays < 0 || trialDays > 90) return 'A free trial is 0 to 90 days.'
  if (id === FREE_PLAN && trialDays) return 'The free plan has no trial.'
  const sort = Number(b.sort ?? 0)
  return {
    id,
    name,
    blurb,
    courses,
    monthly,
    yearly,
    trialDays,
    sort: Number.isFinite(sort) ? Math.round(sort) : 0,
    active: id === FREE_PLAN ? true : b.active !== false,
  }
}

// ---------- free-course promotions ----------

/** Courses open to everyone right now through a promotion, with when each one closes. */
export function promoCourses(p: Pricing, now = new Date()): Map<string, string> {
  const t = now.toISOString()
  const out = new Map<string, string>()
  for (const pr of p.promos)
    if (pr.starts <= t && t < pr.ends) for (const c of pr.courses) if (!out.has(c) || out.get(c)! < pr.ends) out.set(c, pr.ends)
  return out
}

export function validatePromo(input: unknown): Omit<CoursePromo, 'id'> | string {
  const b = (input ?? {}) as Record<string, unknown>
  const label = String(b.label ?? '').trim().slice(0, 80)
  if (!label) return 'Give the promotion a short name students will see (for example "Statistics free through finals").'
  const courses = Array.isArray(b.courses) ? [...new Set(b.courses.map(String))] : []
  if (!courses.length) return 'Pick at least one course.'
  if (courses.some((c) => !CATALOG_IDS.has(c))) return 'Unknown course'
  const starts = isoOrNull(b.starts)
  const ends = isoOrNull(b.ends)
  if (!starts || !ends) return 'Pick a start and an end date.'
  if (ends <= starts) return 'The promotion has to end after it starts.'
  if (Date.parse(ends) - Date.parse(starts) > 400 * 86400_000) return 'A promotion lasts at most 400 days.'
  return { label, courses, starts, ends }
}

function isoOrNull(x: unknown): string | null {
  if (typeof x !== 'string' || !x) return null
  const t = Date.parse(x)
  return Number.isFinite(t) ? new Date(t).toISOString() : null
}

// ---------- opening courses ----------

export interface Entitlement {
  plan: PlanId
  /** courses picked (ignored on an every-course plan) */
  courses: string[]
}

export function canOpen(p: Pricing, e: Entitlement, courseId: string, now = new Date()): boolean {
  return unlimited(p, e.plan) || e.courses.includes(courseId) || promoCourses(p, now).has(courseId)
}

/** Picks that still fit after a downgrade: keep the earliest ones. */
export function trimPicks(p: Pricing, plan: PlanId, courses: string[]): string[] {
  return unlimited(p, plan) ? courses : courses.slice(0, pickLimit(p, plan))
}

/**
 * Check a change of picked courses. Returns an error message, or null when it's allowed.
 * lastSwitch: when a course was last removed (ISO), if ever.
 */
export function checkPickChange(p: Pricing, plan: PlanId, before: string[], after: string[], lastSwitch: string | null, now = new Date()): string | null {
  if (new Set(after).size !== after.length) return 'A course is listed twice'
  if (after.some((id) => !CATALOG_IDS.has(id))) return 'Unknown course'
  const all = unlimited(p, plan)
  const limit = pickLimit(p, plan)
  if (!all && after.length > limit) return `Your plan includes ${limit} course${limit === 1 ? '' : 's'}. Upgrade to add more.`
  const removed = before.filter((id) => !after.includes(id))
  if (removed.length && !all && lastSwitch) {
    const next = new Date(new Date(lastSwitch).getTime() + SWITCH_DAYS * 86400_000)
    if (next > now) return `You can switch courses again on ${next.toISOString().slice(0, 10)}.`
  }
  return null
}

// ---------- discount and affiliate codes ----------

/**
 * coupon: a discount anyone with the code can use.
 * affiliate: a partner's or channel's code. Sign-ups through its link and payments by those
 * students are credited to it (with or without a discount), and a commission can be shown.
 */
export type CodeKind = 'coupon' | 'affiliate'
export type CodeDuration = 'once' | 'repeating' | 'forever'

export interface DiscountCode {
  code: string
  kind: CodeKind
  /** the partner or channel it belongs to, e.g. "tiktok", "Ms Lee (teacher)"; reports group by it */
  channel: string | null
  /** one of percentOff / amountOff, or neither (tracking only) */
  percentOff: number | null
  /** cents */
  amountOff: number | null
  /** once = first payment, repeating = for `months` months, forever = every payment */
  duration: CodeDuration
  months: number | null
  /** plans it works with; empty = every paid plan */
  plans: PlanId[]
  /** ISO times, or null for no limit */
  starts: string | null
  ends: string | null
  /** how many people can use it; null = no limit */
  maxUses: number | null
  /** affiliate commission, percent of what its students pay */
  commissionPct: number | null
  active: boolean
  note: string | null
}

export const hasDiscount = (c: Pick<DiscountCode, 'percentOff' | 'amountOff'>) => !!(c.percentOff || c.amountOff)

/** "20% off for 3 months", "$2.00 off the first payment", "No discount". */
export function describeDiscount(c: Pick<DiscountCode, 'percentOff' | 'amountOff' | 'duration' | 'months'>): string {
  if (!hasDiscount(c)) return 'No discount'
  const off = c.percentOff ? `${c.percentOff}% off` : `${money(c.amountOff!)} off`
  if (c.duration === 'forever') return `${off} every payment`
  if (c.duration === 'repeating') return `${off} for ${c.months} month${c.months === 1 ? '' : 's'}`
  return `${off} the first payment`
}

/** The first payment with a code applied (never below zero). */
export function discounted(cents: number, c: Pick<DiscountCode, 'percentOff' | 'amountOff'> | null): number {
  if (!c || !hasDiscount(c)) return cents
  if (c.percentOff) return Math.max(0, Math.round((cents * (100 - c.percentOff)) / 100))
  return Math.max(0, cents - (c.amountOff ?? 0))
}

/** Why a code can't be used for this plan right now, or null when it can. `uses` = people who already used it. */
export function codeProblem(c: DiscountCode, plan: PlanId, uses: number, now = new Date()): string | null {
  const t = now.toISOString()
  if (!c.active) return 'This code is no longer active.'
  if (c.starts && t < c.starts) return 'This code is not active yet.'
  if (c.ends && t >= c.ends) return 'This code has expired.'
  if (c.maxUses !== null && uses >= c.maxUses) return 'This code has been used up.'
  if (c.plans.length && !c.plans.includes(plan)) return 'This code does not work with that plan.'
  return null
}

export const normalizeCode = (x: unknown) => String(x ?? '').trim().toUpperCase()

/** Clean up a code typed into the admin portal. Returns the code, or an error message. */
export function validateCode(input: unknown, planIds: PlanId[]): DiscountCode | string {
  const b = (input ?? {}) as Record<string, unknown>
  const code = normalizeCode(b.code)
  if (!CODE_PATTERN.test(code)) return 'A code is 3 to 30 letters, digits, - or _ (for example FALL20).'
  const kind: CodeKind = b.kind === 'affiliate' ? 'affiliate' : 'coupon'
  const channel = String(b.channel ?? '').trim().slice(0, 60) || null
  if (kind === 'affiliate' && !channel) return 'Name the partner or channel this affiliate code belongs to.'
  const num = (x: unknown) => (x === null || x === '' || x === undefined ? null : Number(x))
  const percentOff = num(b.percentOff)
  const amountOff = num(b.amountOff)
  if (percentOff !== null && amountOff !== null && percentOff && amountOff) return 'Use a percent off or an amount off, not both.'
  if (percentOff !== null && percentOff !== 0 && !(Number.isInteger(percentOff) && percentOff >= 1 && percentOff <= 100))
    return 'Percent off is a whole number from 1 to 100.'
  if (amountOff !== null && amountOff !== 0 && !(Number.isInteger(amountOff) && amountOff >= 1 && amountOff <= 100_000))
    return 'Amount off is between $0.01 and $1,000.'
  const discount = { percentOff: percentOff || null, amountOff: amountOff || null }
  if (kind === 'coupon' && !hasDiscount(discount)) return 'A coupon needs a percent or an amount off. (Use an affiliate code to track a channel without a discount.)'
  const duration: CodeDuration = b.duration === 'repeating' || b.duration === 'forever' ? b.duration : 'once'
  const months = duration === 'repeating' ? num(b.months) : null
  if (duration === 'repeating' && !(Number.isInteger(months) && months! >= 1 && months! <= 36)) return 'Say for how many months (1 to 36).'
  const plans = Array.isArray(b.plans) ? [...new Set(b.plans.map(String))] : []
  if (plans.some((p) => p === FREE_PLAN || !planIds.includes(p))) return 'Pick paid plans only.'
  const starts = isoOrNull(b.starts)
  const ends = isoOrNull(b.ends)
  if (starts && ends && ends <= starts) return 'The code has to expire after it starts.'
  const maxUses = num(b.maxUses)
  if (maxUses !== null && !(Number.isInteger(maxUses) && maxUses >= 1 && maxUses <= 1_000_000)) return 'Max uses is a whole number, or empty for no limit.'
  const commissionPct = num(b.commissionPct)
  if (commissionPct !== null && !(commissionPct >= 0 && commissionPct <= 100)) return 'Commission is 0 to 100 percent.'
  return {
    code,
    kind,
    channel,
    ...discount,
    duration: hasDiscount(discount) ? duration : 'once',
    months: hasDiscount(discount) ? months : null,
    plans,
    starts,
    ends,
    maxUses,
    commissionPct: kind === 'affiliate' ? commissionPct : null,
    active: b.active !== false,
    note: String(b.note ?? '').trim().slice(0, 200) || null,
  }
}
