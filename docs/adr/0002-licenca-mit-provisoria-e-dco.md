---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Licença MIT provisória e certificação de origem das contribuições por DCO

Escopo do DCO esclarecido pelo [ADR-0008](0008-escopo-do-dco.md).

## Contexto e problema

O manifesto define o Contraprova como proposta open source e deixa o licenciamento específico para investigação posterior (seção 28). É preciso uma licença desde o primeiro dia para que o projeto seja de fato open source, e um mecanismo para que quem contribui declare ter o direito de fazê-lo.

## Direcionadores da decisão

- Ser open source desde o primeiro dia.
- Consistência com os outros projetos open source publicados em [github.com/Efer-Eder](https://github.com/Efer-Eder), que usam MIT.
- Concessão expressa de patentes, caso o projeto venha a ter código.
- Facilidade de trocar de licença enquanto não há contribuições externas.
- Baixa barreira de entrada para quem contribui.

## Opções consideradas

- MIT agora, com revisão obrigatória antes da primeira versão que contenha código.
- Apache-2.0 agora.
- Adiar a escolha de licença.
- DCO 1.1 como certificação de contribuições, sem CLA.
- CLA.

## Resultado da decisão

Licença: MIT, de forma **provisória**. A Apache-2.0 foi considerada pela concessão expressa de patentes. A licença será revisada obrigatoriamente antes da primeira versão que contenha código; trocar de licença é simples enquanto não existem contribuições externas, e deixa de ser simples depois.

Contribuições: certificadas pelo [Developer Certificate of Origin 1.1](https://developercertificate.org/), com linha `Signed-off-by` em cada commit, apenas por pessoas. Não há CLA.

## Consequências

- Bom, porque o projeto é open source desde já e coerente com a licença dos outros projetos open source publicados em github.com/Efer-Eder, que usam MIT.
- Bom, porque o DCO é leve e dispensa assinatura de contrato por quem contribui.
- Ruim, porque a MIT não tem concessão expressa de patentes, e a decisão final pode exigir mudança.
- Ruim, porque contribuições externas anteriores à revisão tornam a troca de licença mais difícil.
- Neutro, porque a revisão da licença depende de PA-09, e não de decisão técnica.

## Confirmação

Existência de `LICENSE` na raiz com o texto MIT; cada commit de contribuição com `Signed-off-by` por pessoa. A verificação automatizada do DCO ainda não está definida. A revisão da licença é um gatilho obrigatório antes da primeira versão que contenha código: [PA-09](../perguntas-em-aberto.md).

## Prós e contras das opções

### MIT agora

- Bom, porque é curta, permissiva e conhecida.
- Ruim, porque não tem concessão expressa de patentes.

### Apache-2.0 agora

- Bom, porque tem concessão expressa de patentes.
- Ruim, porque é mais longa e exige atenção a avisos de modificação.
- Ruim, porque seria diferente da licença dos outros projetos open source publicados em github.com/Efer-Eder, que usam MIT.

### Adiar

- Bom, porque evita escolher cedo demais.
- Ruim, porque sem licença o código e os documentos não são open source.

### DCO 1.1

- Bom, porque é uma certificação simples, em cada commit.
- Ruim, porque não transfere nem licencia direitos adicionais ao projeto.

### CLA

- Bom, porque pode dar ao projeto direitos adicionais, como relicenciar.
- Ruim, porque cria barreira de entrada e exige administração.

## Mais informações

- DCO 1.1: <https://developercertificate.org/>
- Comparação entre DCO e CLA: <https://bestpractices.linuxfoundation.org/ip/contribution-mechanisms.html>
- Pesquisa: [boas-praticas-open-source.md](../pesquisa/boas-praticas-open-source.md)
- Política para contribuições assistidas por IA, que se apoia neste ADR: [ADR-0003](0003-politica-de-contribuicoes-assistidas-por-ia.md)
