# 01 · Gluten-free chef

A terminal chat that generates gluten-free recipes for a target calorie count and protein/carbs/fat split.

The lesson: let the LLM do what it's good at (writing recipes) and let code do what LLMs are bad at (arithmetic and hard rules).

```mermaid
flowchart LR
    A[Python: targets<br/>kcal + P/C/F → grams] --> B[Ollama model<br/>recipe as JSON schema]
    B --> C{Gluten-free<br/>and on target?}
    C -- yes --> D[Show the recipe]
    C -- no --> E[Feed back problems<br/>max 3 attempts]
    E -- revise --> B
```

Targets use the 4/4/9 rule: protein and carbs 4 kcal/g, fat 9 kcal/g. 600 kcal at 30/40/30 = 45 g protein, 60 g carbs, 20 g fat per serving.

## Run

```bash
ollama pull qwen3.5:9b          # or set MODEL in chef.py to what you have
python 01-gluten-free-chef/chef.py
```

If your model isn't a thinking model and the call errors on `think`, remove `think=False`.

## Steps to learn

1. `ollama run qwen3.5:9b` and ask for a 600 kcal gluten-free recipe. Note the macros rarely add up.
2. Run `chef.py` and read the retry log — that feedback loop is the main thing.
3. Run the tests: `pytest`.

## Stretch goals

- [ ] Stream the output
- [ ] Streamlit UI (`st.chat_input`)
- [ ] Real nutrition numbers from USDA FoodData Central instead of LLM guesses
- [ ] Allergies, weekly meal plan

## Caveats

Macros are LLM estimates; the check proves consistency, not truth. The gluten filter is a keyword list — it misses hidden gluten and flags safe items like "GF breadcrumbs". For coeliac use, read labels.
