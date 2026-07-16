import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import WhatWeDo from "@/components/WhatWeDo";
import HomePortfolio from "@/components/HomePortfolio";
import WhoWeServe from "@/components/WhoWeServe";
import ClosingCTA from "@/components/ClosingCTA";
import { getJudgmentEvents } from "@/sanity/queries";

// "Citadel for Hartman" — final composition after content pass:
// Hero → WhoWeAre → WhatWeDo → HomePortfolio (logo wall) → WhoWeServe →
// ClosingCTA → Footer (rendered globally in layout).
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
