# Overview

MCP Secure Context Sharing adds a missing layer to the MCP ecosystem: portable context exchange with explicit scope, policy, provenance, and verification.

## How it fits MCP

MCP remains the interoperability and tool-access layer.

MCP Secure Context Sharing adds:

- portable context containers
- scoped context slices
- least-privilege policy metadata
- provenance and verification envelopes
- optional signing and expiration controls

## Architecture

### Context Containers

The lightweight exchange format.

Use them when you need a portable object for:

- `UserContext`
- `TaskState`
- `KnowledgeObject`
- `MemoryReference`

### OpenSpec

The trust layer.

Use it when you need:

- validation
- provenance
- permissions
- TTL and expiration
- verification metadata
- optional signature support

### MCP adapters

Use MCP adapters when the container or verification layer needs to be exposed through MCP resources or tool calls.

## Orion And StarConsole Boundary

Orion and StarConsole are good examples of the boundary this repo is meant to serve.

- Orion can consume OpenSpec reasoning, retrieval, graph-memory, and runtime-interface contracts.
- StarConsole can consume bounded context containers, reasoning/result exchange, verification
  metadata, and MCP projections where external interoperability matters.

This repo does not define:

- a universal LLM provider adapter
- provider/backend normalization
- an orchestration runtime

## Design rules

- Keep MCP central.
- Share only bounded context.
- Default to least privilege.
- Treat policy and provenance as first-class metadata.
- Keep the core object model small and composable.
