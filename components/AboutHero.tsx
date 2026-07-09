"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutHero — full-bleed hero for /about. Same visual language as the
 * homepage hero (typewriter <h1>, cobalt caption band bleeding under) but
 * simpler: single real photograph of Mordechai speaking at a panel, no
 * carousel, no play/pause control.
 *
 * a11y (accessibility-lead signed off):
 *  - Full h1 string sits in an .sr-only span — SR announces "heading level
 *    1, Counsel that carries the weight." once, regardless of visual reveal.
 *  - Character-by-character animation is inside an aria-hidden layer so
 *    SR never voices letters individually.
 *  - Photo is decorative (h1 carries meaning) → alt="".
 *  - Left scrim α=0.55 → 0 across 0–58% of the frame guarantees ≥ 4.5:1
 *    white text on the worst-case pixel behind the headline zone.
 *  - Under prefers-reduced-motion the h1 renders statically (no char stagger).
 */

const HEADLINE_LINES = ["Built for the", "next generation", "of venture"] as const;
const HEADLINE_SR = "Built for the next generation of venture";
const HEADLINE_CHAR_COUNT = HEADLINE_LINES.reduce(
  (n, line) => n + [...line].length,
  0,
);
const HEADLINE_DURATION_S = HEADLINE_CHAR_COUNT * 0.028 + 0.25;
const EASE = [0.16, 1, 0.3, 1] as const;

export default function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="about-hero-h1"
      className="relative bg-[color:var(--white)]"
    >
      {/* Media — LEFT-inset gutter, right edge flush, matches homepage hero. */}
      <div className="on-dark relative ml-6 h-[clamp(30rem,72vh,46rem)] overflow-hidden bg-[color:var(--navy)] sm:ml-10 lg:ml-14">
        {/* Real photo of Mordechai speaking at a night panel — dark night
            tones behind the headline zone carry the AA contrast; the scrim
            below is belt-and-suspenders. */}
        <div
          aria-hidden="true"
          data-a11y-contrast-critical="upper-left"
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/hero/hero-event-speaker.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Load-bearing left scrim — 0.55 across 0–48%, decays to 0 by 66%. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(15,22,38,0.55) 0%, rgba(15,22,38,0.55) 48%, rgba(15,22,38,0.30) 58%, rgba(15,22,38,0) 66%)",
          }}
        />

        {/* Headline — top-left, monochrome white, character reveal. */}
        <div className="absolute inset-x-0 top-0 z-10 px-6 pt-16 sm:px-10 sm:pt-20 lg:px-14">
          <h1
            id="about-hero-h1"
            className="max-w-[46rem] font-[family-name:var(--font-display)] text-[clamp(2.6rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[color:var(--white)]"
          >
            <span className="sr-only">{HEADLINE_SR}</span>
            <motion.span
              aria-hidden="true"
              initial={reduce ? "show" : "hidden"}
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: reduce ? 0 : 0.028 },
                },
              }}
              className="block"
            >
              {HEADLINE_LINES.map((line, li) => (
                <span key={li} className="block">
                  {[...line].map((ch, ci) => (
                    <motion.span
                      key={`${li}-${ci}`}
                      variants={{
                        hidden: { opacity: 0, y: 6 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: reduce ? 0 : 0.22,
                            ease: EASE,
                          },
                        },
                      }}
                      className="inline-block"
                    >
                      {ch === " " ? " " : ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.span>
          </h1>
        </div>
      </div>

      {/* Cobalt caption band — same overlap pattern as homepage: left-inset
          matches media gutter; extends DOWN past the image into the Founder
          section below so the two blend into one continuous canvas. */}
      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : 0.7,
          delay: reduce ? 0 : HEADLINE_DURATION_S + 0.15,
          ease: EASE,
        }}
        className="absolute left-6 right-16 z-30 bg-[color:var(--cobalt)] sm:left-10 sm:right-24 lg:left-14 lg:right-40"
        style={{ bottom: "-4rem" }}
      >
        {/* Two paragraphs side-by-side on md+ with a decorative "|" divider
            between them; stacks vertically below md. Divider is an aria-
            hidden CSS element (border-l) so SR never voices "vertical bar". */}
        <div className="flex flex-col gap-8 px-6 py-10 sm:px-10 sm:py-12 md:flex-row md:items-start md:gap-10 lg:px-14">
          <p className="text-[1.25rem] leading-relaxed text-[color:var(--white)] sm:text-[1.35rem] md:flex-1">
            Hartman Venture Advisors was built for investors, founders, and
            dealmakers who operate at a high level and expect the same from
            their counsel.
          </p>
          <span
            aria-hidden="true"
            className="hidden self-stretch border-l border-white/40 md:block"
          />
          <p className="text-[1.25rem] leading-relaxed text-[color:var(--white)] sm:text-[1.35rem] md:flex-1">
            We deliver sophisticated venture representation through a boutique
            model that prioritizes judgment, precision, and alignment.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
