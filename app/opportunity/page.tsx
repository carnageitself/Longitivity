import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import OpportunitySlides from "@/components/OpportunitySlides";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Business Opportunity | ${SITE_NAME}`,
  description:
    "An honest look at the business opportunity: how the compensation plan works, the brands behind it, and the training and mentorship available through BWW.",
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
