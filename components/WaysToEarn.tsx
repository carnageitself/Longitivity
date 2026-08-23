"use client";

import { motion, type Variants } from "framer-motion";
import { ShoppingCart, Share2, BookOpen } from "lucide-react";
import IncomeDisclosure from "@/components/IncomeDisclosure";

const MODEL = [
  { icon: ShoppingCart, title: "Shop", body: "Convert your existing buying power into your own retail margin." },
  { icon: Share2, title: "Share", body: "Develop customers and associates through your own network." },
  { icon: BookOpen, title: "Educate", body: "Training and mentorship, available for yourself and for others you bring in." },
];

const EARNING_TYPES = [
  {
    title: "Retail Margin",
    formula: "Customer Price − Your Price = Retail Margin",
    body: "The difference between what a customer pays and your own cost.",
  },
  {
    title: "Bonuses",
    formula: "Your Points + Group Points = Monthly Bonuses",
    body: "Paid monthly on total point volume, yours and your group's combined.",
  },
  {
    title: "Incentives",
    formula: "Accumulated Points = Extra Cash + Trips",
    body: "Additional discretionary payments and invitational trips at higher performance tiers.",
  },
];

const BONUS_SCHEDULE = [
  { pv: 7500, pct: 25 },
  { pv: 6000, pct: 23 },
  { pv: 4000, pct: 21 },
  { pv: 2500, pct: 18 },
  { pv: 1500, pct: 15 },
  { pv: 1000, pct: 12 },
  { pv: 600, pct: 9 },
  { pv: 300, pct: 6 },
  { pv: 100, pct: 3 },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function WaysToEarn() {
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
            Ways to make money
          </h2>
          <p className="mt-4 text-muted">
            Three components: shop, share, and educate. Each one maps to a distinct way the
            compensation plan pays out.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {MODEL.map(({ icon: Icon, title, body }) => (
            <motion.div key={title} variants={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {EARNING_TYPES.map(({ title, formula, body }) => (
            <motion.div key={title} variants={item} className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 font-mono text-xs text-accent">{formula}</p>
              <p className="mt-3 text-sm text-muted">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="font-serif text-xl font-medium">Performance bonus schedule</h3>
            <p className="mt-2 text-sm text-muted">
              Bonus percentage is based on total monthly point volume (PV). 1 PV = 3 BV
              (Business Volume, the dollar figure the bonus percentage applies to).
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/60 text-left text-xs tracking-wide text-muted uppercase">
                    <th className="px-4 py-3 font-medium">Monthly PV</th>
                    <th className="px-4 py-3 font-medium">Bonus (% of BV)</th>
                  </tr>
                </thead>
                <tbody>
                  {BONUS_SCHEDULE.map((row) => (
                    <tr key={row.pv} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 tabular-nums">{row.pv.toLocaleString()} PV</td>
                      <td className="px-4 py-2.5 font-medium text-accent tabular-nums">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="rounded-2xl border border-border bg-background p-6">
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Illustrative example, not a projection</p>
              <h3 className="mt-2 font-serif text-xl font-medium">150 PV / 450 BV, one person</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">11% retail profit</p>
                  <p className="font-medium tabular-nums">$33.33</p>
                </div>
                <div>
                  <p className="text-muted">3% performance bonus</p>
                  <p className="font-medium tabular-nums">$13.50</p>
                </div>
                <div>
                  <p className="text-muted">7% customer sales incentive</p>
                  <p className="font-medium tabular-nums">$21.00</p>
                </div>
                <div>
                  <p className="text-muted">Monthly total</p>
                  <p className="font-medium tabular-nums text-accent">$67.83</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted">
                As group volume grows, the same bonus schedule applies to combined group PV/BV,
                and additional discretionary incentives can become available. This is arithmetic
                on the published schedule, not a promised or typical outcome — see the disclosure
                below.
              </p>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <IncomeDisclosure variant="compact" />
            </div>
          </motion.div>
        </div>
      </div>
  );
}
