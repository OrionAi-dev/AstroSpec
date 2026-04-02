# TypeScript Bindings

OpenSpec ships TypeScript types aligned with the canonical JSON Schemas.

## Core Packages

- `@openspec/schema`
- `@openspec/runtime`

## Core Types

The runtime exports:

- `OpenSpecContext`
- `OpenSpecTurn`
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

`@openspec/retrieval-profile` exports:

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

- `@openspec/kit` provides convenience validation and MCP call helpers.
- `@openspec/cli` provides contract validation and verification workflows.
