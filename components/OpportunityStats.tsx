"use client";

import { motion, type Variants } from "framer-motion";

const STATS = [
  {
    value: "$7.4B",
    label: "2024 global sales",
    note: "Backed by our parent company",
    span: "sm:col-span-1",
  },
  {
    value: "$70B+",
    label: "Bonuses & incentives paid since 1959",
    note: "More than any other direct sales company in history (Euromonitor International Limited)",
    span: "sm:col-span-2",
  },
  {
    value: "180-day",
    label: "Customer satisfaction guarantee",
    note: "Exclusions apply",
    span: "sm:col-span-1",
  },
  {
    value: "Forbes Top 100",
    label: "America's largest private companies",
    note: "",
    span: "sm:col-span-1",
  },
  {
    value: "750+",
    label: "Patents & patents pending",
    note: "Backed by our parent company",
    span: "sm:col-span-1",
  },
];

const BADGES = [
  {
    title: "#1 direct selling business in the world",
    note: "Over 10 years in a row — Direct Selling News Global 100 Guide",
  },
  { title: "Diverse product selection", note: "Health, beauty, home, and tech, under one company" },
  { title: "Operating in 100+ countries & territories", note: "All 50 U.S. states plus international markets" },
  {
    title: "Independent representation",
    note: "Represented through an independent association of business owners, not by the company itself.",
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

export default function OpportunityStats() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-14 max-w-xl"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Why partner with us
        </h2>
        <p className="mt-4 text-muted">
          Entrepreneurs powered by a multi-billion dollar company, not going it alone.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {STATS.map(({ value, label, note, span }) => (
          <motion.div
            key={label}
            variants={item}
            className={`rounded-2xl border border-border bg-surface p-6 ${span}`}
          >
            <p className="font-serif text-3xl font-medium text-accent">{value}</p>
            <p className="mt-2 text-sm font-medium">{label}</p>
            {note && <p className="mt-1 text-xs text-muted">{note}</p>}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {BADGES.map(({ title, note }) => (
          <motion.div key={title} variants={item} className="rounded-2xl border border-border p-5">
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1.5 text-xs text-muted">{note}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
