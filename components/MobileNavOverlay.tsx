"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * MobileNavOverlay — full-screen navy modal for the mobile nav.
 * Renders via portal to document.body so it escapes the sticky
 * header's stacking context and clip regions.
 *
 * a11y (accessibility-lead signed off, with 6 refinements folded in):
 *  - role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title"
 *    (visually-hidden h2).
 *  - Focus trap: initial focus on close button; Tab wraps forward
 *    (close → About → Contact → close); Shift+Tab wraps backward.
 *  - Escape closes; tapping any link closes; tapping close closes.
 *  - Body scroll lock via `position: fixed` + saved scrollY (not just
 *    `overflow: hidden` — iOS Safari doesn't honor that reliably).
 *    Scroll position restored on close.
 *  - `inert` attribute on the app root while open (belt-and-suspenders
 *    in case an AT ignores aria-modal).
 *  - Auto-closes if viewport crosses md (768px) while open, so focus
 *    doesn't strand in an unmounted panel when a user rotates.
 *  - On link tap, close first then let Next Link handle navigation —
 *    focus return is guarded (element may have unmounted).
 *  - Reduced motion: fade collapses to instant; keep the visibility
 *    swap (hiding/showing isn't animation per WCAG).
 *  - Skip link (in layout.tsx) is INTENTIONALLY inert while modal is
 *    open — modal is modal (a11y-lead's note).
 */
export default function MobileNavOverlay({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const contactLinkRef = useRef<HTMLAnchorElement>(null);
  const aboutLinkRef = useRef<HTMLAnchorElement>(null);
  const savedScrollY = useRef(0);
  const returnFocusRef = useRef(true);

  // Body scroll lock (iOS-safe) — save scrollY, apply position:fixed,
  // restore on close.
  useLayoutEffect(() => {
    if (!open) return;
    savedScrollY.current = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    // Belt-and-suspenders: mark app content inert so AT tools that
    // ignore aria-modal still exclude it.
    document.getElementById("__next")?.setAttribute("inert", "");
    document.querySelector("main")?.setAttribute("inert", "");
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, savedScrollY.current);
      document.getElementById("__next")?.removeAttribute("inert");
      document.querySelector("main")?.removeAttribute("inert");
    };
  }, [open]);

  // Focus close on open; return focus to trigger on close.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      if (returnFocusRef.current) {
        // Guard: trigger element may have unmounted (e.g., viewport
        // just crossed md and Nav re-rendered without the button).
        try {
          triggerRef.current?.focus();
        } catch {
          /* no-op */
        }
      }
      returnFocusRef.current = true;
    };
  }, [open, triggerRef]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Auto-close on viewport crossing md — otherwise focus can strand
  // on a link that just got hidden.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, onClose]);

  // Handle Tab wrapping across close ↔ About ↔ Contact.
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusables = [
      closeBtnRef.current,
      aboutLinkRef.current,
      contactLinkRef.current,
    ].filter(Boolean) as HTMLElement[];
    if (focusables.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const idx = active ? focusables.indexOf(active) : -1;
    if (e.shiftKey) {
      if (idx <= 0) {
        e.preventDefault();
        focusables[focusables.length - 1].focus();
      }
    } else {
      if (idx === focusables.length - 1 || idx === -1) {
        e.preventDefault();
        focusables[0].focus();
      }
    }
  }

  // On link tap, don't try to return focus (the link is navigating
  // away and the trigger may unmount). Set a one-shot flag.
  const closeSilently = () => {
    returnFocusRef.current = false;
    onClose();
  };

  // Portal target — only mount on the client so SSR doesn't break.
  if (typeof document === "undefined") return null;
  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[100] flex flex-col bg-[color:var(--navy-deep)] text-[color:var(--white)] motion-safe:animate-[fadeIn_180ms_ease-out] pt-[env(safe-area-inset-top)]"
      style={{ overscrollBehavior: "contain" }}
    >
      <h2 id="mobile-menu-title" className="sr-only">
        Menu
      </h2>

      {/* Top bar — close button, right-aligned, matches nav height. */}
      <div className="flex h-[var(--nav-height)] items-center justify-end px-6 sm:px-10">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="on-dark inline-flex h-11 w-11 items-center justify-center text-[color:var(--white)] transition-colors hover:text-[color:var(--cobalt-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--navy-deep)]"
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
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>
      </div>

      {/* Menu links — stacked, centered vertically. Big tap targets. */}
      <nav
        aria-label="Mobile primary"
        className="flex flex-1 flex-col items-center justify-center gap-8 pb-24"
      >
        <Link
          ref={aboutLinkRef}
          href="/about"
          onClick={closeSilently}
          className="on-dark inline-flex min-h-14 items-center px-4 text-[clamp(1.75rem,7vw,2.4rem)] font-semibold uppercase tracking-[0.16em] text-[color:var(--white)] transition-colors hover:text-[color:var(--cobalt-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--navy-deep)]"
        >
          About
        </Link>
        <Link
          ref={contactLinkRef}
          href="/contact"
          onClick={closeSilently}
          className="on-dark inline-flex min-h-14 items-center bg-[color:var(--cobalt)] px-8 text-[clamp(1.5rem,6vw,2.1rem)] font-semibold uppercase tracking-[0.16em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--navy-deep)]"
        >
          Contact
        </Link>
      </nav>
    </div>,
    document.body,
  );
}
