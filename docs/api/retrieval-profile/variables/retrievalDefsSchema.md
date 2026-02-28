[**@astrospec/retrieval-profile**](../README.md)

***

[@astrospec/retrieval-profile](../README.md) / retrievalDefsSchema

# Variable: retrievalDefsSchema

> **retrievalDefsSchema**: `object`

Defined in: schemas/retrieval-defs-0.1.json:1

## Type Declaration

### $defs

> **$defs**: `object`

#### $defs.candidateKind

> **candidateKind**: `object`

#### $defs.candidateKind.enum

> **enum**: `string`[]

#### $defs.candidateKind.type

> **type**: `string` = `"string"`

#### $defs.candidateStage

> **candidateStage**: `object`

#### $defs.candidateStage.enum

> **enum**: `string`[]

#### $defs.candidateStage.type

> **type**: `string` = `"string"`

#### $defs.fallback

> **fallback**: `object`

#### $defs.fallback.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.fallback.properties

> **properties**: `object`

#### $defs.fallback.properties.applied

> **applied**: `object`

#### $defs.fallback.properties.applied.type

> **type**: `string` = `"boolean"`

#### $defs.fallback.properties.from

> **from**: `object`

#### $defs.fallback.properties.from.type

> **type**: `string` = `"string"`

#### $defs.fallback.properties.reason

> **reason**: `object`

#### $defs.fallback.properties.reason.type

> **type**: `string` = `"string"`

#### $defs.fallback.properties.to

> **to**: `object`

#### $defs.fallback.properties.to.type

> **type**: `string` = `"string"`

#### $defs.fallback.required

> **required**: `string`[]

#### $defs.fallback.type

> **type**: `string` = `"object"`

#### $defs.groundingAssessment

> **groundingAssessment**: `object`

#### $defs.groundingAssessment.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.groundingAssessment.properties

> **properties**: `object`

#### $defs.groundingAssessment.properties.confidence

> **confidence**: `object`

#### $defs.groundingAssessment.properties.confidence.maximum

> **maximum**: `number` = `1`

#### $defs.groundingAssessment.properties.confidence.minimum

> **minimum**: `number` = `0`

#### $defs.groundingAssessment.properties.confidence.type

> **type**: `string` = `"number"`

#### $defs.groundingAssessment.properties.missingEvidence

> **missingEvidence**: `object`

#### $defs.groundingAssessment.properties.missingEvidence.items

> **items**: `object`

#### $defs.groundingAssessment.properties.missingEvidence.items.type

> **type**: `string` = `"string"`

#### $defs.groundingAssessment.properties.missingEvidence.type

> **type**: `string` = `"array"`

#### $defs.groundingAssessment.properties.supported

> **supported**: `object`

#### $defs.groundingAssessment.properties.supported.type

> **type**: `string` = `"boolean"`

#### $defs.groundingAssessment.properties.unsupportedClaims

> **unsupportedClaims**: `object`

#### $defs.groundingAssessment.properties.unsupportedClaims.items

> **items**: `object`

#### $defs.groundingAssessment.properties.unsupportedClaims.items.type

> **type**: `string` = `"string"`

#### $defs.groundingAssessment.properties.unsupportedClaims.type

> **type**: `string` = `"array"`

#### $defs.groundingAssessment.required

> **required**: `string`[]

#### $defs.groundingAssessment.type

> **type**: `string` = `"object"`

#### $defs.knowledgeAssertion

> **knowledgeAssertion**: `object`

#### $defs.knowledgeAssertion.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.knowledgeAssertion.properties

> **properties**: `object`

#### $defs.knowledgeAssertion.properties.assertedAt

> **assertedAt**: `object`

#### $defs.knowledgeAssertion.properties.assertedAt.format

> **format**: `string` = `"date-time"`

#### $defs.knowledgeAssertion.properties.assertedAt.type

> **type**: `string` = `"string"`

#### $defs.knowledgeAssertion.properties.confidence

