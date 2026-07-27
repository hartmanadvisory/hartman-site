"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { WHO_WE_ARE, pick } from "@/sanity/content-defaults";

/**
 * "Who We Are" — single-band section over an offset 12-col grid.
 * Small navy sentence-case eyebrow "Who we are" sits in the LEFT gutter;
 * the right area holds a thin decorative vertical rule, the serif <h2>
 * statement, and a solid cobalt button (link styled as button) linking
 * to /about.
 *
 * Stats wall used to sit below on a white band — removed and ported to
 * `components/AboutStats.tsx` per user direction (stats belong on /about).
 *
 * a11y (accessibility-lead + specialists):
 *  - Eyebrow is a decorative <p>, NOT a heading. Serif statement is the
 *    sole <h2>. Region named by both (aria-labelledby="who-eyebrow who-h2").
 *  - Button = plain <Link> (implicit role="link"), never role="button".
 *    Visible text = the accessible name. The label is CMS-driven, so never
 *    add a static aria-label here — it would drift from the visible text on
 *    every edit (SC 2.5.3 Label in Name).
 *  - Eyebrow + statement are CMS-driven but resolve through `pick`, so a
 *    cleared field can't blank them — both ids feed the region's accessible
 *    name, and an empty name would drop the landmark entirely.
 *  - Vertical rule is decorative, aria-hidden, exempt from 3:1 UI
 *    contrast because layout separation carries the meaning.
 *  - Reveal never bakes opacity:0 into SSR: `initial` stays false until
 *    mounted (rAF-deferred), so content is visible without JS or on
 *    hydration failure; reduced motion collapses the transform.
 */
export default function WhoWeAre({
  eyebrow,
  statement,
  ctaLabel,
}: {
  // CMS copy; each falls back to the shipped default when absent or blank.
  // The button's href stays hardcoded (/about) — only its wording is editable.
  eyebrow?: string;
  statement?: string;
  ctaLabel?: string;
} = {}) {
  const reduce = useReducedMotion();
  const eyebrowText = pick(eyebrow, WHO_WE_ARE.eyebrow);
  const statementText = pick(statement, WHO_WE_ARE.statement);
  const ctaText = pick(ctaLabel, WHO_WE_ARE.ctaLabel);
  const [mounted, setMounted] = useState(false);
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
                {eyebrowText}
              </motion.p>
            </div>

            {/* Right area — vertical rule + serif statement + button */}
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
                className="font-[family-name:var(--font-display)] text-[clamp(2rem,3.4vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[color:var(--ink)]"
              >
                {statementText}
              </motion.h2>

              <motion.div {...reveal(0.18)} className="mt-10">
                <Link
                  href="/about"
                  className="inline-flex min-h-[3rem] items-center justify-center bg-[color:var(--cobalt)] px-7 text-[15px] font-medium tracking-[0.01em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e]"
                >
                  {ctaText}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
