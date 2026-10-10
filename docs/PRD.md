# AP Learning: Project Requirements Document

| | |
|---|---|
| **Product** | AP Learning, a study app for AP courses |
| **Live at** | https://www.aplearning.app (students) and https://admin.aplearning.app (admins) |
| **Document date** | October 10, 2026 |
| **Covers** | Every requirement agreed so far, in the order they were decided (see the change log at the end) |

**Status key:** ✅ built and live · 🔧 built, waiting on a setup step by the owner · 📋 agreed, not built yet

---

## 1. Purpose

AP Learning helps high-school students learn an AP course from the foundations up and walk into the exam prepared. It started as a study aid for one student taking AP Chemistry in the 2026–27 school year (exam in May 2027) and is now a product that other families can use and pay for.

### Who it is for

| Person | What they need |
|---|---|
| **Student** (mostly on a phone) | Short lessons that explain the why, practice that feels safe, a plan that fits around school, and quick ways to look things up |
| **Parent** | A calm, trustworthy study aid they can pay for without worrying about accuracy, ads or data misuse |
| **Owner / admin** | To see how the product is doing (sign-ups, subscriptions, revenue, engagement, where visitors come from), fix content, and support students |

### Product principles

1. **Zero made-up facts.** Every lesson follows College Board's official Course and Exam Description (CED). Numbers and equations are re-checked by automated tests. Tips shown to students are the lesson's own checked text, never generated on the fly.
2. **Gentle.** Low stress, effort is praised, XP is never taken away, one missed day never breaks a streak, and the daily review pile is capped.
3. **Foundations first.** Each unit runs Foundation → Core → Advanced. Nothing is locked, so a student can also jump to what the class is doing.
4. **Phone first.** Works well on a phone, installs to the Home screen, and works offline.
5. **Private by default.** No ads, no data sales, and the least data needed to run the app.

---

## 2. Scope

### In scope now
- A web app (PWA) for students, with one complete course (AP Chemistry) and a catalog of 21 planned courses
- Free and paid plans
- A separate admin portal
- A backend for sign-in, sync across devices, payments, statistics and admin tools

### Agreed for later
- 📋 The other 20 courses (AP Statistics was the original second course; "I want this" votes and emails from the welcome page help decide the order)
- 📋 Video uploads hosted by the app (videos are currently added by link)

### Discussed, not decided
- App Store and Google Play versions. Options were laid out (wrap the web app, link out to the website for payment in the US, keep Android on the web app). No decision yet.
- Whether the product name and domain should keep "AP" in them, given College Board's trademark. A lawyer's view was recommended before marketing the paid plans.
- A Terms of Use page reviewed by a lawyer. The current Privacy & terms page is a plain-language summary.

---

## 3. Functional requirements

### 3.1 Welcome page (before sign-in)

| ID | Requirement | Status |
|---|---|---|
| L-1 | An animated welcome page shows the journey from beginner to "AP expert", with the mascot climbing five steps (Basics, Get it, Practice, Remember, Expert). | ✅ |
| L-2 | The animation is generic, not about one subject: the subject shown rotates through several AP courses. | ✅ |
| L-3 | The page explains how the app works, lists all 21 courses (marking the ones that are ready), and shows the three plans with prices. | ✅ |
| L-4 | Sign in with Google. | ✅ |
| L-5 | A "Tell me when my course is ready" form collects an email, an optional first name and an optional course. This is the only place a visitor who has not signed in gives personal details. | ✅ |
| L-6 | Visits are counted anonymously: a random ID kept in the browser, the country and region, the device type, the browser language, the site or link that brought the visitor, campaign tags on the link (`utm_source`, `utm_medium`, `utm_campaign`), and which parts of the page were reached. | ✅ |
| L-7 | Browsers that send "Do Not Track" or Global Privacy Control are not counted. Bots and link previews are not counted. | ✅ |
| L-8 | The page says that visits are counted and links to the privacy summary. It carries the College Board trademark notice. | ✅ |

*Note on L-5/L-6: a website cannot read a visitor's name or email from cookies. Names and emails come only from the form (L-5) or from Google sign-in.*

