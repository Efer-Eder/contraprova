# Contraprova — Manifesto e especificação de produto

> Desenvolva com IA. Valide com evidências.
>
> Nunca confie em uma IA apenas porque ela afirma que seu código funciona. Exija provas.

**Natureza:** proposta de produto open source, independente de implementação.

## 1. A história do projeto

O Contraprova nasce de um problema vivido por quem pratica vibe coding: a capacidade de construir software cresceu mais rapidamente do que a capacidade de verificar sua qualidade. Uma pessoa consegue pedir a uma IA que construa um sistema inteiro, mas pode não saber avaliar seus testes, identificar regressões, configurar uma esteira de publicação ou reconhecer uma falha de segurança.

O agente escreve o código, cria testes, executa comandos e anuncia que terminou. Porém, um teste aprovado pode verificar o comportamento errado. Um erro pode ser silenciado. Uma dependência pode ser inventada. Uma funcionalidade pode existir apenas visualmente. Um pipeline pode estar verde porque não executou as verificações necessárias.

O problema não pressupõe intenção maliciosa da IA: otimizar para concluir uma tarefa pode produzir soluções que parecem corretas sem realmente satisfazer a necessidade original.

O Contraprova existe para separar a construção do software da verificação de sua qualidade. Ele deve permitir que pessoas desenvolvam com IA sem depender exclusivamente da palavra da própria IA para saber se o resultado funciona.

## 2. Visão

Ser uma camada independente de confiança para software desenvolvido com assistência de IA, capaz de investigar, testar, contestar, explicar e, quando houver autoridade técnica para isso, impedir a publicação de alterações que não tenham evidências suficientes de qualidade.

O usuário ideal não precisa saber escrever testes. Precisa conseguir explicar o que deseja que o software faça. O Contraprova transforma essa intenção em verificações observáveis, apresenta dúvidas quando necessário e traduz resultados técnicos em consequências compreensíveis.

O produto não promete software sem bugs. Promete não confundir ausência de evidência de erro com evidência de funcionamento.

## 3. Público e problemas atendidos

- Vibe coders que não dominam testes, segurança ou publicação.
- Desenvolvedores individuais que delegam implementação a agentes.
- Mantenedores de projetos open source que recebem código gerado por IA.
- Equipes que desejam uma segunda camada de verificação independente.
- Pessoas que herdaram projetos com testes incompletos, documentação desatualizada ou configurações desconhecidas.

O produto deve servir tanto a um projeto novo quanto a um sistema existente, sem exigir que o usuário reescreva tudo para começar.

## 4. Princípios inegociáveis

1. **Desconfiança inicial:** nenhum teste, relatório, comentário, documentação ou declaração de agente é considerado verdadeiro apenas por existir.
2. **Evidência antes de opinião:** resultados observados têm prioridade sobre conclusões de modelos.
3. **Independência:** quem implementa não deve controlar sozinho os critérios de aprovação.
4. **Falha segura:** verificações obrigatórias ausentes, interrompidas ou inconclusivas não equivalem a sucesso.
5. **Transparência:** toda conclusão deve indicar sua origem, escopo e limitações.
6. **Não regressão:** corrigir uma funcionalidade não autoriza quebrar outra.
7. **Não manipulação:** testes não podem ser enfraquecidos silenciosamente para acomodar código incorreto.
8. **Controle humano:** mudanças de requisitos, exceções e riscos aceitos precisam ser explícitos.
9. **Privilégio mínimo:** analisar um projeto não deve exigir acesso irrestrito a produção, segredos ou contas administrativas.
10. **Neutralidade:** a confiança não depende da marca do agente que escreveu o código.
11. **Proporcionalidade:** verificações devem considerar risco, tamanho e contexto do projeto, sem esconder lacunas.
12. **Reprodutibilidade:** outra execução equivalente deve conseguir verificar a mesma evidência, respeitando fontes legítimas de variabilidade.

## 5. O que significa não confiar nos testes existentes

O Contraprova não deve apagar ou ignorar automaticamente testes antigos. Eles podem conter conhecimento valioso. Deve tratá-los como alegações ainda não verificadas.

Para cada suíte relevante, investigar:

