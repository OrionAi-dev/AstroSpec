# Migration: OpenSpec to AstroSpec

AstroSpec is the canonical public identity of the standard.

## Rename Summary

1. `OpenSpec` is historical lineage only.
2. Public packages move to `@astrospec/*`.
3. Legacy OpenSpec wrappers remain only as compatibility helpers:
   - `@astrospec/openspec-runtime`
   - `@astrospec/openspec-types`

## Package Mapping

- `@astrospec/openspec-runtime` -> legacy compatibility wrapper
- `@astrospec/openspec-types` -> legacy compatibility wrapper
- `@astrospec/runtime` -> canonical runtime
- `@astrospec/schema` -> canonical schema package

## Documentation Mapping

- `docs/spec-bdd-openspec-core.md` remains historical
- `docs/astrospec/*` is the canonical documentation surface

## Migration Rule

Use AstroSpec names for all new integrations, examples, and docs. Treat OpenSpec names as compatibility or historical references only.
