import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * /robots.txt — Next 16 Metadata Route convention.
 *
 * `/api/` is disallowed because nothing under it is a page (the contact
 * endpoint is POST-only and answers GET with 405).
 *
 * `/studio` is deliberately NOT disallowed. It's kept out of search results
 * with a `noindex` tag in app/studio/layout.tsx instead — a crawler that is
 * blocked from fetching a URL can never read the instruction not to index it,
 * so blocking it here would be the one thing guaranteed to leave it listed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
