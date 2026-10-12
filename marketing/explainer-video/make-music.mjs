// Writes three original 55 s backing tracks, synthesized here so there is no licence to clear:
//   music-ukulele.wav  sunny ukulele strum, marimba tune, finger snaps        (~111 BPM)
//   music-bounce.wav   bouncy off-beat plucks, whistled tune, claps            (~92 BPM)
//   music-lofi.wav     calm electric piano, soft swung drums, bell tune        (~74 BPM)
// Every track is sparse and minor with a ticking clock for the "pain" scenes, then lifts into a major key
// exactly at REVEAL (the moment the app appears in index.html) and lands its last chord at 52 s.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const SR = 44100
const LEN = 55
const REVEAL = 13
const N = SR * LEN
const L = new Float32Array(N)
const R = new Float32Array(N)
let seed = 12345
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1

const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const hz = (n) => 440 * 2 ** ((NOTE[n[0]] + 12 * (Number(n.slice(-1)) + 1) + (n[1] === '#' ? 1 : 0) - 69) / 12)

function add(buf, t, gain, pan) {
  const i0 = Math.round(t * SR)
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4), gr = gain * Math.sin(((pan + 1) * Math.PI) / 4)
  for (let i = 0; i < buf.length && i0 + i < N; i++) { L[i0 + i] += buf[i] * gl; R[i0 + i] += buf[i] * gr }
}

/** Plucked nylon string (Karplus–Strong). */
function pluck(f, dur, bright = 0.5) {
  const n = Math.round(SR * dur), out = new Float32Array(n), d = Math.max(2, Math.round(SR / f)), line = new Float32Array(d)
  let prev = 0
  for (let i = 0; i < d; i++) { const x = rnd(); prev = prev + bright * (x - prev); line[i] = prev }
  for (let i = 0, k = 0; i < n; i++) {
    const a = line[k], b = line[(k + 1) % d]
    out[i] = a * Math.min(1, (n - i) / (SR * 0.03))
    line[k] = (a + b) * 0.5 * 0.9965
    k = (k + 1) % d
  }
  return out
}
/** Marimba / glockenspiel bar: a sine with a quickly fading overtone. */
function mallet(f, dur, over = 4) {
  const n = Math.round(SR * dur), out = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const t = i / SR, att = Math.min(1, t / 0.004)
    out[i] = att * (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 5) + 0.35 * Math.sin(2 * Math.PI * f * over * t) * Math.exp(-t * 16))
  }
  return out
}
/** Short pizzicato-style pluck for off-beat chord stabs. */
function pizz(f, dur) {
  const n = Math.round(SR * dur), out = new Float32Array(n), w = 2 * Math.PI * f
  for (let i = 0; i < n; i++) {
    const t = i / SR, env = Math.min(1, t / 0.003) * Math.exp(-t * 11) * Math.min(1, (n - i) / (SR * 0.02))
    out[i] = env * (Math.sin(w * t) + 0.5 * Math.sin(2 * w * t) * Math.exp(-t * 8) + 0.25 * Math.sin(3 * w * t) * Math.exp(-t * 14))
  }
  return out
}
/** Whistle: a sine with a little vibrato. */
function whistle(f, dur) {
  const n = Math.round(SR * dur), out = new Float32Array(n)
  let ph = 0
  for (let i = 0; i < n; i++) {
    const t = i / SR
    ph += (2 * Math.PI * f * (1 + 0.006 * Math.sin(2 * Math.PI * 5.5 * t) * Math.min(1, t / 0.15))) / SR
    out[i] = Math.min(1, t / 0.035) * Math.min(1, (n - i) / (SR * 0.07)) * (Math.sin(ph) + 0.12 * Math.sin(2 * ph) + 0.04 * Math.sin(3 * ph))
  }
  return out
}
/** Electric piano (two-operator FM with a slow tremolo). */
function epiano(f, dur) {
  const n = Math.round(SR * dur), out = new Float32Array(n), w = 2 * Math.PI * f
  for (let i = 0; i < n; i++) {
    const t = i / SR, env = Math.min(1, t / 0.006) * Math.exp(-t * 1.6) * Math.min(1, (n - i) / (SR * 0.08))
    out[i] = env * (Math.sin(w * t + 1.4 * Math.exp(-t * 5) * Math.sin(w * t)) + 0.2 * Math.sin(2 * w * t) * Math.exp(-t * 6)) * (1 + 0.08 * Math.sin(2 * Math.PI * 4.5 * t))
  }
  return out
}
function bass(f, dur) {
  const n = Math.round(SR * dur), out = new Float32Array(n)
  for (let i = 0; i < n; i++) { const t = i / SR; out[i] = Math.min(1, t / 0.008) * Math.min(1, (n - i) / (SR * 0.02)) * Math.exp(-t * 4.5) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) }
  return out
}
function kick() {
  const n = Math.round(SR * 0.22), out = new Float32Array(n)
  let ph = 0
  for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * (48 + 90 * Math.exp(-t * 32))) / SR; out[i] = Math.sin(ph) * Math.exp(-t * 15) }
  return out
}
/** Filtered noise burst: hp in 0..1 sets how thin it is. */
function noise(dur, decay, hp) {
  const n = Math.round(SR * dur), out = new Float32Array(n)
  let lp = 0
  for (let i = 0; i < n; i++) { const x = rnd(); lp += hp * (x - lp); out[i] = (x - lp) * Math.exp((-i / SR) * decay) }
  return out
}
/** Finger snap / hand clap: three noise bursts a few ms apart. */
function snap(hp = 0.25) {
  const n = Math.round(SR * 0.12), out = new Float32Array(n)
  for (const off of [0, 0.011, 0.021]) { const b = noise(0.09, 55, hp), i0 = Math.round(off * SR); for (let i = 0; i < b.length && i0 + i < n; i++) out[i0 + i] += b[i] * 0.6 }
  return out
}
function softSnare() {
  const out = noise(0.2, 26, 0.12)
  for (let i = 0; i < out.length; i++) { const t = i / SR; out[i] = out[i] * 0.7 + 0.5 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 32) }
  return out
}
function tick(f) {
  const n = Math.round(SR * 0.06), out = new Float32Array(n)
  for (let i = 0; i < n; i++) { const t = i / SR; out[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 70) }
  return out
}

