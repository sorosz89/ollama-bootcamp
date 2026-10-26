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
- Lesson 03 candidates, in rough preference order: (a) raising the context window and measuring what it costs in RAM and prefill; (b) does a bigger context make the model measurably worse — a real experiment, and a strong candidate for exercise 02; (c) quantization trade-offs, blocked on finding a trusted source.
