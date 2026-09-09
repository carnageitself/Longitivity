"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A dismissible bar pinned to the top of the page.
 *
 * Deliberately `sticky` rather than `fixed`: sticky keeps the bar in normal
 * document flow, so it pushes every page's content down by its own height. A
 * fixed bar would sit on top of the content instead, and each page's top
 * padding (which ranges from pt-20 to pt-44 across this site) would have to be
 * re-tuned to clear it.
 *
 * Only the height animates in as opacity, never layout: the bar is in the
 * server HTML, and animating its height or position would shift the whole page
 * down a moment after first paint.
 */
export function StickyBanner({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  /**
   * Called when the bar is dismissed. Anything positioned relative to the
   * viewport underneath it (here, the fixed navbar) needs to know, since the
   * bar leaving flow does not move a fixed element on its own.
   */
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        // A fixed height, not min-height: the navbar offsets itself by exactly
        // these values in pure CSS (top-9 sm:top-10), so the bar must never
        // grow to a second line. Any change here has to be mirrored there, and
        // the copy has to stay short enough to hold one line at 360px.
        //
        // The background must be opaque: the bar is sticky, so page content
        // scrolls underneath it.
        "sticky top-0 z-50 flex h-9 w-full items-center justify-center px-9 sm:h-10 sm:px-12",
        className,
      )}
    >
      {children}
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          onClose?.();
        }}
        aria-label="Dismiss offer"
        // h-8 in a 36px bar: as large a tap target as the bar height allows.
        className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/10 hover:text-foreground sm:right-3"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </motion.div>
  );
}
