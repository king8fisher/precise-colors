/**
 * CMYK color model (Cyan, Magenta, Yellow, Key/Black).
 * @property {number} c - Cyan `[0..100]`
 * @property {number} m - Magenta `[0..100]`
 * @property {number} y - Yellow `[0..100]`
 * @property {number} k - Key/Black `[0..100]`
 * @see {@link https://en.wikipedia.org/wiki/CMYK_color_model|Wikipedia}
 */
export interface Cmyk {
  /** Cyan `[0..100]` */
  readonly c: number;
  /** Magenta `[0..100]` */
  readonly m: number;
  /** Yellow `[0..100]` */
  readonly y: number;
  /** Key/Black `[0..100]` */
  readonly k: number;
}

/**
 * Apple 16-bit RGB color.
 * @property {number} r16 - Red `[0..65535]`
 * @property {number} g16 - Green `[0..65535]`
 * @property {number} b16 - Blue `[0..65535]`
 * @see {@link https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/ConvertRGBtoHTMLColor.html|Apple RGB}
 */
export interface Apple {
  /** Red `[0..65535]` */
  readonly r16: number;
  /** Green `[0..65535]` */
  readonly g16: number;
  /** Blue `[0..65535]` */
  readonly b16: number;
}

/**
 * sRGB color model (8-bit per channel).
 * @property {number} r - Red `[0..255]`
 * @property {number} g - Green `[0..255]`
 * @property {number} b - Blue `[0..255]`
 * @see {@link https://www.color.org/srgb.pdf|ICC sRGB Specification}
 */
export interface Rgb {
  /** Red `[0..255]` */
  readonly r: number;
  /** Green `[0..255]` */
  readonly g: number;
  /** Blue `[0..255]` */
  readonly b: number;
}

/**
 * HSL cylindrical color model (Hue, Saturation, Lightness).
 * @property {number} h - Hue `[0..360]`
 * @property {number} s - Saturation `[0..100]`
 * @property {number} l - Lightness `[0..100]`
 * @see {@link https://www.w3.org/TR/css-color-4/#the-hsl-notation|W3C CSS Color 4}
 */
export interface Hsl {
  /** Hue angle `[0..360]` */
  readonly h: number;
  /** Saturation `[0..100]` */
  readonly s: number;
  /** Lightness `[0..100]` */
  readonly l: number;
}

/**
 * HSV/HSB cylindrical color model (Hue, Saturation, Value/Brightness).
 * @property {number} h - Hue `[0..360]`
 * @property {number} s - Saturation `[0..100]`
 * @property {number} v - Value `[0..100]`
 * @see {@link https://en.wikipedia.org/wiki/HSL_and_HSV|Wikipedia}
 */
export interface Hsv {
  /** Hue angle `[0..360]` */
  readonly h: number;
  /** Saturation `[0..100]` */
  readonly s: number;
  /** Value/Brightness `[0..100]` */
  readonly v: number;
}

/**
 * HCG color model (Hue, Chroma, Grayness).
 * Derived from the Munsell color system.
 * @property {number} h - Hue `[0..360]`
 * @property {number} c - Chroma `[0..100]`
 * @property {number} g - Grayness `[0..100]`
 * @see {@link https://github.com/d3/d3-hcg|d3-hcg}
 */
export interface Hcg {
  /** Hue angle `[0..360]` */
  readonly h: number;
  /** Chroma `[0..100]` */
  readonly c: number;
  /** Grayness `[0..100]` */
  readonly g: number;
}

/**
 * HWB color model (Hue, Whiteness, Blackness).
 * @property {number} h - Hue `[0..360]`
 * @property {number} w - Whiteness `[0..100]`
 * @property {number} b - Blackness `[0..100]`
 * @see {@link https://www.w3.org/TR/css-color-4/#the-hwb-notation|W3C CSS Color 4}
 */
export interface Hwb {
  /** Hue angle `[0..360]` */
  readonly h: number;
  /** Whiteness `[0..100]` */
  readonly w: number;
  /** Blackness `[0..100]` */
  readonly b: number;
}

/**
 * Base Lab color values without illuminant branding.
 * Use {@link LabD65} or {@link LabD50} for type-safe illuminant handling.
 */
interface LabBase {
  /** Lightness `[0..100]` */
  readonly l: number;
  /** Green (-) to Red (+) axis. Clamped `[-128..127]`, theoretical `~[-430..+172]` */
  readonly a: number;
  /** Blue (-) to Yellow (+) axis. Clamped `[-128..127]`, theoretically unbounded */
  readonly b: number;
}

/** Brand symbol for D65 illuminant */
declare const D65Brand: unique symbol;
/** Brand symbol for D50 illuminant */
declare const D50Brand: unique symbol;

/**
 * CIE L*a*b* color with D65 illuminant (traditional Lab).
 *
 * Used by: {@link rgb2lab}, {@link lab2rgb}, {@link lab2lyz}, {@link lab2lch}, {@link lch2lab}
 *
 * @see {@link https://en.wikipedia.org/wiki/CIELAB_color_space|Wikipedia}
 */
