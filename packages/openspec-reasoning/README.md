# @astrospec/reasoning

Portable reasoning workflow contracts for AstroSpec.

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
pnpm -F @astrospec/reasoning typecheck
pnpm -F @astrospec/reasoning test
pnpm -F @astrospec/reasoning build
```
