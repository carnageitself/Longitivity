import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalDoc, { LegalP, LegalList, type LegalSection } from "@/components/LegalDoc";
import { SITE_NAME, CONTACT, getReturnPolicy } from "@/lib/site-config";

const UPDATED = "9 September 2026";

// The one thing here that is a placeholder rather than a fact drawn from the
// code: the state whose law governs a dispute should be where the business
// actually operates. Confirm before relying on this page.
const GOVERNING_STATE = "California";

const DESCRIPTION =
  "The terms covering use of this site: how prices and comparisons work, what the satisfaction guarantee covers, and the limits on health information published here.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms", title: `Terms of Use | ${SITE_NAME}`, description: DESCRIPTION },
  twitter: { title: `Terms of Use | ${SITE_NAME}`, description: DESCRIPTION },
};

const mail = (
  <a
    href={`mailto:${CONTACT.email}`}
    className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
  >
    {CONTACT.email}
  </a>
);

const SECTIONS: LegalSection[] = [
  {
    heading: "Who you are dealing with",
    body: (
      <>
        <LegalP>
          {SITE_NAME} is an independently owned and operated business. It is not the manufacturer
          of the products described here, and it does not speak for them. Nutrilite, Artistry,
          Satinique, Glister, g&amp;h, XS, eSpring, Atmosphere and iCook are trademarks of their
          respective owners, used here to identify the products being offered.
        </LegalP>
        <LegalP>
          Anything written on this site is our own wording, not an official statement from a
          brand. Where a manufacturer&apos;s claim is quoted, it is attributed as such.
        </LegalP>
      </>
    ),
  },
  {
    heading: "What this site is",
    body: (
      <>
        <LegalP>
          A catalog and a reference. There is no checkout, no cart and no payment taken here.
          Prices are published so you can see them before speaking to anyone, and orders are
          arranged personally over email once you know what you want.
        </LegalP>
        <LegalP>
          Sending an enquiry or booking a session places no obligation on you to buy anything.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Prices and availability",
    body: (
      <>
        <LegalP>
          Prices are in US dollars and are the figures we hold at the time of publishing. They can
          change, and a product can go out of stock between you reading about it and ordering it.
          A price on this site is an invitation to enquire, not a binding offer.
        </LegalP>
        <LegalP>
          Where a discount or promotional price is shown, the dates it runs between are stated
          alongside it. A few items are listed without a price because no stable figure exists for
          them; those say so plainly and are quoted on request.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Product comparisons",
    body: (
      <>
        <LegalP>
          Many pages compare a product against named alternatives sold elsewhere. Those
          comparisons are researched against public retail listings and are offered in good
          faith, with two limits worth stating.
        </LegalP>
        <LegalList
          items={[
            "Competitor prices are approximate reference points, not live quotes. They move constantly, and any figure shown may be out of date by the time you read it. Every one of them can be checked in a single search, and we would rather you did.",
            "Where a competitor is cheaper, the table says so. Nothing is inflated to make our own pricing look better, and no comparison is intended to disparage another product.",
          ]}
        />
        <LegalP>
          Differences described between products reflect published ingredients and specifications.
          If you spot something inaccurate, tell us at {mail} and it will be corrected.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Satisfaction guarantee",
    body: (
      <>
        <LegalP>
          Products bought through us are covered by a satisfaction guarantee, handled directly
          rather than through a corporate returns line:
        </LegalP>
        <LegalList
          items={[
            <>
              <span className="text-foreground">Most products.</span>{" "}
              {getReturnPolicy("Nutrilite")}
            </>,
            <>
              <span className="text-foreground">Water and air treatment systems.</span>{" "}
              {getReturnPolicy("Water & Air Treatment")}
            </>,
          ]}
        />
        <LegalP>
          Opened product is covered, which is the point of it. Start a return by emailing {mail}{" "}
          within the window; we will confirm whether a refund, exchange or credit suits you best
          and arrange the return from there. The guarantee covers your satisfaction with the
          product, not damage from misuse, and applies to products bought through us rather than
          from another seller.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Health information",
    body: (
      <>
        <LegalP>
          Ingredient lists and product descriptions on this site are for information. They are not
          medical advice, and nobody here is a doctor, pharmacist or dietitian. Talk to a
          qualified professional before starting a supplement, particularly if you are pregnant or
          breastfeeding, managing a health condition, or taking prescription medication.
        </LegalP>
        <div className="mt-6 rounded-2xl border border-border bg-surface px-5 py-4">
          <p className="text-[10px] tracking-[0.2em] text-accent uppercase">
            Dietary supplement notice
          </p>
          {/* Fixed statutory wording under 21 U.S.C. 343(r)(6). Required
              wherever a structure/function claim appears, which several
              Nutrilite ingredient lists carry. Do not reword. */}
          <p className="mt-3 text-sm leading-relaxed text-muted">
            These statements have not been evaluated by the Food and Drug Administration. These
            products are not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </>
    ),
  },
  {
    heading: "The business opportunity",
    body: (
      <LegalP>
        Pages describing the business opportunity are informational and are not an offer of
        employment or a promise of earnings. Any figures shown are accompanied by the published
        earnings disclosure, which states averages before expenses; most participants earn
        modestly and results depend on effort, customer base and circumstances that vary by
        person. Ask us for the current full disclosure before making a decision.
      </LegalP>
    ),
  },
  {
    heading: "Using this site",
    body: (
      <LegalList
        items={[
          "The writing, photography, comparisons and layout on this site are ours. Read them, share a link, quote a line with credit. Do not republish them wholesale as your own.",
          "Do not scrape the site, submit forms automatically, or use it to send anyone unsolicited messages.",
          "Do not use the site in a way that breaks the law or interferes with anyone else using it.",
        ]}
      />
    ),
  },
  {
    heading: "Limits and liability",
    body: (
      <>
        <LegalP>
          This site is provided as it is. We work hard to keep prices, ingredients and comparisons
          accurate, and correct mistakes when we find them, but we cannot promise every detail is
          error-free or current at the moment you read it.
        </LegalP>
        <LegalP>
          To the extent the law allows, we are not liable for indirect or consequential loss
          arising from use of this site or reliance on information published here. Nothing in
          these terms limits any right you have that cannot legally be limited, including under
          consumer protection law.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Governing law and changes",
    body: (
      <>
        <LegalP>
          These terms are governed by the laws of the State of {GOVERNING_STATE}, United States.
        </LegalP>
        <LegalP>
          If they change materially, the date at the top of this page changes with them.
          Continuing to use the site afterwards means the revised terms apply. Questions go to{" "}
          {mail}; see also the{" "}
          <Link
            href="/privacy"
            className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
          >
            privacy policy
          </Link>
          .
        </LegalP>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <LegalDoc
          eyebrow="Terms"
          title="The rules, written"
          accent="plainly."
          lead="What this site is, how prices and comparisons should be read, what the satisfaction guarantee actually covers, and the limits on health information published here."
          updated={UPDATED}
          summary="Independent business, honest prices"
          sections={SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
