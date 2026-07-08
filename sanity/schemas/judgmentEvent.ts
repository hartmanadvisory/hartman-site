import { defineField, defineType } from "sanity";

/**
 * "Judgment Event" — an entry in the Judgment at the Forefront hero carousel.
 * One document per event: title, date, hero image, optional short caption.
 * Deployed items are ordered by `order` (ascending), then by date descending
 * as a tiebreak, so the schedule can be curated manually.
 */
export const judgmentEvent = defineType({
  name: "judgmentEvent",
  title: "Judgment Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event name",
      type: "string",
      description:
        'Short event title, e.g. "Tech Week NYC · Fireside". Shown as the primary caption line.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "date",
      title: "Event date",
      type: "date",
      description: "Month and year is what displays; day is used for sorting.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photograph",
      type: "image",
      options: { hotspot: true },
      description:
        "Landscape photo. Hotspot marks the subject so the crop stays on face/action across breakpoints.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Sub-caption (optional)",
      type: "string",
      description:
        "Optional single line that appears under the event name. Leave blank to only show the formatted date.",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description:
        "Lower = earlier in the carousel. Leave blank to fall back to date-desc.",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Manual order, then newest",
      name: "curated",
      by: [
        { field: "order", direction: "asc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", date: "date", media: "image" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : undefined,
      media,
    }),
  },
});
