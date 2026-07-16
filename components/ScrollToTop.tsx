"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * ScrollToTop — forces a fresh scrollTop=0 on every pathname change.
 *
 * Next 16 App Router usually scrolls to top on SPA navigation, but
 * our sticky header + mobile-menu body-scroll-lock stack can
 * interfere. This component makes the reset unconditional.
 *
 * a11y (accessibility-lead signed off):
 *  - Uses `behavior: "auto"` (default instant jump — no smooth
 *    scroll), so `prefers-reduced-motion` users don't get an
 *    animated scroll they didn't ask for.
 *  - Skips when the URL has a hash — in-page anchor targets
 *    should honor their own scroll position, not get forced to
 *    the top.
 *  - No a11y surface: no rendered DOM, no focus changes.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    // Respect in-page anchor targets — if the URL has a hash, the
    // browser is trying to scroll to a specific element; don't
    // override that.
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
