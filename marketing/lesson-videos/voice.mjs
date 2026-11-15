// Reads a lesson script aloud with a local neural voice (Kokoro, Apache-2.0, runs offline after the
// first model download) and writes, into out/<lesson>/:
//   voice.wav      the whole narration
//   timings.json   when every scene and sentence starts and ends (the picture is cued from this)
//   captions.srt   subtitles for YouTube
//   node voice.mjs chem-2.2 [--voice am_michael]
import { KokoroTTS } from 'kokoro-js'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const lesson = process.argv[2]
if (!lesson) throw new Error('usage: node voice.mjs <lesson-id>')
const script = (await import(pathToFileURL(path.join(here, 'lessons', lesson, 'script.mjs')).href)).default
const vAt = process.argv.indexOf('--voice')
const voice = vAt > 0 ? process.argv[vAt + 1] : script.voice
const speed = script.speed ?? 1
const SR = 24000
const cache = path.join(here, '.cache', 'voice')
const out = path.join(here, 'out', lesson)
mkdirSync(cache, { recursive: true }); mkdirSync(out, { recursive: true })

let tts
async function speak(text) {
  const key = createHash('sha1').update(`${voice}|${speed}|${text}`).digest('hex').slice(0, 16)
  const file = path.join(cache, key + '.f32')
  if (existsSync(file)) { const b = readFileSync(file); return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)) }
  tts ??= await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'fp32', device: 'cpu' })
  const a = await tts.generate(text, { voice, speed })
  if (a.sampling_rate !== SR) throw new Error('unexpected sample rate ' + a.sampling_rate)
  const pcm = trim(a.audio)
  writeFileSync(file, Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength))
  return pcm
}
// cut the silence the model leaves at both ends, so the gaps are the ones the script asks for
function trim(x) {
  const th = 0.008, pad = Math.round(0.03 * SR)
  let a = 0, b = x.length - 1
  while (a < b && Math.abs(x[a]) < th) a++
  while (b > a && Math.abs(x[b]) < th) b--
  return x.slice(Math.max(0, a - pad), Math.min(x.length, b + pad))
}

const parts = [], scenes = []
let n = 0
const silence = (s) => { const k = Math.round(s * SR); parts.push(new Float32Array(k)); n += k }
for (const sc of script.scenes) {
  const s0 = n / SR
  silence(sc.lead ?? 0.5)
  const beats = []
  for (const b of sc.beats) {
    const pcm = await speak(b.say)
    beats.push({ start: n / SR, end: (n + pcm.length) / SR, cap: b.cap ?? b.say })
    parts.push(pcm); n += pcm.length
    silence(b.gap ?? 0.35)
    process.stdout.write('.')
  }
  silence(sc.tail ?? 0)
  scenes.push({ id: sc.id, start: s0, end: n / SR, beats })
}
const all = new Float32Array(n)
let o = 0
for (const p of parts) { all.set(p, o); o += p.length }
// normalise to a peak of about -1 dB
let peak = 0
for (const v of all) peak = Math.max(peak, Math.abs(v))
const g = 0.89 / peak
const wav = Buffer.alloc(44 + n * 2)
wav.write('RIFF', 0); wav.writeUInt32LE(36 + n * 2, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28)
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(n * 2, 40)
for (let i = 0; i < n; i++) wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, all[i] * g)) * 32767), 44 + i * 2)
writeFileSync(path.join(out, 'voice.wav'), wav)

const dur = n / SR
const meta = { id: script.id, title: script.title, course: script.course, unit: script.unit, voice, dur, scenes }
writeFileSync(path.join(out, 'timings.json'), JSON.stringify(meta, null, 1))
writeFileSync(path.join(out, 'timings.js'), 'window.TIMINGS = ' + JSON.stringify(meta) + '\n')
const ts = (s) => { const ms = Math.round(s * 1000); const p = (v, k = 2) => String(v).padStart(k, '0')
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}` }
let i = 0
writeFileSync(path.join(out, 'captions.srt'), scenes.flatMap((s) => s.beats).map((b) => `${++i}\n${ts(b.start)} --> ${ts(b.end + 0.15)}\n${b.cap}\n`).join('\n'))
console.log(`\n${lesson}: ${Math.floor(dur / 60)}:${String(Math.round(dur % 60)).padStart(2, '0')} (${voice})`)
for (const s of scenes) console.log(`  ${s.id.padEnd(8)} ${s.start.toFixed(1).padStart(6)} → ${s.end.toFixed(1).padStart(6)}`)
