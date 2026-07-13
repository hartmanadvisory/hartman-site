"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutPrinciples — "What Sets Us Apart" — CENTERED HORIZONTAL band.
 * h2 + cobalt underline sit centered on top; three principle cards run
 * side-by-side below (equal width, always stacked to a single column
 * below md — no 2-then-1 orphan). Middle card ("Our Approach") is the
 * featured principle.
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="principles-h2">.
 *  - h2 + decorative <span aria-hidden> underline (NOT <hr>).
 *  - Three <article>s, each with a decorative inline SVG icon (aria-hidden,
 *    focusable="false"), <h3>, and <p>.
 *  - Middle card featured — SC 1.4.1: color-only distinction fails when
 *    grayscale/high-contrast users cannot perceive the cobalt border. So
 *    the middle card also carries a small visible "Our Approach" badge
 *    text above the h3, providing a text-based non-color signal for the
 *    featured state.
 *  - Featured highlight is a TOP border (not left) — reads more clearly
 *    as "elevated card" in a horizontal row, versus a left border which
 *    reads as a separator between cards.
 *  - Hover/focus emphasis: non-featured cards get a 2px lift + top border
 *    + cobalt-tinted wash + icon tint. Non-interactive cards — no
 *    tabindex, no button semantics, no SC 2.5.8 obligation.
 *  - Reduced motion: entrance stagger collapses to instant; hover
 *    transition disables.
 *  - Stack below md: always single-column full-width (avoids orphan-card
 *    reading of visual peer-group).
 */

type Principle = {
  id: string;
  title: string;
  body: string;
  featured?: boolean;
  Icon: () => React.ReactElement;
};

function IconShield() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 4.5 6v6.2c0 4.2 2.9 7.6 7.5 8.8 4.6-1.2 7.5-4.6 7.5-8.8V6L12 3Z" />
      <path d="m9.5 12.2 1.7 1.7 3.3-3.5" />
    </svg>
  );
}
function IconScales() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="M6 20h12" />
      <path d="M7 6h10" />
      <path d="m7 6-3 6h6L7 6Z" />
      <path d="m17 6-3 6h6l-3-6Z" />
    </svg>
  );
}
function IconStrategy() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3c-1.7 1.5-1.7 3.5 0 5" />
      <path d="M12 8v3H8v3" />
      <path d="M12 8v3h4v3" />
      <path d="M6 17h12" />
      <path d="M5 21h14" />
    </svg>
  );
}

const PRINCIPLES: Principle[] = [
  {
    id: "trusted",
    title: "Direct, Trusted Counsel",
    body:
      "You work directly with experienced counsel on every matter. We build long-term relationships with our clients, not just one-off engagements.",
    Icon: IconShield,
  },
  {
    id: "rigor",
    title: "Rigor with Efficiency",
    body:
      "We deliver precise, thorough legal work without unnecessary delay. Sophisticated transactions require both. We never sacrifice one for the other.",
    featured: true,
    Icon: IconScales,
  },
  {
    id: "strategy",
    title: "Strategy-First",
    body:
      "We go beyond the documents. We help clients assess tradeoffs, navigate counterparties, and execute transactions thoughtfully and decisively.",
    Icon: IconStrategy,
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutPrinciples() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how-we-work"
      aria-labelledby="principles-h2"
      className="bg-[color:var(--navy-deep)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        {/* Centered header */}
        <motion.div
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <h2
            id="principles-h2"
            className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--white)]"
          >
            What Sets Us Apart
          </h2>
          <span
            aria-hidden="true"
            className="mt-6 block h-px w-16 bg-[color:var(--cobalt-light)] opacity-80"
          />
        </motion.div>

        {/* Three cards — horizontal from sm+ (640px), stacked full-width
            on narrow mobile only. Belt-and-suspenders: dropped from md
            (768px) to sm (640px) after a prior stale-build state where
            md:grid-cols-3 didn't take effect on the user's browser. */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-6 sm:mt-20 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((p, i) => {
            const { Icon } = p;
            return (
              <motion.article
                key={p.id}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: reduce ? 0 : 0.7,
                  delay: reduce ? 0 : i * 0.1,
                  ease: EASE,
                }}
                style={{
                  // Top border via inline style — Tailwind's arbitrary
                  // width `border-t-[3px]` sets width-only, no
                  // border-style, so the border never rendered. Explicit
                  // shorthand includes style: solid so it always paints.
                  // Non-featured cards keep a 3px transparent stripe so
                  // hover doesn't shift layout; hover flips only the
                  // color via the Tailwind `hover:border-*` utility.
                  borderTop: p.featured
                    ? "3px solid var(--cobalt-light)"
                    : "3px solid transparent",
                }}
                className={[
                  "group flex h-full flex-col gap-4 p-6 sm:p-7",
                  "transition duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  p.featured
                    ? "bg-[rgba(106,142,230,0.06)]"
                    : "hover:-translate-y-[2px] hover:border-[color:var(--cobalt-light)] hover:bg-[rgba(106,142,230,0.06)] motion-reduce:hover:translate-y-0",
                ].join(" ")}
              >
                {/* Featured-only non-color signal (text badge). Keeps
                    equal visual height across cards via a fixed slot on
                    non-featured cards. */}
                <p
                  className={[
                    "min-h-[1rem] text-[11px] font-semibold uppercase tracking-[0.22em]",
                    p.featured
                      ? "text-[color:var(--cobalt-light)]"
                      : "text-transparent",
                  ].join(" ")}
                  aria-hidden={!p.featured}
                >
                  {p.featured ? "Our Approach" : " "}
                </p>

                <div className="flex items-center gap-3">
                  {/* Direct inline color — the previous CSS-var
                      indirection ([--icon-color:*] with group-hover swap)
                      relied on an arbitrary-property Tailwind class that
                      was not compiling; `var(--icon-color)` dereferenced
                      to nothing and icons fell back to ancestor --ink.
                      Static color per card state is deterministic. The
                      card as a whole still emphasizes on hover via
                      translate + border-color + wash. */}
                  <span
                    className="transition-colors duration-[220ms] motion-reduce:transition-none"
                    style={{
                      color: p.featured
                        ? "var(--cobalt-light)"
                        : "var(--parchment)",
                    }}
                  >
                    <Icon />
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold tracking-[-0.005em] text-[color:var(--white)]">
                    {p.title}
                  </h3>
                </div>

                <p className="text-[15.5px] leading-relaxed text-[color:var(--parchment)]">
                  {p.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
