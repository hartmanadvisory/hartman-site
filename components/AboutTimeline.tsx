"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import HHMark from "./HHMark";

/**
 * AboutTimeline — sticky header + stacking milestones + hovering collage.
 *
 *  ┌── SECTION (runway ≈ N × 100vh) ─────────────────────────────┐
 *  │  ┌── STICKY (top:0, h:100vh) ──────────────────────────┐    │
 *  │  │  Eyebrow "OUR STORY"                                 │    │
 *  │  │  h2 "From landmark deals / to your next one."        │    │
 *  │  │  ┌───────────────┬─────────────────────────────────┐ │    │
 *  │  │  │  MILESTONES   │  PHOTO COLLAGE (hovering)       │ │    │
 *  │  │  │  cross-fade   │  3 candids, gentle float loop   │ │    │
 *  │  │  │  by scroll    │                                 │ │    │
 *  │  │  └───────────────┴─────────────────────────────────┘ │    │
 *  │  └──────────────────────────────────────────────────────┘    │
 *  └─────────────────────────────────────────────────────────────┘
 *
 * a11y (accessibility-lead signed off):
 *  - Single-tree render — no conditional swap under useReducedMotion, to
 *    avoid the SSR/CSR mismatch that bit us last time. Motion is gated by
 *    per-transition duration/animation values, not by structural branching.
 *  - <section aria-labelledby="timeline-h2"> for the region.
 *  - <ol role="list"> keeps chronology semantics; all 5 <li> stay in the
 *    DOM at all times (opacity + pointer-events, never display:none or
 *    visibility:hidden — that would strip them from AT).
 *  - Inactive milestones use `pointer-events:none` (no focusable content
 *    inside anyway, so no inert needed).
 *  - Float loop on the collage respects prefers-reduced-motion via
 *    useReducedMotion — reduce users get a static collage (SC 2.2.2 —
 *    infinite subtle drift > 5s alongside text still counts).
 *  - Collage photos: `alt=""` only, `aria-hidden="true"` on decorative
 *    wrapper. No double-labelling.
 *  - HH watermark: aria-hidden, opacity 0.05, behind the RIGHT column only.
 */

type Milestone = {
  id: string;
  year: string;
  datetime: string;
  title: string;
  description: string;
};

const MILESTONES: Milestone[] = [
  {
    id: "harvard",
    year: "2013",
    datetime: "2013",
    title: "Juris Doctor, Harvard Law School",
    description:
      "Graduates with a focus on corporate and securities law.",
  },
  {
    id: "lowenstein",
    year: "2013–2016",
    datetime: "2013",
    title: "Associate, Lowenstein Sandler",
    description:
      "Cuts his teeth on emerging-company financings and venture-fund formations for a client base ranging from seed-stage founders to established institutional GPs.",
  },
  {
    id: "gunderson",
    year: "2016–2023",
    datetime: "2016",
    title: "Associate → Senior Associate, Gunderson Dettmer",
    description:
      "Seven years at one of the country’s pre-eminent venture practices — advising category-defining companies through priced rounds, secondaries, and exits.",
  },
  {
    id: "founded",
    year: "2024",
    datetime: "2024",
    title: "Founds Hartman Venture Advisors PLLC",
    description:
      "Opens a boutique New York practice built on a single premise: the transactions that decide a company’s trajectory deserve senior attention, end to end.",
  },
  {
    id: "today",
    year: "Today",
    datetime: "2026",
    title: "$6B+ transacted · 100+ financings, secondaries & M&A advised",
    description:
      "A deliberately small client roster of venture funds, category-defining founders, and institutional LPs — each engagement handled with the same rigor that defined the last decade of practice.",
  },
];

const COLLAGE_PHOTOS = [
  "/timeline/timeline-2.jpg",
  "/timeline/timeline-3.jpg",
  "/timeline/timeline-5.jpg",
] as const;

