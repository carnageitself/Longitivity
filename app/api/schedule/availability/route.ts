import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";

// Returns which slots are already taken in a date range, as plain
// "YYYY-MM-DD_HH:MM" keys - never the underlying customer rows. Used by the
// /schedule page to grey out booked times before the customer even picks one.
export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    // No backend configured: report nothing booked so every slot shows open
    // rather than blocking the booking flow entirely.
    return NextResponse.json({ booked: [] });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  let query = supabaseAdmin.from("bookings").select("slot_date, slot_time").neq("status", "cancelled");
  if (from) query = query.gte("slot_date", from);
  if (to) query = query.lte("slot_date", to);

  const { data, error } = await query;
  if (error) {
    console.error("Availability query failed:", error);
    return NextResponse.json({ error: "Failed to load availability." }, { status: 500 });
  }

  const booked = (data ?? []).map((row) => `${row.slot_date}_${row.slot_time}`);
  return NextResponse.json({ booked });
}
