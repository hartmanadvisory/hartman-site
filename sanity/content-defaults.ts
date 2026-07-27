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
