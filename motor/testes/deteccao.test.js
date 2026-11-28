import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { investigar, analisarArquivoDeTeste } from '../src/investigar.js';
import { mascararCodigo } from '../src/util.js';
import { EXEMPLOS, PACKAGE_JSON_TESTE, criarProjeto, commitar, iniciarRepositorio } from './ajuda.js';

const exemplo = (nome) => investigar(path.join(EXEMPLOS, nome));

test('detecta Node e o comando npm test no exemplo correto', () => {
  const inv = exemplo('correto');
  assert.deepEqual(inv.ecossistemas, ['node']);
  assert.equal(inv.comandoDeTeste.comando, 'npm test');
  assert.equal(inv.totais.arquivosDeTeste, 1);
  assert.equal(inv.totais.testesEstimados, 5);
  assert.equal(inv.totais.testesIgnorados, 0);
  assert.equal(inv.totais.arquivosSemAssercao, 0);
  assert.match(inv.natureza, /não executado/);
});

test('o placeholder padrão do npm conta como ausência de testes', () => {
  const inv = exemplo('sem-testes');
  assert.equal(inv.node.placeholder, true);
  assert.equal(inv.comandoDeTeste, null);
  assert.equal(inv.totais.arquivosDeTeste, 0);
  assert.ok(inv.observacoes.some((o) => /no test specified/.test(o)));
});

test('conta os 3 testes ignorados do exemplo teste-ignorado', () => {
  const inv = exemplo('teste-ignorado');
  assert.equal(inv.totais.testesIgnorados, 3);
  assert.equal(inv.inventario[0].testes, 4);
});

test('aponta o arquivo de teste sem asserção do exemplo teste-fraco', () => {
  const inv = exemplo('teste-fraco');
  assert.equal(inv.totais.arquivosSemAssercao, 1);
  assert.equal(inv.inventario[0].semAssercao, true);
  assert.equal(inv.inventario[0].arquivo, 'test/calc.test.js');
});

test('detecta Python pelo pyproject e pelos arquivos test_*.py', () => {
  const inv = exemplo('python-unittest');
  assert.deepEqual(inv.ecossistemas, ['python']);
  assert.equal(inv.comandoDeTeste.comando, 'python -m pytest');
  assert.deepEqual(inv.python.arquivosDeTeste, ['test_calc.py']);
  assert.equal(inv.inventario[0].testes, 3);
  assert.ok(inv.inventario[0].assercoes >= 5);
});

test('Python sem arquivos de teste é reconhecido, mas não tem comando', () => {
  const dir = criarProjeto({ 'requirements.txt': 'requests\n', 'app.py': 'print(1)\n' });
  const inv = investigar(dir);
  assert.deepEqual(inv.ecossistemas, ['python']);
  assert.equal(inv.comandoDeTeste, null);
});

test('diretório vazio não tem ecossistema', () => {
  const inv = investigar(criarProjeto({ 'LEIAME.txt': 'nada' }));
  assert.deepEqual(inv.ecossistemas, []);
  assert.equal(inv.comandoDeTeste, null);
});

test('conta cada forma de teste ignorado em JavaScript', () => {
  const texto = [
    "test.skip('a', () => {});",
    "it.skip('b', () => {});",
    "xit('c', () => {});",
    "xdescribe('d', () => {});",
    "test.todo('e');",
    "it.only('f', () => {});",
    "test('g', { skip: true }, () => {});",
    "describe.skip('h', () => {});",
  ].join('\n');
  assert.equal(analisarArquivoDeTeste(texto, false).ignorados, 8);
});

test('conta cada forma de teste ignorado em Python', () => {
  const texto = [
    'import unittest, pytest',
    '@pytest.mark.skip(reason="x")',
    'def test_a(): pass',
    '@unittest.skip("y")',
    'def test_b(): pass',
    '@pytest.mark.skipif(True, reason="z")',
    'def test_c(): pass',
    'def test_d():',
    '    pytest.skip("w")',
  ].join('\n');
  const a = analisarArquivoDeTeste(texto, true);
  assert.equal(a.ignorados, 4);
  assert.equal(a.testes, 4);
});

