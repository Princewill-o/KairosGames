# Library integration

Detected: existing vanilla ES modules, hash routing, npm, authored source in public/, esbuild Worker output in dist/, Cloudflare D1 for the existing chapter game. No Expo or React Native runtime. Preserve this working host; the older static-dist guide is stale. The supplied pack is product reference, not a request to replace the host with React Native. Pure deterministic ES modules adapt its engine contract; no native packages or cloud multiplayer service are introduced.

Five arcade games mount at #arcade/<game-id>, with profile at #profile. Existing #play/* and #multiplayer routes remain available. Character art is original, generated for this request. Handmade controls use the supplied Bakudas PNG assets.

Browser LAN uses a laptop relay, with no database and no internet requirement. Run `npm run lan`, open the printed HTTP address on devices sharing the same trusted Wi-Fi, and enter the printed six-character room code in This Wi-Fi. The relay serves the complete game library as well as WebSockets, avoiding HTTPS mixed-content problems. Browsers cannot discover UDP beacons; host address + code is the explicit fallback. Native multicast discovery is not claimed. Closing the host elects the next member; surviving clients resume the newest snapshot. A disconnected player sees a recovery screen.

Guest progress is explicitly device-local. Normal accounts use the existing Sites platform's Sign in with ChatGPT flow and per-user D1 saves. Local preview cannot initiate platform sign-in; guest play remains fully available. No passwords or child email addresses are collected by the app.

The supplied pack references four missing game detail files (Ark, Chase, Galilee, Sheep). Their available phase prompts, architecture and library spec define the implemented loops. The Plague Party detail file is present. Phase 10 Supabase is optional and not part of this implementation.
