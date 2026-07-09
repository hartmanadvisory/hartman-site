"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutGallery — text-free candid photo grid. Panels, closings, dinners.
 * Purely atmospheric — no photo carries load-bearing information.
 *
 * a11y (accessibility-lead signed off):
 *  - Wrapper is a plain <div> (no <section>, no role) — all images are
 *    alt="" so the entire block is decorative. AT silently passes over it.
 *  - Every <Image> gets alt="" — decorative group, no per-photo semantics.
 *  - useReducedMotion → renders in place, no stagger.
 *
 *  Layout: top row 3 photos → middle row 1 wide photo → bottom row 2 photos.
 */

const TOP = [
  { src: "/gallery/gallery-1.jpg", aspect: "aspect-[3/4]" },
  { src: "/gallery/gallery-2.jpg", aspect: "aspect-[4/3]" },
  { src: "/gallery/gallery-3.jpg", aspect: "aspect-[3/4]" },
] as const;
const MIDDLE = { src: "/gallery/gallery-6.jpg", aspect: "aspect-[21/9]" };
const BOTTOM = [
  { src: "/gallery/gallery-4.jpg", aspect: "aspect-[4/3]" },
  { src: "/gallery/gallery-5.jpg", aspect: "aspect-[4/3]" },
] as const;

export default function AboutGallery() {
  const reduce = useReducedMotion();

  return (
    <div className="bg-[color:var(--panel)]">
      <div className="mx-auto w-full max-w-[var(--container)] px-6 pt-24 pb-24 sm:px-10 sm:pt-32 sm:pb-32 lg:px-14">
        <div className="grid grid-cols-6 gap-3 sm:gap-4">
          {/* Top row — 3 photos across */}
          {TOP.map((p, i) => (
            <GalleryTile
              key={p.src}
              src={p.src}
              aspect={p.aspect}
              className="col-span-2"
              reduce={reduce}
              delayIdx={i}
            />
          ))}

          {/* Middle — single wide anchor photo spanning full width */}
          <GalleryTile
            src={MIDDLE.src}
            aspect={MIDDLE.aspect}
            className="col-span-6"
            reduce={reduce}
            delayIdx={3}
          />

          {/* Bottom row — 2 photos */}
          {BOTTOM.map((p, i) => (
            <GalleryTile
              key={p.src}
              src={p.src}
              aspect={p.aspect}
              className="col-span-3"
              reduce={reduce}
              delayIdx={4 + i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryTile({
  src,
  aspect,
  className,
  reduce,
  delayIdx,
}: {
  src: string;
  aspect: string;
  className: string;
  reduce: boolean | null;
  delayIdx: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delayIdx * 0.08,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className={[
        "relative overflow-hidden bg-[color:var(--navy-deep)]",
        aspect,
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className="object-cover object-center"
      />
    </motion.div>
  );
}
