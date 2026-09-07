"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import IncomeDisclosure from "@/components/IncomeDisclosure";

const STEPS = [
  "Schedule a follow-up meeting",
  "Study the review material shared with you",
  "Identify your own values & goals",
  "Continue building a case for yourself",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function OpportunityCta() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Your next steps
          </h2>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-8 flex flex-col gap-4"
          >
            {STEPS.map((step, i) => (
              <motion.li key={step} variants={item} className="flex items-start gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-accent">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm text-muted">{step}</p>
              </motion.li>
            ))}
          </motion.ol>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              Schedule a conversation
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted">
            Have questions before then? Reach out any time. Happy to walk through anything on
            this page in more detail.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="rounded-2xl border border-border bg-surface p-8"
        >
          <p className="mb-4 text-xs font-medium tracking-wide text-muted uppercase">
            Earnings disclosure
          </p>
          <IncomeDisclosure />
        </motion.div>
      </div>
  );
}
