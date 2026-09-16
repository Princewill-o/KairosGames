# Kairos — Scripture & Play

A standalone, static collection of ten biblical learning mini-games rebuilt from the supplied Biblical Mini-Games Library specification and the three supplied asset packs.

## Run

```sh
npm run dev
```

Open http://localhost:4173. No build is required. Google Fonts is optional; local fallback fonts are provided. All game assets are local.

## Games

1. Verse Rebuild — phrase tiles in Seeker mode; individual words and distractors in Growth. Correct slots stay locked on retry.
2. Prayer Compass — three ACTS scenarios, click or drag placement, optional browser speech readback.
3. Walk in Their Sandals — five story arcs, canon outcomes, explicitly fictional alternate branches, and return-to-Scripture dialogs.
4. Parable Detective — two parables, illustrated clue panels, and interpretation matching.
5. Covenant Timeline — eight connected events, click/drag ordering, and bridge captions.
6. Armor Up — six scenarios, equipment slots, and contextual explanations.
7. Wisdom or World — six sayings, tap/swipe/arrow sorting, explanations, and optional round deadlines.
8. Trace the Journey — four legs of Paul’s first missionary journey on a simplified geographical map with zoom and scroll/pan.
9. Fruit Garden — nine scenario matches; persistent seed → sprout → bud → bloom growth over repeated plays.
10. Psalms Fill-the-Blank — three passages, three progressively harder recall passes, multiple choice in Seeker and timed typing in Growth.

The supplied specification informs content and interactions. The user's explicit asset request overrides its suggested line-art visual direction. UI uses parchment, purple, gold, supplied cartoon icons, supplied button textures, and pixel-art environments. Scene illustrations are imaginative, not historical reconstructions. Prayer lines and story summaries are original paraphrases. Quoted passages are labeled KJV.

## Progress

Mode, sound preference, best scores, completion counts, daily streaks, garden growth, mastered verses, and optional reflections are stored in this browser under `kairos-learning-v2`. There are no accounts, server storage, or cross-device sync. Storage failures degrade to session-only progress. The previous game's storage is not reused.

Seeker mode has no deadline. Growth adds an elapsed-time indicator, a verse score time penalty, timed wisdom sorting, and timed Psalm recall. Pause and hidden tabs suspend game clocks; prayer speech pauses with the pause control. The garden, geography, and prayer games retain forgiving retries.

## Checks

```sh
npm test
node --check dist/app.js
node --check dist/games.mjs
# With Playwright and Chrome available, and the local server running:
node tests/browser-check.mjs
```

Browser checks complete all ten games and verify alternate branches, retry behavior, persistence, safe rendering of reflection text, pause/resume, Growth typing, mobile overflow, and runtime errors.

## Files

- `dist/index.html`, `dist/styles.css`: shell, responsive styling, and supplied asset composition.
- `dist/app.js`: navigation, persistence, pause, audio cues, and shared results/journal.
- `dist/games.mjs`: ten independent gameplay modules, each completing through the shell callback.
- `dist/content.mjs`: canonical verse bank, story arcs, scenarios, and game metadata.
- `dist/learning-engine.mjs`: pure scoring, ordering, progression, and recall helpers.
- `ARTWORK.md`: asset provenance and supplied license limitations.

The old mini-game implementations, generated world/ark artwork, downloaded asset bundle, and obsolete tests have been removed. The unrelated `src/ChristmasGift.java` and IDE files are preserved.
