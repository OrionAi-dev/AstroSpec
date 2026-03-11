[**@mcp-secure-context/openspec**](../README.md)

***

[@mcp-secure-context/openspec](../README.md) / SpecField

# Type Alias: SpecField\<T\>

> **SpecField**\<`T`\> = [`BaseField`](../interfaces/BaseField.md)\<`T`\> & \{ `default?`: `string`; `type`: `"string"`; `value?`: `string`; \} \| \{ `default?`: `number`; `type`: `"number"`; `value?`: `number`; \} \| \{ `default?`: `boolean`; `type`: `"boolean"`; `value?`: `boolean`; \} \| \{ `default?`: `T`; `enum`: readonly `T`[]; `type`: `"enum"`; `value?`: `T`; \} \| \{ `properties?`: `Record`\<`string`, `SpecField`\>; `type`: `"object"`; \} \| \{ `items?`: `SpecField`; `type`: `"array"`; \} \| \{ `type`: `"any"`; \}

Defined in: packages/mcp-secure-context-openspec/dist/index.d.ts:43

## Type Parameters

### T

`T` = `unknown`
