// Minimal Stripe client for the Worker (no SDK): form-encoded REST calls, self-creating prices,
// and webhook signature checks.

import { PLANS, priceCents, type PlanId } from '../shared/catalog'

export interface StripeEnv {
  STRIPE_SECRET_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
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
  if (!res.ok) {
    console.error('stripe', path, res.status, data.error?.message)
    throw new StripeError(502, `Payment service: ${data.error?.message ?? res.status}`)
  }
  return data
}

// ---------- prices ----------
// Prices are found by lookup key, and created the first time they are needed, so the only setup
// in Stripe is the API key and the webhook.

export const lookupKey = (plan: PlanId) => `aplearning_${plan}_monthly_${priceCents(plan)}`

export function planFromLookupKey(key: unknown): PlanId | null {
  const m = /^aplearning_(three|all)_monthly/.exec(String(key ?? ''))
  return m ? (m[1] as PlanId) : null
}

const priceCache = new Map<string, string>()

export async function priceId(env: StripeEnv, plan: Exclude<PlanId, 'free'>): Promise<string> {
  const key = lookupKey(plan)
  const cached = priceCache.get(key)
  if (cached) return cached
  const found = await stripe<{ data: { id: string }[] }>(env, 'GET', 'prices', { lookup_keys: [key], active: 'true', limit: 1 })
  let id = found.data[0]?.id
  if (!id) {
    const product = await stripe<{ id: string }>(env, 'POST', 'products', {
      name: `AP Learning ${PLANS[plan].name}`,
      description: PLANS[plan].blurb,
    })
    const price = await stripe<{ id: string }>(env, 'POST', 'prices', {
      product: product.id,
      currency: 'usd',
      unit_amount: priceCents(plan),
      recurring: { interval: 'month' },
      lookup_key: key,
      transfer_lookup_key: 'true',
    })
    id = price.id
  }
  priceCache.set(key, id)
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
    plan: planFromLookupKey(price.lookup_key) ?? (meta.plan === 'three' || meta.plan === 'all' ? (meta.plan as PlanId) : null),
    userSub: meta.user_sub as string | undefined,
    itemId: item.id as string | undefined,
    periodEnd: end ? new Date(end * 1000).toISOString() : null,
    cancelAtPeriodEnd: s.cancel_at_period_end === true,
  }
}

/** Statuses that keep paid access (past_due: Stripe is still retrying the card). */
export const PAID_STATUSES = new Set(['active', 'trialing', 'past_due'])
