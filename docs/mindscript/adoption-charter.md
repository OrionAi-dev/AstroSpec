# MindScript Adoption Charter

## Purpose

MindScript is a vendor-neutral protocol and contract layer for:

1. human-to-LLM workflows
2. LLM-to-LLM workflows
3. agent-to-agent workflows
4. tool/runtime interoperability where structured intent and verification matter

## Public Core

Canonical public packages:

1. `@mindscript/agent-contracts`
2. `@mindscript/mcp-profile`
3. `@mindscript/kit`
4. `@mindscript/schema`
5. `@mindscript/runtime` (when published as public runtime surface)

## Protocol-First Principle

Public interoperability is defined by:

1. JSON schemas
2. deterministic error codes
3. MCP tool/resource mapping
4. stable machine-readable envelopes for validation, handoff, and verification

No specific framework (LangChain, LangGraph, etc.) is required for compatibility.

## Default and Fallback Policy

1. MCP profile is the default integration path for external adopters.
2. Direct schema validation is the fallback mode for teams that are not MCP-enabled yet.
3. Implementations should preserve deterministic parity between MCP tool outputs and direct validator outputs.

## Compatibility Promise

1. Schema and MCP contract changes are versioned.
2. Breaking contract changes require RFC + release notes.
3. Deprecated package aliases must include migration guidance and a compatibility window.
4. Public docs should describe MindScript as a contract/protocol layer, not only as a requirements document format.

## Public vs Private Extensions

Public contracts must not include product-private details such as:

1. internal service hostnames
2. private path allowlists
3. runtime secret/config internals
4. governance bypass or internal risk policy internals

Product-specific extensions belong in private repos or private namespaces unless promoted through public RFC.

## Recommendation for Adopters

Treat MindScript as the structured contract surface between intent and execution.

That can look like:

- authoring specs with acceptance criteria
- passing structured envelopes between models or agents
- validating tool outputs against schemas
- standardizing MCP-facing contract behavior

Spec authoring is one adoption path, not the only adoption path.
