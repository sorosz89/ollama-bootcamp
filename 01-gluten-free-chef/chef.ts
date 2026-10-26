/** Gluten-free recipe chat: the LLM writes, TypeScript checks. */
import { createInterface } from "node:readline/promises";
import ollama from "ollama";
import { z } from "zod";

export const MODEL = "qwen3.5:9b";

const GLUTEN = ["wheat", "barley", "rye", "spelt", "malt", "semolina", "couscous",
  "bulgur", "farro", "seitan", "breadcrumb", "soy sauce", "flour tortilla"];
export const GLUTEN_RE = new RegExp(`\\b(${GLUTEN.join("|")})s?\\b`); // \b: buckwheat is OK

const Ingredient = z.object({
  name: z.string(),
  grams: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
});

export const Recipe = z.object({
  title: z.string(),
  servings: z.int().positive(),
  ingredients: z.array(Ingredient),
  steps: z.array(z.string()),
});
export type Recipe = z.infer<typeof Recipe>;

export type Macros = { protein_g: number; carbs_g: number; fat_g: number };

export function targets(kcal: number, pPct: number, cPct: number, fPct: number): Macros {
  return {
    protein_g: (kcal * pPct) / 100 / 4,
    carbs_g: (kcal * cPct) / 100 / 4,
    fat_g: (kcal * fPct) / 100 / 9,
  };
}

export function check(r: Recipe, kcal: number, goal: Macros, tol = 0.1) {
  const problems: string[] = [];
  for (const i of r.ingredients) {
    if (GLUTEN_RE.test(i.name.toLowerCase())) {
      problems.push(`'${i.name}' may contain gluten; replace it.`);
    }
  }
  const sum = (k: keyof Macros) =>
    r.ingredients.reduce((t, i) => t + i[k], 0) / r.servings;
  const tot: Macros = { protein_g: sum("protein_g"), carbs_g: sum("carbs_g"), fat_g: sum("fat_g") };
  const realKcal = 4 * tot.protein_g + 4 * tot.carbs_g + 9 * tot.fat_g;
  if (Math.abs(realKcal - kcal) > tol * kcal) {
    problems.push(`Per serving is ${realKcal.toFixed(0)} kcal, target ${kcal}.`);
  }
  for (const k of Object.keys(goal) as (keyof Macros)[]) {
    if (Math.abs(tot[k] - goal[k]) > Math.max(5, tol * goal[k])) {
      problems.push(`${k} per serving is ${tot[k].toFixed(0)} g, target ${goal[k].toFixed(0)} g.`);
    }
  }
  return { problems, tot, realKcal };
}

const SYSTEM = "You are a strict gluten-free chef. Never use wheat, barley, rye, spelt, " +
  "malt or regular oats. Give realistic per-ingredient macros for the gram " +
  "amounts you list. Answer only in the requested JSON.";

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const kcal = Number(await rl.question("Calories per serving [600]: ") || 600);
  const split = (await rl.question("Protein/Carbs/Fat % [30/40/30]: ")) || "30/40/30";
  const [p, c, f] = split.split("/").map(Number) as [number, number, number];
  const goal = targets(kcal, p, c, f);
  const history: { role: string; content: string }[] = [{ role: "system", content: SYSTEM }];

  let wish: string;
  while ((wish = await rl.question("\nWhat do you feel like? (empty = quit) > "))) {
    history.push({ role: "user", content:
      `${wish}. Per serving: ${kcal} kcal, protein ${goal.protein_g.toFixed(0)} g, ` +
      `carbs ${goal.carbs_g.toFixed(0)} g, fat ${goal.fat_g.toFixed(0)} g.` });

    let recipe!: Recipe, problems: string[] = [], tot!: Macros, realKcal!: number;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await ollama.chat({
        model: MODEL,
        messages: history,
        format: z.toJSONSchema(Recipe),
        options: { temperature: 0.3 },
        think: false,
      });
      recipe = Recipe.parse(JSON.parse(res.message.content));
      history.push({ role: "assistant", content: res.message.content });
      ({ problems, tot, realKcal } = check(recipe, kcal, goal));
      if (problems.length === 0) break;
      console.log(`  attempt ${attempt}: fixing -> ${problems.join("; ")}`);
      history.push({ role: "user", content: "Revise the recipe. Problems: " + problems.join(" ") });
    }

    console.log(`\n${recipe.title} (${recipe.servings} servings)`);
    for (const i of recipe.ingredients) console.log(`  - ${i.grams.toFixed(0)} g ${i.name}`);
    recipe.steps.forEach((s, n) => console.log(`  ${n + 1}. ${s}`));
    console.log(
      `Per serving: ${realKcal.toFixed(0)} kcal | P ${tot.protein_g.toFixed(0)} g ` +
      `C ${tot.carbs_g.toFixed(0)} g F ${tot.fat_g.toFixed(0)} g` +
      (problems.length ? "  (still off target)" : ""),
    );
  }
  rl.close();
}

if (import.meta.main) await main();
