-- Run this in Supabase SQL Editor to create editor login (username: editor, password: globalist2024)
-- Run 008_editor_credentials.sql first if you haven't created the table yet.

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.editor_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.editor_credentials ENABLE ROW LEVEL SECURITY;

-- Insert editor login (password: globalist2024). Upsert so re-running is safe.
INSERT INTO public.editor_credentials (username, password_hash)
VALUES ('editor', '$2a$10$G9lVmDgM2AoJyqfwKsnKfu/mUYOFBjR5Bt14kXTWS0Ob4kC8EBcc6')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now();

-- After this, log in at /admin/login with username: editor, password: globalist2024
