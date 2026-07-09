"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutPrinciples — "What Sets Us Apart" — 2-column band. LEFT column holds
 * the section h2 + a small cobalt underline rule; RIGHT column stacks three
 * principle cards vertically. The middle card has a subtle cobalt left-border
 * highlight for visual rhythm only (no informational load — the a11y-lead
 * verified this stays inside SC 1.4.1 as purely decorative).
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="principles-h2"> region.
 *  - Left column: <h2> + decorative <span aria-hidden> underline (NOT <hr>,
 *    which SR would announce as "separator").
 *  - Right column: three <article>s, each with a decorative inline SVG icon
 *    (aria-hidden, focusable="false", no title/desc), <h3>, and <p>.
 *  - Middle principle's cobalt left-border is decorative only. No aria/role.
 *  - Reveals cascade from left with a small y offset — matches the site's
 *    established motion vocabulary.
 */

type Principle = {
  id: string;
  title: string;
  body: string;
  featured?: boolean;
  Icon: () => React.ReactElement;
};

// Decorative icons — inline SVGs, aria-hidden, no title/desc.
function IconShield() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-[color:var(--ink)]"
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
      className="h-5 w-5 shrink-0 text-[color:var(--ink)]"
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
      className="h-5 w-5 shrink-0 text-[color:var(--ink)]"
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

export default function AboutPrinciples() {
  const reduce = useReducedMotion();

  return (
    <section
      id="how-we-work"
      aria-labelledby="principles-h2"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 sm:gap-x-10">
          {/* Left — section title + underline rule */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -32 },
              show: { opacity: 1, x: 0 },
            }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="col-span-12 md:col-span-5"
          >
            <h2
              id="principles-h2"
              className="font-[family-name:var(--font-display)] text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)]"
            >
              What Sets Us Apart
            </h2>
            <span
              aria-hidden="true"
              className="mt-6 block h-px w-16 bg-[color:var(--cobalt)] opacity-70"
            />
          </motion.div>

          {/* Right — three principle cards stacked vertically */}
          <div className="col-span-12 flex flex-col gap-6 md:col-span-7 md:gap-8">
            {PRINCIPLES.map((p, i) => {
              const { Icon } = p;
              return (
                <motion.article
                  key={p.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.35 }}
                  variants={{
                    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{
                    duration: reduce ? 0 : 0.7,
                    delay: reduce ? 0 : i * 0.1,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className={[
                    "flex flex-col gap-3 py-3 pr-2",
                    p.featured
                      ? "border-l-[3px] border-[color:var(--cobalt)] pl-6"
                      : "pl-8",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <Icon />
                    <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.2rem,1.8vw,1.4rem)] font-bold tracking-[-0.005em] text-[color:var(--ink)]">
                      {p.title}
                    </h3>
                  </div>
                  <p className="ml-8 max-w-xl text-[15.5px] leading-relaxed text-[color:var(--muted)]">
                    {p.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
