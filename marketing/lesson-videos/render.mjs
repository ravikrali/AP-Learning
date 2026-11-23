// Renders a lesson video to out/<lesson>/<lesson>.mp4 (1920×1080, 30 fps): steps the player one
// frame at a time, screenshots it, pipes the frames into ffmpeg, then adds the narration.
//   node render.mjs chem-2.2                  the full video
//   node render.mjs chem-2.2 --stills 5,42.5  PNG stills at those seconds (into stills/), for a quick look
//   node render.mjs chem-2.2 --from 60 --to 75   only part of it (picture only, for checking motion)
// Encoder settings were chosen by test (slow, crf 20, tune animation; 96k mono voice): about 40% smaller
// than medium/crf 18 with the same measured picture quality (SSIM 0.998).
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const lesson = process.argv[2]
if (!lesson) throw new Error('usage: node render.mjs <lesson-id> [--stills 1,2,3]')
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null }
const FPS = 30
const out = path.join(here, 'out', lesson)

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1 })
await page.goto(pathToFileURL(path.join(here, 'player', 'index.html')).href + `?lesson=${lesson}&capture`)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(400)
const seek = (ms) => page.evaluate((t) => new Promise((done) => { window.seek(t); requestAnimationFrame(() => requestAnimationFrame(done)) }), ms)
const dur = (await page.evaluate(() => window.DUR)) / 1000

if (arg('--stills')) {
  const dir = path.join(here, 'stills', lesson)
  mkdirSync(dir, { recursive: true })
  for (const s of arg('--stills').split(',').map(Number)) {
    await seek(s * 1000)
    await page.screenshot({ path: path.join(dir, `t${s.toFixed(1).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 88 })
  }
  await browser.close()
  process.exit()
}

const from = +(arg('--from') ?? 0), to = +(arg('--to') ?? dur), part = from > 0 || to < dur
const silent = path.join(out, 'picture.tmp.mp4')
const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-color_range', 'tv', silent], { stdio: ['pipe', 'inherit', 'inherit'] })
const n0 = Math.round(from * FPS), n1 = Math.round(to * FPS)
for (let i = n0; i < n1; i++) {
  await seek((i * 1000) / FPS)
  const img = await page.screenshot({ type: 'jpeg', quality: 96 })
  if (!ff.stdin.write(img)) await once(ff.stdin, 'drain')
  if ((i - n0) % 300 === 0) console.log(`frame ${i - n0}/${n1 - n0}`)
}
ff.stdin.end()
await once(ff, 'close')
await browser.close()

const final = path.join(out, part ? `${lesson}-part.mp4` : `${lesson}.mp4`)
const mux = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-i', silent, '-ss', String(from), '-i', path.join(out, 'voice.wav'),
  '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000', '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' })
await once(mux, 'close')
rmSync(silent)
console.log('wrote', final)
