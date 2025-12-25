import { test, expect } from "bun:test";
import {
  Cmyk,
  Lab,
  apple2rgb,
  gray2hsl,
  gray2hsv,
  gray2hwb,
  hcg2rgb,
  hsl2hcg,
  hsl2hsv,
  hsl2rgb,
  hsv2rgb,
  hwb2rgb,
  lab2lch,
  lab2lyz,
  lch2lab,
  Rgb,
  rgb2cmyk,
  rgb2hex,
  rgb2hsl,
  rgb2hwb,
  rgb2lab,
  rgb2xyz,
  roundTo,
  xyz2rgb,
} from "./color";
import { assertAlmostEquals, assertAlmostEqualsColor, multiplyColor } from "./helpers";

test("rgb -> hsl -> rgb", () => {
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const rgb: Rgb = { r: r, g: g, b: b };
        const hsl = rgb2hsl(rgb);
        const back = hsl2rgb(hsl);
        assertAlmostEquals(back.r, rgb.r);
        assertAlmostEquals(back.r, rgb.r);
        assertAlmostEquals(back.g, rgb.g);
        assertAlmostEquals(back.b, rgb.b);
      }
    }
  }
});

test("rgb -> hwb -> rgb", () => {
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const rgb: Rgb = { r: r, g: g, b: b };
        const hwb = rgb2hwb(rgb);
        const back = hwb2rgb(hwb);
        assertAlmostEquals(back.r, rgb.r);
        assertAlmostEquals(back.g, rgb.g);
        assertAlmostEquals(back.b, rgb.b);
      }
    }
  }
});

test("rgb -> hsl -> hsv -> rgb", () => {
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const rgb: Rgb = { r: r, g: g, b: b };
        const hsl = rgb2hsl(rgb);
        const hsv = hsl2hsv(hsl);
        const back = hsv2rgb(hsv);
        assertAlmostEquals(back.r, rgb.r);
        assertAlmostEquals(back.g, rgb.g);
        assertAlmostEquals(back.b, rgb.b);
      }
    }
  }
});

test("rgb -> hsl -> hcg -> rgb", () => {
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const rgb: Rgb = { r: r, g: g, b: b };
        const hsl = rgb2hsl(rgb);
        const hcg = hsl2hcg(hsl);
        const back = hcg2rgb(hcg);
        assertAlmostEquals(back.r, rgb.r);
        assertAlmostEquals(back.g, rgb.g);
        assertAlmostEquals(back.b, rgb.b);
      }
    }
  }
});

test("rgb -> lab -> xyz -> rgb", () => {
  // Full 16.7M color round-trip through Lab color space
  // Max error ~1e-4 (0.0001) per RGB channel - excellent precision
  // Enabled after switching to exact CIE constants (216/24389, 24389/27)
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const rgb: Rgb = { r, g, b };
        const lab = rgb2lab(rgb);
        const lyz = lab2lyz(lab);
        // Lyz uses 'l' for X coordinate (convert to Xyz)
        const back = xyz2rgb({ x: lyz.l, y: lyz.y, z: lyz.z });
        assertAlmostEquals(back.r, rgb.r, 1e-3);
        assertAlmostEquals(back.g, rgb.g, 1e-3);
        assertAlmostEquals(back.b, rgb.b, 1e-3);
      }
    }
  }
});

test("roundTo", () => {
  expect(roundTo(10, 2)).toBe(10);
  expect(roundTo(1.7777, 2)).toBe(1.78);
  expect(roundTo(1.005, 2)).toBe(1.01);
  expect(roundTo(1.005, 0)).toBe(1);
  expect(roundTo(1.77777, 1)).toBe(1.8);
  expect(roundTo(10, 1)).toBe(10);
  expect(roundTo(10, 0)).toBe(10);
  expect(roundTo(-10, 0)).toBe(-10);
  expect(roundTo(1.3549999999999998, 0)).toBe(1);
  expect(roundTo(1.3549999999999998, 1)).toBe(1.4);
  expect(roundTo(1.3549999999999998, 2)).toBe(1.35);
  expect(roundTo(1.3549999999999998, 3)).toBe(1.355);
});

