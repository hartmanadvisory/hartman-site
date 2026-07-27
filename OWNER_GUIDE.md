# Hartman Venture Advisors — Website Owner's Guide

_How to change what's on the site, make bigger edits with AI, and own
the accounts it runs on._

> A formatted Google Doc version of this guide is the one to hand to
> Mordechai. This markdown file is the durable, version-controlled
> source — keep the two in sync if you edit either.

## The 30-second version

Your site runs on four accounts working together: the **code** lives on
**GitHub**, **Vercel** turns that code into the live website
automatically, **Sanity** holds the content you can edit yourself, and
**Resend** delivers the messages people send through the contact form to
your inbox. You change something → the site updates on its own →
visitors see it.

**Where things stand today.** The site is live at
`hartman-site.vercel.app` and works end to end. It is currently showing
**starter / placeholder content** — the legal pages and the events on
the homepage are examples, not final. They stay that way until you
replace them (Section 2). Three things are still outstanding — see
Section 4.

---

## 1. Your accounts

These five logins are the digital keys to the whole website. Treat them
like the firm's bank login.

- **GitHub** — the **code**, the master copy of how the site looks and
  behaves. Log in at `github.com/hartmanadvisory/hartman-site`
- **Vercel** — **hosting**. Takes the GitHub code and publishes the live
  site; also stores secret keys (like the email key). Log in at
  `vercel.com`
- **Sanity** — **the content you can edit yourself**: the legal pages
  and the event carousel. Log in at `sanity.io/manage`, or the site's
  `/studio` page
- **Resend** — **email**. Delivers contact-form messages to your inbox.
  Log in at `resend.com`
- **Cloudflare (pending)** — the **domain**: points
  `hartmanadvisory.com` at the site. Not connected yet; access still
  needs to be located.

### Do these first

- **Get the passwords from Eden separately** — through a password
  manager or a secure channel. They are deliberately **not** written in
  this document.
- **Turn on two-factor authentication** on all four active accounts.
- **Confirm you are the "Owner"** (not just a member) on each, so you
  can never be locked out — even if someone else's access is removed.

---

## 2. Editing content yourself — Sanity

**What you can change without a developer:**

- The three legal pages (Privacy, Terms, Disclosures)
- The events in the homepage carousel
- The homepage **hero** headline, the line beneath it, and its background photos
- The homepage **"Who we are"** statement and its button wording
- The **"Funds, Founders, and LPs shaping venture"** text and photos
- The **closing** headline and button wording at the bottom of the page
- The whole **About page**: the profile (name, intro, credentials,
  portrait, button), the three figures, and the Background section

Everything else is part of the code, and needs the AI or a developer
(Section 3).

**Where:** go to `hartman-site.vercel.app/studio` and log in (Google,
GitHub, or email). This opens "Sanity Studio," a simple editor.

### To edit a legal page

1. In the sidebar, open **Legal Page** and pick the one you want (or
   create one and choose Privacy / Terms / Disclosures).
2. Edit the **Body** like a Google Doc — headings, bold, bullet lists,
   links.
3. Update the **Last updated** date.
4. Click **Publish** (top right). Your change is live within about 5
   minutes.

### To add or edit an event (homepage carousel)

1. Sidebar → **Judgment Event** → **New document**.
2. Fill in the event name, date, and a landscape photo. Caption and sort
   order are optional.
3. Click **Publish**.

### To change the homepage wording

1. Sidebar → **Homepage — Hero**, **Homepage — Who We Are**, or
   **Homepage — Closing CTA**.
2. Edit the wording you want. Anything left blank keeps the current
   text, so you can change one line and leave the rest alone.
3. Click **Publish**.

Two things the editor will refuse, on purpose: a hero headline longer
than 3 short lines (it would spill off the dark shading and become
unreadable over the photo), and vague button wording like "Click here"
(it tells a screen-reader user nothing about where the button goes).

### To edit the "shaping venture" section (text + photos)

