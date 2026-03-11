[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / retrievalRequestSchema

# Variable: retrievalRequestSchema

> **retrievalRequestSchema**: `object`

Defined in: [schemas/retrieval-request-0.1.json:1](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/schemas/retrieval-request-0.1.json#L1)

## Type Declaration

### $id

> **$id**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/retrieval/retrieval-request-0.1.json"`

### $schema

> **$schema**: `string` = `"https://json-schema.org/draft/2020-12/schema"`

### additionalProperties

> **additionalProperties**: `boolean` = `false`

### properties

> **properties**: `object`

#### properties.contextRef

> **contextRef**: `object`

#### properties.contextRef.type

> **type**: `string` = `"string"`

#### properties.filters

> **filters**: `object`

#### properties.filters.additionalProperties

> **additionalProperties**: `boolean` = `true`

#### properties.filters.type

> **type**: `string` = `"object"`

#### properties.graphScopes

> **graphScopes**: `object`

#### properties.graphScopes.items

> **items**: `object`

#### properties.graphScopes.items.minLength

> **minLength**: `number` = `1`

#### properties.graphScopes.items.type

> **type**: `string` = `"string"`

#### properties.graphScopes.type

> **type**: `string` = `"array"`

#### properties.memoryNamespaces

> **memoryNamespaces**: `object`

#### properties.memoryNamespaces.items

> **items**: `object`

#### properties.memoryNamespaces.items.minLength

> **minLength**: `number` = `1`

#### properties.memoryNamespaces.items.type

> **type**: `string` = `"string"`

#### properties.memoryNamespaces.type

> **type**: `string` = `"array"`

#### properties.meta

> **meta**: `object`

#### properties.meta.additionalProperties

> **additionalProperties**: `boolean` = `true`

#### properties.meta.type

> **type**: `string` = `"object"`

#### properties.plan

> **plan**: `object`

#### properties.plan.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/retrievalPlan"`

#### properties.query

> **query**: `object`

#### properties.query.minLength

> **minLength**: `number` = `1`

#### properties.query.type

> **type**: `string` = `"string"`

#### properties.requestId

> **requestId**: `object`

#### properties.requestId.type

> **type**: `string` = `"string"`

#### properties.stream

> **stream**: `object`

#### properties.stream.type

> **type**: `string` = `"boolean"`

#### properties.techniques

> **techniques**: `object`

#### properties.techniques.items

> **items**: `object`

#### properties.techniques.items.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/techniqueId"`

#### properties.techniques.type

> **type**: `string` = `"array"`

#### properties.topK

> **topK**: `object`

#### properties.topK.minimum

> **minimum**: `number` = `0`

#### properties.topK.type

> **type**: `string` = `"number"`

### required

> **required**: `string`[]

### title

> **title**: `string` = `"AstroSpec Retrieval Request"`

### type

> **type**: `string` = `"object"`
