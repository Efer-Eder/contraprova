# Progresso

## 2026-11-27: repositório público e proteção da main

### O que passou a ser verdade

- Repositório público criado em `github.com/Efer-Eder/contraprova`, com histórico em commits pequenos e licença MIT detectada pelo GitHub.
- Workflows executados no GitHub: `markdownlint`, `links`, `estilo` e `adaptadores` (Docs), `gitleaks` (Secret scan) e Scorecard terminaram verdes no commit `b5b2bb0`.
- Ruleset "Proteger main" ativo: bloqueia exclusão e push forçado, exige PR (0 aprovações, há um só mantenedor) e os checks `markdownlint`, `links`, `estilo`, `adaptadores` e `gitleaks`.
- Relato privado de vulnerabilidades, alertas do Dependabot, secret scanning com push protection e Discussions ativos; wiki desativada; só squash merge, com exclusão automática da branch.
- Rótulos de `.github/labels.yml` criados no repositório; os padrão do GitHub foram removidos.

### Falhas encontradas e corrigidas

- A primeira execução do `gitleaks` falhou porque o evento de push inicial não tinha commit anterior para montar o intervalo; a execução seguinte passou. Não foi alterada nenhuma regra.
- O `links` falhou com 504 do github.com em três URLs que respondem 200 por `curl`. Aumentei as tentativas e passei o `GITHUB_TOKEN`; como o erro persistiu só na CI, excluí em `lychee.toml` exatamente essas três URLs (o perfil `Efer-Eder`, `ghostty-org/ghostty` `AI_POLICY.md` e `ossf/scorecard` `docs/checks.md`). Elas deixam de ser verificadas automaticamente.
- A descrição do rótulo `good first issue` passava de 100 caracteres e foi encurtada em `labels.yml` e no `CONTRIBUTING.md`.

### O que NÃO foi verificado

- A busca do nome em bases de marcas e de domínios segue pendente.
- Não foi verificado que as três URLs excluídas do `lychee.toml` continuam no ar com o tempo.
- O comportamento da proteção com PR de contribuidor externo não foi testado.

## 2026-11-27: Etapa 0, base do repositório

### O que foi feito

- Manifesto adotado como fonte de verdade (`docs/manifesto.md`) e especificação organizada em `docs/especificacao/`.
- Arquivos de comunidade na raiz: README (pt-BR e inglês), LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, SUPPORT, GOVERNANCE, MAINTAINERS, AI_POLICY, ROADMAP, CHANGELOG.
- Documentação de decisões (ADRs 0000 a 0007), modelo de RFC, pesquisa, instruções para agentes e automações em `.github/`.
- Código de conduta: texto oficial do Contributor Covenant 2.1 em pt-BR, baixado de `contributor-covenant.org` em 2026-11-27, com o canal de relato preenchido (formulário privado do repositório, o mesmo da política de segurança).

### Decisões

- Licença MIT, provisória, a revisar antes da primeira versão que contenha código; DCO 1.1, sem CLA (ADR 0002).
- Documentação em pt-BR, commits e branches em inglês, Conventional Commits (ADR 0001).
- Versionamento Semântico 2.0.0 com `0.y.z` e `CHANGELOG.md` no formato Keep a Changelog 1.1.0; nenhuma versão é publicada enquanto não houver produto (ADR 0007).
- `main` protegida, tudo por PR, squash merge; mudanças grandes por RFC, decisões em ADR.
- Governança BDFL na fase inicial, com compromisso de revisão quando houver contribuidores recorrentes.
- Política de IA: uso permitido com humano responsável, divulgação obrigatória para contribuições externas (mantenedores isentos), agentes sem `Signed-off-by` (ADR 0003).
- Nome do projeto: Contraprova, que substitui o nome de trabalho VibeGuard (ADR 0004, 2026-11-27). Busca de marcas pendente.
- Documentação antes do código (ADR 0005); `AGENTS.md` como fonte única para agentes (ADR 0006), com adaptadores por referência, cópias geradas e verificadas na CI, skills em `.agents/skills/` e matriz de ferramentas em `docs/agentes/compatibilidade.md`.

### O que NÃO foi feito nem verificado

- Não existe código, pacote, comando nem serviço.
- O Scorecard rodou com sucesso no GitHub, mas a nota e os alertas dele não foram analisados.
- O lint de Markdown roda limpo localmente: `npx --yes markdownlint-cli2 "**/*.md"` terminou com 0 erros em 2026-11-27.
- Os links relativos entre os arquivos foram conferidos por um script local em 2026-11-27 (0 quebrados). A verificação de links externos não foi executada localmente.
- A busca do nome Contraprova em bases de marcas (INPI, WIPO) e de domínios está pendente; a disponibilidade foi conferida só em npm, PyPI, crates.io e na busca de repositórios do GitHub.
- Os números do estudo citado na política de IA (arXiv:2605.16706) foram lidos no resumo do artigo, em <https://arxiv.org/abs/2605.16706>, em 2026-11-27; o artigo completo não foi lido nem reanalisado.
- Nenhuma ferramenta de agente foi executada contra o repositório. A matriz de compatibilidade reflete a documentação oficial lida em 2026-11-27, e algumas leituras estão marcadas como não confirmadas (Codex cloud, Cursor Cloud Agents, Cline, Trae, caminho do settings do Qwen Code, e `AGENTS.md` no Amazon Q, Continue e JetBrains AI Assistant).
- Nenhum PR de pessoa externa passou pela proteção da `main` ainda; o único teste é o PR que registrou este estado.
- O `DCO` não é verificado por automação (ADR 0002); o modelo de PR pede `Signed-off-by`, mas os commits iniciais do mantenedor não o têm.

### Próximo passo

Abrir as primeiras RFCs sobre as perguntas em aberto, começando pelo formato do produto.
