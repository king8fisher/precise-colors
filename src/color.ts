export interface Cmyk {
  /** [0..100] */
  readonly c: number;
  /** [0..100] */
  readonly m: number;
  /** [0..100] */
  readonly y: number;
  /** [0..100] */
  readonly k: number;
}

export interface Apple {
  readonly r16: number;
  readonly g16: number;
  readonly b16: number;
}

export interface Rgb {
  /** [0..255] */
  readonly r: number;
  /** [0..255] */
  readonly g: number;
  /** [0..255] */
  readonly b: number;
}

export interface Hsl {
  readonly h: number;
  readonly s: number;
  readonly l: number;
}

export interface Hsv {
  readonly h: number;
  readonly s: number;
  readonly v: number;
}

export interface Hcg {
  readonly h: number;
  readonly c: number;
  readonly g: number;
}

export interface Hwb {
  readonly h: number;
  readonly w: number;
  readonly b: number;
}

export interface Lab {
  readonly l: number;
  readonly a: number;
  readonly b: number;
}

export interface Xyz {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Lyz {
  readonly l: number;
  readonly y: number;
  readonly z: number;
}

export interface Lch {
  readonly l: number;
  readonly c: number;
  readonly h: number;
}

/** rounds number to amount of places after `.` */
export function roundTo(num: number, places: number) {
  return +(Math.round(parseFloat(num.toString() + "e+" + places)) + "e-" +
    places);
}

export function modulo(x: number, n: number): number {
  return ((x % n) + n) % n;
}

/**
 * rgb2css converts {@link Rgb} to a string for css. Calls `Math.round` for each of
 * the Rgb fields.
 * @param {Rbg} rgb - [0..255].
 * @returns {string} `"rgb(r,g,b)"` representation of passed {@link Rgb} instance.
 */
export function rgb2css(rgb: Rgb): string {
  return `rgb(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)})`;
}

/**
 * rgb2str converts {@link Rgb} to a rounded `"0..255,0.255,0.255"` string.
 * @param {Rgb} rgb
 * @returns {string} example: `"0,127,255"`
 */
export function rgb2str(rgb: Rgb): string {
  return `${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)}`;
}

/**
 * Converts {@link Rgb} and `alpha` to a string for css. Calls `Math.round` for each of
 * the Rgb fields. Rounds `alpha` to max 2 places after `.`.
 * @param {Rbg} rgb - [0..255].
 * @param {number} alpha [0..1]
 * @returns {string} `"rgb(r,g,b,a)"` representation of passed  {@link Rgb} instance and `alpha`.
 */
export function rgba2css(rgb: Rgb, alpha: number): string {
  return `rgba(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)},${roundTo(alpha, 2)
    })`;
}

/** returns `hsl(h,s,l)` expression */
export function hsl2css(hsl: Hsl) {
  return `hsl(${roundTo(hsl.h, 2)}deg,${roundTo(hsl.s, 2)}%,${roundTo(hsl.l, 2)
    }%)`;
}

/** returns `hwb(h,w,b)` expression */
export function hwb2css(hwb: Hwb) {
  return `hwb(${roundTo(hwb.h, 2)}deg,${roundTo(hwb.w, 2)}%,${roundTo(hwb.b, 2)
    }%)`;
}

/** rgb expects [0..255] for each field */
export function rgb2hex(rgb: Rgb): string {
  return Math.round(rgb.r).toString(16).padStart(2, "0") +
    Math.round(rgb.g).toString(16).padStart(2, "0") +
    Math.round(rgb.b).toString(16).padStart(2, "0");
}

/** gray expects [0..100] */
export function gray2hex(gray: number): string {
  const p = Math.round((gray / 100) * 255).toString(16).padStart(2, "0");
  return p + p + p;
}

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

/** expects h [0..360], s [0..100], l [0..100]. Returns rgb[0..255], doesn't perform Math.round on the result. */
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

/** expects h [0..360], s [0..100], l [0..100]. Returns rgb[0..255], doesn't perform Math.round on the result. */
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

export function apple2rgb(rgb16: Apple): Rgb {
  return {
    r: (rgb16.r16 / 65535) * 255,
    g: (rgb16.g16 / 65535) * 255,
    b: (rgb16.b16 / 65535) * 255,
  };
}

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

export function rgb2hwb(rgb: Rgb): Hwb {
  const h = rgb2hsl(rgb).h;
  const w = 1.0 / 255.0 * Math.min(rgb.r, Math.min(rgb.g, rgb.b));
  const b = 1.0 - 1.0 / 255.0 * Math.max(rgb.r, Math.max(rgb.g, rgb.b));

  return { h: h, w: w * 100, b: b * 100 };
}

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

export function gray2rgb(gray: number): Rgb {
  return {
    r: (gray / 100) * 255,
    g: (gray / 100) * 255,
    b: (gray / 100) * 255,
  };
}

export function gray2hsl(gray: number): Hsl {
  return {
    h: 0,
    s: 0,
    l: gray,
  };
}

export function gray2hsv(gray: number): Hsv {
  return {
    h: 0,
    s: 0,
    v: gray,
  };
}

export function gray2hwb(gray: number): Hwb {
  return {
    h: 0,
    w: 100,
    b: gray,
  };
}

export function gray2cmyk(gray: number): Cmyk {
  return {
    c: 0,
    m: 0,
    y: 0,
    k: gray,
  };
}

export function gray2lab(gray: number): Lab {
  return {
    l: gray,
    a: 0,
    b: 0,
  };
}

export function rgb2lab(rgb: Rgb): Lab {
  let r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255;
  let x = 0, y = 0, z = 0;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

  return { l: (116 * y) - 16, a: 500 * (x - y), b: 200 * (y - z) };
}

export function lab2lyz(lab: Lab): Lyz {
  let y = (lab.l + 16) / 116;
  let x = lab.a / 500 + y;
  let z = y - lab.b / 200;
  const x2: number = Math.pow(x, 3);
  const y2: number = Math.pow(y, 3);
  const z2: number = Math.pow(z, 3);
  if (x2 > 0.008856) {
    x = x2;
  } else {
    x = (x - 16.0 / 116.0) / 7.787;
  }
  if (y2 > 0.008856) {
    y = y2;
  } else {
    y = (y - 16.0 / 116.0) / 7.787;
  }
  if (z2 > 0.008856) {
    z = z2;
  } else {
    z = (z - 16.0 / 116.0) / 7.787;
  }
  x *= 95.047;
  y *= 100;
  z *= 108.883;
  return {
    l: x,
    y: y,
    z: z,
  };
}

export function lab2lch(lab: Lab): Lch {
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

export function lch2lab(lch: Lch): Lab {
  const hr: number = lch.h / 360.0 * 2 * Math.PI;
  const a: number = lch.c * Math.cos(hr);
  const b: number = lch.c * Math.sin(hr);
  return {
    l: lch.l,
    a: a,
    b: b,
  };
}

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

export function xyz2lab(xyz: Xyz): Lab {
  let x = xyz.x / 95.047;
  let y = xyz.y / 100;
  let z = xyz.z / 108.883;
  if (x > 0.008856) {
    x = Math.pow(x, 1.0 / 3.0);
  } else {
    x = (7.787 * x) + (16.0 / 116.0);
  }
  if (y > 0.008856) {
    y = Math.pow(y, 1.0 / 3.0);
  } else {
    y = (7.787 * y) + (16.0 / 116.0);
  }
  if (z > 0.008856) {
    z = Math.pow(z, 1.0 / 3.0);
  } else {
    z = (7.787 * z) + (16.0 / 116.0);
  }
  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

export function rgb2xyz(rgb: Rgb): Xyz {
  const [var_R, var_G, var_B] = [rgb.r, rgb.g, rgb.b]
    .map((x) => x / 255)
    .map((x) => x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92)
    .map((x) => x * 100);
  return {
    x: var_R * 0.412453 + var_G * 0.357580 + var_B * 0.180423,
    y: var_R * 0.212671 + var_G * 0.715160 + var_B * 0.072169,
    z: var_R * 0.019334 + var_G * 0.119193 + var_B * 0.950227,
  };
}
