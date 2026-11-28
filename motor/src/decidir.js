import { resumirMutantes } from './provar.js';

export const NIVEL_DE_AUTORIDADE = 'consultivo local';
export const FRASE_DE_AUTORIDADE = 'Nível de autoridade: consultivo local. Este resultado recomenda, não impede.';

export const POLITICA_PADRAO = {
  nome: 'política padrão embutida',
  versao: 1,
  natureza: 'fixa no código do motor, sem arquivo de configuração e sem nota subjetiva ou meta numérica',
  regras: [
    'bloqueado: os testes executaram e falharam.',
    'inconclusivo: não há testes detectados; o comando de teste não pôde ser executado; o tempo limite estourou; ' +
      'o ecossistema não foi reconhecido e não houve --comando; a prova de eficácia rodou e nenhum defeito introduzido foi detectado; ' +
      'a prova de eficácia não pôde rodar e não foi desligada; a comparação com a base achou suspeita de enfraquecimento; ' +
      'ou o motor teve um erro interno.',
    'aprovado: os testes passaram e pelo menos um defeito introduzido foi detectado (ou a prova foi desligada com --sem-prova, ' +
      'caso em que a eficácia dos testes não foi verificada). Defeitos não detectados são listados como lacunas, sem porcentagem-alvo.',
    'exceção autorizada: não implementada nesta versão.',
    'Os achados da esteira não alteram a decisão nesta versão: são informados à parte.',
  ],
};

export const SEMPRE_NAO_VERIFICADO = [
  'Se os testes cobrem o comportamento que a pessoa realmente quer: o motor não conhece os requisitos.',
  'Segurança, desempenho, integrações externas e interface: nada disso é verificado nesta versão.',
  'As regras de proteção do repositório (branch protegida, checks obrigatórios, quem pode contornar).',
  'Se um defeito introduzido que sobreviveu é equivalente ao código original: isso exige leitura humana.',
  'Exceção autorizada: não está implementada.',
];

/**
 * Aplica a política padrão. Entrada: o que foi observado. Saída: decisão, motivos e o que não foi verificado.
 * Qualquer entrada incompleta cai em inconclusivo, nunca em aprovado.
 */
export function decidir({ investigacao, execucao, comandoUsado, provaDesligada, prova, comparacao, base }) {
  const motivos = [];
  const naoVerificado = [...SEMPRE_NAO_VERIFICADO];
  const inconclusivos = [];

  if (!comandoUsado) {
    inconclusivos.push(
      investigacao.ecossistemas.length === 0
        ? 'Ecossistema não reconhecido e nenhum --comando foi informado: não há como executar testes.'
        : 'Não foi detectado um comando de teste (sem testes, ou o script de teste é o padrão vazio do npm).',
    );
    naoVerificado.push('Execução dos testes: não aconteceu, porque não há comando de teste.');
  }

  let falhou = false;
  let passou = false;
  if (execucao) {
    if (execucao.tempoEsgotado) {
      inconclusivos.push('O tempo limite dos testes estourou: a execução foi interrompida.');
      naoVerificado.push('Resultado dos testes: a execução foi interrompida pelo tempo limite.');
    } else if (execucao.naoExecutavel || execucao.erroDeExecucao) {
      inconclusivos.push('O comando de teste não pôde ser executado (comando inexistente ou erro ao iniciar).');
      naoVerificado.push('Resultado dos testes: o comando não executou.');
    } else if (execucao.codigo !== 0) {
      if (execucao.pytestAusente) {
        inconclusivos.push('O pytest não está instalado neste ambiente: os testes não puderam ser executados.');
        naoVerificado.push('Resultado dos testes: pytest ausente.');
      } else {
        falhou = true;
        motivos.push(`Os testes executaram e falharam (código de saída ${execucao.codigo}).`);
      }
    } else {
      passou = true;
    }
  }

  const haTestes = investigacao.totais.arquivosDeTeste > 0 || (execucao?.testesExecutados ?? 0) > 0;
  if (passou) {
    if (execucao.testesExecutados === 0) {
      passou = false;
      inconclusivos.push('O comando terminou com sucesso, mas informou que executou zero testes.');
    } else if (!haTestes) {
      passou = false;
      inconclusivos.push('Nenhum arquivo de teste foi detectado: sucesso sem testes não prova nada.');
    }
  }

  if (passou && investigacao.totais.testesIgnorados > 0) {
    motivos.push(`Há ${investigacao.totais.testesIgnorados} teste(s) ignorado(s) (skip, only ou todo): eles não protegem nada enquanto estiverem ignorados.`);
    naoVerificado.push(`${investigacao.totais.testesIgnorados} teste(s) ignorado(s) no projeto: não executam.`);
  }
  if (passou) {
    if (provaDesligada) {
      motivos.push('Os testes passaram, mas a prova de eficácia foi desligada (--sem-prova): NÃO foi verificado se os testes conseguem falhar.');
      naoVerificado.push('Eficácia dos testes (prova de eficácia desligada com --sem-prova).');
    } else if (!prova || !prova.executada) {
      inconclusivos.push(
        `A prova de eficácia não pôde rodar: ${prova?.motivoInconclusivo ?? 'motivo não registrado'}`,
      );
      naoVerificado.push('Eficácia dos testes: a prova de eficácia não rodou.');
    } else {
      const r = resumirMutantes(prova.mutantes);
      if (r.detectadosNoTotal === 0) {
        inconclusivos.push(
          `A prova de eficácia rodou e nenhum dos ${r.total} defeitos introduzidos foi detectado: os testes não provaram que conseguem falhar.`,
        );
      } else {
        motivos.push(
          `Os testes passaram e ${r.detectadosNoTotal} de ${r.total} defeitos introduzidos foram detectados` +
            (r.tempoEsgotado > 0 ? ` (${r.tempoEsgotado} por tempo esgotado)` : '') +
            '.',
        );
        if (r.naoDetectados > 0) motivos.push(`${r.naoDetectados} defeito(s) introduzido(s) NÃO foram detectados: veja as lacunas no relatório.`);
      }
      naoVerificado.push(
        `Eficácia dos testes além de ${r.total} defeitos simples escolhidos por regra fixa (amostra, não o projeto inteiro).`,
      );
    }
  }

  if (base) {
    if (!comparacao || !comparacao.ok) {
      inconclusivos.push(`A comparação com a base "${base}" não pôde ser feita: ${comparacao?.erro ?? 'motivo não registrado'}`);
      naoVerificado.push(`Comparação com a base "${base}": não foi feita.`);
    } else if (comparacao.suspeitas.length > 0) {
      inconclusivos.push(
        `A comparação com a base "${base}" encontrou ${comparacao.suspeitas.length} suspeita(s) de enfraquecimento de testes (suspeita não é condenação).`,
      );
    }
  } else {
    naoVerificado.push('Enfraquecimento de testes em relação a uma versão anterior: sem --base, a comparação não foi feita.');
  }

  let decisao;
  if (falhou) {
    decisao = 'bloqueado';
    if (inconclusivos.length > 0) motivos.push(...inconclusivos.map((m) => `Além disso: ${m}`));
  } else if (inconclusivos.length > 0) {
    decisao = 'inconclusivo';
    motivos.unshift(...inconclusivos);
  } else if (passou) {
    decisao = 'aprovado';
  } else {
    decisao = 'inconclusivo';
    motivos.unshift('Estado não previsto: por falha segura, a decisão é inconclusivo.');
  }
  return { decisao, motivos, naoVerificado };
}

export const CODIGO_DE_SAIDA = { aprovado: 0, bloqueado: 1, inconclusivo: 2 };
