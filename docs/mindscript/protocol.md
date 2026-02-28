# MindScript Protocol

This document defines a minimal, HTTP-friendly protocol for MindScript contract creation, handoff, and verification.

The important framing is that the protocol is not only for CRUD over spec documents. It is meant to support structured exchange between humans, models, agents, and runtimes.

It focuses on predictable request/response envelopes so multiple implementations can interoperate.

---

## What the protocol is for

The protocol can be used to:

- create or update shared context contracts
- draft and lock turn-level execution contracts
- verify outputs against explicit criteria
- support LLM-to-LLM or agent-to-agent handoff with stable envelopes

---

## Conventions

* **Base URL**: implementation-defined (for example `https://api.example.com/mindscript`)
* **Content-Type**: `application/json` for all requests/responses
* **Timestamps**: ISO-8601 strings (UTC) with milliseconds
* **IDs**: `ctx:<id>` for Contexts, `turn:<id>` for Turns

---

## Endpoints

### POST `/context`

Create or update a Context contract.

**Request**

```json
{
  "mode": "create",
  "context": {
    "kind": "context",
    "id": "ctx:Telescope",
    "intent": "project_session",
    "scope": { "type": "project", "id": "Telescope" },
    "lifespan": { "mode": "rolling", "ttlDays": 30 },
    "fields": {
      "tone": { "type": "string", "value": "concise, technical", "source": "user" }
    },
    "acceptanceCriteria": ["Maintain Telescope continuity"]
  }
}
```

```json
{
  "mode": "patch",
  "contextId": "ctx:Telescope",
  "patch": [
    { "op": "replace", "path": "/fields/tone/value", "value": "concise" }
  ]
}
```

**Response**

```json
{
  "context": {
    "kind": "context",
    "id": "ctx:Telescope",
    "intent": "project_session",
    "scope": { "type": "project", "id": "Telescope" },
    "lifespan": { "mode": "rolling", "ttlDays": 30 },
    "fields": {
      "tone": { "type": "string", "value": "concise", "source": "user" }
    },
    "acceptanceCriteria": ["Maintain Telescope continuity"],
    "lockedAt": "2025-08-30T00:00:00.000Z"
  },
  "meta": {
    "requestId": "req_01HZ...",
    "serverTime": "2025-08-30T00:00:01.000Z"
  }
}
```

---

### POST `/turn`

Draft or lock a Turn derived from a Context.

A Turn can represent a human-authored execution contract or a machine-to-machine handoff contract.

**Request**

```json
{
  "mode": "draft",
  "contextId": "ctx:Telescope",
  "turn": {
    "kind": "turn",
    "intent": "markdown_transform",
    "fields": {
      "file": { "type": "string", "value": "README.md", "source": "user" }
    },
    "acceptanceCriteria": ["Convert README to HTML", "Backticks escaped"]
  }
}
```

```json
{
  "mode": "lock",
  "turnId": "turn:123",
  "signature": "sig:base64:...",
  "lockedAt": "2025-08-30T00:01:00.000Z"
}
```

**Response**

```json
{
  "turn": {
    "kind": "turn",
    "id": "turn:123",
    "intent": "markdown_transform",
    "inheritsFrom": "ctx:Telescope",
    "fields": {
      "file": { "type": "string", "value": "README.md", "source": "user" },
      "tone": { "type": "string", "value": "concise", "source": "context" }
    },
    "acceptanceCriteria": ["Convert README to HTML", "Backticks escaped"],
    "lockedAt": "2025-08-30T00:01:00.000Z",
    "signature": "sig:base64:..."
  },
  "meta": {
    "requestId": "req_01HZ...",
    "serverTime": "2025-08-30T00:01:01.000Z"
  }
}
```

---

### POST `/verify`

Verify execution output against a locked Turn contract.

**Request**

```json
{
  "turnId": "turn:123",
  "output": {
    "html": "<h1>README</h1>"
  }
}
```

**Response**

```json
{
  "contractId": "turn:123",
  "results": [
    { "id": "response_shape", "pass": true, "details": "html present" }
  ],
  "overall": true,
  "meta": {
    "requestId": "req_01HZ...",
    "serverTime": "2025-08-30T00:02:00.000Z"
  }
}
```

---

## Error format

All endpoints return a consistent error payload with an HTTP status code.

```json
{
  "error": {
    "code": "constraint_conflict",
    "message": "Field 'tone' must be one of: concise, verbose",
    "details": {
      "path": "/fields/tone",
      "expected": ["concise", "verbose"],
      "received": "chatty"
    }
  },
  "meta": {
    "requestId": "req_01HZ...",
    "serverTime": "2025-08-30T00:00:02.000Z"
  }
}
```

**Common error codes**

* `invalid_request` — malformed JSON or missing fields
* `not_found` — referenced context/turn not found
* `constraint_conflict` — field constraints or enum mismatch
* `verification_failed` — one or more acceptance criteria failed
* `unauthorized` — missing or invalid auth/signature

---

## Authentication and signature guidance

Implementations can choose API keys, OAuth, or mTLS. The minimal guidance below keeps requests auditable:

* **Authorization**: `Authorization: Bearer <token>` (recommended default)
* **Request signing** (optional but recommended for integrity):

  * `X-MindScript-KeyId`: key identifier
  * `X-MindScript-Timestamp`: ISO-8601 timestamp
  * `X-MindScript-Signature`: `base64(HMAC-SHA256(secret, "<timestamp>.<raw_body>"))`
  * Servers should reject requests with timestamps outside a short window (for example ±5 minutes) to prevent replay.

  Compatibility note: servers MAY also accept `X-OpenSpec-*` header names as legacy aliases.

* **Contract signatures**: Once a Turn is locked, include its deterministic signature in the contract (`signature`) and return it on every fetch/verify call.

---

## Compatibility modes

Future protocol versions should remain backward compatible where possible.
Clients can opt into a compatibility mode and the server must echo what it applied.

**Request headers**

* `X-MindScript-Version`: semantic version of the protocol (for example `1.0`)
* `X-MindScript-Compat`: compatibility strategy

**Compatibility strategies**

* `strict` — reject unknown fields and non-matching versions
* `tolerant` — ignore unknown fields and apply defaults
* `legacy:<version>` — map deprecated fields for a previous protocol version

**Response headers**

* `X-MindScript-Compat-Applied`: the strategy actually used by the server

If a requested version cannot be honored, respond with `409 Conflict` and `error.code: "version_mismatch"`.
