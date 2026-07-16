# Sanity Studio — content editing guide

This is the day-to-day guide for editing the two pieces of content on
hartmanadvisory.com that live in Sanity CMS: the three legal pages
(Privacy, Terms, Disclosures) and the Judgment at the Forefront event
carousel on the homepage. Everything else on the site is code —
copy changes for those are code changes.

If you can log into Gmail, you can edit these.

---

## 1. Access

### Where the Studio lives

- **Preview URL** (pre-domain-cutover): `https://hartman-site.vercel.app/studio`
- **Production URL** (once `hartmanadvisory.com` points at Vercel):
  `https://hartmanadvisory.com/studio`

It's the same Studio at both URLs — same records, same login.

### Logging in

Open the URL. Sanity gives you three ways to sign in:

1. **Google** — pick the account you were invited under.
2. **GitHub** — pick the account you were invited under.
3. **Email + password** — Sanity emails a magic link.

If you land on "You need permission" — you weren't added to the
project yet. Ping Eden; he adds members at
`https://www.sanity.io/manage` → project → **Members** →
**Invite by email**.

### Project settings (Eden-only)

Vercel production has three env vars pointing at the Sanity project:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (should be `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (currently `2024-05-01`)

You can see the project ID in Vercel dashboard → project →
Settings → Environment Variables. It matches the project ID at
`https://www.sanity.io/manage`.

---

## 2. Authoring a Legal Page

The site expects **exactly one document per legal slug**. There are
three slugs: `privacy`, `terms`, `disclosures`. Never create two
documents with the same slug — only the newest will render, and it
gets confusing.

### Steps

1. In the Studio sidebar, click **Legal Page** → **New document**.
2. Fill in the fields:

   | Field          | What it is                                                      |
   | -------------- | --------------------------------------------------------------- |
   | **Page**       | Radio button. Choose Privacy Policy / Terms of Use / Disclosures — one per doc. |
   | **Page title** | The `<h1>` at the top of the page and the browser tab title. Usually the same words as the Page picker ("Privacy Policy", "Terms of Use", "Disclosures"). |
   | **Last updated** | Date. Shows to visitors as "Last updated: July 13, 2026." Update this whenever material terms change. |
   | **Body**       | The actual legal text. Use headings (H2, H3), paragraphs, bullet lists, bold, italic, and links as you would in Google Docs. |

3. **Writing the body**: click the "+" or start typing. Toolbar
   options along the top of the editor let you toggle heading
   level, bold, italic, list bullets, etc.

4. **To add a link** (email or web): highlight the text you want
   to link → click the **link icon** in the toolbar → paste the
   URL (`mailto:mhartman@hartmanadvisory.com` or `https://…`).
   The link mark saves correctly and renders as a real
   underlined anchor on the site.

5. **Preview**: the Studio has a Preview tab that shows a rough
   layout. Real formatting is on the live site.

6. **Publish**: click the **Publish** button (top right). It
   turns green when the save is committed.

7. Site cache is 5 minutes. New content appears at
   `https://…/legal/privacy` (or `/terms` or `/disclosures`)
   within 5 minutes, or immediately after any Vercel redeploy.

### What if I want to overwrite existing legal text?

Open the existing document by its title in the Legal Page list,
edit the Body field, bump the Last updated date, and re-publish.
Don't create a new document — Sanity will end up with duplicates
that render inconsistently.

### The current fallback text

If Sanity has no Legal Page document for a slug, the site falls
back to conservative baseline text hardcoded in
`sanity/queries.ts`. That text is a starting point only —
counsel-approved copy should replace it before public launch.

---

## 3. Authoring a Judgment Event

Each event becomes one slide in the carousel on the homepage,
inside the "What We Do" band. The carousel shows one at a time
and auto-advances.

### Steps

1. Sidebar → **Judgment Event** → **New document**.
2. Fill in the fields:

   | Field           | What it is                                                                  |
   | --------------- | --------------------------------------------------------------------------- |
   | **Event name**  | Short title, ≤ 80 chars. E.g. "a16z Tech Week NYC · Fireside". Primary caption. |
   | **Event date**  | Date. The **month and year** display to visitors; the specific day sorts multiple events on the same month. |
   | **Photograph**  | Landscape photo. Sanity's hotspot picker lets you drag a dot to the subject's face — the crop will stay on that point as the image resizes across breakpoints. |
   | **Sub-caption** | Optional single line, ≤ 120 chars. Appears under the event name. Leave blank to just show the formatted date. |
   | **Sort order**  | Number. Lower = earlier in the carousel. Leave blank to fall back to date-descending. |

3. **Image sourcing**:
   - Landscape orientation (3:2 or 16:9).
   - At least 1600px wide. Sanity's image pipeline downscales.
   - Hotspot the subject's face — the crop follows the hotspot.

4. Click **Publish**.

5. Site cache is 5 min. New/edited events appear on the homepage
   carousel after that window.

### How the carousel picks order

- Primary sort: `Sort order` ascending (lower first).
- Tiebreak: `Event date` descending (newest first).
- So a curator can pin an event to the front by giving it a low
  sort order (e.g., 10 or 20), or leave everything blank and let
  the newest event lead.

### The current fallback

If Sanity has no Judgment Event documents, the site falls back to
a single event ("a16z Tech Week NYC" using a preloaded photograph)
so the carousel band is never empty. Once you publish any real
event, the fallback disappears automatically.

---

## 4. What happens after Publish

- Sanity persists the change immediately.
- The site caches Sanity data for **5 minutes**. New content
  appears on the next request after that window.
- To force an immediate refresh: trigger any Vercel redeploy (any
  push to `main` works; Vercel does this automatically).
- **Optional future improvement**: a Sanity webhook could invalidate
  the cache instantly on publish — deferred to a future PR.

---

## 5. Common gotchas

- **Duplicate legal pages**: Only ONE document per Page slug. If
  you accidentally create two Privacy Policy documents, they both
  exist in Sanity but only one renders. Delete the extra from the
  Manage view.
- **Judgment event without image**: Sanity blocks Publish until
  you upload an image. Save as Draft is fine.
- **Missing "Publish" button click**: If your changes don't appear
  after 5 minutes, open the document again and check the top-right
  status — if it says "Draft" you haven't published yet.
- **Legal page body renders broken**: Very rare. Compare the DOM
  against the PortableText serializer at
  `app/legal/[slug]/page.tsx` — the editor UI produces the correct
  shape by default; a broken render means the schema changed under
  you (which requires a code deploy).

---

## Questions?

- Access issues: ask Eden.
- Content questions (what to write): Mordechai's call, with
  outside counsel for legal copy.
- Layout / styling requests (make the h1 bigger, change colors,
  restructure the page): those are code changes, not Sanity edits
  — file an issue on the repo.
