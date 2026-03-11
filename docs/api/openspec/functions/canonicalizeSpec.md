[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / canonicalizeSpec

# Function: canonicalizeSpec()

> **canonicalizeSpec**\<`T`\>(`spec`): `T`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:229

Canonicalize a AstroSpec spec for deterministic hashing:
- sort object keys recursively
- sort `fields` keys
- sort `acceptanceCriteria` by criterion id
- sort `provenance` by (at, field, source)

## Type Parameters

### T

`T` *extends* [`AstroSpecBase`](../interfaces/AstroSpecBase.md)\<`Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\<`unknown`\>\>\>

## Parameters

### spec

`T`

## Returns

`T`
