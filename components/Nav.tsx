"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Primary navigation — sticky header. Two layouts:
 *   - Below md: HH monogram (home link) + morphing hamburger/X
 *     toggle. Tapping the toggle rolls a white menu panel down
 *     from the nav bar's bottom edge to cover the viewport.
 *     HH logo and toggle stay pinned in the top bar the whole
 *     time — the panel is a visual extension of the nav, not
 *     a separate overlay.
 *   - md and above: original horizontal layout — HVA wordmark
 *     lockup + About link + Contact CTA. Unchanged.
 *
 * a11y (accessibility-lead signed off, 6 refinements folded in):
 *  - Toggle is a real <button> with aria-controls, aria-expanded,
 *    swapping aria-label.
 *  - Panel is a sibling <div role="dialog" aria-modal="true"
 *    aria-labelledby> inside the sticky header (no portal — the
 *    panel is visually part of the nav).
 *  - When closed: aria-hidden="true" + pointer-events-none.
 *  - Focus trap: on open, first menu link (About). Tab wraps
 *    About → Contact → toggle → About in both directions.
 *  - Escape closes; link tap closes (skips focus-return); toggle
 *    tap closes (returns focus to toggle).
 *  - iOS-safe body scroll lock (position: fixed + saved scrollY).
 *  - inert on <main> while open — belt-and-suspenders for ATs
 *    that ignore aria-modal.
 *  - Auto-closes if viewport crosses md while open.
 *  - Reduced motion: instant open/close, instant icon swap.
 *  - Hide-on-scroll-down behavior only fires when menu is CLOSED,
 *    so scroll gestures inside the modal don't retract the header.
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const secondLinkRef = useRef<HTMLAnchorElement>(null);
  const returnFocusRef = useRef(true);
  const savedScrollY = useRef(0);

  // Hide-on-scroll (unchanged from prior), but skip when the menu is open.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (menuOpen) return;
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      if (delta > 0 && y > 72) setHidden(true);
      else if (delta < 0) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // iOS-safe body scroll lock + inert on <main>.
  useLayoutEffect(() => {
    if (!menuOpen) return;
    savedScrollY.current = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, savedScrollY.current);
      main?.removeAttribute("inert");
    };
  }, [menuOpen]);

  // Focus management: on open, focus first menu link; on close,
  // conditionally return focus to the toggle (skip if a link tap
  // is navigating away — the trigger may unmount).
  useEffect(() => {
    if (menuOpen) {
      const raf = requestAnimationFrame(() => firstLinkRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    if (returnFocusRef.current) {
      try {
        toggleRef.current?.focus();
      } catch {
        /* no-op */
      }
    }
    returnFocusRef.current = true;
  }, [menuOpen]);

  // Escape closes.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Auto-close if viewport crosses md while open.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [menuOpen]);

  // Tab trap across About ↔ Contact ↔ toggle.
  function handlePanelKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusables = [
      firstLinkRef.current,
      secondLinkRef.current,
      toggleRef.current,
    ].filter(Boolean) as HTMLElement[];
    if (focusables.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const idx = active ? focusables.indexOf(active) : -1;
    if (e.shiftKey) {
      if (idx <= 0) {
        e.preventDefault();
        focusables[focusables.length - 1].focus();
      }
    } else if (idx === focusables.length - 1 || idx === -1) {
      e.preventDefault();
      focusables[0].focus();
    }
  }

  const closeSilently = () => {
    returnFocusRef.current = false;
    setMenuOpen(false);
  };

  return (
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
          {/* DESKTOP: HVA wordmark lockup (navy → gold on hover). */}
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

        {/* MOBILE-ONLY toggle: hamburger ↔ X morph. */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="on-light inline-flex h-11 w-11 items-center justify-center text-[color:var(--cobalt)] transition-colors hover:text-[color:var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--white)] md:hidden"
        >
          {/* 24×24 icon; top/mid/bottom bars transform into X. */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            {/* Top bar → rotates 45deg into upper-left→lower-right diagonal. */}
            <path
              d="M4 8 L20 8"
              style={{
                transformOrigin: "12px 8px",
                transform: menuOpen ? "translateY(4px) rotate(45deg)" : "none",
                transition: "transform 220ms ease-out",
              }}
              className="motion-reduce:transition-none"
            />
            {/* Middle bar — fades out when open. */}
            <path
              d="M4 12 L20 12"
              style={{
                opacity: menuOpen ? 0 : 1,
                transition: "opacity 160ms ease-out",
              }}
              className="motion-reduce:transition-none"
            />
            {/* Bottom bar → rotates -45deg. */}
            <path
              d="M4 16 L20 16"
              style={{
                transformOrigin: "12px 16px",
                transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "none",
                transition: "transform 220ms ease-out",
              }}
              className="motion-reduce:transition-none"
            />
          </svg>
        </button>

        {/* DESKTOP-ONLY horizontal About + Contact. */}
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

      {/* Mobile roll-down panel. Sibling of <nav> inside <header> so the
          white background reads as an extension of the nav bar. Clip
          animates from inset(0 0 100% 0) to inset(0), producing the
          "bottom edge rolls down" effect. Sticky header's translate
          hide-on-scroll still applies to the whole header, but scroll
          listener no-ops while open (see effect above). */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!menuOpen}
        onKeyDown={handlePanelKeyDown}
        style={{
          height: menuOpen
            ? "calc(100svh - var(--nav-height) - env(safe-area-inset-top))"
            : "0px",
          clipPath: menuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition:
            "clip-path 220ms ease-out, height 220ms ease-out",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        className="on-light overflow-hidden bg-[color:var(--white)] md:hidden motion-reduce:!transition-none"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          Menu
        </h2>
        <nav
          aria-label="Mobile primary"
          className="flex h-full flex-col items-center justify-center gap-8 px-6 pb-24"
        >
          <Link
            ref={firstLinkRef}
            href="/about"
            onClick={closeSilently}
            className="on-light inline-flex min-h-14 items-center px-4 text-[clamp(1.75rem,7vw,2.4rem)] font-semibold uppercase tracking-[0.16em] text-[color:var(--cobalt)] transition-colors hover:text-[color:var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--white)]"
          >
            About
          </Link>
          <Link
            ref={secondLinkRef}
            href="/contact"
            onClick={closeSilently}
            className="on-light inline-flex min-h-14 items-center justify-center bg-[color:var(--cobalt)] px-8 text-[clamp(1.5rem,6vw,2.1rem)] font-semibold uppercase tracking-[0.16em] text-[color:var(--white)] transition-colors hover:bg-[color:var(--gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--white)]"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
