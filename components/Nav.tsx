"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Sticky minimal nav — transparent over the dark hero, turns to a solid ivory
 * surface on scroll (Citadel pattern). Links: logo+wordmark → home, About,
 * Contact. a11y (accessibility-lead): the header carries `.on-dark` (transparent
 * state, over the dark hero) or `.on-light` (solid ivory state) so the two-color
 * focus ring stays visible in both; solid-state links are NAVY (gold-text would
 * fail on ivory); the wordmark is real visible text (accessible name), the mark
 * is decorative.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = scrolled
    ? "text-[color:var(--ink)] hover:text-[color:var(--gold-deep)]"
    : "text-[color:var(--parchment)] hover:text-[color:var(--gold-text)]";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "on-light border-b border-[color:var(--hairline-on-light)] bg-[color:var(--ivory)]"
          : "on-dark bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-height)] max-w-[var(--container)] items-center justify-between px-6 sm:px-10"
      >
        <Link
          href="/"
          className={`flex items-center gap-3 transition-colors ${
            scrolled ? "text-[color:var(--ink)]" : "text-[color:var(--parchment)]"
          }`}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 44 28"
            className="h-6 w-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 4V24M16 4V24M4 14H16" />
            <path d="M28 4V24M40 4V24M28 14H40" />
          </svg>
          <span className="font-[family-name:var(--font-sans)] text-sm font-semibold uppercase tracking-[0.18em]">
            Hartman Venture Advisors
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            href="/about"
            className={`text-sm font-medium uppercase tracking-[0.12em] transition-colors ${link}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium uppercase tracking-[0.12em] transition-colors ${link}`}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
