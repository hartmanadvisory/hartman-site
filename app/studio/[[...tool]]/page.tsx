"use client";

/**
 * Embedded Sanity Studio, served from /studio. Uses the shared sanity.config
 * so schema + basePath are always in sync. This is a client-only route (no
 * server render); we opt out of static generation via dynamic export below.
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
