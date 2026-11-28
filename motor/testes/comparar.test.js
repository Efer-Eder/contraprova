import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PACKAGE_JSON_TESTE, cliJson, commitar, criarProjeto, git, iniciarRepositorio } from './ajuda.js';

const CODIGO = 'export function soma(a, b) {\n  return a + b;\n}\n\nexport function dobro(a) {\n  return a * 2;\n}\n';

const TESTE_BOM =
  "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { soma, dobro } from '../src/calc.js';\n\n" +
  "test('soma', () => {\n  assert.equal(soma(1, 2), 3);\n  assert.equal(soma(0, 0), 0);\n});\n\n" +
  "test('dobro', () => {\n  assert.equal(dobro(2), 4);\n  assert.equal(dobro(0), 0);\n});\n";

const TESTE_FRACO =
  "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { soma, dobro } from '../src/calc.js';\n\n" +
  "test('soma', () => {\n  assert.equal(soma(1, 2), 3);\n});\n\n" +
  "test.skip('dobro', () => {\n  dobro(2);\n});\n";

const WORKFLOW_BOM = 'name: CI\non: [pull_request]\njobs:\n  t:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n';
const WORKFLOW_FRACO = 'name: CI\non: [pull_request]\njobs:\n  t:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test || true\n';

function repositorioComEnfraquecimento() {
  const dir = criarProjeto({
    'package.json': PACKAGE_JSON_TESTE,
    'src/calc.js': CODIGO,
    'test/calc.test.js': TESTE_BOM,
    'test/outro.test.js': "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('um', () => { assert.equal(1, 1); });\n",
    '.github/workflows/ci.yml': WORKFLOW_BOM,
    'contraprova.json': '{ "regra": 1 }\n',
  });
  iniciarRepositorio(dir);
  commitar(dir, 'chore: estado aprovado');
  const base = git(dir, 'rev-parse', 'HEAD').trim();
  fs.writeFileSync(path.join(dir, 'test', 'calc.test.js'), TESTE_FRACO);
  fs.rmSync(path.join(dir, 'test', 'outro.test.js'));
  fs.writeFileSync(path.join(dir, '.github', 'workflows', 'ci.yml'), WORKFLOW_FRACO);
  fs.writeFileSync(path.join(dir, 'contraprova.json'), '{ "regra": 0 }\n');
  commitar(dir, 'test: afrouxa tudo');
  return { dir, base };
}

test('comparar acha remoção de teste, skip, menos asserções, workflow e política', () => {
  const { dir, base } = repositorioComEnfraquecimento();
  const r = cliJson(['comparar', dir, '--base', base]);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  const tipos = r.json.comparacao.suspeitas.map((s) => `${s.tipo}:${s.arquivo}`);
  assert.ok(tipos.includes('teste-removido:test/outro.test.js'), tipos.join(' | '));
  assert.ok(tipos.includes('ignorados-adicionados:test/calc.test.js'), tipos.join(' | '));
  assert.ok(tipos.includes('assercoes-reduzidas:test/calc.test.js'), tipos.join(' | '));
  assert.ok(tipos.includes('workflow-alterado:.github/workflows/ci.yml'), tipos.join(' | '));
  assert.ok(tipos.includes('politica-alterada:contraprova.json'), tipos.join(' | '));
  const ign = r.json.comparacao.suspeitas.find((s) => s.tipo === 'ignorados-adicionados');
  assert.match(ign.descricao, /de 0 para 1/);
  assert.ok(ign.evidencia.some((l) => l.startsWith('+') && l.includes('test.skip')), 'a evidência deveria trazer a linha do diff');
  const wf = r.json.comparacao.suspeitas.find((s) => s.tipo === 'workflow-alterado');
  assert.ok(wf.evidencia.some((l) => l.includes('|| true')));
  assert.equal(r.json.decisao, null);
});

test('verificar com --base e suspeita é inconclusivo, mesmo com os testes passando', () => {
  const { dir, base } = repositorioComEnfraquecimento();
  const r = cliJson(['verificar', dir, '--base', base, '--sem-prova']);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'inconclusivo');
  assert.equal(r.json.execucoes[0].codigoDeSaida, 0);
  assert.ok(r.json.motivos.some((m) => /suspeita\(s\) de enfraquecimento/.test(m)));
});

test('sem mudança em relação à base não há suspeita', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'src/calc.js': CODIGO, 'test/calc.test.js': TESTE_BOM });
  iniciarRepositorio(dir);
  commitar(dir, 'chore: inicio');
  const r = cliJson(['verificar', dir, '--base', 'HEAD']);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.deepEqual(r.json.comparacao.suspeitas, []);
  assert.equal(r.json.decisao, 'aprovado');
});

test('uma mudança legítima (mais asserções, novo teste) não gera suspeita', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'src/calc.js': CODIGO, 'test/calc.test.js': TESTE_FRACO });
  iniciarRepositorio(dir);
  commitar(dir, 'chore: inicio');
  fs.writeFileSync(path.join(dir, 'test', 'calc.test.js'), TESTE_BOM);
  const r = cliJson(['comparar', dir, '--base', 'HEAD']);
  assert.equal(r.codigo, 0);
  assert.deepEqual(r.json.comparacao.suspeitas, []);
});

test('renomear um arquivo de teste sem mexer no conteúdo não é remoção', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'src/calc.js': CODIGO, 'test/calc.test.js': TESTE_BOM });
  iniciarRepositorio(dir);
  commitar(dir, 'chore: inicio');
  git(dir, 'mv', 'test/calc.test.js', 'test/aritmetica.test.js');
  const r = cliJson(['comparar', dir, '--base', 'HEAD']);
  assert.deepEqual(r.json.comparacao.suspeitas, []);
});

test('referência inexistente: comparar sai com 3 e verificar fica inconclusivo', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'src/calc.js': CODIGO, 'test/calc.test.js': TESTE_BOM });
  iniciarRepositorio(dir);
  commitar(dir, 'chore: inicio');
  const c = cliJson(['comparar', dir, '--base', 'nao-existe']);
  assert.equal(c.codigo, 3);
  assert.equal(c.json.comparacao.ok, false);
  const v = cliJson(['verificar', dir, '--base', 'nao-existe', '--sem-prova']);
  assert.equal(v.codigo, 2);
  assert.equal(v.json.decisao, 'inconclusivo');
});

test('fora de um repositório git a comparação não é feita', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'test/a.test.js': "test('a', () => {});\n" });
  const r = cliJson(['comparar', dir, '--base', 'HEAD']);
  assert.equal(r.codigo, 3);
  assert.match(r.json.comparacao.erro, /não está dentro de um repositório git/);
});
