import { Label } from "@/components/ui/label";
import { Tooltip } from "@/components/ui/tooltip-card";

export function RequiredLabel({
  htmlFor,
  hint,
  children,
}: {
  htmlFor: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1">
      <Label htmlFor={htmlFor}>{children}</Label>
      <Tooltip content={hint} containerClassName="text-sm leading-none">
        <span className="cursor-help text-accent" aria-label="Required">
          *
        </span>
      </Tooltip>
    </div>
  );
}
