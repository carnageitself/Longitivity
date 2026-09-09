import ShineLink, { type ShineLinkSize } from "@/components/ui/shine-link";

// Every "free samples" CTA on the site renders through here, so the styling
// and the destination can't drift apart the way the two Artistry CTAs did.
// Free samples now come with an in-person demo booked through /schedule
// rather than a plain contact-form message.
const BASE_HREF = "/schedule";

export default function SamplesButton({
  size = "sm",
  category,
  label = "Free samples",
  className = "",
  onClick,
}: {
  size?: ShineLinkSize;
  /** Narrows the request to one product line for the booking form. */
  category?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  const href = category ? `${BASE_HREF}?category=${encodeURIComponent(category)}` : BASE_HREF;

  return <ShineLink href={href} label={label} size={size} className={className} onClick={onClick} />;
}