- O que o teste afirma proteger e se isso corresponde a um requisito real.
- Se ele é efetivamente descoberto e executado.
- Se suas verificações distinguem sucesso de falha.
- Se falha pelo motivo correto quando o comportamento protegido é quebrado.
- Se depende de simulações que escondem defeitos reais.
- Se verifica apenas detalhes internos ou resultados observáveis.
- Se contém caminhos condicionais que evitam verificações, tolerâncias excessivas, resultados fixos ou exceções silenciadas.
- Se há testes duplicados, vazios, ignorados, instáveis ou desconectados do produto.
- Se o ambiente de teste representa adequadamente o comportamento que se pretende verificar.

Classificar cada área como validada, parcialmente validada, suspeita, não verificada ou inaplicável com justificativa. Preservar os testes existentes como evidência complementar, mas criar verificações independentes para comportamentos críticos.

Uma suíte verde não basta. O produto deve tentar demonstrar que a suíte consegue ficar vermelha quando deveria.

## 6. Descoberta e compreensão do projeto

Antes de avaliar alterações, o Contraprova deve identificar o propósito do sistema, seus componentes, fluxos de usuário, interfaces, armazenamento, dependências, integrações, permissões, configurações, ambientes, mecanismos de execução e publicação.

Deve construir um mapa de funcionalidades e riscos, incluindo funcionalidades aparentemente incompletas, código inacessível, dados fictícios, serviços simulados e comportamentos não documentados.

Deve separar claramente:

- Requisitos explicitamente confirmados pelo usuário.
- Comportamentos observados em execução.
- Contratos documentados, ainda sujeitos a validação.
- Inferências obtidas a partir do código.
- Informações desconhecidas ou contraditórias.

O comportamento atual não é automaticamente o comportamento correto. Quando documentação, código e intenção divergem, apresentar o conflito. Não inventar requisitos para preencher lacunas.

## 7. Contrato de comportamento

Cada funcionalidade relevante deve possuir critérios de aceitação compreensíveis: entradas, ações, resultados esperados, estados proibidos, tratamento de erros, permissões e condições extremas.

O Contraprova deve propor critérios com base na solicitação original, contratos confiáveis e investigação independente. Quando uma decisão de produto não puder ser deduzida com segurança, pedir confirmação objetiva ao usuário.

Exemplo: em uma recuperação de senha, o usuário deve conseguir recuperar a conta com um token válido; tokens vencidos ou reutilizados devem ser rejeitados; uma conta não deve poder ser alterada por outra pessoa sem autorização.

Os critérios aprovados devem ser versionados. Alterar a expectativa de um teste não deve alterar silenciosamente o contrato que o teste protege.

## 8. Geração independente de testes

O produto deve criar testes a partir dos requisitos, não apenas copiar a lógica do código implementado. Sempre que possível, utilizar interfaces públicas e resultados observáveis, com expectativas calculadas independentemente da implementação.

Deve selecionar verificações adequadas ao risco:

- Unitárias: comportamento isolado e regras de negócio.
- Integração: comunicação real entre componentes e serviços em ambientes seguros.
- Contrato: compatibilidade de entradas, saídas e interfaces.
- Ponta a ponta: jornadas completas, inclusive erros e recuperação.
- Regressão: funcionalidades existentes e defeitos anteriormente corrigidos.
- Casos extremos: valores vazios, limites, entradas inválidas e estados inesperados.
- Propriedades e invariantes: regras que devem permanecer verdadeiras em muitas combinações de entradas.
- Concorrência: operações simultâneas, duplicidade e condições de corrida.
- Segurança: permissões, isolamento, validação e exposição de informações.
- Desempenho: latência, recursos e degradação, conforme limites acordados.
- Resiliência: indisponibilidade, interrupções, reinícios e recuperação.
- Interface e acessibilidade: interações, estados visuais e barreiras de uso, quando aplicáveis.
- Instalação, atualização e publicação: funcionamento do produto entregue, não apenas do ambiente de desenvolvimento.

Não exigir indiscriminadamente todas as categorias para todo projeto. Justificar quais foram executadas e quais ficaram de fora.

## 9. Provar que os testes funcionam

Para correções de bugs, reproduzir o defeito antes da alteração, quando viável. Demonstrar que o teste falha pela causa esperada e passa após a correção. Se não for possível reproduzir, declarar a limitação.

