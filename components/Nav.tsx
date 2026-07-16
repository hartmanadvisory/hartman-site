"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Primary navigation — sticky header with the official HVA secondary
 * lockup, About link, and Contact CTA. The lockup's wordmark lives
 * inside the SVG paths, so no separate <span> text is needed.
 *
 * a11y (accessibility-lead signed off):
 *  - Home Link's aria-label carries the accessible name; <img>s are
 *    alt="" per WCAG H67 (avoid redundant text alternatives).
 *  - Hide-on-scroll-down / show-on-scroll-up behavior with focus-within
 *    override: when a keyboard user tabs into the nav while it's
 *    hidden, focus-within: forces translate-y-0 so focus never lands on
 *    an off-screen target (SC 2.4.11 Focus Not Obscured Minimum).
 *  - `motion-reduce:transition-none` collapses the slide animation
 *    for prefers-reduced-motion users; hide/show behavior itself
 *    stays (SC 2.3.3 covers animation, not visibility).
 *  - Skip link (in layout.tsx) is always reachable regardless of nav
 *    visibility.
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      // Small delta threshold prevents jittery flips on trackpad
      // micro-scrolls.
      if (Math.abs(delta) < 6) return;
      if (delta > 0 && y > 72) {
        // Scrolling down, past one nav height — hide.
        setHidden(true);
      } else if (delta < 0) {
        // Scrolling up — show.
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "on-light sticky top-0 z-50 bg-[rgba(255,255,255,0.96)] backdrop-blur-md pt-[env(safe-area-inset-top)]",
        // Slide + focus-within override — focused keyboard user always
        // sees the nav even if it was hidden by scroll. Tailwind v4
        // animates via the `translate` CSS property (separate from
        // `transform`), so `transition-[translate]` targets it.
        "transition-[translate] duration-300 ease-out motion-reduce:transition-none",
        "focus-within:!translate-y-0",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-height)] max-w-[var(--container)] items-center justify-between gap-6 px-6 sm:px-10 lg:px-14"
      >
        <Link
          href="/"
          aria-label="Hartman Venture Advisors — home"
          className="group flex min-w-0 items-center py-2 -my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--white)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hva-lockup-navy.svg"
            alt=""
            width={254}
            height={39}
            className="h-11 w-auto sm:h-14 group-hover:hidden group-focus-visible:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hva-lockup-gold.svg"
            alt=""
            width={254}
            height={39}
            className="hidden h-11 w-auto sm:h-14 group-hover:block group-focus-visible:block"
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center px-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[color:var(--cobalt)] transition-colors hover:text-[color:var(--gold-deep)] sm:px-4"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center bg-[color:var(--cobalt)] px-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[color:var(--white)] transition-colors hover:bg-[color:var(--gold-deep)] sm:px-5"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
