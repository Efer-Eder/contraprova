# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/)
(`0.y.z` enquanto a fase for inicial).

## [Unreleased]

### Adicionado

- ADR 0009: protótipo executável do motor em paralelo com a especificação, que substitui o ADR 0005 (documentação antes do código). O protótipo é experimental e consultivo, não fecha nenhuma pergunta em aberto, e a RFC 0001 segue seu ciclo. A revisão da licença continua pendente antes da primeira versão publicada.
- Protótipo experimental do motor (versão 0.0.1) em `motor/`, com a skill em `skills/contraprova/` e o `package.json` da raiz: programa de linha de comando em Node.js 22 ou mais novo, sem dependências e não publicado no npm. Comandos `investigar`, `verificar`, `provar`, `esteira` e `comparar`; decisões aprovado, bloqueado e inconclusivo (exceção autorizada não implementada); nível consultivo local, sem isolamento. Verificado em 2026-11-27 no Windows 11 com Node 24: `npm test` com 77 testes e 0 falhas, e o motor contra os exemplos deu `correto` aprovado, `teste-fraco` inconclusivo, `teste-falhando` bloqueado e `sem-testes` inconclusivo. Linux, macOS e projetos reais de terceiros não foram verificados.
- Workflow `.github/workflows/motor.yml` com os testes do motor em Ubuntu e Windows, Node 22 e 24. Ainda não rodou na CI do GitHub.
- Seção "Experimente o protótipo" nos dois READMEs e regras de contribuição para o protótipo em `CONTRIBUTING.md`.
- Escolhas provisórias do protótipo registradas em PA-02 e PA-05, sem fechar nenhuma das duas perguntas.
- ADR 0008 esclarecendo o escopo do DCO: o `Signed-off-by` é exigido das contribuições externas, e os commits do mantenedor não o levam.
- Manifesto do projeto em `docs/manifesto.md`, como fonte de verdade.
- Especificação em `docs/especificacao/`: princípios, capacidades, critérios de aceitação, estados de decisão, modelo de ameaças, fluxo de uso, não objetivos e glossário.
- Perguntas em aberto em `docs/perguntas-em-aberto.md`.
- Governança (`GOVERNANCE.md`), mantenedores (`MAINTAINERS.md`), código de conduta (Contributor Covenant 2.1), política de segurança e de suporte.
- Política de contribuições assistidas por IA (`AI_POLICY.md`).
- Guia de contribuição com DCO 1.1, Conventional Commits e fluxo por RFC e ADR.
- Instruções para agentes: `AGENTS.md`, `CLAUDE.md` e `docs/agentes/`.
- Compatibilidade com agentes de programação: adaptadores por referência (`.gemini/settings.json`, `.aider.conf.yml`, `.qwen/settings.json`), cópias geradas de `AGENTS.md` (`.github/copilot-instructions.md`, `.amazonq/rules/`, `.aiassistant/rules/`, `.continue/rules/`) com `scripts/sync-agent-adapters.sh`, job `adaptadores` na CI, skills em `.agents/skills/` e a matriz `docs/agentes/compatibilidade.md`.
- ADRs 0000 a 0007 em `docs/adr/` e modelo de RFC em `docs/rfcs/`.
- Pesquisa em `docs/pesquisa/` (boas práticas open source, nome e projetos semelhantes).
- Nome do projeto: Contraprova (ADR 0004), em substituição ao nome de trabalho VibeGuard.
- Automações de repositório em `.github/`: templates de issue e PR, lint de documentação, verificação de links, varredura de segredos, Scorecard, `CODEOWNERS` e `dependabot.yml`.
- Licença MIT (provisória), `README.md` e `README.en.md`, `ROADMAP.md` e `PROGRESS.md`.
- Configuração de repositório: `.gitignore`, `.gitattributes`, `.editorconfig`, `.markdownlint-cli2.jsonc` e `lychee.toml`.
- Página pública do projeto em `site/` (arquivo estático, sem build), com os scripts de publicação em `deploy/` e o guia `docs/publicar-pagina.md`. A página está no ar em `https://efer.online/projeto/contraprova/` e é citada nos READMEs.
- Repositório público no GitHub com proteção da `main`, relato privado de vulnerabilidades, Discussions e rótulos configurados.

### Alterado

- Página pública (`site/index.html`) deixa de dizer que não há código, comando ou instalação: passa a dizer fase de especificação com um protótipo experimental do motor, consultivo, sem pacote publicado e não pronto. Nova seção "Experimente o protótipo" (requisito, comando `npx` com o aviso de que ele executa código do repositório na máquina de quem roda, o que faz e os limites).
- `AGENTS.md`, READMEs, `ROADMAP.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `docs/` e o formulário de proposta deixam de dizer que não há código: passam a dizer especificação com protótipo experimental e consultivo (ADR 0009).
- ADR 0005 marcado como substituído pelo ADR 0009.

[Unreleased]: https://github.com/Efer-Eder/contraprova/commits/main
