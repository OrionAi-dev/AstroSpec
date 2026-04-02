# MCP Integration

MCP Secure Context Sharing extends MCP. It does not replace it.

## Integration points

- MCP tools can validate or verify containers before use.
- MCP resources can expose containers through portable URIs.
- MCP servers can keep container exchange separate from direct data access.

## Reference adapter surface

The canonical adapter package is:

- `@mcp-secure-context/mcp-adapter`

It provides:

- container resource serialization
- secure-context MCP tool names
- compatibility exports for older OpenSpec MCP profiles

## Resource pattern

Container resources use URIs shaped like:

`mcp-secure-context://containers/{containerType}/{id}`

## Tool pattern

The initial adapter surface includes:

- container validate
- container verify
- container share normalization

These are intended as reference patterns for MCP-compatible systems, not as a claim that MCP itself requires these names.
