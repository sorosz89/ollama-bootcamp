import assert from "node:assert/strict";
import { test } from "node:test";
import { shouldContinue } from "./starter.ts";

test("nothing tried yet — try something", () => {
  assert.equal(shouldContinue([], 3), true);
});

test("one attempt, still off target — try again", () => {
  assert.equal(shouldContinue([0.8], 3), true);
});

test("meaningful progress — keep going", () => {
  assert.equal(shouldContinue([0.80, 0.50], 4), true);
  assert.equal(shouldContinue([0.80, 0.50, 0.20], 4), true);
});

test("target hit — stop, obviously", () => {
  assert.equal(shouldContinue([0.8, 0.3, 0], 5), false);
});

test("stalled — a third decimal place is not progress", () => {
  assert.equal(shouldContinue([0.500, 0.499], 5), false);
  assert.equal(shouldContinue([0.50, 0.49], 5), false, "2% is below the 5% threshold");
});

test("getting worse — stop", () => {
  assert.equal(shouldContinue([0.40, 0.65], 5), false);
});

test("oscillating — stop rather than cycle forever", () => {
  assert.equal(shouldContinue([0.50, 0.20, 0.50], 8), false);
});

test("the attempt cap is absolute", () => {
  assert.equal(shouldContinue([0.9, 0.6, 0.3], 3), false, "3 attempts of a maximum 3 are spent");
  assert.equal(shouldContinue([0.9, 0.6, 0.3, 0.1], 3), false);
});

test("it terminates on any input", () => {
  let d = [1], steps = 0;
  while (shouldContinue(d, 10)) {
    d = [...d, (d.at(-1) ?? 1) * 0.5];
    assert.ok(++steps < 50, "shouldContinue never returned false");
  }
});
