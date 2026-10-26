"""Gluten-free recipe chat: the LLM writes, Python checks."""
import re
from ollama import chat
from pydantic import BaseModel

MODEL = "qwen3.5:9b"
GLUTEN = ["wheat", "barley", "rye", "spelt", "malt", "semolina", "couscous",
          "bulgur", "farro", "seitan", "breadcrumb", "soy sauce", "flour tortilla"]
GLUTEN_RE = re.compile(r"\b(" + "|".join(GLUTEN) + r")s?\b")  # \b: buckwheat is OK

class Ingredient(BaseModel):
    name: str
    grams: float
    protein_g: float
    carbs_g: float
    fat_g: float

class Recipe(BaseModel):
    title: str
    servings: int
    ingredients: list[Ingredient]
    steps: list[str]

def targets(kcal, p_pct, c_pct, f_pct):
    return {"protein_g": kcal * p_pct / 100 / 4,
            "carbs_g": kcal * c_pct / 100 / 4,
            "fat_g": kcal * f_pct / 100 / 9}

def check(r: Recipe, kcal, goal, tol=0.10):
    problems = []
    for i in r.ingredients:
        if GLUTEN_RE.search(i.name.lower()):
            problems.append(f"'{i.name}' may contain gluten; replace it.")
    tot = {k: sum(getattr(i, k) for i in r.ingredients) / r.servings for k in goal}
    real_kcal = 4 * tot["protein_g"] + 4 * tot["carbs_g"] + 9 * tot["fat_g"]
    if abs(real_kcal - kcal) > tol * kcal:
        problems.append(f"Per serving is {real_kcal:.0f} kcal, target {kcal}.")
    for k, v in goal.items():
        if abs(tot[k] - v) > max(5, tol * v):
            problems.append(f"{k} per serving is {tot[k]:.0f} g, target {v:.0f} g.")
    return problems, tot, real_kcal

SYSTEM = ("You are a strict gluten-free chef. Never use wheat, barley, rye, spelt, "
          "malt or regular oats. Give realistic per-ingredient macros for the gram "
          "amounts you list. Answer only in the requested JSON.")

def main():
    kcal = int(input("Calories per serving [600]: ") or 600)
    split = input("Protein/Carbs/Fat % [30/40/30]: ") or "30/40/30"
    p, c, f = map(int, split.split("/"))
    goal = targets(kcal, p, c, f)
    history = [{"role": "system", "content": SYSTEM}]
    while (wish := input("\nWhat do you feel like? (empty = quit) > ")):
        history.append({"role": "user", "content":
            f"{wish}. Per serving: {kcal} kcal, protein {goal['protein_g']:.0f} g, "
            f"carbs {goal['carbs_g']:.0f} g, fat {goal['fat_g']:.0f} g."})
        for attempt in range(3):
            res = chat(model=MODEL, messages=history,
                       format=Recipe.model_json_schema(),
                       options={"temperature": 0.3}, think=False)
            recipe = Recipe.model_validate_json(res.message.content)
            history.append({"role": "assistant", "content": res.message.content})
            problems, tot, real = check(recipe, kcal, goal)
            if not problems:
                break
            print(f"  attempt {attempt + 1}: fixing -> {'; '.join(problems)}")
            history.append({"role": "user", "content":
                "Revise the recipe. Problems: " + " ".join(problems)})
        print(f"\n{recipe.title} ({recipe.servings} servings)")
        for i in recipe.ingredients:
            print(f"  - {i.grams:.0f} g {i.name}")
        for n, s in enumerate(recipe.steps, 1):
            print(f"  {n}. {s}")
        print(f"Per serving: {real:.0f} kcal | P {tot['protein_g']:.0f} g "
              f"C {tot['carbs_g']:.0f} g F {tot['fat_g']:.0f} g"
              + ("" if not problems else "  (still off target)"))

if __name__ == "__main__":
    main()
