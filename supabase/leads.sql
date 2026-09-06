-- Run this once in your Supabase project's SQL Editor to create the table
-- LeadForm writes to (lib/supabase.ts / components/LeadForm.tsx).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  interest text,
  message text,
  bundle text,
  products jsonb
);

-- The site submits with the public anon key, so RLS must be on with an
-- explicit insert-only policy. Without a select policy, anon can write leads
-- but never read them back — view submissions from the Supabase dashboard
-- (Table Editor) using your account, which reads as the privileged owner
-- role and bypasses RLS entirely.
alter table public.leads enable row level security;

create policy "Anyone can submit a lead"
  on public.leads
  for insert
  to anon
  with check (true);
