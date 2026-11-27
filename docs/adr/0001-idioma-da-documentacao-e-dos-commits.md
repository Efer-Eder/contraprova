---
status: "aceita"
date: 2026-11-27
decision-makers: Efer Eder
---

# Documentação em português do Brasil, commits e branches em inglês

## Contexto e problema

O manifesto original está em português do Brasil, e é o texto de referência do projeto. É preciso decidir em que idioma ficam a documentação, o README, as mensagens de commit e os nomes de branch. O alcance internacional é desejável, mas o projeto ainda é uma especificação e traduzir tudo desde já aumentaria o custo de manter documentos consistentes entre si.

## Direcionadores da decisão

- Fidelidade ao manifesto, que está em português.
- Alcance de quem contribui e lê o projeto.
- Convenção amplamente usada em ferramentas e em histórico de projetos open source para mensagens de commit.
- Custo de manutenção de múltiplos idiomas na fase de especificação.

## Opções consideradas

- Tudo em português do Brasil.
- Tudo em inglês.
- Documentação em português, README também em inglês, commits e branches em inglês.

## Resultado da decisão

Opção escolhida: documentação em português do Brasil; o README principal também existe em inglês (`README.en.md`); mensagens de commit e nomes de branch em inglês, seguindo [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## Consequências

- Bom, porque o manifesto e a especificação permanecem no idioma original, sem perda na tradução.
- Bom, porque o README em inglês dá uma porta de entrada a quem não lê português.
- Bom, porque Conventional Commits em inglês é a convenção mais comum e dá compatibilidade com ferramentas.
- Ruim, porque o README em inglês precisa ser mantido em sincronia com a versão em português.
- Ruim, porque quem não lê português só entende o projeto a partir do README em inglês.

## Confirmação

Revisão de PR: o título do PR e as mensagens de commit seguem Conventional Commits em inglês; mudanças no README são refletidas em `README.en.md`. Ainda não há verificação automatizada.

## Prós e contras das opções

### Tudo em português

- Bom, porque é simples e coerente com o manifesto.
- Ruim, porque limita o alcance.

### Tudo em inglês

- Bom, porque maximiza o alcance.
- Ruim, porque exige traduzir o manifesto e a especificação, com risco de desvio de significado.

### Documentação em português, README em inglês, commits em inglês

- Bom, porque equilibra fidelidade, alcance e convenção.
- Ruim, porque mantém dois READMEs.

## Mais informações

- Conventional Commits 1.0.0: <https://www.conventionalcommits.org/en/v1.0.0/>
- O idioma de longo prazo continua em aberto: veja [PA-13](../perguntas-em-aberto.md).
