import type { MetadataRoute } from "next";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";
import { LEGAL_SLUGS, getLegalPage } from "@/sanity/queries";

/**
 * /sitemap.xml — Next 16 Metadata Route convention.
 *
 * Dates are real, per URL. This used to stamp every entry with
 * `new Date()` at build, which told search engines that all six pages
 * changed on every deploy — the quickest way to train a crawler into
 * ignoring the file's dates altogether. Marketing pages now carry a
 * hand-maintained date (CONTENT_UPDATED in lib/site.ts) and legal pages
 * carry their real "last updated" value from the CMS.
 *
 * Legal routes are derived from LEGAL_SLUGS rather than duplicated here, so
 * adding a legal page can't silently leave it out of the sitemap.
 *
 * Stays statically cached: `getLegalPage` uses a tagged, revalidating fetch
 * rather than a request-time API, so this route keeps the same 5-minute ISR
 * behaviour as the legal pages and is invalidated by the same tags.
 */
type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const MARKETING: { path: string; changeFrequency: ChangeFrequency }[] = [
  { path: "/", changeFrequency: "monthly" },
  { path: "/about", changeFrequency: "monthly" },
  { path: "/contact", changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const legalPages = await Promise.all(LEGAL_SLUGS.map((s) => getLegalPage(s)));

  return [
    ...MARKETING.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: CONTENT_UPDATED[r.path],
      changeFrequency: r.changeFrequency,
      priority: r.path === "/" ? 1 : 0.7,
    })),
    ...legalPages.map((p) => ({
      url: `${SITE_URL}/legal/${p.slug}`,
      lastModified: p.lastUpdated,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
