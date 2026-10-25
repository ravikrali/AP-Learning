# EzIQ: study app for AP® exam prep (PWA)

A friendly, gamified study app for AP courses. AP Chemistry and AP Statistics are complete; the catalog lists all 21 courses that are planned (`app/shared/catalog.ts`), and the rest show as "coming soon". It is a Progressive Web App (PWA), so it can be installed on a phone like a regular app, and it works offline once loaded.

## What's inside

| | |
|---|---|
| **Course content** | **AP Chemistry:** Unit 0 "Chemistry Toolkit" (prerequisites) + Units 1–9, **98 lessons** covering **all 91 topics** of the College Board *AP Chemistry Course and Exam Description* (effective Fall 2024). **AP Statistics:** Unit 0 "Statistics Toolkit" + Units 1–5, **63 lessons** covering **all 55 topics** of the redesigned *AP Statistics Course and Exam Description* (effective Fall 2026). Each unit is ordered Foundation → Core → Advanced. |
| **Each lesson** (5–11 min) | Hook → key idea (with diagrams) → step-by-step worked example → "your turn" question → smart tricks → common traps → FRQ tips → summary → quick-check questions. |
| **Practice** | Questions with explanations (391 Chemistry, 244 Statistics), a checkpoint quiz per unit (1–3 stars), mock multiple-choice sections weighted like the real exam with an optional timer (Chemistry 15 / 30 / 60, Statistics 14 / 21 / 42 questions), and self-scored free-response questions in each exam's real format (Chemistry: 7, long 10 / short 4 points; Statistics: 8, two of each of the four 10-point question types). |
| **Memory** | 399 flashcards (262 Chemistry, 137 Statistics) with spaced review (Leitner boxes), capped at 15 a day so it never piles up. |
| **Motivation** | XP and levels, a kind streak (one missed day never breaks it), a weekly goal, and 25 badges. |
| **Review page** | One place for everything to look at again: today's flashcards, **bookmarked topics** (tap the bookmark at the top of any topic) and all **notes** (a notes button on every lesson; searchable). |
| **Search** | 🔍 on the Course, Unit and Topic pages searches the lessons (whole course, one unit, or one topic) and opens the exact card. Glossary terms match first. |
| **Unit tips** | 💡 at the top right of every unit page lists all the smart tricks, shortcuts and traps for that unit. |
| **More** | Per course: an interactive **periodic table** for Chemistry (tap an element for quick insights; color by family, electronegativity or state) and **Formulas & tables** for Statistics (the AP formula sheet plus normal, t and χ² calculators), a **glossary** (130 Chemistry / 131 Statistics terms) that links to the card that explains each term, and **Video links**: every topic's YouTube links on one page, by unit and topic. Students with several courses switch between them with chips at the top. |
| **Study plans** | Six questions (exam date, study days, session length, time, start unit, review weeks) build a day-by-day plan that spreads the remaining lessons evenly and fills the final weeks with practice exams, FRQs and checkpoint retakes. Subscribe in Google/Apple/Outlook Calendar (a private feed at `/api/cal/<token>.ics` that updates itself) or download an .ics file. |
| **Tricky topics & tips** | Active study time (visible tab + recent touch) and first-try accuracy are tracked per lesson. Struggling topics get a "Quick tip" button and a Home card with the lesson's own smart tricks and traps (never generated text), a step back and videos. |
| **YouTube links** | Two popular, on-topic videos per lesson (most-viewed relevant result + an AP-topic video, chosen Oct 2026 and checked to exist), plus a search link. Admins can replace them. |
| **Syllabus checklist** | Learn → a course → 📋 Syllabus shows every official topic, the lesson that teaches it, and whether it's done. |

Progress and notes are written first to a real SQLite database inside the browser (sql.js/WebAssembly, saved to IndexedDB), so everything works offline. When signed in with Google, changes sync through the Cloudflare backend to every device on the same account (see **Backend** below). Guests stay device-only. *Me → Save a backup file* still exports the local database.

## How accuracy is protected

