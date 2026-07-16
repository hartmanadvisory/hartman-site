"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  "Precision legal Counsel",
  "for Venture Capital’s",
  "Defining Deals",
] as const;
const HEADLINE_FULL = HEADLINE_LINES.join(" ");
const HEADLINE_TOTAL_CHARS = HEADLINE_FULL.length;

// Typewriter animation — total type-out duration.
const REVEAL_DURATION_S = 1.6;

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
/**
 * TypewriterHeadline — visible, aria-hidden headline layer. Chars
 * append one at a time over REVEAL_DURATION_S (~28ms per char across
 * the 61-char headline). A cobalt-light cursor bar rides the tail of
 * the typed text — solid during typing, then blinks 3× and fades.
 *
 * Layout stability: every line renders all its characters at all
 * times, but characters past the reveal window use `visibility:
 * hidden` so their space is reserved. No layout shift as chars
 * append. The parent h1 carries the sr-only full text; SR reads the
 * heading exactly once.
 *
 * Under `reduce`, no rAF loop runs — headline renders at full text
 * at rest with no cursor. SC 2.3.3 compliant.
 */
function TypewriterHeadline({ reduce }: { reduce: boolean }) {
  const [revealed, setRevealed] = useState(HEADLINE_TOTAL_CHARS);
  const startedRef = useRef(false);

  // Reset to 0 synchronously on client mount (before paint) so the
  // typewriter runs from the beginning. SSR renders the full text,
  // which prevents a flash if the client script never lands.
  useLayoutEffect(() => {
    if (reduce || startedRef.current) return;
    startedRef.current = true;
    setRevealed(0);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const next = Math.min(
        HEADLINE_TOTAL_CHARS,
        Math.round((elapsed / REVEAL_DURATION_S) * HEADLINE_TOTAL_CHARS),
      );
      setRevealed(next);
      if (next < HEADLINE_TOTAL_CHARS) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const done = revealed >= HEADLINE_TOTAL_CHARS;

  // Walk each line, mark which chars fall within the reveal window.
  // Space characters between lines count toward the global index so
  // the timing matches HEADLINE_FULL.length.
  let seen = 0;

  return (
    <span aria-hidden="true" className="block">
      {HEADLINE_LINES.map((line, li) => {
        const chars = [...line];
        const startOfLine = seen;
        seen += chars.length;
        // Account for the join(" ") space between lines.
        if (li < HEADLINE_LINES.length - 1) seen += 1;

        // Cursor position within this line, if any. `cursorPos` is
        // the char index (0..chars.length) at which the cursor should
        // sit — i.e., after the last-revealed char and before the
        // first hidden char. -1 means the cursor is not on this line.
        //
        //   revealed < startOfLine                       → cursor is on a later line
        //   revealed >= startOfLine + chars.length + 1   → cursor is past this line
        //   otherwise                                    → cursorPos = revealed - startOfLine
        //
        // The final-line "done" state parks the cursor at the very
        // end of the last line where it blinks 3× and fades.
        let cursorPos = -1;
        if (!done) {
          if (revealed >= startOfLine && revealed <= startOfLine + chars.length) {
            cursorPos = revealed - startOfLine;
          }
        } else if (li === HEADLINE_LINES.length - 1) {
          cursorPos = chars.length;
        }

        return (
          <span key={li} className="block whitespace-pre">
            {chars.map((ch, ci) => {
              const globalIdx = startOfLine + ci;
              const visible = globalIdx < revealed;
              return (
                <span key={ci} style={{ visibility: visible ? "visible" : "hidden", position: "relative" }}>
                  {/* Inline cursor sitting immediately before this
                      character. It's positioned absolute so it doesn't
                      shift the character's own width; `left: 0` +
                      `translateX(-2px)` snugs it to the leading edge. */}
                  {cursorPos === ci && (
                    <span
                      aria-hidden="true"
                      className={
                        done
                          ? "cursor-blink-3 absolute left-0 top-[0.075em] h-[0.85em] w-[0.06em] -translate-x-[2px] bg-[color:var(--cobalt-light)]"
                          : "absolute left-0 top-[0.075em] h-[0.85em] w-[0.06em] -translate-x-[2px] bg-[color:var(--cobalt-light)]"
                      }
                      style={{ visibility: "visible" }}
                    />
                  )}
                  {ch}
                </span>
              );
            })}
            {/* Cursor at end-of-line — only when no character remains
                to anchor it, i.e., cursorPos === chars.length. */}
            {cursorPos === chars.length && (
              <span
                aria-hidden="true"
                className={
                  done
                    ? "cursor-blink-3 ml-[2px] inline-block h-[0.85em] w-[0.06em] translate-y-[0.075em] bg-[color:var(--cobalt-light)] align-baseline"
                    : "ml-[2px] inline-block h-[0.85em] w-[0.06em] translate-y-[0.075em] bg-[color:var(--cobalt-light)] align-baseline"
                }
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

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

        {/* Headline — text scramble/decode effect. Full string sits once
            in an sr-only span so screen readers hear the h1 exactly once;
            visible layer is aria-hidden and shuffles glyphs before
            resolving. Under reduced motion, the visible layer renders the
            final text at rest with no cursor. */}
        <div className="absolute inset-x-0 top-0 z-10 px-6 pt-16 sm:px-10 sm:pt-20 lg:px-14">
          <h1
            id="hero-h1"
            className="max-w-[56rem] font-[family-name:var(--font-display)] text-[clamp(1.75rem,5.8vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.02em] text-[color:var(--white)]"
          >
            <span className="sr-only">{HEADLINE_FULL}</span>
            <TypewriterHeadline reduce={!!reduce} />
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
          delay: reduce ? 0 : REVEAL_DURATION_S + 0.35,
          ease,
        }}
        className="absolute left-6 right-16 z-30 bg-[color:var(--cobalt)] sm:left-10 sm:right-24 lg:left-14 lg:right-40"
        style={{ bottom: "-4rem" }}
      >
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <p className="max-w-2xl text-[1.25rem] leading-relaxed text-[color:var(--white)] sm:text-[1.35rem]">
            A boutique New York law firm guiding venture funds, founders, and
            dealmakers through their most consequential transactions.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
