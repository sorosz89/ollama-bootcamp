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

## Teaching workspace

Everything for learning lives under `course/`, tracked in git — the learning trail is part of what the repo demonstrates. Write every file in it for a reader who is not the author.

**The course is one linear path of 14 steps**, lessons and challenges interleaved so a challenge only ever needs what the preceding lessons covered. `course/index.html` is the single entry point and the only place the path is defined; every step page carries a `Step N of 14` marker and a footer bar linking the previous step, the index, and the next. **If you add, remove or reorder a step you must update all three:** the index path, the step's own marker, and the neighbouring pages' prev/next links. A reader who cannot tell what to do next is the failure mode this structure exists to prevent.

- `course/index.html` — the path, the reference list, the tool list. Start and end here.
- `course/lessons/NNNN-*.html` — nine lessons, two tiers each (see below).
- `course/challenges/NN-*.html` — the brief for each challenge; `course/challenges/NN-*/` holds its `starter.ts` and `verify.ts`.
- `course/reference/*.html` — five cheat sheets. Lessons are read once; these get reopened.
- `course/assets/` — shared components: `lesson.css`, `quiz.js`, and the measurement tools `bench.ts`, `schema-bench.ts`, `needle.ts`. Reuse is the default; read this directory before authoring anything.
- Repo root keeps `MISSION.md`, `RESOURCES.md`, `NOTES.md` and `learning-records/` — the workspace's own state, not reading material.

Conventions that are easy to break:

- Lessons open over `file://`, where ES modules are blocked by CORS. `assets/quiz.js` is therefore a **classic script**, not a module — keep it that way, and load it with a plain `<script src>`.
- **Lead with the idea, not the instruments.** Every lesson with depth is two tiers: a Part 1 that stands alone (plain language, a jargon table, one command, its own quiz, a three-point takeaway) and a Part 2 behind a `.tier` divider. Components: `.tier`, `.jargon`, `.takeaway`, `.detour`, `.path`.
- Every page links `../assets/lesson.css`, carries a dated meta line, cites primary sources inline, and ends with a Sources list and an invitation to ask questions.
- Quiz options stay within a few characters of each other and the correct answer's position varies, so neither length nor order leaks the answer.
- **Never commit solutions to a `starter.ts`** — a solved starter destroys the challenge for its only user. `verify.ts` files fail until solved, which is safe because bare `node --test` only auto-discovers `*.test.ts`; run them with `npm run challenge`. All course code is typechecked (`tsconfig.json` includes `**/*.ts`), so starters must compile as given.
- Shell paths quoted in pages are repo-root relative (`node course/assets/bench.ts`), while links between pages are relative to the page. Mixing these up is the most common breakage after a move.

## Testing

Tests cover only the pure functions (targets, validators, regexes). No Ollama call is mocked and none runs under test — keep LLM I/O out of testable functions so this stays true. Scripts guard their entry point with `if (import.meta.main)` so importing a module from a test never starts the chat loop.

## The pattern exercises follow

Each exercise splits work between the model and code along the same seam: the LLM produces something it's good at, TypeScript verifies the parts LLMs get wrong (arithmetic, hard rules), and failures are fed back as a revision prompt with a bounded retry count.

In `01-gluten-free-chef/chef.ts` that is: a Zod object → `z.toJSONSchema(Recipe)` passed as `format` so the reply is schema-valid JSON → the *same* Zod schema parses the reply into a typed object → `check()` returns a list of human-readable problem strings → problems appended as a user message, up to 3 attempts. One schema serving both the request and the parse is the point; new exercises should keep this shape rather than inventing a different one.

## Model config

Each script exports a hardcoded `MODEL` at the top (currently `qwen3.5:9b`) — readers are expected to edit it to whatever fits their RAM. `think: false` is passed on chat calls and only works on thinking models; the exercise READMEs tell readers to drop it otherwise. Structured output wants `temperature` around 0.2–0.4.

## Writing style for the docs

Exercise READMEs state the lesson in one line, include a mermaid `flowchart` of the loop, then `## Run`, `## Steps to learn`, `## Stretch goals` (checkbox list), `## Caveats`. Caveats are honest about what the code does not guarantee — e.g. the gluten filter is a keyword list and macros are model estimates, so the check proves consistency, not truth. Preserve that candour; don't overstate what an exercise verifies.
