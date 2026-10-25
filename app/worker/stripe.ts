// Minimal Stripe client for the Worker (no SDK): form-encoded REST calls, self-creating prices
// and coupons, and webhook signature checks.

import { describeDiscount, PLAN_ID_PATTERN, type DiscountCode, type Interval, type Plan, type PlanId } from '../shared/pricing'
import { BRAND } from '../shared/brand'

export interface StripeEnv {
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  /** only set while rotating the webhook secret (see docs/security.md) */
  STRIPE_WEBHOOK_SECRET_PREVIOUS?: string
}

export class StripeError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

type Params = Record<string, unknown>

/** Stripe's nested form encoding: {a: {b: 1}, c: [x]} → a[b]=1&c[0]=x */
export function formEncode(obj: Params, prefix = '', out = new URLSearchParams()): URLSearchParams {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) v.forEach((x, i) => (typeof x === 'object' ? formEncode(x as Params, `${key}[${i}]`, out) : out.append(`${key}[${i}]`, String(x))))
    else if (typeof v === 'object') formEncode(v as Params, key, out)
    else out.append(key, String(v))
  }
  return out
}

export async function stripe<T = Record<string, unknown>>(env: StripeEnv, method: 'GET' | 'POST', path: string, params: Params = {}): Promise<T> {
  if (!env.STRIPE_SECRET_KEY) throw new StripeError(503, 'Payments are not set up yet')
  const body = formEncode(params)
  const url = `https://api.stripe.com/v1/${path}${method === 'GET' && [...body].length ? `?${body}` : ''}`
  const res = await fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      ...(method === 'POST' ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: method === 'POST' ? body.toString() : undefined,
  })
  const data = (await res.json()) as T & { error?: { message?: string } }
  if (res.status === 404 && method === 'GET') throw new StripeError(404, data.error?.message ?? 'Not found')
  if (!res.ok) {
    console.error('stripe', path, res.status, data.error?.message)
    throw new StripeError(502, `Payment service: ${data.error?.message ?? res.status}`)
  }
  return data
}

// ---------- prices ----------
// Prices are found by lookup key, and created the first time they are needed, so the only setup
// in Stripe is the API key and the webhook. The key holds the amount, so a new price in the admin
// portal makes a new Stripe price and people already subscribed stay on the one they bought.
// (The "aplearning_" prefix stays when the product is renamed, so no second set of prices is made.)

export const lookupKey = (plan: PlanId, interval: Interval, cents: number) =>
  `aplearning_${plan}_${interval === 'year' ? 'yearly' : 'monthly'}_${cents}`

export function planFromLookupKey(key: unknown): PlanId | null {
  const m = /^aplearning_([a-z][a-z0-9]{1,19})_(monthly|yearly)_\d+$/.exec(String(key ?? ''))
  return m && m[1] !== 'free' ? m[1] : null
}

const priceCache = new Map<string, string>()

export async function priceId(env: StripeEnv, plan: Plan, interval: Interval): Promise<string> {
  const cents = interval === 'year' ? plan.yearly : plan.monthly
  if (!cents) throw new StripeError(400, `${plan.name} has no ${interval === 'year' ? 'yearly' : 'monthly'} price`)
  const key = lookupKey(plan.id, interval, cents)
  const cached = priceCache.get(key)
  if (cached) return cached
  const found = await stripe<{ data: { id: string }[] }>(env, 'GET', 'prices', { lookup_keys: [key], active: 'true', limit: 1 })
  let id = found.data[0]?.id
  if (!id) {
    const product = await stripe<{ id: string }>(env, 'POST', 'products', {
      name: `${BRAND.name} ${plan.name}`,
      description: plan.blurb || undefined,
    })
    const price = await stripe<{ id: string }>(env, 'POST', 'prices', {
      product: product.id,
      currency: 'usd',
      unit_amount: cents,
      recurring: { interval },
      lookup_key: key,
      transfer_lookup_key: 'true',
    })
    id = price.id
  }
  priceCache.set(key, id)
  return id
}

// ---------- coupons ----------
// One Stripe coupon per code and discount; editing a code's discount makes a new coupon, and
// people who already used the old one keep it.

export function couponId(c: Pick<DiscountCode, 'code' | 'percentOff' | 'amountOff' | 'duration' | 'months'>): string {
  const off = c.percentOff ? `${c.percentOff}pct` : `${c.amountOff}c`
  return `aplearning_${c.code}_${off}_${c.duration}${c.duration === 'repeating' ? c.months : ''}`.toLowerCase()
}

export async function ensureCoupon(env: StripeEnv, c: DiscountCode): Promise<string> {
  const id = couponId(c)
  try {
    await stripe(env, 'GET', `coupons/${encodeURIComponent(id)}`)
    return id
  } catch (e) {
    if (!(e instanceof StripeError) || e.status !== 404) throw e
  }
  await stripe(env, 'POST', 'coupons', {
    id,
    name: `${c.code}: ${describeDiscount(c)}`.slice(0, 40),
    ...(c.percentOff ? { percent_off: c.percentOff } : { amount_off: c.amountOff, currency: 'usd' }),
    duration: c.duration,
    ...(c.duration === 'repeating' ? { duration_in_months: c.months } : {}),
  })
  return id
}

// ---------- webhooks ----------

function hex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}

export async function signPayload(payload: string, secret: string, t: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`)))
}

/** Checks the Stripe-Signature header (t=…,v1=…) against the raw body; rejects signatures older than 5 minutes. */
export async function verifyStripeSignature(payload: string, header: string | null, secret: string, nowSec = Date.now() / 1000): Promise<boolean> {
  if (!header) return false
  const parts = header.split(',').map((p) => p.trim().split('='))
  const t = Number(parts.find(([k]) => k === 't')?.[1])
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v)
  if (!Number.isFinite(t) || !sigs.length || Math.abs(nowSec - t) > 300) return false
  const expected = await signPayload(payload, secret, t)
  return sigs.some((s) => safeEqual(s, expected))
}

/** Subscription fields we use, from either the older or the 2025+ API shape. */
export function readSubscription(s: Record<string, unknown>) {
  const items = (s.items as { data?: Record<string, unknown>[] } | undefined)?.data ?? []
  const item = items[0] ?? {}
  const price = (item.price ?? {}) as Record<string, unknown>
  const meta = (s.metadata ?? {}) as Record<string, string>
  const end = Number(s.current_period_end ?? item.current_period_end ?? 0)
  return {
    id: String(s.id),
    customer: String(s.customer),
    status: String(s.status),
    plan: planFromLookupKey(price.lookup_key) ?? (PLAN_ID_PATTERN.test(meta.plan ?? '') && meta.plan !== 'free' ? meta.plan : null),
    priceCents: typeof price.unit_amount === 'number' ? price.unit_amount : null,
    interval: ((price.recurring as Record<string, unknown> | undefined)?.interval === 'year' ? 'year' : 'month') as Interval,
    code: meta.code || null,
    userSub: meta.user_sub as string | undefined,
    itemId: item.id as string | undefined,
    periodEnd: end ? new Date(end * 1000).toISOString() : null,
    cancelAtPeriodEnd: s.cancel_at_period_end === true,
  }
}

/** Statuses that keep paid access (past_due: Stripe is still retrying the card). */
export const PAID_STATUSES = new Set(['active', 'trialing', 'past_due'])