export interface LabD65 extends LabBase {
  /** Type brand for D65 illuminant (compile-time only) */
  readonly [D65Brand]?: never;
}

/**
 * CIE L*a*b* color with D50 illuminant (CSS Color 4 compatible).
 *
 * Used by: {@link rgb2labD50}, {@link labD502rgb}
 *
 * @see {@link https://www.w3.org/TR/css-color-4/#lab-colors|W3C CSS Color 4}
 */
export interface LabD50 extends LabBase {
  /** Type brand for D50 illuminant (compile-time only) */
  readonly [D50Brand]?: never;
}

/**
 * Alias for {@link LabD65}.
 */
export type Lab = LabD65;

/**
 * CIE XYZ tristimulus color space with D65 illuminant.
 * @property {number} x - X tristimulus `[0..95.047]`
 * @property {number} y - Y luminance `[0..100]`
 * @property {number} z - Z tristimulus `[0..108.883]`
 * @see {@link https://en.wikipedia.org/wiki/CIE_1931_color_space|Wikipedia CIE 1931}
 * @see {@link https://en.wikipedia.org/wiki/Standard_illuminant#Illuminant_series_D|D65 Illuminant}
 */
export interface Xyz {
  /** X tristimulus `[0..95.047]` for D65 white */
  readonly x: number;
  /** Y tristimulus (luminance) `[0..100]` */
  readonly y: number;
  /** Z tristimulus `[0..108.883]` for D65 white */
  readonly z: number;
}

/**
 * XYZ values from Lab conversion (named Lyz to avoid confusion).
 * Uses D65 illuminant reference white.
 * @property {number} l - X tristimulus `[0..95.047]`
 * @property {number} y - Y luminance `[0..100]`
 * @property {number} z - Z tristimulus `[0..108.883]`
 * @see {@link https://en.wikipedia.org/wiki/Standard_illuminant#Illuminant_series_D|D65 Illuminant}
 */
export interface Lyz {
  /** X tristimulus `[0..95.047]` for D65 */
  readonly l: number;
  /** Y tristimulus `[0..100]` */
  readonly y: number;
  /** Z tristimulus `[0..108.883]` for D65 */
  readonly z: number;
}

/**
 * CIE LCH cylindrical color space (Lightness, Chroma, Hue).
 * Polar representation of L*a*b*.
 * @property {number} l - Lightness `[0..100]`
 * @property {number} c - Chroma `[0..~230]`
 * @property {number} h - Hue `[0..360]`
 * @see {@link https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model|Wikipedia}
 * @see {@link https://www.w3.org/TR/css-color-4/#lch-colors|W3C CSS Color 4}
 */
export interface Lch {
  /** Lightness `[0..100]` */
  readonly l: number;
  /** Chroma `[0..~230]`. Theoretically unbounded, sRGB max ~131 */
  readonly c: number;
  /** Hue angle `[0..360]` */
  readonly h: number;
}

/**
 * Rounds a number to specified decimal places.
 * Uses exponential notation to avoid floating-point errors
 * (e.g., `1.005 * 100 = 100.49999...` but `roundTo(1.005, 2) = 1.01`).
 * @param num - Number to round
 * @param places - Decimal places `[0..]`
 * @returns Rounded number
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed|Number.toFixed} for string output
 */
export function roundTo(num: number, places: number) {
  return +(Math.round(parseFloat(num.toString() + "e+" + places)) + "e-" +
    places);
}

/**
 * Modulo operation that always returns positive result.
 * @param x - Dividend
 * @param n - Divisor
 * @returns `x mod n`, always positive
 */
export function modulo(x: number, n: number): number {
  return ((x % n) + n) % n;
}

/**
 * Converts {@link Rgb} to CSS rgb() string.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns CSS string `"rgb(r,g,b)"` (rounded)
 */
export function rgb2css(rgb: Rgb): string {
  return `rgb(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)})`;
}

/**
 * Converts {@link Rgb} to comma-separated string.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns String `"r,g,b"` (rounded)
 */
export function rgb2str(rgb: Rgb): string {
  return `${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)}`;
}

/**
 * Converts {@link Rgb} and alpha to CSS rgba() string.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @param alpha - Alpha `[0..1]`
 * @returns CSS string `"rgba(r,g,b,a)"` (rounded)
 */
export function rgba2css(rgb: Rgb, alpha: number): string {
  return `rgba(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)},${roundTo(alpha, 2)
    })`;
}

/**
 * Converts {@link Hsl} to CSS hsl() string.
 * @param hsl - {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 * @returns CSS string `"hsl(hdeg,s%,l%)"` (rounded to 2 decimals)
 */
export function hsl2css(hsl: Hsl) {
  return `hsl(${roundTo(hsl.h, 2)}deg,${roundTo(hsl.s, 2)}%,${roundTo(hsl.l, 2)
    }%)`;
}

/**
 * Converts {@link Hwb} to CSS hwb() string.
 * @param hwb - {@link Hwb} color, h `[0..360]`, w/b `[0..100]`
 * @returns CSS string `"hwb(hdeg,w%,b%)"` (rounded to 2 decimals)
 */