/** Lift into the reveal: a soft rising shimmer, a run up the scale, and a bell on the downbeat. */
function lift(run, bell, gain = 1) {
  const n = Math.round(SR * 0.9), buf = noise(0.9, 0, 0.5)
  for (let i = 0; i < n; i++) buf[i] *= (i / n) ** 3
  add(buf, REVEAL - 0.9, 0.16 * gain, 0)
  run.forEach((nt, i) => add(mallet(hz(nt), 0.5), REVEAL - 0.75 + i * 0.125, (0.16 + i * 0.015) * gain, 0.2))
  add(mallet(hz(bell), 1.2, 2.76), REVEAL, 0.14 * gain, 0)
}
/** How many full bars fit between the reveal and the final chord. */
const mainBars = (bar) => Math.floor((LEN - 2.2 - REVEAL) / bar + 1e-6)
/** The four-chord loop, ending on the two chords that lead home. */
const loop = (n, cycle, turn) => Array.from({ length: n }, (_, i) => (i >= n - 2 ? turn[i - (n - 2)] : cycle[i % 4]))

// ------------------------------------------------------------------ 1 · sunny ukulele
function ukulele() {
  const bar = REVEAL / 6, beat = bar / 4
  // ukulele shapes (strings G C E A)
  const UKE = { C: ['G4', 'C4', 'E4', 'C5'], G: ['G4', 'D4', 'G4', 'B4'], Am: ['A4', 'C4', 'E4', 'A4'], F: ['A4', 'C4', 'F4', 'A4'] }
  const ROOT = { C: 'C2', G: 'G2', Am: 'A2', F: 'F2' }
  const strum = (chord, t, down, gain) => (down ? UKE[chord] : UKE[chord].slice(1).reverse()).forEach((n, i) => add(pluck(hz(n), 0.9, 0.55), t + i * 0.013, gain * (down ? 1 : 0.7), -0.35))
  // melody per chord: [beat, note], two variations
  const TUNE = [{
    C: [[0, 'E5'], [0.5, 'G5'], [1.5, 'E5'], [2, 'C5'], [3, 'D5'], [3.5, 'E5']],
    G: [[0, 'D5'], [0.5, 'G5'], [1.5, 'D5'], [2, 'B4'], [3, 'D5']],
    Am: [[0, 'C5'], [0.5, 'E5'], [1.5, 'C5'], [2, 'A4'], [3, 'C5'], [3.5, 'D5']],
    F: [[0, 'C5'], [0.5, 'F5'], [1.5, 'A5'], [2, 'G5'], [3, 'E5'], [3.5, 'D5']],
  }, {
    C: [[0, 'G5'], [1, 'E5'], [1.5, 'G5'], [2.5, 'A5'], [3, 'G5']],
    G: [[0, 'B5'], [1, 'G5'], [1.5, 'D5'], [2.5, 'G5'], [3, 'A5']],
    Am: [[0, 'A5'], [1, 'E5'], [1.5, 'C5'], [2.5, 'E5'], [3, 'G5']],
    F: [[0, 'A5'], [1, 'F5'], [1.5, 'C5'], [2, 'D5'], [3, 'E5'], [3.5, 'D5']],
  }]

  // sparse intro: a slow picked pattern over a ticking clock
  ;['Am', 'F', 'Am', 'G', 'F', 'G'].forEach((ch, i) => {
    const at = (b) => i * bar + b * beat
    UKE[ch].concat(UKE[ch][2], UKE[ch][1]).forEach((n, k) => add(pluck(hz(n), 1.1, 0.35), at([0, 0.5, 1, 2, 2.5, 3][k]), 0.2, -0.3))
    add(bass(hz(ROOT[ch]), 1.6), at(0), 0.4, 0)
    for (let b = 0; b < 4; b++) add(tick(b % 2 ? 1500 : 2000), at(b), 0.11, 0.4)
  })
  lift(['G4', 'A4', 'C5', 'D5', 'E5', 'G5'], 'C6')

  const n = mainBars(bar)
  loop(n, ['C', 'G', 'Am', 'F'], ['F', 'G']).forEach((ch, i) => {
    const at = (b) => REVEAL + i * bar + b * beat
    // island strum: D . D U . U D U
    ;[[0, 1], [1, 1], [1.5, 0], [2.5, 0], [3, 1], [3.5, 0]].forEach(([b, down]) => strum(ch, at(b), !!down, 0.24))
    add(bass(hz(ROOT[ch]), 1.2), at(0), 0.5, 0); add(bass(hz(ROOT[ch]), 0.8), at(2), 0.42, 0); add(bass(hz(ROOT[ch]) * 1.5, 0.4), at(3.5), 0.3, 0)
    add(kick(), at(0), 0.6, 0); add(kick(), at(2), 0.52, 0); if (i % 2) add(kick(), at(2.5), 0.36, 0)
    add(snap(), at(1), 0.3, 0.15); add(snap(), at(3), 0.3, 0.15)
    for (let e = 0; e < 8; e++) add(noise(0.05, 70, 0.6), at(e * 0.5), e % 2 ? 0.1 : 0.055, 0.5)
    for (const [b, nt] of TUNE[(i >> 2) % 2][ch]) {
      add(mallet(hz(nt), 0.9), at(b), 0.26, 0.3)
      if (i >= 8) add(mallet(hz(nt) * 2, 0.7, 2.76), at(b), 0.07, -0.1) // glockenspiel doubles from the third pass
    }
  })
  const end = REVEAL + n * bar
  strum('C', end, true, 0.3); add(bass(hz('C2'), 1.6), end, 0.5, 0); add(kick(), end, 0.6, 0)
  ;['C5', 'E5', 'G5', 'C6'].forEach((nt, k) => { add(mallet(hz(nt), 1.2), end + k * beat * 0.5, 0.26, 0.3); add(mallet(hz(nt) * 2, 0.9, 2.76), end + k * beat * 0.5, 0.07, -0.1) })
}

