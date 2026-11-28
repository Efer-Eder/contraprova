import fs from 'node:fs';
import path from 'node:path';
import { FRASE_DE_AUTORIDADE, NIVEL_DE_AUTORIDADE, POLITICA_PADRAO } from './decidir.js';
import { resumirMutantes } from './provar.js';
import { formatarDuracao } from './util.js';

export const VERSAO_DO_ESQUEMA = 1;

export function montarJson(c) {
  return {
    versaoDoEsquema: VERSAO_DO_ESQUEMA,
    motor: { nome: 'contraprova', versao: c.versaoDoMotor },
    geradoEm: new Date().toISOString(),
    comando: c.comando,
    projeto: { nome: c.nomeDoProjeto },
    ambiente: {
      plataforma: process.platform,
      arquitetura: process.arch,
      node: process.version,
      git: c.investigacao ? c.investigacao.git : { ativo: false, commit: null, arvoreSuja: null },
    },
    nivelDeAutoridade: NIVEL_DE_AUTORIDADE,
    politica: POLITICA_PADRAO,
    opcoes: c.opcoes,
    investigacao: c.investigacao,
    comandoDeTeste: c.comandoUsado ? { comando: c.comandoUsado, origem: c.origemDoComando } : null,
    execucoes: c.registros,
    execucaoDosTestes: c.execucao
      ? {
          execucao: c.execucao.id,
          codigoDeSaida: c.execucao.codigoDeSaida,
          testesExecutados: c.execucao.testesExecutados ?? null,
        }
      : null,
    prova: c.prova
      ? { ...c.prova, resumo: resumirMutantes(c.prova.mutantes) }
      : { executada: false, desligada: Boolean(c.provaDesligada) },
    esteira: c.esteira ?? null,
    comparacao: c.comparacao ?? null,
    decisao: c.decisao ?? null,
    motivos: c.motivos ?? [],
    naoVerificado: c.naoVerificado ?? [],
    avisos: c.avisos ?? [],
    observacaoSobreSaidas:
      'A saída completa dos testes foi gravada localmente em execucoes/. Ela contém o que o próprio teste imprimiu, inclusive segredos, se algum teste os imprimir.',
  };
}

const ROTULO_DECISAO = {
  aprovado: 'APROVADO',
  bloqueado: 'BLOQUEADO',
  inconclusivo: 'INCONCLUSIVO',
};

const EXPLICACAO_DECISAO = {
  aprovado:
    'Os testes passaram e o motor conseguiu mostrar que eles são capazes de falhar. Isso vale só para o que foi executado, descrito abaixo.',
  bloqueado: 'Os testes do projeto rodaram e falharam. Enquanto isso não for corrigido, não há como dizer que o projeto funciona.',
  inconclusivo:
    'O motor não tem evidência suficiente para dizer que o projeto funciona. Inconclusivo não é aprovação: é falta de prova.',
};

function lista(itens) {
  return itens.length === 0 ? ['Nenhum.', ''] : [...itens.map((i) => `- ${i}`), ''];
}

