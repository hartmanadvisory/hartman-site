import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutStats from "@/components/AboutStats";
import AboutTimeline from "@/components/AboutTimeline";

/**
 * /about — the firm's origin story. PR #10 restructure:
 *
 *   AboutHero → AboutStats → Background (Timeline)
 *
 * The "What Sets Us Apart" cards were removed site-wide. Judgment
 * carousel stays on the homepage inside WhatWeDo. ClosingCTA remains
 * on the homepage only.
 */
export const metadata: Metadata = {
  title: "About — Hartman Venture Advisors",
  description:
    "Hartman Venture Advisors is a boutique New York counsel practice founded by Mordechai Hartman in May 2024 after more than a decade at Gunderson Dettmer and Lowenstein Sandler. The firm advises venture funds, founders, and institutional LPs on their most consequential transactions.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutTimeline />
    </>
  );
}
