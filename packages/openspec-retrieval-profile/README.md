# @astrospec/retrieval-profile

Portable retrieval, citation, memory, graph, and grounding contracts for AstroSpec.

## What It Provides

- JSON schemas for:
  - `RetrievalRequest`
  - `RetrievalResponse`
  - `RetrievalPlan`
  - `MemoryRecord`
  - `KnowledgeAssertion`
  - `RetrievalStreamEvent`
- Deterministic validators for each profile contract.
- Stable retrieval reason-code namespace.
- A portable contract surface for RAG interoperability, not a retrieval engine.

## Scope

This package is the first normative AstroSpec profile.

It standardizes:

- retrieval requests and results
- evidence and citations
- grounding assessments
- persistent memory records
- knowledge graph assertions
- streaming retrieval events

It does not implement ranking, indexing, graph storage, or generation.

## Commands

```bash
pnpm -F @astrospec/retrieval-profile typecheck
pnpm -F @astrospec/retrieval-profile test
pnpm -F @astrospec/retrieval-profile build
```
