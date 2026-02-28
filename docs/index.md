# MindScript Docs

Welcome to the canonical entry point for MindScript documentation. (Formerly OpenSpec.)

MindScript should be understood as a vendor-neutral contract and protocol layer for humans, LLMs, agents, and tools.

That includes:

- requirements/spec authoring
- Context/Turn style contracts
- LLM-to-LLM and agent-to-agent handoff envelopes
- MCP-native interoperability
- schema-first validation and verification flows

## Start here

1. **Get oriented:** Read the [MindScript overview](mindscript/spec-overview.md) for the contract-language model and core concepts.
2. **Understand the wire/runtime shape:** Read the [protocol overview](mindscript/protocol.md).
3. **See it in action:** Walk through the [Quickstart](mindscript/quickstart.md).
4. **Integrate quickly (default):** Start with [MCP-native](mindscript/consumer-quickstart-mcp.md).
5. **Fallback path:** Use [schema-first / no-MCP mode](mindscript/consumer-quickstart-schema.md) when MCP plumbing is not available yet.
6. **Go deeper:** Learn the [spec language](mindscript/spec-language.md), [validation model](mindscript/spec-validation.md), and [adoption charter](mindscript/adoption-charter.md).

## Documentation map

- **MindScript Overview** — What MindScript is as a contract language and protocol layer. Start with the [spec overview](mindscript/spec-overview.md) and [protocol overview](mindscript/protocol.md).
- **Specification Layer** — Requirements/spec authoring, language shape, templates, and verification model.
- **Adoption** — Public package policy, migration map, compatibility promises, and extension rules. Start with the [adoption charter](mindscript/adoption-charter.md).
- **Integrations** — MCP profile, BDD adapters, and external examples.
- **API Reference** — Generated TypeDoc references for the TypeScript packages. Jump to the [runtime API docs](api/runtime/README.md).
- **Legacy** — Historical OpenSPI/OpenSpec pages preserved for compatibility.

## Looking for something specific?

- **What MindScript is:** [spec overview](mindscript/spec-overview.md) and [protocol](mindscript/protocol.md)
- **Adoption charter:** [adoption-charter](mindscript/adoption-charter.md)
- **Spec language details:** [spec language](mindscript/spec-language.md) and [schema](mindscript/spec-schema.md)
- **Package migration:** [orionai-to-mindscript scope migration](mindscript/migration-orionai-to-mindscript-scope.md)
- **Minimal external MCP + fallback E2E:** [examples/external/mcp-default-fallback](../examples/external/mcp-default-fallback/README.md)
- **Verification:** [verification](mindscript/verification.md)
- **Context & Turn lifecycle:** [context turn](mindscript/context-turn.md)
- **MindScript BDD Core (legacy id `openspec.core`):** [openspec.core](integrations/bdd/openspec.core/README.md)
