# Exemplo: esteira permissiva

Defeito proposital: o workflow em `.github/workflows/ci.yml` usa `continue-on-error: true`, roda `npm test || true` e não tem o gatilho `pull_request`. O comando `esteira` deve apontar os três pontos.

Este workflow fica dentro da pasta de exemplos, e não na raiz do repositório, então o GitHub não o executa.