### 3.2 Accounts and sign-in

| ID | Requirement | Status |
|---|---|---|
| A-1 | Sign in with a personal Google account. The server checks the Google token and issues a 90-day session. | ✅ |
| A-2 | One address for everyone: `aplearning.app` redirects to `www.aplearning.app` so Google sign-in works in every browser. | ✅ |
| A-3 | The country and region at first sign-in are recorded for the dashboard. | ✅ |
| A-4 | The owner's email is always an admin. Admins can add and remove other admins. | ✅ |

### 3.3 Courses and catalog

| ID | Requirement | Status |
|---|---|---|
| C-1 | The catalog lists 21 AP courses in three groups. **History and Social Sciences (8):** African American Studies, Human Geography, Macroeconomics, Microeconomics, Psychology, US Government and Politics, US History, World History: Modern. **Math and Computer Science (6):** Calculus AB, Calculus BC, Computer Science A, Computer Science Principles, Precalculus, Statistics. **Sciences (7):** Chemistry, Biology, Environmental Science, Physics 1, Physics 2, Physics C: Electricity and Magnetism, Physics C: Mechanics. | ✅ |
| C-2 | AP Chemistry is complete: a prerequisite "Chemistry Toolkit" unit plus Units 1–9, 98 lessons covering all 91 CED topics (CED effective Fall 2024). | ✅ |
| C-3 | Courses that are not written yet show as "coming soon". A student can tap "Want it?" to vote. | ✅ |
| C-4 | The remaining 20 courses are written and checked to the same standard, one at a time. | 📋 |
| C-5 | A syllabus page lists every official topic, the lesson that teaches it, and whether it is done. | ✅ |

### 3.4 Plans and payments

| ID | Requirement | Status |
|---|---|---|
| P-1 | **Free:** any 1 course. **Trio:** any 3 courses for $5.99 a month. **Everything:** all available courses for $12.99 a month. | ✅ |
| P-2 | A student picks which courses fill their plan. A course can be added to a free slot at any time. Swapping a course out is allowed once every 30 days. Progress in a dropped course is kept. | ✅ |
| P-3 | Courses outside the plan are gated, with a clear prompt to add the course or see plans. | ✅ |
| P-4 | Payment by card through Stripe: checkout, plan switching with fair proration, cancel at the end of the paid month, and a billing page to manage the card. Card details never reach the app. | 🔧 |
| P-5 | On a downgrade, the picked courses are trimmed to fit the new plan. | ✅ |
| P-6 | Admins can grant a plan without payment (family, teachers, testers) and take it back. | ✅ |

*P-4 setup still needed: add the Stripe secret key and webhook secret to the Worker, create the webhook endpoint `https://www.aplearning.app/api/billing/webhook`, and switch on Stripe's customer portal (steps are in the README).*

### 3.5 Lessons

| ID | Requirement | Status |
|---|---|---|
| S-1 | Lessons are short (about 5–11 minutes) and built from small cards: a hook, key ideas with diagrams, a worked example revealed one step at a time, a "your turn" question, a smart trick, a common trap, FRQ tips, a summary, then quick-check questions. | ✅ |
| S-2 | A wrong answer gets a hint and a second try before the full explanation. Multiple-choice options are shuffled every time. | ✅ |
| S-3 | Each lesson shows the CED topic numbers it covers. | ✅ |
| S-4 | An optional video can be attached to a lesson (by link). | ✅ |
| S-5 | Two popular YouTube videos are linked for each topic, with a "search YouTube" link. They open on YouTube and carry a note that outside videos are not checked line by line. | ✅ |
| S-6 | Finishing a lesson shows an effort-praising message from the mascot, XP earned, any new badge, and the next step. | ✅ |
| S-7 | A lesson remembers where the student stopped. | ✅ |

### 3.6 Practice

