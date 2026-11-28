import test from 'node:test';
import assert from 'node:assert/strict';
import { soma } from '../src/calc.js';

test('soma dois números', () => {
  assert.equal(soma(2, 3), 5);
});
