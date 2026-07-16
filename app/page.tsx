import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import WhatWeDo from "@/components/WhatWeDo";
import HomePortfolio from "@/components/HomePortfolio";
import WhoWeServe from "@/components/WhoWeServe";
import ClosingCTA from "@/components/ClosingCTA";
import { getJudgmentEvents } from "@/sanity/queries";

// Homepage composition:
// Hero → WhoWeAre → WhatWeDo (accordion + JudgmentCarousel) →
// HomePortfolio → WhoWeServe → ClosingCTA → Footer (global in layout).
export default async function Home() {
  const judgmentEvents = await getJudgmentEvents();
  return (
    <>
      <Hero />
      <WhoWeAre />
      <WhatWeDo events={judgmentEvents} />
      <HomePortfolio />
      <WhoWeServe />
      <ClosingCTA />
    </>
  );
}
