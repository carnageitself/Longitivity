"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Wand2 } from "lucide-react";
import { audiences, type Audience } from "@/lib/audiences";
import { setBundleInquiry } from "@/lib/bundleInquiry";

const CUSTOM_BUNDLE_LABEL = "Custom";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AudienceSegments() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {audiences.map((audience) => (
            <AudienceCard key={audience.slug} audience={audience} />
          ))}

          <motion.div
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col rounded-2xl border border-accent/40 bg-background p-8"
          >
            <p className="text-xs font-medium tracking-wide text-accent uppercase">Custom</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              None of these quite fit?
            </h3>
            <p className="mt-3 text-sm text-muted">
              Tell me what you&apos;re actually dealing with and I&apos;ll put a bundle
              together around it, not a generic list.
            </p>

            <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <Wand2 size={28} className="text-accent" />
              <p className="text-xs text-muted">
                Describe your situation on the next page and I&apos;ll follow up with picks
                tailored to you.
              </p>
            </div>

            <Link
              href="/contact"
              onClick={() => setBundleInquiry(CUSTOM_BUNDLE_LABEL)}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85"
            >
              Build my own bundle
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AudienceCard({ audience }: { audience: Audience }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col rounded-2xl border border-border bg-background p-8"
    >
      <p className="text-xs font-medium tracking-wide text-accent uppercase">{audience.title}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{audience.tagline}</h3>
      <p className="mt-3 text-sm text-muted">{audience.description}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-4">
        {audience.picks.map((pick) => (
          <li key={pick.name} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
            <p className="text-sm font-medium">{pick.name}</p>
            <p className="text-xs text-muted">
              <span className="text-accent">{pick.brand}</span>: {pick.note}
            </p>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        onClick={() => setBundleInquiry(audience.title)}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
      >
        Get this bundle
      </Link>
    </motion.div>
  );
}
