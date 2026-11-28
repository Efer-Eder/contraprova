import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { main } from '../src/cli.js';
import { decidir } from '../src/decidir.js';
import { EXEMPLOS, cli, pastaTemporaria } from './ajuda.js';

function capturar() {
  const saida = { out: '', err: '' };
  const io = {
    stdout: { write: (t) => (saida.out += t), isTTY: false },
    stderr: { write: (t) => (saida.err += t), isTTY: false },
  };
  return { saida, io };
}

const correto = path.join(EXEMPLOS, 'correto');

test('erro interno na investigação vira inconclusivo (código 2), nunca aprovado', async () => {
  const { saida, io } = capturar();
  const codigo = await main(['verificar', correto, '--saida', pastaTemporaria()], io, {
    investigar: () => {
      throw new Error('falha simulada');
    },
  });
  assert.equal(codigo, 2);
  assert.match(saida.out, /Decisão: INCONCLUSIVO/);
  assert.doesNotMatch(saida.out, /APROVADO/);
  assert.match(saida.err, /falha simulada/);
  assert.match(saida.out, /consultivo local/);
});

test('erro interno na prova, depois de os testes passarem, vira inconclusivo', async () => {
  const { saida, io } = capturar();
  const codigo = await main(['verificar', correto, '--saida', pastaTemporaria()], io, {
    provar: async () => {
      throw new Error('falha simulada na prova');
    },
  });
  assert.equal(codigo, 2);
  assert.doesNotMatch(saida.out, /APROVADO/);
});

test('erro interno com --json imprime JSON com decisão inconclusivo', async () => {
  const { saida, io } = capturar();
  const codigo = await main(['verificar', correto, '--json', '--saida', pastaTemporaria()], io, {
    auditarEsteira: () => {
      throw new Error('falha simulada');
    },
  });
  assert.equal(codigo, 2);
  assert.equal(JSON.parse(saida.out).decisao, 'inconclusivo');
});

test('não conseguir gravar o relatório também é inconclusivo', () => {
  const arquivoNoLugarDeDiretorio = path.join(EXEMPLOS, 'correto', 'package.json');
  const r = cli(['verificar', correto, '--sem-prova', '--saida', arquivoNoLugarDeDiretorio]);
  assert.equal(r.codigo, 2, r.stdout + r.stderr);
  assert.match(r.stdout, /INCONCLUSIVO/);
});

test('decidir: entradas incompletas ou estranhas nunca resultam em aprovado', () => {
  const investigacao = { ecossistemas: ['node'], totais: { arquivosDeTeste: 1, testesIgnorados: 0 } };
  const ok = { codigo: 0, tempoEsgotado: false, naoExecutavel: false, erroDeExecucao: null, testesExecutados: 3 };
  const base = { investigacao, execucao: ok, comandoUsado: 'npm test', provaDesligada: false };

  // passou, mas a prova nem foi tentada
  assert.equal(decidir({ ...base, prova: undefined }).decisao, 'inconclusivo');
  // a prova existe, mas não executou
  assert.equal(decidir({ ...base, prova: { executada: false, motivoInconclusivo: 'x', mutantes: [] } }).decisao, 'inconclusivo');
  // a prova executou e nada foi detectado
  const ruim = { executada: true, mutantes: [{ resultado: 'não detectado' }] };
  assert.equal(decidir({ ...base, prova: ruim }).decisao, 'inconclusivo');
  // a prova executou com zero mutantes
  assert.equal(decidir({ ...base, prova: { executada: true, mutantes: [] } }).decisao, 'inconclusivo');
  // só erros de mutante
  assert.equal(decidir({ ...base, prova: { executada: true, mutantes: [{ resultado: 'erro' }] } }).decisao, 'inconclusivo');
  // o caso bom, para garantir que a função consegue aprovar
  assert.equal(decidir({ ...base, prova: { executada: true, mutantes: [{ resultado: 'detectado' }] } }).decisao, 'aprovado');
  // zero testes executados
  assert.equal(
    decidir({ ...base, execucao: { ...ok, testesExecutados: 0 }, provaDesligada: true }).decisao,
    'inconclusivo',
  );
  // sem execução alguma
  assert.equal(decidir({ ...base, execucao: null, comandoUsado: null }).decisao, 'inconclusivo');
  // tempo esgotado
  assert.equal(decidir({ ...base, execucao: { ...ok, codigo: null, tempoEsgotado: true }, provaDesligada: true }).decisao, 'inconclusivo');
  // falha dos testes vence qualquer outra coisa
  assert.equal(decidir({ ...base, execucao: { ...ok, codigo: 1 } }).decisao, 'bloqueado');
  // suspeita na comparação
  const comparacao = { ok: true, suspeitas: [{ tipo: 'x' }] };
  const prova = { executada: true, mutantes: [{ resultado: 'detectado' }] };
  assert.equal(decidir({ ...base, prova, comparacao, base: 'main' }).decisao, 'inconclusivo');
  // comparação pedida e que falhou
  assert.equal(decidir({ ...base, prova, comparacao: { ok: false, erro: 'x' }, base: 'main' }).decisao, 'inconclusivo');
});

test('tempo esgotado em mutante conta como detectado, registrado à parte', () => {
  const investigacao = { ecossistemas: ['node'], totais: { arquivosDeTeste: 1, testesIgnorados: 0 } };
  const ok = { codigo: 0, tempoEsgotado: false, naoExecutavel: false, erroDeExecucao: null, testesExecutados: 3 };
  const r = decidir({
    investigacao,
    execucao: ok,
    comandoUsado: 'npm test',
    provaDesligada: false,
    prova: { executada: true, mutantes: [{ resultado: 'tempo esgotado' }, { resultado: 'não detectado' }] },
  });
  assert.equal(r.decisao, 'aprovado');
  assert.ok(r.motivos.some((m) => /1 por tempo esgotado/.test(m)));
  assert.ok(r.motivos.some((m) => /NÃO foram detectados/.test(m)));
});
