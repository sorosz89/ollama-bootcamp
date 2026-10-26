# Ollama bootcamp

Learning local LLMs with [Ollama](https://ollama.com) in TypeScript, one small project at a time.

| # | Exercise | What it teaches |
| --- | --- | --- |
| 01 | [Gluten-free chef](01-gluten-free-chef/) | Structured JSON output, validating LLM output in code, feedback loops |

## The course

Everything for learning lives in [`course/`](course/). **Open [`course/index.html`](course/index.html)** — it is the single index, with one numbered path through 14 steps: nine lessons to read and five challenges to build, in the order they make sense.

| | |
| --- | --- |
| [`course/index.html`](course/index.html) | **Start here.** The path, step by step, with what to do at each one |
| [`course/lessons/`](course/lessons/) | Nine lessons. Each has a plain-language Part 1, a command to run, and a self-marking quiz |
| [`course/challenges/`](course/challenges/) | Five scenarios with executable acceptance criteria. No answers written down |
| [`course/reference/`](course/reference/) | Five cheat sheets to reopen later, including a glossary |
| [`course/assets/`](course/assets/) | The shared stylesheet, the quiz widget, and three measurement tools |
| [`docs/ollama-basics.md`](docs/ollama-basics.md) | The primer written before the course |

```bash
open course/index.html   # the whole course starts here
npm run challenge        # the five challenge verifiers; they fail until you solve them
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
