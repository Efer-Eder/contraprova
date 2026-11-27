# Papéis

A seção 14 do [manifesto](../manifesto.md) pede que, quando agentes forem usados, as responsabilidades de implementação, geração de testes e revisão sejam separadas, e que nenhum agente aprove sozinho seu próprio trabalho. Este documento traduz isso em quatro papéis para quem contribui com agentes.

Um papel não é um agente específico. Pode ser exercido por uma pessoa ou por um agente de qualquer fornecedor. O que importa é a separação: **o mesmo agente, na mesma tarefa, não exerce papéis incompatíveis** (veja a matriz abaixo).

## Fase atual e fase com código

O repositório só tem documentação hoje. A coluna "Hoje" descreve o papel em contribuições de documentação, ADR e RFC. A coluna "Quando houver código" está marcada como futura e **não vale ainda**.

## Implementador

Escreve a alteração.

| | Pode | Não pode |
|---|---|---|
| Hoje (docs, ADR, RFC) | Redigir e editar documentos dentro do escopo combinado; propor perguntas em aberto; citar fontes | Alterar o manifesto sem pedido explícito de um humano e, se for de conteúdo, sem RFC; criar decisões sem ADR; inventar fatos, números ou fontes; aprovar o próprio PR; adicionar `Signed-off-by`; abrir PR, issue ou comentário sem aprovação humana |
| Quando houver código (futuro) | Implementar a mudança dentro do escopo | Alterar testes protegidos, políticas ou critérios de aprovação para fazer a mudança passar; criar exceções; desativar verificações |

## Gerador de testes

Na fase atual não existem testes de software; este papel passa a valer com código. Hoje, a função análoga é **verificar a documentação**: checagens mecânicas e revisão de consistência (links, identificadores, ausência de travessão e de emoji).

| | Pode | Não pode |
|---|---|---|
| Hoje | Escrever e rodar verificações de consistência da documentação a partir do que a [especificação](../especificacao/README.md) exige, e relatar o resultado real | Ajustar a verificação para que o texto passe; relatar verificação que não rodou |
| Quando houver código (futuro) | Criar testes a partir dos requisitos e dos critérios de aceitação, não a partir da lógica do código implementado; usar interfaces públicas e resultados observáveis | Copiar a lógica do código para o teste; enfraquecer um teste para acomodar a implementação |

## Auditor ou revisor

Revisa o trabalho de outro papel. Recebe a intenção original e evidências verificáveis, não apenas o resumo do implementador.

| | Pode | Não pode |
|---|---|---|
| Hoje | Conferir o texto contra o manifesto e contra as fontes; apontar divergências; reexecutar as verificações; contestar o resultado | Aceitar o resumo do implementador como prova; aprovar o que ele mesmo escreveu; tratar votos de vários modelos como substituto de conferência |
| Quando houver código (futuro) | Reexecutar as verificações, investigar divergências, revisar alterações sugeridas | Aprovar sem execução real |

## Documentador

Mantém a documentação coerente com o que existe.

| | Pode | Não pode |
|---|---|---|
| Hoje | Reorganizar e esclarecer texto; manter índices, glossário e mapas atualizados; registrar o que mudou | Alterar o [manifesto](../manifesto.md) sem pedido explícito de um humano e, se for de conteúdo, sem RFC; acrescentar requisitos à especificação sem RFC; afirmar que algo existe ou foi decidido quando não é verdade |
| Quando houver código (futuro) | Documentar o que o código faz, com base no código e nos testes | Documentar comportamento que não foi verificado como se fosse garantido |

## Subagentes e skills do projeto

O projeto traz três ajudantes somente leitura em dois formatos: subagentes para Claude Code em `.claude/agents/` e skills no padrão aberto em `.agents/skills/` (`auditar-evidencias`, `revisar-especificacao` e `pesquisar-fontes`), com o mesmo conteúdo e os mesmos limites. As skills são lidas por Codex, Cursor, Copilot, Antigravity e Kilo Code; veja a [compatibilidade](compatibilidade.md). Eles não criam papel novo: apoiam os que já existem.

| Subagente | Onde se encaixa | Limite |
|---|---|---|
| `auditor-de-evidencias` | Cobre a parte de leitura do papel de auditor ou revisor: confere, a partir da intenção original e do diff, se cada afirmação tem fonte ou evidência. | Não executa comandos, então não reexecuta verificações. |
| `revisor-de-especificacao` | Cobre a parte de leitura do papel de auditor ou revisor: confere coerência com o manifesto, IDs, links e contradições. | Não executa comandos, então não reexecuta verificações. |
| `pesquisador-de-fontes` | Apoia o documentador e o auditor levantando fontes primárias, sempre com URL. | Só relata. Não decide nada pelo mantenedor. |

Os três só leem e relatam. Reexecutar as verificações e aprovar continuam sendo de uma pessoa ou de outro agente com esse papel.

Há ainda duas skills de apoio ao documentador: `escrever-adr` e `escrever-rfc`, que explicam como criar um ADR e uma RFC seguindo os READMEs de `docs/adr/` e `docs/rfcs/`. Elas deixam o estado como proposta ou rascunho: aceitar é do mantenedor.

## Matriz de incompatibilidades

Para uma mesma tarefa, o mesmo agente (ou a mesma pessoa agindo como agente) não deve exercer:

| Papel A | Papel B | Motivo |
|---|---|---|
| Implementador | Auditor | Ninguém aprova o próprio trabalho |
| Implementador | Gerador de testes | O critério de aprovação não deve ser controlado só por quem implementa |
| Gerador de testes | Auditor, dos mesmos testes | O auditor deve ser independente de quem criou o que audita |

Documentador e Implementador podem coincidir em textos pequenos, desde que a revisão seja feita por outro papel.

## Ninguém altera a regra que o fiscaliza

Nenhum papel altera unilateralmente as regras que o fiscalizam: `AGENTS.md`, as regras desta pasta, os modelos de PR, as regras de revisão e as demais políticas do projeto só mudam por PR revisado por pessoa e, quando afetam a especificação, por [RFC](../rfcs/README.md).

## Papéis e a pessoa responsável

Qualquer que seja a distribuição de papéis entre agentes, existe uma pessoa responsável pelo PR. É ela quem lê o resultado, entende e responde por ele, e é ela quem assina o DCO. Veja [README.md](README.md).