- The lessons follow the official CED text. Topic numbers are shown on every lesson.
- `npm test` (147 automated checks) re-computes **every numeric answer and worked-example number** independently, checks that **every chemical equation is balanced** in atoms and charge, that every formula parses, that every CED topic of every course is taught, that unit titles and weights match the CED, that MCQ keys are valid, and that FRQ point totals match the real exam (Chemistry 10 / 4, Statistics 10). For Statistics, `app/src/lib/stats.ts` (normal, t, χ², binomial, intervals, tests, regression) is checked against the values printed in the CED's own z, t and χ² tables and its sample-question answers, and a markup check makes sure symbols like t^{∗} can't break formatting. It also checks the periodic table (118 elements, every electron configuration adds up to the atomic number, masses match the lessons, positions) and that every glossary term points at a lesson that uses it.
- Element data comes from PubChem (U.S. National Institutes of Health, public domain); `app/src/content/elementData.ts` is generated from it, not typed by hand.
- Two independent expert review passes checked every Chemistry unit for errors. Their findings were fixed.
- Statistics was written from the Fall 2026 CED (downloaded Oct 17, 2026 into `docs/courses/stats/source/`, not committed). Worked examples use small data sets in `app/src/content/stats/data.ts` that the tests recompute, so figures and lessons can never disagree. See `docs/courses/stats/` for the outline, progress and accuracy notes.
- Multiple-choice options are shuffled each time a question is shown, so the right answer isn't always in the same position.

## Run it on this computer

Requires Node.js 20+.

```bash
cd app
npm install
npm run dev
```

Open http://localhost:5173. Without a Google Client ID, a "Continue without Google" button appears.

Other commands: `npm test` (content verification) and `npm run build` (production build into `app/dist`).

## Google sign-in (one-time, ~10 minutes)

The Google sign-in token is verified by the backend, which then issues a 90-day session used for syncing.

1. Go to https://console.cloud.google.com/ and create a project (e.g. "EzIQ").
2. **APIs & Services → OAuth consent screen**: choose **External**, fill in the app name and your email, and keep the default scopes (no extra scopes needed). Publish it ("In production"). Basic sign-in (name/email) needs no Google review.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type **Web application**.
   - *Authorized JavaScript origins*: add `http://localhost:5173` and the live site: `https://www.eziq.app` and `https://eziq.app`.
4. Copy the **Client ID** into `app/.env` (copy `app/.env.example` to `.env`):
   `VITE_GOOGLE_CLIENT_ID=1234-abc.apps.googleusercontent.com`
5. Rebuild (`npm run build`) and redeploy.

## Put it online (free, Cloudflare)

Live at **https://www.eziq.app** (also https://eziq.app). It is served as a static-assets Cloudflare Worker named `ap-learning`; `app/wrangler.jsonc` attaches the custom domains. The old `aplearning.app` addresses stay attached and redirect every page to eziq.app (`OLD_DOMAINS` in `app/shared/brand.ts`); `/api/*` still answers there for the Stripe webhook and old calendar links. The `eziq.app` zone must be in the same Cloudflare account before `npm run deploy`.

```bash
cd app
npx wrangler login     # once per computer
npm run deploy         # tests, build, database migrations, upload
```

## Plans & payments

| Plan | Price | Courses |
|---|---|---|
| Free | $0 | any 1 |
| Trio | $5.99/month | any 3 |
| Everything | $12.99/month | all |

Courses can be added into a free slot any time; swapping one out is allowed once per 30 days. Admins can grant a plan without payment (Admin → Students). Rules live in `app/shared/catalog.ts` and are enforced by the server.

Payments use **Stripe Checkout** (no card data touches our server). One-time setup:

1. Create a Stripe account; in test mode copy the secret key (`sk_test_…`).
2. `cd app && npx wrangler secret put STRIPE_SECRET_KEY`
3. Stripe → Developers → Webhooks → add endpoint `https://www.eziq.app/api/billing/webhook` with events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`. Copy its signing secret, then `npx wrangler secret put STRIPE_WEBHOOK_SECRET`.
4. Stripe → Settings → Billing → Customer portal: turn it on (used for receipts, card changes and cancelling).

Products, prices and coupons are created automatically on first use (lookup keys like `aplearning_three_monthly_599`; the key holds the amount, so a new price in the admin portal makes a new Stripe price and existing subscribers stay on theirs). Until the key is set, paid plans show "Coming soon". Switch to live keys when ready.

**Pricing tab** (admin portal, Pricing role): plans and prices (monthly, optional yearly, free trial, retire a plan), free-course promotions, coupon codes and affiliate codes. Share a code as `https://www.eziq.app/?code=CODE`: the sign-up is credited to the code and the code is filled in on the Plans page. Rules live in `app/shared/pricing.ts`; tables in migration `0006_pricing.sql`.

## Admin portal (admin.eziq.app)

