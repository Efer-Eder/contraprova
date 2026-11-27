---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Registrar decisões arquiteturais com ADRs no formato MADR

## Contexto e problema

O projeto está em fase de especificação e vai tomar muitas decisões que ficam em aberto no [manifesto](../manifesto.md) (seção 28): formato, linguagens, ferramentas, arquitetura, distribuição, interfaces, modelos, licenciamento e estratégia de integração. Sem registro, o motivo de cada escolha se perde, e quem contribui, inclusive com agentes de IA, não tem como saber o que já foi decidido, o que foi descartado e por quê. Isso é especialmente sensível para um projeto cujo princípio é que conclusões devem indicar origem, escopo e limitações (P-05).

## Direcionadores da decisão

- Rastreabilidade das decisões e dos motivos.
- Formato simples, em Markdown, versionado junto da documentação.
- Formato com padrão público e documentado.
- Baixa fricção para quem contribui.

## Opções consideradas

- Registrar decisões em ADRs no formato MADR 4.0.0.
- Registrar decisões em ADRs em formato livre.
- Não registrar formalmente; manter decisões em issues e discussões.

## Resultado da decisão

Opção escolhida: ADRs no formato [MADR 4.0.0](https://adr.github.io/madr/), em português, em `docs/adr/`, com numeração sequencial de quatro dígitos. O modelo está em [modelo.md](modelo.md) e o processo em [README.md](README.md).

## Consequências

- Bom, porque cada decisão tem contexto, alternativas e consequências escritas.
- Bom, porque o formato é um padrão público e há ferramentas que o reconhecem.
- Ruim, porque exige disciplina de escrita e manutenção do índice.
- Neutro, porque decisões que mudam o escopo do manifesto ainda exigem [RFC](../rfcs/README.md), e o ADR registra o resultado.

## Confirmação

Revisão de PR: toda mudança de decisão relevante deve vir com ADR novo ou ADR alterado, e o índice em [README.md](README.md) deve estar atualizado. Ainda não há verificação automatizada.

## Prós e contras das opções

### MADR 4.0.0

- Bom, porque é padrão público, com campos de status, data e decisores.
- Bom, porque separa direcionadores, opções, resultado e consequências.
- Ruim, porque é mais longo que um registro livre.

### Formato livre

- Bom, porque é mais rápido de escrever.
- Ruim, porque cada ADR pode omitir alternativas e consequências.

### Sem registro formal

- Bom, porque não exige trabalho adicional.
- Ruim, porque o histórico se espalha e se perde.

## Mais informações

- MADR 4.0.0: <https://adr.github.io/madr/>
- Pesquisa de práticas adotadas: [boas-praticas-open-source.md](../pesquisa/boas-praticas-open-source.md)
