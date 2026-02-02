-- The Globalist: articles table for Supabase
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor) or via Supabase CLI.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('politics', 'finance', 'economy', 'companies', 'breaking')),
  excerpt text,
  body text not null,
  featured_image_url text,
  author_name text,
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

alter table public.articles enable row level security;

create policy "Allow public read"
  on public.articles for select
  using (true);

create policy "Allow service role full access"
  on public.articles for all
  using (auth.role() = 'service_role');
