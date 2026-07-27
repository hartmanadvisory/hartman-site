import { defineField, defineType } from "sanity";

/**
 * "Who We Serve — Images" — the three photographs in the homepage
 * "Funds, Founders, and LPs shaping venture" section. This is a single
 * settings-style document (create ONE): each field maps to one panel of
 * that section. Any field left blank falls back to the image shipped with
 * the site, so the section is never broken by a missing upload.
 *
 * The photos are decorative/editorial — the panel headings and text carry
 * the meaning — so there is intentionally no alt-text field. They render
 * cropped-to-fill (object-cover), so a tall/portrait-ish image reads best.
 */
export const whoWeServe = defineType({
  name: "whoWeServe",
  title: "Who We Serve — Images",
  type: "document",
  fields: [
    defineField({
      name: "fundsImage",
      title: "Venture Funds — photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Top panel (Venture Funds). Leave blank to keep the current default image. Cropped to fill a tall frame — a vertical/portrait photo works best. Use an atmospheric photo only — no text, charts, or infographics (they’d be invisible to screen readers).",
    }),
    defineField({
      name: "foundersImage",
      title: "Founders & Category-Definers — photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Middle panel (Founders & Category-Definers). Leave blank to keep the current default image. Cropped to fill a tall frame — a vertical/portrait photo works best. Use an atmospheric photo only — no text, charts, or infographics (they’d be invisible to screen readers).",
    }),
    defineField({
      name: "lpsImage",
      title: "Institutional LPs & Family Offices — photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Bottom panel (Institutional LPs & Family Offices). Leave blank to keep the current default image. Cropped to fill a tall frame — a vertical/portrait photo works best. Use an atmospheric photo only — no text, charts, or infographics (they’d be invisible to screen readers).",
    }),
  ],
  preview: {
    select: { media: "fundsImage" },
    prepare: ({ media }) => ({
      title: "Who We Serve — Images",
      subtitle: "The three photos in the “shaping venture” section",
      media,
    }),
  },
});
