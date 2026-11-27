---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# AGENTS.md como fonte única de instruções para agentes

## Contexto e problema

Agentes de IA diferentes leem arquivos de instruções diferentes. Manter várias cópias paralelas escritas à mão (uma por fornecedor) leva a divergências, que é exatamente o tipo de inconsistência que o projeto quer evitar. Ao mesmo tempo, o repositório deve funcionar com todos os agentes de programação conhecidos, sem exigir configuração de quem contribui. É preciso uma fonte única, em coerência com a neutralidade do manifesto (P-10), e um jeito de entregá-la a ferramentas que não a leem sozinhas.

## Direcionadores da decisão

- Uma só fonte de verdade, editada em um só lugar.
- Neutralidade quanto ao fornecedor do agente.
- Funcionar com as ferramentas confirmadas na documentação oficial, inclusive as que não leem `AGENTS.md` ou não sabem importar outro arquivo.
- Não criar arquivos que façam uma ferramenta ignorar o `AGENTS.md` (o Zed usa só o primeiro arquivo que encontra; o Warp e o Junie priorizam os arquivos próprios).
- Divergência entre cópias detectada por máquina, não por revisão visual.
- Arquivos curtos, que o agente de fato leia: menos de 200 linhas (recomendação do Claude Code) e menos de 16 KiB (o Devin inclui só os primeiros 16 KiB de cada arquivo, e o Antigravity limita em 24.000 bytes).

## Opções consideradas

- `AGENTS.md` como fonte única, com adaptadores por referência onde a ferramenta sabe importar ou apontar para ele, e cópias integrais geradas e verificadas na CI onde não sabe.
- `AGENTS.md` como fonte única, com todos os adaptadores apontando para ele e um resumo à mão para o Copilot (a primeira versão desta decisão).
- Um arquivo por fornecedor, mantidos à mão.
- Sem arquivos de instruções para agentes.

## Resultado da decisão

Opção escolhida: `AGENTS.md` na raiz é a fonte única, com três camadas.

1. **Ferramentas que já leem `AGENTS.md`** (por exemplo Codex, Antigravity, Cursor, Windsurf, Zed e Junie): nada é criado para elas. Não existem `.cursorrules`, `.windsurfrules`, `.clinerules`, `.rules`, `WARP.md`, `GEMINI.md`, `QWEN.md`, `.junie/AGENTS.md`, `.cursor/rules/*.mdc` nem `.agents/rules/`, porque essas ferramentas já leem o `AGENTS.md` e vários desses nomes fariam o Zed, o Warp ou o Junie ignorá-lo.
2. **Adaptadores por referência**, pequenos e escritos à mão: `CLAUDE.md` (só `@AGENTS.md`), `.gemini/settings.json` (`context.fileName` com `AGENTS.md` e `GEMINI.md`), `.aider.conf.yml` (`read: AGENTS.md`) e `.qwen/settings.json` (`context.fileName` com `AGENTS.md` e `QWEN.md`).
3. **Adaptadores por cópia integral gerada**, para as ferramentas que não importam: `.github/copilot-instructions.md`, `.amazonq/rules/agents.md`, `.aiassistant/rules/agents.md` e `.continue/rules/00-agents.md`. Cada cópia é o conteúdo exato do `AGENTS.md` (com o frontmatter exigido pela ferramenta, quando houver) e um comentário HTML avisando que é gerada. Ninguém as edita: `bash scripts/sync-agent-adapters.sh` as regenera, e `bash scripts/sync-agent-adapters.sh --check` roda na CI e reprova qualquer divergência. A cópia do Copilot é integral, e não um resumo, porque o Zed lê só o primeiro arquivo da lista dele e `.github/copilot-instructions.md` vem antes do `AGENTS.md`.

Restrições que decorrem disso:

- O `AGENTS.md` não usa links relativos, porque as cópias ficam em outras pastas e os links quebrariam. Caminhos são citados em crase. O script reprova links relativos no `AGENTS.md`.
- O `AGENTS.md` fica abaixo de 200 linhas e abaixo de 16 KiB. O script reprova acima de 16 KiB.
- Scripts de manutenção do repositório em `scripts/` são permitidos e não são código do produto, o que não contradiz o [ADR-0005](0005-documentacao-antes-do-codigo.md).

