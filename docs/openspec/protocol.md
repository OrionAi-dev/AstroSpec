# AstroSpec Protocol

AstroSpec is transport-agnostic. This document defines the baseline protocol shape for contract exchange and explains how profiles extend it.

## Core Protocol Scope

Core protocol covers:

- Context creation and update
- Turn draft and lock
- verification of outputs against contracts
- stable envelopes for handoff between systems

## Core Endpoints

A minimal HTTP-friendly implementation can expose:

- `POST /context`
- `POST /turn`
- `POST /verify`

These remain baseline operations for a core AstroSpec implementation. AstroSpec does not require HTTP specifically; these operations describe the contract boundaries, not the transport mandate.

## Envelope Expectations

Core exchanges should be explicit about:

- schema or protocol version
- contract kind
- validation failure behavior
- any profile version in use

The guiding rule is additive-first and fail-closed when validation fails.

## Profile Extension Rule

Profiles extend the protocol additively.

For example, the retrieval profile can add retrieval-oriented endpoints or MCP tools without changing the core meaning of Context and Turn.

Profiles must not redefine core fields.

## Retrieval Profile Protocol Expectations

The retrieval profile standardizes envelopes for:

- `RetrievalRequest`
- `RetrievalResponse`
- `RetrievalStreamEvent`
- `MemoryRecord`
- `KnowledgeAssertion`

Implementations may expose these through HTTP, MCP, queues, sockets, or other transports.

## MCP Mapping

AstroSpec is schema-first, but MCP is the default interoperability profile.

That means an AstroSpec implementation can:

- keep schemas as the source of truth
- expose MCP tool names and resource URIs for runtime integration
- preserve deterministic AstroSpec validation semantics even when the transport is MCP

## Compatibility

Servers and clients should be explicit about:

- protocol version
- profile version
- compatibility mode
- deterministic error behavior

A consumer should never need to guess whether a payload is core AstroSpec, a normative profile, or a private extension.
