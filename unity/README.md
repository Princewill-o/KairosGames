# Unity migration checkpoint — NOT a built game

Unity Hub is installed on this Mac, but no Unity Editor was found under Applications, Users/Shared, or mounted volumes. Free disk space was 0.5–1 GB on 2026-09-20. No Editor installation or Unity compilation was attempted because there is insufficient space. The Hub headless installed-editor query did not return a result.

KairosAdventures is a minimal Unity 6.3 project seed and four-frame SpriteRenderer animation component, not a completed game port. It has NOT been compiled or tested in Unity. Existing browser games remain the playable checkpoint.

Next: free 15–20 GB or select an external drive, install Unity 6.3 LTS with Web Build Support, import the reusable sprites from ../../public/assets/arcade, then port and test one complete game before migrating the remaining four. Preserve guest/account saves and mobile touch controls. Do not replace the working browser library with an untested export.

Source sprite atlas: walk.png is four columns by four character rows. Row order: Ezra, Mira, Theo, Lumi. The animation component slices four poses per character. creatures.png is four columns by four rows. All art was generated for this request; original supplied UI buttons remain under public/assets/handmade.
