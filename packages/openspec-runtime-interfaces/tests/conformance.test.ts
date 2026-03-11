import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateRuntimeInterfaceDescriptor } from '../src/index.js';

const conformanceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'conformance',
  'runtime-interfaces',
);

function readFixture(name: string) {
  return JSON.parse(fs.readFileSync(path.join(conformanceDir, name), 'utf8'));
}

test('conformance fixtures: valid payloads pass', () => {
  assert.equal(validateRuntimeInterfaceDescriptor(readFixture('runtime-interface-descriptor.valid.json')).ok, true);
});

test('conformance fixtures: invalid payloads fail deterministically', () => {
  const invalidDescriptor = validateRuntimeInterfaceDescriptor(
    readFixture('runtime-interface-descriptor.invalid.bad-interface-kind.json'),
  );
  assert.equal(invalidDescriptor.ok, false);
  assert.ok(invalidDescriptor.issues.some((issue) => issue.code === 'SCHEMA_ENUM'));
});
