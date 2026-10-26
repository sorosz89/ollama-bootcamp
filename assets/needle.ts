/**
 * Needle-in-a-haystack: does the model still find a fact buried in a long prompt,
 * and does it matter *where* the fact sits? Used by Lesson 06.
 *
 *   node assets/needle.ts                      # 3 positions at ~8k tokens
 *   node assets/needle.ts --tokens 20000       # deeper haystack (slow)
 */
import ollama from "ollama";

const FILLER = "The kitchen scale sat beside the chopping board, quietly waiting. ";
const TOKENS_PER_UNIT = 12; // measured: ~7250 tokens per 600 units
const NEEDLE = "The secret ingredient in the house dressing is toasted pumpkin seed oil.";
const QUESTION = "What is the secret ingredient in the house dressing? Answer in under ten words.";

type Result = { depth: number; found: boolean; promptTokens: number; prefillSeconds: number };

export async function needle(totalTokens: number, depths: number[], model: string): Promise<Result[]> {
  const units = Math.round(totalTokens / TOKENS_PER_UNIT);
  const out: Result[] = [];

  for (const depth of depths) {
    const before = FILLER.repeat(Math.round(units * depth));
    const after = FILLER.repeat(units - Math.round(units * depth));
    const res = await ollama.chat({
      model,
      messages: [{ role: "user", content: `${before}\n${NEEDLE}\n${after}\n\n${QUESTION}` }],
      options: { num_predict: 40, temperature: 0 },
      think: false,
    });
    const found = /pumpkin/i.test(res.message.content);
    const prefillSeconds = (res.prompt_eval_duration ?? 0) / 1e9;
    out.push({ depth, found, promptTokens: res.prompt_eval_count ?? 0, prefillSeconds });
    console.log(
      `  needle at ${(depth * 100).toFixed(0).padStart(3)}% depth · ` +
      `${String(res.prompt_eval_count).padStart(6)} tok · ` +
      `prefill ${prefillSeconds.toFixed(1).padStart(5)}s · ` +
      `${found ? "FOUND" : "LOST "} · ${res.message.content.trim().replace(/\s+/g, " ").slice(0, 44)}`,
    );
  }
  return out;
}

if (import.meta.main) {
  const argv = process.argv.slice(2);
  const flag = (name: string, dflt: string) => {
    const i = argv.indexOf(name);
    return i >= 0 ? (argv[i + 1] ?? dflt) : dflt;
  };
  const tokens = Number(flag("--tokens", "8000"));
  const model = flag("--model", "qwen3.5:9b");
  console.log(`\nHaystack ≈ ${tokens} tokens · ${model}\n`);
  await needle(tokens, [0, 0.5, 1], model);
  console.log("\n  0% = fact at the very start, 100% = at the very end.\n");
}
