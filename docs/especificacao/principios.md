# Princípios

Os 12 princípios inegociáveis da seção 4 do [manifesto](../manifesto.md), com identificador estável. O texto de cada princípio é o do manifesto. A coluna de seções indica onde o manifesto o concretiza; a leitura é editorial e está sujeita a revisão.

Referências: [capacidades](capacidades.md), [critérios de aceitação](criterios-de-aceitacao.md).

## Tabela de rastreabilidade

| ID | Nome | Seções que o concretizam |
|---|---|---|
| P-01 | Desconfiança inicial | 1, 5, 10, 11, 20 |
| P-02 | Evidência antes de opinião | 2, 9, 12, 14, 20 |
| P-03 | Independência | 8, 14, 15, 16, 23 |
| P-04 | Falha segura | 16, 17, 24 |
| P-05 | Transparência | 5, 6, 15, 16, 19, 20 |
| P-06 | Não regressão | 12, 18, 22 |
| P-07 | Não manipulação | 10, 21 |
| P-08 | Controle humano | 7, 10, 17, 21 |
| P-09 | Privilégio mínimo | 13, 15, 16, 27 |
| P-10 | Neutralidade | 27, 28 |
| P-11 | Proporcionalidade | 8, 17, 19, 22 |
| P-12 | Reprodutibilidade | 9, 15, 20, 23 |

## P-01 Desconfiança inicial

Texto do manifesto: nenhum teste, relatório, comentário, documentação ou declaração de agente é considerado verdadeiro apenas por existir.

Concretizado em: seção 5 (testes existentes tratados como alegações ainda não verificadas), seção 10 (comparação com referência aprovada), seção 11 (referências técnicas confrontadas com a realidade), seção 20 (evidências com origem identificável) e seção 1 (o problema que motiva o projeto).

## P-02 Evidência antes de opinião

Texto do manifesto: resultados observados têm prioridade sobre conclusões de modelos.

Concretizado em: seção 2 (não confundir ausência de evidência de erro com evidência de funcionamento), seção 9 (provar que os testes funcionam), seção 12 (defeitos registrados com evidências reais), seção 14 (votos de vários modelos não substituem execução real) e seção 20 (relatórios).

## P-03 Independência

Texto do manifesto: quem implementa não deve controlar sozinho os critérios de aprovação.

Concretizado em: seção 8 (testes criados a partir dos requisitos, não da lógica do código), seção 14 (separação de responsabilidades e auditor independente), seção 15 (políticas e referências protegidas contra escrita não autorizada), seção 16 (políticas independentes) e seção 23 (o produto não é a única autoridade sobre sua própria integridade).

## P-04 Falha segura

Texto do manifesto: verificações obrigatórias ausentes, interrompidas ou inconclusivas não equivalem a sucesso.

Concretizado em: seção 16 (resultado ausente ou interrompido não é aprovação), seção 17 (em modo protegido, bloqueado e inconclusivo impedem a publicação) e seção 24 (cenários de verificação obrigatória não executada e de falha durante teste).

## P-05 Transparência

Texto do manifesto: toda conclusão deve indicar sua origem, escopo e limitações.

Concretizado em: seção 5 (classificação das áreas com justificativa), seção 6 (separação entre requisitos confirmados, observados, documentados, inferidos e desconhecidos), seção 15 (informar a condição em que nenhuma ferramenta local garante proteção), seção 16 (exibir o modo ativo), seção 19 (mostrar quais proteções foram realmente ativadas) e seção 20 (relatórios).

## P-06 Não regressão

Texto do manifesto: corrigir uma funcionalidade não autoriza quebrar outra.

Concretizado em: seção 12 (comparação com referência conhecida e investigação de efeitos colaterais), seção 18 (passos de comparação e nova execução) e seção 22 (alterações que não agravem riscos conhecidos em projetos legados).

## P-07 Não manipulação

Texto do manifesto: testes não podem ser enfraquecidos silenciosamente para acomodar código incorreto.

Concretizado em: seção 10 (proteção contra manipulação de testes) e seção 21 (correções automáticas não podem alterar requisitos, testes protegidos, políticas ou credenciais para obter aprovação).

## P-08 Controle humano

Texto do manifesto: mudanças de requisitos, exceções e riscos aceitos precisam ser explícitos.

Concretizado em: seção 7 (pedir confirmação objetiva quando uma decisão de produto não puder ser deduzida), seção 10 (mudanças que alteram requisitos exigem aprovação humana), seção 17 (exceção autorizada por pessoa autorizada, nunca criada silenciosamente pelo agente desenvolvedor) e seção 21 (encaminhamento ao usuário quando necessário).

## P-09 Privilégio mínimo

Texto do manifesto: analisar um projeto não deve exigir acesso irrestrito a produção, segredos ou contas administrativas.

Concretizado em: seção 13 (ambientes autorizados e isolados, minimização de dados), seção 15 (a execução de código candidato não recebe credenciais capazes de alterar os controles), seção 16 (credenciais restritas) e seção 27 (nenhuma ação sem as permissões necessárias).

## P-10 Neutralidade

Texto do manifesto: a confiança não depende da marca do agente que escreveu o código.

Concretizado em: seção 27 (não exigir a mesma arquitetura de todos os projetos) e seção 28 (formato e integração em aberto). O manifesto não desenvolve este princípio em uma seção própria; a leitura é editorial.

## P-11 Proporcionalidade

Texto do manifesto: verificações devem considerar risco, tamanho e contexto do projeto, sem esconder lacunas.

Concretizado em: seção 8 (não exigir todas as categorias de teste de todo projeto e justificar o que ficou de fora), seção 17 (métricas auxiliares não compensam falhas críticas), seção 19 (verificações rápidas e profundas sem confundir os níveis de garantia) e seção 22 (adoção gradual priorizando fluxos críticos).

## P-12 Reprodutibilidade

Texto do manifesto: outra execução equivalente deve conseguir verificar a mesma evidência, respeitando fontes legítimas de variabilidade.

Concretizado em: seção 9 (reproduzir o defeito antes da correção), seção 15 (resultados vinculados à versão exata do código, configuração, ambiente e artefato), seção 20 (evidências reproduzíveis) e seção 23 (cenários independentes e avaliação de falsos positivos e negativos).
