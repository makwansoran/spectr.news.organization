-- ============================================================
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor)
-- Copy all below and paste into a New query, then click Run.
-- ============================================================

-- 1. Create articles table
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subheadline text,
  category text not null check (category in ('politics', 'finance', 'economy', 'companies', 'breaking')),
  excerpt text,
  body text not null,
  featured_image_url text,
  author_name text,
  author_avatar_url text,
  author_email text,
  author_position text,
  is_breaking boolean default false,
  is_premium boolean default false,
  show_on_homepage boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_articles_slug on public.articles (slug);
create index if not exists idx_articles_category on public.articles (category);
create index if not exists idx_articles_created_at on public.articles (created_at desc);
create index if not exists idx_articles_breaking on public.articles (is_breaking) where is_breaking = true;
create index if not exists idx_articles_show_on_homepage on public.articles (show_on_homepage) where show_on_homepage = true;

alter table public.articles enable row level security;

create policy "Allow public read"
  on public.articles for select
  using (true);

create policy "Allow service role full access"
  on public.articles for all
  using (auth.role() = 'service_role');

-- 2. Add any missing columns (in case table already existed from an older migration)
alter table public.articles add column if not exists subheadline text;
alter table public.articles add column if not exists author_avatar_url text;
alter table public.articles add column if not exists author_email text;
alter table public.articles add column if not exists author_position text;
alter table public.articles add column if not exists homepage_section text;
create index if not exists idx_articles_homepage_section on public.articles (homepage_section) where homepage_section is not null;

-- 3. Editor's Desk login (stored in DB; app hashes password with bcrypt)
create table if not exists public.editor_credentials (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  updated_at timestamptz default now() not null
);
alter table public.editor_credentials enable row level security;
-- No policies: only service_role (API) can read/write; anon/authenticated cannot access.
