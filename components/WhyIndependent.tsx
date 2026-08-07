"use client";

import { motion, type Variants } from "framer-motion";
import { ShieldCheck, Truck, MessageCircle, Leaf, Award, FlaskConical } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "6-month money-back guarantee",
    body: "Not happy with a product, even in month 5? Send it back for a full refund, no questions asked.",
  },
  {
    icon: Award,
    title: "750+ patents and counting",
    body: "The research behind these products is protected by over 750 patents, with more filed every year.",
  },
  {
    icon: FlaskConical,
    title: "Backed by top scientists",
    body: "Every formula is developed and vetted by leading scientists, not thrown together to chase a trend.",
  },
  {
    icon: MessageCircle,
    title: "A real person to ask",
    body: "No algorithm picking your order: message me directly for guidance on what actually fits your routine.",
  },
  {
    icon: Leaf,
    title: "Traceable sourcing",
    body: "Nutrilite ingredients are grown and traced on dedicated farms, not sourced from an anonymous supply chain.",
  },
  {
    icon: Truck,
    title: "Set-and-forget delivery",
    body: "Recurring essentials (home care, water filters, wellness) arrive on a schedule you set.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function WhyIndependent() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-14 max-w-xl"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Why buy through us
        </h2>
        <p className="mt-4 text-muted">
          The products are the same globally recognized brands sold worldwide.
          What&apos;s different is the service wrapped around them.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {POINTS.map(({ icon: Icon, title, body }) => (
          <motion.div key={title} variants={item} className="relative h-full rounded-2xl border border-border p-2">
            <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} disabled={false} />
            <div className="relative flex h-full flex-col gap-3 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                  <Icon size={20} />
                </div>
                <h3 className="font-medium">{title}</h3>
              </div>
              <p className="text-sm text-muted">{body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
