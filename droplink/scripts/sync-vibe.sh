#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DROP="$ROOT/droplink"
SITE_REPO="${VIBE_SITE_REPO:-git@github.com:vibe/vibe.github.io.git}"

cd "$DROP"

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

export GITHUB_PAGES=true
export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-https://vibe.github.io}"
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-}"

echo "→ Building DropLink for https://vibe.github.io ..."
npm run build

TMP=$(mktemp -d)
git clone --depth 1 "$SITE_REPO" "$TMP/site"

find "$TMP/site" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$DROP/out/"* "$TMP/site/"
touch "$TMP/site/.nojekyll"

cd "$TMP/site"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
git add -A
git commit -m "Deploy DropLink $(date +%Y-%m-%d_%H:%M)" || true
git push origin "$BRANCH"

echo ""
echo "✓ Live at https://vibe.github.io/"
