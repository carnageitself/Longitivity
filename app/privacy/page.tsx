import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalDoc, { LegalP, LegalList, type LegalSection } from "@/components/LegalDoc";
import { SITE_NAME, CONTACT } from "@/lib/site-config";

// Written against what the code actually does, not a template: the fields
// listed below are the columns in supabase/leads.sql and supabase/bookings.sql,
// and the "no tracking" section is true because package.json carries no
// analytics dependency. Both need revisiting if either changes.
const UPDATED = "9 September 2026";

const DESCRIPTION =
  "What Longitivity collects when you send an enquiry or book a session, who processes it, how long it is kept, and how to have it deleted.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy", title: `Privacy Policy | ${SITE_NAME}`, description: DESCRIPTION },
  twitter: { title: `Privacy Policy | ${SITE_NAME}`, description: DESCRIPTION },
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
    heading: "Who this covers",
    body: (
      <>
        <LegalP>
          This policy applies to {SITE_NAME} and this website. {SITE_NAME} is an independently
          owned business run by one person, not a corporation with a data department, and the
          practices below describe what actually happens to your details rather than what a
          template says might.
        </LegalP>
        <LegalP>
          There are no accounts to create and no payments taken on this site. You can read every
          page, price and ingredient list without giving us anything at all.
        </LegalP>
      </>
    ),
  },
  {
    heading: "What we collect",
    body: (
      <>
        <LegalP>
          Only what you type into a form. Nothing is gathered in the background.
        </LegalP>
        <LegalP>
          <span className="text-foreground">When you send an enquiry</span> we receive your name
          and email address, plus your phone number, the product or bundle you asked about, and
          your message where you choose to include them.
        </LegalP>
        <LegalP>
          <span className="text-foreground">When you book a demo or samples</span> we receive your
          first and last name, email address, phone number, the location you gave, and the time
          slot and session type you picked. The phone number and location are needed because
          someone has to actually turn up.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Why we collect it",
    body: (
      <LegalList
        items={[
          "To reply to you, which is usually the whole point of the message.",
          "To confirm a booking and get to the right place at the right time.",
          "To follow up on something you asked about, such as sending a price comparison or checking whether a sample worked out.",
          "To keep a record of what we discussed, so you are not starting from scratch next time.",
        ]}
      />
    ),
  },
  {
    heading: "What we do not do",
    body: (
      <>
        <LegalP>
          This is the part most policies bury, so it goes near the top:
        </LegalP>
        <LegalList
          items={[
            "No analytics. This site runs no Google Analytics, no Meta pixel, and no third-party tracking script of any kind.",
            "No advertising cookies, and no audiences shared with ad platforms.",
            "No selling, renting or trading your details. Not to anyone, at any price.",
            "No newsletter you did not ask for. If you never bring it up, you will not hear from us beyond the conversation you started.",
          ]}
        />
      </>
    ),
  },
  {
    heading: "Cookies and browser storage",
    body: (
      <>
        <LegalP>
          This site sets no tracking cookies. It does use your browser&apos;s own storage for two
          small conveniences, both of which stay on your device and are never transmitted to us:
        </LegalP>
        <LegalList
          items={[
            "A note that you have already been shown a particular offer, so the same prompt does not reappear on every page. This is cleared the moment you close the tab.",
            "The product or bundle you tapped through from, so the enquiry form arrives already knowing what you were looking at.",
          ]}
        />
        <LegalP>
          Clearing your site data in your browser removes both, with no effect beyond seeing that
          prompt again.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Who else handles your details",
    body: (
      <>
        <LegalP>
          Three services process data on our behalf. They are bound to use it only to provide
          their service, and each publishes its own privacy terms:
        </LegalP>
        <LegalList
          items={[
            <>
              <span className="text-foreground">Supabase</span> stores form submissions in a
              database with access restricted to this site&apos;s server.
            </>,
            <>
              <span className="text-foreground">Resend</span> delivers the notification and
              confirmation emails, which means it handles your address and the message body.
            </>,
            <>
              <span className="text-foreground">Vercel</span> hosts the site and keeps short-lived
              server logs, which include IP addresses as a normal part of serving web traffic.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    heading: "How long we keep it",
    body: (
      <LegalP>
        Enquiries and bookings are kept while there is a reason to: an open conversation, an
        outstanding order, or a guarantee still running on something you bought. Once that is
        finished and you are no longer in touch, there is no reason to hold your details and they
        are deleted. You do not have to wait for that, and can ask at any point.
      </LegalP>
    ),
  },
  {
    heading: "Your choices",
    body: (
      <>
        <LegalP>
          Email {mail} and we will, without charge or argument:
        </LegalP>
        <LegalList
          items={[
            "Tell you exactly what we hold about you.",
            "Correct anything that is wrong.",
            "Delete all of it, unless a specific record has to be kept for tax or legal reasons.",
            "Stop contacting you entirely.",
          ]}
        />
        <LegalP>
          Depending on where you live you may have these rights by law, including under California
          and EU/UK data protection rules. We do not ask which apply to you before honouring a
          request.
        </LegalP>
      </>
    ),
  },
  {
    heading: "Children",
    body: (
      <LegalP>
        This site is intended for adults. Some products are formulated for children, but they are
        described here for the adult buying them, and we do not knowingly collect details from
        anyone under 16. If you believe a child has sent us information, email {mail} and it will
        be removed.
      </LegalP>
    ),
  },
  {
    heading: "Changes and contact",
    body: (
      <>
        <LegalP>
          If this policy changes materially, the date at the top of the page changes with it. There
          is no version history to dig through, because the practices described here have been the
          same since the site launched.
        </LegalP>
        <LegalP>
          Questions about any of it go to {mail}. See also the{" "}
          <Link
            href="/terms"
            className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
          >
            terms of use
          </Link>
          .
        </LegalP>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <LegalDoc
          eyebrow="Privacy"
          title="Your details, and"
          accent="nothing more."
          lead="No analytics, no tracking pixels, no data sold to anyone. We hold what you type into a form, use it to answer you, and delete it when there is no longer a reason to keep it."
          updated={UPDATED}
          summary="We collect little, share less"
          sections={SECTIONS}
        />
      </main>
      <Footer />
    </>
  );
}
