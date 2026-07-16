"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutPrinciples — "What Sets Us Apart" — CENTERED HORIZONTAL band.
 * h2 + cobalt underline sit centered on top; three principle cards run
 * side-by-side below (equal width, always stacked to a single column
 * below md — no 2-then-1 orphan). All three cards are peer-equal: same
 * top border, same wash, same hover treatment, each with its own
 * uppercase eyebrow above the icon+title row.
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="principles-h2">.
 *  - h2 + decorative <span aria-hidden> underline (NOT <hr>).
 *  - Three <article>s, each with a decorative inline SVG icon
 *    (aria-hidden, focusable="false"), a <p> eyebrow, an <h3>, and a
 *    body <p>. Eyebrow is real content (not aria-hidden), so SR reads
 *    "Relationship · Direct, Trusted Counsel · body…" per card.
 *  - No featured card, no color-only distinction — SC 1.4.1 concern
 *    doesn't apply (every card is peer-equal).
 *  - Hover/focus emphasis: 2px lift + stronger cobalt-tinted wash.
 *    Cards are non-interactive <article>s — no tabindex, no button
 *    semantics, no SC 2.5.8 obligation.
 *  - Reduced motion: entrance stagger collapses to instant; hover
 *    transform is fully disabled (opacity/color changes still fire).
 *  - Stack below md: always single-column full-width (avoids orphan
 *    card reading of visual peer-group).
 */

type Principle = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
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
    eyebrow: "Relationship",
    title: "Direct, Trusted Counsel",
    body:
      "You work directly with experienced counsel on every matter. We build long-term relationships with our clients, not just one-off engagements.",
    Icon: IconShield,
  },
  {
    id: "rigor",
    eyebrow: "Our Approach",
    title: "Rigor with Efficiency",
    body:
      "We deliver precise, thorough legal work without unnecessary delay. Sophisticated transactions require both. We never sacrifice one for the other.",
    Icon: IconScales,
  },
  {
    id: "strategy",
    eyebrow: "Mindset",
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

        {/* Three peer-equal cards — horizontal from md+ (768px), single
            column below. Mobile audit HIGH finding: three cards at
            sm=640–767 rendered ~165px wide, 12–14 chars/line body copy.
            Bumped horizontal breakpoint back to md. */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-6 sm:mt-20 md:grid-cols-3 md:gap-8">
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
                  // width `border-t-[3px]` sets width-only (no
                  // border-style), so the border never renders. Explicit
                  // shorthand keeps the paint deterministic.
                  borderTop: "3px solid var(--cobalt-light)",
                }}
                className={[
                  "group flex h-full flex-col gap-4 bg-[rgba(106,142,230,0.06)] p-6 sm:p-7",
                  "transition-colors duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  "hover:bg-[rgba(106,142,230,0.10)]",
                  // Motion-reduce fully disables the lift; other
                  // browsers get a 2px translate on hover. Kept as a
                  // separate transition rule so motion-reduce cleanly
                  // zeroes it via the motion-reduce: variants below.
                  "hover:[transform:translateY(-2px)] [transition-property:background-color,transform] motion-reduce:hover:[transform:none]",
                ].join(" ")}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt-light)]">
                  {p.eyebrow}
                </p>

                <div className="flex items-center gap-3">
                  {/* Static cobalt-light icon on every card — matches
                      the top border + eyebrow. Wrapped in a span so the
                      SVG `currentColor` stroke inherits the token. */}
                  <span style={{ color: "var(--cobalt-light)" }}>
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
