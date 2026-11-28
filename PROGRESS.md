# Progresso

## 2026-11-28: protótipo na main e página pública atualizada

### O que foi feito

- Mesclei o PR 7 (protótipo do motor) na `main`, com os 9 checks verdes (commit `adca39e`).
- Atualizei `site/index.html`: as meta descriptions, o selo, o aviso de estado, a nota da etapa 0, o texto de participação, o FAQ e a resposta sobre licença deixam de dizer que não há código, comando ou instalação. Acrescentei a seção "Experimente o protótipo" (com âncora na navegação e botão no topo) e o item "Rode o protótipo" em "Como participar". O desenho, as classes e o Ponto ficaram como estavam; só entraram um bloco de código (`pre.code`) e uma variante de aviso (`.note.warn`) feitos com os tokens existentes.
- `motor/README.md`: removi as frases que diziam que o `npx` a partir da branch principal ainda não tinha sido testado.

### Verificado em 2026-11-28 (Windows 11, Node 24)

- `npx --yes github:Efer-Eder/contraprova verificar . --mutantes 3` a partir da `main`, numa pasta temporária fora do repositório, sem `.contraprova`: `teste-fraco` deu inconclusivo (saída 2, 0 de 3 defeitos detectados) e `correto` deu aprovado (saída 0, 3 de 3 detectados).
- `site/index.html`: sem U+2014 nem U+2013 e sem emoji; tags balanceadas conferidas com `html.parser`; servido localmente, a seção nova renderizou em desktop e em 375 de largura, sem rolagem horizontal.

### O que NÃO foi verificado

- Contraste e foco da seção nova foram revistos a olho, sem auditoria automática. Só o navegador embutido do ambiente foi usado, não outros navegadores.
- O `npx` foi testado só no Windows com Node 24. Linux e macOS rodam na CI (`motor.yml`), mas não à mão.

## 2026-11-27: protótipo executável do motor e ADR 0009

### O que foi feito

- Decidi começar um protótipo executável do motor em paralelo com a RFC 0001 (em discussão no [PR 6](https://github.com/Efer-Eder/contraprova/pull/6)). Motivo: o repositório estava cru demais para atrair discussão, e sem algo que funcione ninguém interage. A discussão com apoiadores virá depois. O ADR 0009 registra a decisão e substitui o ADR 0005.
- O protótipo (versão 0.0.1) é um programa de linha de comando em Node.js 22 ou mais novo, JavaScript ESM, sem dependências e não publicado no npm, em `motor/`, com a skill em `skills/contraprova/`. Comandos: `investigar`, `verificar`, `provar`, `esteira` e `comparar`. Decisões: aprovado, bloqueado e inconclusivo (exceção autorizada não implementada). Nível de autoridade: consultivo local.
- Documentação alinhada: `AGENTS.md` (com os adaptadores regenerados), READMEs, `ROADMAP.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `GOVERNANCE.md`, `docs/`, formulário de proposta, e uma linha "escolha provisória" em PA-02 e PA-05 sem mudar o status de nenhuma pergunta.
- Novo workflow `.github/workflows/motor.yml` (testes do motor em Ubuntu e Windows, Node 22 e 24).

### Decisões

- As escolhas de stack são provisórias e não fecham PA-02, PA-03, PA-04, PA-05, PA-06, PA-07 nem PA-08. PA-01 continua aberta até a RFC 0001 ser decidida. O protótipo é evidência para a RFC, não decisão.
- Sobre a licença: o ADR 0002 manda revisar "antes da primeira versão que contenha código". Li como "primeira versão publicada", porque nada foi publicado; a ambiguidade está registrada no ADR 0009 e a revisão (PA-09) segue pendente.

### Verificado em 2026-11-27 (Windows 11, Node 24)

- `npm test`: 77 testes, 0 falhas.
- O motor contra os exemplos: `correto` aprovado (saída 0), `teste-fraco` inconclusivo (2), `teste-falhando` bloqueado (1), `sem-testes` inconclusivo (2).
- `npx --yes github:Efer-Eder/contraprova#feat/engine-prototype verificar .` funcionou num diretório de teste (decisão inconclusivo, saída 2).

### O que NÃO foi verificado

- Linux e macOS. O workflow `motor.yml` os cobre, mas não rodou no GitHub.
- `npx` a partir da branch principal (só depois do merge).
- Projetos reais de terceiros e Python além de um exemplo com `unittest`.
- A página pública em `site/index.html` não foi atualizada e continua dizendo que não há software.

## 2026-11-27: escopo do DCO

### O que foi feito

- ADR 0008 esclarece que o DCO (`Signed-off-by`, `git commit -s`) é exigido das contribuições externas. Os commits do mantenedor não o levam: ele é o titular do copyright e licencia o próprio trabalho diretamente pela licença do projeto.
- `CONTRIBUTING.md`, `AI_POLICY.md`, o modelo de PR, os dois READMEs e a pesquisa de boas práticas foram ajustados para dizer o mesmo. O ADR 0002 ficou como estava, com uma linha de referência cruzada. Agentes continuam sem adicionar `Signed-off-by`.

### O que NÃO foi verificado

- O DCO continua sem verificação automatizada; nenhuma contribuição externa passou pelo fluxo ainda.

## 2026-11-27: página pública do projeto

### O que foi feito

- `site/index.html`: página estática com o estado do projeto logo no topo (fase de especificação, sem software para instalar), o problema, o significado do nome, os 12 princípios, os 4 estados de decisão, os modos consultivo e protegido, as 4 etapas sem prazos, a compatibilidade com agentes (seguindo a matriz, sem listar como compatível o que está não confirmado), como participar, o card de atividade do GitHub e um FAQ.
- `deploy/`: script de publicação, script remoto e snippet do Nginx. O endereço do servidor vem de variável de ambiente local e não está no repositório.
- `docs/publicar-pagina.md` e uma frase em `AGENTS.md` dizendo que `site/` e `deploy/` são manutenção do projeto, com as cópias dos adaptadores regeneradas.

### O que NÃO foi verificado

- A página só foi testada em Chrome, em 375 e 1440 de largura. Contraste e foco foram revistos a olho, sem auditoria automática.
- Publicada em 2026-11-27: `/projeto/contraprova/` respondeu 200 e a forma sem barra 301, e as demais rotas públicas do site mantiveram o mesmo status de antes. O console da página no ar, aberta em Chrome headless, não mostrou erro. O Ponto e o card do GitHub não foram exercitados com interação.

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
- O `DCO` não é verificado por automação (ADR 0002); o modelo de PR pede `Signed-off-by` só em contribuição externa, e os commits do mantenedor não o têm (ADR 0008).

### Próximo passo

Abrir as primeiras RFCs sobre as perguntas em aberto, começando pelo formato do produto.
