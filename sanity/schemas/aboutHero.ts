import { defineField, defineType } from "sanity";
import { descriptiveLinkLabel } from "./validation";

/**
 * "About — Hero" — the top of the /about page: label, name, intro, the
 * credential chips, the portrait, the button, and the caption under the
 * portrait. One settings-style document; blank fields keep the shipped
 * default (sanity/content-defaults.ts).
 */
export const aboutHero = defineType({
  name: "aboutHero",
  title: "About — Hero",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label",
      type: "string",
      validation: (Rule) => Rule.max(60),
      description:
        'The short line above the name. Leave blank to keep the current default ("Profile").',
    }),
    defineField({
      name: "name",
      title: "Name (page heading)",
      type: "string",
      validation: (Rule) => Rule.max(80),
      description:
        'The large heading. Leave blank to keep the current default ("Mordechai Hartman").',
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(400),
      description:
        "The paragraph under the name. Worth keeping the job title in here — it's the version screen readers announce. Leave blank to keep the current default.",
    }),
    defineField({
      name: "credentials",
      title: "Credential chips",
      type: "array",
      of: [{ type: "string", validation: (Rule) => Rule.max(70) }],
      validation: (Rule) => Rule.max(4),
      description:
        "The small outlined labels under the intro. Add or remove as needed; leave empty to keep the current two.",
    }),
    defineField({
      name: "portrait",
      title: "Portrait photo",
      type: "image",
      options: { hotspot: true },
      description:
        "The photograph. An upright/portrait image works best. Leave blank to keep the current one. This is decorative — the name and intro carry the meaning — so use a photo, not a graphic with text in it.",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button text",
      type: "string",
      validation: (Rule) =>
        Rule.max(40).custom(descriptiveLinkLabel(["About", "About the Firm"])),
      description:
        'The wording on the button (it always goes to the Contact page). Leave blank to keep the current default ("Start a Conversation").',
    }),
    defineField({
      name: "captionName",
      title: "Caption under photo — name",
      type: "string",
      validation: (Rule) => Rule.max(80),
      description: "Leave blank to keep the current default.",
    }),
    defineField({
      name: "captionRole",
      title: "Caption under photo — title",
      type: "string",
      validation: (Rule) => Rule.max(80),
      description:
        'Shown right after the caption name. Include the leading comma, e.g. ", Founder & Principal". Leave blank to keep the current default.',
    }),
  ],
  preview: {
    select: { media: "portrait", name: "name" },
    prepare: ({ media, name }: { media?: unknown; name?: string }) => ({
      title: "About — Hero",
      subtitle: name || "Using the built-in defaults",
      media: media as never,
    }),
  },
});
