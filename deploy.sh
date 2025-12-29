#!/bin/bash

# Deploy script for PNPM monorepo apps to Vercel
# Usage: ./deploy.sh [app-name] or ./deploy.sh all

set -e

APPS=("client" "marketing" "portal")
VERCEL_JSON="vercel.json"

deploy_app() {
  local app=$1
  local project_name="greenway-${app}"

  echo "🚀 Deploying ${app}..."

  # Update vercel.json for this app
  cat > $VERCEL_JSON << EOF
{
  "\$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm turbo run build --filter=${app}",
  "outputDirectory": "apps/${app}/.next",
  "framework": "nextjs"
}
EOF

  # Remove existing .vercel link
  rm -rf .vercel

  # Deploy to ArchaicGroup scope
  vercel --yes --name "$project_name" --scope archaicgroup

  echo "✅ ${app} deployed!"
  echo ""
}

# Main
if [ "$1" == "all" ]; then
  for app in "${APPS[@]}"; do
    deploy_app "$app"
  done
  echo "🎉 All apps deployed!"
elif [ -n "$1" ]; then
  if [[ " ${APPS[*]} " =~ " $1 " ]]; then
    deploy_app "$1"
  else
    echo "❌ Unknown app: $1"
    echo "Available apps: ${APPS[*]}"
    exit 1
  fi
else
  echo "Usage: ./deploy.sh [app-name|all]"
  echo "Available apps: ${APPS[*]}"
  exit 1
fi

