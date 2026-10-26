/**
 * Challenge 03 — Fit the brief in the budget
 *
 * Product wants six new things on a recipe. You have a latency budget.
 * Design the schema. Run: node --test challenges/03-fit-the-brief/verify.ts
 */
import { z } from "zod";

/**
 * Replace this with your design. It must carry everything the brief asks for
 * while staying cheap enough to generate — see challenges/index.html.
 */
export const BriefedRecipe = z.object({
  title: z.string(),
});

export type BriefedRecipe = z.infer<typeof BriefedRecipe>;
