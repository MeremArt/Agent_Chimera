[@ai16z/eliza v0.1.5-alpha.5](../index.md) / GenerationOptions

# Interface: GenerationOptions

Configuration options for generating objects with a model.

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/generation.ts:1067](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1067)

***

### context

> **context**: `string`

#### Defined in

[packages/core/src/generation.ts:1068](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1068)

***

### modelClass

> **modelClass**: [`ModelClass`](../enumerations/ModelClass.md)

#### Defined in

[packages/core/src/generation.ts:1069](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1069)

***

### schema?

> `optional` **schema**: `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/generation.ts:1070](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1070)

***

### schemaName?

> `optional` **schemaName**: `string`

#### Defined in

[packages/core/src/generation.ts:1071](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1071)

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

#### Defined in

[packages/core/src/generation.ts:1072](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1072)

***

### stop?

> `optional` **stop**: `string`[]

#### Defined in

[packages/core/src/generation.ts:1073](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1073)

***

### mode?

> `optional` **mode**: `"auto"` \| `"json"` \| `"tool"`

#### Defined in

[packages/core/src/generation.ts:1074](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1074)

***

### experimental\_providerMetadata?

> `optional` **experimental\_providerMetadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/core/src/generation.ts:1075](https://github.com/ai16z/eliza/blob/main/packages/core/src/generation.ts#L1075)
