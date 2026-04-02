# Context vs Turn

OpenSpec distinguishes between **Context** (long-lived environment contract) and **Turn** (ephemeral per-request contract). Together they ensure that assumptions are explicit, scoped, and auditable.

---

## OpenSpec.Context

A **Context** is a long-lived environment contract.

* **Scope**: `session` | `project` | `workspace` | `global`
* **Lifespan**:

  * `session` → ends when session ends
  * `rolling` → TTL/uses, auto-renew
  * `pinned` → explicit, global, requires consent
* **Contents**: project id, role, tone, locale/timezone, privacy flags, filetype preferences, overlays (e.g., domain analysis), guardrails
* **Behavior**: persists across turns; provides defaults; refreshed periodically

---

## OpenSpec.Turn

A **Turn** is an ephemeral, per-request contract.

* **Inherits** from the active Context
* **Clarifies** ambiguous or missing fields
* **Locks** before execution (timestamp + signature)
* **Executes** deterministically against the contract
* **Discarded** after use (unless promoted into a template)

---

## Inheritance Rules

* A Turn can override Context fields.
* **Precedence order** (highest wins): `system` > `user` > `context` > `memory` > `default` > `model` > unset
* Precedence is determined by `fields.*.source`. If two fields have the same precedence, the Turn value wins.
* Conflicts should trigger clarifiers or error flags at the application layer.

---

## Lifecycle

1. **Activate Context** – user opens a project/session, Context is loaded or created.
2. **Draft Turn** – interpreter generates a Turn spec, filling from Context.
3. **Clarify** – ask only for required, low-confidence fields.
4. **Lock & Execute** – freeze, run, verify.
5. **Update Context** – if user changes prefs, patch Context; auto-refresh on expiry.

---

## Example

**Context (project scope)**

```json
{
  "kind": "context",
  "id": "ctx:ReviewWorkspace",
  "intent": "project_session",
  "scope": { "type": "project", "id": "ReviewWorkspace" },
  "lifespan": { "mode": "rolling", "ttlDays": 30 },
  "fields": {
    "tone": { "type": "string", "value": "concise, technical", "source": "user" },
    "escape_ticks": { "type": "boolean", "value": true, "scope": { "kind": "filetype", "value": "md" } }
  },
  "acceptanceCriteria": [],
  "lockedAt": "2026-02-09T00:00:00.000Z"
}
```

**Turn (inherits from Context)**

```json
{
  "kind": "turn",
  "id": "turn:123",
  "intent": "markdown_transform",
  "inheritsFrom": "ctx:ReviewWorkspace",
  "fields": {
    "file": { "type": "string", "value": "README.md", "source": "user" },
    "escape_ticks": { "type": "boolean", "value": true, "source": "context" }
  },
  "acceptanceCriteria": [
    {
      "id": "contains_title",
      "description": "Output contains a title field",
      "verifier": "contains_fields",
      "params": { "fields": ["title"] }
    }
  ],
  "lockedAt": "2026-02-09T00:01:00.000Z"
}
```