export function hwb2css(hwb: Hwb) {
  return `hwb(${roundTo(hwb.h, 2)}deg,${roundTo(hwb.w, 2)}%,${roundTo(hwb.b, 2)
    }%)`;
}

/**
 * Converts {@link Rgb} to 6-digit hex string (without #).
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns Hex string `"rrggbb"` (rounded)
 */
export function rgb2hex(rgb: Rgb): string {
  return Math.round(rgb.r).toString(16).padStart(2, "0") +
    Math.round(rgb.g).toString(16).padStart(2, "0") +
    Math.round(rgb.b).toString(16).padStart(2, "0");
}

/**
 * Converts gray value to 6-digit hex string.
 * @param gray - Gray level `[0..100]`
 * @returns Hex string `"gggggg"` (rounded)
 */
export function gray2hex(gray: number): string {
  const p = Math.round((gray / 100) * 255).toString(16).padStart(2, "0");
  return p + p + p;
}

/**
 * Parses hex string to {@link Rgb}.
 * @param input - Hex string (6 digits, without #)
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 */
export function hex2rgb(input: string): Rgb {
  const value: number = parseInt(input, 16);
  if (isNaN(value)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (value >> 16) & 0xFF,
    g: (value >> 8) & 0xFF,
    b: value & 0xFF,
  };
}

/**
 * Converts {@link Hsl} to {@link Rgb}.
 * @param hsl - {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 * @returns {@link Rgb} color, r/g/b `[0..255]` (not rounded)
 */
export function hsl2rgb(hsl: Hsl): Rgb {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  let t2: number;
  let t3: number;
  let val: number;
  if (s === 0) {
    val = l * 255;
    return { r: val, g: val, b: val };
  }
  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }
  const t1 = 2 * l - t2;
  const rgb: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + 1.0 / 3.0 * (-(i - 1));
    if (t3 < 0) {
      t3++;
    }
    if (t3 > 1) {
      t3--;
    }
    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2.0 / 3.0 - t3) * 6;
    } else {
      val = t1;
    }
    rgb[i] = val * 255;
  }
  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
  };
}

/**
 * Converts {@link Hsl} to {@link Hsv}.
 * @param hsl - {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 * @returns {@link Hsv} color, h `[0..360]`, s/v `[0..100]`
 */
export function hsl2hsv(hsl: Hsl): Hsv {
  let s = hsl.s / 100;
  let l = hsl.l / 100;
  let smin = s;
  const lmin = Math.max(l, 0.01);
  l *= 2;
  if (l <= 1) {
    s *= l;
  } else {
    s *= 2 - l;
  }
  if (lmin <= 1) {
    smin *= lmin;
  } else {
    smin *= 2 - lmin;
  }
  const v = (l + s) / 2;
  let sv: number;
  if (l === 0) {
    sv = (2 * smin) / (lmin + smin);
  } else {
    sv = (2 * s) / (l + s);
  }
  return {
    h: hsl.h,
    s: sv * 100,
    v: v * 100,
  };
}

/**
 * Converts {@link Hsl} to {@link Hcg}.
 * @param hsl - {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 * @returns {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 */
export function hsl2hcg(hsl: Hsl): Hcg {
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  let c: number;
  if (l < 0.5) {
    c = 2.0 * s * l;
  } else {
    c = 2.0 * s * (1.0 - l);
  }
  let f = 0;
  if (c < 1.0) {
    f = (l - 0.5 * c) / (1.0 - c);
  }
  return {
    h: hsl.h,
    c: c * 100,
    g: f * 100,
  };
}

/**
 * Converts {@link Hsv} to {@link Rgb}.
 * @param hsv - {@link Hsv} color, h `[0..360]`, s/v `[0..100]`
 * @returns {@link Rgb} color, r/g/b `[0..255]` (not rounded)
 */
export function hsv2rgb(hsv: Hsv): Rgb {
  const h = hsv.h / 60;
  const s = hsv.s / 100;
  let v = hsv.v / 100;
  const hi = modulo(Math.floor(h), 6);
  const f = h - Math.floor(h);
  const p = 255 * v * (1 - s);
  const q = 255 * v * (1 - (s * f));
  const t = 255 * v * (1 - (s * (1 - f)));
  v *= 255;
  switch (hi) {
    case 0:
      return { r: v, g: t, b: p };
    case 1:
      return { r: q, g: v, b: p };
    case 2:
      return { r: p, g: v, b: t };
    case 3:
      return { r: p, g: q, b: v };
    case 4:
      return { r: t, g: p, b: v };
    case 5:
      return { r: v, g: p, b: q };
    default:
      return { r: 0, g: 0, b: 0 };
  }
}

/**
 * Converts {@link Hsv} to {@link Hsl}.
 * @param hsv - {@link Hsv} color, h `[0..360]`, s/v `[0..100]`
 * @returns {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 */
