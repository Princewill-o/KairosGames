# Unity source provenance

`KairosAdventures/Assets/ThirdParty/TwoDCollectables/Collectable.cs` and `ICollector.cs` are copied from [bengreenier/unity-2dcollectables](https://github.com/bengreenier/unity-2dcollectables), pinned at `3cbe058fff28f45abffd2aaf452d8aef90e2df8c`. Only BOM/newline normalization was applied. The full MIT license, Copyright (c) 2017 Ben Greenier, is retained in the same directory. `ArkCollector` implements the collection interface; the host validates proximity, round state and respawn time before scoring.

NGO 2.4.3 and Unity Transport 2.5.1 are package dependencies with their own notices. Boss Room commit `1299ba4fc97d83b634e7d32a86c438ba668d7f9c` informed the host/server and direct-IP architecture. No Boss Room source/artwork was copied; its Unity Companion License must not be described as MIT.

CozyFishingGame commit `ee3b5cfe3d3f8b603df1856df2af35dca25a1609` informed the casting/bite/reel interaction. Kairos implements this loop afresh without importing its assets, DOTween or sound packs. AwesomeRunner and Tumble Guys remain reference forks, not imported code at this checkpoint.

Other new Kairos C# and bridge code is authored for this project. Existing atlases retain the provenance in `ARTWORK.md`; Editor preparation copies them without changing the originals. Repository-level code licenses are not assumed to cover separately licensed art/audio.
