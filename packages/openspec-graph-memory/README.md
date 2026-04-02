# @openspec/graph-memory

Portable graph-memory and structural retrieval contracts for OpenSpec.

## What It Provides

- JSON schemas for graph-memory nodes and structural retrieval envelopes.
- Reusable relationship enums for discovery artifacts.
- Deterministic validators for structural retrieval and promotion payloads.
- Portable memory envelopes that can be implemented by any graph-memory runtime.

## Scope

This package standardizes:

- reusable discovery artifact nodes
- graph relationship names
- structural retrieval requests and matches
- memory promotion envelopes

It does not implement graph persistence, ranking, promotion policy, or retrieval heuristics.

## Commands

```bash
pnpm -F @openspec/graph-memory typecheck
pnpm -F @openspec/graph-memory test
pnpm -F @openspec/graph-memory build
```
