"use client";

import * as React from "react";
import { DayPicker, type DayButtonProps, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = DayPickerProps;

function CalendarDayButton({ day: _day, modifiers, className, ...props }: DayButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "mx-auto flex h-9 w-full max-w-16 items-center justify-center rounded-full text-sm font-normal text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30",
        modifiers.today && !modifiers.selected && "font-semibold text-accent",
        modifiers.selected &&
          "bg-accent font-semibold text-accent-foreground hover:bg-accent hover:opacity-90",
        modifiers.outside && "text-muted/40",
        modifiers.disabled && "text-muted/30 line-through hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // `nav` (the prev/next month buttons) renders as a sibling of `month`
        // here, not nested inside it, and it's `absolute`. Without `relative`
        // on this container, it has no positioned ancestor at all, so it
        // anchors to the top of the whole document instead of the calendar —
        // which is what put stray arrow buttons up near the navbar.
        months: "relative flex flex-col gap-4",
        month: "flex flex-col gap-3",
        // Deliberately NOT `relative`: this row sits at the same vertical
        // band as `nav` below, and giving it its own position would make it
        // a positioned element competing for paint order — since it comes
        // later in the DOM, it would then render (and capture clicks) on
        // top of the prev/next buttons underneath it, silently swallowing
        // every click. Staying static means `nav` (which is positioned)
        // always wins, so the buttons stay clickable.
        month_caption: "flex h-9 items-center justify-center",
        caption_label: "text-sm font-medium text-foreground",
        nav: "absolute inset-x-0 top-0 flex h-9 items-center justify-between px-1",
        button_previous:
          "flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        button_next:
          "flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        // table-fixed is what actually prevents overflow: it makes the 7
        // columns share whatever width the table has, instead of each cell
        // demanding its own fixed pixel width regardless of viewport size
        // (which is what was pushing this page wider than the screen).
        month_grid: "mt-2 w-full table-fixed border-collapse",
        weekday: "text-center text-[0.75rem] font-medium text-muted uppercase",
        day: "h-9 p-0 text-center text-sm",
        ...classNames,
      }}
      components={{
        DayButton: CalendarDayButton,
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
