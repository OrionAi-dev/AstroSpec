# AstroSpec Overview

AstroSpec is a structured contract standard for intent, constraints, acceptance criteria, evidence, provenance, and verification.

It has two layers of value:

1. a generic core contract model
2. domain-specific profiles built on top of that core

The first normative profile is the retrieval profile for RAG interoperability.

AstroSpec also publishes a portable reasoning and discovery family:

- `@astrospec/reasoning`
- `@astrospec/graph-memory`
- `@astrospec/starburst-profile`
- `@astrospec/runtime-interfaces`

## Core Concepts

### 1. Context and Turn

Core AstroSpec distinguishes between:

- **Context**: a long-lived shared contract
- **Turn**: a scoped execution or handoff contract

These keep durable assumptions separate from one-shot actions or responses.

### 2. Evidence and Provenance

AstroSpec treats evidence and provenance as first-class contract fields.

That means systems can exchange:

- evidence references
- citation spans
- retrieval metadata
- provenance and derivation chains

### 3. Verification

AstroSpec emphasizes deterministic validation and verification rather than best-effort interpretation.

### 4. Profiles

Profiles standardize narrower domains without bloating core.

The first normative profile covers:

- retrieval request and response
- citations
- grounding
- memory records
- graph knowledge assertions
- retrieval stream events

The discovery profile family covers:

- reasoning tasks and workflow contracts
- graph-memory artifact nodes
- structural retrieval requests and matches
- abstraction, mapping, hypothesis, evaluation, and synthesis outputs
- neutral runtime interoperability interfaces

## Adoption Wedge

AstroSpec is intended to become infrastructure.

The practical adoption wedge is retrieval interoperability because multiple systems already need a portable way to exchange:

- what was asked
- what was retrieved
- what evidence supports the answer
- what memory or graph data was used
- what grounding or verification outcome was reached

## What AstroSpec Is Not

AstroSpec is not:

- a retrieval engine
- a vector store abstraction
- a prompt wrapper format
- a BDD framework
- a vendor-specific runtime disguised as a standard
- a discovery engine implementation
- scheduler heuristics or memory-promotion policy

## Why This Matters

A small core plus explicit profiles makes AstroSpec more adoptable as infrastructure:

- the core stays stable
- profiles can move faster
- integrations remain replaceable
- consumers know what is normative versus product-specific
- adoption can happen incrementally instead of requiring a whole-platform rewrite
- flagship runtimes can publish interfaces while keeping execution internals private
