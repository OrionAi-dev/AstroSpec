# AstroSpec Adoption Charter

## Purpose

AstroSpec is being developed as a neutral contract standard for:

1. human-to-LLM workflows
2. LLM-to-LLM workflows
3. agent-to-agent workflows
4. tool/runtime interoperability
5. retrieval and evidence interoperability

## Public Package Hierarchy

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

## Protocol-First Principle

Public interoperability is defined by:

1. schemas
2. validators
3. deterministic error semantics
4. MCP tool and resource mappings where applicable
5. examples and conformance fixtures

## Default and Fallback Policy

1. MCP is the default interop path.
2. Direct schema validation remains the fallback path.
3. Profiles extend core additively.
4. Retrieval is the first normative profile.

## Compatibility Promise

1. Core is conservative and additive-first.
2. Profiles version independently.
3. Breaking compatibility changes require RFC and migration guidance.
4. Public docs should describe AstroSpec as infrastructure, not as a product wrapper.
