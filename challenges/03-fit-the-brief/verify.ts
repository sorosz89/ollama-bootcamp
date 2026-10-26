import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "zod";
import { BriefedRecipe } from "./starter.ts";

type Node = { type?: string; properties?: Record<string, Node>; items?: Node; enum?: unknown[];
              anyOf?: Node[]; required?: string[] };

const schema = z.toJSONSchema(BriefedRecipe) as Node;

function depth(n: Node | undefined): number {
  if (!n) return 0;
  if (n.properties) return 1 + Math.max(0, ...Object.values(n.properties).map(depth));
  if (n.items) return depth(n.items);
  if (n.anyOf) return Math.max(0, ...n.anyOf.map(depth));
  return 0;
}
function leaves(n: Node | undefined): number {
  if (!n) return 0;
  if (n.properties) return Object.values(n.properties).reduce((t, c) => t + leaves(c), 0);
  if (n.items) return leaves(n.items);
  return 1;
}
const props = schema.properties ?? {};
const has = (name: string) => Object.prototype.hasOwnProperty.call(props, name);
const names = Object.keys(props).map((k) => k.toLowerCase());

test("it still carries what the exercise already had", () => {
  for (const f of ["title", "servings", "ingredients", "steps"]) {
    assert.ok(has(f), `missing existing field: ${f}`);
  }
  assert.equal(props["ingredients"]?.type, "array", "ingredients must stay a list");
  assert.equal(props["steps"]?.type, "array", "steps must stay a list");
});

test("it carries the six new things the brief asked for", () => {
  for (const f of ["cuisine", "difficulty", "prepMinutes", "cookMinutes", "allergens", "equipment"]) {
    assert.ok(has(f), `the brief asked for: ${f}`);
  }
});

test("the three categorical fields are enums, not free text", () => {
  for (const f of ["cuisine", "difficulty"]) {
    assert.ok(props[f]?.enum, `${f} comes from a known set — make it an enum`);
  }
  const allergens = props["allergens"];
  assert.equal(allergens?.type, "array", "allergens is a list");
  assert.ok(allergens?.items?.enum, "allergen entries come from a known set — enum the items");
});

test("nothing derivable is asked of the model", () => {
  for (const banned of ["totalminutes", "ingredientcount", "stepcount", "caloriesperserving", "iseasy"]) {
    assert.ok(!names.includes(banned),
      `${banned} is derivable in code — asking the model for it buys a chance of it being wrong`);
  }
});

test("it stays shallow: depth of 2 or less", () => {
  const d = depth(schema);
  assert.ok(d <= 2, `nesting depth is ${d}; the budget is 2`);
});

test("it stays small: 16 leaf fields or fewer", () => {
  const n = leaves(schema);
  assert.ok(n <= 16, `${n} leaf fields; the budget is 16. Every one is tokens, and tokens are seconds.`);
});

test("the schema actually validates a plausible recipe", () => {
  const sample = {
    title: "Chicken traybake", servings: 2,
    ingredients: [{ name: "chicken thigh", grams: 300 }],
    steps: ["Roast for 35 minutes."],
    cuisine: (props["cuisine"]?.enum ?? [])[0],
    difficulty: (props["difficulty"]?.enum ?? [])[0],
    prepMinutes: 10, cookMinutes: 35,
    allergens: [], equipment: ["oven"],
  };
  const result = BriefedRecipe.safeParse(sample);
  assert.ok(result.success,
    `a plausible recipe failed your schema:\n${result.success ? "" : JSON.stringify(result.error.issues, null, 2)}`);

  // Parsing "succeeding" is not enough: an object schema silently drops keys it
  // does not declare, so check the data actually survived the round trip.
  const parsed = result.data as Record<string, unknown>;
  for (const f of ["title", "servings", "ingredients", "steps",
                   "cuisine", "difficulty", "prepMinutes", "cookMinutes", "allergens", "equipment"]) {
    assert.ok(f in parsed, `${f} was dropped on parse — your schema does not declare it`);
  }
});
