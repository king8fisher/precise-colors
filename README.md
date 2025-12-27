[![npm version](https://img.shields.io/npm/v/precise-colors?logo=npm&labelColor=black&color=07293F)](https://npmjs.com/package/precise-colors)

# precise-colors

High-precision color space conversions without intermediate rounding (except `*2css`, `*2str`, `*2hex` output functions).

## Goals

* Chain multiple conversions
  * Round only at the end using `Math.round` or provided `roundTo`, `*2css`, `*2hex` functions.
* Make it clear in JSDoc the _input/output ranges_ the user operates on and `{@link Type}` references
for IDE navigation, preserved in `.d.ts` files.
* Type-safe Lab illuminants: `LabD65` (traditional) and `LabD50` ([CSS Color 4](https://www.w3.org/TR/css-color-4/#lab-colors)) prevent accidentally mixing values at compile time.

## Install

```bash
npm install precise-colors
```

## Usage

```ts
import { rgb2lab, lab2lch, lch2lab, lab2lyz, xyz2rgb, roundTo, rgb2css } from 'precise-colors'

const original = { r: 128, g: 64, b: 192 }

// RGB → Lab → LCH → Lab → XYZ → RGB round-trip
const lab = rgb2lab(original)           // { l: 41.31, a: 51.57, b: -56.63 }
const lch = lab2lch(lab)                // { l: 41.31, c: 76.59, h: 312.33 }
const backToLab = lch2lab(lch)
const xyz = lab2lyz(backToLab)
const rgb = xyz2rgb({ x: xyz.l, y: xyz.y, z: xyz.z })

// rgb = { r: 127.999997, g: 64.000014, b: 192.000002 }
// Error: ~0.00001 per channel

// Final step: round to integers or use output functions
Math.round(rgb.r)        // 128
roundTo(rgb.r, 2)        // 128.00 (avoids floating-point errors)
rgb2css(rgb)             // "rgb(128,64,192)"
```

## Supported Color Spaces

| Space  | Range                        | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| RGB    | r,g,b: 0-255                 | sRGB (8-bit)                     |
| HSL    | h: 0-360, s,l: 0-100         | Hue, Saturation, Lightness       |
| HSV    | h: 0-360, s,v: 0-100         | Hue, Saturation, Value           |
| HWB    | h: 0-360, w,b: 0-100         | Hue, Whiteness, Blackness        |
| HCG    | h: 0-360, c,g: 0-100         | Hue, Chroma, Grayness            |
| CMYK   | c,m,y,k: 0-100               | Cyan, Magenta, Yellow, Key       |
| LabD65 | L: 0-100, a,b: ±128          | CIE L\*a\*b\* (D65)              |
| LabD50 | L: 0-100, a,b: ±128          | CIE L\*a\*b\* (D50, CSS Color 4) |
| LCH    | L: 0-100, C: 0-230, H: 0-360 | CIE LCH (cylindrical Lab)        |
| XYZ    | x: 0-95, y: 0-100, z: 0-109  | CIE XYZ (D65)                    |
| Apple  | r16,g16,b16: 0-65535         | Apple 16-bit RGB                 |
| Gray   | 0-100                        | Grayscale                        |

## Conversion Matrix

⤴ = row to column, ⤶ = column to row

|        | RGB | HSL | HSV | HWB | HCG | CMYK | LabD65 | LabD50 | LCH | XYZ | Apple | Gray |
| ------ | --- | --- | --- | --- | --- | ---- | ------ | ------ | --- | --- | ----- | ---- |
| RGB    | ⟍   | ⤴⤶  | ⤶   | ⤴⤶  | ⤶   | ⤴⤶   | ⤴⤶     | ⤴⤶     |     | ⤴⤶  | ⤶     |      |
| HSL    | ⤴⤶  | ⟍   | ⤴⤶  |     | ⤴⤶  |      |        |        |     |     |       |      |
| HSV    | ⤴   | ⤴⤶  | ⟍   |     | ⤴⤶  |      |        |        |     |     |       |      |
| HWB    | ⤴⤶  |     |     | ⟍   | ⤴⤶  |      |        |        |     |     |       |      |
| HCG    | ⤴   | ⤴⤶  | ⤴⤶  | ⤴⤶  | ⟍   |      |        |        |     |     |       |      |
| CMYK   | ⤴⤶  |     |     |     |     | ⟍    |        |        |     |     |       |      |
| LabD65 | ⤴⤶  |     |     |     |     |      | ⟍      |        | ⤴⤶  | ⤴⤶  |       |      |
| LabD50 | ⤴⤶  |     |     |     |     |      |        | ⟍      |     |     |       |      |
| LCH    |     |     |     |     |     |      | ⤴⤶     |        | ⟍   |     |       |      |
| XYZ    | ⤴⤶  |     |     |     |     |      | ⤴⤶     |        |     | ⟍   |       |      |
| Apple  | ⤴   |     |     |     |     |      |        |        |     |     | ⟍     |      |
| Gray   | ⤴   | ⤴   | ⤴   | ⤴   |     | ⤴    | ⤴      |        |     |     |       | ⟍    |

## Precision

Round-trip precision verified across all 16,777,216 RGB colors:

| Conversion      | Max Error |
| --------------- | --------- |
| RGB → HSL → RGB | < 0.01    |
| RGB → HSV → RGB | < 0.01    |
| RGB → HWB → RGB | < 0.01    |
| RGB → HCG → RGB | < 0.01    |
| RGB → Lab → RGB | < 0.001   |
| Lab → LCH → Lab | < 1e-6    |

## Standards Compliance

- **CIE Lab**: Exact rational constants per CIE 15.3 (`ε = 216/24389`, `κ = 24389/27`)
- **D65 white point**: X=95.047, Y=100, Z=108.883
- **D50 white point**: X=96.422, Y=100, Z=82.521 (CSS Color 4)
- **sRGB↔XYZ**: IEC 61966-2-1 matrices (D65 native, D50 Bradford-adapted)

## CSS Color 4 Compatibility

Use `rgb2labD50` / `labD502rgb` for Lab values matching CSS `lab()` function:

```ts
import { rgb2labD50, labD502rgb, LabD50 } from 'precise-colors'

// CSS Color 4 uses D50 white point
const lab: LabD50 = rgb2labD50({ r: 255, g: 0, b: 0 })
// → { l: 54.29, a: 80.81, b: 69.89 }

// Convert back
const rgb = labD502rgb({ l: 50, a: 0, b: 0 })
// → { r: 119, g: 119, b: 119 } (mid-gray)
```

Note: `rgb2lab` uses D65 (traditional), `rgb2labD50` uses D50 (CSS Color 4).

## Type Safety

`LabD65` and `LabD50` are branded types that prevent mixing illuminants:

```ts
import { rgb2labD65, labD652rgb, rgb2labD50, labD502rgb, LabD65, LabD50 } from 'precise-colors'

const labD65: LabD65 = rgb2labD65({ r: 255, g: 0, b: 0 })
const labD50: LabD50 = rgb2labD50({ r: 255, g: 0, b: 0 })

labD652rgb(labD65) // ✓ Correct: D65 → D65 function
labD502rgb(labD50) // ✓ Correct: D50 → D50 function

// labD652rgb(labD50) // ✗ TypeScript error: LabD50 not assignable to LabD65
// labD502rgb(labD65) // ✗ TypeScript error: LabD65 not assignable to LabD50
```

`Lab` is an alias for `LabD65`. Similarly, `rgb2lab`/`lab2rgb` are aliases for `rgb2labD65`/`labD652rgb`.

## Converting Between LabD65 and LabD50

To convert between illuminants, go through RGB:

```ts
import { labD652rgb, rgb2labD50, labD502rgb, rgb2labD65, LabD65, LabD50 } from 'precise-colors'

// LabD65 → LabD50
function labD65toD50(lab: LabD65): LabD50 {
  return rgb2labD50(labD652rgb(lab))
}

// LabD50 → LabD65
function labD50toD65(lab: LabD50): LabD65 {
  return rgb2labD65(labD502rgb(lab))
}

// Example: same RGB color, different Lab representations
const labD65 = rgb2labD65({ r: 255, g: 128, b: 64 })
const labD50 = labD65toD50(labD65)
// labD65: { l: 67.33, a: 44.14, b: 55.35 }
// labD50: { l: 68.05, a: 46.41, b: 56.40 }
```

This approach guarantees round-trip consistency with sRGB and avoids additional error from separate chromatic adaptation.
