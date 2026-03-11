# Graph Memory Profile

`@astrospec/graph-memory` defines portable structures for reusable discovery artifacts and structural retrieval.

## Node Set

- `Prompt`
- `Abstraction`
- `Domain`
- `Pattern`
- `Mapping`
- `CandidateArchitecture`
- `Evaluation`
- `Constraint`
- `Outcome`

## Relationship Set

- `ABSTRACTED_TO`
- `EXPLORED_BY`
- `CONTRIBUTES_PATTERN`
- `MAPPED_TO`
- `COMBINED_INTO`
- `TESTED_AGAINST`
- `REFINED_INTO`
- `REJECTED_FOR`
- `SUPPORTED_BY`

## Structural Retrieval

The profile adds:

- `StructuralGraphQuery`
- `StructuralGraphMatch`
- `MemoryPromotionEnvelope`

The contracts are intentionally neutral about the underlying graph database and retrieval algorithm. They describe the payloads, not the engine.

## Reused Retrieval Primitives

This profile reuses retrieval-profile primitives for:

- `MemoryRecord`
- `KnowledgeAssertion`
- evidence references

That keeps memory and assertion envelopes canonical instead of duplicating them in multiple profiles.

## Domain Overlays

Legal and symbolic domains may use this profile to store portable artifact shapes such as claim linkage, procedural dependencies, chart entities, or transit windows.

Jurisdiction-specific legal logic and worldview-specific symbolic interpretation remain outside AstroSpec core and public profile semantics.
