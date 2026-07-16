"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ContactForm — client-side form for /contact. Wraps the original
 * mailto-form JSX and POSTs to /api/contact instead.
 *
 * a11y (accessibility-lead signed off):
 *  - Labels above inputs with htmlFor/id pairs, native required + type
 *    validation, autocomplete tokens (SC 1.3.5).
 *  - Disclaimer <p> lives above the form in page.tsx (SC 3.3.2 native).
 *  - aria-busy is on the <form> element (not the button) so SR announces
 *    the busy state; the button label swap ("Send Inquiry" → "Sending…")
 *    is the visible signal.
 *  - Error region conditionally renders + is keyed by attempt count so
 *    role="alert" fires reliably on repeated failures.
 *  - Success replaces the form with an <h2 tabIndex={-1}> that receives
 *    programmatic focus (SC 4.1.3). :focus-visible style keeps sighted
 *    keyboard users oriented.
 *  - Honeypot: hidden field inside display:none wrapper +
 *    aria-hidden="true" + tabIndex={-1} + autoComplete="off".
 *  - Values persist on error (SC 3.3.7); no CAPTCHA (SC 3.3.9).
 */

const CONTACT_EMAIL = "mhartman@hartmanadvisory.com";
const CONTACT_PHONE_DISPLAY = "+1 (617) 987-1512";
const CONTACT_PHONE_TEL = "+16179871512";

const inquiryTypes = [
  "Financing",
  "Fund formation",
  "Secondary transaction",
  "Exit or strategic sale",
  "LP matter",
  "Other confidential inquiry",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorAttempt, setErrorAttempt] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const successH2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") {
      successH2Ref.current?.focus();
    }
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          firm,
          inquiryType,
          message,
          website: honeypot,
        }),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setErrorAttempt((n) => n + 1);
    } catch {
      setStatus("error");
      setErrorAttempt((n) => n + 1);
    }
  }

  if (status === "success") {
    return (
      <div className="mt-2">
        <h2
          ref={successH2Ref}
          tabIndex={-1}
          className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.015em] text-[color:var(--ink)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--cobalt)]"
        >
          Thanks &mdash; we&rsquo;ll be in touch.
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-[color:var(--muted)]">
          Your inquiry is with Mordechai. Expect a reply within one to two
          business days. For anything time-sensitive, call{" "}
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="underline decoration-[color:var(--border-on-light)] underline-offset-4 transition-colors hover:text-[color:var(--gold-deep)]"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";
  const showError = status === "error";

  return (
    <form
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
      className="grid min-w-0 gap-x-8 gap-y-7 md:grid-cols-2"
      noValidate
    >
      {/* Honeypot — invisible to real users and to AT, visible to bots
          that parse raw HTML. */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-3 w-full border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--cobalt)]"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-3 w-full border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--cobalt)]"
        />
      </div>

      <div>
        <label
          htmlFor="firm"
          className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
        >
          Company or Fund
        </label>
        <input
          id="firm"
          name="firm"
          type="text"
          autoComplete="organization"
          value={firm}
          onChange={(e) => setFirm(e.target.value)}
          className="mt-3 w-full border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--cobalt)]"
        />
      </div>

      <div>
        <label
          htmlFor="inquiryType"
          className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
        >
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className="mt-3 w-full border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--cobalt)]"
        >
          <option value="" disabled>
            Select one
          </option>
          {inquiryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="message"
          className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
        >
          Transaction Context
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Transaction type, timing, parties, and any conflicts we should clear."
          className="mt-3 w-full resize-y border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg leading-relaxed text-[color:var(--ink)] outline-none transition-colors placeholder:text-[color:var(--muted)] focus:border-[color:var(--cobalt)]"
        />
      </div>

      <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
        {/* Direct contact fallbacks — same tap-target treatment as before. */}
        <address className="not-italic flex flex-col gap-6 text-sm font-medium text-[color:var(--muted)]">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block py-3 -my-3 underline decoration-[color:var(--border-on-light)] underline-offset-4 transition-colors hover:text-[color:var(--gold-deep)] hover:decoration-[color:var(--gold-deep)]"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="inline-block py-3 -my-3 underline decoration-[color:var(--border-on-light)] underline-offset-4 transition-colors hover:text-[color:var(--gold-deep)] hover:decoration-[color:var(--gold-deep)]"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
        </address>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-primary inline-flex min-h-[3.5rem] shrink-0 items-center justify-center bg-[color:var(--cobalt)] px-8 text-[15px] font-semibold tracking-[0.02em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e] focus-visible:bg-[#163a9e] disabled:opacity-70"
        >
          {isSubmitting ? "Sending…" : "Send Inquiry"}
        </button>
      </div>

      {/* Error region — keyed by attempt count so React remounts on
          each failure, guaranteeing role="alert" fires. */}
      {showError && (
        <div
          key={errorAttempt}
          role="alert"
          className="md:col-span-2 border-l-2 border-[color:var(--cobalt)] bg-[rgba(28,68,184,0.04)] px-4 py-3 text-[14.5px] leading-relaxed text-[color:var(--ink)]"
        >
          Something went wrong. Please try again in a moment, or reach{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline decoration-[color:var(--cobalt)] underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          directly.
        </div>
      )}
    </form>
  );
}
