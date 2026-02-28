import type { JsonValue,  } from '@astrospec/openspec-types';

/* ---------- Branded IDs ---------- */
export type AudioId = string & { readonly __brand: 'AudioId' };
export type TranscriptId = string & { readonly __brand: 'TranscriptId' };
export type LanguageTag = string & { readonly __brand: 'LanguageTag' };

/* ---------- Core Types ---------- */
export type AudioInput =
  | { kind: 'path'; path: string; mime?: string }
  | { kind: 'bytes'; bytes: Uint8Array; filename: string; mime?: string };

export interface TranscriptionOptions {
  model?: string;
  language?: LanguageTag;
  temperature?: number;
  ext?: Record<string, JsonValue>;
}

export interface Transcript {
  id: TranscriptId;
  audioId?: AudioId;
  text: string;
  language?: LanguageTag;
  createdAt: string;

  rawRef?: {
    kind: string;
    ref: string;
    checksum?: string;
  };

  confidence?: number;
  rationale?: string;
  ext?: Record<string, JsonValue>;
}

/* ---------- PURE NORMALIZER (NO I/O) ---------- */
export function buildTranscriptionRequest(
  audio: AudioInput,
  options: TranscriptionOptions = {}
) {
  return {
    model: options.model ?? 'gpt-4o-mini-transcribe',
    language: options.language,
    temperature: options.temperature ?? 0,
    audio,
    options,
  };
}

/* ---------- Adapter Interface ---------- */
export interface AudioTranscriptionAdapter {
  id: string;
  transcribe(
    audio: AudioInput,
    options?: TranscriptionOptions
  ): Promise<Transcript>;
}

/* ---------- OpenAI Adapter (runtime I/O lives here) ---------- */
export class OpenAITranscriptionAdapter implements AudioTranscriptionAdapter {
  readonly id = 'openai.transcription';

  async transcribe(audio: AudioInput, options?: TranscriptionOptions): Promise<Transcript> {
    const req = buildTranscriptionRequest(audio, options);

    // NOTE: actual OpenAI call intentionally omitted here
    // This adapter is interface-stable and testable without network access

    return {
      id: makeTranscriptId('mock-transcript'),
      text: '[mock transcription]',
      language: req.language,
      createdAt: makeISODateTime(new Date().toISOString()),
    };
  }
}

/* ---------- Helpers ---------- */
export function makeISODateTime(s: string): string {
  return s as string;
}


export function makeAudioId(s: string): AudioId {
  return s as AudioId;
}
export function makeTranscriptId(s: string): TranscriptId {
  return s as TranscriptId;
}
export function makeLanguageTag(s: string): LanguageTag {
  return s as LanguageTag;
}
