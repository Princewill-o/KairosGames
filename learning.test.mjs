import test from "node:test";
import assert from "node:assert/strict";
import {
  tokenize,
  gradeOrder,
  scoreRun,
  recordCompletion,
  freshProgress,
  gardenGrowth,
  psalmBlanks,
} from "./public/learning-engine.mjs";
test("phrase and word tiles retain the exact passage", () => {
  const t = "The LORD is my shepherd; I shall not want.";
  assert.equal(tokenize(t, "growth").join(" "), t);
  assert.equal(tokenize(t, "seeker").join(" "), t);
  assert.ok(tokenize(t, "seeker").length < tokenize(t, "growth").length);
});
test("ordering grades each slot independently, including duplicate words", () => {
  assert.deepEqual(gradeOrder(["a", "b", "a"], ["a", "a", "b"]), [
    true,
    false,
    false,
  ]);
});
test("scores are bounded and only growth applies elapsed penalty", () => {
  assert.equal(scoreRun(2, 120, "seeker"), 90);
  assert.equal(scoreRun(2, 120, "growth"), 80);
  assert.equal(scoreRun(100, 1000, "growth"), 0);
});
test("completion keeps best, unique mastered verses and daily streak", () => {
  let p = freshProgress();
  p = recordCompletion(p, "verse", 90, ["psalm23"], "2026-09-15");
  p = recordCompletion(p, "verse", 50, ["psalm23"], "2026-09-15");
  assert.equal(p.games.verse.best, 90);
  assert.equal(p.streak, 1);
  assert.deepEqual(p.mastered, ["psalm23"]);
  p = recordCompletion(p, "prayer", 100, [], "2026-09-16");
  assert.equal(p.streak, 2);
  assert.equal(p.runs, 3);
  p = recordCompletion(p, "prayer", 100, [], "2026-09-19");
  assert.equal(p.streak, 1);
});
test("garden grows only matching fruit and caps bloom at three", () => {
  assert.deepEqual(gardenGrowth({}, "love", "peace"), {});
  assert.equal(gardenGrowth({ love: 2 }, "love", "love").love, 3);
  assert.equal(gardenGrowth({ love: 3 }, "love", "love").love, 3);
});
test("psalm passes add unique blanks and preserve keyword priority", () => {
  const v = {
    text: "The LORD is my shepherd; I shall not want.",
    keywords: ["shepherd", "want"],
  };
  const a = psalmBlanks(v, 1);
  const b = psalmBlanks(v, 3);
  assert.deepEqual(a, [4]);
  assert.ok(b.includes(4) && b.includes(8));
  assert.equal(new Set(b).size, b.length);
});
