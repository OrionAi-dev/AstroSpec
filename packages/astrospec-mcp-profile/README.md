# @astrospec/mcp-profile

Canonical MCP mapping for AstroSpec contracts.

## Scope

This package standardizes:

- MCP tool names
- MCP resource URI shapes
- deterministic MCP error codes
- retrieval, memory, and graph interoperability tools

It is the default interop layer, not the definition of AstroSpec core.

## Use It When

Use this package when your runtime or tool ecosystem already speaks MCP and needs a stable AstroSpec mapping.

## Commands

```bash
pnpm -F @astrospec/mcp-profile build
pnpm -F @astrospec/mcp-profile test
```
