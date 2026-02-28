# AstroSpec MCP Profile

AstroSpec is schema-first and transport-agnostic. The MCP profile defines the canonical MCP mapping for AstroSpec contracts.

## Core Tool Names

- `astrospec.plan_turn.generate`
- `astrospec.exec_turn.generate`
- `astrospec.turn.verify`
- `astrospec.contract.validate`

## Retrieval Tool Names

- `astrospec.retrieval.query`
- `astrospec.retrieval.plan`
- `astrospec.retrieval.verify`
- `astrospec.memory.read`
- `astrospec.memory.write`
- `astrospec.graph.query`
- `astrospec.graph.assert`

## Governance Tool Names

- `astrospec.governance.approval.challenge`
- `astrospec.governance.approval.commit`

## Resource URI Conventions

- `astrospec://context/{id}`
- `astrospec://turn/{id}`
- `astrospec://verification/{id}`
- `astrospec://sources/{sourceId}`
- `astrospec://retrieval-runs/{requestId}`
- `astrospec://memories/{namespace}/{key}`
- `astrospec://graphs/{graph}/{nodeId}`

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

Use the MCP profile when a runtime or tool ecosystem already speaks MCP and needs a portable AstroSpec mapping.

Do not treat MCP as the definition of AstroSpec itself. The schemas and contract semantics remain the source of truth.
