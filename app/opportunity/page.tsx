import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import OpportunitySlides from "@/components/OpportunitySlides";
import { SITE_NAME } from "@/lib/site-config";

const DESCRIPTION =
  "An honest look at the business opportunity: how the compensation plan works, the brands behind it, and the training and mentorship available through BWW.";

export const metadata: Metadata = {
  title: `Business Opportunity | ${SITE_NAME}`,
  description: DESCRIPTION,
  keywords: [
    "home business opportunity",
    "direct sales opportunity",
    "business compensation plan",
    "start your own business",
    "business mentorship and training",
  ],
  alternates: { canonical: "/opportunity" },
  openGraph: {
    url: "/opportunity",
    title: `Business Opportunity | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `Business Opportunity | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default function OpportunityPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <OpportunitySlides />
      </main>
    </>
  );
}
