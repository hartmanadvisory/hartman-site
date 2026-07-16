"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import JudgmentCarousel from "./JudgmentCarousel";
import type { JudgmentEvent } from "@/sanity/queries";

/**
 * "What We Do" — dark-navy band with two columns above the JudgmentCarousel.
 * LEFT column: eyebrow "WHAT WE DO" + h2 + intro paragraph.
 * RIGHT column: SINGLE-OPEN service accordion (Fund formations / Financings /
 * Secondaries / Restructurings) with 20s auto-collapse timeout. Photo
 * carousel below unchanged.
 *
 * a11y (accessibility-lead signed off — spec revision for single-open +
 * auto-collapse):
 *  - Section aria-labelledby="what-h2".
 *  - Accordion pattern: h3 > button[aria-expanded, aria-controls, id] +
 *    div[id, role="region", aria-labelledby=trigger id].
 *  - SINGLE-OPEN — opening one row simultaneously closes any other
 *    (Radix pattern). AnimatePresence mode="sync" so switch feels
 *    instant, no sequential wait.
 *  - AUTO-COLLAPSE — 20s of no interaction on the currently-open panel
 *    triggers a close. Resets on mousemove/mouseenter within the open
 *    panel, focusin anywhere in the open panel, any keydown while focus
 *    is in the section, and scroll while the panel intersects the
 *    viewport. SC 2.2.1 exception "not essential" applies — content is
 *    trivially reopenable and same-in-place. No pause/extend control
 *    required. Auto-collapse SKIPPED entirely when
 *    prefers-reduced-motion is set (attention/cognitive overlap).
 *  - Focus guard — before auto-collapsing, we check
 *    panelRef.contains(document.activeElement); if a keyboard user is
 *    focused inside, we reset the timer instead of closing.
 *  - Tab-hidden guard — auto-collapse skips when document.hidden.
 *  - Polite live region announces "{title} collapsed" on auto-collapse
 *    so AT users understand the disappearing panel.
 *  - Keyboard: Enter/Space toggle (native button). No arrow-key nav for 4
 *    items (Tab-through sufficient; avoids Home/End obligation).
 *  - Chevron SVG: aria-hidden, decorative rotation tied to isOpen.
 *  - Icons per row: aria-hidden decorative SVGs.
 *  - Contrast (verified against --navy-deep):
 *    · white text 18.88:1, cobalt-light 6.34:1, parchment 14.06:1
 *    · cobalt-light 2px focus ring on navy-deep meets 3:1 for SC 2.4.11.
 */

const AUTO_COLLAPSE_MS = 20_000;

type Service = {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  Icon: () => React.ReactElement;
};

// Small line-weight icons — decorative, aria-hidden by the wrapping SVG.
function IconFund() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-8 w-8 shrink-0 text-[color:var(--cobalt-light)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 9 5H3l9-5Z" />
      <path d="M5 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M19 10v8" />
      <path d="M3 20h18" />
    </svg>
  );
}
function IconFinancings() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-8 w-8 shrink-0 text-[color:var(--cobalt-light)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="18" height="12" rx="1.5" />
      <circle cx="12" cy="13" r="2.4" />
      <path d="M6 10.5v.01" />
      <path d="M18 15.5v.01" />
    </svg>
  );
}
function IconSecondaries() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-8 w-8 shrink-0 text-[color:var(--cobalt-light)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9h13l-3-3" />
      <path d="M20 15H7l3 3" />
    </svg>
  );
}
function IconRestructurings() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className="h-8 w-8 shrink-0 text-[color:var(--cobalt-light)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12a8 8 0 0 1-14 5.7" />
      <path d="M4 12a8 8 0 0 1 14-5.7" />
      <path d="m18 3 .3 3.3-3.3.3" />
      <path d="m6 21-.3-3.3 3.3-.3" />
    </svg>
  );
}

