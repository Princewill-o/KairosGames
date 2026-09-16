import { chromium } from "playwright";
import assert from "node:assert/strict";
import {
  verses,
  prayers,
  arcs,
  parables,
  timeline,
  armor,
  wisdom,
  journey,
  fruits,
} from "../dist/content.mjs";
import { tokenize, psalmBlanks } from "../dist/learning-engine.mjs";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const go = async (id) => {
  await page.goto("http://localhost:4173/#play/" + id);
  await page.locator("#stage").waitFor();
};
const result = async (id) => {
  await page.locator(".result").waitFor();
  console.log("PASS complete", id);
};
try {
  await go("verse");
  await page.locator('[data-passage="0"]').click();
  for (const text of tokenize(verses[0].text, "seeker"))
    await page.getByRole("button", { name: text, exact: true }).click();
  await page.locator("#check").click();
  await page.locator("#finish").click();
  await result("verse");
  await page.locator("#reflection").fill("<script>safe text</script>");
  await page.locator("#save-note").click();
  await go("prayer");
  for (let round = 0; round < 3; round++) {
    if (round === 0) {
      await page.locator('[data-line="0"]').click();
      await page.locator('[data-quadrant="Confession"]').click();
      assert.match(await page.locator("#feedback").innerText(), /another home/);
    }
    for (let i = 0; i < 4; i++) {
      await page.locator(`[data-line="${i}"]`).click();
      await page
        .locator(`[data-quadrant="${prayers[round].lines[i][0]}"]`)
        .click();
    }
    await page.locator("#next").click();
  }
  await result("prayer");
  await go("sandals");
  await page.locator('[data-arc="0"]').click();
  await page.locator('[data-answer="1"]').click();
  await page.locator("#branch").click();
  await page.locator("#flavor-button").click();
  await page.locator("#return").click();
  await page.locator("#continue").click();
  await page.locator('[data-answer="1"]').click();
  await page.locator("#continue").click();
  await result("sandals");
  assert.match(await page.locator(".result-score").innerText(), /50/);
  await go("parable");
  await page.locator('[data-answer="0"]').click();
  assert.equal(await page.locator("[data-answer]").count(), 0);
  for (let i = 0; i < 4; i++) await page.locator(`[data-clue="${i}"]`).click();
  await page.locator('[data-answer="0"]').click();
  await page.locator('[data-answer="1"]').click();
  await page.locator("#finish").click();
  await result("parable");
  await go("timeline");
  await page.locator('[data-event="0"]').click();
  await page.locator('[data-slot="1"]').click();
  for (let i = 0; i < 8; i++) {
    await page.locator(`[data-event="${i}"]`).click();
    await page.locator(`[data-slot="${i}"]`).click();
  }
  await page.locator("#finish").click();
  await result("timeline");
  await go("armor");
  for (let i = 0; i < 6; i++) {
    const text = await page.locator(".scenario-card h3").innerText();
    const correct = armor.findIndex((a) => a.scenario === text);
    await page.locator(`[data-piece="${correct}"]`).click();
    await page.locator("#next").click();
  }
  await result("armor");
  await go("wisdom");
  for (let i = 0; i < 6; i++) {
    const text = await page.locator(".wisdom-card blockquote").innerText();
    const q = wisdom.find((q) => q.text === text);
    await page.locator(`[data-sort="${q.biblical}"]`).click();
    await page.locator("#next").click();
  }
  await result("wisdom");
  await go("journey");
  for (const leg of journey) {
    await page.locator(`.city-options [data-city="${leg.to}"]`).click();
    await page.locator("#next").click();
  }
  await result("journey");
  await go("garden");
  for (let i = 0; i < 9; i++) {
    const text = await page.locator(".garden-scenario h3").innerText();
    const f = fruits.find((f) => f[2] === text);
    await page.locator(`[data-fruit="${f[0]}"]`).click();
    await page.locator("#water").click();
    await page.locator("#next").click();
  }
  await result("garden");
  await go("psalms");
  await page.locator('[data-passage="0"]').click();
  for (let pass = 1; pass <= 3; pass++) {
    for (const b of psalmBlanks(verses[0], pass)) {
      const word = verses[0].text.split(" ")[b];
      await page
        .locator("[data-answer]")
        .filter({ hasText: word })
        .last()
        .click();
      await page.locator("#next").click();
    }
    await page.locator("#next").click();
  }
  await result("psalms");
  await page.goto("http://localhost:4173/#journey");
  assert.match(await page.locator(".stat-grid").innerText(), /10\/10/);
  assert.match(
    await page.locator(".journal-entry").innerText(),
    /<script>safe text<\/script>/,
  );
  await page.reload();
  assert.match(await page.locator(".stat-grid").innerText(), /10\/10/);
  await page.selectOption("#mode", "growth");
  await go("wisdom");
  await page.locator("#pause").click();
  const before = await page.locator("#round-time").textContent();
  await page.waitForTimeout(1600);
  assert.equal(await page.locator("#round-time").textContent(), before);
  await page.locator("#resume").click();
  await page.waitForTimeout(1200);
  assert.ok(
    Number(await page.locator("#round-time").textContent()) < Number(before),
  );
  await go("psalms");
  await page.locator('[data-passage="0"]').click();
  await page.locator("#recall").fill("shepherd");
  await page.locator("#recall-form button").click();
  assert.match(await page.locator("#feedback").innerText(), /belongs/);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of [
    "prayer",
    "sandals",
    "armor",
    "journey",
    "garden",
    "psalms",
  ]) {
    await go(id);
    if (id === "sandals") await page.locator('[data-arc="0"]').click();
    if (id === "psalms") await page.locator('[data-passage="0"]').click();
    await page.screenshot({
      path: `/tmp/kairos-${id}-mobile.png`,
      fullPage: true,
    });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      id + " mobile overflow",
    );
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS persistence, safe journal text, pause, growth recall, mobile layouts, no runtime errors",
  );
} finally {
  await browser.close();
}
