// Publishes a rendered lesson video: uploads it and everything it was made from to the R2 bucket
// "eziq", and lists it in the app so the lesson page offers Play / Text.
//
//   videos/<unit name>/<lesson name>/        e.g. videos/chem-u2-compound-structure-and-properties/chem-2.2-bonds-and-potential-energy/
//     <lesson>.mp4, poster.jpg, captions.vtt   what the lesson page plays (served by the Worker at /media/videos/…)
//     captions.srt                             for YouTube
//     voice.wav, timings.json, script.mjs, scenes.js   the working files, kept with the video
//
//   node publish.mjs chem-2.2            upload to Cloudflare and update app/public/videos.json
//   node publish.mjs chem-2.2 --local    the same into wrangler's local bucket, for testing with `npm run dev:api`
// The app shows the video after the next deploy (cd app; npm run deploy). Needs `wrangler login` once.
import ffmpeg from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const app = path.join(here, '..', '..', 'app')
const BUCKET = 'eziq'
const lesson = process.argv[2]
if (!lesson) throw new Error('usage: node publish.mjs <lesson-id> [--local]')
const local = process.argv.includes('--local')
const script = (await import(pathToFileURL(path.join(here, 'lessons', lesson, 'script.mjs')).href)).default
const out = path.join(here, 'out', lesson)
const mp4 = path.join(out, `${lesson}.mp4`)
if (!existsSync(mp4)) throw new Error(`render it first: node render.mjs ${lesson}`)
const timings = JSON.parse(readFileSync(path.join(out, 'timings.json'), 'utf8'))
if (statSync(mp4).mtimeMs < statSync(path.join(out, 'timings.json')).mtimeMs) throw new Error('the video is older than its narration: run render.mjs again')

const slug = (s) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')
if (!script.unitId || !script.unitTitle) throw new Error('script.mjs needs unitId and unitTitle')
const folder = `videos/${slug(`${script.unitId} ${script.unitTitle}`)}/${slug(`${script.id} ${script.title}`)}`

// poster: the title card, just before the intro ends
const poster = path.join(out, 'poster.jpg')
execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', String(Math.max(0, timings.scenes[0].end - 1.2)), '-i', mp4, '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', poster])
// captions for the app's player (WebVTT)
const ts = (s) => { const ms = Math.round(s * 1000), p = (v, k = 2) => String(v).padStart(k, '0')
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}.${p(ms % 1000, 3)}` }
writeFileSync(path.join(out, 'captions.vtt'), 'WEBVTT\n\n' + timings.scenes.flatMap((s) => s.beats).map((b) => `${ts(b.start)} --> ${ts(b.end + 0.15)}\n${b.cap}\n`).join('\n'))

const files = [
  [mp4, `${lesson}.mp4`, 'video/mp4'],
  [poster, 'poster.jpg', 'image/jpeg'],
  [path.join(out, 'captions.vtt'), 'captions.vtt', 'text/vtt'],
  [path.join(out, 'captions.srt'), 'captions.srt', 'text/plain'],
  [path.join(out, 'voice.wav'), 'voice.wav', 'audio/wav'],
  [path.join(out, 'timings.json'), 'timings.json', 'application/json'],
  [path.join(here, 'lessons', lesson, 'script.mjs'), 'script.mjs', 'text/javascript'],
  [path.join(here, 'lessons', lesson, 'scenes.js'), 'scenes.js', 'text/javascript'],
]
const wrangler = path.join(app, 'node_modules', 'wrangler', 'bin', 'wrangler.js')
for (const [file, name, type] of files) {
  execFileSync(process.execPath, [wrangler, 'r2', 'object', 'put', `${BUCKET}/${folder}/${name}`, '--file', file, '--content-type', type, local ? '--local' : '--remote'], { cwd: app, stdio: ['ignore', 'ignore', 'inherit'] })
  console.log(`${local ? 'local' : 'R2'}: ${BUCKET}/${folder}/${name}  (${(statSync(file).size / 1e6).toFixed(1)} MB)`)
}

// list it in the app: the lesson page then opens on Play / Text
const listPath = path.join(app, 'public', 'videos.json')
const list = JSON.parse(readFileSync(listPath, 'utf8'))
list[lesson] = { src: `media/${folder}/${lesson}.mp4`, poster: `media/${folder}/poster.jpg`, captions: `media/${folder}/captions.vtt`, title: script.title, seconds: Math.round(timings.dur) }
writeFileSync(listPath, JSON.stringify(list, null, 2) + '\n')
console.log(`app/public/videos.json: ${lesson} -> media/${folder}/${lesson}.mp4`)
