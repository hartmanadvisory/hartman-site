import { ImageResponse } from "next/og";

/**
 * /apple-icon — iOS home-screen icon (180×180). Same HH monogram +
 * navy-deep ground as `app/icon.tsx`. Next 16 file convention emits
 * this as the `<link rel="apple-touch-icon">` target automatically.
 */

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const NAVY_DEEP = "#0f1626";
const WHITE = "#ffffff";

export default function AppleIcon() {
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
        <svg
          width={120}
          height={120}
          viewBox="0 0 92 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="10" height="60" fill={WHITE} />
          <rect x="41" y="0" width="10" height="60" fill={WHITE} />
          <rect x="82" y="0" width="10" height="60" fill={WHITE} />
          <rect x="0" y="27" width="92" height="6" fill={WHITE} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
