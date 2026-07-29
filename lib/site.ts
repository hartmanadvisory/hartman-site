/**
 * Site-wide constants: the canonical URL, the firm's identity, and the copy
 * that appears in search results.
 *
 * These exist in one place because they're consumed by several unrelated
 * surfaces (page metadata, robots.txt, the sitemap, and the JSON-LD
 * structured data). The identity strings in particular need to agree with
 * each other: mismatched names are exactly what makes it harder for search
 * engines to treat this firm as one distinct entity.
 *
 * Deliberately dependency-free apart from a type-only import (erased at
 * build), so this stays importable from anywhere.
 */
import type { LegalSlug } from "@/sanity/queries";

/** Canonical origin. www, because the apex redirects to it. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hartmanadvisory.com";

export const SITE_NAME = "Hartman Venture Advisors";
export const LEGAL_NAME = "Hartman Venture Advisors PLLC";
export const FOUNDER_NAME = "Mordechai Hartman";
export const CONTACT_EMAIL = "mhartman@hartmanadvisory.com";
export const LINKEDIN_URL =
  "https://www.linkedin.com/company/hartman-venture-advisors-pllc/";

/** City + state only — the firm publishes no street address or phone. */
export const LOCALITY = "New York";
export const REGION = "NY";
export const COUNTRY = "US";

/** Month the firm was founded, per the About page copy. */
export const FOUNDING_DATE = "2024-05";

/**
 * Homepage title. Brand first, then what the firm is: Google shows about 60
 * characters, and the previous 94-character marketing line pushed the firm's
 * own name past the cut — the one term it most needs to be found by.
 *
 * The marketing line still leads on social shares (see openGraph.title in
 * app/page.tsx), where there's room for it.
 */
export const SITE_TITLE = `${SITE_NAME} | Venture Capital Legal Counsel`;

/** The line kept for share previews, where length isn't punished. */
export const SITE_TAGLINE_TITLE = `Precision Legal Counsel for Venture Capital's Defining Deals`;

/**
 * Search-result descriptions. Google shows roughly 155 characters, so these
 * are written to land just under that: long enough to say what the firm
 * does, short enough not to be cut mid-sentence.
 */
export const SITE_DESCRIPTION =
  "Outside general counsel to venture funds, founders, and dealmakers. Fund formations, financings, secondaries, and exits. A boutique New York practice.";

export const ABOUT_DESCRIPTION =
  "Mordechai Hartman founded Hartman Venture Advisors in 2024 after more than a decade at Gunderson Dettmer and Lowenstein Sandler. Boutique New York counsel.";

export const CONTACT_DESCRIPTION =
  "Contact Hartman Venture Advisors for confidential inquiries on fund formations, venture financings, secondaries, and exits. Boutique New York counsel.";

/**
 * Legal pages had ~48-character descriptions, which render as a single stubby
 * line in search results. These are written to the same ~150 as every other
 * page so each result fills its two lines.
 */
export const LEGAL_DESCRIPTIONS: Record<LegalSlug, string> = {
  privacy:
    "How Hartman Venture Advisors PLLC collects, uses, and protects information submitted through this site, including contact form inquiries. New York.",
  terms:
    "The terms governing use of hartmanadvisory.com, the website of Hartman Venture Advisors PLLC, a boutique New York venture capital law practice.",
  disclosures:
    "Attorney advertising notice, admissions, jurisdictional limits, and prior results disclaimers for Hartman Venture Advisors PLLC of New York.",
};

/**
 * When each marketing page's copy last meaningfully changed.
 *
 * Hand-maintained on purpose. The sitemap used to stamp every URL with the
 * build time, which told search engines all six pages changed on every
 * deploy — the fastest way to teach a crawler to ignore your dates entirely.
 * Legal pages don't appear here; they carry their real "last updated" date
 * from the CMS.
 */
export const CONTENT_UPDATED: Record<string, string> = {
  "/": "2026-07-27",
  "/about": "2026-07-27",
  "/contact": "2026-07-13",
};

/** Type-checked so adding a legal slug can't silently ship without a date. */
export type LegalRouteMap = Record<LegalSlug, string>;
