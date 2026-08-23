"use client";

import { motion, type Variants } from "framer-motion";
import {
  HeartHandshake,
  Smartphone,
  Calendar,
  Video,
  GraduationCap,
  ShieldCheck,
  ScrollText,
  Sparkles,
  Users2,
} from "lucide-react";

const TRAINING_PILLARS = [
  { icon: HeartHandshake, title: "Coaching & mentorship" },
  { icon: Smartphone, title: "Mobile apps & web resources" },
  { icon: Calendar, title: "Business conferences" },
  { icon: Video, title: "Streaming audio & video" },
];

const VALUES = [
  { icon: GraduationCap, title: "Desire to learn & grow" },
  { icon: ShieldCheck, title: "Integrity & accountability" },
  { icon: ScrollText, title: "Fact-based decision-making" },
  { icon: Sparkles, title: "Strong values & positive attitude" },
  { icon: Users2, title: "Willingness to accept mentorship" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function BusinessTraining() {
  return (
    <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-xs font-medium tracking-wide text-accent uppercase">BWW</p>
          <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            Business training & education
          </h2>
          <p className="mt-4 text-muted">
            BWW empowers people to build independent businesses through education and mentorship
            from an association of business leaders across North America.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TRAINING_PILLARS.map(({ icon: Icon, title }) => (
            <motion.div key={title} variants={item} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium">{title}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 max-w-xl"
        >
          <h3 className="font-serif text-xl font-medium">Valuing the BWW association</h3>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-3"
        >
          {VALUES.map(({ icon: Icon, title }) => (
            <motion.div
              key={title}
              variants={item}
              className="flex items-center gap-3 rounded-full border border-border bg-background px-5 py-3.5"
            >
              <Icon size={16} className="shrink-0 text-accent" />
              <p className="text-sm font-medium">{title}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
  );
}