> **confidence**: `object`

#### $defs.knowledgeAssertion.properties.confidence.maximum

> **maximum**: `number` = `1`

#### $defs.knowledgeAssertion.properties.confidence.minimum

> **minimum**: `number` = `0`

#### $defs.knowledgeAssertion.properties.confidence.type

> **type**: `string` = `"number"`

#### $defs.knowledgeAssertion.properties.evidence

> **evidence**: `object`

#### $defs.knowledgeAssertion.properties.evidence.items

> **items**: `object`

#### $defs.knowledgeAssertion.properties.evidence.items.$ref

> **$ref**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/defs-0.1.json#/$defs/evidenceRef"`

#### $defs.knowledgeAssertion.properties.evidence.type

> **type**: `string` = `"array"`

#### $defs.knowledgeAssertion.properties.object

> **object**: `object` = `{}`

#### $defs.knowledgeAssertion.properties.predicate

> **predicate**: `object`

#### $defs.knowledgeAssertion.properties.predicate.minLength

> **minLength**: `number` = `1`

#### $defs.knowledgeAssertion.properties.predicate.type

> **type**: `string` = `"string"`

#### $defs.knowledgeAssertion.properties.subject

> **subject**: `object`

#### $defs.knowledgeAssertion.properties.subject.minLength

> **minLength**: `number` = `1`

#### $defs.knowledgeAssertion.properties.subject.type

> **type**: `string` = `"string"`

#### $defs.knowledgeAssertion.required

> **required**: `string`[]

#### $defs.knowledgeAssertion.type

> **type**: `string` = `"object"`

#### $defs.memoryKind

> **memoryKind**: `object`

#### $defs.memoryKind.enum

> **enum**: `string`[]

#### $defs.memoryKind.type

> **type**: `string` = `"string"`

#### $defs.memoryRecord

> **memoryRecord**: `object`

#### $defs.memoryRecord.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.memoryRecord.properties

> **properties**: `object`

#### $defs.memoryRecord.properties.confidence

> **confidence**: `object`

#### $defs.memoryRecord.properties.confidence.maximum

> **maximum**: `number` = `1`

#### $defs.memoryRecord.properties.confidence.minimum

> **minimum**: `number` = `0`

#### $defs.memoryRecord.properties.confidence.type

> **type**: `string` = `"number"`

#### $defs.memoryRecord.properties.content

> **content**: `object` = `{}`

#### $defs.memoryRecord.properties.key

> **key**: `object`

#### $defs.memoryRecord.properties.key.minLength

> **minLength**: `number` = `1`

#### $defs.memoryRecord.properties.key.type

> **type**: `string` = `"string"`

#### $defs.memoryRecord.properties.kind

> **kind**: `object`

#### $defs.memoryRecord.properties.kind.$ref

> **$ref**: `string` = `"#/$defs/memoryKind"`

#### $defs.memoryRecord.properties.namespace

> **namespace**: `object`

#### $defs.memoryRecord.properties.namespace.minLength

> **minLength**: `number` = `1`

#### $defs.memoryRecord.properties.namespace.type

> **type**: `string` = `"string"`

#### $defs.memoryRecord.properties.sourceIds

> **sourceIds**: `object`

#### $defs.memoryRecord.properties.sourceIds.items

> **items**: `object`

#### $defs.memoryRecord.properties.sourceIds.items.minLength

> **minLength**: `number` = `1`

#### $defs.memoryRecord.properties.sourceIds.items.type

> **type**: `string` = `"string"`

#### $defs.memoryRecord.properties.sourceIds.type

> **type**: `string` = `"array"`

#### $defs.memoryRecord.properties.updatedAt

> **updatedAt**: `object`

#### $defs.memoryRecord.properties.updatedAt.format

> **format**: `string` = `"date-time"`

#### $defs.memoryRecord.properties.updatedAt.type

> **type**: `string` = `"string"`

#### $defs.memoryRecord.required

