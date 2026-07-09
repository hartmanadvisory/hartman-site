"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  animate as fmAnimate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/**
 * "Who We Are" — matches Citadel's below-hero movement. Two full-bleed bands
 * over an offset 12-col grid:
 *
 *   1) UPPER band on --panel (warm gray): a small navy sentence-case eyebrow
 *      "Who we are" sits in the LEFT gutter; the right area holds a thin
 *      decorative vertical rule, the serif <h2> statement, and a solid cobalt
 *      button (link styled as button) linking to /about.
 *   2) LOWER band on WHITE: three tall stat cells divided by vertical rules.
 *      Big serif value at top, small gray label at bottom (min-height so the
 *      cells feel monumental like Citadel's).
 *
 * a11y (accessibility-lead + specialists):
 *  - Eyebrow is a decorative <p>, NOT a heading. Serif statement is the sole
 *    <h2>. Region named by both (aria-labelledby="who-eyebrow who-h2").
 *  - Button = plain <Link> (implicit role="link"), never role="button". Visible
 *    text = the accessible name. `.on-light` two-color :focus-visible ring.
 *  - Vertical rules are decorative dividers, aria-hidden, exempt from 3:1 UI
 *    contrast because layout separation carries the meaning.
 *  - Stats stay a <dl>: DOM order dt(label) → dd(value); CSS reverses the
 *    visual order (justify-between + column) so the value sits on top.
 *  - "$5B+" is aria-hidden with an .sr-only "5 billion dollars or more" so
 *    screen readers never voice "dollar five B plus".
 *  - Reveal never bakes opacity:0 into SSR: `initial` stays false until mounted
 *    (rAF-deferred), so content is visible without JS or on hydration failure;
 *    reduced motion collapses the transform.
 */

type Stat = {
  label: string;
  /** Numeric portion that counts up. */
  to: number;
  /** Format the animating number for display (adds symbols/suffixes). */
  format: (n: number) => string;
  /** Natural-language announcement of the final value for screen readers. */
  sr: string;
  /** Descriptive context that fades in after the count-up. */
  info: string;
};

const STATS: Stat[] = [
  {
    label: "Aggregate transaction value",
    to: 5,
    format: (n) => `$${n}B+`,
    sr: "5 billion dollars or more",
    info: "Value of transactions on which the firm has served as principal counsel to founders, funds, or LPs.",
  },
  {
    label: "Category-defining companies advised",
    to: 23,
    format: (n) => String(n),
    sr: "twenty-three",
    info: "Including Anthropic, OpenAI, SpaceX, Anduril, Meta, Ramp, Notion, and Scale — among others.",
  },
  {
    label: "Core disciplines",
    to: 4,
    format: (n) => String(n),
    sr: "four",
    info: "Financings, fund formation, secondaries, and exits — handled end-to-end by the founder himself.",
  },
];

/**
 * StatBlock — one dt/dd/p cell inside the <dl>. Runs a count-up on the
 * numeric value once its parent enters view, then blur-focuses the label +
 * info paragraph. Under reduced motion the value is final immediately and
 * label/info render without transition.
 */
function StatBlock({
  stat,
  index,
  active,
  reduce,
}: {
  stat: Stat;
  index: number;
  active: boolean;
  reduce: boolean;
}) {
  // Initial state is the FINAL value — this is what SSR renders (visible to
  // users with JS disabled) and what hydration matches on the client. Once
  // client-mounted (and motion is allowed), we rAF-reset to 0 in preparation
  // for the count-up so users never see the "final → 0 → count" flicker.
  const [display, setDisplay] = useState(() => stat.format(stat.to));

  // Post-hydration reset: only runs client-side, so no SSR mismatch.
  useEffect(() => {
    if (reduce) return;
    const raf = requestAnimationFrame(() => setDisplay(stat.format(0)));
    return () => cancelAnimationFrame(raf);
  }, [reduce, stat]);

  useEffect(() => {
    // Only animate when active AND motion is allowed. Under reduced motion
    // the initial state already holds the final value — no work needed.
    // NOTE: no per-index delay — all three stats count up SIMULTANEOUSLY so
    // the trio finishes together; only the caption cascade below is staggered.
    if (!active || reduce) return;
    const controls = fmAnimate(0, stat.to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(stat.format(Math.round(v))),
    });
    return () => controls.stop();
  }, [active, reduce, stat]);

  // Blur-in reveal for label + info. Fires AFTER the shared count-up finishes
  // (~1.4s), then cascades across the three cells at 0.15s each so the
  // captions feel sequential even though the numbers moved as one.
  const revealDelay = reduce ? 0 : 1.15 + index * 0.15;
  const meta: Variants = {
    hidden: {
      opacity: reduce ? 1 : 0,
      filter: reduce ? "blur(0px)" : "blur(8px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: reduce ? 0 : 0.45,
        delay: revealDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div
      className={[
        "col-span-12 flex min-h-[18rem] flex-col justify-between md:col-span-4",
        index === 0
          ? "md:col-start-1"
          : "md:border-l md:border-[color:var(--rule-on-white)] md:pl-10",
      ].join(" ")}
    >
      <dd
        className="font-[family-name:var(--font-display)] text-[clamp(3.2rem,7.4vw,6rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[color:var(--ink)]"
        style={{ fontFeatureSettings: "'tnum' 1, 'cv11' 1" }}
      >
        <span aria-hidden="true">{display}</span>
        <span className="sr-only">{stat.sr}</span>
      </dd>
      <motion.div
        initial={active ? "hidden" : false}
        animate={active ? "show" : "hidden"}
        variants={meta}
        className="mt-6 space-y-3"
      >
        <dt className="max-w-[15rem] text-[15px] font-medium uppercase tracking-[0.14em] text-[color:var(--ink)]">
          {stat.label}
        </dt>
        <p className="max-w-[18rem] text-[14px] leading-snug text-[color:var(--muted)]">
          {stat.info}
        </p>
      </motion.div>
    </div>
  );
}

export default function WhoWeAre() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const statsRef = useRef<HTMLDListElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const variants: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0 },
  };
  const reveal = (delay = 0) => ({
    variants,
    initial: mounted && !reduce ? ("hidden" as const) : false,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.25 },
    transition: {
      duration: reduce ? 0 : 0.6,
      delay: reduce ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section id="who-we-are" aria-labelledby="who-eyebrow who-h2">
      {/* ── Upper band: warm-gray panel with offset intro ──────────────── */}
      <div className="bg-[color:var(--panel)]">
        <div className="mx-auto w-full max-w-[var(--container)] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 sm:gap-x-10">
            {/* Left gutter — sentence-case navy eyebrow */}
            <div className="col-span-12 md:col-span-3">
              <motion.p
                {...reveal()}
                id="who-eyebrow"
                className="text-[17px] leading-tight text-[color:var(--ink)] sm:text-[18px]"
              >
                Who we are
              </motion.p>
            </div>

            {/* Right area — vertical rule + serif statement (top-down) +
                button (bottom-up). Two separate motion wrappers so the h2
                and CTA can enter from different directions; DOM order
                unchanged so tab/reading order is preserved. */}
            <div className="col-span-12 md:col-span-9 md:border-l md:border-[color:var(--rule-on-panel)] md:pl-10">
              <motion.h2
                id="who-h2"
                variants={{
                  hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : -24 },
                  show: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: reduce ? 0 : 0.7,
                  delay: reduce ? 0 : 0.05,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,3.6vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[color:var(--ink)]"
              >
                Our practice is built to guide venture&rsquo;s most consequential
                transactions — financings, fund formation, secondaries, and exits
                — with the judgment that defining moments demand.
              </motion.h2>

              <motion.div
                {...reveal(0.18)}
                className="mt-10"
              >
                <Link
                  href="/about"
                  className="inline-flex min-h-[3rem] items-center justify-center bg-[color:var(--cobalt)] px-7 text-[15px] font-medium tracking-[0.01em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e]"
                >
                  About the Firm
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lower band: white, three-stat wall divided by vertical rules ─ */}
      <div className="bg-[color:var(--white)]">
        <div className="mx-auto w-full max-w-[var(--container)] px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
          <dl
            ref={statsRef}
            role="list"
            className="grid grid-cols-12 gap-x-6 gap-y-14 sm:gap-x-10"
          >
            {STATS.map((stat, i) => (
              <StatBlock
                key={stat.label}
                stat={stat}
                index={i}
                active={statsInView}
                reduce={!!reduce}
              />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
