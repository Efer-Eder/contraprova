---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Protótipo executável do motor em paralelo com a especificação

Substitui o [ADR-0005](0005-documentacao-antes-do-codigo.md).

## Contexto e problema

O [ADR-0005](0005-documentacao-antes-do-codigo.md) decidiu que nenhum código entraria no repositório antes de as perguntas de formato ([PA-01](../perguntas-em-aberto.md) a [PA-08](../perguntas-em-aberto.md)) serem respondidas por [RFC](../rfcs/README.md) aceita. A RFC 0001, sobre o formato do produto (PA-01), está em discussão pública no [PR 6](https://github.com/Efer-Eder/contraprova/pull/6), a partir da issue 5, e ainda não foi decidida.

Em 2026-11-27 concluí que o repositório está cru demais para atrair discussão: sem algo que rode, quase ninguém tem o que testar, criticar ou comparar com a proposta. O próprio ADR-0005 já registrava como ponto ruim que algumas perguntas só se respondem bem com protótipos. A discussão com apoiadores virá depois, e é melhor que ela parta de evidência executável do que de texto apenas.

A pergunta: como ter um artefato que funcione sem decidir, por inércia, o que as RFCs ainda não decidiram, e sem apresentar como produto ou como proteção algo que é experimento?

## Direcionadores da decisão

- Dar a quem chega algo que roda e que pode ser criticado com fatos.
- Produzir evidência para as RFCs, sem tomar o lugar delas.
- Honestidade sobre o estado do projeto: o [manifesto](../manifesto.md) proíbe simular garantia inexistente (seção 15).
- Evitar que escolhas provisórias de stack virem decisão por inércia (o risco que o ADR-0005 apontou).
- Respeitar o período público de discussão da RFC em andamento.

## Opções consideradas

- Manter só a especificação, como no ADR-0005, até a RFC 0001 ser decidida.
- Protótipo executável em paralelo com a especificação, sob regras explícitas.
- Aceitar a RFC 0001 antes do fim do período de discussão, para liberar o código.

## Resultado da decisão

Opção escolhida: protótipo executável em paralelo com a especificação, sob estas regras.

- O código do protótipo é permitido em `motor/`, em `skills/` e no `package.json` da raiz. Em qualquer outro lugar, código de produto continua sem lugar neste repositório.
- Tudo o que o protótipo é e faz vem rotulado como **experimental** e de nível de autoridade **consultivo local**: ele recomenda, não impede. O modo protegido não existe e não é afirmado.
- Nenhuma pergunta em aberto (PA-xx) é fechada pelo fato de existir código. As escolhas de stack do protótipo (Node.js sem dependências, execução a partir do repositório) são provisórias e valem como evidência para as RFCs, não como decisão. PA-01 continua aberta até a RFC 0001 ser decidida.
- A RFC 0001 segue o ciclo normal, inclusive o período público de discussão. Este ADR não antecipa nem condiciona a decisão dela.
- O protótipo pode ser reescrito ou descartado conforme o que as RFCs decidirem. Ninguém deve tratá-lo como compromisso de manter a forma atual.
- Continua proibido, sem RFC aceita e ADR resultante: anunciar o protótipo como proteção, publicar pacote em registro (por exemplo o npm) e escolher stack, linguagem ou formato definitivos.
- Dependências novas no protótipo dependem de autorização do mantenedor.

Sobre a licença: o [ADR-0002](0002-licenca-mit-provisoria-e-dco.md) diz que a licença MIT é provisória e será revisada obrigatoriamente "antes da primeira versão que contenha código". O texto literal admite duas leituras: a de que a revisão vale antes de qualquer versão publicada (tag, release ou pacote), ou a de que vale antes de o código entrar no repositório. Adoto a primeira, porque nada foi publicado: o protótipo é a versão 0.0.1, só existe no repositório e não está em nenhum registro de pacotes. A tensão com a segunda leitura existe e fica registrada aqui. Seja qual for a leitura, a revisão da licença ([PA-09](../perguntas-em-aberto.md)) continua **pendente** e é gatilho obrigatório antes da primeira versão publicada. Se eu preferir a leitura mais estrita, a revisão deve ser feita antes de o código chegar à `main`.

## Consequências

- Bom, porque o repositório passa a ter algo que roda e que quem chega pode testar, criticar e comparar com a especificação.
- Bom, porque as RFCs ganham evidência real de viabilidade e de limites, em vez de só argumentos.
- Bom, porque as regras acima mantêm a honestidade: protótipo rotulado, nível consultivo, sem pacote publicado.
- Ruim, porque o protótipo pode virar a decisão por inércia: o código existe e puxa as RFCs para o que já está feito. Mitigação: este ADR declara as escolhas provisórias, nenhuma PA é fechada por existir código, o protótipo pode ser descartado, e cada RFC de formato deve tratar o protótipo como uma opção entre outras, não como ponto de partida.
- Ruim, porque quem encontra o código pode ler como produto pronto. Mitigação: rótulo experimental e consultivo nos READMEs e na ajuda do programa, e nenhuma afirmação de proteção.
- Ruim, porque o código do projeto analisado roda na máquina de quem chama o motor, sem isolamento. Mitigação: o aviso consta no README do motor e na ajuda.
- Ruim, porque as regras do repositório que diziam que não havia código precisaram ser reescritas, e o que ficar para trás é inconsistência.
- Neutro, porque a decisão sobre a licença continua pendente e se mantém como gatilho antes da primeira versão publicada.

## Confirmação

Revisão de PR: mudanças de código só são aceitas em `motor/`, `skills/` e no `package.json` da raiz; o protótipo continua sem pacote publicado, sem dependências e rotulado como experimental e consultivo; nenhum PR fecha uma PA-xx só porque há código. O `npm test` roda na CI do protótipo (`.github/workflows/motor.yml`). A decisão é revisada quando a RFC 0001 for decidida.

## Prós e contras das opções

### Manter só a especificação

- Bom, porque separa decidir de construir e não arrisca decisão por inércia.
- Ruim, porque o repositório segue sem artefato executável e com pouco para discutir.

### Protótipo em paralelo, com regras

- Bom, porque gera evidência e algo para interagir, sem fechar perguntas.
- Neutro, porque exige disciplina para separar experimento de produto.
- Ruim, porque o risco de inércia existe e depende das mitigações acima.

### Aceitar a RFC 0001 antes do prazo

- Bom, porque liberaria o código dentro das regras do ADR-0005.
- Ruim, porque desrespeita o período público de discussão que o próprio projeto exige, e a RFC passaria a servir de formalidade para algo já decidido.

## Mais informações

- [ADR-0005](0005-documentacao-antes-do-codigo.md), substituído por este.
- [ADR-0002](0002-licenca-mit-provisoria-e-dco.md), sobre a revisão da licença.
- RFC 0001, em discussão no [PR 6](https://github.com/Efer-Eder/contraprova/pull/6).
- O que o protótipo faz e os limites dele: `motor/README.md`.
- Condição de revisão: quando a RFC 0001 for decidida, e sempre que o protótipo mudar de natureza.
