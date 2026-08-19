/**
 * Seed the four real judgment events (photos + documents) into a Sanity
 * dataset. Written for the event-mosaic rollout: run it against `staging`
 * to populate the PR-preview dataset, then against `production` after the
 * mosaic code has merged.
 *
 * Usage:
 *   SANITY_PROJECT_ID=<id> SANITY_DATASET=staging SANITY_TOKEN=<token> \
 *     node scripts/seed-judgment-events.mjs
 *
 * Idempotent: documents use fixed _ids and createOrReplace, and image
 * uploads are content-hashed by Sanity, so re-running is safe.
 */
import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { basename } from "node:path";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const token = process.env.SANITY_TOKEN;
if (!projectId || !dataset || !token) {
  console.error("Set SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-05-01",
  useCdn: false,
});

const DIR = "/Users/edenbolurian/Desktop/HARTMAN PHOTOS/Judgment Event Photos";

/** order → carousel position (asc). Dates real; day drives sorting only. */
const EVENTS = [
  {
    _id: "judgment-a16z-tech-week-nyc-2026",
    title: "a16z Tech Week NYC",
    date: "2026-05-01",
    order: 10,
    photos: [
      "a16z-techweekNYC-2026.jpeg",
      "a16z-techweekNYC2-2026.jpeg",
      "a16z-techweekNYC3-2026.jpeg",
    ],
  },
  {
    _id: "judgment-menlo-park-2025",
    title: "AI, Secondaries & IPOs · Menlo Park",
    date: "2025-11-06",
    order: 20,
    photos: ["menlopark.jpeg"],
  },
  {
    _id: "judgment-abu-dhabi-2026",
    title: "Elevation Securities x Hartman: Engineering Liquidity · Abu Dhabi",
    date: "2026-02-03",
    order: 30,
    photos: ["engineeringliquidityDubai.jpeg"],
  },
];

for (const ev of EVENTS) {
  const photoRefs = [];
  for (const file of ev.photos) {
    const path = `${DIR}/${file}`;
    process.stdout.write(`uploading ${file} ... `);
    const asset = await client.assets.upload("image", createReadStream(path), {
      filename: basename(path),
    });
    console.log(asset._id);
    photoRefs.push({
      _type: "image",
      _key: file.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24),
      asset: { _type: "reference", _ref: asset._id },
    });
  }
  const doc = {
    _id: ev._id,
    _type: "judgmentEvent",
    title: ev.title,
    date: ev.date,
    order: ev.order,
    photos: photoRefs,
  };
  await client.createOrReplace(doc);
  console.log(`created ${ev._id} (${photoRefs.length} photo${photoRefs.length > 1 ? "s" : ""})`);
}

const count = await client.fetch('count(*[_type == "judgmentEvent"])');
console.log(`done — dataset "${dataset}" now has ${count} judgmentEvent docs`);
