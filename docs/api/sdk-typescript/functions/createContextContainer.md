[**@mcp-secure-context/sdk-typescript**](../README.md)

***

[@mcp-secure-context/sdk-typescript](../README.md) / createContextContainer

# Function: createContextContainer()

> **createContextContainer**\<`TType`\>(`input`): `ContextContainer`\<`ContextPayloadMap`\[`TType`\]\>

Defined in: mcp-secure-context-sdk-typescript/src/index.ts:114

## Type Parameters

### TType

`TType` *extends* `ContainerType`

## Parameters

### input

#### containerType

`TType`

#### ext?

`Record`\<`string`, `JsonValue`\>

#### id

`string`

#### payload

`ContextPayloadMap`\[`TType`\]

#### policy

`PolicyMetadata`

#### provenance

`ProvenanceEnvelope`

#### verification?

`VerificationEnvelope`

#### version?

`string`

## Returns

`ContextContainer`\<`ContextPayloadMap`\[`TType`\]\>
