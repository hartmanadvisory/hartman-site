/**
 * Mosaic layout engine for the Judgment carousel.
 *
 * One carousel slide is one EVENT holding 1–4 photos, all shown at once
 * inside the section's fixed 3:2 frame. The frame is modeled as a 12×8
 * unit grid — 3:2 split into 12 columns × 8 rows makes every unit square,
 * so a cell spanning c columns × r rows has aspect ratio exactly c/r and
 * crop math stays exact.
 *
 * Photos are phone uploads with unpredictable orientations, so the layout
 * is chosen per event: a small set of hand-designed templates per photo
 * count, and the (template, photo→cell assignment) pair that loses the
 * least of the photos to object-cover cropping wins. Brute force is fine —
 * at most 4! permutations × 3 templates = 72 scores per event.
 *
 * Pure data + math, no imports: unit-testable in isolation and importable
 * from the client component (same rule as sanity/content-defaults.ts).
 */

export type MosaicCell = {
  /** 1-based CSS grid line. */
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
};

export type MosaicLayout = {
  cells: MosaicCell[];
  /** assignment[cellIndex] = photoIndex */
  assignment: number[];
};

/** Grid dimensions the cells are laid on (CSS repeat counts). */
export const MOSAIC_COLS = 12;
export const MOSAIC_ROWS = 8;

/** Aspect assumed for a photo whose metadata didn't arrive: 3:2 landscape. */
const DEFAULT_ASPECT = 1.5;

const cell = (
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number,
): MosaicCell => ({ col, row, colSpan, rowSpan });

/**
 * Hand-designed candidate templates, keyed by photo count. Every template
 * tiles the 12×8 frame exactly (verified by test). Order within a count
 * doesn't matter — scoring picks the winner — but the first is the one a
 * default all-landscape set tends to land on, which keeps output stable.
 */
const TEMPLATES: Record<number, MosaicCell[][]> = {
  1: [[cell(1, 1, 12, 8)]],
  2: [
    // Side by side — two portrait-ish cells (0.75 each).
    [cell(1, 1, 6, 8), cell(7, 1, 6, 8)],
    // Stacked — two wide cells (3.0 each); wins when both photos are landscape.
    [cell(1, 1, 12, 4), cell(1, 5, 12, 4)],
  ],
  3: [
    // Big left (1.0), two stacked right (1.0 each).
    [cell(1, 1, 8, 8), cell(9, 1, 4, 4), cell(9, 5, 4, 4)],
    // Three columns (0.5 each) — wins when all portrait.
    [cell(1, 1, 4, 8), cell(5, 1, 4, 8), cell(9, 1, 4, 8)],
    // Wide top (3.0), two bottom (1.5 each).
    [cell(1, 1, 12, 4), cell(1, 5, 6, 4), cell(7, 5, 6, 4)],
  ],
  4: [
    // 2×2 quad (1.5 each) — the safe default for mixed sets.
    [cell(1, 1, 6, 4), cell(7, 1, 6, 4), cell(1, 5, 6, 4), cell(7, 5, 6, 4)],
    // Tall left (0.75), wide top-right (1.5), two small bottom-right (0.75).
    [cell(1, 1, 6, 8), cell(7, 1, 6, 4), cell(7, 5, 3, 4), cell(10, 5, 3, 4)],
    // True portrait column (0.5) + wide top (2.0) + two squares — rescues a
    // 9:16 phone shot that the quad would crush to a third of its height.
    [cell(1, 1, 4, 8), cell(5, 1, 8, 4), cell(5, 5, 4, 4), cell(9, 5, 4, 4)],
    // Four columns (0.375 each) — photo-booth strip for a set of tall
    // 9:16 portraits; never competitive for landscape sets.
    [cell(1, 1, 3, 8), cell(4, 1, 3, 8), cell(7, 1, 3, 8), cell(10, 1, 3, 8)],
  ],
};

/**
 * SQUARED fraction of a photo lost to object-cover in a cell (0 = perfect
 * fit). Squared, not linear, on purpose: a linear sum happily sacrifices
 * one photo completely to give the others perfect cells (e.g. a portrait
 * crushed into a 3:1 strip, 73% gone, because two landscapes fit their
 * cells exactly). Squaring makes one terrible fit cost more than several
 * mild ones, so the pain spreads instead of concentrating.
 */
const cropLoss = (photoAspect: number, cellAspect: number): number => {
  const loss =
    1 -
    Math.min(photoAspect, cellAspect) / Math.max(photoAspect, cellAspect);
  return loss * loss;
};

/** All permutations of [0..n-1]; n ≤ 4 so at most 24. */
function permutations(n: number): number[][] {
  if (n === 1) return [[0]];
  const out: number[][] = [];
  for (const p of permutations(n - 1)) {
    for (let i = 0; i <= p.length; i++) {
      out.push([...p.slice(0, i), n - 1, ...p.slice(i)]);
    }
  }
  return out;
}

/**
 * Choose the template and photo→cell assignment for one event.
 *
 * Score = total squared crop loss, minus a small bonus when photo 0 (the author's
 * chosen lead — Studio hint says "the first photo gets the largest spot")
 * lands in the largest cell. The bonus is small enough that a genuinely
 * bad fit still overrides it, and it doubles as a deterministic
 * tie-breaker so the same input always yields the same layout.
 *
 * Photos beyond 4 are ignored (schema caps at 4; slice defensively).
 */
export function layoutEvent(
  aspects: readonly (number | undefined)[],
): MosaicLayout {
  const n = Math.max(1, Math.min(4, aspects.length));
  const a = Array.from(
    { length: n },
    (_, i) => aspects[i] ?? DEFAULT_ASPECT,
  );

  let best: MosaicLayout | null = null;
  let bestScore = Infinity;

  for (const cells of TEMPLATES[n]) {
    const areas = cells.map((c) => c.colSpan * c.rowSpan);
    const largest = Math.max(...areas);
    for (const perm of permutations(n)) {
      // perm[cellIndex] = photoIndex
      let score = 0;
      for (let ci = 0; ci < n; ci++) {
        score += cropLoss(a[perm[ci]], cells[ci].colSpan / cells[ci].rowSpan);
      }
      const leadIdx = perm.indexOf(0);
      if (areas[leadIdx] === largest) score -= 0.05;
      if (score < bestScore - 1e-9) {
        bestScore = score;
        best = { cells, assignment: perm };
      }
    }
  }
  // n >= 1 guarantees at least one candidate was scored.
  return best as MosaicLayout;
}
