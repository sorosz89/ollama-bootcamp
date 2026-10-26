# Working notes

## How Sandor likes to work (observed, this repo)
- Terse, dense prose. Honest caveats sections. No filler, no marketing voice.
- Prefers minimal dependency counts and no build step — Node 24 runs `.ts` directly, tests are `node:test`.
- Exercises follow one pattern: model generates → code verifies → problems fed back, bounded retries.
- Writes dated, source-linked facts in docs (`_As of …_` + a Sources list). Lessons should match that discipline.

## Teaching preferences
- 10–15 minute lessons, one win each.
- Knows cloud LLM APIs well — do not re-teach messages/roles/tokens/prompting. The delta is the local runtime.
- **Lead with the plain-language mental model; put measurement second** (said of Lesson 02, 26 Oct 2026: "it is too much to me for now"). Fluency with cloud APIs did not transfer to local-runtime internals as much as I assumed — being senior in one area does not make someone a beginner-proof reader in the adjacent one. Default shape from here: a Part 1 that is complete on its own (idea, jargon table, one command, a short quiz, a three-point takeaway), then a clearly marked Part 2 for instruments and edge cases. Keep the depth; just stop opening with it.

## Decisions
- **The teaching workspace is tracked in the public repo** (decided 26 Oct 2026). The learning trail is portfolio material in its own right, so lessons, reference sheets, mission and learning records all ship alongside the exercises. Write them for a reader who is not Sandor: no private notes, no half-finished drafts committed.

## Open questions to revisit
- **Posed to Sandor in Lesson 02, unanswered:** should `chef.ts` reset `history` per wish? It currently never clears, so prefill cost compounds across a session. His answer shapes exercise 01's next revision.
- **All nine lessons are written** (26 Oct 2026). Sandor asked for the full scope before starting, so the course is complete rather than drip-fed. `index.html` at the repo root is the entry point.
- Because nothing has been worked through yet, there is **no evidence of what landed**. Do not assume the pitch is right across all nine — Lesson 02 needed rewriting after being too dense, and lessons 03–09 have had no such feedback. Ask early, and be ready to retrofit.
- `GLOSSARY.md` (the record of compressed understanding) still does not exist, deliberately: terms belong there once Sandor can *use* them, not when they have been covered. `reference/glossary.html` is the teaching glossary and is a different artifact.
- Lesson 06 and Lesson 09 both end by pointing at exercise 02. Lesson 05's finding is the most buildable; the Lesson 06 null result is the most interesting but hardest to shape.
