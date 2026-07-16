import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

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

        {/* Right column — form only. Disclaimer moved INTO ContactForm
            (below the submit button) per PR #10; SC 3.3.2 is preserved
            via aria-describedby on the <form> pointing at the
            disclaimer's id. */}
        <div className="col-span-12 flex min-w-0 flex-col md:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
