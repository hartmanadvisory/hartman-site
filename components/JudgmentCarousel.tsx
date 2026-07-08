"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { JudgmentEvent } from "@/sanity/queries";

/**
 * JudgmentCarousel — auto-rotating event photo carousel for the "Judgment at
 * the Forefront" section. Implements the WAI-ARIA APG "basic carousel"
 * pattern plus the accessibility-lead's ship checklist:
 *
 *  - <section role="region" aria-roledescription="carousel" aria-label>.
 *  - Each slide is <div role="group" aria-roledescription="slide"
 *    aria-label="N of M: <event title, formatted date>">.
 *  - Inactive slides get `hidden` — removes them from the tab order and a11y
 *    tree so SR only ever announces the active slide.
 *  - Images are decorative alt=""; the group's aria-label carries the meaning.
 *    The visible caption is aria-hidden (duplicate of the aria-label).
 *  - Auto-play state machine: pauses on hover, focus-within, page-hidden.
 *    A dedicated visible Pause/Play toggle wins over hover/focus (SC 2.2.2).
 *    Under prefers-reduced-motion the timer never installs and the toggle is
 *    aria-disabled so users can't fight the OS setting.
 *  - Announcements: a visually-hidden aria-live="polite" region is written to
 *    ONLY on user-triggered advance (prev/next click, keyboard); auto-advance
 *    stays silent — otherwise SR gets slammed every 5s.
 *  - Prev/Next/Toggle: native <button type="button">, 44×44 target, dark pill
 *    backdrop for 3:1 icon contrast on variable photo pixels, .on-dark
 *    two-color focus ring.
 *  - Left/Right arrow keys advance ONLY when focus is on prev/next; no
 *    region-level key capture (would break SR browse mode).
 *  - scroll-margin-top on focusable controls clears the sticky nav (SC 2.4.11).
 */

const AUTOPLAY_MS = 6000;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
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
          const ev = events[next];
          const dateStr = formatDate(ev.date);
          setStatus(
            `${ev.title}${dateStr ? " · " + dateStr : ""}, slide ${next + 1} of ${total}`,
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

  const activeEv = events[active];
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
      {/* Slides */}
      <div className="absolute inset-0">
        {events.map((ev, i) => {
          const isActive = i === active;
          const label = `${i + 1} of ${total}: ${ev.title}${
            formatDate(ev.date) ? " · " + formatDate(ev.date) : ""
          }`;
          return (
            <div
              key={ev.id}
              role="group"
              aria-roledescription="slide"
              aria-label={label}
              hidden={!isActive}
              className="absolute inset-0"
            >
              {ev.imageUrl && (
                <Image
                  src={ev.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="object-cover object-center"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Visible caption — duplicate of the active slide's aria-label, so
          aria-hidden to prevent double-announcement. */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-6 z-10 max-w-[70%] bg-[color:var(--cobalt)] px-5 py-3 text-[color:var(--white)] sm:bottom-8 sm:left-8"
      >
        <span className="block text-[15px] font-semibold leading-tight">
          {activeEv.title}
        </span>
        {(activeEv.caption || activeDate) && (
          <span className="mt-0.5 block text-[13px] leading-tight opacity-90">
            {activeEv.caption || activeDate}
          </span>
        )}
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
