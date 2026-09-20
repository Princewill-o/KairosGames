# Kairos Unity template checkpoint

## Revised selection from the supplied game-specific shortlist

These five remote forks supersede the generic platformer/mobile choices below as the primary arcade references. All are unmodified upstream samples; none is integrated or runtime-tested in Kairos yet.

| Game / shared system | Fork and upstream | Recorded Editor | License / adaptation |
| --- | --- | --- | --- |
| Lost Sheep and shared LAN networking | [Kairos-Unity-Coop](https://github.com/Princewill-o/Kairos-Unity-Coop), from [Boss Room](https://github.com/Unity-Technologies/com.unity.multiplayer.samples.coop) | 6000.0.52f1; NGO 2.4.3; Transport 2.5.1 | Unity Companion License for Unity-dependent projects. Reuse host-authoritative networking patterns; implement sheep, shepherd and wolf rules ourselves. |
| Ark Park | [Kairos-Ark-Park](https://github.com/Princewill-o/Kairos-Ark-Park), from [unity-2dcollectables](https://github.com/bengreenier/unity-2dcollectables) | 5.6.0f3 | MIT. Small collection library, not a complete pet game. Adapt scripts into a modern project; add tap input, animal pair validation and rounds. |
| Pharaoh Chase | [Kairos-Pharaoh-Chase](https://github.com/Princewill-o/Kairos-Pharaoh-Chase), from [AwesomeRunner](https://github.com/VladimirPirozhenko/AwesomeRunner) | 2021.3.6f1 | MIT in LICENCE.md. Pooling and state-machine reference. Review input, lane mechanics and assets before adapting. Repository reports about 518 MiB; keep remote for now. |
| Lake Galilee | [Kairos-Lake-Galilee](https://github.com/Princewill-o/Kairos-Lake-Galilee), from [CozyFishingGame](https://github.com/bekker-volodymyr/CozyFishingGame) | 2022.3.11f1 | MIT. Hold-to-cast, bite reaction and reel-control loop; existing Edit Mode tests. Includes DOTween and separately sourced audio whose licenses must be retained/reviewed. |
| Plague Party | [Kairos-Plague-Party](https://github.com/Princewill-o/Kairos-Plague-Party), from [Tumble-Guys](https://github.com/AkshayKappala/Tumble-Guys) | 2022.1.17f1; NGO 1.0.2 | MIT. Obstacle and movement reference; currently Relay-based, advertised four-player sessions. Direct LAN and eight-player support need implementation and tests. |

Use NGO as a version-pinned package dependency rather than forking its whole SDK. Boss Room provides the networking reference baseline; do not merge old manifests into it. Tumble Guys references Boss Room's moving main branch, which needs pinning to a compatible revision before reproducible baseline testing. A fresh Unity 6 project with selected mechanics is preferable to combining all sample projects, render pipelines and dependencies wholesale. Preserve the requested 2D presentation; 3D samples supply mechanical references, not an automatic change in art direction.

### LAN and browser boundary

Boss Room documents direct-IP connections and eight-player host-as-server play. Native clients on a reachable LAN can use direct transport without Relay. Same Wi-Fi alone does not guarantee connectivity: client isolation and firewalls can block it. Cloud lobby services are separate from direct LAN connections and should not be required for offline LAN mode.

Unity Transport's default native transport uses UDP. A Web build cannot directly listen as a UDP host. Browser clients need a compatible WebSocket-capable native server, or a supported relay path. This requires a build and device test; it is not solved just by importing NGO. See [Unity Transport Web support](https://docs.unity.cn/Packages/com.unity.transport%402.3/manual/websockets.html) and [Boss Room connectivity documentation](https://github.com/Unity-Technologies/com.unity.multiplayer.samples.coop#testing-multiplayer).

### Shortlist findings

- No repository license was detected for StumbleClone, owengretzinger/hide-and-seek, Runner-3D, the ML-Agents Hide-and-Seek project, Ev0gs' lobby template or Kudoshi's facade template. Public visibility alone does not establish permission to reuse their code. These were not selected for incorporation.
- modori1208/codename-hide-and-seek has an MIT license and records Unity 6000.0.48f1, but includes Photon, third-party assets, and credits the original hide-and-seek project. Its README says its Photon App ID is retired after the presentation. Use Boss Room and original Kairos role logic instead of taking on that migration and provenance uncertainty.
- Shahzaib52's MIT runner is smaller but records Unity 2019.3.0f6 and lists jump/duck as future work. It remains an alternative, not the primary runner fork.
- GitHub repository-size metadata excludes some practical storage costs, notably LFS downloads and Unity imports. Boss Room uses Git LFS, so its small reported Git size is not its full working size.

### First executable milestone

On a machine with Unity Editor and adequate storage, first run Boss Room's direct-IP baseline with two native clients. Then validate one Lost Sheep round with authoritative roles, movement, catch/rescue, timeout, disconnect handling and restart. Test eight clients and touch controls before claiming eight-player mobile support. Separately build Lake Galilee's solo loop and run its Edit Mode tests. Browser integration and WebSocket LAN testing follow those baselines. No Unity test results are claimed at this checkpoint.

## Earlier general-purpose options

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