Para funcionalidades novas, verificar que o teste detecta ausência ou comportamento incorreto da funcionalidade, evitando interpretar uma falha de infraestrutura como prova de qualidade.

Introduzir defeitos controlados em cópias isoladas do código para avaliar a capacidade dos testes de detectá-los: inversões de condições, remoção de validações, resultados incorretos e alterações de limites, por exemplo.

Se um defeito artificial sobreviver, investigar se existe lacuna real ou se a alteração é equivalente ao comportamento original. Não usar uma porcentagem de mutações detectadas como garantia absoluta.

Nunca introduzir defeitos deliberados em produção. Descartar as cópias modificadas após a investigação.

## 10. Proteção contra manipulação de testes

Comparar alterações com uma referência previamente aprovada e protegida. Detectar, entre outros:

- Remoção ou desativação de testes.
- Redução de verificações e troca de condições específicas por genéricas.
- Alteração de resultados esperados sem mudança autorizada de requisito.
- Aumento injustificado de tolerâncias, limites ou tentativas.
- Substituição de integrações reais por simulações que sempre passam.
- Exclusão de arquivos ou caminhos da cobertura.
- Captura silenciosa de exceções e supressão de erros.
- Alteração de dados de teste para evitar cenários problemáticos.
- Atualização indiscriminada de referências visuais ou resultados esperados.
- Redução da quantidade de testes descobertos ou executados.
- Manipulação de relatórios, códigos de saída e indicadores de sucesso.

Nem toda alteração de teste é indevida. O produto deve explicar a diferença entre uma atualização legítima e uma redução suspeita da proteção. Mudanças sensíveis exigem revisão independente e, quando alteram requisitos, aprovação humana.

## 11. Detecção de alucinações técnicas

Investigar referências inexistentes ou incompatíveis: arquivos, funções, métodos, dependências, parâmetros, configurações, interfaces, campos, contratos e serviços externos.

Confrontar alegações com a versão efetivamente utilizada, documentação pertinente, inspeção do projeto e execução controlada. Verificar se funcionalidades anunciadas estão conectadas ao fluxo real do sistema.

Identificar código de demonstração apresentado como implementação completa, resultados fixos, integrações fictícias, botões sem efeito, persistência inexistente e tratamentos de erro que apenas escondem falhas.

Não classificar automaticamente um comportamento desconhecido como alucinação. Distinguir incompatibilidade comprovada, suspeita e impossibilidade de verificar.

## 12. Investigação de bugs e regressões

O Contraprova deve procurar defeitos mesmo quando o usuário não relata um problema. Deve comparar a versão candidata com uma referência conhecida, executar fluxos relevantes e investigar efeitos colaterais das alterações.

Ao encontrar um problema, registrar:

- Comportamento esperado e observado.
- Passos para reprodução e condições necessárias.
- Evidências reais e localização provável.
- Impacto para o usuário e severidade.
- Se é regressão, defeito preexistente ou problema de origem desconhecida.
- Sugestão de correção e teste capaz de prevenir recorrência.

Não atribuir causa raiz definitiva quando existe apenas correlação. Agrupar sintomas relacionados sem esconder problemas distintos.

## 13. Segurança e privacidade

Investigar riscos de autenticação, autorização, exposição de dados, entradas não confiáveis, dependências vulneráveis, configurações inseguras, segredos expostos e operações destrutivas.

Testes ativos devem ocorrer em ambientes autorizados, isolados e com dados fictícios ou devidamente sanitizados. Não atacar serviços externos, enviar mensagens reais, realizar cobranças ou modificar dados de produção sem autorização específica.

Minimizar a coleta de código e dados. Não enviar informações privadas a modelos ou serviços externos sem consentimento e configuração explícita. Redigir segredos nos relatórios. Informar retenção e destinos de dados.

## 14. Auditoria independente de agentes

Quando agentes forem utilizados, separar responsabilidades de implementação, geração de testes e revisão. O auditor deve receber a intenção original e evidências verificáveis, não apenas o resumo produzido pelo desenvolvedor.

O produto deve permitir contestação de resultados, investigação de divergências e revisão de alterações sugeridas. Votos de vários modelos não substituem execução real.