| ID | Requirement | Status |
|---|---|---|
| X-1 | Each unit has an optional checkpoint: 10 mixed questions, one try each, no timer, 1–3 stars (90% = 3 stars, 70% = 2). | ✅ |
| X-2 | Practice multiple-choice sections of 15, 30 and 60 questions, weighted like the real exam, with an optional timer. | ✅ |
| X-3 | Seven free-response questions in the real exam format (long = 10 points, short = 4 points), self-scored with a rubric. | ✅ |

### 3.7 Review page

| ID | Requirement | Status |
|---|---|---|
| R-1 | **Cards:** flashcards from finished lessons come back on a spaced schedule (1, 3, 7, 14, 30, then 60 days), at most 15 a day. A missed card returns the next day. | ✅ |
| R-2 | **Bookmarks:** a student can bookmark any topic to review later. Bookmarks are listed on the Review page, can be removed there, and sync across devices. Bookmarked topics are also flagged in the unit's lesson list. | ✅ |
| R-3 | **Notes:** every lesson has a notes button. All notes live under the Review page (there is no separate Notes tab), with a search box and in-place editing. | ✅ |

### 3.8 Search

| ID | Requirement | Status |
|---|---|---|
| F-1 | A search button on the **Course** page searches the whole course. | ✅ |
| F-2 | A search button on the **Unit** page searches that unit, with a switch to the whole course. | ✅ |
| F-3 | A search button on the **Topic** (lesson) page searches that topic, with switches to the unit and the whole course. | ✅ |
| F-4 | Results show the matching words in context and open the lesson at the exact card. Matching glossary terms are listed first. Questions' answers are never shown in results. | ✅ |

### 3.9 Tips and help with hard topics

| ID | Requirement | Status |
|---|---|---|
| T-1 | A **bulb** button at the top right of every Unit page opens all the quick tips, smart tricks, shortcuts and common traps for that unit, grouped by lesson, with filters for tricks and traps. | ✅ |
| T-2 | The app tracks how long a student actively studies each topic and how often answers are right on the first try. | ✅ |
| T-3 | A topic counts as "tricky" when at least 3 answers have under 50% right first time, or when time spent is over 2.5× the planned time (and over 15 minutes). It stops counting after 3 first-try-correct answers in a row. | ✅ |
| T-4 | Tricky topics appear on Home with a "Tips" button. Inside a lesson, a "Quick tip" button appears after two misses. | ✅ |
| T-5 | Tips are the lesson's own checked tricks, traps and summary, plus a pointer to the previous lesson in the same unit and the topic's videos. | ✅ |

### 3.10 Study plan and calendar

| ID | Requirement | Status |
|---|---|---|
| G-1 | For each course, six questions build a custom schedule: exam date, study days, session length, time of day, where to start, and how many review weeks. | ✅ |
| G-2 | The plan spreads the remaining lessons evenly up to the review weeks, puts a checkpoint after each unit, and fills the review weeks with practice exams, FRQs and checkpoint retakes. | ✅ |
| G-3 | The plan can be added to Google, Apple or Outlook Calendar through a private feed that updates itself, or downloaded as a calendar file. Events carry a reminder 10 minutes before. | ✅ |
| G-4 | The plan can be edited, re-planned from today, or deleted. Today's session shows on Home. | ✅ |

### 3.11 More page: reference tools

| ID | Requirement | Status |
|---|---|---|
| M-1 | The bottom menu has a **More** item (in place of "Me"). The More page shows two buttons: Periodic table and Glossary. | ✅ |
| M-2 | **Periodic table:** an interactive table of all 118 elements. Tapping an element shows quick insights: protons and electrons, molar mass, family, state at room temperature, group and period, electron configuration (flagging exceptions such as Cr and Cu), common oxidation states, valence electrons, the usual ion, diatomic elements and electronegativity. | ✅ |
| M-3 | The table can be colored by family, electronegativity or state, searched by name, symbol or number, and zoomed. Links lead to the lessons that explain it. | ✅ |
| M-4 | **Glossary:** the key terms of the course (130 for AP Chemistry) with short definitions, a search box and A–Z jumps. Tapping a term opens the topic where it is explained, at the card that explains it. | ✅ |
| M-5 | The student's profile, badges, plan, settings and help stay reachable from the More page and from the picture at the top of Home. | ✅ |

