-- Roles and privileges for admin-portal users (see shared/roles.ts).
-- role: admin | curator | support | analyst | viewer | custom. A named role means that role's
-- privilege set; `privs` (JSON, e.g. {"content":["view","edit"]}) is only used when role = 'custom'.
-- Everyone who was an admin before this change keeps full access as "admin".
ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE admins ADD COLUMN privs TEXT;
ALTER TABLE admins ADD COLUMN updated_by TEXT;
ALTER TABLE admins ADD COLUMN updated_at TEXT;
