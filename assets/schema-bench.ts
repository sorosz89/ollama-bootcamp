/**
 * Compare how a model copes with differently-shaped schemas for the same task.
 * Used by Lesson 05.  node assets/schema-bench.ts
 */
import ollama from "ollama";
import { z } from "zod";

const MODEL = process.argv.includes("--model")
  ? (process.argv[process.argv.indexOf("--model") + 1] ?? "qwen3.5:9b")
  : "qwen3.5:9b";

const PROMPT = "A gluten-free chicken traybake for two people. Return as JSON.";

const flat = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

const enumish = z.object({
  title: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  meal: z.enum(["breakfast", "lunch", "dinner"]),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
});

const nested = z.object({
  recipe: z.object({
    meta: z.object({ title: z.string(), servings: z.int(), difficulty: z.string() }),
    components: z.array(z.object({
      component: z.string(),
      items: z.array(z.object({
        name: z.string(),
        quantity: z.object({ amount: z.number(), unit: z.string() }),
        macros: z.object({ protein_g: z.number(), carbs_g: z.number(), fat_g: z.number() }),
      })),
    })),
    method: z.array(z.object({ stage: z.string(), instruction: z.string(), minutes: z.int() })),
  }),
});

const cases: [string, z.ZodType][] = [["flat", flat], ["flat + enums", enumish], ["deeply nested", nested]];

console.log(`\n${MODEL} · same request, three schema shapes\n`);
for (const [name, schema] of cases) {
  const t0 = Date.now();
  let ok = "parsed", tokens = 0, rate = 0;
  try {
    const res = await ollama.chat({
      model: MODEL,
      messages: [{ role: "user", content: PROMPT }],
      format: z.toJSONSchema(schema),
      options: { temperature: 0.2, num_predict: 1200 },
      think: false,
    });
    tokens = res.eval_count ?? 0;
    rate = tokens / ((res.eval_duration ?? 1) / 1e9);
    if (res.done_reason === "length") ok = "TRUNCATED (hit num_predict)";
    else schema.parse(JSON.parse(res.message.content));
  } catch (e) {
    ok = "FAILED: " + (e as Error).message.slice(0, 40);
  }
  console.log(
    `  ${name.padEnd(14)} ${String(tokens).padStart(5)} tok · ` +
    `${rate.toFixed(1).padStart(5)} tok/s · ${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s · ${ok}`,
  );
}
console.log();
