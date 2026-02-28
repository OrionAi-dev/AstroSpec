// AstroSpec verify (ES5-compatible)
// Synchronous acceptance-criteria checking (no Promise, no Map/Set).

import { AcceptanceCriterion } from '@astrospec/openspec-types';

// Result type for each verifier
export interface VerifierResult {
  pass: boolean;
  details?: string;
}

// Contract for verifiers (sync only in this ES5-compat build)
export interface VerifierFn {
  (output: unknown, params?: Record<string, unknown>): VerifierResult;
}

// Simple in-memory registry (plain object for ES5)
const registry: { [key: string]: VerifierFn } = Object.create(null);

/**
 * Register a new verifier function (sync).
 */
export function registerVerifier(id: string, fn: VerifierFn): void {
  registry[id] = fn;
}

/**
 * Run all acceptance criteria against an output (sync).
 * If a verifier returns something that looks like a Promise/thenable,
 * we mark it unsupported in this ES5 build.
 */
export function verifyOutput(
  output: unknown,
  criteria: AcceptanceCriterion[]
): VerifierResult[] {
  var results: VerifierResult[] = [];

  for (var i = 0; i < criteria.length; i++) {
    var c = criteria[i];
    var verifier = registry[c.verifier];

    if (!verifier) {
      results.push({
        pass: false,
        details: 'No verifier registered for "' + c.verifier + '"'
      });
      continue;
    }

    try {
      var res = (verifier as any)(output, c.params);

      // Detect thenable without depending on Promise type
      if (res && typeof res === "object" && typeof (res as any).then === "function") {
        results.push({
          pass: false,
          details:
            'Verifier "' +
            c.verifier +
            '" returned a thenable, but async verifiers are not supported in this ES5 build.'
        });
      } else {
        results.push(res as VerifierResult);
      }
    } catch (err) {
      results.push({
        pass: false,
        details:
          'Verifier "' + c.verifier + '" threw: ' + (err && (err as any).message ? (err as any).message : String(err))
      });
    }
  }

  return results;
}

/* ------------------------------------------------------------------ */
/* Built-in synchronous verifiers                                     */
/* ------------------------------------------------------------------ */

/**
 * tool_success
 * Expect an object with { status: "ok" }.
 */
registerVerifier("tool_success", function (output: any): VerifierResult {
  if (output && typeof output === "object" && "status" in output) {
    return { pass: output.status === "ok" };
  }
  return { pass: false, details: "No status field" };
});

/**
 * latency_under
 * Expect an object with { latencyMs: number } and params { max: number }.
 */
registerVerifier("latency_under", function (
  output: any,
  params?: Record<string, unknown>
): VerifierResult {
  var max = params && typeof params["max"] === "number" ? (params["max"] as number) : undefined;
  if (typeof max !== "number") {
    return { pass: false, details: "Missing numeric param: max" };
  }
  if (output && typeof output === "object" && "latencyMs" in output) {
    return { pass: (output as any).latencyMs <= max, details: "latencyMs=" + String((output as any).latencyMs) };
  }
  return { pass: false, details: "No latencyMs field" };
});

/**
 * count_between
 * Output should be an array; enforce length within [min, max] inclusive.
 * params: { min?: number, max?: number }
 */
registerVerifier("count_between", function (output: unknown, params?: Record<string, unknown>): VerifierResult {
  var arr = Array.isArray(output) ? (output as any[]) : [];
  var min = params && typeof params["min"] === "number" ? (params["min"] as number) : -Infinity;
  var max = params && typeof params["max"] === "number" ? (params["max"] as number) : +Infinity;
  var ok = arr.length >= min && arr.length <= max;
  return { pass: ok, details: "length=" + arr.length + ", min=" + String(min) + ", max=" + String(max) };
});

/**
 * contains_fields
 * Each array item must contain all provided field names (top-level only in this ES5 build).
 * params: { fields: string[] }
 */
registerVerifier("contains_fields", function (
  output: unknown,
  params?: Record<string, unknown>
): VerifierResult {
  var fields = (params && Array.isArray(params["fields"]) ? (params["fields"] as string[]) : []) as string[];
  if (!fields.length) return { pass: false, details: "params.fields is required" };

  var arr = Array.isArray(output) ? (output as any[]) : [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (!item || typeof item !== "object") {
      return { pass: false, details: "Item at index " + i + " is not an object" };
    }
    for (var j = 0; j < fields.length; j++) {
      var f = fields[j];
      if (!(f in (item as any))) {
        return { pass: false, details: 'Missing field "' + f + '" at index ' + i };
      }
    }
  }
  return { pass: true, details: "All items contain: " + fields.join(", ") };
});

/**
 * sorted_by
 * Ensures array of records is sorted by a top-level field (asc/desc).
 * params: { field: string, order?: "asc" | "desc" }
 */
registerVerifier("sorted_by", function (output: unknown, params?: Record<string, unknown>): VerifierResult {
  var arr = Array.isArray(output) ? (output as any[]) : [];
  var field = params && typeof params["field"] === "string" ? (params["field"] as string) : "";
  var order = params && params["order"] === "desc" ? "desc" : "asc";
  if (!field) return { pass: false, details: "params.field is required" };
  if (arr.length <= 1) return { pass: true, details: "≤1 item is trivially sorted" };

  for (var i = 1; i < arr.length; i++) {
    var prev = arr[i - 1] && typeof arr[i - 1] === "object" ? (arr[i - 1] as any)[field] : undefined;
    var curr = arr[i] && typeof arr[i] === "object" ? (arr[i] as any)[field] : undefined;
    if (prev === undefined || curr === undefined) {
      return { pass: false, details: 'Missing field "' + field + '" at index ' + (i - 1) + " or " + i };
    }
    var cmp = prev < curr ? -1 : prev > curr ? 1 : 0;
    var ok = order === "asc" ? cmp <= 0 : cmp >= 0;
    if (!ok) {
      return {
        pass: false,
        details:
          "Order violation at index " +
          i +
          ": " +
          String(prev) +
          " -> " +
          String(curr) +
          " (" +
          order +
          ")"
      };
    }
  }
  return { pass: true, details: 'Sorted by "' + field + '" (' + order + ")." };
});

/**
 * unique_by
 * Ensures items are unique by a top-level field.
 * params: { field: string }
 */
registerVerifier("unique_by", function (output: unknown, params?: Record<string, unknown>): VerifierResult {
  var arr = Array.isArray(output) ? (output as any[]) : [];
  var field = params && typeof params["field"] === "string" ? (params["field"] as string) : "";
  if (!field) return { pass: false, details: "params.field is required" };

  // ES5-friendly uniqueness checking without Set
  var seen: { [key: string]: boolean } = Object.create(null);
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i] && typeof arr[i] === "object" ? (arr[i] as any)[field] : undefined;
    var key = JSON.stringify(item);
    if (seen[key]) {
      return { pass: false, details: 'Duplicate at index ' + i + ' for field "' + field + '"' };
    }
    seen[key] = true;
  }
  return { pass: true, details: 'Unique by "' + field + '".' };
});
