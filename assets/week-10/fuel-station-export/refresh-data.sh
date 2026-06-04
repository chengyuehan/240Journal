#!/usr/bin/env sh
set -eu

mkdir -p data
curl -sS \
  -H "Authorization: Bearer sk_ze_b5rXc5zLCUt8m5kg7DeB2PcBD4k2uz_N23_0hmzmqO0" \
  "https://api.llm-stats.com/stats/v1/models?limit=200&max_input_price=100&sort=input_price" \
  -o data/live-models.json

printf "Refreshed data/live-models.json from LLM Stats\n"
