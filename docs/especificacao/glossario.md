# Glossário

Termos usados no [manifesto](../manifesto.md), definidos apenas com o que o texto sustenta. Onde o manifesto não define, o glossário diz isso. Ordem alfabética.

## Agente desenvolvedor

Agente que implementa alterações no software (seção 18, passo 7). Nenhum agente aprova sozinho o próprio trabalho nem altera unilateralmente a política que o fiscaliza (seção 14). Não cria exceções silenciosamente (seção 17).

## Alucinação técnica

Referência inexistente ou incompatível com a realidade do projeto: arquivos, funções, métodos, dependências, parâmetros, configurações, interfaces, campos, contratos ou serviços externos (seção 11). O manifesto distingue incompatibilidade comprovada, suspeita e impossibilidade de verificar, e não manda classificar automaticamente um comportamento desconhecido como alucinação.

## Aprovado, bloqueado, inconclusivo, exceção autorizada

Os quatro estados mínimos de decisão. Veja [estados-de-decisao.md](estados-de-decisao.md).

## Artefato

O resultado entregue que é verificado e publicado. A aprovação é vinculada à versão exata do artefato verificado; alteração relevante posterior a invalida (seção 15). O manifesto não define formato de artefato.

## Auditor

Quem revisa o trabalho do implementador, recebendo a intenção original e evidências verificáveis, não apenas o resumo do desenvolvedor (seção 14).

## Contestação

Possibilidade de questionar resultados, investigar divergências e revisar alterações sugeridas (seção 14).

## Contrato de comportamento

Conjunto de critérios de aceitação compreensíveis de uma funcionalidade relevante: entradas, ações, resultados esperados, estados proibidos, tratamento de erros, permissões e condições extremas. Os critérios aprovados são versionados, e alterar a expectativa de um teste não altera silenciosamente o contrato (seção 7).

## Critério de aceitação

Condição observável que define se uma funcionalidade atende ao esperado. Não confundir com os critérios de aceitação do produto (seção 24), listados em [criterios-de-aceitacao.md](criterios-de-aceitacao.md).

## Defeito controlado

Defeito introduzido deliberadamente em cópia isolada do código para avaliar se os testes o detectam, como inversão de condições, remoção de validações, resultados incorretos e alteração de limites. Nunca em produção; as cópias são descartadas após a investigação (seção 9).

## Dívida explícita

Defeitos e riscos antigos mantidos visíveis no relatório em projetos legados. Uma política pode permitir alterações que não agravem riscos conhecidos, mas riscos proibidos continuam bloqueando a publicação (seção 22).

## Esteira de publicação

O pipeline que leva uma alteração à publicação (também chamado pipeline no manifesto). Não é confiável apenas por existir ou por mostrar status verde: o produto investiga se as verificações executam e se falhas bloqueiam a publicação (seção 16).

## Evidência

Resultado observado, de origem identificável e com proteção proporcional contra alteração: logs reais, resultados estruturados, diferenças de código, reprodução de erros e capturas de interface quando pertinentes (seção 20). Tem prioridade sobre conclusões de modelos (princípio P-02). Declaração de agente, por si só, não é evidência.

## Exceção autorizada

Risco conhecido aceito explicitamente por pessoa autorizada, com justificativa, escopo e validade (seção 17).

## Modo consultivo

Modo em que o produto apenas recomenda não publicar (seção 16).

## Modo protegido

Modo em que o produto tem integração e autoridade para impedir a publicação. Nele, os estados bloqueado e inconclusivo impedem a publicação (seções 16 e 17).

## Mutação

Alteração deliberada e controlada do código (defeito controlado) usada para avaliar a eficácia dos testes. O manifesto cita "mutações detectadas" como indicador auxiliar, nunca como garantia absoluta (seções 9 e 17). Uma mutação sobrevivente exige investigação: pode ser lacuna real ou alteração equivalente ao comportamento original.

## Não regressão

Princípio P-06: corrigir uma funcionalidade não autoriza quebrar outra.

## Referência aprovada

Referência previamente aprovada e protegida, contra a qual as alterações são comparadas para detectar manipulação de testes (seção 10). Também chamada de referência de comparação (seção 15) e de referência versionada (seção 18, passo 6). A referência inicial de um projeto legado não é certificado de qualidade: registra o estado observado e os critérios efetivamente validados (seção 22).

## Regressão

Comportamento que funcionava na referência conhecida e deixou de funcionar na versão candidata (seção 12). Ao registrar um problema, o manifesto pede classificá-lo como regressão, defeito preexistente ou de origem desconhecida.

## Teste suspeito

Classificação de uma área de testes: o manifesto usa "suspeita" entre as classes validada, parcialmente validada, suspeita, não verificada e inaplicável com justificativa (seção 5).

## Vibe coder

Pessoa que pratica vibe coding. O usuário ideal não precisa saber escrever testes: precisa conseguir explicar o que quer que o software faça (seções 2 e 3).

## Vibe coding

Prática de pedir a uma IA que construa software, às vezes um sistema inteiro, sem necessariamente saber avaliar seus testes, regressões, esteira de publicação ou falhas de segurança (seção 1). O manifesto usa o termo sem defini-lo formalmente; a definição aqui é a descrição do contexto de uso.
