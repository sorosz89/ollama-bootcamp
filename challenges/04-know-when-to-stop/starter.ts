/**
 * Challenge 04 — Know when to stop
 *
 * Run: node --test challenges/04-know-when-to-stop/verify.ts
 */

/** Minimum relative improvement that counts as progress. */
export const MIN_IMPROVEMENT = 0.05;

/**
 * Given how far from target each attempt landed, oldest first, decide whether
 * another attempt is worth making. 0 means the target was hit exactly.
 */
export function shouldContinue(distances: number[], maxAttempts: number): boolean {
  throw new Error("not implemented — see challenges/index.html for the brief");
}
