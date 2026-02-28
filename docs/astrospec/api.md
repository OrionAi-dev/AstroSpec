# AstroSpec API

AstroSpec defines a compact contract surface for exchanging core and profile payloads between systems.

## Core Contracts

Core contracts remain:

- `Context`
- `Turn`
- `AcceptanceCriteria`
- `Provenance`
- `VerificationReport`

These are published from `@astrospec/schema` and implemented in `@astrospec/runtime`.

## Additive Core Refinements

### EvidenceRef

`EvidenceRef` now supports retrieval-aware optional fields:

- `sourceId`
- `span`
- `retrieval`

This allows systems to cite and ground outputs without making retrieval semantics part of every core contract.

### ProvenanceEntry

`ProvenanceEntry` now supports optional PROV-aligned attribution fields:

- `entityId`
- `activityId`
- `agentId`
- `role`
- `derivedFrom`

## Retrieval Profile Contracts

The retrieval profile adds:

- `RetrievalRequest`
- `RetrievalResponse`
- `RetrievalPlan`
- `MemoryRecord`
- `KnowledgeAssertion`
- `RetrievalStreamEvent`

These are published from `@astrospec/retrieval-profile`.

## Versioning Rule

Core and profiles version independently.

- core changes are conservative and additive-first
- profile changes can move faster, but must preserve explicit compatibility rules

## Validation Rule

A surface should not be presented as standard-ready unless it ships with:

- schema
- validator
- docs
- examples
- conformance fixtures