test("basics rgb -> hsl", () => {
  // Black
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 0, b: 0 }), { h: 0, s: 0, l: 0 }, 0.01);
  // White
  assertAlmostEqualsColor(rgb2hsl({ r: 255, g: 255, b: 255 }), { h: 0, s: 0, l: 100 }, 0.01);
  // Red
  assertAlmostEqualsColor(rgb2hsl({ r: 255, g: 0, b: 0 }), { h: 0, s: 100, l: 50 }, 0.01);
  // Lime
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 255, b: 0 }), { h: 120, s: 100, l: 50 }, 0.01);
  // Blue
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 0, b: 255 }), { h: 240, s: 100, l: 50 }, 0.01);
  // Yellow
  assertAlmostEqualsColor(rgb2hsl({ r: 255, g: 255, b: 0 }), { h: 60, s: 100, l: 50 }, 0.01);
  // Cyan
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 255, b: 255 }), { h: 180, s: 100, l: 50 }, 0.01);
  // Magenta
  assertAlmostEqualsColor(rgb2hsl({ r: 255, g: 0, b: 255 }), { h: 300, s: 100, l: 50 }, 0.01);
  // Silver
  assertAlmostEqualsColor(rgb2hsl({ r: 191, g: 191, b: 191 }), { h: 0, s: 0, l: 74.9 }, 0.01);
  // Gray
  assertAlmostEqualsColor(rgb2hsl({ r: 128, g: 128, b: 128 }), { h: 0, s: 0, l: 50.2 }, 0.01);
  // Maroon
  assertAlmostEqualsColor(rgb2hsl({ r: 128, g: 0, b: 0 }), { h: 0, s: 100, l: 25.1 }, 0.01);
  // Olive
  assertAlmostEqualsColor(rgb2hsl({ r: 128, g: 128, b: 0 }), { h: 60, s: 100, l: 25.1 }, 0.01);
  // Green
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 128, b: 0 }), { h: 120, s: 100, l: 25.1 }, 0.01);
  // Purple
  assertAlmostEqualsColor(rgb2hsl({ r: 128, g: 0, b: 128 }), { h: 300, s: 100, l: 25.1 }, 0.01);
  // Teal
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 128, b: 128 }), { h: 180, s: 100, l: 25.1 }, 0.01);
  // Navy
  assertAlmostEqualsColor(rgb2hsl({ r: 0, g: 0, b: 128 }), { h: 240, s: 100, l: 25.1 }, 0.01);
});

test("rgb to all", () => {
  const rgb = { r: 169, g: 104, b: 54 };
  assertAlmostEqualsColor(rgb2hsl(rgb), { h: 26.09, s: 51.57, l: 43.73 }, 0.01);
  assertAlmostEqualsColor(rgb2cmyk(rgb), { c: 0, m: 38.46, y: 68.05, k: 33.73 }, 0.01);
  assertAlmostEqualsColor(rgb2lab(rgb), { l: 50.22, a: 21.47, b: 38.39 }, 0.01);
});

test("rgb to hex", () => {
  const rgb = { r: 169, g: 104, b: 54 };
  expect(rgb2hex(rgb)).toBe("a96836");
  expect(rgb2hex({ r: 0, g: 0, b: 0 })).toBe("000000");
});