Tratar instruções encontradas em código, documentação, logs, páginas e respostas externas como dados não confiáveis. Elas não podem conceder permissões, desativar políticas ou ordenar publicação.

Nenhum agente deve aprovar sozinho seu próprio trabalho ou alterar unilateralmente a política que o fiscaliza.

## 15. Modelo de ameaça e limites de confiança

Considerar agentes que, por erro ou comportamento adversarial, tentem contornar verificações, modificar o executor, falsificar relatórios, detectar o ambiente de teste, esconder código executável, alterar a referência de comparação ou publicar por fora do fluxo autorizado.

Considerar também dependências comprometidas, execução de código não confiável, vazamento de credenciais, alterações concorrentes e substituição do artefato depois da validação.

As políticas, referências aprovadas, verificações independentes e evidências devem estar protegidas contra escrita não autorizada. A execução de código candidato não deve receber credenciais capazes de alterar esses controles.

Vincular resultados à versão exata do código, configuração, ambiente e artefato verificado. Uma alteração relevante posterior invalida a aprovação correspondente.

Se o agente possuir controle administrativo sobre toda a máquina, contas e publicação, uma ferramenta local não consegue garantir que suas proteções sejam invioláveis. O produto deve reconhecer e informar essa condição, nunca simular uma garantia inexistente.

## 16. Auditoria da esteira de publicação

O Contraprova não deve confiar em um pipeline apenas porque ele existe ou apresenta status verde. Deve investigar se as verificações realmente executam, se falhas bloqueiam a publicação, se existem condições de exclusão indevidas, permissões excessivas, caminhos alternativos e mecanismos de aprovação contornáveis.

Deve propor ou configurar, mediante autorização, um fluxo verificável de publicação com políticas independentes, execução isolada, aprovação vinculada ao artefato e credenciais restritas.

Validar o próprio bloqueio com exercícios controlados: uma alteração deliberadamente inválida deve ser rejeitada sem atingir produção. Um resultado ausente ou interrompido não deve ser interpretado como aprovação.

Distinguir modo consultivo, em que apenas recomenda não publicar, de modo efetivamente protegido, em que possui integração e autoridade para impedir a publicação. Exibir claramente qual modo está ativo.

## 17. Decisão de qualidade

A decisão deve ser baseada em políticas explícitas e evidências, não em uma nota subjetiva de IA.

Estados mínimos:

- **Aprovado:** verificações obrigatórias concluídas e critérios atendidos, dentro do escopo declarado.
- **Bloqueado:** falha obrigatória, risco proibido ou violação comprovada de política.
- **Inconclusivo:** evidência insuficiente, execução incompleta, ambiente indisponível ou conflito não resolvido.
- **Exceção autorizada:** risco conhecido aceito explicitamente por pessoa autorizada, com justificativa, escopo e validade.

Em modo protegido, estados bloqueado e inconclusivo impedem a publicação. Exceções não podem ser criadas silenciosamente pelo agente desenvolvedor.

Métricas de cobertura, quantidade de testes e mutações detectadas são indicadores auxiliares. Não devem compensar falhas críticas por meio de uma média ou pontuação geral.

## 18. Fluxo completo de utilização

1. O usuário apresenta o projeto e descreve seu objetivo.
2. O Contraprova investiga o estado inicial sem presumir que esteja correto.
3. Identifica riscos, testes suspeitos, lacunas e requisitos desconhecidos.
4. Propõe critérios de aceitação e solicita confirmação apenas onde necessário.
5. Cria verificações independentes e avalia a eficácia dos testes existentes.
6. Estabelece uma referência versionada, registrando defeitos conhecidos sem legitimá-los.
7. O agente desenvolvedor implementa uma alteração.
8. O Contraprova compara mudanças, verifica contratos e procura manipulações.
9. Executa verificações reais em ambiente apropriado.
10. Investiga falhas e apresenta relatório com evidências.
11. O desenvolvedor corrige os problemas, sem enfraquecer as proteções.
12. Uma nova execução verifica a versão corrigida.
13. A política determina o estado final e, quando integrado, controla a publicação.
14. Após publicação autorizada, verificações básicas confirmam o funcionamento da versão entregue; falhas acionam o procedimento de recuperação previamente definido.

