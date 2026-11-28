# Contribuindo com o Contraprova

Obrigado pelo interesse. O Contraprova está em fase de especificação, com um protótipo experimental do motor ([ADR 0009](docs/adr/0009-prototipo-executavel-do-motor-em-paralelo.md)). Não há produto pronto, então contribuir hoje significa ler, questionar, pesquisar, escrever e, se quiser, testar e melhorar o protótipo. Este guia explica o que cabe agora e como enviar mudanças.

Ao participar, você concorda em seguir o [Código de Conduta](CODE_OF_CONDUCT.md).

## O que aceito hoje

- Revisão crítica do [manifesto](docs/manifesto.md) e da [especificação](docs/especificacao/): inconsistências, lacunas, ambiguidades, riscos não considerados.
- Pesquisa com fontes (projetos semelhantes, boas práticas, ferramentas de mutação, políticas de IA em open source), em `docs/pesquisa/`.
- [RFCs](docs/rfcs/README.md) para mudanças grandes, inclusive o formato do produto, a linguagem e a arquitetura.
- [ADRs](docs/adr/README.md) para registrar decisões já discutidas.
- Respostas e propostas para as [perguntas em aberto](docs/perguntas-em-aberto.md).
- Tradução e revisão de texto.
- Correções na documentação: erros, links quebrados, clareza.
- Melhorias no protótipo do motor, dentro das regras da seção [Como contribuir com o protótipo](#como-contribuir-com-o-protótipo).

## O que ainda não cabe

- **Código fora do protótipo.** O código só cabe em `motor/` e `skills/` (e no `package.json` da raiz), como experimento. Escolher linguagem definitiva, nova estrutura de pastas, dependências, pacote publicado ou outro formato de produto sem RFC aceita tende a ser retrabalho: PRs assim serão fechados com um pedido para começar por uma RFC.
- Afirmações sobre funcionalidades como se existissem, números de desempenho, prazos ou comparações sem fonte.
- Reescritas do manifesto sem discussão prévia. Mudanças no sentido do manifesto passam por RFC.

## Como contribuir com o protótipo

O protótipo do motor está em `motor/` e a skill em `skills/`. É experimental e de nível consultivo, e o que existe está descrito em [motor/README.md](motor/README.md).

- Precisa do Node.js 22 ou mais novo. Rode `npm test` antes de abrir o PR: ele roda os testes do motor com o `node --test`, sem instalar nada.
- Teste com asserção de verdade: ele precisa falhar quando o comportamento está errado. Não afrouxe um teste, não o ignore e não apague asserção para fazê-lo passar. Quando um defeito for corrigido, o teste que o pegaria entra junto.
- Zero dependências. Adicionar uma dependência exige autorização prévia do mantenedor, em issue.
- Mensagens do programa, relatórios e documentação do protótipo em português do Brasil, sem emoji e sem travessão.
- Não invente comandos nem funcionalidades, e não apresente o protótipo como proteção. O resultado dele recomenda e não impede nada.
- Se mexeu no motor, rode também `node motor/bin/contraprova.js verificar . --sem-prova` na raiz e diga o resultado no PR, lembrando que a eficácia dos testes não foi verificada (a prova completa sobre o próprio repositório é lenta).
- Mudança que escolha linguagem, formato ou arquitetura definitivos, ou que publique pacote, passa por RFC: o protótipo não fecha nenhuma pergunta em aberto.

## Antes de começar

1. Procure nas [issues](https://github.com/Efer-Eder/contraprova/issues) e nas RFCs abertas para não duplicar o trabalho.
2. Para qualquer coisa além de uma correção pequena, abra uma issue descrevendo o problema ou a proposta e espere uma primeira resposta antes de investir tempo.
3. Se a mudança altera o sentido de algo do manifesto, comece por uma RFC (veja [RFC, ADR ou issue](#rfc-adr-ou-issue)).

## Fluxo

1. Faça um fork do repositório e clone o seu fork.
2. Crie um branch a partir de `main` com o nome no formato `tipo/assunto`, em inglês (por exemplo `docs/fix-glossary-typo`, `rfc/product-format`).
3. Faça commits pequenos, no padrão [Conventional Commits 1.0.0](https://www.conventionalcommits.org/), em inglês, e **assinados** com `-s`, o que é exigido de contribuições externas (veja [DCO](#dco-certificado-de-origem-do-desenvolvedor)):

   ```bash
   git commit -s -m "docs: fix typo in glossary"
   git commit -s -m "docs(rfc): propose delivery format for the first release"
   git commit -s -m "docs(adr): record decision on fail-safe default"
   ```

4. Rode as verificações de documentação que puder (lint de Markdown e verificação de links, descritos em `.github/workflows/`). Se mudou o `AGENTS.md`, rode também `bash scripts/sync-agent-adapters.sh` para regenerar as cópias usadas por outras ferramentas, e confira com `bash scripts/sync-agent-adapters.sh --check`. Não edite as cópias à mão.
5. Abra um _pull request_ para `main`. O título segue Conventional Commits, porque vira o commit na `main` (squash merge).
6. Preencha o template do PR, inclusive a divulgação de uso de IA (obrigatória para quem não é mantenedor).
7. Responda à revisão e ajuste. Quando os checks estiverem verdes e a revisão aprovada, o merge é feito por squash.

### Como a `main` é protegida

- Nada entra na `main` sem PR.
- Os checks obrigatórios precisam estar verdes.
- A `main` não é apagada nem tem o histórico reescrito.

## Regras de escrita da documentação

- Escreva em português do Brasil, com acentuação correta. Só o `README.en.md` é em inglês.
- Sem emoji. Sem travessão (o caractere de traço longo): use vírgula, dois-pontos ou parênteses.
- Todo fato, número ou comparação externa precisa de **fonte com link**. Sem fonte, é opinião e deve ser escrito como opinião.
- **Nada inventado.** Não descreva comandos, instalação, funcionalidades, resultados ou prazos que não existem.
- **Distinga o verificado do não verificado.** Diga o que você de fato conferiu (e como, e quando) e o que não conferiu.
- Use datas absolutas (AAAA-MM-DD).
- Markdown limpo: um H1 por arquivo, linhas em branco ao redor de títulos e listas, blocos de código com linguagem.
- Escreva de forma neutra ou em primeira pessoa. Evite tom de resposta de assistente.

## Checklist do PR

O [template do PR](.github/PULL_REQUEST_TEMPLATE.md) traz o mesmo checklist:

- [ ] Li o CONTRIBUTING.md e o AI_POLICY.md.
- [ ] Os commits seguem Conventional Commits e, em contribuição externa, têm `Signed-off-by` do autor humano.
- [ ] Sem emoji e sem travessão nos arquivos alterados.
- [ ] Afirmações com fonte e link.
- [ ] Os links foram conferidos.
- [ ] Sem segredos, dados pessoais, e-mails ou caminhos locais.
- [ ] Nenhuma verificação foi enfraquecida (lint, links, segredos, estilo).
- [ ] Abri ADR ou RFC quando a mudança exigia.
- [ ] Atualizei o CHANGELOG quando aplicável.
- [ ] Se mudei o `AGENTS.md`, rodei `bash scripts/sync-agent-adapters.sh` e incluí as cópias geradas.

A divulgação de uso de IA (obrigatória para quem não é mantenedor, conforme a [AI_POLICY.md](AI_POLICY.md)) e a lista do que não foi verificado têm seção própria no template.

## O que esperar da revisão

Procuro dar a primeira resposta a issues e PRs em até 7 dias. Isso é um objetivo, não uma promessa: o projeto é mantido por uma pessoa, em horário próprio. A revisão é objetiva e focada na mudança: clareza, fidelidade ao manifesto, fontes e consistência. Discordância técnica é bem-vinda e deve ser argumentada. A palavra final em decisões do projeto é do mantenedor, conforme o [GOVERNANCE.md](GOVERNANCE.md).

## DCO (Certificado de Origem do Desenvolvedor)

As contribuições **externas**, isto é, de quem não é o mantenedor, são certificadas pelo [Developer Certificate of Origin 1.1](https://developercertificate.org/). Não há CLA. Ao assinar, você declara que tem o direito de contribuir aquele conteúdo sob a licença do projeto.

Os commits do mantenedor não levam `Signed-off-by`: ele é o titular do copyright e licencia o próprio trabalho diretamente pela licença do projeto ([ADR-0008](docs/adr/0008-escopo-do-dco.md)).

Para assinar, use `-s` em cada commit:

```bash
git commit -s -m "docs: clarify the inconclusive state"
```

Isso acrescenta ao final da mensagem uma linha com o seu nome e o e-mail configurados no Git:

```text
Signed-off-by: Nome Sobrenome <e-mail configurado no Git>
```

Esqueceu de assinar? Em um commit só: `git commit --amend -s --no-edit`. Em vários: `git rebase --signoff main`, e então `git push --force-with-lease` no **seu** branch de PR.

Só **humanos** assinam. Agentes de IA nunca adicionam `Signed-off-by`: quem assina é a pessoa que revisou e responde pela contribuição externa.

## Contribuições assistidas por IA

Você pode usar IA, desde que haja uma pessoa responsável no circuito. Em resumo:

- Você é o autor e responde por tudo o que enviar; precisa entender e saber defender a mudança.
- Divulgue o uso na descrição do PR e nos formulários de issue: ferramenta e extensão do uso. Mantenedores estão isentos dessa exigência; as demais regras valem para todos.
- Evidências (logs, resultados, saídas de comando) nunca podem ser inventadas.
- Agentes não abrem PR, issue nem comentário sem aprovação humana.
- Contribuição claramente não revisada pelo autor pode ser fechada sem revisão detalhada.

O texto completo, com exemplos e fontes, está na [AI_POLICY.md](AI_POLICY.md).

## RFC, ADR ou issue

| Use | Quando |
|---|---|
| **Issue** | Erro, sugestão pequena, discussão de uma pergunta em aberto. Dúvidas gerais vão para as [Discussions](https://github.com/Efer-Eder/contraprova/discussions): issues em branco estão desabilitadas, e só os formulários disponíveis podem ser usados. |
| **RFC** ([docs/rfcs/](docs/rfcs/README.md)) | Mudança grande ou de sentido: formato do produto, arquitetura, mudança em princípios ou em estados de decisão, mudança de governança ou de licença. A discussão acontece antes da decisão. |
| **ADR** ([docs/adr/](docs/adr/README.md)) | Registro de uma decisão já tomada: contexto, opções, decisão e consequências. Uma RFC aceita normalmente gera um ADR. |

## Rótulos

| Rótulo | Uso |
|---|---|
| `good first issue` | Para quem está aprendendo; não resolver com agentes nem com conteúdo majoritariamente de IA |
| `help wanted` | Ajuda externa é bem-vinda |
| `docs` | Documentação em geral |
| `especificação` | Princípios, capacidades, critérios e demais itens da especificação |
| `pesquisa` | Levantamento de fontes e estado da arte |
| `pergunta` | Pergunta em aberto de produto |
| `rfc` | Proposta de mudança grande, discutida antes de entrar |
| `adr` | Registro de decisão de arquitetura ou de processo |
| `agentes` | Instruções, papéis e protocolos para agentes de IA |
| `segurança` | Tema de segurança (vulnerabilidades vão pelo aviso privado) |
| `governança` | Governança, política e processo do projeto |
| `ci` | Workflows e verificações automáticas |
| `duplicada` | Já existe uma issue ou PR sobre o mesmo assunto |
| `inválida` | Não procede ou não se aplica ao projeto |
| `não será feito` | Fora do escopo ou rejeitado, com justificativa |
| `precisa de informação` | Aguardando mais informações de quem abriu |
| `revisão insuficiente` | Contribuição que o autor não revisou antes de enviar |

## Reconhecimento

Quem contribui é reconhecido no histórico do Git e nos registros de PR. Contribuições relevantes podem ser citadas no `CHANGELOG.md`. Se quiser ser citado (ou não) pelo nome, diga na descrição do PR.

## Mais

- [Código de Conduta](CODE_OF_CONDUCT.md)
- [Política de segurança](SECURITY.md)
- [Suporte](SUPPORT.md)
- [Governança](GOVERNANCE.md)