> **required**: `string`[]

#### $defs.memoryRecord.type

> **type**: `string` = `"object"`

#### $defs.retrievalCandidate

> **retrievalCandidate**: `object`

#### $defs.retrievalCandidate.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.retrievalCandidate.properties

> **properties**: `object`

#### $defs.retrievalCandidate.properties.candidateId

> **candidateId**: `object`

#### $defs.retrievalCandidate.properties.candidateId.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalCandidate.properties.candidateId.type

> **type**: `string` = `"string"`

#### $defs.retrievalCandidate.properties.kind

> **kind**: `object`

#### $defs.retrievalCandidate.properties.kind.$ref

> **$ref**: `string` = `"#/$defs/candidateKind"`

#### $defs.retrievalCandidate.properties.metadata

> **metadata**: `object`

#### $defs.retrievalCandidate.properties.metadata.additionalProperties

> **additionalProperties**: `boolean` = `true`

#### $defs.retrievalCandidate.properties.metadata.type

> **type**: `string` = `"object"`

#### $defs.retrievalCandidate.properties.mimeType

> **mimeType**: `object`

#### $defs.retrievalCandidate.properties.mimeType.type

> **type**: `string` = `"string"`

#### $defs.retrievalCandidate.properties.provenance

> **provenance**: `object`

#### $defs.retrievalCandidate.properties.provenance.$ref

> **$ref**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/provenance-0.1.json"`

#### $defs.retrievalCandidate.properties.rank

> **rank**: `object`

#### $defs.retrievalCandidate.properties.rank.minimum

> **minimum**: `number` = `0`

#### $defs.retrievalCandidate.properties.rank.type

> **type**: `string` = `"number"`

#### $defs.retrievalCandidate.properties.ref

> **ref**: `object`

#### $defs.retrievalCandidate.properties.ref.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalCandidate.properties.ref.type

> **type**: `string` = `"string"`

#### $defs.retrievalCandidate.properties.score

> **score**: `object`

#### $defs.retrievalCandidate.properties.score.type

> **type**: `string` = `"number"`

#### $defs.retrievalCandidate.properties.snippet

> **snippet**: `object`

#### $defs.retrievalCandidate.properties.snippet.type

> **type**: `string` = `"string"`

#### $defs.retrievalCandidate.properties.sourceId

> **sourceId**: `object`

#### $defs.retrievalCandidate.properties.sourceId.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalCandidate.properties.sourceId.type

> **type**: `string` = `"string"`

#### $defs.retrievalCandidate.properties.span

> **span**: `object`

#### $defs.retrievalCandidate.properties.span.$ref

> **$ref**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/defs-0.1.json#/$defs/evidenceSpan"`

#### $defs.retrievalCandidate.properties.stage

> **stage**: `object`

#### $defs.retrievalCandidate.properties.stage.$ref

> **$ref**: `string` = `"#/$defs/candidateStage"`

#### $defs.retrievalCandidate.properties.title

> **title**: `object`

#### $defs.retrievalCandidate.properties.title.type

> **type**: `string` = `"string"`

#### $defs.retrievalCandidate.required

> **required**: `string`[]

#### $defs.retrievalCandidate.type

> **type**: `string` = `"object"`

#### $defs.retrievalCitation

> **retrievalCitation**: `object`

#### $defs.retrievalCitation.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.retrievalCitation.properties

> **properties**: `object`

#### $defs.retrievalCitation.properties.candidateId

> **candidateId**: `object`

#### $defs.retrievalCitation.properties.candidateId.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalCitation.properties.candidateId.type

> **type**: `string` = `"string"`

#### $defs.retrievalCitation.properties.citationId

> **citationId**: `object`

#### $defs.retrievalCitation.properties.citationId.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalCitation.properties.citationId.type

> **type**: `string` = `"string"`

#### $defs.retrievalCitation.properties.claimId

> **claimId**: `object`

#### $defs.retrievalCitation.properties.claimId.type

