#!/usr/bin/env bash
set -euo pipefail

echo "== Verify directories =="
for d in \
  packages/astrospec-schema \
  packages/astrospec-runtime \
  packages/astrospec-cli \
  packages/openspec-types \
  packages/openspec-runtime \
  packages/integrations/mindql-core \
  packages/integrations/mindgraphql-core \
  packages/integrations/openspec-plugin-mindql \
  packages/integrations/openspec-plugin-mindgraphql \
  packages/integrations/openspec-cli \
  packages/integrations/audio-openai \
  packages/integrations/events \
  examples \
  docs
do
  [ -d "$d" ] && echo "PASS  $d" || { echo "FAIL  missing $d"; exit 1; }
done

echo "== Verify build formats =="
pnpm -r build >/dev/null

check_dual() {
  pkg="$1"
  [ -f "$pkg/dist/index.js" ]   && echo "PASS  $pkg ESM" || { echo "FAIL  $pkg missing dist/index.js"; exit 1; }
  [ -f "$pkg/dist/index.cjs" ]  && echo "PASS  $pkg CJS" || { echo "FAIL  $pkg missing dist/index.cjs"; exit 1; }
  [ -f "$pkg/dist/index.d.ts" ] && echo "PASS  $pkg types" || { echo "FAIL  $pkg missing dist/index.d.ts"; exit 1; }
}

for pkg in \
  packages/astrospec-schema \
  packages/astrospec-runtime \
  packages/openspec-types \
  packages/openspec-runtime \
  packages/integrations/mindql-core \
  packages/integrations/mindgraphql-core \
  packages/integrations/openspec-plugin-mindql \
  packages/integrations/openspec-plugin-mindgraphql \
  packages/integrations/audio-openai \
  packages/integrations/events
do
  check_dual "$pkg"
done

echo "== Verify package.json exports maps =="
node - <<'NODE'
const fs = require('fs');
const path = require('path');
const pkgs = [
  "packages/astrospec-schema",
  "packages/astrospec-runtime",
  "packages/openspec-types",
  "packages/openspec-runtime",
  "packages/integrations/mindql-core",
  "packages/integrations/mindgraphql-core",
  "packages/integrations/openspec-plugin-mindql",
  "packages/integrations/openspec-plugin-mindgraphql",
  "packages/integrations/audio-openai",
  "packages/integrations/events",
];
let ok = true;
for (const p of pkgs) {
  const jsonPath = path.join(process.cwd(), p, 'package.json');
  const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const has = j.exports && j.exports["."] && j.exports["."].import && j.exports["."].require && j.types;
  if (has) console.log("PASS", p, "exports");
  else { console.log("FAIL", p, "exports map/types missing"); ok = false; }
}
if (!ok) process.exit(1);
NODE

echo "== Verify CLIs are ESM-only and built =="
[ -f packages/astrospec-cli/dist/cli.js ] && echo "PASS  astrospec-cli dist/cli.js" || { echo "FAIL  astrospec-cli dist missing"; exit 1; }
[ ! -f packages/astrospec-cli/dist/cli.cjs ] && echo "PASS  astrospec-cli has no CJS" || { echo "FAIL  astrospec-cli CJS exists (should be ESM-only)"; exit 1; }
[ -f packages/integrations/openspec-cli/dist/cli.js ] && echo "PASS  openspec-cli dist/cli.js" || { echo "FAIL  openspec-cli dist missing"; exit 1; }
[ ! -f packages/integrations/openspec-cli/dist/cli.cjs ] && echo "PASS  openspec-cli has no CJS" || { echo "FAIL  openspec-cli CJS exists (should be ESM-only)"; exit 1; }

echo "== Smoke run generators CLI from repo root (outputs under ./generated)"
node packages/integrations/openspec-cli/dist/cli.js examples/demo.mindql >/dev/null
node packages/integrations/openspec-cli/dist/cli.js examples/demo.mindgql >/dev/null

[ -f generated/mindql/ast.json ] && echo "PASS  generated/mindql/ast.json" || { echo "FAIL  missing mindql artifact"; exit 1; }
[ -f generated/graphql/schema.graphql ] && echo "PASS  generated/graphql/schema.graphql" || { echo "FAIL  missing GraphQL artifact"; exit 1; }

echo "== Smoke run core CLI (validate + verify) =="
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

cat >"$tmpdir/context.json" <<'JSON'
{
  "kind": "context",
  "id": "ctx_smoke",
  "intent": "smoke test",
  "scope": { "type": "session" },
  "lifespan": { "mode": "session" },
  "fields": {},
  "acceptanceCriteria": [],
  "lockedAt": "2026-02-09T00:00:00.000Z"
}
JSON

cat >"$tmpdir/turn.json" <<'JSON'
{
  "kind": "turn",
  "id": "turn_smoke",
  "intent": "smoke test turn",
  "inheritsFrom": "ctx_smoke",
  "fields": {},
  "acceptanceCriteria": [
    {
      "id": "c1",
      "description": "output equals expected object",
      "verifier": "equals",
      "params": { "value": { "a": 1 } }
    }
  ],
  "lockedAt": "2026-02-09T00:00:00.000Z"
}
JSON

cat >"$tmpdir/output.json" <<'JSON'
{ "a": 1 }
JSON

node packages/astrospec-cli/dist/cli.js validate "$tmpdir/context.json"
node packages/astrospec-cli/dist/cli.js validate "$tmpdir/turn.json"
node packages/astrospec-cli/dist/cli.js verify --turn "$tmpdir/turn.json" --output "$tmpdir/output.json" --write "$tmpdir/report.json" >/dev/null
node packages/astrospec-cli/dist/cli.js validate "$tmpdir/report.json"

echo "== Quick import/require smoke (direct dist paths) =="
node -e 'require("./packages/astrospec-runtime/dist/index.cjs"); console.log("PASS  CJS require astrospec-runtime")'
node --input-type=module -e 'import("./packages/astrospec-runtime/dist/index.js").then(()=>console.log("PASS  ESM import astrospec-runtime"))'
node -e 'require("./packages/integrations/mindql-core/dist/index.cjs"); console.log("PASS  CJS require mindql-core")'
node --input-type=module -e 'import("./packages/integrations/mindql-core/dist/index.js").then(()=>console.log("PASS  ESM import mindql-core"))'

echo "== All checks passed ✅"
