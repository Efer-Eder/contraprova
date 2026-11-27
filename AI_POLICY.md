# Política de contribuições assistidas por IA

Esta política vale para qualquer contribuição ao Contraprova (PRs, issues, comentários, RFCs, ADRs, traduções). Ela formaliza o [ADR 0003](docs/adr/0003-politica-de-contribuicoes-assistidas-por-ia.md).

A exigência de **divulgar o uso de IA** vale para contribuições externas, isto é, de quem não é mantenedor. Os mantenedores estão isentos dela, como na [política do Ghostty](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md), cujas regras valem só para contribuições externas. Todas as outras regras (responsabilidade humana, nada de evidência inventada, agentes sem ação sem aprovação humana, agentes sem `Signed-off-by`) valem para todos, inclusive mantenedores.

## Resumo

1. Usar IA é permitido, desde que haja uma pessoa responsável no circuito.
2. Quem contribui é o autor e responde por tudo o que envia; precisa entender e saber defender a mudança.
3. Quem não é mantenedor deve divulgar o uso de IA na descrição do PR e nos formulários de issue (ferramenta e extensão do uso). Mantenedores estão isentos dessa exigência.
4. Agentes não abrem PR, issue nem comentário sem aprovação humana, e não adicionam `Signed-off-by`.
5. Evidências (logs, resultados, saídas de comando) nunca podem ser inventadas.
6. Contribuição claramente não revisada pelo autor pode ser fechada sem revisão detalhada.

## O que é permitido

- Usar assistentes e agentes de IA para pesquisar, rascunhar, revisar, traduzir, resumir ou sugerir correções.
- Usar IA para entender o repositório e preparar uma contribuição que você revisa e assume.
- Enviar texto ou conteúdo gerado ou editado por IA, desde que cumpra a seção seguinte.

## O que é exigido

