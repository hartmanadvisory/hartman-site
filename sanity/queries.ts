import { sanityClient, urlFor } from "./client";
import { sanityConfigured } from "./env";

export type JudgmentEvent = {
  id: string;
  title: string;
  date: string; // ISO
  caption?: string;
  imageUrl: string;
  imageAlt?: string;
};

/**
 * Hardcoded fallback used when Sanity isn't configured (local dev without
 * credentials, or pre-launch preview). Ships an event so the section always
 * has content on screen; real events replace this once the CMS is populated.
 */
const FALLBACK_EVENTS: JudgmentEvent[] = [
  {
    id: "fallback-1",
    title: "Tech Week NYC · Fireside",
    date: "2025-06-01",
    imageUrl: "/media/event-speaker-panel.jpg",
  },
  {
    id: "fallback-2",
    title: "LP Roundtable · Manhattan",
    date: "2025-04-15",
    imageUrl: "/media/event-conversation.jpg",
  },
  {
    id: "fallback-3",
    title: "Founder Dinner · Downtown",
    date: "2025-02-11",
    imageUrl: "/media/event-portrait.jpg",
  },
];

type RawEvent = {
  _id: string;
  title: string;
  date: string;
  caption?: string;
  image?: unknown;
};

const JUDGMENT_QUERY = `*[_type == "judgmentEvent"] | order(order asc, date desc) {
  _id,
  title,
  date,
  caption,
  image
}`;

/**
 * Fetch published judgment events. Runs on the server (RSC or server action);
 * cached with a 5-minute revalidation window and tagged so Sanity webhook
 * revalidation can bust it on publish.
 */
export async function getJudgmentEvents(): Promise<JudgmentEvent[]> {
  if (!sanityConfigured || !sanityClient) return FALLBACK_EVENTS;

  try {
    const rows = await sanityClient.fetch<RawEvent[]>(
      JUDGMENT_QUERY,
      {},
      { next: { revalidate: 300, tags: ["judgmentEvent"] } },
    );
    if (!rows?.length) return FALLBACK_EVENTS;

    return rows.map((row) => ({
      id: row._id,
      title: row.title,
      date: row.date,
      caption: row.caption,
      imageUrl: row.image ? urlFor(row.image) : "",
    }));
  } catch {
    return FALLBACK_EVENTS;
  }
}

/* -------------------------------------------------------------------------- *
 *  Legal pages (Privacy · Terms · Disclosures)                                *
 * -------------------------------------------------------------------------- */

export type LegalSlug = "privacy" | "terms" | "disclosures";

type LegalSpan = {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
};
type LegalMarkDef = {
  _type: "link";
  _key: string;
  href: string;
};
export type LegalBlock = {
  _type: "block";
  _key: string;
  style?: string;
  markDefs: LegalMarkDef[];
  children: LegalSpan[];
  listItem?: "bullet" | "number";
  level?: number;
};

export type LegalPage = {
  slug: LegalSlug;
  title: string;
  lastUpdated: string; // ISO date
  body: LegalBlock[];
};

/* ------------------------------------------------------------------ *
 * Portable Text fallback helpers.
 *
 * Every block and span needs a stable `_key` (React reconciliation +
 * PortableText validation). Keys are deterministic across SSR/CSR so
 * there's no hydration mismatch. The `link()` helper is special: it
 * writes an entry into the parent block's `markDefs` (per Sanity's
 * link-annotation convention) and returns a span whose `marks` array
 * references that markDef's `_key`.
 *
 * Declared BEFORE FALLBACK_LEGAL because the fallback object literal
 * calls these at initialization time.
 * ------------------------------------------------------------------ */

type PartInternal =
  | { kind: "plain"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "link"; text: string; href: string };

let __keySeq = 0;
function nextKey(prefix: string): string {
  __keySeq += 1;
  return `${prefix}${__keySeq}`;
}

