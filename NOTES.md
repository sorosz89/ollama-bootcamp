# Working notes

## How Sandor likes to work (observed, this repo)
- Terse, dense prose. Honest caveats sections. No filler, no marketing voice.
- Prefers minimal dependency counts and no build step — Node 24 runs `.ts` directly, tests are `node:test`.
- Exercises follow one pattern: model generates → code verifies → problems fed back, bounded retries.
- Writes dated, source-linked facts in docs (`_As of …_` + a Sources list). Lessons should match that discipline.

## Teaching preferences
- 10–15 minute lessons, one win each.
- Knows cloud LLM APIs well — do not re-teach messages/roles/tokens/prompting. The delta is the local runtime.

## Decisions
- **The teaching workspace is tracked in the public repo** (decided 26 Oct 2026). The learning trail is portfolio material in its own right, so lessons, reference sheets, mission and learning records all ship alongside the exercises. Write them for a reader who is not Sandor: no private notes, no half-finished drafts committed.

## Open questions to revisit
- Lesson 02 candidate: measuring and reading local throughput (`--verbose`, `ollama ps`, cold vs warm, CPU spill).
