-- Add homepage_section: each article appears in exactly one section (no duplicates across sections)
-- Run in Supabase SQL Editor.

alter table public.articles
  add column if not exists homepage_section text
  check (homepage_section is null or homepage_section in (
    'featured', 'breaking', 'trending', 'popular', 'editor_choice', 'worth_reading'
  ));

create index if not exists idx_articles_homepage_section
  on public.articles (homepage_section)
  where homepage_section is not null;
