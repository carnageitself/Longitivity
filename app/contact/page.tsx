import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION = "Get in touch for pricing, availability, and personalized product recommendations.";

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: DESCRIPTION,
  keywords: ["contact", "get pricing", "product recommendations", "wellness consultation"],
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: `Contact | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `Contact | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border px-6 pt-20 pb-14">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
              Get in touch
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Let&apos;s find what fits.
            </h1>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
