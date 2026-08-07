"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
    >
      Back to top
      <ArrowUp size={13} />
    </button>
  );
}
