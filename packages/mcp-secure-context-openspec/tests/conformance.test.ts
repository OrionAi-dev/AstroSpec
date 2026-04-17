import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateContextContainer } from '../src/index.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

const fixtures = [
  'conformance/core/task-state.workflow.valid.json',
  'conformance/core/knowledge-object.artifact.valid.json',
  'conformance/core/knowledge-object.decision-summary.valid.json',
];

for (const fixturePath of fixtures) {
  test(`conformance fixture validates: ${fixturePath}`, () => {
    const fixture = JSON.parse(fs.readFileSync(path.join(repoRoot, fixturePath), 'utf8'));
    const result = validateContextContainer(fixture);
    assert.equal(result.ok, true);
  });
}
