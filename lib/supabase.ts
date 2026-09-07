import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// The anon key is safe to expose to the browser (NEXT_PUBLIC_) - access is
// controlled by the "leads" table's Row Level Security policy, not secrecy
// of this key. See supabase/leads.sql for the policy this relies on.
export const supabase: SupabaseClient | undefined = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : undefined;
