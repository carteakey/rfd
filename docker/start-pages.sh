#!/bin/sh

set -eu

: "${REFRESH_SECRET:=local}"
: "${RFD_BASE_URL:=https://forums.redflagdeals.com}"
: "${REDIRECTS_URL:=https://raw.githubusercontent.com/davegallant/rfd-redirect-stripper/main/redirects.json}"
: "${WRANGLER_COMPATIBILITY_DATE:=2026-06-22}"

exec /app/node_modules/.bin/wrangler pages dev /app/dist \
  --compatibility-date "${WRANGLER_COMPATIBILITY_DATE}" \
  --ip 0.0.0.0 \
  --port 8788 \
  --kv TOPICS_KV \
  --binding "REFRESH_SECRET=${REFRESH_SECRET}" \
  --binding "RFD_BASE_URL=${RFD_BASE_URL}" \
  --binding "REDIRECTS_URL=${REDIRECTS_URL}" \
  --persist-to /app/.wrangler/state \
  --show-interactive-dev-session=false
