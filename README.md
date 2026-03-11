# MCP Secure Context Sharing

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![Docs](https://img.shields.io/badge/docs-framework-success)](./docs/index.md)

**MCP Secure Context Sharing is an open-source framework for securely sharing user context, task state, and knowledge between MCP-compatible agents and tools using portable context containers and a built-in trust layer.**

It is not a replacement for MCP.

It is an MCP-compatible extension framework for:

- portable context containers
- scoped context sharing
- provenance and verification
- permissions and expiration controls
- policy-aware agent and tool handoffs

## Architecture

### MCP Secure Context Sharing

The umbrella project and public framework.

### Context Containers

Portable structured objects for sharing:

- user context
- task state
- knowledge objects
- memory references

### OpenSpec

The verification and policy layer for:

- provenance
- validation
- permissions
- TTL and expiration
- sensitivity labels
- optional signing

### MCP Integration

Adapters, resource helpers, server patterns, and reference implementations for MCP-compatible systems.

## Package Map

### Canonical packages

- `@mcp-secure-context/core`
- `@mcp-secure-context/openspec`
- `@mcp-secure-context/mcp-adapter`
- `@mcp-secure-context/sdk-typescript`
- `@mcp-secure-context/cli`

### Compatibility packages

- `@astrospec/schema`
- `@astrospec/runtime`
- `@astrospec/mcp-profile`
- `@astrospec/kit`
- `@astrospec/cli`

These compatibility packages remain available for one transition cycle and re-export the new canonical packages.

### Secondary extension packages

These remain available but are no longer the primary public identity of the repo:

- `@astrospec/retrieval-profile`
- `@astrospec/reasoning`
- `@astrospec/graph-memory`
- `@astrospec/starburst-profile`
- `@astrospec/runtime-interfaces`
- `@astrospec/discovery-bundle`
- `@astrospec/agent-contracts`

## Quickstart

### TypeScript

```ts
import { createContextContainer, validateContainer } from "@mcp-secure-context/sdk-typescript";

const container = createContextContainer({
  containerType: "task_state",
  id: "task-123",
  payload: {
    taskId: "task-123",
    goal: "Summarize this ticket for the next agent",
    status: "in_progress",
  },
  policy: {
    audience: ["agent", "tool"],
    allowedActions: ["read"],
    purpose: "handoff",
    sensitivity: "internal",
  },
  provenance: {
    createdAt: new Date().toISOString(),
    createdBy: "agent://planner",
  },
});

const result = validateContainer(container);
```

### CLI

```bash
pnpm -F @mcp-secure-context/cli build
pnpm exec mcp-secure-context validate-container container.json
```

## Why this exists

MCP standardizes tool and data interoperability. It does not yet standardize a portable, bounded, policy-aware way to hand context between agents, tools, and systems.

MCP Secure Context Sharing fills that gap with:

- least-privilege sharing
- explicit scope and audience
- portable container formats
- provenance and verification metadata
- optional trust hardening through OpenSpec

## Docs

- [Docs index](./docs/index.md)
- [Overview](./docs/overview.md)
- [Context Containers](./docs/context-containers.md)
- [OpenSpec](./docs/openspec.md)
- [MCP Integration](./docs/mcp-integration.md)

## Legacy migration

This repo was previously published as AstroSpec. AstroSpec naming is retained only for compatibility packages, historical references, and migration documentation.

- [Legacy AstroSpec migration notes](./docs/migrations/legacy-astrospec/README.md)

## License

Copyright 2025 Michael Gregory Mahoney

Licensed under the [Apache License 2.0](./LICENSE).
