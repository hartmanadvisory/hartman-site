import Link from "next/link";

/**
 * 404 — branded not-found page. Renders inside the layout's <main>,
 * so nav + footer stay reachable. Single <h1> per page; skip link
 * from layout still lands here.
 *
 * a11y (accessibility-lead signed off):
 *  - Section is aria-labelledby the h1 (`nf-title`).
 *  - "404" eyebrow is a decorative <span aria-hidden> — the h1 carries
 *    the semantic identity; announcing the digit alone adds nothing.
 *  - Primary CTA is a plain <Link> with visible label as the
 *    accessible name (WCAG 2.4.4).
 *  - No new landmarks introduced (layout's <main> is the sole main
 *    region).
 */
export default function NotFound() {
  return (
    <section
      aria-labelledby="nf-title"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto flex w-full max-w-[var(--container)] flex-col items-start px-6 py-32 sm:px-10 sm:py-40 lg:px-14">
        <span
          aria-hidden="true"
          className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]"
        >
          404
        </span>
        <h1
          id="nf-title"
          className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)]"
        >
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[color:var(--muted)] sm:text-[18px]">
          The link you followed may be broken, or the page may have moved. Head
          back to the homepage or reach out directly.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center bg-[color:var(--cobalt)] px-7 text-[15px] font-medium tracking-[0.01em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e]"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[3rem] items-center justify-center px-5 text-[15px] font-medium tracking-[0.01em] text-[color:var(--cobalt)] transition-colors hover:text-[color:var(--gold-deep)]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
