// Apoio dos testes do motor. Não termina em .test.js, então o executor de testes não o roda como teste.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const BIN = path.join(RAIZ, 'motor', 'bin', 'contraprova.js');
export const EXEMPLOS = path.join(RAIZ, 'motor', 'exemplos');
export const VERSAO = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).version;

const criados = [];
process.on('exit', () => {
  for (const d of criados) {
    try {
      fs.rmSync(d, { recursive: true, force: true });
    } catch {
      // melhor esforço
    }
  }
});

export function pastaTemporaria(prefixo = 'cp-teste-') {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), prefixo));
  criados.push(d);
  return d;
}

/** Cria um projeto temporário a partir de { 'caminho/relativo': 'conteúdo' }. */
export function criarProjeto(arquivos) {
  const dir = pastaTemporaria('cp-projeto-');
  for (const [rel, conteudo] of Object.entries(arquivos)) {
    const abs = path.join(dir, ...rel.split('/'));
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, conteudo, 'utf8');
  }
  return dir;
}

export function copiarExemplo(nome) {
  const dir = pastaTemporaria('cp-exemplo-');
  fs.cpSync(path.join(EXEMPLOS, nome), dir, { recursive: true });
  return dir;
}

/** Executa o CLI de verdade, como um processo separado. */
export function cli(args, opcoes = {}) {
  const r = spawnSync(process.execPath, [BIN, ...args], {
    encoding: 'utf8',
    timeout: 240000,
    windowsHide: true,
    ...opcoes,
    env: { ...process.env, ...(opcoes.env ?? {}) },
  });
  return { codigo: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '', erro: r.error };
}

/** Roda "verificar" ou outro comando com --json e devolve o relatório já lido. */
export function cliJson(args, opcoes = {}) {
  const saida = pastaTemporaria('cp-saida-');
  const r = cli([...args, '--json', '--saida', saida], opcoes);
  let json = null;
  try {
    json = JSON.parse(r.stdout);
  } catch {
    // o teste que chamou vai falhar com a saída bruta
  }
  return { ...r, json, saida };
}

export function hashDaArvore(dir) {
  const h = createHash('sha256');
  const visitar = (rel) => {
    const abs = path.join(dir, rel);
    for (const e of fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) {
        h.update(`d:${r}\n`);
        visitar(r);
      } else {
        h.update(`f:${r}\n`);
        h.update(fs.readFileSync(path.join(dir, r)));
      }
    }
  };
  visitar('');
  return h.digest('hex');
}

export function git(dir, ...args) {
  const r = spawnSync('git', args, { cwd: dir, encoding: 'utf8', windowsHide: true });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} falhou: ${r.stderr}`);
  return r.stdout;
}

export function iniciarRepositorio(dir) {
  git(dir, 'init', '-q');
  git(dir, 'config', 'user.name', 'Teste');
  git(dir, 'config', 'user.email', 'teste@example.invalid');
  git(dir, 'config', 'commit.gpgsign', 'false');
  git(dir, 'config', 'core.autocrlf', 'false');
}

export function commitar(dir, mensagem) {
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', mensagem);
}

export function pythonExiste() {
  for (const nome of ['python', 'python3']) {
    const r = spawnSync(nome, ['--version'], { windowsHide: true });
    if (!r.error && r.status === 0) return true;
  }
  return false;
}

export const PACKAGE_JSON_TESTE = JSON.stringify(
  { name: 'p', version: '0.0.0', private: true, type: 'module', scripts: { test: 'node --test' } },
  null,
  2,
);
