import Link from "next/link";
import { StickyBanner } from "@/components/ui/sticky-banner";

/**
 * The standing offer bar: first-order discount and the free shipping
 * threshold, on every page that carries the navbar.
 *
 * Restrained on purpose. The reference component's saturated gradient reads as
 * a plugin bolted onto the page; a flat surface with a hairline rule reads as
 * part of the house, and it lets the two figures do the work instead. So:
 *
 *  - Surface and border tokens, not a gradient. The only colour is the accent,
 *    and it is spent on the two numbers a shopper is actually scanning for.
 *  - A hairline vertical rule between the offers rather than a bullet. Cleaner
 *    at small sizes, where a middot on a dark bar disappears.
 *  - Type large enough to read at a glance in a 36px bar, which means the copy
 *    has to be short. Both offers are stated in six words each.
 *
 * The threshold is a number because "free shipping over $150" is something a
 * shopper can act on, where "free shipping available" is not.
 */
export default function PromoBanner({ onClose }: { onClose?: () => void }) {
  return (
    <StickyBanner
      onClose={onClose}
      className="border-b border-accent/20 bg-surface"
    >
      <p className="flex items-center justify-center gap-x-3 text-[13px] leading-none tracking-tight text-foreground/90 sm:gap-x-4 sm:text-sm">
        <span className="whitespace-nowrap">
          <span className="font-semibold text-accent">10% off</span> your first
          order
        </span>

        <span aria-hidden className="h-3 w-px shrink-0 bg-foreground/20" />

        <span className="whitespace-nowrap">
          Free shipping over{" "}
          <span className="font-semibold text-accent">$150</span>
        </span>

        {/* Held back until there is room: on a narrow phone the two offers
            already fill the line, and a third element would wrap the bar to a
            second row and break the navbar's fixed offset. */}
        <Link
          href="/products"
          className="hidden text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent sm:ml-1 sm:inline"
        >
          Shop now
        </Link>
      </p>
    </StickyBanner>
  );
}
