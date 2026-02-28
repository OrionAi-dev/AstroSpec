[**@astrospec/openspec-types**](../README.md)

***

[@astrospec/openspec-types](../README.md) / VerifierFn

# Type Alias: VerifierFn()

> **VerifierFn** = (`input`) => `Promise`\<`Omit`\<[`VerifierResult`](../interfaces/VerifierResult.md), `"criterionId"` \| `"verifier"`\>\>

Defined in: packages/astrospec-runtime/dist/index.d.ts:280

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
