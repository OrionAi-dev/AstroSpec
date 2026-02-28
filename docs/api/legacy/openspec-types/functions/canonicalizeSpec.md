[**@astrospec/openspec-types**](../README.md)

***

[@astrospec/openspec-types](../README.md) / canonicalizeSpec

# Function: canonicalizeSpec()

> **canonicalizeSpec**\<`T`\>(`spec`): `T`

Defined in: packages/astrospec-runtime/dist/index.d.ts:211

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
