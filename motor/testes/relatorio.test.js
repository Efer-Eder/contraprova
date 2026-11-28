import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { EXEMPLOS, PACKAGE_JSON_TESTE, VERSAO, cli, cliJson, commitar, criarProjeto, iniciarRepositorio, pastaTemporaria } from './ajuda.js';

const TRAVESSAO = String.fromCharCode(0x2014);
const EMOJI = /\p{Extended_Pictographic}/u;

test('relatorio.json tem o esquema esperado e bate com o que foi impresso', () => {
  const saida = pastaTemporaria('cp-saida-');
  const r = cli(['verificar', path.join(EXEMPLOS, 'correto'), '--mutantes', '3', '--json', '--saida', saida]);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  const impresso = JSON.parse(r.stdout);
  const gravado = JSON.parse(fs.readFileSync(path.join(saida, 'relatorio.json'), 'utf8'));
  assert.deepEqual(impresso, gravado);

  assert.equal(gravado.versaoDoEsquema, 1);
  assert.equal(gravado.motor.versao, VERSAO);
  assert.match(gravado.geradoEm, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  assert.equal(gravado.ambiente.plataforma, process.platform);
  assert.equal(gravado.ambiente.node, process.version);
  assert.equal(gravado.nivelDeAutoridade, 'consultivo local');
  assert.equal(gravado.politica.nome, 'política padrão embutida');
  assert.equal(gravado.decisao, 'aprovado');
  assert.ok(Array.isArray(gravado.motivos) && gravado.motivos.length > 0);
  assert.ok(Array.isArray(gravado.naoVerificado) && gravado.naoVerificado.length > 0);
  assert.ok(gravado.naoVerificado.some((i) => /regras de proteção do repositório/.test(i)));
  assert.ok(Array.isArray(gravado.esteira.achados));
  assert.ok(gravado.esteira.autoridade.includes('"consultivo"'));
  assert.equal(gravado.prova.mutantes.length, 3);
  for (const m of gravado.prova.mutantes) {
    for (const campo of ['arquivo', 'linha', 'linhaOriginal', 'linhaMutada', 'troca', 'resultado']) assert.ok(m[campo] !== undefined, campo);
    assert.notEqual(m.linhaOriginal, m.linhaMutada);
  }
  assert.ok(!JSON.stringify(gravado).includes(process.env.USERNAME ?? '\u0000nao-existe'), 'o relatório não deve conter o nome de usuário local');
});

test('cada execução registra comando, código, duração e o sha256 da saída completa gravada', () => {
  const saida = pastaTemporaria('cp-saida-');
  cli(['verificar', path.join(EXEMPLOS, 'correto'), '--mutantes', '2', '--saida', saida]);
  const j = JSON.parse(fs.readFileSync(path.join(saida, 'relatorio.json'), 'utf8'));
  assert.equal(j.execucoes.length, 1 + 1 + 2);
  assert.deepEqual(
    j.execucoes.map((e) => e.tipo),
    ['testes', 'prova-base', 'mutante-01', 'mutante-02'],
  );
  for (const e of j.execucoes) {
    assert.equal(typeof e.comando, 'string');
    assert.equal(typeof e.codigoDeSaida, 'number');
    assert.equal(typeof e.duracaoMs, 'number');
    const conteudo = fs.readFileSync(path.join(saida, e.arquivoDeSaida), 'utf8');
    assert.equal(createHash('sha256').update(conteudo).digest('hex'), e.sha256DaSaida);
  }
});

test('relatorio.md traz as seções para quem não domina testes, sem travessão nem emoji', () => {
  const saida = pastaTemporaria('cp-saida-');
  cli(['verificar', path.join(EXEMPLOS, 'teste-fraco'), '--saida', saida]);
  const md = fs.readFileSync(path.join(saida, 'relatorio.md'), 'utf8');
  for (const trecho of [
    '# Relatório do Contraprova',
    '## Decisão: INCONCLUSIVO',
    'Nível de autoridade: consultivo local. Este resultado recomenda, não impede.',
    '## O que foi verificado',
    '## O que NÃO foi verificado',
    '## O que fazer agora',
    '### Lacunas',
    '## Esteira de publicação',
    '## Política aplicada',
  ]) {
    assert.ok(md.includes(trecho), trecho);
  }
  assert.equal(md.match(/^# /gm).length, 1, 'um único H1');
  assert.ok(!md.includes(TRAVESSAO));
  assert.ok(!EMOJI.test(md));
  assert.ok(md.endsWith('\n'));
  assert.ok(!md.includes('\r'));
});

test('o relatório de erro de uso não é gravado e a saída não tem travessão nem emoji', () => {
  const saidaAjuda = cli(['--ajuda']).stdout;
  assert.ok(!saidaAjuda.includes(TRAVESSAO));
  assert.ok(!EMOJI.test(saidaAjuda));
});

test('fora de um repositório git não há commit; dentro dele, o commit e a árvore suja aparecem', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'test/a.test.js': "import test from 'node:test';\nimport assert from 'node:assert';\ntest('a', () => assert.ok(true));\n" });
  let r = cliJson(['investigar', dir]);
  assert.deepEqual(r.json.ambiente.git, { ativo: false, commit: null, arvoreSuja: null });
  iniciarRepositorio(dir);
  commitar(dir, 'chore: inicio');
  r = cliJson(['investigar', dir]);
  assert.equal(r.json.ambiente.git.ativo, true);
  assert.match(r.json.ambiente.git.commit, /^[0-9a-f]{40}$/);
  assert.equal(r.json.ambiente.git.arvoreSuja, false);
  fs.writeFileSync(path.join(dir, 'novo.txt'), 'x');
  r = cliJson(['investigar', dir]);
  assert.equal(r.json.ambiente.git.arvoreSuja, true);
});

test('a saída do terminal não usa cores (sem códigos ANSI)', () => {
  const r = cli(['investigar', path.join(EXEMPLOS, 'correto'), '--saida', pastaTemporaria('cp-saida-')]);
  assert.ok(!r.stdout.includes('\u001b['));
});

test('o relatório padrão vai para .contraprova dentro do projeto e é ignorado pelo inventário', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'test/a.test.js': "import test from 'node:test';\nimport assert from 'node:assert';\ntest('a', () => assert.ok(true));\n" });
  cli(['investigar', dir]);
  assert.ok(fs.existsSync(path.join(dir, '.contraprova', 'relatorio.json')));
  assert.ok(fs.existsSync(path.join(dir, '.contraprova', 'relatorio.md')));
  const de_novo = cliJson(['investigar', dir]);
  assert.deepEqual(
    de_novo.json.investigacao.inventario.map((a) => a.arquivo),
    ['test/a.test.js'],
  );
});
