import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import LeadForm from "@/components/LeadForm";
import { CONTACT } from "@/lib/site-config";

const POINTS = [
  "Personalized product recommendations",
  "Order and delivery tracking",
  "Direct returns and refunds",
  "One consistent point of contact",
];

/**
 * The contact page body, set as an editorial two-column spread.
 *
 * Departures from what this was, and why:
 *
 *  - The four points were a check-icon bullet list. Icons repeated four times
 *    down a column read as a feature grid on a SaaS pricing page; the same
 *    four as numbered hairline rows read as an index, which is the treatment
 *    the offers page already uses and the one that suits the rest of the site.
 *  - The email was a small line behind a mail icon, which made the single most
 *    direct way to reach anyone the least prominent thing here. It is now set
 *    in the display serif at the size its importance deserves.
 *  - The form keeps its own container, but lighter and with more air around it.
 *    Its internals are untouched: the submission logic, validation and
 *    Supabase write in LeadForm all still work exactly as before.
 */
export default function ContactSection() {
  return (
    <section className="px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 py-20 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        {/* Left: who you get, and the direct line. */}
        <div className="reveal-up">
          <h2 className="text-[11px] font-medium tracking-[0.25em] text-muted uppercase">
            What that gets you
          </h2>

          <ol className="mt-8 border-t border-border">
            {POINTS.map((point, i) => (
              <li
                key={point}
                className="flex items-baseline gap-5 border-b border-border py-4"
              >
                <span className="font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-foreground/85">{point}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-[11px] font-medium tracking-[0.25em] text-muted uppercase">
            Or write directly
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="group mt-3 inline-flex items-baseline gap-2"
          >
            <span className="border-b border-accent/40 pb-1 font-serif text-xl tracking-tight transition-colors group-hover:border-accent sm:text-2xl">
              {CONTACT.email}
            </span>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <div className="relative mt-12 overflow-hidden rounded-2xl border border-accent/25 bg-surface p-6 sm:p-7">
            {/* The kit itself, sitting behind the words. Layered rather than
                set as a CSS background so next/image still sizes and serves
                it, and ordered before the copy so it paints under it without
                a negative z-index - which, inside this rounded card, would put
                it behind the card's own background and hide it entirely.
                alt is empty on purpose: it is decoration, and the block
                already says what it offers. */}
            <Image
              src="/longitivity-CTA.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              // Centred, not right-aligned: the kit itself - the Perfect Pack
              // box and the bottles beside it - sits in the middle of this
              // wide shot, and anchoring right cropped it out in favour of
              // empty backdrop.
              className="pointer-events-none object-cover object-center opacity-40"
            />
            {/* Scrim weighted to the left, where the text sits: the photograph
                stays legible on the right and the copy keeps its contrast
                rather than fighting the bottles for it. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-surface via-surface/88 to-surface/25"
            />

            <div className="relative">
              <p className="text-[11px] font-medium tracking-[0.25em] text-accent uppercase">
                Rather be shown?
              </p>
              <h3 className="mt-3 font-serif text-2xl font-medium tracking-tight">
                Book a free product demo.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
                No charge, and nothing to buy at the end of it. We go through
                the products you are curious about, what is actually in them,
                and whether they suit what you already use.
              </p>
              <Link
                href="/schedule?type=product-demo"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <span className="border-b border-accent/40 pb-1 transition-colors group-hover:border-accent">
                  Schedule a free demo
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Right: the form. Labelled, so the column reads as a deliberate half
            of the spread rather than a box that happens to sit there. */}
        <div className="reveal-up">
          <h2 className="text-[11px] font-medium tracking-[0.25em] text-muted uppercase">
            Send a message
          </h2>
          <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
