# MindScript Overview

MindScript is a structured contract language for intent, constraints, acceptance criteria, and verification.

It can be used as both:

- a specification layer for human-authored requirements
- a machine-readable contract layer for LLM-to-LLM, agent-to-agent, and tool/runtime exchange

That dual role is the important framing.

MindScript is not just a prettier spec document format, and it is not only a transport protocol. It is the shared contract surface between planning, execution, review, and verification.

---

## Core concepts

### 1. Spec nodes

A spec node is the smallest explicit unit of intent.

It can represent:

- a requirement
- a field
- a constraint
- an acceptance criterion
- a reference to another contract, scenario, or artifact

### 2. Contracts

MindScript contracts make expectations explicit in forms a runtime or verifier can inspect.

That includes:

- required fields
- acceptance criteria
- references to external artifacts or scenarios
- compatibility expectations
- verifiable output conditions

### 3. Handoffs

MindScript can sit between components, not just before them.

Examples:

- one model drafts a contract another model must satisfy
- a planner emits a structured request for an executor
- an agent emits a result envelope that a verifier must validate
- a human defines acceptance criteria before an AI drafting step begins

### 4. Verification

Acceptance criteria are meant to be testable, reviewable, or automatically checkable.

That is why MindScript emphasizes deterministic schemas, validation, and error behavior rather than vague “best effort” interpretation.

---

## Conventions

- JSON and TypeScript contracts are first-class
- YAML and Markdown-frontmatter remain useful for human-authored domains
- each requirement, field, or criterion should have a stable identifier
- verifiers and tool integrations should be machine-checkable where possible
- compatibility behavior should be explicit, not implicit

---

## Why this matters

Without a contract layer, systems fall back to prompt text, hidden assumptions, and brittle adapters.

MindScript exists to make the contract explicit.

That helps:

- humans reason about intent and acceptance criteria
- models consume and emit structured envelopes
- runtimes validate expectations deterministically
- teams move across domains without redefining the whole contract model each time

---

## Cross-references

- [context-turn.md](./context-turn.md) → Context vs Turn model
- [verification.md](./verification.md) → how acceptance criteria are validated
- [mcp-profile.md](./mcp-profile.md) → normative MCP coupling profile
- [adoption-charter.md](./adoption-charter.md) → public adoption boundaries and compatibility promises
- [extension-registry.md](./extension-registry.md) → public/private extension rules
