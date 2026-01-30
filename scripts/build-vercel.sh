#!/bin/bash
set -e

# Build the dashboard
pnpm turbo run build --filter=dashboard

# Check if .vercel exists
if [ ! -d "apps/dashboard/.vercel" ]; then
  echo "Error: apps/dashboard/.vercel does not exist after build"
  ls -la apps/dashboard/ | grep -E "vercel|output|dist" || true
  exit 1
fi

# Create output directory and copy
mkdir -p .vercel
cp -r apps/dashboard/.vercel .vercel/output

echo "Build completed successfully"
ls -la .vercel/output/