A separate site served by the same Worker (`app/admin.html`, `app/src/admin/`): **Dashboard** (students, sign-ups per day, subscriptions by plan, by country and region, plan changes per month, revenue per month with a 6-month trend forecast, MRR, daily/weekly/monthly active students, study minutes, lessons finished, feature use, hardest topics, course demand), **Audience** (visitors who have not signed in: per day, how far down the welcome page they get, by country/region, channel, site, campaign, device and language; the emails left on the welcome page with CSV download; and students on the free plan), **Content**, **Videos** (lesson video + YouTube links), **Students** (search, grant plans), **Pricing** (plans, prices, promotions, coupon and affiliate codes, channel reports), **Feedback** and **Admins** (portal users, roles and privileges). Add `https://admin.eziq.app` to the Google OAuth client's Authorized JavaScript origins.

## Backend (Cloudflare Workers + D1)

The same Worker serves the app and `/api/*` (`app/worker/index.ts`), backed by the D1 database `ap-learning` (schema in `app/worker/migrations/`).

- **Sign-in:** `POST /api/auth/google` checks the Google ID token's signature, audience, issuer, expiry and verified email, then creates a session (only a SHA-256 hash of the token is stored).
- **Sync:** `POST /api/sync` uploads queued changes and returns everything newer than the device's cursor. SQLite triggers fill a local outbox; merge rules live in `app/shared/sync.ts` and are the same on the server and every device (answers/XP are never double-counted, a finished lesson never becomes unfinished, newest note or setting wins).
- **Admin** (Me → Admin, owner `devt309@gmail.com` as Super Admin plus anyone added in the Admins tab with a role): edit lesson text, quick checks and flashcards; publish videos; read feedback; add/remove portal users. What each person can view, edit or delete per section comes from their role (Admin, Curator, Support, Analyst, Viewer or a custom set; defined in `app/shared/roles.ts`, enforced in `app/worker/index.ts`). Edits are checked before publishing (equations must balance, numeric questions keep their numbers, number changes are flagged) and every change is kept in a history with one-click revert.
- **Analytics:** devices upload `t:time` / `t:ev` items with the normal sync; the server only adds them to the statistics tables (`daily_user`, `topic_user`, `event_daily`) and never stores or returns them. Guests send nothing.
- **Visitors:** the welcome page posts anonymous events to `POST /api/visit` (`app/src/lib/visit.ts`, `app/shared/visit.ts`): a random browser ID, first-touch source (`utm_source` / `utm_medium` / `utm_campaign` or the referring host), device and language; the Worker adds country and region. No name, email or IP address is stored, bots are skipped, and browsers sending Do Not Track or Global Privacy Control are never counted. `POST /api/lead` saves the "Tell me when it's ready" form. To tag a link you share, add e.g. `?utm_source=instagram&utm_medium=social&utm_campaign=fall` to the address. Visitors in the EU, the rest of the EEA and the UK are not counted at all (the Worker checks the country Cloudflare reports; `GET /api/geo` tells the page, which then makes no browser ID). That stands in until a consent banner is decided. The form asks parent or student and has a required “13 or older” tick; only parents are flagged for marketing email.
- **Age question:** a new student is asked their birth month and year before the account is made (`app/shared/age.ts`). Under 13: no account and nothing stored. Otherwise only the birth year is saved, with the campaign tags on the link they arrived by.
- **Error reports and corrections:** "Report an error" under every lesson card posts to `POST /api/report` (sign-in optional) and lands in the Feedback inbox tagged with the lesson and card. An admin can publish a correction from it; `GET /api/errata` is the public list shown on the welcome page and under More → Corrections.
- **Business numbers:** the Dashboard shows free-to-paid conversion, monthly churn, sign-ups by campaign tag and cost per sign-up (rules in `app/shared/business.ts`). Ad spend is typed in on the Dashboard (needs the Dashboard "edit" privilege).
- **Security:** every `/api/*` route is rate-limited per network address (`ratelimits` in `app/wrangler.jsonc`) and every response carries security headers (Content Security Policy, HSTS and others; `secure` in `app/worker/index.ts`). If you add a new outside script, font, or API, add its address to the policy there or the browser will block it. Secret rotation steps are in `docs/security.md`.
- **Local testing:** `npm run dev:api` (local Worker + local D1 on :8787; put `DEV_AUTH=1` in `app/.dev.vars` to enable a test-only sign-in) alongside `npm run dev` (proxies `/api`).

