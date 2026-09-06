import Link from "next/link";

// Every "free samples" CTA on the site renders through here, so the styling
// and the destination can't drift apart the way the two Artistry CTAs did.
// Free samples now come with an in-person demo booked through /schedule
// rather than a plain contact-form message.
const BASE_HREF = "/schedule";

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm",
};

export default function SamplesButton({
  size = "sm",
  category,
  label = "Free samples",
  className = "",
  onClick,
}: {
  size?: keyof typeof SIZES;
  /** Narrows the request to one product line for the booking form. */
  category?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  const href = category ? `${BASE_HREF}?category=${encodeURIComponent(category)}` : BASE_HREF;

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
