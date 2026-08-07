"use client";

import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import { SITE_NAME } from "@/lib/site-config";

export default function BrandSparkles() {
  return (
    <div className="relative inline-block">
      <Link href="/#top" className="relative z-10 text-xl font-bold tracking-tight">
        {SITE_NAME}
      </Link>
      <div className="absolute inset-x-0 -bottom-1 h-px w-full bg-linear-to-r from-transparent via-accent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-3 h-6 w-full opacity-70">
        <SparklesCore
          background="transparent"
          minSize={0.3}
          maxSize={0.7}
          particleDensity={300}
          className="h-full w-full"
          particleColor="#ffffff"
        />
      </div>
    </div>
  );
}
