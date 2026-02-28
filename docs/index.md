# AstroSpec Docs

AstroSpec is a vendor-neutral contract standard for humans, LLMs, agents, tools, and runtimes.

It should be understood as:

- a contract language
- a schema and validation layer
- a protocol and interoperability layer
- a profile registry for domain-specific contracts
- a neutral standard surface for retrieval and evidence exchange

## Start Here

If you are new to AstroSpec, read in this order:

1. [Overview](astrospec/spec-overview.md)
2. [Protocol](astrospec/protocol.md)
3. [Retrieval Profile](astrospec/retrieval-profile.md)
4. [Evidence and Provenance](astrospec/evidence-provenance.md)
5. [MCP Profile](astrospec/mcp-profile.md)
6. [Governance Charter](governance/charter.md)

## Documentation Map

- **Overview**: [spec-overview](astrospec/spec-overview.md)
- **Protocol**: [protocol](astrospec/protocol.md)
- **Core API**: [api](astrospec/api.md), [typescript](astrospec/typescript.md), [verification](astrospec/verification.md)
- **Retrieval profile**: [retrieval-profile](astrospec/retrieval-profile.md), [retrieval examples](astrospec/retrieval-examples.md)
- **Interop**: [mcp-profile](astrospec/mcp-profile.md)
- **Governance**: [charter](governance/charter.md), [compatibility-policy](governance/compatibility-policy.md), [profile-registry-policy](governance/profile-registry-policy.md), [change-control](governance/change-control.md)
- **Migrations**: [OpenSpec to AstroSpec](migrations/openspec-to-astrospec.md), [MindScript to AstroSpec](migrations/mindscript-to-astrospec.md), [OrionAI scope to AstroSpec](astrospec/migration-orionai-to-astrospec-scope.md)
- **Integrations**: [BDD adapters](integrations/bdd/@software/README.md)
- **API reference**: generated under `docs/api/`

## Package Roles

- `@astrospec/schema`: canonical core schemas
- `@astrospec/runtime`: validation, locking, diffing, verification
- `@astrospec/mcp-profile`: canonical MCP mapping
- `@astrospec/retrieval-profile`: retrieval and evidence profile contracts
- `@astrospec/kit`: small DX layer
- `@astrospec/cli`: contract tooling
- `@astrospec/agent-contracts`: specialized downstream bundle

## How to Adopt

Use AstroSpec in layers:

1. start with core schemas and runtime validation
2. add the retrieval profile if the system exchanges evidence, citations, memory, or graph assertions
3. add the MCP profile only when a tool/runtime transport mapping is needed
4. keep product-specific semantics in downstream extensions rather than extending AstroSpec core casually

## Legacy Surface

Legacy OpenSpec wrapper packages and archived integration material remain in the repo for compatibility and historical context.

MindScript should only appear in migration material, not in the current public story.
