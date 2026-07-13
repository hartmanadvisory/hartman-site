import type { Metadata } from "next";

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
];

export const metadata: Metadata = {
  title: "Contact — Hartman Venture Advisors",
  description:
    "Contact Hartman Venture Advisors for confidential venture transaction inquiries.",
};

export default function ContactPage() {
  return (
    <section
      aria-labelledby="contact-h1"
      className="bg-[color:var(--white)] text-[color:var(--ink)]"
    >
      <div className="mx-auto grid min-h-[calc(100svh-var(--nav-height))] w-full max-w-[var(--container)] grid-cols-12 gap-x-6 gap-y-10 px-6 py-12 sm:gap-x-10 sm:px-10 sm:py-16 lg:px-14">
        <div className="col-span-12 flex min-w-0 flex-col justify-between border-b border-[color:var(--rule-on-white)] pb-10 md:col-span-5 md:border-b-0 md:border-r md:pb-0 md:pr-10">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[color:var(--gold-deep)]">
              Confidential Intake
            </p>
            <h1
              id="contact-h1"
              className="mt-6 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(2.75rem,4.2vw,4.35rem)] font-bold leading-[0.98] tracking-[-0.025em]"
            >
              Start the conversation.
            </h1>
          </div>

          <p className="mt-10 max-w-sm text-base leading-relaxed text-[color:var(--muted)]">
            Share the transaction context, timing, and parties involved. Do not
            include privileged information until an engagement is confirmed.
          </p>
        </div>

        {/* Right column — disclaimer + form share ONE grid cell so CSS
            grid doesn't place them in separate auto-rows (which was
            causing a huge vertical gap between them). Disclaimer stays
            visually and semantically BEFORE the form per a11y-lead so
            SC 3.3.2 is satisfied natively. */}
        <div className="col-span-12 flex min-w-0 flex-col md:col-span-7">
          <p className="mb-8 border-l-2 border-[color:var(--rule-on-light)] pl-4 text-[13.5px] leading-relaxed text-[color:var(--muted)]">
            Submitting this form does not create an attorney-client
            relationship. Please do not include confidential or
            time-sensitive information. An attorney-client relationship
            is established only upon execution of a written engagement
            letter.
          </p>

          <form
            action={`mailto:${CONTACT_EMAIL}`}
            method="post"
            encType="text/plain"
            className="grid min-w-0 gap-x-8 gap-y-7 md:grid-cols-2"
          >
          <div>
            <label
              htmlFor="name"
              className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
            >
              Name
            </label>
            <input
              id="name"
              name="Name"
              type="text"
              autoComplete="name"
              required
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
              name="Email"
              type="email"
              autoComplete="email"
              required
              className="mt-3 w-full border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--cobalt)]"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
            >
              Company or Fund
            </label>
            <input
              id="company"
              name="Company or Fund"
              type="text"
              autoComplete="organization"
              className="mt-3 w-full border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--cobalt)]"
            />
          </div>

          <div>
            <label
              htmlFor="inquiry"
              className="block text-[13px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink)]"
            >
              Inquiry Type
            </label>
            <select
              id="inquiry"
              name="Inquiry Type"
              defaultValue=""
              required
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
              name="Transaction Context"
              rows={5}
              required
              placeholder="Transaction type, timing, parties, and any conflicts we should clear."
              className="mt-3 w-full resize-y border-0 border-b border-[color:var(--rule-on-light)] bg-transparent px-0 py-3 text-lg leading-relaxed text-[color:var(--ink)] outline-none transition-colors placeholder:text-[color:var(--muted)] focus:border-[color:var(--cobalt)]"
            />
          </div>

          <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
            {/* Direct contact fallbacks — owner contact info, wrapped in
                <address> per a11y-lead. Two stacked <a>s (email + phone),
                not a <ul>: it's contact metadata, not a list of peers. */}
            <address className="not-italic flex flex-col gap-1 text-sm font-medium text-[color:var(--muted)]">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline decoration-[color:var(--border-on-light)] underline-offset-4 transition-colors hover:text-[color:var(--gold-deep)] hover:decoration-[color:var(--gold-deep)]"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="underline decoration-[color:var(--border-on-light)] underline-offset-4 transition-colors hover:text-[color:var(--gold-deep)] hover:decoration-[color:var(--gold-deep)]"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </address>
            <button
              type="submit"
              className="cta-primary inline-flex min-h-[3.5rem] shrink-0 items-center justify-center bg-[color:var(--cobalt)] px-8 text-[15px] font-semibold tracking-[0.02em] text-[color:var(--white)] transition-colors hover:bg-[#163a9e] focus-visible:bg-[#163a9e]"
            >
              Send Inquiry
            </button>
          </div>
          </form>
        </div>
      </div>
    </section>
  );
}
