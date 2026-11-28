import test from 'node:test';
import assert from 'node:assert/strict';
import { AVISO_DE_AUTORIDADE, auditarEsteira } from '../src/esteira.js';
import { investigar } from '../src/investigar.js';
import { PACKAGE_JSON_TESTE, criarProjeto } from './ajuda.js';

const auditar = (workflows) => {
  const arquivos = { 'package.json': PACKAGE_JSON_TESTE, 'test/a.test.js': "test('a', () => {});\n" };
  for (const [nome, texto] of Object.entries(workflows)) arquivos[`.github/workflows/${nome}`] = texto;
  const dir = criarProjeto(arquivos);
  return auditarEsteira(dir, investigar(dir));
};
const ids = (r) => r.achados.map((a) => a.id);

test('sem workflow nenhum', () => {
  const r = auditar({});
  assert.deepEqual(ids(r), ['sem-workflow']);
});

test('workflow saudável não gera aviso', () => {
  const r = auditar({ 'ci.yml': 'name: CI\non:\n  pull_request:\n  push:\njobs:\n  t:\n    steps:\n      - run: npm test\n' });
  assert.deepEqual(r.achados, []);
});

test('continue-on-error true, com número da linha e evidência', () => {
  const r = auditar({ 'ci.yml': 'on: pull_request\njobs:\n  t:\n    continue-on-error: true\n    steps:\n      - run: npm test\n' });
  const a = r.achados.find((x) => x.id === 'continue-on-error');
  assert.equal(a.linha, 4);
  assert.equal(a.arquivo, '.github/workflows/ci.yml');
  assert.equal(a.evidencia, 'continue-on-error: true');
});

test('comando de teste seguido de || true ou || exit 0', () => {
  for (const sufixo of ['|| true', '|| exit 0']) {
    const r = auditar({ 'ci.yml': `on: pull_request\njobs:\n  t:\n    steps:\n      - run: npm test ${sufixo}\n` });
    const a = r.achados.find((x) => x.id === 'falha-tolerada');
    assert.ok(a, sufixo);
    assert.match(a.mensagem, /comando de teste/);
  }
});

test('|| true em outro comando é apontado, mas não como o comando de teste', () => {
  const r = auditar({ 'ci.yml': 'on: pull_request\njobs:\n  t:\n    steps:\n      - run: rm -f x || true\n      - run: npm test\n' });
  const a = r.achados.find((x) => x.id === 'falha-tolerada');
  assert.match(a.mensagem, /não parece ser o comando de teste/);
});

test('if: false', () => {
  const r = auditar({ 'ci.yml': 'on: pull_request\njobs:\n  t:\n    if: false\n    steps:\n      - run: npm test\n' });
  assert.ok(ids(r).includes('if-false'));
});

test('ausência do gatilho pull_request', () => {
  const r = auditar({ 'ci.yml': 'on: push\njobs:\n  t:\n    steps:\n      - run: npm test\n' });
  assert.ok(ids(r).includes('sem-pull-request'));
  assert.ok(ids(r).includes('nenhum-pull-request'));
});

test('pull_request_target não conta como o gatilho pull_request', () => {
  const r = auditar({ 'ci.yml': 'on: pull_request_target\njobs:\n  t:\n    steps:\n      - run: npm test\n' });
  assert.ok(ids(r).includes('sem-pull-request'));
});

test('nenhum workflow executa o comando de teste', () => {
  const r = auditar({ 'lint.yml': 'on: pull_request\njobs:\n  l:\n    steps:\n      - run: npm run lint\n' });
  assert.deepEqual(ids(r), ['nenhum-roda-teste']);
});

test('linhas comentadas não contam', () => {
  const r = auditar({ 'ci.yml': 'on: pull_request\n# continue-on-error: true\njobs:\n  t:\n    steps:\n      - run: npm test\n' });
  assert.deepEqual(r.achados, []);
});

test('o resultado diz que é heurística de texto e que o modo protegido não é afirmado', () => {
  const r = auditar({});
  assert.match(r.metodo, /sem interpretar YAML/);
  assert.match(r.metodo, /heurística/);
  assert.equal(r.autoridade, AVISO_DE_AUTORIDADE);
  assert.match(r.autoridade, /não inspecionou as regras de proteção/);
  assert.match(r.autoridade, /consultivo/);
  assert.match(r.autoridade, /protegido não é afirmado/);
});
