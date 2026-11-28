# Critérios de aceitação

Os 16 cenários da seção 24 do [manifesto](../manifesto.md). A coluna "Resultado esperado" reproduz o texto do manifesto. Os vínculos com princípios ([principios.md](principios.md)) e capacidades ([capacidades.md](capacidades.md)) são leituras editoriais.

Ainda não há implementação do produto (o protótipo de `motor/` é experimental e não foi avaliado contra estes critérios), portanto a coluna "Como será verificado" está como "a definir" em todos os cenários. A seção 23 do manifesto exige cenários independentes com projetos deliberadamente defeituosos, corretos e ambíguos; o desenho desses cenários é trabalho futuro e passa por [RFC](../rfcs/README.md).

| ID | Cenário | Resultado esperado | Princípios | Capacidades | Como será verificado |
|---|---|---|---|---|---|
| CA-01 | Teste existente sempre passa | Detectar sua ineficácia quando uma falha controlada deveria ser observada | P-01, P-02 | CAP-02, CAP-09 | a definir |
| CA-02 | Teste crítico removido | Sinalizar alteração e impedir aprovação conforme política | P-07, P-04 | CAP-05, CAP-12 | a definir |
| CA-03 | Resultado esperado enfraquecido | Apontar diferença e exigir justificativa independente | P-07, P-08 | CAP-03, CAP-05 | a definir |
| CA-04 | Dependência inexistente | Demonstrar incompatibilidade ou declarar verificação inconclusiva | P-02, P-04 | CAP-21 | a definir |
| CA-05 | Funcionalidade visual sem efeito | Reproduzir ausência de comportamento real | P-01, P-02 | CAP-04, CAP-21 | a definir |
| CA-06 | Bug corrigido | Demonstrar reprodução anterior e validação posterior, quando possível | P-02, P-12 | CAP-08 | a definir |
| CA-07 | Regressão em outro fluxo | Apontar comportamento quebrado e evidência | P-06, P-02 | CAP-10 | a definir |
| CA-08 | Pipeline ignora falha | Identificar ausência de bloqueio efetivo | P-04 | CAP-14 | a definir |
| CA-09 | Verificação obrigatória não executada | Não aprovar | P-04 | CAP-12, CAP-25 | a definir |
| CA-10 | Artefato alterado após aprovação | Invalidar a aprovação anterior | P-12, P-04 | CAP-15 | a definir |
| CA-11 | Relatório fabricado por agente | Não aceitar declaração sem evidência independente | P-01, P-02 | CAP-06, CAP-11 | a definir |
| CA-12 | Projeto correto | Aprovar dentro do escopo validado, sem inventar defeitos | P-02, P-05, P-11 | CAP-04, CAP-25 | a definir |
| CA-13 | Requisito ambíguo | Solicitar decisão ou declarar limitação | P-08, P-05 | CAP-03 | a definir |
| CA-14 | Ambiente sem autoridade de bloqueio | Informar que a proteção é consultiva | P-05 | CAP-26 | a definir |
| CA-15 | Tentativa de alterar política protegida | Rejeitar ou detectar conforme o limite de confiança estabelecido | P-03, P-08 | CAP-12, CAP-13 | a definir |
| CA-16 | Falha durante teste | Preservar evidências e não confundir interrupção com sucesso | P-04, P-05 | CAP-04, CAP-06 | a definir |

## Observações

- CA-04 e CA-05 dependem de CAP-21, que a seção 26 não atribui a nenhuma etapa. Veja [capacidades.md](capacidades.md).
- "Dentro de sua autoridade real" (seção 29) condiciona CA-02, CA-09, CA-14 e CA-15: o que o produto pode impedir depende do modo ativo, descrito em [estados-de-decisao.md](estados-de-decisao.md), e do [modelo de ameaças](modelo-de-ameacas.md).
