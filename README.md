# AstroSpec

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/OrionAi-dev/AstroSpec)](https://github.com/OrionAi-dev/AstroSpec/releases/latest)
[![Docs](https://img.shields.io/badge/docs-spec-success)](./docs/index.md)

**AstroSpec is a vendor-neutral contract standard for humans, LLMs, agents, tools, and runtimes.**

It exists to make intent, constraints, evidence, citations, grounding, and verification explicit in stable machine-readable contracts.

AstroSpec is designed to be infrastructure:

- a contract language
- a schema and validation layer
- a protocol and interoperability layer
- a profile registry for domain-specific contracts
- a neutral standard surface for retrieval and evidence exchange

## What AstroSpec Is

AstroSpec is not just a spec-authoring format and it is not just a prompt wrapper.

It can sit between:

- humans and AI systems
- one model and another model
- agents and tool runtimes
- retrieval systems and consuming applications
- governance layers and execution layers

Its first serious adoption wedge is **RAG interoperability**:

- retrieval requests and results
- citations and evidence
- memory records
- graph knowledge assertions
- grounding and verification

## Why It Matters

Without a contract layer, systems fall back to prompt text, hidden assumptions, brittle JSON, and adapter sprawl.

AstroSpec makes the exchange explicit so systems can:

- validate before acting
- verify after acting
- cite evidence deterministically
- attribute provenance clearly
- interoperate across tools and vendors
- keep product-specific behavior out of the standard surface

## Public Package Map

### Core

- `@astrospec/schema`
- `@astrospec/runtime`

### Interop

- `@astrospec/mcp-profile`

### Profiles

- `@astrospec/retrieval-profile`

### DX

- `@astrospec/kit`
- `@astrospec/cli`

### Specialized downstream bundles

- `@astrospec/agent-contracts`

### Compatibility wrappers

- `@astrospec/openspec-runtime`
- `@astrospec/openspec-types`

These wrappers exist for legacy OpenSpec compatibility. They are not the preferred integration surface for new consumers.

## Implementation Layers

1. **Language layer**: human- and machine-readable contract concepts such as Context, Turn, evidence, provenance, and verification.
2. **Schema layer**: canonical JSON Schemas published by `@astrospec/schema`.
3. **Runtime validation and verification layer**: deterministic validation, locking, merging, diffing, and verifier execution in `@astrospec/runtime`.
4. **MCP interoperability layer**: canonical MCP tool names, resource URIs, and deterministic error semantics in `@astrospec/mcp-profile`.
5. **Retrieval profile layer**: portable RAG contracts in `@astrospec/retrieval-profile`.
6. **Integrations and downstream bundles**: BDD mappings, generators, vendor adapters, and specialized orchestration bundles.

## Core vs Profiles vs Integrations

### Core

Core stays small and conservative.

Core covers:

- Context and Turn contracts
- evidence and provenance
- validation and verification
- compatibility semantics

### Profiles

Profiles standardize domain-specific contract families without bloating core.

The first normative profile is the retrieval profile.

### Integrations

Integrations adapt AstroSpec to specific ecosystems such as:

- MCP tools and resources
- BDD frameworks
- generators and DSLs
- product-specific runtimes

BDD remains supported, but it is an integration family, not the top-level identity of AstroSpec.

## Retrieval Profile

`@astrospec/retrieval-profile` defines portable envelopes for:

- `RetrievalRequest`
- `RetrievalResponse`
- `RetrievalPlan`
- `MemoryRecord`
- `KnowledgeAssertion`
- `RetrievalStreamEvent`

This is a contract surface for retrieval interoperability. It does not implement a retrieval engine.

## MCP Interoperability

AstroSpec is transport-agnostic, but MCP is the default interop path.

The MCP profile standardizes:

- tool names
- resource URI shapes
- deterministic error codes
- retrieval, memory, and graph tool surfaces

## Quickstart

1. Read the docs index: [docs/index.md](./docs/index.md)
2. Read the overview: [docs/astrospec/spec-overview.md](./docs/astrospec/spec-overview.md)
3. Read the protocol: [docs/astrospec/protocol.md](./docs/astrospec/protocol.md)
4. Read the retrieval profile: [docs/astrospec/retrieval-profile.md](./docs/astrospec/retrieval-profile.md)
5. Start with MCP: [docs/astrospec/consumer-quickstart-mcp.md](./docs/astrospec/consumer-quickstart-mcp.md)
6. Use schema-first fallback when needed: [docs/astrospec/consumer-quickstart-schema.md](./docs/astrospec/consumer-quickstart-schema.md)

## Adoption Path

A typical adopter should integrate in this order:

1. validate core payloads with `@astrospec/runtime`
2. adopt the retrieval profile if the system exchanges retrieval evidence or grounding data
3. expose MCP mappings only if tool/runtime interoperability is needed
4. add product-specific behavior in downstream packages or vendor-namespaced extensions, not in AstroSpec core

## Governance and Compatibility

AstroSpec is being positioned as a neutral standard surface.

Start here:

- [Governance Charter](./docs/governance/charter.md)
- [Compatibility Policy](./docs/governance/compatibility-policy.md)
- [Profile Registry Policy](./docs/governance/profile-registry-policy.md)
- [Change Control](./docs/governance/change-control.md)

## Conformance

Normative additions are expected to ship with:

- schema
- validator
- docs
- example
- conformance fixture

See:

- [conformance/core](./conformance/core)
- [conformance/retrieval-profile](./conformance/retrieval-profile)
- [conformance/mcp-profile](./conformance/mcp-profile)

## Legacy and History

Two older names still appear in this repo:

- `OpenSpec` for legacy compatibility wrappers and archived integration material
- `MindScript` only in migration documentation

New integrations, examples, and public references should use AstroSpec only.

## Integrations

AstroSpec supports integrations for MCP, BDD, generators, and other ecosystems.

BDD references and adapters live under [docs/integrations/bdd](./docs/integrations/bdd/).

## Contributing

Useful contributions include:

- new examples and conformance fixtures
- compatibility and validation improvements
- new profile proposals
- alternate implementations that prove interoperability
- documentation that clarifies the standard surface

## License

Copyright 2025 Michael Gregory Mahoney

Licensed under the [Apache License 2.0](./LICENSE).
