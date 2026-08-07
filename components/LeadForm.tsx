"use client";

import { useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { CONTACT } from "@/lib/site-config";
import { CATEGORY_INFO } from "@/lib/catalog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip-card";

const CATEGORIES = Object.keys(CATEGORY_INFO);

type Status = "idle" | "submitting" | "success" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const lead = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      interest: String(data.get("interest") ?? ""),
      message: String(data.get("message") ?? ""),
      createdAt: serverTimestamp(),
    };

    if (!isFirebaseConfigured || !db) {
      setStatus("error");
      return;
    }

    try {
      setStatus("submitting");
      await addDoc(collection(db, "leads"), lead);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 size={32} className="text-accent" />
        <p className="font-medium">Thanks. I&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelInputContainer>
          <RequiredLabel htmlFor="name" hint="So I know who I'm following up with.">
            Name
          </RequiredLabel>
          <Input id="name" name="name" required />
        </LabelInputContainer>
        <LabelInputContainer>
          <RequiredLabel
            htmlFor="email"
            hint="This is where I'll send your pricing and comparison. No spam, just this reply."
          >
            Email
          </RequiredLabel>
          <Input id="email" name="email" type="email" required />
        </LabelInputContainer>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelInputContainer>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="interest">What are you interested in?</Label>
          <Select id="interest" name="interest" defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </Select>
        </LabelInputContainer>
      </div>

      <LabelInputContainer>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Tell me a bit about what you're looking for..."
        />
      </LabelInputContainer>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>
            Couldn&apos;t send that automatically. Email me directly at{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-medium underline">
              {CONTACT.email}
            </a>{" "}
            instead.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group/btn relative mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        Send message
        <BottomGradient />
      </button>
    </form>
  );
}

function LabelInputContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col gap-1.5">{children}</div>;
}

function RequiredLabel({
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
      <Tooltip content={hint}>
        <span className="cursor-help text-sm leading-none text-accent" aria-label="Required">
          *
        </span>
      </Tooltip>
    </div>
  );
}

function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full rounded-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 rounded-full bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}
