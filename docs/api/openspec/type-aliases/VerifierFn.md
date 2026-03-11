[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / VerifierFn

# Type Alias: VerifierFn()

> **VerifierFn** = (`input`) => `Promise`\<`Omit`\<[`VerifierResult`](../interfaces/VerifierResult.md), `"criterionId"` \| `"verifier"`\>\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:293

## Parameters

### input

#### context?

[`AstroSpecContext`](../interfaces/AstroSpecContext.md)

#### criterion

[`AcceptanceCriterion`](../interfaces/AcceptanceCriterion.md)

#### env

[`VerifyEnv`](../interfaces/VerifyEnv.md)

#### output

`unknown`

#### turn?

[`AstroSpecTurn`](../interfaces/AstroSpecTurn.md)

## Returns

`Promise`\<`Omit`\<[`VerifierResult`](../interfaces/VerifierResult.md), `"criterionId"` \| `"verifier"`\>\>
