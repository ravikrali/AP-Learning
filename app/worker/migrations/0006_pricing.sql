-- Plans, prices, free-course promotions and discount/affiliate codes, edited in the admin portal
-- (Pricing tab). The rules are in shared/pricing.ts.

CREATE TABLE pricing_plans (
  id TEXT PRIMARY KEY,                        -- free | three | all | any new id (part of Stripe price keys)
  name TEXT NOT NULL,
  blurb TEXT NOT NULL DEFAULT '',
  courses INTEGER,                            -- courses that can be picked; NULL = every course
  monthly_cents INTEGER NOT NULL DEFAULT 0,
  yearly_cents INTEGER,                       -- NULL = no yearly option
  trial_days INTEGER NOT NULL DEFAULT 0,
  sort INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,          -- 0 = retired: not offered, people on it keep it
  updated_by TEXT,
  updated_at TEXT NOT NULL
);
INSERT INTO pricing_plans (id, name, blurb, courses, monthly_cents, sort, updated_at) VALUES
  ('free', 'Free', 'Any 2 courses, every lesson and practice exam', 2, 0, 0, '2026-10-24T00:00:00.000Z'),
  ('three', 'Trio', 'Any 3 courses', 3, 599, 1, '2026-10-24T00:00:00.000Z'),
  ('all', 'Everything', 'Every course, including new ones as they arrive', NULL, 1299, 2, '2026-10-24T00:00:00.000Z');

-- Courses open to everyone for a while, without using a plan slot.
CREATE TABLE course_promos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  courses TEXT NOT NULL,                      -- JSON array of course ids
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX course_promos_ends ON course_promos(ends_at);

CREATE TABLE discount_codes (
  code TEXT PRIMARY KEY,                      -- upper case
  kind TEXT NOT NULL,                         -- coupon | affiliate
  channel TEXT,                               -- partner or channel, for reports
  percent_off INTEGER,
  amount_off INTEGER,                         -- cents
  duration TEXT NOT NULL DEFAULT 'once',      -- once | repeating | forever
  months INTEGER,
  plans TEXT NOT NULL DEFAULT '[]',           -- JSON array of plan ids; [] = every paid plan
  starts_at TEXT,
  ends_at TEXT,
  max_uses INTEGER,
  commission_pct REAL,
  active INTEGER NOT NULL DEFAULT 1,
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Who used a code at checkout (once per person per code).
CREATE TABLE code_redemptions (
  code TEXT NOT NULL,
  user_sub TEXT NOT NULL,
  plan TEXT,
  at TEXT NOT NULL,
  PRIMARY KEY (code, user_sub)
);

-- The code on the link a student signed up through (?code=…), credited with their payments.
ALTER TABLE users ADD COLUMN ref_code TEXT;
CREATE INDEX users_ref_code ON users(ref_code);

-- The code used for the current subscription, and the price it was bought at (prices can change later).
ALTER TABLE accounts ADD COLUMN code TEXT;
ALTER TABLE accounts ADD COLUMN price_cents INTEGER;
ALTER TABLE accounts ADD COLUMN billing_interval TEXT;          -- month | year

-- The code each payment is credited to (the checkout code, else the sign-up link's code).
ALTER TABLE payments ADD COLUMN code TEXT;
CREATE INDEX payments_code ON payments(code);

-- Every change made in the Pricing tab.
CREATE TABLE pricing_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  by_email TEXT NOT NULL,
  what TEXT NOT NULL,
  detail TEXT
);
