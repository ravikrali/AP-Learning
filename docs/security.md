# AP Learning: Security runbook

What protects the app, and the jobs that need a person: rotating secrets and responding when something leaks.

## What is built in

| Protection | Where | Notes |
|---|---|---|
| Rate limits on `/api/*` | `rateLimit` in `app/worker/index.ts`; numbers in `app/wrangler.jsonc` (`ratelimits`) | Per network address, per minute: 600 for everything, 60 for sign-in routes, 120 for the public forms (visit, email form, error report). Sized for a classroom sharing one school address. The Stripe webhook is exempt because it proves itself with a signature. Over the limit returns 429. |
| Security headers | `secure` in `app/worker/index.ts` | On every response. Content Security Policy (pages may load only our own scripts, Google sign-in, fonts and embedded lesson videos; the API allows nothing), HSTS for one year, `nosniff`, no framing, referrer policy, permissions policy. |
| Sessions | `sessions` table | Stored as SHA-256 hashes, 90 days. "Sign out on all my devices" on the Me page deletes every session for an account. |
| Admin access | `requirePriv` | Role and privilege checked on every admin request. |
| Stripe webhook | `stripeWebhook` | Signature checked. Accepts the current secret and, during a rotation, the previous one. |

HSTS is sent without `includeSubDomains` and without preload, so a future subdomain that is not on HTTPS will not break. Add them only after every subdomain is on HTTPS for good.

## Secrets and how to rotate them

Run the commands from `app/`. Rotate every 6 months, and straight away if a secret may have leaked or someone with access leaves.

| Secret | Kept in | How to rotate |
|---|---|---|
| `STRIPE_SECRET_KEY` | Cloudflare Worker secret | Stripe Dashboard → Developers → API keys → roll the secret key (choose a 24-hour overlap). Then `npx wrangler secret put STRIPE_SECRET_KEY` with the new key. Test a checkout. |
| `STRIPE_WEBHOOK_SECRET` | Cloudflare Worker secret | 1. `npx wrangler secret put STRIPE_WEBHOOK_SECRET_PREVIOUS` with the current secret. 2. Stripe Dashboard → Developers → Webhooks → the endpoint → roll the signing secret. 3. `npx wrangler secret put STRIPE_WEBHOOK_SECRET` with the new one. 4. A day later, `npx wrangler secret delete STRIPE_WEBHOOK_SECRET_PREVIOUS`. No webhook is lost in between. |
| Cloudflare API token / wrangler login | Your computer | `npx wrangler logout` then `npx wrangler login`. Delete unused API tokens in the Cloudflare dashboard. Turn on two-step sign-in for the Cloudflare account. |
| Google sign-in | Google Cloud | There is no secret: the Client ID is public by design. Keep the list of authorized origins to `https://www.aplearning.app` and `https://admin.aplearning.app` only. |
| Student sessions | D1 `sessions` table | To sign everyone out (for example after a suspected database leak): `npx wrangler d1 execute ap-learning --remote --command "DELETE FROM sessions"`. Everyone signs in with Google again; no progress is lost. |
| Calendar links | D1 `calendar_tokens` table | A student can reset their own link from the study plan page. To reset all: `DELETE FROM calendar_tokens`. |

Never put a secret in the repository. `app/.dev.vars` and `app/.env` are ignored by git; `app/.env.example` holds only the public Google Client ID.

## Rotation log

| Date | Secret | Who | Note |
|---|---|---|---|
| | | | |

## If something leaks

1. Rotate the secret that leaked (table above).
2. Sign everyone out (`DELETE FROM sessions`) if session data or the database may be exposed.
3. Check the Cloudflare Worker logs (Observability is on) and the admin list (Admins tab) for anything unexpected.
4. Write down what happened and when in the rotation log.
