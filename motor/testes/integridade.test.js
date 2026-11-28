import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cli, cliJson, copiarExemplo, criarProjeto, hashDaArvore, pastaTemporaria } from './ajuda.js';

// O Node cria a própria pasta de cache dentro do TMPDIR; só importam as pastas do motor.
const sobras = (tmp) => fs.readdirSync(tmp).filter((n) => n.startsWith('contraprova-'));

function ambienteComTmpProprio() {
  const tmp = pastaTemporaria('cp-tmp-');
  return { tmp, env: { TMPDIR: tmp, TEMP: tmp, TMP: tmp } };
}

test('provar deixa o projeto original byte a byte intacto e remove o diretório temporário', () => {
  const projeto = copiarExemplo('correto');
  const { tmp, env } = ambienteComTmpProprio();
  const antes = hashDaArvore(projeto);
  const r = cliJson(['provar', projeto, '--mutantes', '6'], { env });
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.equal(r.json.prova.executada, true);
  assert.equal(r.json.prova.mutantes.length, 6);
  assert.equal(hashDaArvore(projeto), antes, 'o projeto original foi alterado');
  assert.equal(r.json.prova.diretorioTemporarioRemovido, true);
  assert.deepEqual(sobras(tmp), [], 'sobrou diretório temporário');
});

test('verificar completo também não altera o projeto original', () => {
  const projeto = copiarExemplo('teste-fraco');
  const { tmp, env } = ambienteComTmpProprio();
  const antes = hashDaArvore(projeto);
  const r = cliJson(['verificar', projeto], { env });
  assert.equal(r.codigo, 2);
  assert.equal(hashDaArvore(projeto), antes);
  assert.deepEqual(sobras(tmp), []);
});

test('o diretório temporário é removido mesmo quando os mutantes estouram o tempo', () => {
  const projeto = criarProjeto({
    'package.json': JSON.stringify({ name: 'laco', private: true, type: 'module', scripts: { test: 'node --test' } }),
    'src/laco.js': 'export function esperar(n) {\n  let i = 0;\n  while (i < n) i = i + 1;\n  return i;\n}\n',
    'test/laco.test.js':
      "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { esperar } from '../src/laco.js';\n" +
      "test('conta', () => { assert.equal(esperar(3), 3); });\n",
  });
  const { tmp, env } = ambienteComTmpProprio();
  const antes = hashDaArvore(projeto);
  // "i + 1" vira "i - 1": o laço nunca termina e o mutante só acaba pelo tempo limite.
  const r = cliJson(['provar', projeto, '--tempo-limite', '4'], { env });
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.ok(r.json.prova.mutantes.some((m) => m.resultado === 'tempo esgotado'), JSON.stringify(r.json.prova.mutantes));
  assert.equal(hashDaArvore(projeto), antes);
  assert.deepEqual(sobras(tmp), []);
});

test('o node_modules do projeto original é ligado à cópia e continua intacto', () => {
  const projeto = criarProjeto({
    'package.json': JSON.stringify({ name: 'nm', private: true, type: 'module', scripts: { test: 'node --test' } }),
    'node_modules/dep/index.js': 'export const dobro = (x) => x * 2;\n',
    'node_modules/dep/package.json': JSON.stringify({ name: 'dep', version: '1.0.0', type: 'module', main: 'index.js' }),
    'src/uso.js': "import { dobro } from 'dep';\nexport function quatro(x) {\n  if (x > 0) return dobro(dobro(x));\n  return 0;\n}\n",
    'test/uso.test.js':
      "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { quatro } from '../src/uso.js';\n" +
      "test('quatro', () => { assert.equal(quatro(1), 4); assert.equal(quatro(-1), 0); });\n",
  });
  const { tmp, env } = ambienteComTmpProprio();
  const antes = hashDaArvore(projeto);
  const r = cliJson(['provar', projeto], { env });
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.equal(r.json.prova.resumo.detectadosNoTotal >= 1, true);
  assert.equal(hashDaArvore(projeto), antes, 'o node_modules ou o código original mudou');
  assert.ok(fs.existsSync(path.join(projeto, 'node_modules', 'dep', 'index.js')));
  assert.deepEqual(sobras(tmp), []);
});

test('se os testes não passam na cópia intacta, a prova é inconclusiva e informa o motivo', () => {
  const projeto = copiarExemplo('teste-falhando');
  const r = cliJson(['provar', projeto]);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.prova.executada, false);
  assert.match(r.json.prova.motivoInconclusivo, /não passaram na cópia intacta/);
  assert.equal(r.json.prova.diretorioTemporarioRemovido, true);
});

test('projeto sem nenhum ponto de mutação: a prova não roda e nenhuma cópia é feita', () => {
  const projeto = criarProjeto({
    'package.json': JSON.stringify({ name: 'x', private: true, type: 'module', scripts: { test: 'node --test' } }),
    'src/a.js': 'export const a = 1;\n',
    'test/a.test.js': "import test from 'node:test';\nimport assert from 'node:assert';\nimport { a } from '../src/a.js';\ntest('a', () => assert.equal(a, 1));\n",
  });
  const { tmp, env } = ambienteComTmpProprio();
  const r = cliJson(['verificar', projeto], { env });
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.prova.executada, false);
  assert.match(r.json.prova.motivoInconclusivo, /Nenhum ponto de mutação/);
  assert.deepEqual(sobras(tmp), []);
});

test('link simbólico dentro do projeto não permite escrever fora da cópia', (t) => {
  const alvo = criarProjeto({ 'externo.js': 'export const x = 1 + 1;\n' });
  const projeto = criarProjeto({
    'package.json': JSON.stringify({ name: 's', private: true, type: 'module', scripts: { test: 'node --test' } }),
    'src/a.js': 'export function f(a, b) {\n  return a + b;\n}\n',
    'test/a.test.js': "import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { f } from '../src/a.js';\ntest('f', () => assert.equal(f(1, 2), 3));\n",
  });
  try {
    fs.symlinkSync(path.join(alvo, 'externo.js'), path.join(projeto, 'src', 'ligado.js'), 'file');
  } catch {
    t.skip('Esta máquina não permite criar link simbólico sem privilégio: este teste não pôde rodar.');
    return;
  }
  const antesAlvo = hashDaArvore(alvo);
  const r = cli(['provar', projeto, '--saida', pastaTemporaria('cp-saida-')]);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.equal(hashDaArvore(alvo), antesAlvo, 'um arquivo fora do projeto foi alterado');
});
