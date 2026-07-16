"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate as fmAnimate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/**
 * AboutStats — three-cell stat wall + a "Firm founded May 2024" subline.
 * Ported wholesale from the previous WhoWeAre lower band (StatBlock +
 * count-up on view). Renders on /about below AboutHero.
 *
 * a11y (accessibility-lead signed off):
 *  - Region aria-labelledby a decorative eyebrow so the stats wall gets a
 *    programmatic name in the landmark tree.
 *  - Stats live in a <dl> with DOM order dt(label) → dd(value); CSS
 *    reverses the visual order so the value sits on top.
 *  - "$6B+" is aria-hidden with an .sr-only "6 billion dollars or more"
 *    so screen readers never voice "dollar six B plus".
 *  - "Firm founded May 2024" sits OUTSIDE the <dl> as a plain <p> with a
 *    semantic <time datetime="2024-05"> so machines can parse the date.
 *  - Reveal never bakes opacity:0 into SSR: `initial` stays false until
 *    mounted; reduced motion collapses transforms and skips count-up.
 */

type Stat = {
  label: string;
  to: number;
  format: (n: number) => string;
  sr: string;
  info: string;
};

const STATS: Stat[] = [
  {
    label: "Aggregate transaction value",
    to: 6,
    format: (n) => `$${n}B+`,
    sr: "6 billion dollars or more",
    info: "Value of transactions on which the firm has served as principal counsel to founders, funds, or LPs.",
  },
  {
    label: "Financings, secondaries & M&A advised",
    to: 100,
    format: (n) => `${n}+`,
    sr: "one hundred or more",
    info: "Across seed to growth stage: priced rounds, structured secondaries, and strategic exits.",
  },
  {
    label: "Marquee venture funds represented",
    to: 10,
    format: (n) => String(n),
    sr: "ten",
    info: "Including a16z, Tiger, Insight, Altimeter, Dragoneer, Thrive, and Addition.",
  },
];

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
  const [display, setDisplay] = useState(() => stat.format(stat.to));

  useEffect(() => {
    if (reduce) return;
    const raf = requestAnimationFrame(() => setDisplay(stat.format(0)));
    return () => cancelAnimationFrame(raf);
  }, [reduce, stat]);

  useEffect(() => {
    if (!active || reduce) return;
    const controls = fmAnimate(0, stat.to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(stat.format(Math.round(v))),
    });
    return () => controls.stop();
  }, [active, reduce, stat]);

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
        "col-span-12 flex min-h-[16rem] flex-col justify-between md:col-span-4",
        index === 0 ? "md:col-start-1" : "md:pl-10",
      ].join(" ")}
    >
      <dd
        className="font-[family-name:var(--font-display)] text-[clamp(3rem,6.8vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[color:var(--white)]"
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
        <dt className="max-w-[15rem] text-[14px] font-medium uppercase tracking-[0.14em] text-[color:var(--white)]">
          {stat.label}
        </dt>
        <p className="max-w-[18rem] text-[13.5px] leading-snug text-[color:var(--parchment)]">
          {stat.info}
        </p>
      </motion.div>
    </div>
  );
}

export default function AboutStats() {
  const reduce = useReducedMotion();
  const statsRef = useRef<HTMLDListElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });

  return (
    <section
      id="about-stats"
      aria-labelledby="about-stats-eyebrow"
      className="bg-[color:var(--navy-deep)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-8 pb-24 sm:px-10 sm:pt-10 sm:pb-32 lg:px-14">
        <p
          id="about-stats-eyebrow"
          className="mb-10 text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt-light)]"
        >
          By the Numbers
        </p>

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

        {/* Founding date — plain <p> with semantic <time>. Outside the
            <dl> so it doesn't get read as a fourth stat. */}
        <p className="mt-12 text-[14px] text-[color:var(--parchment)]">
          Firm founded{" "}
          <time
            dateTime="2024-05"
            className="font-semibold text-[color:var(--cobalt-light)]"
          >
            May 2024
          </time>
          .
        </p>
      </div>
    </section>
  );
}
