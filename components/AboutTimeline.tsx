"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ABOUT_BACKGROUND, pick, pickList } from "@/sanity/content-defaults";

/**
 * AboutTimeline — "Background" band. Milton-Berg-style two-column layout:
 * left column carries the section heading + a short lead paragraph; right
 * column is a plain-sentence bullet list with checkmark icons and hairline
 * dividers between rows. No sticky-stack, no photo collage, no HH watermark
 * — the earlier motion-heavy version was scrapped.
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="background-h2">.
 *  - "Background" is a REAL visible <h2> (not sr-only, not aria-label on the
 *    section) — VoiceOver's rotor Headings list is the primary landmark
 *    navigation, and aria-label on a region does not appear there.
 *  - Decorative <span aria-hidden> cobalt underline (NOT <hr>).
 *  - <ul role="list"> with 7 <li> rows.
 *  - Checkmark SVGs aria-hidden focusable="false" — the sentence text
 *    carries the meaning.
 *  - Motion: single whileInView fade on the whole section.
 */

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 text-[color:var(--cobalt)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12.5 2.6 2.6L16.5 9.5" />
    </svg>
  );
}

export default function AboutTimeline({
  heading,
  lead,
  bullets,
}: {
  // CMS copy; each falls back to the shipped default when absent or blank.
  heading?: string;
  lead?: string;
  bullets?: string[];
} = {}) {
  const reduce = useReducedMotion();
  const headingText = pick(heading, ABOUT_BACKGROUND.heading);
  const leadText = pick(lead, ABOUT_BACKGROUND.lead);
  const bulletList = pickList(bullets, ABOUT_BACKGROUND.bullets);

  return (
    <section
      id="background"
      aria-labelledby="background-h2"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 sm:gap-x-10">
          {/* LEFT — h2 + cobalt underline + short lead. Single fade for
              the label column so it doesn't compete with the per-bullet
              stagger on the right. */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="col-span-12 md:col-span-5"
          >
            <h2
              id="background-h2"
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--ink)]"
            >
              {headingText}
            </h2>
            <span
              aria-hidden="true"
              className="mt-3 block h-[2px] w-16 bg-[color:var(--cobalt)]"
            />
            <p className="mt-6 max-w-sm text-[17px] leading-relaxed text-[color:var(--muted)]">
              {leadText}
            </p>
          </motion.div>

          {/* RIGHT — bullet list. Each <li> soft-rises on its own trigger. */}
          <div className="col-span-12 md:col-span-7">
            <ul role="list" className="flex flex-col">
              {bulletList.map((text, i) => (
                <motion.li
                  key={i}
                  initial={
                    reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: reduce ? 0 : 0.6,
                    delay: reduce ? 0 : i * 0.08,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className={[
                    "flex items-start gap-5 py-6",
                    i < bulletList.length - 1
                      ? "border-b border-[color:var(--hairline-on-light)]"
                      : "",
                  ].join(" ")}
                >
                  <span className="mt-[3px]">
                    <CheckIcon />
                  </span>
                  <p className="text-[16.5px] leading-relaxed text-[color:var(--ink)]">
                    {text}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
