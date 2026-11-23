// contact sheet of a finished lesson video: one frame just before the end of every scene
//   node sheet.mjs chem-0.6   -> marketing/lesson-videos/stills/<id>/sheet.jpg
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
const root = 'C:/Users/PC3/OneDrive/01Projects/AP Learning/marketing/lesson-videos/'
const require = createRequire(root + 'package.json')
const ffmpeg = require('ffmpeg-static')
const id = process.argv[2]
const t = JSON.parse(readFileSync(`${root}out/${id}/timings.json`, 'utf8'))
const times = t.scenes.map((s, i) => (i === t.scenes.length - 1 ? t.dur - 0.5 : s.end - 1.0))
const dir = `${root}stills/${id}/`
mkdirSync(dir, { recursive: true })
const args = ['-y', '-loglevel', 'error']
for (const s of times) args.push('-ss', s.toFixed(2), '-i', `${root}out/${id}/${id}.mp4`)
const n = times.length, cols = n > 9 ? 4 : 3, W = cols === 4 ? 480 : 640, H = (W * 9) / 16
const layout = times.map((_, i) => `${(i % cols) * W}_${Math.floor(i / cols) * H}`).join('|')
args.push('-filter_complex', times.map((_, i) => `[${i}:v]scale=${W}:${H}[v${i}]`).join(';') + ';' + times.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${n}:layout=${layout}:fill=black`, '-frames:v', '1', '-q:v', '3', dir + 'sheet.jpg')
execFileSync(ffmpeg, args, { stdio: 'inherit' })
console.log(`${id}: ${t.scenes.map((s) => s.id).join(' ')} | ${(t.dur / 60).toFixed(1)} min`)