function block(style: string, parts: PartInternal[]): LegalBlock {
  const blockKey = nextKey("b");
  const markDefs: LegalMarkDef[] = [];
  const children: LegalSpan[] = parts.map((p) => {
    if (p.kind === "plain") {
      return { _type: "span", _key: nextKey("s"), text: p.text };
    }
    if (p.kind === "strong") {
      return {
        _type: "span",
        _key: nextKey("s"),
        text: p.text,
        marks: ["strong"],
      };
    }
    const markKey = nextKey("m");
    markDefs.push({ _type: "link", _key: markKey, href: p.href });
    return {
      _type: "span",
      _key: nextKey("s"),
      text: p.text,
      marks: [markKey],
    };
  });
  return {
    _type: "block",
    _key: blockKey,
    style,
    markDefs,
    children,
  };
}

function text(t: string): PartInternal {
  return { kind: "plain", text: t };
}
function strong(t: string): PartInternal {
  return { kind: "strong", text: t };
}
function link(href: string, t: string): PartInternal {
  return { kind: "link", href, text: t };
}

/**
 * Conservative baseline legal copy shipped so the routes work before Sanity
 * is populated. Real content lands in Sanity → replaces this at request
 * time. Fields kept plain and standard — Mordechai's counsel should review
 * before public launch.
 */