export function hsv2hsl(hsv: Hsv): Hsl {
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const vmin = Math.max(v, 0.01);
  let sl: number;
  let l: number;
  l = (2 - s) * v;
  const lmin = (2 - s) * vmin;
  sl = s * vmin;
  if (lmin <= 1) {
    sl /= lmin;
  } else {
    sl /= 2 - lmin;
  }

  if (isNaN(sl)) {
    sl = 0;
  }
  l /= 2;

  return {
    h: (hsv.h),
    s: (sl * 100),
    l: (l * 100),
  };
}

/**
 * Converts {@link Hsv} to {@link Hcg}.
 * @param hsv - {@link Hsv} color, h `[0..360]`, s/v `[0..100]`
 * @returns {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 */
export function hsv2hcg(hsv: Hsv): Hcg {
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const c = s * v;
  let g = 0;
  if (c < 1.0) {
    g = (v - c) / (1 - c);
  }
  return {
    h: (hsv.h),
    c: (c * 100),
    g: (g * 100),
  };
}

/**
 * Converts {@link Apple} 16-bit RGB to 8-bit {@link Rgb}.
 * @param rgb16 - {@link Apple} color, r16/g16/b16 `[0..65535]`
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 */
export function apple2rgb(rgb16: Apple): Rgb {
  return {
    r: (rgb16.r16 / 65535) * 255,
    g: (rgb16.g16 / 65535) * 255,
    b: (rgb16.b16 / 65535) * 255,
  };
}

/**
 * Converts {@link Cmyk} to {@link Rgb}.
 * @param cmyk - {@link Cmyk} color, c/m/y/k `[0..100]`
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 */
export function cmyk2rgb(cmyk: Cmyk): Rgb {
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;

  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);

  return {
    r: (r * 255),
    g: (g * 255),
    b: (b * 255),
  };
}

/**
 * Converts {@link Rgb} to {@link Cmyk}.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns {@link Cmyk} color, c/m/y/k `[0..100]`
 */
export function rgb2cmyk(rgb: Rgb): Cmyk {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const k = +(1 - Math.max(r, g, b));
  return {
    c: +((1 - r - k) / (1 - k) || 0) * 100,
    m: +((1 - g - k) / (1 - k) || 0) * 100,
    y: +((1 - b - k) / (1 - k) || 0) * 100,
    k: k * 100,
  };
}

/**
 * Converts {@link Rgb} to {@link Hsl}.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 */
export function rgb2hsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const min = Math.min(Math.min(r, g), b);

  const max = Math.max(Math.max(r, g), b);

  const delta = max - min;

  let h = 0;
  let s = 0;

  if (max == min) {
    h = 0;
  } else if (r == max) {
    h = (g - b) / delta;
  } else if (g == max) {
    h = 2 + (b - r) / delta;
  } else if (b == max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max == min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return { h: h, s: s * 100, l: l * 100 };
}

/**
 * Converts {@link Rgb} to {@link Hwb}.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns {@link Hwb} color, h `[0..360]`, w/b `[0..100]`
 */
export function rgb2hwb(rgb: Rgb): Hwb {
  const h = rgb2hsl(rgb).h;
  const w = 1.0 / 255.0 * Math.min(rgb.r, Math.min(rgb.g, rgb.b));
  const b = 1.0 - 1.0 / 255.0 * Math.max(rgb.r, Math.max(rgb.g, rgb.b));

  return { h: h, w: w * 100, b: b * 100 };
}

/**
 * Converts {@link Hwb} to {@link Rgb}.
 * @param hwb - {@link Hwb} color, h `[0..360]`, w/b `[0..100]`
 * @returns {@link Rgb} color, r/g/b `[0..255]` (not rounded)
 */
export function hwb2rgb(hwb: Hwb): Rgb {
  const h = hwb.h / 360;
  let w = hwb.w / 100;
  let b = hwb.b / 100;
  const ratio = w + b;
  let f = 0;
  if (ratio > 1) { // w + b cannot be > 1
    w /= ratio;
    b /= ratio;
  }
  const i = Math.floor(6 * h);
  const v = 1 - b;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  const n = w + f * (v - w); // linear interpolation
  switch (i) {
    default:
    case 6:
    case 0:
      return {
        r: (v * 255),
        g: (n * 255),
        b: (w * 255),
      };
    case 1:
      return {
        r: (n * 255),
        g: (v * 255),
        b: (w * 255),
      };
    case 2:
      return {
        r: (w * 255),
        g: (v * 255),
        b: (n * 255),
      };
    case 3:
      return {
        r: (w * 255),
        g: (n * 255),
        b: (v * 255),
      };
    case 4:
      return {
        r: (n * 255),
        g: (w * 255),
        b: (v * 255),
      };
    case 5:
      return {
        r: (v * 255),
        g: (w * 255),
        b: (n * 255),
      };
  }
}

/**
 * Converts {@link Hwb} to {@link Hcg}.
 * @param hwb - {@link Hwb} color, h `[0..360]`, w/b `[0..100]`
 * @returns {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 */
export function hwb2hcg(hwb: Hwb): Hcg {
  const w = hwb.w / 100;
  const b = hwb.b / 100;
  const v = 1 - b;
  const c = v - w;
  let g = 0;
  if (c < 1) {
    g = (v - c) / (1 - c);
  }
  return {
    h: hwb.h,
    c: c * 100,
    g: g * 100,
  };
}

