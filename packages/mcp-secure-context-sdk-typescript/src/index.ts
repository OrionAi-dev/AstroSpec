import {
  callSecureContextTool,
  type SecureContextMcpResult,
  type SecureContextMcpToolName,
} from '@mcp-secure-context/mcp-adapter';
import {
  type ContextContainer,
  type ContainerType,
  type ContextPayloadMap,
  type PolicyMetadata,
  type ProvenanceEnvelope,
} from '@mcp-secure-context/core';
import { digestContextContainer, validateContextContainer } from '@mcp-secure-context/openspec';

export type {
  ContextContainer,
  ContainerType,
  ContextPayloadMap,
  KnowledgeObject,
  MemoryReference,
  PolicyMetadata,
  ProvenanceEnvelope,
  TaskState,
  UserContext,
  VerificationEnvelope,
} from '@mcp-secure-context/core';

export type {
  SecureContextMcpError,
  SecureContextMcpErrorCode,
  SecureContextMcpResource,
  SecureContextMcpResult,
  SecureContextMcpToolName,
  SecureContextMcpToolSpec,
} from '@mcp-secure-context/mcp-adapter';

type VerifyContainerResult = {
  containerId: string;
  digest: string;
  verification: ContextContainer['verification'] | null;
};

type ShareContainerResult = {
  containerId: string;
  uri: string;
  audience?: string[];
  expiresAt?: string | null;
};

export function createContextContainer<TType extends ContainerType>(input: {
  containerType: TType;
  id: string;
  version?: string;
  payload: ContextPayloadMap[TType];
  policy: PolicyMetadata;
  provenance: ProvenanceEnvelope;
  verification?: ContextContainer<ContextPayloadMap[TType]>['verification'];
  ext?: ContextContainer<ContextPayloadMap[TType]>['ext'];
}): ContextContainer<ContextPayloadMap[TType]> {
  return {
    schema: 'mcp-secure-context.container.v0.1',
    containerType: input.containerType,
    id: input.id,
    version: input.version ?? '0.1.0',
    payload: input.payload,
    policy: input.policy,
    provenance: input.provenance,
    ...(input.verification ? { verification: input.verification } : {}),
    ...(input.ext ? { ext: input.ext } : {}),
  };
}

export function validateContainer(payload: unknown) {
  return validateContextContainer(payload);
}

export { digestContextContainer };

export async function callSecureContext(
  name: SecureContextMcpToolName,
  args?: unknown,
): Promise<SecureContextMcpResult<unknown>> {
  return callSecureContextTool({ name, arguments: args });
}

export async function verifyContainer(
  container: ContextContainer,
): Promise<SecureContextMcpResult<VerifyContainerResult>> {
  return (await callSecureContextTool({
    name: 'mcp_secure_context.container.verify',
    arguments: { container },
  })) as SecureContextMcpResult<VerifyContainerResult>;
}

export async function shareContainer(
  container: ContextContainer,
): Promise<SecureContextMcpResult<ShareContainerResult>> {
  return (await callSecureContextTool({
    name: 'mcp_secure_context.container.share',
    arguments: { container },
  })) as SecureContextMcpResult<ShareContainerResult>;
}
