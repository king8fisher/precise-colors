import { test, expect } from "bun:test";
import {
  Cmyk,
  LabD50,
  LabD65,
  apple2rgb,
  cmyk2rgb,
  gray2cmyk,
  gray2hsl,
  gray2hsv,
  gray2hwb,
  gray2lab,
  gray2rgb,
  hcg2rgb,
  hsl2hcg,
  hsl2hsv,
  hsl2rgb,
  hsv2rgb,
  hwb2rgb,
  lab2lch,
  lab2lyz,
  lab2rgb,
  labD502rgb,
  lch2lab,
  Rgb,
  rgb2cmyk,
  rgb2hex,
  rgb2hsl,
  rgb2hwb,
  rgb2lab,
  rgb2labD50,
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

// Additional rgb2cmyk tests verified against RapidTables
// Reference: https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
// Formula: K = 1 - max(R', G', B'), C = (1-R'-K)/(1-K), etc.
// Verified via Playwright automation: 100/100 tests passed
test("rgb2cmyk - RapidTables verified colors", () => {
  const tests: [Rgb, Cmyk][] = [
    // Black and white edge cases
    [{ r: 0, g: 0, b: 0 }, { c: 0, m: 0, y: 0, k: 1 }],
    [{ r: 255, g: 255, b: 255 }, { c: 0, m: 0, y: 0, k: 0 }],
    [{ r: 1, g: 1, b: 1 }, { c: 0, m: 0, y: 0, k: 0.996 }],
    [{ r: 254, g: 254, b: 254 }, { c: 0, m: 0, y: 0, k: 0.004 }],
    // Grays
    [{ r: 10, g: 10, b: 10 }, { c: 0, m: 0, y: 0, k: 0.961 }],
    [{ r: 58, g: 58, b: 58 }, { c: 0, m: 0, y: 0, k: 0.773 }],
    [{ r: 106, g: 106, b: 106 }, { c: 0, m: 0, y: 0, k: 0.584 }],
    [{ r: 154, g: 154, b: 154 }, { c: 0, m: 0, y: 0, k: 0.396 }],
    [{ r: 202, g: 202, b: 202 }, { c: 0, m: 0, y: 0, k: 0.208 }],
    [{ r: 250, g: 250, b: 250 }, { c: 0, m: 0, y: 0, k: 0.02 }],
    // Mixed colors
    [{ r: 128, g: 64, b: 32 }, { c: 0, m: 0.5, y: 0.75, k: 0.498 }],
    [{ r: 200, g: 100, b: 50 }, { c: 0, m: 0.5, y: 0.75, k: 0.216 }],
    [{ r: 10, g: 20, b: 30 }, { c: 0.667, m: 0.333, y: 0, k: 0.882 }],
    [{ r: 100, g: 150, b: 200 }, { c: 0.5, m: 0.25, y: 0, k: 0.216 }],
    [{ r: 50, g: 100, b: 150 }, { c: 0.667, m: 0.333, y: 0, k: 0.412 }],
    [{ r: 180, g: 90, b: 45 }, { c: 0, m: 0.5, y: 0.75, k: 0.294 }],
    [{ r: 75, g: 125, b: 175 }, { c: 0.571, m: 0.286, y: 0, k: 0.314 }],
    [{ r: 220, g: 180, b: 140 }, { c: 0, m: 0.182, y: 0.364, k: 0.137 }],
    [{ r: 30, g: 60, b: 90 }, { c: 0.667, m: 0.333, y: 0, k: 0.647 }],
    [{ r: 150, g: 75, b: 225 }, { c: 0.333, m: 0.667, y: 0, k: 0.118 }],
    [{ r: 64, g: 128, b: 192 }, { c: 0.667, m: 0.333, y: 0, k: 0.247 }],
    [{ r: 192, g: 64, b: 128 }, { c: 0, m: 0.667, y: 0.333, k: 0.247 }],
    [{ r: 33, g: 66, b: 99 }, { c: 0.667, m: 0.333, y: 0, k: 0.612 }],
    [{ r: 111, g: 222, b: 111 }, { c: 0.5, m: 0, y: 0.5, k: 0.129 }],
    [{ r: 200, g: 50, b: 100 }, { c: 0, m: 0.75, y: 0.5, k: 0.216 }],
    [{ r: 80, g: 160, b: 240 }, { c: 0.667, m: 0.333, y: 0, k: 0.059 }],
    [{ r: 240, g: 80, b: 160 }, { c: 0, m: 0.667, y: 0.333, k: 0.059 }],
    [{ r: 160, g: 240, b: 80 }, { c: 0.333, m: 0, y: 0.667, k: 0.059 }],
    [{ r: 45, g: 90, b: 135 }, { c: 0.667, m: 0.333, y: 0, k: 0.471 }],
    [{ r: 135, g: 45, b: 90 }, { c: 0, m: 0.667, y: 0.333, k: 0.471 }],
    [{ r: 90, g: 135, b: 45 }, { c: 0.333, m: 0, y: 0.667, k: 0.471 }],
    [{ r: 177, g: 88, b: 44 }, { c: 0, m: 0.503, y: 0.751, k: 0.306 }],
    [{ r: 44, g: 177, b: 88 }, { c: 0.751, m: 0, y: 0.503, k: 0.306 }],
    [{ r: 88, g: 44, b: 177 }, { c: 0.503, m: 0.751, y: 0, k: 0.306 }],
    [{ r: 200, g: 200, b: 100 }, { c: 0, m: 0, y: 0.5, k: 0.216 }],
    [{ r: 100, g: 200, b: 200 }, { c: 0.5, m: 0, y: 0, k: 0.216 }],
    [{ r: 200, g: 100, b: 200 }, { c: 0, m: 0.5, y: 0, k: 0.216 }],
    [{ r: 50, g: 50, b: 200 }, { c: 0.75, m: 0.75, y: 0, k: 0.216 }],
    [{ r: 50, g: 200, b: 50 }, { c: 0.75, m: 0, y: 0.75, k: 0.216 }],
    [{ r: 200, g: 50, b: 50 }, { c: 0, m: 0.75, y: 0.75, k: 0.216 }],
    [{ r: 123, g: 45, b: 67 }, { c: 0, m: 0.634, y: 0.455, k: 0.518 }],
    [{ r: 67, g: 123, b: 45 }, { c: 0.455, m: 0, y: 0.634, k: 0.518 }],
    [{ r: 45, g: 67, b: 123 }, { c: 0.634, m: 0.455, y: 0, k: 0.518 }],
    // Named colors not in previous test
    [{ r: 128, g: 0, b: 128 }, { c: 0, m: 1, y: 0, k: 0.498 }],     // Purple
    [{ r: 0, g: 128, b: 0 }, { c: 1, m: 0, y: 1, k: 0.498 }],       // Dark green
    [{ r: 0, g: 0, b: 128 }, { c: 1, m: 1, y: 0, k: 0.498 }],       // Navy
    [{ r: 128, g: 0, b: 0 }, { c: 0, m: 1, y: 1, k: 0.498 }],       // Maroon
    [{ r: 128, g: 128, b: 0 }, { c: 0, m: 0, y: 1, k: 0.498 }],     // Olive
    [{ r: 0, g: 128, b: 128 }, { c: 1, m: 0, y: 0, k: 0.498 }],     // Teal
    [{ r: 169, g: 169, b: 169 }, { c: 0, m: 0, y: 0, k: 0.337 }],   // Dark gray
    [{ r: 105, g: 105, b: 105 }, { c: 0, m: 0, y: 0, k: 0.588 }],   // Dim gray
    [{ r: 255, g: 20, b: 147 }, { c: 0, m: 0.922, y: 0.424, k: 0 }], // Deep pink
    [{ r: 255, g: 215, b: 0 }, { c: 0, m: 0.157, y: 1, k: 0 }],      // Gold
    [{ r: 218, g: 165, b: 32 }, { c: 0, m: 0.243, y: 0.853, k: 0.145 }], // Goldenrod
    [{ r: 189, g: 183, b: 107 }, { c: 0, m: 0.032, y: 0.434, k: 0.259 }], // Dark khaki
    [{ r: 107, g: 142, b: 35 }, { c: 0.246, m: 0, y: 0.754, k: 0.443 }],  // Olive drab
    [{ r: 85, g: 107, b: 47 }, { c: 0.206, m: 0, y: 0.561, k: 0.58 }],    // Dark olive green
    [{ r: 144, g: 238, b: 144 }, { c: 0.395, m: 0, y: 0.395, k: 0.067 }], // Light green
    [{ r: 152, g: 251, b: 152 }, { c: 0.394, m: 0, y: 0.394, k: 0.016 }], // Pale green
    [{ r: 143, g: 188, b: 143 }, { c: 0.239, m: 0, y: 0.239, k: 0.263 }], // Dark sea green
    [{ r: 64, g: 224, b: 208 }, { c: 0.714, m: 0, y: 0.071, k: 0.122 }],  // Turquoise
    [{ r: 72, g: 209, b: 204 }, { c: 0.656, m: 0, y: 0.024, k: 0.18 }],   // Medium turquoise
    [{ r: 0, g: 206, b: 209 }, { c: 1, m: 0.014, y: 0, k: 0.18 }],        // Dark turquoise
    [{ r: 95, g: 158, b: 160 }, { c: 0.406, m: 0.012, y: 0, k: 0.373 }],  // Cadet blue
    [{ r: 176, g: 224, b: 230 }, { c: 0.235, m: 0.026, y: 0, k: 0.098 }], // Powder blue
    [{ r: 135, g: 206, b: 250 }, { c: 0.46, m: 0.176, y: 0, k: 0.02 }],   // Light sky blue
    [{ r: 100, g: 149, b: 237 }, { c: 0.578, m: 0.371, y: 0, k: 0.071 }], // Cornflower blue
    [{ r: 30, g: 144, b: 255 }, { c: 0.882, m: 0.435, y: 0, k: 0 }],      // Dodger blue
    [{ r: 65, g: 105, b: 225 }, { c: 0.711, m: 0.533, y: 0, k: 0.118 }],  // Royal blue
    [{ r: 25, g: 25, b: 112 }, { c: 0.777, m: 0.777, y: 0, k: 0.561 }],   // Midnight blue
    [{ r: 139, g: 69, b: 19 }, { c: 0, m: 0.504, y: 0.863, k: 0.455 }],   // Saddle brown
    [{ r: 205, g: 133, b: 63 }, { c: 0, m: 0.351, y: 0.693, k: 0.196 }],  // Peru
    [{ r: 245, g: 222, b: 179 }, { c: 0, m: 0.094, y: 0.269, k: 0.039 }], // Wheat
    [{ r: 255, g: 228, b: 196 }, { c: 0, m: 0.106, y: 0.231, k: 0 }],     // Bisque
    [{ r: 255, g: 218, b: 185 }, { c: 0, m: 0.145, y: 0.275, k: 0 }],     // Peach puff
    [{ r: 255, g: 228, b: 181 }, { c: 0, m: 0.106, y: 0.29, k: 0 }],      // Moccasin
    [{ r: 250, g: 235, b: 215 }, { c: 0, m: 0.06, y: 0.14, k: 0.02 }],    // Antique white
    [{ r: 255, g: 245, b: 238 }, { c: 0, m: 0.039, y: 0.067, k: 0 }],     // Seashell
    [{ r: 253, g: 245, b: 230 }, { c: 0, m: 0.032, y: 0.091, k: 0.008 }], // Old lace
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

test("lab2rgb - white should be r=255, g=255, b=255", () => {
  const rgb = lab2rgb({ l: 100, a: 0, b: 0 });
  assertAlmostEquals(rgb.r, 255, 0.01);
  assertAlmostEquals(rgb.g, 255, 0.01);
  assertAlmostEquals(rgb.b, 255, 0.01);
});

test("lab2rgb - black should be r=0, g=0, b=0", () => {
  const rgb = lab2rgb({ l: 0, a: 0, b: 0 });
  assertAlmostEquals(rgb.r, 0, 0.001);
  assertAlmostEquals(rgb.g, 0, 0.001);
  assertAlmostEquals(rgb.b, 0, 0.001);
});

test("lab2rgb - primary colors reference values", () => {
  // Red in D65 Lab: l≈53.23, a≈80.11, b≈67.22
  const red = lab2rgb({ l: 53.23, a: 80.11, b: 67.22 });
  assertAlmostEquals(red.r, 255, 1);
  assertAlmostEquals(red.g, 0, 1);
  assertAlmostEquals(red.b, 0, 2);

  // Green in D65 Lab: l≈87.74, a≈-86.18, b≈83.18
  const green = lab2rgb({ l: 87.74, a: -86.18, b: 83.18 });
  assertAlmostEquals(green.r, 0, 1);
  assertAlmostEquals(green.g, 255, 1);
  assertAlmostEquals(green.b, 0, 2);

  // Blue in D65 Lab: l≈32.30, a≈79.20, b≈-107.86
  const blue = lab2rgb({ l: 32.30, a: 79.20, b: -107.86 });
  assertAlmostEquals(blue.r, 0, 1);
  assertAlmostEquals(blue.g, 0, 1);
  assertAlmostEquals(blue.b, 255, 2);
});

test("rgb2lab -> lab2rgb round-trip", () => {
  // Test various colors including edge cases
  const testColors = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 128, g: 128, b: 128 },
    { r: 100, g: 150, b: 200 },
  ];

  for (const rgb of testColors) {
    const lab = rgb2lab(rgb);
    const back = lab2rgb(lab);
    assertAlmostEquals(back.r, rgb.r, 0.01, `r for ${JSON.stringify(rgb)}`);
    assertAlmostEquals(back.g, rgb.g, 0.01, `g for ${JSON.stringify(rgb)}`);
    assertAlmostEquals(back.b, rgb.b, 0.01, `b for ${JSON.stringify(rgb)}`);
  }
});

test("lab2rgb - mid gray reference", () => {
  // L=50 with a=0, b=0 should give a neutral gray
  const gray = lab2rgb({ l: 50, a: 0, b: 0 });
  // RGB values should be equal (neutral)
  expect(Math.abs(gray.r - gray.g) < 0.01).toBe(true);
  expect(Math.abs(gray.g - gray.b) < 0.01).toBe(true);
  // L=50 corresponds to approximately RGB 119 (perceptual middle gray)
  assertAlmostEquals(gray.r, 119, 1);
});

test("lab2rgb vs lab2lyz+xyz2rgb - direct path matches XYZ path", () => {
  // Compare direct lab2rgb with the longer lab→lyz→xyz→rgb path
  // Exhaustive test across all RGB values
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const lab = rgb2lab({ r, g, b });

        // Direct path: lab2rgb
        const direct = lab2rgb(lab);

        // XYZ path: lab2lyz → xyz2rgb
        const lyz = lab2lyz(lab);
        const viaXyz = xyz2rgb({ x: lyz.l, y: lyz.y, z: lyz.z });

        // Both paths should produce identical results
        assertAlmostEquals(direct.r, viaXyz.r, 0.0001);
        assertAlmostEquals(direct.g, viaXyz.g, 0.0001);
        assertAlmostEquals(direct.b, viaXyz.b, 0.0001);
      }
    }
  }
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
        const lab: LabD65 = { l, a, b };
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

// ============================================================================
// Lab D50 (CSS Color 4) Tests
// ============================================================================

test("rgb2labD50 - white should be L=100, a=0, b=0", () => {
  const lab = rgb2labD50({ r: 255, g: 255, b: 255 });
  assertAlmostEquals(lab.l, 100, 0.02, "White L should be 100");
  assertAlmostEquals(lab.a, 0, 0.02, "White a should be 0");
  assertAlmostEquals(lab.b, 0, 0.02, "White b should be 0");
});

test("rgb2labD50 - black should be L=0, a=0, b=0", () => {
  const lab = rgb2labD50({ r: 0, g: 0, b: 0 });
  assertAlmostEquals(lab.l, 0, 0.01, "Black L should be 0");
  assertAlmostEquals(lab.a, 0, 0.01, "Black a should be 0");
  assertAlmostEquals(lab.b, 0, 0.01, "Black b should be 0");
});

test("rgb2labD50 - primary colors reference values", () => {
  // Reference values from CSS Color 4 spec / colorjs.io
  // Red: lab(54.29% 80.81 69.89)
  const red = rgb2labD50({ r: 255, g: 0, b: 0 });
  assertAlmostEquals(red.l, 54.29, 0.5, "Red L");
  assertAlmostEquals(red.a, 80.81, 1, "Red a");
  assertAlmostEquals(red.b, 69.89, 1, "Red b");

  // Green: lab(87.82% -79.29 80.99)
  const green = rgb2labD50({ r: 0, g: 255, b: 0 });
  assertAlmostEquals(green.l, 87.82, 0.5, "Green L");
  assertAlmostEquals(green.a, -79.29, 1, "Green a");
  assertAlmostEquals(green.b, 80.99, 1, "Green b");

  // Blue: lab(29.57% 68.30 -112.03)
  const blue = rgb2labD50({ r: 0, g: 0, b: 255 });
  assertAlmostEquals(blue.l, 29.57, 0.5, "Blue L");
  assertAlmostEquals(blue.a, 68.30, 1, "Blue a");
  assertAlmostEquals(blue.b, -112.03, 1, "Blue b");
});

test("rgb2labD50 -> labD502rgb round-trip", () => {
  // Test round-trip for various colors
  const testColors: Rgb[] = [
    { r: 255, g: 0, b: 0 },     // Red
    { r: 0, g: 255, b: 0 },     // Green
    { r: 0, g: 0, b: 255 },     // Blue
    { r: 255, g: 255, b: 0 },   // Yellow
    { r: 255, g: 0, b: 255 },   // Magenta
    { r: 0, g: 255, b: 255 },   // Cyan
    { r: 128, g: 128, b: 128 }, // Mid-gray
    { r: 255, g: 255, b: 255 }, // White
    { r: 0, g: 0, b: 0 },       // Black
    { r: 100, g: 150, b: 200 }, // Arbitrary color
  ];

  for (const rgb of testColors) {
    const lab = rgb2labD50(rgb);
    const back = labD502rgb(lab);
    assertAlmostEquals(back.r, rgb.r, 0.5, `Round-trip r for ${JSON.stringify(rgb)}`);
    assertAlmostEquals(back.g, rgb.g, 0.5, `Round-trip g for ${JSON.stringify(rgb)}`);
    assertAlmostEquals(back.b, rgb.b, 0.5, `Round-trip b for ${JSON.stringify(rgb)}`);
  }
});

test("labD502rgb - reference values", () => {
  // lab(50% 0 0) should be mid-gray
  const gray = labD502rgb({ l: 50, a: 0, b: 0 });
  // L*=50 corresponds to Y ≈ 18.4%, which is approximately RGB 119
  assertAlmostEquals(gray.r, gray.g, 0.01, "Gray should have equal r and g");
  assertAlmostEquals(gray.g, gray.b, 0.01, "Gray should have equal g and b");
  expect(gray.r > 100 && gray.r < 140).toBe(true);
});

test("rgb2labD50 vs rgb2lab - should produce different values", () => {
  // D50 and D65 should give different Lab values for the same RGB
  const rgb = { r: 255, g: 128, b: 64 };
  const labD50 = rgb2labD50(rgb);
  const labD65 = rgb2lab(rgb);

  // They should NOT be equal (different white points)
  expect(Math.abs(labD50.a - labD65.a) > 1).toBe(true);
  expect(Math.abs(labD50.b - labD65.b) > 1).toBe(true);
});

test("LabD65 and LabD50 types - correct function pairing", () => {
  const rgb: Rgb = { r: 128, g: 64, b: 192 };

  // D65 path: rgb2lab returns LabD65, lab2rgb accepts LabD65
  const labD65: LabD65 = rgb2lab(rgb);
  const backD65: Rgb = lab2rgb(labD65);
  assertAlmostEquals(backD65.r, rgb.r, 0.01);
  assertAlmostEquals(backD65.g, rgb.g, 0.01);
  assertAlmostEquals(backD65.b, rgb.b, 0.01);

  // D50 path: rgb2labD50 returns LabD50, labD502rgb accepts LabD50
  const labD50: LabD50 = rgb2labD50(rgb);
  const backD50: Rgb = labD502rgb(labD50);
  assertAlmostEquals(backD50.r, rgb.r, 0.01);
  assertAlmostEquals(backD50.g, rgb.g, 0.01);
  assertAlmostEquals(backD50.b, rgb.b, 0.01);
});

// ============================================================================
// gray2cmyk Tests
// Reference: https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
// Formula: K = 1 - max(R', G', B') where R' = R/255
// Black (RGB 0,0,0): K = 1 - max(0,0,0) = 1 = 100%
// White (RGB 255,255,255): K = 1 - max(1,1,1) = 0 = 0%
// ============================================================================

test("gray2cmyk - black should have k=100", () => {
  // gray=0 means black, which in CMYK is k=100 (full black ink)
  // Per formula: K = 1 - max(0,0,0) = 1 = 100%
  const cmyk = gray2cmyk(0);
  expect(cmyk.c).toBe(0);
  expect(cmyk.m).toBe(0);
  expect(cmyk.y).toBe(0);
  expect(cmyk.k).toBe(100);
});

test("gray2cmyk - white should have k=0", () => {
  // gray=100 means white, which in CMYK is k=0 (no ink)
  const cmyk = gray2cmyk(100);
  expect(cmyk.c).toBe(0);
  expect(cmyk.m).toBe(0);
  expect(cmyk.y).toBe(0);
  expect(cmyk.k).toBe(0);
});

test("gray2cmyk - matches rgb2cmyk ground truth", () => {
  // Verify gray2cmyk produces same result as gray -> rgb -> cmyk
  // rgb2cmyk is the ground truth (already tested extensively)
  const grayLevels = [0, 10, 25, 50, 75, 90, 100];

  for (const g of grayLevels) {
    const directCmyk = gray2cmyk(g);
    const viaCmyk = rgb2cmyk(gray2rgb(g));

    assertAlmostEquals(directCmyk.c, viaCmyk.c, 0.01, `gray ${g}: c`);
    assertAlmostEquals(directCmyk.m, viaCmyk.m, 0.01, `gray ${g}: m`);
    assertAlmostEquals(directCmyk.y, viaCmyk.y, 0.01, `gray ${g}: y`);
    assertAlmostEquals(directCmyk.k, viaCmyk.k, 0.01, `gray ${g}: k`);
  }
});

test("gray2cmyk -> cmyk2rgb round-trip matches gray2rgb", () => {
  // Verify: gray -> cmyk -> rgb equals gray -> rgb
  const grayLevels = [0, 25, 50, 75, 100];

  for (const g of grayLevels) {
    const viaCmyk = cmyk2rgb(gray2cmyk(g));
    const direct = gray2rgb(g);

    assertAlmostEquals(viaCmyk.r, direct.r, 0.01, `gray ${g}: r`);
    assertAlmostEquals(viaCmyk.g, direct.g, 0.01, `gray ${g}: g`);
    assertAlmostEquals(viaCmyk.b, direct.b, 0.01, `gray ${g}: b`);
  }
});

test("gray2cmyk - formula is k = 100 - gray", () => {
  // Explicit formula verification
  for (let g = 0; g <= 100; g += 10) {
    const cmyk = gray2cmyk(g);
    expect(cmyk.k).toBe(100 - g);
  }
});

test("gray2cmyk - verified through independent conversion chains", () => {
  // Verify gray2cmyk produces same result as independent paths:
  // gray → hsl → rgb → cmyk
  // gray → hsv → rgb → cmyk
  // gray → hwb → rgb → cmyk
  // gray → lab → rgb → cmyk
  // These paths don't use gray2cmyk, so they independently verify correctness
  const grayLevels = [0, 25, 50, 75, 100];

  for (const g of grayLevels) {
    const direct = gray2cmyk(g);

    // Path 1: gray → hsl → rgb → cmyk
    const viaHsl = rgb2cmyk(hsl2rgb(gray2hsl(g)));
    assertAlmostEquals(direct.k, viaHsl.k, 0.01, `gray ${g} via HSL: k`);

    // Path 2: gray → hsv → rgb → cmyk
    const viaHsv = rgb2cmyk(hsv2rgb(gray2hsv(g)));
    assertAlmostEquals(direct.k, viaHsv.k, 0.01, `gray ${g} via HSV: k`);

    // Path 3: gray → hwb → rgb → cmyk
    const viaHwb = rgb2cmyk(hwb2rgb(gray2hwb(g)));
    assertAlmostEquals(direct.k, viaHwb.k, 0.01, `gray ${g} via HWB: k`);

    // Path 4: gray → lab → rgb → cmyk
    const viaLab = rgb2cmyk(lab2rgb(gray2lab(g)));
    assertAlmostEquals(direct.k, viaLab.k, 0.01, `gray ${g} via Lab: k`);

    // All C/M/Y should be 0 for grays
    assertAlmostEquals(direct.c, 0, 0.01, `gray ${g}: c should be 0`);
    assertAlmostEquals(direct.m, 0, 0.01, `gray ${g}: m should be 0`);
    assertAlmostEquals(direct.y, 0, 0.01, `gray ${g}: y should be 0`);
  }
});

// ============================================================================
// gray2lab Tests
// Reference: http://www.brucelindbloom.com/Eqn_XYZ_to_Lab.html
// L* = 116 × f(Y/Yn) - 16, where f(t) = t^(1/3) for t > ε
// L* is NOT linearly related to RGB due to the cube root transfer function
// ============================================================================

test("gray2lab - matches rgb2lab(gray2rgb) path", () => {
  // gray2lab must produce same result as gray → rgb → lab
  // This is the definition of correct behavior
  for (const g of [0, 10, 25, 50, 75, 90, 100]) {
    const direct = gray2lab(g);
    const viaRgb = rgb2lab(gray2rgb(g));

    assertAlmostEquals(direct.l, viaRgb.l, 0.001, `gray ${g}: L*`);
    assertAlmostEquals(direct.a, viaRgb.a, 0.001, `gray ${g}: a*`);
    assertAlmostEquals(direct.b, viaRgb.b, 0.001, `gray ${g}: b*`);
  }
});

test("gray2lab - L* uses cube root formula (not linear)", () => {
  // Verify L* is NOT equal to gray (except at endpoints)
  // L* = 116 × (Y)^(1/3) - 16 for the linear portion
  // gray=50 → RGB=127.5 → Y≈0.214 → L*≈53.39 (NOT 50!)
  const lab50 = gray2lab(50);
  expect(lab50.l > 52 && lab50.l < 55).toBe(true); // Should be ~53.39, not 50

  // Endpoints should match
  assertAlmostEquals(gray2lab(0).l, 0, 0.01, "black L*=0");
  assertAlmostEquals(gray2lab(100).l, 100, 0.01, "white L*=100");
});

test("gray2lab - neutrality (a=0, b=0)", () => {
  // All grays should be neutral (on the achromatic axis)
  for (const g of [0, 25, 50, 75, 100]) {
    const lab = gray2lab(g);
    assertAlmostEquals(lab.a, 0, 0.01, `gray ${g}: a* should be 0`);
    assertAlmostEquals(lab.b, 0, 0.01, `gray ${g}: b* should be 0`);
  }
});

test("gray2lab -> lab2rgb produces same RGB as gray2rgb", () => {
  // Round-trip consistency: gray → lab → rgb should equal gray → rgb
  for (const g of [0, 25, 50, 75, 100]) {
    const viaLab = lab2rgb(gray2lab(g));
    const direct = gray2rgb(g);

    assertAlmostEquals(viaLab.r, direct.r, 0.01, `gray ${g}: r`);
    assertAlmostEquals(viaLab.g, direct.g, 0.01, `gray ${g}: g`);
    assertAlmostEquals(viaLab.b, direct.b, 0.01, `gray ${g}: b`);
  }
});