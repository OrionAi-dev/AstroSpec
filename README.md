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

### Umbrella framework packages

- `@mcp-secure-context/core`
- `@mcp-secure-context/openspec`
- `@mcp-secure-context/mcp-adapter`
- `@mcp-secure-context/sdk-typescript`
- `@mcp-secure-context/cli`

### Canonical standard packages

- `@openspec/schema`
- `@openspec/runtime`
- `@openspec/kit`
- `@openspec/cli`
- `@openspec/retrieval-profile`
- `@openspec/reasoning`
- `@openspec/graph-memory`
- `@openspec/starburst-profile`
- `@openspec/runtime-interfaces`
- `@openspec/discovery-bundle`
- `@openspec/agent-contracts`
- `@openspec/mindql-core`
- `@openspec/mindgraphql-core`
- `@openspec/integration-audio-openai`
- `@openspec/integration-events`

## Quickstart

### TypeScript

```ts
import {
  createContextContainer,
  digestContextContainer,
  shareContainer,
  validateContainer,
  verifyContainer
} from "@mcp-secure-context/sdk-typescript";

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
const digest = digestContextContainer(container);
const verification = await verifyContainer(container);
const share = await shareContainer(container);
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
- direct SDK ergonomics for local tool consumers
- release artifacts that support both installed-package and vendored-contract consumers

## Docs

- [Docs index](./docs/index.md)
- [Overview](./docs/overview.md)
- [Context Containers](./docs/context-containers.md)
- [OpenSpec](./docs/openspec.md)
- [Vendored release-artifact consumers](./docs/openspec/vendored-consumers.md)
- [MCP Integration](./docs/mcp-integration.md)

## Legacy migration

This repo previously used AstroSpec naming. AstroSpec references are now retained only in explicitly legacy migration documentation.

- [Legacy AstroSpec migration notes](./docs/migrations/legacy-astrospec/README.md)

## License

Copyright 2025 Michael Gregory Mahoney

Licensed under the [Apache License 2.0](./LICENSE).
