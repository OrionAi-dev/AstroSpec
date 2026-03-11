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
gen mcp-secure-context-core core
gen mcp-secure-context-openspec openspec
gen mcp-secure-context-cli cli

# Public interop and profiles
gen mcp-secure-context-mcp-adapter mcp-adapter
gen mcp-secure-context-sdk-typescript sdk-typescript
gen astrospec-retrieval-profile retrieval-profile

# Integrations / generators (optional)
gen integrations/mindql-core integrations/mindql-core
gen integrations/mindgraphql-core integrations/mindgraphql-core
