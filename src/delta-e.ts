/**
 * Color difference (ΔE "Delta E") functions for perceptual color comparison.
 *
 * CIE = Commission Internationale de l'Éclairage (International Commission on Illumination),
 * the standards body behind CIE76, CIE94, and CIEDE2000 formulas.
 *
 * @see {@link https://en.wikipedia.org/wiki/Color_difference|Wikipedia}
 * @see {@link http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html|Bruce Lindbloom}
 */

import type { Lab, Oklab } from "./color";

/**
 * CIE76 color difference (ΔE*ab).
 *
 * Simple Euclidean distance in Lab color space.
 * Fast but not perceptually uniform for large differences.
 *
 * @param lab1 - First Lab color
 * @param lab2 - Second Lab color
 * @returns ΔE value (0 = identical, 1 ≈ JND "Just Noticeable Difference", 100 = max difference)
 * @see {@link https://en.wikipedia.org/wiki/Color_difference#CIE76|Wikipedia CIE76}
 */
export function deltaE76(lab1: Lab, lab2: Lab): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Euclidean color difference in Oklab color space.
 *
 * Simple and fast, with better perceptual uniformity than CIE76.
 * Oklab was designed so Euclidean distance correlates well with perception.
 *
 * @param oklab1 - First Oklab color
 * @param oklab2 - Second Oklab color
 * @returns ΔE value (0 = identical). Scale differs from CIE ΔE.
 * @see {@link https://bottosson.github.io/posts/oklab/|Oklab}
 */
export function deltaEOk(oklab1: Oklab, oklab2: Oklab): number {
  const dL = oklab1.l - oklab2.l;
  const da = oklab1.a - oklab2.a;
  const db = oklab1.b - oklab2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * CIE94 color difference (ΔE*94).
 *
 * Weighted formula that accounts for perceptual non-uniformity.
 * Better than CIE76, but superseded by CIEDE2000.
 *
 * Uses "graphic arts" weights by default (kL=1, K1=0.045, K2=0.015).
 * For textiles, use kL=2, K1=0.048, K2=0.014.
 *
 * @param lab1 - First Lab color (reference)
 * @param lab2 - Second Lab color (sample)
 * @param kL - Lightness weight (1 for graphics, 2 for textiles)
 * @param K1 - Chroma weight factor (0.045 graphics, 0.048 textiles)
 * @param K2 - Hue weight factor (0.015 graphics, 0.014 textiles)
 * @returns ΔE*94 value
 * @see {@link https://en.wikipedia.org/wiki/Color_difference#CIE94|Wikipedia CIE94}
 */
export function deltaE94(
  lab1: Lab,
  lab2: Lab,
  kL: number = 1,
  K1: number = 0.045,
  K2: number = 0.015
): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;

  const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
  const dC = C1 - C2;

  // dH² = da² + db² - dC²
  const dH2 = da * da + db * db - dC * dC;
  // Handle floating point errors that could make dH2 slightly negative
  const dH = Math.sqrt(Math.max(0, dH2));

  const SL = 1;
  const SC = 1 + K1 * C1;
  const SH = 1 + K2 * C1;

  const termL = dL / (kL * SL);
  const termC = dC / SC;
  const termH = dH / SH;

  return Math.sqrt(termL * termL + termC * termC + termH * termH);
}

/**
 * CIEDE2000 color difference (ΔE00).
 *
 * Industry standard for perceptual color difference.
 * Most accurate but computationally expensive.
 * Corrects for perceptual non-uniformity, especially in blue region.
 *
 * Uses three scale factors to weight differences:
 * - **SL** (Lightness): Reduces sensitivity in dark/light regions
 * - **SC** (Chroma): Scales with color saturation
 * - **SH** (Hue): Accounts for hue-dependent perception
 *
 * @param lab1 - First Lab color (reference)
 * @param lab2 - Second Lab color (sample)
 * @param kL - Lightness weight (default 1)
 * @param kC - Chroma weight (default 1)
 * @param kH - Hue weight (default 1)
 * @returns ΔE00 value (0 = identical, 1 ≈ JND "Just Noticeable Difference")
 * @see {@link http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html|Bruce Lindbloom}
 * @see {@link https://en.wikipedia.org/wiki/Color_difference#CIEDE2000|Wikipedia CIEDE2000}
 */
export function deltaE2000(
  lab1: Lab,
  lab2: Lab,
  kL: number = 1,
  kC: number = 1,
  kH: number = 1
): number {
  const L1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
  const L2 = lab2.l, a2 = lab2.a, b2 = lab2.b;

  // Step 1: Calculate C'i and h'i
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cab = (C1 + C2) / 2;

  const Cab7 = Math.pow(Cab, 7);
  // G = chroma-dependent adjustment factor for a' axis
  const G = 0.5 * (1 - Math.sqrt(Cab7 / (Cab7 + 6103515625))); // 25^7 = 6103515625

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  const h1p = hpF(b1, a1p);
  const h2p = hpF(b2, a2p);

  // Step 2: Calculate ΔL', ΔC', ΔH'
  const dLp = L2 - L1;
  const dCp = C2p - C1p;

  let dhp: number;
  const C1pC2p = C1p * C2p;
  if (C1pC2p === 0) {
    dhp = 0;
  } else {
    dhp = h2p - h1p;
    if (dhp > 180) dhp -= 360;
    else if (dhp < -180) dhp += 360;
  }

  const dHp = 2 * Math.sqrt(C1pC2p) * Math.sin((dhp * Math.PI) / 360);

  // Step 3: Calculate CIEDE2000 ΔE00
  const Lp = (L1 + L2) / 2;
  const Cp = (C1p + C2p) / 2;

  let hp: number;
  if (C1pC2p === 0) {
    hp = h1p + h2p;
  } else {
    hp = (h1p + h2p) / 2;
    if (Math.abs(h1p - h2p) > 180) {
      if (h1p + h2p < 360) hp += 180;
      else hp -= 180;
    }
  }

  const T =
    1 -
    0.17 * Math.cos(((hp - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hp + 6) * Math.PI) / 180) -
    0.20 * Math.cos(((4 * hp - 63) * Math.PI) / 180);

  const dTheta = 30 * Math.exp(-Math.pow((hp - 275) / 25, 2));

  const Cp7 = Math.pow(Cp, 7);
  // RC = Rotation Coefficient (chroma-dependent)
  const RC = 2 * Math.sqrt(Cp7 / (Cp7 + 6103515625));

  const Lp50sq = (Lp - 50) * (Lp - 50);
  const SL = 1 + (0.015 * Lp50sq) / Math.sqrt(20 + Lp50sq);
  const SC = 1 + 0.045 * Cp;
  const SH = 1 + 0.015 * Cp * T;

  // RT = Rotation Term (corrects for blue hue non-linearity)
  const RT = -Math.sin((2 * dTheta * Math.PI) / 180) * RC;

  const termL = dLp / (kL * SL);
  const termC = dCp / (kC * SC);
  const termH = dHp / (kH * SH);

  return Math.sqrt(
    termL * termL +
    termC * termC +
    termH * termH +
    RT * termC * termH
  );
}

/**
 * Helper: compute hue angle h' in degrees [0, 360)
 */
function hpF(b: number, ap: number): number {
  if (b === 0 && ap === 0) return 0;
  const hp = (Math.atan2(b, ap) * 180) / Math.PI;
  return hp >= 0 ? hp : hp + 360;
}