import type { AcceptanceCriterion, OpenSpecBase, SpecField } from "./types.js";
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
  for (const criterion of list || []) out[criterion.id] = criterion;
  return out;
}

export function diffSpecs(a: OpenSpecBase, b: OpenSpecBase): SpecDiff {
  const aFields = a.fields || {};
  const bFields = b.fields || {};

  const aKeys = new Set(Object.keys(aFields));
  const bKeys = new Set(Object.keys(bFields));

  const fieldsAdded = [...bKeys].filter((key) => !aKeys.has(key)).sort();
  const fieldsRemoved = [...aKeys].filter((key) => !bKeys.has(key)).sort();
  const fieldsChanged: Array<{ key: string; before: SpecField; after: SpecField }> = [];
  for (const key of [...aKeys].filter((candidateKey) => bKeys.has(candidateKey))) {
    const before = aFields[key];
    const after = bFields[key];
    if (stableStringify(before) !== stableStringify(after)) {
      fieldsChanged.push({ key, before, after });
    }
  }

  const aCriteria = indexById(a.acceptanceCriteria);
  const bCriteria = indexById(b.acceptanceCriteria);
  const aCriteriaIds = new Set(Object.keys(aCriteria));
  const bCriteriaIds = new Set(Object.keys(bCriteria));

  const criteriaAdded = [...bCriteriaIds].filter((id) => !aCriteriaIds.has(id)).sort();
  const criteriaRemoved = [...aCriteriaIds].filter((id) => !bCriteriaIds.has(id)).sort();
  const criteriaChanged: Array<{ id: string; before: AcceptanceCriterion; after: AcceptanceCriterion }> = [];
  for (const id of [...aCriteriaIds].filter((candidateId) => bCriteriaIds.has(candidateId))) {
    const before = aCriteria[id];
    const after = bCriteria[id];
    if (stableStringify(before) !== stableStringify(after)) {
      criteriaChanged.push({ id, before, after });
    }
  }

  const metaChanged = stableStringify(a.meta || {}) !== stableStringify(b.meta || {});
  const provenanceChanged = stableStringify(a.provenance || []) !== stableStringify(b.provenance || []);

  return {
    fields: {
      added: fieldsAdded,
      removed: fieldsRemoved,
      changed: fieldsChanged.sort((left, right) => left.key.localeCompare(right.key)),
    },
    acceptanceCriteria: {
      added: criteriaAdded,
      removed: criteriaRemoved,
      changed: criteriaChanged.sort((left, right) => left.id.localeCompare(right.id)),
    },
    metaChanged,
    provenanceChanged,
  };
}
