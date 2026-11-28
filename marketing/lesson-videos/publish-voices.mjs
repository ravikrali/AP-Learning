// Publishes extra narrator voices for lesson videos that are already published.
// The re-voiced MP4s are made by docs/voice-rollout/revoice.mjs (same pictures, new narration) and live in
// docs/voice-rollout/out/<lesson>/<lesson>.<voice label>.mp4. Each one goes into the lesson's existing R2 folder,
// next to the original, and app/public/videos.json gets  "voices": { "<voice id>": "media/.../<file>.mp4" }.
// Captions and poster are shared: the words and pictures are the same in every voice.
//
//   node publish-voices.mjs --voices heart,fenrir --lessons stats-        every Statistics lesson
//   node publish-voices.mjs --voices kore --lessons stats-3.2 --local     wrangler's local bucket, for testing
// The app shows the voices after the next deploy (cd app; npm run deploy).
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const app = path.join(here, '..', '..', 'app')
const rollout = path.join(here, '..', '..', 'docs', 'voice-rollout', 'out')
const BUCKET = 'eziq'
// app voice id -> file label used by revoice.mjs (names match VIDEO_VOICES in app/src/components/bits.tsx)
const LABELS = { heart: 'kokoro-af-heart', fenrir: 'kokoro-am-fenrir', kore: 'gemini-kore' }

const args = process.argv.slice(2)
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const local = args.includes('--local')
const voices = (opt('--voices') ?? '').split(',').filter(Boolean)
for (const v of voices) if (!LABELS[v]) throw new Error(`unknown voice ${v}; known: ${Object.keys(LABELS).join(', ')}`)
const sel = (opt('--lessons') ?? '').split(',').filter(Boolean)
if (!voices.length || !sel.length) throw new Error('usage: node publish-voices.mjs --voices heart,fenrir --lessons stats- [--local]')

const listPath = path.join(app, 'public', 'videos.json')
const list = JSON.parse(readFileSync(listPath, 'utf8'))
const ids = Object.keys(list).filter((id) => !id.startsWith('_') && sel.some((s) => (s.endsWith('-') ? id.startsWith(s) : id === s)))
const wrangler = path.join(app, 'node_modules', 'wrangler', 'bin', 'wrangler.js')
let n = 0
for (const id of ids) {
  const e = list[id]
  if (!e.src?.startsWith('media/')) { console.log(`${id}: not one of our R2 videos, skipped`); continue }
  const orig = path.join(here, 'out', id, `${id}.mp4`)
  for (const v of voices) {
    const file = path.join(rollout, id, `${id}.${LABELS[v]}.mp4`)
    if (!existsSync(file)) { console.log(`${id}: no ${v} file yet, skipped`); continue }
    if (existsSync(orig) && statSync(file).mtimeMs < statSync(orig).mtimeMs) { console.log(`${id}: ${v} is older than the video (re-rendered since), skipped`); continue }
    const key = e.src.replace(/^media\//, '').replace(/[^/]+$/, `${id}.${LABELS[v]}.mp4`)
    execFileSync(process.execPath, [wrangler, 'r2', 'object', 'put', `${BUCKET}/${key}`, '--file', file, '--content-type', 'video/mp4', local ? '--local' : '--remote'], { cwd: app, stdio: ['ignore', 'ignore', 'inherit'] })
    e.voices = { ...(e.voices ?? {}), [v]: `media/${key}` }
    n++
    console.log(`${local ? 'local' : 'R2'}: ${BUCKET}/${key}  (${(statSync(file).size / 1e6).toFixed(1)} MB)`)
  }
  writeFileSync(listPath, JSON.stringify(list, null, 2) + '\n') // after every lesson, so a stopped run keeps what it uploaded
}
console.log(`${n} files published; app/public/videos.json updated`)
