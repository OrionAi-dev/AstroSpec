[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / applyPatches

# Function: applyPatches()

> **applyPatches**(`fields`, `patches`): `Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:247

Apply RFC6902-like patches to a fields object.

Paths are JSON Pointers relative to the fields root.
Examples:
- "/tone/value"
- "/fields/tone/value" (legacy alias; leading "fields/" is ignored)
- "/preferences/properties/style/value" (nested object field)

## Parameters

### fields

`Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\>

### patches

[`JsonPatch`](../interfaces/JsonPatch.md)[]

## Returns

`Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\>
