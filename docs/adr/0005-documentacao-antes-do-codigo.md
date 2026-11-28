---
status: "substituída por ADR-0009"
date: 2026-11-27
decision-makers: Efer Eder
---

# Documentação antes do código

Substituído pelo [ADR-0009](0009-prototipo-executavel-do-motor-em-paralelo.md).

## Contexto e problema

O manifesto deixa em aberto o formato do produto, as linguagens, as ferramentas e a arquitetura (seção 28), e alerta que qualquer formato precisa declarar seus limites de autoridade. Escrever código antes de responder a essas perguntas fixaria escolhas por inércia e poderia criar a falsa impressão de que existe um produto ou uma proteção.

## Direcionadores da decisão

- Honestidade quanto ao estado do projeto: o manifesto proíbe simular garantia inexistente (seção 15).
- Evitar que escolhas de implementação decidam por acidente perguntas de arquitetura.
- Deixar as decisões rastreáveis e revisáveis em público.

## Opções consideradas

- Primeira fase só de especificação, com código apenas depois de as perguntas de formato (PA-01 a PA-08) serem respondidas por RFC aceita.
- Prototipar código em paralelo com a especificação.
- Começar pelo código e documentar depois.

## Resultado da decisão

Opção escolhida: a primeira fase é só de especificação. Nenhum código é adicionado ao repositório antes de as perguntas de formato ([PA-01](../perguntas-em-aberto.md) a [PA-08](../perguntas-em-aberto.md)) serem respondidas por [RFC](../rfcs/README.md) aceita, com ADR resultante. Experimentos descartáveis ficam fora do repositório ou em RFC como parte da proposta, sem ser tratados como produto.

## Consequências

- Bom, porque o repositório nunca promete o que não existe.
- Bom, porque as decisões de formato e de limites de autoridade são tomadas com debate público.
- Ruim, porque o projeto fica sem artefato executável por mais tempo e pode atrair menos contribuições práticas.
- Ruim, porque algumas perguntas só se respondem bem com protótipos, o que exige disciplina para separar experimento de produto.
- Aberto: a licença provisória deve ser revisada antes da primeira versão que contenha código ([ADR-0002](0002-licenca-mit-provisoria-e-dco.md)).

## Confirmação

Revisão de PR: PRs que adicionam código à raiz ou a pastas de implementação são recusados enquanto esta decisão estiver em vigor. Quando a primeira RFC de formato for aceita, esta ADR é revisada.

## Prós e contras das opções

### Só especificação primeiro

- Bom, porque separa decidir de construir.
- Ruim, porque atrasa o primeiro artefato executável.

### Protótipo em paralelo

- Bom, porque aprende rápido.
- Ruim, porque o protótipo vira a decisão por inércia.

### Código primeiro

- Bom, porque entrega algo rápido.
- Ruim, porque contraria a honestidade sobre o limite de autoridade.

## Mais informações

- [Manifesto](../manifesto.md), seções 15 e 28.
- [Roadmap](../../ROADMAP.md), na raiz do repositório.
