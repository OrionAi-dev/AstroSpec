[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / RetrievalResponse

# Interface: RetrievalResponse

Defined in: [src/index.ts:153](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L153)

## Properties

### citations

> **citations**: [`RetrievalCitation`](RetrievalCitation.md)[]

Defined in: [src/index.ts:160](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L160)

***

### diagnostics?

> `optional` **diagnostics**: [`RetrievalStageTrace`](RetrievalStageTrace.md)[]

Defined in: [src/index.ts:162](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L162)

***

### error?

> `optional` **error**: [`RetrievalError`](RetrievalError.md)

Defined in: [src/index.ts:163](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L163)

***

### fallback?

> `optional` **fallback**: [`RetrievalFallback`](RetrievalFallback.md)

Defined in: [src/index.ts:158](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L158)

***

### grounding?

> `optional` **grounding**: [`GroundingAssessment`](GroundingAssessment.md)

Defined in: [src/index.ts:161](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L161)

***

### ok

> **ok**: `boolean`

Defined in: [src/index.ts:154](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L154)

***

### requestId

> **requestId**: `string`

Defined in: [src/index.ts:155](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L155)

***

### results

> **results**: [`RetrievalCandidate`](RetrievalCandidate.md)[]

Defined in: [src/index.ts:159](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L159)

***

### techniqueRequested?

> `optional` **techniqueRequested**: [`RetrievalTechniqueId`](../type-aliases/RetrievalTechniqueId.md)[]

Defined in: [src/index.ts:156](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L156)

***

### techniqueUsed

> **techniqueUsed**: [`RetrievalTechniqueId`](../type-aliases/RetrievalTechniqueId.md)[]

Defined in: [src/index.ts:157](https://github.com/OrionAi-dev/AstroSpec/blob/63fea25cdc4d27a3819ece733486fa450f319b71/packages/astrospec-retrieval-profile/src/index.ts#L157)
