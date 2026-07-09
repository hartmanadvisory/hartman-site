"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import JudgmentCarousel from "./JudgmentCarousel";
import type { JudgmentEvent } from "@/sanity/queries";

/**
 * "What We Do" — Citadel's dark-band movement, for Hartman. Full-bleed
 * --navy-deep, contained 12-col grid: cols 1–7 hold a two-color serif <h2>
 * ("Judgment at the Forefront" / "of Venture." in --cobalt-light); cols 8–12
 * hold a short --parchment paragraph and a white-outlined <Link> button. A
 * full-bleed atmospheric event photo of Mordechai on a panel sits below.
 *
 * a11y (accessibility-lead signed off):
 *  - Single <h2> with two inline <span>s (second uses display:block for the
 *    break — not <br>), one continuous sentence for SR. No 1.4.1 concern:
 *    color is aesthetic, not information.
 *  - Contrast (verified): white/navy-deep 18.88:1, cobalt-light/navy-deep
 *    6.34:1 (large text), --parchment/navy-deep 14.06:1, white 1px border
 *    on navy-deep 18.88:1.
 *  - CTA is Next <Link> (implicit role="link"); never role="button". .on-dark
 *    :focus-visible ring (18.88:1). Padding ≥ 44px target.
 *  - Region named by the h2 (aria-labelledby).
 *  - Photo is decorative (alt="", role="presentation"). No text overlaid.
 *  - Reveal: initial=false until mounted; reduced motion collapses transform.
 *  - --cobalt-light is dark-bg-only (2.98:1 on white); do not reuse on light.
 */
export default function WhatWeDo({ events }: { events: JudgmentEvent[] }) {
  const reduce = useReducedMotion();

  const leftIn: Variants = {
    hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -48 },
    show: { opacity: 1, x: 0 },
  };
  const rightIn: Variants = {
    hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : 48 },
    show: { opacity: 1, x: 0 },
  };
  const directional = (variants: Variants, delay = 0) => ({
    variants,
    // NOTE: unlike the mount-gated helper elsewhere, use "hidden" directly.
    // Framer-motion only reads `initial` on FIRST render — a mount gate would
    // leave `initial=false` at that moment and the hidden state would never
    // apply, so the reveal would never fire. Under reduced motion the variants
    // themselves collapse hidden→show (no opacity/x deltas), so opacity:0 is
    // never baked into SSR for reduced-motion users.
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: reduce ? 0 : 0.75,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      id="what-we-do"
      aria-labelledby="what-h2"
      className="relative overflow-x-clip text-[color:var(--parchment)]"
    >
      {/* Dark navy background band — sized to cover the text + only the UPPER
          portion of the photo. The photo extends past this band into white. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 bottom-16 bg-[color:var(--navy-deep)] sm:bottom-24 lg:bottom-32"
      />

      {/* Text band — headline enters LEFT→RIGHT, right column enters
          RIGHT→LEFT so the two meet in the middle as the section arrives. */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-16 sm:px-10 sm:pt-32 sm:pb-24 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 sm:gap-x-10">
          <motion.h2
            {...directional(leftIn)}
            id="what-h2"
            className="col-span-12 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5.6vw,4.8rem)] font-bold leading-[1.02] tracking-[-0.03em] md:col-span-7"
          >
            <span className="text-[color:var(--white)]">
              Judgment at the Forefront
            </span>
            <span className="block text-[color:var(--cobalt-light)]">
              of Venture.
            </span>
          </motion.h2>

          <motion.div
            {...directional(rightIn, 0.08)}
            className="col-span-12 flex flex-col justify-end md:col-span-5"
          >
            <p className="max-w-md text-lg leading-relaxed text-[color:var(--parchment)]">
              Financings, fund formation, secondaries, and exits — the four
              disciplines that decide a venture&rsquo;s next chapter. Each is
              handled by the founder himself, on a client roster kept
              deliberately small.
            </p>
            <div className="mt-10">
              <Link
                href="/what-we-do"
                className="on-dark inline-flex min-h-[3rem] items-center justify-center border border-[color:var(--white)] bg-transparent px-7 text-[15px] font-medium tracking-[0.02em] text-[color:var(--white)] transition-colors hover:bg-[color:var(--white)] hover:text-[color:var(--navy-deep)]"
              >
                Explore What We Do
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Event carousel — INSET from left/right; extends DOWN past the dark
          navy band (which caps 4-8rem above this container's bottom) so its
          lower portion sits on white. Real Sanity-backed carousel with
          prev/next/pause, auto-advance, and captions per active slide. */}
      <div className="relative mx-6 h-[clamp(20rem,52vh,34rem)] sm:mx-10 lg:mx-14">
        <JudgmentCarousel events={events} />
      </div>
    </section>
  );
}
