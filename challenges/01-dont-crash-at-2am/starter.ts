/**
 * Challenge 01 — Don't crash at 2am
 *
 * Implement `decide`. Run `node --test challenges/01-dont-crash-at-2am/verify.ts`
 * until it passes. Read verify.ts only if you get stuck: the brief is the spec.
 */

export type ModelReply = {
  /** "stop" | "length" | "unload" — how generation ended. */
  done_reason: string;
  /** The raw text of the reply. May be truncated. */
  content: string;
};

export type Decision =
  | { action: "parse" }
  | { action: "retry"; cap: number; why: string }
  | { action: "give-up"; why: string };

/** Never ask for more than this many tokens, whatever happens. */
export const HARD_CAP = 4096;

export function decide(
  reply: ModelReply,
  cap: number,
  attempt: number,
  maxAttempts: number,
): Decision {
  throw new Error("not implemented — see challenges/index.html for the brief");
}
