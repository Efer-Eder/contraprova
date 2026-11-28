# Contraprova

[![MIT License](https://img.shields.io/badge/license-MIT-7377F0?style=flat-square)](LICENSE)
[![Status: specification and experimental prototype](https://img.shields.io/badge/status-specification%20%2B%20prototype-orange?style=flat-square)](ROADMAP.md)

**Build with AI. Validate with evidence.**

> Never trust an AI just because it says your code works. Demand proof.

[Português](README.md) · [Manifesto](docs/manifesto.md) · [Documentation](docs/README.md) · [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md) · [Project page (pt-BR)](https://efer.online/projeto/contraprova/)

The detailed documentation is written in Brazilian Portuguese (see [ADR 0001](docs/adr/0001-idioma-da-documentacao-e-dos-commits.md)). This README is an English version of [README.md](README.md). Commits and branches are in English.

## Project status

**Contraprova is in the specification phase, with an experimental prototype of the engine that already runs. It is not a finished product.**

The prototype is a command-line program at the **advisory** level: it recommends and prevents nothing. There is no published package, and the product format (skill, agent, standalone program, integration, service, or a combination), the language and the architecture remain open and will be decided through RFCs. The technology choices of the prototype are provisional and do not close any open question ([ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md), in Portuguese). The rest of the repository is text: the manifesto, the specification, recorded decisions and collaboration rules. Nothing here should be read as protection, a finished product, a deadline or a delivery promise.

## Try the prototype

Requirement: Node.js 22 or newer. The prototype has no dependencies. From a clone of this repository:

```sh
node motor/bin/contraprova.js verificar <project-folder>
```

Or straight from GitHub, without cloning:

```sh
npx --yes github:Efer-Eder/contraprova verificar .
```

There is no package on npm: this command downloads the code of this repository and runs it on your machine. Read it before running. The program, its messages and its report are in Brazilian Portuguese.

What it does:

- runs the tests of the project for real and uses the result, instead of believing whoever says they passed;
- introduces simple defects into a temporary copy of the project, to see whether the tests notice (the original project is not changed);
- audits GitHub Actions workflows heuristically, pointing out what may let failures pass;
- produces an evidence report (`.contraprova/relatorio.md` and `.contraprova/relatorio.json`) with the decision: approved, blocked or inconclusive.

Limits:

- it recognizes only Node.js and Python projects, and the analysis of tests and workflows is heuristic, so it can be wrong in both directions;
- there is no isolation: the code of the analyzed project runs on your machine with your permissions. Do not run it on a project you do not trust;
- it is not protected mode: the result recommends and can be ignored by whoever controls the machine or the repository;
- the "authorized exception" decision is not implemented.

Full details, commands, exit codes and limits are in [motor/README.md](motor/README.md) (Portuguese).

## The problem

The ability to build software with AI has grown faster than the ability to verify its quality. Today it is possible to ask an agent to build an entire system without knowing how to evaluate the tests it wrote, spot a regression, set up a release pipeline or recognize a security flaw.

The agent writes the code, creates tests, runs commands and announces it is done. But a passing test may verify the wrong behavior, an error may have been silenced, a dependency may have been invented, a feature may exist only on screen, and a pipeline may be green because it did not run the required checks. This does not assume bad intent: optimizing to finish a task can produce solutions that look correct without meeting the original need.

## What Contraprova aims to be

An independent verification layer for software developed with AI assistance. It separates building software from verifying its quality, so that people can build with AI without relying solely on the AI's own word.

The proposal is that Contraprova should be able to, within the technical authority it actually has:

- turn the builder's intent into verifiable acceptance criteria;
- treat existing tests, reports and comments as claims to verify, not as facts;
- produce independent evidence, look for defects and regressions, and detect weakened tests;
- audit the release pipeline and explain risks in understandable language;
- prevent improper approvals, where it has the integration and authority to do so.

The product does not promise bug-free software. It promises not to confuse the absence of evidence of failure with evidence that things work. Its value is not in making an AI look more confident, but in making that confidence less necessary.

## What Contraprova is not

Per section 27 of the [manifesto](docs/manifesto.md) (in Portuguese):

- It is not merely a test generator, a code reviewer, a vulnerability scanner, a coding agent or a metrics dashboard.
- It is not a promise of zero bugs, a universal replacement for specialists, or an automatic security certification.
- It does not require every project to use the same architecture.
- It must not modify code, install components, send data or publish releases without the necessary permissions.
- It does not treat all existing code as guilty: the goal is to verify, not to condemn without evidence.

## The 12 principles

Summary; the full text is in the [manifesto](docs/manifesto.md) and in [docs/especificacao/principios.md](docs/especificacao/principios.md).

1. **Initial distrust:** nothing is considered true merely because it exists (a test, report, comment, documentation or agent statement).
2. **Evidence over opinion:** observed results outweigh model conclusions.
3. **Independence:** whoever implements does not alone control the approval criteria.
4. **Fail safe:** a missing, interrupted or inconclusive required check is not a success.
5. **Transparency:** every conclusion states its origin, scope and limitations.
6. **No regression:** fixing one feature does not authorize breaking another.
7. **No tampering:** tests must not be silently weakened to accommodate incorrect code.
8. **Human control:** requirement changes, exceptions and accepted risks are explicit.
9. **Least privilege:** analyzing a project must not require unrestricted access to production, secrets or admin accounts.
10. **Neutrality:** trust does not depend on the brand of the agent that wrote the code.
11. **Proportionality:** checks consider risk, size and context, without hiding gaps.
12. **Reproducibility:** an equivalent run should be able to verify the same evidence.

## The 4 decision states

The quality decision comes from explicit policies and evidence, not from a subjective AI score. The proposed minimum states are:

| State | Meaning |
|---|---|
| Approved | Required checks completed and criteria met, within the declared scope. |
| Blocked | Required failure, prohibited risk or proven policy violation. |
| Inconclusive | Insufficient evidence, incomplete execution, unavailable environment or unresolved conflict. |
| Authorized exception | A known risk explicitly accepted by an authorized person, with justification, scope and expiry. |

Details in [docs/especificacao/estados-de-decisao.md](docs/especificacao/estados-de-decisao.md) (Portuguese).

## Advisory mode and protected mode

The manifesto distinguishes two modes of operation and requires the product to show which one is active:

- **Advisory:** only recommends not releasing. It has no technical authority to prevent a release.
- **Protected:** has the integration and authority to prevent a release. In this mode, the blocked and inconclusive states stop publication.

An advisory version will never be presented as unbreakable protection. If an agent has administrative control over the machine, accounts and publishing, a local tool cannot guarantee unbreakable protections, and the product must say so.

## Proposed functional evolution

The stages describe capabilities, not technologies or deadlines (section 26 of the manifesto). Details in [ROADMAP.md](ROADMAP.md).

- **Foundation:** project investigation, test inventory, acceptance criteria, real execution, change analysis and evidence reports.
- **Independent validation:** test generation, bug reproduction, test effectiveness evaluation, regression detection and agent auditing.
- **Effective protection:** protected policies, isolation, release pipeline verification and binding approval to the artifact.
- **Extended experience:** guided setup, history, accessible explanations, assisted fixes and integration with different development environments.

## Documentation map

| Where | What is there |
|---|---|
| [motor/](motor/README.md) | Experimental, advisory prototype of the engine. See [ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md). |
| [skills/](skills/contraprova/SKILL.md) | Skill of the prototype, so agents can explain the result. |
| [docs/manifesto.md](docs/manifesto.md) | Source of truth: manifesto and product specification. |
| [docs/README.md](docs/README.md) | Documentation index. |
| [docs/especificacao/](docs/especificacao/) | Principles, capabilities, acceptance criteria, decision states, threat model, usage flow, non-goals and glossary. |
| [docs/perguntas-em-aberto.md](docs/perguntas-em-aberto.md) | Deliberately open decisions. |
| [docs/adr/](docs/adr/README.md) | Architecture decision records (ADR). |
| [docs/rfcs/](docs/rfcs/README.md) | Larger change proposals (RFC). |
| [docs/pesquisa/](docs/pesquisa/boas-praticas-open-source.md) | Supporting research, including on the name. |
| [docs/agentes/](docs/agentes/README.md) | Roles, delivery protocol and starter prompts for agents. |
| [GOVERNANCE.md](GOVERNANCE.md), [MAINTAINERS.md](MAINTAINERS.md) | How decisions are made and who maintains it. |
| [AI_POLICY.md](AI_POLICY.md) | Policy on AI-assisted contributions. |

## How to take part now

Since the product is not yet decided, the most useful contribution right now is intellectual, and trying the prototype on your own projects and reporting what it got right and wrong also helps:

1. Read the [manifesto](docs/manifesto.md).
2. Discuss the [open questions](docs/perguntas-em-aberto.md) in issues and Discussions.
3. Propose larger changes through an [RFC](docs/rfcs/README.md).
4. Fix, translate or improve the documentation.
5. Run the prototype (`npm test` in a clone, or the section above) and report what it got right and wrong.

The full flow is in [CONTRIBUTING.md](CONTRIBUTING.md). External contributions are certified by DCO (`git commit -s`; the maintainer's commits do not carry `Signed-off-by`), and AI use in them follows the [AI_POLICY.md](AI_POLICY.md) (disclosure is required for external contributions; maintainers are exempt from that requirement).

## If you use AI agents

The repository works with the most common coding agents, including Codex, Claude Code, Antigravity, Cursor, GitHub Copilot, Gemini CLI and Windsurf, and others that read the `AGENTS.md` format. The tool matrix, with the status of each tool and the official sources, is in [docs/agentes/compatibilidade.md](docs/agentes/compatibilidade.md) (in Portuguese). If you use an agent to work on this repository, start with [AGENTS.md](AGENTS.md) and [docs/agentes/](docs/agentes/README.md). Agents do not open PRs, issues or comments without human approval, and do not add `Signed-off-by`. See the [AI_POLICY.md](AI_POLICY.md).

## About the name

The project started under the working name VibeGuard and was renamed Contraprova on 2026-11-27. It has no relation to the projects and products that use the old name. "Contraprova" is Portuguese for a second, independent examination that confirms or overturns the first, which is the idea behind the project. The research is in [docs/pesquisa/nome-e-projetos-semelhantes.md](docs/pesquisa/nome-e-projetos-semelhantes.md) and the decision in [ADR 0004](docs/adr/0004-nome-do-projeto-contraprova.md). A trademark search is still pending.

## License

[MIT](LICENSE), provisionally: the license will be reviewed before the first release that contains code; the prototype has not been published as a release yet ([ADR 0002](docs/adr/0002-licenca-mit-provisoria-e-dco.md)). Copyright (c) 2026 Efer Eder.
