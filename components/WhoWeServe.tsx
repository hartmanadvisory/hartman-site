"use client";

import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";

/**
 * ScrollBorder — an SVG rectangle stroked around the sticky image whose
 * stroke-dashoffset (via SVG pathLength=1) is driven by the associated
 * sub-block's scroll progress. Only the ACTIVE image's border animates;
 * inactive borders reset to fully undrawn so a scroll-back never flashes a
 * pre-drawn frame (accessibility-lead's caveat).
 */
function ScrollBorder({
  blockRef,
  active,
}: {
  blockRef: RefObject<HTMLDivElement | null>;
  active: boolean;
}) {
  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start 90%", "end 10%"],
  });
  const dashOffset = useMotionValue(1);

  useEffect(() => {
    if (!active) {
      // Reset to fully DRAWN when this block isn't active, so scrolling back
      // into it starts from the drawn state (per user request — reversed
      // direction: draws un-completely as you scroll down through the block).
      dashOffset.set(0);
      return;
    }
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    dashOffset.set(clamp(scrollYProgress.get()));
    const unsub = scrollYProgress.on("change", (v) => {
      dashOffset.set(clamp(v));
    });
    return unsub;
  }, [active, dashOffset, scrollYProgress]);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      preserveAspectRatio="none"
      style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
    >
      <motion.rect
        x="1.5"
        y="1.5"
        width="calc(100% - 3px)"
        height="calc(100% - 3px)"
        fill="none"
        stroke="var(--cobalt)"
        strokeWidth="3"
        pathLength={1}
        strokeDasharray="1"
        style={{ strokeDashoffset: dashOffset }}
      />
    </svg>
  );
}

/**
 * "Who We Serve" — Blackstone-style sticky scrollytelling, for Hartman.
 * Full-bleed --navy-deep. Small eyebrow "WHO WE SERVE" with a decorative
 * rule; large display <h2>. Below: two-column grid. LEFT column is a sticky
 * media stack (three photos, only one visible at a time, cross-fade). RIGHT
 * column scrolls through three <h3>+<p> sub-blocks; as each block crosses
 * the viewport center, its associated LEFT image fades in.
 *
 * a11y (accessibility-lead + specialists):
 *  - Heading order preserved: h1 (hero) → h2 (WhoWeAre) → h2 (WhatWeDo) →
 *    h2 (this) → h3 x3. Four sibling h2s are correct (parallel top sections).
 *  - Images are decorative (h3+p carries meaning): permanent alt="" AND
 *    aria-hidden="true"; do NOT toggle aria-hidden on active state (churn).
 *  - Sub-blocks are plain <div>s, not <article> or <section aria-labelledby>
 *    (no landmark pollution). One h3 per block.
 *  - Scroll-driven state changes (IntersectionObserver): SC 2.2.2 not
 *    triggered (user controls scroll). Reduced motion swaps state instantly
 *    (no crossfade transition) but still swaps — preserves functionality per
 *    WCAG Understanding. Entrance animations disabled under reduced motion.
 *  - `initial=false` until mounted (no SSR flash / no-JS hiding).
 *  - Sticky left column has an explicit height so it never escapes viewport.
 *  - Mobile (<md): collapses to single column, no sticky, no crossfade —
 *    each image sits above its block (SC 1.4.10 reflow safe).
 *  - IntersectionObserver rootMargin -40%/-40% → block is "active" when it
 *    crosses the vertical center; robust to varying block heights.
 *  - Image loading: first eager+high priority, rest lazy.
 */

type Segment = {
  id: string;
  h3: string;
  body: string;
  image: string;
};

const SEGMENTS: Segment[] = [
  {
    id: "venture-funds",
    h3: "Venture Funds",
    body:
      "General partners at the fund level: from first-time formations to complex spin-outs, GP-led secondaries, and the LP negotiations that decide a fund's economics. We advise the funds shaping the next generation of institutional venture.",
    image: "/media/event-portrait.jpg",
  },
  {
    id: "founders",
    h3: "Founders & Category-Definers",
    body:
      "Repeat founders in the transactions that decide a company's trajectory: priced rounds, tender offers and secondaries, cofounder disputes, strategic sales, and IPOs. Counsel that matches the stakes.",
    image: "/media/event-conversation.jpg",
  },
  {
    id: "lps",
    h3: "Institutional LPs & Family Offices",
    body:
      "Institutional limited partners and family offices on the buy side of the private markets: side letters, direct investment vehicles, secondary purchases, and the diligence that decides where the next allocation goes.",
    image: "/media/event-clients.jpg",
  },
];

