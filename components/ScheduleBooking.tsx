"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { getAvailableDays, toDateKey, slotsForDate, slotKey, formatSlotForEmail } from "@/lib/scheduling";

type Status = "idle" | "submitting" | "success" | "error";

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-accent">
      {n}
    </span>
  );
}

export default function ScheduleBooking() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const days = useMemo(() => getAvailableDays(), []);
  const bookableDates = useMemo(() => new Set(days.map((d) => d.date)), [days]);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const selectedDate = selectedDay ? toDateKey(selectedDay) : "";
  const availableSlots = useMemo(() => (selectedDay ? slotsForDate(selectedDay) : []), [selectedDay]);

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const from = days[0]?.date;
    const to = days[days.length - 1]?.date;
    if (!from || !to) return;

    fetch(`/api/schedule/availability?from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((data) => setBookedSlots(new Set(data.booked ?? [])))
      .catch(() => {})
      .finally(() => setLoadingAvailability(false));
  }, [days]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTime || !selectedDate) return;
    const data = new FormData(e.currentTarget);

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          location: String(data.get("location") ?? ""),
          date: selectedDate,
          time: selectedTime,
          category,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setErrorMessage(result.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 size={32} className="text-accent" />
        <p className="font-medium">
          Your slot is confirmed for {formatSlotForEmail(selectedDate, selectedTime as string)}.
        </p>
        <p className="max-w-sm text-sm text-muted">
          A confirmation has been sent to your email. A representative will connect with you
          shortly to confirm the details.
        </p>
      </div>
    );
  }

  const selectionSummary =
    selectedDate && selectedTime ? formatSlotForEmail(selectedDate, selectedTime) : null;

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Steps 1 & 2: date + time */}
        <div className="flex flex-col gap-8 border-b border-border p-6 lg:border-r lg:border-b-0 lg:p-8">
          <div>
            <p className="mb-4 flex items-center gap-2.5 text-sm font-medium text-foreground">
              <StepNumber n={1} />
              Select a date
            </p>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                hideNavigation
                selected={selectedDay}
                onSelect={(day) => {
                  setSelectedDay(day);
                  setSelectedTime(null);
                }}
                disabled={(date) => !bookableDates.has(toDateKey(date))}
              />
            </div>
          </div>

          <div>
            <p className="mb-4 flex items-center gap-2.5 text-sm font-medium text-foreground">
              <StepNumber n={2} />
              Select a time
            </p>
            {!selectedDate ? (
              <p className="text-sm text-muted">Select a date first.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {availableSlots.map((slot) => {
                  const taken = bookedSlots.has(slotKey(selectedDate, slot.value));
                  const selected = selectedTime === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      disabled={taken || loadingAvailability}
                      onClick={() => setSelectedTime(slot.value)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        taken
                          ? "cursor-not-allowed border-border text-muted/40 line-through"
                          : selected
                            ? "border-accent bg-accent/10 text-foreground"
                            : "border-border bg-background text-muted hover:bg-background/60 hover:text-foreground"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: details */}
        <div className="p-6 lg:p-8">
          <p className="mb-5 flex items-center gap-2.5 text-sm font-medium text-foreground">
            <StepNumber n={3} />
            Your contact details
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {selectionSummary && (
              <p className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-foreground">
                {selectionSummary}
              </p>
            )}

            {category && (
              <p className="text-xs text-muted">
                Interested in: <span className="text-accent">{category}</span>
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">City</Label>
              <Input id="location" name="location" placeholder="e.g. Boston, MA" required />
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedTime || status === "submitting"}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-black px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
              Book my slot
            </button>

            {!selectedTime && (
              <p className="text-center text-xs text-muted">Select a date and time to continue.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
