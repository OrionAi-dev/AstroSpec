# Migration: MindScript to AstroSpec

AstroSpec replaces MindScript as the canonical public name of the standard.

## Rename Summary

1. `MindScript` is no longer the public package namespace.
2. Canonical packages move from `@mindscript/*` to `@astrospec/*`.
3. Canonical literals also move:
   - CLI: `mindscript` -> `astrospec`
   - MCP tools: `mindscript.*` -> `astrospec.*`
   - Resource URIs: `mindscript://` -> `astrospec://`

## Package Mapping

- `@mindscript/schema` -> `@astrospec/schema`
- `@mindscript/runtime` -> `@astrospec/runtime`
- `@mindscript/mcp-profile` -> `@astrospec/mcp-profile`
- `@mindscript/retrieval-profile` -> `@astrospec/retrieval-profile`
- `@mindscript/kit` -> `@astrospec/kit`
- `@mindscript/cli` -> `@astrospec/cli`
- `@mindscript/agent-contracts` -> `@astrospec/agent-contracts`

## Schema and Protocol Mapping

- `https://mindscript.dev/schemas/mindscript/...`
  -> `https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/...`
- `mindscript://...`
  -> `astrospec://...`
- `mindscript.contract.validate`
  -> `astrospec.contract.validate`

## Migration Rule

No MindScript compatibility namespace is retained in the canonical public surface. Update imports, commands, URIs, and docs directly to AstroSpec.
