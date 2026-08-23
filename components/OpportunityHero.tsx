"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { HeartHandshake, GraduationCap, Target, ScrollText } from "lucide-react";

const PRINCIPLES = [
  {
    icon: HeartHandshake,
    title: "Mutual trust & transparency",
    body: "Credentials vs character: judge this on what's actually true, not on who's presenting it.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    body: "Facts vs opinions. Every number on this page is something you can verify for yourself.",
  },
  {
    icon: ScrollText,
    title: "Build a case for yourself",
    body: "Integrity, accountability, and people before profits. Your level of ambition, your decision.",
  },
  {
    icon: Target,
    title: "Why?",
    body: "Values and goals first. The business only makes sense in service of a reason you already have.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function OpportunityHero() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">
        Business Overview
      </p>
      <h1 className="max-w-3xl font-serif text-4xl font-medium tracking-tight sm:text-5xl">
        Entrepreneurship in the 21st century.
      </h1>
      <p className="mt-5 max-w-xl text-muted">
        Every single day, someone launches their own independent business. Unlike most
        entrepreneurs who set their own course alone, this one is powered by a multi-billion
        dollar company already standing behind it. Here&apos;s the plan, laid out plainly, so
        you can decide for yourself.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Ask me about it
        </Link>
        <Link
          href="/partners"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          See the brands behind it
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <motion.div key={title} variants={item} className="rounded-2xl border border-border p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-accent">
              <Icon size={18} />
            </div>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="mt-1.5 text-sm text-muted">{body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
