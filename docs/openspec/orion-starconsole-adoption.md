# Orion And StarConsole Adoption

## Purpose

This document explains how Orion and StarConsole should use OpenSpec and MCP Secure Context Sharing
without turning OpenSpec into a universal LLM provider layer or orchestration runtime.

## Orion

Orion is a strong fit for:

- `@openspec/reasoning`
- `@openspec/retrieval-profile`
- `@openspec/graph-memory`
- `@openspec/runtime-interfaces`

Recommended usage:

- use `ReasoningTask`, `ReasoningResult`, and `ReasoningWorkflowContract` for portable reasoning
  exchange where Orion exposes or consumes interoperable contracts
- use retrieval and graph-memory profiles for evidence-first exchange, grounding, and memory
  boundary semantics
- use `RuntimeInterfaceDescriptor` to describe capability runtimes without exposing scheduler or
  provider internals
- use MCP projections where Orion needs interoperable resource or tool surfaces

Do not use OpenSpec as:

- Orion's hot-path provider adapter system
- Orion's scheduler or orchestration runtime
- a replacement for Orion-owned capability ids, action schemas, or provider bindings

## StarConsole

StarConsole is a strong fit for:

- bounded context containers
- reasoning/result exchange where externalized
- verifier or provenance metadata where results need portable verification
- MCP adapters for tool and resource projection
- runtime-interface descriptors where StarConsole exposes or discovers interoperable seams

Recommended usage:

- use bounded containers for least-privilege handoff and portable context exchange
- use OpenSpec verification and provenance metadata for externalized reasoning or verifier artifacts
- use the direct SDK lane for local export or handoff helpers
- treat packed or published release artifacts as the contract for external consumers
- keep StarConsole's workflow model, checkpoints, approvals, and tool policy StarConsole-owned

Do not use OpenSpec as:

- StarConsole's planner/executor hot path
- the internal workflow model
- the provider abstraction layer for structured-model backends

## Shared Boundary Rule

OpenSpec is the standards and interoperability substrate around Orion and StarConsole.

It is not:

- a universal LLM provider adapter
- a vendor API normalization layer
- an orchestration runtime

The shared structured-model adapter seam should remain implementation-owned by Orion and consumed by
StarConsole where useful.

## Consumption Modes

The preferred public contract is the published package lane.

- external tool consumers should use the published or packed package artifacts directly
- vendored-contract consumers may pin exact release artifacts downstream for reproducibility
- both consumption modes should validate against the same packaged release behavior
