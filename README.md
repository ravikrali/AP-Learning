# AP Learning: AP study app (PWA)

A friendly, gamified study app for AP courses. AP Chemistry is complete; the catalog lists all 21 courses that are planned (`app/shared/catalog.ts`), and the rest show as "coming soon". It is a Progressive Web App (PWA), so it can be installed on a phone like a regular app, and it works offline once loaded.

## What's inside

| | |
|---|---|
| **Course content** | Unit 0 "Chemistry Toolkit" (prerequisites) + Units 1–9, **98 lessons** covering **all 91 topics** of the College Board *AP Chemistry Course and Exam Description* (effective Fall 2024). Each unit is ordered Foundation → Core → Advanced. |
| **Each lesson** (5–11 min) | Hook → key idea (with diagrams) → step-by-step worked example → "your turn" question → smart tricks → common traps → FRQ tips → summary → quick-check questions. |
| **Practice** | 391 questions with explanations, a checkpoint quiz per unit (1–3 stars), mock multiple-choice sections (15 / 30 / 60 questions, weighted like the real exam, optional timer), and 7 self-scored free-response questions in the real exam format. |
| **Memory** | 262 flashcards with spaced review (Leitner boxes), capped at 15 a day so it never piles up. |
| **Motivation** | XP and levels, a kind streak (one missed day never breaks it), a weekly goal, and 25 badges. |
| **Review page** | One place for everything to look at again: today's flashcards, **bookmarked topics** (tap the bookmark at the top of any topic) and all **notes** (a notes button on every lesson; searchable). |
| **Search** | 🔍 on the Course, Unit and Topic pages searches the lessons (whole course, one unit, or one topic) and opens the exact card. Glossary terms match first. |
| **Unit tips** | 💡 at the top right of every unit page lists all the smart tricks, shortcuts and traps for that unit. |
| **More** | An interactive **periodic table** (tap an element for quick insights; color by family, electronegativity or state) and a **glossary** of 130 key terms that link to the card that explains each one. |
| **Study plans** | Six questions (exam date, study days, session length, time, start unit, review weeks) build a day-by-day plan that spreads the remaining lessons evenly and fills the final weeks with practice exams, FRQs and checkpoint retakes. Subscribe in Google/Apple/Outlook Calendar (a private feed at `/api/cal/<token>.ics` that updates itself) or download an .ics file. |
| **Tricky topics & tips** | Active study time (visible tab + recent touch) and first-try accuracy are tracked per lesson. Struggling topics get a "Quick tip" button and a Home card with the lesson's own smart tricks and traps (never generated text), a step back and videos. |
| **YouTube links** | Two popular, on-topic videos per lesson (most-viewed relevant result + an AP-topic video, chosen Oct 2026 and checked to exist), plus a search link. Admins can replace them. |
| **Syllabus checklist** | Learn → AP Chemistry → 📋 Syllabus shows every official topic, the lesson that teaches it, and whether it's done. |

Progress and notes are written first to a real SQLite database inside the browser (sql.js/WebAssembly, saved to IndexedDB), so everything works offline. When signed in with Google, changes sync through the Cloudflare backend to every device on the same account (see **Backend** below). Guests stay device-only. *Me → Save a backup file* still exports the local database.

## How accuracy is protected

- The lessons follow the official CED text. Topic numbers are shown on every lesson.
- `npm test` (63 automated checks) re-computes **every numeric answer and worked-example number** independently, checks that **every chemical equation is balanced** in atoms and charge, that every formula parses, that every CED topic is taught, that MCQ keys are valid, and that FRQ point totals match the real exam (10 / 4). It also checks the periodic table (118 elements, every electron configuration adds up to the atomic number, masses match the lessons, positions) and that every glossary term points at a lesson that uses it.
- Element data comes from PubChem (U.S. National Institutes of Health, public domain); `app/src/content/elementData.ts` is generated from it, not typed by hand.
- Two independent expert review passes checked every unit for chemistry errors. Their findings were fixed.
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

