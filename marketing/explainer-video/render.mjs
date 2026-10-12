// Renders index.html to one MP4 per music option (aplearning-explainer-<track>.mp4): seeks the page one frame
// at a time, screenshots it, pipes the frames into ffmpeg, then adds each music-<track>.wav to the picture.
//   node render.mjs                 full video, all music options
//   node render.mjs --stills 1,5,9  PNG stills at those seconds (into stills/), for a quick look
import { chromium } from 'playwright-core'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const FPS = 30
const TRACKS = ['ukulele', 'bounce', 'lofi']
const SILENT = path.join(here, 'picture.tmp.mp4')

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(path.join(here, 'index.html')).href + '?capture')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
const seek = (ms) => page.evaluate((t) => new Promise((done) => { window.seek(t); requestAnimationFrame(() => requestAnimationFrame(done)) }), ms)

const stillsAt = process.argv.indexOf('--stills')
if (stillsAt > 0) {
  mkdirSync(path.join(here, 'stills'), { recursive: true })
  for (const s of process.argv[stillsAt + 1].split(',').map(Number)) {
    await seek(s * 1000)
    await page.screenshot({ path: path.join(here, 'stills', `t${s.toFixed(2).padStart(5, '0')}.png`) })
  }
  await browser.close()
  process.exit(0)
}

const dur = await page.evaluate(() => window.DUR)
const frames = Math.round((dur / 1000) * FPS)
const ff = spawn(ffmpeg, [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', SILENT,
], { stdio: ['pipe', 'inherit', 'inherit'] })

for (let i = 0; i < frames; i++) {
  await seek((i * 1000) / FPS)
  const png = await page.screenshot({ type: 'png' })
  if (!ff.stdin.write(png)) await once(ff.stdin, 'drain')
  if (i % 90 === 0) console.log(`frame ${i}/${frames}`)
}
ff.stdin.end()
await once(ff, 'close')
await browser.close()
for (const track of TRACKS) {
  const out = path.join(here, `aplearning-explainer-${track}.mp4`)
  const mux = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-i', SILENT, '-i', path.join(here, `music-${track}.wav`),
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur / 1000), '-movflags', '+faststart', out], { stdio: 'inherit' })
  await once(mux, 'close')
  console.log('wrote', out)
}
rmSync(SILENT)
