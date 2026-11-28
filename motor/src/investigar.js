import fs from 'node:fs';
import path from 'node:path';
import {
  DIRS_FORA_DO_INVENTARIO,
  contar,
  ehArquivoDeTeste,
  lerTexto,
  listarArquivos,
  mascararCodigo,
} from './util.js';
import { infoGit } from './git.js';

const PLACEHOLDER_NPM = /no test specified/i;

const RE_DEFINICAO_JS = /(?<![.\w$])(?:test|it)\s*(?:\.\s*(?:skip|only|todo)\s*)?\(|(?<![.\w$])(?:xit|xtest)\s*\(/g;
const RE_DEFINICAO_PY = /^[ \t]*(?:async[ \t]+)?def[ \t]+test\w*/gm;

const RES_IGNORADOS_JS = [
  /\b(?:test|it|describe|suite)\s*\.\s*(?:skip|todo|only)\b/g,
  /\b(?:xit|xtest|xdescribe)\s*\(/g,
  /\bt\s*\.\s*(?:skip|todo)\s*\(/g,
  /\bskip\s*:\s*(?:true|['"`])/g,
];
const RES_IGNORADOS_PY = [
  /@\s*(?:pytest\s*\.\s*mark|unittest)\s*\.\s*skip\w*/g,
  /@\s*skip(?:If|Unless)?\b/g,
  /\bpytest\s*\.\s*skip\s*\(/g,
  /\bself\s*\.\s*skipTest\s*\(/g,
];

const RES_ASSERCAO_JS = [
  /\bassert\s*[.(]/g,
  /\bassert\w+\s*\(/g,
  /\bexpect\s*\(/g,
  /\.\s*should\b|\bshould\s*\./g,
  /\bt\s*\.\s*(?:is|not|true|false|truthy|falsy|deepEqual|equal|notEqual|throws|rejects|assert|ok|same|regex)\s*\(/g,
];
const RES_ASSERCAO_PY = [/\bassert\w*\b/g, /\bpytest\s*\.\s*raises\b/g];

export function analisarArquivoDeTeste(texto, python) {
  const mascarado = mascararCodigo(texto, python);
  const definicoes = python ? contar(RE_DEFINICAO_PY, mascarado) : contar(RE_DEFINICAO_JS, mascarado);
  const ignorados = (python ? RES_IGNORADOS_PY : RES_IGNORADOS_JS).reduce((s, r) => s + contar(r, mascarado), 0);
  const asser = (python ? RES_ASSERCAO_PY : RES_ASSERCAO_JS).reduce((s, r) => s + contar(r, mascarado), 0);
  return { testes: definicoes, ignorados, assercoes: asser };
}

function lerJson(abs) {
  const t = lerTexto(abs);
  if (t === null) return { existe: false };
  try {
    return { existe: true, dados: JSON.parse(t) };
  } catch {
    return { existe: true, invalido: true };
  }
}

/** Investigação estática: não executa nada do projeto. */
export function investigar(dir) {
  const observacoes = [];
  const arquivos = listarArquivos(dir, DIRS_FORA_DO_INVENTARIO);
  const todos = new Set(listarArquivos(dir));

  const ecossistemas = [];
  const node = { temPackageJson: false, scriptDeTeste: null, placeholder: false };
  const pj = lerJson(path.join(dir, 'package.json'));
  if (pj.existe) {
    ecossistemas.push('node');
    node.temPackageJson = true;
    if (pj.invalido) {
      observacoes.push('O package.json existe, mas não é um JSON válido.');
    } else {
      const s = pj.dados?.scripts?.test;
      if (typeof s === 'string') {
        node.scriptDeTeste = s;
        node.placeholder = PLACEHOLDER_NPM.test(s);
      }
    }
  }

  const marcadoresPython = ['pyproject.toml', 'setup.py', 'requirements.txt', 'pytest.ini'].filter((m) =>
    todos.has(m),
  );
  const testesPython = arquivos.filter((a) => /(?:^|\/)(?:test_[^/]*|[^/]*_test)\.py$/.test(a));
  if (marcadoresPython.length > 0 || testesPython.length > 0) ecossistemas.push('python');

  const inventario = [];
  for (const rel of arquivos) {
    if (!ehArquivoDeTeste(rel)) continue;
    const texto = lerTexto(path.join(dir, rel));
    if (texto === null) continue;
    const a = analisarArquivoDeTeste(texto, rel.endsWith('.py'));
    inventario.push({
      arquivo: rel,
      testes: a.testes,
      ignorados: a.ignorados,
      assercoes: a.assercoes,
      semAssercao: a.testes > 0 && a.assercoes === 0,
    });
  }

  let comandoDeTeste = null;
  if (node.scriptDeTeste && !node.placeholder) {
    comandoDeTeste = { comando: 'npm test', origem: `scripts.test do package.json: ${node.scriptDeTeste}` };
  } else if (node.placeholder) {
    observacoes.push('O script de teste do package.json é o texto padrão do npm ("no test specified"): isso conta como ausência de testes.');
  } else if (node.temPackageJson) {
    observacoes.push('O package.json não define scripts.test.');
  }
  if (!comandoDeTeste && testesPython.length > 0) {
    comandoDeTeste = { comando: 'python -m pytest', origem: 'arquivos test_*.py ou *_test.py encontrados' };
  }

  const workflows = [...todos].filter((a) => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(a));
  const totais = {
    arquivosDeTeste: inventario.length,
    testesEstimados: inventario.reduce((s, a) => s + a.testes, 0),
    testesIgnorados: inventario.reduce((s, a) => s + a.ignorados, 0),
    arquivosSemAssercao: inventario.filter((a) => a.semAssercao).length,
  };

  return {
    natureza: 'alegações e observações estáticas, não executado',
    ecossistemas,
    node,
    python: { marcadores: marcadoresPython, arquivosDeTeste: testesPython },
    comandoDeTeste,
    inventario,
    totais,
    workflows,
    git: infoGit(dir),
    observacoes,
  };
}

export function diretorioValido(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}
