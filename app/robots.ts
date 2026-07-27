import type { MetadataRoute } from "next";

/**
 * /robots.txt — Next 16 Metadata Route convention. Emits at request
 * time from the same `NEXT_PUBLIC_SITE_URL` env var that drives
 * layout.tsx's metadataBase.
 *
 * The fallback is the real production domain (www — the apex redirects to
 * it). It used to be the Vercel URL, which meant that after the domain went
 * live the site was still advertising hartman-site.vercel.app as its home to
 * crawlers and social platforms. Setting NEXT_PUBLIC_SITE_URL in Vercel now
 * only matters if the domain ever changes again.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hartmanadvisory.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
