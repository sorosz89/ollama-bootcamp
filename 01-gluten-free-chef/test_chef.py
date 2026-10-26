from chef import GLUTEN_RE, Ingredient, Recipe, check, targets


def test_targets_use_4_4_9_rule():
    assert targets(600, 30, 40, 30) == {"protein_g": 45.0, "carbs_g": 60.0, "fat_g": 20.0}


def test_gluten_regex():
    assert GLUTEN_RE.search("whole wheat flour")
    assert GLUTEN_RE.search("barley malt")
    assert GLUTEN_RE.search("soy sauce")
    assert not GLUTEN_RE.search("buckwheat groats")
    assert not GLUTEN_RE.search("maltodextrin")
    assert not GLUTEN_RE.search("tamari")


def _recipe(*ings):
    return Recipe(title="t", servings=2, steps=["cook"], ingredients=list(ings))


def test_on_target_recipe_passes():
    r = _recipe(
        Ingredient(name="Chicken breast", grams=300, protein_g=88, carbs_g=0, fat_g=8),
        Ingredient(name="Rice", grams=160, protein_g=2, carbs_g=120, fat_g=1),
        Ingredient(name="Olive oil", grams=31, protein_g=0, carbs_g=0, fat_g=31),
    )
    problems, tot, kcal = check(r, 600, targets(600, 30, 40, 30))
    assert problems == []
    assert 540 <= kcal <= 660


def test_gluten_and_calories_flagged():
    r = _recipe(Ingredient(name="Couscous", grams=100, protein_g=4, carbs_g=23, fat_g=0))
    problems, _, _ = check(r, 600, targets(600, 30, 40, 30))
    assert any("gluten" in p for p in problems)
    assert any("kcal" in p for p in problems)