export function montarMarkdown(r) {
  const L = [];
  L.push('# Relatório do Contraprova', '');
  if (r.decisao) {
    L.push(`## Decisão: ${ROTULO_DECISAO[r.decisao]}`, '',EXPLICACAO_DECISAO[r.decisao], '');
  } else {
    L.push(`Comando executado: \`${r.comando}\`. Este comando não emite decisão.`, '');
  }
  L.push(`**${FRASE_DE_AUTORIDADE}**`, '');
  L.push(
    'Este relatório é uma ferramenta experimental (protótipo). Ele não é uma garantia de que o software está livre de defeitos.',
    '',
  );

  if (r.decisao) {
    L.push('## Por que esta decisão', '', ...lista(r.motivos));
  }

  L.push('## O que foi verificado', '');
  const verificado = [];
  const inv = r.investigacao;
  if (inv) {
    verificado.push(
      `Leitura estática do projeto (nada foi executado nesta etapa): ${inv.totais.arquivosDeTeste} arquivo(s) de teste, cerca de ${inv.totais.testesEstimados} teste(s), ${inv.totais.testesIgnorados} ignorado(s).`,
    );
  }
  for (const e of r.execucoes.filter((x) => x.tipo === 'testes')) {
    const tempo = e.tempoEsgotado ? 'tempo esgotado' : `código de saída ${e.codigoDeSaida}`;
    verificado.push(`Execução real do comando \`${e.comando}\`: ${tempo}, em ${formatarDuracao(e.duracaoMs)}.`);
  }
  if (r.prova?.executada) {
    const s = r.prova.resumo;
    verificado.push(
      `Prova de eficácia: ${s.total} defeito(s) simples introduzido(s) numa cópia do projeto, um por vez. Detectados: ${s.detectados}; tempo esgotado (conta como detectado): ${s.tempoEsgotado}; não detectados: ${s.naoDetectados}; erros: ${s.erros}.`,
    );
  }
  if (r.esteira) verificado.push(`Leitura dos workflows de publicação (heurística de texto): ${r.esteira.workflows.length} arquivo(s).`);
  if (r.comparacao?.ok) {
    verificado.push(`Comparação com a base "${r.comparacao.base}": ${r.comparacao.arquivosAlterados} arquivo(s) alterado(s).`);
  }
  L.push(...lista(verificado));

  L.push('## O que NÃO foi verificado', '', ...lista(r.naoVerificado));

  L.push('## O que fazer agora', '');
  const fazer = [];
  if (r.decisao === 'bloqueado') {
    fazer.push('Leia a saída dos testes (arquivo indicado na seção de execuções) e corrija o código. Não altere os testes só para fazê-los passar.');
  }
  if (r.decisao === 'inconclusivo') {
    fazer.push('Resolva cada motivo listado acima e rode de novo. Não trate este resultado como aprovação.');
  }
  if (r.prova?.mutantes?.some((m) => m.resultado === 'não detectado')) {
    fazer.push('Para cada lacuna da prova de eficácia, decida se falta um teste ou se a alteração não muda o comportamento (equivalente).');
  }
  if (r.comparacao?.ok && r.comparacao.suspeitas.length > 0) {
    fazer.push('Revise cada suspeita de enfraquecimento de testes: algumas podem ser mudanças legítimas, e quem decide é uma pessoa.');
  }
  if (r.esteira?.achados?.length > 0) {
    fazer.push('Revise os avisos da esteira de publicação: eles podem estar fazendo falhas parecerem sucesso.');
  }
  if (r.decisao === 'aprovado') {
    fazer.push('Leia a seção de lacunas e a de itens não verificados antes de publicar. Aprovado vale só para o escopo descrito aqui.');
  }
  if (fazer.length === 0) fazer.push('Nada a fazer com este comando além de ler o resultado.');
  L.push(...lista(fazer));

  if (inv) {
    L.push('## Investigação (alegações do projeto, não executadas)', '');
    L.push(
      `- Ecossistemas reconhecidos: ${inv.ecossistemas.length ? inv.ecossistemas.join(', ') : 'nenhum'}.`,
      `- Comando de teste detectado: ${inv.comandoDeTeste ? `\`${inv.comandoDeTeste.comando}\` (${inv.comandoDeTeste.origem})` : 'nenhum'}.`,
      `- Git: ${inv.git.ativo ? `sim${inv.git.arvoreSuja ? ', com alterações não commitadas' : ''}` : 'não detectado'}.`,
      ...inv.observacoes.map((o) => `- ${o}`),
      '',
    );
    if (inv.inventario.length > 0) {
      L.push('| Arquivo de teste | Testes (estimado) | Ignorados | Asserções reconhecidas |', '|---|---|---|---|');
      for (const a of inv.inventario) {
        L.push(`| \`${a.arquivo}\` | ${a.testes} | ${a.ignorados} | ${a.assercoes}${a.semAssercao ? ' (nenhuma: suspeito)' : ''} |`);
      }
      L.push('');
    }
  }

  if (r.prova) {
    L.push('## Prova de eficácia dos testes', '');
    if (!r.prova.executada) {
      L.push(`Não rodou: ${r.prova.motivoInconclusivo ?? 'motivo não registrado'}`, '');
    } else {
      L.push(
        'Defeitos simples foram introduzidos, um de cada vez, numa cópia temporária do projeto (apagada ao final). O projeto original não foi alterado. A seleção é por regra fixa e é só uma amostra.',
        '',
        '| # | Arquivo e linha | Troca | Resultado |',
        '|---|---|---|---|',
      );
      for (const m of r.prova.mutantes) L.push(`| ${m.id} | \`${m.arquivo}:${m.linha}\` | \`${m.troca.replace(/\|/g, '\\|')}\` | ${m.resultado} |`);
      L.push('');
      const lacunas = r.prova.mutantes.filter((m) => m.resultado === 'não detectado');
      L.push('### Lacunas (defeitos que os testes não detectaram)', '');
      L.push(
        ...lista(
          lacunas.map(
            (m) => `\`${m.arquivo}:${m.linha}\`: \`${m.linhaOriginal}\` virou \`${m.linhaMutada}\` e os testes continuaram passando.`,
          ),
        ),
      );
    }
  }

  if (r.esteira) {
    L.push('## Esteira de publicação', '', `Método: ${r.esteira.metodo}.`, '', ...lista(
      r.esteira.achados.map((a) => `${a.arquivo ? `\`${a.arquivo}${a.linha ? `:${a.linha}` : ''}\`: ` : ''}${a.mensagem}`),
    ));
    L.push(r.esteira.autoridade, '');
  }

  if (r.comparacao) {
    L.push(`## Comparação com a base${r.comparacao.base ? ` "${r.comparacao.base}"` : ''}`, '');
    if (!r.comparacao.ok) {
      L.push(`Não foi possível: ${r.comparacao.erro}`, '');
    } else {
      L.push(`Natureza: ${r.comparacao.natureza}.`, '');
      if (r.comparacao.suspeitas.length === 0) L.push('Nenhuma suspeita encontrada pelas regras desta versão.', '');
      for (const s of r.comparacao.suspeitas) {
        L.push(`- \`${s.arquivo}\`: ${s.descricao}`);
        for (const e of s.evidencia) L.push(`  - \`${e.replace(/`/g, "'")}\``);
      }
      L.push('', ...r.comparacao.limites.map((l) => `- Limite: ${l}`), '');
    }
  }

  if (r.execucoes.length > 0) {
    L.push('## Execuções registradas', '');
    L.push('A saída completa de cada execução está gravada localmente; o sha256 permite conferir que o arquivo não mudou depois.', '');
    L.push('| Id | Tipo | Código | Duração | Saída completa | sha256 |', '|---|---|---|---|---|---|');
    for (const e of r.execucoes) {
      const cod = e.tempoEsgotado ? 'tempo esgotado' : String(e.codigoDeSaida);
      L.push(`| ${e.id} | ${e.tipo} | ${cod} | ${formatarDuracao(e.duracaoMs)} | \`${e.arquivoDeSaida}\` | \`${e.sha256DaSaida.slice(0, 16)}...\` |`);
    }
    L.push('', r.observacaoSobreSaidas, '');
  }

  L.push('## Política aplicada', '', `${POLITICA_PADRAO.nome}: ${POLITICA_PADRAO.natureza}.`, '', ...POLITICA_PADRAO.regras.map((x) => `- ${x}`), '');
  L.push('## Ambiente', '');
  L.push(
    `- Motor: contraprova ${r.motor.versao}`,
    `- Node.js: ${r.ambiente.node} em ${r.ambiente.plataforma}/${r.ambiente.arquitetura}`,
    `- Gerado em: ${r.geradoEm}`,
    ...(r.ambiente.git.ativo ? [`- Commit: ${r.ambiente.git.commit ?? 'desconhecido'}${r.ambiente.git.arvoreSuja ? ' (árvore com alterações)' : ''}`] : []),
    '',
  );
  return L.join('\n');
}

export function gravarRelatorio(dirSaida, json) {
  fs.mkdirSync(dirSaida, { recursive: true });
  fs.writeFileSync(path.join(dirSaida, 'relatorio.json'), `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(dirSaida, 'relatorio.md'), montarMarkdown(json), 'utf8');
}
