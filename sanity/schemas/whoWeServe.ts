import { defineField, defineType } from "sanity";

/**
 * "Who We Serve" — the homepage "Funds, Founders, and LPs shaping venture"
 * section. This is a single settings-style document (create ONE) holding
 * both the section's text and its three panel photographs.
 *
 * Every field is optional: any field left blank falls back to the copy /
 * image shipped with the site (see sanity/content-defaults.ts), so the
 * section is never broken by a missing value.
 *
 * The photos are decorative/editorial — the panel headings and text carry
 * the meaning — so there is intentionally no alt-text field. They render
 * cropped-to-fill (object-cover), so a tall/portrait-ish image reads best.
 */
export const whoWeServe = defineType({
  name: "whoWeServe",
  title: "Homepage — Who We Serve",
  type: "document",
  fieldsets: [
    { name: "header", title: "Section header", options: { collapsible: false } },
    { name: "panels", title: "Panels (text)", options: { collapsible: false } },
    { name: "photos", title: "Panel photos", options: { collapsible: true } },
  ],
  fields: [
    // — Section header —
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      fieldset: "header",
      description:
        'Small label above the heading. Leave blank to keep the current default ("Who We Serve").',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      fieldset: "header",
      description:
        'The large section heading. Leave blank to keep the current default ("Funds, Founders, and LPs shaping venture.").',
    }),

    // — Panel text —
    defineField({
      name: "fundsHeading",
      title: "Venture Funds — heading",
      type: "string",
      fieldset: "panels",
      description: "Leave blank to keep the current default.",
    }),
    defineField({
      name: "fundsBody",
      title: "Venture Funds — paragraph",
      type: "text",
      rows: 4,
      fieldset: "panels",
      description: "Leave blank to keep the current default.",
    }),
    defineField({
      name: "foundersHeading",
      title: "Founders & Category-Definers — heading",
      type: "string",
      fieldset: "panels",
      description: "Leave blank to keep the current default.",
    }),
    defineField({
      name: "foundersBody",
      title: "Founders & Category-Definers — paragraph",
      type: "text",
      rows: 4,
      fieldset: "panels",
      description: "Leave blank to keep the current default.",
    }),
    defineField({
      name: "lpsHeading",
      title: "Institutional LPs & Family Offices — heading",
      type: "string",
      fieldset: "panels",
      description: "Leave blank to keep the current default.",
    }),
    defineField({
      name: "lpsBody",
      title: "Institutional LPs & Family Offices — paragraph",
      type: "text",
      rows: 4,
      fieldset: "panels",
      description: "Leave blank to keep the current default.",
    }),

    // — Panel photos —
    defineField({
      name: "fundsImage",
      title: "Venture Funds — photo",
      type: "image",
      options: { hotspot: true },
      fieldset: "photos",
      description:
        "Top panel (Venture Funds). Leave blank to keep the current default image. Cropped to fill a tall frame — a vertical/portrait photo works best. Use an atmospheric photo only — no text, charts, or infographics (they’d be invisible to screen readers).",
    }),
    defineField({
      name: "foundersImage",
      title: "Founders & Category-Definers — photo",
      type: "image",
      options: { hotspot: true },
      fieldset: "photos",
      description:
        "Middle panel (Founders & Category-Definers). Leave blank to keep the current default image. Cropped to fill a tall frame — a vertical/portrait photo works best. Use an atmospheric photo only — no text, charts, or infographics (they’d be invisible to screen readers).",
    }),
    defineField({
      name: "lpsImage",
      title: "Institutional LPs & Family Offices — photo",
      type: "image",
      options: { hotspot: true },
      fieldset: "photos",
      description:
        "Bottom panel (Institutional LPs & Family Offices). Leave blank to keep the current default image. Cropped to fill a tall frame — a vertical/portrait photo works best. Use an atmospheric photo only — no text, charts, or infographics (they’d be invisible to screen readers).",
    }),
  ],
  preview: {
    select: { media: "fundsImage" },
    prepare: ({ media }) => ({
      title: "Who We Serve",
      subtitle: "Text + photos for the “shaping venture” section",
      media,
    }),
  },
});
