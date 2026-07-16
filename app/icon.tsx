import { ImageResponse } from "next/og";

/**
 * /icon — browser tab favicon, generated at request time via next/og
 * (Next 16 file convention). 512×512 PNG. Renders the official HH
 * monogram — two H's sharing a middle vertical bar — as an inline
 * SVG on the brand navy-deep ground.
 *
 * ImageResponse handlers can't fetch external assets safely at edge
 * runtime, so the monogram is drawn primitively rather than reading
 * public/brand/hh-mark-navy.svg.
 */

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const NAVY_DEEP = "#0f1626";
const WHITE = "#ffffff";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: NAVY_DEEP,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* HH monogram — 3 vertical bars + a horizontal crossbar.
            Sized to fill ~68% of the canvas so a browser-tab-scaled
            16×16 still reads. */}
        <svg
          width={340}
          height={340}
          viewBox="0 0 92 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left vertical */}
          <rect x="0" y="0" width="10" height="60" fill={WHITE} />
          {/* Middle vertical (shared) */}
          <rect x="41" y="0" width="10" height="60" fill={WHITE} />
          {/* Right vertical */}
          <rect x="82" y="0" width="10" height="60" fill={WHITE} />
          {/* Crossbar */}
          <rect x="0" y="27" width="92" height="6" fill={WHITE} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
