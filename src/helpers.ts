import { assert } from "vitest";

export function assertAlmostEquals(
  actual: number,
  expected: number,
  tolerance = 1e-7,
  msg?: string
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
  assert.fail(`expected actual: "${f(actual)}" to be close to "${f(expected)}": \
delta "${f(delta)}" is greater than "${f(tolerance)}"${msgSuffix}`
  );
}

export type ColorComponent<T> = {
  [K in keyof T]: number;
};

export function typedObjectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Multiply every value in the object T by `by`.
 */
export function multiplyColor<T extends object>(obj: T, by: number): T {
  let a: T = structuredClone(obj);
  typedObjectKeys(obj).forEach(k => {
    if (typeof obj[k] == 'number') {
      Object.assign(a, { [k]: obj[k] * by });
    }
  }
  );
  return a;
}

export function assertAlmostEqualsColor<T extends ColorComponent<T>>(actual: T, expected: T, tolerance = 1e-7, msg?: string) {
  typedObjectKeys(actual).forEach((k) => {
    assertAlmostEquals(actual[k], expected[k], tolerance, msg);
  });
}
