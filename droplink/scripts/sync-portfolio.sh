#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DROP="$ROOT/droplink"
PORTFOLIO_REPO="git@github.com:Satwinder777/Satwinder777.github.io.git"

cd "$DROP"

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

export GITHUB_PAGES=true
export NEXT_PUBLIC_APP_URL="https://satwinder777.github.io/Vibe"
export NEXT_PUBLIC_BASE_PATH="/Vibe"

echo "→ Building DropLink..."
npm run build

TMP=$(mktemp -d)
git clone --depth 1 "$PORTFOLIO_REPO" "$TMP/portfolio"

rm -rf "$TMP/portfolio/Vibe"
mkdir -p "$TMP/portfolio/Vibe"
cp -R "$DROP/out/"* "$TMP/portfolio/Vibe/"
touch "$TMP/portfolio/.nojekyll" "$TMP/portfolio/Vibe/.nojekyll"

cd "$TMP/portfolio"
git add -A
git commit -m "Update DropLink /Vibe build $(date +%Y-%m-%d_%H:%M)" || true
git push origin main

echo ""
echo "✓ Live at https://satwinder777.github.io/Vibe/"
