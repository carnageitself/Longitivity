"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { GlowFieldWrapper } from "@/components/ui/glow-field";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <GlowFieldWrapper>
        <select
          className={cn(
            `h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-[0px_0px_1px_1px_#404040] transition duration-400 group-hover/input:shadow-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
      </GlowFieldWrapper>
    );
  },
);
Select.displayName = "Select";

export { Select };
