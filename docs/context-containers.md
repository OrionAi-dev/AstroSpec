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

Additive workflow-oriented fields may also be used for bounded control-plane handoff, for example:

- `artifactRefs`
- `decisionRefs`
- `nextStepRefs`
- `blockingReasons`
- `activeRunId`
- `attentionState`
- `recommendedAction`
- `updatedBy`

### `KnowledgeObject`

Use for structured knowledge summaries, claims, evidence references, and source references.

Additive bounded rationale and artifact-oriented fields may also be used, for example:

- `artifactRefs`
- `reportRefs`
- `verificationRefs`
- `derivedFromRefs`
- `rationaleSummary`

### `MemoryReference`

Use for scoped references to external memory rather than full memory dumps.

## Sharing patterns

- Agent handoff: share `TaskState` plus minimal `UserContext`
- Tool execution: share a scoped `KnowledgeObject` or `MemoryReference`
- Enterprise boundary crossing: share only a policy-limited slice with expiration
- Workflow handoff: share bounded `TaskState` with explicit next actions and related references
- Artifact review: share `KnowledgeObject` with bounded evidence, report, and rationale summaries

## Least-privilege rules

- prefer references over inline memory when possible
- declare explicit audience and allowed actions
- use expiration for temporary context
- mark sensitivity explicitly
- do not share more context than the receiving tool or agent needs
