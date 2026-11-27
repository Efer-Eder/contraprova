# Modelo de ameaças

Estruturação da seção 15 do [manifesto](../manifesto.md), com apoio das seções 13, 14 e 16. Não acrescenta ameaças que o manifesto não cita. Nada aqui descreve controles implementados.

## Ameaças consideradas

### Agentes (por erro ou comportamento adversarial)

Agentes que tentem:

- contornar verificações;
- modificar o executor;
- falsificar relatórios;
- detectar o ambiente de teste;
- esconder código executável;
- alterar a referência de comparação;
- publicar por fora do fluxo autorizado.

### Cadeia e ambiente

- dependências comprometidas;
- execução de código não confiável;
- vazamento de credenciais;
- alterações concorrentes;
- substituição do artefato depois da validação.

### Conteúdo hostil como instrução

Instruções encontradas em código, documentação, logs, páginas e respostas externas são dados não confiáveis (seção 14). Não podem conceder permissões, desativar políticas ou ordenar publicação.

## Ativos a proteger

O manifesto trata os ativos de dois modos diferentes. Não são a mesma proteção.

### Protegidos contra escrita não autorizada

A seção 15 manda manter estes ativos protegidos contra escrita não autorizada:

| Ativo | Fonte no manifesto |
|---|---|
| Políticas | seção 15 |
| Referências aprovadas | seção 15 |
| Verificações independentes | seção 15 |
| Evidências | seção 15 e seção 20 |

### Risco de exposição

Para estes itens, o manifesto trata o risco de exposição, não a escrita não autorizada:

| Ativo | Fonte no manifesto |
|---|---|
| Credenciais capazes de alterar os controles acima (a execução de código candidato não deve recebê-las; o vazamento de credenciais é uma ameaça considerada) | seção 15 |
| Segredos, dados privados e produção | seção 13 e princípio [P-09](principios.md) |

### Integridade do resultado

O artefato verificado não é um dos ativos acima: o manifesto trata a substituição do artefato depois da validação como ameaça e vincula a aprovação à versão exata verificada (seção 15).

## Limites de confiança

- A execução de código candidato não deve receber credenciais capazes de alterar políticas, referências aprovadas, verificações independentes e evidências.
- Resultados são vinculados à versão exata do código, da configuração, do ambiente e do artefato verificado. Uma alteração relevante posterior invalida a aprovação correspondente.
- Nenhum agente aprova sozinho o próprio trabalho nem altera unilateralmente a política que o fiscaliza (seção 14).
- O Contraprova não pode ser a única autoridade sobre sua própria integridade (seção 23).
- Testes ativos ocorrem em ambientes autorizados, isolados e com dados fictícios ou sanitizados (seção 13).

O manifesto não define onde, na prática, ficam esses limites. A resposta depende do formato do produto ([PA-01](../perguntas-em-aberto.md)) e do desenho de arquitetura ([PA-04](../perguntas-em-aberto.md)).

## A condição em que nenhuma ferramenta local garante nada

Se o agente possuir controle administrativo sobre toda a máquina, contas e publicação, uma ferramenta local não consegue garantir que suas proteções sejam invioláveis. O produto deve reconhecer e informar essa condição, nunca simular uma garantia inexistente (seção 15).

Consequências diretas, todas presentes no manifesto:

- A autoridade do produto é sempre "dentro de sua autoridade real" (seção 29).
- Qualquer formato escolhido precisa declarar seus limites de autoridade (seção 28).
- Uma skill baseada só em instruções não é bloqueio técnico (seção 28).
- Uma versão inicial consultiva não deve ser anunciada como proteção inviolável (seção 26).
- O modo ativo deve ser exibido ([estados-de-decisao.md](estados-de-decisao.md)).

## Cenários relacionados

[CA-10](criterios-de-aceitacao.md) (artefato alterado após aprovação), [CA-11](criterios-de-aceitacao.md) (relatório fabricado), [CA-14](criterios-de-aceitacao.md) (ambiente sem autoridade de bloqueio) e [CA-15](criterios-de-aceitacao.md) (tentativa de alterar política protegida).
