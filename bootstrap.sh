#!/bin/bash

dirs=("demo-ui" "api-server" "stagehand-scraper")

for dir in "${dirs[@]}"; do
  echo "Installing dependencies in $dir..."
  (
    cd "$dir" && \
    PNPM_ENABLE_PRE_POST_SCRIPTS=true pnpm install
  )
done

echo "✅ All done!"
