import Link from "next/link";

// The site's premium pill CTA: gold gradient, lit top edge, and the periodic
// light sweep defined as `.shine-cta` in app/globals.css. Lives here as one
// primitive so every high-intent button on the site shares a single styling
// source rather than each copying the class string.
const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm",
};

export type ShineLinkSize = keyof typeof SIZES;

export default function ShineLink({
  href,
  label,
  size = "sm",
  className = "",
  onClick,
}: {
  href: string;
  label: string;
  size?: ShineLinkSize;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`shine-cta inline-flex items-center justify-center rounded-full bg-linear-to-br from-accent to-[#8a6d3b] font-medium tracking-wide text-accent-foreground shadow-md shadow-amber-900/40 ring-1 ring-inset ring-white/25 transition-opacity hover:opacity-90 ${SIZES[size]} ${className}`}
    >
      {label}
    </Link>
  );
}
