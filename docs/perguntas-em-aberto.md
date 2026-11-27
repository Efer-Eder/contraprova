# Perguntas em aberto

Decisões que ainda não foram tomadas. A seção 28 do [manifesto](manifesto.md) deixa deliberadamente em aberto o formato, as linguagens, as ferramentas, a arquitetura interna, a distribuição, as interfaces, os modelos, o licenciamento específico e a estratégia de integração. Outras perguntas vêm de outras seções do manifesto e das decisões de organização do projeto.

Cada pergunta tem identificador estável `PA-xx`. Uma pergunta é fechada por [ADR](adr/README.md), que normalmente nasce de uma [RFC](rfcs/README.md). Enquanto não for fechada, o status é "aberta" e nenhum documento pode tratá-la como decidida.

## Índice

| ID | Pergunta | Origem | Status |
|---|---|---|---|
| PA-01 | Formato do produto | manifesto, seção 28 | aberta |
| PA-02 | Linguagens | manifesto, seção 28 | aberta |
| PA-03 | Ferramentas | manifesto, seção 28 | aberta |
| PA-04 | Arquitetura interna | manifesto, seção 28 | aberta |
| PA-05 | Distribuição | manifesto, seção 28 | aberta |
| PA-06 | Interfaces | manifesto, seção 28 | aberta |
| PA-07 | Modelos | manifesto, seção 28 | aberta |
| PA-08 | Estratégia de integração | manifesto, seção 28 | aberta |
| PA-09 | Licença definitiva | manifesto, seção 28; [ADR-0002](adr/0002-licenca-mit-provisoria-e-dco.md) | aberta |
| PA-10 | Nome definitivo | manifesto, seção 28; [ADR-0004](adr/0004-nome-do-projeto-contraprova.md) | decidida em 2026-11-27, ver ADR 0004; busca de marcas pendente |
| PA-11 | Metas numéricas | manifesto, seção 25 | aberta |
| PA-12 | Divulgação de uso de IA pelos mantenedores | [ADR-0003](adr/0003-politica-de-contribuicoes-assistidas-por-ia.md) | decidida em 2026-11-27, ver ADR 0003 |
| PA-13 | Idioma de longo prazo | [ADR-0001](adr/0001-idioma-da-documentacao-e-dos-commits.md) | aberta |
| PA-14 | Escopo da capacidade de histórico | manifesto, seção 26 | aberta |
| PA-15 | Etapa das capacidades não listadas na seção 26 | manifesto, seções 11, 13, 16, 17, 22 e 23 | aberta |

## PA-01 Formato do produto

- **Pergunta:** o produto será uma skill, um agente, um programa independente, uma integração, um serviço ou uma combinação desses formatos?
- **Por que importa:** o formato determina se o produto consegue executar verificações reais, se há isolamento, se as políticas ficam protegidas e, portanto, se existe bloqueio técnico ou apenas orientação. A seção 28 afirma que uma skill baseada apenas em instruções pode orientar agentes, mas não constitui por si só um bloqueio técnico, e que qualquer formato precisa declarar seus limites de autoridade.
- **O que investigar:** que verificações reais cada formato consegue executar; como cada um protege políticas e referências aprovadas contra escrita pelo agente desenvolvedor; que modo (consultivo ou protegido) cada formato permite de forma honesta; como cada um é distribuído e usado por quem não domina testes.
- **Critérios do manifesto (seção 28):** capacidade de executar verificações reais, isolamento, proteção de políticas, facilidade de uso, portabilidade e custo.
- **Status:** aberta.

## PA-02 Linguagens

- **Pergunta:** em que linguagens o produto será escrito, e que linguagens de projetos analisados ele suportará primeiro?
- **Por que importa:** limita o público inicial e a portabilidade. O manifesto exige não impor a mesma arquitetura a todos os projetos (seção 27).
- **O que investigar:** linguagens dos projetos do público descrito na seção 3; custo de suportar cada uma; relação com o formato escolhido em PA-01.
- **Critérios do manifesto:** o manifesto não cita critérios específicos para este ponto, apenas que ficam para investigação posterior. Os critérios devem ser propostos em RFC, com referência aos listados em PA-01.
- **Status:** aberta.

## PA-03 Ferramentas

- **Pergunta:** que ferramentas de teste, análise e execução serão usadas ou integradas?
- **Por que importa:** afeta a eficácia da avaliação de testes (seção 9), a execução isolada (seção 15) e a portabilidade.
- **O que investigar:** ferramentas existentes para cada categoria de verificação da seção 8; custo de integração; riscos de depender delas como parte do conjunto confiável.
- **Critérios do manifesto:** não citados. Propor em RFC.
- **Status:** aberta.

