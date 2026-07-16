import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutStats from "@/components/AboutStats";
import AboutTimeline from "@/components/AboutTimeline";
import AboutPrinciples from "@/components/AboutPrinciples";
import ClosingCTA from "@/components/ClosingCTA";

/**
 * /about — the firm's origin story. Same design DNA as the homepage.
 *
 *   AboutHero → AboutStats → Background (Timeline) → Principles → Closing CTA
 *
 * Portfolio (logo wall) moved to the homepage between WhatWeDo and
 * WhoWeServe per the final-pass direction.
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
      <AboutPrinciples />
      <ClosingCTA />
    </>
  );
}
