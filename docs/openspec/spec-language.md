# AstroSpec: Spec Language

AstroSpec defines a consistent contract language for AI interactions.
The infrastructure layer provides the primitives: Contexts, Turns, Fields, and Contracts.

---

## Spec (Context / Turn)

* **Context Spec**: environment contract (`session` / `project` / `workspace` / `global`).
* **Turn Spec**: per-request contract derived from Context.
* Both share the same structure: `fields`, `acceptanceCriteria`, `provenance`, `lockedAt`.

See [context-turn.md](./context-turn.md) for details.

---

## SpecField

Each field has a consistent shape:

* `type`: `string` | `number` | `boolean` | `enum` | `object` | `array` | `any`
* `value`: chosen value (if set)
* `required`: must be provided before execution
* `min` / `max`: numeric, string length, or array length
* `enum`: list of allowed values
* `pattern`: regex for strings
* `many`: allow multiple values
* `noneAllowed`: allow null/empty
* `default`: default if not provided
* `source`: `system` | `user` | `context` | `default` | `memory` | `model`
* `confidence`: interpreter confidence score
* `rationale`: explanation of how it was set
* `scope`: scope (`filetype`, `project`, `intent`, `global`)
* `ext`: extension bucket for nested tooling metadata

See [typescript.md](./typescript.md) for canonical TypeScript interfaces.

---

## Templates, Patches, and Contracts

* **Template**: reusable spec starting point (semantic versioned).
* **Patch**: JSON Patch applied to adapt a template.
* **Contract**: immutable spec after clarifiers; locked with timestamp and signature.

See [templates.md](./templates.md) for details.

---

## Preferences

* Scoped defaults that can be saved by the user.
* Must include scope (filetype, project, global) and lifespan (TTL or max uses).
* Refreshed periodically (“Still want this?”).

---

## Policy

Interpreter rules:

* Max clarifiers per turn
* Confidence thresholds
* Refresh intervals for prefs

---

## ToolBinding

Mapping from spec fields to executor parameters.
See also [quickstart.md](./quickstart.md).

---

## Provenance, Signature, Events

* **Provenance**: who/what set a field, with rationale.
* **Signature**: deterministic hash of spec for audit.
* **Event log**: record of state changes (lock, verify, fail, refresh).

---

## Error / RiskFlag

Standardized issue codes:

* Ambiguous required field
* Constraint conflict
* Verifier fail
* Tool error
* Preference expired

---

## Format

AstroSpec supports multiple representations:

* **JSON Schema**: canonical contract model (draft 2020-12).
* **TypeScript**: bindings + runtime utilities (`@astrospec/runtime`) aligned to the schemas.
* **JSON**: preferred wire format for APIs and automation.
* **YAML**: human-readable format, often used in BDD, legal, and compliance contexts.

👉 Rule of thumb: use **TypeScript** for developers, **JSON** for machines, and **YAML** for humans.

---

See also:

* [verification.md](./verification.md) for acceptance checks
* [context-turn.md](./context-turn.md) for lifecycles
* [templates.md](./templates.md) for template & librarian rules
