import { assert, test } from "vitest";
import {
  Cmyk,
  hcg2rgb,
  Hsl,
  hsl2hcg,
  hsl2hsv,
  hsl2rgb,
  hsv2rgb,
  hwb2rgb,
  Lab,
  Rgb,
  rgb2cmyk,
  rgb2hex,
  rgb2hsl,
  rgb2hwb,
  rgb2lab,
  roundTo,
} from "./color";

export function assertAlmostEquals(
  actual: number,
  expected: number,
  tolerance = 1e-7,
  msg?: string,
) {
  if (Object.is(actual, expected)) {
    return;
  }
  const delta = Math.abs(expected - actual);
  if (delta <= tolerance) {
    return;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  const f = (n: number) => Number.isInteger(n) ? n : n.toExponential();
  assert.fail(
    `Expected actual: "${f(actual)}" to be close to "${f(expected)}": \
delta "${f(delta)}" is greater than "${f(tolerance)}"${msgSuffix}`,
  );
}

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

function assertAlmostEqualsHsl(a: Hsl, b: Hsl, tolerance: number) {
  assertAlmostEquals(a.h, b.h, tolerance);
  assertAlmostEquals(a.s, b.s, tolerance);
  assertAlmostEquals(a.l, b.l, tolerance);
}

function assertAlmostEqualsLab(a: Lab, b: Lab, tolerance: number) {
  assertAlmostEquals(a.l, b.l, tolerance);
  assertAlmostEquals(a.a, b.a, tolerance);
  assertAlmostEquals(a.b, b.b, tolerance);
}

function assertAlmostEqualsCmyk(a: Cmyk, b: Cmyk, tolerance: number) {
  assertAlmostEquals(a.c, b.c, tolerance);
  assertAlmostEquals(a.m, b.m, tolerance);
  assertAlmostEquals(a.y, b.y, tolerance);
  assertAlmostEquals(a.k, b.k, tolerance);
}

test("basics rgb -> hsl", () => {
  // Black
  assertAlmostEqualsHsl(
    rgb2hsl({ r: 0, g: 0, b: 0 }),
    { h: 0, s: 0, l: 0 },
    0.01,
  );
  // White
  assertAlmostEqualsHsl(rgb2hsl({ r: 255, g: 255, b: 255 }), {
    h: 0,
    s: 0,
    l: 100,
  }, 0.01);
  // Red
  assertAlmostEqualsHsl(rgb2hsl({ r: 255, g: 0, b: 0 }), {
    h: 0,
    s: 100,
    l: 50,
  }, 0.01);
  // Lime
  assertAlmostEqualsHsl(rgb2hsl({ r: 0, g: 255, b: 0 }), {
    h: 120,
    s: 100,
    l: 50,
  }, 0.01);
  // Blue
  assertAlmostEqualsHsl(rgb2hsl({ r: 0, g: 0, b: 255 }), {
    h: 240,
    s: 100,
    l: 50,
  }, 0.01);
  // Yellow
  assertAlmostEqualsHsl(rgb2hsl({ r: 255, g: 255, b: 0 }), {
    h: 60,
    s: 100,
    l: 50,
  }, 0.01);
  // Cyan
  assertAlmostEqualsHsl(rgb2hsl({ r: 0, g: 255, b: 255 }), {
    h: 180,
    s: 100,
    l: 50,
  }, 0.01);
  // Magenta
  assertAlmostEqualsHsl(rgb2hsl({ r: 255, g: 0, b: 255 }), {
    h: 300,
    s: 100,
    l: 50,
  }, 0.01);
  // Silver
  assertAlmostEqualsHsl(rgb2hsl({ r: 191, g: 191, b: 191 }), {
    h: 0,
    s: 0,
    l: 74.9,
  }, 0.01);
  // Gray
  assertAlmostEqualsHsl(rgb2hsl({ r: 128, g: 128, b: 128 }), {
    h: 0,
    s: 0,
    l: 50.2,
  }, 0.01);
  // Maroon
  assertAlmostEqualsHsl(rgb2hsl({ r: 128, g: 0, b: 0 }), {
    h: 0,
    s: 100,
    l: 25.1,
  }, 0.01);
  // Olive
  assertAlmostEqualsHsl(rgb2hsl({ r: 128, g: 128, b: 0 }), {
    h: 60,
    s: 100,
    l: 25.1,
  }, 0.01);
  // Green
  assertAlmostEqualsHsl(rgb2hsl({ r: 0, g: 128, b: 0 }), {
    h: 120,
    s: 100,
    l: 25.1,
  }, 0.01);
  // Purple
  assertAlmostEqualsHsl(rgb2hsl({ r: 128, g: 0, b: 128 }), {
    h: 300,
    s: 100,
    l: 25.1,
  }, 0.01);
  // Teal
  assertAlmostEqualsHsl(rgb2hsl({ r: 0, g: 128, b: 128 }), {
    h: 180,
    s: 100,
    l: 25.1,
  }, 0.01);
  // Navy
  assertAlmostEqualsHsl(rgb2hsl({ r: 0, g: 0, b: 128 }), {
    h: 240,
    s: 100,
    l: 25.1,
  }, 0.01);
});

test("rgb to all", () => {
  const rgb = { r: 169, g: 104, b: 54 };
  assertAlmostEqualsHsl(rgb2hsl(rgb), { h: 26.09, s: 51.57, l: 43.73 }, 0.01);
  assertAlmostEqualsCmyk(
    rgb2cmyk(rgb),
    { c: 0, m: 38.46, y: 68.05, k: 33.73 },
    0.01,
  );
  assertAlmostEqualsLab(rgb2lab(rgb), { l: 50.22, a: 21.47, b: 38.39 }, 0.01);
});

test("rgb to hex", () => {
  const rgb = { r: 169, g: 104, b: 54 };
  assert.deepEqual(rgb2hex(rgb), "a96836");
  assert.deepEqual(rgb2hex({ r: 0, g: 0, b: 0 }), "000000");
});
