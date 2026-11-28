import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { auditarEsteira as auditarEsteiraPadrao } from './esteira.js';
import { compararComBase as compararPadrao } from './comparar.js';
import { CODIGO_DE_SAIDA, FRASE_DE_AUTORIDADE, decidir } from './decidir.js';
import { criarRegistrador, executar as executarPadrao, pythonDisponivel, testesExecutados } from './executar.js';
import { diretorioValido, investigar as investigarPadrao } from './investigar.js';
import { provar as provarPadrao } from './provar.js';
import { gravarRelatorio, montarJson } from './relatorio.js';
import { formatarDuracao } from './util.js';

const VERSAO = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;

const COMANDOS = ['investigar', 'verificar', 'provar', 'esteira', 'comparar'];

export const AJUDA = `contraprova ${VERSAO} (protótipo experimental, nível consultivo local)

Uso: contraprova <comando> [diretório] [opções]

Comandos:
  investigar   Lê o projeto sem executar nada dele: ecossistema, comando de teste,
               inventário de testes, testes ignorados, testes sem asserção, workflows.
  verificar    Investiga, executa os testes de verdade, prova que eles conseguem falhar,
               audita a esteira e (com --base) compara com uma versão anterior. Emite a decisão.
  provar       Só a prova de eficácia: introduz defeitos simples numa cópia e vê se os
               testes falham. Nunca altera o projeto original. Não emite decisão.
  esteira      Lê .github/workflows como texto e aponta o que pode fazer falhas passarem.
  comparar     Com --base <ref>, procura enfraquecimento de testes (git diff). Não emite decisão.

Opções:
  --comando "<cmd>"        Usa este comando de teste em vez do detectado.
  --tempo-limite <seg>     Tempo máximo de cada execução, em segundos (padrão 600).
  --mutantes <n>           Quantidade de defeitos introduzidos na prova (padrão 10).
  --sem-prova              Em "verificar", não faz a prova de eficácia (o relatório avisa).
  --base <ref>             Referência git para a comparação.
  --saida <dir>            Onde gravar o relatório (padrão: <projeto>/.contraprova).
  --json                   Imprime o relatório JSON no stdout.
  --ajuda                  Mostra esta ajuda.
  --versao                 Mostra a versão.

Decisões e códigos de saída (comando "verificar"):
  0 aprovado   1 bloqueado   2 inconclusivo   3 erro de uso
  "exceção autorizada" NÃO está implementada nesta versão.
  Qualquer erro interno do motor resulta em inconclusivo (2), nunca em aprovado.
  "investigar" e "esteira" saem com 0 e não emitem decisão.

Limites: o código do projeto roda na sua máquina com as suas permissões, sem isolamento.
Nada é enviado pela rede. A saída dos testes é gravada localmente em .contraprova/execucoes/.
${FRASE_DE_AUTORIDADE}
`;

const OPCOES = {
  comando: { type: 'string' },
  'tempo-limite': { type: 'string' },
  mutantes: { type: 'string' },
  'sem-prova': { type: 'boolean' },
  base: { type: 'string' },
  saida: { type: 'string' },
  json: { type: 'boolean' },
  ajuda: { type: 'boolean' },
  versao: { type: 'boolean' },
};

class ErroDeUso extends Error {}

function lerNumero(texto, nome, padrao, { inteiro = false } = {}) {
  if (texto === undefined) return padrao;
  const n = Number(texto);
  if (!Number.isFinite(n) || n <= 0 || (inteiro && !Number.isInteger(n))) {
    throw new ErroDeUso(`Valor inválido para --${nome}: "${texto}".`);
  }
  return n;
}

function resolverPython(comando) {
  if (!/^python\s/.test(comando)) return comando;
  const achado = pythonDisponivel();
  if (achado === 'python3') return comando.replace(/^python\s/, 'python3 ');
  return comando;
}

