# Retrieval Profile

The AstroSpec retrieval profile is the first normative profile for external adoption.

It standardizes the contract surface for RAG interoperability without standardizing any particular retrieval engine.

## What It Covers

- retrieval requests
- retrieval responses
- citations and evidence spans
- retrieval planning
- memory records
- graph knowledge assertions
- grounding assessment
- retrieval streaming events

## Primary Types

- `RetrievalRequest`
- `RetrievalResponse`
- `RetrievalCandidate`
- `RetrievalCitation`
- `RetrievalPlan`
- `GroundingAssessment`
- `MemoryRecord`
- `KnowledgeAssertion`
- `RetrievalStreamEvent`

## Supported Technique IDs

- `keyword`
- `vector`
- `hybrid`
- `pageindex`
- `graph`
- `graph_expand`
- `rerank`
- `compress`
- `decompose`
- `verify`
- `multimodal`
- `agentic`

## Deterministic Rules

The profile makes a few semantic rules explicit:

1. citations must point at candidates actually present in the response
2. memory records must declare a supported memory kind
3. stream `final` events must carry a full terminal response envelope
4. unsupported techniques should fail with deterministic AstroSpec reason codes

## Relationship to Discovery Profiles

The retrieval profile remains the shared source for:

- `MemoryRecord`
- `KnowledgeAssertion`
- evidence spans and references

New discovery packages such as `@astrospec/graph-memory` reuse those primitives instead of redefining them. Retrieval remains the canonical memory/assertion envelope layer, while reasoning and discovery profiles add higher-level workflow and graph semantics.

## Reason Codes

- `AS_RETRIEVAL_INVALID_INPUT`
- `AS_RETRIEVAL_UNSUPPORTED_TECHNIQUE`
- `AS_RETRIEVAL_INDEX_UNAVAILABLE`
- `AS_RETRIEVAL_MEMORY_UNAVAILABLE`
- `AS_RETRIEVAL_NO_EVIDENCE`
- `AS_RETRIEVAL_GROUNDING_LOW`
- `AS_RETRIEVAL_VERIFICATION_FAILED`
- `AS_RETRIEVAL_TIMEOUT`
- `AS_RETRIEVAL_NOT_AUTHORIZED`

## Design Rule

This profile standardizes envelopes and semantics.

It does not standardize:

- chunking strategy
- vector database internals
- ranking implementation
- graph storage implementation
- generation prompts

## Why This Profile Exists First

Retrieval systems, app surfaces, agent runtimes, and governance layers all need a stable way to exchange grounded evidence.

That makes retrieval the highest-leverage first profile for AstroSpec standardization.
