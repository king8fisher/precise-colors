import { test, expect } from "bun:test";
import colorName from "color-name";
import {
  rgb2hsl,
  hsl2rgb,
  rgb2hwb,
  hwb2rgb,
  rgb2hex,
} from "./color";
import { assertAlmostEqualsColor } from "./helpers";
import { CssNamedColors } from "./css-named-colors";

test("CSS named colors count", () => {
  expect(Object.keys(CssNamedColors).length).toBe(148);
});

test("CSS named colors RGB -> HSL -> RGB round-trip", () => {
  for (const [name, rgb] of Object.entries(CssNamedColors)) {
    const hsl = rgb2hsl(rgb);
    const back = hsl2rgb(hsl);
    assertAlmostEqualsColor(back, rgb, 1, `${name}: RGB->HSL->RGB`);
  }
});

test("CSS named colors RGB -> HWB -> RGB round-trip", () => {
  for (const [name, rgb] of Object.entries(CssNamedColors)) {
    const hwb = rgb2hwb(rgb);
    const back = hwb2rgb(hwb);
    assertAlmostEqualsColor(back, rgb, 1, `${name}: RGB->HWB->RGB`);
  }
});

test("CSS primary colors hex values", () => {
  expect(rgb2hex(CssNamedColors.red)).toBe("ff0000");
  expect(rgb2hex(CssNamedColors.green)).toBe("008000");
  expect(rgb2hex(CssNamedColors.blue)).toBe("0000ff");
  expect(rgb2hex(CssNamedColors.white)).toBe("ffffff");
  expect(rgb2hex(CssNamedColors.black)).toBe("000000");
  expect(rgb2hex(CssNamedColors.rebeccapurple)).toBe("663399");
});

test("CSS gray variants produce zero saturation", () => {
  // Pure grays should have s=0 in HSL
  const pureGrays = [
    CssNamedColors.gray,
    CssNamedColors.darkgray,
    CssNamedColors.dimgray,
    CssNamedColors.lightgray,
    CssNamedColors.gainsboro,
    CssNamedColors.silver,
    CssNamedColors.white,
    CssNamedColors.black,
    CssNamedColors.whitesmoke,
  ];
  for (const rgb of pureGrays) {
    const hsl = rgb2hsl(rgb);
    expect(hsl.s).toBe(0);
  }
});

test("CSS cyan/aqua and fuchsia/magenta are identical", () => {
  expect(CssNamedColors.cyan).toEqual(CssNamedColors.aqua);
  expect(CssNamedColors.fuchsia).toEqual(CssNamedColors.magenta);
});

test("CSS named colors HSL values for primary colors", () => {
  // Red: hsl(0, 100%, 50%)
  const redHsl = rgb2hsl(CssNamedColors.red);
  expect(redHsl.h).toBe(0);
  expect(redHsl.s).toBe(100);
  expect(redHsl.l).toBe(50);

  // Lime (CSS green is #008000, lime is #00ff00): hsl(120, 100%, 50%)
  const limeHsl = rgb2hsl(CssNamedColors.lime);
  expect(limeHsl.h).toBe(120);
  expect(limeHsl.s).toBe(100);
  expect(limeHsl.l).toBe(50);

  // Blue: hsl(240, 100%, 50%)
  const blueHsl = rgb2hsl(CssNamedColors.blue);
  expect(blueHsl.h).toBe(240);
  expect(blueHsl.s).toBe(100);
  expect(blueHsl.l).toBe(50);

  // Yellow: hsl(60, 100%, 50%)
  const yellowHsl = rgb2hsl(CssNamedColors.yellow);
  expect(yellowHsl.h).toBe(60);
  expect(yellowHsl.s).toBe(100);
  expect(yellowHsl.l).toBe(50);

  // Cyan: hsl(180, 100%, 50%)
  const cyanHsl = rgb2hsl(CssNamedColors.cyan);
  expect(cyanHsl.h).toBe(180);
  expect(cyanHsl.s).toBe(100);
  expect(cyanHsl.l).toBe(50);

  // Magenta: hsl(300, 100%, 50%)
  const magentaHsl = rgb2hsl(CssNamedColors.magenta);
  expect(magentaHsl.h).toBe(300);
  expect(magentaHsl.s).toBe(100);
  expect(magentaHsl.l).toBe(50);
});

test("CSS named colors grayscale HSL values", () => {
  // White: hsl(0, 0%, 100%)
  const whiteHsl = rgb2hsl(CssNamedColors.white);
  expect(whiteHsl.s).toBe(0);
  expect(whiteHsl.l).toBe(100);

  // Black: hsl(0, 0%, 0%)
  const blackHsl = rgb2hsl(CssNamedColors.black);
  expect(blackHsl.s).toBe(0);
  expect(blackHsl.l).toBe(0);

  // Gray (128,128,128): hsl(0, 0%, ~50%)
  const grayHsl = rgb2hsl(CssNamedColors.gray);
  expect(grayHsl.s).toBe(0);
  expect(Math.round(grayHsl.l)).toBe(50);

  // Silver (192,192,192): hsl(0, 0%, ~75%)
  const silverHsl = rgb2hsl(CssNamedColors.silver);
  expect(silverHsl.s).toBe(0);
  expect(Math.round(silverHsl.l)).toBe(75);
});

test("CSS_NAMED_COLORS matches color-name package", () => {
  // Cross-validate our manually entered values against authoritative source
  const colorNameKeys = Object.keys(colorName);

  // Same count
  expect(Object.keys(CssNamedColors).length).toBe(colorNameKeys.length);

  // All names present and values match
  for (const name of colorNameKeys) {
    const theirs = colorName[name as keyof typeof colorName];
    const ours = CssNamedColors[name];
    expect(ours).toBeDefined();
    expect(ours.r).toBe(theirs[0]);
    expect(ours.g).toBe(theirs[1]);
    expect(ours.b).toBe(theirs[2]);
  }
});