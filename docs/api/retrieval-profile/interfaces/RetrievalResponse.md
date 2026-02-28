[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / RetrievalResponse

# Interface: RetrievalResponse

Defined in: src/index.ts:153

## Properties

### citations

> **citations**: [`RetrievalCitation`](RetrievalCitation.md)[]

Defined in: src/index.ts:160

***

### diagnostics?

> `optional` **diagnostics**: [`RetrievalStageTrace`](RetrievalStageTrace.md)[]

Defined in: src/index.ts:162

***

### error?

> `optional` **error**: [`RetrievalError`](RetrievalError.md)

Defined in: src/index.ts:163

***

### fallback?

> `optional` **fallback**: [`RetrievalFallback`](RetrievalFallback.md)

Defined in: src/index.ts:158

***

### grounding?

> `optional` **grounding**: [`GroundingAssessment`](GroundingAssessment.md)

Defined in: src/index.ts:161

***

### ok

> **ok**: `boolean`

Defined in: src/index.ts:154

***

### requestId

> **requestId**: `string`

Defined in: src/index.ts:155

***

### results

> **results**: [`RetrievalCandidate`](RetrievalCandidate.md)[]

Defined in: src/index.ts:159

***

### techniqueRequested?

> `optional` **techniqueRequested**: [`RetrievalTechniqueId`](../type-aliases/RetrievalTechniqueId.md)[]

Defined in: src/index.ts:156

***

### techniqueUsed

> **techniqueUsed**: [`RetrievalTechniqueId`](../type-aliases/RetrievalTechniqueId.md)[]

Defined in: src/index.ts:157
