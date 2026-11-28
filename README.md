# Contraprova

[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-7377F0?style=flat-square)](LICENSE)
[![Estado: especificação e protótipo experimental](https://img.shields.io/badge/estado-especifica%C3%A7%C3%A3o%20%2B%20prot%C3%B3tipo-orange?style=flat-square)](ROADMAP.md)

**Desenvolva com IA. Valide com evidências.**

> Nunca confie em uma IA apenas porque ela afirma que seu código funciona. Exija provas.

[English](README.en.md) · [Manifesto](docs/manifesto.md) · [Documentação](docs/README.md) · [Roadmap](ROADMAP.md) · [Como contribuir](CONTRIBUTING.md) · [Página do projeto](https://efer.online/projeto/contraprova/)

## Estado do projeto

**O Contraprova está em fase de especificação, com um protótipo experimental do motor que já roda. Não é um produto pronto.**

O protótipo é um programa de linha de comando, de nível **consultivo**: ele recomenda, não impede nada. Não há pacote publicado, e o formato do produto (skill, agente, programa independente, integração, serviço ou uma combinação), a linguagem e a arquitetura seguem em aberto e serão decididos por RFC. As escolhas de tecnologia do protótipo são provisórias e não fecham nenhuma pergunta em aberto ([ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md)). O resto do repositório é texto: o manifesto, a especificação, as decisões registradas e as regras de colaboração. Nada aqui deve ser lido como proteção, produto pronto, prazo ou promessa de entrega.

## Experimente o protótipo

Requisito: Node.js 22 ou mais novo. O protótipo não tem dependências. A partir de um clone deste repositório:

```sh
node motor/bin/contraprova.js verificar <pasta-do-projeto>
```

Ou direto do GitHub, sem clonar:

```sh
npx --yes github:Efer-Eder/contraprova verificar .
```

Não existe pacote no npm: esse comando baixa o código deste repositório e o executa na sua máquina. Leia antes de rodar.

O que ele faz:

- executa os testes do projeto de verdade e usa o resultado, em vez de acreditar em quem diz que passaram;
- introduz defeitos simples numa cópia temporária do projeto, para ver se os testes percebem (o projeto original não é alterado);
- audita os workflows do GitHub Actions por heurística, apontando o que pode fazer falhas passarem;
- gera um relatório de evidências (`.contraprova/relatorio.md` e `.contraprova/relatorio.json`) com a decisão: aprovado, bloqueado ou inconclusivo.

Limites:

- reconhece só projetos Node.js e Python, e a análise de testes e de workflows é heurística, podendo errar para os dois lados;
- não há isolamento: o código do projeto analisado roda na sua máquina, com as suas permissões. Não rode em projeto em que você não confia;
- não é modo protegido: o resultado recomenda e pode ser ignorado por quem controla a máquina ou o repositório;
- a decisão "exceção autorizada" não está implementada.

Detalhes, comandos, códigos de saída e limites completos em [motor/README.md](motor/README.md).

## O problema

A capacidade de construir software com IA cresceu mais rápido do que a capacidade de verificar a sua qualidade. Hoje é possível pedir a um agente que construa um sistema inteiro sem saber avaliar os testes que ele escreveu, identificar uma regressão, configurar uma esteira de publicação ou reconhecer uma falha de segurança.

O agente escreve o código, cria testes, executa comandos e anuncia que terminou. Mas um teste aprovado pode verificar o comportamento errado, um erro pode ter sido silenciado, uma dependência pode ter sido inventada, uma funcionalidade pode existir só na tela, e um pipeline pode estar verde porque não executou as verificações necessárias. Isso não pressupõe má intenção: otimizar para concluir a tarefa pode produzir soluções que parecem corretas sem satisfazer a necessidade original.

## O que o Contraprova pretende ser

Uma camada independente de verificação para software desenvolvido com assistência de IA. Ele separa a construção do software da verificação da sua qualidade, para que alguém possa desenvolver com IA sem depender só da palavra da própria IA.

A proposta é que o Contraprova consiga, dentro da autoridade técnica que realmente tiver:

- transformar a intenção de quem constrói em critérios de aceitação verificáveis;
- tratar testes, relatórios e comentários existentes como alegações a verificar, não como fatos;
- produzir evidências independentes, procurar defeitos e regressões e detectar enfraquecimento de testes;
- fiscalizar a esteira de publicação e explicar riscos em linguagem compreensível;
- impedir aprovações indevidas, quando houver integração e autoridade para isso.

O produto não promete software sem bugs. Promete não confundir ausência de evidência de erro com evidência de funcionamento. Seu valor não está em fazer uma IA parecer mais confiante, e sim em tornar essa confiança menos necessária.

## O que o Contraprova não é

Conforme a seção 27 do [manifesto](docs/manifesto.md):

- Não é apenas um gerador de testes, um revisor de código, um scanner de vulnerabilidades, um agente de programação ou um painel de métricas.
- Não é uma promessa de ausência de bugs, um substituto universal de especialistas nem uma certificação automática de segurança.
- Não exige que todos os projetos usem a mesma arquitetura.
- Não deve modificar código, instalar componentes, enviar dados ou publicar versões sem as permissões necessárias.
- Não trata todo código existente como culpado: o objetivo é verificar, não condenar sem evidência.

## Os 12 princípios

Resumo; o texto completo está no [manifesto](docs/manifesto.md) e em [docs/especificacao/principios.md](docs/especificacao/principios.md).

1. **Desconfiança inicial:** nada é considerado verdadeiro apenas por existir (teste, relatório, comentário, documentação ou declaração de agente).
2. **Evidência antes de opinião:** resultados observados valem mais do que conclusões de modelos.
3. **Independência:** quem implementa não controla sozinho os critérios de aprovação.
4. **Falha segura:** verificação obrigatória ausente, interrompida ou inconclusiva não equivale a sucesso.
5. **Transparência:** toda conclusão indica origem, escopo e limitações.
6. **Não regressão:** corrigir uma funcionalidade não autoriza quebrar outra.
7. **Não manipulação:** testes não podem ser enfraquecidos silenciosamente para acomodar código incorreto.
8. **Controle humano:** mudanças de requisitos, exceções e riscos aceitos são explícitos.
9. **Privilégio mínimo:** analisar um projeto não deve exigir acesso irrestrito a produção, segredos ou contas administrativas.
10. **Neutralidade:** a confiança não depende da marca do agente que escreveu o código.
11. **Proporcionalidade:** as verificações consideram risco, tamanho e contexto, sem esconder lacunas.
12. **Reprodutibilidade:** outra execução equivalente deve conseguir verificar a mesma evidência.

## Os 4 estados de decisão

A decisão de qualidade vem de políticas explícitas e evidências, não de uma nota subjetiva de IA. Os estados mínimos propostos são:

| Estado | Significado |
|---|---|
| Aprovado | Verificações obrigatórias concluídas e critérios atendidos, dentro do escopo declarado. |
| Bloqueado | Falha obrigatória, risco proibido ou violação comprovada de política. |
| Inconclusivo | Evidência insuficiente, execução incompleta, ambiente indisponível ou conflito não resolvido. |
| Exceção autorizada | Risco conhecido aceito explicitamente por pessoa autorizada, com justificativa, escopo e validade. |

Detalhes em [docs/especificacao/estados-de-decisao.md](docs/especificacao/estados-de-decisao.md).

## Modo consultivo e modo protegido

O manifesto distingue dois modos de operação e exige que o produto mostre qual está ativo:

- **Consultivo:** apenas recomenda não publicar. Não tem autoridade técnica para impedir.
- **Protegido:** possui integração e autoridade para impedir a publicação. Nesse modo, os estados bloqueado e inconclusivo impedem a publicação.

Uma versão consultiva nunca será apresentada como proteção inviolável. Se o agente tiver controle administrativo sobre a máquina, as contas e a publicação, uma ferramenta local não consegue garantir proteções invioláveis, e o produto deve dizer isso.

## Evolução funcional proposta

As etapas descrevem capacidades, não tecnologias nem prazos (seção 26 do manifesto). O detalhe está no [ROADMAP.md](ROADMAP.md).

- **Fundação:** investigação de projetos, inventário de testes, critérios de aceitação, execução real, análise de alterações e relatórios de evidências.
- **Validação independente:** geração de testes, reprodução de bugs, avaliação da eficácia dos testes, detecção de regressões e auditoria de agentes.
- **Proteção efetiva:** políticas protegidas, isolamento, verificação da esteira de publicação e vinculação da aprovação ao artefato.
- **Experiência ampliada:** configuração guiada, histórico, explicações acessíveis, correções assistidas e integração com diferentes ambientes de desenvolvimento.

## Mapa da documentação

| Onde | O que há |
|---|---|
| [motor/](motor/README.md) | Protótipo experimental do motor, consultivo. Veja o [ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md). |
| [skills/](skills/contraprova/SKILL.md) | Skill do protótipo, para agentes explicarem o resultado. |
| [docs/manifesto.md](docs/manifesto.md) | Fonte de verdade: manifesto e especificação de produto. |
| [docs/README.md](docs/README.md) | Índice da documentação. |
| [docs/especificacao/](docs/especificacao/) | Princípios, capacidades, critérios de aceitação, estados de decisão, modelo de ameaças, fluxo de uso, não objetivos e glossário. |
| [docs/perguntas-em-aberto.md](docs/perguntas-em-aberto.md) | Decisões deliberadamente em aberto. |
| [docs/adr/](docs/adr/README.md) | Registros de decisão (ADR). |
| [docs/rfcs/](docs/rfcs/README.md) | Propostas de mudança maiores (RFC). |
| [docs/pesquisa/](docs/pesquisa/boas-praticas-open-source.md) | Pesquisa de apoio, inclusive sobre o nome. |
| [docs/agentes/](docs/agentes/README.md) | Papéis, protocolo de entrega e prompts iniciais para agentes. |
| [GOVERNANCE.md](GOVERNANCE.md), [MAINTAINERS.md](MAINTAINERS.md) | Como as decisões são tomadas e quem mantém. |
| [AI_POLICY.md](AI_POLICY.md) | Política de contribuições assistidas por IA. |

## Como participar agora

Como o produto ainda não foi decidido, a contribuição mais útil neste momento é intelectual, e testar o protótipo em projetos seus e relatar o que ele errou também ajuda:

1. Leia o [manifesto](docs/manifesto.md).
2. Discuta as [perguntas em aberto](docs/perguntas-em-aberto.md) em issues e Discussions.
3. Proponha mudanças maiores por [RFC](docs/rfcs/README.md).
4. Corrija, traduza ou melhore a documentação.
5. Rode o protótipo (`npm test` no clone, ou a seção acima) e relate o que ele acertou e errou.

O fluxo completo está em [CONTRIBUTING.md](CONTRIBUTING.md). As contribuições externas são certificadas por DCO (`git commit -s`; os commits do mantenedor não levam `Signed-off-by`), e o uso de IA nelas segue a [AI_POLICY.md](AI_POLICY.md) (divulgação obrigatória para contribuições externas; os mantenedores estão isentos dessa exigência).

## Para quem usa agentes de IA

O repositório funciona com os agentes de programação mais usados, entre eles Codex, Claude Code, Antigravity, Cursor, GitHub Copilot, Gemini CLI e Windsurf, além de outros que leem o formato `AGENTS.md`. A matriz de ferramentas, com a situação de cada uma e as fontes oficiais, está em [docs/agentes/compatibilidade.md](docs/agentes/compatibilidade.md). Se você usa um agente para trabalhar neste repositório, comece por [AGENTS.md](AGENTS.md) e por [docs/agentes/](docs/agentes/README.md). Agentes não abrem PR, issue nem comentário sem aprovação humana, e não adicionam `Signed-off-by`. Veja a [AI_POLICY.md](AI_POLICY.md).

## Sobre o nome

O projeto nasceu com o nome de trabalho VibeGuard e passou a se chamar Contraprova em 2026-11-27. Ele não tem relação com os projetos e produtos homônimos que usam o nome antigo. Na perícia, contraprova é o segundo exame, independente, que confirma ou derruba o primeiro, e é essa a ideia do projeto. A pesquisa está em [docs/pesquisa/nome-e-projetos-semelhantes.md](docs/pesquisa/nome-e-projetos-semelhantes.md) e a decisão no [ADR 0004](docs/adr/0004-nome-do-projeto-contraprova.md). A busca em bases de marcas ainda está pendente.

## Licença

[MIT](LICENSE), de forma provisória: a licença será revisada antes da primeira versão que contenha código; o protótipo ainda não foi publicado como versão ([ADR 0002](docs/adr/0002-licenca-mit-provisoria-e-dco.md)). Copyright (c) 2026 Efer Eder.