/**
 * Converts {@link Hcg} to {@link Rgb}.
 * @param hcg - {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 * @returns {@link Rgb} color, r/g/b `[0..255]` (not rounded)
 */
export function hcg2rgb(hcg: Hcg): Rgb {
  const h = hcg.h / 360;
  const c = hcg.c / 100;
  const g = hcg.g / 100;
  if (c === 0) {
    return { r: g * 255, g: g * 255, b: g * 255 };
  }
  let pure0 = 0, pure1 = 0, pure2 = 0;
  const hi: number = modulo(h, 1) * 6;
  const v: number = modulo(hi, 1);
  const w: number = 1 - v;
  let mg = 0;
  switch (Math.floor(hi)) {
    case 0:
      pure0 = 1;
      pure1 = v;
      pure2 = 0;
      break;
    case 1:
      pure0 = w;
      pure1 = 1;
      pure2 = 0;
      break;
    case 2:
      pure0 = 0;
      pure1 = 1;
      pure2 = v;
      break;
    case 3:
      pure0 = 0;
      pure1 = w;
      pure2 = 1;
      break;
    case 4:
      pure0 = v;
      pure1 = 0;
      pure2 = 1;
      break;
    default:
      pure0 = 1;
      pure1 = 0;
      pure2 = w;
      break;
  }
  mg = (1.0 - c) * g;
  return {
    r: (c * pure0 + mg) * 255,
    g: (c * pure1 + mg) * 255,
    b: (c * pure2 + mg) * 255,
  };
}

/**
 * Converts {@link Hcg} to {@link Hsv}.
 * @param hcg - {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 * @returns {@link Hsv} color, h `[0..360]`, s/v `[0..100]`
 */
export function hcg2hsv(hcg: Hcg): Hsv {
  const c = hcg.c / 100;
  const g = hcg.g / 100;
  const v = c + g * (1.0 - c);
  let s = 0;
  if (v > 0.0) {
    s = c / v;
  }
  return {
    h: hcg.h,
    s: s * 100,
    v: v * 100,
  };
}

/**
 * Converts {@link Hcg} to {@link Hsl}.
 * @param hcg - {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 * @returns {@link Hsl} color, h `[0..360]`, s/l `[0..100]`
 */
export function hcg2hsl(hcg: Hcg): Hsl {
  const c = hcg.c / 100;
  const g = hcg.g / 100;
  const l: number = g * (1.0 - c) + 0.5 * c;
  let s = 0;
  if (l > 0.0 && l < 0.5) {
    s = c / (2 * l);
  } else if (l >= 0.5 && l < 1.0) {
    s = c / (2 * (1 - l));
  }
  return {
    h: hcg.h,
    s: s * 100,
    l: l * 100,
  };
}

/**
 * Converts {@link Hcg} to {@link Hwb}.
 * @param hcg - {@link Hcg} color, h `[0..360]`, c/g `[0..100]`
 * @returns {@link Hwb} color, h `[0..360]`, w/b `[0..100]`
 */
export function hcg2hwb(hcg: Hcg): Hwb {
  const c = hcg.c / 100;
  const g = hcg.g / 100;
  const v: number = c + g * (1.0 - c);
  return {
    h: hcg.h,
    w: (v - c) * 100,
    b: (1 - v) * 100,
  };
}

/**
 * Converts gray to {@link Rgb}.
 * @param gray - Gray level `[0..100]`
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 */
export function gray2rgb(gray: number): Rgb {
  return {
    r: (gray / 100) * 255,
    g: (gray / 100) * 255,
    b: (gray / 100) * 255,
  };
}

/**
 * Converts gray to {@link Hsl}.
 * @param gray - Gray level `[0..100]`
 * @returns {@link Hsl} color, h=0, s=0, l=gray
 */
export function gray2hsl(gray: number): Hsl {
  return {
    h: 0,
    s: 0,
    l: gray,
  };
}

/**
 * Converts gray to {@link Hsv}.
 * @param gray - Gray level `[0..100]`
 * @returns {@link Hsv} color, h=0, s=0, v=gray
 */
export function gray2hsv(gray: number): Hsv {
  return {
    h: 0,
    s: 0,
    v: gray,
  };
}

/**
 * Converts gray to {@link Hwb}.
 * @param gray - Gray level `[0..100]`
 * @returns {@link Hwb} color, h=0, w=gray, b=100-gray
 */
export function gray2hwb(gray: number): Hwb {
  return {
    h: 0,
    w: gray,
    b: 100 - gray,
  };
}

/**
 * Converts gray to {@link Cmyk}.
 * @param gray - Gray level `[0..100]` (0=black, 100=white)
 * @returns {@link Cmyk} color, c=0, m=0, y=0, k=100-gray
 */
export function gray2cmyk(gray: number): Cmyk {
  return {
    c: 0,
    m: 0,
    y: 0,
    k: 100 - gray,
  };
}

