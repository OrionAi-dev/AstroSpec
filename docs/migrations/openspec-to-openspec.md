# Migration: OpenSpec to AstroSpec

AstroSpec is the canonical public identity of the standard.

## Rename Summary

1. `OpenSpec` is historical lineage only.
2. Public packages move to `@astrospec/*`.
3. Legacy OpenSpec wrapper packages were removed from the active package graph.
4. Active integrations, examples, and docs now use AstroSpec names only.

## Package Mapping

- `@astrospec/runtime` -> canonical runtime
- `@astrospec/schema` -> canonical schema package
- `@astrospec/mcp-profile` -> canonical MCP interoperability package
- `@astrospec/retrieval-profile` -> canonical retrieval profile package

## Documentation Mapping

- `docs/astrospec/*` is the canonical documentation surface
- `docs/spec-bdd-astrospec-core.md` records the renamed historical BDD alias
- Migration docs preserve rename history only

## Migration Rule

Use AstroSpec names for all new integrations, examples, packages, and docs. Treat OpenSpec names as historical references only.
