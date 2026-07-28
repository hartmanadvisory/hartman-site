import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import AboutStats from "@/components/AboutStats";
import AboutTimeline from "@/components/AboutTimeline";
import { ABOUT_DESCRIPTION } from "@/lib/site";
import {
  getAboutHero,
  getAboutBackground,
  getAboutStats,
} from "@/sanity/queries";

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
  // Site name is appended by the root layout's title template.
  title: "About",
  // Was 281 characters, which Google cut off mid-sentence.
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [hero, stats, background] = await Promise.all([
    getAboutHero(),
    getAboutStats(),
    getAboutBackground(),
  ]);
  return (
    <>
      <AboutHero {...hero} />
      <AboutStats eyebrow={stats.eyebrow} stats={stats.stats} />
      <AboutTimeline
        heading={background.heading}
        lead={background.lead}
        bullets={background.bullets}
      />
    </>
  );
}
