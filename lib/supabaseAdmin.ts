import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

// Server-only client using the service role key, which bypasses Row Level
// Security entirely. The bookings table holds customer PII (name, email,
// phone, address), so it has no anon RLS policy at all — only this admin
// client, used exclusively from API routes, can read or write it.
//
// NEVER import this file from a Client Component or anything that ships to
// the browser: the service role key must stay server-side only.
export const supabaseAdmin: SupabaseClient | undefined = isSupabaseAdminConfigured
  ? createClient(supabaseUrl!, serviceRoleKey!, { auth: { persistSession: false } })
  : undefined;
