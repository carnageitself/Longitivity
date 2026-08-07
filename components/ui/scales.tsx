import { cn } from "@/lib/utils";

export function Scales({
  size = 8,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("h-full w-full bg-neutral-950", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.14) 0, rgba(255,255,255,0.14) 1px, transparent 1px, transparent " +
          size +
          "px)",
      }}
    />
  );
}
