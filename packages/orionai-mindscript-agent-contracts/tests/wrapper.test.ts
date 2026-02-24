import test from 'node:test';
import assert from 'node:assert/strict';

import { validatePlanTurn } from '../src/index.ts';

test('compat wrapper exports validator API', () => {
  const out = validatePlanTurn({});
  assert.equal(out.ok, false);
});
