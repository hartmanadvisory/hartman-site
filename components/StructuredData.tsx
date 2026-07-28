import {
  COUNTRY,
  FOUNDER_NAME,
  FOUNDING_DATE,
  LEGAL_NAME,
  LINKEDIN_URL,
  LOCALITY,
  REGION,
  SITE_NAME,
  SITE_URL,
  CONTACT_EMAIL,
} from "@/lib/site";

/**
 * StructuredData — the JSON-LD block that tells search engines what this
 * organisation IS.
 *
 * Why this exists: searches for "Hartman Venture Advisors" surface several
 * unrelated, longer-established firms with near-identical names (one of them
 * on hartmanadvisors.com, a single letter away from this domain). Without
 * machine-readable identity, a search engine has no way to tell them apart.
 * Stable @ids, a legal name, a founder, and a verified LinkedIn profile are
 * what let it treat this as its own entity.
 *
 * Typed as ["Organization", "LegalService"] rather than one or the other:
 * LegalService is a LocalBusiness subtype and Google's guidance for those
 * expects a street address and phone number, which this firm deliberately
 * doesn't publish. Multi-typing keeps the professional-services
 * classification while leaving Organization — the type that actually drives
 * name/logo/founder reconciliation — as the primary signal.
 *
 * Rendered as a plain <script> rather than next/script: JSON-LD is data, not
 * executable code, which is what the framework docs prescribe. The `<`
 * escaping is the documented XSS guard for embedding JSON in HTML.
 *
 * Not rendered to screen and excluded from the accessibility tree (script
 * elements are display:none in every UA stylesheet), so it adds no tab stop
 * and no reading-order effect.
 */
export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LegalService"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/brand/logo-512.png`,
          contentUrl: `${SITE_URL}/brand/logo-512.png`,
          width: 512,
          height: 512,
          caption: SITE_NAME,
        },
        image: { "@id": `${SITE_URL}/#logo` },
        description:
          "Outside general counsel to venture funds, founders, and dealmakers on fund formations, financings, secondaries, and exits.",
        // States independence without naming anyone else. The similarly
        // named firms are unrelated businesses; this is a factual statement
        // about this firm, not a comparison.
        disambiguatingDescription:
          "Hartman Venture Advisors PLLC is an independent New York law firm founded in 2024 by Mordechai Hartman. It is not affiliated with any similarly named firm.",
        email: CONTACT_EMAIL,
        foundingDate: FOUNDING_DATE,
        founder: { "@id": `${SITE_URL}/#founder` },
        // City and state only, by the firm's choice. A PostalAddress is
        // valid without a street address.
        address: {
          "@type": "PostalAddress",
          addressLocality: LOCALITY,
          addressRegion: REGION,
          addressCountry: COUNTRY,
        },
        areaServed: [
          { "@type": "City", name: LOCALITY },
          { "@type": "Country", name: "United States" },
        ],
        knowsAbout: [
          "Venture capital fund formation",
          "Venture financings",
          "Secondary transactions",
          "GP-led secondaries",
          "Startup exits and M&A",
        ],
        sameAs: [LINKEDIN_URL],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#founder`,
        name: FOUNDER_NAME,
        givenName: "Mordechai",
        familyName: "Hartman",
        jobTitle: "Founder & Principal",
        description:
          "Founder and Principal of Hartman Venture Advisors. Previously a venture capital attorney at Gunderson Dettmer and Lowenstein Sandler.",
        worksFor: { "@id": `${SITE_URL}/#organization` },
        url: `${SITE_URL}/about`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
