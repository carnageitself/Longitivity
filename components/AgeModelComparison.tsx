"use client";

import { motion } from "framer-motion";
import IndustrialVsInformationAge from "@/components/IndustrialVsInformationAge";

export default function AgeModelComparison() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 text-center"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Two ways to earn
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Same person, same hours in the day. The only thing that changes is which asset your
          time and money are building.
        </p>
      </motion.div>

      <IndustrialVsInformationAge />
    </div>
  );
}
