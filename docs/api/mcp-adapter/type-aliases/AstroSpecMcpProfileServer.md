[**@mcp-secure-context/mcp-adapter**](../README.md)

***

[@mcp-secure-context/mcp-adapter](../README.md) / AstroSpecMcpProfileServer

# Type Alias: AstroSpecMcpProfileServer

> **AstroSpecMcpProfileServer** = `object`

Defined in: index.ts:118

## Methods

### callTool()

> **callTool**(`input`): `Promise`\<[`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<`unknown`\>\>

Defined in: index.ts:120

#### Parameters

##### input

[`AstroSpecMcpToolCall`](AstroSpecMcpToolCall.md)

#### Returns

`Promise`\<[`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<`unknown`\>\>

***

### listTools()

> **listTools**(): [`AstroSpecMcpToolSpec`](AstroSpecMcpToolSpec.md)[]

Defined in: index.ts:119

#### Returns

[`AstroSpecMcpToolSpec`](AstroSpecMcpToolSpec.md)[]

***

### readResource()

> **readResource**(`uri`): [`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<[`AstroSpecMcpResource`](AstroSpecMcpResource.md)\>

Defined in: index.ts:127

#### Parameters

##### uri

`string`

#### Returns

[`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<[`AstroSpecMcpResource`](AstroSpecMcpResource.md)\>

***

### setContext()

> **setContext**(`context`): `void`

Defined in: index.ts:121

#### Parameters

##### context

`AstroSpecContext`

#### Returns

`void`

***

### setKnowledgeAssertion()

> **setKnowledgeAssertion**(`graph`, `nodeId`, `assertion`): `void`

Defined in: index.ts:126

#### Parameters

##### graph

`string`

##### nodeId

`string`

##### assertion

`KnowledgeAssertion`

#### Returns

`void`

***

### setMemoryRecord()

> **setMemoryRecord**(`record`): `void`

Defined in: index.ts:125

#### Parameters

##### record

`MemoryRecord`

#### Returns

`void`

***

### setRetrievalRun()

> **setRetrievalRun**(`response`): `void`

Defined in: index.ts:124

#### Parameters

##### response

`RetrievalResponse`

#### Returns

`void`

***

### setTurn()

> **setTurn**(`turn`): `void`

Defined in: index.ts:122

#### Parameters

##### turn

`AstroSpecTurn`

#### Returns

`void`

***

### setVerification()

> **setVerification**(`id`, `report`): `void`

Defined in: index.ts:123

#### Parameters

##### id

`string`

##### report

`VerificationReport`

#### Returns

`void`
