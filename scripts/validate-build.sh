#!/bin/bash
set -e

hugo --i18n-warnings 2>&1 | tee build.log

if grep -i "missing" build.log; then
  echo "❌ Missing translations detected"
  exit 1
fi

test -f public/index.html || { echo "❌ public/index.html not found"; exit 1; }
test -f public/en/index.html || { echo "❌ public/en/index.html not found"; exit 1; }
test -f public/sitemap.xml || { echo "❌ public/sitemap.xml not found"; exit 1; }

echo "✅ Build validation passed"
