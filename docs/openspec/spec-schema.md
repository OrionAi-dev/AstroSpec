# OpenSpec Schema

OpenSpec contracts are defined by canonical **JSON Schemas** (draft 2020-12).

* Canonical package: `@openspec/schema` (`packages/openspec-schema/`)
* Human-browsable copies: `docs/openspec/schemas/`
* Runtime validator: `@openspec/runtime` (AJV)

---

## Canonical Schemas

Core schemas (current version `0.1`):

* Context: `docs/openspec/schemas/context-0.1.json`
* Turn: `docs/openspec/schemas/turn-0.1.json`
* Acceptance criteria: `docs/openspec/schemas/acceptance-criteria-0.1.json`
* Provenance: `docs/openspec/schemas/provenance-0.1.json`
* Verification report: `docs/openspec/schemas/verification-report-0.1.json`
* Shared definitions: `docs/openspec/schemas/defs-0.1.json`

---

## Contract Highlights

### Context and Turn

Both share:

* `fields`: `Record<string, SpecField>`
* `acceptanceCriteria`: `AcceptanceCriterion[]`
* `provenance`: optional audit entries
* `lockedAt`: required ISO date-time
* `signature`: optional deterministic hash
* `meta`: extension bucket (free-form)

Context adds:

* `scope`: `{ type: "session" | "project" | "workspace" | "global", id?: string }`
* `lifespan`: `{ mode: "session" | "rolling" | "pinned", ttlDays?: number, maxUses?: number }`

Turn adds:

* `inheritsFrom`: Context id string

### SpecField

`SpecField` is a recursively-typed description of a field.

Key properties include:

* `type`: `"string" | "number" | "boolean" | "enum" | "object" | "array" | "any"`
* `value`, `default`, constraints (`min`, `max`, `enum`, `pattern`, ...)
* `source`: `"system" | "user" | "context" | "default" | "memory" | "model"`
* `scope`: `{ kind: "filetype" | "project" | "intent" | "global", ... }`
* `ext`: extension bucket (free-form)

### AcceptanceCriterion

Acceptance criteria are always structured objects:

* `id` (required)
* `description` (required)
* `verifier` (required)
* `params` (optional)
* `evidence[]` (optional, framework-agnostic references)

---

## Cross-References

* [spec-language.md](./spec-language.md) for the narrative model
* [spec-validation.md](./spec-validation.md) for CLI/runtime validation
* [verification.md](./verification.md) for verifiers and reports

