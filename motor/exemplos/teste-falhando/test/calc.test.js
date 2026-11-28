import test from 'node:test';
import assert from 'node:assert/strict';
import { ehPar, soma } from '../src/calc.js';

test('soma dois números', () => {
  assert.equal(soma(2, 3), 5);
});

test('ehPar distingue par de ímpar', () => {
  assert.equal(ehPar(4), true);
});
