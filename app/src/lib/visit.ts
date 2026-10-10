// Anonymous visit counting for the welcome page (people who have not signed in).
// A random ID is kept in this browser; nothing here knows who the visitor is. Browsers that ask
// not to be tracked (Do Not Track or Global Privacy Control) are never counted.

import { hostOf, type VisitBody, type VisitEvent } from '../../shared/visit'

const VID_KEY = 'ap-learning-visitor'
const TOUCH_KEY = 'ap-learning-first-touch'

type Touch = Pick<VisitBody, 'source' | 'medium' | 'campaign' | 'referrer'>

export function trackingAllowed(): boolean {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean }
  return !(n.globalPrivacyControl === true || n.doNotTrack === '1')
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
    // sign-in round trips and our own pages are not referrers
    referrer: ref && ref !== ownHost.replace(/^www\./, '') && !ref.endsWith('aplearning.app') && ref !== 'accounts.google.com' ? ref : undefined,
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
  const vid = visitorId()
  if (!vid) return
  sent.add(event)
  const body: VisitBody = { vid, event, ...firstTouch(), device: device(), lang: clip(navigator.language, 12) }
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (token) headers.authorization = `Bearer ${token}`
  void fetch('/api/visit', { method: 'POST', headers, body: JSON.stringify(body), keepalive: true }).catch(() => undefined)
}

/** The visitor ID to attach to a "tell me when it's ready" sign-up, when counting is allowed. */
export const leadVisitor = () => (trackingAllowed() ? visitorId() : null)