1. Sidebar → **Who We Serve** → open it (or create it once).
2. Edit any field — the section heading, each panel's heading and
   paragraph, or each panel's photo. Anything you leave blank keeps the
   current built-in default.
3. Click **Publish**. For photos, use a vertical/portrait image — these
   are cropped to fill a tall frame.

**Important — right now, nothing has been entered in Sanity yet.** The
legal text you see on the site is a **conservative starter template** —
have it reviewed by counsel and replace it before you rely on it. The
event showing on the homepage is a placeholder too.

### Three things that trip people up

- **One document per legal page.** Don't create a second "Privacy" —
  edit the existing one.
- **"Publish" is what makes it live.** Saving a draft isn't enough; if a
  change doesn't appear, check the document still says "Draft" in the
  corner.
- **Events need a photo** before Sanity will let you publish them.

---

## 3. Bigger changes, with AI

**When you need this:** anything that isn't the legal pages or the
carousel — rewording the homepage, changing a color, adding a section.
You describe what you want in plain English and an AI assistant makes the
code change for you.

**Why this is safe.** The AI **never touches the live site directly.** It
proposes the change as a **Pull Request** — a suggested edit — on GitHub.
**You** review it and click **Merge**. Only then does Vercel publish it.
You are always the approver, and **every change is reversible** — Vercel
keeps every past version, so a bad change can be rolled back in two
clicks.

Two tools do this. Either works; pick whichever you're more comfortable
with.

### Option A — ChatGPT Codex (easiest)

All in your browser, nothing to install. Needs a paid ChatGPT plan.

1. Go to `chatgpt.com` and open **Codex**.
2. Connect your **GitHub** account.
3. Select **hartmanadvisory/hartman-site**.
4. Describe the change in plain English.
5. It opens a Pull Request → you review and **Merge**.

### Option B — Claude Code (most capable)

Runs on your computer or on the web. Needs a paid Claude plan; a little
more setup.

1. Use it on the web at `claude.ai/code`, or install the app.
2. Connect your **GitHub** account.
3. Point it at **hartmanadvisory/hartman-site**.
4. Describe the change in plain English.
5. Same flow: it opens a Pull Request → you **Merge**.

### Golden rules for working with the AI

- **Say what you want plainly** — "make the homepage headline say X,"
  not code.
- **Always let it open a Pull Request.** Never let it edit the `main`
  code directly.
- **Read its plain-English summary** before you merge.
- **When unsure, ask it to explain** what the change does.
- **Merging is what makes it live.** Until you merge, nothing changes.

---

## 4. What still needs doing

So nothing catches you off guard:

- **Connect the domain.** The site isn't at `hartmanadvisory.com` yet.
  That needs whoever controls the domain's DNS at **Cloudflare** to
  point it at Vercel. Finding that access is the main blocker.
- **Replace the legal text.** Have counsel review and finalize Privacy,
  Terms, and Disclosures, then enter them in Sanity (Section 2).
- **Add real events** to the homepage carousel — or leave the
  placeholder for now.
- **Contact-form "from" address.** Messages reach you now, but they send
  from a generic address until the domain's email records are added.
  This resolves automatically when the domain is connected.

---

## 5. Plain-English glossary and who to call

- **Repo** — short for "repository," the folder on GitHub that holds all
  the site's code.
- **Pull Request** — a proposed change to the code that you review
  before it goes live. Think "suggested edit."
- **Merge** — approving a Pull Request. This is the click that actually
  makes a change live.
- **Deploy** — Vercel publishing the latest code to the live site.
  Happens automatically after a merge.
- **Fallback** — the built-in placeholder content shown until you enter
  the real thing in Sanity.

**If you're stuck:** ask Eden first → then ask the AI assistant to
explain or fix → for anything bigger, a web developer can pick this up
from the GitHub repo.

---

_Internal owner's guide for Hartman Venture Advisors PLLC. Contains no
passwords; account credentials are provided separately. Reflects the
site's status as of the handoff._

**For the detailed content-editing mechanics, see
[STUDIO.md](./STUDIO.md).**
