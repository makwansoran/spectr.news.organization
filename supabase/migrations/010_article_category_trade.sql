-- Add 'trade' to allowed article categories
-- Run in Supabase SQL Editor if you use migrations manually.

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_category_check;

ALTER TABLE public.articles
  ADD CONSTRAINT articles_category_check
  CHECK (category IN ('politics', 'finance', 'economy', 'companies', 'breaking', 'trade'));
