import { spawnSync } from 'node:child_process';

export function git(dir, args, opcoes = {}) {
  const r = spawnSync('git', ['-c', 'core.quotepath=off', ...args], {
    cwd: dir,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 64 * 1024 * 1024,
    ...opcoes,
  });
  if (r.error) return { ok: false, saida: '', erro: r.error.message };
  return { ok: r.status === 0, saida: r.stdout ?? '', erro: (r.stderr ?? '').trim() };
}

/** Informações do git para o diretório, ou { ativo: false } se não houver. */
export function infoGit(dir) {
  const dentro = git(dir, ['rev-parse', '--is-inside-work-tree']);
  if (!dentro.ok || dentro.saida.trim() !== 'true') return { ativo: false, commit: null, arvoreSuja: null };
  const head = git(dir, ['rev-parse', 'HEAD']);
  const estado = git(dir, ['status', '--porcelain', '--', '.']);
  return {
    ativo: true,
    commit: head.ok ? head.saida.trim() : null,
    arvoreSuja: estado.ok ? estado.saida.trim() !== '' : null,
  };
}
