import type { AstroSpecContext, AstroSpecTurn, SpecField, FieldSource, JsonPatch } from "./types";

const PRECEDENCE_SCORE: Record<string, number> = {
  system: 7,
  user: 6,
  "turn-explicit": 6, // alias (not used directly)
  context: 5,
  memory: 4,
  preference: 4, // alias
  default: 3,
  model: 2,
  undefined: 1
};

function prec(source?: FieldSource | string): number {
  if (!source) return PRECEDENCE_SCORE.undefined;
  return PRECEDENCE_SCORE[source] != null ? PRECEDENCE_SCORE[source] : PRECEDENCE_SCORE.model;
}

function isObjectField(f: SpecField | undefined): f is SpecField & { type: "object" } {
  return !!f && f.type === "object";
}
function isArrayField(f: SpecField | undefined): f is SpecField & { type: "array" } {
  return !!f && f.type === "array";
}

function safeKey(v: any): string {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function mergeField(a?: SpecField, b?: SpecField): SpecField | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;

  const pa = prec(a.source);
  const pb = prec(b.source);
  const winner = pb >= pa ? b : a;
  const loser = pb >= pa ? a : b;

  if (winner.type !== loser.type) return winner;

  if (
    winner.type === "string" ||
    winner.type === "number" ||
    winner.type === "boolean" ||
    winner.type === "enum" ||
    winner.type === "any"
  ) {
    return winner;
  }

  if (isObjectField(winner) && isObjectField(loser)) {
    const wProps = winner.properties || {};
    const lProps = loser.properties || {};
    const mergedProps: Record<string, SpecField> = {};
    const keys = new Set([...Object.keys(wProps), ...Object.keys(lProps)]);
    for (const k of keys) {
      mergedProps[k] = mergeField(lProps[k], wProps[k]) as SpecField;
    }
    return {
      ...winner,
      properties: mergedProps
    };
  }

  if (isArrayField(winner) && isArrayField(loser)) {
    const mergeStrategy =
      winner.ext && typeof winner.ext["mergeStrategy"] === "string"
        ? String(winner.ext["mergeStrategy"])
        : "union";

    if (mergeStrategy === "replace") return winner;

    const wArr: any[] | undefined = Array.isArray((winner as any).value)
      ? (winner as any).value
      : Array.isArray((winner as any).default)
        ? (winner as any).default
        : undefined;
    const lArr: any[] | undefined = Array.isArray((loser as any).value)
      ? (loser as any).value
      : Array.isArray((loser as any).default)
        ? (loser as any).default
        : undefined;

    if (wArr && lArr) {
      const union: any[] = [];
      const seen: Record<string, true> = Object.create(null);
      for (const item of lArr) {
        const key = safeKey(item);
        if (!seen[key]) {
          seen[key] = true;
          union.push(item);
        }
      }
      for (const item of wArr) {
        const key = safeKey(item);
        if (!seen[key]) {
          seen[key] = true;
          union.push(item);
        }
      }

      const usesValue = Array.isArray((winner as any).value);
      return {
        ...winner,
        ...(usesValue ? { value: union } : { default: union })
      };
    }

    return winner;
  }

  return winner;
}

export function mergeContextIntoTurn(ctx: AstroSpecContext, turn: AstroSpecTurn): AstroSpecTurn {
  const merged: Record<string, SpecField> = {};
  const keys = new Set([...Object.keys(ctx.fields), ...Object.keys(turn.fields)]);
  for (const k of keys) {
    merged[k] = mergeField(ctx.fields[k], turn.fields[k]) as SpecField;
  }
  return { ...turn, fields: merged };
}

// Minimal JSON Pointer helpers for applyPatches
function decodePointerSegment(s: string): string {
  return s.replace(/~1/g, "/").replace(/~0/g, "~");
}

function splitPointer(path: string): string[] {
  const p = (path || "").trim();
  const noLeading = p.startsWith("/") ? p.slice(1) : p;
  if (!noLeading) return [];
  return noLeading.split("/").map(decodePointerSegment);
}

/**
 * Apply RFC6902-like patches to a fields object.
 *
 * Paths are JSON Pointers relative to the fields root.
 * Examples:
 * - "/tone/value"
 * - "/fields/tone/value" (legacy alias; leading "fields/" is ignored)
 * - "/preferences/properties/style/value" (nested object field)
 */
export function applyPatches(fields: Record<string, SpecField>, patches: JsonPatch[]): Record<string, SpecField> {
  const out: any = { ...fields };

  for (const p of patches || []) {
    const segments = splitPointer(p.path);
    const segs = segments[0] === "fields" ? segments.slice(1) : segments;
    if (segs.length === 0) continue;

    const last = segs[segs.length - 1];
    let target: any = out;

    // walk to parent
    for (let i = 0; i < segs.length - 1; i++) {
      const key = segs[i];
      if (target[key] == null || typeof target[key] !== "object") {
        // create intermediate container for add/replace to allow deep patching
        target[key] = {};
      }
      target = target[key];
    }

    if (p.op === "remove") {
      if (target && typeof target === "object") {
        delete target[last];
      }
    } else if (p.op === "add" || p.op === "replace") {
      if (target && typeof target === "object") {
        target[last] = p.value as any;
      }
    }
  }

  return out as Record<string, SpecField>;
}
