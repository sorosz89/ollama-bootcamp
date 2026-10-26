/**
 * Challenge 05 — The café board
 *
 * There is no "correct answer" to check here, so this checks the things that
 * are checkable: that you shipped a real exercise, built the way this repo
 * builds them. The judgement is yours; the conventions are not.
 *
 * Run: node --test challenges/05-the-cafe-board/verify.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const exercises = fs.readdirSync(root)
  .filter((d) => /^0[2-9]-/.test(d) && fs.statSync(path.join(root, d)).isDirectory());

test("a new exercise directory exists", () => {
  assert.ok(exercises.length > 0,
    "expected a directory like 02-your-exercise-name/ at the repo root");
});

const dir = exercises[0] ? path.join(root, exercises[0]) : "";
const files = dir ? fs.readdirSync(dir) : [];

/** Until an exercise exists there is nothing to inspect — skip rather than spray errors. */
const pending = exercises.length === 0 ? { skip: "no exercise directory yet — see the first test" } : {};

test("it has the three files every exercise here has", pending, () => {
  assert.ok(files.includes("README.md"), "needs a README.md");
  assert.ok(files.some((f) => f.endsWith(".ts") && !f.endsWith(".test.ts")), "needs a script");
  assert.ok(files.some((f) => f.endsWith(".test.ts")), "needs tests");
});

test("the README follows the house shape", pending, () => {
  const readme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
  for (const section of ["## Run", "## Steps to learn", "## Stretch goals", "## Caveats"]) {
    assert.ok(readme.includes(section), `README is missing ${section}`);
  }
  assert.ok(readme.includes("```mermaid"), "README needs a mermaid diagram of the loop");
  const caveats = readme.split("## Caveats")[1] ?? "";
  assert.ok(caveats.trim().length > 80,
    "Caveats is the section that keeps this honest — say what the exercise does NOT prove");
});

test("the tests do not need a model", pending, () => {
  for (const f of files.filter((f) => f.endsWith(".test.ts"))) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    assert.ok(!/from ["']ollama["']/.test(src),
      `${f} imports ollama — keep LLM I/O out of the tests so they stay fast and offline`);
  }
});

test("it is wired into the repo", pending, () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const num = (exercises[0] ?? "").slice(0, 2);
  assert.ok(Object.keys(pkg.scripts ?? {}).includes(num), `package.json needs a "${num}" run script`);
  assert.ok(fs.readFileSync(path.join(root, "README.md"), "utf8").includes(exercises[0] ?? " "),
    "add a row to the exercise table in the root README");
});

test("the script separates judgement from verification", pending, () => {
  const script = files.find((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))!;
  const src = fs.readFileSync(path.join(dir, script), "utf8");
  assert.ok(/export (function|const) /.test(src),
    "export the pure decisions so the tests can reach them — if nothing is exported, the logic is trapped inside the API call");
  assert.ok(src.includes("import.meta.main"),
    "guard the entry point with if (import.meta.main) so importing it from a test does not start the app");
});
