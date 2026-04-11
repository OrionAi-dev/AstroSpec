# MCP Secure Context Sharing Docs

MCP Secure Context Sharing is an MCP-compatible framework for portable, policy-aware, and verifiable context exchange.

Use it when you need to share bounded context between agents, tools, and systems without turning context exchange into unrestricted memory dumping.

## Start here

1. [Overview](overview.md)
2. [Context Containers](context-containers.md)
3. [OpenSpec](openspec.md)
4. [MCP Integration](mcp-integration.md)
5. [Orion and StarConsole adoption](openspec/orion-starconsole-adoption.md)
6. [Legacy OpenSpec migration](migrations/legacy-openspec/README.md)

## Package roles

- `@mcp-secure-context/core`: container types and schema access
- `@mcp-secure-context/openspec`: validation, provenance, verification, and policy helpers
- `@mcp-secure-context/mcp-adapter`: MCP resource and tool helpers
- `@mcp-secure-context/sdk-typescript`: TypeScript DX surface
- `@mcp-secure-context/cli`: CLI workflows

## Secondary extensions

The repo still publishes retrieval, reasoning, graph-memory, and discovery-oriented packages for compatibility and advanced use cases, but those are no longer the primary onboarding path.

- [Extensions overview](extensions/retrieval.md)
- [Orion and StarConsole adoption](openspec/orion-starconsole-adoption.md)
- [Repo-local issues](ISSUES.md)
- [Legacy OpenSpec docs](migrations/legacy-openspec/README.md)
