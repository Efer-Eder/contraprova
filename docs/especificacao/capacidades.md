# Capacidades

Catálogo das capacidades descritas no [manifesto](../manifesto.md), agrupadas pelas quatro etapas da seção 26. As etapas descrevem capacidades, não tecnologias nem prazos, e esta lista também não os define. Nenhuma capacidade está implementada: o projeto está em fase de especificação.

Os identificadores `CAP-xx` são uma numeração editorial. Os princípios relacionados estão em [principios.md](principios.md).

## Resumo

| ID | Capacidade | Etapa | Origem no manifesto | Princípios |
|---|---|---|---|---|
| CAP-01 | Investigação de projetos | Fundação | 26, 6, 18 | P-01, P-05 |
| CAP-02 | Inventário de testes | Fundação | 26, 5 | P-01, P-02, P-05 |
| CAP-03 | Critérios de aceitação | Fundação | 26, 7 | P-08, P-05 |
| CAP-04 | Execução real | Fundação | 26, 18 (passo 9), 9, 24 | P-02, P-04 |
| CAP-05 | Análise de alterações | Fundação | 26, 10, 18 (passo 8) | P-01, P-07 |
| CAP-06 | Relatórios de evidências | Fundação | 26, 20, 12 | P-02, P-05, P-12 |
| CAP-07 | Geração de testes | Validação independente | 26, 8 | P-03, P-11 |
| CAP-08 | Reprodução de bugs | Validação independente | 26, 9, 12 | P-02, P-12 |
| CAP-09 | Avaliação da eficácia dos testes | Validação independente | 26, 5, 9 | P-01, P-02 |
| CAP-10 | Detecção de regressões | Validação independente | 26, 12 | P-06 |
| CAP-11 | Auditoria de agentes | Validação independente | 26, 14 | P-03, P-10 |
| CAP-12 | Políticas protegidas | Proteção efetiva | 26, 14, 15, 17 | P-03, P-04, P-08 |
| CAP-13 | Isolamento | Proteção efetiva | 26, 13, 15 | P-09 |
| CAP-14 | Verificação da esteira de publicação | Proteção efetiva | 26, 16 | P-04, P-05 |
| CAP-15 | Vinculação da aprovação ao artefato | Proteção efetiva | 26, 15, 16 | P-12, P-04 |
| CAP-16 | Configuração guiada | Experiência ampliada | 26, 19 | P-05, P-11 |
| CAP-17 | Histórico | Experiência ampliada | 26 | P-12 |
| CAP-18 | Explicações acessíveis | Experiência ampliada | 26, 19 | P-05 |
| CAP-19 | Correções assistidas | Experiência ampliada | 26, 21 | P-07, P-08 |
| CAP-20 | Integração com diferentes ambientes de desenvolvimento | Experiência ampliada | 26, 28 | P-10 |

## Etapa 1: Fundação

Texto da seção 26: investigação de projetos, inventário de testes, critérios de aceitação, execução real, análise de alterações e relatórios de evidências.

### CAP-01 Investigação de projetos

Identificar propósito, componentes, fluxos de usuário, interfaces, armazenamento, dependências, integrações, permissões, configurações, ambientes e mecanismos de execução e publicação; construir mapa de funcionalidades e riscos; separar requisitos confirmados, comportamentos observados, contratos documentados, inferências e informações desconhecidas ou contraditórias. Origem: seção 6 (e seção 18, passos 2 e 3). Princípios: P-01, P-05.

### CAP-02 Inventário de testes

Tratar testes existentes como alegações não verificadas, investigar o que cada suíte afirma proteger e classificar cada área como validada, parcialmente validada, suspeita, não verificada ou inaplicável com justificativa. Origem: seção 5. Princípios: P-01, P-02, P-05.

### CAP-03 Critérios de aceitação

Propor critérios compreensíveis por funcionalidade (entradas, ações, resultados esperados, estados proibidos, tratamento de erros, permissões, condições extremas), pedir confirmação objetiva quando necessário e versionar os critérios aprovados. Origem: seção 7. Princípios: P-05, P-08.

### CAP-04 Execução real

Executar verificações reais em ambiente apropriado, sem interpretar falha de infraestrutura como prova de qualidade e sem tratar interrupção como sucesso. Origem: seção 18 (passo 9), seção 9 e seção 24. Princípios: P-02, P-04.

### CAP-05 Análise de alterações

Comparar mudanças com uma referência previamente aprovada e protegida e detectar manipulação de testes (remoção, enfraquecimento, supressão de erros, redução da descoberta de testes, manipulação de relatórios e outras). Origem: seção 10 e seção 18 (passo 8). Princípios: P-01, P-07.

### CAP-06 Relatórios de evidências

Registrar versão analisada, escopo, ambiente, políticas aplicadas, verificações planejadas e realizadas, resultados, duração, falhas, testes ignorados, limitações e evidências reproduzíveis; separar confirmado de suspeito; nunca inventar logs, números ou execuções. Origem: seção 20 (e seção 12 para o registro de defeitos). Princípios: P-02, P-05, P-12.

## Etapa 2: Validação independente

Texto da seção 26: geração de testes, reprodução de bugs, avaliação da eficácia dos testes, detecção de regressões e auditoria de agentes.

### CAP-07 Geração de testes

Criar testes a partir dos requisitos, preferindo interfaces públicas e resultados observáveis, com expectativas calculadas independentemente da implementação, selecionando categorias conforme o risco. Origem: seção 8. Princípios: P-03, P-11.

### CAP-08 Reprodução de bugs

