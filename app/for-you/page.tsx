import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudienceSegments from "@/components/AudienceSegments";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION = "Curated product bundles for students, working professionals, women, and families.";

export const metadata: Metadata = {
  title: "Wellness Bundles for Students & Families",
  description: DESCRIPTION,
  keywords: [
    "curated wellness bundles",
    "product bundles for students",
    "wellness bundles for professionals",
    "gift bundles for women",
    "family wellness bundle",
  ],
  alternates: { canonical: "/for-you" },
  openGraph: {
    url: "/for-you",
    title: `For You | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `For You | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function ForYouPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border px-6 pt-20 pb-14">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
              Built for how you live
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-medium tracking-tight sm:text-5xl">
              Find your starting bundle.
            </h1>
            <p className="mt-5 max-w-xl text-muted">
              Five everyday situations, five curated starting points. Swap
              anything in or out once you get going.
            </p>
          </div>
        </section>

        <AudienceSegments />
      </main>
      <Footer />
    </>
  );
}
