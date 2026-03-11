# Context Containers

Context containers are the portable exchange objects in MCP Secure Context Sharing.

## Envelope

Every container uses the same outer structure:

- `schema`
- `containerType`
- `id`
- `version`
- `payload`
- `policy`
- `provenance`
- `verification?`
- `ext?`

## v0.1 container types

### `UserContext`

Use for user identity, role, persona, preferences, and session attributes.

### `TaskState`

Use for task goals, status, constraints, handoff notes, and input/output references.

### `KnowledgeObject`

Use for structured knowledge summaries, claims, evidence references, and source references.

### `MemoryReference`

Use for scoped references to external memory rather than full memory dumps.

## Sharing patterns

- Agent handoff: share `TaskState` plus minimal `UserContext`
- Tool execution: share a scoped `KnowledgeObject` or `MemoryReference`
- Enterprise boundary crossing: share only a policy-limited slice with expiration

## Least-privilege rules

- prefer references over inline memory when possible
- declare explicit audience and allowed actions
- use expiration for temporary context
- mark sensitivity explicitly
- do not share more context than the receiving tool or agent needs
