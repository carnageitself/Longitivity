-- Run this once in your Supabase project's SQL Editor to create the table
-- the /schedule booking flow writes to (lib/supabaseAdmin.ts,
-- app/api/schedule/route.ts, app/api/schedule/availability/route.ts).

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  slot_date date not null,
  slot_time text not null,
  category text,
  -- What the booking is for: "Skin care session", "Product demo",
  -- "Business opportunity". Nullable, so a booking is never lost to a
  -- missing label.
  session_type text,
  status text not null default 'confirmed',
  -- Prevents two people from ever holding the same slot: the second insert
  -- fails with a unique_violation (23505), which the API route turns into a
  -- "pick another slot" response instead of silently double-booking.
  unique (slot_date, slot_time)
);

-- This table holds customer PII (name, email, phone, address) and is only
-- ever read or written by app/api/schedule/* using the Supabase service role
-- key (lib/supabaseAdmin.ts), which bypasses RLS entirely. Deliberately no
-- anon policy here — with RLS on and no matching policy, the public anon key
-- (exposed in the browser bundle) gets zero access to this table, even for
-- reads.
alter table public.bookings enable row level security;

-- Already have this table from an earlier deploy? The session_type column was
-- added later, so run this once before deploying the booking form that sets it:
--
--   alter table public.bookings add column if not exists session_type text;
