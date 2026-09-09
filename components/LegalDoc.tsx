import type { ReactNode } from "react";

export type LegalSection = { heading: string; body: ReactNode };

/** Stable anchor from a heading, so the contents list and the sections agree. */
export function sectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Body copy. Exported so both documents share one measure and rhythm. */
export function LegalP({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-sm leading-relaxed text-muted">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
          <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Shell for the privacy policy and terms.
 *
 * Same masthead grammar as the contact and offers pages - gold wash, hairline
 * rule, mono eyebrow, serif headline - so the legal pages read as part of the
 * site rather than a bolted-on template. A sticky contents list carries the
 * length on desktop; on mobile it collapses into a plain list at the top,
 * since a sticky sidebar on a phone is just lost width.
 */
export default function LegalDoc({
  eyebrow,
  title,
  accent,
  lead,
  updated,
  summary,
  sections,
}: {
  eyebrow: string;
  /** Rendered before the italic accent word, which closes the headline. */
  title: string;
  accent: string;
  lead: string;
  updated: string;
  /** One-line plain-English gist, above the formal text. */
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border px-6 pt-36 pb-20 sm:pt-44 sm:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 82% 4%, rgba(198, 161, 92, 0.16) 0%, transparent 62%), radial-gradient(ellipse 45% 45% at 4% 96%, rgba(198, 161, 92, 0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-8 bg-accent" />
            <p className="font-mono text-[11px] tracking-[0.3em] text-accent uppercase">
              {eyebrow}
            </p>
          </div>

          <h1 className="mt-10 max-w-3xl font-serif text-5xl leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            {title} <span className="text-accent/85 italic">{accent}</span>
          </h1>

          <p className="mt-8 max-w-lg leading-relaxed text-muted">{lead}</p>

          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-y-7 border-t border-border pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">Last updated</dt>
              <dd className="mt-2 font-serif text-xl">{updated}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">Sections</dt>
              <dd className="mt-2 font-serif text-xl">{sections.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.2em] text-muted uppercase">In short</dt>
              <dd className="mt-2 font-serif text-xl">{summary}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:grid lg:grid-cols-[210px_1fr] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase">Contents</p>
          <ol className="mt-4 flex flex-col gap-2.5">
            {sections.map((section, i) => (
              <li key={section.heading} className="flex gap-2.5 text-xs leading-relaxed">
                <span className="font-mono text-muted/60 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${sectionId(section.heading)}`}
                  className="text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14 max-w-2xl lg:mt-0">
          {sections.map((section, i) => (
            <section
              key={section.heading}
              id={sectionId(section.heading)}
              // Clears the fixed header when jumped to from the contents list.
              className="scroll-mt-28 border-t border-border pt-10 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-14"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-2xl font-medium tracking-tight">
                  {section.heading}
                </h2>
              </div>
              {section.body}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
