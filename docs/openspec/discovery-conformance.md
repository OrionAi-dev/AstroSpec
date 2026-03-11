# Discovery Conformance

Discovery-related AstroSpec packages follow the same conformance rule as the rest of the standard surface.

## Required Assets

A public discovery package is not complete unless it ships with:

- schemas
- validators
- package-level docs
- examples
- conformance fixtures

## Current Discovery Conformance Sets

- `conformance/reasoning`
- `conformance/graph-memory`
- `conformance/starburst-profile`
- `conformance/runtime-interfaces`

## Compatibility Rule

If a discovery package reuses another AstroSpec profile, it should depend on that profile directly rather than duplicating its primitives.
