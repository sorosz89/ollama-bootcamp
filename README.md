# Ollama bootcamp

Learning local LLMs with [Ollama](https://ollama.com), one small project at a time.

| # | Exercise | What it teaches |
| --- | --- | --- |
| 01 | [Gluten-free chef](01-gluten-free-chef/) | Structured JSON output, validating LLM output in code, feedback loops |

Start with the basics: [docs/ollama-basics.md](docs/ollama-basics.md) — how Ollama works, pricing, which model to pick, cheat sheet.

## Setup

```bash
# 1. Ollama installed and running, then pull a model that fits your RAM
ollama pull qwen3.5:9b

# 2. Python environment
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 3. Run an exercise
python 01-gluten-free-chef/chef.py

# Tests (no Ollama needed)
pytest
```
