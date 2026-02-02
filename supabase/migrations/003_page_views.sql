-- Page views for visitor statistics
-- Run in Supabase SQL Editor or via Supabase CLI.

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  viewed_at timestamptz default now()
);

create index if not exists idx_page_views_viewed_at on public.page_views (viewed_at desc);

alter table public.page_views enable row level security;

-- Allow inserts from anyone (API uses service role to insert)
create policy "Allow insert for recording views"
  on public.page_views for insert
  with check (true);

-- Only service role can read (stats API uses service role)
create policy "Allow service role read"
  on public.page_views for select
  using (auth.role() = 'service_role');