const SERVICES: Service[] = [
  {
    id: "fund-formations",
    title: "Fund formations",
    subtitle: "Formation through deployment.",
    detail:
      "We form venture funds and SPVs end to end: entity structuring, LPA and side-letter negotiation, GP economics, and the compliance groundwork to get to first close and deploy capital.",
    Icon: IconFund,
  },
  {
    id: "financings",
    title: "Financings",
    subtitle: "Priced rounds and debt.",
    detail:
      "Priced equity rounds, SAFEs and convertibles, and venture debt, from term sheet through closing. We draft and negotiate the full NVCA suite and model the cap table so clients know exactly what they are signing.",
    Icon: IconFinancings,
  },
  {
    id: "secondaries",
    title: "Secondaries",
    subtitle: "GP-led, LP, and direct.",
    detail:
      "GP-led, LP-led, and direct secondary transactions, tender offers, and continuation vehicles. We handle transfer mechanics, ROFRs, and pricing dynamics so both sides move with confidence.",
    Icon: IconSecondaries,
  },
  {
    id: "restructurings-exits",
    title: "Restructurings & Exits",
    subtitle: "Recaps, workouts, and exits.",
    detail:
      "Recapitalizations, down rounds, and workouts when a company needs to reset — plus exit transactions: strategic sales, secondary sales, continuation vehicles, and IPO-track work. We navigate preferred conversions, bridge financings, and stakeholder negotiations from restructuring through exit.",
    Icon: IconRestructurings,
  },
];

export default function WhatWeDo({ events }: { events: JudgmentEvent[] }) {
  const reduce = useReducedMotion();

  const leftIn: Variants = {
    hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -48 },
    show: { opacity: 1, x: 0 },
  };
  const rightIn: Variants = {
    hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : 48 },
    show: { opacity: 1, x: 0 },
  };
  const directional = (variants: Variants, delay = 0) => ({
    variants,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: reduce ? 0 : 0.75,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      id="what-we-do"
      aria-labelledby="what-h2"
      className="relative overflow-x-clip text-[color:var(--parchment)]"
    >
      {/* Dark navy background band — covers the text + only the UPPER portion
          of the photo carousel below. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 bottom-16 bg-[color:var(--navy-deep)] sm:bottom-24 lg:bottom-32"
      />

      <div className="relative z-10 mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-16 sm:px-10 sm:pt-32 sm:pb-24 lg:px-14">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14 sm:gap-x-10 md:gap-y-0">
          {/* LEFT — eyebrow + h2 + intro paragraph */}
          <motion.div
            {...directional(leftIn)}
            className="col-span-12 md:col-span-6"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[color:var(--cobalt-light)]">
              What We Do
            </p>
            <h2
              id="what-h2"
              className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5.6vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            >
              <span className="text-[color:var(--white)]">
                Counsel for{" "}
              </span>
              <span className="text-[color:var(--cobalt-light)]">
                everything venture.
              </span>
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-[color:var(--parchment)]">
              We are outside general counsel to venture funds, founders, and
              dealmakers building in high-growth markets. Clients come to us
              for counsel that is both commercially grounded and technically
              precise.
            </p>
          </motion.div>

          {/* RIGHT — accordion service list */}
          <motion.div
            {...directional(rightIn, 0.08)}
            className="col-span-12 md:col-span-6 md:pl-6"
          >
            <ServiceAccordion services={SERVICES} reduce={reduce} />
          </motion.div>
        </div>
      </div>

      {/* Event carousel — always renders. When Sanity is unpopulated,
          getJudgmentEvents() returns a single-event fallback so the
          band still shows substantive content (never an empty gap). */}
      <div className="relative mx-6 h-[clamp(20rem,52vh,34rem)] sm:mx-10 lg:mx-14">
        <JudgmentCarousel events={events} />
      </div>
    </section>
  );
}

