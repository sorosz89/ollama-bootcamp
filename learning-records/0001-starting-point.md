# Starting point: fluent with cloud LLM APIs, new to local runtimes

Sandor arrives already comfortable driving cloud LLM APIs from code — messages, roles, tokens, prompting are all known and should not be re-taught. The genuinely new surface is the *local runtime*: what Ollama does differently from a hosted provider, and what running a model on your own 24 GB machine imposes.

Hardware and tooling are fixed: 24 GB Apple Silicon Mac, `qwen3.5:9b` pulled, repo is TypeScript on Node 24 with no build step.

**Implications:** teach the delta, not the basics. Every lesson should be able to finish the sentence "this is different from the cloud API you already know because…". Chosen focus areas are reliable structured output and operating models well; tool calling, RAG and fine-tuning are explicitly deferred — see [[MISSION.md]].