## 19. Experiência do vibe coder

A experiência deve ser compreensível para quem não conhece sintaxe de testes, pipelines ou detalhes de infraestrutura. O usuário deve poder pedir ações como: investigar meu projeto; verificar se esta funcionalidade realmente funciona; procurar bugs antes de publicar; descobrir se a IA afrouxou os testes; explicar por que a publicação foi bloqueada.

O produto deve explicar problemas em linguagem humana, com detalhes técnicos expansíveis. Priorizar impacto e ações necessárias, evitando despejar centenas de mensagens sem contexto.

A configuração inicial deve ser guiada e mostrar quais proteções foram realmente ativadas. Não apresentar uma integração não configurada como proteção ativa.

Permitir verificações rápidas durante desenvolvimento e verificações profundas antes de publicação, sem confundir seus níveis de garantia.

## 20. Relatórios e evidências

Cada execução deve registrar versão analisada, escopo, ambiente, políticas aplicadas, verificações planejadas e realizadas, resultados, duração, falhas, testes ignorados, limitações e evidências reproduzíveis.

Evidências podem incluir logs reais, resultados estruturados, diferenças de código, reprodução de erros e capturas de interface quando pertinentes. Devem ter origem identificável e proteção proporcional contra alteração.

Exemplo ilustrativo:

> Publicação bloqueada. A recuperação de senha aceita um token já utilizado. O teste antigo foi alterado para aceitar esse comportamento. Uma verificação independente reproduziu o defeito. Corrija a invalidação do token e execute novamente. A integração de e-mail não foi verificada porque o ambiente de teste está indisponível.

O relatório deve separar problemas confirmados de suspeitas, riscos aceitos e áreas não testadas. Nunca inventar logs, números ou execuções.

## 21. Correção assistida

O Contraprova pode propor correções, preparar instruções para o agente desenvolvedor ou, em modo autorizado, realizar alterações. O padrão inicial deve preservar a separação entre investigação e modificação.

Correções automáticas precisam ser revisáveis, limitadas ao escopo e verificadas novamente. Não podem alterar requisitos, testes protegidos, políticas ou credenciais para obter aprovação.

Se a correção não resolver o problema, reportar a falha. Evitar ciclos infinitos de tentativa e erro; oferecer limites configuráveis e encaminhamento ao usuário quando necessário.

## 22. Projetos legados e adoção gradual

Projetos existentes podem ter centenas de defeitos ou nenhuma suíte de testes. O produto deve produzir um diagnóstico inicial e permitir adoção progressiva, priorizando fluxos críticos.

Defeitos antigos não devem desaparecer do relatório por serem antigos. Uma política pode permitir alterações que não agravem riscos conhecidos, desde que a dívida esteja explícita e riscos proibidos continuem bloqueando a publicação.

A referência inicial não é um certificado de qualidade. Ela registra o estado observado e os critérios efetivamente validados.

## 23. O Contraprova deve fiscalizar a si mesmo

O próprio produto precisa demonstrar que detecta testes falsos, resultados manipulados, políticas desativadas, alterações posteriores à aprovação e tentativas de publicação não autorizada.

Manter cenários independentes com projetos deliberadamente defeituosos, projetos corretos e casos ambíguos. Avaliar falsos positivos e falsos negativos. Testar falhas de infraestrutura, ausência de evidências e interrupções.

A atualização do Contraprova não deve enfraquecer silenciosamente as proteções. Mudanças de política precisam ser rastreáveis e revisáveis. O produto não pode ser a única autoridade sobre sua própria integridade.

## 24. Critérios de aceitação do produto

