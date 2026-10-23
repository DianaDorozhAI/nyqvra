import test from 'node:test';
import assert from 'node:assert/strict';
import { entropyBits, generatePassword, getPool, randomIndex } from '../src/password.js';

test('builds a pool from enabled types', () => {
  assert.equal(getPool({ upper: true, lower: false, numbers: true, symbols: false }), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
});
test('rejection sampling retries values in the incomplete range', () => {
  const values = [255, 14]; let call = 0;
  const fakeCrypto = { getRandomValues: array => { array[0] = values[call++]; return array; } };
  assert.equal(randomIndex(10, fakeCrypto), 4);
  assert.equal(call, 2);
});
test('generates requested length from the supplied pool', () => {
  const fakeCrypto = { getRandomValues: array => { array[0] = 1; return array; } };
  assert.equal(generatePassword(6, 'ab', fakeCrypto), 'bbbbbb');
});
test('calculates entropy from independent choices', () => {
  assert.equal(entropyBits(10, 2), 10);
  assert.equal(entropyBits(20, 1), 0);
});
