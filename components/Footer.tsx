import Link from "next/link";

/**
 * Site footer — Citadel-modeled: full-bleed dark navy band, HH monogram +
 * wordmark lockup on the left with a stacked "Footer" nav on the right, a
 * hairline divider, and a bottom row with legal links, copyright, and a
 * single LinkedIn icon.
 *
 * a11y (accessibility-lead signed off):
 *  - <footer> element is auto-labeled as "contentinfo" — must be the ONLY
 *    footer on the page. Verified: no others exist.
 *  - Top links live in <nav aria-label="Footer"> to distinguish from Primary.
 *  - Legal links are a plain <ul aria-label="Legal"> (no second nav landmark
 *    — keeps the landmark tree clean).
 *  - LinkedIn is an <a> with aria-label; the SVG is aria-hidden + focusable=
 *    false. When the real URL lands, target="_blank" + rel="noopener
 *    noreferrer" AND append "(opens in new tab)" to the aria-label (SC 3.2.5).
 *  - Copyright is a <p class="text-sm"> — never <small> (weak semantics,
 *    encourages sub-12px text, risks failing SC 1.4.4 Resize Text at zoom).
 *  - `.on-dark` two-color :focus-visible ring on all interactive elements.
 *  - Contrast on --navy-deep: white 18.88:1, parchment 14.06:1,
 *    parchment-dim ~10.5:1 — all AA/AAA.
 */
export default function Footer() {
  return (
    <footer className="on-dark relative bg-[color:var(--navy-deep)] text-[color:var(--white)]">
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-20 pb-10 sm:px-10 sm:pt-24 lg:px-14">
        {/* Top row — lockup + footer nav */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 sm:gap-x-10">
          <div className="col-span-12 flex flex-col gap-5 md:col-span-6">
            <Link
              href="/"
              aria-label="Hartman Venture Advisors — home"
              className="inline-flex items-center transition-opacity hover:opacity-80"
            >
              {/* Official white lockup on --navy-deep — ~18.9:1 contrast.
                  Plain <img> to bulletproof against next/image + SVG
                  quirks. Decorative alt="" — Link aria-label carries
                  the accessible name. Explicit width/height to prevent
                  CLS. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/hva-lockup-white.svg"
                alt=""
                width={317}
                height={48}
                className="h-10 w-auto sm:h-12"
              />
            </Link>

            {/* Owner contact info — <address> is exact per HTML semantics
                (page-owner contact). Not a <nav> because email/phone are
                direct actions, not site navigation. Stacked <a>s, not a
                <ul>. */}
            <address className="not-italic flex flex-col gap-1 text-[14px] text-[color:var(--parchment-dim)]">
              <a
                href="mailto:mhartman@hartmanadvisory.com"
                className="transition-colors hover:text-[color:var(--white)]"
              >
                mhartman@hartmanadvisory.com
              </a>
              <a
                href="tel:+16179871512"
                className="transition-colors hover:text-[color:var(--white)]"
              >
                +1 (617) 987-1512
              </a>
            </address>
          </div>

          <div className="col-span-12 flex flex-col gap-8 md:col-span-6 md:items-end">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-4 text-[15px] font-medium md:text-right">
                <li>
                  <Link
                    href="/about"
                    className="text-[color:var(--white)] transition-opacity hover:opacity-80"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[color:var(--white)] transition-opacity hover:opacity-80"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* NY Rule 7.1 attorney advertising disclosures — persistent
                on every page. Plain <p>s inside the existing <footer>
                contentinfo landmark per a11y-lead (no extra <aside>).
                "Attorney Advertising" is sentence-case in DOM + CSS
                uppercase so SR reads it as words, not letters. Prior-
                results disclaimer is required because the site cites
                past-performance figures ($6B+ transacted, 100+ deals). */}
            <div className="space-y-1 text-[13px] leading-relaxed text-[color:var(--parchment-dim)] md:text-right">
              <p className="font-semibold uppercase tracking-[0.14em]">
                Attorney Advertising.
              </p>
              <p>
                Prior results do not guarantee a similar outcome.
              </p>
            </div>
          </div>
        </div>

        {/* Divider — decorative hairline. */}
        <hr
          aria-hidden="true"
          className="my-12 border-0 h-px bg-[color:var(--parchment-dim)] opacity-25 sm:my-16"
        />

        {/* Bottom row — legal · copyright · social */}
        <div className="flex flex-col items-start justify-between gap-6 text-[color:var(--parchment-dim)] md:flex-row md:items-center">
          <ul
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[14px]"
          >
            <li>
              <Link
                href="/privacy"
                className="transition-colors hover:text-[color:var(--white)]"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="transition-colors hover:text-[color:var(--white)]"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/disclosures"
                className="transition-colors hover:text-[color:var(--white)]"
              >
                Disclosures
              </Link>
            </li>
          </ul>

          <p className="text-[14px]">
            &copy; 2026 Hartman Venture Advisors PLLC. All rights reserved.
          </p>

          <a
            href="https://www.linkedin.com/company/hartman-venture-advisors-pllc/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hartman Venture Advisors on LinkedIn (opens in new tab)"
            className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--parchment-dim)] text-[color:var(--parchment-dim)] transition-colors hover:border-[color:var(--white)] hover:text-[color:var(--white)]"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