> **type**: `string` = `"string"`

#### $defs.retrievalCitation.properties.confidence

> **confidence**: `object`

#### $defs.retrievalCitation.properties.confidence.maximum

> **maximum**: `number` = `1`

#### $defs.retrievalCitation.properties.confidence.minimum

> **minimum**: `number` = `0`

#### $defs.retrievalCitation.properties.confidence.type

> **type**: `string` = `"number"`

#### $defs.retrievalCitation.properties.label

> **label**: `object`

#### $defs.retrievalCitation.properties.label.type

> **type**: `string` = `"string"`

#### $defs.retrievalCitation.properties.quote

> **quote**: `object`

#### $defs.retrievalCitation.properties.quote.type

> **type**: `string` = `"string"`

#### $defs.retrievalCitation.properties.span

> **span**: `object`

#### $defs.retrievalCitation.properties.span.$ref

> **$ref**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/defs-0.1.json#/$defs/evidenceSpan"`

#### $defs.retrievalCitation.required

> **required**: `string`[]

#### $defs.retrievalCitation.type

> **type**: `string` = `"object"`

#### $defs.retrievalError

> **retrievalError**: `object`

#### $defs.retrievalError.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.retrievalError.properties

> **properties**: `object`

#### $defs.retrievalError.properties.code

> **code**: `object`

#### $defs.retrievalError.properties.code.enum

> **enum**: `string`[]

#### $defs.retrievalError.properties.code.type

> **type**: `string` = `"string"`

#### $defs.retrievalError.properties.details

> **details**: `object`

#### $defs.retrievalError.properties.details.additionalProperties

> **additionalProperties**: `boolean` = `true`

#### $defs.retrievalError.properties.details.type

> **type**: `string` = `"object"`

#### $defs.retrievalError.properties.message

> **message**: `object`

#### $defs.retrievalError.properties.message.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalError.properties.message.type

> **type**: `string` = `"string"`

#### $defs.retrievalError.required

> **required**: `string`[]

#### $defs.retrievalError.type

> **type**: `string` = `"object"`

#### $defs.retrievalPlan

> **retrievalPlan**: `object`

#### $defs.retrievalPlan.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.retrievalPlan.properties

> **properties**: `object`

#### $defs.retrievalPlan.properties.notes

> **notes**: `object`

#### $defs.retrievalPlan.properties.notes.type

> **type**: `string` = `"string"`

#### $defs.retrievalPlan.properties.steps

> **steps**: `object`

#### $defs.retrievalPlan.properties.steps.items

> **items**: `object`

#### $defs.retrievalPlan.properties.steps.items.$ref

> **$ref**: `string` = `"#/$defs/retrievalPlanStep"`

#### $defs.retrievalPlan.properties.steps.minItems

> **minItems**: `number` = `1`

#### $defs.retrievalPlan.properties.steps.type

> **type**: `string` = `"array"`

#### $defs.retrievalPlan.properties.strategy

> **strategy**: `object`

#### $defs.retrievalPlan.properties.strategy.enum

> **enum**: `string`[]

#### $defs.retrievalPlan.properties.strategy.type

> **type**: `string` = `"string"`

#### $defs.retrievalPlan.required

> **required**: `string`[]

#### $defs.retrievalPlan.type

> **type**: `string` = `"object"`

#### $defs.retrievalPlanStep

> **retrievalPlanStep**: `object`

#### $defs.retrievalPlanStep.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.retrievalPlanStep.properties

> **properties**: `object`

#### $defs.retrievalPlanStep.properties.dependsOn

> **dependsOn**: `object`

#### $defs.retrievalPlanStep.properties.dependsOn.items

> **items**: `object`

#### $defs.retrievalPlanStep.properties.dependsOn.items.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalPlanStep.properties.dependsOn.items.type

> **type**: `string` = `"string"`

#### $defs.retrievalPlanStep.properties.dependsOn.type

> **type**: `string` = `"array"`

