import type { JsonObject, JsonValue, ISODateTime } from "@openspec/runtime";

/**
 * OpenSpec Events (public, stable, boring)
 * ------------------------------------------------------------
 * This package defines an extremely flexible, vendor-neutral event contract.
 * It intentionally avoids proprietary source enums and domain-specific logic.
 *
 * Private repos implement:
 * - concrete importers
 * - normalization rules
 * - enrichment / entity resolution
 * - domain schemas
 */

/** ---------- Branded IDs ---------- */
export type EventId = string & { readonly __brand: "EventId" };
export type EntityId = string & { readonly __brand: "EntityId" };
export type SourceId = string & { readonly __brand: "SourceId" };
export type CorrelationId = string & { readonly __brand: "CorrelationId" };

/**
 * An Entity is "anything that can participate":
 * - person, org, account, device, child, parent, judge, attorney
 * - file, record, case, ticket, medical provider
 * - place, court, clinic, event venue
 * - abstract identity (e.g. "Unknown Caller")
 */
export interface EntityRef {
  id: EntityId;
  /** Optional display label (not authoritative) */
  label?: string;

  /**
   * Optional coarse category. Keep it generic.
   * Examples: "person", "organization", "device", "account", "case", "location", "document", "unknown"
   * Consumers can add more detail in ext.
   */
  category?: string;

  /** Optional aliases or handles (avoid raw secrets) */
  aliases?: ReadonlyArray<string>;

  /**
   * Free-form tags for classification:
   * Examples: "minor", "custodian", "provider", "witness", "party", "guardian"
   */
  tags?: ReadonlyArray<string>;

  /** Extension bucket */
  ext?: Record<string, JsonValue>;
}

/**
 * Relationship graph: express any role/relationship imaginable.
 * Examples:
 * - parent_of, represented_by, employed_by, resides_with, custodian_of
 * - sender_to, caller_of, participant_in, owner_of, subject_of
 */
export interface RelationshipEdge {
  /** Relationship kind (free-form string). Prefer snake_case. */
  kind: string; // e.g. "parent_of", "represented_by", "participant_in"

  from: EntityRef;
  to: EntityRef;

  /** Optional qualifiers and role labels (also free-form) */
  roles?: ReadonlyArray<string>; // e.g. ["petitioner","respondent"], ["caller","callee"]

  /** Optional temporal bounds */
  since?: ISODateTime;
  until?: ISODateTime;

  /** Optional scope: what context/case/project this relationship belongs to */
  scope?: {
    kind?: string; // e.g. "case", "project", "workspace", "global"
    id?: string;
  };

  /** Optional confidence + rationale for inferred relationships */
  confidence?: number; // 0..1
  rationale?: string;

  ext?: Record<string, JsonValue>;
}

/**
 * A Source describes where an event originated, without leaking vendor/app details.
 * It’s not just "file vs api"—it can be a chain (e.g. "device -> export -> parser").
 */
export interface SourceDescriptor {
  id: SourceId;

  /**
   * Free-form source type.
   * Examples: "file", "api", "database", "device", "sensor", "manual", "email_gateway", "calendar_provider"
   */
  kind?: string;

  /**
   * Capability tags (free-form).
   * Examples: "authoritative", "user_provided", "third_party", "derived", "redacted", "signed"
   */
  tags?: ReadonlyArray<string>;

  /**
   * Optional human-readable label.
   * Private repos may put product/vendor names here if they want, but public code does not require it.
   */
  label?: string;

  /**
   * Optional opaque account reference (avoid raw identifiers).
   * e.g. hash, internal ID, redacted token
   */
  accountRef?: string;

  /**
   * Optional provenance chain (how it got here).
   * Example: device log -> exported zip -> parsed -> normalized.
   */
  chain?: ReadonlyArray<{
    kind: string;              // "capture" | "export" | "transform" | "parse" | "normalize" | "redact" | "sign" | ...
    at?: ISODateTime;
    by?: EntityRef;            // actor/process (optional)
    tool?: string;             // generic tool name (or opaque id)
    note?: string;
    ext?: Record<string, JsonValue>;
  }>;

  ext?: Record<string, JsonValue>;
}

