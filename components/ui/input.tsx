"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { GlowFieldWrapper } from "@/components/ui/glow-field";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <GlowFieldWrapper>
        <input
          type={type}
          className={cn(
            `flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-[0px_0px_1px_1px_#404040] transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </GlowFieldWrapper>
    );
  },
);
Input.displayName = "Input";

export { Input };
