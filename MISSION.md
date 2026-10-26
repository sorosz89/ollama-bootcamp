# Mission: Local LLMs with Ollama

## Why
Sandor is building `ollama-bootcamp` as a public series of small, sharp exercises that demonstrate real competence with local models. Each exercise has to teach one non-obvious thing and survive scrutiny from someone who knows the field — so the learning and the portfolio are the same artifact.

## Success looks like
- Can explain, and show in code, where a small local model is trustworthy and where code must check it
- Ships new bootcamp exercises that each isolate one real local-model concept, with tests and honest caveats
- Picks a model for a task by reasoning about RAM, quantization, context and throughput — not by guessing
- Can diagnose a bad local-model run (slow, truncated, drifting, off-schema) from the symptoms

## Constraints
- 10–15 minute lessons; one tangible win each
- Hardware: 24 GB Apple Silicon Mac; `qwen3.5:9b` pulled
- Already fluent with cloud LLM APIs (messages, roles, tokens, prompting) — the *local runtime* is the new part
- Repo is TypeScript on Node 24, no build step; lessons should fit that stack

## Out of scope
- Fine-tuning and training
- Tool calling and RAG (revisit once structured output and model operations are solid)
- Python ports of the exercises
