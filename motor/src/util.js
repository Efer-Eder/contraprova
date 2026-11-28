import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const DIRS_IGNORADOS = new Set([
  '.git',
  'node_modules',
  '.venv',
  'venv',
  '__pycache__',
  'dist',
  'build',
  'coverage',
  '.contraprova',
]);

// Pastas que costumam guardar exemplos e dados de apoio, não o projeto em si.
export const DIRS_FORA_DO_INVENTARIO = new Set([...DIRS_IGNORADOS, 'fixtures', 'exemplos', 'examples']);

export const EXT_CODIGO = /\.(?:js|mjs|cjs|ts|jsx|tsx|py)$/;

export function sha256(texto) {
  return createHash('sha256').update(texto).digest('hex');
}

export function ordenar(lista) {
  return [...lista].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Lista arquivos (caminhos relativos com "/"), ordem determinística, sem seguir links simbólicos. */
export function listarArquivos(raiz, ignorados = DIRS_IGNORADOS) {
  const achados = [];
  const visitar = (relDir) => {
    const abs = path.join(raiz, relDir);
    let entradas;
    try {
      entradas = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entradas) {
      if (e.isSymbolicLink()) continue;
      const rel = relDir ? `${relDir}/${e.name}` : e.name;
      if (e.isDirectory()) {
        if (!ignorados.has(e.name)) visitar(rel);
      } else if (e.isFile()) {
        achados.push(rel);
      }
    }
  };
  visitar('');
  return ordenar(achados);
}

export function lerTexto(abs) {
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

export function ehArquivoDeTeste(rel) {
  const base = path.posix.basename(rel);
  if (/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(base)) return true;
  if (/^test_.*\.py$/.test(base) || /_test\.py$/.test(base)) return true;
  if (/(?:^|\/)(?:__tests__|tests?|testes)\//.test(rel) && EXT_CODIGO.test(base)) return true;
  return false;
}

/**
 * Troca comentários e o conteúdo de textos entre aspas por espaços, preservando o
 * tamanho e as quebras de linha. Heurística: não entende literais de regex.
 */
export function mascararCodigo(texto, python = false) {
  const saida = texto.split('');
  const n = texto.length;
  const apagar = (k) => {
    if (saida[k] !== '\n' && saida[k] !== '\r') saida[k] = ' ';
  };
  let i = 0;
  while (i < n) {
    const c = texto[i];
    const d = texto[i + 1];
    if (!python && c === '/' && d === '/') {
      while (i < n && texto[i] !== '\n') apagar(i++);
      continue;
    }
    if (!python && c === '/' && d === '*') {
      apagar(i++);
      apagar(i++);
      while (i < n && !(texto[i] === '*' && texto[i + 1] === '/')) apagar(i++);
      if (i < n) {
        apagar(i++);
        apagar(i++);
      }
      continue;
    }
    if (python && c === '#') {
      while (i < n && texto[i] !== '\n') apagar(i++);
      continue;
    }
    if (python && (c === '"' || c === "'") && texto.startsWith(c.repeat(3), i)) {
      const fecho = c.repeat(3);
      i += 3;
      while (i < n && !texto.startsWith(fecho, i)) apagar(i++);
      i += 3;
      continue;
    }
    if (c === '"' || c === "'" || (!python && c === '`')) {
      i++;
      while (i < n && texto[i] !== c) {
        if (texto[i] === '\\') {
          apagar(i++);
          if (i < n) apagar(i++);
          continue;
        }
        if (texto[i] === '\n' && c !== '`') break;
        apagar(i++);
      }
      if (i < n && texto[i] === c) i++;
      continue;
    }
    i++;
  }
  return saida.join('');
}

export function contar(regex, texto) {
  const g = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`);
  return (texto.match(g) || []).length;
}

export function formatarDuracao(ms) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1).replace('.', ',')} s`;
}
