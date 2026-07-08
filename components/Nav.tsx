import Link from "next/link";
import HHMark from "./HHMark";

/**
 * Primary navigation — restrained institutional lockup with an explicit
 * contact action. The HH mark remains decorative; the home link is labeled
 * for screen readers so the responsive wordmark can change without changing
 * the accessible name.
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
          className="group flex min-w-0 items-center gap-3 text-[color:var(--cobalt)]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center text-[color:var(--cobalt)] transition-colors group-hover:text-[color:var(--gold-deep)]">
            <HHMark className="h-7 w-auto" />
          </span>
          <span
            aria-hidden="true"
            className="hidden min-w-0 font-[family-name:var(--font-display)] text-[0.95rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--cobalt)] sm:block lg:text-[1.02rem]"
          >
            Hartman Venture Advisors
          </span>
          <span
            aria-hidden="true"
            className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--cobalt)] sm:hidden"
          >
            HVA
          </span>
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
