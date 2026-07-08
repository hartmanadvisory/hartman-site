import { sanityClient, urlFor } from "./client";
import { sanityConfigured } from "./env";

export type JudgmentEvent = {
  id: string;
  title: string;
  date: string; // ISO
  caption?: string;
  imageUrl: string;
  imageAlt?: string;
};

/**
 * Hardcoded fallback used when Sanity isn't configured (local dev without
 * credentials, or pre-launch preview). Ships an event so the section always
 * has content on screen; real events replace this once the CMS is populated.
 */
const FALLBACK_EVENTS: JudgmentEvent[] = [
  {
    id: "fallback-1",
    title: "Tech Week NYC · Fireside",
    date: "2025-06-01",
    imageUrl: "/media/event-speaker-panel.jpg",
  },
  {
    id: "fallback-2",
    title: "LP Roundtable · Manhattan",
    date: "2025-04-15",
    imageUrl: "/media/event-conversation.jpg",
  },
  {
    id: "fallback-3",
    title: "Founder Dinner · Downtown",
    date: "2025-02-11",
    imageUrl: "/media/event-portrait.jpg",
  },
];

type RawEvent = {
  _id: string;
  title: string;
  date: string;
  caption?: string;
  image?: unknown;
};

const JUDGMENT_QUERY = `*[_type == "judgmentEvent"] | order(order asc, date desc) {
  _id,
  title,
  date,
  caption,
  image
}`;

/**
 * Fetch published judgment events. Runs on the server (RSC or server action);
 * cached with a 5-minute revalidation window and tagged so Sanity webhook
 * revalidation can bust it on publish.
 */
export async function getJudgmentEvents(): Promise<JudgmentEvent[]> {
  if (!sanityConfigured || !sanityClient) return FALLBACK_EVENTS;

  try {
    const rows = await sanityClient.fetch<RawEvent[]>(
      JUDGMENT_QUERY,
      {},
      { next: { revalidate: 300, tags: ["judgmentEvent"] } },
    );
    if (!rows?.length) return FALLBACK_EVENTS;

    return rows.map((row) => ({
      id: row._id,
      title: row.title,
      date: row.date,
      caption: row.caption,
      imageUrl: row.image ? urlFor(row.image) : "",
    }));
  } catch {
    return FALLBACK_EVENTS;
  }
}
