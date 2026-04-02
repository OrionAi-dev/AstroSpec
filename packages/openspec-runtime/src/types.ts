// Core OpenSpec types aligned with @openspec/schema (canonical JSON Schema).

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [k: string]: JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}

export type ISODateTime = string & { readonly __brand: 'ISODateTime' };

export type FieldScope =
  | { kind: 'filetype'; value: string }
  | { kind: 'project'; id: string }
  | { kind: 'intent'; value: string }
  | { kind: 'global' };

export type FieldType = 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'array' | 'any';
export type FieldSource = 'user' | 'context' | 'default' | 'memory' | 'model' | 'system';

export interface BaseField<T = unknown> {
  type: FieldType;
  value?: T;
  required?: boolean;
  min?: number;
  max?: number;
  enum?: readonly T[];
  pattern?: string;
  many?: boolean;
  noneAllowed?: boolean;
  default?: T;
  description?: string;
  source?: FieldSource;
  confidence?: number;
  rationale?: string;
  scope?: FieldScope;
  ext?: Record<string, JsonValue>;
}

export type SpecField<T = unknown> = BaseField<T> & (
  | { type: 'string'; value?: string; default?: string }
  | { type: 'number'; value?: number; default?: number }
  | { type: 'boolean'; value?: boolean; default?: boolean }
  | { type: 'enum'; enum: readonly T[]; value?: T; default?: T }
  | { type: 'object'; properties?: Record<string, SpecField> }
  | { type: 'array'; items?: SpecField }
  | { type: 'any' }
);

export interface EvidenceSpan {
  page?: number;
  section?: string;
  start?: number;
  end?: number;
  locator?: string;
}

export interface EvidenceRetrievalMetadata {
  technique?: string;
  stage?: string;
  score?: number;
  rank?: number;
}

export interface EvidenceRef {
  ref: string;
  kind?: string;
  selector?: string;
  checksum?: string;
  sourceId?: string;
  span?: EvidenceSpan;
  retrieval?: EvidenceRetrievalMetadata;
  ext?: Record<string, JsonValue>;
}

export interface AcceptanceCriterion {
  id: string;
  description: string;
  verifier: string;
  params?: JsonObject;
  evidence?: ReadonlyArray<EvidenceRef>;
}

export type AcceptanceCriteria = ReadonlyArray<AcceptanceCriterion>;

export interface ProvenanceEntry {
  source: FieldSource;
  at: ISODateTime;
  field?: string;
  actor?: string;
  note?: string;
  data?: Record<string, JsonValue>;
  entityId?: string;
  activityId?: string;
  agentId?: string;
  role?: string;
  derivedFrom?: string[];
  ext?: Record<string, JsonValue>;
}

export type Provenance = ReadonlyArray<ProvenanceEntry>;

export interface OpenSpecBase<F extends Record<string, SpecField> = Record<string, SpecField>> {
  kind: 'context' | 'turn';
  id: string;
  intent: string;
  fields: F;
  acceptanceCriteria: AcceptanceCriteria;
  provenance?: Provenance;
  lockedAt: ISODateTime;
  version?: string;
  signature?: string;
  meta?: Record<string, JsonValue>;
}

export interface OpenSpecContext<F extends Record<string, SpecField> = Record<string, SpecField>>
  extends OpenSpecBase<F> {
  kind: 'context';
  scope: { type: 'session' | 'project' | 'workspace' | 'global'; id?: string };
  lifespan: { mode: 'session' | 'rolling' | 'pinned'; ttlDays?: number; maxUses?: number };
}

export interface OpenSpecTurn<F extends Record<string, SpecField> = Record<string, SpecField>>
  extends OpenSpecBase<F> {
  kind: 'turn';
  inheritsFrom: string;
}

export type Context<F extends Record<string, SpecField> = Record<string, SpecField>> = OpenSpecContext<F>;
export type Turn<F extends Record<string, SpecField> = Record<string, SpecField>> = OpenSpecTurn<F>;

export interface OpenSpecRequestEnvelope<
  TContext extends OpenSpecContext = OpenSpecContext,
  TTurn extends OpenSpecTurn = OpenSpecTurn,
  TInput extends JsonObject | JsonValue = JsonObject
> {
  context: TContext;
  turn: TTurn;
  input?: TInput;
  requestId?: string;
  meta?: Record<string, JsonValue>;
}

export interface OpenSpecContextRequestEnvelope<TContext extends OpenSpecContext = OpenSpecContext> {
  context: TContext;
  requestId?: string;
  meta?: Record<string, JsonValue>;
}

export interface OpenSpecTurnRequestEnvelope<TTurn extends OpenSpecTurn = OpenSpecTurn> {
  turn: TTurn;
  requestId?: string;
  meta?: Record<string, JsonValue>;
}

// Convenience types used by integrations and examples. These are additive
// runtime helpers, not separate canonical protocol families.
export type JsonPatchOp = 'add' | 'replace' | 'remove';

export interface JsonPatch {
  op: JsonPatchOp;
  path: string;
  value?: JsonValue;
}

export interface DerivedSpec {
  baseId: string;
  patches: ReadonlyArray<JsonPatch>;
  provenance: ReadonlyArray<ProvenanceEntry>;
}

export interface ToolBinding<P extends Record<string, SpecField> = Record<string, SpecField>> {
  intent: string;
  tool: string;
  paramMap: { [K in keyof P]?: string } & Record<string, string>;
}
