import type { MetadataRoute } from "next";

/**
 * /robots.txt — Next 16 Metadata Route convention. Emits at request
 * time from the same `NEXT_PUBLIC_SITE_URL` env var that drives
 * layout.tsx's metadataBase, so the sitemap reference tracks the real
 * production domain once the Vercel env flips post-domain-cutover.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hartman-site.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
