# Política de segurança

## Escopo

O Contraprova está em fase de especificação, com um protótipo experimental do motor em `motor/`. Não há produto, pacote publicado nem versão lançada, e por isso **não há tabela de versões suportadas**.

Esta política cobre o que existe hoje no repositório:

- workflows e configurações do GitHub Actions (permissões excessivas, injeção de comandos, ações de terceiros sem fixação);
- segredos, tokens ou dados pessoais expostos por engano em arquivos ou no histórico;
- links, scripts ou instruções na documentação que possam levar a pessoa a uma ação insegura;
- falhas nas proteções do repositório (por exemplo, forma de contornar a proteção da `main`);
- falhas de segurança no código do protótipo em `motor/` (por exemplo, ele alterar o projeto analisado, apagar arquivos fora da pasta temporária ou enviar dados pela rede). O protótipo roda o código do projeto analisado sem isolamento: isso é um limite conhecido e documentado em [motor/README.md](motor/README.md), não uma vulnerabilidade.

Questões conceituais sobre o modelo de ameaças do produto (o que o Contraprova deveria considerar) não são vulnerabilidades: discuta-as em issue ou RFC. Veja [docs/especificacao/modelo-de-ameacas.md](docs/especificacao/modelo-de-ameacas.md).

## Como relatar uma vulnerabilidade

**Não abra uma issue pública.** Use o recurso _Report a vulnerability_ do GitHub (Private Vulnerability Reporting):

<https://github.com/Efer-Eder/contraprova/security/advisories/new>

Inclua, se possível:

- descrição do problema e impacto;
- onde está (arquivo, workflow, commit);
- passos para reproduzir;
- sugestão de correção, se tiver.

Se você encontrou um segredo exposto, **não o reproduza no relato**: indique o arquivo e o commit.

O mesmo formulário recebe relatos de conduta: indique no título que se trata de um relato de conduta. Veja o [Código de Conduta](CODE_OF_CONDUCT.md).

## O que esperar

- Confirmação de recebimento em até 7 dias.
- Avaliação do relato e, se confirmado, correção no branch `main`.
- Divulgação coordenada: combino com você a data e o texto, após a correção. Você será creditado se quiser.

Esse prazo é um objetivo de um projeto mantido por uma pessoa, não um contrato.

## Princípios do projeto

- Nenhuma credencial no repositório; há varredura de segredos nas automações.
- Workflows com permissões mínimas.
- Nenhuma afirmação de segurança sem evidência: o projeto não promete certificação nem ausência de falhas.
