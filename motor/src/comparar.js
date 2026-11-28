import path from 'node:path';
import { git } from './git.js';
import { analisarArquivoDeTeste } from './investigar.js';
import { ehArquivoDeTeste, lerTexto } from './util.js';

const NOMES_DE_POLITICA = new Set([
  'contraprova.json',
  '.contraprova.json',
  '.contraprova.yml',
  '.contraprova.yaml',
  'contraprova.yml',
  'contraprova.yaml',
]);

function ehPolitica(rel) {
  return NOMES_DE_POLITICA.has(path.posix.basename(rel)) || /(?:^|\/)\.contraprova\/politica[^/]*$/.test(rel);
}

function ehWorkflow(rel) {
  return /(?:^|\/)\.github\/workflows\/[^/]+\.ya?ml$/.test(rel);
}

function linhasDoDiff(dir, base, rel) {
  const r = git(dir, ['diff', '--relative', '-U0', '--no-color', base, '--', rel]);
  if (!r.ok) return [];
  return r.saida
    .split('\n')
    .filter((l) => /^[+-]/.test(l) && !/^(?:\+\+\+|---) /.test(l))
    .slice(0, 12);
}

function analisarTexto(texto, rel) {
  return analisarArquivoDeTeste(texto, rel.endsWith('.py'));
}

/** Compara a árvore de trabalho com uma referência e procura sinais de enfraquecimento de testes. */
export function compararComBase(dir, base) {
  const dentro = git(dir, ['rev-parse', '--is-inside-work-tree']);
  if (!dentro.ok) return { ok: false, base, erro: 'O diretório não está dentro de um repositório git.' };
  const ref = git(dir, ['rev-parse', '--verify', '--quiet', `${base}^{commit}`]);
  if (!ref.ok) return { ok: false, base, erro: `A referência "${base}" não existe neste repositório.` };

  const lista = git(dir, ['diff', '--relative', '--name-status', '-z', base, '--', '.']);
  if (!lista.ok) return { ok: false, base, erro: `Não foi possível comparar com "${base}": ${lista.erro}` };

  const campos = lista.saida.split('\0');
  const mudancas = [];
  for (let i = 0; i < campos.length && campos[i] !== ''; ) {
    const status = campos[i][0];
    if (status === 'R' || status === 'C') {
      mudancas.push({ status, antigo: campos[i + 1], novo: campos[i + 2] });
      i += 3;
    } else {
      mudancas.push({ status, antigo: campos[i + 1], novo: campos[i + 1] });
      i += 2;
    }
  }

  const suspeitas = [];
  const add = (tipo, arquivo, descricao, evidencia) => suspeitas.push({ tipo, arquivo, descricao, evidencia });

  for (const m of mudancas) {
    if (ehWorkflow(m.novo) || ehWorkflow(m.antigo)) {
      add('workflow-alterado', m.novo, 'Um workflow da esteira foi alterado em relação à base.', linhasDoDiff(dir, base, m.novo));
    }
    if (ehPolitica(m.novo) || ehPolitica(m.antigo)) {
      add(
        'politica-alterada',
        m.novo,
        'Um arquivo de política do Contraprova foi alterado (os nomes de arquivo de política ainda são provisórios).',
        linhasDoDiff(dir, base, m.novo),
      );
    }
    const eTeste = ehArquivoDeTeste(m.novo) || ehArquivoDeTeste(m.antigo);
    if (!eTeste) continue;

    if (m.status === 'D') {
      add('teste-removido', m.antigo, 'Arquivo de teste removido.', [`arquivo ${m.antigo} existe em ${base} e não existe na árvore de trabalho`]);
      continue;
    }
    if (m.status === 'A') continue;

    const antigoTexto = git(dir, ['show', `${base}:./${m.antigo}`]);
    const novoTexto = lerTexto(path.join(dir, ...m.novo.split('/')));
    if (!antigoTexto.ok || novoTexto === null) continue;
    const antes = analisarTexto(antigoTexto.saida, m.antigo);
    const depois = analisarTexto(novoTexto, m.novo);
    const diff = () => linhasDoDiff(dir, base, m.novo);
    if (depois.ignorados > antes.ignorados) {
      add('ignorados-adicionados', m.novo, `Testes ignorados aumentaram de ${antes.ignorados} para ${depois.ignorados}.`, diff());
    }
    if (depois.assercoes < antes.assercoes) {
      add('assercoes-reduzidas', m.novo, `Asserções reconhecidas caíram de ${antes.assercoes} para ${depois.assercoes}.`, diff());
    }
    if (depois.testes < antes.testes) {
      add('testes-reduzidos', m.novo, `Definições de teste caíram de ${antes.testes} para ${depois.testes}.`, diff());
    }
  }

  return {
    ok: true,
    base,
    natureza: 'suspeitas por heurística textual sobre git diff, não condenações',
    arquivosAlterados: mudancas.length,
    suspeitas,
    limites: [
      'Arquivos novos ainda não rastreados pelo git não aparecem no diff.',
      'Uma alteração legítima de teste pode gerar suspeita; quem decide é uma pessoa.',
    ],
  };
}
