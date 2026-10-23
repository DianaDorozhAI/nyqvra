import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSettings } from '../src/settings.js';

const all = { upper: true, lower: true, numbers: true, symbols: true };
test('accepts the two UI bounds and the default', () => {
  for (const n of [8, 24, 128]) assert.equal(validateSettings(String(n), all).length, n);
});
test('rejects out-of-range and non-integer draft lengths', () => {
  for (const n of ['', 7, 129, 24.5, 'bad']) assert.equal(validateSettings(n, all).error, 'invalid');
});
test('rejects an empty character selection', () => {
  assert.equal(validateSettings(24, {}).error, 'empty');
});
test('only the chosen set is available', () => {
  assert.equal(validateSettings(24, { numbers: true }).pool, '0123456789');
});
test('the signature changes only with generation settings', () => {
  assert.equal(validateSettings(24, all).signature, validateSettings('24', all).signature);
  assert.notEqual(validateSettings(24, all).signature, validateSettings(32, all).signature);
});
