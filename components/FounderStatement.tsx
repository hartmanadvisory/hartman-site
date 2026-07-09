"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * FounderStatement — the "Meet the Founder" band. Panel-gray ground with a
 * two-column layout: portrait on the left, biographical text on the right.
 * Mirrors the peer-firm layout the user provided.
 *
 * a11y (accessibility-lead signed off):
 *  - Eyebrow "Meet the Founder" is a decorative <p> with sentence case in
 *    the DOM and CSS `text-transform: uppercase` for the visual — some SRs
 *    spell out DOM-level ALL CAPS letter-by-letter.
 *  - <h2> holds the person's name only ("Mordechai Hartman"). Role label
 *    "Founder" is a separate <p> below the h2 (not nested), so the SR
 *    heading utterance is exactly the name.
 *  - Credential strip is a <ul role="list"> with two <li>s (chronological
 *    set of credentials — the list-with-N-items semantic is meaningful).
 *  - "$6B+" chip uses the aria-hidden glyph + sr-only expanded pattern so
 *    SR never voices "dollar five B plus".
 *  - Vertical rule between chips is a CSS pseudo-element (decorative),
 *    NOT a "|" character in the DOM.
 *  - Portrait has real alt text "Mordechai Hartman".
 *  - Small decorative rule under the eyebrow is a <span aria-hidden>, not
 *    an <hr> (avoids "separator" announcement).
 */
export default function FounderStatement() {
  const reduce = useReducedMotion();

  return (
    <section
      id="the-founder"
      aria-labelledby="founder-h2"
      className="bg-[color:var(--panel)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 sm:gap-x-10">
          {/* Portrait — real photograph of Mordechai. */}
          <motion.figure
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -32 },
              show: { opacity: 1, x: 0 },
            }}
            transition={{
              duration: reduce ? 0 : 0.8,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="col-span-12 md:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/media/mordechai-hartman-portrait.jpg"
                alt="Mordechai Hartman"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-center"
              />
            </div>
          </motion.figure>

          {/* Right — eyebrow + name h2 + FOUNDER label + bio + credentials */}
          <div className="col-span-12 flex flex-col justify-center md:col-span-7">
            {/* Eyebrow with decorative underline rule */}
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : -12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]"
            >
              Meet the Founder
              <span
                aria-hidden="true"
                className="mt-2 block h-px w-12 bg-[color:var(--cobalt)]"
              />
            </motion.p>

            <motion.h2
              id="founder-h2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : -24 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.75,
                delay: reduce ? 0 : 0.08,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="mt-6 font-[family-name:var(--font-display)] text-[clamp(2.4rem,4.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)]"
            >
              Mordechai Hartman
            </motion.h2>

            {/* Role label — separate <p>, NOT nested in h2 (so the h2's
                accessible name stays "Mordechai Hartman"). Sentence case
                in the DOM; CSS applies the uppercase. */}
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : -8 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : 0.15,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="mt-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]"
            >
              Founder
            </motion.p>

            {/* Body — three paragraphs */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.6,
                delay: reduce ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="mt-8 max-w-xl space-y-5 text-[17px] leading-relaxed text-[color:var(--muted)]"
            >
              <p>
                Mordechai Hartman founded Hartman Venture Advisors to deliver
                sharper, more strategic counsel to the venture capital market.
                He advises venture funds, founders, and dealmakers on
                financings, fund formation, secondaries, restructurings, and
                general corporate matters.
              </p>
              <p>
                Prior to founding the firm, Mordechai practiced at Gunderson
                Dettmer and Lowenstein Sandler, where he represented leading
                venture investors and high-growth companies on more than $6B
                of venture deals.
              </p>
              <p>He holds a J.D. from Harvard Law School.</p>
            </motion.div>

            {/* Credential strip — <ul role="list"> with cobalt separator via
                CSS pseudo-element, not a "|" character. */}
            <motion.ul
              role="list"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.55,
                delay: reduce ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] font-semibold text-[color:var(--cobalt)]"
            >
              <li>Harvard Law School</li>
              <li
                aria-hidden="true"
                className="hidden h-4 w-px bg-[color:var(--cobalt)] opacity-60 sm:block"
              />
              <li>
                <span aria-hidden="true">$6B+ in venture transactions</span>
                <span className="sr-only">
                  6 billion dollars or more in venture transactions
                </span>
              </li>
            </motion.ul>

            {/* Small caption below credentials */}
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : 0.48,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="mt-4 text-[14px] italic text-[color:var(--muted)]"
            >
              Formerly at Gunderson Dettmer and Lowenstein Sandler.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
