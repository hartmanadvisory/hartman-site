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

// mailto fallback still used on the success panel + error alert.
const CONTACT_EMAIL = "mhartman@hartmanadvisory.com";

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
  const [errorCode, setErrorCode] = useState("");
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
      // Read the server's error code so we can say something useful.
      // Previously this was never parsed, so a 400 (bad input) and a 429
      // (rate limited) both surfaced as one generic "something went
      // wrong" — which is exactly how a too-short message got reported
      // as a server failure.
      let code = "";
      try {
        const body = await res.json();
        code = typeof body?.error === "string" ? body.error : "";
      } catch {
        /* non-JSON response — fall through to the generic message */
      }
      setErrorCode(code);
      setStatus("error");
      setErrorAttempt((n) => n + 1);
    } catch {
      setErrorCode("network");
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
          business days.
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
          // Field-level describedby. aria-describedby on the <form> does
          // NOT inherit down to its controls, and a <form> without an
          // accessible name isn't exposed as a landmark — so the
          // disclaimer previously reached no one. Wire it here, on the
          // field where "don't send anything confidential" actually
          // matters, together with the length hint.
          aria-describedby="message-hint contact-disclaimer"
          placeholder="Transaction type, timing, parties, and any conflicts we should clear."
          className="mt-3 w-full resize-y border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg leading-relaxed text-[color:var(--ink)] outline-none transition-colors placeholder:text-[color:var(--muted)] focus:border-[color:var(--cobalt)]"
        />
        {/* Visible constraint hint (SC 3.3.2). The 10-character minimum
            was previously invisible until it failed — a user typing a
            short note got a generic server error with no explanation.
            Placeholders vanish on input, so this is a persistent
            sibling rather than placeholder text. */}
        <p
          id="message-hint"
          className="mt-3 text-[13px] leading-relaxed text-[color:var(--muted)]"
        >
          A sentence or two is plenty &mdash; 10 characters minimum.
        </p>
      </div>

      <div className="flex md:col-span-2 md:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cta-primary inline-flex min-h-[3.5rem] shrink-0 items-center justify-center bg-[color:var(--cobalt)] px-8 text-[15px] font-semibold tracking-[0.02em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e] focus-visible:bg-[#163a9e] disabled:opacity-70"
        >
          {isSubmitting ? "Sending…" : "Send Inquiry"}
        </button>
      </div>

      {/* Disclaimer — SC 3.3.2 (Labels or Instructions). Sits visually
          below the form (per PR #10). It used to be wired via
          aria-describedby on the <form> element, with a comment here
          claiming that made SR announce it on field focus. That was
          simply wrong: aria-describedby does not inherit from a <form>
          down to its controls, and a <form> with no accessible name
          isn't exposed as a landmark either — so this text reached no
          one. It's now referenced directly from the textarea's
          aria-describedby, the field where it actually matters. */}
      <p
        id="contact-disclaimer"
        className="md:col-span-2 border-l-2 border-[color:var(--rule-on-light)] pl-4 text-[13.5px] leading-relaxed text-[color:var(--muted)]"
      >
        Submitting this form does not create an attorney-client
        relationship. Please do not include confidential or
        time-sensitive information. An attorney-client relationship is
        established only upon execution of a written engagement letter.
      </p>

      {/* Error region — keyed by attempt count so React remounts on
          each failure, guaranteeing role="alert" fires. The message is
          now derived from the server's error code; previously every
          failure mode collapsed into one generic string, so a
          too-short message read as a server outage. */}
      {showError && (
        <div
          key={errorAttempt}
          role="alert"
          className="md:col-span-2 border-l-2 border-[color:var(--cobalt)] bg-[rgba(28,68,184,0.04)] px-4 py-3 text-[14.5px] leading-relaxed text-[color:var(--ink)]"
        >
          {errorCode === "rate_limited" ? (
            "Too many attempts in a row. Please wait a minute, then try again."
          ) : errorCode === "validation" || errorCode === "invalid_json" ? (
            "Something in the form didn't pass our checks — please confirm every required field is filled in and your message is at least a sentence."
          ) : (
            <>
              Something went wrong on our end. Please try again in a moment,
              or reach{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-[color:var(--cobalt)] underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              directly.
            </>
          )}
        </div>
      )}
    </form>
  );
}
