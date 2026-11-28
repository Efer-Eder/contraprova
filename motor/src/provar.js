import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  DIRS_FORA_DO_INVENTARIO,
  DIRS_IGNORADOS,
  EXT_CODIGO,
  ehArquivoDeTeste,
  lerTexto,
  listarArquivos,
  mascararCodigo,
} from './util.js';
import { executar } from './executar.js';

const REGRAS_COMUNS = [
  { re: /===/g, para: '!==' },
  { re: /!==/g, para: '===' },
  { re: /(?<![=!<>])==(?!=)/g, para: '!=' },
  { re: /(?<![!=])!=(?!=)/g, para: '==' },
  { re: / < /g, para: ' >= ' },
  { re: / > /g, para: ' <= ' },
  { re: / <= /g, para: ' > ' },
  { re: / >= /g, para: ' < ' },
  { re: / \+ /g, para: ' - ' },
  { re: / - /g, para: ' + ' },
];
const REGRAS_JS = [
  { re: /&&/g, para: '||' },
  { re: /\|\|/g, para: '&&' },
  { re: /\btrue\b/g, para: 'false' },
  { re: /\bfalse\b/g, para: 'true' },
];
const REGRAS_PY = [
  { re: /\band\b/g, para: 'or' },
  { re: /\bor\b/g, para: 'and' },
  { re: /\bTrue\b/g, para: 'False' },
  { re: /\bFalse\b/g, para: 'True' },
];

/** Candidatos de mutação em um texto de código. Só olha código, nunca comentário ou texto entre aspas. */
export function candidatosDoTexto(texto, python) {
  const mascarado = mascararCodigo(texto, python);
  const linhasOriginais = texto.split('\n');
  const linhasMascaradas = mascarado.split('\n');
  const regras = [...REGRAS_COMUNS, ...(python ? REGRAS_PY : REGRAS_JS)];
  const achados = [];
  linhasMascaradas.forEach((linha, idx) => {
    if (linha.trim() === '' || /^\s*(?:import|from)\b/.test(linha)) return;
    for (const regra of regras) {
      for (const m of linha.matchAll(regra.re)) {
        achados.push({
          linha: idx + 1,
          coluna: m.index,
          de: m[0],
          para: regra.para,
          original: linhasOriginais[idx].replace(/\r$/, ''),
        });
      }
    }
  });
  achados.sort((a, b) => a.linha - b.linha || a.coluna - b.coluna);
  return achados;
}

export function aplicarMutacao(texto, c) {
  const linhas = texto.split('\n');
  const linha = linhas[c.linha - 1];
  if (linha.slice(c.coluna, c.coluna + c.de.length) !== c.de) return null;
  linhas[c.linha - 1] = linha.slice(0, c.coluna) + c.para + linha.slice(c.coluna + c.de.length);
  return linhas.join('\n');
}

function ehCodigoMutavel(rel) {
  if (!EXT_CODIGO.test(rel) || ehArquivoDeTeste(rel)) return false;
  const base = path.posix.basename(rel);
  if (/\.d\.ts$|\.min\.js$|\.config\.[cm]?[jt]s$|^conftest\.py$/.test(base)) return false;
  return true;
}

/**
 * Seleção determinística: reparte o limite entre os arquivos em rodízio (ordem de caminho)
 * e, dentro de cada arquivo, escolhe pontos espalhados de ponta a ponta.
 */
export function selecionar(porArquivo, limite) {
  const arquivos = [...porArquivo.keys()].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
  const cota = new Map(arquivos.map((a) => [a, 0]));
  let restante = Math.min(limite, [...porArquivo.values()].reduce((s, l) => s + l.length, 0));
  while (restante > 0) {
    for (const a of arquivos) {
      if (restante > 0 && cota.get(a) < porArquivo.get(a).length) {
        cota.set(a, cota.get(a) + 1);
        restante -= 1;
      }
    }
  }
  const escolhidos = [];
  for (const arquivo of arquivos) {
    const lista = porArquivo.get(arquivo);
    const m = cota.get(arquivo);
    for (let i = 0; i < m; i += 1) escolhidos.push({ ...lista[Math.floor(((i + 0.5) * lista.length) / m)], arquivo });
  }
  return escolhidos;
}

export function coletarCandidatos(dir) {
  const porArquivo = new Map();
  for (const rel of listarArquivos(dir, DIRS_FORA_DO_INVENTARIO)) {
    if (!ehCodigoMutavel(rel)) continue;
    const texto = lerTexto(path.join(dir, rel));
    if (texto === null) continue;
    const lista = candidatosDoTexto(texto, rel.endsWith('.py'));
    if (lista.length > 0) porArquivo.set(rel, lista);
  }
  return porArquivo;
}

function copiarProjeto(origem, destino) {
  fs.cpSync(origem, destino, {
    recursive: true,
    dereference: false,
    filter: (src) => {
      const base = path.basename(src);
      if (src !== origem && DIRS_IGNORADOS.has(base)) return false;
      try {
        if (fs.lstatSync(src).isSymbolicLink()) return false;
      } catch {
        return false;
      }
      return true;
    },
  });
}

