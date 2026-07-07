import Link from "next/link";

/**
 * Home hero — full-bleed cinematic band. The "media" is a PLACEHOLDER layered
 * navy gradient (decorative, no alt) until a real photo/video is wired; the
 * darkest stop sits under the lower-left copy so the text clears 4.5:1
 * (parchment 11:1 / gold-text 6:1 on navy). Serif two-tone <h1> (the single
 * page h1) with a weight cue on the gold emphasis (not colour alone). Always
 * dark → `.on-dark`. Static (no autoplay) → no 2.2.2 control needed.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="on-dark relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-[color:var(--navy)]"
    >
      {/* Placeholder cinematic media — layered gradient (swap for real media). */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 55%, #223054 100%)",
          }}
        />
        {/* soft light from upper-right (window glow) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 82% 18%, rgba(199,154,82,0.14), transparent 60%)",
          }}
        />
        {/* lower-left scrim — guarantees text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(15,22,38,0.82) 0%, rgba(15,22,38,0.35) 34%, transparent 62%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(15,22,38,0.72) 0%, rgba(15,22,38,0.2) 42%, transparent 66%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[var(--container)] px-6 pb-24 pt-[calc(var(--nav-height)+3rem)] sm:px-10 md:pb-32">
        <div className="max-w-3xl">
          <p className="mb-7 font-[family-name:var(--font-sans)] text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--gold-text)]">
            Hartman Venture Advisors
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-[clamp(2.4rem,6vw,4.6rem)] font-normal leading-[1.06] tracking-[-0.01em] text-[color:var(--parchment)]">
            Precision counsel for the{" "}
            <span className="font-semibold text-[color:var(--gold-text)]">
              defining deals
            </span>{" "}
            in venture.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--parchment-dim)]">
            A boutique New York practice for late-stage venture transactions —
            financings, fund formation, secondaries, and exits.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-2 border border-[color:var(--gold-text)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--gold-text)] transition-colors duration-300 hover:bg-[color:var(--gold-text)] hover:text-[color:var(--navy-deep)]"
          >
            Get in touch
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