const FALLBACK_LEGAL: Record<LegalSlug, LegalPage> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdated: "2026-07-13",
    body: [
      block("normal", [
        text("Hartman Venture Advisors PLLC ("),
        strong("HVA"),
        text(', "we", "us") respects your privacy. This policy describes what personal information we collect through this website, how we use it, and the choices you have.'),
      ]),
      block("h2", [text("Information we collect")]),
      block("normal", [
        text("We collect only the information you voluntarily submit through the contact form on this site — typically your name, email address, and a short description of the matter you would like to discuss. We may also receive standard server logs (IP address, browser type, referring URL) from our hosting provider for security and diagnostic purposes."),
      ]),
      block("h2", [text("How we use it")]),
      block("normal", [
        text("We use the information you submit solely to respond to your inquiry and to consider whether HVA can appropriately represent you. We do not sell, rent, or trade personal information. We do not use it for marketing without your explicit consent."),
      ]),
      block("h2", [text("Sharing")]),
      block("normal", [
        text("We share personal information only with service providers that host the website and process form submissions on our behalf, and only to the extent necessary for them to perform those functions. We may disclose information if required by law, court order, or to protect the firm's legal rights."),
      ]),
      block("h2", [text("Retention")]),
      block("normal", [
        text("We retain submitted information for as long as necessary to respond to your inquiry and to comply with our recordkeeping obligations. Information related to matters we do not accept is deleted within a reasonable period."),
      ]),
      block("h2", [text("Your rights")]),
      block("normal", [
        text("Depending on where you reside, you may have the right to access, correct, or delete personal information we hold about you, and to opt out of certain uses. To exercise any of these rights, contact us at "),
        link("mailto:mhartman@hartmanadvisory.com", "mhartman@hartmanadvisory.com"),
        text("."),
      ]),
      block("h2", [text("California residents")]),
      block("normal", [
        text("California residents have additional rights under the California Consumer Privacy Act and California Privacy Rights Act, including the right to know what personal information we have collected, to request deletion, and to opt out of any sale or sharing (we do not sell or share personal information for cross-context behavioral advertising)."),
      ]),
      block("h2", [text("No attorney-client relationship")]),
      block("normal", [
        text("Submitting the contact form does not create an attorney-client relationship. Please do not send confidential or time-sensitive information through the form. An attorney-client relationship is established only upon execution of a written engagement letter."),
      ]),
      block("h2", [text("Changes to this policy")]),
      block("normal", [
        text("We may update this policy from time to time. The date at the top of this page reflects the most recent revision."),
      ]),
      block("h2", [text("Contact")]),
      block("normal", [
        text("Questions about this policy: "),
        link("mailto:mhartman@hartmanadvisory.com", "mhartman@hartmanadvisory.com"),
        text("."),
      ]),
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Use",
    lastUpdated: "2026-07-13",
    body: [
      block("normal", [
        text("These terms govern your use of hartmanadvisory.com (the "),
        strong("Site"),
        text(") operated by Hartman Venture Advisors PLLC. By accessing the Site, you agree to these terms."),
      ]),
      block("h2", [text("Informational purpose")]),
      block("normal", [
        text("The Site is provided for general information about HVA and its practice. Nothing on the Site is legal advice. Do not act on any information on the Site without first consulting qualified counsel."),
      ]),
      block("h2", [text("No attorney-client relationship")]),
      block("normal", [
        text("Use of the Site, including submission of the contact form, does not create an attorney-client relationship. An attorney-client relationship is established only upon execution of a written engagement letter."),
      ]),
      block("h2", [text("Accuracy")]),
      block("normal", [
        text("We try to keep the Site accurate and current but make no representations or warranties as to its completeness or accuracy. Content may be changed or removed at any time without notice."),
      ]),
      block("h2", [text("Copyright")]),
      block("normal", [
        text("All content on the Site is © Hartman Venture Advisors PLLC unless otherwise noted. You may view and print pages for personal, non-commercial reference. Any other reproduction, distribution, or public display requires our prior written consent."),
      ]),
      block("h2", [text("Third-party links")]),
      block("normal", [
        text("The Site may link to external sites we do not control. We are not responsible for their content, security, or practices, and inclusion of a link is not an endorsement."),
      ]),
      block("h2", [text("Limitation of liability")]),
      block("normal", [
        text("To the fullest extent permitted by law, HVA disclaims all warranties in connection with the Site and is not liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, the Site."),
      ]),
      block("h2", [text("Governing law")]),
      block("normal", [
        text("These terms are governed by the laws of the State of New York, without regard to conflict-of-law principles."),
      ]),
      block("h2", [text("Contact")]),
      block("normal", [
        text("Questions about these terms: "),
        link("mailto:mhartman@hartmanadvisory.com", "mhartman@hartmanadvisory.com"),
        text("."),
      ]),
    ],
  },
  disclosures: {
    slug: "disclosures",
    title: "Disclosures",
    lastUpdated: "2026-07-13",
    body: [
      block("h2", [text("Attorney advertising")]),
      block("normal", [
        text("This website is attorney advertising under the New York Rules of Professional Conduct. Prior results do not guarantee a similar outcome."),
      ]),
      block("h2", [text("Admissions")]),
      block("normal", [
        text("Hartman Venture Advisors PLLC is a professional limited liability company organized under the laws of the State of New York. The firm's attorneys are admitted to practice in the State of New York. HVA does not hold itself out as expert or specialist in any field except as permitted by applicable rules."),
      ]),
      block("h2", [text("Jurisdictional limits")]),
      block("normal", [
        text("The Site is not a solicitation in any jurisdiction in which HVA or the responsible attorney is not admitted to practice, and nothing on the Site should be construed as an offer to represent you outside of jurisdictions where the firm and the responsible attorney are so admitted."),
      ]),
      block("h2", [text("No attorney-client relationship")]),
      block("normal", [
        text("Submitting the contact form or contacting HVA does not create an attorney-client relationship. Please do not send confidential or time-sensitive information until an engagement letter has been executed by both you and HVA."),
      ]),
      block("h2", [text("Prior results")]),
      block("normal", [
        text("References on the Site to transactions, clients, or aggregate transaction values reflect representations by the firm's attorneys during their careers, including at prior firms. Prior results do not guarantee a similar outcome and should not be relied upon to predict outcomes in any particular matter."),
      ]),
      block("h2", [text("Contact")]),
      block("normal", [
        text("Compliance questions: "),
        link("mailto:mhartman@hartmanadvisory.com", "mhartman@hartmanadvisory.com"),
        text("."),
      ]),
    ],
  },
};

const LEGAL_QUERY = `*[_type == "legalPage" && slug == $slug][0]{
  slug,
  title,
  lastUpdated,
  body
}`;

/**
 * Fetch a legal page by slug. Returns Sanity content when available,
 * otherwise the hardcoded baseline copy for that slug.
 */
export async function getLegalPage(slug: LegalSlug): Promise<LegalPage> {
  if (!sanityConfigured || !sanityClient) return FALLBACK_LEGAL[slug];
  try {
    const row = await sanityClient.fetch<LegalPage | null>(
      LEGAL_QUERY,
      { slug },
      { next: { revalidate: 300, tags: ["legalPage", `legalPage:${slug}`] } },
    );
    return row ?? FALLBACK_LEGAL[slug];
  } catch {
    return FALLBACK_LEGAL[slug];
  }
}

export const LEGAL_SLUGS: LegalSlug[] = ["privacy", "terms", "disclosures"];
