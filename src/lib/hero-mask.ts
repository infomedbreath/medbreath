/**
 * The mask artwork from `public/mask1.svg`, inlined as stroke data so it can be
 * drawn rather than simply displayed.
 *
 * The source file is a flat, solid illustration: a single `<path>` with
 * `fill="#000000" stroke="none"`, wrapped in a `translate(0 512) scale(0.1 -0.1)`
 * group that flips the artwork upright. A filled path cannot be "drawn" — the
 * draw effect works on strokes — so the path is re-used as an outline, which
 * reads as a technical sketch and suits the rest of the hero.
 *
 * That one path holds 14 separate subpaths: an inner face, the mask body, the
 * head strap, the nose bridge, two eyes, the ear loop and so on. Each is pulled
 * out into its own element so it can be drawn on its own delay, staggered from
 * the largest outline to the smallest detail. Left joined into a single element
 * they would all share one dash value, which would have to match the longest
 * subpath (25 803 units) and leave the short ones finishing almost instantly.
 *
 * Splitting has to rewrite the moveto of every subpath after the first. Only the
 * first one is written with absolute coordinates in the source; the rest use
 * relative `m`, measured from wherever the previous subpath ended. Isolated in
 * their own element they would restart from the origin and land hundreds of
 * units away from where they belong, so `tracePath` re-emits each as an
 * absolute `M` at the position it actually resolves to.
 */

/**
 * The single `<path>` from public/mask1.svg, copied verbatim. Nothing here is
 * reformatted, so the drawing stays identical to the source file.
 */
