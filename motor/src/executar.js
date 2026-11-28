import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { sha256 } from './util.js';

const LIMITE_DE_SAIDA = 20 * 1024 * 1024;

function ambienteDoFilho() {
  const env = { ...process.env };
  // Sem isso, um "node --test" aninhado se confunde com o executor de testes que chamou o motor.
  delete env.NODE_TEST_CONTEXT;
  env.PYTHONDONTWRITEBYTECODE = '1';
  env.NPM_CONFIG_UPDATE_NOTIFIER = 'false';
  return env;
}

function encerrarArvore(filho) {
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(filho.pid), '/T', '/F'], { windowsHide: true });
    } else {
      process.kill(-filho.pid, 'SIGKILL');
    }
  } catch {
    try {
      filho.kill('SIGKILL');
    } catch {
      // processo já terminou
    }
  }
}

function pareceComandoInexistente(codigo, saida) {
  if (codigo === 127 || codigo === 9009) return true;
  return codigo === 1 && /is not recognized|reconhecido como um comando/i.test(saida) && saida.length < 600;
}

/**
 * Executa um comando de shell com tempo limite. Nunca lança: falhas viram campos do resultado.
 * Esse é o único ponto em que o motor roda código do projeto.
 */
export function executar(comando, { cwd, tempoLimiteMs }) {
  return new Promise((resolver) => {
    const inicio = Date.now();
    const pedacos = [];
    let tamanho = 0;
    let truncada = false;
    let tempoEsgotado = false;
    let resolvido = false;
    let filho;

    const concluir = (parcial) => {
      if (resolvido) return;
      resolvido = true;
      clearTimeout(timer);
      const saida = Buffer.concat(pedacos).toString('utf8');
      const r = {
        comando,
        codigo: null,
        sinal: null,
        tempoEsgotado,
        naoExecutavel: false,
        erroDeExecucao: null,
        duracaoMs: Date.now() - inicio,
        saida,
        truncada,
        ...parcial,
      };
      if (r.codigo !== null && pareceComandoInexistente(r.codigo, saida)) r.naoExecutavel = true;
      resolver(r);
    };

    const coletar = (buf) => {
      if (tamanho >= LIMITE_DE_SAIDA) {
        truncada = true;
        return;
      }
      pedacos.push(buf);
      tamanho += buf.length;
    };

    let timer;
    try {
      filho = spawn(comando, {
        cwd,
        shell: true,
        env: ambienteDoFilho(),
        windowsHide: true,
        detached: process.platform !== 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (e) {
      concluir({ erroDeExecucao: e.message });
      return;
    }

    timer = setTimeout(() => {
      tempoEsgotado = true;
      encerrarArvore(filho);
      // Se algum neto segurar os pipes abertos, não esperamos para sempre.
      setTimeout(() => concluir({ codigo: null }), 2000).unref();
    }, tempoLimiteMs);

    filho.stdout.on('data', coletar);
    filho.stderr.on('data', coletar);
    filho.on('error', (e) => concluir({ erroDeExecucao: e.message }));
    filho.on('close', (codigo, sinal) => concluir({ codigo, sinal }));
  });
}

/** Grava a saída completa de uma execução e devolve o registro para o relatório. */
export function criarRegistrador(dirSaida) {
  const dirExecucoes = path.join(dirSaida, 'execucoes');
  fs.rmSync(dirExecucoes, { recursive: true, force: true });
  fs.mkdirSync(dirExecucoes, { recursive: true });
  const registros = [];
  return {
    registros,
    registrar(tipo, r, extra = {}) {
      const numero = String(registros.length + 1).padStart(3, '0');
      const nomeArquivo = `${numero}-${tipo}.txt`;
      fs.writeFileSync(path.join(dirExecucoes, nomeArquivo), r.saida, 'utf8');
      const registro = {
        id: numero,
        tipo,
        comando: r.comando,
        codigoDeSaida: r.codigo,
        sinal: r.sinal,
        tempoEsgotado: r.tempoEsgotado,
        naoExecutavel: r.naoExecutavel,
        erroDeExecucao: r.erroDeExecucao,
        duracaoMs: r.duracaoMs,
        saidaTruncada: r.truncada,
        sha256DaSaida: sha256(r.saida),
        arquivoDeSaida: `execucoes/${nomeArquivo}`,
        ...extra,
      };
      registros.push(registro);
      return registro;
    },
  };
}

/** Quantidade de testes que o executor disse ter rodado, se der para ler. */
export function testesExecutados(saida) {
  const m = saida.match(/(?:^|\n)\s*(?:\S |# )tests (\d+)/);
  return m ? Number(m[1]) : null;
}

export function pythonDisponivel() {
  const tenta = (nome) => {
    const r = spawnSync(nome, ['--version'], { windowsHide: true, encoding: 'utf8' });
    return !r.error && r.status === 0;
  };
  if (tenta('python')) return 'python';
  if (tenta('python3')) return 'python3';
  return null;
}
