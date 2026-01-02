/**
 * Tests for color difference (ΔE) functions.
 *
 * Reference values from:
 * - Bruce Lindbloom: http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html
 * - Wikipedia: https://en.wikipedia.org/wiki/Color_difference
 */

import { test, expect } from "bun:test";
import { deltaE76, deltaE94, deltaE2000, deltaEOk } from "./delta-e";
import type { Lab, Oklab } from "./color";

function assertAlmostEquals(
  actual: number,
  expected: number,
  tolerance: number,
  msg?: string
) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(
      `${msg || "Value"}: expected ${expected}, got ${actual} (diff: ${diff}, tolerance: ${tolerance})`
    );
  }
}

// =============================================================================
// deltaE76 Tests
// =============================================================================

test("deltaE76 - identical colors", () => {
  const lab: Lab = { l: 50, a: 25, b: -20 };
  expect(deltaE76(lab, lab)).toBe(0);
});

test("deltaE76 - black and white", () => {
  const black: Lab = { l: 0, a: 0, b: 0 };
  const white: Lab = { l: 100, a: 0, b: 0 };
  expect(deltaE76(black, white)).toBe(100);
});

test("deltaE76 - simple Euclidean distance", () => {
  const lab1: Lab = { l: 50, a: 0, b: 0 };
  const lab2: Lab = { l: 50, a: 3, b: 4 };
  // sqrt(0 + 9 + 16) = sqrt(25) = 5
  expect(deltaE76(lab1, lab2)).toBe(5);
});

test("deltaE76 - symmetry", () => {
  const lab1: Lab = { l: 30, a: 40, b: -50 };
  const lab2: Lab = { l: 60, a: -20, b: 30 };
  expect(deltaE76(lab1, lab2)).toBe(deltaE76(lab2, lab1));
});

test("deltaE76 - primary colors have significant difference", () => {
  // Reference Lab values (D65) for primaries
  const red: Lab = { l: 53.23, a: 80.11, b: 67.22 };
  const green: Lab = { l: 87.74, a: -86.18, b: 83.18 };
  const blue: Lab = { l: 32.30, a: 79.20, b: -107.86 };

  // All primaries should be significantly different from each other
  expect(deltaE76(red, green)).toBeGreaterThan(100);
  expect(deltaE76(red, blue)).toBeGreaterThan(100);
  expect(deltaE76(green, blue)).toBeGreaterThan(100);
});

// =============================================================================
// deltaEOk Tests
// =============================================================================

test("deltaEOk - identical colors", () => {
  const oklab: Oklab = { l: 0.5, a: 0.1, b: -0.1 };
  expect(deltaEOk(oklab, oklab)).toBe(0);
});

test("deltaEOk - black and white", () => {
  const black: Oklab = { l: 0, a: 0, b: 0 };
  const white: Oklab = { l: 1, a: 0, b: 0 };
  expect(deltaEOk(black, white)).toBe(1);
});

test("deltaEOk - simple Euclidean distance", () => {
  const oklab1: Oklab = { l: 0.5, a: 0, b: 0 };
  const oklab2: Oklab = { l: 0.5, a: 0.03, b: 0.04 };
  // sqrt(0 + 0.0009 + 0.0016) = sqrt(0.0025) = 0.05
  assertAlmostEquals(deltaEOk(oklab1, oklab2), 0.05, 1e-10);
});

test("deltaEOk - symmetry", () => {
  const oklab1: Oklab = { l: 0.3, a: 0.15, b: -0.1 };
  const oklab2: Oklab = { l: 0.7, a: -0.05, b: 0.2 };
  expect(deltaEOk(oklab1, oklab2)).toBe(deltaEOk(oklab2, oklab1));
});

// =============================================================================
// deltaE94 Tests
// =============================================================================

test("deltaE94 - identical colors", () => {
  const lab: Lab = { l: 50, a: 25, b: -20 };
  expect(deltaE94(lab, lab)).toBe(0);
});

test("deltaE94 - black and white", () => {
  const black: Lab = { l: 0, a: 0, b: 0 };
  const white: Lab = { l: 100, a: 0, b: 0 };
  // For achromatic colors, SC=SH=1, so dE94 = dL = 100
  expect(deltaE94(black, white)).toBe(100);
});

test("deltaE94 - reference values", () => {
  // Test case from color science literature
  const lab1: Lab = { l: 50, a: 2.6772, b: -79.7751 };
  const lab2: Lab = { l: 50, a: 0, b: -82.7485 };

  const dE94 = deltaE94(lab1, lab2);
  // Should be around 1.39 (graphic arts weights)
  assertAlmostEquals(dE94, 1.39, 0.1);
});

test("deltaE94 - textile weights", () => {
  const lab1: Lab = { l: 50, a: 2.6772, b: -79.7751 };
  const lab2: Lab = { l: 50, a: 0, b: -82.7485 };

  // Textile weights: kL=2, K1=0.048, K2=0.014
  const dE94Textile = deltaE94(lab1, lab2, 2, 0.048, 0.014);
  const dE94Graphic = deltaE94(lab1, lab2);

  // Textile weights should give different result
  expect(dE94Textile).not.toBe(dE94Graphic);
});