async function executarTestes(d, ctx, comando, tempoLimiteMs) {
  const r = await d.executar(comando, { cwd: ctx.dir, tempoLimiteMs });
  const registro = ctx.registrador.registrar('testes', r);
  const pytestAusente = /No module named ['"]?pytest/i.test(r.saida) && /pytest/.test(comando);
  return {
    id: registro.id,
    comando,
    codigo: r.codigo,
    codigoDeSaida: r.codigo,
    tempoEsgotado: r.tempoEsgotado,
    naoExecutavel: r.naoExecutavel,
    erroDeExecucao: r.erroDeExecucao,
    testesExecutados: testesExecutados(r.saida),
    pytestAusente,
  };
}

async function rodar(comando, v, dir, saida, d, io) {
  const tempoLimiteMs = lerNumero(v['tempo-limite'], 'tempo-limite', 600) * 1000;
  const limite = lerNumero(v.mutantes, 'mutantes', 10, { inteiro: true });
  const provaDesligada = Boolean(v['sem-prova']);
  const base = v.base;
  if (comando === 'comparar' && !base) throw new ErroDeUso('O comando "comparar" exige --base <ref>.');

  const ctx = {
    comando,
    dir,
    nomeDoProjeto: path.basename(dir),
    versaoDoMotor: VERSAO,
    opcoes: { comandoInformado: v.comando ?? null, tempoLimiteSegundos: tempoLimiteMs / 1000, mutantes: limite, semProva: provaDesligada, base: base ?? null },
    registros: [],
    provaDesligada,
    avisos: [],
  };
  const executa = comando === 'verificar' || comando === 'provar';
  if (executa) {
    ctx.registrador = criarRegistrador(saida);
    ctx.registros = ctx.registrador.registros;
  }
  const progresso = io.stderr.isTTY && !v.json ? (t) => io.stderr.write(`${t}\n`) : undefined;

  let codigo = 0;

  if (comando !== 'comparar') ctx.investigacao = d.investigar(dir);
  const inv = ctx.investigacao;

  if (inv) {
    const detectado = inv.comandoDeTeste;
    const informado = v.comando;
    if (informado) {
      ctx.comandoUsado = informado;
      ctx.origemDoComando = 'informado com --comando';
    } else if (detectado) {
      ctx.comandoUsado = detectado.comando;
      ctx.origemDoComando = detectado.origem;
    }
  }

  if (comando === 'esteira' || comando === 'verificar') {
    ctx.esteira = d.auditarEsteira(dir, inv);
  }

  if (comando === 'verificar') {
    let execucao = null;
    if (ctx.comandoUsado) {
      ctx.comandoUsado = resolverPython(ctx.comandoUsado);
      progresso?.(`Executando os testes: ${ctx.comandoUsado}`);
      execucao = await executarTestes(d, ctx, ctx.comandoUsado, tempoLimiteMs);
      ctx.execucao = execucao;
    }
    const testesRodaram = execucao && !execucao.tempoEsgotado && !execucao.naoExecutavel && !execucao.erroDeExecucao && execucao.codigo === 0;
    if (testesRodaram && !provaDesligada) {
      ctx.prova = await d.provar(dir, {
        comando: ctx.comandoUsado,
        limite,
        tempoLimiteMs,
        registrar: (tipo, r) => ctx.registrador.registrar(tipo, r),
        progresso,
      });
    }
    if (base) ctx.comparacao = d.compararComBase(dir, base);
    const r = decidir({
      investigacao: inv,
      execucao,
      comandoUsado: ctx.comandoUsado,
      provaDesligada,
      prova: ctx.prova,
      comparacao: ctx.comparacao,
      base,
    });
    Object.assign(ctx, r);
    codigo = CODIGO_DE_SAIDA[ctx.decisao];
  } else if (comando === 'provar') {
    if (!ctx.comandoUsado) {
      ctx.avisos.push('Sem comando de teste detectado e sem --comando: a prova não pôde rodar.');
      codigo = 2;
    } else {
      ctx.comandoUsado = resolverPython(ctx.comandoUsado);
      ctx.prova = await d.provar(dir, {
        comando: ctx.comandoUsado,
        limite,
        tempoLimiteMs,
        registrar: (tipo, r) => ctx.registrador.registrar(tipo, r),
        progresso,
      });
      if (!ctx.prova.executada) {
        ctx.avisos.push(`A prova não pôde rodar: ${ctx.prova.motivoInconclusivo}`);
        codigo = 2;
      }
    }
  } else if (comando === 'comparar') {
    ctx.comparacao = d.compararComBase(dir, base);
    if (!ctx.comparacao.ok) {
      ctx.avisos.push(ctx.comparacao.erro);
      codigo = 3;
    }
  }

  const json = montarJson(ctx);
  gravarRelatorio(saida, json);
  return { json, codigo, saida };
}

function linhasDeResumo(json, saida) {
  const L = [];
  L.push(`Contraprova ${json.motor.versao}: ${json.comando}`);
  const inv = json.investigacao;
  if (inv) {
    L.push(
      `Projeto: ecossistema ${inv.ecossistemas.join(', ') || 'não reconhecido'}; ` +
        `comando de teste: ${json.comandoDeTeste ? json.comandoDeTeste.comando : 'nenhum detectado'}.`,
    );
    L.push(
      `Observado sem executar (alegações do projeto): ${inv.totais.arquivosDeTeste} arquivo(s) de teste, ` +
        `cerca de ${inv.totais.testesEstimados} teste(s), ${inv.totais.testesIgnorados} ignorado(s), ` +
        `${inv.totais.arquivosSemAssercao} arquivo(s) sem asserção reconhecível.`,
    );
    for (const a of inv.inventario.filter((x) => x.semAssercao)) L.push(`  - sem asserção reconhecível: ${a.arquivo}`);
    for (const o of inv.observacoes) L.push(`  - ${o}`);
  }
  for (const e of json.execucoes.filter((x) => x.tipo === 'testes')) {
    L.push(`Testes executados de verdade: código de saída ${e.tempoEsgotado ? 'tempo esgotado' : e.codigoDeSaida}, em ${formatarDuracao(e.duracaoMs)}.`);
  }
  if (json.prova?.executada) {
    const s = json.prova.resumo;
    L.push(`Prova de eficácia: ${s.detectadosNoTotal} de ${s.total} defeitos introduzidos detectados, ${s.naoDetectados} não detectados, ${s.erros} com erro.`);
    for (const m of json.prova.mutantes.filter((x) => x.resultado === 'não detectado')) {
      L.push(`  - lacuna: ${m.arquivo}:${m.linha} (${m.troca})`);
    }
  } else if (json.prova?.motivoInconclusivo) {
    L.push(`Prova de eficácia não rodou: ${json.prova.motivoInconclusivo}`);
  }
  if (json.esteira) {
    L.push(`Esteira (heurística de texto): ${json.esteira.achados.length} aviso(s).`);
    for (const a of json.esteira.achados) L.push(`  - ${a.arquivo ? `${a.arquivo}${a.linha ? `:${a.linha}` : ''}: ` : ''}${a.mensagem}`);
    L.push(`  ${json.esteira.autoridade}`);
  }
  if (json.comparacao) {
    if (!json.comparacao.ok) L.push(`Comparação não feita: ${json.comparacao.erro}`);
    else {
      L.push(`Comparação com "${json.comparacao.base}": ${json.comparacao.suspeitas.length} suspeita(s) (suspeita não é condenação).`);
      for (const s of json.comparacao.suspeitas) L.push(`  - ${s.arquivo}: ${s.descricao}`);
    }
  }
  for (const a of json.avisos) L.push(`Aviso: ${a}`);
  if (json.decisao) {
    L.push('', `Decisão: ${json.decisao.toUpperCase()}`);
    for (const m of json.motivos) L.push(`  - ${m}`);
    L.push(`O que não foi verificado: ${json.naoVerificado.length} item(ns), listados no relatório.`);
    if (json.prova && !json.prova.executada && json.prova.desligada) L.push('ATENÇÃO: a prova de eficácia foi desligada; a eficácia dos testes NÃO foi verificada.');
  }
  L.push(`Relatório: ${path.join(saida, 'relatorio.md')}`);
  if (json.execucoes.length > 0) L.push('A saída dos testes foi gravada localmente em execucoes/ e pode conter o que o próprio teste imprime.');
  L.push(FRASE_DE_AUTORIDADE);
  return L;
}

export async function main(argv, io = { stdout: process.stdout, stderr: process.stderr }, deps = {}) {
  const d = {
    investigar: investigarPadrao,
    executar: executarPadrao,
    provar: provarPadrao,
    auditarEsteira: auditarEsteiraPadrao,
    compararComBase: compararPadrao,
    ...deps,
  };
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options: OPCOES, allowPositionals: true, strict: true });
  } catch (e) {
    io.stderr.write(`Erro de uso: ${e.message}\nUse --ajuda para ver as opções.\n`);
    return 3;
  }
  const { values: v, positionals } = parsed;
  if (v.ajuda) {
    io.stdout.write(AJUDA);
    return 0;
  }
  if (v.versao) {
    io.stdout.write(`${VERSAO}\n`);
    return 0;
  }
  const [comando, dirArg = '.', ...resto] = positionals;
  if (!comando || !COMANDOS.includes(comando) || resto.length > 0) {
    io.stderr.write(`Erro de uso: ${!comando ? 'faltou o comando' : resto.length ? 'argumentos demais' : `comando desconhecido "${comando}"`}.\n\n${AJUDA}`);
    return 3;
  }
  const dir = path.resolve(dirArg);
  if (!diretorioValido(dir)) {
    io.stderr.write(`Erro de uso: o diretório "${dirArg}" não existe.\n`);
    return 3;
  }
  const saida = v.saida ? path.resolve(v.saida) : path.join(dir, '.contraprova');

  try {
    const { json, codigo } = await rodar(comando, v, dir, saida, d, io);
    io.stdout.write(v.json ? `${JSON.stringify(json, null, 2)}\n` : `${linhasDeResumo(json, saida).join('\n')}\n`);
    return codigo;
  } catch (e) {
    if (e instanceof ErroDeUso) {
      io.stderr.write(`Erro de uso: ${e.message}\n`);
      return 3;
    }
    // Falha segura: erro interno nunca é aprovação.
    io.stderr.write(`Erro interno do motor: ${e?.message ?? e}\n`);
    const motivo = 'Erro interno do motor: por falha segura, a decisão é inconclusivo.';
    io.stdout.write(
      v.json
        ? `${JSON.stringify({ versaoDoEsquema: 1, decisao: 'inconclusivo', motivos: [motivo], nivelDeAutoridade: 'consultivo local' }, null, 2)}\n`
        : `Decisão: INCONCLUSIVO\n  - ${motivo}\n${FRASE_DE_AUTORIDADE}\n`,
    );
    return 2;
  }
}
