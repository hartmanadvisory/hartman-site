import type { Metadata } from "next";
import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import WhatWeDo from "@/components/WhatWeDo";
import HomePortfolio from "@/components/HomePortfolio";
import WhoWeServe from "@/components/WhoWeServe";
import ClosingCTA from "@/components/ClosingCTA";
import {
  getJudgmentEvents,
  getWhoWeServeImages,
  getWhoWeServeContent,
  getHomeHero,
  getHomeWhoWeAre,
  getHomeClosingCta,
  getHomePortfolio,
} from "@/sanity/queries";

// Title and description come from the root layout. Only the canonical is
// set here — it's declared per route rather than once at the root, because
// a root canonical is inherited by every page that doesn't override it,
// which would quietly point the whole site at the homepage.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Homepage composition:
// Hero → WhoWeAre → WhatWeDo (accordion + JudgmentCarousel) →
// HomePortfolio → WhoWeServe → ClosingCTA → Footer (global in layout).
export default async function Home() {
  const [
    judgmentEvents,
    whoWeServeImages,
    whoWeServeText,
    hero,
    whoWeAre,
    closingCta,
    portfolio,
  ] = await Promise.all([
    getJudgmentEvents(),
    getWhoWeServeImages(),
    getWhoWeServeContent(),
    getHomeHero(),
    getHomeWhoWeAre(),
    getHomeClosingCta(),
    getHomePortfolio(),
  ]);
  return (
    <>
      <Hero
        headlineLines={hero.headlineLines}
        subtext={hero.subtext}
        slides={hero.slides}
        mobileSrc={hero.mobileSrc}
      />
      <WhoWeAre
        eyebrow={whoWeAre.eyebrow}
        statement={whoWeAre.statement}
        ctaLabel={whoWeAre.ctaLabel}
      />
      <WhatWeDo events={judgmentEvents} />
      <HomePortfolio
        eyebrow={portfolio.eyebrow}
        heading={portfolio.heading}
        companies={portfolio.companies}
      />
      <WhoWeServe
        imageOverrides={whoWeServeImages}
        eyebrow={whoWeServeText.eyebrow}
        heading={whoWeServeText.heading}
        textOverrides={whoWeServeText.segments}
      />
      <ClosingCTA
        heading={closingCta.heading}
        body={closingCta.body}
        ctaLabel={closingCta.ctaLabel}
      />
    </>
  );
}
