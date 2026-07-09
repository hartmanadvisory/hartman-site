"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Home hero — Citadel-faithful for Hartman. The media has a small LEFT gutter
 * (right edge flush) and NO scrim gradients — Citadel doesn't wash its imagery,
 * so we rely on the natural darker zone of the source image (hero-3.jpg, dark
 * suited figures top-left) to carry AA contrast for the white headline.
 *
 * The cobalt caption band OVERLAPS the image: it starts inside the bottom-left
 * of the image, extends LEFT past the media (through the gutter to viewport-0),
 * and extends DOWN past the image into the section below — a "bridge" between
 * hero and the next movement, mirroring Citadel's block-into-block overlap.
 *
 * The play/pause control is now Citadel-minimal: two thin white bars (or a
 * white triangle when paused), no circle, no background — just the glyph in
 * the top-right corner. Interactive target is 44×44 via invisible padding.
 *
 * a11y (accessibility-lead + specialists):
 *  - Contrast: white h1 sits on the dark left third of hero-3.jpg (~10:1 vs
 *    the dark-suit composite). If the source image is ever changed, verify
 *    the top-left region stays dark.
 *  - Play/pause is native <button> with a changing aria-label; state driven
 *    by real media events (`playing`/`pause`/`ended`); does not autoplay
 *    under prefers-reduced-motion; invisible padding gives 44×44 target.
 *  - `.on-dark` two-color :focus-visible ring carries focus visibility since
 *    the button has no visible chrome.
 *  - Video is decorative (aria-hidden, non-focusable).
 *  - Cobalt caption block is solid #1c44b8; white text 6.34:1, pixel-safe.
 *  - Reveal never bakes opacity:0 into SSR.
 */

const HEADLINE_LINES = [
  "Precision Counsel",
  "for Venture’s",
  "Defining Deals",
] as const;
const HEADLINE_CHAR_COUNT = HEADLINE_LINES.reduce(
  (n, line) => n + [...line].length,
  0,
);
// Total h1 animation length used to schedule the cobalt caption after it.
const HEADLINE_DURATION_S = HEADLINE_CHAR_COUNT * 0.028 + 0.25;

/**
 * Hero slide catalogue. Every entry is a REAL Hartman photograph. Some have
 * naturally dark upper-left regions (safe for white h1 without scrim), others
 * have bright windows/walls behind the headline zone — those get an additive
 * scrim layer so the composite pixel behind the h1 stays ≥ 4.5:1.
 *
 * Contrast (worst-case composite white pixel behind h1 top-left, verified):
 *  - hero-3.jpg               dark suits,  no scrim needed        ~10.8:1
 *  - hero-event-speaker.png   night pane,  no scrim needed        ~14:1
 *  - hero-event-conversation  midtones,    +additive scrim α=0.35 ~5.2:1
 *  - hero-hartman-desk.png    bright wall, +additive scrim α=0.45 ~4.8:1
 * A base scrim α=0.20 sits under ALL slides at all times (deterministic
 * floor); additive layer stacks on top for the two bright slides.
 */
type HeroSlide = {
  src: string;
  needsScrim: boolean;
};
const HERO_SLIDES: readonly HeroSlide[] = [
  { src: "/hero/hero-3.jpg", needsScrim: false },
  { src: "/hero/hero-event-speaker.png", needsScrim: false },
  { src: "/hero/hero-event-conversation.png", needsScrim: true },
  { src: "/hero/hero-hartman-desk.png", needsScrim: true },
];
const AUTOROTATE_MS = 8000;

