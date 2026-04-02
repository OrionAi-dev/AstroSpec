# @openspec/reasoning

Portable reasoning workflow contracts for OpenSpec.

## What It Provides

- JSON schemas for:
  - `ReasoningTask`
  - `ReasoningRole`
  - `ReasoningGraph`
  - `ReasoningEvidence`
  - `ReasoningResult`
  - `ReasoningWorkflowContract`
- Deterministic validators for each contract.
- A portable reasoning workflow surface for runtimes, not a reasoning engine.

## Scope

This package standardizes the shape of structured reasoning work:

- tasks and prompts
- reasoning roles
- execution graphs
- evidence inputs
- workflow contracts
- portable results

It does not implement orchestration, scheduling, ranking, or proprietary runtime policy.

## Commands

```bash
pnpm -F @openspec/reasoning typecheck
pnpm -F @openspec/reasoning test
pnpm -F @openspec/reasoning build
```
