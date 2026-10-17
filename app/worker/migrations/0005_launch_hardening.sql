-- Age question at sign-up: only the birth year is kept. NULL = signed up before the question existed.
ALTER TABLE users ADD COLUMN birth_year INTEGER;

-- The campaign tags on the link that brought a new student in (for sign-ups by UTM tag).
ALTER TABLE users ADD COLUMN utm_source TEXT;
ALTER TABLE users ADD COLUMN utm_medium TEXT;
ALTER TABLE users ADD COLUMN utm_campaign TEXT;

-- Welcome-page email form: who is asking, that they said they are 13 or older, and whether
-- marketing email may be sent (parents only). Rows from before this change stay at 0.
ALTER TABLE leads ADD COLUMN role TEXT;                          -- parent | student
ALTER TABLE leads ADD COLUMN age_ok INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN marketing INTEGER NOT NULL DEFAULT 0;

-- "Report an error" on a lesson card lands in the feedback inbox, tagged with where it was sent from.
ALTER TABLE feedback ADD COLUMN lesson_id TEXT;
ALTER TABLE feedback ADD COLUMN card TEXT;                       -- card:<n> | check:<n> | video
ALTER TABLE feedback ADD COLUMN card_label TEXT;
CREATE INDEX feedback_lesson ON feedback(lesson_id);

-- Corrections shown on the public errata page.
CREATE TABLE errata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id TEXT NOT NULL,
  card TEXT,
  note TEXT NOT NULL,
  feedback_id INTEGER,                                            -- the report that led to it, if any
  published_by TEXT NOT NULL,
  published_at TEXT NOT NULL
);

-- Ad spend typed into the dashboard, per month and campaign source (cents).
CREATE TABLE ad_spend (
  month TEXT NOT NULL,                                            -- "2027-05"
  source TEXT NOT NULL,                                           -- utm_source it paid for
  amount INTEGER NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (month, source)
);
