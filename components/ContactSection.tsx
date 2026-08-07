import { Mail } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { CONTACT } from "@/lib/site-config";

export default function ContactSection() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2">
        <div>
          <p className="max-w-md text-muted">
            Tell me what you&apos;re looking for and I&apos;ll follow up with pricing,
            availability, and a comparison tailored to you.
          </p>

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