Skills no padrão aberto [Agent Skills](https://agentskills.io/specification) ficam em `.agents/skills/<nome>/SKILL.md` e **não** são duplicadas em `.claude/skills/`: Cursor, Copilot e Kilo Code leem as duas pastas e mostrariam a skill duplicada, e o Claude Code já tem os subagentes equivalentes em `.claude/agents/`. As skills são `auditar-evidencias`, `revisar-especificacao` e `pesquisar-fontes` (mesmo conteúdo e limites dos três subagentes: somente leitura, sem aprovar nada), mais `escrever-adr` e `escrever-rfc`.

A matriz completa de ferramentas, com a situação de cada uma e as fontes, está em [compatibilidade.md](../agentes/compatibilidade.md).

## Consequências

- Bom, porque há uma só fonte para manter e a CI detecta cópia desatualizada.
- Bom, porque ferramentas sem importação, como Amazon Q, Continue, JetBrains AI Assistant e o Copilot fora do VS Code, recebem as regras completas.
- Bom, porque o `AGENTS.md` completo em `.github/copilot-instructions.md` garante o mesmo conteúdo no Zed.
- Ruim, porque existem cópias no repositório. Elas são geradas e verificadas, mas quem muda o `AGENTS.md` precisa rodar o script antes de abrir o PR.
- Ruim, porque o `AGENTS.md` não pode ter links relativos e precisa caber em 16 KiB, o que limita seu crescimento.
- Ruim, porque nenhuma ferramenta foi executada contra o repositório e algumas leituras não foram confirmadas (Codex cloud, Cursor Cloud Agents, Cline, Trae, o caminho do settings do Qwen Code e a leitura de `AGENTS.md` por Amazon Q, Continue e JetBrains AI Assistant).
- Neutro, porque a lista de ferramentas muda com o tempo e a matriz precisa ser revisada quando a documentação oficial mudar.

## Confirmação

- A CI roda `bash scripts/sync-agent-adapters.sh --check` (job `adaptadores` em `.github/workflows/docs.yml`) e reprova se alguma cópia divergir do `AGENTS.md`, se o `AGENTS.md` passar de 16 KiB ou tiver links relativos.
- Revisão de PR: `CLAUDE.md` deve conter apenas a importação de `AGENTS.md`, nenhuma instrução nova é aceita fora de `AGENTS.md` e nenhum dos arquivos listados como "não criar" pode aparecer.
- A matriz de compatibilidade é revisada quando uma ferramenta mudar a documentação ou quando se pedir a inclusão de outra.

## Prós e contras das opções

### Fonte única, com adaptadores por referência e cópias geradas

- Bom, porque evita divergência e cobre as ferramentas que não importam.
- Ruim, porque exige o script e a verificação na CI.

### Fonte única, com resumo à mão para o Copilot

- Bom, porque o arquivo do Copilot é curto.
- Ruim, porque o Zed leria o resumo no lugar do `AGENTS.md` e as ferramentas sem importação ficariam sem as regras completas.

### Um arquivo por fornecedor

- Bom, porque cada ferramenta lê o seu nativamente.
- Ruim, porque as cópias divergem e vários desses nomes escondem o `AGENTS.md` de outras ferramentas.

### Sem arquivos

- Bom, porque não há o que manter.
- Ruim, porque os agentes ficam sem as regras do projeto.

## Mais informações

Fontes verificadas em 2026-11-27 (as demais estão na matriz de compatibilidade):

- AGENTS.md: <https://agents.md/>
- Claude Code (memória e importação): <https://code.claude.com/docs/en/memory>
- GitHub Copilot (suporte a instruções por ferramenta): <https://docs.github.com/en/copilot/reference/custom-instructions-support>
- Zed (ordem dos arquivos de regras): <https://zed.dev/docs/ai/instructions>
- Gemini CLI: <https://geminicli.com/docs/cli/gemini-md/>
- Agent Skills: <https://agentskills.io/specification>

Detalhes em [boas-praticas-open-source.md](../pesquisa/boas-praticas-open-source.md). Veja também [agentes/README.md](../agentes/README.md) e [compatibilidade.md](../agentes/compatibilidade.md).
