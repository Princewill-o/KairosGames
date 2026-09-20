# Kairos Unity template checkpoint

Reviewed and forked on 2026-09-20. Forks remain on GitHub to conserve this computer's disk space. These are starting points, not completed Kairos games or verified Web builds.

| Purpose | Kairos fork | Upstream | Recorded Editor | License |
| --- | --- | --- | --- | --- |
| Adventure movement, animated player, tilemaps, pickups and respawning | [Kairos-Unity-Platformer](https://github.com/Princewill-o/Kairos-Unity-Platformer) | [striderzz/2D-Platformer-Unity](https://github.com/striderzz/2D-Platformer-Unity) | 2022.3.13f1 | MIT, Copyright 2023 Hasan |
| Touch input, collisions, scoring and random obstacle spawning | [Kairos-Unity-Mobile](https://github.com/Princewill-o/Kairos-Unity-Mobile) | [geraked/game-tiptop](https://github.com/geraked/game-tiptop) | 2019.2.3f1; project is in `src/` | MIT, Copyright 2019–2020 Geraked |

The GitHub API reports approximately 11,146 KB and 5,303 KB of repository storage respectively. These figures are not Unity import sizes: Editor installations, imported Library caches and export modules require additional disk space. Keep each upstream LICENSE and credit any separately licensed assets before reuse.

## Adaptation order

1. Open the platformer fork in its recorded Editor on a machine with sufficient storage. Establish a working baseline before any Editor upgrade. Record scene startup and player movement checks.
2. Build one Scroll Quest adventure level with four selectable Kairos characters, scroll pickups, a clear objective, pause and a completion screen. Add touch controls alongside keyboard input; verify movement, collisions, respawning and completion. Replace sample visuals with the requested Kairos art while retaining provenance.
3. Use the mobile fork as a reference for touch input and obstacle spawning in Pharaoh Chase. Its existing game is a vertical obstacle dodger, not a ready-made three-lane runner. Review scripts before adapting them; do not copy the entire older Unity project into the newer project.
4. Export and test a Web build before connecting it to the Kairos Hub shell. Implement explicit start, pause, completion and progress messages. Test mobile sizing, audio activation and reduced-motion settings on real target browsers.
5. Port the remaining activities incrementally. These templates do not provide Kairos accounts, Bible content, the existing multiplayer protocol, or all five arcade games. Multiplayer needs its own transport and synchronization implementation and multi-client tests.

## Verified at this checkpoint

- Read upstream README, LICENSE and ProjectVersion files through GitHub.
- Created the two public forks under Princewill-o without cloning them locally.
- Existing browser games remain the playable version. No Unity scene execution, migration, export or multiplayer verification has been performed for these templates.

The existing `unity/KairosAdventures` seed targets a different Editor version. Do not merge project settings across these projects blindly. Unity Editor is not currently installed on this computer; local free storage was approximately 1.9 GiB at the preceding checkpoint.
