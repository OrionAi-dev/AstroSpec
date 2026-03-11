# @astrospec/graph-memory

Portable graph-memory and structural retrieval contracts for AstroSpec.

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
pnpm -F @astrospec/graph-memory typecheck
pnpm -F @astrospec/graph-memory test
pnpm -F @astrospec/graph-memory build
```
