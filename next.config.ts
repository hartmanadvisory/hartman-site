import type { NextConfig } from "next";

/**
 * The canonical public host. Note it's the WWW host, not the apex: Vercel is
 * configured to redirect hartmanadvisory.com -> www.hartmanadvisory.com, so
 * pointing at www keeps visitors to the old URL from taking two hops.
 */
const CANONICAL_ORIGIN = "https://www.hartmanadvisory.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Sanity image CDN — for judgment carousel photos served from the CMS.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  async redirects() {
    return [
      {
        // Send the old Vercel URL to the real domain, preserving the path
        // (so an existing /about or /studio link still lands correctly).
        //
        // Matches ONLY the stable production alias, deliberately — the
        // per-deployment *.vercel.app URLs are how preview builds and
        // rollback checks get verified, and bouncing those to production
        // would defeat the point of a preview.
        source: "/:path*",
        has: [{ type: "host", value: "hartman-site.vercel.app" }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
