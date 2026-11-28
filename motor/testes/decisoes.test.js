import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { EXEMPLOS, VERSAO, cli, cliJson, criarProjeto, pythonExiste, PACKAGE_JSON_TESTE } from './ajuda.js';

const FRASE = 'Nível de autoridade: consultivo local. Este resultado recomenda, não impede.';
const ex = (nome) => path.join(EXEMPLOS, nome);

test('exemplo correto: aprovado, código 0, defeitos detectados', () => {
  const r = cliJson(['verificar', ex('correto'), '--mutantes', '6']);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'aprovado');
  assert.equal(r.json.prova.executada, true);
  assert.equal(r.json.prova.resumo.total, 6);
  assert.equal(r.json.prova.resumo.detectadosNoTotal, 6);
  assert.equal(r.json.prova.resumo.naoDetectados, 0);
  assert.equal(r.json.nivelDeAutoridade, 'consultivo local');
});

test('exemplo teste-fraco: inconclusivo, código 2, nenhum defeito detectado', () => {
  const r = cliJson(['verificar', ex('teste-fraco')]);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'inconclusivo');
  assert.equal(r.json.prova.resumo.detectadosNoTotal, 0);
  assert.ok(r.json.prova.resumo.naoDetectados > 0);
  assert.ok(r.json.motivos.some((m) => /nenhum dos \d+ defeitos/.test(m)));
  assert.equal(r.json.investigacao.totais.arquivosSemAssercao, 1);
});

test('exemplo teste-falhando: bloqueado, código 1, sem prova de eficácia', () => {
  const r = cliJson(['verificar', ex('teste-falhando')]);
  assert.equal(r.codigo, 1, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'bloqueado');
  assert.notEqual(r.json.execucoes.find((e) => e.tipo === 'testes').codigoDeSaida, 0);
  assert.equal(r.json.prova.executada, false);
});

test('exemplo sem-testes: inconclusivo, código 2, nada é executado', () => {
  const r = cliJson(['verificar', ex('sem-testes')]);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'inconclusivo');
  assert.equal(r.json.execucoes.length, 0);
});

test('exemplo teste-ignorado: investigar conta 3 e verificar registra a ressalva', () => {
  const inv = cliJson(['investigar', ex('teste-ignorado')]);
  assert.equal(inv.codigo, 0);
  assert.equal(inv.json.decisao, null);
  assert.equal(inv.json.investigacao.totais.testesIgnorados, 3);
  const ver = cliJson(['verificar', ex('teste-ignorado'), '--sem-prova']);
  assert.ok(ver.json.motivos.some((m) => /3 teste\(s\) ignorado\(s\)/.test(m)));
});

test('exemplo esteira-permissiva: o comando esteira aponta os problemas e sai com 0', () => {
  const r = cliJson(['esteira', ex('esteira-permissiva')]);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.equal(r.json.decisao, null);
  const ids = r.json.esteira.achados.map((a) => a.id);
  assert.ok(ids.includes('continue-on-error'));
  assert.ok(ids.includes('falha-tolerada'));
  assert.ok(ids.includes('sem-pull-request'));
});

test('exemplo Python com unittest: aprovado com --comando (pulado sem Python)', (t) => {
  if (!pythonExiste()) {
    t.skip('Python não está instalado nesta máquina: este teste não pôde rodar.');
    return;
  }
  const r = cliJson(['verificar', ex('python-unittest'), '--comando', 'python -m unittest']);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'aprovado');
  assert.ok(r.json.prova.resumo.detectadosNoTotal >= 1);
});

test('--sem-prova aprova, mas o relatório avisa com destaque que a eficácia não foi verificada', () => {
  const r = cli(['verificar', ex('teste-fraco'), '--sem-prova', '--saida', criarProjeto({})]);
  assert.equal(r.codigo, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /Decisão: APROVADO/);
  assert.match(r.stdout, /ATENÇÃO: a prova de eficácia foi desligada/);
  assert.match(r.stdout, /NÃO foi verificado se os testes conseguem falhar/);
});

