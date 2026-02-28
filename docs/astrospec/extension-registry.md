# Extension Registry

AstroSpec distinguishes between core, profiles, integrations, and vendor extensions.

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

## Integrations

Integrations map AstroSpec contracts into other ecosystems such as:

- MCP
- BDD systems
- product-specific runtimes

## Vendor Extensions

Vendor-specific extensions must be clearly marked and must not present themselves as core or normative profiles.
