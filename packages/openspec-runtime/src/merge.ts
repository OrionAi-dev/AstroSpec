// AstroSpec Merge
// Merge AstroSpec.Context into AstroSpec.Turn with precedence and safe deep merge.
// ES5-compatible (no Map/Set/Promise).

import { AstroSpecContext, AstroSpecTurn, SpecField } from '@astrospec/openspec-types';

/**
 * Source precedence (highest wins on conflict).
 * user > turn-explicit > context > preference(memory) > default > model
 * Note: "turn-explicit" is represented by source === "user" or explicit turn field.
 * If a field has no source, treat as "model".
 */
const PRECEDENCE_SCORE: { [k: string]: number } = {
  user: 6,
  "turn-explicit": 6, // alias (not used directly)
  context: 5,
  memory: 4,
  preference: 4, // alias
  default: 3,
  model: 2,
  undefined: 1
};

/** Get numeric precedence score for a field's `source` */
function prec(source?: string): number {
  if (!source) return PRECEDENCE_SCORE.undefined;
  return PRECEDENCE_SCORE[source] != null ? PRECEDENCE_SCORE[source] : PRECEDENCE_SCORE.model;
}

/** Narrowing helpers */
function isObjectField(f: SpecField | undefined): f is SpecField & { type: "object" } {
  return !!f && f.type === "object";
}
function isArrayField(f: SpecField | undefined): f is SpecField & { type: "array" } {
  return !!f && f.type === "array";
}

/**
 * Merge two SpecField values according to precedence, with deep merge for object/array fields.
 * The field with the higher precedence "drives" the type/shape; where possible we merge sub-parts.
 */
function mergeField(a?: SpecField, b?: SpecField): SpecField | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;

  // Determine winner by precedence (higher wins). If equal, prefer `b` (turn) over `a` (context).
  var pa = prec(a.source);
  var pb = prec(b.source);
  var winner = pb >= pa ? b : a;
  var loser  = pb >= pa ? a : b;

  // If types differ, take winner whole.
  if (winner.type !== loser.type) return winner;

  // For primitives / enum / any, take winner (value/default already reflect the higher-precedence choice).
  if (winner.type === "string" || winner.type === "number" || winner.type === "boolean" || winner.type === "enum" || winner.type === "any") {
    return winner;
  }

  // Object: deep merge properties (by key). Winner's metadata stays.
  if (isObjectField(winner) && isObjectField(loser)) {
    var wProps = winner.properties || {};
    var lProps = loser.properties || {};
    var mergedProps: { [k: string]: SpecField } = {};

    // union of keys
    var seen: { [k: string]: boolean } = Object.create(null);
    var k: string;
    for (k in wProps) { seen[k] = true; }
    for (k in lProps) { seen[k] = true; }

    for (k in seen) {
      mergedProps[k] = mergeField(lProps[k], wProps[k]) as SpecField; // winner perspective last
    }

    // return winner with merged properties
    return {
      ...winner,
      properties: mergedProps
    };
  }

  // Array: union dedupe unless mergeStrategy:"replace" is set on the higher-precedence field (via ext.mergeStrategy)
  if (isArrayField(winner) && isArrayField(loser)) {
    var mergeStrategy =
      winner.ext && typeof winner.ext["mergeStrategy"] === "string"
        ? String(winner.ext["mergeStrategy"])
        : "union";

    if (mergeStrategy === "replace") {
      return winner; // take higher precedence array as-is
    }

    // Attempt to merge array "default" values if present; SpecField arrays can also use "value" when locked.
    // We'll prefer merging "value" arrays if both are arrays; fall back to "default".
    var wArr: any[] | undefined = Array.isArray((winner as any).value) ? (winner as any).value : (Array.isArray((winner as any).default) ? (winner as any).default : undefined);
    var lArr: any[] | undefined = Array.isArray((loser  as any).value) ? (loser  as any).value : (Array.isArray((loser  as any).default) ? (loser  as any).default : undefined);

    if (wArr && lArr) {
      var union: any[] = [];
      var seenKeys: { [k: string]: boolean } = Object.create(null);

      // append loser then winner so winner can override ordering semantics slightly
      var i: number, item: any, key: string;
      for (i = 0; i < lArr.length; i++) {
        item = lArr[i]; key = safeKey(item);
        if (!seenKeys[key]) { seenKeys[key] = true; union.push(item); }
      }
      for (i = 0; i < wArr.length; i++) {
        item = wArr[i]; key = safeKey(item);
        if (!seenKeys[key]) { seenKeys[key] = true; union.push(item); }
      }

      // place back into whichever slot was used by winner (value > default)
      var usesValue = Array.isArray((winner as any).value);
      return {
        ...winner,
        ...(usesValue ? { value: union } : { default: union })
      };
    }

    // If only winner has array payload, keep it; otherwise just return winner shape.
    return winner;
  }

  // Fallback: types same but not handled specially -> prefer winner entirely
  return winner;
}

/** Create a stable dedupe key for unioning array items */
function safeKey(v: any): string {
  try { return JSON.stringify(v); } catch { return String(v); }
}

/**
 * Merge Context fields into Turn fields (top level), applying precedence per field.
 * - If a key exists only in Context → include it.
 * - If in both → resolve via mergeField (deep merge + precedence).
 */
export function mergeContextIntoTurn(
  ctx: AstroSpecContext,
  turn: AstroSpecTurn
): AstroSpecTurn {
  var merged: { [k: string]: SpecField } = {};

  // union of keys
  var seen: { [k: string]: boolean } = Object.create(null);
  var k: string;
  for (k in ctx.fields) { seen[k] = true; }
  for (k in turn.fields) { seen[k] = true; }

  for (k in seen) {
    merged[k] = mergeField(ctx.fields[k], turn.fields[k]) as SpecField;
  }

  return { ...turn, fields: merged };
}

/**
 * Apply RFC6902-like patches to a flat fields object.
 * Supported paths (flat): "/fields/<key>"
 * Supported ops: add | replace | remove
 */
export function applyPatches(
  fields: { [k: string]: SpecField },
  patches: { op: "add" | "replace" | "remove"; path: string; value?: any }[]
): { [k: string]: SpecField } {
  var out: { [k: string]: SpecField } = { ...fields };

  for (var i = 0; i < patches.length; i++) {
    var p = patches[i];
    var path = (p.path || "").replace(/^\//, ""); // strip leading slash
    // allow either "/fields/key" or just "/key"
    var key = path.indexOf("fields/") === 0 ? path.slice("fields/".length) : path;

    if (!key) continue;

    if (p.op === "remove") {
      delete out[key];
    } else if (p.op === "add" || p.op === "replace") {
      if (p.value) {
        out[key] = p.value as SpecField;
      }
    }
  }

  return out;
}
