-- Where people sign up from (Cloudflare's country/region of the request at first sign-in).
ALTER TABLE users ADD COLUMN country TEXT;
ALTER TABLE users ADD COLUMN region TEXT;

-- Subscription plan and picked courses, one row per user (missing row = free plan, no picks yet).
CREATE TABLE accounts (
  user_sub TEXT PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'free',          -- free | three | all
  status TEXT NOT NULL DEFAULT 'none',        -- Stripe status: active, trialing, past_due, canceled … ('none' = never paid)
  comp_plan TEXT,                             -- plan granted by an admin (no payment)
  stripe_customer TEXT,
  stripe_subscription TEXT,
  current_period_end TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  courses TEXT NOT NULL DEFAULT '[]',         -- JSON array of picked course ids
  courses_switched_at TEXT,                   -- last time a course was removed from the picks
  updated_at TEXT NOT NULL
);
CREATE INDEX accounts_customer ON accounts(stripe_customer);

-- Paid invoices (revenue history).
CREATE TABLE payments (
  id TEXT PRIMARY KEY,                        -- Stripe invoice id
  user_sub TEXT,
  plan TEXT,
  amount INTEGER NOT NULL,                    -- cents
  currency TEXT NOT NULL,
  paid_at TEXT NOT NULL
);
CREATE INDEX payments_paid ON payments(paid_at);

-- Every plan change (new subscription, upgrade, downgrade, cancellation), for trend charts.
CREATE TABLE plan_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_sub TEXT NOT NULL,
  from_plan TEXT NOT NULL,
  to_plan TEXT NOT NULL,
  at TEXT NOT NULL
);
CREATE INDEX plan_changes_at ON plan_changes(at);

-- Stripe webhook events already handled (Stripe can deliver the same event more than once).
CREATE TABLE stripe_events (id TEXT PRIMARY KEY, type TEXT NOT NULL, received_at TEXT NOT NULL);

-- Learning statistics, kept up to date as devices sync (UTC days).
CREATE TABLE daily_user (
  user_sub TEXT NOT NULL,
  day TEXT NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  lessons_done INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_sub, day)
);
CREATE INDEX daily_user_day ON daily_user(day);

CREATE TABLE topic_user (
  lesson_id TEXT NOT NULL,                    -- a lesson id, or "unit:<id>" for unit checkpoint questions
  user_sub TEXT NOT NULL,
  course TEXT,
  seconds INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  first_try_correct INTEGER NOT NULL DEFAULT 0,
  wrong INTEGER NOT NULL DEFAULT 0,
  tips INTEGER NOT NULL DEFAULT 0,            -- times a quick tip was opened
  last_at TEXT,
  PRIMARY KEY (lesson_id, user_sub)
);
CREATE INDEX topic_user_user ON topic_user(user_sub);

-- Counts of app events per day (lesson opened, video link tapped, plan made …).
CREATE TABLE event_daily (
  day TEXT NOT NULL,
  name TEXT NOT NULL,
  course TEXT NOT NULL DEFAULT '',
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, name, course)
);

-- Analytics uploads already counted (so a retried upload isn't counted twice). Pruned after 30 days.
CREATE TABLE telemetry_ids (uid TEXT PRIMARY KEY, at TEXT NOT NULL);
CREATE INDEX telemetry_ids_at ON telemetry_ids(at);

-- Secret calendar-feed links. The link only reveals the study plan, and must be shown again later,
-- so the token itself is kept (it can be reset from the app).
CREATE TABLE calendar_tokens (
  token TEXT PRIMARY KEY,
  user_sub TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

-- "I want this course" votes for courses that are coming soon.
CREATE TABLE course_interest (
  user_sub TEXT NOT NULL,
  course_id TEXT NOT NULL,
  at TEXT NOT NULL,
  PRIMARY KEY (user_sub, course_id)
);

-- Backfill statistics from answers and lessons synced before this migration.
INSERT INTO daily_user (user_sub, day, attempts, correct)
SELECT user_sub, substr(json_extract(data, '$.at'), 1, 10), COUNT(*), SUM(json_extract(data, '$.correct') = 1)
FROM items WHERE key LIKE 'ev:a:%' AND json_extract(data, '$.at') IS NOT NULL GROUP BY 1, 2;

INSERT INTO daily_user (user_sub, day, lessons_done)
SELECT user_sub, substr(json_extract(data, '$.completed_at'), 1, 10), COUNT(*)
FROM items WHERE key LIKE 'lesson:%' AND json_extract(data, '$.status') = 'done' AND json_extract(data, '$.completed_at') IS NOT NULL
GROUP BY 1, 2
ON CONFLICT (user_sub, day) DO UPDATE SET lessons_done = lessons_done + excluded.lessons_done;

INSERT INTO topic_user (lesson_id, user_sub, course, attempts, first_try_correct, wrong, last_at)
SELECT CASE WHEN ctx LIKE 'checkpoint:%' THEN 'unit:' || substr(ctx, 12) ELSE ctx END, user_sub, NULL,
       COUNT(*), SUM(ok = 1 AND ft = 1), SUM(ok = 0), MAX(at)
FROM (SELECT user_sub, json_extract(data, '$.context') AS ctx, json_extract(data, '$.correct') AS ok,
             json_extract(data, '$.first_try') AS ft, json_extract(data, '$.at') AS at
      FROM items WHERE key LIKE 'ev:a:%')
WHERE ctx IS NOT NULL AND ctx NOT LIKE 'exam:%'
GROUP BY 1, 2;
