import Hero from "@/components/Hero";
import WhoWeAre from "@/components/WhoWeAre";
import WhatWeDo from "@/components/WhatWeDo";
import WhoWeServe from "@/components/WhoWeServe";
import ClosingCTA from "@/components/ClosingCTA";
import { getJudgmentEvents } from "@/sanity/queries";

// "Citadel for Hartman" rebuild. Movements land section by section, each gated
// on approval: Hero → Who We Are → What We Do → Who We Serve → Closing CTA →
// Footer (rendered globally in layout).
export default async function Home() {
  // Server-side fetch — falls through to the hardcoded FALLBACK_EVENTS when
  // Sanity isn't configured yet, so this render always has content.
  const judgmentEvents = await getJudgmentEvents();
  return (
    <>
      <Hero />
      <WhoWeAre />
      <WhatWeDo events={judgmentEvents} />
      <WhoWeServe />
      <ClosingCTA />
    </>
  );
}
