# Reasoning Profile

`@openspec/reasoning` defines portable contracts for structured reasoning workflows.

## Contracts

- `ReasoningTask`
- `ReasoningRole`
- `ReasoningGraph`
- `ReasoningEvidence`
- `ReasoningResult`
- `ReasoningWorkflowContract`

## Scope

This profile standardizes:

- the task shape a runtime receives
- the roles and interaction patterns it may declare
- the graph of reasoning participants
- the evidence attached to a reasoning task
- the result envelope returned by a runtime

Example consumers include Orion-style reasoning runtimes and StarConsole-style systems that need
portable reasoning exchange where artifacts cross system boundaries.

It does not standardize:

- scheduling
- agent placement
- ranking
- vendor-specific run state machines
- provider normalization

## Boundary Rule

OpenSpec defines the contracts.

Vendor runtimes execute the contracts.

Any runtime-specific scheduling, constellation assembly, or score policy belongs in implementation packages, not here.

This profile is also not a replacement for a provider registry or backend adapter layer.
