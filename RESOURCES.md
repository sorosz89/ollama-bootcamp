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
- [Ollama model library](https://ollama.com/library)
  Sizes, tags, quantizations, capabilities per model. Use for: picking a model against a RAM budget; always confirm with `ollama show`.
- [`ollama-js` on npm](https://www.npmjs.com/package/ollama)
  The official JS/TS client used by this repo. Use for: the typed request/response shapes, streaming, and the `think` option.

## Wisdom (Communities)

- [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)
  ~750k members and the highest-signal place for local-model work: hardware reality checks, new model families, and honest benchmark talk, usually ahead of the wider web. Use for: "is this model actually good at X on my RAM", and sanity-checking an exercise before publishing it.
- Ollama and LM Studio Discords
  Faster than Reddit for narrow, urgent, tool-specific breakage (a bad upgrade, a platform bug). Use for: live troubleshooting, not for comparing approaches.

## Gaps

- No trusted, current source yet for *measuring* local throughput properly (tokens/s methodology, prompt vs eval rate, cold vs warm). Needed before the "running models well" lessons.
- No trusted source yet on quantization quality trade-offs (q4_K_M vs q8 vs fp16) at a given parameter count.
