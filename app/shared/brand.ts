// The product's name and address, in one place. Shared by the app, the admin portal, the Worker
// and the build (page titles, the install manifest).
//
// To rename the app, change `name`. To move it to another address, change `domain` and then:
//   1. wrangler.jsonc: the three "routes" (they cannot read this file)
//   2. Google Cloud: add the new www. and admin. addresses to the sign-in "authorized origins"
//   3. Stripe: the webhook address
// Keys used for saved data (browser storage, Stripe price lookup keys) deliberately do not follow
// the name: changing them would sign everyone out and make a second set of prices.

export const BRAND = {
  name: 'AP Learning',
  /** the emoji shown next to the name */
  mark: '🎓',
  domain: 'aplearning.app',
  /** where "contact us" and data requests go */
  email: 'devt309@gmail.com',
  description: 'Short, friendly lessons, practice and study plans for AP® courses.',
} as const

export const APP_HOST = `www.${BRAND.domain}`
export const ADMIN_HOST = `admin.${BRAND.domain}`
export const APP_URL = `https://${APP_HOST}`
export const ADMIN_URL = `https://${ADMIN_HOST}`
export const ADMIN_NAME = `${BRAND.name} Admin`

/** The name as part of a file name: "AP Learning" → "ap-learning". */
export const BRAND_SLUG = BRAND.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** College Board's required notice. Shown wherever the app talks about AP courses or exams. */
export const TRADEMARK_NOTICE = `AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, ${BRAND.name}.`
