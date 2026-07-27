import { defineField, defineType } from "sanity";

/**
 * "About — Background" — the two-column band on /about: heading, a short
 * lead paragraph, and the checkmark bullet list. One settings-style
 * document; blank fields keep the shipped default.
 */
export const aboutBackground = defineType({
  name: "aboutBackground",
  title: "About — Background",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.max(60),
      description:
        'The section heading. Leave blank to keep the current default ("Background").',
    }),
    defineField({
      name: "lead",
      title: "Subtitle",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(400),
      description:
        "The short paragraph under the heading. Leave blank to keep the current default.",
    }),
    defineField({
      name: "bullets",
      title: "Bullet points",
      type: "array",
      of: [{ type: "text", rows: 3, validation: (Rule) => Rule.max(400) }],
      validation: (Rule) => Rule.max(12),
      description:
        "One sentence per bullet. Drag to reorder; add or remove freely. Leave empty to keep the current list.",
    }),
  ],
  preview: {
    select: { bullets: "bullets" },
    prepare: ({ bullets }: { bullets?: unknown[] }) => ({
      title: "About — Background",
      subtitle: bullets?.length
        ? `${bullets.length} bullet${bullets.length === 1 ? "" : "s"}`
        : "Using the built-in defaults",
    }),
  },
});
