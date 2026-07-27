import { defineField, defineType } from "sanity";
import { COMPANY_LOGOS } from "../content-defaults";

/**
 * "Homepage — Companies" — the logo wall. One settings-style document; blank
 * fields keep what's shipped with the site.
 *
 * Companies are PICKED from the logos bundled with the site rather than typed,
 * so the name shown to screen readers always matches the mark on screen. That
 * also means a brand-new company is a code change (add the SVG, add it to the
 * list in sanity/content-defaults.ts).
 */
const LOGO_OPTIONS = Object.entries(COMPANY_LOGOS)
  .map(([value, title]) => ({ title, value }))
  .sort((a, b) => a.title.localeCompare(b.title));

export const homePortfolio = defineType({
  name: "homePortfolio",
  title: "Homepage — Companies",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label",
      type: "string",
      validation: (Rule) => Rule.max(40),
      description:
        'The short label above the heading. Keep it to a couple of words — it\'s a label, not a place for extra information, which belongs in the heading below. Leave blank to keep the current default ("Selected Engagements").',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200),
      description:
        "The sentence above the logos. Leave blank to keep the current default.",
    }),
    defineField({
      name: "companies",
      title: "Companies",
      type: "array",
      of: [{ type: "string", options: { list: LOGO_OPTIONS } }],
      description:
        "Pick the companies to show, and drag to set the order. Only companies whose logo ships with the site can be listed — adding a new one is a developer change. Leave empty to keep the current list.",
    }),
  ],
  preview: {
    select: { companies: "companies" },
    prepare: ({ companies }: { companies?: unknown[] }) => ({
      title: "Homepage — Companies",
      subtitle: companies?.length
        ? `${companies.length} compan${companies.length === 1 ? "y" : "ies"}`
        : "Using the built-in list",
    }),
  },
});
