from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, Generic, List, Literal, Optional, TypeVar

ContainerType = Literal["user_context", "task_state", "knowledge_object", "memory_reference"]
SensitivityLabel = Literal["public", "internal", "confidential", "restricted"]
AccessMode = Literal["reference-only", "slice-allowed", "inline-allowed"]
VerificationStatus = Literal["unverified", "validated", "signed", "rejected"]


@dataclass
class PolicyMetadata:
    audience: List[str] = field(default_factory=list)
    allowed_actions: List[str] = field(default_factory=list)
    purpose: Optional[str] = None
    sensitivity: Optional[SensitivityLabel] = None
    expires_at: Optional[str] = None
    ttl_seconds: Optional[int] = None
    reshare_allowed: Optional[bool] = None
    redaction_requirements: List[str] = field(default_factory=list)
    least_privilege_scope: Optional[str] = None
    ext: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ProvenanceEnvelope:
    created_at: str
    created_by: str
    source_lineage: List[str] = field(default_factory=list)
    source_refs: List[str] = field(default_factory=list)
    derivation: Optional[str] = None
    ext: Dict[str, Any] = field(default_factory=dict)


@dataclass
class VerificationEnvelope:
    digest: str
    status: VerificationStatus
    issuer: Optional[str] = None
    verifier: Optional[str] = None
    expires_at: Optional[str] = None
    revoked_at: Optional[str] = None
    signatures: List[Dict[str, Any]] = field(default_factory=list)
    ext: Dict[str, Any] = field(default_factory=dict)


@dataclass
class UserContext:
    user_id: str
    role: Optional[str] = None
    persona: Optional[str] = None
    preferences: Dict[str, Any] = field(default_factory=dict)
    session_attributes: Dict[str, Any] = field(default_factory=dict)
    consent_refs: List[str] = field(default_factory=list)
    capability_hints: List[str] = field(default_factory=list)


@dataclass
class TaskState:
    task_id: str
    goal: str
    status: Literal["pending", "in_progress", "blocked", "completed"]
    current_step: Optional[str] = None
    constraints: List[str] = field(default_factory=list)
    handoff_notes: Optional[str] = None
    input_refs: List[str] = field(default_factory=list)
    output_refs: List[str] = field(default_factory=list)
    summary: Optional[str] = None
    updated_at: Optional[str] = None


@dataclass
class KnowledgeObject:
    object_id: str
    kind: str
    title: Optional[str] = None
    summary: Optional[str] = None
    claims: List[str] = field(default_factory=list)
    evidence_refs: List[str] = field(default_factory=list)
    source_refs: List[str] = field(default_factory=list)
    version: Optional[str] = None
    freshness: Optional[str] = None


@dataclass
class MemoryReference:
    namespace: str
    key: str
    access_mode: AccessMode
    dereference_hint: Optional[str] = None
    retrieval_metadata: Dict[str, Any] = field(default_factory=dict)
    lease_expires_at: Optional[str] = None


PayloadT = TypeVar("PayloadT")


@dataclass
class ContextContainer(Generic[PayloadT]):
    container_type: ContainerType
    id: str
    payload: PayloadT
    policy: PolicyMetadata
    provenance: ProvenanceEnvelope
    version: str = "0.1.0"
    schema: str = "mcp-secure-context.container.v0.1"
    verification: Optional[VerificationEnvelope] = None
    ext: Dict[str, Any] = field(default_factory=dict)


def create_context_container(
    *,
    container_type: ContainerType,
    container_id: str,
    payload: PayloadT,
    policy: PolicyMetadata,
    provenance: ProvenanceEnvelope,
    version: str = "0.1.0",
    verification: Optional[VerificationEnvelope] = None,
    ext: Optional[Dict[str, Any]] = None,
) -> ContextContainer[PayloadT]:
    return ContextContainer(
        container_type=container_type,
        id=container_id,
        payload=payload,
        policy=policy,
        provenance=provenance,
        version=version,
        verification=verification,
        ext=ext or {},
    )
