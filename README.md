# Ollama bootcamp

Learning local LLMs with [Ollama](https://ollama.com) in TypeScript, one small project at a time.

| # | Exercise | What it teaches |
| --- | --- | --- |
| 01 | [Gluten-free chef](01-gluten-free-chef/) | Structured JSON output, validating LLM output in code, feedback loops |

## Learning alongside the code

The repo tracks its own learning trail, not just the finished exercises.

| Where | What |
| --- | --- |
| [docs/ollama-basics.md](docs/ollama-basics.md) | The primer: how Ollama works, pricing, which model to pick, cheat sheet |
| [lessons/](lessons/) | Short, self-contained lessons — open the `.html` files in a browser |
| [reference/](reference/) | Cheat sheets worth reopening: the compressed version of each lesson |
| [MISSION.md](MISSION.md), [RESOURCES.md](RESOURCES.md) | Why this is being learned, and the sources it is grounded in |

Start with [Lesson 01 · The grammar, not the prompt](lessons/0001-the-grammar-not-the-prompt.html) — why `format` guarantees the shape of a local model's answer and nothing else.

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
