// Earnings disclosure, required alongside any income figures or
// compensation-plan illustrations shown to a prospect. Figures match the
// official source data; ask your sponsor for the current, full published
// disclosure before making any decisions.
export default function IncomeDisclosure({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <p className="text-xs leading-relaxed text-muted">
        For the calendar year 2024, the average income for U.S. participants in this business, at
        the entry levels and below, was $723 before expenses. Earnings depend on many factors,
        including customer base, business experience, effort, dedication, and quality and
        performance of the downline sales team. Ask us for the current, full earnings disclosure
        before making any decisions.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-xs leading-relaxed text-muted">
      <p>
        For the calendar year 2024, the average income for U.S. participants in this business, at
        the entry levels and below, was $723 before expenses. Earnings depend on many factors,
        including customer base, business experience, effort, dedication, and quality and
        performance of the downline sales team.
      </p>
      <p>
        For the calendar year 2024, typical participants in Canada earned up to $1,000 before
        expenses. Earnings depend on many factors, including customer base, business experience,
        effort, dedication, and the quality and performance of the downline sales team.
      </p>
      <p>
        The following percentages of participants achieved these incentive trips in 2024: New
        Platinum Conference 0.031%, Achiever&apos;s Invitational 0.447%, Diamond Club 0.024%, and
        Peter Island 0.0005%.
      </p>
      <p>Ask us for the current, full earnings disclosure before making any decisions.</p>
    </div>
  );
}
