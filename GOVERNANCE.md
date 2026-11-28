# Governança

Este documento descreve como as decisões do Contraprova são tomadas hoje. Ele é curto de propósito: o projeto está em fase de especificação, com um protótipo experimental do motor, e com uma pessoa mantendo.

## Modelo atual

Na fase inicial, o projeto segue o modelo de **ditador benevolente** (BDFL), conforme descrito no guia [Leadership and governance](https://opensource.guide/leadership-and-governance/) do Open Source Guides: um mantenedor tem a palavra final. Hoje, é Efer Eder (`@Efer-Eder`). Veja [MAINTAINERS.md](MAINTAINERS.md).

A palavra final não significa decisão opaca. Os compromissos abaixo valem desde já.

## Como as decisões são tomadas

- **Em público.** Discussões e decisões acontecem por issue, PR e RFC, não em conversas privadas.
- **Consenso primeiro.** Antes de decidir, busco consenso e levo em conta os argumentos apresentados. Quando não há consenso, o mantenedor decide e registra o motivo.
- **Registro.** Decisões relevantes viram [ADR](docs/adr/README.md). Mudanças grandes passam por [RFC](docs/rfcs/README.md), com tempo para comentários antes da decisão.
- **Fluxo.** A `main` é protegida e tudo entra por PR, com checks verdes e squash merge. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Regras herdadas do manifesto

O Contraprova propõe uma camada de verificação independente. O próprio projeto deve se submeter ao mesmo espírito:

- **Ninguém aprova sozinho o próprio trabalho** quando houver mais de um mantenedor. Enquanto houver um só, isso é uma limitação conhecida, compensada por checks automáticos, por transparência dos registros e por revisão aberta da comunidade.
- **Mudanças na política que fiscaliza o projeto são rastreáveis e revisáveis.** Alterações em governança, política de IA, regras de contribuição, workflows e proteções do repositório entram por PR, com justificativa, e não por edição silenciosa.

## Escopo de cada tipo de mudança

| Mudança | Caminho |
|---|---|
| Correção de texto, link, formatação | PR direto. |
| Nova pesquisa, glossário, esclarecimento | Issue e PR. |
| Alteração de princípio, estado de decisão, governança, licença ou política de IA | RFC e ADR. |
| Escolha de formato, linguagem ou arquitetura do produto | RFC e ADR. |

## Como alguém vira mantenedor

Existe um caminho, mesmo com um só mantenedor hoje:

1. Contribuir de forma recorrente e com qualidade (documentação, pesquisa, RFCs, revisões), ao longo de um período suficiente para que o mantenedor e a comunidade conheçam o trabalho.
2. Seguir o [Código de Conduta](CODE_OF_CONDUCT.md), a [AI_POLICY.md](AI_POLICY.md) e as regras de escrita do [CONTRIBUTING.md](CONTRIBUTING.md).
3. Receber um convite do mantenedor atual, ou manifestar interesse em uma issue.
4. Aceitar o convite por PR que atualiza o [MAINTAINERS.md](MAINTAINERS.md), aberto em público e com a justificativa.

Não há número mínimo de contribuições. O critério é confiança construída em público.

## Quando a governança será revista

Comprometo-me a rever este documento, por RFC, quando houver **contribuidores recorrentes**, para avaliar um modelo com mais de um mantenedor e decisões compartilhadas. Ele também deve ser revisto antes da primeira versão que contenha código, junto com a revisão da licença ([ADR 0002](docs/adr/0002-licenca-mit-provisoria-e-dco.md)).

## Conduta e saída

Violações do [Código de Conduta](CODE_OF_CONDUCT.md) são tratadas conforme o próprio código. Quem quiser deixar de ser mantenedor pode avisar em PR que atualiza o [MAINTAINERS.md](MAINTAINERS.md). Se o mantenedor ficar inativo por longo período, qualquer pessoa pode abrir uma issue para discutir a continuidade, inclusive a transferência ou o encerramento do projeto.
