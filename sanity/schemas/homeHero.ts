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

    /**
     * Photos. Deliberately NO "darken the photo" toggle: whether white
     * headline text stays readable over a given photo is a measurement, not
     * something an author can eyeball (a bright photo without the extra
     * darkening measures about 1.5:1 — white on near-white, invisible to
     * anyone with low vision, while still looking fine on the author's
     * laptop). So every uploaded photo gets the darkening automatically.
     */
    defineField({
      name: "desktopImages",
      title: "Background photos (desktop)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(5),
      description:
        "Wide photos that fade from one to the next behind the headline on computers. Add up to 5; add just one to stop the rotation. Leave empty to keep the current photos. These are decorative background images — no text, charts, or infographics, and there's no need to fill in the “alt text” box Sanity shows on an upload.",
    }),
    defineField({
      name: "mobileImage",
      title: "Background photo (phones)",
      type: "image",
      options: { hotspot: true },
      description:
        "The single photo shown behind the headline on phones (there is no rotation on phones). An upright/portrait photo works best. Leave blank to keep the current one.",
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
