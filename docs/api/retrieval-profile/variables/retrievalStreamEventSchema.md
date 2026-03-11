[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / retrievalStreamEventSchema

# Variable: retrievalStreamEventSchema

> **retrievalStreamEventSchema**: `object`

Defined in: [schemas/retrieval-stream-event-0.1.json:1](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/schemas/retrieval-stream-event-0.1.json#L1)

## Type Declaration

### $id

> **$id**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/retrieval/retrieval-stream-event-0.1.json"`

### $schema

> **$schema**: `string` = `"https://json-schema.org/draft/2020-12/schema"`

### oneOf

> **oneOf**: (\{ `additionalProperties`: `boolean`; `properties`: \{ `append?`: `undefined`; `candidate?`: `undefined`; `final`: \{ `type`: `string`; \}; `kind`: \{ `const`: `string`; \}; `lastChunk?`: `undefined`; `requestId`: \{ `minLength`: `number`; `type`: `string`; \}; `response?`: `undefined`; `status`: \{ `additionalProperties`: `boolean`; `properties`: \{ `message`: \{ `type`: `string`; \}; `state`: \{ `enum`: `string`[]; `type`: `string`; \}; `timestamp`: \{ `format`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} \| \{ `additionalProperties`: `boolean`; `properties`: \{ `append`: \{ `type`: `string`; \}; `candidate`: \{ `$ref`: `string`; \}; `final?`: `undefined`; `kind`: \{ `const`: `string`; \}; `lastChunk`: \{ `type`: `string`; \}; `requestId`: \{ `minLength`: `number`; `type`: `string`; \}; `response?`: `undefined`; `status?`: `undefined`; \}; `required`: `string`[]; `type`: `string`; \} \| \{ `additionalProperties`: `boolean`; `properties`: \{ `append?`: `undefined`; `candidate?`: `undefined`; `final?`: `undefined`; `kind`: \{ `const`: `string`; \}; `lastChunk?`: `undefined`; `requestId`: \{ `minLength`: `number`; `type`: `string`; \}; `response`: \{ `$ref`: `string`; \}; `status?`: `undefined`; \}; `required`: `string`[]; `type`: `string`; \})[]

### title

> **title**: `string` = `"AstroSpec Retrieval Stream Event"`
