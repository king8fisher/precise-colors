import { assert, test } from "vitest";
import {
  Cmyk,
  hcg2rgb,
  hsl2hcg,
  hsl2hsv,
  hsl2rgb,
  hsv2rgb,
  hwb2rgb,
  Rgb,
  rgb2cmyk,
  rgb2hex,
  rgb2hsl,
  rgb2hwb,
  rgb2lab,
  roundTo
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

test("rgb -> lab", () => {
  for (let r = 0; r < 256; r++) {
    for (let g = 0; g < 256; g++) {
      for (let b = 0; b < 256; b++) {
        const _rgb: Rgb = { r: r, g: g, b: b };
        // const bRgb = xyz2rgb(xyz)
        // assertAlmostEquals(bRgb.r, rgb.r);
        // assertAlmostEquals(bRgb.g, rgb.g);
        // assertAlmostEquals(bRgb.b, rgb.b);
        // assertAlmostEquals(bLab.l, lab.l);
        // assertAlmostEquals(bLab.a, lab.a);
        // assertAlmostEquals(bLab.b, lab.b);
        // const bRgb = xyz2rgb(xyz);
      }
    }
  }
});

test("roundTo", () => {
  assert.deepEqual(roundTo(10, 2), 10);
  assert.deepEqual(roundTo(1.7777, 2), 1.78);
  assert.deepEqual(roundTo(1.005, 2), 1.01);
  assert.deepEqual(roundTo(1.005, 0), 1);
  assert.deepEqual(roundTo(1.77777, 1), 1.8);
  assert.deepEqual(roundTo(10, 1), 10);
  assert.deepEqual(roundTo(10, 0), 10);
  assert.deepEqual(roundTo(-10, 0), -10);
  assert.deepEqual(roundTo(1.3549999999999998, 0), 1);
  assert.deepEqual(roundTo(1.3549999999999998, 1), 1.4);
  assert.deepEqual(roundTo(1.3549999999999998, 2), 1.35);
  assert.deepEqual(roundTo(1.3549999999999998, 3), 1.355);
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
  assert.deepEqual(rgb2hex(rgb), "a96836");
  assert.deepEqual(rgb2hex({ r: 0, g: 0, b: 0 }), "000000");
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