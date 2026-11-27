# Documentação do Contraprova

O Contraprova é uma proposta de camada independente de verificação para software feito com IA: "Desenvolva com IA. Valide com evidências." O projeto está na **fase de especificação**. Não há código, e o formato do produto (skill, agente, programa independente, integração, serviço ou combinação) ainda não foi decidido. Nada nesta documentação descreve algo que já exista como produto.

A fonte de verdade é o [manifesto](manifesto.md), o texto original com o nome do projeto atualizado. Tudo o mais deriva dele ou registra decisões de organização do projeto.

## Organização segundo o Diátaxis

Esta documentação segue o [Diátaxis](https://diataxis.fr/), que separa a documentação em quatro tipos: tutoriais, guias práticos, referência e explicação. Como não há produto, dois quadrantes estão vazios, e dizemos isso em vez de preencher com texto de enchimento.

| Quadrante | Para quê | Estado hoje | Onde |
|---|---|---|---|
| Tutoriais | Aprender fazendo, por um percurso guiado com o produto | Vazio: não há produto para usar | Nenhum |
| Guias práticos | Resolver uma tarefa concreta | Parcial: apenas contribuição ao projeto | [agentes](agentes/README.md), [adr](adr/README.md), [rfcs](rfcs/README.md) |
| Referência | Consultar fatos sobre o projeto | Preenchido para a especificação | [especificacao](especificacao/README.md), [perguntas em aberto](perguntas-em-aberto.md) |
| Explicação | Entender o porquê | Preenchido | [manifesto](manifesto.md), [pesquisa](pesquisa/README.md), [ADRs](adr/README.md) |

Os quadrantes de tutoriais e de guias de uso do produto ficarão vazios até existir um produto. Um guia ou tutorial escrito antes disso seria especulação, e o [ADR-0005](adr/0005-documentacao-antes-do-codigo.md) manda não fingir que algo existe.

## Mapa dos arquivos

### Fonte de verdade

- [manifesto.md](manifesto.md): manifesto e especificação de produto, no texto original com o nome atualizado (29 seções).
- [perguntas-em-aberto.md](perguntas-em-aberto.md): decisões ainda não tomadas (`PA-xx`).

### Especificação

- [especificacao/README.md](especificacao/README.md): índice e convenções de identificadores.
- [especificacao/principios.md](especificacao/principios.md): os 12 princípios (`P-01` a `P-12`).
- [especificacao/capacidades.md](especificacao/capacidades.md): catálogo de capacidades (`CAP-xx`) por etapa.
- [especificacao/criterios-de-aceitacao.md](especificacao/criterios-de-aceitacao.md): os 16 cenários (`CA-01` a `CA-16`).
- [especificacao/estados-de-decisao.md](especificacao/estados-de-decisao.md): estados de decisão, modo consultivo e modo protegido.
- [especificacao/modelo-de-ameacas.md](especificacao/modelo-de-ameacas.md): ameaças, ativos e limites de confiança.
- [especificacao/fluxo-de-uso.md](especificacao/fluxo-de-uso.md): os 14 passos do fluxo, com diagrama.
- [especificacao/nao-objetivos.md](especificacao/nao-objetivos.md): o que o projeto não é.
- [especificacao/glossario.md](especificacao/glossario.md): termos do manifesto.

### Página do projeto

- [publicar-pagina.md](publicar-pagina.md): como a página pública em `site/` é mantida e publicada.

### Decisões e processo

- [adr/README.md](adr/README.md): como funcionam os ADRs, estados e índice.
- [adr/modelo.md](adr/modelo.md): modelo de ADR (MADR 4.0.0).
- [adr/0000-registrar-decisoes-com-madr.md](adr/0000-registrar-decisoes-com-madr.md)
- [adr/0001-idioma-da-documentacao-e-dos-commits.md](adr/0001-idioma-da-documentacao-e-dos-commits.md)
- [adr/0002-licenca-mit-provisoria-e-dco.md](adr/0002-licenca-mit-provisoria-e-dco.md)
- [adr/0003-politica-de-contribuicoes-assistidas-por-ia.md](adr/0003-politica-de-contribuicoes-assistidas-por-ia.md)
- [adr/0004-nome-do-projeto-contraprova.md](adr/0004-nome-do-projeto-contraprova.md)
- [adr/0005-documentacao-antes-do-codigo.md](adr/0005-documentacao-antes-do-codigo.md)
- [adr/0006-agents-md-como-fonte-unica-para-agentes.md](adr/0006-agents-md-como-fonte-unica-para-agentes.md)
- [adr/0007-versionamento-semantico-e-changelog.md](adr/0007-versionamento-semantico-e-changelog.md)
- [rfcs/README.md](rfcs/README.md): processo de RFC.
- [rfcs/0000-modelo.md](rfcs/0000-modelo.md): modelo de RFC.

### Pesquisa

- [pesquisa/README.md](pesquisa/README.md): como o registro funciona.
- [pesquisa/boas-praticas-open-source.md](pesquisa/boas-praticas-open-source.md): práticas pesquisadas em 2026-11-27, o que foi adotado e o que não foi confirmado.
- [pesquisa/nome-e-projetos-semelhantes.md](pesquisa/nome-e-projetos-semelhantes.md): conflitos de nome encontrados.

### Contribuir com agentes de IA

- [agentes/README.md](agentes/README.md): regras gerais.
- [agentes/compatibilidade.md](agentes/compatibilidade.md): matriz de ferramentas de agentes, adaptadores, skills e o que não foi confirmado.
- [agentes/papeis.md](agentes/papeis.md): papéis separados e seus limites.
- [agentes/protocolo-de-entrega.md](agentes/protocolo-de-entrega.md): o que uma entrega contém.
- [agentes/prompts-iniciais.md](agentes/prompts-iniciais.md): textos prontos para qualquer agente.

## Arquivos da raiz do repositório

Mantidos fora desta pasta:

- [CONTRIBUTING.md](../CONTRIBUTING.md): como contribuir.
- [AGENTS.md](../AGENTS.md): fonte única de instruções para agentes.
- [AI_POLICY.md](../AI_POLICY.md): política de contribuições assistidas por IA.
- [GOVERNANCE.md](../GOVERNANCE.md): governança do projeto.
- [ROADMAP.md](../ROADMAP.md): roteiro.
- [SECURITY.md](../SECURITY.md): como reportar problemas de segurança.

## Por onde começar

- Quer entender a ideia: leia o [manifesto](manifesto.md), começando pelas seções 1, 2 e 4.
- Quer contribuir com texto: leia [CONTRIBUTING.md](../CONTRIBUTING.md) e o [guia para agentes](agentes/README.md) se usar IA.
- Quer propor algo que muda o escopo: veja [rfcs](rfcs/README.md) e as [perguntas em aberto](perguntas-em-aberto.md).
- Quer saber o que não se sabe: [perguntas em aberto](perguntas-em-aberto.md).