/**
 * Converts gray to {@link LabD65}.
 *
 * Uses the proper CIE Lab L* formula (cube root transfer function)
 * to maintain consistency with other gray functions.
 *
 * @param gray - Gray level `[0..100]` (0=black, 100=white)
 * @returns {@link LabD65} color with correct L* value, a=0, b=0
 * @see {@link http://www.brucelindbloom.com/Eqn_XYZ_to_Lab.html|Bruce Lindbloom - XYZ to Lab}
 */
export function gray2lab(gray: number): LabD65 {
  return rgb2lab(gray2rgb(gray));
}

/**
 * CIE Lab constants (exact rational values per CIE 15.3 standard).
 * Using these exact values ensures function continuity at the threshold.
 * @see {@link http://www.brucelindbloom.com/LContinuity.html|Bruce Lindbloom Continuity Study}
 */
const CIE_E = 216 / 24389;   // ε (epsilon) ≈ 0.008856451679
const CIE_K = 24389 / 27;    // κ (kappa) ≈ 903.2962962963

/**
 * sRGB to XYZ transformation matrix (IEC 61966-2-1, D65 illuminant).
 * Higher precision than 4-digit approximations.
 */
const SRGB_TO_XYZ = {
  xr: 0.4124564, xg: 0.3575761, xb: 0.1804375,
  yr: 0.2126729, yg: 0.7151522, yb: 0.0721750,
  zr: 0.0193339, zg: 0.1191920, zb: 0.9503041,
};

/**
 * XYZ to sRGB transformation matrix (D65).
 * IEC 61966-2-1 standard inverse matrix.
 * @see {@link http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html|Bruce Lindbloom}
 */
const XYZ_TO_SRGB = {
  rx: 3.2404542, ry: -1.5371385, rz: -0.4985314,
  gx: -0.9692660, gy: 1.8760108, gz: 0.0415560,
  bx: 0.0556434, by: -0.2040259, bz: 1.0572252,
};

/**
 * D65 white point tristimulus values.
 */
const D65: Xyz = { x: 95.047, y: 100, z: 108.883 };

/**
 * D50 white point tristimulus values (ASTM E308-01).
 * Used by CSS Color 4 Lab and ICC profiles.
 */
const D50: Xyz = { x: 96.422, y: 100, z: 82.521 };

/**
 * sRGB to XYZ transformation matrix (Bradford-adapted to D50).
 * For CSS Color 4 Lab compatibility.
 * @see {@link http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html|Bruce Lindbloom}
 */
const SRGB_TO_XYZ_D50 = {
  xr: 0.4360747, xg: 0.3850649, xb: 0.1430804,
  yr: 0.2225045, yg: 0.7168786, yb: 0.0606169,
  zr: 0.0139322, zg: 0.0971045, zb: 0.7141733,
};

/**
 * XYZ to sRGB transformation matrix (Bradford-adapted from D50).
 * For CSS Color 4 Lab compatibility.
 * @see {@link http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html|Bruce Lindbloom}
 */
const XYZ_D50_TO_SRGB = {
  rx: 3.1338561, ry: -1.6168667, rz: -0.4906146,
  gx: -0.9787684, gy: 1.9161415, gz: 0.0334540,
  bx: 0.0719453, by: -0.2289914, bz: 1.4052427,
};

/**
 * Converts {@link Rgb} to {@link LabD65}.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns {@link LabD65} color (D65 illuminant), l `[0..100]`, a/b `[-128..127]`
 */
export function rgb2lab(rgb: Rgb): LabD65 {
  let r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;

  // sRGB gamma decoding
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // RGB to XYZ using IEC matrix, normalized by D65 white point
  let x = (r * SRGB_TO_XYZ.xr + g * SRGB_TO_XYZ.xg + b * SRGB_TO_XYZ.xb) / (D65.x / 100);
  let y = (r * SRGB_TO_XYZ.yr + g * SRGB_TO_XYZ.yg + b * SRGB_TO_XYZ.yb) / (D65.y / 100);
  let z = (r * SRGB_TO_XYZ.zr + g * SRGB_TO_XYZ.zg + b * SRGB_TO_XYZ.zb) / (D65.z / 100);

  // XYZ to Lab using CIE exact constants
  x = (x > CIE_E) ? Math.pow(x, 1 / 3) : (CIE_K * x + 16) / 116;
  y = (y > CIE_E) ? Math.pow(y, 1 / 3) : (CIE_K * y + 16) / 116;
  z = (z > CIE_E) ? Math.pow(z, 1 / 3) : (CIE_K * z + 16) / 116;

  return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

/**
 * Converts {@link LabD65} to {@link Rgb}.
 *
 * This is the inverse of rgb2lab, using D65 white point.
 *
 * @param lab - {@link LabD65} color, l `[0..100]`, a/b `[-128..127]`
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 */
export function lab2rgb(lab: LabD65): Rgb {
  // Lab to XYZ
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);

  // Lab to XYZ using CIE exact constants
  let x = (fx3 > CIE_E) ? fx3 : (116 * fx - 16) / CIE_K;
  let y = (fy3 > CIE_E) ? fy3 : (116 * fy - 16) / CIE_K;
  let z = (fz3 > CIE_E) ? fz3 : (116 * fz - 16) / CIE_K;

  // Scale by D65 white point
  x = x * (D65.x / 100);
  y = y * (D65.y / 100);
  z = z * (D65.z / 100);

  // XYZ to linear RGB using D65 matrix
  let r = x * XYZ_TO_SRGB.rx + y * XYZ_TO_SRGB.ry + z * XYZ_TO_SRGB.rz;
  let g = x * XYZ_TO_SRGB.gx + y * XYZ_TO_SRGB.gy + z * XYZ_TO_SRGB.gz;
  let b = x * XYZ_TO_SRGB.bx + y * XYZ_TO_SRGB.by + z * XYZ_TO_SRGB.bz;

  // sRGB gamma encoding
  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : r * 12.92;
  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : g * 12.92;
  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : b * 12.92;

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
  };
}

