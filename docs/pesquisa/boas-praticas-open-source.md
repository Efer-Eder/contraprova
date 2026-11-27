# Boas práticas de open source: pesquisa de 2026-11-27

Fontes lidas em 2026-11-27. Para cada tema: o que a fonte afirma, o que foi adotado no Contraprova e onde, e o que não pôde ser confirmado.

## Fundamentos de um projeto open source

Fontes: [Starting an Open Source Project](https://opensource.guide/starting-a-project/), [Best Practices for Maintainers](https://opensource.guide/best-practices/), [Leadership and Governance](https://opensource.guide/leadership-and-governance/), [Building Welcoming Communities](https://opensource.guide/building-community/).

O que as fontes afirmam:

- Todo projeto precisa de licença, README, CONTRIBUTING e código de conduta.
- O nome deve ser livre de conflito, com checagem de marca.
- É preciso documentar a visão, como as contribuições são avaliadas e o tempo de resposta.
- A comunicação deve ser pública.
- Há modelos de governança: BDFL, meritocracia e contribuição liberal.
- Rótulos como `good first issue` ajudam quem chega.

Adotado:

- Licença, README, CONTRIBUTING e código de conduta existem na raiz do projeto (veja [README da documentação](../README.md)).
- Governança no estilo BDFL, com o mantenedor decidindo, descrita em `GOVERNANCE.md`, e discussão pública via RFC ([rfcs](../rfcs/README.md)).
- Visão e escopo documentados em [manifesto](../manifesto.md) e [não objetivos](../especificacao/nao-objetivos.md).
- Rótulo `good first issue` reservado a quem está aprendendo ([ADR-0003](../adr/0003-politica-de-contribuicoes-assistidas-por-ia.md)).
- Conflitos de nome investigados: [nome-e-projetos-semelhantes.md](nome-e-projetos-semelhantes.md).

O tempo de resposta está definido em `CONTRIBUTING.md`: 7 dias como objetivo, não como promessa.

## Arquivos de saúde da comunidade

Fonte: [Creating a default community health file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file).

A fonte indica que o GitHub reconhece arquivos de saúde da comunidade na pasta `.github`, na raiz e em `docs`. Adotado: arquivos de contribuição, segurança e governança na raiz; documentação em `docs/`.

## Contributor Covenant

Fontes: [Contributor Covenant 3.0](https://www.contributor-covenant.org/version/3/0/code_of_conduct/) e [traduções](https://www.contributor-covenant.org/translations/).

A versão 3.0 existe, mas não tem tradução oficial para pt-BR; a 2.1 tem. Adotado: Contributor Covenant 2.1 em pt-BR. Reavaliar quando houver tradução oficial da 3.0.

## Instruções para agentes

Fontes: [agents.md](https://agents.md/), [memória do Claude Code](https://code.claude.com/docs/en/memory), [instruções de repositório do GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions), [Gemini CLI](https://geminicli.com/docs/cli/gemini-md/).

O que as fontes afirmam:

- `AGENTS.md` é Markdown simples, sem campos obrigatórios, descrito como um README para agentes, mantido pela Agentic AI Foundation sob a Linux Foundation. Seções comuns: visão do projeto, comandos de build e teste, estilo, testes, segurança, diretrizes de commit e PR. O arquivo mais próximo na árvore tem precedência, e o pedido explícito do usuário prevalece sobre tudo.
- O Claude Code lê `AGENTS.md` apenas quando não há `CLAUDE.md`. A documentação recomenda um `CLAUDE.md` contendo `@AGENTS.md` (no Windows, importar em vez de usar link simbólico) e um alvo de menos de 200 linhas por arquivo.
- O agente em nuvem e a revisão de código do GitHub Copilot leem `AGENTS.md` (o mais próximo prevalece), além de `.github/copilot-instructions.md` e de `.github/instructions/*.instructions.md` com `applyTo`.
- No Gemini CLI, `context.fileName` em `.gemini/settings.json` aceita `AGENTS.md`.

Adotado: [ADR-0006](../adr/0006-agents-md-como-fonte-unica-para-agentes.md). Em 2026-11-27 a documentação oficial de cada ferramenta foi conferida individualmente (inclusive Codex, Cursor, Copilot fora do VS Code, Zed e Antigravity). O resultado, com a situação de cada uma e as fontes, está na [matriz de compatibilidade](../agentes/compatibilidade.md).

Não confirmado: o que a matriz marca como não confirmado (por exemplo Codex cloud, Cursor Cloud Agents, Cline e Trae). Os [prompts iniciais](../agentes/prompts-iniciais.md) continuam neutros de fornecedor para quem usa uma ferramenta fora da matriz.

## Políticas de contribuição assistida por IA

Fontes: [LLVM](https://llvm.org/docs/AIToolPolicy.html), [Ghostty](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md), [Kernel Linux, assistentes de código](https://docs.kernel.org/process/coding-assistants.html), [Kernel Linux, conteúdo gerado](https://docs.kernel.org/process/generated-content.html), [estudo com 1.000 repositórios](https://arxiv.org/abs/2605.16706).

O que as fontes afirmam:

- LLVM: ferramentas são permitidas com humano no circuito; o contribuidor é o autor e responde por tudo; conteúdo substancialmente gerado deve ser rotulado (por exemplo, com o trailer `Assisted-by:`); agentes que agem sem aprovação humana são proibidos; é proibido usar IA para resolver `good first issue`; contribuições "extrativas" podem ser fechadas.
- Ghostty: todo uso de IA deve ser divulgado, com a ferramenta e a extensão; o humano precisa entender todo o código; as regras valem para contribuições externas.
- Kernel Linux: o humano revisa, assume a responsabilidade e assina; agentes não adicionam `Signed-off-by`; o assistente nunca envia nada por conta própria; quem submete deve entender e defender tudo; mantenedores podem rejeitar sem revisão detalhada.
- Estudo de Hora e Robbes (ICSME 2026) com 1.000 repositórios populares: encontrou 118 políticas de IA; 78% permitem, 51% exigem divulgação e 74% exigem humano no circuito.

Adotado: [ADR-0003](../adr/0003-politica-de-contribuicoes-assistidas-por-ia.md) e o [guia para agentes](../agentes/README.md). Divulgação na descrição do PR e nos formulários de issue, só para contribuições externas; agentes não abrem PR, issue nem comentário sem aprovação humana; agentes não adicionam `Signed-off-by`; `good first issue` reservado a quem aprende; fechamento sem revisão detalhada de contribuição não revisada pela autora.

Não verificado: a política do Fedora não pôde ser lida (acesso bloqueado) e por isso não é citada como fonte em nenhum documento. A isenção dos mantenedores segue a política do Ghostty, cujas regras valem só para contribuições externas ([PA-12](../perguntas-em-aberto.md), decidida em 2026-11-27). Não foi adotado o trailer `Assisted-by:`; o campo de divulgação fica na descrição do PR. Reavaliar se a prática se consolidar.

## Origem das contribuições

Fontes: [Developer Certificate of Origin 1.1](https://developercertificate.org/), [comparação entre DCO e CLA](https://bestpractices.linuxfoundation.org/ip/contribution-mechanisms.html).

Adotado: DCO 1.1 com `Signed-off-by`, sem CLA ([ADR-0002](../adr/0002-licenca-mit-provisoria-e-dco.md)). A licença MIT é provisória e exige revisão antes da primeira versão que contenha código ([PA-09](../perguntas-em-aberto.md)).

## Segurança do repositório e dos fluxos de trabalho

Fontes: [OpenSSF Scorecard, checks](https://github.com/ossf/scorecard/blob/main/docs/checks.md), [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions), [OSPS Baseline](https://baseline.openssf.org/), [OpenSSF Best Practices Badge](https://www.bestpractices.dev/en/criteria/0).

O que as fontes afirmam:

- O Scorecard tem 20 verificações. As relevantes desde já: Token-Permissions, Pinned-Dependencies, Dangerous-Workflow, Branch-Protection, Security-Policy, License, Dependency-Update-Tool e Binary-Artifacts.
- O endurecimento do GitHub Actions recomenda token somente leitura por padrão, actions fixadas por SHA completo, não interpolar entrada não confiável em `run:`, evitar `pull_request_target` e usar CODEOWNERS para workflows.
- A versão v2026.08.28 do OSPS Baseline, nível 1, inclui: MFA, impedir commit direto na branch principal, não ter segredos no VCS, contatos de segurança, processo de contribuição documentado, mecanismo público de discussão, licença em local padrão e ausência de binários.
- O selo de boas práticas do OpenSSF tem critérios de nível "passing".

Adotado: configuração do repositório e dos workflows em `.github/` e política de segurança na raiz. Esta pasta de documentação não afirma que o repositório atinge qualquer nível do Scorecard, do Baseline ou do selo.

Não verificado: nenhuma pontuação do Scorecard foi calculada e nenhum critério do selo foi avaliado. Ambos dependem do repositório estar publicado e configurado.

## Documentação, mensagens de commit, changelog e versões

Fontes: [Diátaxis](https://diataxis.fr/), [MADR 4.0.0](https://adr.github.io/madr/), [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), [Versionamento Semântico 2.0.0](https://semver.org/).

Adotado:

- Diátaxis organiza o índice em [README.md](../README.md) em tutoriais, guias práticos, referência e explicação, com honestidade sobre os quadrantes vazios.
- MADR 4.0.0 para ADRs ([adr](../adr/README.md)).
- Conventional Commits 1.0.0 para commits ([ADR-0001](../adr/0001-idioma-da-documentacao-e-dos-commits.md)).
- Keep a Changelog 1.1.0 para o `CHANGELOG.md` da raiz ([ADR-0007](../adr/0007-versionamento-semantico-e-changelog.md)).
- SemVer 2.0.0: a fonte indica que versões `0.y.z` correspondem a desenvolvimento inicial. Como só existe especificação, qualquer versão numerada será `0.y.z`, e nenhuma é publicada enquanto não houver produto ([ADR-0007](../adr/0007-versionamento-semantico-e-changelog.md)).

Não confirmado: o que uma "versão" significaria para um projeto que só tem documentação. Por isso nenhuma versão é publicada agora.
