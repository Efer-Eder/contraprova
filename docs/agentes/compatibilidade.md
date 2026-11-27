# Compatibilidade com ferramentas de agentes

Este repositório foi preparado para funcionar com os agentes de programação de IA mais usados sem que ninguém precise configurar nada à mão. A fonte única de instruções é o `AGENTS.md` da raiz ([ADR-0006](../adr/0006-agents-md-como-fonte-unica-para-agentes.md)). Este documento mostra, ferramenta por ferramenta, como cada uma chega a esse arquivo, o que o repositório fornece para isso e o que não foi confirmado.

Tudo abaixo foi conferido na documentação oficial de cada ferramenta em 2026-11-27. **Nenhuma das ferramentas foi executada contra este repositório.** A coluna "Situação" diz o que a documentação confirma, não o que foi testado na prática.

## Matriz

Legenda da situação: "confirmado" quer dizer que a documentação oficial afirma o comportamento descrito; "não confirmado" quer dizer que não foi possível confirmar. A coluna "Arquivo próprio" só traz o que foi levantado; "não levantado" não significa que a ferramenta não tenha um.

### Ferramentas que leem o `AGENTS.md` da raiz sem configuração

| Ferramenta | Lê `AGENTS.md` sozinha | Arquivo próprio | O que este repositório fornece | Situação | Fonte oficial |
|---|---|---|---|---|---|
| OpenAI Codex (CLI e IDE) | Sim. Concatena da raiz até o diretório atual, e o limite padrão é de 32 KiB somados (`project_doc_max_bytes`) | `AGENTS.override.md`, que substitui o `AGENTS.md` da mesma pasta | Só o `AGENTS.md` | Confirmado | <https://learn.chatgpt.com/docs/agent-configuration/agents-md> |
| OpenAI Codex cloud | Não confirmado | Não levantado | Só o `AGENTS.md` | Não confirmado | Sem fonte |
| Google Antigravity (IDE e CLI) | Sim. Lê também `GEMINI.md` e `.agents/rules/*.md` (com `trigger` obrigatório); limite de 24.000 bytes por arquivo | `GEMINI.md`, `.agents/rules/*.md` | Só o `AGENTS.md` | Confirmado | <https://antigravity.google/docs/rules> |
| Cursor (editor e CLI) | Sim, na raiz e em subpastas | `.cursor/rules/*.mdc`; `.cursorrules` é legado | Só o `AGENTS.md` | Confirmado | <https://cursor.com/docs/context/rules> |
| Cursor Cloud Agents | Não confirmado | Não levantado | Só o `AGENTS.md` | Não confirmado | Sem fonte |
| Windsurf (agora Devin Desktop) | Sim. O `AGENTS.md` da raiz é regra sempre ativa | Não levantado | Só o `AGENTS.md` | Confirmado | <https://docs.devin.ai/desktop/cascade/agents-md> |
| Roo Code | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://roocodeinc.github.io/Roo-Code/features/custom-instructions> |
| Kilo Code | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://kilo.ai/docs/customize/agents-md> |
| Zed | Sim, mas usa só o primeiro arquivo que encontrar (veja a [primeira armadilha](#armadilhas)) | `.rules` e os demais da lista da armadilha | Cópia integral em `.github/copilot-instructions.md` e o `AGENTS.md` | Confirmado | <https://zed.dev/docs/ai/instructions> |
| JetBrains Junie | Sim, mas `.junie/AGENTS.md` é verificado antes do `AGENTS.md` da raiz | `.junie/AGENTS.md` | Só o `AGENTS.md` | Confirmado | <https://junie.jetbrains.com/docs/guidelines-and-memory.html> |
| Amp | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://ampcode.com/docs/customize/agents-md> |
| opencode | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://opencode.ai/docs/rules/> |
| goose | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://goose-docs.ai/docs/guides/context-engineering/using-goosehints> |
| Warp | Sim, mas se existir `WARP.md` no mesmo diretório, ele vence | `WARP.md` | Só o `AGENTS.md` | Confirmado | <https://docs.warp.dev/agents/capabilities/rules/> |
| Jules | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://jules.google/docs/> |
| Devin | Sim, e inclui os primeiros 16 KiB de cada arquivo | Não levantado | Só o `AGENTS.md`, mantido abaixo de 16 KiB | Confirmado | <https://docs.devin.ai/onboard-devin/agents-md> |
| Factory Droid | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://docs.factory.com/cli/configuration/agents-md> |
| Augment Code | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://docs.augmentcode.com/setup-augment/guidelines> |
| Kiro | Sim | Não levantado | Só o `AGENTS.md` | Confirmado | <https://kiro.dev/docs/steering/> |

### Ferramentas que leem `AGENTS.md` só em parte ou só com importação

| Ferramenta | Lê `AGENTS.md` sozinha | Arquivo próprio | O que este repositório fornece | Situação | Fonte oficial |
|---|---|---|---|---|---|
| Claude Code | Só a partir da v2.1.277 e só quando não há `CLAUDE.md`. Havendo `CLAUDE.md`, ele precisa conter `@AGENTS.md` | `CLAUDE.md`, `.claude/` | `CLAUDE.md` com apenas `@AGENTS.md` | Confirmado | <https://code.claude.com/docs/en/memory> |
| GitHub Copilot: cloud agent, code review no GitHub.com, Copilot CLI e Chat no VS Code | Sim | `.github/copilot-instructions.md` | `AGENTS.md` e a cópia gerada | Confirmado | <https://docs.github.com/en/copilot/reference/custom-instructions-support> |
| GitHub Copilot: Chat no GitHub.com, Visual Studio, JetBrains, Xcode e Eclipse | Não. Usam só `.github/copilot-instructions.md`, que não tem sintaxe de importação | `.github/copilot-instructions.md` | Cópia integral gerada em `.github/copilot-instructions.md` | Confirmado | <https://docs.github.com/en/copilot/reference/custom-instructions-support> |

### Ferramentas que precisam de adaptador

| Ferramenta | Lê `AGENTS.md` sozinha | Arquivo próprio | O que este repositório fornece | Situação | Fonte oficial |
|---|---|---|---|---|---|
| Aider | Não. Nada é carregado sozinho | `.aider.conf.yml` | `.aider.conf.yml` com `read: AGENTS.md` | Confirmado | <https://aider.chat/docs/usage/conventions.html> |
| Gemini CLI | Não. O padrão é `GEMINI.md` | `.gemini/settings.json` | `.gemini/settings.json` com `fileName` listando `AGENTS.md` e `GEMINI.md` | Confirmado. A página oficial diz que o Gemini CLI foi substituído pelo Antigravity CLI em 2026-06-18 para os níveis gratuito e Google One | <https://geminicli.com/docs/cli/gemini-md/> |
| Qwen Code | Não. O padrão é `QWEN.md`, configurável por `context.fileName` | `.qwen/settings.json` (caminho inferido) | `.qwen/settings.json` com `fileName` listando `AGENTS.md` e `QWEN.md` | O nome do campo é confirmado; o caminho `.qwen/settings.json` no projeto não foi confirmado | <https://qwenlm.github.io/qwen-code-docs/en/users/configuration/settings/> |
| Amazon Q Developer (IDE) | Não confirmado. Usa `.amazonq/rules/*.md`, sem importação | `.amazonq/rules/*.md` | Cópia integral gerada em `.amazonq/rules/agents.md` | Pasta confirmada; leitura de `AGENTS.md` não confirmada | <https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/context-project-rules.html> |
| Continue | Não confirmado. Usa `.continue/rules/*.md` com frontmatter (`name`, `alwaysApply`), sem importação | `.continue/rules/*.md` | Cópia integral gerada em `.continue/rules/00-agents.md`, com `name: AGENTS` e `alwaysApply: true` | Pasta confirmada; leitura de `AGENTS.md` não confirmada | <https://docs.continue.dev/customize/deep-dives/rules> |
| JetBrains AI Assistant | Não confirmado. Usa `.aiassistant/rules/*.md`, Markdown puro, com o tipo da regra definido na interface | `.aiassistant/rules/*.md` | Cópia integral gerada em `.aiassistant/rules/agents.md` | Pasta confirmada; leitura de `AGENTS.md` não confirmada. O tipo da regra precisa ser definido na interface da ferramenta | <https://www.jetbrains.com/help/ai-assistant/configure-project-rules.html> |

### Ferramentas não confirmadas

| Ferramenta | O que se sabe | O que não se sabe | Fonte oficial |
|---|---|---|---|
| Cline | A documentação lista `AGENTS.md` como formato suportado, sem dizer que carrega sozinho. O formato próprio é a pasta `.clinerules/` | Se o `AGENTS.md` é carregado sem configuração | <https://docs.cline.bot/features/cline-rules> |
| Trae | Nada | A documentação não pôde ser lida | Sem fonte |

A lista de ferramentas compatíveis com o formato é mantida em <https://agents.md/>, sob a Agentic AI Foundation, da Linux Foundation.

## Como as cópias geradas funcionam

Algumas ferramentas não sabem importar outro arquivo. Para elas, o repositório traz uma cópia integral do `AGENTS.md`, gerada por `scripts/sync-agent-adapters.sh`:

- `.github/copilot-instructions.md`
- `.amazonq/rules/agents.md`
- `.aiassistant/rules/agents.md`
- `.continue/rules/00-agents.md` (com o frontmatter `name: AGENTS` e `alwaysApply: true`)

Cada cópia tem um comentário HTML na primeira linha de conteúdo avisando que é gerada. Não edite as cópias: mude o `AGENTS.md` e rode `bash scripts/sync-agent-adapters.sh`. A CI roda `bash scripts/sync-agent-adapters.sh --check` e reprova o PR se alguma cópia divergir. Como as cópias ficam em outras pastas, o `AGENTS.md` não usa links relativos, e o script também reprova isso.

A cópia do Copilot precisa ser integral, e não um resumo, por causa do Zed: ele usa só o primeiro arquivo que encontrar, e `.github/copilot-instructions.md` vem antes do `AGENTS.md` na ordem dele.

## Armadilhas

1. **O Zed usa só o primeiro arquivo que encontrar**, nesta ordem: `.rules`, `.cursorrules`, `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md`, `AGENT.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`. Qualquer um desses nomes que apareça antes do `AGENTS.md` esconde o `AGENTS.md` do Zed. Por isso o `.github/copilot-instructions.md` é cópia integral.
2. **O Claude Code ignora o `AGENTS.md` se houver um `CLAUDE.md` sem a importação.** O `CLAUDE.md` deste repositório contém só `@AGENTS.md`. Se alguém acrescentar texto ao `CLAUDE.md`, ele passa a ser uma segunda fonte de regras, o que o ADR-0006 proíbe.
3. **Warp e Junie priorizam os arquivos próprios.** Se existir `WARP.md` no mesmo diretório, ele vence o `AGENTS.md` no Warp, e o `.junie/AGENTS.md` é verificado antes do `AGENTS.md` da raiz no Junie.

## O que deliberadamente não criamos

| Arquivo | Por quê |
|---|---|
| `.cursorrules` | O Cursor lê `AGENTS.md`, e o arquivo é legado. No Zed, ele passaria na frente do `AGENTS.md`. |
| `.windsurfrules` | O Windsurf lê `AGENTS.md`. No Zed, ele passaria na frente do `AGENTS.md`. |
| `.clinerules` | O Cline tem a pasta `.clinerules/` como formato próprio, mas a leitura do `AGENTS.md` por ele não foi confirmada. No Zed, o arquivo passaria na frente do `AGENTS.md`. |
| `.rules` | É o primeiro arquivo que o Zed procura, e esconderia o `AGENTS.md`. |
| `WARP.md` | No Warp, ele venceria o `AGENTS.md` do mesmo diretório. |
| `GEMINI.md` | O Gemini CLI e o Antigravity já são atendidos pelas configurações e pelo `AGENTS.md`. No Zed, ele vem depois do `AGENTS.md`, mas seria uma segunda fonte de regras. |
| `QWEN.md` | O Qwen Code é atendido por `.qwen/settings.json`. Seria uma segunda fonte de regras. |
| `.junie/AGENTS.md` | O Junie o verifica antes do `AGENTS.md` da raiz, o que criaria uma segunda fonte. |
| `.cursor/rules/*.mdc` | O Cursor já lê o `AGENTS.md`. Seria uma segunda fonte. |
| `.agents/rules/` | O Antigravity já lê o `AGENTS.md`. Seria uma segunda fonte. |

A regra geral: onde a ferramenta já lê o `AGENTS.md`, um arquivo próprio só traria duplicação, e em alguns casos faria a ferramenta ignorar o `AGENTS.md`.

## Skills

As skills seguem o padrão aberto [Agent Skills](https://agentskills.io/specification): uma pasta com um `SKILL.md`, cujo frontmatter exige `name` (até 64 caracteres, minúsculas, dígitos e hífen, igual ao nome da pasta) e `description` (até 1024 caracteres). A recomendação é menos de 500 linhas por skill.

As skills deste repositório ficam em `.agents/skills/` e **não** são duplicadas em `.claude/skills/`. O motivo: Cursor, Copilot e Kilo Code leem as duas pastas, então a mesma skill nas duas apareceria duplicada neles. O Claude Code já tem os subagentes equivalentes em `.claude/agents/`.

| Cliente | Pasta de skills que lê | Fonte oficial |
|---|---|---|
| OpenAI Codex | `.agents/skills/` | <https://learn.chatgpt.com/docs/build-skills.md> |
| Cursor | `.agents/skills/` e `.claude/skills/` | <https://cursor.com/docs/context/skills> |
| GitHub Copilot | `.agents/skills/` e `.claude/skills/` | <https://docs.github.com/en/copilot/concepts/agents/about-agent-skills> |
| Google Antigravity | `.agents/skills/` | <https://antigravity.google/docs/skills> |
| Kilo Code | `.agents/skills/` e `.claude/skills/` | <https://kilo.ai/docs/customize/skills> |
| Claude Code | `.claude/skills/`. Não lê `.agents/` | <https://code.claude.com/docs/en/skills> |

Skills do repositório: `auditar-evidencias`, `revisar-especificacao`, `pesquisar-fontes`, `escrever-adr` e `escrever-rfc`. As três primeiras têm o mesmo conteúdo e os mesmos limites dos subagentes de `.claude/agents/`: somente leitura, relatam achados confirmados, suspeitas e o que não foi verificado, e não aprovam nada. Veja [papéis](papeis.md).

## Limites de tamanho

| Ferramenta | Limite | Fonte |
|---|---|---|
| Codex | 32 KiB somados, por padrão (`project_doc_max_bytes`) | Matriz acima |
| Antigravity | 24.000 bytes por arquivo | Matriz acima |
| Devin | Inclui os primeiros 16 KiB de cada arquivo | Matriz acima |
| Claude Code | Recomendação de menos de 200 linhas | Matriz acima |

O `AGENTS.md` fica abaixo de 200 linhas e abaixo de 16 KiB, o limite mais apertado entre os confirmados. O script de sincronização reprova se passar de 16 KiB.

## O que não foi confirmado

- Se o Codex cloud lê o `AGENTS.md`.
- Se os Cursor Cloud Agents leem o `AGENTS.md`.
- Se o Cline carrega o `AGENTS.md` sem configuração.
- O comportamento do Trae, cuja documentação não pôde ser lida.
- O caminho `.qwen/settings.json` no projeto do Qwen Code.
- Se o Amazon Q Developer, o Continue e o JetBrains AI Assistant leem o `AGENTS.md`. Para eles o repositório traz cópias nas pastas próprias.
- Nenhuma das ferramentas desta página foi executada contra este repositório. Os adaptadores foram conferidos contra a documentação, e o formato dos arquivos de configuração foi validado com parsers de YAML e JSON, mas não houve teste de carregamento em nenhum agente.

## Como pedir a inclusão de outra ferramenta

Abra uma issue de proposta com o link da documentação oficial da ferramenta que mostre como ela lê instruções de projeto. Sem esse link, a inclusão não é feita: este documento só registra o que a documentação oficial afirma.
