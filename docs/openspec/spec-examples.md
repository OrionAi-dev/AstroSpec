# OpenSpec Examples

This document showcases practical examples of OpenSpec applied across domains.
Each example builds on the **Context / Turn / Contract** model described in [context-turn.md](./context-turn.md).

---

## Software Engineering

**Context (project scope)**

```json
{
  "kind": "context",
  "id": "ctx:AuthProject",
  "intent": "project_session",
  "scope": { "type": "project", "id": "AuthService" },
  "lifespan": { "mode": "rolling", "ttlDays": 14 },
  "fields": {
    "tone": { "type": "string", "value": "technical", "source": "user" }
  },
  "acceptanceCriteria": ["Maintain consistency across auth flows"],
  "lockedAt": "2025-08-30T00:00:00Z"
}
```

**Turn (login validation)**

```json
{
  "kind": "turn",
  "id": "turn:auth-login",
  "intent": "validate_login",
  "inheritsFrom": "ctx:AuthProject",
  "fields": {
    "username": { "type": "string", "required": true },
    "password": { "type": "string", "required": true }
  },
  "acceptanceCriteria": [
    { "id": "auth-1", "description": "Valid credentials produce a session", "verifier": "tool_success" },
    { "id": "auth-2", "description": "Invalid credentials are rejected", "verifier": "response_shape" }
  ],
  "lockedAt": "2025-08-30T00:01:00Z"
}
```

---

## Legal Drafting

**Contract Example**

```yaml
id: LEGAL-202
title: Payment Terms
kind: context
fields:
  due_days: { type: number, value: 30, required: true }
  late_fee: { type: number, value: 0.05, required: true }
acceptanceCriteria:
  - id: LEGAL-202.1
    description: Invoices are due within 30 days
    verifier: response_shape
  - id: LEGAL-202.2
    description: Late payments accrue 5% monthly fee
    verifier: contains_fields
```

---

## Compliance

* Use Context to model **policies** (privacy flags, audit rules).
* Turns represent **auditable events** (data access request, consent logging).

---

## Enterprise Knowledge

* Context defines **workspace settings** (taxonomy, ontology, knowledge graph scope).
* Turns enforce **query/response consistency** across departments.

---

## AI and Automation

* Context includes **tone, guardrails, overlays** (e.g., astrology, compliance).
* Turns clarify **task-specific parameters** and verify outputs before acting.

---

## Cross-References

* [quickstart.md](./quickstart.md) → end-to-end setup example
* [context-turn.md](./context-turn.md) → Context vs Turn lifecycle
* [spec-bdd-context-turn.md](./context-turn.md) → BDD scenarios in YAML