test("basics rgb -> cmyk", () => {
  // Warning: cmyk is in 0..1 format here
  const tests: [Rgb, Cmyk][] = [
    [{ r: 255, g: 0, b: 0 }, { c: 0, m: 1, y: 1, k: 0 }],
    [{ r: 0, g: 255, b: 0 }, { c: 1, m: 0, y: 1, k: 0 }],
    [{ r: 0, g: 0, b: 255 }, { c: 1, m: 1, y: 0, k: 0 }],
    [{ r: 255, g: 255, b: 0 }, { c: 0, m: 0, y: 1, k: 0 }],
    [{ r: 0, g: 255, b: 255 }, { c: 1, m: 0, y: 0, k: 0 }],
    [{ r: 255, g: 0, b: 255 }, { c: 0, m: 1, y: 0, k: 0 }],
    [{ r: 128, g: 128, b: 128 }, { c: 0, m: 0, y: 0, k: 0.5 }],
    [{ r: 192, g: 192, b: 192 }, { c: 0, m: 0, y: 0, k: 0.25 }],
    [{ r: 128, g: 0, b: 0 }, { c: 0, m: 1, y: 1, k: 0.5 }],
    [{ r: 128, g: 128, b: 0 }, { c: 0, m: 0, y: 1, k: 0.5 }],
    [{ r: 0, g: 128, b: 0 }, { c: 1, m: 0, y: 1, k: 0.5 }],
    [{ r: 128, g: 0, b: 128 }, { c: 0, m: 1, y: 0, k: 0.5 }],
    [{ r: 0, g: 128, b: 128 }, { c: 1, m: 0, y: 0, k: 0.5 }],
    [{ r: 0, g: 0, b: 128 }, { c: 1, m: 1, y: 0, k: 0.5 }],
    [{ r: 255, g: 165, b: 0 }, { c: 0, m: 0.35, y: 1, k: 0 }],
    [{ r: 255, g: 192, b: 203 }, { c: 0, m: 0.247, y: 0.203, k: 0 }],
    [{ r: 255, g: 105, b: 180 }, { c: 0, m: 0.588, y: 0.294, k: 0 }],
    [{ r: 255, g: 69, b: 0 }, { c: 0, m: 0.73, y: 1, k: 0 }],
    [{ r: 220, g: 20, b: 60 }, { c: 0, m: 0.909, y: 0.727, k: 0.137 }],
    [{ r: 255, g: 140, b: 0 }, { c: 0, m: 0.451, y: 1, k: 0 }],
    [{ r: 34, g: 139, b: 34 }, { c: 0.755, m: 0, y: 0.755, k: 0.455 }],
    [{ r: 70, g: 130, b: 180 }, { c: 0.611, m: 0.278, y: 0, k: 0.294 }],
    [{ r: 0, g: 100, b: 0 }, { c: 1, m: 0, y: 1, k: 0.607 }],
    [{ r: 135, g: 206, b: 235 }, { c: 0.426, m: 0.123, y: 0, k: 0.078 }],
    [{ r: 173, g: 216, b: 230 }, { c: 0.248, m: 0.06, y: 0, k: 0.098 }],
    [{ r: 250, g: 128, b: 114 }, { c: 0, m: 0.488, y: 0.544, k: 0.019 }],
    [{ r: 255, g: 160, b: 122 }, { c: 0, m: 0.373, y: 0.521, k: 0 }],
    [{ r: 32, g: 178, b: 170 }, { c: 0.82, m: 0, y: 0.04, k: 0.3 }],
    [{ r: 127, g: 255, b: 0 }, { c: 0.502, m: 0, y: 1, k: 0 }],
    [{ r: 255, g: 255, b: 240 }, { c: 0, m: 0, y: 0.059, k: 0 }],
    [{ r: 255, g: 250, b: 205 }, { c: 0, m: 0.019, y: 0.196, k: 0 }],
    [{ r: 255, g: 245, b: 238 }, { c: 0, m: 0.039, y: 0.066, k: 0 }],
    [{ r: 240, g: 255, b: 255 }, { c: 0.059, m: 0, y: 0, k: 0 }],
    [{ r: 248, g: 248, b: 255 }, { c: 0.027, m: 0.027, y: 0, k: 0 }],
    [{ r: 245, g: 245, b: 245 }, { c: 0, m: 0, y: 0, k: 0.039 }],
    [{ r: 255, g: 228, b: 225 }, { c: 0, m: 0.106, y: 0.118, k: 0 }],
    [{ r: 255, g: 239, b: 213 }, { c: 0, m: 0.065, y: 0.165, k: 0 }],
    [{ r: 240, g: 230, b: 140 }, { c: 0, m: 0.042, y: 0.417, k: 0.059 }],
    [{ r: 255, g: 248, b: 220 }, { c: 0, m: 0.027, y: 0.137, k: 0 }],
    [{ r: 210, g: 105, b: 30 }, { c: 0, m: 0.5, y: 0.857, k: 0.176 }],
    [{ r: 222, g: 184, b: 135 }, { c: 0, m: 0.171, y: 0.392, k: 0.129 }],
    [{ r: 255, g: 222, b: 173 }, { c: 0, m: 0.128, y: 0.32, k: 0 }],
    [{ r: 244, g: 164, b: 96 }, { c: 0, m: 0.328, y: 0.607, k: 0.043 }],
    [{ r: 160, g: 82, b: 45 }, { c: 0, m: 0.488, y: 0.719, k: 0.373 }],
    [{ r: 233, g: 150, b: 122 }, { c: 0, m: 0.357, y: 0.476, k: 0.086 }],
    [{ r: 255, g: 127, b: 80 }, { c: 0, m: 0.502, y: 0.686, k: 0 }],
    [{ r: 250, g: 128, b: 114 }, { c: 0, m: 0.488, y: 0.544, k: 0.019 }],
    [{ r: 210, g: 180, b: 140 }, { c: 0, m: 0.143, y: 0.333, k: 0.176 }]
  ];
  for (const t of tests) {
    assertAlmostEqualsColor(rgb2cmyk(t[0]), multiplyColor(t[1], 100), 0.5, `${JSON.stringify(t[0])} -> ${JSON.stringify(t[1])}`);
  }

});

