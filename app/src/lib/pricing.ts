// The live plans, prices and free-course promotions (edited in the admin portal). Fetched from
// GET /api/pricing; a copy is kept on the device so prices show and promotions open offline.

import { useSyncExternalStore } from 'react'
import { DEFAULT_PRICING, type Pricing } from '../../shared/pricing'

const KEY = 'ap-learning-pricing'
const listeners = new Set<() => void>()

function saved(): Pricing {
  try {
    const raw = localStorage.getItem(KEY)
    const p = raw ? (JSON.parse(raw) as Pricing) : null
    return p && Array.isArray(p.plans) && p.plans.length && Array.isArray(p.promos) ? p : DEFAULT_PRICING
  } catch {
    return DEFAULT_PRICING
  }
}

let current: Pricing = saved()

export const pricingStore = {
  get: () => current,
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

export function usePricing(): Pricing {
  return useSyncExternalStore(pricingStore.subscribe, pricingStore.get)
}

export async function refreshPricing(): Promise<Pricing> {
  const r = await fetch('/api/pricing')
  if (!r.ok) return current
  const p = (await r.json()) as Pricing
  if (!Array.isArray(p.plans) || !p.plans.length) return current
  current = { plans: p.plans, promos: Array.isArray(p.promos) ? p.promos : [] }
  try {
    localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    /* private mode */
  }
  listeners.forEach((fn) => fn())
  return current
}
