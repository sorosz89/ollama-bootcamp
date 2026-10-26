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

[**Open the course**](index.html) — nine lessons and five reference sheets, every figure measured rather than quoted. In order:

1. [The grammar, not the prompt](lessons/0001-the-grammar-not-the-prompt.html) — a schema guarantees shape and nothing else
2. [Reading the machine](lessons/0002-reading-the-machine.html) — the two speeds a local model has, and what a long chat costs
3. [When the model can't comply](lessons/0003-when-the-model-cant-comply.html) — truncation, `done_reason`, and loops that give up well
4. [Fitting a model in your memory](lessons/0004-fitting-a-model-in-memory.html) — the arithmetic of what will actually run
5. [Schemas a small model can fill](lessons/0005-schemas-a-small-model-can-fill.html) — schema shape as a latency decision
6. [Does a bigger context make it dumber?](lessons/0006-does-a-bigger-context-make-it-dumber.html) — an experiment, with an honest null result
7. [What to verify, what to re-ask](lessons/0007-what-to-verify-what-to-reask.html) — the three buckets every error falls into
8. [Staying fast in something real](lessons/0008-staying-fast-in-something-real.html) — streaming, warm-up, cancellation, concurrency
9. [Designing an exercise from a finding](lessons/0009-designing-an-exercise.html) — turning a surprise into exercise 02

## Challenges

Five scenarios with executable acceptance criteria — [the briefs](challenges/index.html). Unlike the lessons, the answers are not written down.

```bash
npm run challenge     # all five; they fail until you make them pass
```

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
