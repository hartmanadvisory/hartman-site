import { ImageResponse } from "next/og";
import { LOCKUP_WHITE_DATA_URI, BRAND_PATTERN_DATA_URI } from "./og-assets";

/**
 * OG / share preview image, generated at request time via next/og.
 * Renders a 1200×630 PNG shown by iMessage/WhatsApp/Slack/LinkedIn/X
 * when someone pastes a hartmanadvisory.com URL.
 *
 * Built from OFFICIAL brand assets (see ./og-assets.ts):
 *  - the real white horizontal lockup (Secondary Logo). This used to be
 *    faked with letter-spaced uppercase system text, so every share
 *    showed an approximation of the wordmark rather than the wordmark.
 *  - the brand pattern (HH mark tessellated) as a low-opacity watermark.
 *
 * Next.js 16 file-convention: this file at app/ level is auto-served as
 * /opengraph-image and referenced in the <meta property="og:image"> tag
 * for every route (unless a route overrides with its own).
 */

export const runtime = "edge";

// Becomes og:image:alt. Consumers that surface it (Mastodon, some
// screen readers in Slack/LinkedIn) read this INSTEAD of seeing the
// banner — so it restates the message rather than inventorying the
// layout. No "logo"/"banner"/"image of"; the url is chrome and carries
// no meaning here.
export const alt =
  "Hartman Venture Advisors — precision legal counsel for venture capital's defining deals. New York.";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site tokens replicated inline — ImageResponse can't read globals.css.
const NAVY_DEEP = "#0f1626";
const WHITE = "#ffffff";
const COBALT_LIGHT = "#6a8ee6";
const PARCHMENT = "#dfd9ca";

// Official lockup is 1000×154 (ratio 6.49). Render at 460 wide.
const LOCKUP_W = 460;
const LOCKUP_H = Math.round((LOCKUP_W * 154) / 1000); // 71

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: NAVY_DEEP,
          display: "flex",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* Brand-pattern watermark — full bleed, tiled, very low opacity.
            Source tile is 200×250 so backgroundSize is 1:1 (this output
            is a fixed raster, so there's no retina case to serve).
            Sits behind everything; opacity is kept low enough that the
            cobalt-light headline still clears AA over the lattice's
            brightest strokes (measured, not assumed). */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage: `url(${BRAND_PATTERN_DATA_URI})`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 250px",
            opacity: 0.06,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "80px 90px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top — cobalt rule + the REAL lockup */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ width: 56, height: 3, background: COBALT_LIGHT }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOCKUP_WHITE_DATA_URI}
              width={LOCKUP_W}
              height={LOCKUP_H}
              alt=""
            />
          </div>

          {/* Middle — the proposition. Mirrors the site h1. */}
          <div
            style={{
              color: WHITE,
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              maxWidth: 1020,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Precision legal counsel for</span>
            <span style={{ color: COBALT_LIGHT }}>
              venture capital&rsquo;s defining deals.
            </span>
          </div>

          {/* Bottom — url + location */}
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
              New York
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
