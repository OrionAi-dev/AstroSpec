[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / AstroSpecRequestEnvelope

# Interface: AstroSpecRequestEnvelope\<TContext, TTurn, TInput\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:145

## Type Parameters

### TContext

`TContext` *extends* [`AstroSpecContext`](AstroSpecContext.md) = [`AstroSpecContext`](AstroSpecContext.md)

### TTurn

`TTurn` *extends* [`AstroSpecTurn`](AstroSpecTurn.md) = [`AstroSpecTurn`](AstroSpecTurn.md)

### TInput

`TInput` *extends* [`JsonObject`](JsonObject.md) \| [`JsonValue`](../type-aliases/JsonValue.md) = [`JsonObject`](JsonObject.md)

## Properties

### context

> **context**: `TContext`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:146

***

### input?

> `optional` **input**: `TInput`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:148

***

### meta?

> `optional` **meta**: `Record`\<`string`, [`JsonValue`](../type-aliases/JsonValue.md)\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:150

***

### requestId?

> `optional` **requestId**: `string`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:149

***

### turn

> **turn**: `TTurn`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:147