## Install on the phone

- **Android (Chrome):** open the site → menu ⋮ → **Install app** (or "Add to Home screen").
- **iPhone (Safari):** open the site → Share → **Add to Home Screen**.

Once installed, it opens full-screen and works offline. On iPhone, the installed app keeps its own storage, separate from Safari. Saving a backup now and then (More → your profile) is still a good habit.

## Adding videos later

Easiest: **Me → Admin → Videos**, pick the lesson, paste a YouTube link, Publish. (Or edit `app/public/videos.json`.) The key is the lesson id (it appears in the address bar, e.g. `#/lesson/chem-1.1`):

```json
{
  "chem-1.1": { "url": "https://www.youtube.com/watch?v=XXXXXXXX", "title": "Moles in 90 seconds" },
  "chem-3.4": { "src": "videos/ideal-gas.mp4", "title": "PV = nRT" }
}
```

Use `url` for YouTube/Vimeo links, or put an `.mp4` file in `app/public/videos/` and use `src`. The video appears in the lesson right after the first "Key idea" card. **Please watch AI-generated videos fully before adding them**, because they often contain chemistry mistakes.

## Project layout

```
app/
  src/content/chem/u0.ts … u9.ts   lessons, questions, flashcards (one file per unit)
  src/content/chem/frq.ts           free-response practice
  src/content/chem/ced.ts           official CED topic list (used for coverage)
  src/content/stats/                AP Statistics: u0–u5, frq, ced, glossary, youtube, data (shared data sets), diagrams
  src/lib/stats.ts                  statistics functions used to verify content and power Formulas & tables
  src/pages/StatsTables.tsx         Formulas & tables page (Statistics)
  src/content/diagrams.tsx          SVG diagrams
  src/lib/db.ts                     local SQLite storage, sync outbox triggers, backup/restore
  src/lib/sync.ts                   device ↔ account sync
  src/admin/                        admin portal (dashboard, tools)
  src/lib/schedule.ts               study plan builder
  src/lib/track.ts, tips.ts         study time, tricky topics, quick tips
  src/lib/search.ts                 lesson search
  src/lib/visit.ts                  anonymous welcome-page visit counting
  src/content/elements.ts           periodic table layout and insights (data in elementData.ts)
  src/content/chem/glossary.ts      glossary terms
  shared/brand.ts                   app name, logo mark, domain, contact email, trademark notice (the one place to rename)
  shared/age.ts                     the sign-up age rule
  shared/business.ts                conversion, churn and cost-per-sign-up rules
  shared/catalog.ts                 course catalog, plans, pick rules
  shared/plan.ts                    study plan + calendar (.ics)
  worker/stripe.ts                  Stripe calls and webhook checks
  worker/index.ts                   backend (auth, sync, admin, feedback)
  shared/sync.ts                    merge rules used by both sides
  src/lib/progress.ts               XP, streaks, badges, spaced review
  src/pages/                        screens
  tests/                            content verification
```

Content uses a small markup: `**bold**`, `{{H2SO4}}` (formula auto-formatting), `[[eq: 2H2(g) + O2(g) -> 2H2O(l)]]` (formatted **and** balance-checked), `x^{2}`, `K_{a}`.

## Renaming the app

The name, logo mark, domain and contact email are in `app/shared/brand.ts`; change `name` there and everything follows (screens, page titles, the install name, calendar files, Stripe product names). A test fails if the name or domain is typed anywhere else. Moving to another domain also needs the `routes` in `app/wrangler.jsonc`, the Google sign-in authorized origins and the Stripe webhook address.

## Adding a course

Every lesson needs a `cedVersion` tag (the CED edition it was checked against, e.g. `'Fall 2024'`) and the course a matching `cedVersion`; `npm test` fails on a mismatch. When College Board publishes a new edition, change the course's edition, re-check each lesson, and update each lesson's tag by hand as you go.

The engine is subject-agnostic. Write the course in `app/src/content/<course>/` like `chem/` or `stats/`, add it to `COURSES` in `app/src/content/index.ts` (its catalog id must match `shared/catalog.ts`), and register its CED topic list (`CEDS`), practice exams and FRQs (`EXAMS`), YouTube list and glossary in the same file. The generic tests then check coverage, numbers and FRQ points; add course-specific checks in `app/tests/<course>.test.ts`. The `/new-course` playbook in `docs/agent-kit` describes the full process.

---
AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, EzIQ.
