// Shared between the /schedule page (client) and the booking API routes
// (server), so slot definitions can't drift out of sync between the two.

export type TimeSlot = { value: string; label: string };

// Weekday evenings: 5pm-9pm, 1-hour blocks.
export const WEEKDAY_SLOTS: TimeSlot[] = [
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
];

// Weekends and holidays: 10am-8pm, 1-hour blocks.
export const WEEKEND_SLOTS: TimeSlot[] = [
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
];

// Every slot that could ever appear, for label lookups that don't already
// know which set a given time came from (e.g. formatting a stored booking).
const ALL_SLOTS: TimeSlot[] = [...WEEKDAY_SLOTS, ...WEEKEND_SLOTS].filter(
  (slot, i, arr) => arr.findIndex((s) => s.value === slot.value) === i,
);

export type BookingDay = { date: string; label: string; weekday: string };

// Y-M-D from local date parts, not toISOString() - toISOString() converts to
// UTC first, which silently rolls the date back or forward a day depending on
// the server/browser's timezone offset from midnight.
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// nth weekday of a month, e.g. nthWeekday(2026, 0, 1, 3) = 3rd Monday of
// January 2026. `weekday` is 0=Sunday..6=Saturday, `month` is 0-indexed.
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const d = new Date(year, month, 1);
  let count = 0;
  while (true) {
    if (d.getDay() === weekday) {
      count++;
      if (count === n) return d;
    }
    d.setDate(d.getDate() + 1);
  }
}

function lastWeekday(year: number, month: number, weekday: number): Date {
  const d = new Date(year, month + 1, 0);
  while (d.getDay() !== weekday) d.setDate(d.getDate() - 1);
  return d;
}

// U.S. federal holidays. Computed per-year rather than hardcoded dates, since
// most of these move (e.g. "3rd Monday of January"), and the booking window
// can span a year boundary in late December.
function usHolidays(year: number): Date[] {
  return [
    new Date(year, 0, 1), // New Year's Day
    nthWeekday(year, 0, 1, 3), // MLK Day
    nthWeekday(year, 1, 1, 3), // Presidents Day
    lastWeekday(year, 4, 1), // Memorial Day
    new Date(year, 5, 19), // Juneteenth
    new Date(year, 6, 4), // Independence Day
    nthWeekday(year, 8, 1, 1), // Labor Day
    nthWeekday(year, 9, 1, 2), // Columbus Day
    new Date(year, 10, 11), // Veterans Day
    nthWeekday(year, 10, 4, 4), // Thanksgiving
    new Date(year, 11, 25), // Christmas Day
  ];
}

export function isHoliday(date: Date): boolean {
  const key = toDateKey(date);
  // Only the target year's list can match, but check the year on either side
  // too in case the date is Dec 31 / Jan 1 relative to a holiday computed
  // from the "wrong" year's calendar.
  for (const year of [date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1]) {
    if (usHolidays(year).some((h) => toDateKey(h) === key)) return true;
  }
  return false;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Weekends and holidays get the longer daytime window; every other day gets
// the weekday evening window.
export function slotsForDate(date: Date): TimeSlot[] {
  return isWeekend(date) || isHoliday(date) ? WEEKEND_SLOTS : WEEKDAY_SLOTS;
}

// Every bookable day from tomorrow through the end of the current calendar
// month. The calendar has no month-navigation (there's nowhere else to go),
// so the bookable range is intentionally bounded to exactly what's visible:
// the rest of this month. Every day of the week is bookable now (weekday
// evenings, weekend/holiday daytime), so nothing is skipped here anymore.
export function getAvailableDays(from: Date = new Date()): BookingDay[] {
  const days: BookingDay[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  const endOfMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0);
  endOfMonth.setHours(0, 0, 0, 0);

  while (cursor <= endOfMonth) {
    days.push({
      date: toDateKey(cursor),
      label: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weekday: cursor.toLocaleDateString("en-US", { weekday: "short" }),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export function slotKey(date: string, time: string): string {
  return `${date}_${time}`;
}

export function formatSlotForEmail(date: string, time: string): string {
  const slot = ALL_SLOTS.find((s) => s.value === time);
  const d = new Date(`${date}T00:00:00`);
  const dateLabel = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${dateLabel} at ${slot?.label ?? time}`;
}
