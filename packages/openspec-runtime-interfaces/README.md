# @openspec/runtime-interfaces

Neutral runtime and interoperability interfaces for OpenSpec.

## What It Provides

- Interface shapes for reasoning runtimes, discovery runtimes, graph-memory providers, and constellation executors.
- A portable descriptor schema for publishing runtime capabilities without exposing proprietary implementation details.
- Deterministic descriptor validation.

## Scope

This package defines interface boundaries. It does not ship a scheduler, graph engine, or orchestration runtime.

## Commands

```bash
pnpm -F @openspec/runtime-interfaces typecheck
pnpm -F @openspec/runtime-interfaces test
pnpm -F @openspec/runtime-interfaces build
```
