# Supplied artwork

This rebuild uses the user's three local packs, rather than the previous generated illustrations.

- `dist/assets/icons/`: selected, resized PNGs from `Free Cartoon Icon Pack (1)`. The source names are retained. No license text was included in the supplied folder; no additional rights are asserted here.
- `dist/assets/ui/`: selected purple, yellow, green, and white assets from `cartoon_ui_pack`. File names identify palette and original purpose. No license text was included in the supplied folder.
- `dist/assets/fantasy/`: selected assets from `Cute_Fantasy_Free`. Player, sheep, and chicken are first-frame crops of the supplied sprite sheets; the other PNGs are copied directly. Its supplied `read_me.txt` is retained as `LICENSE.txt`.

The Cute Fantasy Free license permits non-commercial projects and modification, and prohibits redistributing or reselling the asset pack. This is a non-commercial game prototype; do not sell or redistribute the pack as a standalone asset product. Obtain the appropriate commercial license before commercial use.

Environments are composed in HTML/CSS using the supplied sprites; the journey map is a purpose-built approximate SVG diagram. No remote imagery or newly generated artwork is required.

## Kairos Games opening screen

`public/assets/intro/poster.webp` is a web-optimized copy of the user-supplied `Gemini_Generated_Image_6gl2736gl2736gl2.jpeg`. `public/assets/intro/intro.mp4` is a streaming-optimized H.264/AAC copy of the supplied `make_the_bird_and_the_backgrou.mp4` (approximately 10 seconds). The original files in Downloads are unchanged.

The fullscreen overlay is isolated in `public/intro.css` and `public/intro.mjs`, mounted by `public/index.html`. Pressing the image starts the video with its audio; completion fades into the mounted site. Portrait screens preserve the complete artwork over a blurred fullscreen backdrop. Skip, keyboard activation, reduced-motion fades, and playback-error recovery are supported. `server/intro-media.mjs` handles media byte ranges for streaming and seeking.
