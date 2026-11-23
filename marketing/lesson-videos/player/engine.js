// The shared part of every EzIQ lesson video: the branded stage, the intro and outro, and a small
// cue system. The whole picture is a pure function of time (window.seek), so it renders the same
// frame by frame as it plays live.
//
// A lesson's scenes.js calls EZ.scene(id, { html, update }) for each scene id in its script.
// In the html, any element can carry:
//   data-at="2"        appear when sentence 2 of the scene starts   ("in" = when the scene starts)
//   data-at="2@0.5"    ...halfway through sentence 2        data-at="2+1.2"  ...1.2 s after it starts
//   data-fx="up|pop|fade|left|right|grow|draw"   how it appears (default up)
//   data-out="5"       disappear at that time
// Never put data-at on an SVG element that has its own transform="" (wrap it in a <g>).
// update(c) is for continuous motion: c.t (seconds), c.b (the scene's sentences), c.at(spec),
// c.p(spec, dur) and c.seg(t0, t1) give 0..1 progress, c.$(selector) finds an element once.
(() => {
  const T = window.TIMINGS
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
  const lerp = (a, b, p) => a + (b - a) * p
  const eio = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
  const eo = (p) => 1 - Math.pow(1 - p, 3)
  const back = (p) => 1 + 2.70158 * Math.pow(p - 1, 3) + 1.70158 * Math.pow(p - 1, 2)

  const MARK = '<svg class="mark" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#5b5bd6"/><g fill="none" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path stroke="#fff" d="M32 50 C25.5 45 17 44 10 45.5 V22 C17 20.5 25.5 21.5 32 26.5 Z"/><path stroke="#fff" d="M32 50 C38.5 45 47 44 54 45.5 V22 C47 20.5 38.5 21.5 32 26.5 Z"/><path stroke="#f2c443" d="M22.5 15.5 L32 8.5 L41.5 15.5"/></g></svg>'
  const NOTICE = 'AP® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, EzIQ.'
  const OWN = 'This lesson is EzIQ’s own content. It is not endorsed or approved by the College Board.'
  const ARR = '<i class="arr"></i>'

  // shared SVG paint: shaded balls (url(#g-pur) …) and arrowheads (url(#mk-warm) …)
  const COLORS = { pur: ['#c9c9ff', '#8d8df0', '#4a4ab8'], teal: ['#b4f3ec', '#3cc7bc', '#1b7f77'], warm: ['#ffe0bf', '#f3a764', '#b96a26'], gold: ['#fff0b8', '#f2c443', '#a8821a'], gray: ['#f1f3f9', '#aab1c4', '#646c82'], red: ['#ffc9ce', '#f0707a', '#a83a44'], green: ['#c9f5da', '#4cc781', '#23834d'] }
  const MK = { warm: '#f3a764', teal: '#3cc7bc', bad: '#f0707a', text: '#eef0f7', pri: '#8d8df0', muted: '#a3abbd', gold: '#f2c443' }
  const DEFS = `<svg width="0" height="0" style="position:absolute"><defs>
    ${Object.entries(COLORS).map(([k, c]) => `<radialGradient id="g-${k}" cx=".34" cy=".3" r=".75"><stop offset="0" stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient>`).join('')}
    <radialGradient id="g-cloud"><stop offset="0" stop-color="#8d8df0" stop-opacity=".5"/><stop offset=".7" stop-color="#8d8df0" stop-opacity=".2"/><stop offset="1" stop-color="#8d8df0" stop-opacity=".04"/></radialGradient>
    ${Object.entries(MK).map(([k, c]) => `<marker id="mk-${k}" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L11 6L1 11Z" fill="${c}"/></marker>`).join('')}
  </defs></svg>`

  /** a shaded ball with an optional label, e.g. ball(100, 80, 40, 'teal', sup('O', '2−')) */
  const ball = (x, y, r, g, label = '', fs = r * 0.78) =>
    `<g transform="translate(${x} ${y})"><circle r="${r}" fill="url(#g-${g})"/><ellipse cx="${-r * 0.3}" cy="${-r * 0.38}" rx="${r * 0.36}" ry="${r * 0.2}" fill="#fff" opacity=".2"/>${label ? `<text y="${fs * 0.35}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="#fff" style="fill:#10131c">${label}</text>` : ''}</g>`
  /** SVG text with a raised part: sup('Mg', '2+') */
  const sup = (base, s) => `${base}<tspan dy="-.5em" font-size=".62em">${s}</tspan>`

  const defs = {}
  const EZ = (window.EZ = { T, clamp, lerp, eio, eo, back, ball, sup, MARK, ARR, NOTICE, scene: (id, def) => (defs[id] = def) })

  // ---- built-in intro and outro (a lesson may add intro chips and artwork with EZ.intro = {...}) ----
  const titleHtml = (t) => { const i = t.indexOf('&'); return i < 0 ? t : `${t.slice(0, i)}<em>&amp;</em>${t.slice(i + 1)}` }
  defs.intro = {
    html: () => `${EZ.intro?.art ?? ''}
      <div class="brandcol" style="top:150px"><div class="biglogo" data-at="in+0.15" data-fx="pop">${MARK}<span>EzIQ</span></div></div>
      <div class="brandcol" style="top:372px"><div class="pill" data-at="in+0.7"><b>${T.course}</b> &nbsp;·&nbsp; ${T.unit}</div></div>
      <div class="brandcol" style="top:470px"><h1 class="title" style="font-size:${Math.round(124 * Math.min(1, 26 / T.title.length))}px" data-at="0-0.35" data-fx="up">${titleHtml(T.title)}</h1></div>
      <div class="brandcol" style="top:720px"><div class="chips">${(EZ.intro?.chips ?? []).map((c) => `<div data-at="${c[0]}" data-fx="pop">${c[1]}</div>`).join('')}</div></div>
      <div class="tm" data-at="in+0.9" data-fx="fade"><b>${OWN}</b>${NOTICE}</div>`,
    update: (c) => EZ.intro?.update?.(c),
  }
  defs.outro = {
    html: () => `
      <div class="brandcol" style="top:170px"><div class="biglogo" data-at="in+0.1" data-fx="pop">${MARK}<span>EzIQ</span></div></div>
      <div class="brandcol" style="top:420px;font-size:54px;font-weight:800;color:var(--muted)" data-at="0" data-fx="up">Ready to practice? Find this lesson at</div>
      <div class="brandcol" style="top:500px"><div class="url" data-at="0@0.35" data-fx="pop">eziq.app</div></div>
      <div class="brandcol" style="top:760px"><div class="chips"><div data-at="0@0.5" data-fx="pop">Lessons</div><div data-at="0@0.6" data-fx="pop">Flashcards</div><div data-at="0@0.72" data-fx="pop">Quick checks</div></div></div>
      <div class="tm" data-at="in+0.5" data-fx="fade"><b>${OWN}</b>${NOTICE}</div>`,
  }

  // ---- timeline ----
  const scenes = []
  function parse(sc, spec) {
    const m = String(spec).match(/^(in|\d+)(?:@([\d.]+))?([+-][\d.]+)?$/)
    if (!m) throw new Error(`bad time "${spec}" in scene ${sc.id}`)
    if (m[1] === 'in') return sc.start + 0.25 + (m[3] ? +m[3] : 0)
    const b = sc.beats[+m[1]]
    if (!b) throw new Error(`scene ${sc.id} has no sentence ${m[1]}`)
    return b.start + (m[2] ? +m[2] * (b.end - b.start) : 0) + (m[3] ? +m[3] : 0)
  }
  function build() {
    document.getElementById('stage').insertAdjacentHTML('afterbegin', DEFS)
    document.getElementById('top').innerHTML = `<span class="brandmark" style="display:flex;align-items:center;gap:16px">${MARK}<span class="name">EzIQ</span></span><span class="crumb">Syllabus from ${T.course} &nbsp;·&nbsp; <b>${T.title.replace('&', '&amp;')}</b></span>`
    const host = document.getElementById('scenes'), bar = document.getElementById('bar')
    T.scenes.forEach((sc, i) => {
      const def = defs[sc.id]
      if (!def) throw new Error(`no visuals for scene "${sc.id}"`)
      const root = document.createElement('section')
      root.className = 'scene'; root.id = 's-' + sc.id
      root.innerHTML = typeof def.html === 'function' ? def.html() : def.html
      host.appendChild(root)
      const cues = [...root.querySelectorAll('[data-at]')].map((el) => {
        const fx = el.dataset.fx || 'up'
        if (fx === 'draw') { el.setAttribute('pathLength', '1'); el.style.strokeDasharray = '1 1' }
        if (fx === 'grow') el.style.transformOrigin = 'left center'
        return { el, fx, t0: parse(sc, el.dataset.at), t1: el.dataset.out ? parse(sc, el.dataset.out) : null, dur: +(el.dataset.dur || (fx === 'draw' ? 1.1 : 0.55)) }
      })
      const cache = new Map()
      const c = { sc, b: sc.beats, t: 0, at: (s) => parse(sc, s), root,
        p: (s, d = 0.6) => clamp((c.t - parse(sc, s)) / d), seg: (a, b) => clamp((c.t - a) / (b - a)),
        $: (q) => { if (!cache.has(q)) cache.set(q, root.querySelector(q)); return cache.get(q) } }
      scenes.push({ sc, def, root, cues, c, last: i === T.scenes.length - 1 })
      if (i) { const k = document.createElement('div'); k.className = 'tick'; k.style.left = (sc.start / T.dur) * 100 + '%'; bar.appendChild(k) }
    })
  }
  function seek(ms) {
    const t = Math.min(ms / 1000, T.dur)
    for (const s of scenes) {
      const on = t >= s.sc.start && (s.last || t < s.sc.end)
      s.root.style.display = on ? 'block' : 'none'
      if (!on) continue
      s.root.style.opacity = Math.min(clamp((t - s.sc.start) / 0.45), s.last ? 1 : clamp((s.sc.end - t) / 0.35))
      for (const q of s.cues) {
        const raw = clamp((t - q.t0) / q.dur), p = eo(raw), out = q.t1 == null ? 0 : clamp((t - q.t1) / 0.35)
        const st = q.el.style
        st.opacity = (q.fx === 'draw' ? (raw > 0 ? 1 : 0) : Math.min(1, raw * 2.5)) * (1 - out)
        if (q.fx === 'up') st.transform = `translateY(${(1 - p) * 44}px)`
        else if (q.fx === 'left') st.transform = `translateX(${(1 - p) * -70}px)`
        else if (q.fx === 'right') st.transform = `translateX(${(1 - p) * 70}px)`
        else if (q.fx === 'pop') st.transform = `scale(${0.6 + 0.4 * back(raw)})`
        else if (q.fx === 'grow') st.transform = `scaleX(${p})`
        else if (q.fx === 'draw') st.strokeDashoffset = 1 - eio(raw)
      }
      s.c.t = t
      s.def.update?.(s.c)
    }
    const edge = t < T.scenes[0].end || t >= T.scenes.at(-1).start
    document.querySelector('#top .brandmark').style.opacity = edge ? 0 : 1
    document.querySelector('#top .crumb').style.opacity = edge ? 0 : 1
    document.querySelector('#bar .fill').style.width = (t / T.dur) * 100 + '%'
    const b = document.querySelectorAll('#bg i')
    b[0].style.transform = `translate(${Math.sin(t * 0.11) * 70}px, ${Math.cos(t * 0.09) * 50}px)`
    b[1].style.transform = `translate(${Math.cos(t * 0.08) * -80}px, ${Math.sin(t * 0.1) * -50}px)`
    b[2].style.transform = `translate(${Math.sin(t * 0.07 + 2) * 60}px, ${Math.cos(t * 0.06) * 40}px)`
  }

  EZ.start = () => {
    build()
    window.DUR = T.dur * 1000
    window.seek = seek
    const capture = location.search.includes('capture')
    document.body.classList.toggle('capture', capture)
    seek(0)
    if (capture) return
    // live preview: follow the narration
    const fit = () => { const k = Math.min(innerWidth / 1920, (innerHeight - 48) / 1080); document.getElementById('fit').style.transform = `scale(${k})` }
    fit(); addEventListener('resize', fit)
    const audio = new Audio(`../out/${T.id}/voice.wav`), play = document.getElementById('play'), scrub = document.getElementById('scrub'), clock = document.getElementById('clock')
    play.onclick = () => (audio.paused ? audio.play() : audio.pause())
    scrub.oninput = () => { audio.currentTime = (scrub.value / 1000) * T.dur; seek(audio.currentTime * 1000) }
    const at = +new URLSearchParams(location.search).get('t')
    if (at) { audio.currentTime = at; seek(at * 1000) }
    ;(function loop() {
      if (!audio.paused) { seek(audio.currentTime * 1000); scrub.value = (audio.currentTime / T.dur) * 1000 }
      play.textContent = audio.paused ? 'Play' : 'Pause'
      const s = Math.floor(audio.currentTime); clock.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} / ${Math.floor(T.dur / 60)}:${String(Math.floor(T.dur % 60)).padStart(2, '0')}`
      requestAnimationFrame(loop)
    })()
  }
})()