const MASK_PATH_DATA =
  // Taken verbatim from public/mask1.svg. A script writes this in, so the path
  // data can never drift from the artwork file through a hand edit.
  `M1559 4818 c-238 -84 -506 -372 -686 -739 -115 -234 -167 -419 -167
     -594 0 -128 22 -200 77 -253 l33 -32 -14 -88 c-18 -114 -11 -382 13 -467 31
     -114 94 -224 171 -303 40 -40 75 -83 78 -96 14 -57 81 -106 144 -106 l29 0 5
     -118 c5 -92 11 -128 28 -164 20 -43 94 -128 112 -128 4 0 8 -31 8 -69 0 -54 5
     -75 23 -101 38 -57 68 -72 151 -78 87 -5 77 9 95 -134 16 -121 53 -244 111
     -367 164 -344 470 -576 870 -662 151 -33 430 -33 577 -1 511 111 855 433 969
     907 39 165 44 284 44 1181 l0 850 32 15 c45 20 70 59 76 121 3 35 13 64 30 85
     49 65 51 86 52 431 0 349 -3 372 -53 405 -22 14 -52 17 -180 17 -143 0 -156
     -2 -182 -22 -52 -41 -55 -61 -55 -390 0 -171 5 -322 11 -348 5 -24 26 -66 45
     -92 28 -39 34 -57 34 -97 0 -58 24 -94 75 -112 l35 -13 -1 -426 c0 -332 -3
     -421 -12 -407 -7 10 -30 46 -52 80 -119 184 -336 324 -558 358 -87 14 -250 6
     -332 -15 -33 -9 -107 -39 -165 -68 -94 -46 -116 -62 -206 -152 -89 -90 -106
     -113 -153 -207 -79 -160 -91 -234 -87 -534 4 -253 9 -291 60 -417 79 -194 248
     -363 448 -446 369 -153 814 -7 1014 333 14 25 27 45 28 45 7 0 -17 -125 -40
     -204 -85 -304 -289 -548 -574 -691 -471 -236 -1087 -152 -1458 198 -174 166
     -300 424 -327 672 -3 33 -8 70 -10 81 -4 20 0 22 71 26 83 6 113 21 152 78 16
     25 22 47 22 91 0 57 1 58 45 90 91 65 125 149 125 305 l0 91 41 7 c47 8 104
     57 114 99 4 14 40 60 80 101 117 118 180 269 194 461 7 97 -3 287 -17 353 -9
     38 -8 42 24 73 56 54 78 125 78 254 0 72 -6 138 -18 190 -63 273 -222 586
     -417 820 -233 278 -464 391 -660 323z m222 -78 c205 -63 461 -346 638 -703
     146 -296 196 -561 131 -702 l-23 -50 -18 65 c-146 501 -466 1005 -722 1137
     -117 60 -226 24 -377 -127 -228 -227 -443 -616 -558 -1010 l-19 -65 -24 50
     c-35 73 -33 231 4 367 125 458 473 934 756 1034 81 29 130 30 212 4z m-36
     -319 c227 -104 560 -636 685 -1095 26 -92 23 -96 -57 -96 -33 0 -57 -6 -67
     -16 -19 -19 -20 -25 -3 -49 12 -15 24 -17 90 -13 l76 5 7 -30 c3 -16 9 -74 13
     -129 17 -254 -34 -446 -153 -583 l-44 -50 -23 29 c-24 30 -74 56 -111 56 -17
     0 -32 15 -57 56 -36 60 -125 137 -178 155 l-33 11 0 124 c0 105 2 124 15 124
     32 0 114 51 149 92 57 66 71 127 71 308 0 135 -3 165 -23 230 -54 170 -178
     354 -295 434 -98 68 -195 59 -292 -25 -100 -88 -210 -261 -255 -404 -31 -96
     -39 -310 -16 -407 26 -112 71 -169 169 -213 l58 -27 -3 -116 -3 -115 -45 -25
     c-71 -39 -122 -85 -160 -145 -25 -41 -41 -56 -58 -57 -37 0 -87 -26 -111 -56
     l-23 -29 -44 50 c-55 63 -96 139 -126 235 -20 67 -23 94 -23 255 0 99 3 196 8
     216 l7 36 77 -5 c66 -4 78 -2 90 13 17 24 16 30 -3 49 -10 10 -34 16 -67 16
     -77 0 -81 5 -62 79 79 305 281 700 474 928 101 119 217 203 281 203 14 0 43
     -9 65 -19z m2583 -183 c9 -9 12 -95 12 -325 0 -413 0 -413 -154 -413 -84 0
     -95 2 -114 23 -13 13 -27 39 -32 58 -14 46 -13 625 0 650 10 17 22 19 143 19
     90 0 137 -4 145 -12z m-2572 -313 c23 -14 66 -54 96 -89 134 -163 201 -333
     201 -516 1 -170 -36 -264 -119 -306 -34 -16 -66 -19 -234 -22 -224 -4 -262 3
     -318 58 -53 51 -75 131 -75 270 1 152 47 299 136 430 87 127 172 200 235 200
     20 0 54 -11 78 -25z m2504 -526 c0 -42 -18 -59 -65 -59 -64 0 -75 7 -75 46 l0
     34 70 0 c64 0 70 -2 70 -21z m-2450 -626 c0 -76 4 -143 8 -150 4 -7 27 -19 50
     -27 24 -9 60 -28 80 -42 41 -31 97 -92 90 -99 -3 -3 -166 -4 -364 -3 l-359 3
     61 62 c42 42 75 66 104 74 64 19 70 34 70 186 l0 133 130 0 130 0 0 -137z
     m1790 -14 c165 -45 327 -163 420 -306 53 -81 97 -182 106 -245 l6 -43 -32 53
     c-17 29 -63 87 -102 128 -161 169 -358 254 -588 254 -128 0 -200 -12 -301 -51
     -170 -65 -316 -189 -413 -349 l-27 -45 6 35 c57 291 299 527 600 586 90 17
     228 10 325 -17z m35 -273 c219 -75 386 -237 464 -450 37 -102 38 -135 10 -219
     -40 -120 -88 -197 -184 -293 -76 -77 -105 -98 -185 -137 -131 -65 -200 -81
     -340 -81 -129 0 -200 16 -315 70 -190 89 -347 277 -399 477 -19 74 -6 132 61
     267 39 80 60 109 137 185 102 102 202 160 336 195 113 30 305 24 415 -14z
     m-1441 -137 c36 -28 36 -80 0 -108 -26 -21 -36 -21 -514 -21 -478 0 -488 0
     -514 21 -36 28 -36 80 0 108 26 21 36 21 514 21 478 0 488 0 514 -21z m-674
     -264 c0 -44 -4 -56 -20 -65 -44 -24 -64 -109 -38 -165 17 -37 57 -55 123 -55
     l55 0 0 -120 0 -120 -59 0 c-44 0 -65 5 -85 21 -24 19 -26 26 -26 100 0 65 -3
     82 -19 95 -87 72 -109 100 -120 152 -6 29 -11 89 -11 132 l0 80 100 0 100 0 0
     -55z m240 -25 l0 -81 35 -20 c19 -12 35 -28 35 -37 -1 -40 -12 -43 -156 -40
     l-139 3 -3 26 c-2 21 4 31 32 47 l36 21 0 81 0 80 80 0 80 0 0 -80z m298 -32
     c-3 -78 -10 -123 -21 -144 -19 -36 -76 -89 -107 -99 -28 -9 -40 -44 -40 -120
     0 -57 -3 -66 -26 -84 -20 -16 -41 -21 -85 -21 l-59 0 0 120 0 120 59 0 c69 0
     103 21 121 76 16 49 5 95 -30 129 -26 25 -30 36 -30 82 l0 53 111 0 112 0 -5
     -112z m671 -449 c185 -278 540 -413 871 -333 99 24 236 93 320 162 78 63 109
     98 172 191 41 61 47 54 22 -30 -70 -238 -277 -438 -524 -506 -100 -28 -292
     -25 -390 5 -274 86 -458 286 -525 567 -8 37 -8 37 54
     -56z`;

