# Motor do Contraprova (protótipo)

Protótipo experimental do motor de verificação do Contraprova. É um programa de linha de comando em Node.js, sem dependências, que executa os testes de um projeto de verdade, tenta provar que esses testes conseguem falhar e gera um relatório com a decisão.

**Nível de autoridade: consultivo local.** O motor recomenda, não impede. Não é proteção: quem controla a máquina ou o repositório pode ignorar o resultado. O modo protegido não existe nesta versão e nunca é afirmado.

## Como rodar

Requisito: Node.js 22 ou mais novo. Não há nada para instalar.

A partir de um clone do repositório:

```sh
node motor/bin/contraprova.js verificar <pasta-do-projeto>
node motor/bin/contraprova.js --ajuda
```

Via `npx`, direto do GitHub (não existe pacote no npm):

```sh
npx --yes github:Efer-Eder/contraprova verificar .
```

Verificado em 2026-11-28, no Windows 11 com Node 24, a partir da branch principal e numa pasta fora do repositório: `npx --yes github:Efer-Eder/contraprova verificar . --mutantes 3` deu inconclusivo (saída 2) em `motor/exemplos/teste-fraco` e aprovado (saída 0) em `motor/exemplos/correto`. O comando baixa o código do repositório do projeto e o executa na sua máquina.

## Comandos

| Comando | O que faz |
|---|---|
| `investigar` | Lê o projeto sem executar nada dele. Mostra o ecossistema, o comando de teste, o inventário de testes, os testes ignorados, os arquivos de teste sem asserção reconhecível e os workflows. Tudo isso são observações estáticas, rotuladas como não executadas. |
| `verificar` | Faz `investigar`, executa o comando de teste, faz a prova de eficácia, audita a esteira e, com `--base`, compara com uma versão anterior. Emite a decisão. |
| `provar` | Só a prova de eficácia. Não emite decisão. |
| `esteira` | Lê `.github/workflows` como texto e aponta o que pode fazer falhas passarem. Não emite decisão. |
| `comparar --base <ref>` | Procura enfraquecimento de testes com `git diff` entre `<ref>` e a árvore de trabalho. Não emite decisão. |

Opções: `--comando "<cmd>"`, `--tempo-limite <segundos>` (padrão 600), `--mutantes <n>` (padrão 10), `--sem-prova`, `--base <ref>`, `--saida <pasta>`, `--json`, `--ajuda`, `--versao`.

## Decisões e códigos de saída

A política é fixa e está no código (`motor/src/decidir.js`). Não há nota nem meta numérica.

| Código | Decisão | Quando |
|---|---|---|
| 0 | aprovado | Os testes passaram e pelo menos um defeito introduzido foi detectado, ou a prova foi desligada com `--sem-prova` (o relatório destaca que a eficácia não foi verificada). |
| 1 | bloqueado | Os testes executaram e falharam. |
| 2 | inconclusivo | Não há testes detectados, o comando não executou, o tempo limite estourou, o ecossistema não foi reconhecido e não houve `--comando`, nenhum defeito introduzido foi detectado, a prova não pôde rodar, a comparação achou suspeita ou o motor teve um erro interno. |
| 3 | erro de uso | Comando ou opção inválida. |

A decisão "exceção autorizada" do manifesto NÃO está implementada. Um erro interno do motor resulta sempre em inconclusivo. `investigar` e `esteira` saem com 0 e não emitem decisão. "Aprovado" vale só para o que foi executado.

## Como a prova de eficácia funciona

O motor copia o projeto para uma pasta temporária (sem `.git`, `node_modules`, ambientes virtuais, `dist`, `build`, `coverage` e `.contraprova`, e sem links simbólicos) e liga o `node_modules` original à cópia. Roda os testes na cópia intacta: se não passarem lá, a prova é inconclusiva. Depois aplica trocas simples, uma por vez, em arquivos de código que não são de teste (`===` e `!==`, `<` e `>=`, `+` e `-`, `&&` e `||`, `true` e `false`, e `and`, `or`, `True`, `False` em Python) e roda os testes. O resultado de cada troca é "detectado", "não detectado", "tempo esgotado" (conta como detectado, registrado à parte) ou "erro". A pasta temporária é apagada ao final. O projeto original não é alterado.

A seleção é por regra fixa e espalhada entre arquivos, então é uma amostra, não uma medida do projeto. Um defeito que sobrevive pode ser uma lacuna real ou uma troca equivalente ao código original: só uma pessoa decide.

## O que sai

Em `<projeto>/.contraprova/` (ou em `--saida`):

- `relatorio.json`: esquema versão 1, com a política aplicada, cada execução (comando, código de saída, duração, sha256 e caminho da saída completa), os defeitos introduzidos, os achados da esteira, as suspeitas, a decisão, os motivos e a lista `naoVerificado`.
- `relatorio.md`: o mesmo resultado em linguagem simples.
- `execucoes/`: a saída completa de cada execução. Ela contém o que os próprios testes imprimiram, inclusive segredos, se algum teste os imprimir. Fica só na sua máquina.

## Exemplos e autoavaliação

Em `motor/exemplos/` há projetos pequenos com defeitos propositais, cada um com um `LEIAME.md`. Os testes do motor rodam o CLI de verdade contra eles:

```sh
npm test
```

O comando roda `node --test "motor/testes/*.test.js"`. O padrão com aspas é necessário porque o `node --test` do Node 24 não aceita uma pasta como argumento.

## Limites conhecidos

- A análise de testes, asserções e esteira é heurística textual. Pode errar para os dois lados. Os workflows são lidos como texto, sem parser de YAML.
- As mutações são simples e textuais. O motor não entende literais de expressão regular e pode produzir trocas equivalentes ao código original ou que quebram a sintaxe (nesse caso o teste falha e o defeito conta como detectado).
- Só reconhece Node.js (por `package.json`) e Python (por `pyproject.toml`, `setup.py`, `requirements.txt`, `pytest.ini` ou arquivos `test_*.py`). Outros ecossistemas só funcionam com `--comando`, e a investigação de testes é só para arquivos JavaScript, TypeScript e Python.
- Sem isolamento: o código do projeto e os testes rodam na sua máquina, com as permissões de quem chamou o motor, com acesso à rede e aos seus arquivos. Não rode em projeto em que você não confia.
- Sem exceção autorizada e sem proteção de política: não existe arquivo de política, e quem escreve o código pode editar qualquer coisa que o motor lê.
- O motor não inspeciona as regras de proteção do repositório (branch protegida, checks obrigatórios, quem pode contornar).
- A comparação com `--base` não vê arquivos novos ainda não rastreados pelo git, e uma mudança legítima pode gerar suspeita.
- Pastas chamadas `exemplos`, `examples` e `fixtures` ficam fora do inventário e da prova.
- Verificado só no Windows 11 com Node 24 (77 testes, 0 falhas, em 2026-11-27). Linux e macOS não foram verificados à mão: a esteira `.github/workflows/motor.yml` os cobre quando rodar num PR.
- O motor não envia nada pela rede.
