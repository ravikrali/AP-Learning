// Shared by the app and the Worker: what the welcome page reports about a visitor who has not
// signed in, and how a visit is sorted into a channel.

export const VISIT_EVENTS = ['view', 'see_how', 'see_courses', 'see_pricing', 'see_final', 'lead', 'signin'] as const
export type VisitEvent = (typeof VISIT_EVENTS)[number]

export interface VisitBody {
  vid: string
  event: VisitEvent
  /** first-touch attribution, sent with every event so the first one to arrive records it */
  source?: string
  medium?: string
  campaign?: string
  /** host of the page that linked here */
  referrer?: string
  device?: 'phone' | 'tablet' | 'desktop'
  lang?: string
}

export const VID_PATTERN = /^[A-Za-z0-9_-]{16,40}$/

export type Channel = 'Direct' | 'Search' | 'Social' | 'Email' | 'Paid' | 'Referral' | 'Campaign'

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|baidu|yandex|startpage)\./
const SOCIAL = /(^|\.)(facebook|instagram|tiktok|twitter|x|t|reddit|youtube|youtu|pinterest|snapchat|linkedin|lnkd|discord|threads|whatsapp|telegram)\.[a-z]+$/
const SOCIAL_NAMES = /^(facebook|fb|instagram|ig|tiktok|twitter|x|reddit|youtube|pinterest|snapchat|linkedin|discord|threads|whatsapp|telegram)$/

/** Referring host without "www." and without a port; "" for none or an unparsable value. */
export function hostOf(url: string | undefined | null): string {
  if (!url) return ''
  try {
    return new URL(url.includes('://') ? url : `https://${url}`).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

/** Sort a visit into a channel from its campaign tags and the site that linked to it. */
export function channelOf(v: { source?: string | null; medium?: string | null; referrer?: string | null }): Channel {
  const medium = (v.medium ?? '').toLowerCase()
  const source = (v.source ?? '').toLowerCase()
  const ref = (v.referrer ?? '').toLowerCase()
  if (/^(cpc|ppc|paid|paidsearch|paid_social|paidsocial|display|ads?)$/.test(medium)) return 'Paid'
  if (medium === 'email' || source === 'newsletter' || /(^|\.)mail\./.test(ref)) return 'Email'
  if (/^(social|social-media|social_media)$/.test(medium) || SOCIAL_NAMES.test(source)) return 'Social'
  if (medium === 'organic' || /^(google|bing|duckduckgo|yahoo)$/.test(source)) return 'Search'
  if (source || medium) return 'Campaign'
  if (!ref) return 'Direct'
  if (SEARCH.test(ref)) return 'Search'
  if (SOCIAL.test(ref)) return 'Social'
  return 'Referral'
}
