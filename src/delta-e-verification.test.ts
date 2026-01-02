/**
 * Verification tests for deltaE2000 against the official Sharma et al. (2005) test data.
 *
 * Reference: "The CIEDE2000 Color-Difference Formula: Implementation Notes,
 * Supplementary Test Data, and Mathematical Observations"
 * by Gaurav Sharma, Wencheng Wu, and Edul N. Dalal.
 * Color Research and Application, vol. 30, No. 1, pp. 21-30, February 2005.
 *
 * @see {@link http://www2.ece.rochester.edu/~gsharma/ciede2000/|Official test data}
 * @see {@link https://github.com/zschuessler/DeltaE|DeltaE JS library}
 */

import { test, expect } from "bun:test";
import { deltaE2000 } from "./delta-e";
import type { Lab } from "./color";

/** Round to 4 decimal places for comparison */
function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/** Test helper: verify deltaE2000 matches expected value (symmetric) */
function verifyDeltaE00(
  expected: number,
  L1: number, a1: number, b1: number,
  L2: number, a2: number, b2: number
): void {
  const lab1: Lab = { l: L1, a: a1, b: b1 };
  const lab2: Lab = { l: L2, a: a2, b: b2 };

  const result = deltaE2000(lab1, lab2);
  const resultReverse = deltaE2000(lab2, lab1);

  // Check forward direction
  expect(round4(result)).toBe(round4(expected));
  // Check symmetry (reverse direction should match)
  expect(round4(resultReverse)).toBe(round4(expected));
}

// =============================================================================
// Sharma et al. (2005) Official CIEDE2000 Test Data - 34 pairs
// =============================================================================

test("Sharma #0a: identical colors (black)", () => {
  verifyDeltaE00(0.0, 0, 0, 0, 0, 0, 0);
});

test("Sharma #0b: identical colors (near white)", () => {
  verifyDeltaE00(0.0, 99.5, 0.005, -0.010, 99.5, 0.005, -0.010);
});

test("Sharma #0c: maximum difference (white to black)", () => {
  verifyDeltaE00(100.0, 100, 0.005, -0.010, 0, 0, 0);
});

test("Sharma #1: True chroma difference", () => {
  verifyDeltaE00(2.0425, 50, 2.6772, -79.7751, 50, 0, -82.7485);
});

test("Sharma #2: True chroma difference", () => {
  verifyDeltaE00(2.8615, 50, 3.1571, -77.2803, 50, 0, -82.7485);
});

test("Sharma #3: True chroma difference", () => {
  verifyDeltaE00(3.4412, 50, 2.8361, -74.0200, 50, 0, -82.7485);
});

test("Sharma #4: True hue difference", () => {
  verifyDeltaE00(1.0000, 50, -1.3802, -84.2814, 50, 0, -82.7485);
});

test("Sharma #5: True hue difference", () => {
  verifyDeltaE00(1.0000, 50, -1.1848, -84.8006, 50, 0, -82.7485);
});

test("Sharma #6: True hue difference", () => {
  verifyDeltaE00(1.0000, 50, -0.9009, -85.5211, 50, 0, -82.7485);
});

test("Sharma #7: Arctangent computation", () => {
  verifyDeltaE00(2.3669, 50, 0, 0, 50, -1, 2);
});

test("Sharma #8: Arctangent computation", () => {
  verifyDeltaE00(2.3669, 50, -1, 2, 50, 0, 0);
});

test("Sharma #9: Arctangent computation", () => {
  verifyDeltaE00(7.1792, 50, 2.49, -0.001, 50, -2.49, 0.0009);
});

test("Sharma #10: Arctangent computation", () => {
  verifyDeltaE00(7.1792, 50, 2.49, -0.001, 50, -2.49, 0.001);
});

test("Sharma #11: Arctangent computation", () => {
  verifyDeltaE00(7.2195, 50, 2.49, -0.001, 50, -2.49, 0.0011);
});

