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

## Orion And StarConsole Usage

These interfaces are suitable for:

- Orion-style capability runtimes that need neutral interface descriptors
- StarConsole-style workflow consumers that need to expose or discover interoperable runtime seams

They are not a provider registry or model backend abstraction.

## What It Does Not Do

It does not ship:

- vendor-specific orchestration
- provider normalization or hot-path model invocation contracts
- workflow-specific execution logic
- graph-memory promotion heuristics
- scheduler internals

Those remain runtime concerns outside OpenSpec.