test("rgb2lab - primary colors reference values", () => {
  // Reference values from colormine.org (D65 illuminant)
  // Tighter tolerance (0.05) after switching to exact CIE constants
  assertAlmostEqualsColor(rgb2lab({ r: 255, g: 0, b: 0 }), { l: 53.23, a: 80.11, b: 67.22 }, 0.05);
  assertAlmostEqualsColor(rgb2lab({ r: 0, g: 255, b: 0 }), { l: 87.74, a: -86.18, b: 83.18 }, 0.05);
  assertAlmostEqualsColor(rgb2lab({ r: 0, g: 0, b: 255 }), { l: 32.30, a: 79.20, b: -107.86 }, 0.05);
});

test("rgb2lab - black and white reference values", () => {
  // Tighter tolerance after switching to exact CIE constants and IEC matrix
  assertAlmostEqualsColor(rgb2lab({ r: 255, g: 255, b: 255 }), { l: 100, a: 0, b: 0 }, 0.01);
  assertAlmostEqualsColor(rgb2lab({ r: 0, g: 0, b: 0 }), { l: 0, a: 0, b: 0 }, 0.001);
});

test("rgb2lab - gray neutrality (a=0, b=0 for grays)", () => {
  // All grayscale values should have a=0 and b=0
  const grays = [64, 128, 192];
  for (const g of grays) {
    const lab = rgb2lab({ r: g, g: g, b: g });
    assertAlmostEquals(lab.a, 0, 0.01, `Gray ${g} should have a=0`);
    assertAlmostEquals(lab.b, 0, 0.01, `Gray ${g} should have b=0`);
  }
});

test("rgb2lab - gamma threshold boundary (0.04045)", () => {
  // Values near the sRGB gamma threshold (0.04045 ≈ RGB 10.31)
  // These test the piecewise function discontinuity
  const rgb10 = rgb2lab({ r: 10, g: 10, b: 10 }); // Below threshold
  const rgb11 = rgb2lab({ r: 11, g: 11, b: 11 }); // Near threshold
  const rgb12 = rgb2lab({ r: 12, g: 12, b: 12 }); // Above threshold

  // Should be monotonically increasing in L
  expect(rgb10.l < rgb11.l).toBe(true);
  expect(rgb11.l < rgb12.l).toBe(true);

  // All should remain neutral (grayscale)
  assertAlmostEquals(rgb10.a, 0, 0.01, "rgb10 should have a=0");
  assertAlmostEquals(rgb10.b, 0, 0.01, "rgb10 should have b=0");
  assertAlmostEquals(rgb11.a, 0, 0.01, "rgb11 should have a=0");
  assertAlmostEquals(rgb11.b, 0, 0.01, "rgb11 should have b=0");
  assertAlmostEquals(rgb12.a, 0, 0.01, "rgb12 should have a=0");
  assertAlmostEquals(rgb12.b, 0, 0.01, "rgb12 should have b=0");
});

test("rgb2xyz - primary colors (IEC 61966-2-1 sRGB)", () => {
  // Reference: sRGB to XYZ matrix (scaled to 100)
  // Tighter tolerance (0.01) after switching to IEC 7-digit matrix
  // Red: X=41.2456, Y=21.2673, Z=1.9334
  assertAlmostEqualsColor(rgb2xyz({ r: 255, g: 0, b: 0 }), { x: 41.2456, y: 21.2673, z: 1.9334 }, 0.01);
  // Green: X=35.7576, Y=71.5152, Z=11.9192
  assertAlmostEqualsColor(rgb2xyz({ r: 0, g: 255, b: 0 }), { x: 35.7576, y: 71.5152, z: 11.9192 }, 0.01);
  // Blue: X=18.0437, Y=7.2175, Z=95.0304
  assertAlmostEqualsColor(rgb2xyz({ r: 0, g: 0, b: 255 }), { x: 18.0437, y: 7.2175, z: 95.0304 }, 0.01);
});

