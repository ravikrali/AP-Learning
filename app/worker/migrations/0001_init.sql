-- Accounts (from verified Google sign-in) and their login sessions.
CREATE TABLE users (
  sub TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  created_at TEXT NOT NULL,
  last_seen TEXT NOT NULL
);
CREATE INDEX users_email ON users(email);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  sub TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX sessions_sub ON sessions(sub);

-- Synced study data. One row per item; `seq` grows on every change so devices can pull "everything since N".
-- Keys: ev:<kind>:<uid> (append-only events), lesson:<id>, note:<id>, card:<id>, badge:<id>, set:<name>.
CREATE TABLE items (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  user_sub TEXT NOT NULL,
  key TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (user_sub, key)
);
CREATE INDEX items_user_seq ON items(user_sub, seq);

-- Admins. The owner (OWNER_EMAIL) is always an admin and cannot be removed.
CREATE TABLE admins (
  email TEXT PRIMARY KEY,
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL
);
INSERT INTO admins (email, added_by, added_at) VALUES ('devt309@gmail.com', 'system', '2026-10-08T00:00:00Z');

-- Published content changes made in the Admin area, applied on top of the built-in lessons.
-- Keys: video:<lessonId>, card:<lessonId>:<i>, check:<lessonId>:<i>, flash:<lessonId>:<i>, lesson:<lessonId>
CREATE TABLE content (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Every content save or revert, so a change can be traced and undone.
CREATE TABLE content_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  data TEXT,
  changed_by TEXT NOT NULL,
  changed_at TEXT NOT NULL
);
CREATE INDEX content_history_key ON content_history(key, id);

CREATE TABLE feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_sub TEXT,
  email TEXT,
  name TEXT,
  kind TEXT NOT NULL,
  mood TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved INTEGER NOT NULL DEFAULT 0
);