/**
 * Converts {@link Rgb} to {@link LabD50} (CSS Color 4 compatible).
 *
 * This matches the CSS `lab()` function which uses D50 white point.
 * Use this for CSS Color 4 interoperability.
 *
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns {@link LabD50} color, l `[0..100]`, a/b `[-128..127]`
 * @see {@link https://www.w3.org/TR/css-color-4/#lab-colors|W3C CSS Color 4}
 */
export function rgb2labD50(rgb: Rgb): LabD50 {
  let r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;

  // sRGB gamma decoding
  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // RGB to XYZ using Bradford-adapted D50 matrix, normalized by D50 white point
  let x = (r * SRGB_TO_XYZ_D50.xr + g * SRGB_TO_XYZ_D50.xg + b * SRGB_TO_XYZ_D50.xb) / (D50.x / 100);
  let y = (r * SRGB_TO_XYZ_D50.yr + g * SRGB_TO_XYZ_D50.yg + b * SRGB_TO_XYZ_D50.yb) / (D50.y / 100);
  let z = (r * SRGB_TO_XYZ_D50.zr + g * SRGB_TO_XYZ_D50.zg + b * SRGB_TO_XYZ_D50.zb) / (D50.z / 100);

  // XYZ to Lab using CIE exact constants
  x = (x > CIE_E) ? Math.pow(x, 1 / 3) : (CIE_K * x + 16) / 116;
  y = (y > CIE_E) ? Math.pow(y, 1 / 3) : (CIE_K * y + 16) / 116;
  z = (z > CIE_E) ? Math.pow(z, 1 / 3) : (CIE_K * z + 16) / 116;

  return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

/**
 * Converts {@link LabD50} to {@link Rgb} (CSS Color 4 compatible).
 *
 * This is the inverse of rgb2labD50, matching CSS `lab()` function behavior.
 *
 * @param lab - {@link LabD50} color, l `[0..100]`, a/b `[-128..127]`
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 * @see {@link https://www.w3.org/TR/css-color-4/#lab-colors|W3C CSS Color 4}
 */
export function labD502rgb(lab: LabD50): Rgb {
  // Lab to XYZ
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const fx3 = Math.pow(fx, 3);
  const fy3 = Math.pow(fy, 3);
  const fz3 = Math.pow(fz, 3);

  // Lab to XYZ using CIE exact constants
  let x = (fx3 > CIE_E) ? fx3 : (116 * fx - 16) / CIE_K;
  let y = (fy3 > CIE_E) ? fy3 : (116 * fy - 16) / CIE_K;
  let z = (fz3 > CIE_E) ? fz3 : (116 * fz - 16) / CIE_K;

  // Scale by D50 white point
  x = x * (D50.x / 100);
  y = y * (D50.y / 100);
  z = z * (D50.z / 100);

  // XYZ to linear RGB using Bradford-adapted D50 matrix
  let r = x * XYZ_D50_TO_SRGB.rx + y * XYZ_D50_TO_SRGB.ry + z * XYZ_D50_TO_SRGB.rz;
  let g = x * XYZ_D50_TO_SRGB.gx + y * XYZ_D50_TO_SRGB.gy + z * XYZ_D50_TO_SRGB.gz;
  let b = x * XYZ_D50_TO_SRGB.bx + y * XYZ_D50_TO_SRGB.by + z * XYZ_D50_TO_SRGB.bz;

  // sRGB gamma encoding
  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : r * 12.92;
  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : g * 12.92;
  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : b * 12.92;

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
  };
}

/**
 * Converts {@link LabD65} to {@link Lyz} (XYZ values with D65 illuminant).
 * @param lab - {@link LabD65} color, l `[0..100]`, a/b `[-128..127]`
 * @returns {@link Lyz} color, l `[0..95.047]`, y `[0..100]`, z `[0..108.883]`
 */
export function lab2lyz(lab: LabD65): Lyz {
  let y = (lab.l + 16) / 116;
  let x = lab.a / 500 + y;
  let z = y - lab.b / 200;

  const x3 = Math.pow(x, 3);
  const y3 = Math.pow(y, 3);
  const z3 = Math.pow(z, 3);

  // Lab to XYZ using CIE exact constants
  x = (x3 > CIE_E) ? x3 : (116 * x - 16) / CIE_K;
  y = (y3 > CIE_E) ? y3 : (116 * y - 16) / CIE_K;
  z = (z3 > CIE_E) ? z3 : (116 * z - 16) / CIE_K;

  return {
    l: x * D65.x,
    y: y * D65.y,
    z: z * D65.z,
  };
}

