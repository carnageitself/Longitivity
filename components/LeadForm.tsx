"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { CONTACT } from "@/lib/site-config";
import { CATEGORY_INFO } from "@/lib/catalog";
import {
  clearProductInquiries,
  getProductInquiriesServerSnapshot,
  getProductInquiriesSnapshot,
  removeProductInquiry,
  subscribeProductInquiries,
  type ProductInquiry,
} from "@/lib/productInquiry";
import {
  clearBundleInquiry,
  getBundleInquiryServerSnapshot,
  getBundleInquirySnapshot,
  subscribeBundleInquiry,
} from "@/lib/bundleInquiry";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RequiredLabel } from "@/components/ui/required-label";

const CATEGORIES = Object.keys(CATEGORY_INFO);

type Status = "idle" | "submitting" | "success" | "error";

function mostCommonCategory(products: ProductInquiry[]): string {
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  let best = "";
  let bestCount = 0;
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }
  return best;
}

function defaultMessage(products: ProductInquiry[], bundle: string | null): string {
  const parts: string[] = [];
  if (products.length > 0) {
    parts.push(`I'd like to ask about ${products.map((p) => p.name).join(", ")}.`);
  }
  if (bundle) {
    parts.push(`I'm interested in the "${bundle}" bundle.`);
  }
  return parts.join(" ");
}

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const products = useSyncExternalStore(
    subscribeProductInquiries,
    getProductInquiriesSnapshot,
    getProductInquiriesServerSnapshot,
  );
  const bundle = useSyncExternalStore(
    subscribeBundleInquiry,
    getBundleInquirySnapshot,
    getBundleInquiryServerSnapshot,
  );

  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [seeded, setSeeded] = useState(false);

  // Seed the interest/message fields from the stored products/bundle the
  // first time they arrive (they load asynchronously via
  // useSyncExternalStore), without clobbering anything the user has already
  // typed since. This mirrors React's documented "adjust state during
  // render" escape hatch rather than a useEffect, since it only needs to
  // happen during render.
  if (!seeded && (products.length > 0 || bundle)) {
    setSeeded(true);
    if (bundle) setInterest("Bundle");
    else setInterest(mostCommonCategory(products));
    setMessage(defaultMessage(products, bundle));
  }

  function handleRemoveProduct(slug: string) {
    removeProductInquiry(slug);
  }

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
      products,
      bundle,
    };

    setStatus("submitting");

    // Fire the email notification and the Supabase write in parallel and
    // independently: either one succeeding counts as a successful submit, so
    // a missing Supabase config (or a Resend hiccup) doesn't block the lead
    // from reaching us some other way.
    const storePromise =
      isSupabaseConfigured && supabase
        ? supabase
            .from("leads")
            .insert({
              name: lead.name,
              email: lead.email,
              phone: lead.phone || null,
              interest: lead.interest || null,
              message: lead.message || null,
              bundle: lead.bundle,
              products: lead.products,
            })
            .then(({ error }) => {
              if (error) throw error;
            })
        : Promise.reject(new Error("Supabase not configured"));

    const [notifyResult, storeResult] = await Promise.allSettled([
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      }),
      storePromise,
    ]);

    const notified = notifyResult.status === "fulfilled" && notifyResult.value.ok;
    const stored = storeResult.status === "fulfilled";

    if (notified || stored) {
      setStatus("success");
      form.reset();
      clearProductInquiries();
      clearBundleInquiry();
      setInterest("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 size={32} className="text-accent" />
        <p className="font-medium">Thanks. Your account executive will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {(products.length > 0 || bundle) && (
        <LabelInputContainer>
          <Label>Asking about</Label>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <span
                key={p.slug}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface pl-3 pr-2 py-1 text-xs font-medium"
              >
                {p.name}
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(p.slug)}
                  aria-label={`Remove ${p.name}`}
                  className="rounded-full p-0.5 text-muted transition-colors hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {bundle && (
              <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface pl-3 pr-2 py-1 text-xs font-medium">
                {bundle} bundle
                <button
                  type="button"
                  onClick={() => clearBundleInquiry()}
                  aria-label={`Remove ${bundle} bundle`}
                  className="rounded-full p-0.5 text-muted transition-colors hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </LabelInputContainer>
      )}

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
            hint="Where your account executive will send pricing and next steps."
          >
            Email
          </RequiredLabel>
          <Input id="email" name="email" type="email" required />
        </LabelInputContainer>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelInputContainer>
          <RequiredLabel htmlFor="phone" hint="So your account executive can reach you directly.">
            Phone
          </RequiredLabel>
          <Input id="phone" name="phone" type="tel" required />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="interest">What are you interested in?</Label>
          <Select
            name="interest"
            value={interest}
            onValueChange={setInterest}
          >
            <SelectTrigger id="interest">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="Bundle">Bundle</SelectItem>
              <SelectItem value="Not sure yet">Not sure yet</SelectItem>
            </SelectContent>
          </Select>
        </LabelInputContainer>
      </div>

      <LabelInputContainer>
        <RequiredLabel htmlFor="message" hint="So your account executive knows what you need before reaching out.">
          Message
        </RequiredLabel>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit about what you're looking for..."
        />
      </LabelInputContainer>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>
            Couldn&apos;t send that automatically. Email your account executive directly at{" "}
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

function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full rounded-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 rounded-full bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
}
