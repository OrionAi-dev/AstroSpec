[**@astrospec/runtime**](../README.md)

***

[@astrospec/runtime](../README.md) / AstroSpecBase

# Interface: AstroSpecBase\<F\>

Defined in: packages/astrospec-runtime/dist/index.d.ts:115

## Extended by

- [`AstroSpecContext`](AstroSpecContext.md)
- [`AstroSpecTurn`](AstroSpecTurn.md)

## Type Parameters

### F

`F` *extends* `Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\> = `Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\>

## Properties

### acceptanceCriteria

> **acceptanceCriteria**: [`AcceptanceCriteria`](../type-aliases/AcceptanceCriteria.md)

Defined in: packages/astrospec-runtime/dist/index.d.ts:120

***

### fields

> **fields**: `F`

Defined in: packages/astrospec-runtime/dist/index.d.ts:119

***

### id

> **id**: `string`

Defined in: packages/astrospec-runtime/dist/index.d.ts:117

***

### intent

> **intent**: `string`

Defined in: packages/astrospec-runtime/dist/index.d.ts:118

***

### kind

> **kind**: `"context"` \| `"turn"`

Defined in: packages/astrospec-runtime/dist/index.d.ts:116

***

### lockedAt

> **lockedAt**: [`ISODateTime`](../type-aliases/ISODateTime.md)

Defined in: packages/astrospec-runtime/dist/index.d.ts:122

***

### meta?

> `optional` **meta**: `Record`\<`string`, [`JsonValue`](../type-aliases/JsonValue.md)\>

Defined in: packages/astrospec-runtime/dist/index.d.ts:125

***

### provenance?

> `optional` **provenance**: [`Provenance`](../type-aliases/Provenance.md)

Defined in: packages/astrospec-runtime/dist/index.d.ts:121

***

### signature?

> `optional` **signature**: `string`

Defined in: packages/astrospec-runtime/dist/index.d.ts:124

***

### version?

> `optional` **version**: `string`

Defined in: packages/astrospec-runtime/dist/index.d.ts:123
