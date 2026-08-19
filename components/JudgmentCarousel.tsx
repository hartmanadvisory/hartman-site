"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ScrollBorder from "./ScrollBorder";
import type { JudgmentEvent } from "@/sanity/queries";
import { layoutEvent, MOSAIC_COLS, MOSAIC_ROWS } from "@/lib/mosaic";

/**
 * JudgmentCarousel — auto-rotating event photo carousel for the "Judgment at
 * the Forefront" section. Implements the WAI-ARIA APG "basic carousel"
 * pattern plus the accessibility-lead's ship checklist:
 *
 *  - <section role="region" aria-roledescription="carousel" aria-label>.
 *  - Each slide is <div role="group" aria-roledescription="slide"
 *    aria-label="N of M: <event title, formatted date>">.
 *  - Slide changes crossfade (500ms opacity), then the outgoing slide gets
 *    visibility:hidden via a delayed transition — same end state as the old
 *    `hidden` attribute (out of the a11y tree and hit-testing), with a
 *    smooth swap. Safe ONLY because slides contain zero focusable elements
 *    and all-decorative images; if a future change puts links/buttons
 *    inside a slide, the fade window becomes a real tab-order hole and
 *    this mechanism must be revisited. Reduced motion: no transition,
 *    instant swap. Accessibility-lead approved this design.
 *  - Images are decorative alt=""; the group's aria-label carries the meaning.
 *    The visible caption is aria-hidden (duplicate of the aria-label).
 *  - Auto-play state machine: pauses on hover, focus-within, page-hidden.
 *    A dedicated visible Pause/Play toggle wins over hover/focus (SC 2.2.2).
 *    Under prefers-reduced-motion the timer never installs and the toggle is
 *    aria-disabled so users can't fight the OS setting.
 *  - Announcements: a visually-hidden aria-live="polite" region is written to
 *    ONLY on user-triggered advance (prev/next click, keyboard); auto-advance
 *    stays silent — otherwise SR gets slammed every 8s.
 *  - Each slide is one EVENT rendered as a 1–4 photo mosaic (lib/mosaic.ts
 *    picks cells by photo count + orientation). The photos are COLLECTIVELY
 *    decorative: they illustrate one named event, and the group's
 *    aria-label (title · date, photo count) is the equivalent text under
 *    SC 1.1.1 — per-photo alt from a non-technical CMS would be noise.
 *    Accessibility-lead signed off on this rationale; do not "fix" it to
 *    per-photo alts. The escape hatch: a photo with an author-written
 *    `alt` in Sanity renders that alt instead of "". Mosaic cells carry
 *    no roles, no tabindex, and no text nodes, so the slide exposes
 *    exactly one node (the labeled group) to the a11y tree.
 *  - Prev/Next/Toggle: native <button type="button">, 44×44 target, dark pill
 *    backdrop for 3:1 icon contrast on variable photo pixels, .on-dark
 *    two-color focus ring.
 *  - Left/Right arrow keys advance ONLY when focus is on prev/next; no
 *    region-level key capture (would break SR browse mode).
 *  - scroll-margin-top on focusable controls clears the sticky nav (SC 2.4.11).
 */

// 8s, up from 6s when slides held one photo: a 4-photo mosaic needs more
// dwell time to take in. SC 2.2.2 is interval-independent (pause control).
const AUTOPLAY_MS = 8000;

/**
 * "Tech Week NYC · June 2025 (3 photos)" — the slide's accessible name.
 * Photo count only when > 1: it explains why this slide visually differs
 * from single-photo slides; "(1 photo)" would be noise.
 */
function eventLabel(ev: JudgmentEvent): string {
  const dateStr = formatDate(ev.date);
  const count = ev.photos.length > 1 ? ` (${ev.photos.length} photos)` : "";
  return `${ev.title}${dateStr ? " · " + dateStr : ""}${count}`;
}

function formatDate(iso: string): string {
  try {
    // Sanity date fields are plain YYYY-MM-DD. `new Date("2026-05-01")`
    // parses as UTC MIDNIGHT, which is the previous day in every Western
    // Hemisphere timezone -- so events dated the 1st displayed the PREVIOUS
    // month ("April 2026" for a May 1 date). Same fix as the legal pages:
    // pin to noon UTC and format in UTC.
    const d = iso.includes("T")
      ? new Date(iso)
      : new Date(iso + "T12:00:00Z");
    return d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "";
  }
}

