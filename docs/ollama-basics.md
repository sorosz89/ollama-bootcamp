# Ollama & local LLM basics

_As of 26 Oct 2026. Assumes an Apple Silicon Mac and Node 24+ with TypeScript._

## 1. How Ollama works

Ollama is a free, open-source runtime that downloads open-weight models and serves them on your machine through a local REST API at `http://localhost:11434`. Nothing leaves your laptop unless you choose a cloud model.

| Concept | What it means for you |
| --- | --- |
| Model | Open-weight LLM (Gemma, Qwen, Llama, Mistral…) pulled from the Ollama library, e.g. `qwen3:8b` |
| Tag | The part after `:` picks size and variant: `8b` = 8 billion parameters. Bigger = smarter, slower, more RAM |
| Quantization | Weights compressed to ~4 bits (`q4_K_M`, the default). Roughly: RAM ≈ 0.6 GB per billion params + context overhead |
| Context window | How much text the model sees at once (prompt + history + answer). Raise `num_ctx` for long chats |
| Modelfile | A file that bakes a system prompt and parameters into your own named model (`ollama create`) |
| API | `/api/chat` and `/api/generate`, plus an OpenAI-compatible `/v1` endpoint |
| Structured output | Pass a JSON schema in `format` and the model must answer in that shape |

On Apple Silicon the GPU shares system RAM (unified memory), so total RAM is your budget. Keep ~4–6 GB free for macOS.

## 2. Pricing

Running models locally is free and unlimited (Ollama is MIT-licensed; open-weight models cost nothing). You only pay for Ollama's cloud models (`-cloud` tags, same API).

| Plan | Price | What you get |
| --- | --- | --- |
| Free | $0 | Unlimited local use; light cloud usage, 1 concurrent cloud model |
| Pro | $20/mo ($200/yr) | Includes $60 cloud usage/month; 3 concurrent cloud models; private models |
| Max | $100/mo | Includes $300 cloud usage/month; 10 concurrent cloud models |
| Team | $500/mo | Includes $1,000 usage shared across unlimited users |

Ollama moved cloud billing from GPU-time limits to per-token billing with a monthly credit pool, announced 31 Aug 2026 ([report](https://ecosistemastartup.com/?p=103431)). Their [cloud page](https://registry.ollama.ai/cloud) still described the older model when checked, so confirm on ollama.com before paying.

## 3. Which model to use

Pick by RAM first (Apple menu → About This Mac). For recipes you want good instruction following and reliable JSON.

| Your RAM | Start with | Download | Also try |
| --- | --- | --- | --- |
| 8 GB | `gemma3:4b` | 3.3 GB | `granite4.2:3b` |
| 16 GB | `qwen3.5:9b` | 6.6 GB | `gemma3:12b`, `granite4.2:8b` |
| 24–32 GB | `qwen3:30b` (MoE) | 19 GB | `gemma4:26b`, `mistral-small3.2:24b` |
| 64 GB+ | `llama3.3:70b` | 43 GB | `qwen3.5:122b` needs ~80 GB |

Sizes from [MorphLLM, Aug 2026](https://www.morphllm.com/best-ollama-models); confirm with `ollama show <model>`.

- Model file ≤ ~60% of RAM; the rest goes to context and macOS.
- Small models write fine recipes but get arithmetic wrong — so code checks the numbers.
- Thinking models (Qwen3) reason first: better, slower; turn off with `think: false`.

## 4. Cheat sheet

| Command | Does |
| --- | --- |
| `ollama pull qwen3.5:9b` | Download a model |
| `ollama run qwen3.5:9b` | Chat in the terminal (`/bye` to exit) |
| `ollama run qwen3.5:9b --verbose` | Same, plus tokens/s |
| `ollama list` | Models on disk |
| `ollama ps` | Models in memory, GPU vs CPU |
| `ollama show qwen3.5:9b` | Parameters, context, capabilities |
| `ollama stop qwen3.5:9b` | Unload from memory |
| `ollama rm qwen3.5:9b` | Delete from disk |
| `ollama create chef -f Modelfile` | Build your own model |

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3.5:9b",
  "messages": [{"role": "user", "content": "Name 3 gluten-free grains"}],
  "stream": false
}'
```

The same call from TypeScript, via the official [`ollama`](https://www.npmjs.com/package/ollama) package:

```ts
import ollama from "ollama";

const res = await ollama.chat({
  model: "qwen3.5:9b",
  messages: [{ role: "user", content: "Name 3 gluten-free grains" }],
});
console.log(res.message.content);
```

Key options: `format` (JSON schema — build it from a Zod schema with `z.toJSONSchema()`), `options.temperature` (0.2–0.4 for structured output), `options.num_ctx`, `keep_alive`, `think`.

## 5. Pitfalls

- **Macros are estimates.** The check proves the model's numbers are consistent, not that they're true.
- **The gluten filter is a keyword list**, not a guarantee. For coeliac use, read labels.
- **Slow first answer** = model loading; `keep_alive: "30m"` keeps it warm.
- **Lost context** = `num_ctx` too small; raise to 8192 or trim history.
- **Everything slow** = model too big, spilling to CPU; check `ollama ps`.

## Sources

- [Ollama cloud page](https://registry.ollama.ai/cloud)
- [Ollama per-token pricing change, Aug 2026](https://ecosistemastartup.com/?p=103431)
- [CostBench: Ollama pricing](https://costbench.com/software/llm-inference-serving/ollama/)
- [MorphLLM: Best Ollama models](https://www.morphllm.com/best-ollama-models)
- [Ollama blog: Structured outputs](https://registry.ollama.ai/blog/structured-outputs)
