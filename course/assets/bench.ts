/**
 * Print the timing receipt for one Ollama call. Shared by the performance lessons.
 *
 *   node assets/bench.ts "your prompt here"
 *   node assets/bench.ts --repeat 2 --predict 200 "measure prompt caching"
 *   node assets/bench.ts --cold "measure the load time too"
 */
import ollama from "ollama";

const NS = 1e9;

type Opts = { model: string; predict: number; repeat: number; cold: boolean; prompt: string };

function parse(argv: string[]): Opts {
  const o: Opts = { model: "qwen3.5:9b", predict: 150, repeat: 1, cold: false, prompt: "" };
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--model") o.model = argv[++i] ?? o.model;
    else if (a === "--predict") o.predict = Number(argv[++i] ?? o.predict);
    else if (a === "--repeat") o.repeat = Number(argv[++i] ?? o.repeat);
    else if (a === "--cold") o.cold = true;
    else if (a !== undefined) rest.push(a);
  }
  o.prompt = rest.join(" ") || "Name three naturally gluten-free grains.";
  return o;
}

const pad = (s: string, n: number) => s.padEnd(n);
const secs = (ns: number) => (ns / NS).toFixed(3) + "s";
const rate = (count: number, ns: number) => (ns > 0 ? (count / (ns / NS)).toFixed(0) : "—");

export async function bench(o: Opts) {
  if (o.cold) {
    // Unload first so load_duration reflects a genuine cold start.
    await ollama.generate({ model: o.model, prompt: "", keep_alive: 0 }).catch(() => {});
  }

  for (let run = 1; run <= o.repeat; run++) {
    const res = await ollama.generate({
      model: o.model,
      prompt: o.prompt,
      stream: false,
      think: false,
      options: { num_predict: o.predict, temperature: 0.3 },
    });

    const pc = res.prompt_eval_count ?? 0;
    const pd = res.prompt_eval_duration ?? 0;
    const ec = res.eval_count ?? 0;
    const ed = res.eval_duration ?? 0;

    console.log(`\n── run ${run} of ${o.repeat} · ${o.model} ──`);
    console.log(pad("  load (cold start)", 26) + secs(res.load_duration ?? 0));
    console.log(pad("  prefill / prompt eval", 26) + `${pc} tok in ${secs(pd)}  →  ${rate(pc, pd)} tok/s`);
    console.log(pad("  decode / generation", 26) + `${ec} tok in ${secs(ed)}  →  ${rate(ec, ed)} tok/s`);
    console.log(pad("  total", 26) + secs(res.total_duration ?? 0));
  }

  if (o.repeat > 1) {
    console.log("\n  Run 2's prefill should be far faster: Ollama only times *uncached* prompt tokens.");
  }
  console.log("\n  Now check the split and the window:  ollama ps\n");
}

if (import.meta.main) await bench(parse(process.argv.slice(2)));
