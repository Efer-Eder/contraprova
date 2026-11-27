# RFCs

Uma RFC (pedido de comentários) é uma proposta escrita de mudança significativa, discutida em público antes de virar decisão. Ela existe porque várias perguntas do projeto estão em aberto, e a resposta a elas não deve nascer de um PR de código nem de uma conversa privada.

## Quando é necessária uma RFC

É necessária para:

- responder a uma [pergunta em aberto](../perguntas-em-aberto.md) (por exemplo, o formato do produto);
- mudar, acrescentar ou remover um princípio, uma capacidade ou um critério de aceitação da [especificação](../especificacao/README.md);
- propor qualquer coisa que altere a leitura do [manifesto](../manifesto.md) ou o escopo de [o que o projeto não é](../especificacao/nao-objetivos.md);
- introduzir o primeiro código, uma linguagem, uma ferramenta ou uma integração (conforme [ADR-0005](../adr/0005-documentacao-antes-do-codigo.md)): o código só começa com as perguntas de formato ([PA-01](../perguntas-em-aberto.md) a [PA-08](../perguntas-em-aberto.md)) respondidas por RFC aceita;
- mudar a política de contribuição ou de governança.

Basta uma issue ou um PR comum para:

- correções de texto, links e formatação;
- melhorias de clareza que não mudam o significado;
- registrar uma dúvida ou apontar uma inconsistência.

Basta um [ADR](../adr/README.md), sem RFC, para decisões de organização que o mantenedor toma diretamente, desde que não alterem a especificação. O ADR resultante de uma RFC aceita é obrigatório.

## Ciclo

1. **Issue de proposta.** Abra uma issue descrevendo a ideia em poucas linhas, para ver se há interesse e se já existe discussão.
2. **PR com o arquivo.** Copie [0000-modelo.md](0000-modelo.md) para `NNNN-titulo-em-kebab-case.md` neste diretório, com o próximo número livre, preencha e abra um PR. O PR é o lugar da discussão.
3. **Período de discussão pública.** No mínimo 7 dias corridos, contados a partir da abertura do PR com a RFC completa. Mudanças substanciais na RFC reiniciam a contagem.
4. **Decisão do mantenedor.** O mantenedor aceita, rejeita ou pede mudanças, e registra a decisão e os motivos no PR e no arquivo da RFC.
5. **ADR resultante.** Uma RFC aceita gera um ADR em `docs/adr/` que registra a decisão, e fecha as perguntas `PA-xx` correspondentes. Uma RFC rejeitada permanece no repositório com o motivo.

## Estados

| Estado | Significado |
|---|---|
| rascunho | Em escrita, ainda sem discussão formal. |
| em discussão | PR aberto e dentro do período de discussão. |
| aceita | Decisão tomada. Deve haver ADR resultante. |
| rejeitada | Decisão tomada contra a proposta. Permanece como registro. |
| retirada | A autora desistiu. |
| substituída | Trocada por outra RFC. |

O estado fica no front matter do arquivo e no índice abaixo.

## Regras de conteúdo

- Toda RFC cita os princípios do manifesto que afeta e, quando propõe um formato ou uma arquitetura, declara os limites de autoridade dele (seção 28 do manifesto).
- Nenhuma RFC afirma que algo existe ou foi decidido sem ser verdade. O que não é conhecido entra em "perguntas não resolvidas".
- Contribuições assistidas por IA seguem a política do [ADR-0003](../adr/0003-politica-de-contribuicoes-assistidas-por-ia.md) e o [guia para agentes](../agentes/README.md).

## Índice

| Número | Título | Estado |
|---|---|---|
| [0000](0000-modelo.md) | Modelo de RFC | modelo, não é uma proposta |
| [0001](0001-formato-do-produto.md) | Formato do produto ([PA-01](../perguntas-em-aberto.md)) | rascunho |

Nenhuma RFC foi aceita ainda. A 0001 é um rascunho sobre o formato do produto. As demais perguntas de formato ([PA-02](../perguntas-em-aberto.md) a [PA-08](../perguntas-em-aberto.md)) ainda não têm RFC.

Decisões de organização tomadas antes da publicação do repositório (nome, política de IA, idioma, licença provisória) foram registradas direto em ADR, sem RFC.
