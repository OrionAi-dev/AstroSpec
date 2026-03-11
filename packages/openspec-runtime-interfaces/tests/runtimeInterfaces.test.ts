import test from 'node:test';
import assert from 'node:assert/strict';

import { validateRuntimeInterfaceDescriptor } from '../src/index.js';

test('valid runtime interface descriptor passes', () => {
  const descriptor = {
    descriptorId: 'descriptor_1',
    name: 'Local Starburst Adapter',
    interfaceKind: 'reasoning-runtime-adapter',
    version: '0.1.0',
    capabilities: ['local-execution'],
  };

  assert.equal(validateRuntimeInterfaceDescriptor(descriptor).ok, true);
});

test('invalid runtime interface descriptor fails deterministically', () => {
  const validation = validateRuntimeInterfaceDescriptor({
    descriptorId: 'descriptor_2',
    interfaceKind: 'not-valid',
    version: '0.1.0',
  });

  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((issue) => issue.code === 'SCHEMA_REQUIRED' || issue.code === 'SCHEMA_ENUM'));
});