### 3.12 Navigation

| ID | Requirement | Status |
|---|---|---|
| N-1 | The bottom menu shows **icons only**, no text: Home (house), Learn (open book), Review (cards), More (three dots). | ✅ |
| N-2 | Each icon has a spoken label for screen readers and a tooltip. The Review icon shows how many cards are due. | ✅ |
| N-3 | The menu hides inside lessons, checkpoints and exams so the student can focus. | ✅ |

### 3.13 Motivation

| ID | Requirement | Status |
|---|---|---|
| V-1 | XP for lessons, first-try answers, reviews, checkpoints and exams. Levels with titles. XP is never taken away. | ✅ |
| V-2 | A kind streak (only two missed days in a row break it) and a weekly study-day goal. | ✅ |
| V-3 | 25 badges for course and milestone achievements. | ✅ |
| V-4 | A bear mascot named Bunsen (three other looks can be chosen) with cheering messages that praise effort. | ✅ |

### 3.14 Home page

| ID | Requirement | Status |
|---|---|---|
| H-1 | Home shows a greeting, level, the next lesson, today's planned session, tricky topics, today's review, streak, XP and the week's study days. | ✅ |
| H-2 | An **"Add to Home screen"** card adds an app shortcut. On Android, Chrome and Edge it opens the phone's install prompt. On iPhone it shows the three taps to do it. It hides once installed or dismissed and can be brought back from the profile page. | ✅ |

*A website cannot add the shortcut without the person confirming; that limit is set by Apple and Google.*

### 3.15 Profile, settings and support

| ID | Requirement | Status |
|---|---|---|
| U-1 | Profile page tiles: share my progress, how the app works, FAQ, feedback, plan, courses, privacy. | ✅ |
| U-2 | Dark theme by default, with a light theme. | ✅ |
| U-3 | Save and restore a backup file of all progress. | ✅ |
| U-4 | Feedback goes to an inbox in the admin portal. | ✅ |
| U-5 | A Privacy & terms page in plain language, also reachable from the welcome page. | ✅ |

### 3.16 Sync and offline

| ID | Requirement | Status |
|---|---|---|
| O-1 | Everything is saved on the device first, so the app works offline. | ✅ |
| O-2 | Signed-in devices sync progress, answers, flashcards, notes, bookmarks, settings and study plans. Two devices always end up with the same data. | ✅ |
| O-3 | The app updates itself quietly when a new version is published. | ✅ |

### 3.17 Admin portal

| ID | Requirement | Status |
|---|---|---|
| D-1 | The admin portal lives at its own address, `admin.aplearning.app`, with its own sign-in. Only admins get in. | 🔧 |
| D-2 | **Dashboard:** subscription counts overall, by plan and by geography; new sign-up trend; revenue history and a six-month forecast; engagement (active students, minutes studied, lessons finished, feature use); hardest topics and topics that take longer than planned; course demand. | ✅ |
| D-3 | **Audience:** activity of people who have not signed in (visitors per day, how far down the welcome page they get, how many sign in or leave an email), counts by country and region, the channel and site they came from, campaigns, device and language. | ✅ |
| D-4 | **Audience** also lists the names and emails left on the welcome page (with CSV download), and shows students who are signed in but not subscribed: how many, how active, and by country. | ✅ |
| D-5 | **Content:** edit any lesson card, quick-check question or flashcard, with a history of changes. | ✅ |
| D-6 | **Videos:** attach a lesson video and replace a topic's YouTube links (each link is checked to exist). | ✅ |
| D-7 | **Students:** search students, see their plan and courses, grant or remove a plan. | ✅ |
| D-8 | **Feedback** inbox and **Admins** list. | ✅ |

*D-1 setup still needed: add `https://admin.aplearning.app` to the Google sign-in client's authorized origins.*

### 3.18 Tracking and data

| ID | Requirement | Status |
|---|---|---|
| K-1 | Student behavior is logged for analysis: which topics are hard, time spent per topic, tips and videos opened, and use of search, bookmarks, the glossary and the periodic table. | ✅ |
| K-2 | Statistics are stored as totals per student per day and per topic, not as a click-by-click trail. | ✅ |
| K-3 | The data is used to spot hard topics, suggest quick tips to the student, and show the owner which lessons need work. | ✅ |

