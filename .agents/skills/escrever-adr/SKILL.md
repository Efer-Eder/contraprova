---
name: escrever-adr
description: Redige um ADR (registro de decisão arquitetural) neste repositório, no formato MADR em português, com número, status e índice corretos. Use quando uma decisão de arquitetura ou de processo precisar ser registrada, ou quando uma RFC aceita exigir o ADR resultante.
---

# Escrever um ADR

As regras de quando um ADR é necessário, de numeração, de estados e do fluxo estão em `docs/adr/README.md`. O modelo está em `docs/adr/modelo.md`. Leia os dois antes de começar e siga o que estiver lá, sem se apoiar em memória.

## Passos

1. Confirme que a decisão pede ADR (seção "Quando escrever um ADR" do README). Se a mudança for pequena e reversível, diga isso e não crie o arquivo.
2. Veja o índice em `docs/adr/README.md` e use o próximo número livre. Números nunca são reaproveitados.
3. Copie `docs/adr/modelo.md` para `docs/adr/NNNN-titulo-em-kebab-case.md` e preencha todas as seções. Use data absoluta (AAAA-MM-DD) e o nome de quem decide. Apague o parágrafo explicativo do modelo.
4. Deixe o `status` como `proposta`. Quem aceita é o mantenedor, não o agente.
5. Se o ADR vem de uma RFC aceita, referencie a RFC. Se fecha uma pergunta em aberto, cite o PA-xx; o registro em `docs/perguntas-em-aberto.md` só muda se um humano pedir.
6. Acrescente a linha do novo ADR ao índice de `docs/adr/README.md`.
7. Em "Mais informações", cite as fontes de qualquer afirmação sobre prática ou ferramenta externa, com link e data de leitura.

## Limites

- ADR aceito não se edita: se a decisão mudar, escreva outro que o substitua e atualize o estado do antigo, como manda o README.
- Não decida pelo mantenedor, não invente requisitos e não apresente proposta como decisão tomada.
- Siga o estilo de `AGENTS.md`: português do Brasil, sem emoji, sem travessão, um H1 por arquivo.
- Não abra PR sem aprovação de um humano.