type Point = [number, number];
type TracedSubpath = { d: string; length: number };

/**
 * Split a path into one entry per subpath, measuring each as it goes.
 *
 * Curves are flattened to 120 straight segments. That is exact enough for
 * sizing a dash pattern — being a fraction of a unit out is invisible, whereas
 * being too short leaves a stroke on screen before its turn comes.
 *
 * Every subpath is emitted with an absolute moveto at the position the original
 * resolves to, so each one can be rendered on its own.
 *
 * Commands are read the way a browser reads them: a command consumes numbers
 * until the next letter, and that run of numbers is then split into groups of
 * its arity. "c" followed by twelve numbers is two cubics, not one cubic with
 * six numbers over. This artwork leans on that heavily — almost every curve is
 * written as an unbroken run — so reading a fixed six at a time would shear the
 * drawing.
 */
function tracePath(d: string): TracedSubpath[] {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens) return [];

  const out: TracedSubpath[] = [];

  let i = 0;
  let cur: Point = [0, 0];
  let start: Point = [0, 0];
  let total = 0;
  let ctrl: Point | null = null;

  // Tokens of the subpath currently being collected.
  let buffer: string[] = [];

  const round = (n: number) => {
    const r = Math.round(n * 100) / 100;
    return Object.is(r, -0) ? "0" : String(r);
  };

  /** Trace a cubic, adding its arc length to the running total. */
  const walkCubic = (b: Point, c: Point, e: Point) => {
    let px = cur[0];
    let py = cur[1];
    for (let s = 1; s <= 120; s++) {
      const t = s / 120;
      const w = 1 - t;
      const x = w * w * w * cur[0] + 3 * w * w * t * b[0] + 3 * w * t * t * c[0] + t * t * t * e[0];
      const y = w * w * w * cur[1] + 3 * w * w * t * b[1] + 3 * w * t * t * c[1] + t * t * t * e[1];
      total += Math.hypot(x - px, y - py);
      px = x;
      py = y;
    }
    cur = e;
  };

  const walkQuad = (c: Point, e: Point) => {
    let px = cur[0];
    let py = cur[1];
    for (let s = 1; s <= 120; s++) {
      const t = s / 120;
      const w = 1 - t;
      const x = w * w * cur[0] + 2 * w * t * c[0] + t * t * e[0];
      const y = w * w * cur[1] + 2 * w * t * c[1] + t * t * e[1];
      total += Math.hypot(x - px, y - py);
      px = x;
      py = y;
    }
    cur = e;
  };

  // How many numbers each command consumes per repetition. A command may be
  // repeated implicitly: "c" followed by twelve numbers is two cubics, not one
  // cubic with six extra values.
  const ARITY: Record<string, number> = {
    M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, Z: 0,
  };

  let droppedArgs = 0;

  while (i < tokens.length) {
    if (!/[a-zA-Z]/.test(tokens[i])) break;
    // The case is kept alongside the letter: SVG treats an uppercase command as
    // absolute and a lowercase one as relative, and the values re-emitted below
    // are still in whichever form the source used them.
    const raw = tokens[i++];
    const letter = raw.toUpperCase();
    const absolute = raw === letter;
    const arity = ARITY[letter];
    if (arity === undefined) break; // arcs and anything else: not handled

    // Gather every number up to the next command letter, so the whole run can be
    // grouped by arity below. Stopping at the letter also means a stray number
    // cannot swallow the command that follows it.
    const args: number[] = [];
    while (i < tokens.length && !/[a-zA-Z]/.test(tokens[i])) {
      const n = parseFloat(tokens[i++]);
      if (Number.isNaN(n)) {
        droppedArgs++;
        continue;
      }
      args.push(n);
    }

    const at = (x: number, y: number): Point =>
      absolute ? [x, y] : [cur[0] + x, cur[1] + y];

    if (letter === "Z") {
      total += Math.hypot(start[0] - cur[0], start[1] - cur[1]);
      cur = start;
      ctrl = null;
      buffer.push("z");
      continue;
    }

    // A trailing group too short to form a command is malformed input.
    const usable = args.length - (args.length % arity);
    if (usable < args.length) droppedArgs += args.length - usable;

    for (let k = 0; k < usable; k += arity) {
      if (letter === "M") {
        const p = at(args[k], args[k + 1]);

        // Whatever has been collected so far is a finished subpath.
        if (buffer.length > 0) {
          out.push({ d: buffer.join(" "), length: total });
          buffer = [];
        }
        // Lengths are per subpath, so the running total starts again here.
        total = 0;

        cur = p;
        start = p;
        ctrl = null;
        // Absolute, because this subpath no longer depends on the previous one.
        buffer = [`M${round(p[0])} ${round(p[1])}`];
      } else if (letter === "L") {
        const p = at(args[k], args[k + 1]);
        total += Math.hypot(p[0] - cur[0], p[1] - cur[1]);
        cur = p;
        ctrl = null;
        buffer.push(`${raw}${args[k]} ${args[k + 1]}`);
      } else if (letter === "H") {
        const x = absolute ? args[k] : cur[0] + args[k];
        total += Math.abs(x - cur[0]);
        cur = [x, cur[1]];
        ctrl = null;
        buffer.push(`${raw}${args[k]}`);
      } else if (letter === "V") {
        const y = absolute ? args[k] : cur[1] + args[k];
        total += Math.abs(y - cur[1]);
        cur = [cur[0], y];
        ctrl = null;
        buffer.push(`${raw}${args[k]}`);
      } else if (letter === "C") {
        const b = at(args[k], args[k + 1]);
        const c = at(args[k + 2], args[k + 3]);
        const e = at(args[k + 4], args[k + 5]);
        walkCubic(b, c, e);
        ctrl = c;
        buffer.push(`${raw}${args.slice(k, k + 6).join(" ")}`);
      } else if (letter === "S") {
        const b: Point = ctrl ? [2 * cur[0] - ctrl[0], 2 * cur[1] - ctrl[1]] : cur;
        const c = at(args[k], args[k + 1]);
        const e = at(args[k + 2], args[k + 3]);
        walkCubic(b, c, e);
        ctrl = c;
        buffer.push(`${raw}${args.slice(k, k + 4).join(" ")}`);
      } else if (letter === "Q") {
        const c = at(args[k], args[k + 1]);
        const e = at(args[k + 2], args[k + 3]);
        walkQuad(c, e);
        ctrl = null;
        buffer.push(`${raw}${args.slice(k, k + 4).join(" ")}`);
      } else if (letter === "T") {
        const c: Point = ctrl ? [2 * cur[0] - ctrl[0], 2 * cur[1] - ctrl[1]] : cur;
        const e = at(args[k], args[k + 1]);
        walkQuad(c, e);
        ctrl = null;
        buffer.push(`${raw}${args.slice(k, k + 2).join(" ")}`);
      }
    }
  }

  if (buffer.length > 0) {
    out.push({ d: buffer.join(" "), length: total });
  }

  if (droppedArgs > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `[hero-mask] ignored ${droppedArgs} malformed path value(s) from the source file, ` +
        "as a browser would. Check the artwork in public/mask1.svg.",
    );
  }

  return out;
}

