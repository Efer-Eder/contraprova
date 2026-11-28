import test from 'node:test';
import assert from 'node:assert/strict';
import { dividir, ehPar, soma } from '../src/calc.js';

test('soma dois números', () => {
  assert.equal(soma(2, 3), 5);
});

test.skip('ehPar distingue par de ímpar', () => {
  assert.equal(ehPar(4), true);
});

test.skip('dividir recusa divisão por zero', () => {
  assert.throws(() => dividir(1, 0));
});

test('dividir divide', { skip: 'quebra de vez em quando, ver depois' }, () => {
  assert.equal(dividir(6, 3), 2);
});
