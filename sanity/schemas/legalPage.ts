import { defineField, defineType } from "sanity";

/**
 * "Legal Page" — one document per legal route (privacy, terms, disclosures).
 * The slug is a fixed enum so Mordechai (or counsel) can only edit copy, not
 * accidentally create a fourth page or rename an existing one.
 *
 * Route consumption: `app/legal/[slug]/page.tsx` queries by slug on request
 * and renders the `body` via @portabletext/react. If Sanity has no document
 * for a slug, the queries.ts fallback content is served instead.
 *
 * a11y note (accessibility-lead signed off):
 *  - Portable Text body may contain h2/h3 (h1 is reserved for the page
 *    title). If an author selects "h1" in the Studio, the renderer promotes
 *    it to <h2> to avoid multiple h1s per page.
 *  - Sanity's default block schema already allows strong/em/link marks +
 *    unordered/ordered lists; no further customization needed.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Page",
      type: "string",
      description:
        'Which legal route this document backs. Choose one of the three; the site expects exactly one document per slug.',
      options: {
        list: [
          { title: "Privacy Policy", value: "privacy" },
          { title: "Terms of Use", value: "terms" },
          { title: "Disclosures", value: "disclosures" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      description:
        'Shown as the <h1> at the top of the page and in the browser tab. E.g. "Privacy Policy".',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      description:
        "Displayed under the title as a <time datetime> element. Update whenever material terms change.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description:
        "Long-form legal copy. Use h2/h3 for section headings — h1 is reserved for the page title above.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.required().uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug", date: "lastUpdated" },
    prepare: ({ title, slug, date }) => ({
      title: title || slug,
      subtitle: date ? `Updated ${date}` : slug,
    }),
  },
});
