# AstroSpec Adapter: Context/Turn → BDD Core

This adapter maps AstroSpec **Context** and **Turn** contracts into a portable BDD representation.
It enables teams to express acceptance criteria in human-readable scenarios while retaining machine-verifiable contracts.

---

## Purpose

* Bridge **AstroSpec contracts** (Context/Turn with fields + acceptanceCriteria) into BDD scenarios.
* Allow round-tripping between **YAML-based BDD files** and **typed AstroSpec contracts**.
* Provide a lightweight path for domains that don’t yet have a native BDD stack.

---

## Mapping Rules

### Context → Feature

* **Context intent** → Feature title
* **Context fields** → Background (Given steps)
* **AcceptanceCriteria** → top-level requirements

### Turn → Scenario

* **Turn id** → Scenario id
* **Turn intent** → Scenario name
* **Turn fields** → Steps (When)
* **Turn acceptanceCriteria** → Steps (Then)

---

## Example

**Turn Contract (AstroSpec)**

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

**Mapped BDD (openspec.core YAML)**

```yaml
profile: https://orionai-dev.github.io/AstroSpec/profiles/bdd/openspec.core
kind: bdd-core
meta:
  id: AUTH-101.core
  title: AUTH-101 login scenarios
scenarios:
  - id: auth-login-success
    name: Valid credentials produce a successful session
    steps:
      - { keyword: When, text: "the user submits valid credentials" }
      - { keyword: Then, text: "the app creates a session and redirects to the dashboard" }
```

---

## Round-trip Workflow

1. Draft Context/Turn spec → lock contract.
2. Adapter maps Turn → BDD scenario.
3. Execute in native BDD tool (Cucumber, Behave, etc.).
4. Results mapped back to AstroSpec verifier results.

---

## Cross-References

* [spec-bdd-context-turn.md](../../../context-turn.md) → portable BDD format
* [context-turn.md](../../../context-turn.md) → Context/Turn model
* [verification.md](../../../verification.md) → how verifiers validate acceptance criteria
