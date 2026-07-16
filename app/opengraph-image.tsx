import { ImageResponse } from "next/og";

/**
 * OG / share preview image, generated at request time via next/og.
 * Renders a 1200×630 PNG shown by iMessage/Slack/LinkedIn/X when someone
 * pastes a hartmanadvisory.com URL. Design mirrors the site: dark navy
 * ground, cobalt-light accent band, wordmark, one-line proposition.
 *
 * Next.js 16 file-convention: this file at app/ level is auto-served as
 * /opengraph-image and referenced in the <meta property="og:image"> tag
 * for every route (unless a route overrides with its own opengraph-image).
 */

export const runtime = "edge";
export const alt = "Hartman Venture Advisors — Precision legal Counsel for Venture Capital's Defining Deals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site tokens replicated inline — ImageResponse can't read globals.css.
const NAVY_DEEP = "#0f1626";
const WHITE = "#ffffff";
const COBALT_LIGHT = "#6a8ee6";
const PARCHMENT = "#dfd9ca";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: NAVY_DEEP,
          padding: "80px 90px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* Top row — wordmark + tiny cobalt rule */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 3,
              background: COBALT_LIGHT,
            }}
          />
          <div
            style={{
              color: WHITE,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Hartman Venture Advisors
          </div>
        </div>

        {/* Middle — the proposition */}
        <div
          style={{
            color: WHITE,
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 980,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Precision legal counsel for</span>
          <span style={{ color: COBALT_LIGHT }}>
            venture capital&rsquo;s defining deals.
          </span>
        </div>

        {/* Bottom row — url + boutique tag */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: PARCHMENT,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          <span>hartmanadvisory.com</span>
          <span style={{ letterSpacing: 4, textTransform: "uppercase" }}>
            Boutique · New York
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
