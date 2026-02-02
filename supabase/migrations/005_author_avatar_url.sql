-- Add author profile picture URL to articles
-- Run in Supabase SQL Editor or via Supabase CLI.

alter table public.articles
  add column if not exists author_avatar_url text;
