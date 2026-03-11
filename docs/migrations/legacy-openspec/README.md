# Legacy AstroSpec Migration

This repo was previously positioned around AstroSpec.

The new public identity is **MCP Secure Context Sharing**, with **OpenSpec** as the trust and verification layer.

## Compatibility

The following packages remain as compatibility wrappers for one transition cycle:

- `@astrospec/schema`
- `@astrospec/runtime`
- `@astrospec/mcp-profile`
- `@astrospec/kit`
- `@astrospec/cli`

## Mapping

- `@astrospec/schema` -> `@mcp-secure-context/core`
- `@astrospec/runtime` -> `@mcp-secure-context/openspec`
- `@astrospec/mcp-profile` -> `@mcp-secure-context/mcp-adapter`
- `@astrospec/kit` -> `@mcp-secure-context/sdk-typescript` plus `@mcp-secure-context/extensions-astrospec` where historical AstroSpec validation helpers are still needed
- `@astrospec/cli` -> `@mcp-secure-context/cli`

## Legacy docs

Historical AstroSpec docs remain under `docs/astrospec/` for migration context and archive reference.
