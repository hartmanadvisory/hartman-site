/**
 * Sanity project env vars. If these are unset, the client falls back to a
 * hardcoded stub so the site still builds/renders without CMS credentials —
 * useful for local dev and preview builds. Set the vars in .env.local (see
 * .env.local.example) to activate the real Sanity data source.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || undefined;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-05-01";

/** True iff the app has enough env vars to query real Sanity data. */
export const sanityConfigured = Boolean(projectId);
