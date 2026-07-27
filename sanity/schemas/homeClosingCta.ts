import { defineField, defineType } from "sanity";
import { descriptiveLinkLabel } from "./validation";

/**
 * "Homepage — Closing CTA" — the dark band at the bottom of the homepage.
 * A single settings-style document (create ONE); blank fields keep the
 * shipped default.
 *
 * The button's destination (/contact) is fixed in code — only its wording is
 * editable here.
 */
export const homeClosingCta = defineType({
  name: "homeClosingCta",
  title: "Homepage — Closing CTA",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(120),
      description:
        'The large closing headline. Leave blank to keep the current default ("Bring us your defining deal.").',
    }),
    defineField({
      name: "body",
      title: "Supporting line",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(240),
      description:
        "The sentence beside the headline. Leave blank to keep the current default.",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button text",
      type: "string",
      validation: (Rule) =>
        Rule.max(40).custom(descriptiveLinkLabel(["About", "About the Firm"])),
      description:
        'The wording on the big button (it always goes to the Contact page). Leave blank to keep the current default ("Start a Conversation").',
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Homepage — Closing CTA",
      subtitle: "Heading, supporting line, and button text",
    }),
  },
});
