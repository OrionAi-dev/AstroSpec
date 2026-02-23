# MindScript MCP Profile (v1)

MindScript is schema-first and remains transport-agnostic. This profile defines the normative mapping for interoperating through MCP while preserving MindScript contract semantics.

Canonical hard-cutover security execution plan for MindScript + Starconsole + Telescope facade lives in:
`stardrive-monorepo/docs/security/starconsole-mindscript-hard-cutover-plan.md`.

## Scope

This profile standardizes:

1. Canonical MCP tool names for MindScript contract gates.
2. MCP resource URI shapes for Context, Turn, and Verification artifacts.
3. Deterministic error-code envelopes for validation, verification, and governance flows.

This profile does not replace MindScript schemas. It binds MCP calls to existing MindScript contracts.

## Canonical Tool Names

The following tool names are fixed in profile v1:

1. `mindscript.plan_turn.generate`
2. `mindscript.exec_turn.generate`
3. `mindscript.turn.verify`
4. `mindscript.contract.validate`
5. `mindscript.governance.approval.challenge`
6. `mindscript.governance.approval.commit`

## Canonical Error Codes

Profile-level deterministic error codes:

1. `MS_MCP_INVALID_INPUT`
2. `MS_MCP_CONTRACT_INVALID`
3. `MS_MCP_VERIFICATION_FAILED`
4. `MS_MCP_GOVERNANCE_REQUIRED`
5. `MS_MCP_GOVERNANCE_INVALID`

Tools MUST return one of these codes for profile-defined failures.

## MCP Resource Mapping

### Context Resource

- URI: `mindscript://context/{id}`
- MIME type: `application/json`
- Body: canonical MindScript Context JSON

### Turn Resource

- URI: `mindscript://turn/{id}`
- MIME type: `application/json`
- Body: canonical MindScript Turn JSON

### Verification Resource

- URI: `mindscript://verification/{id}`
- MIME type: `application/json`
- Body: MindScript verification report JSON

## Tool Contracts

### `mindscript.plan_turn.generate`

Input:

```json
{
  "planTurn": { "...": "PlanTurn payload" }
}
```

Behavior:

1. Validate `planTurn` against MindScript agent-contract schema.
2. Return contract payload only when valid.
3. Return `MS_MCP_CONTRACT_INVALID` with deterministic issue details when invalid.

### `mindscript.exec_turn.generate`

Input:

```json
{
  "execTurn": { "...": "ExecTurn payload" }
}
```

Behavior mirrors `plan_turn.generate` but applies ExecTurn validation.

### `mindscript.contract.validate`

Input:

```json
{
  "kind": "plan-turn|exec-turn|tool-policy-spec|tool-call-record|repopack|run-log-entry",
  "payload": { "...": "candidate payload" }
}
```

Behavior:

1. Run the requested validator.
2. Return `{ ok: true, kind }` when valid.
3. Return `MS_MCP_CONTRACT_INVALID` and deterministic issues when invalid.

### `mindscript.turn.verify`

Input:

```json
{
  "turn": { "...": "MindScript Turn" },
  "output": { "...": "execution output" }
}
```

Behavior:

1. Validate turn shape.
2. Run MindScript verifier pipeline.
3. Return verification report.
4. Return `MS_MCP_VERIFICATION_FAILED` when overall verification fails.

### `mindscript.governance.approval.challenge`

Input:

```json
{
  "runId": "run_123",
  "challengeId": "govc_abc",
  "requestDigest": "sha256:...",
  "expiresAt": "2026-01-01T00:00:00.000Z"
}
```

Behavior:

1. Validate presence of required fields.
2. Return profile envelope used by runtime/facade governance handshakes.
3. Return `MS_MCP_GOVERNANCE_INVALID` for malformed challenge payloads.

### `mindscript.governance.approval.commit`

Input:

```json
{
  "approvalId": "gova_123",
  "challengeId": "govc_abc",
  "status": "approved",
  "approvedBy": "user_123"
}
```

Behavior:

1. Validate commit payload shape.
2. Return normalized governance commit envelope.
3. Return `MS_MCP_GOVERNANCE_INVALID` for malformed payloads.

## Error Envelope

All profile tool failures use this shape:

```json
{
  "ok": false,
  "error": {
    "code": "MS_MCP_CONTRACT_INVALID",
    "message": "human-readable summary",
    "details": {}
  }
}
```

## Compatibility Notes

1. This profile is additive. Existing non-MCP MindScript usage remains valid.
2. Future profile versions may add tool names, but v1 names and error codes are immutable.
3. Implementations can expose additional tools/resources as long as they do not conflict with v1 names and semantics.
