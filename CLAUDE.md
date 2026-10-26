# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A teaching repo: a series of small, self-contained exercises for learning local LLMs with Ollama in TypeScript. The code exists to make a lesson legible, so clarity beats generality — short scripts, no framework, no build step, as few dependencies as the lesson allows.

## Commands

```bash
npm install
npm test                                     # all tests; no Ollama needed
node --test 01-gluten-free-chef/chef.test.ts # one file
node --test --test-name-pattern "gluten"     # one test by name
npm run typecheck                            # tsc --noEmit
npm run 01                                   # run an exercise (needs Ollama running)
```

CI (`.github/workflows/tests.yml`) runs `npm run typecheck` then `npm test` on Node 24.

## Toolchain choices

Node 24 executes `.ts` files directly by stripping types, so there is **no bundler, no build step, and no `tsx`** — `node 01-gluten-free-chef/chef.ts` just runs. Two consequences to respect:

- `tsconfig.json` sets `erasableSyntaxOnly`, so no enums, namespaces, parameter properties, or `experimentalDecorators` — type stripping cannot erase those.
- Relative imports carry the real extension (`from "./chef.ts"`), enabled by `allowImportingTsExtensions`. `tsc` is typecheck-only (`noEmit`).

Tests use the built-in `node:test` runner with `node:assert/strict` — no Vitest or Jest. `npm test` is bare `node --test`, which discovers `**/*.test.ts` from the repo root.

## Structure

- `docs/ollama-basics.md` — the shared primer (how Ollama works, pricing, model-by-RAM table, cheat sheet, pitfalls). Facts there are dated and source-linked; update the "As of" line and the Sources list when changing them.
- `NN-exercise-name/` — one numbered directory per exercise, each with `README.md`, a single script, and `*.test.ts`.
- Root `README.md` carries the exercise index table; `package.json` carries one `NN` run script per exercise. Add to both when adding an exercise.

Everything shares the root `package.json` and `tsconfig.json`; there are no workspaces. `tsconfig.json`'s `include` is `*/*.ts`, which covers exercise directories one level deep.

## Testing

Tests cover only the pure functions (targets, validators, regexes). No Ollama call is mocked and none runs under test — keep LLM I/O out of testable functions so this stays true. Scripts guard their entry point with `if (import.meta.main)` so importing a module from a test never starts the chat loop.

## The pattern exercises follow

Each exercise splits work between the model and code along the same seam: the LLM produces something it's good at, TypeScript verifies the parts LLMs get wrong (arithmetic, hard rules), and failures are fed back as a revision prompt with a bounded retry count.

In `01-gluten-free-chef/chef.ts` that is: a Zod object → `z.toJSONSchema(Recipe)` passed as `format` so the reply is schema-valid JSON → the *same* Zod schema parses the reply into a typed object → `check()` returns a list of human-readable problem strings → problems appended as a user message, up to 3 attempts. One schema serving both the request and the parse is the point; new exercises should keep this shape rather than inventing a different one.

## Model config

Each script exports a hardcoded `MODEL` at the top (currently `qwen3.5:9b`) — readers are expected to edit it to whatever fits their RAM. `think: false` is passed on chat calls and only works on thinking models; the exercise READMEs tell readers to drop it otherwise. Structured output wants `temperature` around 0.2–0.4.

## Writing style for the docs

Exercise READMEs state the lesson in one line, include a mermaid `flowchart` of the loop, then `## Run`, `## Steps to learn`, `## Stretch goals` (checkbox list), `## Caveats`. Caveats are honest about what the code does not guarantee — e.g. the gluten filter is a keyword list and macros are model estimates, so the check proves consistency, not truth. Preserve that candour; don't overstate what an exercise verifies.
