"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CLOSING_CTA, pick } from "@/sanity/content-defaults";

/**
 * ClosingCTA — the final movement on the homepage. Full-bleed --navy-deep
 * (same token as the footer immediately below it) so the two blend into one
 * continuous dark ground. Serif h2 on the left; supporting sentence + a
 * white-outlined "Start a Conversation" <Link> to /contact on the right.
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="cta-h2">, so the region landmark is named by
 *    the h2 (consistent with WhoWeAre / WhatWeDo / WhoWeServe).
 *  - CTA is a plain Next <Link> (implicit role="link"); visible text carries
 *    the accessible name — never role="button", never aria-label override
 *    (would risk SC 2.5.3 Label in Name mismatch).
 *  - `.on-dark` two-color :focus-visible ring (3:1 on navy-deep + 3:1 on
 *    button fill). Button target ≥ 44×44 (SC 2.5.8 AAA).
 *  - `scroll-margin-top` on the section so the sticky nav doesn't cover the
 *    button when it receives focus via keyboard tab (SC 2.4.11).
 *  - Reveal motion is opacity-only for immediate interactivity — content must
 *    be focusable/clickable from first paint regardless of animation state.
 *    Reduced motion skips the transform entirely.
 */
export default function ClosingCTA({
  heading,
  body,
  ctaLabel,
}: {
  // CMS copy; each falls back to the shipped default when absent or blank.
  // The link's href stays hardcoded — only its wording is editable, and it
  // must never gain a static aria-label (the visible text IS the accessible
  // name, so a fixed label would drift from CMS copy on every edit).
  heading?: string;
  body?: string;
  ctaLabel?: string;
} = {}) {
  const reduce = useReducedMotion();
  const headingText = pick(heading, CLOSING_CTA.heading);
  const bodyText = pick(body, CLOSING_CTA.body);
  const ctaText = pick(ctaLabel, CLOSING_CTA.ctaLabel);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const variants: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0 },
  };
  const reveal = (delay = 0) => ({
    variants,
    initial: mounted && !reduce ? ("hidden" as const) : false,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: reduce ? 0 : 0.7,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      id="contact-cta"
      aria-labelledby="cta-h2"
      className="bg-[color:var(--navy-deep)] text-[color:var(--parchment)]"
      style={{ scrollMarginTop: "6rem" }}
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 sm:gap-x-10">
          <motion.h2
            {...reveal()}
            id="cta-h2"
            className="col-span-12 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.2vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[color:var(--white)] md:col-span-7"
          >
            {headingText}
          </motion.h2>

          <motion.div
            {...reveal(0.08)}
            className="col-span-12 flex flex-col justify-end md:col-span-5"
          >
            <p className="max-w-md text-lg leading-relaxed text-[color:var(--parchment)]">
              {bodyText}
            </p>
            {/* Subtle zoom-in on scroll-into-view. Wrapper is a plain block
                <div>, keeps <Link> as the only focusable element with its
                existing .cta-primary focus ring intact. Reduced motion → no
                transform, immediate final state (per accessibility-lead:
                gate via useReducedMotion, not CSS media query). */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.92 },
                show: { opacity: 1, scale: 1 },
              }}
              transition={{
                duration: reduce ? 0 : 0.7,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="mt-10 block"
            >
              <Link
                href="/contact"
                className="cta-primary on-dark inline-flex w-full items-center justify-center bg-[color:var(--cobalt)] px-10 py-8 text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold tracking-[0.01em] text-[color:var(--white)] shadow-[0_18px_44px_-14px_rgba(28,68,184,0.7)] transition-colors hover:bg-[#163a9e] focus-visible:bg-[#163a9e]"
              >
                {ctaText}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
