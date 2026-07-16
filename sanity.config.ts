import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { judgmentEvent } from "./sanity/schemas/judgmentEvent";
import { legalPage } from "./sanity/schemas/legalPage";
import { apiVersion, dataset, projectId } from "./sanity/env";

/**
 * Embedded Sanity Studio config. Mounted at /studio in the Next.js app.
 * Set NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET in .env.local
 * to point at a real project; without them the studio route errors gracefully.
 */
export default defineConfig({
  name: "hartman",
  title: "Hartman Venture Advisors",
  basePath: "/studio",
  projectId: projectId ?? "PLACEHOLDER",
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: [judgmentEvent, legalPage],
  },
});
