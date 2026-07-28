import type { Metadata } from "next";

/**
 * Layout for the embedded Sanity Studio.
 *
 * It exists purely to attach metadata. The Studio page itself is a client
 * component, and metadata can only be exported from a server component — so
 * without this file /studio inherited the marketing homepage's title and
 * description, meaning the CMS admin was crawlable AND looked like a
 * duplicate of the homepage to a search engine.
 *
 * `noindex` rather than a robots.txt Disallow, deliberately: a disallowed URL
 * can't be crawled, so the directive would never be read and an already-known
 * URL could sit in results indefinitely as a bare link. Letting it be crawled
 * is what allows the "don't index this" instruction to actually be seen.
 *
 * `absolute` keeps the site-name template from appending to it, while still
 * naming the firm so an editor with several CMS tabs open can tell them apart.
 */
export const metadata: Metadata = {
  title: { absolute: "Sanity Studio — Hartman Venture Advisors" },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
