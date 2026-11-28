# Registros de decisões arquiteturais (ADR)

Um ADR registra uma decisão que afeta o projeto, com o contexto, as alternativas consideradas e as consequências. O objetivo é que ninguém precise adivinhar por que algo foi decidido de certo modo, e que decisões possam ser revistas com informação.

O formato adotado é o [MADR 4.0.0](https://adr.github.io/madr/), em português. O modelo está em [modelo.md](modelo.md). A decisão de adotar ADRs está em [ADR-0000](0000-registrar-decisoes-com-madr.md).

## Quando escrever um ADR

- Para registrar o resultado de uma [RFC](../rfcs/README.md) aceita.
- Para decisões de organização do projeto (licença, idioma, política de contribuição).
- Para fechar uma [pergunta em aberto](../perguntas-em-aberto.md), indicando qual `PA-xx` foi resolvida.

Mudanças pequenas, reversíveis e sem impacto nos princípios do [manifesto](../manifesto.md) não precisam de ADR: basta uma issue ou um PR comentado.

## Numeração e nomes

- Arquivos nomeados `NNNN-titulo-em-kebab-case.md`, com número de quatro dígitos em ordem crescente.
- O número nunca é reutilizado, nem quando o ADR é rejeitado, obsoleto ou substituído.
- O título descreve a decisão, não o problema.

## Estados

O campo `status` do front matter assume um destes valores:

| Estado | Significado |
|---|---|
| proposta | Em discussão. Ainda não vale como decisão. |
| aceita | Decisão em vigor. |
| rejeitada | Considerada e descartada. O registro permanece para explicar o motivo. |
| obsoleta | Deixou de valer, sem substituta direta. |
| substituída por ADR-NNNN | Trocada por outra decisão. O ADR antigo é mantido e passa a apontar para o novo. |

Um ADR aceito não é editado para mudar a decisão. Se a decisão mudar, escreve-se um novo ADR que substitui o anterior. Correções de erros de forma e atualizações de links são permitidas.

## Fluxo

1. Copie [modelo.md](modelo.md) para o próximo número livre.
2. Preencha as seções, com data absoluta (AAAA-MM-DD) e decisor.
3. Abra um PR. Se o ADR vem de RFC, referencie a RFC.
4. O mantenedor decide e atualiza o `status` e o índice abaixo.

## Índice

| Número | Título | Estado | Data |
|---|---|---|---|
| [0000](0000-registrar-decisoes-com-madr.md) | Registrar decisões arquiteturais com ADRs no formato MADR | aceita | 2026-11-27 |
| [0001](0001-idioma-da-documentacao-e-dos-commits.md) | Documentação em português do Brasil, commits e branches em inglês | aceita | 2026-11-27 |
| [0002](0002-licenca-mit-provisoria-e-dco.md) | Licença MIT provisória e certificação de origem por DCO | aceita | 2026-11-27 |
| [0003](0003-politica-de-contribuicoes-assistidas-por-ia.md) | Política de contribuições assistidas por IA | aceita | 2026-11-27 |
| [0004](0004-nome-do-projeto-contraprova.md) | Adotar Contraprova como nome do projeto | aceita | 2026-11-27 |
| [0005](0005-documentacao-antes-do-codigo.md) | Documentação antes do código | substituída por ADR-0009 | 2026-11-27 |
| [0006](0006-agents-md-como-fonte-unica-para-agentes.md) | AGENTS.md como fonte única de instruções para agentes | aceita | 2026-11-27 |
| [0007](0007-versionamento-semantico-e-changelog.md) | Versionamento semântico e changelog | aceita | 2026-11-27 |
| [0008](0008-escopo-do-dco.md) | Escopo do DCO: exigido das contribuições externas | aceita | 2026-11-27 |
| [0009](0009-prototipo-executavel-do-motor-em-paralelo.md) | Protótipo executável do motor em paralelo com a especificação | aceita | 2026-11-27 |
