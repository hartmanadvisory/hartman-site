import { defineField, defineType } from "sanity";
import { descriptiveLinkLabel } from "./validation";

/**
 * "Homepage — Who We Are" — the panel band with the short label, the serif
 * statement, and the button through to /about. A single settings-style
 * document (create ONE); blank fields keep the shipped default.
 *
 * The button's destination (/about) is fixed in code — only its wording is
 * editable here.
 */
export const homeWhoWeAre = defineType({
  name: "homeWhoWeAre",
  title: "Homepage — Who We Are",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label",
      type: "string",
      validation: (Rule) => Rule.max(60),
      description:
        'The short line to the left of the statement. Leave blank to keep the current default ("Who we are").',
    }),
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.max(400),
      description:
        "The large serif sentence. Leave blank to keep the current default.",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button text",
      type: "string",
      validation: (Rule) =>
        Rule.max(40).custom(descriptiveLinkLabel(["Contact", "Get in touch"])),
      description:
        'The wording on the button (it always goes to the About page). Leave blank to keep the current default ("About the Firm").',
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Homepage — Who We Are",
      subtitle: "Label, statement, and button text",
    }),
  },
});
