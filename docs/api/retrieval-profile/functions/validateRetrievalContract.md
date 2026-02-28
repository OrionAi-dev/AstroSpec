[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / validateRetrievalContract

# Function: validateRetrievalContract()

> **validateRetrievalContract**(`kind`, `value`): [`ValidationResult`](../type-aliases/ValidationResult.md)\<[`RetrievalPlan`](../interfaces/RetrievalPlan.md) \| [`RetrievalRequest`](../interfaces/RetrievalRequest.md) \| [`RetrievalResponse`](../interfaces/RetrievalResponse.md) \| [`MemoryRecord`](../interfaces/MemoryRecord.md) \| [`KnowledgeAssertion`](../interfaces/KnowledgeAssertion.md) \| [`RetrievalStreamEvent`](../type-aliases/RetrievalStreamEvent.md)\>

Defined in: src/index.ts:373

## Parameters

### kind

`"retrieval-request"` | `"retrieval-response"` | `"retrieval-plan"` | `"memory-record"` | `"knowledge-assertion"` | `"retrieval-stream-event"`

### value

`unknown`

## Returns

[`ValidationResult`](../type-aliases/ValidationResult.md)\<[`RetrievalPlan`](../interfaces/RetrievalPlan.md) \| [`RetrievalRequest`](../interfaces/RetrievalRequest.md) \| [`RetrievalResponse`](../interfaces/RetrievalResponse.md) \| [`MemoryRecord`](../interfaces/MemoryRecord.md) \| [`KnowledgeAssertion`](../interfaces/KnowledgeAssertion.md) \| [`RetrievalStreamEvent`](../type-aliases/RetrievalStreamEvent.md)\>
