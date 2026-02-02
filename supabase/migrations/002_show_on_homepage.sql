-- Add show_on_homepage column for editorial homepage control
alter table public.articles
  add column if not exists show_on_homepage boolean default false;

create index if not exists idx_articles_show_on_homepage
  on public.articles (show_on_homepage) where show_on_homepage = true;