---

## 4. Quality requirements

| Area | Requirement |
|---|---|
| **Accuracy** | `npm test` runs 63 automated checks. They re-compute every numeric answer and worked-example number, check that every chemical equation balances in atoms and charge, that every CED topic is taught, that every glossary term points at a lesson that really uses it, and that periodic-table data is consistent (electron counts, masses matching the lessons, positions). Element data comes from PubChem (U.S. National Institutes of Health, public domain). |
| **Privacy** | No ads and no data sales. Visitors are counted without name, email or IP address. Do Not Track and Global Privacy Control are honored. Card details are handled only by Stripe. A parent or guardian makes purchases. |
| **Security** | Google tokens are verified on the server. Sessions are stored as hashes. Admin routes check admin status on every request. Stripe webhooks are signature-checked and safe to receive twice. |
| **Phone use** | Every screen fits a 375-pixel-wide phone without sideways scrolling (the zoomed periodic table scrolls inside its own box). |
| **Offline** | Lessons, practice, review, search, glossary and the periodic table work without internet after the first load. |
| **Accessibility** | Icon-only buttons have spoken labels and tooltips. The welcome animation respects the phone's "reduce motion" setting. |
| **Copyright** | Lessons, questions and artwork are original. Code libraries and the font allow commercial use. Outside videos are linked, not copied. The College Board trademark notice is shown. |

---

## 5. How it is built

| Part | Choice |
|---|---|
| App | React, TypeScript, Vite; a PWA with a service worker |
| On-device storage | SQLite in the browser (sql.js), saved to IndexedDB |
| Backend | One Cloudflare Worker serving the app and `/api/*`; Cloudflare D1 database |
| Sign-in | Google Identity Services |
| Payments | Stripe Checkout, customer portal and webhooks |
| Hosting | Cloudflare, domains `www.aplearning.app` and `admin.aplearning.app` |
| Code | https://github.com/ravikrali/AP-Learning (branch `main`; the app is in `app/`) |

---

## 6. Open items

| # | Item | Owner |
|---|---|---|
| 1 | Add `https://admin.aplearning.app` to Google sign-in's authorized origins | Owner |
| 2 | Set up Stripe (secret key, webhook, customer portal) | Owner |
| 3 | Decide the next course to write | Owner |
| 4 | Lawyer review: use of "AP" in the name and domain; Terms of Use; privacy rules for younger students and for visitors from the EU and UK (visit counting may need a consent banner there) | Owner |
| 5 | Decide on App Store / Google Play versions | Owner |
| 6 | Try "Add to Home screen" on a real iPhone and a real Android phone | Owner |
| 7 | Confirm the GitHub repository is private | Owner |

---

## 7. Change log

| Date | What was agreed |
|---|---|
| Oct 8, 2026 | AP Chemistry first, then AP Statistics. Hosted PWA with on-device SQLite and Google sign-in. Content checked against the CED; zero made-up facts. Foundation → Core → Advanced; gentle gamification. Published at www.aplearning.app. |
| Oct 8, 2026 | Animated welcome page, bear mascot (Bunsen), cheering messages, profile tiles, dark theme. Cloudflare Workers + D1 backend: sync across devices, admin tools, feedback inbox. |
| Oct 9, 2026 | Generic welcome animation. Plans (Free 1 course, Trio $5.99, Everything $12.99). 21-course catalog. Admin portal on its own address with a dashboard. Study plans with calendar events. Behavior tracking, tricky topics and quick tips. YouTube links per topic. "Add to Home screen" on Home. |
| Oct 10, 2026 | Bulb tips on Unit pages. Search on Course, Unit and Topic pages. Bookmarks, shown on the Review page. Notes moved under Review. "More" menu item with Periodic table and Glossary. Icon-only bottom menu. Admin metrics for visitors who have not signed in and for students who are not subscribed; welcome page collects visit sources and optional emails. This document. |