export default function AboutTimeline() {
  const reduce = useReducedMotion();
  const runwayRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  const N = MILESTONES.length;

  return (
    <section
      id="timeline"
      aria-labelledby="timeline-h2"
      className="relative bg-[color:var(--navy-deep)] text-[color:var(--parchment)]"
    >
      <div
        ref={runwayRef}
        style={{ height: `${N * 80}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          {/* HH watermark — decorative, behind the right column. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-[-6vw] z-0 -translate-y-1/2"
            style={{ opacity: 0.05 }}
          >
            <HHMark className="h-[70vh] w-auto text-[color:var(--parchment)]" />
          </div>

          <div className="relative z-10 mx-auto flex h-full w-full max-w-[var(--container)] flex-col justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-14">
            {/* Sticky header — always visible while milestones cross-fade */}
            <header className="mb-10 md:mb-14">
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt-light)]">
                Our Story
              </p>
              <h2
                id="timeline-h2"
                className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.02em]"
              >
                <span className="text-[color:var(--white)]">
                  From landmark deals
                </span>
                <span className="block text-[color:var(--cobalt-light)]">
                  to your next one.
                </span>
              </h2>
            </header>

            <div className="grid flex-1 grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
              {/* LEFT — milestone stack (cross-fades) */}
              <ol
                role="list"
                className="relative min-h-[18rem] border-l border-[color:var(--cobalt-light)]/25 pl-6 sm:pl-8"
              >
                {MILESTONES.map((m, i) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    index={i}
                    total={N}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </ol>

              {/* RIGHT — hovering photo collage */}
              <PhotoCollage reduce={reduce} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Each milestone stacks at the same slot. Opacity ramps up in its assigned
// scroll segment [i/N, (i+1)/N] and holds; the last one holds to the end.
function MilestoneCard({
  milestone,
  index,
  total,
  scrollYProgress,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const slice = 1 / total;
  const start = index * slice;
  const isLast = index === total - 1;

  const opacity = useTransform(
    scrollYProgress,
    isLast
      ? [Math.max(0, start - slice * 0.15), start + slice * 0.15, 1]
      : [
          Math.max(0, start - slice * 0.15),
          start + slice * 0.15,
          start + slice * 0.85,
          Math.min(1, start + slice),
        ],
    isLast ? [0, 1, 1] : [0, 1, 1, 0],
  );

  const y = useTransform(
    scrollYProgress,
    [Math.max(0, start - slice * 0.1), start + slice * 0.2],
    [16, 0],
  );

  return (
    <motion.li
      style={{ opacity, y, pointerEvents: "none" }}
      className="absolute inset-0"
    >
      <span
        aria-hidden="true"
        className="absolute -left-[calc(1.5rem+6px)] top-[0.6rem] block h-3 w-3 rounded-full border border-[color:var(--cobalt-light)] bg-[color:var(--navy-deep)] sm:-left-[calc(2rem+6px)]"
      />
      <time
        dateTime={milestone.datetime}
        className="block text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt-light)]"
      >
        {milestone.year}
      </time>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold leading-tight tracking-[-0.01em] text-[color:var(--white)]">
        {milestone.title}
      </h3>
      <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-[color:var(--parchment)]">
        {milestone.description}
      </p>
    </motion.li>
  );
}

// Hovering photo collage — 3 candids, gentle infinite float, gated behind
// useReducedMotion per SC 2.2.2. Reduce users get a static arrangement.
function PhotoCollage({ reduce }: { reduce: boolean | null }) {
  const shouldFloat = !reduce;

  const cards = [
    {
      src: COLLAGE_PHOTOS[0],
      className:
        "absolute left-[6%] top-[14%] w-[52%] rotate-[-4deg] aspect-[4/5] shadow-2xl",
      float: { y: [0, -6, 0], duration: 6 },
    },
    {
      src: COLLAGE_PHOTOS[1],
      className:
        "absolute right-[4%] top-[6%] w-[46%] rotate-[3deg] aspect-[3/4] shadow-2xl",
      float: { y: [0, 5, 0], duration: 7 },
    },
    {
      src: COLLAGE_PHOTOS[2],
      className:
        "absolute left-[22%] bottom-[6%] w-[56%] rotate-[1.5deg] aspect-[16/10] shadow-2xl",
      float: { y: [0, -4, 0], duration: 8 },
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="relative hidden aspect-[4/5] w-full max-w-[28rem] justify-self-center md:block"
    >
      {cards.map((c, i) => (
        <motion.div
          key={c.src}
          className={`overflow-hidden bg-[color:var(--navy)] ${c.className}`}
          animate={
            shouldFloat
              ? { y: c.float.y }
              : { y: 0 }
          }
          transition={
            shouldFloat
              ? {
                  y: {
                    duration: c.float.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.6,
                  },
                }
              : { duration: 0 }
          }
          whileHover={
            shouldFloat
              ? { scale: 1.03, rotate: 0, transition: { duration: 0.4 } }
              : undefined
          }
        >
          <Image
            src={c.src}
            alt=""
            fill
            sizes="30vw"
            className="object-cover object-center"
          />
        </motion.div>
      ))}
    </div>
  );
}