// ------------------------------------------------------------------ 2 · bouncy pop (G major)
function bounce() {
  const bar = REVEAL / 5, beat = bar / 4
  const STAB = { G: ['G4', 'B4', 'D5'], D: ['F#4', 'A4', 'D5'], Em: ['G4', 'B4', 'E5'], C: ['G4', 'C5', 'E5'] }
  const ROOT = { G: 'G2', D: 'D3', Em: 'E3', C: 'C3' }
  // whistled tune per chord: [beat, note, length in beats]
  const TUNE = {
    G: [[0, 'B5', 1], [1, 'D6', 0.5], [1.5, 'B5', 0.5], [2, 'G5', 1], [3, 'A5', 0.5], [3.5, 'B5', 0.5]],
    D: [[0, 'A5', 1], [1, 'F#5', 0.5], [1.5, 'A5', 0.5], [2, 'D6', 1.5]],
    Em: [[0, 'B5', 1], [1, 'G5', 0.5], [1.5, 'E5', 0.5], [2, 'G5', 1], [3, 'B5', 0.5], [3.5, 'A5', 0.5]],
    C: [[0, 'G5', 1], [1, 'E5', 0.5], [1.5, 'G5', 0.5], [2, 'C6', 1], [3, 'B5', 0.5], [3.5, 'A5', 0.5]],
  }

  // sparse intro: low marimba arpeggio over a ticking clock
  const ARP = { Em: ['E3', 'G3', 'B3'], C: ['C3', 'E3', 'G3'], D: ['D3', 'F#3', 'A3'] }
  ;['Em', 'C', 'Em', 'C', 'D'].forEach((ch, i) => {
    const at = (b) => i * bar + b * beat
    ;[0, 1, 2, 1].forEach((k, b) => add(mallet(hz(ARP[ch][k]) * 2, 1.0), at(b), 0.22, -0.2))
    add(bass(hz(ARP[ch][0]), 1.8), at(0), 0.4, 0)
    for (let b = 0; b < 4; b++) add(tick(b % 2 ? 1500 : 2000), at(b), 0.11, 0.4)
  })
  lift(['D5', 'E5', 'G5', 'A5', 'B5', 'D6'], 'G6')

  const n = mainBars(bar)
  loop(n, ['G', 'D', 'Em', 'C'], ['C', 'D']).forEach((ch, i) => {
    const at = (b) => REVEAL + i * bar + b * beat
    // off-beat chord stabs give the bounce
    for (const b of [0.5, 1.5, 2.5, 3.5]) STAB[ch].forEach((nt, k) => add(pizz(hz(nt), 0.3), at(b), 0.15, -0.3 + k * 0.2))
    const r = hz(ROOT[ch])
    add(bass(r, 0.6), at(0), 0.5, 0); add(bass(r * 2, 0.3), at(1.5), 0.3, 0); add(bass(r, 0.6), at(2), 0.46, 0); add(bass(r * 1.5, 0.3), at(3.5), 0.32, 0)
    add(kick(), at(0), 0.6, 0); add(kick(), at(2), 0.55, 0)
    add(snap(0.12), at(1), 0.3, 0.1); add(snap(0.12), at(3), 0.3, 0.1)
    for (let e = 0; e < 8; e++) add(noise(0.04, 80, 0.7), at(e * 0.5), e % 2 ? 0.09 : 0.05, 0.5)
    for (const [b, nt, len] of TUNE[ch]) {
      add(whistle(hz(nt), len * beat * 0.92), at(b), 0.17, 0.2)
      if ((i >> 2) % 2) add(mallet(hz(nt) / 2, 0.8), at(b), 0.2, -0.25) // marimba joins on every other pass
    }
  })
  const end = REVEAL + n * bar
  STAB.G.forEach((nt, k) => add(pluck(hz(nt), 1.6, 0.6), end + k * 0.015, 0.26, -0.3 + k * 0.2))
  add(bass(hz('G2'), 1.6), end, 0.5, 0); add(kick(), end, 0.6, 0); add(snap(0.12), end, 0.22, 0.1)
  ;['G5', 'B5', 'D6', 'G6'].forEach((nt, k) => add(mallet(hz(nt), 1.2), end + k * beat * 0.5, 0.24, 0.3))
}