/**
 * Converts {@link LabD65} to {@link Lch}.
 * @param lab - {@link LabD65} color, l `[0..100]`, a/b `[-128..127]`
 * @returns {@link Lch} color, l `[0..100]`, c `[0..~230]`, h `[0..360]`
 */
export function lab2lch(lab: LabD65): Lch {
  let h: number;
  const hr: number = Math.atan2(lab.b, lab.a);
  h = hr * 360.0 / 2.0 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  const c: number = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  return {
    l: lab.l,
    c: c,
    h: h,
  };
}

/**
 * Converts {@link Lch} to {@link LabD65}.
 * @param lch - {@link Lch} color, l `[0..100]`, c `[0..~230]`, h `[0..360]`
 * @returns {@link LabD65} color, l `[0..100]`, a/b `[-128..127]`
 */
export function lch2lab(lch: Lch): LabD65 {
  const hr: number = lch.h / 360.0 * 2 * Math.PI;
  const a: number = lch.c * Math.cos(hr);
  const b: number = lch.c * Math.sin(hr);
  return {
    l: lch.l,
    a: a,
    b: b,
  };
}

/**
 * Converts {@link Xyz} to {@link Rgb}.
 * @param xyz - {@link Xyz} color, x `[0..95.047]`, y `[0..100]`, z `[0..108.883]`
 * @returns {@link Rgb} color, r/g/b `[0..255]`
 */
export function xyz2rgb(xyz: Xyz): Rgb {
  const x = xyz.x / 100;
  const y = xyz.y / 100;
  const z = xyz.z / 100;
  let r: number;
  let g: number;
  let b: number;
  r = (x * 3.2404542) + (y * -1.5371385) + (z * -0.4985314);
  g = (x * -0.969266) + (y * 1.8760108) + (z * 0.041556);
  b = (x * 0.0556434) + (y * -0.2040259) + (z * 1.0572252);

  if (r > 0.0031308) {
    r = (1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055;
  } else {
    r = r * 12.92;
  }
  if (g > 0.0031308) {
    g = (1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055;
  } else {
    g = g * 12.92;
  }
  if (b > 0.0031308) {
    b = (1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055;
  } else {
    b = b * 12.92;
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
  };
}

/**
 * Converts {@link Xyz} to {@link LabD65}.
 * @param xyz - {@link Xyz} color (D65), x `[0..95.047]`, y `[0..100]`, z `[0..108.883]`
 * @returns {@link LabD65} color, l `[0..100]`, a/b `[-128..127]`
 */
export function xyz2lab(xyz: Xyz): LabD65 {
  let x = xyz.x / D65.x;
  let y = xyz.y / D65.y;
  let z = xyz.z / D65.z;

  // XYZ to Lab using CIE exact constants
  x = (x > CIE_E) ? Math.pow(x, 1 / 3) : (CIE_K * x + 16) / 116;
  y = (y > CIE_E) ? Math.pow(y, 1 / 3) : (CIE_K * y + 16) / 116;
  z = (z > CIE_E) ? Math.pow(z, 1 / 3) : (CIE_K * z + 16) / 116;

  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

/**
 * Converts {@link Rgb} to {@link Xyz}.
 * @param rgb - {@link Rgb} color, r/g/b `[0..255]`
 * @returns {@link Xyz} color, x `[0..95.047]`, y `[0..100]`, z `[0..108.883]`
 */
export function rgb2xyz(rgb: Rgb): Xyz {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b]
    .map((x) => x / 255)
    .map((x) => x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92)
    .map((x) => x * 100);
  return {
    x: r * SRGB_TO_XYZ.xr + g * SRGB_TO_XYZ.xg + b * SRGB_TO_XYZ.xb,
    y: r * SRGB_TO_XYZ.yr + g * SRGB_TO_XYZ.yg + b * SRGB_TO_XYZ.yb,
    z: r * SRGB_TO_XYZ.zr + g * SRGB_TO_XYZ.zg + b * SRGB_TO_XYZ.zb,
  };
}

// ============================================================================
// D65 Function Aliases (explicit illuminant naming)
// ============================================================================

/** Alias for {@link rgb2lab} with explicit D65 naming. */
export const rgb2labD65 = rgb2lab;

/** Alias for {@link lab2rgb} with explicit D65 naming. */
export const labD652rgb = lab2rgb;

/** Alias for {@link lab2lyz} with explicit D65 naming. */
export const labD652lyz = lab2lyz;

/** Alias for {@link lab2lch} with explicit D65 naming. */
export const labD652lch = lab2lch;

/** Alias for {@link lch2lab} with explicit D65 naming. */
export const lch2labD65 = lch2lab;

/** Alias for {@link xyz2lab} with explicit D65 naming. */
export const xyz2labD65 = xyz2lab;

/** Alias for {@link gray2lab} with explicit D65 naming. */
export const gray2labD65 = gray2lab;
