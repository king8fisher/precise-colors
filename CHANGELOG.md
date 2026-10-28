# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/). Versions before 1.2.0 are described
only in the git history.

## [Unreleased]

### Changed

- **Breaking:** the package now has an `exports` map. `import` resolves to the
  ESM build and `require` to the CommonJS build, each with matching type
  declarations. Deep imports such as `precise-colors/dist/index.js` no longer
  resolve; import from `precise-colors` instead.
- **Breaking:** `hex2rgb` returns `null` for input that is not a valid hex
  colour (including non-strings), instead of black, so invalid input can no
  longer be mistaken for `#000000`. Its return type is now `Rgb | null`; use
  `hex2rgb(x) ?? fallback`, or `hex2rgb(x)!` when the input is known to be valid.
- `roundTo` rounds halves away from zero, so negative values mirror positive
  ones: `roundTo(-1.005, 2)` is now `-1.01` (was `-1`) and `roundTo(-2.5, 0)` is
  `-3` (was `-2`). This affects negative values printed by the `*2css`
  functions, such as Lab `a`/`b` in `labD502css`.
- `rgb2css`, `rgba2css` and `hsl2css` use the CSS Color 4 space-separated
  syntax, like the other `*2css` functions: `rgb(128 64 192)`,
  `rgb(128 64 192 / 0.5)` and `hsl(26.09deg 51.57% 43.73%)` instead of
  `rgb(128,64,192)`, `rgba(128,64,192,0.5)` and `hsl(26.09deg,51.57%,43.73%)`.
  Both forms are valid CSS. Update any code that parses or compares these
  strings. `rgb2str` still returns `"r,g,b"`.
- **Breaking (types):** `LabD65` and `LabD50` are now enforced. Passing D50
  Lab to a D65 function (or the reverse) is a compile error, as the README
  always claimed; in 1.x both types were silently assignable to each other.
  Plain `{ l, a, b }` objects are still accepted by either.
- **Breaking (types):** LCH is branded the same way. `Lch` is now an alias for
  the new `LchD65`, and `lchD502css` takes the new `LchD50`, so the common
  mistake `lchD502css(lab2lch(rgb2lab(rgb)))`, which printed D65 values as CSS
  `lch()` and gave a visibly different colour, no longer compiles. Use
  `lchD502css(labD502lch(rgb2labD50(rgb)))`.
- `deltaE76`, `deltaE94` and `deltaE2000` accept `LabD65` or `LabD50`, but both
  arguments must use the same illuminant.
- The brands are a type-only property under a `unique symbol` key. Generic code
  that requires every key of `LabD65` to be a number may need to skip symbol
  keys.
- `rgb2labD50` and `labD502rgb` now match CSS `lab()` exactly, and so do the
  `lab()`/`lch()` strings built from them with `labD502css`, `labD502lch` and
  `lchD502css`. They use the CSS Color 4 constants:
  D50 white from the chromaticity x=0.3457, y=0.3585 (X=96.4296, Z=82.5105,
  where 1.x used 96.422 and 82.521), and the spec's sRGB and Bradford matrices.
  Results move by up to 0.016 Lab units (up to 0.54 per channel back in RGB)
  and now agree with the CSS reference code to within 1e-12. D65 Lab is
  unchanged.
- Oklab uses the CSS Color 4 matrices (Ottosson's, as revised for CSS) with
  exact inverses. Oklab values move by at most 4e-8; white is now exactly
  `L = 1` (was 0.9999999935) and grays have `a`, `b` within 1e-15 of zero (was
  ~4e-8). `oklab2rgb` now matches the CSS reference conversion to ~1e-11 per
  channel (was 4e-4).

### Added

- `rgb2hsv`, a direct RGB → HSV conversion (previously only available through
  `hsl2hsv(rgb2hsl(rgb))`, which gives the same result).
- `labD502lch` and `lch2labD50`, with the `LchD50` and `LchD65` types, for CSS
  `lch()` values.

## [1.2.0] - 2026-10-28

### Added

- The package now includes this CHANGELOG.
- `rgb2str` takes an optional separator: `rgb2str(rgb, " ")` gives `"r g b"`.
  The default is still `","`.
- Every `*2css` function takes an optional `alpha` (`0..1`, printed with 2
  decimals). `rgb2css(rgb, 0.5)` returns `rgba(r,g,b,0.5)` and
  `hsl2css(hsl, 0.5)` returns `hsla(…,0.5)`; `hwb2css`, `oklab2css`,
  `oklch2css`, `labD502css` and `lchD502css` append ` / 0.5`. Without `alpha`
  the output is unchanged.

### Deprecated

- `rgba2css`: use `rgb2css(rgb, alpha)`, which returns the same string.
  `rgba2css` will be removed in 2.0.

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

- JSDoc links to the CSS Color 4 spec now point at sections that exist
  (`#lch-colors` and `#ok-lch` did not), the `*2css` functions link to the
  section defining their CSS function, and `rgb2css`, `rgba2css` and
  `hsl2css` gained links.
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
