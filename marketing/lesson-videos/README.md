# EzIQ lesson videos

Animated, narrated lesson videos built from the app's own lesson cards (1920×1080, 30 fps, MP4).

```
npm install                    # once
node voice.mjs chem-2.2        # narration  -> out/chem-2.2/voice.wav, timings.json, captions.srt
node render.mjs chem-2.2       # picture + sound -> out/chem-2.2/chem-2.2.mp4   (about 15 minutes)
node render.mjs chem-2.2 --stills 44,78,128   # quick still frames into stills/chem-2.2/
node publish.mjs chem-2.2      # upload to R2 (eziq/videos/<unit name>/<lesson name>/) and list it in the app
```

Preview with sound: open `player/index.html?lesson=chem-2.2` in Chrome (add `&t=60` to start at 60 s).

## A lesson = two files in `lessons/<lesson-id>/`

- `script.mjs`: the narration, one entry per sentence, grouped into scenes. Every fact must come
  from the lesson in `app/src/content/`. `say` is what the voice reads (spell numbers and formulas
  out), `cap` is what the captions show.
- `scenes.js`: the pictures, one `EZ.scene(id, …)` per scene. Elements appear on a sentence with
  `data-at="2"` (see the notes at the top of `player/engine.js`). The intro, outro, logo bar,
  progress bar and trademark notice come from the engine, so every video carries the same branding.

Change the words → run `voice.mjs` again (only changed sentences are re-spoken), then `render.mjs`.
Change only the pictures → `render.mjs`.

## Voice

Kokoro (open model, Apache-2.0), run on this computer; nothing is sent to an outside service.
Voice is set per lesson (`voice: 'am_michael'`). Other male voices to try:
`am_fenrir`, `am_puck`, `am_eric`, `am_adam`, `bm_george` (British), `bm_fable` (British):
`node voice.mjs chem-2.2 --voice am_fenrir`.

## Publishing

`publish.mjs` uploads the video, poster, captions and working files to the R2 bucket `eziq` and adds the
lesson to `app/public/videos.json`. A lesson listed there opens on a Play / Text choice; the Worker
serves the files at `/media/videos/…`. The live site shows it after the next `npm run deploy` in `app/`.

To have a whole lesson made end to end, ask for the `eziq-lesson-video` agent (`.claude/agents/`).
