"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { GlowFieldWrapper } from "@/components/ui/glow-field";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <GlowFieldWrapper>
        <textarea
          className={cn(
            `flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-[0px_0px_1px_1px_#404040] transition duration-400 group-hover/input:shadow-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          {...props}
        />
      </GlowFieldWrapper>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
