[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / RetrievalStreamEvent

# Type Alias: RetrievalStreamEvent

> **RetrievalStreamEvent** = \{ `final?`: `boolean`; `kind`: `"status-update"`; `requestId`: `string`; `status`: \{ `message?`: `string`; `state`: `"submitted"` \| `"working"` \| `"input-required"` \| `"completed"` \| `"failed"`; `timestamp`: `string`; \}; \} \| \{ `append?`: `boolean`; `candidate`: [`RetrievalCandidate`](../interfaces/RetrievalCandidate.md); `kind`: `"candidate-update"`; `lastChunk?`: `boolean`; `requestId`: `string`; \} \| \{ `kind`: `"final"`; `requestId`: `string`; `response`: [`RetrievalResponse`](../interfaces/RetrievalResponse.md); \}

Defined in: src/index.ts:185
