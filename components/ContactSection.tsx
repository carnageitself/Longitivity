import { Mail, Check } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { CONTACT } from "@/lib/site-config";

const POINTS = [
  "Personalized picks from your executive, not a generic bundle",
  "Order and delivery tracking, whenever you need it",
  "Returns and refunds handled directly by your executive, no ticket number",
  "The same executive every time, never a rotating queue",
];

export default function ContactSection() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-muted">
            Submit this and a dedicated account executive is assigned to you
            personally: one point of contact for picking the right products,
            tracking your order after it ships, and handling delivery or
            refunds whenever you need to.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-sm">
              <Mail size={18} className="text-accent" />
              {CONTACT.email}
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
