# Runtime Interfaces

`@openspec/runtime-interfaces` defines neutral interfaces for runtimes that consume OpenSpec discovery contracts.

## Interfaces

- `ReasoningRuntimeAdapter`
- `DiscoveryWorkflowAdapter`
- `GraphMemoryProvider`
- `ConstellationExecutor`
- `ContractExecutionHook`

## Purpose

This package exists so OpenSpec can publish interface shapes without embedding a scheduler, engine, or storage runtime into the public standard.

## What It Does Not Do

It does not ship:

- Orion orchestration
- Starburst execution logic
- graph-memory promotion heuristics
- scheduler internals

Those remain runtime concerns outside OpenSpec.