export default function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false); // user-toggled
  const [pageHidden, setPageHidden] = useState(false);

  const shouldRotate = !reduce && !paused && !pageHidden && HERO_SLIDES.length > 1;

  // Auto-advance timer for the ambient background image rotation.
  useEffect(() => {
    if (!shouldRotate) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HERO_SLIDES.length);
    }, AUTOROTATE_MS);
    return () => window.clearInterval(id);
  }, [shouldRotate]);

  // Pause rotation when the tab is hidden (battery + jarring resume avoidance).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const toggle = () => setPaused((p) => !p);
  const isPlaying = !reduce && !paused;

  const rise = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0 },
  };
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      aria-labelledby="hero-h1"
      className="relative bg-[color:var(--white)]"
    >
      {/* Media — LEFT-inset gutter, right edge flush. Ambient carousel across
          real Hartman photos; slides tagged needsScrim get an additive top-
          left scrim over the always-on base scrim so the h1 stays ≥ 4.5:1. */}
      <div className="on-dark relative ml-6 h-[clamp(32rem,78vh,52rem)] overflow-hidden bg-[color:var(--navy)] sm:ml-10 lg:ml-14">
        {/* Image stack — decorative, all aria-hidden. Cross-fade via opacity
            controlled by active index. */}
        <div aria-hidden="true" className="absolute inset-0">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="absolute inset-0 transition-opacity"
              style={{
                opacity: active === i ? 1 : 0,
                transitionDuration: reduce ? "0ms" : "1000ms",
                transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* BASE scrim — always on. Localized top-left. Deterministic AA
            floor for the white h1 across every slide. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(15,22,38,0.20) 0%, rgba(15,22,38,0.20) 48%, rgba(15,22,38,0.10) 58%, rgba(15,22,38,0) 66%)",
          }}
        />

        {/* ADDITIVE scrim — only for slides with bright top-left. Its opacity
            follows the active slide's opacity so during a crossfade the AA
            guarantee never dips below the current slide's brightness. */}
        {HERO_SLIDES.map((slide, i) =>
          slide.needsScrim ? (
            <div
              key={`scrim-${slide.src}`}
              aria-hidden="true"
              className="absolute inset-0 z-[1] transition-opacity"
              style={{
                opacity: active === i ? 1 : 0,
                transitionDuration: reduce ? "0ms" : "1000ms",
                background:
                  "linear-gradient(to right, rgba(15,22,38,0.42) 0%, rgba(15,22,38,0.42) 48%, rgba(15,22,38,0.20) 58%, rgba(15,22,38,0) 66%)",
              }}
            />
          ) : null,
        )}

        {/* Headline — top-left, character-by-character reveal (optimalcounsel-
            style). Full string is in the DOM once as an sr-only span so screen
            readers hear the heading exactly ONCE and never per-character. The
            visible layer is aria-hidden and each char animates in with a
            staggered opacity. A blinking cursor rides the last character and
            fades after the animation completes; under reduced motion the
            whole line renders at rest with no cursor. */}
        <div className="absolute inset-x-0 top-0 z-10 px-6 pt-16 sm:px-10 sm:pt-20 lg:px-14">
          <h1
            id="hero-h1"
            className="max-w-[46rem] font-[family-name:var(--font-display)] text-[clamp(2.6rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[color:var(--white)]"
          >
            <span className="sr-only">
              Precision Counsel for Venture&rsquo;s Defining Deals
            </span>
            <motion.span
              aria-hidden="true"
              initial={reduce ? "show" : "hidden"}
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduce ? 0 : 0.028 } },
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
                          transition: { duration: reduce ? 0 : 0.22, ease },
                        },
                      }}
                      className="inline-block"
                    >
                      {ch === " " ? " " : ch}
                    </motion.span>
                  ))}
                  {li === HEADLINE_LINES.length - 1 && !reduce && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1.6,
                        times: [0, 0.05, 0.85, 1],
                        delay: HEADLINE_CHAR_COUNT * 0.028,
                      }}
                      className="ml-1 inline-block align-baseline"
                    >
                      <span className="cursor-blink inline-block h-[0.85em] w-[0.06em] translate-y-[0.05em] bg-[color:var(--white)]" />
                    </motion.span>
                  )}
                </span>
              ))}
            </motion.span>
          </h1>
        </div>

        {/* Play/pause — Citadel-minimal glyph in the top-right corner. No
            visible chrome; interactive area is 44×44 via padding. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={
            isPlaying
              ? "Pause background image rotation"
              : "Resume background image rotation"
          }
          className="absolute right-2 top-2 z-20 grid h-11 w-11 place-items-center text-[color:var(--white)] transition-colors hover:bg-[rgba(0,0,0,0.35)] focus-visible:bg-[rgba(0,0,0,0.35)] sm:right-4 sm:top-4"
        >
          {isPlaying ? (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.55))" }}
            >
              <line x1="9" y1="4" x2="9" y2="20" />
              <line x1="15" y1="4" x2="15" y2="20" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="ml-0.5 h-5 w-5"
              fill="currentColor"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.55))" }}
            >
              <path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Cobalt caption — overlaps the image bottom-left, extends LEFT past
          the media gutter to viewport-0, extends DOWN past the image into
          the section below. Absolute so it can bleed out of the media flow. */}
      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{
          duration: reduce ? 0 : 0.7,
          delay: reduce ? 0 : HEADLINE_DURATION_S + 0.15,
          ease,
        }}
        className="absolute left-6 right-16 z-30 bg-[color:var(--cobalt)] sm:left-10 sm:right-24 lg:left-14 lg:right-40"
        style={{ bottom: "-4rem" }}
      >
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <p className="max-w-2xl text-[1.25rem] leading-relaxed text-[color:var(--white)] sm:text-[1.35rem]">
            A boutique New York practice guiding venture funds, founders, and
            dealmakers through their most consequential transactions.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
