"use client";

import { type RefObject, useEffect, useRef } from "react";

/**
 * ScrollBorder — a cobalt rectangle stroked around a media frame whose
 * stroke-dashoffset (via SVG pathLength=1) tracks the target's progress
 * through the viewport. Shared by the "Who We Serve" sticky image and the
 * judgment carousel.
 *
 * Progress is computed from a plain scroll listener rather than framer's
 * useScroll + a MotionValue in the rect's `style` (the shape this had when it
 * lived in WhoWeServe). Same mapping and same output; measuring directly is a
 * few more lines but the resulting stroke-dashoffset is a plain attribute you
 * can read straight off the element, which makes the effect verifiable in a
 * browser instead of having to trust framer's internal plumbing.
 *
 * Mapping matches the original intent recorded in WhoWeServe: offset follows
 * progress, so the border is fully DRAWN as the frame enters and erases as it
 * travels through. `active: false` parks it drawn, so a scroll-back never
 * flashes a half-erased frame — callers with a single always-on border should
 * leave `active` at its default of true.
 *
 * a11y: decorative — aria-hidden, focusable="false", pointer-events-none, so
 * it adds no tab stop and can't occlude anything. Callers gate it on
 * `!reduce`: the draw IS the effect, so hiding it under reduced motion beats
 * showing a static frame (SC 2.3.3).
 *
 * Stacking: keep this at z-10 and NEVER above the carousel controls (z-20),
 * and never after them in DOM order at equal z — at z-20+ the stroke would
 * paint over the focus ring of the buttons nearest the frame edge, a real
 * SC 2.4.11 failure. It also belongs OUTSIDE any overflow-hidden media box,
 * or the drop-shadow separating the stroke from bright pixels gets clipped.
 */
export default function ScrollBorder({
  blockRef,
  active = true,
  /** Viewport fraction at which the draw starts (frame top crossing it). */
  enterAt = 0.9,
  /** Viewport fraction at which it finishes (frame bottom crossing it). */
  exitAt = 0.1,
}: {
  blockRef: RefObject<HTMLElement | null>;
  active?: boolean;
  enterAt?: number;
  exitAt?: number;
}) {
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const rect = rectRef.current;
    if (!rect) return;

    // Inactive frames park fully drawn.
    if (!active) {
      rect.setAttribute("stroke-dashoffset", "0");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const el = blockRef.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Distance travelled from "top at enterAt" to "bottom at exitAt".
      const span = (enterAt - exitAt) * vh + box.height;
      const travelled = enterAt * vh - box.top;
      const progress = Math.max(0, Math.min(1, travelled / (span || 1)));
      rect.setAttribute("stroke-dashoffset", String(progress));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, blockRef, enterAt, exitAt]);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      preserveAspectRatio="none"
      style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))" }}
    >
      <rect
        ref={rectRef}
        x="1.5"
        y="1.5"
        width="calc(100% - 3px)"
        height="calc(100% - 3px)"
        fill="none"
        stroke="var(--cobalt)"
        strokeWidth="3"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={0}
      />
    </svg>
  );
}
