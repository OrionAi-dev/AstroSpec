export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}

export type ContainerType =
  | 'user_context'
  | 'task_state'
  | 'knowledge_object'
  | 'memory_reference';

export type SensitivityLabel = 'public' | 'internal' | 'confidential' | 'restricted';
export type AccessMode = 'reference-only' | 'slice-allowed' | 'inline-allowed';
export type VerificationStatus = 'unverified' | 'validated' | 'signed' | 'rejected';

export interface PolicyMetadata {
  audience?: string[];
  allowedActions?: string[];
  purpose?: string;
  sensitivity?: SensitivityLabel;
  expiresAt?: string;
  ttlSeconds?: number;
  reshareAllowed?: boolean;
  redactionRequirements?: string[];
  leastPrivilegeScope?: string;
  ext?: Record<string, JsonValue>;
}

export interface ProvenanceEnvelope {
  createdAt: string;
  createdBy: string;
  sourceLineage?: string[];
  sourceRefs?: string[];
  derivation?: string;
  ext?: Record<string, JsonValue>;
}

export interface SignatureMetadata {
  algorithm: string;
  keyId?: string;
  issuedAt?: string;
  expiresAt?: string;
}

export interface VerificationEnvelope {
  digest: string;
  status: VerificationStatus;
  signatures?: Array<{
    value: string;
    metadata: SignatureMetadata;
  }>;
  issuer?: string;
  verifier?: string;
  expiresAt?: string;
  revokedAt?: string;
  ext?: Record<string, JsonValue>;
}

export interface UserContext {
  userId: string;
  role?: string;
  persona?: string;
  preferences?: Record<string, JsonValue>;
  sessionAttributes?: Record<string, JsonValue>;
  consentRefs?: string[];
  capabilityHints?: string[];
}

export interface TaskState {
  taskId: string;
  goal: string;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed';
  currentStep?: string;
  constraints?: string[];
  handoffNotes?: string;
  inputRefs?: string[];
  outputRefs?: string[];
  artifactRefs?: string[];
  decisionRefs?: string[];
  nextStepRefs?: string[];
  blockingReasons?: string[];
  activeRunId?: string;
  attentionState?: 'normal' | 'needs_attention' | 'blocked' | 'ready_to_handoff';
  recommendedAction?: string;
  summary?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface KnowledgeObject {
  objectId: string;
  kind: string;
  title?: string;
  summary?: string;
  claims?: string[];
  evidenceRefs?: string[];
  sourceRefs?: string[];
  artifactRefs?: string[];
  reportRefs?: string[];
  verificationRefs?: string[];
  derivedFromRefs?: string[];
  rationaleSummary?: string;
  version?: string;
  freshness?: string;
}

export interface MemoryReference {
  namespace: string;
  key: string;
  dereferenceHint?: string;
  retrievalMetadata?: Record<string, JsonValue>;
  leaseExpiresAt?: string;
  accessMode: AccessMode;
}

export type ContextPayloadMap = {
  user_context: UserContext;
  task_state: TaskState;
  knowledge_object: KnowledgeObject;
  memory_reference: MemoryReference;
};

export type ContextPayload = ContextPayloadMap[ContainerType];

export interface ContextContainer<TPayload extends ContextPayload = ContextPayload> {
  schema: 'mcp-secure-context.container.v0.1';
  containerType: ContainerType;
  id: string;
  version: string;
  payload: TPayload;
  policy: PolicyMetadata;
  provenance: ProvenanceEnvelope;
  verification?: VerificationEnvelope;
  ext?: Record<string, JsonValue>;
}
