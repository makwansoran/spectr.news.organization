-- Editor's Desk login: username + password stored in DB (hashed with bcrypt in app)
-- Run this in Supabase SQL Editor after 001–007.

CREATE TABLE IF NOT EXISTS editor_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Only service_role should read/write (API uses getSupabaseAdmin())
ALTER TABLE editor_credentials ENABLE ROW LEVEL SECURITY;

-- No policies: anon/authenticated cannot access; service_role bypasses RLS
-- So only your API (with service role key) can read/update this table.

COMMENT ON TABLE editor_credentials IS 'Editor''s Desk login; one row. Password stored as bcrypt hash from app.';
