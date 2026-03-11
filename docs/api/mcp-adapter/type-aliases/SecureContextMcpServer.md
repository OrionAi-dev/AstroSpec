[**@mcp-secure-context/mcp-adapter**](../README.md)

***

[@mcp-secure-context/mcp-adapter](../README.md) / SecureContextMcpServer

# Type Alias: SecureContextMcpServer

> **SecureContextMcpServer** = `object`

Defined in: index.ts:167

## Methods

### callTool()

> **callTool**(`input`): `Promise`\<[`SecureContextMcpResult`](SecureContextMcpResult.md)\<`unknown`\>\>

Defined in: index.ts:169

#### Parameters

##### input

[`SecureContextMcpToolCall`](SecureContextMcpToolCall.md)

#### Returns

`Promise`\<[`SecureContextMcpResult`](SecureContextMcpResult.md)\<`unknown`\>\>

***

### listTools()

> **listTools**(): [`SecureContextMcpToolSpec`](SecureContextMcpToolSpec.md)[]

Defined in: index.ts:168

#### Returns

[`SecureContextMcpToolSpec`](SecureContextMcpToolSpec.md)[]

***

### readResource()

> **readResource**(`uri`): [`SecureContextMcpResult`](SecureContextMcpResult.md)\<[`AstroSpecMcpResource`](AstroSpecMcpResource.md)\>

Defined in: index.ts:171

#### Parameters

##### uri

`string`

#### Returns

[`SecureContextMcpResult`](SecureContextMcpResult.md)\<[`AstroSpecMcpResource`](AstroSpecMcpResource.md)\>

***

### setContainer()

> **setContainer**(`container`): `void`

Defined in: index.ts:170

#### Parameters

##### container

`ContextContainer`

#### Returns

`void`
