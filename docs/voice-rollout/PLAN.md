# Voice rollout plan: Heart, Fenrir and Kore

*Started 2026-11-26. Follows [voiceover-options.md](../specs/voiceover-options.md) and the stats-3.2 pilot in [voice-pilot](../voice-pilot/).*

## The voices

| Key | Student-facing name (proposed) | Engine | Accent | Cost |
|---|---|---|---|---|
| `kokoro-af-heart` | Heart | Kokoro af_heart, runs on this PC | American, female | $0 |
| `kokoro-am-fenrir` | Fenrir | Kokoro am_fenrir, runs on this PC | American, male | $0 |
| `gemini-kore` | Kore | Google Gemini TTS Flash, voice Kore, "warm upbeat tutor" style | American, female | about $0.06 per lesson |
| (today) | Michael | Kokoro am_michael | American, male | stays as the default until the new voices are live |

Names are placeholders; pick any you like (for example "Maya", "Leo", "Kora").

## How it works (no re-render)

`revoice.mjs` (this folder) does for any lesson what the pilot did for stats-3.2: each new sentence starts exactly when
today's sentence starts, is sped up by at most 15% if it would run past its slot, and the new narration is swapped into a
copy of the existing MP4. Pictures and captions are unchanged, so one `captions.vtt` and `poster.jpg` serve every voice.
Sentences are cached per voice, so if a lesson's script changes later only the changed sentences are re-spoken.

```
cd docs/voice-rollout
node revoice.mjs --voices kokoro-af-heart,kokoro-am-fenrir,gemini-kore --lessons stats-
node revoice.mjs --lessons chem-          # later, after your OK
```

Outputs: `out/<lesson>/<lesson>.<voice>.mp4` (about 9 MB each), `RESULTS.md` (timing report), `index.html` (watch and
compare every lesson with all voices, open it from this folder in a browser).

## Phase 1: Statistics (63 lessons), in progress

Everything stays in `docs/voice-rollout/`. Nothing in the app, R2 or the live site changes in this phase.
Estimated: $0 for Heart and Fenrir, about $3.50 for Kore. About 190 MP4s, about 1.7 GB on disk (OneDrive will sync it).

## Phase 2: publish and let students choose (needs your OK, touches code outside docs)

These steps change files outside `docs/` or the live site, so they wait for you.

1. **Upload** each voice next to today's video in R2, same folder:
   `eziq/videos/<unit>/<lesson>/<lesson>.<voice>.mp4`. A small change to `marketing/lesson-videos/publish.mjs`
   (or a separate `publish-voices.mjs`) using the same `wrangler r2 object put` call. Storage: about $0.02 a month per voice.
2. **List them** in `app/public/videos.json`: each lesson gains
   `"voices": { "heart": "media/.../stats-3.2.kokoro-af-heart.mp4", "fenrir": "...", "kore": "..." }`. `src` stays as
   today, so older app versions keep working.
3. **Voice picker in the app** (`app/src/components/bits.tsx`):
   - `VideoEntry` gains `voices?: Record<string, string>`.
   - `VideoPlayer` shows a small "Voice" menu next to the captions button when `voices` exists: Michael, Heart, Fenrir, Kore.
   - Switching keeps the playback position (read `currentTime`, swap `src`, seek, resume if it was playing).
   - The choice is remembered in `localStorage` (`eziq.voice`) and, when signed in, in the student's settings, so every lesson uses it.
   - Optional: "Narrator voice" in Settings, and a count of which voice students choose.
4. **Deploy** (`cd app; npm run deploy`) after you have checked it on the dev server.

Effort: about 2 to 3 hours of work, a fraction of one 5-hour Claude window.

## Phase 3: Chemistry (98 lessons), after your OK

Same command with `--lessons chem-`. About $7 for Kore, $0 for the Kokoro voices, about 5 to 8 hours of unattended machine time.
Gemini TTS is a preview model and its price roughly doubles on 1 Jan 2027, so doing Kore before then saves a few dollars.

## Watch-outs

- **Kore speaks about 15% slower than today's voice**, so many sentences get sped up a little and a few start up to about
  half a second after their picture. `RESULTS.md` lists every lesson where the lag reaches 0.75 s; those are the ones to spot-check.
- **New or re-rendered lessons** (for example from the Statistics video thread): run `revoice.mjs` again for that lesson
  after its final render. It refuses a lesson whose video is older than its narration.
- **Pronunciation** ("p hat", "mu sub d", chemical names) is not checked automatically; listen on the review page.
