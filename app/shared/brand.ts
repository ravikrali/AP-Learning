// The product's name and address, in one place. Shared by the app, the admin portal, the Worker
// and the build (page titles, the install manifest).
//
// To rename the app, change `name`. To move it to another address, put the current one in
// OLD_DOMAINS (it then redirects), change `domain`, and then:
//   1. wrangler.jsonc: the "routes" (they cannot read this file)
//   2. Google Cloud: add the new www. and admin. addresses to the sign-in "authorized origins"
//   3. Stripe: the webhook address
// Keys used for saved data (browser storage, Stripe price lookup keys) deliberately do not follow
// the name: changing them would sign everyone out and make a second set of prices.

export const BRAND = {
  name: 'EzIQ',
  /** the emoji shown next to the name */
  mark: '🎓',
  domain: 'eziq.app',
  /** where "contact us" and data requests go */
  email: 'devt309@gmail.com',
  description: 'Short, friendly lessons, practice and study plans for AP® courses.',
} as const

/** Earlier addresses: their pages redirect (301) to the same place here; their /api/* still works. */
export const OLD_DOMAINS: readonly string[] = ['aplearning.app']

/**
 * Where a request to an old address should go: the same page on the current domain (the bare old
 * domain goes to www.). Null for the current domain, and for /api/*, which keeps answering on old
 * addresses for the Stripe webhook and calendar apps subscribed to an old feed link.
 */
export function movedUrl(url: URL): string | null {
  const old = OLD_DOMAINS.find((d) => url.hostname === d || url.hostname.endsWith(`.${d}`))
  if (!old || url.pathname.startsWith('/api/')) return null
  const sub = url.hostname === old ? 'www' : url.hostname.slice(0, -old.length - 1)
  const to = new URL(url.toString())
  to.hostname = `${sub}.${BRAND.domain}`
  to.protocol = 'https:'
  to.port = ''
  return to.toString()
}

export const APP_HOST = `www.${BRAND.domain}`
export const ADMIN_HOST = `admin.${BRAND.domain}`
export const APP_URL = `https://${APP_HOST}`
export const ADMIN_URL = `https://${ADMIN_HOST}`
export const ADMIN_NAME = `${BRAND.name} Admin`

/** The name as part of a file name: "EzIQ" → "eziq". */
export const BRAND_SLUG = BRAND.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** College Board's required notice. Shown wherever the app talks about AP courses or exams. */
export const TRADEMARK_NOTICE = `AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, ${BRAND.name}.`
