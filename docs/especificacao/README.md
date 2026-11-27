# Especificação do Contraprova

Esta pasta reorganiza o [manifesto](../manifesto.md) em documentos rastreáveis. Ela não acrescenta requisitos: cada item aponta para a seção do manifesto de onde veio. Se algo aqui divergir do manifesto, vale o manifesto, e a divergência é um erro a corrigir.

O projeto está na fase de especificação. Não existe código, e o formato (skill, agente, programa independente, integração, serviço ou combinação) ainda não foi decidido. Veja [perguntas em aberto](../perguntas-em-aberto.md).

## Documentos

| Documento | Conteúdo | Seções do manifesto |
|---|---|---|
| [principios.md](principios.md) | Os 12 princípios inegociáveis com identificadores `P-01` a `P-12` | 4, mais as seções que os concretizam |
| [capacidades.md](capacidades.md) | Catálogo `CAP-xx` agrupado pelas 4 etapas da evolução funcional | 26 e seções de origem |
| [criterios-de-aceitacao.md](criterios-de-aceitacao.md) | Os 16 cenários `CA-01` a `CA-16` | 24 |
| [estados-de-decisao.md](estados-de-decisao.md) | Os 4 estados de decisão e os modos consultivo e protegido | 16 e 17 |
| [modelo-de-ameacas.md](modelo-de-ameacas.md) | Ameaças, ativos, limites de confiança e a condição sem garantia local | 15 |
| [fluxo-de-uso.md](fluxo-de-uso.md) | Os 14 passos do fluxo completo, com diagrama | 18 |
| [nao-objetivos.md](nao-objetivos.md) | O que o projeto não é | 27 |
| [glossario.md](glossario.md) | Termos do manifesto | várias |

## Convenções de identificadores

Os identificadores são estáveis: uma vez publicado, um identificador não é reutilizado nem renumerado. Se um item for retirado, o número fica reservado, o item é marcado como retirado e a remoção é registrada em [ADR](../adr/README.md).

| Prefixo | Significa | Onde está |
|---|---|---|
| `P-xx` | Princípio | [principios.md](principios.md) |
| `CAP-xx` | Capacidade | [capacidades.md](capacidades.md) |
| `CA-xx` | Critério de aceitação | [criterios-de-aceitacao.md](criterios-de-aceitacao.md) |
| `PA-xx` | Pergunta em aberto | [perguntas-em-aberto.md](../perguntas-em-aberto.md) |
| `ADR-nnnn` | Decisão arquitetural registrada | [adr](../adr/README.md) |
| `RFC-nnnn` | Proposta de mudança | [rfcs](../rfcs/README.md) |

## Sobre os mapeamentos

Os identificadores `P-xx`, `CAP-xx` e `CA-xx` são uma numeração editorial criada para rastreabilidade. O manifesto numera os princípios (seção 4) por posição, mas não nomeia capacidades nem cenários com identificadores. Os vínculos entre princípios, capacidades e cenários são leituras do mantenedor sobre o texto do manifesto e podem ser contestadas por issue ou RFC.
