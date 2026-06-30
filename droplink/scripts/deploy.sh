#!/bin/bash
set -e

# Deploy DropLink to https://vibe.github.io/
# Requires: git auth configured, MEGA secrets in .env.local

cd "$(dirname "$0")/.."

if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

export GITHUB_PAGES=true
export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-https://vibe.github.io}"
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-}"

echo "Building for GitHub Pages..."
npm run build

echo "Deploying to gh-pages branch..."
npx gh-pages -d out -b gh-pages -m "Deploy DropLink $(date +%Y-%m-%d_%H-%M)"

echo ""
echo "Done! Enable GitHub Pages:"
echo "  Repo → Settings → Pages → Source: Deploy from branch → gh-pages / (root)"
echo ""
echo "Live URL: https://vibe.github.io/"