export default function WhoWeServe() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  // SEGMENTS.length is 3 (constant), so three refs is safe under rules of
  // hooks. Individual RefObjects (not a mutable array) so useScroll can
  // subscribe to each one from the ScrollBorder overlay in the sticky column.
  const blockRef0 = useRef<HTMLDivElement>(null);
  const blockRef1 = useRef<HTMLDivElement>(null);
  const blockRef2 = useRef<HTMLDivElement>(null);
  const blockRefs = [blockRef0, blockRef1, blockRef2];

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Track which sub-block is at viewport center — that's the "active" one.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = blockRefs.findIndex((r) => r.current === entry.target);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    for (const r of blockRefs) {
      if (r.current) observer.observe(r.current);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variants: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
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
      id="who-we-serve"
      aria-labelledby="serve-h2"
      className="bg-[color:var(--white)] text-[color:var(--ink)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        {/* Two columns from the top — image on the left (sticky through the
            entire right column), header + sub-blocks stacked on the right. */}
        <div className="grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
          {/* LEFT: sticky media stack. Starts at the very top of the section so
              it "moves up" into what would otherwise be dead space beside the
              right-aligned header. */}
          <div className="hidden md:block">
            <div className="sticky top-24 h-[clamp(28rem,68vh,42rem)] w-full overflow-hidden">
              {SEGMENTS.map((seg, i) => (
                <div
                  key={seg.id}
                  aria-hidden="true"
                  className="absolute inset-0 transition-opacity"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transitionDuration: reduce ? "0ms" : "600ms",
                    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <Image
                    src={seg.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="object-cover object-center"
                  />
                  {/* Scroll-linked border draw. Skipped under reduced motion:
                      the draw IS the point, so hiding beats a static frame. */}
                  {!reduce && (
                    <ScrollBorder
                      blockRef={blockRefs[i]}
                      active={active === i}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: header (eyebrow + h2, right-aligned) followed by three
              sub-blocks. Blocks shortened to ~52vh so the section reads
              faster; each block still hits the vertical center for a clean
              image cross-fade. */}
          <div className="flex flex-col">
            {/* Left-to-right wipe reveal. clip-path only affects the paint
                layer — text is in the DOM from first paint so SR reads once,
                regardless of visual state. Reduced motion: fully revealed
                immediately, no clip-path animation. */}
            <motion.div
              initial={
                mounted && !reduce
                  ? { clipPath: "inset(0 100% 0 0)" }
                  : false
              }
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: reduce ? 0 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center justify-end gap-6 text-[color:var(--ink)]"
            >
              <span
                aria-hidden="true"
                className="h-px w-16 bg-[color:var(--rule-on-light)]"
              />
              <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--gold-deep)]">
                Who We Serve
              </span>
            </motion.div>

            <motion.h2
              initial={
                mounted && !reduce
                  ? { clipPath: "inset(0 100% 0 0)" }
                  : false
              }
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: reduce ? 0 : 1.1,
                delay: reduce ? 0 : 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              id="serve-h2"
              // Mobile audit MEDIUM: was `text-right` — on mobile the
              // sticky column is hidden, so a right-aligned h2 read as
              // disconnected from the left-aligned eyebrow above it.
              // Left-align on phone, right-align at md+ where it opposes
              // the sticky column as originally designed.
              className="mt-10 max-w-[38rem] self-end text-left font-[family-name:var(--font-display)] text-[clamp(2.2rem,4.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[color:var(--ink)] md:text-right"
            >
              Funds, Founders, and LPs shaping venture.
            </motion.h2>

            <div className="mt-16 flex flex-col md:mt-24">
              {SEGMENTS.map((seg, i) => (
                <motion.div
                  key={seg.id}
                  {...reveal(0.05)}
                  ref={blockRefs[i]}
                  className="relative flex max-w-xl flex-col justify-center py-14 md:min-h-[52vh] md:py-0"
                >
                  {/* Ghost background number — decorative index (aria-hidden,
                      pointer-events off, select-none, --ink at 0.06 opacity so
                      body text contrast stays untouched at composite ~12.6:1). */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-4 top-2 select-none font-[family-name:var(--font-display)] text-[clamp(8rem,14vw,14rem)] font-bold leading-none text-[color:var(--ink)] opacity-[0.06] md:-left-2"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Mobile-only inline image (sticky column hidden below md). */}
                  <div className="relative mb-8 h-[clamp(16rem,44vh,22rem)] w-full overflow-hidden md:hidden">
                    <Image
                      src={seg.image}
                      alt=""
                      fill
                      sizes="100vw"
                      loading={i === 0 ? "eager" : "lazy"}
                      className="object-cover object-center"
                    />
                  </div>

                  <h3 className="relative z-10 font-[family-name:var(--font-display)] text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.01em] text-[color:var(--ink)]">
                    {seg.h3}
                  </h3>
                  <p className="relative z-10 mt-5 text-lg leading-relaxed text-[color:var(--muted)]">
                    {seg.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
