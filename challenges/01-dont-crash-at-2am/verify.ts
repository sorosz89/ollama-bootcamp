import assert from "node:assert/strict";
import { test } from "node:test";
import { decide, HARD_CAP, type ModelReply } from "./starter.ts";

const good = '{"title":"Traybake","servings":2}';
const truncated = '{"title":"Tray';
const reply = (done_reason: string, content: string): ModelReply => ({ done_reason, content });

test("a finished, parseable reply is parsed", () => {
  assert.deepEqual(decide(reply("stop", good), 600, 1, 3), { action: "parse" });
});

test("a truncated reply is never parsed — it retries with more room", () => {
  const d = decide(reply("length", truncated), 600, 1, 3);
  assert.equal(d.action, "retry", "truncation must not be parsed");
  assert.ok(d.action === "retry" && d.cap > 600, "the cap must actually grow");
});

test("the cap never exceeds HARD_CAP", () => {
  const d = decide(reply("length", truncated), HARD_CAP - 1, 1, 3);
  assert.ok(d.action !== "retry" || d.cap <= HARD_CAP, `cap exceeded HARD_CAP`);
});

test("a finished but malformed reply retries — a resample may help", () => {
  assert.equal(decide(reply("stop", "not json at all"), 600, 1, 3).action, "retry");
});

test("an unloaded model retries without inflating the cap", () => {
  const d = decide(reply("unload", ""), 600, 1, 3);
  assert.equal(d.action, "retry");
  assert.ok(d.action === "retry" && d.cap === 600, "nothing was wrong with the cap");
});

test("the last attempt gives up rather than retrying forever", () => {
  for (const r of [reply("length", truncated), reply("stop", "nope"), reply("unload", "")]) {
    const d = decide(r, 600, 3, 3);
    assert.equal(d.action, "give-up", `attempt 3 of 3 on ${r.done_reason} must give up`);
    assert.ok(d.action === "give-up" && d.why.length > 0, "give-up must explain itself");
  }
});

test("a good reply on the last attempt is still parsed", () => {
  assert.deepEqual(decide(reply("stop", good), 600, 3, 3), { action: "parse" });
});

test("the loop always terminates", () => {
  let cap = 20, attempt = 1, steps = 0;
  for (;;) {
    const d = decide(reply("length", truncated), cap, attempt, 3);
    if (d.action !== "retry") break;
    cap = d.cap;
    attempt += 1;
    assert.ok(++steps < 50, "decide() never stopped — this loop is unbounded");
  }
});
