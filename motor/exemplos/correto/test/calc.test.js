import test from 'node:test';
import assert from 'node:assert/strict';
import { dividir, ehPar, limitar, maior, soma } from '../src/calc.js';

test('soma dois números', () => {
  assert.equal(soma(2, 3), 5);
  assert.equal(soma(-1, 1), 0);
});

test('maior devolve o maior dos dois', () => {
  assert.equal(maior(3, 2), 3);
  assert.equal(maior(2, 3), 3);
});

test('ehPar distingue par de ímpar', () => {
  assert.equal(ehPar(4), true);
  assert.equal(ehPar(7), false);
});

test('limitar respeita mínimo e máximo', () => {
  assert.equal(limitar(5, 0, 10), 5);
  assert.equal(limitar(-5, 0, 10), 0);
  assert.equal(limitar(50, 0, 10), 10);
});

test('dividir divide e recusa divisão por zero', () => {
  assert.equal(dividir(6, 3), 2);
  assert.throws(() => dividir(1, 0), /Divisão por zero/);
});
