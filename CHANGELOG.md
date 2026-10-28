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
