-- Add subheadline to articles
-- Run in Supabase SQL Editor or via Supabase CLI.

alter table public.articles
  add column if not exists subheadline text;
