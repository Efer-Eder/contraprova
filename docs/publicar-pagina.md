# Publicar a página do projeto

A página pública do Contraprova é um arquivo estático em `site/index.html`, servido em `https://efer.online/projeto/contraprova/`. Ela não é código do produto: o projeto continua em fase de especificação, com um protótipo experimental do motor ([ADR 0009](adr/0009-prototipo-executavel-do-motor-em-paralelo.md)), e a página deve dizer isso logo no topo. Qualquer mudança nela deve manter essa honestidade (sem instalação, demo, número de usuários ou prazo).

## O que existe

| Arquivo | Para quê |
|---|---|
| `site/index.html` | A página inteira (HTML, CSS e JS num arquivo só, sem build). |
| `deploy/deploy-site.ps1` | Empacota `site/` e envia ao servidor. Flags `-Nginx` e `-DryRun`. |
| `deploy/remote-site.sh` | Roda no servidor: backup, troca atômica dos arquivos e, com `--nginx`, instalação do snippet com `nginx -t` e restauração automática em erro. |
| `deploy/nginx-contraprova.conf` | Snippet do Nginx: redireciona `/projeto/contraprova` para a forma com barra e serve a página sem cache. |

## Regras da página

- Mesmo estilo das demais páginas do site: tema grafite, Geist, um único acento índigo, sem emoji e sem travessão.
- O card "Atividade no GitHub" lê a API pública do GitHub no navegador de quem visita, sem token, com cache de 10 minutos em `sessionStorage`. Ele atualiza sozinho, sem deploy.
- Só publique texto que o repositório sustenta. A lista de ferramentas de agentes deve seguir `docs/agentes/compatibilidade.md`: o que a matriz marca como não confirmado não pode aparecer como compatível.

## Como publicar

1. Faça a mudança em um branch, abra o PR e espere os checks ficarem verdes. A publicação só acontece depois do merge na `main`.
2. Defina o endereço do servidor na sua sessão local. Ele não fica no repositório:

   ```powershell
   $env:CONTRAPROVA_DEPLOY_HOST = 'usuario@servidor'
   # opcionais
   $env:CONTRAPROVA_DEPLOY_KEY = '<caminho da chave SSH>'
   $env:CONTRAPROVA_DEPLOY_KNOWN_HOSTS = '<caminho do known_hosts>'
   ```

3. Confira o que seria enviado: `.\deploy\deploy-site.ps1 -DryRun`.
4. Publique: `.\deploy\deploy-site.ps1`. Na primeira vez, ou quando o snippet do Nginx mudar, use `-Nginx`.
5. Confira as rotas públicas do site (a nova e as dos outros projetos) antes e depois, e veja que só a rota do Contraprova mudou.

No Windows PowerShell 5.1, não redirecione o stderr das chamadas nativas (`ssh`, `scp`, `tar`): o script já usa o código de saída para decidir.

## Reverter

Cada publicação guarda o site anterior em um tar no servidor. Para desfazer a parte do Nginx, restaure a cópia do arquivo do site feita pelo script, ou remova a linha `include` do snippet, rode `nginx -t` e recarregue o Nginx.
