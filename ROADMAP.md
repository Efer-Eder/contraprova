# Roadmap

Este roadmap descreve **capacidades**, não tecnologias, formatos nem prazos. Nada aqui está implementado como produto: o projeto está em fase de especificação, com um protótipo experimental e consultivo do motor ([ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md)). A ordem pode mudar conforme as RFCs e as respostas às [perguntas em aberto](docs/perguntas-em-aberto.md).

As etapas 1 a 4 vêm da seção 26 do [manifesto](docs/manifesto.md). A etapa 0 é o trabalho de hoje.

O protótipo em `motor/` é experimental, de nível consultivo, e não fecha nenhuma pergunta de formato (PA-01 a PA-08): elas continuam abertas até serem respondidas por RFC aceita ([ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md), que substitui o [ADR 0005](docs/adr/0005-documentacao-antes-do-codigo.md)). Escolher stack definitiva e publicar pacote seguem dependendo de RFC.

> Uma versão inicial consultiva não será anunciada como proteção inviolável. Quando existir um modo protegido, ele dirá com clareza o que consegue e o que não consegue impedir, e qual modo está ativo.

## Etapa 0: especificação (em andamento)

- [x] Manifesto adotado como fonte de verdade ([docs/manifesto.md](docs/manifesto.md)).
- [x] Estrutura de documentação, governança, política de IA e regras de contribuição.
- [x] ADRs 0000 a 0007 registrando as decisões iniciais.
- [x] Protótipo experimental do motor, de nível consultivo, em paralelo com a especificação, em 2026-11-27 ([ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md)). Não é produto nem proteção.
- [ ] Consolidar a especificação em [docs/especificacao/](docs/especificacao/).
- [ ] Responder as [perguntas em aberto](docs/perguntas-em-aberto.md) por RFC, incluindo o formato do produto.
- [x] Decidir o nome: Contraprova, em 2026-11-27 ([ADR 0004](docs/adr/0004-nome-do-projeto-contraprova.md)).
- [ ] Fazer a busca de marcas (INPI e WIPO) e de domínios para o nome.
- [ ] Rever a licença antes da primeira versão que contenha código (para o protótipo, antes da primeira versão publicada; veja o [ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md)).
- [ ] Definir os cenários de autoavaliação da seção 23 do manifesto: projetos deliberadamente defeituosos, projetos corretos e casos ambíguos.
- [ ] Definir como serão medidos os indicadores da seção 25, sem metas numéricas inventadas antes de experimentos.

## Etapa 1: fundação

Capacidades: investigação de projetos, inventário de testes, critérios de aceitação, execução real, análise de alterações e relatórios de evidências.

## Etapa 2: validação independente

Capacidades: geração de testes, reprodução de bugs, avaliação da eficácia dos testes, detecção de regressões e auditoria de agentes.

## Etapa 3: proteção efetiva

Capacidades: políticas protegidas, isolamento, verificação da esteira de publicação e vinculação da aprovação ao artefato.

## Etapa 4: experiência ampliada

Capacidades: configuração guiada, histórico, explicações acessíveis, correções assistidas e integração com diferentes ambientes de desenvolvimento.

## O que este roadmap não faz

- Não define datas, versões nem entregas.
- Não escolhe linguagem, arquitetura ou formato (skill, agente, programa, integração, serviço).
- Não promete que todas as etapas serão implementadas.
