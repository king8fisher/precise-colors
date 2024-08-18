import { assert, test } from "vitest";
import { Cmyk } from "./color";
import { multiplyColor } from "./helpers";


test("multiplyColor", () => {
  const m: Cmyk = {c: 0, m: 1, y: 0.5, k: 0.2}
  const r = multiplyColor(m, 100)
  assert.deepEqual(r, {c: 0, m: 100, y: 50, k: 20})
})