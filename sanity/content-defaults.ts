/**
 * Pure content defaults — the copy each homepage / About section falls back
 * to when Sanity has no value for a field. Imported by BOTH `sanity/queries.ts`
 * (server-side fallback + per-field merge) and the client section components
 * (prop defaults), so there is ONE source of truth and no duplicated copy.
 *
 * Keep this module import-free (plain data only). Because the client
 * components import it, it must not pull in the Sanity server client or any
 * server-only code — that's why defaults live here and not in `queries.ts`.
 *
 * This module grows one section at a time as each is made CMS-editable.
 */

/**
 * Trimmed-non-empty fallback. An editor who CLEARS a Sanity field sends an
 * empty string, which `??` would let through — blanking a heading (and, where
 * a heading is referenced by aria-labelledby, the section's accessible name).
 * So substitute the default whenever the value is missing OR blank.
 */
export const pick = (v: string | undefined, fallback: string): string => {
  const t = typeof v === "string" ? v.trim() : "";
  return t ? t : fallback;
};

/**
 * Same idea for string arrays: trim every entry and drop the blanks, then use
 * the CMS list only if anything survived — otherwise keep the shipped default.
 * (`["", "  "]` has length 2 but is empty content, so filter BEFORE the
 * length check.)
 */
export const pickList = (
  v: string[] | undefined,
  fallback: readonly string[],
): string[] => {
  const cleaned = (Array.isArray(v) ? v : [])
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  return cleaned.length ? cleaned : [...fallback];
};

/**
 * Hero — the opening headline and the cobalt caption line beneath it.
 *
 * `headlineLines` is an array because the h1 is typed out line by line. The
 * component recomputes the joined full string (the screen-reader text and the
 * animation's character budget) from whatever lines it ends up with, so CMS
 * copy can be any length — but the SCHEMA caps it at 3 lines of ~30 chars.
 * That cap is load-bearing, not cosmetic: the hero scrims are hand-solved for
 * this headline block, and a 4th line would push white text down past the
 * scrim's decay onto raw photograph (and `whitespace-pre` means an over-long
 * line is clipped rather than wrapped).
 */
export const HERO = {
  headlineLines: [
    "Precision legal Counsel",
    "for Venture Capital’s",
    "Defining Deals",
  ],
  subtext:
    "A boutique New York law firm guiding venture funds, founders, and dealmakers through their most consequential transactions.",
};

/** "Who We Are" — the panel band on the homepage. CTA points at /about. */
export const WHO_WE_ARE = {
  eyebrow: "Who we are",
  statement:
    "Our practice is built to assist venture funds, founders, and dealmakers across fund formations, financings, secondaries, exits, and strategic transactions with commercially grounded legal judgment.",
  ctaLabel: "About the Firm",
};

/** Closing call-to-action band. CTA points at /contact. */
export const CLOSING_CTA = {
  heading: "Bring us your defining deal.",
  body: "Confidential intake. The fastest path to a working call with the founder.",
  ctaLabel: "Start a Conversation",
};

export type WhoWeServeSegment = {
  id: "venture-funds" | "founders" | "lps";
  h3: string;
  body: string;
  image: string;
};

/**
 * "Who We Serve" — the homepage band. `eyebrow` + `heading` are the section
 * header; `segments` are the three panels (heading, paragraph, and the
 * bundled default photo). Photos are also overridable via the `whoWeServe`
 * Sanity document (see getWhoWeServeImages); the text is overridable via the
 * same document's text fields (see getWhoWeServeContent).
 */
export const WHO_WE_SERVE = {
  eyebrow: "Who We Serve",
  heading: "Funds, Founders, and LPs shaping venture.",
  segments: [
    {
      id: "venture-funds",
      h3: "Venture Funds",
      body:
        "General partners at the fund level: from first-time formations to complex spin-outs, GP-led secondaries, and the LP negotiations that decide a fund's economics. We advise the funds shaping the next generation of institutional venture.",
      image: "/media/event-portrait.jpg",
    },
    {
      id: "founders",
      h3: "Founders & Category-Definers",
      body:
        "Repeat founders in the transactions that decide a company's trajectory: priced rounds, tender offers and secondaries, cofounder disputes, strategic sales, and IPOs. Counsel that matches the stakes.",
      image: "/media/event-conversation.jpg",
    },
    {
      id: "lps",
      h3: "Institutional LPs & Family Offices",
      body:
        "Institutional limited partners and family offices on the buy side of the private markets: side letters, direct investment vehicles, secondary purchases, and the diligence that decides where the next allocation goes.",
      image: "/media/event-clients.jpg",
    },
  ] satisfies WhoWeServeSegment[],
};