test("Sharma #12: Arctangent computation", () => {
  verifyDeltaE00(7.2195, 50, 2.49, -0.001, 50, -2.49, 0.0012);
});

test("Sharma #13: Arctangent computation", () => {
  verifyDeltaE00(4.8045, 50, -0.001, 2.49, 50, 0.0009, -2.49);
});

test("Sharma #14: Arctangent computation", () => {
  verifyDeltaE00(4.8045, 50, -0.001, 2.49, 50, 0.001, -2.49);
});

test("Sharma #15: Arctangent computation", () => {
  verifyDeltaE00(4.7461, 50, -0.001, 2.49, 50, 0.0011, -2.49);
});

test("Sharma #16: Arctangent computation", () => {
  verifyDeltaE00(4.3065, 50, 2.5, 0, 50, 0, -2.5);
});

test("Sharma #17: Large color differences", () => {
  verifyDeltaE00(27.1492, 50, 2.5, 0, 73, 25, -18);
});

test("Sharma #18: Large color differences", () => {
  verifyDeltaE00(22.8977, 50, 2.5, 0, 61, -5, 29);
});

test("Sharma #19: Large color differences", () => {
  verifyDeltaE00(31.9030, 50, 2.5, 0, 56, -27, -3);
});

test("Sharma #20: Large color differences", () => {
  verifyDeltaE00(19.4535, 50, 2.5, 0, 58, 24, 15);
});

test("Sharma #21: CIE technical report", () => {
  verifyDeltaE00(1.0000, 50, 2.5, 0, 50, 3.1736, 0.5854);
});

test("Sharma #22: CIE technical report", () => {
  verifyDeltaE00(1.0000, 50, 2.5, 0, 50, 3.2972, 0);
});

test("Sharma #23: CIE technical report", () => {
  verifyDeltaE00(1.0000, 50, 2.5, 0, 50, 1.8634, 0.5757);
});

test("Sharma #24: CIE technical report", () => {
  verifyDeltaE00(1.0000, 50, 2.5, 0, 50, 3.2592, 0.335);
});

test("Sharma #25: CIE technical report", () => {
  verifyDeltaE00(1.2644, 60.2574, -34.0099, 36.2677, 60.4626, -34.1751, 39.4387);
});

test("Sharma #26: CIE technical report", () => {
  verifyDeltaE00(1.2630, 63.0109, -31.0961, -5.8663, 62.8187, -29.7946, -4.0864);
});

test("Sharma #27: CIE technical report", () => {
  verifyDeltaE00(1.8731, 61.2901, 3.7196, -5.3901, 61.4292, 2.248, -4.962);
});

test("Sharma #28: CIE technical report", () => {
  verifyDeltaE00(1.8645, 35.0831, -44.1164, 3.7933, 35.0232, -40.0716, 1.5901);
});

test("Sharma #29: CIE technical report", () => {
  verifyDeltaE00(2.0373, 22.7233, 20.0904, -46.694, 23.0331, 14.973, -42.5619);
});

test("Sharma #30: CIE technical report", () => {
  verifyDeltaE00(1.4146, 36.4612, 47.858, 18.3852, 36.2715, 50.5065, 21.2231);
});

test("Sharma #31: CIE technical report", () => {
  verifyDeltaE00(1.4441, 90.8027, -2.0831, 1.441, 91.1528, -1.6435, 0.0447);
});

test("Sharma #32: CIE technical report", () => {
  verifyDeltaE00(1.5381, 90.9257, -0.5406, -0.9208, 88.6381, -0.8985, -0.7239);
});

test("Sharma #33: CIE technical report", () => {
  verifyDeltaE00(0.6377, 6.7747, -0.2908, -2.4247, 5.8714, -0.0985, -2.2286);
});

test("Sharma #34: CIE technical report", () => {
  verifyDeltaE00(0.9082, 2.0776, 0.0795, -1.135, 0.9033, -0.0636, -0.5514);
});