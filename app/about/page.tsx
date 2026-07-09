import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import FounderStatement from "@/components/FounderStatement";
import AboutTimeline from "@/components/AboutTimeline";
import AboutPrinciples from "@/components/AboutPrinciples";
import AboutGallery from "@/components/AboutGallery";
import AboutPortfolio from "@/components/AboutPortfolio";
import ClosingCTA from "@/components/ClosingCTA";

/**
 * /about — the firm's origin story. Same design DNA as the homepage:
 * Inter display type, cobalt/navy palette, dark-light section rhythm,
 * framer-motion scroll-in reveals. Composition is a server component so
 * metadata works; each section is a client component that owns its motion.
 *
 *   Hero → Founder statement → Timeline → Principles → Closing CTA
 */
export const metadata: Metadata = {
  title: "About — Hartman Venture Advisors",
  description:
    "Hartman Venture Advisors is a boutique New York counsel practice founded by Mordechai Hartman after more than a decade at Gunderson Dettmer and Lowenstein Sandler. The firm advises venture funds, founders, and institutional LPs on their most consequential transactions.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <FounderStatement />
      <AboutTimeline />
      <AboutPrinciples />
      <AboutGallery />
      <AboutPortfolio />
      <ClosingCTA />
    </>
  );
}
