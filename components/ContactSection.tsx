import { Mail, Check } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { CONTACT } from "@/lib/site-config";

const POINTS = [
  "Personalized product recommendations",
  "Order and delivery tracking",
  "Direct returns and refunds",
  "One consistent point of contact",
];

export default function ContactSection() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-muted">
            You&apos;ll be assigned a dedicated account executive: one contact
            for product picks, order tracking, and returns.
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
            <div className="flex items-center gap-3 text-sm">
              <Mail size={18} className="text-accent" />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
