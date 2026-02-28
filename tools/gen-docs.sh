#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/docs/api"
rm -rf "$OUT"
mkdir -p "$OUT"

gen() {
  local pkgdir="$1"
  local sub="$2"
  cd "$ROOT/packages/$pkgdir"
  pnpm exec typedoc --options typedoc.json --out "$OUT/$sub"
}

# Core (canonical)
gen astrospec-schema schema
gen astrospec-runtime runtime
gen astrospec-cli cli

# Public interop and profiles
gen astrospec-mcp-profile mcp-profile
gen astrospec-kit kit
gen astrospec-retrieval-profile retrieval-profile

# Compatibility (legacy OpenSpec naming)
gen openspec-types legacy/openspec-types
gen openspec-runtime legacy/openspec-runtime

# Integrations / generators (optional)
gen integrations/mindql-core integrations/mindql-core
gen integrations/mindgraphql-core integrations/mindgraphql-core
gen integrations/openspec-plugin-mindql integrations/openspec-plugin-mindql
gen integrations/openspec-plugin-mindgraphql integrations/openspec-plugin-mindgraphql