- **Humano responsável.** Uma pessoa lê, entende, edita e assume o conteúdo antes de enviar. Você é o autor.
- **Entendimento.** Você precisa saber explicar e defender cada parte da mudança nas revisões, sem delegar a resposta à IA.
- **Divulgação (contribuições externas).** Se você não é mantenedor, informe na descrição do PR e nos formulários de issue que usou IA, qual ferramenta e em que extensão (veja [como divulgar](#como-divulgar)). Mantenedores estão isentos desta exigência; todas as outras regras desta política valem para eles também.
- **Direito de contribuir.** Você precisa ter o direito de contribuir o conteúdo sob a licença do projeto, e certificar isso pelo DCO (`git commit -s`). Não envie conteúdo copiado de fontes cuja licença você desconhece, nem saída de IA que reproduza material protegido.
- **Fontes verdadeiras.** Todo link, citação, número e referência deve ter sido conferido por você. Referências inexistentes ou inventadas são um defeito grave.
- **Evidência real.** Logs, resultados de testes, saídas de comandos e capturas apresentados como evidência devem ter sido produzidos de fato. Nunca invente ou "reconstitua" evidências.
- **Assinatura humana.** O `Signed-off-by` é de uma pessoa, que certifica o DCO.

## O que não é aceito

- Contribuição que o autor claramente não revisou: texto genérico, erros evidentes, referências que não existem, descrição que não corresponde à mudança.
- Evidências, logs, resultados ou fontes inventados ou não verificados apresentados como reais.
- PRs, issues ou comentários abertos por agentes autônomos sem aprovação humana.
- `Signed-off-by` adicionado por um agente.
- Uso de IA em issues `good first issue`. Esse rótulo é reservado a pessoas que estão aprendendo; não deve ser resolvido por agentes nem com conteúdo gerado majoritariamente por IA.
- Conteúdo que você não tem direito de contribuir sob a licença do projeto.
- Qualquer tentativa de ocultar o uso de IA em contribuição externa, quando ele foi relevante.

## Como divulgar

Na descrição do PR, diga em poucas linhas: a ferramenta, para que foi usada e o que você revisou. Exemplo:

```text
Uso de IA: sim.
Ferramenta: assistente de IA de uso geral.
Extensão: rascunho inicial do parágrafo sobre falha segura e sugestão de
exemplos. Reescrevi o texto final, conferi todos os links e a aderência
ao manifesto (seção 4, princípio 4).
Revisão: li o diff completo e consigo explicar cada alteração.
```

Se não usou IA, escreva "Uso de IA: não". O template de PR e os formulários de issue têm um campo para isso. No PR, mantenedores podem deixá-lo em branco; nos formulários de issue, escolhem a opção "Sou mantenedor (isento da divulgação)". Divulgar não é motivo de punição: o objetivo é transparência, e a revisão se adapta ao nível de risco.

## Agentes autônomos

Um agente que trabalha neste repositório deve seguir [AGENTS.md](AGENTS.md) e [docs/agentes/](docs/agentes/README.md). Em especial:

- Agentes **não** abrem PR, issue nem comentam sem aprovação humana explícita.
- Quem opera o agente é responsável por tudo o que ele produz, como se fosse seu.
- Agentes não alteram esta política, os workflows de verificação ou as proteções do repositório para fazer um PR passar.
- Agentes não atuam em issues `good first issue`.

## Signed-off-by

O `Signed-off-by` do [DCO 1.1](https://developercertificate.org/) é uma certificação feita por uma pessoa de que ela tem o direito de contribuir. **Agentes de IA não adicionam `Signed-off-by`.** A pessoa que revisou e assume a contribuição assina com `git commit -s`, depois de conferir o conteúdo. Um commit com `Signed-off-by` de um agente é tratado como não certificado.

## Contribuições de baixa qualidade

- Contribuição claramente não revisada pelo autor pode ser **fechada sem revisão detalhada**, com uma explicação curta e um convite para reenviar depois da revisão.
- Reincidência pode levar à restrição de participação, conforme o [Código de Conduta](CODE_OF_CONDUCT.md).
- Evidência inventada é tratada como violação grave, porque ataca o que o projeto defende.
- A decisão é do mantenedor e pode ser discutida em issue, sem que isso obrigue a revisar o conteúdo.

## Por que esta política

O manifesto do Contraprova defende que ninguém deve confiar em um resultado só porque uma IA afirma que ele está certo. A política aplica isso ao próprio repositório:

- **Evidência antes de opinião** (princípio 2): a contribuição precisa trazer fontes e evidências verdadeiras, não afirmações.
- **Controle humano** (princípio 8): decisões, exceções e riscos aceitos são de pessoas, e um humano responde por cada contribuição.
- **Independência** (princípio 3) e a regra de que nenhum agente aprova o próprio trabalho: quem gera o conteúdo não é quem o certifica.
- **Transparência** (princípio 5): divulgar o uso de IA permite à revisão calibrar o esforço e o risco.

Também há um motivo prático: revisar texto não verificado custa tempo de quem mantém, e isso é um recurso escasso em um projeto com um só mantenedor.

## Fontes

Esta política foi escrita a partir de práticas de outros projetos, e não é cópia de nenhuma:

- LLVM, [AI Tool Policy](https://llvm.org/docs/AIToolPolicy.html).
- Ghostty, [AI Policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md).
- Kernel Linux, [AI Coding Assistants](https://docs.kernel.org/process/coding-assistants.html) e [Generated content](https://docs.kernel.org/process/generated-content.html).
- Estudo [arXiv:2605.16706](https://arxiv.org/abs/2605.16706), que analisou 118 políticas de IA em 1.000 repositórios: 78% permitem o uso, 51% exigem divulgação e 74% exigem um humano no circuito (números lidos no resumo do artigo em 2026-11-27; li só o resumo, não o artigo completo, e não os reanalisei).

Esta política pode mudar por RFC. Mudanças são rastreáveis pelo histórico do Git, conforme o [GOVERNANCE.md](GOVERNANCE.md).
