"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * 500 — branded runtime-error boundary. Next passes `{ error, reset }`.
 * We log the error to console.error client-side, move focus to the h1
 * so SR announces the new state after the boundary swaps in, and give
 * the user a "Try again" (calls `reset()`) plus a "Back to home" link.
 *
 * a11y (accessibility-lead signed off):
 *  - Focus moves to the h1 on mount via a ref + tabIndex={-1}; SR
 *    announces the heading text after the swap.
 *  - Primary "Try again" is a real <button> with visible label.
 *  - "500" eyebrow is decorative (aria-hidden).
 *  - Only one <h1>; nav + footer come from layout.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    console.error(error);
    // Delay one frame so focus lands after the reset animation settles.
    const id = requestAnimationFrame(() => h1Ref.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [error]);

  return (
    <section
      aria-labelledby="err-title"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto flex w-full max-w-[var(--container)] flex-col items-start px-6 py-32 sm:px-10 sm:py-40 lg:px-14">
        <span
          aria-hidden="true"
          className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]"
        >
          500
        </span>
        <h1
          ref={h1Ref}
          id="err-title"
          tabIndex={-1}
          className="mt-6 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)] focus:outline-none"
        >
          Something didn&rsquo;t load.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[color:var(--muted)] sm:text-[18px]">
          A hiccup on our end. Try again, or head back to the homepage.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="on-light inline-flex min-h-[3rem] items-center justify-center bg-[color:var(--cobalt)] px-7 text-[15px] font-medium tracking-[0.01em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center px-5 text-[15px] font-medium tracking-[0.01em] text-[color:var(--cobalt)] transition-colors hover:text-[color:var(--gold-deep)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
