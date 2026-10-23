import test from "node:test";
import assert from "node:assert/strict";
import { modelAttack } from "../src/threat-model.js";
import {
  constrainedEntropy,
  generatePassword,
  generatePassphrase,
  randomIndex,
} from "../src/password.js";
import { EFF_WORDS } from "../src/wordlist.js";
test("model matches exhaustive search with distinct guesses", () => {
  const r = modelAttack(10, 2, 10);
  assert.ok(Math.abs(2 ** r.log2Seconds - 256.25) < 1e-9);
  assert.ok(Math.abs(r.probability - 20 / 1024) < 1e-12);
  assert.equal(modelAttack(10, 1000, 10).probability, 1);
});
test("long-password models do not underflow into a false zero", () => {
  const r = modelAttack(818.2, 1e10);
  assert.ok(r.probability > 0);
  assert.ok(Number.isFinite(r.log2Probability));
});
test("rejects invalid model values", () => {
  for (const v of [NaN, Infinity, -1]) assert.throws(() => modelAttack(v, 10));
  for (const v of [0, NaN, Infinity, 1e16])
    assert.throws(() => modelAttack(50, v));
});
test("required sets entropy agrees with small exact enumeration", () => {
  assert.equal(constrainedEntropy(2, 2, [1, 1]), 1);
  assert.equal(constrainedEntropy(4, 10), 4 * Math.log2(10));
});
test("required sets reject whole candidates rather than force insertion", () => {
  const values = [0, 0, 0, 1];
  let n = 0;
  const api = {
    getRandomValues: (a) => {
      a[0] = values[n++];
      return a;
    },
  };
  assert.equal(generatePassword(2, "ab", api, ["a", "b"]), "ab");
  assert.equal(n, 4);
});
test("word selection uses unbiased 16-bit sampling", () => {
  const values = [65535, 7777];
  let n = 0;
  const api = {
    getRandomValues: (a) => {
      a[0] = values[n++];
      return a;
    },
  };
  assert.equal(randomIndex(7776, api), 1);
  assert.equal(n, 2);
});
test("word list is complete, unique, and space-separated phrases are unambiguous", () => {
  assert.equal(EFF_WORDS.length, 7776);
  assert.equal(new Set(EFF_WORDS).size, 7776);
  assert.ok(EFF_WORDS.every((w) => !w.includes(" ")));
  const api = {
    getRandomValues: (a) => {
      a[0] = 0;
      return a;
    },
  };
  assert.equal(
    generatePassphrase(4, EFF_WORDS, api),
    "abacus abacus abacus abacus",
  );
});
