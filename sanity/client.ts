import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

/** Sanity image reference — narrow structural type covering asset shapes. */
type SanityImageRef = Parameters<
  ReturnType<typeof imageUrlBuilder>["image"]
>[0];

/**
 * Sanity client — server-side, cached via next-sanity's fetch-tag revalidation.
 * When sanityConfigured is false (no project id in env), we don't create a
 * client at all; callers fall through to the hardcoded stub data.
 */
export const sanityClient = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/** Build a CDN URL for a Sanity image reference. Falls back to empty string. */
export function urlFor(source: SanityImageRef): string {
  if (!builder) return "";
  return builder.image(source).auto("format").fit("max").url();
}
