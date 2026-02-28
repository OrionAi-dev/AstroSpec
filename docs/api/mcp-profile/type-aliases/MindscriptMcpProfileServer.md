[**@astrospec/mcp-profile**](../README.md)

***

[@astrospec/mcp-profile](../README.md) / AstroSpecMcpProfileServer

# Type Alias: AstroSpecMcpProfileServer

> **AstroSpecMcpProfileServer** = `object`

Defined in: [index.ts:115](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L115)

## Methods

### callTool()

> **callTool**(`input`): `Promise`\<[`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<`unknown`\>\>

Defined in: [index.ts:117](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L117)

#### Parameters

##### input

[`AstroSpecMcpToolCall`](AstroSpecMcpToolCall.md)

#### Returns

`Promise`\<[`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<`unknown`\>\>

***

### listTools()

> **listTools**(): [`AstroSpecMcpToolSpec`](AstroSpecMcpToolSpec.md)[]

Defined in: [index.ts:116](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L116)

#### Returns

[`AstroSpecMcpToolSpec`](AstroSpecMcpToolSpec.md)[]

***

### readResource()

> **readResource**(`uri`): [`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<[`AstroSpecMcpResource`](AstroSpecMcpResource.md)\>

Defined in: [index.ts:124](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L124)

#### Parameters

##### uri

`string`

#### Returns

[`AstroSpecMcpResult`](AstroSpecMcpResult.md)\<[`AstroSpecMcpResource`](AstroSpecMcpResource.md)\>

***

### setContext()

> **setContext**(`context`): `void`

Defined in: [index.ts:118](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L118)

#### Parameters

##### context

`AstroSpecContext`

#### Returns

`void`

***

### setKnowledgeAssertion()

> **setKnowledgeAssertion**(`graph`, `nodeId`, `assertion`): `void`

Defined in: [index.ts:123](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L123)

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

Defined in: [index.ts:122](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L122)

#### Parameters

##### record

`MemoryRecord`

#### Returns

`void`

***

### setRetrievalRun()

> **setRetrievalRun**(`response`): `void`

Defined in: [index.ts:121](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L121)

#### Parameters

##### response

`RetrievalResponse`

#### Returns

`void`

***

### setTurn()

> **setTurn**(`turn`): `void`

Defined in: [index.ts:119](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L119)

#### Parameters

##### turn

`AstroSpecTurn`

#### Returns

`void`

***

### setVerification()

> **setVerification**(`id`, `report`): `void`

Defined in: [index.ts:120](https://github.com/OrionAi-dev/AstroSpec/blob/ee0ae2df8cec435bfa871f8c12dd5755a2b7efb3/packages/astrospec-mcp-profile/src/index.ts#L120)

#### Parameters

##### id

`string`

##### report

`VerificationReport`

#### Returns

`void`
