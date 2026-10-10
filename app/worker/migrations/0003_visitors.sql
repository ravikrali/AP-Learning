-- Visitors who have not signed in yet (the welcome page), and the "tell me when my course is
-- ready" list. A visitor is a random ID kept in the browser: no name, no email, no IP address.

CREATE TABLE IF NOT EXISTS visitors (
  vid TEXT PRIMARY KEY,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 0,
  country TEXT,
  region TEXT,
  -- where the first visit came from
  channel TEXT NOT NULL DEFAULT 'Direct',   -- Direct | Search | Social | Email | Paid | Referral | Campaign
  source TEXT,                              -- utm_source, or the referring site
  medium TEXT,
  campaign TEXT,
  referrer TEXT,                            -- referring host only (never the full address)
  device TEXT,                              -- phone | tablet | desktop
  lang TEXT,
  -- set when this browser later signs in
  user_sub TEXT,
  signed_in_at TEXT
);
CREATE INDEX IF NOT EXISTS visitors_last_seen ON visitors(last_seen);
CREATE INDEX IF NOT EXISTS visitors_user ON visitors(user_sub);

-- What each visitor did, per day (one row per visitor, day and event).
CREATE TABLE IF NOT EXISTS visit_events (
  day TEXT NOT NULL,
  vid TEXT NOT NULL,
  event TEXT NOT NULL,                      -- view | see_how | see_courses | see_pricing | see_final | lead | signin
  n INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (day, vid, event)
);
CREATE INDEX IF NOT EXISTS visit_events_event ON visit_events(event, day);

-- People who typed their email into the welcome page.
CREATE TABLE IF NOT EXISTS leads (
  email TEXT PRIMARY KEY,
  name TEXT,
  course TEXT,                              -- the course they are waiting for (catalog id), if they chose one
  vid TEXT,
  country TEXT,
  channel TEXT,
  source TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
