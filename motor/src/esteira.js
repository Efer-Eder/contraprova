import path from 'node:path';
import { lerTexto } from './util.js';

export const AVISO_DE_AUTORIDADE =
  'O motor não inspecionou as regras de proteção do repositório (branch protegida, checks obrigatórios, ' +
  'quem pode contornar). Por isso o nível máximo que ele consegue afirmar daqui é "consultivo". ' +
  'O modo protegido não é afirmado.';

const RE_PULL_REQUEST = /(?<![\w-])pull_request(?![\w-])/;
const RE_CONTINUE = /^\s*(?:-\s*)?continue-on-error\s*:\s*['"]?true['"]?\s*(?:#.*)?$/i;
const RE_IF_FALSE = /^\s*(?:-\s*)?if\s*:\s*['"]?\s*false\s*['"]?\s*(?:#.*)?$/i;
const RE_TOLERA_FALHA = /\|\|\s*(?:true|exit\s+0)\b/;

function fichasDeTeste(comando, scriptDeTeste) {
  const fichas = ['npm test', 'npm run test', 'npm t ', 'yarn test', 'pnpm test', 'pytest', 'unittest', 'node --test'];
  if (comando) fichas.push(comando.toLowerCase());
  if (scriptDeTeste) fichas.push(scriptDeTeste.toLowerCase());
  return fichas;
}

/**
 * Lê os workflows como texto (sem interpretar YAML). É heurística: pode errar para os dois lados.
 */
export function auditarEsteira(dir, investigacao) {
  const achados = [];
  const workflows = investigacao.workflows;
  const comando = investigacao.comandoDeTeste?.comando ?? null;
  const fichas = fichasDeTeste(comando, investigacao.node.scriptDeTeste);
  const ehLinhaDeTeste = (linha) => {
    const l = linha.toLowerCase();
    return fichas.some((f) => l.includes(f));
  };

  if (workflows.length === 0) {
    achados.push({
      id: 'sem-workflow',
      gravidade: 'aviso',
      arquivo: null,
      linha: null,
      mensagem: 'Nenhum workflow encontrado em .github/workflows: nada executa os testes automaticamente na publicação.',
    });
  }

  let algumRodaTeste = false;
  let algumPullRequest = false;
  for (const rel of workflows) {
    const texto = lerTexto(path.join(dir, ...rel.split('/'))) ?? '';
    const linhas = texto.split(/\r?\n/);
    const semComentario = linhas.map((l) => (/^\s*#/.test(l) ? '' : l));
    const rodaTeste = semComentario.some(ehLinhaDeTeste);
    const temPr = semComentario.some((l) => RE_PULL_REQUEST.test(l));
    algumRodaTeste ||= rodaTeste;
    algumPullRequest ||= temPr;

    semComentario.forEach((linha, i) => {
      if (RE_CONTINUE.test(linha)) {
        achados.push({
          id: 'continue-on-error',
          gravidade: 'aviso',
          arquivo: rel,
          linha: i + 1,
          mensagem: 'continue-on-error: true faz o job parecer verde mesmo quando um passo falha.',
          evidencia: linhas[i].trim(),
        });
      }
      if (RE_IF_FALSE.test(linha)) {
        achados.push({
          id: 'if-false',
          gravidade: 'aviso',
          arquivo: rel,
          linha: i + 1,
          mensagem: 'Condição "if: false": o job ou passo nunca executa.',
          evidencia: linhas[i].trim(),
        });
      }
      if (RE_TOLERA_FALHA.test(linha)) {
        const eTeste = ehLinhaDeTeste(linha);
        achados.push({
          id: 'falha-tolerada',
          gravidade: 'aviso',
          arquivo: rel,
          linha: i + 1,
          mensagem: eTeste
            ? 'O comando de teste é seguido de "|| true" ou "|| exit 0": uma falha dos testes não derruba o passo.'
            : 'Um comando é seguido de "|| true" ou "|| exit 0": a falha dele é ignorada (não parece ser o comando de teste).',
          evidencia: linhas[i].trim(),
        });
      }
    });

    if (rodaTeste && !temPr) {
      achados.push({
        id: 'sem-pull-request',
        gravidade: 'aviso',
        arquivo: rel,
        linha: null,
        mensagem: 'Este workflow executa testes, mas não tem o gatilho pull_request: mudanças propostas por PR podem não passar por ele.',
      });
    }
  }

  if (workflows.length > 0 && !algumRodaTeste) {
    achados.push({
      id: 'nenhum-roda-teste',
      gravidade: 'aviso',
      arquivo: null,
      linha: null,
      mensagem: comando
        ? `Nenhum workflow parece executar o comando de teste detectado (${comando}).`
        : 'Nenhum workflow parece executar testes (e o motor não detectou um comando de teste no projeto).',
    });
  }
  if (workflows.length > 0 && !algumPullRequest) {
    achados.push({
      id: 'nenhum-pull-request',
      gravidade: 'aviso',
      arquivo: null,
      linha: null,
      mensagem: 'Nenhum workflow tem o gatilho pull_request.',
    });
  }

  return {
    metodo: 'leitura de texto dos arquivos de workflow, sem interpretar YAML (heurística: pode errar para os dois lados)',
    workflows,
    achados,
    autoridade: AVISO_DE_AUTORIDADE,
  };
}
