import test from 'node:test';
import { ehPar, limitar, maior, soma } from '../src/calc.js';

test('soma dois números', () => {
  soma(2, 3);
});

test('maior devolve o maior dos dois', () => {
  maior(3, 2);
});

test('ehPar distingue par de ímpar', () => {
  ehPar(4);
});

test('limitar respeita mínimo e máximo', () => {
  limitar(5, 0, 10);
});
