#!/usr/bin/env bash
# Runs on the server (as root). Installs the page from a staging dir,
# keeping a backup; with --nginx also installs the snippet, adds the include
# once, validates with `nginx -t` and restores everything if anything fails.
#
#   bash remote-site.sh <staging-dir> [--nginx]
set -euo pipefail

STAGE="${1:?staging dir}"
WITH_NGINX="${2:-}"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
WEB_ROOT=/var/www/contraprova
BACKUPS=/var/backups/contraprova
SITE=/etc/nginx/sites-available/efer.online
SNIPPET=/etc/nginx/snippets/contraprova.conf
INCLUDE="    include /etc/nginx/snippets/contraprova.conf;"

install -d -m 700 "$BACKUPS"

# 1. Files: unpack next to the current version, then swap.
if [ -d "$WEB_ROOT" ]; then
  tar -czf "$BACKUPS/site-$TS.tgz" -C /var/www contraprova
  chmod 600 "$BACKUPS/site-$TS.tgz"
fi
NEW="$WEB_ROOT.new-$TS"
mkdir -p "$NEW/projeto"
tar --warning=no-timestamp -xzf "$STAGE/site.tgz" -C "$NEW/projeto"
chown -R root:root "$NEW"
find "$NEW" -type d -exec chmod 755 {} +
find "$NEW" -type f -exec chmod 644 {} +
if [ -d "$WEB_ROOT" ]; then mv "$WEB_ROOT" "$WEB_ROOT.old-$TS"; fi
mv "$NEW" "$WEB_ROOT"
rm -rf "$WEB_ROOT.old-$TS"
echo "files: ok"

# 2. Nginx (optional).
if [ "$WITH_NGINX" = "--nginx" ]; then
  cp -a "$SITE" "$BACKUPS/efer.online-$TS"
  [ -f "$SNIPPET" ] && cp -a "$SNIPPET" "$BACKUPS/snippet-$TS.conf"
  restore() {
    echo "nginx: restoring previous config" >&2
    cp -a "$BACKUPS/efer.online-$TS" "$SITE"
    if [ -f "$BACKUPS/snippet-$TS.conf" ]; then cp -a "$BACKUPS/snippet-$TS.conf" "$SNIPPET"; else rm -f "$SNIPPET"; fi
    nginx -t && systemctl reload nginx
  }
  trap 'restore' ERR
  install -m 644 "$STAGE/nginx-contraprova.conf" "$SNIPPET"
  if ! grep -qF "include /etc/nginx/snippets/contraprova.conf;" "$SITE"; then
    # Insert once, right after the agent-orchestra include (efer.online server block).
    awk -v inc="$INCLUDE" '
      { print }
      !done && index($0, "include /etc/nginx/snippets/agent-orchestra.conf;") { print inc; done = 1 }
      END { if (!done) exit 3 }
    ' "$SITE" > "$SITE.tmp-$TS"
    mv "$SITE.tmp-$TS" "$SITE"
  fi
  nginx -t
  systemctl reload nginx
  trap - ERR
  echo "nginx: ok"
fi

rm -rf "$STAGE"
echo "done $TS"