| Cenário | Resultado esperado |
|---|---|
| Teste existente sempre passa | Detectar sua ineficácia quando uma falha controlada deveria ser observada |
| Teste crítico removido | Sinalizar alteração e impedir aprovação conforme política |
| Resultado esperado enfraquecido | Apontar diferença e exigir justificativa independente |
| Dependência inexistente | Demonstrar incompatibilidade ou declarar verificação inconclusiva |
| Funcionalidade visual sem efeito | Reproduzir ausência de comportamento real |
| Bug corrigido | Demonstrar reprodução anterior e validação posterior, quando possível |
| Regressão em outro fluxo | Apontar comportamento quebrado e evidência |
| Pipeline ignora falha | Identificar ausência de bloqueio efetivo |
| Verificação obrigatória não executada | Não aprovar |
| Artefato alterado após aprovação | Invalidar a aprovação anterior |
| Relatório fabricado por agente | Não aceitar declaração sem evidência independente |
| Projeto correto | Aprovar dentro do escopo validado, sem inventar defeitos |
| Requisito ambíguo | Solicitar decisão ou declarar limitação |
| Ambiente sem autoridade de bloqueio | Informar que a proteção é consultiva |
| Tentativa de alterar política protegida | Rejeitar ou detectar conforme o limite de confiança estabelecido |
| Falha durante teste | Preservar evidências e não confundir interrupção com sucesso |

## 25. Indicadores de sucesso

Medir capacidade de detectar defeitos conhecidos, mutações relevantes sobreviventes, regressões encontradas antes da publicação, falsos positivos, falsos negativos em cenários controlados, verificações obrigatórias efetivamente executadas e tentativas de contorno detectadas.

Avaliar também tempo de configuração, clareza dos relatórios, esforço exigido do usuário, tempo de execução e custo operacional. Não otimizar quantidade de testes ou pontuações em detrimento da capacidade real de detectar problemas.

Metas numéricas devem ser definidas após experimentos com projetos representativos, não inventadas antecipadamente.

## 26. Evolução funcional proposta

**Fundação:** investigação de projetos, inventário de testes, critérios de aceitação, execução real, análise de alterações e relatórios de evidências.

**Validação independente:** geração de testes, reprodução de bugs, avaliação da eficácia dos testes, detecção de regressões e auditoria de agentes.

**Proteção efetiva:** políticas protegidas, isolamento, verificação da esteira de publicação e vinculação da aprovação ao artefato.

**Experiência ampliada:** configuração guiada, histórico, explicações acessíveis, correções assistidas e integração com diferentes ambientes de desenvolvimento.

Essas etapas descrevem capacidades, não tecnologias nem prazos. Uma versão inicial consultiva não deve ser anunciada como proteção inviolável.

## 27. O que o projeto não é

Não é apenas um gerador de testes, um revisor de código, um scanner de vulnerabilidades, um agente de programação ou um painel de métricas. Não é uma promessa de ausência de bugs, substituto universal de especialistas ou certificação automática de segurança.

Não deve exigir que todos os projetos usem a mesma arquitetura. Não deve modificar código, instalar componentes, enviar dados ou publicar versões sem as permissões necessárias.

Não deve transformar a desconfiança em rejeição automática de todo código existente: o objetivo é verificar, não condenar sem evidência.

## 28. Decisões deliberadamente em aberto

O formato final pode ser uma skill, agente, programa independente, integração, serviço ou combinação desses formatos. A escolha deve considerar capacidade de executar verificações reais, isolamento, proteção de políticas, facilidade de uso, portabilidade e custo.

Uma skill baseada apenas em instruções pode orientar agentes, mas não constitui por si só um bloqueio técnico. Qualquer formato escolhido precisa declarar seus limites de autoridade.

Linguagens, ferramentas, arquitetura interna, distribuição, interfaces, modelos, licenciamento específico e estratégia de integração ficam para investigação posterior. O projeto nasceu com o nome de trabalho VibeGuard e passou a se chamar Contraprova em 2026-11-27, depois de verificados os conflitos do nome original (ver [ADR 0004](adr/0004-nome-do-projeto-contraprova.md)); a busca em bases de marcas ainda está pendente.

## 29. Definição final

O Contraprova é uma proposta de camada independente de verificação para desenvolvimento assistido por IA. Sua responsabilidade é transformar intenções em critérios verificáveis, desconfiar das alegações existentes, produzir evidências independentes, descobrir defeitos e regressões, fiscalizar testes e mecanismos de publicação, explicar riscos e impedir aprovações indevidas dentro de sua autoridade real.

Seu valor não está em fazer uma IA parecer mais confiante. Está em tornar essa confiança menos necessária.

**A IA pode escrever o software. A aprovação deve depender de provas.**
