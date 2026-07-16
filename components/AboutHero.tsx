"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutHero — magazine-style profile hero. Small "Profile" eyebrow, huge
 * name h1, short two-sentence intro, portrait on the right. Replaces the
 * previous cinematic typewriter hero. Modeled on peer-firm sites.
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="about-hero-h1">
 *  - Single <h1> on the page carries the founder's name (identity of the
 *    /about page).
 *  - Eyebrow is aria-hidden (h1 carries the section identity; announcing
 *    "profile, heading level 1, Mordechai Hartman" is redundant).
 *  - Portrait is DECORATIVE — alt="" — because the adjacent h1 conveys the
 *    same identity. WCAG H67 (avoid redundant text alternatives) — SR would
 *    otherwise announce "image, Mordechai Hartman" then "heading level 1,
 *    Mordechai Hartman."
 *  - Motion: fade+rise on the left column, respects useReducedMotion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="about-hero-h1"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        <div className="grid grid-cols-12 items-center gap-x-6 gap-y-14 sm:gap-x-10 md:gap-y-0">
          {/* LEFT — eyebrow + name + intro */}
          <motion.div
            initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
            className="col-span-12 md:col-span-7"
          >
            <p
              aria-hidden="true"
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]"
            >
              Profile
            </p>
            <h1
              id="about-hero-h1"
              className="mt-6 font-[family-name:var(--font-display)] text-[clamp(3rem,7.4vw,6rem)] font-bold leading-[1.02] tracking-[-0.03em] text-[color:var(--ink)]"
            >
              Mordechai Hartman
            </h1>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-[color:var(--muted)] sm:text-[18px]">
              Founder and Principal of Hartman Venture Advisors PLLC. More
              than a decade advising venture funds, founders, and dealmakers.
            </p>

            {/* Credential chips — two non-interactive labels rendered as
                small outlined pills. <ul role="list"> defended against
                Safari dropping list semantics when list-style is none;
                <li>s stay non-focusable. Purely informational (no href),
                so no SC 2.4.4 concern. Text 10.5:1 on --white. */}
            <ul
              role="list"
              className="mt-6 flex flex-wrap gap-2"
            >
              <li className="inline-flex items-center border border-[color:var(--rule-on-white)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]">
                Formerly at Gunderson Dettmer &amp; Lowenstein Sandler
              </li>
              <li className="inline-flex items-center border border-[color:var(--rule-on-white)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]">
                Harvard Law JD
              </li>
            </ul>

            {/* Primary CTA. mailto rather than a stubbed `#` target per
                a11y-lead — SC 2.4.4 rejects broken links. Reuses the
                site's existing cobalt filled-button pattern (matches the
                homepage ClosingCTA styling). */}
            <div className="mt-10">
              <Link
                href="/contact"
                className="group inline-flex min-h-[3rem] items-center justify-center gap-2 bg-[color:var(--cobalt)] px-7 text-[15px] font-medium tracking-[0.01em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--white)]"
              >
                Start a Conversation
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — portrait (decorative alt="") */}
          <motion.div
            initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduce ? 0 : 0.9,
              delay: reduce ? 0 : 0.1,
              ease: EASE,
            }}
            className="col-span-12 md:col-span-5"
          >
            <div
              className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--navy-deep)]"
              style={{ boxShadow: "0 30px 80px -20px rgba(15, 22, 38, 0.35)" }}
            >
              <Image
                src="/media/mordechai-hartman-portrait.png"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-center"
              />
            </div>

            {/* Peer-firm-style caption below the portrait. aria-hidden —
                the h1 above already announces "Mordechai Hartman" to AT
                and the intro paragraph carries the role. Making this a
                visible-only decoration avoids a third redundant utterance
                per H67. */}
            <div
              aria-hidden="true"
              className="mt-4 text-[14px] text-[color:var(--ink)]"
            >
              <span className="font-semibold">Mordechai Hartman</span>
              <span className="text-[color:var(--muted)]">
                , Founder &amp; Principal
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
