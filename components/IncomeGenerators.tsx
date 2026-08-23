"use client";

import { motion } from "framer-motion";
import IncomeWheel from "@/components/IncomeWheel";

export default function IncomeGenerators() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
          Income generators
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Every income model falls into one of four quadrants. Only two of them come with
          leverage: the ability to earn beyond the hours you personally put in.
        </p>
      </motion.div>

      <IncomeWheel />
    </div>
  );
}
