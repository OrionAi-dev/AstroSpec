# Migration: AstroSpec to OpenSpec

OpenSpec is now the canonical public identity of the standard.

## Rename Summary

1. `AstroSpec` is legacy naming only.
2. Public packages move to `@openspec/*`.
3. AstroSpec-named packages and aliases were removed from the active package graph.
4. Active integrations, examples, and docs now use OpenSpec names only.

## Package Mapping

- `@astrospec/runtime` -> `@openspec/runtime`
- `@astrospec/schema` -> `@openspec/schema`
- `@astrospec/kit` -> `@openspec/kit`
- `@astrospec/cli` -> `@openspec/cli`
- `@astrospec/retrieval-profile` -> `@openspec/retrieval-profile`
- `@astrospec/reasoning` -> `@openspec/reasoning`
- `@astrospec/graph-memory` -> `@openspec/graph-memory`
- `@astrospec/starburst-profile` -> `@openspec/starburst-profile`
- `@astrospec/runtime-interfaces` -> `@openspec/runtime-interfaces`
- `@astrospec/discovery-bundle` -> `@openspec/discovery-bundle`
- `@astrospec/agent-contracts` -> `@openspec/agent-contracts`

## Documentation Mapping

- `docs/openspec/*` is the canonical documentation surface
- `docs/spec-bdd-openspec-core.md` records the renamed historical BDD alias
- Migration docs preserve rename history only

## Migration Rule

Use OpenSpec names for all new integrations, examples, packages, schema ids, MCP tools, and docs. Treat AstroSpec names as historical references only.
