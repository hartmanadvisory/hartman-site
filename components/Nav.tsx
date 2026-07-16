import Link from "next/link";

/**
 * Primary navigation — the official HVA secondary-logo lockup (HH monogram
 * + "HARTMAN VENTURE ADVISORS" wordmark) as a single navy SVG. The wordmark
 * lives INSIDE the SVG paths, so no separate <span> text is needed. The
 * home link's aria-label carries the accessible name; the image itself is
 * decorative (alt="") per WCAG H67 (avoid redundant text alternatives when
 * an adjacent programmatic label carries the same meaning).
 */
export default function Nav() {
  // Mobile audit MEDIUM: viewportFit=cover exposes the safe-area-inset
  // env vars. On notched iPhones in standalone/PWA mode, safe-area top
  // padding on the sticky header pushes content clear of the notch. No
  // visible change in normal mobile Safari (env resolves to 0).
  return (
    <header className="on-light sticky top-0 z-50 bg-[rgba(255,255,255,0.96)] backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-height)] max-w-[var(--container)] items-center justify-between gap-6 px-6 sm:px-10 lg:px-14"
      >
        <Link
          href="/"
          aria-label="Hartman Venture Advisors — home"
          // Mobile audit HIGH: lockup imgs are 32px (h-8) — Link's clickable
          // rect was 32×105, below the 44×44 AAA tap-target target. `py-2
          // -my-2` expands the hit rect to 48px vertically without shifting
          // the visual lockup or the header layout. Header has ~72px of
          // vertical room, so no overlap risk.
          className="group flex min-w-0 items-center py-2 -my-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--white)]"
        >
          {/* Two lockups stacked: navy at rest, gold on hover OR keyboard
              focus-visible. Plain <img>s to bulletproof against
              next/image + SVG rendering quirks. Both alt="" — Link's
              aria-label is the accessible name. `group-focus-visible:`
              added per a11y-lead so keyboard users get the same visual
              feedback as pointer hover (SC 2.4.7). */}
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
