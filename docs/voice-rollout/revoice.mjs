// Voice rollout: re-voices existing lesson videos with the chosen voices, without re-rendering the pictures.
// Same method as docs/voice-pilot/pilot.mjs (proven on stats-3.2), generalised to any lesson:
// each new sentence is placed at its original start time from timings.json, sped up (max 1.15x) only if it would
// run past its slot, and the new narration is muxed into a copy of the existing MP4 (video stream copied).
//
//   node revoice.mjs --voices kokoro-af-heart --lessons stats-        every Statistics lesson, one voice
//   node revoice.mjs --voices gemini-kore --lessons stats-3.2,stats-3.3
//   node revoice.mjs --report                                         rebuild RESULTS.md + index.html only
//
// Reads (never writes) marketing/lesson-videos. Everything it makes lives under docs/voice-rollout/.
// Credentials: Gemini TTS = Google Application Default Credentials (gcloud), billed to GOOGLE_QUOTA_PROJECT,
// the same setup the pilot used. Kokoro runs locally from marketing/lesson-videos/node_modules (read only).
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { execSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const ffmpeg = createRequire(path.join(here, '..', 'voice-pilot', 'package.json'))('ffmpeg-static')
const videos = path.resolve(here, '..', '..', 'marketing', 'lesson-videos')
const SR = 24000
const MAX_TEMPO = 1.15
const BREATH = 0.12
const QUOTA_PROJECT = process.env.GOOGLE_QUOTA_PROJECT || 'project-6ed3f316-00e8-4b5a-85d'
const STYLE = 'Say this as a warm, upbeat, encouraging tutor talking to a high-school student, natural pace, not robotic.'

// The three voices picked after the pilot (2026-11-26). `name` is the student-facing label proposed for the app.
const VOICES = [
  { label: 'kokoro-af-heart', name: 'Heart', provider: 'Kokoro (local)', model: 'Kokoro-82M v1.0', voice: 'af_heart', accent: 'American', gender: 'female' },
  { label: 'kokoro-am-fenrir', name: 'Fenrir', provider: 'Kokoro (local)', model: 'Kokoro-82M v1.0', voice: 'am_fenrir', accent: 'American', gender: 'male' },
  { label: 'gemini-kore', name: 'Kore', provider: 'Google Gemini TTS', model: 'gemini-2.5-flash-tts', voice: 'Kore', lang: 'en-US', accent: 'American', gender: 'female', concurrency: 2,
    // 2026-11-28: the first Kore run (STYLE above) spoke ~15% slower than the video timings and drifted up to 4 s behind; ask for a quicker pace
    style: 'Read this at a brisk, lively pace, like an upbeat, encouraging tutor talking to a high-school student. Keep it quick and natural, with only short pauses.' },
]

// ---- lessons ----
function loadLesson(id) {
  const out = path.join(videos, 'out', id)
  const mp4 = path.join(out, `${id}.mp4`), tj = path.join(out, 'timings.json')
  if (!existsSync(mp4) || !existsSync(tj)) throw new Error('no rendered video yet')
  if (statSync(mp4).mtimeMs < statSync(tj).mtimeMs) throw new Error('video is older than its narration (re-render pending)')
  const timings = JSON.parse(readFileSync(tj, 'utf8'))
  return { id, out, mp4, timings, scriptFile: path.join(videos, 'lessons', id, 'script.mjs') }
}
async function linesOf(L) {
  const script = (await import(pathToFileURL(L.scriptFile).href + `?t=${Date.now()}`)).default
  const says = script.scenes.flatMap((s) => s.beats.map((b) => b.say))
  const beats = L.timings.scenes.flatMap((s) => s.beats)
  if (says.length !== beats.length) throw new Error('script and timings disagree on sentence count')
  return beats.map((b, i) => ({ i, say: says[i], start: b.start, origEnd: b.end, next: beats[i + 1]?.start ?? L.timings.dur }))
}

// ---- synthesis (same calls as the pilot) ----
let gToken = null
const googleToken = (fresh) => (gToken = !fresh && gToken ? gToken : execSync('gcloud auth application-default print-access-token', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim())
setInterval(() => { gToken = null }, 40 * 60e3).unref() // tokens last ~60 min
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// Gemini TTS has a per-minute request quota on this Google project (429 "requests_per_minute_per_project_per_base_model"),
// so requests are spaced out and a 429 just waits for the next minute instead of counting as a failure.
let gap = Number(process.env.GEMINI_GAP_MS || 4000), lastCall = 0, hits = 0
async function paced() { const w = lastCall + gap - Date.now(); lastCall = Math.max(Date.now(), lastCall + gap); if (w > 0) await sleep(w) }
async function withRetry(fn) {
  for (let k = 0; ; k++) {
    let r
    await paced()
    try { r = await fn() } catch (e) { if (k < 6) { await sleep(2000 * 2 ** k); continue } throw e }
    if (r.ok) return r
    const body = await r.text()
    if (r.status === 429 && k < 40) { if (++hits % 3 === 0) gap = Math.min(gap * 1.25, 15000); await sleep(20000); continue }
    if (k < 6 && (r.status >= 500 || r.status === 401)) {
      if (r.status === 401) googleToken(true)
      await sleep(2000 * 2 ** k)
      continue
    }
    throw new Error(`HTTP ${r.status}: ${body.slice(0, 400)}`)
  }
}
function s16ToF32(data) {
  const out = new Float32Array(data.length >> 1)
  for (let i = 0; i < out.length; i++) out[i] = data.readInt16LE(i * 2) / 32768
  return out
}
function wavToF32(buf) {
  let p = 12, rate = 0, data = null
  while (p + 8 <= buf.length) {
    const id = buf.toString('ascii', p, p + 4), size = buf.readUInt32LE(p + 4)
    if (id === 'fmt ') rate = buf.readUInt32LE(p + 12)
    if (id === 'data') { data = buf.subarray(p + 8, Math.min(buf.length, p + 8 + size)); break }
    p += 8 + size + (size & 1)
  }
  if (!data) throw new Error('no data chunk in WAV')
  if (rate !== SR) throw new Error('unexpected sample rate ' + rate)
  return s16ToF32(data)
}
async function google(v, text) {
  const r = await withRetry(() => fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${googleToken()}`, 'x-goog-user-project': QUOTA_PROJECT, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: { text, prompt: v.style ?? STYLE }, voice: { languageCode: v.lang, name: v.voice, modelName: v.model }, audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: SR } }),
  }))
  return wavToF32(Buffer.from((await r.json()).audioContent, 'base64'))
}
let kokoro
async function kokoroSay(v, text) {
  if (!kokoro) {
    const nm = path.join(videos, 'node_modules')
    const { env } = await import(pathToFileURL(path.join(nm, '@huggingface', 'transformers', 'dist', 'transformers.node.mjs')).href)
    env.allowRemoteModels = false
    const { KokoroTTS } = await import(pathToFileURL(path.join(nm, 'kokoro-js', 'dist', 'kokoro.js')).href)
    kokoro = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'fp32', device: 'cpu' })
  }
  const a = await kokoro.generate(text, { voice: v.voice, speed: 1 })
  if (a.sampling_rate !== SR) throw new Error('unexpected sample rate ' + a.sampling_rate)
  return a.audio
}
const say = (v, text) => (v.provider === 'Kokoro (local)' ? kokoroSay(v, text) : google(v, text))

// ---- audio helpers ----
// sentence cache is shared across lessons and keyed by voice + text, so a re-run only re-speaks changed sentences
const keyOf = (v, s) => createHash('sha1').update(`${v.provider}|${v.model}|${v.voice}|${v.style ? v.style + '|' : ''}${s}`).digest('hex').slice(0, 16)
const cacheDir = (v) => { const d = path.join(here, 'cache', v.label); mkdirSync(d, { recursive: true }); return d }
const readF32 = (f) => { const b = readFileSync(f); return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)) }
const writeF32 = (f, a) => { writeFileSync(f + '.part', Buffer.from(a.buffer, a.byteOffset, a.byteLength)); renameSync(f + '.part', f) }
function trim(x) {
  const th = 0.008, pad = Math.round(0.03 * SR)
  let a = 0, b = x.length - 1
  while (a < b && Math.abs(x[a]) < th) a++
  while (b > a && Math.abs(x[b]) < th) b--
  return x.slice(Math.max(0, a - pad), Math.min(x.length, b + pad))
}
function tempo(dir, key, pcm, t) {
  const f = path.join(dir, `${key}.t${t.toFixed(3)}.f32`)
  if (existsSync(f)) return readF32(f)
  const tmp = path.join(dir, `${key}.in.tmp`)
  writeF32(tmp, pcm)
  const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'f32le', '-ar', String(SR), '-ac', '1', '-i', tmp, '-filter:a', `atempo=${t}`, '-f', 'f32le', f])
  if (r.status !== 0) throw new Error('atempo failed: ' + r.stderr)
  return readF32(f)
}
function wav16(file, all) {
  let peak = 0
  for (const v of all) peak = Math.max(peak, Math.abs(v))
  const g = peak ? 0.89 / peak : 1, n = all.length
  const w = Buffer.alloc(44 + n * 2)
  w.write('RIFF', 0); w.writeUInt32LE(36 + n * 2, 4); w.write('WAVEfmt ', 8); w.writeUInt32LE(16, 16)
  w.writeUInt16LE(1, 20); w.writeUInt16LE(1, 22); w.writeUInt32LE(SR, 24); w.writeUInt32LE(SR * 2, 28)
  w.writeUInt16LE(2, 32); w.writeUInt16LE(16, 34); w.write('data', 36); w.writeUInt32LE(n * 2, 40)
  for (let i = 0; i < n; i++) w.writeInt16LE(Math.round(Math.max(-1, Math.min(1, all[i] * g)) * 32767), 44 + i * 2)
  writeFileSync(file, w)
}
function mux(srcMp4, wav, mp4) {
  const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', srcMp4, '-ss', '0', '-i', wav,
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000', '-c:a', 'aac', '-b:a', '96k',
    '-shortest', '-movflags', '+faststart', mp4 + '.part.mp4'])
  if (r.status !== 0) throw new Error('mux failed: ' + r.stderr)
  renameSync(mp4 + '.part.mp4', mp4)
}
function cost(v, chars, audioSec, n) {
  if (v.provider === 'Kokoro (local)') return 0
  const inTok = (chars + (v.style ?? STYLE).length * n) / 4
  return (inTok * 0.5 + audioSec * 25 * 10) / 1e6
}

// ---- one lesson, one voice ----
async function run(v, L) {
  const lines = await linesOf(L)
  const dir = cacheDir(v)
  // speak every missing sentence first (in parallel for cloud voices)
  const todo = lines.filter((x) => !existsSync(path.join(dir, keyOf(v, x.say) + '.f32')))
  let next = 0
  await Promise.all(Array.from({ length: v.concurrency ?? 1 }, async () => {
    while (next < todo.length) {
      const x = todo[next++]
      writeF32(path.join(dir, keyOf(v, x.say) + '.f32'), trim(await say(v, x.say)))
      process.stdout.write('.')
    }
  }))
  const total = Math.round(L.timings.dur * SR)
  const all = new Float32Array(total)
  const chars = lines.reduce((a, x) => a + x.say.length, 0)
  const st = { lesson: L.id, label: v.label, chars, sentences: lines.length, dur: +L.timings.dur.toFixed(1), sped: 0, sped10: 0, overflow: 0, late: 0, maxTempo: 1, maxDelay: 0, audioSec: 0, notes: [] }
  let cursor = 0
  for (const x of lines) {
    const k = keyOf(v, x.say)
    const raw = readF32(path.join(dir, k + '.f32'))
    st.audioSec += raw.length / SR
    let pcm = raw, t = 1
    const at = Math.max(x.start, cursor)
    const avail = x.next - at - BREATH
    if (pcm.length / SR > avail) {
      // avail can be zero or negative when earlier sentences ran over by more than this slot: go full speed
      t = avail > 0 ? Math.ceil(Math.min(MAX_TEMPO, pcm.length / SR / avail) * 1000) / 1000 : MAX_TEMPO
      pcm = tempo(dir, k, raw, t)
      st.sped++; if (t > 1.1) st.sped10++
      st.maxTempo = Math.max(st.maxTempo, t)
    }
    const len = pcm.length / SR
    const delay = at - x.start
    if (at + len > x.next - 0.02) st.overflow++
    if (delay > 0.01) { st.late++; st.maxDelay = Math.max(st.maxDelay, +delay.toFixed(2)) }
    if (len / (x.origEnd - x.start) < 0.55 && x.say.length > 25) st.notes.push(`#${x.i + 1} at ${x.start.toFixed(1)}s unusually short (${len.toFixed(1)}s vs ${(x.origEnd - x.start).toFixed(1)}s): check for skipped words`)
    const o = Math.round(at * SR), n = Math.min(pcm.length, total - o)
    if (n < pcm.length) st.notes.push(`#${x.i + 1} cut off at the end of the video`)
    if (n > 0) all.set(pcm.subarray(0, n), o)
    cursor = at + len + 0.08
  }
  const od = path.join(here, 'out', L.id); mkdirSync(od, { recursive: true })
  const wav = path.join(od, `voice.${v.label}.wav`)
  wav16(wav, all)
  mux(L.mp4, wav, path.join(od, `${L.id}.${v.label}.mp4`))
  st.cost = +cost(v, chars, st.audioSec, lines.length).toFixed(4)
  return st
}

// ---- results + review page ----
const resultsFile = path.join(here, 'results.json')
const loadResults = () => (existsSync(resultsFile) ? JSON.parse(readFileSync(resultsFile, 'utf8')) : { runs: {}, errors: {} })
function report(R) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  const ids = [...new Set(Object.values(R.runs).map((s) => s.lesson))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  const per = (label) => Object.values(R.runs).filter((s) => s.label === label)
  const sum = (a, f) => a.reduce((t, s) => t + f(s), 0)
  const rows = VOICES.map((v) => { const a = per(v.label); if (!a.length) return null
    const worst = a.slice().sort((x, y) => y.maxDelay - x.maxDelay)[0]
    return `| ${v.label} | ${v.voice} | ${a.length} | $${sum(a, (s) => s.cost).toFixed(2)} | ${sum(a, (s) => s.sped10)} | ${sum(a, (s) => s.overflow)} | ${sum(a, (s) => s.late)} | ${worst.maxDelay.toFixed(2)}s (${worst.lesson}) | ${sum(a, (s) => s.notes.length)} |` }).filter(Boolean)
  const notes = Object.values(R.runs).filter((s) => s.notes.length).map((s) => `- **${s.lesson} / ${s.label}**: ${s.notes.join('; ')}`)
  const big = Object.values(R.runs).filter((s) => s.maxDelay >= 0.75).map((s) => `- ${s.lesson} / ${s.label}: up to ${s.maxDelay.toFixed(2)}s behind the picture`)
  writeFileSync(path.join(here, 'RESULTS.md'), `# Voice rollout results

Generated by \`revoice.mjs\`. Method as in the pilot: new sentences start at the original times, sped up to at most
${MAX_TEMPO}x when they would run over; the picture is copied unchanged. Open \`index.html\` in this folder to watch and compare.

| Voice | Model voice | Lessons done | Est. cost | Sentences sped >10% | Overflow | Started late | Worst lag | Notes |
|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Lessons where the voice lags the picture by 0.75s or more
${big.length ? big.join('\n') : '- None'}

## Sentences to listen to (possible skipped words or cut-offs)
${notes.length ? notes.join('\n') : '- None'}

## Errors
${Object.keys(R.errors).length ? Object.entries(R.errors).map(([k, e]) => `- **${k}**: ${e}`).join('\n') : '- None'}
`)
  const data = ids.map((id) => ({ id, title: R.titles?.[id] ?? id, voices: VOICES.filter((v) => R.runs[`${id}|${v.label}`]).map((v) => v.label) }))
  writeFileSync(path.join(here, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voice Rollout Review</title><style>
:root{--bg:#f4f6fb;--fg:#14213d;--muted:#5b6478;--card:#fff;--line:#dde2ee;--accent:#4b4fd6}
@media (prefers-color-scheme:dark){:root{--bg:#0f1420;--fg:#e6e9f2;--muted:#9aa3b8;--card:#171e2e;--line:#273047;--accent:#8d8df0}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:1280px;margin:0 auto;padding:28px 16px 48px}h1{margin:0 0 4px;font-size:26px}.lead{color:var(--muted);margin:0 0 16px;max-width:75ch}
select{font:inherit;padding:6px 10px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--fg);max-width:100%}
.grid{display:grid;gap:18px;margin-top:18px;grid-template-columns:repeat(auto-fill,minmax(min(100%,380px),1fr))}
.card{margin:0;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
video{display:block;width:100%;aspect-ratio:16/9;background:#000}figcaption{padding:10px 14px}h2{font-size:16px;margin:0}.sub{margin:2px 0 0;color:var(--muted);font-size:13px}
</style></head><body><main><h1>Voice rollout review</h1>
<p class="lead">Each lesson with today's voice and the new voices. Pictures are identical; only the narration changes.</p>
<label>Lesson <select id="pick"></select></label><div class="grid" id="grid"></div></main>
<script>
const D=${JSON.stringify(data)}, V=${JSON.stringify(Object.fromEntries(VOICES.map((v) => [v.label, `${v.provider}: ${v.voice} · ${v.accent} ${v.gender}`])))};
const pick=document.getElementById('pick'), grid=document.getElementById('grid');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
D.forEach(d=>pick.add(new Option(d.id+'  '+d.title,d.id)));
function show(){const d=D.find(x=>x.id===pick.value);if(!d)return;
 const card=(t,s,src)=>'<figure class="card"><video controls preload="metadata" src="'+esc(src)+'"></video><figcaption><h2>'+esc(t)+'</h2><p class="sub">'+esc(s)+'</p></figcaption></figure>';
 grid.innerHTML=card('Today: Kokoro am_michael','American male (current voice)','../../marketing/lesson-videos/out/'+d.id+'/'+d.id+'.mp4')+d.voices.map(l=>card(l,V[l],'out/'+d.id+'/'+d.id+'.'+l+'.mp4')).join('');
 try{localStorage.setItem('lesson',d.id)}catch(e){}}
try{const s=localStorage.getItem('lesson');if(s&&D.some(d=>d.id===s))pick.value=s}catch(e){}
pick.onchange=show;show();
</script></body></html>\n`)
}

// ---- main ----
const args = process.argv.slice(2)
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const R = loadResults()
R.titles ??= {}
const save = () => { writeFileSync(resultsFile + '.part', JSON.stringify(loadMerged(), null, 1)); renameSync(resultsFile + '.part', resultsFile) }
// several processes (one per voice) may run at once: merge this process's entries into the file on every save
const mine = { runs: {}, errors: {}, titles: {} }, cleared = new Set()
function loadMerged() {
  const F = loadResults(); F.titles ??= {}
  for (const k of cleared) delete F.errors[k]
  Object.assign(F.runs, mine.runs); Object.assign(F.errors, mine.errors); Object.assign(F.titles, mine.titles)
  return F
}
if (!args.includes('--report')) {
  const want = VOICES.filter((v) => (opt('--voices') ?? VOICES.map((x) => x.label).join(',')).split(',').includes(v.label))
  const sel = (opt('--lessons') ?? 'stats-').split(',')
  const all = readdirSync(path.join(videos, 'lessons')).filter((id) => sel.some((s) => (s.endsWith('-') ? id.startsWith(s) : id === s)))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  const force = args.includes('--force')
  console.log(`${all.length} lessons x ${want.map((v) => v.label).join(', ')}`)
  for (const v of want) for (const id of all) {
    const key = `${id}|${v.label}`
    if (!force && R.runs[key] && existsSync(path.join(here, 'out', id, `${id}.${v.label}.mp4`))) continue
    process.stdout.write(`${key} `)
    const t0 = Date.now()
    try {
      const L = loadLesson(id)
      mine.titles[id] = L.timings.title
      mine.runs[key] = await run(v, L); delete mine.errors[key]; cleared.add(key)
      const s = mine.runs[key]
      console.log(` ${((Date.now() - t0) / 1000).toFixed(0)}s, ${s.sped10} sped>10%, ${s.overflow} overflow, max lag ${s.maxDelay}s`)
    } catch (e) { mine.errors[key] = e.message; console.log(` FAILED: ${e.message}`) }
    save()
  }
}
report(loadMerged())
console.log('wrote RESULTS.md, index.html')
process.exit(0)
