"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Award, Check } from "lucide-react";
import { partners } from "@/lib/partners";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function PartnersGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {partners.map((partner) => (
          <motion.div
            key={partner.name}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col rounded-2xl border border-border bg-surface p-8"
          >
            <div className="mb-6 flex h-10 items-center">
              <span className="text-2xl font-semibold tracking-tight">{partner.name}</span>
            </div>

            <p className="text-sm text-muted">{partner.description}</p>

            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2.5">
              <Award size={16} className="mt-0.5 shrink-0 text-accent" />
              <p className="text-xs font-medium text-foreground">{partner.achievement}</p>
            </div>

            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {partner.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-xs text-muted">
                  <Check size={13} className="mt-0.5 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href={partner.category ? `/products?category=${encodeURIComponent(partner.category)}` : "/products"}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              Explore {partner.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
