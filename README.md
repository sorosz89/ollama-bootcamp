# Ollama bootcamp

Learning local LLMs with [Ollama](https://ollama.com) in TypeScript, one small project at a time.

| # | Exercise | What it teaches |
| --- | --- | --- |
| 01 | [Gluten-free chef](01-gluten-free-chef/) | Structured JSON output, validating LLM output in code, feedback loops |

Start with the basics: [docs/ollama-basics.md](docs/ollama-basics.md) — how Ollama works, pricing, which model to pick, cheat sheet.

## Setup

```bash
# 1. Ollama installed and running, then pull a model that fits your RAM
ollama pull qwen3.5:9b

# 2. Node 24+ (it runs TypeScript directly — no build step)
npm install

# 3. Run an exercise
npm run 01

# Tests and types (no Ollama needed)
npm test
npm run typecheck
```
