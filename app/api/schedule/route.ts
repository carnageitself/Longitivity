import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT } from "@/lib/site-config";
import { formatSlotForEmail, sessionTypeLabel } from "@/lib/scheduling";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabaseAdmin";

type BookingPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  date?: string;
  time?: string;
  category?: string | null;
  sessionType?: string | null;
};

const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || CONTACT.email;
// The sending domain is verified with Resend, so the default sender is the
// real address rather than Resend's shared onboarding@resend.dev sandbox,
// which only ever delivered to the account owner's own inbox.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || `Longitivity <${CONTACT.email}>`;

export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, lastName, email, phone, location, date, time, category, sessionType } =
    body;

  // Normalised rather than rejected. The form requires a choice, but a visitor
  // on a stale cached bundle would post without one, and losing a booking over
  // a missing label is worse than storing it as unknown.
  const sessionLabel = sessionTypeLabel(sessionType);

  if (!firstName || !lastName || !email || !phone || !location || !date || !time) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // Reserve the slot before sending anything. The (slot_date, slot_time)
  // unique constraint means a race between two people booking the same slot
  // fails cleanly here (23505) instead of silently overwriting one booking
  // with the other.
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    const row = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      location,
      slot_date: date,
      slot_time: time,
      category: category || null,
    };

    let { error } = await supabaseAdmin
      .from("bookings")
      .insert({ ...row, session_type: sessionLabel });

    // session_type was added to the table after the first deploy, so a project
    // that has not run the ALTER yet would reject every insert and lose the
    // booking outright. A real lead matters more than one label, so drop the
    // column and retry rather than fail. PGRST204 is PostgREST's "column not
    // in schema cache"; 42703 is Postgres' own undefined_column.
    if (error && (error.code === "PGRST204" || error.code === "42703")) {
      console.warn(
        "bookings.session_type is missing; saving without it. Run: alter table public.bookings add column if not exists session_type text;",
      );
      ({ error } = await supabaseAdmin.from("bookings").insert(row));
    }

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "That slot was just booked by someone else. Please pick another." },
          { status: 409 },
        );
      }
      console.error("Booking insert failed:", error);
      return NextResponse.json({ error: "Failed to save the booking." }, { status: 500 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Slot is reserved (if Supabase is configured) even without email - but
    // without Resend, nobody gets told. Surface that clearly rather than
    // silently succeeding.
    return NextResponse.json(
      { error: "Booking saved, but confirmation emails aren't configured (missing RESEND_API_KEY)." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const slotLabel = formatSlotForEmail(date, time);
  const fullName = `${firstName} ${lastName}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: NOTIFY_EMAIL,
      subject: "Your slot is confirmed",
      text: [
        `Hi ${firstName},`,
        sessionLabel
          ? `Your ${sessionLabel.toLowerCase()} is confirmed for ${slotLabel}, in ${location}.`
          : `Your slot is confirmed for ${slotLabel}, in ${location}.`,
        `A representative will connect with you shortly to confirm the details and answer any questions before then.`,
        category ? `You mentioned interest in: ${category}.` : null,
        `Talk soon,`,
        CONTACT.email,
      ]
        .filter(Boolean)
        .join("\n\n"),
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: sessionLabel
        ? `New booking: ${fullName}, ${sessionLabel}, ${slotLabel}`
        : `New booking: ${fullName}, ${slotLabel}`,
      text: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `City: ${location}`,
        `Slot: ${slotLabel}`,
        sessionLabel ? `Session: ${sessionLabel}` : null,
        category ? `Interested in: ${category}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("Resend request failed:", err);
    return NextResponse.json(
      { error: "Booking saved, but the confirmation email failed to send." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
