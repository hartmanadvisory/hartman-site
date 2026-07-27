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
export type HeroSlide = {
  src: string;
  /**
   * Whether this photo gets the ADDITIVE dark scrim behind the headline, on
   * top of the always-on base scrim. For the bundled photos below this is a
   * per-image MEASUREMENT (two are dark enough without it). CMS-uploaded
   * photos always get it — see the note on the schema: nobody can eyeball
   * whether white text will clear contrast over an arbitrary photo, and a
   * bright photo with no additive scrim measures ~1.5:1 (white on near-white).
   */
  needsScrim: boolean;
};

export const HERO = {
  headlineLines: [
    "Precision Legal Counsel",
    "for Venture Capital’s",
    "Defining Deals",
  ],
  subtext:
    "A boutique New York law firm guiding venture funds, founders, and dealmakers through their most consequential transactions.",
  /** Desktop (md+) rotating background photos. */
  desktopSlides: [
    { src: "/hero/hero-3.jpg", needsScrim: false },
    { src: "/hero/hero-event-speaker.png", needsScrim: false },
    { src: "/hero/hero-event-conversation.png", needsScrim: true },
  ] satisfies HeroSlide[],
  /** Mobile (<md) single static photo. */
  mobileSrc: "/hero/hero-mobile-1.jpg",
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

/* -------------------------------------------------------------------------- *
 *  Homepage — the company logo wall                                            *
 * -------------------------------------------------------------------------- */

/**
 * The logos bundled at /public/brand/companies, mapped to the company name.
 *
 * This map is the SINGLE source of truth for both the file and the name, and
 * that's deliberate: the name is what a screen reader announces for the logo
 * (it's the image's alt text). If the CMS let an author type the name
 * separately, they could pick the OpenAI mark and label it "Anthropic" — the
 * page would then tell sighted and screen-reader visitors two different
 * things, on a page making client-representation claims, and no automated
 * checker would flag it because the alt text is non-empty either way. So the
 * Studio dropdown shows these names and stores the filename; the alt text is
 * always read back out of this map.
 *
 * Adding a company therefore means adding its SVG here and in /public — a
 * code change, which is what the owner asked for.
 */
export const COMPANY_LOGOS: Record<string, string> = {
  "addepar.svg": "Addepar",
  "anduril.svg": "Anduril",
  "anthropic.svg": "Anthropic",
  "arena.svg": "Arena",
  "bytedance.svg": "ByteDance",
  "circle.svg": "Circle",
  "coreweave.svg": "CoreWeave",
  "gecko-robotics.svg": "Gecko Robotics",
  "glean.svg": "Glean",
  "groq.svg": "Groq",
  "huntress.svg": "Huntress",
  "meta.svg": "Meta",
  "notion.svg": "Notion",
  "openai.svg": "OpenAI",
  "ramp.svg": "Ramp",
  "replit.svg": "Replit",
  "saronic.svg": "Saronic",
  "scale.svg": "Scale AI",
  "shield-ai.svg": "Shield AI",
  "spacex.svg": "SpaceX",
};

export const HOME_PORTFOLIO = {
  eyebrow: "Selected Engagements",
  heading:
    "We have advised our clients on investments into the following companies.",
  /** Display order. Names come from COMPANY_LOGOS. */
  companies: [
    "anthropic.svg",
    "openai.svg",
    "spacex.svg",
    "anduril.svg",
    "meta.svg",
    "notion.svg",
    "ramp.svg",
    "replit.svg",
    "bytedance.svg",
    "coreweave.svg",
    "circle.svg",
    "groq.svg",
    "scale.svg",
    "addepar.svg",
    "glean.svg",
    "gecko-robotics.svg",
    "huntress.svg",
    "arena.svg",
    "saronic.svg",
  ],
};

/**
 * Resolve a list of logo filenames to renderable {name, file} pairs: unknown
 * files are dropped (the filename reaches the DOM as an image path, and
 * Studio validation is bypassable via the API) and duplicates are removed
 * (a repeated logo would be announced twice). Falls back to the shipped list
 * when nothing usable survives.
 */
export function resolveCompanies(
  files: string[] | undefined,
): { name: string; file: string }[] {
  const source = files?.length ? files : HOME_PORTFOLIO.companies;
  const seen = new Set<string>();
  const out: { name: string; file: string }[] = [];
  for (const file of source) {
    const name = COMPANY_LOGOS[file];
    if (!name || seen.has(file)) continue;
    seen.add(file);
    out.push({ name, file });
  }
  return out.length
    ? out
    : HOME_PORTFOLIO.companies.map((file) => ({
        name: COMPANY_LOGOS[file],
        file,
      }));
}

/* -------------------------------------------------------------------------- *
 *  /about                                                                      *
 * -------------------------------------------------------------------------- */

export const ABOUT_HERO = {
  eyebrow: "Profile",
  name: "Mordechai Hartman",
  intro:
    "Founder and Principal of Hartman Venture Advisors PLLC. More than a decade advising venture funds, founders, and dealmakers.",
  credentials: [
    "Formerly at Gunderson Dettmer & Lowenstein Sandler",
    "Harvard Law JD",
  ],
  portraitSrc: "/media/mordechai-hartman-portrait.jpg",
  ctaLabel: "Start a Conversation",
  captionName: "Mordechai Hartman",
  captionRole: ", Founder & Principal",
};

export const ABOUT_BACKGROUND = {
  heading: "Background",
  lead: "A continuous record across seed-through-growth venture transactions, at two of the country’s leading venture practices before founding Hartman Venture Advisors.",
  bullets: [
    "J.D. from Harvard Law School with a focus on corporate and securities law.",
    "Began his career at Lowenstein Sandler advising emerging-company financings and venture-fund formations across seed-stage founders and institutional GPs.",
    "Practiced seven years at Gunderson Dettmer, one of the country's pre-eminent venture practices, advising category-defining companies through priced rounds, secondaries, and exits.",
    "Founded Hartman Venture Advisors in 2024 as a boutique New York practice built on the premise that consequential transactions deserve senior attention, end to end.",
    "Over $6B in aggregate transaction value across financings, fund formations, secondaries, and M&A.",
    "Represented marquee venture funds including a16z, Tiger Global, Insight, Altimeter, Dragoneer, Thrive, and Addition.",
    "Advised category-defining companies including Anthropic, OpenAI, SpaceX, Anduril, Meta, Ramp, Notion, and Scale.",
  ],
};

export type AboutStat = {
  /** Display string, e.g. "$6B+". */
  value: string;
  label: string;
  info: string;
  /** Optional override for how the value is read aloud. */
  spoken?: string;
};

export const ABOUT_STATS = {
  eyebrow: "By the Numbers",
  stats: [
    {
      value: "$6B+",
      label: "Aggregate transaction value",
      info: "Value of transactions on which the firm has served as principal counsel to founders, funds, or LPs.",
    },
    {
      value: "100+",
      label: "Financings, secondaries & M&A advised",
      info: "Across seed to growth stage: priced rounds, structured secondaries, and strategic exits.",
    },
    {
      value: "10",
      label: "Marquee venture funds represented",
      info: "Including a16z, Tiger, Insight, Altimeter, Dragoneer, Thrive, and Addition.",
    },
  ] satisfies AboutStat[],
};

/**
 * Split a stat's display string into the pieces the count-up animation needs,
 * e.g. "$6B+" → { prefix: "$", number: 6, suffix: "B+" }. Returns null when
 * there's no number to animate (e.g. "Dozens"), in which case the caller
 * renders the value statically.
 */
export function parseStatValue(
  value: string,
): { prefix: string; number: number; suffix: string } | null {
  const m = /^([^\d]*)(\d[\d,]*)(.*)$/.exec(value.trim());
  if (!m) return null;
  const number = Number(m[2].replace(/,/g, ""));
  if (!Number.isFinite(number)) return null;
  return { prefix: m[1], number, suffix: m[3] };
}

/**
 * How a stat should be READ ALOUD. "$6B+" spoken literally comes out as
 * "dollar six B plus", which is why these strings were hand-written before
 * the values were editable. So: use the author's override if they wrote one,
 * otherwise expand the symbols ourselves. Falling back to the raw display
 * string would silently reintroduce the exact bug this guards against, so
 * that's only the last resort for values we can't parse (which are usually
 * already words, e.g. "Dozens", and read fine).
 */
export function spokenStatValue(value: string, spoken?: string): string {
  const override = spoken?.trim();
  if (override) return override;

  const parsed = parseStatValue(value);
  if (!parsed) return value;

  const { prefix, number, suffix } = parsed;
  const scale = /B/i.test(suffix)
    ? "billion"
    : /M/i.test(suffix)
      ? "million"
      : /K/i.test(suffix)
        ? "thousand"
        : "";
  const currency = prefix.includes("$") ? "dollars" : "";
  const percent = suffix.includes("%") ? "percent" : "";
  const orMore = suffix.includes("+") ? "or more" : "";

  return [String(number), scale, currency, percent, orMore]
    .filter(Boolean)
    .join(" ");
}

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
