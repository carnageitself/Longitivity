import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION =
  "Get a dedicated account executive: personalized product picks, order tracking, delivery and refunds, handled by one person rather than a support queue.";

export const metadata: Metadata = {
  title: "Contact: Pricing & Product Recommendations",
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
        {/* Masthead, set the way the offers page opens: type over an ambient
            gold wash, a hairline rule, and the practical facts in a spec row
            rather than buried in prose. */}
        <section className="relative overflow-hidden border-b border-border px-6 pt-36 pb-20 sm:pt-44 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 82% 4%, rgba(198, 161, 92, 0.16) 0%, transparent 62%), radial-gradient(ellipse 45% 45% at 4% 96%, rgba(198, 161, 92, 0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-8 bg-accent" />
              <p className="font-mono text-[11px] tracking-[0.3em] text-accent uppercase">
                Contact
              </p>
            </div>

            <h1 className="mt-10 max-w-3xl font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
              Start with a{" "}
              <span className="text-accent/85 italic">conversation.</span>
            </h1>

            <p className="mt-8 max-w-lg leading-relaxed text-muted">
              No queue, no ticket number. You get one person who knows the
              products, remembers what you have already tried, and can tell you
              when something is not worth your money.
            </p>

            {/* The three things worth knowing before writing anything, each
                grounded in something the site actually offers. */}
            <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-y-7 border-t border-border pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  Your contact
                </dt>
                <dd className="mt-2 font-serif text-xl">One account executive</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  Samples
                </dt>
                <dd className="mt-2 font-serif text-xl">Free, on request</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">
                  Demos
                </dt>
                <dd className="mt-2 font-serif text-xl">Free, no obligation</dd>
              </div>
            </dl>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