test("rgb2xyz - D65 white point reference", () => {
  // D65 standard illuminant: X=95.047, Y=100.000, Z=108.883
  // Tighter tolerance (0.01) after switching to IEC 7-digit matrix
  const white = rgb2xyz({ r: 255, g: 255, b: 255 });
  assertAlmostEquals(white.x, 95.047, 0.01, "White X should match D65");
  assertAlmostEquals(white.y, 100.0, 0.01, "White Y should be 100");
  assertAlmostEquals(white.z, 108.883, 0.01, "White Z should match D65");
});

test("rgb2hsl - near-equal RGB values (floating-point equality)", () => {
  // Test values that are nearly equal but differ at floating-point precision
  // This tests the == comparison in rgb2hsl lines 371-389
  const nearGray1 = rgb2hsl({ r: 127.9999999999999, g: 128.0000000000001, b: 128 });
  const nearGray2 = rgb2hsl({ r: 100, g: 100.00000000000001, b: 100 });

  // Should be treated as gray (s should be 0 or very small)
  expect(nearGray1.s < 1).toBe(true);
  expect(nearGray2.s < 1).toBe(true);

  // Should not produce NaN
  expect(isNaN(nearGray1.h)).toBe(false);
  expect(isNaN(nearGray1.s)).toBe(false);
  expect(isNaN(nearGray1.l)).toBe(false);
});

test("rgb2hsl - classic floating-point issue (0.1 + 0.2 !== 0.3)", () => {
  // 0.1 + 0.2 = 0.30000000000000004 in JavaScript
  const sum = 0.1 + 0.2;
  const rgb = { r: sum * 255, g: 0.3 * 255, b: 0.3 * 255 };
  const hsl = rgb2hsl(rgb);

  // Should not produce NaN or Infinity
  expect(Number.isFinite(hsl.h)).toBe(true);
  expect(Number.isFinite(hsl.s)).toBe(true);
  expect(Number.isFinite(hsl.l)).toBe(true);
});

test("hsl2hsv - division edge cases", () => {
  // Black: l=0, s=0 (potential division by zero)
  const black = hsl2hsv({ h: 0, s: 0, l: 0 });
  expect(isNaN(black.h)).toBe(false);
  expect(isNaN(black.s)).toBe(false);
  expect(isNaN(black.v)).toBe(false);
  assertAlmostEquals(black.v, 0, 0.01, "Black should have v=0");

  // White: l=100, s=0 (potential division by zero)
  const white = hsl2hsv({ h: 0, s: 0, l: 100 });
  expect(isNaN(white.h)).toBe(false);
  expect(isNaN(white.s)).toBe(false);
  expect(isNaN(white.v)).toBe(false);
  assertAlmostEquals(white.v, 100, 0.01, "White should have v=100");

  // Pure gray at 50%
  const gray = hsl2hsv({ h: 180, s: 0, l: 50 });
  expect(isNaN(gray.h)).toBe(false);
  expect(isNaN(gray.s)).toBe(false);
  expect(isNaN(gray.v)).toBe(false);
  assertAlmostEquals(gray.s, 0, 0.01, "Gray should have s=0");
});

test("hsl2hsv - boundary conditions", () => {
  // Full saturation at l=0 (black with saturation - edge case)
  const hsv1 = hsl2hsv({ h: 360, s: 100, l: 0 });
  expect(Number.isFinite(hsv1.v)).toBe(true);

  // Full saturation at l=100 (white with saturation - edge case)
  const hsv2 = hsl2hsv({ h: 360, s: 100, l: 100 });
  expect(Number.isFinite(hsv2.v)).toBe(true);
});

test("gray conversions - consistency across color spaces", () => {
  const grayLevels = [0, 25, 50, 75, 100];

  for (const gray of grayLevels) {
    const expectedRgbValue = (gray / 100) * 255;

    // gray -> hsl -> rgb
    const fromHsl = hsl2rgb(gray2hsl(gray));
    assertAlmostEquals(fromHsl.r, expectedRgbValue, 0.01, `gray ${gray} via HSL: r`);
    assertAlmostEquals(fromHsl.g, expectedRgbValue, 0.01, `gray ${gray} via HSL: g`);
    assertAlmostEquals(fromHsl.b, expectedRgbValue, 0.01, `gray ${gray} via HSL: b`);

    // gray -> hsv -> rgb
    const fromHsv = hsv2rgb(gray2hsv(gray));
    assertAlmostEquals(fromHsv.r, expectedRgbValue, 0.01, `gray ${gray} via HSV: r`);
    assertAlmostEquals(fromHsv.g, expectedRgbValue, 0.01, `gray ${gray} via HSV: g`);
    assertAlmostEquals(fromHsv.b, expectedRgbValue, 0.01, `gray ${gray} via HSV: b`);

    // gray -> hwb -> rgb
    const fromHwb = hwb2rgb(gray2hwb(gray));
    assertAlmostEquals(fromHwb.r, expectedRgbValue, 0.01, `gray ${gray} via HWB: r`);
    assertAlmostEquals(fromHwb.g, expectedRgbValue, 0.01, `gray ${gray} via HWB: g`);
    assertAlmostEquals(fromHwb.b, expectedRgbValue, 0.01, `gray ${gray} via HWB: b`);
  }
});

