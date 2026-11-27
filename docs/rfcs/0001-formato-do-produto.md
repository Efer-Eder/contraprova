---
status: "em discussão"
date: 2026-11-27
author: Efer Eder
pa: PA-01
---

# RFC 0001: formato do produto

## Resumo

Propomos que o Contraprova seja uma combinação em camadas com um núcleo único, e que a autoridade de cada camada seja declarada, nunca presumida. O núcleo é um motor: um programa independente de linha de comando que executa as verificações reais e produz o relatório de evidências. Em volta dele ficam três camadas que só o acionam: a integração com a esteira de publicação, uma camada de conversa (skill no padrão aberto Agent Skills e, como possibilidade a avaliar, um servidor MCP) e hooks de agente como reforço local opcional.

Propomos também três níveis de autoridade, com nomes e divisão definidos por esta RFC: consultivo local, consultivo na esteira e protegido. O produto deve exibir sempre o nível realmente ativo, descoberto por inspeção da configuração, e nunca o nível pretendido.

Esta RFC está em discussão pública (issue #5). Tudo o que está nela é proposta: nada disso existe, nada foi decidido, e não há prazo. Não altera o [manifesto](../manifesto.md).

## Motivação

A [PA-01](../perguntas-em-aberto.md) pergunta se o produto será uma skill, um agente, um programa independente, uma integração, um serviço ou uma combinação. O formato decide se há execução real, isolamento, proteção de políticas e, portanto, se existe bloqueio técnico ou só orientação. A seção 28 do manifesto afirma que uma skill baseada apenas em instruções pode orientar agentes, mas não constitui por si só um bloqueio técnico, e que qualquer formato precisa declarar seus limites de autoridade. A seção 26 pede que uma versão consultiva não seja anunciada como proteção inviolável.

Pela [ADR-0005](../adr/0005-documentacao-antes-do-codigo.md), nenhum código começa antes de as perguntas de formato (PA-01 a PA-08) serem respondidas por RFC aceita. Esta é a primeira RFC do projeto e trata só do formato. Ela delimita, sem fechar, as perguntas vizinhas, como descrito na seção "Relação com as outras perguntas".

O argumento central é simples. Cada formato isolado resolve uma parte do problema e falha em outra: uma skill conversa bem, mas o agente decide se a segue; um hook bloqueia, mas quem controla a máquina o desliga; um check na esteira barra o merge, mas pode ser alterado pela própria mudança que avalia. A pergunta útil não é qual formato escolher, e sim qual autoridade cada formato realmente tem, e como dizer isso a quem usa.

## Princípios do manifesto afetados

- **P-03 Independência** e **CAP-12 Políticas protegidas**: tensionados. O desenho dos níveis existe para deixar explícito onde quem implementa ainda controla o critério de aprovação.
- **P-04 Falha segura**: reforçado. Verificação ausente, interrompida ou inconclusiva não equivale a sucesso em nenhuma camada. Hooks que falham abertos são tratados como risco declarado.
- **P-05 Transparência** e **CAP-26 Distinção e exibição do modo consultivo e do modo protegido**: reforçados. O nível ativo é exibido sempre, e a [CA-14](../especificacao/criterios-de-aceitacao.md) (ambiente sem autoridade de bloqueio) é o cenário correspondente.
- **P-09 Privilégio mínimo** e **CAP-13 Isolamento**: reforçados. O código candidato roda sem credenciais capazes de alterar política, referência e evidências.
- **P-10 Neutralidade**: reforçado. O motor não depende do agente que escreveu o código nem de uma ferramenta de agente específica; os adaptadores são opcionais.
- **P-12 Reprodutibilidade** e **CAP-15 Vinculação da aprovação ao artefato**: tocados. Evidências ligadas ao commit e, quando houver artefato, ao digest.
- **CAP-04 Execução real**, **CAP-06 Relatórios de evidências**, **CAP-14 Verificação da esteira de publicação**, **CAP-18 Explicações acessíveis**, **CAP-20 Integração com diferentes ambientes de desenvolvimento** e **CAP-25 Decisão de qualidade por política**: a proposta distribui essas capacidades entre as camadas.
- **Seção 27 do manifesto** (ver [não objetivos](../especificacao/nao-objetivos.md)): a proposta exclui um agente de programação próprio e um painel, para não contrariar a leitura de que o produto não é apenas isso.

## Proposta detalhada

### As quatro camadas

1. **Motor.** Programa independente de linha de comando que executa as verificações reais e produz o relatório de evidências (CAP-04, CAP-06). É o mesmo programa na máquina de quem desenvolve e na esteira. É a única camada que produz evidência: as demais só o acionam e explicam o resultado. Não exige serviço hospedado e, por padrão, não envia código para fora (seção 13 do manifesto).
2. **Integração com a esteira de publicação.** O motor roda como verificação obrigatória no repositório. É a única camada onde pode existir modo protegido. O primeiro alvo proposto é o GitHub, onde o próprio projeto está; o desenho deve ser portável, e o GitLab tem recursos equivalentes, com custo de plano (ver abaixo).
3. **Camada de conversa.** Uma skill no padrão aberto [Agent Skills](https://agentskills.io/specification) (lido em 2026-11-27) e, como possibilidade a avaliar, um servidor MCP, para que a pessoa peça ao próprio agente "investigar meu projeto", "verificar se esta funcionalidade funciona" ou "explicar por que foi bloqueado" (seção 19). Essa camada só orienta: é consultiva por definição.
4. **Hooks do agente.** Reforço local opcional, por adaptador de ferramenta, declarado como contornável.

Não fazem parte desta proposta: um agente de programação próprio, um serviço hospedado obrigatório e um painel.

### O que cada camada pode e não pode

**Skill.** A [especificação do Agent Skills](https://agentskills.io/specification) prevê um diretório `scripts/` com código que o agente pode executar. Segundo a [documentação de skills do Claude Code](https://code.claude.com/docs/en/skills) (ambas lidas em 2026-11-27), só o nome e a descrição são carregados no início e o corpo entra quando o agente decide ativar a skill. Nenhuma das duas páginas afirma que o agente é obrigado a seguir a skill. Logo, a skill é boa para conversar e para chamar o motor, e não é, por si só, uma barreira. Isso é coerente com a seção 28 do manifesto.

**Servidor MCP.** Segundo a [especificação do MCP, seção de ferramentas](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) e a [visão de arquitetura](https://modelcontextprotocol.io/docs/learn/architecture) (lidas em 2026-11-27), as ferramentas são controladas pelo modelo, que decide chamá-las, e nenhuma primitiva dá ao servidor veto sobre ações que ocorrem fora dele. Um servidor MCP seria, portanto, outra forma de acionar o motor, também consultiva. Não está claro que ele traga algo além da skill (ver perguntas não resolvidas).

**Hooks de agente.** A situação varia por ferramenta, e o que segue é só o que a documentação afirma. Nenhuma ferramenta foi executada para esta RFC.

| Ferramenta | O que a documentação afirma (lida em 2026-11-27) | Fonte |
|---|---|---|
| Claude Code | `PreToolUse` bloqueia (saída 2 ou decisão de negar). Hook que falha ou estoura o tempo deixa a ação seguir, salvo configuração explícita. O usuário desativa com `disableAllHooks`. A configuração gerenciada fica acima da de usuário e de projeto, mas um administrador local da máquina consegue editá-la. | [hooks](https://code.claude.com/docs/en/hooks), [configuração gerenciada](https://code.claude.com/docs/en/managed-settings) |
| Codex | Os hooks negam chamadas, mas a documentação manda tratá-los como proteção útil e não como fronteira completa de imposição. Há configuração gerenciada que o usuário não sobrescreve. | [hooks](https://learn.chatgpt.com/docs/hooks), [configuração gerenciada](https://learn.chatgpt.com/docs/enterprise/managed-configuration) |
| Cursor | Os hooks bloqueiam. Um erro deixa passar, salvo `failClosed: true`. Hooks de projeto ficam no repositório. | [hooks](https://cursor.com/docs/agent/hooks) |
| GitHub Copilot | `preToolUse` nega. O estouro de tempo deixa passar. | [configuração de hooks](https://docs.github.com/en/copilot/reference/hooks-configuration) |
| Gemini CLI | `BeforeTool` bloqueia. O usuário desativa todos os hooks. | [hooks](https://geminicli.com/docs/hooks/) |
| Antigravity | `PreToolUse` nega. O comportamento em falha e o nível administrado não foram confirmados. | [hooks](https://antigravity.google/docs/hooks.md) |
| Windsurf | Não confirmado. | Sem fonte |

Em todas, o ponto comum é o mesmo: o hook é um reforço que quem controla a máquina ou a configuração consegue desligar, e muitos falham abertos por padrão. Por inferência nossa, hooks de projeto que ficam versionados no repositório (caso do Cursor) ficam ao alcance de quem altera o repositório. Por isso os hooks entram como adaptador opcional e declarado como contornável, nunca como fundamento de proteção.

**Sandbox local.** No Claude Code, segundo a [documentação de sandboxing](https://code.claude.com/docs/en/sandboxing) (lida em 2026-11-27), o sandbox vem desligado por padrão, não tem suporte em Windows nativo e cobre só comandos de shell. No Codex há sandbox, com uma opção que remove aprovações e sandbox, segundo a [página de aprovações e segurança](https://learn.chatgpt.com/docs/agent-approvals-security) (lida em 2026-11-27). O isolamento de código não confiável não pode, portanto, depender do sandbox do agente.

**Git hooks locais.** Segundo a [documentação de githooks](https://git-scm.com/docs/githooks) e a de [git push](https://git-scm.com/docs/git-push) (lidas em 2026-11-27), `pre-commit` e `pre-push` são pulados com `--no-verify`; só o `pre-receive`, que roda no servidor, não é pulado pelo cliente. Hooks de git no cliente são conveniência, não proteção.

### Níveis de autoridade

Os nomes e a divisão abaixo são proposta desta RFC. Derivam dos modos consultivo e protegido das seções 16 e 17 do manifesto (ver [estados de decisão](../especificacao/estados-de-decisao.md)) e não alteram o manifesto: o manifesto distingue dois modos, e a RFC propõe subdividir o consultivo em dois níveis, porque a diferença entre eles é grande e o produto deve dizê-la.

**Nível 1: consultivo local.** O motor roda na máquina, acionado pela pessoa, pela skill ou por um hook. Quem controla a máquina o desliga. Recomenda, não impede.

**Nível 2: consultivo na esteira.** O motor é um check obrigatório definido por um workflow dentro do próprio repositório avaliado. Isso barra o merge por descuido, mas tem limites que vêm da plataforma:

- Segundo a [documentação de gatilhos de eventos](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) (lida em 2026-11-27), o gatilho `pull_request` executa o workflow como o PR o deixou. Um PR pode, portanto, alterar o próprio workflow que o verifica. Em forks, o `pull_request` roda sem segredos e com token só de leitura. O `pull_request_target` roda no contexto da branch padrão, com segredos, e a documentação avisa para não fazer checkout de código do PR nele.
- Segundo o [guia de uso seguro](https://docs.github.com/en/actions/reference/security/secure-use) (lido em 2026-11-27), quem tem escrita no repositório lê os segredos do repositório. Um PR de branch interna, que é o caso típico de um agente com acesso de escrita, não tem a proteção que existe para forks.
- A lista de bypass de um ruleset aceita papéis, times e Apps, segundo a [documentação de criação de rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository) (lida em 2026-11-27). Quem está na lista, ou administra o repositório, contorna.

Por isso, a classificação proposta é: **este nível deve ser exibido como consultivo, não como protegido**, a menos que as mudanças nos arquivos de controle (workflow, configuração do ruleset, política) exijam revisão humana independente. Essa classificação é inferência nossa a partir da documentação citada, não afirmação da documentação.

**Nível 3: protegido.** O verificador, a política e a referência aprovada vêm de fora da mudança avaliada, e o check exigido tem a fonte esperada fixada. Caminhos documentados, que podem ser combinados:

- **Fonte esperada do check fixada em um GitHub App.** Ao exigir um check, é possível escolher um App como fonte esperada. Com "qualquer fonte", outra integração com escrita pode publicar o mesmo nome de check. Segundo a [documentação de regras de rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) (lida em 2026-11-27). Só GitHub Apps criam check runs, segundo a [API de Checks](https://docs.github.com/en/rest/checks/runs) (lida em 2026-11-27).
- **Workflow exigido por ruleset, vindo de outro repositório.** O arquivo vem de um repositório fonte indicado, em nível de organização ou enterprise, segundo a [mesma documentação de regras, na versão Enterprise Cloud](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) (lida em 2026-11-27). O plano exato necessário não foi confirmado.
- **Environment com revisores ou regra de proteção de deploy** para barrar a publicação. Há revisores obrigatórios e regras de proteção por App, que aprovam ou rejeitam; administradores contornam por padrão, e isso pode ser desligado; nos planos Free, Pro e Team, só em repositório público. Segundo a [documentação de deployments e environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) e a de [regras de proteção personalizadas](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/create-custom-protection-rules) (lidas em 2026-11-27).
- **Aprovação vinculada ao digest do artefato por atestação.** Atestações ligam um artefato e seu digest a uma proveniência assinada; não bloqueiam nada por si, só provam origem, e a documentação diz que não garantem que o artefato é seguro. `gh attestation verify` confere. Segundo a [documentação de atestações de artefatos](https://docs.github.com/en/actions/concepts/security/artifact-attestations) e o [manual do `gh attestation verify`](https://cli.github.com/manual/gh_attestation_verify) (lidos em 2026-11-27).

Mesmo no nível protegido, quem administra o repositório ou a organização pode remover a proteção. O produto deve dizer isso (seção 15 do manifesto) e, quando possível, detectar a mudança. Se o agente tem controle administrativo sobre a máquina, as contas e a publicação, nenhum formato garante a proteção (ver [modelo de ameaças](../especificacao/modelo-de-ameacas.md)).

**Regra de exibição.** O produto exibe sempre o nível realmente ativo, descoberto por inspeção da configuração (por exemplo, se o check exigido tem fonte fixada, se há bypass, se os arquivos de controle exigem revisão), e nunca o nível pretendido (seções 16 e 19; cenário [CA-14](../especificacao/criterios-de-aceitacao.md), "ambiente sem autoridade de bloqueio"). Uma integração não configurada não é apresentada como proteção ativa.

### Onde ficam política, referência e evidências

Esta seção delimita a [PA-04](../perguntas-em-aberto.md) sem fechá-la. É um princípio, não uma implementação.

- No nível protegido, a política e a referência aprovada ficam em local que a branch avaliada não consegue escrever: branch protegida ou repositório separado.
- O código candidato roda sem credenciais capazes de alterar política, referência e evidências (seção 15 do manifesto).
- A execução do código candidato é separada da avaliação da política: o job que roda código não confiável não tem segredos, e o que avalia a política não executa código do PR.
- As evidências são vinculadas ao commit e, quando houver artefato, ao digest.

Formatos abertos candidatos, a investigar em RFC própria e sem decisão aqui: atestações [in-toto](https://github.com/in-toto/attestation/tree/main/spec/predicates) e o [SLSA Verification Summary Attestation](https://slsa.dev/spec/v1.2/verification_summary) (sujeito com digest, verificador, política e resultado) para a decisão vinculada ao digest; [SARIF 2.1.0](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html) e [JUnit XML](https://github.com/testmoapp/junitxml) como entradas. O JUnit XML é um formato de fato, sem especificação oficial. Todas as páginas foram lidas em 2026-11-27.

### Ordem de construção proposta

Sem prazos, e ligada às etapas da seção 26 do manifesto:

1. **Fundação:** o motor com a camada de conversa mínima, no nível consultivo local.
2. Integração com a esteira no nível consultivo (nível 2).
3. **Proteção efetiva:** o nível protegido, que provavelmente exige um GitHub App e, portanto, alguma infraestrutura, com custo a avaliar.
4. Hooks entram como adaptadores quando o motor existir.

Uma versão consultiva não será anunciada como proteção (seção 26). Em particular, o nível 2 nunca é apresentado como o nível 3.

### Relação com as outras perguntas

- **Fecha a [PA-01](../perguntas-em-aberto.md)**, se a RFC for aceita.
- **Delimita, sem fechar, a PA-04, a PA-06 e a PA-08**, só no que o formato obriga. PA-04: o princípio de separar política, referência e evidências do que é avaliado (seção anterior). PA-06: o formato impõe ao menos linha de comando e conversa com agente, e dispensa painel; o desenho das interfaces continua em aberto. PA-08: o formato impõe a esteira como ponto de integração para o modo protegido, e o GitHub como primeiro alvo proposto; as demais integrações continuam em aberto.
- **Não trata a PA-02 (linguagens).**
- **Não trata a PA-03 (ferramentas)**, salvo o princípio de orquestrar ferramentas maduras em vez de reimplementá-las. Como exemplos de que existem ferramentas de teste de mutação para várias linguagens (lidos em 2026-11-27): [Stryker](https://stryker-mutator.io/) (JavaScript e TypeScript, C# e Scala; Apache-2.0), [mutmut](https://github.com/boxed/mutmut) (Python; BSD-3-Clause), [PIT](https://github.com/hcoles/pitest) (Java e JVM; Apache-2.0) e [cargo-mutants](https://github.com/sourcefrog/cargo-mutants) (Rust; MIT). A citação é só de existência; avaliar, escolher ou integrar qualquer uma é assunto da PA-03.
- **Não trata a PA-05 (distribuição).**
- **Não trata a PA-07 (modelos)**, salvo o que o manifesto já fixa: modelos podem propor, e a decisão vem de política e evidência (seções 14 e 17).

### Avaliação contra os critérios da seção 28

A seção 28 do manifesto pede que a escolha considere seis critérios: execução de verificações reais, isolamento, proteção de políticas, facilidade de uso, portabilidade e custo. A tabela abaixo é uma avaliação qualitativa nossa, baseada nos fatos citados nesta RFC. Não é medição, e não há valores numéricos (ver [PA-11](../perguntas-em-aberto.md)). "Depende" quer dizer que o critério depende de outra camada ou de escolha ainda aberta.

| Alternativa | Verificações reais | Isolamento | Proteção de políticas | Facilidade de uso | Portabilidade | Custo |
|---|---|---|---|---|---|---|
| Combinação em camadas (proposta) | Sim, no motor | Possível na esteira, não no local | Só no nível protegido | Boa, pela conversa | Boa no motor, limitada nas integrações | Maior, por manter camadas e, no nível 3, um App |
| Só skill | Só se chamar scripts, e o agente decide | Nenhum | Nenhuma | Boa | Boa entre agentes | Baixo |
| Só hooks de agente | Pode chamar o motor, mas não o inclui | Nenhum | Contornável | Média | Ruim, varia por ferramenta | Médio, por adaptador |
| Só servidor MCP | Só se o modelo chamar | Nenhum | Nenhuma | Boa | Média | Médio |
| Só linha de comando com hooks de git | Sim | Nenhum local | Contornável com `--no-verify` | Média | Boa | Baixo |
| Só check na esteira, sem uso local | Sim | Possível | Nível 2 ou 3, conforme configuração | Pior, feedback tardio | Média | Baixo a médio |
| Serviço hospedado ou App como primeira entrega | Sim | Possível | Possível | Boa depois de configurado | Presa à plataforma | Alto, com operação contínua |
| Agente verificador autônomo próprio | Depende do que executa | Depende | Depende | Média | Média | Alto |
| Não fazer nada | Nenhuma | Nenhum | Nenhuma | Não se aplica | Não se aplica | Nenhum, mas o problema da seção 1 fica |

## Alternativas

Cada alternativa abaixo foi considerada e não é proposta como formato único. Os motivos se apoiam nos fatos citados na seção anterior.

- **Só skill.** Não executa verificação por si só e o agente decide se a segue (especificação de skills e documentação de skills do Claude Code). A seção 28 do manifesto já diz que não é bloqueio técnico. Fica como camada de conversa, não como formato.
- **Só hooks de agente.** Dependem da ferramenta, falham abertos por padrão em vários casos e o usuário os desativa. Nem a documentação do Codex os trata como fronteira completa. Ficam como adaptador opcional.
- **Só servidor MCP.** O modelo decide chamar a ferramenta, e o servidor não tem veto sobre ações fora dele. Equivale à skill em autoridade. Fica como possibilidade a avaliar.
- **Só linha de comando local com hooks de git.** Executa verificações reais, mas `pre-commit` e `pre-push` são pulados com `--no-verify`. Só o `pre-receive` não é pulado, e ele roda no servidor, fora do alcance deste projeto como produto local. O motor é aproveitado, e a parte de git hooks fica como conveniência.
- **Só check de CI, sem uso local.** Barra o merge, mas devolve o feedback tarde e sem conversa, o que atende mal o público da seção 3 do manifesto. Está contido na proposta como nível 2.
- **Serviço hospedado ou GitHub App como primeira entrega.** É o caminho mais provável para o nível protegido, mas impõe infraestrutura, operação e custo antes de existir um motor que valha a pena proteger. Também contraria a ideia de não exigir serviço hospedado por padrão. Fica para depois, na ordem de construção.
- **Agente verificador autônomo próprio.** Um agente que decide sozinho concentraria a decisão em um modelo, contra as seções 14 e 17 (a decisão vem de política e evidência), e se aproximaria de um agente de programação, que a seção 27 diz que o projeto não é. Rejeitado.
- **Não fazer nada, só continuar com documentação.** Mantém a honestidade (ADR-0005), mas deixa em aberto a PA-01 e impede qualquer avanço para a Fundação. Aceitável por um tempo, não como destino.

### Projetos existentes de portão pré-merge

Existem projetos que ocupam espaço próximo, e os reconhecemos. O [`dgenio/vibeguard`](https://github.com/dgenio/vibeguard) se descreve, em sua página, como um portão determinístico pré-merge com linha de comando, GitHub Action, pre-commit e Docker, sob Apache-2.0. O [`anthril/vibe-guard`](https://github.com/anthril/vibe-guard) usa hooks do Claude Code e está arquivado. Ambas as páginas foram lidas em 2026-11-27, e o que dizemos aqui é só o que elas afirmam sobre si. Não afirmamos o que esses projetos não fazem. Ver também a [pesquisa sobre nome e projetos semelhantes](../pesquisa/nome-e-projetos-semelhantes.md).

O recorte próprio do Contraprova, segundo o manifesto, é: desconfiar dos testes existentes e provar que eles conseguem falhar (seções 5 e 9); comparar com uma referência aprovada e protegida (seção 10); e declarar a autoridade real em cada ambiente, em vez de pressupô-la (seções 15, 16 e 28). Se esse recorte for suficiente para justificar um projeto separado, ou se faria mais sentido colaborar com um existente, é uma pergunta aberta (ver abaixo).

## Riscos e limites de autoridade

### Riscos da proposta

- **Complexidade de manter camadas.** Quatro camadas e vários adaptadores aumentam a superfície de manutenção e a chance de divergência entre elas. O motor único é a mitigação proposta: as camadas não reimplementam verificação.
- **Dependência de recursos de plataforma e de plano.** Parte do nível protegido depende de recursos cujo plano necessário não foi confirmado (workflow exigido por ruleset) ou que variam por plano e visibilidade do repositório (environments, rulesets, atestações). Isso pode excluir parte do público.
- **Falsa sensação de proteção no nível intermediário.** Um check verde no nível 2 pode ser lido como proteção. A regra de exibição existe para evitar isso, e depende de a inspeção da configuração ser correta.
- **Hooks que falham abertos.** Em várias ferramentas, o erro ou o estouro de tempo deixa a ação passar. Um hook mal configurado parece proteger e não protege.
- **Windows sem sandbox nativo em alguns agentes.** No Claude Code, o sandbox não tem suporte em Windows nativo, o que reduz o isolamento local nesse sistema.
- **Custo de operar um App.** Um GitHub App exige hospedagem, credenciais próprias e responsabilidade operacional, e o App passa a ser ele mesmo um ativo a proteger.

### O que a proposta garante e o que não garante

- No **nível 1**, nada é garantido contra quem controla a máquina. Vale como orientação e como evidência para a pessoa.
- No **nível 2**, garante-se apenas o barramento por descuido. Não garante contra um PR que altera o workflow, contra a lista de bypass nem contra administradores. Por isso é exibido como consultivo.
- No **nível 3**, a proteção vale enquanto a fonte esperada do check, o workflow exigido ou o environment estiverem configurados e não removidos. Administradores do repositório ou da organização podem removê-los. O produto deve informar isso e, quando possível, detectar a mudança, mas não consegue impedi-la.
- **Atestações** provam origem, não segurança.
- Nenhuma camada protege se o agente tem controle administrativo sobre a máquina, as contas e a publicação (seção 15 do manifesto).

### Privacidade e privilégio mínimo

O motor não envia código para fora por padrão (seção 13). A camada de conversa roda dentro do agente que a pessoa já usa, e, por inferência nossa, o que esse agente envia a um modelo é regido pela configuração dele, fora do controle do produto. O job que executa código candidato não recebe segredos (P-09).

## Como será verificado

Hoje não há como verificar nada disto, porque não há implementação. Esta RFC não traz medição nem execução.

A evidência virá dos cenários de autoavaliação da seção 23 do manifesto: projetos deliberadamente defeituosos, projetos corretos e casos ambíguos. A relação com os cenários de [critérios-de-aceitacao.md](../especificacao/criterios-de-aceitacao.md) é a seguinte (ainda "a definir" em todos eles):

- **[CA-08](../especificacao/criterios-de-aceitacao.md), pipeline ignora falha:** um projeto de teste cuja esteira passa mesmo com falha deve ser identificado como sem bloqueio efetivo.
- **[CA-09](../especificacao/criterios-de-aceitacao.md), verificação obrigatória não executada:** o motor ausente ou interrompido na esteira deve resultar em não aprovação, e não em sucesso.
- **[CA-10](../especificacao/criterios-de-aceitacao.md), artefato alterado após aprovação:** uma alteração depois da aprovação deve invalidá-la, o que exige a vinculação ao digest e testa a camada de atestação.
- **[CA-11](../especificacao/criterios-de-aceitacao.md), relatório fabricado por agente:** uma declaração sem evidência independente não é aceita, o que testa que só o motor produz evidência.
- **[CA-14](../especificacao/criterios-de-aceitacao.md), ambiente sem autoridade de bloqueio:** o nível exibido deve ser consultivo quando a configuração não dá autoridade, o que testa a regra de exibição e a inspeção da configuração.
- **[CA-15](../especificacao/criterios-de-aceitacao.md), tentativa de alterar política protegida:** um PR que altera política, workflow ou referência deve ser rejeitado ou detectado conforme o nível, o que testa a separação do nível 3.

Esses cenários exigem projetos de teste e, para o nível 3, um repositório configurado de verdade, o que também não existe. A avaliação dos critérios de custo e facilidade de uso da seção 28 só poderá ser feita depois de protótipos, e sem metas numéricas antes dos experimentos ([PA-11](../perguntas-em-aberto.md)).

## Perguntas não resolvidas

Todas continuam sem resposta. Três delas foram registradas em [perguntas-em-aberto.md](../perguntas-em-aberto.md) como PA-16, PA-17 e PA-18; as demais ficam aqui.

Registradas como perguntas em aberto:

- **Como o produto descobre e exibe o nível de autoridade realmente ativo, e como detecta e avisa a remoção da proteção por um administrador** ([PA-16](../perguntas-em-aberto.md)).
- **Como isolar código não confiável em PR de branch interna**, o caso típico de agente, que não tem a proteção de fork ([PA-17](../perguntas-em-aberto.md)).
- **Quem opera e paga um GitHub App, e qual a infraestrutura mínima do nível protegido** ([PA-18](../perguntas-em-aberto.md)).

Permanecem nesta RFC:

- **Plano necessário para workflow exigido por ruleset.** A documentação consultada indica nível de organização ou enterprise, mas o plano exato não foi confirmado.
- **Disponibilidade, por plano, de rulesets, merge queue e atestações em repositório privado.** Não foi levantada.
- **Se vale ter um servidor MCP além da skill.** Pela documentação lida, ambos são consultivos, e o MCP pode não acrescentar nada além de outra forma de acionar o motor.
- **Suporte a plataformas além do GitHub.** O GitLab tem "Pipelines must succeed" (plano Free), regras de aprovação (Premium e Ultimate) e verificações de status externas (Ultimate), segundo as páginas de [merge automático](https://docs.gitlab.com/user/project/merge_requests/auto_merge/), [regras de aprovação](https://docs.gitlab.com/user/project/merge_requests/approvals/rules/) e [verificações de status](https://docs.gitlab.com/user/project/merge_requests/status_checks/) (lidas em 2026-11-27). O quanto isso equivale aos níveis propostos não foi avaliado.
- **Relação com projetos existentes de portão pré-merge.** Colaborar, integrar-se ou seguir separado não foi avaliado, e a leitura que fizemos deles foi só das páginas iniciais.
- **Comportamento em falha e nível administrado dos hooks do Antigravity e do Windsurf**, não confirmados.
- **Nenhuma das ferramentas citadas foi executada.** Tudo o que se diz delas vem da documentação oficial lida em 2026-11-27, que pode mudar.

## Fontes

Todas lidas em 2026-11-27.

- Agent Skills: <https://agentskills.io/specification>, <https://code.claude.com/docs/en/skills>
- Hooks e configuração gerenciada: <https://code.claude.com/docs/en/hooks>, <https://code.claude.com/docs/en/managed-settings>, <https://learn.chatgpt.com/docs/hooks>, <https://learn.chatgpt.com/docs/enterprise/managed-configuration>, <https://cursor.com/docs/agent/hooks>, <https://docs.github.com/en/copilot/reference/hooks-configuration>, <https://geminicli.com/docs/hooks/>, <https://antigravity.google/docs/hooks.md>
- MCP: <https://modelcontextprotocol.io/specification/2025-06-18/server/tools>, <https://modelcontextprotocol.io/docs/learn/architecture>
- Git: <https://git-scm.com/docs/githooks>, <https://git-scm.com/docs/git-push>
- Sandbox: <https://code.claude.com/docs/en/sandboxing>, <https://learn.chatgpt.com/docs/agent-approvals-security>
- GitHub (rulesets, checks, gatilhos, environments, atestações): as páginas citadas no corpo da RFC.
- SLSA, in-toto, SARIF, JUnit XML: as páginas citadas na seção de política, referência e evidências.
- GitLab: as três páginas citadas nas perguntas não resolvidas.
- Teste de mutação: Stryker, mutmut, PIT e cargo-mutants, citados na seção de relação com as outras perguntas.
- Projetos de portão pré-merge: `dgenio/vibeguard` e `anthril/vibe-guard`, citados na seção de alternativas.
