import { defineField, defineType } from "sanity";

/**
 * "About — By the Numbers" — the three-figure stat wall on /about.
 * One settings-style document; blank fields keep the shipped default.
 *
 * Each figure counts up when it scrolls into view. The number to animate is
 * read out of the value you type ("$6B+" → counts to 6), so you can write
 * the figure the way it should look and the animation follows.
 */
export const aboutStats = defineType({
  name: "aboutStats",
  title: "About — By the Numbers",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label",
      type: "string",
      validation: (Rule) => Rule.max(60),
      description:
        'The label above the figures. Leave blank to keep the current default ("By the Numbers").',
    }),
    defineField({
      name: "stats",
      title: "The three figures",
      type: "array",
      validation: (Rule) => Rule.max(3),
      description:
        "Three boxes, left to right. Leave empty to keep the current three.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Figure",
              type: "string",
              validation: (Rule) => Rule.max(12),
              description:
                'How the number should look, e.g. "$6B+", "100+", "10".',
            }),
            defineField({
              name: "label",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.max(80),
              description: "The line under the figure.",
            }),
            defineField({
              name: "info",
              title: "Subtitle",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.max(240),
              description: "The smaller explanatory line.",
            }),
            defineField({
              name: "spoken",
              title: "Spoken version (optional)",
              type: "string",
              validation: (Rule) => Rule.max(120),
              description:
                'Only needed if the figure would be read aloud oddly. We already expand the common ones automatically — "$6B+" is read as "6 billion dollars or more". Fill this in to override that.',
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "About — By the Numbers",
      subtitle: "The three figures, their titles and subtitles",
    }),
  },
});
