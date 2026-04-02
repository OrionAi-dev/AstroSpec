# Migration: MindScript to OpenSpec

OpenSpec replaces MindScript as the canonical public name of the standard.

## Rename Summary

1. `MindScript` is no longer the public package namespace.
2. Canonical packages move from `@mindscript/*` to `@openspec/*`.
3. Canonical literals also move:
   - CLI: `mindscript` -> `openspec`
   - MCP tools: `mindscript.*` -> `openspec.*`
   - Resource URIs: `mindscript://` -> `openspec://`

## Package Mapping

- `@mindscript/schema` -> `@openspec/schema`
- `@mindscript/runtime` -> `@openspec/runtime`
- `@mindscript/mcp-profile` -> `@openspec/mcp-profile`
- `@mindscript/retrieval-profile` -> `@openspec/retrieval-profile`
- `@mindscript/kit` -> `@openspec/kit`
- `@mindscript/cli` -> `@openspec/cli`
- `@mindscript/agent-contracts` -> `@openspec/agent-contracts`

## Schema and Protocol Mapping

- `https://mindscript.dev/schemas/mindscript/...`
  -> `https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/openspec/...`
- `mindscript://...`
  -> `openspec://...`
- `mindscript.contract.validate`
  -> `openspec.contract.validate`

## Migration Rule

No MindScript compatibility namespace is retained in the canonical public surface. Update imports, commands, URIs, and docs directly to OpenSpec.
