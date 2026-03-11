import type { AcceptanceCriterion, AstroSpecBase, SpecField } from "./types.js";
import { stableStringify } from "./canonicalize.js";

export type SpecDiff = {
  fields: {
    added: string[];
    removed: string[];
    changed: Array<{ key: string; before: SpecField; after: SpecField }>;
  };
  acceptanceCriteria: {
    added: string[];
    removed: string[];
    changed: Array<{ id: string; before: AcceptanceCriterion; after: AcceptanceCriterion }>;
  };
  metaChanged: boolean;
  provenanceChanged: boolean;
};

function indexById(list: ReadonlyArray<AcceptanceCriterion> | undefined): Record<string, AcceptanceCriterion> {
  const out: Record<string, AcceptanceCriterion> = Object.create(null);
  for (const c of list || []) out[c.id] = c;
  return out;
}

export function diffSpecs(a: AstroSpecBase, b: AstroSpecBase): SpecDiff {
  const aFields = a.fields || {};
  const bFields = b.fields || {};

  const aKeys = new Set(Object.keys(aFields));
  const bKeys = new Set(Object.keys(bFields));

  const fieldsAdded = [...bKeys].filter(k => !aKeys.has(k)).sort();
  const fieldsRemoved = [...aKeys].filter(k => !bKeys.has(k)).sort();
  const fieldsChanged: Array<{ key: string; before: SpecField; after: SpecField }> = [];
  for (const k of [...aKeys].filter(k => bKeys.has(k))) {
    const before = aFields[k];
    const after = bFields[k];
    if (stableStringify(before) !== stableStringify(after)) {
      fieldsChanged.push({ key: k, before, after });
    }
  }

  const aCrit = indexById(a.acceptanceCriteria);
  const bCrit = indexById(b.acceptanceCriteria);
  const aCritIds = new Set(Object.keys(aCrit));
  const bCritIds = new Set(Object.keys(bCrit));

  const critAdded = [...bCritIds].filter(id => !aCritIds.has(id)).sort();
  const critRemoved = [...aCritIds].filter(id => !bCritIds.has(id)).sort();
  const critChanged: Array<{ id: string; before: AcceptanceCriterion; after: AcceptanceCriterion }> = [];
  for (const id of [...aCritIds].filter(id => bCritIds.has(id))) {
    const before = aCrit[id];
    const after = bCrit[id];
    if (stableStringify(before) !== stableStringify(after)) {
      critChanged.push({ id, before, after });
    }
  }

  const metaChanged = stableStringify(a.meta || {}) !== stableStringify(b.meta || {});
  const provenanceChanged = stableStringify(a.provenance || []) !== stableStringify(b.provenance || []);

  return {
    fields: {
      added: fieldsAdded,
      removed: fieldsRemoved,
      changed: fieldsChanged.sort((x, y) => x.key.localeCompare(y.key))
    },
    acceptanceCriteria: {
      added: critAdded,
      removed: critRemoved,
      changed: critChanged.sort((x, y) => x.id.localeCompare(y.id))
    },
    metaChanged,
    provenanceChanged
  };
}
