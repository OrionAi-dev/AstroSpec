import test from 'node:test';
import assert from 'node:assert/strict';

import { MINDSCRIPT_MCP_TOOL_NAMES } from '../src/index.ts';

test('compat wrapper exports MCP profile API', () => {
  assert.ok(Array.isArray(MINDSCRIPT_MCP_TOOL_NAMES));
  assert.ok(MINDSCRIPT_MCP_TOOL_NAMES.includes('mindscript.contract.validate'));
});
