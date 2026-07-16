import type { MetadataRoute } from "next";

/**
 * /sitemap.xml — Next 16 Metadata Route convention. Lists every static
 * route the site ships. Legal pages get `yearly` change frequency;
 * marketing pages get `monthly`. `lastModified` is a deploy-time
 * snapshot — Sanity-backed lastUpdated could feed this later.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hartman-site.vercel.app";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

const ROUTES: { path: string; changeFrequency: ChangeFrequency }[] = [
  { path: "/", changeFrequency: "monthly" },
  { path: "/about", changeFrequency: "monthly" },
  { path: "/contact", changeFrequency: "monthly" },
  { path: "/legal/privacy", changeFrequency: "yearly" },
  { path: "/legal/terms", changeFrequency: "yearly" },
  { path: "/legal/disclosures", changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.path === "/" ? 1 : 0.7,
  }));
}
