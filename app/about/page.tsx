import type { Metadata } from "next";

export const metadata: Metadata = { title: "About — Hartman Venture Advisors" };

// Placeholder — the About page is deferred; the real build comes after the home
// page is approved. Kept so the nav "About" link resolves.
export default function AboutPage() {
  return (
    <section className="flex min-h-[70svh] items-center bg-[color:var(--ivory)] pt-[var(--nav-height)]">
      <div className="mx-auto w-full max-w-[var(--container)] px-6 sm:px-10">
        <p className="font-[family-name:var(--font-sans)] text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--gold-deep)]">
          About
        </p>
        <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.4rem)] font-normal leading-[1.1] text-[color:var(--ink)]">
          Coming soon.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--muted)]">
          The firm’s story and team are in progress.
        </p>
      </div>
    </section>
  );
}