Reproduzir o defeito antes da alteração quando viável, demonstrar que o teste falha pela causa esperada e passa após a correção, e declarar a limitação quando não for possível reproduzir. Origem: seção 9 e seção 12. Princípios: P-02, P-12.

### CAP-09 Avaliação da eficácia dos testes

Demonstrar que a suíte consegue ficar vermelha quando deveria, inclusive com defeitos controlados introduzidos em cópias isoladas, sem usar a porcentagem de mutações detectadas como garantia absoluta. Origem: seção 5 e seção 9. Princípios: P-01, P-02.

### CAP-10 Detecção de regressões

Comparar a versão candidata com uma referência conhecida, executar fluxos relevantes e investigar efeitos colaterais. Origem: seção 12. Princípio: P-06.

### CAP-11 Auditoria de agentes

Separar implementação, geração de testes e revisão; entregar ao auditor a intenção original e evidências verificáveis; permitir contestação; tratar instruções em código, documentação, logs, páginas e respostas externas como dados não confiáveis; impedir que um agente aprove o próprio trabalho. Origem: seção 14. Princípios: P-03, P-10.

## Etapa 3: Proteção efetiva

Texto da seção 26: políticas protegidas, isolamento, verificação da esteira de publicação e vinculação da aprovação ao artefato.

### CAP-12 Políticas protegidas

Manter políticas, referências aprovadas, verificações independentes e evidências protegidas contra escrita não autorizada; basear a decisão em políticas explícitas; impedir que o agente desenvolvedor crie exceções ou altere unilateralmente a política que o fiscaliza. Origem: seção 14, seção 15 e seção 17. Princípios: P-03, P-04, P-08.

### CAP-13 Isolamento

Executar código candidato sem credenciais capazes de alterar os controles; realizar testes ativos em ambientes autorizados, isolados e com dados fictícios ou sanitizados. Origem: seção 13 e seção 15. Princípio: P-09.

### CAP-14 Verificação da esteira de publicação

Investigar se as verificações do pipeline realmente executam, se falhas bloqueiam a publicação, se há exclusões indevidas, permissões excessivas, caminhos alternativos e aprovações contornáveis; validar o bloqueio com exercícios controlados. Origem: seção 16. Princípios: P-04, P-05.

### CAP-15 Vinculação da aprovação ao artefato

Vincular resultados à versão exata do código, configuração, ambiente e artefato verificado, de modo que uma alteração relevante posterior invalide a aprovação correspondente. Origem: seção 15 e seção 16. Princípios: P-04, P-12.

## Etapa 4: Experiência ampliada

Texto da seção 26: configuração guiada, histórico, explicações acessíveis, correções assistidas e integração com diferentes ambientes de desenvolvimento.

### CAP-16 Configuração guiada

Guiar a configuração inicial e mostrar quais proteções foram realmente ativadas, sem apresentar integração não configurada como proteção ativa. Origem: seção 19. Princípios: P-05, P-11.

### CAP-17 Histórico

A seção 26 cita o histórico como capacidade, mas o manifesto não o detalha. Relaciona-se com o registro das execuções da seção 20 e com a rastreabilidade de mudanças de política da seção 23. O escopo exato é uma [pergunta em aberto](../perguntas-em-aberto.md) a refinar por RFC. Origem: seção 26. Princípio: P-12.

### CAP-18 Explicações acessíveis

Explicar problemas em linguagem humana, com detalhes técnicos expansíveis, priorizando impacto e ações necessárias. Origem: seção 19. Princípio: P-05.

### CAP-19 Correções assistidas

Propor correções, preparar instruções para o agente desenvolvedor ou, em modo autorizado, alterar o código; manter a separação entre investigação e modificação como padrão; limitar o número de tentativas. Origem: seção 21. Princípios: P-07, P-08.

### CAP-20 Integração com diferentes ambientes de desenvolvimento

A seção 26 cita a capacidade; a estratégia de integração é uma decisão deliberadamente em aberto na seção 28. Origem: seção 26 e seção 28. Princípio: P-10.

## Capacidades descritas no corpo do manifesto sem etapa na seção 26

A seção 26 não lista os itens abaixo, embora o manifesto os descreva. A atribuição a uma etapa é uma decisão pendente (veja o ponto de ambiguidade registrado em [perguntas-em-aberto.md](../perguntas-em-aberto.md)). Eles não pertencem a nenhuma das quatro etapas até que o mantenedor decida.

| ID | Capacidade | Origem | Princípios |
|---|---|---|---|
| CAP-21 | Detecção de alucinações técnicas: referências inexistentes ou incompatíveis, funcionalidades desconectadas do fluxo real, código de demonstração apresentado como completo | 11 | P-01, P-02 |
| CAP-22 | Segurança e privacidade: riscos de autenticação, autorização, exposição de dados, segredos e operações destrutivas, com minimização de dados e redação de segredos | 13 | P-09 |
| CAP-23 | Adoção gradual em projetos legados: diagnóstico inicial, priorização de fluxos críticos e dívida explícita | 22 | P-06, P-11 |
| CAP-24 | Autofiscalização do produto: cenários com projetos defeituosos, corretos e ambíguos, avaliação de falsos positivos e negativos | 23 | P-03, P-12 |
| CAP-25 | Decisão de qualidade por política: estados aprovado, bloqueado, inconclusivo e exceção autorizada | 17 | P-04, P-08 |
| CAP-26 | Distinção e exibição do modo consultivo e do modo protegido | 16 | P-05 |

Veja [estados-de-decisao.md](estados-de-decisao.md) para CAP-25 e CAP-26.
