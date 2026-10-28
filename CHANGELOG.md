# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/). Versions before 1.1.1 are described
only in the git history.

## [Unreleased]

### Fixed

- `require("precise-colors")` failed with `ERR_REQUIRE_ESM` on Node 18, because
  `main` pointed at the ESM build. `main` now points at the CommonJS build, and
  `module` points at the ESM build (it named `dist/index.mjs`, which was never
  published).
- `rgb2hex` and `gray2hex` produced malformed strings for channels outside
  `[0..255]` (e.g. `{ r: -3 }` gave `"-30000"`, `{ r: 256 }` gave `"1000000"`).
  Channels are now clamped, so out-of-gamut results such as
  `rgb2hex(lab2rgb({ l: 60, a: 120, b: 100 }))` give `"ff0000"`.
- `hex2rgb` misread common hex formats: `"#3399cc"` and `"#39c"` returned black,
  `"fff"` returned `{ r: 0, g: 15, b: 255 }`, and `"3399ccff"` shifted the
  channels. It now accepts an optional `#`, 3- and 6-digit forms, and 4- and
  8-digit forms (the alpha byte is ignored). Malformed input such as `"12zz56"`
  now returns black instead of a partly parsed colour.
- `hwb2css` returned comma-separated `hwb(0deg,0%,0%)`, which browsers reject:
  CSS `hwb()` has no comma syntax. It now returns `hwb(0deg 0% 0%)`.
- `hwb2hcg` returned negative chroma when whiteness + blackness exceeded 100,
  so `hwb2hcg({ h: 0, w: 100, b: 100 })` described cyan instead of 50% gray.
  It now normalizes w and b the same way `hwb2rgb` (and CSS) do.
- `hsl2rgb` and `hwb2rgb` returned wrong colours for hues outside `[0, 360]`
  (e.g. `hsl2rgb({ h: 720, s: 100, l: 50 })` gave black, and
  `hwb2rgb({ h: -30, w: 0, b: 0 })` gave orange instead of pink). Hues now wrap,
  as they already did in `hsv2rgb` and `hcg2rgb`.
- `modulo` no longer loses precision on values that are already in range:
  `modulo(0.1, 360)` returned `0.10000000000002274` and now returns `0.1`.
- `roundTo` mishandled numbers that JavaScript prints in exponent form:
  `roundTo(5e-7, 6)` returned `0` instead of `0.000001`, and `roundTo(1e21, 2)`
  and `roundTo(Infinity, 2)` returned `NaN`.
- Converting back to RGB (`xyz2rgb`, `lab2rgb`, `labD502rgb`, `oklab2rgb`,
  `oklch2rgb`) used published inverse matrices that are rounded separately from
  the forward ones, so round trips such as `lab2rgb(rgb2lab(rgb))` drifted by up
  to 4e-4 per channel. The inverses are now exact, and round trips are accurate
  to about 1e-11. The forward conversions are unchanged.
- `oklch2css` and `lchD502css` printed a meaningless hue for grays, e.g.
  `oklch(1 0 89.88)` for white. When the printed chroma is 0, the hue is now
  printed as 0. The rendered colour is the same.

### Documentation

- Corrected README examples whose outputs were wrong: `rgb2oklab` /
  `rgb2oklch` of `{ r: 255, g: 128, b: 64 }`, the ΔE values for red vs orange,
  and `lab2rgb(lch2lab({ l: 50, c: 40, h: 270 }))`.
- `lchD502css` needs LCH computed from D50 Lab
  (`lchD502css(lab2lch(rgb2labD50(rgb)))`); the README and JSDoc now say so.
- The README claimed that `LabD65` and `LabD50` stop you mixing illuminants at
  compile time. They don't in 1.x, and the README now says so.
- `rgb2labD50` / `labD502rgb` are now described as compatible with CSS `lab()`
  rather than matching it: they agree with the CSS Color 4 reference conversion
  to within 0.02 Lab units (0.6 per channel back in RGB).