function removerPasta(dir) {
  try {
    const nm = path.join(dir, 'projeto', 'node_modules');
    // Remove a ligação antes: nunca apagar recursivamente por cima do node_modules do projeto original.
    if (fs.lstatSync(nm, { throwIfNoEntry: false })?.isSymbolicLink()) fs.unlinkSync(nm);
  } catch {
    // segue para a remoção da pasta temporária
  }
  fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

const limpezas = new Set();
let ganchosInstalados = false;
function instalarGanchos() {
  if (ganchosInstalados) return;
  ganchosInstalados = true;
  for (const sinal of ['SIGINT', 'SIGTERM']) {
    process.once(sinal, () => {
      for (const f of limpezas) {
        try {
          f();
        } catch {
          // melhor esforço
        }
      }
      process.exit(130);
    });
  }
}

/**
 * Prova de eficácia: introduz defeitos simples, um por vez, numa CÓPIA do projeto
 * e vê se os testes falham. O projeto original nunca é alterado.
 */
export async function provar(dir, { comando, limite, tempoLimiteMs, registrar, progresso }) {
  const resultado = {
    executada: false,
    motivoInconclusivo: null,
    candidatosEncontrados: 0,
    limiteSolicitado: limite,
    baseline: null,
    mutantes: [],
    diretorioTemporario: null,
    diretorioTemporarioRemovido: null,
  };

  const porArquivo = coletarCandidatos(dir);
  resultado.candidatosEncontrados = [...porArquivo.values()].reduce((s, l) => s + l.length, 0);
  if (resultado.candidatosEncontrados === 0) {
    resultado.motivoInconclusivo = 'Nenhum ponto de mutação encontrado em arquivos de código que não sejam de teste.';
    return resultado;
  }
  const selecionados = selecionar(porArquivo, limite);

  instalarGanchos();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'contraprova-'));
  const limpar = () => removerPasta(tmp);
  limpezas.add(limpar);
  resultado.diretorioTemporario = path.basename(tmp);
  try {
    const copia = path.join(tmp, 'projeto');
    copiarProjeto(dir, copia);
    const nmOriginal = path.join(dir, 'node_modules');
    if (fs.existsSync(nmOriginal)) {
      fs.symlinkSync(
        fs.realpathSync(nmOriginal),
        path.join(copia, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
    }

    const base = await executar(comando, { cwd: copia, tempoLimiteMs });
    resultado.baseline = registrar('prova-base', base);
    if (base.tempoEsgotado || base.naoExecutavel || base.erroDeExecucao || base.codigo !== 0) {
      resultado.motivoInconclusivo =
        'Os testes não passaram na cópia intacta do projeto, então não dá para atribuir uma falha a um defeito introduzido.';
      return resultado;
    }
    resultado.executada = true;

    const tempoPorMutante = Math.min(tempoLimiteMs, base.duracaoMs * 3 + 10000);
    const textosOriginais = new Map();
    const raizReal = fs.realpathSync(copia);
    let n = 0;
    for (const c of selecionados) {
      n += 1;
      progresso?.(`Mutante ${n} de ${selecionados.length}: ${c.arquivo}:${c.linha}`);
      const real = fs.realpathSync(path.join(copia, ...c.arquivo.split('/')));
      if (!real.startsWith(raizReal + path.sep)) throw new Error('Alvo de mutação fora da cópia.');
      if (!textosOriginais.has(c.arquivo)) textosOriginais.set(c.arquivo, fs.readFileSync(real, 'utf8'));
      const original = textosOriginais.get(c.arquivo);
      const mutado = aplicarMutacao(original, c);
      const m = {
        id: n,
        arquivo: c.arquivo,
        linha: c.linha,
        linhaOriginal: c.original.trim(),
        linhaMutada: null,
        troca: `${c.de.trim()} -> ${c.para.trim()}`,
        resultado: 'erro',
        execucao: null,
      };
      resultado.mutantes.push(m);
      if (mutado === null) continue;
      m.linhaMutada = mutado.split('\n')[c.linha - 1].replace(/\r$/, '').trim();
      try {
        fs.writeFileSync(real, mutado, 'utf8');
        const r = await executar(comando, { cwd: copia, tempoLimiteMs: tempoPorMutante });
        const reg = registrar(`mutante-${String(n).padStart(2, '0')}`, r);
        m.execucao = reg.id;
        if (r.tempoEsgotado) m.resultado = 'tempo esgotado';
        else if (r.naoExecutavel || r.erroDeExecucao) m.resultado = 'erro';
        else if (r.codigo === 0) m.resultado = 'não detectado';
        else m.resultado = 'detectado';
      } finally {
        fs.writeFileSync(real, original, 'utf8');
      }
    }
    return resultado;
  } finally {
    limpezas.delete(limpar);
    try {
      limpar();
    } catch {
      // verificado abaixo
    }
    resultado.diretorioTemporarioRemovido = !fs.existsSync(tmp);
  }
}

export function resumirMutantes(mutantes) {
  const conta = (r) => mutantes.filter((m) => m.resultado === r).length;
  const detectados = conta('detectado');
  const esgotados = conta('tempo esgotado');
  return {
    total: mutantes.length,
    detectados,
    tempoEsgotado: esgotados,
    naoDetectados: conta('não detectado'),
    erros: conta('erro'),
    detectadosNoTotal: detectados + esgotados,
  };
}