## PA-04 Arquitetura interna

- **Pergunta:** como o produto será organizado internamente, incluindo onde ficam as políticas, as referências aprovadas, as evidências e o executor?
- **Por que importa:** a seção 15 exige que políticas, referências, verificações e evidências estejam protegidas contra escrita não autorizada e que o código candidato não receba credenciais capazes de alterá-las. O desenho de arquitetura determina se isso é possível.
- **O que investigar:** onde ficam os limites de confiança descritos em [modelo-de-ameacas.md](especificacao/modelo-de-ameacas.md); como vincular resultados à versão exata do código, configuração, ambiente e artefato.
- **Critérios do manifesto:** isolamento e proteção de políticas (seção 28, pelo mesmo conjunto de PA-01).
- **Status:** aberta.

## PA-05 Distribuição

- **Pergunta:** como o produto será entregue a quem o usa?
- **Por que importa:** afeta facilidade de uso, portabilidade e custo, e a cadeia de suprimentos do próprio projeto.
- **O que investigar:** canais de distribuição compatíveis com o formato escolhido; como garantir que uma atualização não enfraquece proteções silenciosamente (seção 23).
- **Critérios do manifesto:** facilidade de uso, portabilidade e custo (seção 28, no conjunto de PA-01).
- **Status:** aberta.

## PA-06 Interfaces

- **Pergunta:** que interfaces o produto terá (linha de comando, conversa com agente, integração com editor, painel, outras)?
- **Por que importa:** a seção 19 pede uma experiência compreensível para quem não conhece sintaxe de testes ou infraestrutura, com explicações em linguagem humana e detalhes técnicos expansíveis.
- **O que investigar:** como cada interface atende ao público da seção 3; como exibe o modo ativo e as proteções realmente ativadas.
- **Critérios do manifesto:** facilidade de uso (seção 28, no conjunto de PA-01) e os requisitos da seção 19.
- **Status:** aberta.

## PA-07 Modelos

- **Pergunta:** se e como modelos de linguagem participarão do produto, e quais.
- **Por que importa:** a seção 13 exige minimizar o envio de código e dados a modelos ou serviços externos, só com consentimento e configuração explícita, informando retenção e destinos. A seção 14 diz que votos de vários modelos não substituem execução real e a decisão deve se basear em políticas e evidências, não em nota subjetiva de IA (seção 17). O princípio P-10 exige neutralidade quanto ao agente que escreveu o código.
- **O que investigar:** papel permitido a modelos (por exemplo, propor, nunca decidir); como evitar dependência de fornecedor; privacidade.
- **Critérios do manifesto:** neutralidade, privilégio mínimo e privacidade (seções 4 e 13).
- **Status:** aberta.

## PA-08 Estratégia de integração

- **Pergunta:** como o produto se integrará a agentes, editores, repositórios e esteiras de publicação?
- **Por que importa:** a autoridade de bloqueio do modo protegido depende de integração efetiva com o ponto de publicação (seção 16). A seção 26 cita "integração com diferentes ambientes de desenvolvimento".
- **O que investigar:** pontos de integração que permitem bloquear de fato; o que muda entre modo consultivo e modo protegido em cada integração.
- **Critérios do manifesto:** neutralidade (P-10) e o conjunto de PA-01.
- **Status:** aberta.

## PA-09 Licença definitiva

- **Pergunta:** qual licença o projeto usará de forma definitiva?
- **Por que importa:** o manifesto define que o projeto é open source e deixa o licenciamento específico para investigação posterior (seção 28). A MIT foi adotada de forma provisória em [ADR-0002](adr/0002-licenca-mit-provisoria-e-dco.md) e exige revisão antes da primeira versão que contenha código.
- **O que investigar:** concessão expressa de patentes (Apache-2.0); consistência com os outros projetos open source publicados em github.com/Efer-Eder, que usam MIT; efeito de trocar de licença depois de haver contribuições externas.
- **Critérios do manifesto:** o manifesto exige apenas que seja open source.
- **Status:** aberta (licença provisória em vigor).

## PA-10 Nome definitivo

