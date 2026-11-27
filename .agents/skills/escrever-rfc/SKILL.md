---
name: escrever-rfc
description: Redige uma RFC (pedido de comentários) neste repositório a partir do modelo, com número, estado e índice corretos. Use quando uma mudança de escopo ou de especificação, uma pergunta em aberto ou o primeiro código exigir proposta discutida em público antes de virar decisão.
---

# Escrever uma RFC

Quando uma RFC é necessária, o ciclo, os estados e as regras de conteúdo estão em `docs/rfcs/README.md`. O modelo está em `docs/rfcs/0000-modelo.md`. Leia os dois antes de começar e siga o que estiver lá, sem se apoiar em memória.

## Passos

1. Confirme que a mudança pede RFC (seção "Quando é necessária uma RFC" do README). Correções de texto, links e formatação não pedem: diga isso e não crie o arquivo.
2. Veja o índice em `docs/rfcs/README.md` e use o próximo número livre.
3. Copie `docs/rfcs/0000-modelo.md` para `docs/rfcs/NNNN-titulo-em-kebab-case.md` e preencha todas as seções. Use data absoluta (AAAA-MM-DD). Apague o parágrafo explicativo do modelo.
4. Deixe o `status` como `rascunho`. Quem aceita ou rejeita é o mantenedor, depois do período de discussão pública definido no README.
5. Preencha o campo `pa` e a seção de motivação com as perguntas em aberto que a RFC pretende fechar, ligando para `docs/perguntas-em-aberto.md`.
6. Liste os princípios (P-xx), capacidades (CAP-xx) e critérios (CA-xx) afetados, conferindo cada ID em `docs/especificacao/`. Se a proposta define formato ou arquitetura, declare os limites de autoridade, como o modelo pede.
7. Acrescente a linha da RFC ao índice de `docs/rfcs/README.md`.

## Limites

- Cite apenas fatos verificáveis, com fonte e link para qualquer afirmação sobre prática externa. Não invente metas numéricas: o que não se sabe vai em "Perguntas não resolvidas".
- Uma RFC aceita gera um ADR; use a skill `escrever-adr` para ele só se um humano pedir.
- Siga o estilo de `AGENTS.md`: português do Brasil, sem emoji, sem travessão, um H1 por arquivo.
- Não abra PR nem issue sem aprovação de um humano.
