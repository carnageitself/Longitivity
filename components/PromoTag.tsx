import { cn } from "@/lib/utils";

/**
 * The "15% off" flag shown on a product that is part of a live offer.
 *
 * Solid accent with dark text, the same treatment the Bestseller badge and the
 * Free samples button already use, so an offer reads as part of the house
 * rather than a sticker applied on top of it.
 */
export default function PromoTag({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-accent-foreground ring-1 ring-inset ring-white/25",
        className,
      )}
    >
      {label}
    </span>
  );
}
