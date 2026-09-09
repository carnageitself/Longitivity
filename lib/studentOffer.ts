/**
 * The standing student offer.
 *
 * Deliberately not a Promotion. Everything in lib/promotions.ts is dated: it
 * belongs to a month, it drops off the offers page when its window closes, and
 * it rewrites the price on every product it covers. This offer is none of
 * those things. It runs continuously, it has to be claimed with an ID rather
 * than applying to whoever happens to be looking, and it covers a service as
 * well as the catalog.
 *
 * So it lives here as a single set of facts, surfaced wherever it is relevant
 * across the app instead of as one entry on the offers page: the timed dialog,
 * the footer, the price line on a product, and the booking page where the
 * session is actually booked. One place to edit, every surface follows.
 */
export const STUDENT_OFFER = {
  /** Off anything in the catalog, with a valid student ID. */
  catalogDiscount: "5%",
  /** Off a one-to-one skin care consultation. */
  sessionDiscount: "50%",
  eligibility: "with a valid student ID",
  /** Where the session gets booked, with the right session pre-selected. */
  bookingHref: "/schedule?type=skin-care",
} as const;

/** "5% off with a valid student ID" - the short form, for a price line. */
export const STUDENT_CATALOG_LINE = `Students: ${STUDENT_OFFER.catalogDiscount} off ${STUDENT_OFFER.eligibility}.`;

/**
 * Pill length, for the share cards.
 *
 * Not STUDENT_OFFER_SUMMARY: that sentence is written for body copy, and in a
 * badge the two numbers have to land without the connective tissue around them.
 */
export const STUDENT_OFFER_BADGE =
  `Students: ${STUDENT_OFFER.catalogDiscount} off the catalog · ` +
  `${STUDENT_OFFER.sessionDiscount} off a skin care consultation`;

/** The long form, for the footer and the offers page FAQ. */
export const STUDENT_OFFER_SUMMARY =
  `Students get ${STUDENT_OFFER.catalogDiscount} off anything in the catalog ` +
  `${STUDENT_OFFER.eligibility}, plus ${STUDENT_OFFER.sessionDiscount} off a ` +
  `one-to-one skin care consultation.`;
