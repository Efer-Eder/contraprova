---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Versionamento semântico e changelog

## Contexto e problema

O repositório está na fase de especificação e não tem produto, mas já mantém um `CHANGELOG.md` e precisa de uma regra para numerar versões quando houver algo a publicar. Sem essa regra, a primeira versão numerada seria escolhida por improviso, e o histórico de mudanças ficaria sem formato.

## Direcionadores da decisão

- Regra pública e documentada para numerar versões.
- Formato conhecido para o histórico de mudanças, legível por pessoas.
- Honestidade quanto ao estado do projeto: não anunciar versão onde não há produto (seção 15 do [manifesto](../manifesto.md) e [ADR-0005](0005-documentacao-antes-do-codigo.md)).

## Opções consideradas

- Versionamento Semântico 2.0.0, com `0.y.z` enquanto o desenvolvimento for inicial, e `CHANGELOG.md` no formato Keep a Changelog 1.1.0.
- Não numerar versões nem manter changelog até existir produto.

## Resultado da decisão

Opção escolhida: [Versionamento Semântico 2.0.0](https://semver.org/), com versões `0.y.z` enquanto o desenvolvimento for inicial, e `CHANGELOG.md` na raiz no formato [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).

Nenhuma versão é publicada enquanto não houver produto. As mudanças ficam na seção `[Unreleased]` do `CHANGELOG.md`.

## Consequências

- Bom, porque a regra de numeração já está decidida quando houver a primeira versão.
- Bom, porque o histórico de mudanças tem formato público e documentado.
- Neutro, porque o significado de "versão" para um projeto que só tem especificação continua sem definição: por isso nada é publicado agora.
- Ruim, porque o `CHANGELOG.md` exige manutenção a cada mudança relevante.

## Confirmação

Revisão de PR: mudanças relevantes entram em `[Unreleased]` no `CHANGELOG.md`, conforme o checklist do [CONTRIBUTING.md](../../CONTRIBUTING.md). Ainda não há verificação automatizada.

## Prós e contras das opções

### SemVer 2.0.0 com `0.y.z` e Keep a Changelog 1.1.0

- Bom, porque são padrões públicos e documentados.
- Bom, porque a fonte do SemVer indica que `0.y.z` corresponde a desenvolvimento inicial.
- Ruim, porque exige manter o changelog atualizado.

### Sem versões nem changelog

- Bom, porque não há trabalho a manter.
- Ruim, porque o histórico de mudanças se perde e a primeira versão nasceria sem regra.

## Mais informações

- Versionamento Semântico 2.0.0: <https://semver.org/>
- Keep a Changelog 1.1.0: <https://keepachangelog.com/en/1.1.0/>
- Pesquisa: [boas-praticas-open-source.md](../pesquisa/boas-praticas-open-source.md)