// ------------------------------------------------------------------ 3 · calm lo-fi (C major)
function lofi() {
  const bar = REVEAL / 4, beat = bar / 4
  const KEYS = { C: ['G3', 'B3', 'E4'], Am: ['G3', 'C4', 'E4'], F: ['A3', 'C4', 'E4'], G: ['G3', 'B3', 'D4'], Dm: ['F3', 'A3', 'C4'] }
  const ROOT = { C: 'C3', Am: 'A2', F: 'F2', G: 'G2', Dm: 'D3' }
  const chord = (ch, t, gain) => KEYS[ch].forEach((nt, k) => add(epiano(hz(nt), 2.4), t + k * 0.022, gain, -0.25 + k * 0.25))
  const swing = (b) => (b % 1 ? b + 0.09 : b)
  const TUNE = {
    C: [[0.5, 'E5'], [1.5, 'G5'], [2, 'A5'], [3, 'G5']],
    Am: [[0.5, 'E5'], [1.5, 'C5'], [2.5, 'D5'], [3, 'E5']],
    F: [[0.5, 'A5'], [1.5, 'G5'], [2, 'E5'], [3, 'C5']],
    G: [[0.5, 'D5'], [1.5, 'E5'], [2, 'G5'], [3.5, 'D5']],
  }

  // sparse intro: held chords and a quiet clock
  ;['Am', 'F', 'Dm', 'G'].forEach((ch, i) => {
    const at = (b) => i * bar + b * beat
    chord(ch, at(0), 0.2)
    add(bass(hz(ROOT[ch]), 2), at(0), 0.36, 0)
    for (let b = 0; b < 4; b++) add(tick(b % 2 ? 1500 : 2000), at(b), 0.08, 0.4)
  })
  lift(['G4', 'A4', 'C5', 'D5', 'E5', 'G5'], 'C6', 0.7)

  const n = mainBars(bar)
  loop(n, ['C', 'Am', 'F', 'G'], ['F', 'G']).forEach((ch, i) => {
    const at = (b) => REVEAL + i * bar + swing(b) * beat
    chord(ch, at(0), 0.2); chord(ch, at(1.5), 0.12)
    add(bass(hz(ROOT[ch]), 1.4), at(0), 0.5, 0); add(bass(hz(ROOT[ch]), 0.6), at(2.5), 0.36, 0)
    add(kick(), at(0), 0.5, 0); add(kick(), at(2.5), 0.4, 0)
    add(softSnare(), at(1), 0.2, 0.1); add(softSnare(), at(3), 0.2, 0.1)
    for (let e = 0; e < 8; e++) add(noise(0.035, 90, 0.7), at(e * 0.5), e % 2 ? 0.06 : 0.035, 0.45)
    for (const [b, nt] of TUNE[ch]) {
      add(mallet(hz(nt), 1.4, 2.76), at(b), 0.16, 0.3)
      if (i >= 4) add(mallet(hz(nt) / 2, 1.0), at(b), 0.14, -0.2) // marimba an octave below from the second pass
    }
  })
  const end = REVEAL + n * bar
  chord('C', end, 0.24); add(bass(hz('C3'), 2), end, 0.5, 0); add(kick(), end, 0.5, 0)
  ;['E5', 'G5', 'C6'].forEach((nt, k) => add(mallet(hz(nt), 1.6, 2.76), end + k * beat * 0.5, 0.16, 0.3))
}

// ------------------------------------------------------------------ master: gentle saturation, fades, 16-bit stereo
const here = path.dirname(fileURLToPath(import.meta.url))
for (const [name, compose] of Object.entries({ ukulele, bounce, lofi })) {
  L.fill(0); R.fill(0); seed = 12345
  compose()
  let peak = 0
  for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])) }
  const norm = 0.84 / peak
  const wav = Buffer.alloc(44 + N * 4)
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + N * 4, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22)
  wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 4, 28); wav.writeUInt16LE(4, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(N * 4, 40)
  for (let i = 0; i < N; i++) {
    const t = i / SR, fade = Math.min(1, t / 0.05) * Math.min(1, (LEN - t) / 1.5)
    wav.writeInt16LE(Math.round(L[i] * norm * fade * 32767), 44 + i * 4)
    wav.writeInt16LE(Math.round(R[i] * norm * fade * 32767), 46 + i * 4)
  }
  const out = path.join(here, `music-${name}.wav`)
  writeFileSync(out, wav)
  console.log('wrote', out, `peak ${peak.toFixed(2)}`)
}
