# TypeScript Bindings

AstroSpec ships TypeScript types aligned with the canonical JSON Schemas.

## Core Packages

- `@astrospec/schema`
- `@astrospec/runtime`

## Core Types

The runtime exports:

- `AstroSpecContext`
- `AstroSpecTurn`
- `SpecField`
- `AcceptanceCriterion`
- `EvidenceRef`
- `ProvenanceEntry`
- `VerificationReport`

## Evidence and Provenance Extensions

`EvidenceRef` includes optional retrieval-aware metadata:

- `sourceId`
- `span`
- `retrieval`

`ProvenanceEntry` includes optional attribution metadata:

- `entityId`
- `activityId`
- `agentId`
- `role`
- `derivedFrom`

## Retrieval Profile Types

`@astrospec/retrieval-profile` exports:

- `RetrievalRequest`
- `RetrievalResponse`
- `RetrievalCandidate`
- `RetrievalCitation`
- `RetrievalPlan`
- `GroundingAssessment`
- `MemoryRecord`
- `KnowledgeAssertion`
- `RetrievalStreamEvent`

## DX Layers

- `@astrospec/kit` provides convenience validation and MCP call helpers.
- `@astrospec/cli` provides contract validation and verification workflows.
