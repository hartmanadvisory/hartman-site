import { defineField, defineType } from "sanity";

/**
 * "Judgment Event" — an entry in the Judgment at the Forefront carousel.
 * One document per EVENT, holding 1–4 photos that display together as a
 * mosaic on one slide. Deployed items are ordered by `order` (ascending),
 * then by date descending as a tiebreak, so the schedule can be curated
 * manually.
 *
 * The original schema had a single required `image`; it's kept below as a
 * hidden legacy field so existing documents render unchanged (the query
 * coalesces `photos` → `[image]`). No migration needed.
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
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Photo description (optional)",
              type: "string",
              description:
                "Only fill this in if the photo shows something the event name doesn't cover — e.g. a named speaker on stage. Most photos can leave it blank.",
              validation: (Rule) => Rule.max(120),
            },
          ],
        },
      ],
      description:
        "Add 1–4 photos of the event. Drag to reorder — the first photo gets the largest spot in the collage. On each photo, use the crop/hotspot tool (the circle) to mark the faces or action so they stay in frame.",
      validation: (Rule) => Rule.min(1).max(4),
    }),
    defineField({
      // Legacy single photo from before the photos array existed. Hidden in
      // the Studio; still read by the site for documents that predate the
      // change. Safe to ignore.
      name: "image",
      title: "Photograph (legacy)",
      type: "image",
      options: { hotspot: true },
      hidden: true,
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
    select: {
      title: "title",
      date: "date",
      photo0: "photos.0",
      legacy: "image",
    },
    prepare: ({ title, date, photo0, legacy }) => ({
      title,
      subtitle: date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : undefined,
      media: photo0 ?? legacy,
    }),
  },
});
