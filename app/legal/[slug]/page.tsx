import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  getLegalPage,
  LEGAL_SLUGS,
  type LegalSlug,
} from "@/sanity/queries";

/**
 * /legal/[slug] — Sanity-backed legal pages. Three real slugs
 * (privacy · terms · disclosures) shipped with baseline copy in the
 * queries.ts fallback; Sanity content overrides at request time.
 *
 * a11y (accessibility-lead signed off):
 *  - Route emits a single <h1> from the document title; Portable Text
 *    body renders h2/h3 blocks as siblings. If an author selects h1 in
 *    the Studio, the serializer promotes it to <h2> so the page never
 *    has two h1s.
 *  - "Last updated" is rendered as <time dateTime={iso}> so machines
 *    can read it while SR speaks the formatted string.
 *  - External links get target="_blank" rel="noopener noreferrer" plus
 *    a sr-only "(opens in new tab)" suffix per SC 3.2.5. Internal
 *    (mailto:/tel:/#) stay same-tab.
 *  - Section is aria-labelledby the h1.
 */

type Params = { slug: string };

function isLegalSlug(v: string): v is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(v);
}

const TITLE_SUFFIX = " — Hartman Venture Advisors";

export async function generateStaticParams(): Promise<Params[]> {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return { title: `Not found${TITLE_SUFFIX}` };
  const page = await getLegalPage(slug);
  return {
    title: `${page.title}${TITLE_SUFFIX}`,
    description: `${page.title} for Hartman Venture Advisors PLLC.`,
  };
}

const components: PortableTextComponents = {
  block: {
    // Author-selected h1 is promoted to h2 so the route's <h1> stays unique.
    h1: ({ children }) => (
      <h2 className="mt-12 mb-4 font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,1.75rem)] font-bold tracking-[-0.01em] text-[color:var(--ink)]">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,1.75rem)] font-bold tracking-[-0.01em] text-[color:var(--ink)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-[family-name:var(--font-display)] text-[1.1rem] font-semibold tracking-[-0.005em] text-[color:var(--ink)]">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="my-4 text-[16.5px] leading-relaxed text-[color:var(--ink)]">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-[16.5px] leading-relaxed text-[color:var(--ink)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-[16.5px] leading-relaxed text-[color:var(--ink)]">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const isExternal = /^https?:\/\//i.test(href);
      // mailto: and tel: hand off to native handlers — no "new tab"
      // suffix (they never spawn a browser tab), no target=_blank.
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline decoration-[color:var(--cobalt)] underline-offset-4 transition-colors hover:text-[color:var(--cobalt)]"
        >
          {children}
          {isExternal && (
            <span className="sr-only"> (opens in new tab)</span>
          )}
        </a>
      );
    },
  },
};

export default async function LegalPageRoute(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  const page = await getLegalPage(slug);
  const iso = page.lastUpdated;
  // Mobile audit MEDIUM: `new Date('YYYY-MM-DD')` parses as UTC midnight,
  // which is the previous day in every Western Hemisphere timezone. Force
  // noon UTC + explicit `timeZone: 'UTC'` so the formatted string always
  // matches the ISO date regardless of the server's or client's timezone.
  const formatted = new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <section
      aria-labelledby="legal-h1"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto w-full max-w-3xl px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32">
        <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]">
          Legal
        </p>
        <h1
          id="legal-h1"
          className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.4vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)]"
        >
          {page.title}
        </h1>
        <p className="mt-4 text-[14px] text-[color:var(--muted)]">
          Last updated:{" "}
          <time dateTime={iso}>{formatted}</time>
        </p>

        <div className="mt-10">
          <PortableText value={page.body} components={components} />
        </div>
      </div>
    </section>
  );
}
