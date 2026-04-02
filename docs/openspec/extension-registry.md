# Extension Registry

OpenSpec distinguishes between core, profiles, integrations, and vendor extensions.

## Core

Core is vendor-neutral and conservative.

Core additions require:

- schema
- validator
- docs
- example
- conformance fixture

## Profiles

Profiles define portable contract families for domains that need more structure than core should carry.

The first normative profile is the retrieval profile.

The public discovery profile family currently includes:

- `@openspec/reasoning`
- `@openspec/graph-memory`
- `@openspec/starburst-profile`
- `@openspec/runtime-interfaces`

These define contracts and interfaces, not an orchestrator implementation.

## Integrations

Integrations map OpenSpec contracts into other ecosystems such as:

- MCP
- BDD systems
- product-specific runtimes

High-level public bundles such as `@openspec/discovery-bundle` may re-export normative packages for convenience, but they do not become core by doing so.

## Vendor Extensions

Vendor-specific extensions must be clearly marked and must not present themselves as core or normative profiles.
