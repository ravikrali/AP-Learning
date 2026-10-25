// Anonymous visit counting for the welcome page (people who have not signed in).
// A random ID is kept in this browser; nothing here knows who the visitor is. Browsers that ask
// not to be tracked (Do Not Track or Global Privacy Control) are never counted, and neither are
// visitors in the EU, EEA or UK (no consent banner yet): for them no ID is made at all.

import { hostOf, type VisitBody, type VisitEvent } from '../../shared/visit'
import { BRAND } from '../../shared/brand'

const VID_KEY = 'ap-learning-visitor'
const TOUCH_KEY = 'ap-learning-first-touch'

type Touch = Pick<VisitBody, 'source' | 'medium' | 'campaign' | 'referrer'> & {
  /** a discount or affiliate code on the link (?code=…), credited with this person's sign-up */
  code?: string
}

export function trackingAllowed(): boolean {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean }
  return !(n.globalPrivacyControl === true || n.doNotTrack === '1')
}

let countingHere: Promise<boolean> | null = null

/**
 * May this visit be counted? Asks the server once per page load, because only the server knows
 * the visitor's country. Where the answer is no, anything an earlier visit left behind is removed.
 */
export function countingAllowed(): Promise<boolean> {
  if (!trackingAllowed()) return Promise.resolve(false)
  if (!countingHere)
    countingHere = fetch('/api/geo')
      .then((r) => (r.ok ? (r.json() as Promise<{ count?: boolean }>) : { count: false }))
      .then((d) => d.count === true)
      .catch(() => false)
      .then((ok) => {
        if (!ok)
          try {
            localStorage.removeItem(VID_KEY)
            localStorage.removeItem(TOUCH_KEY)
          } catch {
            /* nothing was stored */
          }
        return ok
      })
  return countingHere
}

function visitorId(): string | null {
  try {
    let id = localStorage.getItem(VID_KEY)
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(15)), (b) => b.toString(16).padStart(2, '0')).join('')
      localStorage.setItem(VID_KEY, id)
    }
    return id
  } catch {
    return null // private mode: don't count
  }
}

const clip = (s: string | null | undefined, max = 80) => (s ? s.trim().slice(0, max) || undefined : undefined)

/** Where this visitor first came from: campaign tags on the link, and the site that linked here. */
export function readTouch(search: string, referrer: string, ownHost: string): Touch {
  const p = new URLSearchParams(search)
  const ref = hostOf(referrer)
  return {
    source: clip(p.get('utm_source') ?? p.get('ref') ?? p.get('source')),
    medium: clip(p.get('utm_medium')),
    campaign: clip(p.get('utm_campaign')),
    code: clip(p.get('code') ?? p.get('promo'), 30)?.toUpperCase(),
    // sign-in round trips and our own pages are not referrers
    referrer: ref && ref !== ownHost.replace(/^www\./, '') && !ref.endsWith(BRAND.domain) && ref !== 'accounts.google.com' ? ref : undefined,
  }
}

function firstTouch(): Touch {
  try {
    const saved = localStorage.getItem(TOUCH_KEY)
    if (saved) return JSON.parse(saved) as Touch
    const t = readTouch(window.location.search, document.referrer, window.location.hostname)
    localStorage.setItem(TOUCH_KEY, JSON.stringify(t))
    return t
  } catch {
    return {}
  }
}

function device(): VisitBody['device'] {
  const w = Math.min(window.screen?.width ?? window.innerWidth, window.innerWidth || Infinity)
  return w < 600 ? 'phone' : w < 1024 ? 'tablet' : 'desktop'
}

const sent = new Set<string>()

/** Report one welcome-page event (each kind at most once per page load). Never throws. */
export function trackVisit(event: VisitEvent, token?: string) {
  if (sent.has(event) || !trackingAllowed()) return
  sent.add(event)
  void countingAllowed().then((ok) => {
    const vid = ok ? visitorId() : null
    if (!vid) return
    const body: VisitBody = { vid, event, ...firstTouch(), device: device(), lang: clip(navigator.language, 12) }
    const headers: Record<string, string> = { 'content-type': 'application/json' }
    if (token) headers.authorization = `Bearer ${token}`
    return fetch('/api/visit', { method: 'POST', headers, body: JSON.stringify(body), keepalive: true }).catch(() => undefined)
  })
}

/** The visitor ID to attach to a "tell me when it's ready" sign-up, when counting is allowed. */
export const leadVisitor = () => countingAllowed().then((ok) => (ok ? visitorId() : null))

/**
 * The campaign tags (utm_source, utm_medium, utm_campaign) to record with a new account.
 * Uses the first-touch tags when this browser has them, otherwise the tags on the current link.
 * Reads only: nothing is stored here.
 */
export function signupTags(): Pick<Touch, 'source' | 'medium' | 'campaign' | 'code'> {
  let t: Touch | null = null
  try {
    const saved = localStorage.getItem(TOUCH_KEY)
    if (saved) t = JSON.parse(saved) as Touch
  } catch {
    /* fall through to the link */
  }
  t ??= readTouch(window.location.search, document.referrer, window.location.hostname)
  return { source: t.source, medium: t.medium, campaign: t.campaign, code: t.code ?? readTouch(window.location.search, '', '').code }
}

/** The code on the link this visitor came through, to fill in on the plans page. Reads only. */
export const linkCode = () => signupTags().code