export type MaskStroke = {
  d: string;
  /** Dash pattern, in the path's own user units. */
  dash: string;
  /** CSS animation-delay. */
  delay: string;
  /** CSS animation-duration. */
  duration: string;
  /** True for the large contours, which are drawn brighter and heavier. */
  major: boolean;
};

/**
 * Subpaths shorter than this (in user units) are drawn as fine accents rather
 * than primary outlines. At this artwork's 0.1 group scale, 600 units is about
 * 55px on screen, which cleanly separates the small details from the face and
 * mask outlines.
 */
const MAJOR_LENGTH = 600;
/** Gap between one subpath starting and the next. */
const STAGGER = 0.1;
/** Base time to trace any single subpath, plus a share for longer ones. */
const BASE_DURATION = 0.7;
const LENGTH_DIVISOR = 2400;
const MAX_DURATION = 2.1;

const TRACED = tracePath(MASK_PATH_DATA);

export const MASK_STROKES: MaskStroke[] = TRACED.map(({ d, length }, index) => {
  const major = length > MAJOR_LENGTH;
  const duration = Math.min(BASE_DURATION + length / LENGTH_DIVISOR, MAX_DURATION);

  // One extra unit of padding, so the stroke sits unambiguously inside the "gap"
  // half of the dash pattern while hidden.
  const dash = (length + 1).toFixed(1);

  return {
    d,
    dash,
    delay: `${(index * STAGGER).toFixed(2)}s`,
    duration: `${duration.toFixed(2)}s`,
    major,
  };
});