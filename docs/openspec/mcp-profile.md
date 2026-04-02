# OpenSpec MCP Profile

OpenSpec is schema-first and transport-agnostic. The MCP profile defines the canonical MCP mapping for OpenSpec contracts.

## Core Tool Names

- `openspec.plan_turn.generate`
- `openspec.exec_turn.generate`
- `openspec.turn.verify`
- `openspec.contract.validate`

## Retrieval Tool Names

- `openspec.retrieval.query`
- `openspec.retrieval.plan`
- `openspec.retrieval.verify`
- `openspec.memory.read`
- `openspec.memory.write`
- `openspec.graph.query`
- `openspec.graph.assert`

## Governance Tool Names

- `openspec.governance.approval.challenge`
- `openspec.governance.approval.commit`

## Resource URI Conventions

- `openspec://context/{id}`
- `openspec://turn/{id}`
- `openspec://verification/{id}`
- `openspec://sources/{sourceId}`
- `openspec://retrieval-runs/{requestId}`
- `openspec://memories/{namespace}/{key}`
- `openspec://graphs/{graph}/{nodeId}`

## Error Codes

Core MCP error codes:

- `AS_MCP_INVALID_INPUT`
- `AS_MCP_CONTRACT_INVALID`
- `AS_MCP_VERIFICATION_FAILED`
- `AS_MCP_GOVERNANCE_REQUIRED`
- `AS_MCP_GOVERNANCE_INVALID`

Retrieval-related MCP error codes:

- `AS_MCP_RETRIEVAL_INVALID`
- `AS_MCP_RETRIEVAL_UNAVAILABLE`
- `AS_MCP_GROUNDING_FAILED`

## Resource Annotations

Resources should carry MCP-style annotations where useful:

- `audience`
- `priority`
- `lastModified`

## When To Use MCP

Use the MCP profile when a runtime or tool ecosystem already speaks MCP and needs a portable OpenSpec mapping.

Do not treat MCP as the definition of OpenSpec itself. The schemas and contract semantics remain the source of truth.
