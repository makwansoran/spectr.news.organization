-- Add author email and position to articles
-- Run in Supabase SQL Editor or via Supabase CLI.

alter table public.articles
  add column if not exists author_email text,
  add column if not exists author_position text;
