# AstroSpec White Paper

AstroSpec is a universal specification layer for human–AI interaction. It ensures clarity, auditability, and determinism by replacing assumptions with explicit contracts.

---

## Motivation

Today’s AI systems often assume context, preferences, or intent without asking. This creates frustration, ambiguity, and inconsistency. AstroSpec solves this by requiring **contracts**:

* **Context**: long-lived environment specs (tone, locale, privacy, overlays, etc.)
* **Turn**: ephemeral, per-request specs inheriting from Context
* **Contract**: immutable, locked snapshot with signature

---

## Principles

1. **Clarity before execution** – every assumption must be explicit.
2. **Spec-first interaction** – Context and Turn specs define what will happen before it happens.
3. **Determinism** – once locked, a Turn executes against an immutable contract.
4. **Auditability** – provenance, signature, and events allow inspection and replay.
5. **Extensibility** – templates, verifiers, overlays, and user preferences evolve without breaking the core schema.

---

## Building Blocks

* **SpecField**: typed field with constraints, provenance, and scope.
* **Context**: long-lived spec carrying defaults and policies.
* **Turn**: short-lived spec that clarifies and executes.
* **AcceptanceCriteria**: contract conditions verified after execution.
* **Templates & Patches**: reusable specs and diffs, managed by the Librarian.
* **Verifiers**: pluggable checks ensuring outputs match contracts.
* **Events**: lock, verify, fail, refresh logged as a timeline.

---

## Workflow

1. **Activate Context** – load or create environment spec.
2. **Draft Turn** – interpreter fills fields from Context.
3. **Clarify** – only ask for missing/low-confidence fields.
4. **Lock** – freeze spec with signature + timestamp.
5. **Execute** – bind fields to tools or models.
6. **Verify** – run acceptance criteria; pass/fail.
7. **Update Context** – patch preferences or rotate lifespan.

---

## Ecosystem

* **TypeScript bindings** → canonical reference ([typescript.md](./typescript.md))
* **Verifiers stdlib** → common checks ([verification.md](./verification.md))
* **Librarian** → template promotion and governance ([templates.md](./templates.md))
* **Adapters** → BDD frameworks and domain tools ([integrations](../integrations/bdd/@software/README.md))

---

## Roadmap

* v0.1.0 – White paper release
* v0.2.0 – Examples & validation rules
* v0.3.0 – AstroSpec Infra (Context/Turn, TS bindings)
* v0.4.0 – CLI, JSON Schema, golden tests, template promotion
* v1.0.0 – Unified stable spec & reference implementations

---

## Vision

AstroSpec aims to be the **specification backbone** for AI workflows. By treating every request as a contract, it transforms AI from a guesser into a reliable collaborator—bridging human intent, machine execution, and verifiable outcomes.
