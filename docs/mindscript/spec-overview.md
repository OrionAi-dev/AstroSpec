# MindScript Overview (Specification Layer)

MindScript (formerly OpenSpec) defines requirements and acceptance criteria in a structured, machine-readable format.
This complements the **infrastructure layer** (Context/Turn specs) by giving higher-level ways to describe goals and map them to contracts.

---

## Core Structure

* **Spec Node**: smallest unit of intent (maps to a requirement or field).
* **Requirement**: a condition that must be satisfied (maps to `fields` in a Context/Turn).
* **Acceptance Criteria**: measurable/testable checks (maps to `acceptanceCriteria[]`).
* **Reference**: link to another spec node, BDD scenario, or external artifact.

---

## Conventions

* Specs can be written directly in JSON/TypeScript contracts.
* YAML/Markdown frontmatter remains supported for human-readable domains (e.g., BDD or policy).
* Each requirement or field has a unique identifier.
* Acceptance criteria reference verifiers that can be executed automatically.

---

## Example (Requirement → Turn)

```yaml
id: FEATURE-101
title: User Login
type: requirement
acceptanceCriteria:
  - id: FEATURE-101.1
    description: User can log in with valid credentials
    verifier: tool_success
  - id: FEATURE-101.2
    description: Invalid credentials are rejected
    verifier: response_shape
```

This requirement maps to a MindScript Turn contract with `fields` (`username`, `password`) and `acceptanceCriteria` that are verified after execution.

---

## Cross-References

* [context-turn.md](./context-turn.md) → Context vs Turn model
* [verification.md](./verification.md) → how acceptance criteria are validated
* [mcp-profile.md](./mcp-profile.md) → normative MCP coupling profile
* [adoption-charter.md](./adoption-charter.md) → public adoption boundaries and compatibility promises
* [extension-registry.md](./extension-registry.md) → public/private extension rules
* [spec-bdd-context-turn.md](./context-turn.md) → portable BDD profile for non-software domains
