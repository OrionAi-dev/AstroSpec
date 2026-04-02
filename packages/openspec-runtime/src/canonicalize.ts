import type { AcceptanceCriterion, OpenSpecBase, ProvenanceEntry } from "./types";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function sortObjectKeys(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o).sort()) {
    out[k] = canonicalizeValue(o[k]);
  }
  return out;
}

function sortAcceptanceCriteria(list: AcceptanceCriterion[]): AcceptanceCriterion[] {
  return [...list].sort((a, b) => (a.id || "").localeCompare(b.id || ""));
}

function sortProvenance(list: ProvenanceEntry[]): ProvenanceEntry[] {
  return [...list].sort((a, b) => {
    const atCmp = String(a.at || "").localeCompare(String(b.at || ""));
    if (atCmp !== 0) return atCmp;
    const fieldCmp = String(a.field || "").localeCompare(String(b.field || ""));
    if (fieldCmp !== 0) return fieldCmp;
    return String(a.source || "").localeCompare(String(b.source || ""));
  });
}

export function canonicalizeValue(v: unknown): unknown {
  if (Array.isArray(v)) {
    return v.map(canonicalizeValue);
  }
  if (isPlainObject(v)) {
    return sortObjectKeys(v);
  }
  return v;
}

/**
 * Canonicalize a OpenSpec spec for deterministic hashing:
 * - sort object keys recursively
 * - sort `fields` keys
 * - sort `acceptanceCriteria` by criterion id
 * - sort `provenance` by (at, field, source)
 */
export function canonicalizeSpec<T extends OpenSpecBase>(spec: T): T {
  const out: any = canonicalizeValue(spec);

  if (out && typeof out === "object") {
    if (out.fields && typeof out.fields === "object" && !Array.isArray(out.fields)) {
      out.fields = sortObjectKeys(out.fields);
    }
    if (Array.isArray(out.acceptanceCriteria)) {
      out.acceptanceCriteria = sortAcceptanceCriteria(out.acceptanceCriteria).map(canonicalizeValue);
    }
    if (Array.isArray(out.provenance)) {
      out.provenance = sortProvenance(out.provenance).map(canonicalizeValue);
    }
  }

  return out as T;
}

export function stableStringify(v: unknown): string {
  return JSON.stringify(canonicalizeValue(v));
}