1. Go to https://console.cloud.google.com/ and create a project (e.g. "AP Learning").
2. **APIs & Services → OAuth consent screen**: choose **External**, fill in the app name and your email, and keep the default scopes (no extra scopes needed). Publish it ("In production"). Basic sign-in (name/email) needs no Google review.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type **Web application**.
   - *Authorized JavaScript origins*: add `http://localhost:5173` and the live site: `https://www.aplearning.app` and `https://aplearning.app`.
4. Copy the **Client ID** into `app/.env` (copy `app/.env.example` to `.env`):
   `VITE_GOOGLE_CLIENT_ID=1234-abc.apps.googleusercontent.com`
5. Rebuild (`npm run build`) and redeploy.

## Put it online (free, Cloudflare)

Live at **https://www.aplearning.app** (also https://aplearning.app). It is served as a static-assets Cloudflare Worker named `ap-learning`; `app/wrangler.jsonc` attaches both custom domains.

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
3. Stripe → Developers → Webhooks → add endpoint `https://www.aplearning.app/api/billing/webhook` with events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`. Copy its signing secret, then `npx wrangler secret put STRIPE_WEBHOOK_SECRET`.
4. Stripe → Settings → Billing → Customer portal: turn it on (used for receipts, card changes and cancelling).

Products and prices are created automatically on first use (lookup keys `aplearning_three_monthly_599`, `aplearning_all_monthly_1299`). Until the key is set, paid plans show "Coming soon". Switch to live keys when ready.

## Admin portal (admin.aplearning.app)

A separate site served by the same Worker (`app/admin.html`, `app/src/admin/`): **Dashboard** (students, sign-ups per day, subscriptions by plan, by country and region, plan changes per month, revenue per month with a 6-month trend forecast, MRR, daily/weekly/monthly active students, study minutes, lessons finished, feature use, hardest topics, course demand), **Audience** (visitors who have not signed in: per day, how far down the welcome page they get, by country/region, channel, site, campaign, device and language; the emails left on the welcome page with CSV download; and students on the free plan), **Content**, **Videos** (lesson video + YouTube links), **Students** (search, grant plans), **Feedback** and **Admins**. Add `https://admin.aplearning.app` to the Google OAuth client's Authorized JavaScript origins.

## Backend (Cloudflare Workers + D1)

The same Worker serves the app and `/api/*` (`app/worker/index.ts`), backed by the D1 database `ap-learning` (schema in `app/worker/migrations/`).

- **Sign-in:** `POST /api/auth/google` checks the Google ID token's signature, audience, issuer, expiry and verified email, then creates a session (only a SHA-256 hash of the token is stored).
- **Sync:** `POST /api/sync` uploads queued changes and returns everything newer than the device's cursor. SQLite triggers fill a local outbox; merge rules live in `app/shared/sync.ts` and are the same on the server and every device (answers/XP are never double-counted, a finished lesson never becomes unfinished, newest note or setting wins).
- **Admin** (Me → Admin, owner `devt309@gmail.com` plus anyone added there): edit lesson text, quick checks and flashcards; publish videos; read feedback; add/remove admins. Edits are checked before publishing (equations must balance, numeric questions keep their numbers, number changes are flagged) and every change is kept in a history with one-click revert.
- **Analytics:** devices upload `t:time` / `t:ev` items with the normal sync; the server only adds them to the statistics tables (`daily_user`, `topic_user`, `event_daily`) and never stores or returns them. Guests send nothing.
- **Visitors:** the welcome page posts anonymous events to `POST /api/visit` (`app/src/lib/visit.ts`, `app/shared/visit.ts`): a random browser ID, first-touch source (`utm_source` / `utm_medium` / `utm_campaign` or the referring host), device and language; the Worker adds country and region. No name, email or IP address is stored, bots are skipped, and browsers sending Do Not Track or Global Privacy Control are never counted. `POST /api/lead` saves the "Tell me when it's ready" form. To tag a link you share, add e.g. `?utm_source=instagram&utm_medium=social&utm_campaign=fall` to the address. If you market in the EU or UK, check whether this counting needs a consent banner there.
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

## Adding a course

The engine is subject-agnostic. Write the course in `app/src/content/<course>/` like `chem/`, add it to `COURSES` in `app/src/content/index.ts` (its catalog id must match `shared/catalog.ts`), add its YouTube list, glossary and practice-exam extras, and extend the tests.

---
AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this app.