export default function JudgmentCarousel({
  events,
}: {
  events: JudgmentEvent[];
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false); // user-toggled
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [status, setStatus] = useState(""); // sr-only live region text
  const regionRef = useRef<HTMLElement>(null);

  const total = events.length;
  const canAutoplay = !reduce && total > 1;
  const shouldRun = canAutoplay && !paused && !isHovered && !hasFocus && !pageHidden;

  // Auto-advance timer.
  useEffect(() => {
    if (!shouldRun) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [shouldRun, total]);

  // Track page visibility so the timer doesn't burn in a hidden tab.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => setPageHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const advance = useCallback(
    (dir: 1 | -1, announce: boolean) => {
      setActive((i) => {
        const next = (i + dir + total) % total;
        if (announce) {
          setStatus(
            `${eventLabel(events[next])}, slide ${next + 1} of ${total}`,
          );
        }
        return next;
      });
    },
    [events, total],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      advance(1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      advance(-1, true);
    }
  };

  if (total === 0) return null;

  // Clamp: if the events list shrinks under a live component (HMR in dev,
  // or a CMS deletion arriving via refresh), `active` can point past the
  // end — previously a hard crash into the error boundary.
  const activeIdx = Math.min(active, total - 1);
  const activeEv = events[activeIdx];
  const activeDate = formatDate(activeEv.date);

  return (
    <section
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Event highlights"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setHasFocus(false);
      }}
      className="relative h-full w-full"
    >
      {/* Slides + entry curtain — both scoped to the same overflow-hidden
          image box so the curtain covers ONLY the photograph plane, never the
          caption (z-10) or controls (z-20) which are siblings outside this
          wrapper. Guarantees SC 2.4.11 Focus Not Obscured: a keyboard user
          who tabs into the controls mid-wipe still sees their focus ring. */}
      <div className="absolute inset-0 overflow-hidden">
        {events.map((ev, i) => {
          const isActive = i === activeIdx;
          const label = `${i + 1} of ${total}: ${eventLabel(ev)}`;
          // Cell shapes + photo->cell assignment chosen from the photos'
          // native aspect ratios (see lib/mosaic.ts). Deterministic and
          // cheap (<=72 candidate scores), so no memo needed.
          const { cells, assignment } = layoutEvent(
            ev.photos.map((p) => p.aspect),
          );
          return (
            <div
              key={ev.id}
              role="group"
              aria-roledescription="slide"
              aria-label={label}
              className="absolute inset-0 grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${MOSAIC_COLS}, 1fr)`,
                gridTemplateRows: `repeat(${MOSAIC_ROWS}, 1fr)`,
                opacity: isActive ? 1 : 0,
                // visibility flips AFTER the fade (500ms delay on hide,
                // none on show), so the outgoing slide leaves the a11y
                // tree and hit-testing exactly when it finishes fading.
                visibility: isActive ? "visible" : "hidden",
                transition: reduce
                  ? "none"
                  : `opacity 500ms ease, visibility 0s ${isActive ? "0s" : "500ms"}`,
              }}
            >
              {cells.map((cellDef, ci) => {
                const photo = ev.photos[assignment[ci]];
                if (!photo) return null;
                // Crop focus: honor the photo's Sanity hotspot; otherwise
                // bias upper-center so faces/heads survive the crop.
                const objectPosition =
                  photo.focalX != null && photo.focalY != null
                    ? `${photo.focalX * 100}% ${photo.focalY * 100}%`
                    : "50% 35%";
                // Frame is <=1440px wide; this cell is colSpan/12 of it.
                const frac = cellDef.colSpan / MOSAIC_COLS;
                const sizes = `(max-width: 1440px) ${Math.round(
                  100 * frac,
                )}vw, ${Math.round(1440 * frac)}px`;
                return (
                  <div
                    key={photo.key}
                    className="relative overflow-hidden"
                    style={{
                      gridColumn: `${cellDef.col} / span ${cellDef.colSpan}`,
                      gridRow: `${cellDef.row} / span ${cellDef.rowSpan}`,
                    }}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt ?? ""}
                      fill
                      sizes={sizes}
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="object-cover"
                      style={{ objectPosition }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* White curtain — rises from covering the image (y:0%) up and off
            (y:-100%) on scroll-into-view. Reduced motion → starts already
            off-screen so it never animates. Decorative, aria-hidden. */}
        <motion.div
          aria-hidden="true"
          initial={reduce ? { y: "-100%" } : { y: "0%" }}
          whileInView={{ y: "-100%" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduce ? 0 : 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute inset-0 bg-[color:var(--white)]"
          style={{ willChange: "transform" }}
        />
      </div>

      {/* Scroll-linked cobalt border draw — the same one the Who We Serve
          images use. Deliberately a SIBLING of the image box, not a child:
          inside that box's overflow-hidden the stroke's drop-shadow would be
          clipped at every edge, and it would paint on top of the white
          curtain instead of being revealed by it. Stays at z-10 (below the
          z-20 controls) so it can never cover a focus ring. Its scroll window
          starts later than the curtain's so the two don't animate over each
          other. Skipped under reduced motion: the draw IS the effect. */}
      {!reduce && (
        <ScrollBorder blockRef={regionRef} enterAt={0.6} exitAt={0.4} />
      )}

      {/* Visible caption — duplicate of the active slide's aria-label, so
          aria-hidden to prevent double-announcement. aria-hidden lives on
          this STATIC wrapper, not the animated node: AnimatePresence keeps
          exiting nodes in the DOM, and a wrapper-level aria-hidden makes it
          structurally impossible for an exiting caption to leak into the
          a11y tree (accessibility-lead condition). mode="wait": old tag
          fades out fully, then the new one fades in — no overlap artifacts.
          The y-drift is genuine motion, so it is zeroed under reduced
          motion along with the durations. */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-6 z-10 max-w-[70%] sm:bottom-8 sm:left-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeEv.id}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 6 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            className="bg-[color:var(--cobalt)] px-5 py-3 text-[color:var(--white)]"
          >
            <span className="block text-[15px] font-semibold leading-tight">
              {activeEv.title}
            </span>
            {(activeEv.caption || activeDate) && (
              <span className="mt-0.5 block text-[13px] leading-tight opacity-90">
                {activeEv.caption || activeDate}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls — dark pill backdrop guarantees icon contrast on any photo. */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
        <button
          type="button"
          onClick={() => advance(-1, true)}
          onKeyDown={onKeyDown}
          aria-label="Previous event"
          style={{ scrollMarginTop: "6rem" }}
          className="on-dark grid h-11 w-11 place-items-center rounded-full bg-[rgba(15,20,30,0.55)] text-[color:var(--white)] backdrop-blur-sm transition-colors hover:bg-[rgba(15,20,30,0.75)]"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 6 9 12 15 18" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => advance(1, true)}
          onKeyDown={onKeyDown}
          aria-label="Next event"
          style={{ scrollMarginTop: "6rem" }}
          className="on-dark grid h-11 w-11 place-items-center rounded-full bg-[rgba(15,20,30,0.55)] text-[color:var(--white)] backdrop-blur-sm transition-colors hover:bg-[rgba(15,20,30,0.75)]"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={
            reduce
              ? "Auto-play disabled by system reduced-motion setting"
              : paused
                ? "Play event carousel"
                : "Pause event carousel"
          }
          aria-pressed={!reduce && paused}
          aria-disabled={reduce || undefined}
          style={{ scrollMarginTop: "6rem" }}
          className="on-dark grid h-11 w-11 place-items-center rounded-full bg-[rgba(15,20,30,0.55)] text-[color:var(--white)] backdrop-blur-sm transition-colors hover:bg-[rgba(15,20,30,0.75)] disabled:opacity-60 aria-disabled:opacity-60"
        >
          {reduce || paused ? (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="ml-0.5 h-4 w-4"
              fill="currentColor"
            >
              <path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            >
              <line x1="9" y1="5" x2="9" y2="19" />
              <line x1="15" y1="5" x2="15" y2="19" />
            </svg>
          )}
        </button>
      </div>

      {/* Visually-hidden polite status — only announces user-triggered advances,
          never auto-advance, so SR isn't slammed every 6s. */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </div>
    </section>
  );
}