#### $defs.retrievalPlanStep.properties.filters

> **filters**: `object`

#### $defs.retrievalPlanStep.properties.filters.additionalProperties

> **additionalProperties**: `boolean` = `true`

#### $defs.retrievalPlanStep.properties.filters.type

> **type**: `string` = `"object"`

#### $defs.retrievalPlanStep.properties.id

> **id**: `object`

#### $defs.retrievalPlanStep.properties.id.minLength

> **minLength**: `number` = `1`

#### $defs.retrievalPlanStep.properties.id.type

> **type**: `string` = `"string"`

#### $defs.retrievalPlanStep.properties.purpose

> **purpose**: `object`

#### $defs.retrievalPlanStep.properties.purpose.type

> **type**: `string` = `"string"`

#### $defs.retrievalPlanStep.properties.technique

> **technique**: `object`

#### $defs.retrievalPlanStep.properties.technique.$ref

> **$ref**: `string` = `"#/$defs/techniqueId"`

#### $defs.retrievalPlanStep.properties.topK

> **topK**: `object`

#### $defs.retrievalPlanStep.properties.topK.minimum

> **minimum**: `number` = `0`

#### $defs.retrievalPlanStep.properties.topK.type

> **type**: `string` = `"number"`

#### $defs.retrievalPlanStep.required

> **required**: `string`[]

#### $defs.retrievalPlanStep.type

> **type**: `string` = `"object"`

#### $defs.retrievalStageTrace

> **retrievalStageTrace**: `object`

#### $defs.retrievalStageTrace.additionalProperties

> **additionalProperties**: `boolean` = `false`

#### $defs.retrievalStageTrace.properties

> **properties**: `object`

#### $defs.retrievalStageTrace.properties.durationMs

> **durationMs**: `object`

#### $defs.retrievalStageTrace.properties.durationMs.minimum

> **minimum**: `number` = `0`

#### $defs.retrievalStageTrace.properties.durationMs.type

> **type**: `string` = `"number"`

#### $defs.retrievalStageTrace.properties.inputCount

> **inputCount**: `object`

#### $defs.retrievalStageTrace.properties.inputCount.minimum

> **minimum**: `number` = `0`

#### $defs.retrievalStageTrace.properties.inputCount.type

> **type**: `string` = `"number"`

#### $defs.retrievalStageTrace.properties.notes

> **notes**: `object`

#### $defs.retrievalStageTrace.properties.notes.type

> **type**: `string` = `"string"`

#### $defs.retrievalStageTrace.properties.outputCount

> **outputCount**: `object`

#### $defs.retrievalStageTrace.properties.outputCount.minimum

> **minimum**: `number` = `0`

#### $defs.retrievalStageTrace.properties.outputCount.type

> **type**: `string` = `"number"`

#### $defs.retrievalStageTrace.properties.stage

> **stage**: `object`

#### $defs.retrievalStageTrace.properties.stage.$ref

> **$ref**: `string` = `"#/$defs/candidateStage"`

#### $defs.retrievalStageTrace.properties.technique

> **technique**: `object`

#### $defs.retrievalStageTrace.properties.technique.$ref

> **$ref**: `string` = `"#/$defs/techniqueId"`

#### $defs.retrievalStageTrace.required

> **required**: `string`[]

#### $defs.retrievalStageTrace.type

> **type**: `string` = `"object"`

#### $defs.techniqueId

> **techniqueId**: `object`

#### $defs.techniqueId.enum

> **enum**: `string`[]

#### $defs.techniqueId.type

> **type**: `string` = `"string"`

### $id

> **$id**: `string` = `"https://orionai-dev.github.io/AstroSpec/schemas/astrospec/retrieval/retrieval-defs-0.1.json"`

### $schema

> **$schema**: `string` = `"https://json-schema.org/draft/2020-12/schema"`

### title

> **title**: `string` = `"AstroSpec Retrieval Profile Definitions"`

### type

> **type**: `string` = `"object"`
