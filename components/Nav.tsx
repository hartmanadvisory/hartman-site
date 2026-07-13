import Image from "next/image";
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
  return (
    <header className="on-light sticky top-0 z-50 bg-[rgba(255,255,255,0.96)] backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-height)] max-w-[var(--container)] items-center justify-between gap-6 px-6 sm:px-10 lg:px-14"
      >
        <Link
          href="/"
          aria-label="Hartman Venture Advisors — home"
          className="flex min-w-0 items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand/hva-lockup-navy.svg"
            alt=""
            width={254}
            height={39}
            priority
            className="h-8 w-auto sm:h-9"
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
