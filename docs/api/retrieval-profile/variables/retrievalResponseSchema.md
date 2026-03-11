[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / retrievalResponseSchema

# Variable: retrievalResponseSchema

> **retrievalResponseSchema**: `object`

Defined in: [schemas/retrieval-response-0.1.json:1](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/schemas/retrieval-response-0.1.json#L1)

## Type Declaration

### $id

> **$id**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/retrieval/retrieval-response-0.1.json"`

### $schema

> **$schema**: `string` = `"https://json-schema.org/draft/2020-12/schema"`

### additionalProperties

> **additionalProperties**: `boolean` = `false`

### allOf

> **allOf**: `object`[]

### properties

> **properties**: `object`

#### properties.citations

> **citations**: `object`

#### properties.citations.items

> **items**: `object`

#### properties.citations.items.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/retrievalCitation"`

#### properties.citations.type

> **type**: `string` = `"array"`

#### properties.diagnostics

> **diagnostics**: `object`

#### properties.diagnostics.items

> **items**: `object`

#### properties.diagnostics.items.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/retrievalStageTrace"`

#### properties.diagnostics.type

> **type**: `string` = `"array"`

#### properties.error

> **error**: `object`

#### properties.error.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/retrievalError"`

#### properties.fallback

> **fallback**: `object`

#### properties.fallback.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/fallback"`

#### properties.grounding

> **grounding**: `object`

#### properties.grounding.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/groundingAssessment"`

#### properties.ok

> **ok**: `object`

#### properties.ok.type

> **type**: `string` = `"boolean"`

#### properties.requestId

> **requestId**: `object`

#### properties.requestId.minLength

> **minLength**: `number` = `1`

#### properties.requestId.type

> **type**: `string` = `"string"`

#### properties.results

> **results**: `object`

#### properties.results.items

> **items**: `object`

#### properties.results.items.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/retrievalCandidate"`

#### properties.results.type

> **type**: `string` = `"array"`

#### properties.techniqueRequested

> **techniqueRequested**: `object`

#### properties.techniqueRequested.items

> **items**: `object`

#### properties.techniqueRequested.items.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/techniqueId"`

#### properties.techniqueRequested.type

> **type**: `string` = `"array"`

#### properties.techniqueUsed

> **techniqueUsed**: `object`

#### properties.techniqueUsed.items

> **items**: `object`

#### properties.techniqueUsed.items.$ref

> **$ref**: `string` = `"./retrieval-defs-0.1.json#/$defs/techniqueId"`

#### properties.techniqueUsed.minItems

> **minItems**: `number` = `1`

#### properties.techniqueUsed.type

> **type**: `string` = `"array"`

### required

> **required**: `string`[]

### title

> **title**: `string` = `"AstroSpec Retrieval Response"`

### type

> **type**: `string` = `"object"`
