# Kairos game library agent guide

This directory contains the standalone Scripture & Play game site, not the church-administration monorepo described in an earlier supplied guide. Inspect running code before applying monorepo conventions.

Read README.md, DESIGN.md, and ARTWORK.md before substantial changes. Authored static source lives in dist/; no build is needed. Keep each game independent in games.mjs, shared content in content.mjs, and pure rules in learning-engine.mjs. The shell owns navigation, local persistence, pause, and completion.

Write failing tests before changing behavior. Run npm test and relevant browser flows. Keep drag alternatives, keyboard controls, reduced motion, non-canon labels, and local-storage failure handling. Do not replace the supplied assets with generated art unless requested. Preserve asset provenance and license files.

Keep unrelated legacy Java and IDE files untouched. Site identity is in .openai/hosting.json. Never operate on a parent Git repository when publishing this site.
