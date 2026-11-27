#!/usr/bin/env bash
# Gera, a partir de AGENTS.md, as cópias integrais usadas por ferramentas que
# não sabem importar outro arquivo. AGENTS.md é a fonte única: não edite as
# cópias à mão.
#
# Uso:
#   bash scripts/sync-agent-adapters.sh           regenera as cópias
#   bash scripts/sync-agent-adapters.sh --check   não escreve nada; sai com
#                                                 código 1 se alguma cópia
#                                                 divergir da fonte
#
# Só usa bash e utilitários do coreutils. Roda em Linux e no Git Bash.
set -euo pipefail

modo="gerar"
case "${1:-}" in
  "") ;;
  --check) modo="checar" ;;
  *)
    echo "Uso: bash scripts/sync-agent-adapters.sh [--check]" >&2
    exit 2
    ;;
esac
if [ "$#" -gt 1 ]; then
  echo "Uso: bash scripts/sync-agent-adapters.sh [--check]" >&2
  exit 2
fi

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$raiz"

fonte="AGENTS.md"
aviso="<!-- Arquivo gerado a partir de AGENTS.md por scripts/sync-agent-adapters.sh. Não edite aqui: mude AGENTS.md e regenere. -->"
limite_bytes=16384

# Cópias geradas. Só o Continue precisa de frontmatter.
copias=(
  ".github/copilot-instructions.md"
  ".amazonq/rules/agents.md"
  ".aiassistant/rules/agents.md"
  ".continue/rules/00-agents.md"
)

if [ ! -f "$fonte" ]; then
  echo "Erro: $fonte não encontrado na raiz do repositório." >&2
  exit 1
fi

# O sufixo "x" preserva as quebras de linha finais na substituição de comando.
conteudo="$(cat "$fonte"; printf x)"
conteudo="${conteudo%x}"

# A fonte precisa ser copiável sem ajuste.
if [[ "$conteudo" == *$'\r'* ]]; then
  echo "Erro: $fonte tem CRLF. Use fim de linha LF." >&2
  exit 1
fi
tamanho="$(printf '%s' "$conteudo" | wc -c | tr -d ' ')"
if [ "$tamanho" -gt "$limite_bytes" ]; then
  echo "Erro: $fonte tem $tamanho bytes, acima do limite de $limite_bytes (16 KiB)." >&2
  exit 1
fi
# Link relativo quebraria nas cópias, que ficam em outras pastas. Alvo sem
# esquema (sem dois-pontos) e que não seja âncora conta como relativo.
if printf '%s' "$conteudo" | grep -nE '\]\([^)#:][^):]*\)' >&2; then
  echo "Erro: $fonte não pode ter links relativos (veja as linhas acima). Cite caminhos em crase." >&2
  exit 1
fi

# Escreve na saída padrão o arquivo completo de uma cópia.
renderizar() {
  case "$1" in
    .continue/rules/00-agents.md)
      printf '%s\n' '---' 'name: AGENTS' 'alwaysApply: true' '---'
      ;;
  esac
  printf '%s\n\n' "$aviso"
  printf '%s' "$conteudo"
}

divergentes=()
for alvo in "${copias[@]}"; do
  esperado="$(renderizar "$alvo"; printf x)"
  if [ -f "$alvo" ]; then
    atual="$(cat "$alvo"; printf x)"
  else
    atual="__ausente__"
  fi
  if [ "$esperado" = "$atual" ]; then
    continue
  fi
  if [ "$modo" = "checar" ]; then
    divergentes+=("$alvo")
  else
    mkdir -p "$(dirname "$alvo")"
    renderizar "$alvo" > "$alvo"
    echo "Gerado: $alvo"
  fi
done

if [ "$modo" = "checar" ]; then
  if [ "${#divergentes[@]}" -gt 0 ]; then
    echo "Cópias divergentes de $fonte:" >&2
    for alvo in "${divergentes[@]}"; do
      echo "  $alvo" >&2
    done
    echo "Rode: bash scripts/sync-agent-adapters.sh" >&2
    exit 1
  fi
  echo "Adaptadores em dia ($fonte: $tamanho bytes)."
else
  echo "Concluído ($fonte: $tamanho bytes)."
fi
