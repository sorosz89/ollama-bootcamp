import assert from "node:assert/strict";
import { test } from "node:test";
import { canonicalName, containsGluten } from "./starter.ts";

test("canonicalName collapses the ways a model writes the same thing", () => {
  const forms = ["soy sauce", "Soy Sauce", "soy  sauce", "SOY   SAUCE", "  Soy-Sauce  ", "soy_sauce"];
  const canon = forms.map(canonicalName);
  assert.equal(new Set(canon).size, 1, `these should all canonicalise alike, got ${JSON.stringify(canon)}`);
});

test("the bug: spacing and punctuation no longer hide gluten", () => {
  for (const name of ["soy  sauce", "Soy-Sauce", "  SOY   SAUCE  ", "whole-wheat flour", "Barley   Malt"]) {
    assert.equal(containsGluten(name), true, `${JSON.stringify(name)} contains gluten and was missed`);
  }
});

test("still catches the plain cases", () => {
  for (const name of ["wheat flour", "barley malt", "couscous", "Semolina", "seitan strips"]) {
    assert.equal(containsGluten(name), true, `${JSON.stringify(name)} should be flagged`);
  }
});

test("still does not cry wolf", () => {
  for (const name of ["buckwheat groats", "maltodextrin", "tamari", "rice flour", "almond meal"]) {
    assert.equal(containsGluten(name), false, `${JSON.stringify(name)} is safe and was flagged`);
  }
});

test("an explicit gluten-free label is trusted", () => {
  for (const name of ["gluten-free breadcrumbs", "Gluten Free Soy Sauce", "GF flour tortilla", "gluten free pasta"]) {
    assert.equal(containsGluten(name), false, `${JSON.stringify(name)} is labelled gluten-free`);
  }
});

test("but the label has to be about this ingredient", () => {
  assert.equal(containsGluten("wheat flour (not gluten free)"), true,
    "a negated label must not be read as a gluten-free claim");
});

test("plurals and trailing detail still match", () => {
  for (const name of ["breadcrumbs", "Wheat Berries", "rye bread, sliced"]) {
    assert.equal(containsGluten(name), true, `${JSON.stringify(name)} should be flagged`);
  }
});
