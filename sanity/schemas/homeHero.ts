import { defineField, defineType } from "sanity";

/**
 * "Homepage — Hero" — the opening headline and the caption line beneath it.
 * A single settings-style document (create ONE). Any field left blank falls
 * back to the copy shipped with the site (sanity/content-defaults.ts).
 *
 * The line/length caps are load-bearing, not style preferences: the hero's
 * dark scrims are hand-solved for a 3-line headline block, so a 4th line
 * would push white text past the scrim onto raw photograph (unreadable), and
 * an over-long line is clipped rather than wrapped.
 */
export const homeHero = defineType({
  name: "homeHero",
  title: "Homepage — Hero",
  type: "document",
  fields: [
    defineField({
      name: "headlineLines",
      title: "Headline (one line per row)",
      type: "array",
      of: [{ type: "string", validation: (Rule) => Rule.max(30) }],
      validation: (Rule) => Rule.max(3),
      description:
        "The big headline, typed out one line at a time. Maximum 3 lines, about 30 characters each — longer or more lines run off the dark shading and become unreadable over the photo. Leave empty to keep the current default.",
    }),
    defineField({
      name: "subtext",
      title: "Caption line",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(260),
      description:
        "The sentence in the blue block under the headline. Leave blank to keep the current default.",
    }),
  ],
  preview: {
    select: { lines: "headlineLines" },
    prepare: ({ lines }: { lines?: string[] }) => ({
      title: "Homepage — Hero",
      subtitle: lines?.length ? lines.join(" ") : "Using the built-in default",
    }),
  },
});
