// video bitrate per scene of a finished lesson: node rate.mjs chem-3.2
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const root = 'C:/Users/PC3/OneDrive/01Projects/AP Learning/marketing/lesson-videos/'
const ffmpeg = createRequire(root + 'package.json')('ffmpeg-static')
const id = process.argv[2]
const t = JSON.parse(readFileSync(`${root}out/${id}/timings.json`, 'utf8'))
for (const s of t.scenes) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-ss', String(s.start), '-t', String(s.end - s.start), '-i', `${root}out/${id}/${id}.mp4`, '-an', '-c', 'copy', '-f', 'null', '-'])
  const kb = +(String(r.stderr).match(/video:\s*([\d.]+)\s*k/i) ?? [, 0])[1]
  console.log(s.id.padEnd(11), ((kb * 8.192) / 1000 / (s.end - s.start)).toFixed(2), 'Mbit/s', (kb / 1024).toFixed(1), 'MB')
}
