import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScheduleBooking from "@/components/ScheduleBooking";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION =
  "Book a slot at a time that works for you, and a representative will connect with you to confirm your free product demo and samples.";

export const metadata: Metadata = {
  title: "Book a Slot for a Free Demo & Samples",
  description: DESCRIPTION,
  keywords: [
    "book free samples",
    "product demo appointment",
    "in-person consultation",
    "schedule a demo",
  ],
  alternates: { canonical: "/schedule" },
  openGraph: {
    url: "/schedule",
    title: `Book a Session | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `Book a Session | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function SchedulePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border px-6 pt-24 pb-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-xs font-medium tracking-wide text-accent uppercase">
              Book a slot
            </p>
            <h1 className="max-w-3xl font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              Book a slot, and a representative will connect with you.
            </h1>
            <p className="mt-3 max-w-xl text-muted">
              Choose a date and time that works for you. A representative will confirm the
              details and bring your product demo and free samples in person. No charge, no
              obligation to buy.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <Suspense fallback={null}>
            <ScheduleBooking />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
