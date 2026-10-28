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
