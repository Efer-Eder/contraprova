# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/)
(`0.y.z` enquanto a fase for inicial).

## [Unreleased]

### Adicionado

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
- Repositório público no GitHub com proteção da `main`, relato privado de vulnerabilidades, Discussions e rótulos configurados.

[Unreleased]: https://github.com/Efer-Eder/contraprova/commits/main
