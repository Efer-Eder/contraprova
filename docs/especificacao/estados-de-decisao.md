# Estados de decisão e modos de operação

Derivado das seções 16 e 17 do [manifesto](../manifesto.md). Nenhum desses estados ou modos está implementado.

## Princípio da decisão

A decisão deve ser baseada em políticas explícitas e evidências, não em uma nota subjetiva de IA (seção 17). Ligação com os princípios [P-02 e P-04](principios.md).

## Os quatro estados mínimos

| Estado | Definição (seção 17) |
|---|---|
| Aprovado | Verificações obrigatórias concluídas e critérios atendidos, dentro do escopo declarado. |
| Bloqueado | Falha obrigatória, risco proibido ou violação comprovada de política. |
| Inconclusivo | Evidência insuficiente, execução incompleta, ambiente indisponível ou conflito não resolvido. |
| Exceção autorizada | Risco conhecido aceito explicitamente por pessoa autorizada, com justificativa, escopo e validade. |

"Estados mínimos" significa que o manifesto não exclui estados adicionais, mas nenhum foi proposto até agora.

### Regras associadas

- Em modo protegido, os estados bloqueado e inconclusivo impedem a publicação.
- Exceções não podem ser criadas silenciosamente pelo agente desenvolvedor. A criação exige pessoa autorizada, justificativa, escopo e validade.
- Verificação obrigatória ausente, interrompida ou inconclusiva não equivale a sucesso (princípio P-04).
- Métricas de cobertura, quantidade de testes e mutações detectadas são indicadores auxiliares. Não compensam falhas críticas por meio de média ou pontuação geral.
- Uma alteração relevante posterior à aprovação invalida a aprovação correspondente (seção 15, cenário [CA-10](criterios-de-aceitacao.md)).

## Modo consultivo e modo protegido

A seção 16 distingue dois modos e exige que o produto exiba claramente qual está ativo.

| Aspecto | Modo consultivo | Modo protegido |
|---|---|---|
| Autoridade | Apenas recomenda não publicar | Possui integração e autoridade para impedir a publicação |
| Efeito de bloqueado | Recomendação | Impede a publicação |
| Efeito de inconclusivo | Recomendação | Impede a publicação |
| Pré-requisito | Nenhum além do que a análise exigir | Integração efetiva com o ponto de publicação |
| O que deve informar | Que a proteção é consultiva (cenário [CA-14](criterios-de-aceitacao.md)) | Qual autoridade de bloqueio está efetivamente ativa |

Cuidados que o manifesto impõe:

- Não apresentar uma integração não configurada como proteção ativa (seção 19).
- Uma versão inicial consultiva não deve ser anunciada como proteção inviolável (seção 26).
- Se o agente tiver controle administrativo sobre a máquina, as contas e a publicação, uma ferramenta local não garante proteções invioláveis, e o produto deve informar essa condição (seção 15, detalhada em [modelo-de-ameacas.md](modelo-de-ameacas.md)).
- A seção 28 observa que uma skill baseada apenas em instruções pode orientar agentes, mas não constitui por si só um bloqueio técnico. Isso implica que um formato desse tipo, isoladamente, só poderia operar em modo consultivo. O manifesto não afirma isso literalmente; é a consequência direta de ele não constituir bloqueio técnico.

## Pontos não definidos

O manifesto não define o formato das exceções, quem conta como pessoa autorizada, nem a validade padrão. Esses pontos dependem do formato do produto ([PA-01](../perguntas-em-aberto.md)) e de futuras RFCs.
