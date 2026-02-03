-- ============================================================
-- RUN THIS IN SUPABASE: Dashboard → SQL Editor → New query
-- Paste this entire file, then click Run.
-- Safe to run more than once (uses IF NOT EXISTS / IF EXISTS).
-- ============================================================

-- 1. Articles table (create if missing)
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subheadline text,
  category text NOT NULL CHECK (category IN ('politics', 'finance', 'economy', 'companies', 'breaking', 'trade')),
  excerpt text,
  body text NOT NULL,
  featured_image_url text,
  author_name text,
  author_avatar_url text,
  author_email text,
  author_position text,
  is_breaking boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  show_on_homepage boolean DEFAULT false,
  homepage_section text CHECK (homepage_section IS NULL OR homepage_section IN ('featured', 'breaking', 'trending', 'popular', 'editor_choice', 'worth_reading')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON public.articles (is_breaking) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS idx_articles_show_on_homepage ON public.articles (show_on_homepage) WHERE show_on_homepage = true;
CREATE INDEX IF NOT EXISTS idx_articles_homepage_section ON public.articles (homepage_section) WHERE homepage_section IS NOT NULL;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON public.articles;
CREATE POLICY "Allow public read" ON public.articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow service role full access" ON public.articles;
CREATE POLICY "Allow service role full access" ON public.articles FOR ALL USING (auth.role() = 'service_role');

-- 2. Add missing columns (if table already existed from older migration)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS subheadline text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_avatar_url text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_email text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_position text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS homepage_section text;

-- 3. Allow 'trade' category (drop old check, add new one)
ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_category_check;
ALTER TABLE public.articles ADD CONSTRAINT articles_category_check
  CHECK (category IN ('politics', 'finance', 'economy', 'companies', 'breaking', 'trade'));

-- 4. Editor's Desk login table
CREATE TABLE IF NOT EXISTS public.editor_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE public.editor_credentials ENABLE ROW LEVEL SECURITY;
