import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

/**
 * POST /api/contact — handles the contact form on /contact.
 *
 * Flow:
 *   1. Parse JSON body, validate against ContactSchema (Zod).
 *   2. Reject honeypot fills (silent 200 so the bot doesn't learn).
 *   3. Rate limit by client IP (3 posts / 60s per IP).
 *   4. Send via Resend using the configured verified sender; reply-to
 *      is set to the visitor's email so Mordechai can hit reply.
 *
 * Pre-domain fallback: FROM defaults to onboarding@resend.dev (Resend's
 * sandbox sender) so previews/local testing work with just a dev API
 * key. Production sets RESEND_FROM_EMAIL=contact@hartmanadvisory.com.
 */

export const runtime = "nodejs";

const INQUIRY_TYPES = [
  "Financing",
  "Fund formation",
  "Secondary transaction",
  "Exit or strategic sale",
  "LP matter",
  "Other confidential inquiry",
] as const;

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  firm: z.string().trim().max(120).optional().default(""),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z.string().trim().min(10).max(4000),
  // Honeypot — must be empty. Bots fill it.
  website: z.string().max(0).optional().default(""),
});

const FROM_FALLBACK = "onboarding@resend.dev";
const TO_FALLBACK = "mhartman@hartmanadvisory.com";

/* -------------------------------------------------------------- */
/* Rate limiter: in-memory Map keyed by IP. Fine for single-region
   Vercel serverless. Swap for Upstash Redis in PR #8 for real scale. */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 3;
const rateBucket = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateBucket.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );
  if (timestamps.length >= RATE_MAX) return true;
  timestamps.push(now);
  rateBucket.set(ip, timestamps);
  return false;
}

/* -------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    // If it failed because the honeypot was filled, silent 200 so the
    // bot doesn't learn the field is guarded.
    const honeypotFilled = parsed.error.issues.some(
      (i) => i.path[0] === "website",
    );
    if (honeypotFilled) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { ok: false, error: "validation" },
      { status: 400 },
    );
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "unconfigured" },
      { status: 500 },
    );
  }

  const from = process.env.RESEND_FROM_EMAIL ?? FROM_FALLBACK;
  const to = process.env.CONTACT_TO_EMAIL ?? TO_FALLBACK;

  const { name, email, firm, inquiryType, message } = parsed.data;
  const subject = `New inquiry — ${inquiryType} — ${name}`;
  const textBody = [
    `New contact form inquiry`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    firm ? `Company / Fund: ${firm}` : `Company / Fund: —`,
    `Inquiry Type: ${inquiryType}`,
    ``,
    `Transaction Context:`,
    message,
  ].join("\n");
  const htmlBody = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:#14284d;">
      <h2 style="font-size:16px;margin:0 0 12px;">New contact form inquiry</h2>
      <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 6px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 6px;"><strong>Company / Fund:</strong> ${firm ? escapeHtml(firm) : "&mdash;"}</p>
      <p style="margin:0 0 12px;"><strong>Inquiry Type:</strong> ${escapeHtml(inquiryType)}</p>
      <p style="margin:0 0 4px;"><strong>Transaction Context:</strong></p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return NextResponse.json(
      { ok: false, error: "unexpected" },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