test('comentários e textos entre aspas não contam como skip nem como asserção', () => {
  const texto = [
    "// test.skip('comentado', () => {});",
    "const texto = \"it.skip('em texto')\";",
    "test('real', () => { const x = 'assert.equal(1, 1)'; });",
  ].join('\n');
  const a = analisarArquivoDeTeste(texto, false);
  assert.equal(a.ignorados, 0);
  assert.equal(a.assercoes, 0);
  assert.equal(a.testes, 1);
});

test('reconhece asserções de assert, expect e unittest', () => {
  assert.ok(analisarArquivoDeTeste("test('a', () => { assert.equal(1, 1); });", false).assercoes >= 1);
  assert.ok(analisarArquivoDeTeste("it('a', () => { expect(1).toBe(1); });", false).assercoes >= 1);
  assert.ok(analisarArquivoDeTeste('def test_a():\n    assert 1 == 1\n', true).assercoes >= 1);
  assert.ok(analisarArquivoDeTeste('class T:\n    def test_a(self):\n        self.assertEqual(1, 1)\n', true).assercoes >= 1);
  assert.equal(analisarArquivoDeTeste("test('a', () => { soma(1, 2); });", false).assercoes, 0);
});

test('a máscara preserva tamanho e quebras de linha', () => {
  const texto = "a = 'abc' // fim\nb = `x\ny`\n/* c\nd */ e\n";
  const m = mascararCodigo(texto, false);
  assert.equal(m.length, texto.length);
  assert.equal(m.split('\n').length, texto.split('\n').length);
  assert.ok(!m.includes('abc'));
  assert.ok(!m.includes('fim'));
});

test('investigar nunca executa o projeto', () => {
  const marcador = 'marcador-executou.txt';
  const dir = criarProjeto({
    'package.json': JSON.stringify({
      name: 'x',
      scripts: { test: `node -e "require('fs').writeFileSync('${marcador}', 'x')"` },
    }),
    'test/a.test.js': "import test from 'node:test'; test('a', () => {});\n",
    'index.js': `require('fs').writeFileSync('${marcador}', 'x');\n`,
  });
  const inv = investigar(dir);
  assert.equal(inv.comandoDeTeste.comando, 'npm test');
  assert.equal(fs.existsSync(path.join(dir, marcador)), false);
});

test('inventário ignora node_modules, exemplos e fixtures', () => {
  const dir = criarProjeto({
    'package.json': PACKAGE_JSON_TESTE,
    'test/a.test.js': "test('a', () => { assert.ok(1); });\n",
    'node_modules/pkg/test/b.test.js': "test('b', () => {});\n",
    'exemplos/c/test/c.test.js': "test('c', () => {});\n",
    'fixtures/d.test.js': "test('d', () => {});\n",
  });
  assert.deepEqual(
    investigar(dir).inventario.map((a) => a.arquivo),
    ['test/a.test.js'],
  );
});

test('lista os workflows e informa se há git', () => {
  const dir = criarProjeto({
    'package.json': PACKAGE_JSON_TESTE,
    '.github/workflows/ci.yml': 'name: CI\n',
    '.github/workflows/outro.yaml': 'name: Outro\n',
    '.github/workflows/leiame.txt': 'não é workflow\n',
  });
  let inv = investigar(dir);
  assert.deepEqual(inv.workflows, ['.github/workflows/ci.yml', '.github/workflows/outro.yaml']);
  assert.equal(inv.git.ativo, false);
  iniciarRepositorio(dir);
  commitar(dir, 'chore: inicio');
  inv = investigar(dir);
  assert.equal(inv.git.ativo, true);
  assert.match(inv.git.commit, /^[0-9a-f]{40}$/);
  assert.equal(inv.git.arvoreSuja, false);
});
