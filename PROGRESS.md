# Progresso

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
- Os workflows ainda não rodaram no GitHub: não foi verificado se o lint de Markdown, a verificação de links, a checagem de estilo, a varredura de segredos e o Scorecard passam lá.
- O lint de Markdown roda limpo localmente: `npx --yes markdownlint-cli2 "**/*.md"` terminou com 0 erros em 2026-11-27.
- Os links relativos entre os arquivos foram conferidos por um script local em 2026-11-27 (0 quebrados). A verificação de links externos não foi executada localmente.
- A busca do nome Contraprova em bases de marcas (INPI, WIPO) e de domínios está pendente; a disponibilidade foi conferida só em npm, PyPI, crates.io e na busca de repositórios do GitHub.
- Os números do estudo citado na política de IA (arXiv:2605.16706) foram lidos no resumo do artigo, em <https://arxiv.org/abs/2605.16706>, em 2026-11-27; o artigo completo não foi lido nem reanalisado.
- A proteção da `main`, o relato privado de vulnerabilidades e as Discussions precisam ser ativados no GitHub; não foi confirmado que estão ativos.
- Nenhuma ferramenta de agente foi executada contra o repositório. A matriz de compatibilidade reflete a documentação oficial lida em 2026-11-27, e algumas leituras estão marcadas como não confirmadas (Codex cloud, Cursor Cloud Agents, Cline, Trae, caminho do settings do Qwen Code, e `AGENTS.md` no Amazon Q, Continue e JetBrains AI Assistant).
- O job `adaptadores` da CI ainda não rodou no GitHub; o script foi testado só localmente.

### Próximo passo

Publicar o repositório com a `main` protegida, conferir os workflows, e abrir as primeiras RFCs sobre as perguntas em aberto, começando pelo formato do produto.
