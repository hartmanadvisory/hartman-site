import Image from "next/image";

/**
 * Home hero — Citadel-exact composition, for Hartman. Full-bleed cinematic
 * photo; large white SERIF <h1> overlaid TOP-LEFT (one gold emphasis line +
 * weight cue); at the bottom, a Citadel-style navy band (overlapping the photo)
 * holding the supporting statement.
 *
 * a11y (accessibility-lead): the photo is decorative (mood; the <h1> carries
 * meaning) → alt=""; a top+left scrim guarantees the white headline clears
 * 4.5:1 at every reflow position (not text-shadow); the supporting text sits on
 * SOLID navy (parchment ~11:1), with a fade strip blending the band into the
 * photo; single <h1>; `.on-dark` focus ring.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="on-dark relative flex min-h-[calc(100svh-var(--nav-height))] w-full flex-col overflow-hidden bg-[color:var(--navy)]"
    >
      <Image
        src="/hero/hero-1.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Scrim — a dark LEFT column (covers all three headline lines top→bottom,
          incl. the gold word, which needs a near-navy floor) + a top darken.
          Guarantees ≥4.5:1 white / ≥3:1 gold-text at every reflow position. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,22,38,0.88) 0%, rgba(15,22,38,0.66) 32%, rgba(15,22,38,0.2) 56%, transparent 74%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-56"
        style={{
          background: "linear-gradient(180deg, rgba(15,22,38,0.55), transparent)",
        }}
      />

      {/* Headline — top-left. */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--container)] px-6 pt-16 sm:px-10 md:pt-20">
        <h1 className="max-w-3xl font-[family-name:var(--font-serif)] text-[clamp(2.6rem,6.4vw,5rem)] font-normal leading-[1.04] tracking-[-0.005em] text-[color:var(--white)]">
          Precision Counsel
          <br />
          for Venture&rsquo;s
          <br />
          <span className="font-semibold text-[color:var(--gold-text)]">
            Defining Deals
          </span>
        </h1>
      </div>

      {/* Bottom band — overlaps the photo; text on SOLID navy. */}
      <div className="relative z-10 mt-auto">
        <div
          aria-hidden="true"
          className="h-20 bg-[linear-gradient(0deg,var(--navy-deep),transparent)]"
        />
        <div className="bg-[color:var(--navy-deep)]">
          <div className="mx-auto w-full max-w-[var(--container)] px-6 py-10 sm:px-10 md:py-12">
            <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--parchment)]">
              A boutique New York practice guiding venture funds, founders, and
              dealmakers through their most consequential transactions —
              financings, fund formation, secondaries, and exits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
