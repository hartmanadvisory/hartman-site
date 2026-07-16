"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileNavOverlay from "./MobileNavOverlay";

/**
 * Primary navigation — sticky header. Two layouts:
 *   - Below md: compact HH monogram (home link) + hamburger button
 *     that opens a full-screen navy overlay with About + Contact.
 *   - md and above: original horizontal layout — HVA wordmark
 *     lockup + About link + Contact CTA.
 *
 * The mobile overlay lives in `components/MobileNavOverlay.tsx`
 * (portal, focus trap, body scroll lock, iOS-safe).
 *
 * a11y (accessibility-lead signed off):
 *  - Home Link's aria-label carries the accessible name at both
 *    breakpoints (H67).
 *  - Hamburger is a real <button> with aria-controls / aria-expanded /
 *    aria-label swapping open ↔ close.
 *  - Hide-on-scroll-down / show-on-scroll-up preserved from prior
 *    audit; focus-within override keeps a keyboard tab visible.
 *  - Skip link (layout.tsx) intentionally inert while the mobile
 *    overlay is open (modal is modal).
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      if (delta > 0 && y > 72) {
        setHidden(true);
      } else if (delta < 0) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "on-light sticky top-0 z-50 bg-[rgba(255,255,255,0.96)] backdrop-blur-md pt-[env(safe-area-inset-top)]",
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
            {/* MOBILE-ONLY: compact HH monogram. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hh-mark-navy.svg"
              alt=""
              width={62}
              height={40}
              className="h-10 w-auto md:hidden"
            />
            {/* DESKTOP: full HVA wordmark lockup (navy at rest, gold on
                hover / focus). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hva-lockup-navy.svg"
              alt=""
              width={254}
              height={39}
              className="hidden h-11 w-auto md:block md:h-14 md:group-hover:hidden md:group-focus-visible:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/hva-lockup-gold.svg"
              alt=""
              width={254}
              height={39}
              className="hidden h-11 w-auto md:group-hover:block md:group-focus-visible:block md:h-14"
            />
          </Link>

          {/* MOBILE-ONLY: hamburger button. */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="on-light inline-flex h-11 w-11 items-center justify-center text-[color:var(--cobalt)] transition-colors hover:text-[color:var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--white)] md:hidden"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          {/* DESKTOP-ONLY: horizontal About + Contact. */}
          <div className="hidden shrink-0 items-center gap-2 md:flex md:gap-3">
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

      <MobileNavOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={hamburgerRef}
      />
    </>
  );
}
