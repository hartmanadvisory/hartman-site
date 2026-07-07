import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — Hartman Venture Advisors" };

// Minimal placeholder — the real contact form comes later. Kept so the nav
// "Contact" link resolves.
export default function ContactPage() {
  return (
    <section className="flex min-h-[70svh] items-center bg-[color:var(--ivory)] pt-[var(--nav-height)]">
      <div className="mx-auto w-full max-w-[var(--container)] px-6 sm:px-10">
        <p className="font-[family-name:var(--font-sans)] text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--gold-deep)]">
          Contact
        </p>
        <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-serif)] text-[clamp(2rem,5vw,3.4rem)] font-normal leading-[1.1] text-[color:var(--ink)]">
          Start the conversation.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--muted)]">
          A full contact form is on the way. In the meantime, reach the firm at{" "}
          <a
            href="mailto:info@hartmanventureadvisors.com"
            className="font-medium text-[color:var(--gold-deep)] underline decoration-[color:var(--border-on-light)] underline-offset-4 hover:decoration-[color:var(--gold-deep)]"
          >
            info@hartmanventureadvisors.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
