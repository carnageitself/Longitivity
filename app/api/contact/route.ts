import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT } from "@/lib/site-config";

type ProductRef = { name?: unknown };

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  products?: ProductRef[];
  bundle?: string | null;
};

// Where lead notifications land. Defaults to the public contact address, but
// can be pointed at a different inbox without touching site-config.
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || CONTACT.email;

// The sending domain is verified with Resend, so the default sender is the
// real address rather than Resend's shared onboarding@resend.dev sandbox,
// which only ever delivered to the account owner's own inbox.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || `Longitivity Leads <${CONTACT.email}>`;

function buildEmailBody(lead: ContactPayload): string {
  const productNames = Array.isArray(lead.products)
    ? lead.products.map((p) => (typeof p?.name === "string" ? p.name : null)).filter(Boolean)
    : [];

  const lines = [
    `Name: ${lead.name || "(not given)"}`,
    `Email: ${lead.email || "(not given)"}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.interest ? `Interested in: ${lead.interest}` : null,
    lead.bundle ? `Bundle: ${lead.bundle}` : null,
    productNames.length ? `Products asked about:\n${productNames.map((n) => `- ${n}`).join("\n")}` : null,
    lead.message ? `Message:\n${lead.message}` : null,
  ];

  return lines.filter(Boolean).join("\n\n");
}

export async function POST(request: Request) {
  let lead: ContactPayload;
  try {
    lead = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!lead.name || !lead.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email notifications aren't configured (missing RESEND_API_KEY)." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: lead.email,
      subject: `New site inquiry from ${lead.name}`,
      text: buildEmailBody(lead),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send notification email." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend request failed:", err);
    return NextResponse.json({ error: "Failed to send notification email." }, { status: 500 });
  }
}