// =============================================================================
// deltaE2000 Tests
// Reference: http://www.brucelindbloom.com/index.html?ColorDifferenceCalc.html
// =============================================================================

test("deltaE2000 - identical colors", () => {
  const lab: Lab = { l: 50, a: 25, b: -20 };
  expect(deltaE2000(lab, lab)).toBe(0);
});

test("deltaE2000 - achromatic pair", () => {
  const lab1: Lab = { l: 50, a: 0, b: 0 };
  const lab2: Lab = { l: 60, a: 0, b: 0 };

  const dE00 = deltaE2000(lab1, lab2);
  // CIEDE2000 applies SL weighting even for achromatic colors
  // Expected ~9.47 (not 10) due to lightness-dependent SL factor
  assertAlmostEquals(dE00, 9.47, 0.1);
});

test("deltaE2000 - Sharma test data pair 1", () => {
  // From Sharma et al. (2005) test data
  // http://www2.ece.rochester.edu/~gsharma/ciede2000/dataNp498.xls
  const lab1: Lab = { l: 50.0000, a: 2.6772, b: -79.7751 };
  const lab2: Lab = { l: 50.0000, a: 0.0000, b: -82.7485 };

  const dE00 = deltaE2000(lab1, lab2);
  assertAlmostEquals(dE00, 2.0425, 0.001);
});

test("deltaE2000 - Sharma test data pair 2", () => {
  const lab1: Lab = { l: 50.0000, a: 3.1571, b: -77.2803 };
  const lab2: Lab = { l: 50.0000, a: 0.0000, b: -82.7485 };

  const dE00 = deltaE2000(lab1, lab2);
  assertAlmostEquals(dE00, 2.8615, 0.001);
});

test("deltaE2000 - Sharma test data pair 3", () => {
  const lab1: Lab = { l: 50.0000, a: 2.8361, b: -74.0200 };
  const lab2: Lab = { l: 50.0000, a: 0.0000, b: -82.7485 };

  const dE00 = deltaE2000(lab1, lab2);
  assertAlmostEquals(dE00, 3.4412, 0.001);
});

test("deltaE2000 - near-neutral colors", () => {
  // Colors near the neutral axis
  const lab1: Lab = { l: 50, a: 0.5, b: -0.5 };
  const lab2: Lab = { l: 50, a: -0.5, b: 0.5 };

  const dE00 = deltaE2000(lab1, lab2);
  // Should be small but non-zero
  expect(dE00).toBeGreaterThan(0);
  expect(dE00).toBeLessThan(5);
});

test("deltaE2000 - blue region correction", () => {
  // CIEDE2000 has special handling for blue region
  // Test that blue colors are handled without issues
  const blue1: Lab = { l: 32.30, a: 79.20, b: -107.86 };
  const blue2: Lab = { l: 35, a: 75, b: -100 };

  const dE00 = deltaE2000(blue1, blue2);
  // Should produce a reasonable value without NaN or errors
  expect(Number.isFinite(dE00)).toBe(true);
  expect(dE00).toBeGreaterThan(0);
});

test("deltaE2000 - comparison with deltaE76", () => {
  // For many color pairs, deltaE2000 should give lower values
  // than deltaE76 due to perceptual corrections
  const lab1: Lab = { l: 50, a: 60, b: -30 };
  const lab2: Lab = { l: 55, a: 55, b: -25 };

  const dE76 = deltaE76(lab1, lab2);
  const dE00 = deltaE2000(lab1, lab2);

  // Both should be positive
  expect(dE76).toBeGreaterThan(0);
  expect(dE00).toBeGreaterThan(0);
});

// =============================================================================
// Edge Cases
// =============================================================================

test("all functions handle zero chroma", () => {
  const gray1: Lab = { l: 50, a: 0, b: 0 };
  const gray2: Lab = { l: 60, a: 0, b: 0 };

  // None should produce NaN or Infinity
  expect(Number.isFinite(deltaE76(gray1, gray2))).toBe(true);
  expect(Number.isFinite(deltaE94(gray1, gray2))).toBe(true);
  expect(Number.isFinite(deltaE2000(gray1, gray2))).toBe(true);
});

test("all functions handle extreme values", () => {
  const extreme1: Lab = { l: 0, a: -128, b: -128 };
  const extreme2: Lab = { l: 100, a: 127, b: 127 };

  // None should produce NaN or Infinity
  expect(Number.isFinite(deltaE76(extreme1, extreme2))).toBe(true);
  expect(Number.isFinite(deltaE94(extreme1, extreme2))).toBe(true);
  expect(Number.isFinite(deltaE2000(extreme1, extreme2))).toBe(true);
});

test("deltaE2000 - hue crossing 0/360 boundary", () => {
  // Colors with hues near 0 and 360 should work correctly
  const lab1: Lab = { l: 50, a: 50, b: 5 };   // hue near 6°
  const lab2: Lab = { l: 50, a: 50, b: -5 };  // hue near 354°

  const dE00 = deltaE2000(lab1, lab2);
  expect(Number.isFinite(dE00)).toBe(true);
  // Difference should be small since hues are close (across boundary)
  expect(dE00).toBeLessThan(10);
});