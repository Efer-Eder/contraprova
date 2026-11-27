---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Escopo do DCO: exigido das contribuições externas

## Contexto e problema

O [ADR-0002](0002-licenca-mit-provisoria-e-dco.md) adotou o DCO 1.1 como certificação das contribuições, sem distinguir quem contribui. Na prática, os commits do mantenedor não têm `Signed-off-by`, e os documentos diziam que as contribuições eram certificadas por DCO sem explicar a diferença. É preciso deixar a regra coerente com o que o repositório faz.

## Direcionadores da decisão

- O DCO existe para que quem contribui declare ter o direito de enviar o conteúdo sob a licença do projeto.
- O mantenedor é o titular do copyright do projeto e licencia o próprio trabalho diretamente pela licença do projeto, então não há terceiro a certificar.
- Coerência entre os documentos e o histórico de commits.
- Manter a regra de que agentes de IA nunca adicionam `Signed-off-by`.

## Opções consideradas

- Exigir `Signed-off-by` também nos commits do mantenedor.
- Exigir `Signed-off-by` só das contribuições externas.

## Resultado da decisão

O `Signed-off-by` (`git commit -s`) é exigido das **contribuições externas**, isto é, de quem não é o mantenedor. Os commits do mantenedor não levam `Signed-off-by`. Agentes de IA nunca adicionam `Signed-off-by`, em nenhum caso. Isso esclarece o escopo definido no ADR-0002, sem mudar a escolha do DCO nem a ausência de CLA.

## Consequências

- Bom, porque os documentos passam a descrever o que o repositório de fato faz.
- Bom, porque a barreira para contribuir continua a mesma e o mantenedor não carrega uma assinatura sem função.
- Neutro, porque a verificação automatizada do DCO continua indefinida e, quando existir, deve isentar o mantenedor.
- Ruim, porque, se o projeto passar a ter mais de um mantenedor, a regra de isenção precisará ser revista junto com o [GOVERNANCE.md](../../GOVERNANCE.md).

## Confirmação

`CONTRIBUTING.md`, `AI_POLICY.md` e o modelo de PR descrevem o `Signed-off-by` como exigência de contribuição externa. Os commits do mantenedor no histórico não têm a assinatura.

## Mais informações

- [ADR-0002](0002-licenca-mit-provisoria-e-dco.md): adoção da MIT provisória e do DCO.
- [ADR-0003](0003-politica-de-contribuicoes-assistidas-por-ia.md): agentes não adicionam `Signed-off-by`.
- DCO 1.1: <https://developercertificate.org/>
