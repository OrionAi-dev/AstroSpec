[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / AstroSpecContext

# Interface: AstroSpecContext\<F\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:127

## Extends

- [`AstroSpecBase`](AstroSpecBase.md)\<`F`\>

## Type Parameters

### F

`F` *extends* `Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\> = `Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\>

## Properties

### acceptanceCriteria

> **acceptanceCriteria**: [`AcceptanceCriteria`](../type-aliases/AcceptanceCriteria.md)

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:120

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`acceptanceCriteria`](AstroSpecBase.md#acceptancecriteria)

***

### fields

> **fields**: `F`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:119

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`fields`](AstroSpecBase.md#fields)

***

### id

> **id**: `string`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:117

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`id`](AstroSpecBase.md#id)

***

### intent

> **intent**: `string`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:118

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`intent`](AstroSpecBase.md#intent)

***

### kind

> **kind**: `"context"`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:128

#### Overrides

[`AstroSpecBase`](AstroSpecBase.md).[`kind`](AstroSpecBase.md#kind)

***

### lifespan

> **lifespan**: `object`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:133

#### maxUses?

> `optional` **maxUses**: `number`

#### mode

> **mode**: `"session"` \| `"rolling"` \| `"pinned"`

#### ttlDays?

> `optional` **ttlDays**: `number`

***

### lockedAt

> **lockedAt**: [`ISODateTime`](../type-aliases/ISODateTime.md)

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:122

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`lockedAt`](AstroSpecBase.md#lockedat)

***

### meta?

> `optional` **meta**: `Record`\<`string`, [`JsonValue`](../type-aliases/JsonValue.md)\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:125

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`meta`](AstroSpecBase.md#meta)

***

### provenance?

> `optional` **provenance**: [`Provenance`](../type-aliases/Provenance.md)

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:121

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`provenance`](AstroSpecBase.md#provenance)

***

### scope

> **scope**: `object`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:129

#### id?

> `optional` **id**: `string`

#### type

> **type**: `"session"` \| `"project"` \| `"workspace"` \| `"global"`

***

### signature?

> `optional` **signature**: `string`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:124

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`signature`](AstroSpecBase.md#signature)

***

### version?

> `optional` **version**: `string`

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:123

#### Inherited from

[`AstroSpecBase`](AstroSpecBase.md).[`version`](AstroSpecBase.md#version)
