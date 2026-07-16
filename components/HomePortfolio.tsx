"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * HomePortfolio — logo wall of 19 companies Mordechai has advised or
 * transacted on across his career, plus an "& more" cell signalling
 * the list is representative rather than exhaustive. Ships on the
 * homepage between WhatWeDo and WhoWeServe (moved from /about per
 * final-pass direction).
 *
 * a11y (accessibility-lead signed off):
 *  - <section aria-labelledby="portfolio-heading"> region.
 *  - Eyebrow aria-hidden — the h2 carries semantic identity.
 *  - <ul role="list"> wrapper — discrete facts, list semantics preserved.
 *  - Each logo is an <Image> with alt="{Company name}" — per WCAG 1.1.1
 *    every logo is a distinct piece of information, not decoration.
 *  - No tabindex — logos are not interactive; empty tab stops are worse
 *    than none.
 *  - Contrast: black marks on --white background pass trivially (21:1).
 *  - Final "& more" cell stays inside the same <ul> as an honest tail
 *    (sentence-case DOM + CSS uppercase so SR reads the words, not
 *    letter-by-letter).
 */

type Company = { name: string; file: string };

const COMPANIES: Company[] = [
  { name: "Anthropic", file: "anthropic.svg" },
  { name: "OpenAI", file: "openai.svg" },
  { name: "SpaceX", file: "spacex.svg" },
  { name: "Anduril", file: "anduril.svg" },
  { name: "Meta", file: "meta.svg" },
  { name: "Notion", file: "notion.svg" },
  { name: "Ramp", file: "ramp.svg" },
  { name: "Replit", file: "replit.svg" },
  { name: "ByteDance", file: "bytedance.svg" },
  { name: "CoreWeave", file: "coreweave.svg" },
  { name: "Circle", file: "circle.svg" },
  { name: "Groq", file: "groq.svg" },
  { name: "Scale AI", file: "scale.svg" },
  { name: "Addepar", file: "addepar.svg" },
  { name: "Glean", file: "glean.svg" },
  { name: "Gecko Robotics", file: "gecko-robotics.svg" },
  { name: "Huntress", file: "huntress.svg" },
  { name: "Arena", file: "arena.svg" },
  { name: "Saronic", file: "saronic.svg" },
];

export default function HomePortfolio() {
  const reduce = useReducedMotion();

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="bg-[color:var(--white)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-8 sm:gap-x-10">
          <motion.p
            aria-hidden="true"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : -12 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className="col-span-12 text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt)]"
          >
            Selected Engagements
          </motion.p>

          <motion.h2
            id="portfolio-heading"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -32 },
              show: { opacity: 1, x: 0 },
            }}
            transition={{
              duration: reduce ? 0 : 0.75,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="col-span-12 font-[family-name:var(--font-display)] text-[clamp(2.2rem,4.4vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)] md:col-span-10"
          >
            We have advised our clients on investments into the following
            companies.
          </motion.h2>
        </div>

        <ul
          role="list"
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-none border-y border-[color:var(--rule-on-light)] bg-[color:var(--rule-on-light)] sm:mt-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {COMPANIES.map((c, i) => (
            <motion.li
              key={c.file}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : (i % 5) * 0.05,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="relative flex aspect-[3/2] items-center justify-center bg-[color:var(--white)] p-6 sm:p-8"
            >
              <Image
                src={`/brand/companies/${c.file}`}
                alt={c.name}
                width={160}
                height={60}
                className="max-h-10 w-auto object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 sm:max-h-12"
              />
            </motion.li>
          ))}

          <motion.li
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: reduce ? 0 : (COMPANIES.length % 5) * 0.05,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className="relative flex aspect-[3/2] items-center justify-center bg-[color:var(--white)] p-6 sm:p-8"
          >
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              &amp; more
            </span>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}
