# AP Learning: AP Chemistry study app (PWA)

A friendly, gamified study app for AP Chemistry. It is a Progressive Web App (PWA), so it can be installed on a phone like a regular app, and it works offline once loaded.

## What's inside

| | |
|---|---|
| **Course content** | Unit 0 "Chemistry Toolkit" (prerequisites) + Units 1–9, **98 lessons** covering **all 91 topics** of the College Board *AP Chemistry Course and Exam Description* (effective Fall 2024). Each unit is ordered Foundation → Core → Advanced. |
| **Each lesson** (5–11 min) | Hook → key idea (with diagrams) → step-by-step worked example → "your turn" question → smart tricks → common traps → FRQ tips → summary → quick-check questions. |
| **Practice** | 391 questions with explanations, a checkpoint quiz per unit (1–3 stars), mock multiple-choice sections (15 / 30 / 60 questions, weighted like the real exam, optional timer), and 7 self-scored free-response questions in the real exam format. |
| **Memory** | 262 flashcards with spaced review (Leitner boxes), capped at 15 a day so it never piles up. |
| **Motivation** | XP and levels, a kind streak (one missed day never breaks it), a weekly goal, and 25 badges. |
| **Notes** | A notes button on every lesson, plus a searchable Notes tab. |
| **Syllabus checklist** | Learn → AP Chemistry → 📋 Syllabus shows every official topic, the lesson that teaches it, and whether it's done. |

Progress and notes are written first to a real SQLite database inside the browser (sql.js/WebAssembly, saved to IndexedDB), so everything works offline. When signed in with Google, changes sync through the Cloudflare backend to every device on the same account (see **Backend** below). Guests stay device-only. *Me → Save a backup file* still exports the local database.

## How accuracy is protected

- The lessons follow the official CED text. Topic numbers are shown on every lesson.
- `npm test` (25 automated checks) re-computes **every numeric answer and worked-example number** independently, checks that **every chemical equation is balanced** in atoms and charge, that every formula parses, that every CED topic is taught, that MCQ keys are valid, and that FRQ point totals match the real exam (10 / 4).
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

## Backend (Cloudflare Workers + D1)

The same Worker serves the app and `/api/*` (`app/worker/index.ts`), backed by the D1 database `ap-learning` (schema in `app/worker/migrations/`).

- **Sign-in:** `POST /api/auth/google` checks the Google ID token's signature, audience, issuer, expiry and verified email, then creates a session (only a SHA-256 hash of the token is stored).
- **Sync:** `POST /api/sync` uploads queued changes and returns everything newer than the device's cursor. SQLite triggers fill a local outbox; merge rules live in `app/shared/sync.ts` and are the same on the server and every device (answers/XP are never double-counted, a finished lesson never becomes unfinished, newest note or setting wins).
- **Admin** (Me → Admin, owner `devt309@gmail.com` plus anyone added there): edit lesson text, quick checks and flashcards; publish videos; read feedback; add/remove admins. Edits are checked before publishing (equations must balance, numeric questions keep their numbers, number changes are flagged) and every change is kept in a history with one-click revert.
- **Local testing:** `npm run dev:api` (local Worker + local D1 on :8787; put `DEV_AUTH=1` in `app/.dev.vars` to enable a test-only sign-in) alongside `npm run dev` (proxies `/api`).
## Install on the phone

- **Android (Chrome):** open the site → menu ⋮ → **Install app** (or "Add to Home screen").
- **iPhone (Safari):** open the site → Share → **Add to Home Screen**.

Once installed, it opens full-screen and works offline. On iPhone, the installed app keeps its own storage, separate from Safari. Saving a backup now and then (Me tab) is still a good habit.

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
  src/pages/Admin.tsx               admin area
  worker/index.ts                   backend (auth, sync, admin, feedback)
  shared/sync.ts                    merge rules used by both sides
  src/lib/progress.ts               XP, streaks, badges, spaced review
  src/pages/                        screens
  tests/                            content verification
```

Content uses a small markup: `**bold**`, `{{H2SO4}}` (formula auto-formatting), `[[eq: 2H2(g) + O2(g) -> 2H2O(l)]]` (formatted **and** balance-checked), `x^{2}`, `K_{a}`.

## Next: AP Statistics

The app engine is subject-agnostic. AP Statistics will be added as a second course on the same framework.

---
AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this app.
