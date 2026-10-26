# Local LLMs / Ollama Resources

## Knowledge

- [Ollama API reference (`docs/api.md`, official repo)](https://github.com/ollama/ollama/blob/main/docs/api.md)
  The authoritative parameter list for `/api/chat` and `/api/generate`. Use for: exact semantics of `format`, `keep_alive`, `options`, streaming. First stop whenever a parameter's behaviour is in question.
- [Ollama blog: Structured outputs](https://ollama.com/blog/structured-outputs)
  The official announcement of JSON-schema `format`. Use for: the sanctioned usage pattern and the two official tips (prompt for JSON as well; drop temperature).
- ["How Does Ollama's Structured Outputs Work?" — Daniel Clayton](https://blog.danielclayton.co.uk/posts/ollama-structured-outputs/)
  Walks the schema → GBNF grammar → logit-masking path and names the failure modes the official docs skip. Use for: why constrained output can still be invalid, and why it costs throughput.
- [llama.cpp GBNF grammar guide](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
  The grammar layer Ollama sits on. Use for: understanding what a grammar can and cannot express, and hand-writing constraints beyond JSON.
- [llama.cpp: Difference in different quantization methods (#2094)](https://github.com/ggml-org/llama.cpp/discussions/2094)
  The size and perplexity table the whole ecosystem quotes, from the people who wrote the quantization. Use for: choosing a quant tag, and for what "not recommended" actually means.
- [Liu et al. (2023), Lost in the Middle](https://arxiv.org/abs/2307.03172)
  The U-shaped position curve in long contexts. Use for: designing long-context experiments; the methodology section matters more than the result.
- [Ollama model library](https://ollama.com/library)
  Sizes, tags, quantizations, capabilities per model. Use for: picking a model against a RAM budget; always confirm with `ollama show`.
- [Ollama docs: Context length](https://docs.ollama.com/context-length)
  VRAM-to-default-context table, `OLLAMA_CONTEXT_LENGTH`, and the instruction to verify the `PROCESSOR` split in `ollama ps`. Use for: why your context is the size it is, and what raising it costs.
- [Ollama FAQ](https://docs.ollama.com/faq)
  Official. Use for: `keep_alive` semantics and the 5-minute default, concurrency, and server configuration.
- [`ollama-js` on npm](https://www.npmjs.com/package/ollama)
  The official JS/TS client used by this repo. Use for: the typed request/response shapes, streaming, and the `think` option.

## Wisdom (Communities)

- [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)
  ~750k members and the highest-signal place for local-model work: hardware reality checks, new model families, and honest benchmark talk, usually ahead of the wider web. Use for: "is this model actually good at X on my RAM", and sanity-checking an exercise before publishing it.
- Ollama and LM Studio Discords
  Faster than Reddit for narrow, urgent, tool-specific breakage (a bad upgrade, a platform bug). Use for: live troubleshooting, not for comparing approaches.

## Gaps

- Quantization trade-offs: **closed** 26 Oct 2026 via llama.cpp discussion #2094, which carries the size-and-perplexity table. Still open: how the newer 4-bit float formats (`nvfp4`, `mxfp4`) compare, since `qwen3.5:9b` uses one and the k-quant figures may not transfer.
- No authoritative source found on what the `mlx` runner does differently from the llama.cpp runner, which Lesson 02's context measurements made into an open question.
- Throughput methodology: **closed** 26 Oct 2026. The API reference defines the timing fields and the tok/s formula; `assets/bench.ts` applies it.