function ServiceAccordion({
  services,
  reduce,
}: {
  services: Service[];
  reduce: boolean | null;
}) {
  // Single-open per revised a11y spec — only one panel visible at a time.
  const [openId, setOpenId] = useState<string | null>(null);
  const [autoCollapsedTitle, setAutoCollapsedTitle] = useState("");
  const uidBase = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Auto-collapse timer. Only runs when a panel is open, motion is enabled,
  // and the document is visible. Resets on user interaction with the OPEN
  // panel (mousemove/mouseenter/focusin/scroll intersect) or any keydown
  // inside the section.
  useEffect(() => {
    if (openId === null) return;
    if (reduce) return; // motion pref overlaps with cognitive/attention need
    if (typeof window === "undefined") return;

    const openTitle =
      services.find((s) => s.id === openId)?.title ?? "";
    const panel = panelRefs.current[openId];
    const section = containerRef.current;
    let timeoutId: number | undefined;

    const collapse = () => {
      // Focus guard — don't yank the panel from under a keyboard user.
      if (panel && panel.contains(document.activeElement)) {
        schedule();
        return;
      }
      // Tab hidden — don't collapse in a backgrounded tab.
      if (document.hidden) {
        schedule();
        return;
      }
      setOpenId(null);
      setAutoCollapsedTitle(openTitle);
    };

    const schedule = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(collapse, AUTO_COLLAPSE_MS);
    };

    schedule();

    const reset = () => schedule();

    // Panel-scoped interaction listeners.
    panel?.addEventListener("mousemove", reset);
    panel?.addEventListener("mouseenter", reset);
    panel?.addEventListener("focusin", reset);

    // Any keydown inside the section (section-wide keyboard = intent).
    section?.addEventListener("keydown", reset);

    // Reset while the open panel is intersecting the viewport during scroll.
    let scrollReset: (() => void) | null = null;
    if (panel && "IntersectionObserver" in window) {
      let inView = true;
      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(panel);
      scrollReset = () => {
        if (inView) reset();
      };
      window.addEventListener("scroll", scrollReset, { passive: true });
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
        panel?.removeEventListener("mousemove", reset);
        panel?.removeEventListener("mouseenter", reset);
        panel?.removeEventListener("focusin", reset);
        section?.removeEventListener("keydown", reset);
        if (scrollReset)
          window.removeEventListener("scroll", scrollReset);
        io.disconnect();
      };
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      panel?.removeEventListener("mousemove", reset);
      panel?.removeEventListener("mouseenter", reset);
      panel?.removeEventListener("focusin", reset);
      section?.removeEventListener("keydown", reset);
    };
  }, [openId, reduce, services]);

  return (
    <div
      ref={containerRef}
      className="border-t border-[color:var(--hairline-on-dark)]"
    >
      {/* Polite live region — announces auto-collapse only. Manual toggle
          is conveyed by aria-expanded state changes. */}
      <div className="sr-only" role="status" aria-live="polite">
        {autoCollapsedTitle
          ? `${autoCollapsedTitle} collapsed`
          : ""}
      </div>

      {services.map((svc) => {
        const isOpen = openId === svc.id;
        const triggerId = `${uidBase}-trigger-${svc.id}`;
        const panelId = `${uidBase}-panel-${svc.id}`;
        const { Icon } = svc;

        return (
          <div
            key={svc.id}
            className="border-b border-[color:var(--hairline-on-dark)]"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(svc.id)}
                className="group flex w-full items-start gap-4 py-6 text-left transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cobalt-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--navy-deep)]"
              >
                <span className="mt-[6px]">
                  <Icon />
                </span>
                <span className="flex-1">
                  <span className="block font-[family-name:var(--font-display)] text-[1.35rem] font-bold leading-tight tracking-[-0.01em] text-[color:var(--white)]">
                    {svc.title}
                  </span>
                  <span className="mt-1 block text-[15px] leading-snug text-[color:var(--parchment)]">
                    {svc.subtitle}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-[10px] shrink-0 transition-transform duration-300"
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transitionDuration: reduce ? "0ms" : undefined,
                  }}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-[color:var(--cobalt-light)]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false} mode="sync">
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  ref={(el) => {
                    panelRefs.current[svc.id] = el;
                  }}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={
                    reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
                  }
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    reduce ? { height: "auto", opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  transition={{
                    duration: reduce ? 0 : 0.35,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-lg pr-9 pb-6 pl-9 text-[15.5px] leading-relaxed text-[color:var(--parchment)]">
                    {svc.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
