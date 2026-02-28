[**@astrospec/openspec-runtime**](../README.md)

***

[@astrospec/openspec-runtime](../README.md) / verifyOutput

# Function: verifyOutput()

> **verifyOutput**(`input`): `Promise`\<[`VerificationReport`](../interfaces/VerificationReport.md)\>

Defined in: packages/astrospec-runtime/dist/index.d.ts:288

## Parameters

### input

#### context?

[`AstroSpecContext`](../interfaces/AstroSpecContext.md)\<`Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\<`unknown`\>\>\>

#### criteria

readonly [`AcceptanceCriterion`](../interfaces/AcceptanceCriterion.md)[]

#### env?

[`VerifyEnv`](../interfaces/VerifyEnv.md)

#### output

`unknown`

#### turn?

[`AstroSpecTurn`](../interfaces/AstroSpecTurn.md)\<`Record`\<`string`, [`SpecField`](../type-aliases/SpecField.md)\<`unknown`\>\>\>

## Returns

`Promise`\<[`VerificationReport`](../interfaces/VerificationReport.md)\>