test("lab -> lch -> lab round-trip", () => {
  const lValues = [0, 25, 50, 75, 100];
  const abValues = [-100, -50, 0, 50, 100];

  for (const l of lValues) {
    for (const a of abValues) {
      for (const b of abValues) {
        const lab: Lab = { l, a, b };
        const lch = lab2lch(lab);
        const back = lch2lab(lch);

        assertAlmostEquals(back.l, lab.l, 1e-6, `L round-trip failed for lab(${l},${a},${b})`);
        assertAlmostEquals(back.a, lab.a, 1e-6, `a round-trip failed for lab(${l},${a},${b})`);
        assertAlmostEquals(back.b, lab.b, 1e-6, `b round-trip failed for lab(${l},${a},${b})`);
      }
    }
  }
});

test("lch hue edge cases", () => {
  // When a=0 and b=0, hue is undefined (achromatic)
  const achromatic = lab2lch({ l: 50, a: 0, b: 0 });
  expect(Number.isFinite(achromatic.h)).toBe(true);
  assertAlmostEquals(achromatic.c, 0, 1e-6, "Achromatic chroma should be 0");

  // Hue at 0 degrees (positive a, zero b)
  const hue0 = lab2lch({ l: 50, a: 50, b: 0 });
  assertAlmostEquals(hue0.h, 0, 0.01, "Hue should be 0 for positive a, zero b");

  // Hue at 90 degrees (zero a, positive b)
  const hue90 = lab2lch({ l: 50, a: 0, b: 50 });
  assertAlmostEquals(hue90.h, 90, 0.01, "Hue should be 90 for zero a, positive b");

  // Hue at 180 degrees (negative a, zero b)
  const hue180 = lab2lch({ l: 50, a: -50, b: 0 });
  assertAlmostEquals(hue180.h, 180, 0.01, "Hue should be 180 for negative a, zero b");

  // Hue at 270 degrees (zero a, negative b)
  const hue270 = lab2lch({ l: 50, a: 0, b: -50 });
  assertAlmostEquals(hue270.h, 270, 0.01, "Hue should be 270 for zero a, negative b");
});

test("apple2rgb - 16-bit to 8-bit precision", () => {
  // Mid-gray: 32768 / 65535 * 255 ≈ 127.5
  const midGray = apple2rgb({ r16: 32768, g16: 32768, b16: 32768 });
  assertAlmostEquals(midGray.r, 127.5, 0.5, "Mid-gray r");
  assertAlmostEquals(midGray.g, 127.5, 0.5, "Mid-gray g");
  assertAlmostEquals(midGray.b, 127.5, 0.5, "Mid-gray b");

  // Near-black: 1 / 65535 * 255 ≈ 0.00389
  const nearBlack = apple2rgb({ r16: 1, g16: 1, b16: 1 });
  expect(nearBlack.r < 0.01).toBe(true);

  // One 8-bit step: 257 / 65535 * 255 ≈ 1.0
  const oneStep = apple2rgb({ r16: 257, g16: 257, b16: 257 });
  assertAlmostEquals(oneStep.r, 1.0, 0.01, "257/65535*255 should be ~1");
});

test("apple2rgb - edge values", () => {
  // Black
  const black = apple2rgb({ r16: 0, g16: 0, b16: 0 });
  assertAlmostEquals(black.r, 0, 0.001, "Black r");
  assertAlmostEquals(black.g, 0, 0.001, "Black g");
  assertAlmostEquals(black.b, 0, 0.001, "Black b");

  // White
  const white = apple2rgb({ r16: 65535, g16: 65535, b16: 65535 });
  assertAlmostEquals(white.r, 255, 0.001, "White r");
  assertAlmostEquals(white.g, 255, 0.001, "White g");
  assertAlmostEquals(white.b, 255, 0.001, "White b");
});