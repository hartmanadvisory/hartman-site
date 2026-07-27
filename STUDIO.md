# Sanity Studio — content editing guide

> New to the site? Start with **[OWNER_GUIDE.md](./OWNER_GUIDE.md)** — a
> plain-language overview of the accounts, content editing, and making
> changes with AI. This file is the detailed, technical companion.

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

## 3a. Editing the "Who We Serve" section (text + photos)

The homepage "Funds, Founders, and LPs shaping venture" section has a
header (eyebrow + heading) and three panels (Venture Funds, Founders &
Category-Definers, Institutional LPs & Family Offices), each with a
heading, a paragraph, and a photograph. All of it is editable from one
settings document, grouped into **Section header**, **Panels (text)**,
and **Panel photos**.

### Steps

1. Sidebar → **Who We Serve** → open the existing document, or **New
   document** if none exists yet (create only ONE).
2. Edit any field you want:
   - **Section header** — the eyebrow and the large heading.
   - **Panels (text)** — the heading + paragraph for each of the three
     panels.
   - **Panel photos** — a photo for each panel.
3. **Any field left blank keeps the built-in default** — change one
   field or all of them.
4. Click **Publish**. Changes appear within the 5-minute cache window.

### Image sourcing

- **Vertical / portrait orientation** reads best — each photo is cropped
  to fill a tall frame (`object-cover`), so wide landscape shots lose
  their sides.
- At least 1200px on the short edge. Sanity downscales.
- **Atmospheric/editorial photos only** — no text, charts, or
  infographics baked into the image. These photos are decorative (the
  panel heading and paragraph carry the meaning), so any text inside the
  image is invisible to screen readers.

### The current default

If the **Who We Serve** document doesn't exist, or a field is empty, the
site uses the copy and the three photos bundled in the code
(`/media/event-portrait.jpg`, `/media/event-conversation.jpg`,
`/media/event-clients.jpg`). Editing a field replaces just that field.

---

## 3b. Editing the homepage wording

Three more parts of the homepage have their own settings documents. Each
works the same way: open it, change what you want, **Publish**, and
**anything you leave blank keeps the wording shipped with the site**.

| Sidebar item | Controls |
| --- | --- |
| **Homepage — Hero** | The big opening headline, the sentence in the blue block under it, and the background photos |
| **Homepage — Who We Are** | The small label, the large serif statement, and the button wording |
| **Homepage — Closing CTA** | The closing headline, its supporting line, and the big button wording |

### Things the Studio will stop you from doing

- **The hero headline is capped at 3 lines of ~30 characters.** This is
  not a style rule — the dark shading behind the headline is sized for
  exactly that block. A 4th line (or a very long one) puts white text
  onto the bright part of the photo, where it can't be read.
- **Button wording must describe where the link goes.** "Click here",
  "Learn more", "Read more" and similar are rejected, because a screen
  reader user hearing only the button text would learn nothing about
  the destination. "About the Firm" is good.
- **Buttons keep their destinations.** The Who We Are button always goes
  to the About page and the closing button always goes to Contact —
  only the wording is editable.

### Hero background photos

In **Homepage — Hero** you can also replace the photographs: a list of
wide photos that fade into each other on computers, plus one photo for
phones. Add a single desktop photo to stop the rotation entirely. Leave
either field empty to keep the photos shipped with the site.

Every uploaded photo automatically gets dark shading behind the
headline. There is no switch for this on purpose — whether white text
stays readable over a given photo is a measurement, and a bright photo
without the shading is effectively white-on-white for anyone with low
vision, while still looking fine on your own screen.

---

## 3d. The company logo wall

**Homepage — Companies** controls the label, the heading, and which company
logos appear on the homepage.

1. Sidebar → **Homepage — Companies**.
2. Under **Companies**, pick companies from the dropdown and drag them into
   the order you want. Leave the list empty to keep the current one.
3. Click **Publish**.

You choose companies by **name** from a list, not by typing them. That's
deliberate: the company name is what a screen reader announces for the logo,
so picking from the list guarantees the name always matches the logo actually
shown. It also means **adding a brand-new company is a developer change** —
the logo file has to be added to the site first.

---

## 3c. Editing the About page

| Sidebar item | Controls |
| --- | --- |
| **About — Hero** | The "Profile" label, the name heading, the intro paragraph, the credential chips (add/remove), the portrait photo, the button wording, and the caption under the photo |
| **About — By the Numbers** | The three figures, plus each one's title and subtitle |
| **About — Background** | The heading, the subtitle, and the bullet list (add/remove/reorder) |

As everywhere else, anything left blank keeps the current wording.

**About the three figures.** Type them the way they should look —
`$6B+`, `100+`, `10`. The count-up animation reads the number out of
what you type, and the site works out how each figure should be read
aloud (`$6B+` is announced as "6 billion dollars or more", not "dollar
six B plus"). There's an optional "spoken version" box if a figure ever
needs something different.

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