/**
 * The core event envelope.
 * Event "type" is a namespaced string to avoid schema lock-in.
 * Examples:
 * - "communication.call.started"
 * - "communication.message.sent"
 * - "medical.visit.completed"
 * - "legal.filing.submitted"
 * - "evidence.photo.captured"
 * - "system.import.completed"
 */
export interface EventEnvelope<
  TType extends string = string,
  TPayload extends JsonObject = JsonObject
> {
  id: EventId;

  /** Namespaced event type */
  type: TType;

  /** Canonical time */
  at: ISODateTime;

  /** Optional IANA tz for local interpretation */
  tz?: string;

  /**
   * Participants/entities involved.
   * No role union here — role/meaning lives in `relationships` or payload.
   */
  entities?: ReadonlyArray<EntityRef>;

  /**
   * Optional relationship edges relevant to this event.
   * This is how you model caller/callee, sender/recipient, parent/child, attorney/client, etc.
   */
  relationships?: ReadonlyArray<RelationshipEdge>;

  /** Where the event came from */
  source: SourceDescriptor;

  /**
   * Optional additional sources supporting this event (attachments, exports, secondary evidence).
   * Use this when an event is corroborated by multiple inputs (e.g., export + screenshot + audio).
   */
  sources?: ReadonlyArray<SourceDescriptor>;


  /** Event-specific payload (consumer-defined) */
  payload: TPayload;

  /**
   * Optional correlation/grouping IDs.
   * Useful for threading: a call session, message thread, case docket entry series, import run, etc.
   */
  correlation?: ReadonlyArray<{
    id: CorrelationId;
    kind?: string; // "thread" | "session" | "case" | "batch" | "import_run" | "conversation" | ...
    label?: string;
    ext?: Record<string, JsonValue>;
  }>;

  /** Optional tags for search/filtering */
  tags?: ReadonlyArray<string>;

  /**
   * Traceability without leaking mechanism.
   * This should point to an opaque record/file handle in the consumer’s system.
   */
  rawRef?: {
    kind: string; // "file" | "row" | "record" | "url" | ...
    ref: string;  // opaque (avoid secrets)
    checksum?: string; // optional integrity
  };

  /**
   * Confidence & rationale for derived/inferred events.
   * If the event is directly observed, confidence can be omitted.
   */
  confidence?: number; // 0..1
  rationale?: string;

  /** Extensions */
  ext?: Record<string, JsonValue>;
}

export type AnyEvent = EventEnvelope<string, JsonObject>;

/** ---------- Import surfaces ---------- */

export interface ImportInput {
  kind: string; // free-form: "file" | "directory" | "bytes" | "json" | "stream" | ...
  name?: string;
  bytes?: Uint8Array;
  json?: JsonValue;
  path?: string;
  mimeType?: string;
  ext?: Record<string, JsonValue>;
}

/**
 * Public importer interface: concrete implementations live in private repos.
 * Avoid vendor/product names in id (keep generic).
 */
export interface EventImporter {
  id: string; // e.g. "messaging.export", "calllog.csv", "calendar.ics", "generic.jsonl"
  supports(input: ImportInput): boolean | Promise<boolean>;
  import(input: ImportInput): AsyncIterable<AnyEvent> | Promise<AsyncIterable<AnyEvent>>;
}

export interface EventSink {
  id: string;
  put(events: AsyncIterable<AnyEvent> | Iterable<AnyEvent>): Promise<void>;
}

export interface EventStore {
  id: string;
  getById(id: EventId): Promise<AnyEvent | null>;
  query(q: {
    type?: string;
    sourceId?: SourceId;
    entityId?: EntityId;
    since?: ISODateTime;
    until?: ISODateTime;
    limit?: number;

    /** Free-form filter hooks for consumer implementations */
    tagsAny?: ReadonlyArray<string>;
    tagsAll?: ReadonlyArray<string>;
  }): Promise<AnyEvent[]>;
}

/** ---------- Stable helpers (no proprietary logic) ---------- */
export function makeEventId(s: string): EventId {
  return s as EventId;
}
export function makeEntityId(s: string): EntityId {
  return s as EntityId;
}
export function makeSourceId(s: string): SourceId {
  return s as SourceId;
}
export function makeCorrelationId(s: string): CorrelationId {
  return s as CorrelationId;
}
