# Measured performance baseline for this machine

Taken 26 Oct 2026 on the 24 GB Apple Silicon Mac, `qwen3.5:9b`, Ollama 0.6.x, `mlx` runner, during Lesson 02. Future lessons should compare against these rather than re-deriving them:

- Cold `load_duration` **3.41 s**; warm 0.00 s (5-minute default residency)
- Prefill **~120 tok/s** fresh, **~881 tok/s** on a repeated (cached) prompt
- Decode **50–55 tok/s** warm, 27 tok/s on the cold run — never benchmark the first call
- `ollama ps`: `100% GPU`, `CONTEXT 4096`, runner `mlx`
- One `chef.ts` recipe reply ≈ **482 tokens**; each retry round adds ≈ **512 tokens** of prompt (95 → 606 → 1,120 across three attempts)

**Non-obvious finding, and a corrected assumption.** I expected a prompt over the reported 4096 window to be truncated, dropping the system prompt. It was not: prompts of 7,250 / 20,450 / 48,050 tokens all ran to completion and still recalled a codeword planted in the system prompt, while `ollama ps` continued to report `CONTEXT 4096` and `SIZE` grew 7.7 → 9.1 → 11 GB. On this runner the reported context is the configured default, not a hard ceiling; the real cost of a long history is **latency and memory** (120 s of prefill at 48k tokens), not amnesia.

**Implications:** this may be `mlx`-specific — llama.cpp-backed runners have historically slid the window and dropped the oldest tokens. Do not teach either behaviour as universal; teach measuring it. Also unlocks a real design question for exercise 01: `chef.ts` never clears `history` between wishes, so prefill cost compounds across a session. See [[MISSION.md]].