- **Pergunta:** o projeto manterá o nome VibeGuard ou adotará outro?
- **Decisão:** decidida em 2026-11-27, ver [ADR-0004](adr/0004-nome-do-projeto-contraprova.md). O projeto passou a se chamar Contraprova. A pesquisa dos conflitos do nome antigo e da disponibilidade dos candidatos está em [nome-e-projetos-semelhantes.md](pesquisa/nome-e-projetos-semelhantes.md).
- **O que continua pendente:** busca em bases de marcas (INPI, WIPO) e de domínios. Nomes livres hoje nos registros de pacotes não estão reservados.
- **Critérios do manifesto:** o manifesto não cita critérios para o nome. Os critérios usados (expressar a ideia central, estar livre nos registros de pacotes conferidos) são os do [ADR-0004](adr/0004-nome-do-projeto-contraprova.md).
- **Status:** decidida em 2026-11-27; busca de marcas pendente.

## PA-11 Metas numéricas

- **Pergunta:** quais metas numéricas de detecção, falsos positivos, tempo e custo o produto terá?
- **Por que importa:** a seção 25 lista o que medir, mas diz que metas numéricas devem ser definidas após experimentos com projetos representativos, não inventadas antecipadamente. A seção 25 também alerta para não otimizar quantidade de testes ou pontuações em detrimento da capacidade real de detectar problemas.
- **O que investigar:** que projetos são representativos; que experimentos são necessários; como medir sem criar incentivo a métricas vazias.
- **Critérios do manifesto:** metas definidas após experimentos, não antes.
- **Status:** aberta. Nenhum documento deste repositório pode citar meta numérica antes da decisão.

## PA-12 Divulgação de uso de IA pelos mantenedores

- **Pergunta:** a obrigação de divulgar o uso de IA em contribuições vale também para os mantenedores?
- **Decisão:** decidida em 2026-11-27, ver [ADR-0003](adr/0003-politica-de-contribuicoes-assistidas-por-ia.md). A divulgação é obrigatória para contribuições externas (quem não é mantenedor), na descrição do PR e nos formulários de issue. Os mantenedores estão isentos dessa exigência, como na [política do Ghostty](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md), cujas regras valem só para contribuições externas. As demais regras (responsabilidade humana, nada de evidência inventada, agentes sem ação sem aprovação humana, agentes sem `Signed-off-by`) valem para todos, inclusive mantenedores.
- **Critérios do manifesto:** o manifesto não trata disso diretamente; o critério mais próximo é a transparência (P-05).
- **Status:** decidida em 2026-11-27.

## PA-13 Idioma de longo prazo

- **Pergunta:** a documentação continuará em português do Brasil, com o README também em inglês, ou o projeto adotará inglês como idioma principal?
- **Por que importa:** afeta o alcance do projeto e a facilidade de contribuição. [ADR-0001](adr/0001-idioma-da-documentacao-e-dos-commits.md) define o estado atual.
- **O que investigar:** perfil de quem contribui; custo de manter traduções; ferramentas de tradução e de verificação de consistência.
- **Critérios do manifesto:** não citados.
- **Status:** aberta.

## PA-14 Escopo da capacidade de histórico

- **Pergunta:** o que exatamente a capacidade "histórico" da etapa Experiência ampliada abrange?
- **Por que importa:** a seção 26 cita "histórico" sem detalhá-lo. As seções 20 e 23 tratam de registro de execuções e de rastreabilidade de mudanças de política, que podem ser parte dele ou não.
- **O que investigar:** que histórico é necessário para reprodutibilidade (P-12) e para detectar enfraquecimento silencioso.
- **Critérios do manifesto:** P-12 e a seção 23.
- **Status:** aberta.

## PA-15 Etapa das capacidades não listadas na seção 26

- **Pergunta:** a que etapa pertencem a detecção de alucinações (seção 11), a segurança e privacidade (seção 13), a adoção gradual em projetos legados (seção 22), a autofiscalização (seção 23), a decisão por política (seção 17) e a distinção entre modos consultivo e protegido (seção 16)?
- **Por que importa:** o manifesto descreve essas capacidades no corpo, mas a seção 26 não as atribui a nenhuma das quatro etapas. Veja [capacidades.md](especificacao/capacidades.md).
- **O que investigar:** a dependência entre elas e as capacidades das etapas existentes.
- **Critérios do manifesto:** a seção 26 diz que as etapas descrevem capacidades, não tecnologias nem prazos.
- **Status:** aberta.

## Ambiguidades do manifesto registradas na especificação

Pontos em que o manifesto não permite uma única leitura. Foram tratados do modo mais conservador, sem acrescentar conteúdo:

- A seção 26 não atribui etapa às capacidades da lista acima (PA-15).
- "Histórico" não é detalhado (PA-14).
- O manifesto não define quem é "pessoa autorizada" para exceções (seção 17), nem a validade padrão.
- Os identificadores `CAP-xx` e os vínculos entre cenários, princípios e capacidades são editoriais.
