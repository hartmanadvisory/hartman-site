import Link from "next/link";
import HHMark from "./HHMark";

/**
 * Citadel-style nav — a solid ivory bar (sticky) with the official HH mark +
 * wordmark on the left and ABOUT / CONTACT on the right. Navy on ivory (AA);
 * `.on-light` gives the two-color focus ring. The mark is decorative
 * (aria-hidden in HHMark); the wordmark is the link's real accessible name.
 */
export default function Nav() {
  return (
    <header className="on-light sticky top-0 z-50 border-b border-[color:var(--hairline-on-light)] bg-[color:var(--ivory)]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-height)] max-w-[var(--container)] items-center justify-between px-6 sm:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-3 text-[color:var(--navy)]"
        >
          <HHMark className="h-7 w-auto" />
          <span className="font-[family-name:var(--font-serif)] text-[0.95rem] font-medium uppercase tracking-[0.16em]">
            Hartman Venture Advisors
          </span>
        </Link>

        <div className="flex items-center gap-9">
          <Link
            href="/about"
            className="text-sm font-medium uppercase tracking-[0.12em] text-[color:var(--navy)] transition-colors hover:text-[color:var(--gold-deep)]"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium uppercase tracking-[0.12em] text-[color:var(--navy)] transition-colors hover:text-[color:var(--gold-deep)]"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
