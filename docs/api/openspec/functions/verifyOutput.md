[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / verifyOutput

# Function: verifyOutput()

> **verifyOutput**(`input`): `Promise`\<[`VerificationReport`](../interfaces/VerificationReport.md)\>

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:301

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
