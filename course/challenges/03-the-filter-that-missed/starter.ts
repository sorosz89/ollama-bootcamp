/**
 * Challenge 02 — The filter that missed
 *
 * A real bug, found in this repo's own gluten filter. Fix it properly.
 * Run: node --test challenges/02-the-filter-that-missed/verify.ts
 */

/**
 * Reduce a model-written ingredient name to a form that can be matched
 * reliably. This is a matching key, not a display name.
 */
export function canonicalName(raw: string): string {
  throw new Error("not implemented — see challenges/index.html for the brief");
}

/**
 * Does this ingredient contain gluten?
 *
 * Trust an explicit gluten-free label: a product sold as "gluten-free
 * breadcrumbs" or "GF soy sauce" is not a gluten ingredient, and flagging it
 * sends the model off to fix something that was already correct.
 */
export function containsGluten(rawName: string): boolean {
  throw new Error("not implemented — see challenges/index.html for the brief");
}
