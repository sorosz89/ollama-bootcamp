import assert from "node:assert/strict";
import { test } from "node:test";
import { check, GLUTEN_RE, Recipe, targets } from "./chef.ts";

test("targets use the 4/4/9 rule", () => {
  assert.deepEqual(targets(600, 30, 40, 30), { protein_g: 45, carbs_g: 60, fat_g: 20 });
});

test("gluten regex", () => {
  assert.ok(GLUTEN_RE.test("whole wheat flour"));
  assert.ok(GLUTEN_RE.test("barley malt"));
  assert.ok(GLUTEN_RE.test("soy sauce"));
  assert.ok(!GLUTEN_RE.test("buckwheat groats"));
  assert.ok(!GLUTEN_RE.test("maltodextrin"));
  assert.ok(!GLUTEN_RE.test("tamari"));
});

const recipe = (...ingredients: Recipe["ingredients"]): Recipe =>
  Recipe.parse({ title: "t", servings: 2, steps: ["cook"], ingredients });

test("on-target recipe passes", () => {
  const r = recipe(
    { name: "Chicken breast", grams: 300, protein_g: 88, carbs_g: 0, fat_g: 8 },
    { name: "Rice", grams: 160, protein_g: 2, carbs_g: 120, fat_g: 1 },
    { name: "Olive oil", grams: 31, protein_g: 0, carbs_g: 0, fat_g: 31 },
  );
  const { problems, realKcal } = check(r, 600, targets(600, 30, 40, 30));
  assert.deepEqual(problems, []);
  assert.ok(realKcal >= 540 && realKcal <= 660);
});

test("gluten and calories are flagged", () => {
  const r = recipe({ name: "Couscous", grams: 100, protein_g: 4, carbs_g: 23, fat_g: 0 });
  const { problems } = check(r, 600, targets(600, 30, 40, 30));
  assert.ok(problems.some((p) => p.includes("gluten")));
  assert.ok(problems.some((p) => p.includes("kcal")));
});
