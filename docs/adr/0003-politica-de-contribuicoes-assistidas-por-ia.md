---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Política de contribuições assistidas por IA

## Contexto e problema

O Contraprova trata de software feito com IA, e o próprio projeto receberá contribuições feitas com ajuda de IA. É preciso definir o que é permitido, o que precisa ser divulgado e quem responde pelo que foi enviado, de modo coerente com os princípios do manifesto: controle humano (P-08), transparência (P-05) e desconfiança inicial (P-01).

## Direcionadores da decisão

- Coerência com o manifesto: ninguém aprova o próprio trabalho, e a IA não substitui a responsabilidade humana.
- Carga de revisão sobre os mantenedores.
- Práticas observadas em outros projetos (registradas em [boas-praticas-open-source.md](../pesquisa/boas-praticas-open-source.md)).
- Manter `good first issue` útil para quem está aprendendo.

## Opções consideradas

- Proibir contribuições assistidas por IA.
- Permitir sem exigir divulgação.
- Permitir com humano responsável, divulgação obrigatória para contribuições externas e restrições a agentes autônomos.

## Resultado da decisão

Opção escolhida: permitir com humano responsável e divulgação. As regras:

1. O uso de IA é permitido, desde que haja uma pessoa responsável no circuito. A pessoa que submete é a autora para todos os efeitos, entende o que enviou e responde por isso.
2. O uso de IA deve ser divulgado, indicando a ferramenta e a extensão do uso, na descrição do PR e nos formulários de issue. Essa exigência vale para contribuições externas (quem não é mantenedor). Os mantenedores estão isentos dela, como na [política do Ghostty](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md), cujas regras valem só para contribuições externas.
3. Agentes não abrem PR, issue nem comentário sem aprovação humana prévia do conteúdo.
4. Agentes não adicionam `Signed-off-by`. Somente uma pessoa certifica o [DCO](0002-licenca-mit-provisoria-e-dco.md).
5. Issues marcadas como `good first issue`: esse rótulo é reservado a pessoas que estão aprendendo; não deve ser resolvido por agentes nem com conteúdo gerado majoritariamente por IA.
6. Uma contribuição que a pessoa autora não revisou pode ser fechada sem revisão detalhada.
7. Todas as regras acima, exceto a exigência de divulgação, valem para todos, inclusive mantenedores: responsabilidade humana, nada de evidência inventada, agentes sem ação sem aprovação humana e agentes sem `Signed-off-by`.

O texto operacional vive em `AI_POLICY.md` na raiz e em [agentes](../agentes/README.md).

## Consequências

- Bom, porque a responsabilidade fica com uma pessoa identificável.
- Bom, porque a divulgação ajuda a calibrar a revisão.
- Bom, porque protege a função de aprendizado das issues iniciais.
- Ruim, porque a divulgação depende de boa-fé e não é verificável por completo.
- Ruim, porque exige que o mantenedor aplique a regra de fechamento sem revisão com consistência.
- Bom, porque a isenção dos mantenedores segue a prática do Ghostty e evita um ritual sem efeito sobre a revisão ([PA-12](../perguntas-em-aberto.md), decidida em 2026-11-27).
- Ruim, porque os mantenedores deixam de dar o exemplo de divulgar, e a transparência sobre o uso de IA nas contribuições deles fica a critério de cada um.

## Confirmação

Modelo de PR e formulários de issue com campo de divulgação de IA (no PR, mantenedores podem deixar o campo em branco; nos formulários de issue, escolhem a opção de mantenedor); revisão humana que verifica o campo; fechamento de contribuições que a autora não consegue defender. Não há verificação automatizada de uso de IA.

## Prós e contras das opções

### Proibir

- Bom, porque é simples de enunciar.
- Ruim, porque é inaplicável na prática e contraditório com o objeto do projeto.

### Permitir sem divulgação

- Bom, porque tem menos atrito.
- Ruim, porque tira do revisor uma informação útil e contraria a transparência.

### Permitir com humano responsável e divulgação

- Bom, porque equilibra abertura e responsabilidade.
- Ruim, porque aumenta a regra a seguir por quem contribui.

## Mais informações

Referências de práticas semelhantes, cada uma com a fonte:

- LLVM: <https://llvm.org/docs/AIToolPolicy.html>
- Ghostty: <https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md>
- Kernel Linux: <https://docs.kernel.org/process/coding-assistants.html> e <https://docs.kernel.org/process/generated-content.html>
- Estudo sobre políticas de IA em 1.000 repositórios: <https://arxiv.org/abs/2605.16706>

Detalhes e o que não foi confirmado em [boas-praticas-open-source.md](../pesquisa/boas-praticas-open-source.md). Guia para quem contribui com agentes: [agentes/README.md](../agentes/README.md).