test('tempo limite estourado é inconclusivo, nunca aprovado', () => {
  const dir = criarProjeto({
    'package.json': PACKAGE_JSON_TESTE,
    'dorme.js': 'setTimeout(() => {}, 60000);\n',
    'test/a.test.js': "import test from 'node:test'; import assert from 'node:assert'; test('a', () => assert.ok(true));\n",
  });
  const inicio = Date.now();
  const r = cliJson(['verificar', dir, '--comando', 'node dorme.js', '--tempo-limite', '1', '--sem-prova']);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'inconclusivo');
  assert.equal(r.json.execucoes[0].tempoEsgotado, true);
  assert.ok(Date.now() - inicio < 30000, 'o tempo limite deveria interromper a execução');
});

test('comando que não existe é inconclusivo', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'test/a.test.js': "test('a', () => {});\n" });
  const r = cliJson(['verificar', dir, '--comando', 'contraprova-comando-que-nao-existe-xyz', '--sem-prova']);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.equal(r.json.execucoes[0].naoExecutavel, true);
});

test('ecossistema não reconhecido e sem --comando é inconclusivo', () => {
  const r = cliJson(['verificar', criarProjeto({ 'LEIAME.txt': 'nada aqui' })]);
  assert.equal(r.codigo, 2);
  assert.ok(r.json.motivos.some((m) => /não reconhecido/.test(m)));
});

test('sucesso sem nenhum teste detectado é inconclusivo', () => {
  const dir = criarProjeto({ 'app.js': 'console.log(1);\n' });
  const r = cliJson(['verificar', dir, '--comando', 'node app.js', '--sem-prova']);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.ok(r.json.motivos.some((m) => /Nenhum arquivo de teste/.test(m)));
});

test('--comando que falha é bloqueado', () => {
  const dir = criarProjeto({ 'package.json': PACKAGE_JSON_TESTE, 'test/a.test.js': "test('a', () => {});\n" });
  const r = cliJson(['verificar', dir, '--comando', 'node -e "process.exit(3)"']);
  assert.equal(r.codigo, 1, r.stdout + r.stderr);
  assert.equal(r.json.decisao, 'bloqueado');
  assert.equal(r.json.execucoes[0].codigoDeSaida, 3);
});

test('toda saída de verificar traz a frase de nível de autoridade', () => {
  for (const nome of ['correto', 'teste-falhando', 'sem-testes']) {
    const r = cli(['verificar', ex(nome), '--mutantes', '2', '--saida', criarProjeto({})]);
    assert.ok(r.stdout.includes(FRASE), `${nome}: ${r.stdout}`);
  }
});

test('erros de uso saem com 3', () => {
  assert.equal(cli([]).codigo, 3);
  assert.equal(cli(['voar']).codigo, 3);
  assert.equal(cli(['verificar', 'pasta-que-nao-existe-xyz']).codigo, 3);
  assert.equal(cli(['verificar', '.', '--opcao-inexistente']).codigo, 3);
  assert.equal(cli(['verificar', ex('correto'), '--mutantes', 'abc']).codigo, 3);
  assert.equal(cli(['comparar', ex('correto')]).codigo, 3);
});

test('--ajuda e --versao', () => {
  const ajuda = cli(['--ajuda']);
  assert.equal(ajuda.codigo, 0);
  for (const palavra of ['investigar', 'verificar', 'provar', 'esteira', 'comparar', 'exceção autorizada']) {
    assert.ok(ajuda.stdout.includes(palavra), palavra);
  }
  assert.ok(ajuda.stdout.includes(FRASE));
  const versao = cli(['--versao']);
  assert.equal(versao.codigo, 0);
  assert.equal(versao.stdout.trim(), VERSAO);
});

test('o motor não imprime variáveis de ambiente do chamador', () => {
  const segredo = 'valor-secreto-de-teste-9f3a1c';
  const r = cli(['verificar', ex('correto'), '--mutantes', '2', '--saida', criarProjeto({})], { env: { CHAVE_FICTICIA_DE_TESTE: segredo } });
  assert.equal(r.stdout.includes(segredo) || r.stderr.includes(segredo), false);
});
