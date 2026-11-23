// Pictures for chem-3.3 "Solids, Liquids & Gases". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u3.ts). Particles are schematic: no
// sizes, speeds or counts are claimed; only spacing and motion, as the lesson describes them.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .ph{top:290px;width:540px;height:590px}
    .rw{position:absolute;left:36px;font-size:30px;font-weight:800;white-space:nowrap;color:var(--muted)} .rw b{font-weight:900}
    .ft{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:31px;font-weight:800;white-space:nowrap}
    .opt{position:absolute;left:120px;width:1680px;height:96px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:35px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:18px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:14px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
    .ab{position:absolute;font-size:36px;font-weight:900;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
  const tri = (p, L) => { const m = ((p % (2 * L)) + 2 * L) % (2 * L); return m < L ? m : 2 * L - m }
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="rgba(255,255,255,.03)" stroke="#4a5170" stroke-width="3"/>`
  const COL = { s: 'pur', l: 'teal', g: 'warm' }

  // an animated particle (moved every frame by move(c)); gas particles bounce inside box bx,by,bw,bh
  const pt = (k, i, x, y, r, bx = 0, by = 0, bw = 0, bh = 0) =>
    `<g class="pt" data-k="${k}" data-i="${i}" data-x="${x}" data-y="${y}" data-r="${r}" data-bx="${bx}" data-by="${by}" data-bw="${bw}" data-bh="${bh}" transform="translate(${x} ${y})">${ball(0, 0, r, COL[k])}</g>`
  const move = (c) => {
    const t = c.t
    for (const g of all(c, '.pt')) {
      const d = g.dataset, i = +d.i, x = +d.x, y = +d.y, r = +d.r
      let X = x, Y = y
      if (d.k === 's') { X += 2.2 * Math.sin(t * 14 + i * 1.9); Y += 2.2 * Math.cos(t * 12 + i * 2.7) }
      else if (d.k === 'l') { X += 4 * Math.sin(t * 2.4 + i * 1.7); Y += 3.5 * Math.cos(t * 2.1 + i * 2.3) }
      else {
        const bx = +d.bx, by = +d.by, bw = +d.bw, bh = +d.bh
        X = bx + r + tri(x - bx - r + (90 + ((i * 47) % 70)) * t, bw - 2 * r)
        Y = by + r + tri(y - by - r + (70 + ((i * 29) % 80)) * t * (i % 2 ? 1 : -1), bh - 2 * r)
      }
      g.setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)})`)
    }
  }

  // the box of particles used in the phases and the drawing tip (svg 540 x 230, container x30..510, y10..220)
  const phaseSvg = (k) => {
    let h = box(30, 10, 480, 210), n = 0
    if (k === 's') for (let r = 0; r < 5; r++) for (let q = 0; q < 10; q++) h += pt('s', n++, 90 + q * 40, 35 + r * 40, 20)
    else if (k === 'l') for (let r = 0; r < 4; r++) for (let q = 0; q < 10; q++) { n++; h += pt('l', n, 64 + q * 44 + (r % 2 ? 22 : 0) + (rnd(n) - 0.5) * 6, 195 - r * 38 + (rnd(n + 50) - 0.5) * 6, 20) }
    else for (let q = 0; q < 6; q++) h += pt('g', q, 100 + ((q * 151) % 340), 50 + ((q * 83) % 130), 20, 30, 10, 480, 210)
    return h
  }
  const phaseCard = (k, left, title, cls, at, rows, style = '') =>
    `<div class="card ph ${k}c" style="left:${left}px;${style}" data-at="${at}"><h3 class="${cls}">${title}</h3>
      <svg style="position:absolute;left:0;top:84px" width="540" height="230">${phaseSvg(k)}</svg>
      ${rows.map(([html, rat], j) => `<div class="rw" style="top:${340 + j * 54}px" data-at="${rat}">${html}</div>`).join('')}</div>`

  // static mini pictures for the intro art and the recap
  const dots = (k, x, y, w, h, r) => {
    let s = box(x, y, w, h), n = 0
    const pitch = r * 2
    if (k === 's') { const cols = Math.floor((w - 8) / pitch), rows = Math.floor((h - 8) / pitch), ox = x + (w - cols * pitch) / 2 + r, oy = y + (h - rows * pitch) / 2 + r
      for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) s += ball(ox + b * pitch, oy + a * pitch, r, 'pur') }
    else if (k === 'l') { const cols = Math.floor((w - 8) / (pitch + 2)) - 1, rows = Math.floor((h - 8) / (pitch * 0.9)) - 1, ox = x + (w - cols * (pitch + 2)) / 2 + r
      for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) { n++; s += ball(ox + b * (pitch + 2) + (a % 2 ? r : 0) * 0.9 + (rnd(n) - 0.5) * 3, y + h - 6 - r - a * pitch * 0.9 + (rnd(n + 9) - 0.5) * 3, r, 'teal') } }
    else for (let q = 0; q < 4; q++) s += ball(x + r + 6 + ((q * 61) % (w - 2 * r - 12)), y + r + 6 + ((q * 37) % (h - 2 * r - 12)), r, 'warm')
    return s
  }

  // ---------- intro artwork: faint particles on the left and right edges (all above y = 950) ----------
  let art = '<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">'
  for (let r = 0; r < 7; r++) for (let q = 0; q < 2; q++) art += ball(48 + q * 42, 250 + r * 42, 20, 'pur')
  for (let q = 0; q < 6; q++) art += ball(1790 + ((q * 53) % 90), 260 + q * 62, 20, 'warm')
  art += '</svg>'
  EZ.intro = {
    chips: [['1@0.28', 'Solid, liquid, gas'], ['1@0.52', 'Crystalline or amorphous'], ['1@0.76', 'Drawing particles']],
    art,
  }

  // ---------- hook: the same H2O molecule in ice, water and steam ----------
  const mol = (x, y, s) => ball(x - 62 * s, y + 48 * s, 28 * s, 'gray', 'H', 30 * s) + ball(x + 62 * s, y + 48 * s, 28 * s, 'gray', 'H', 30 * s) + ball(x, y, 46 * s, 'teal', 'O', 46 * s)
  const H2O = 'H<tspan dy=".3em" font-size=".62em">2</tspan><tspan dy="-.3em">O</tspan>'
  const hookCard = (k, left, title, cls, at) => `<div class="card" style="left:${left}px;top:300px;width:540px;height:440px" data-at="${at}"><h3 class="${cls}">${title}</h3>
      <svg style="position:absolute;left:0;top:90px" width="540" height="330"><g data-at="1" data-fx="pop"><g class="mb" data-k="${k}">${mol(270, 110, 1.4)}</g></g>
        <text x="270" y="290" text-anchor="middle" font-size="62" font-weight="900" data-at="1@0.4" data-fx="fade">${H2O}</text></svg></div>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">One molecule, three phases</h2>
      ${hookCard('s', 120, 'Ice', 'pri', '0')}${hookCard('l', 690, 'Water', 'teal', '0@0.45')}${hookCard('g', 1260, 'Steam', 'warm', '0@0.8')}
      <div class="banner" style="top:820px" data-at="2" data-out="3" data-fx="pop">The molecules are <span class="teal">identical</span></div>
      <div class="banner" style="top:820px" data-at="3" data-fx="pop">Different: <span class="teal">how close</span> &nbsp;·&nbsp; <span class="warm">how much they move</span></div>`,
    update(c) {
      for (const g of all(c, '.mb')) {
        const k = g.dataset.k, t = c.t, ph = c.p('3', 0.6)
        const [A, F] = k === 's' ? [2.2, 14] : k === 'l' ? [10, 2.2] : [22, 3.4]
        const a = 1 + 0.5 * ph
        g.setAttribute('transform', `translate(${(A * a * Math.sin(t * F)).toFixed(1)} ${(A * a * 0.7 * Math.cos(t * F * 0.83)).toFixed(1)}) rotate(${(A * 0.8 * Math.sin(t * F * 0.7 + 1)).toFixed(1)} 270 110)`)
      }
    },
  })

  // ---------- the three phases, particle by particle ----------
  const R = (lab, val, cls) => `${lab}: <b class="${cls}">${val}</b>`
  EZ.scene('phases', {
    html: `<div class="kicker" data-at="in" data-fx="left">Three phases</div><h2 class="h1" data-at="0">Particle by particle</h2>
      ${phaseCard('s', 120, 'Solid', 'pri', '0', [[R('Spacing', 'touching', 'pri'), '1'], [R('Motion', 'vibrate in place', 'pri'), '1@0.5'], [R('Shape', 'definite', 'pri'), '2'], [R('Volume', 'definite', 'pri'), '2@0.5']])}
      ${phaseCard('l', 690, 'Liquid', 'teal', '3', [[R('Spacing', 'touching', 'teal'), '3'], [R('Motion', 'slide past each other', 'teal'), '3@0.5'], [R('Shape', 'the container’s shape', 'teal'), '4'], [R('Volume', 'definite', 'teal'), '4@0.5']])}
      ${phaseCard('g', 1260, 'Gas', 'warm', '5', [[R('Spacing', 'far apart', 'warm'), '5'], [R('Motion', 'fast, random, constant', 'warm'), '5@0.5'], [R('Shape', 'fills the container', 'warm'), '6'], [R('Volume', 'fills the container', 'warm'), '6@0.5']])}`,
    update: move,
  })

  // ---------- key details: crystalline vs amorphous, molar volume, gas ----------
  const grid = (cols, rows, x0, y0, p, r, jit) => { let s = '', n = 0
    for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) { n++; s += ball(x0 + b * p + (jit ? (rnd(n) - 0.5) * jit : 0) + (jit && a % 2 ? p * 0.18 : 0), y0 + a * p + (jit ? (rnd(n + 40) - 0.5) * jit : 0), r, 'pur') }
    return s }
  const stuck = `<svg style="position:absolute;left:0;top:90px" width="540" height="150">
      <circle cx="190" cy="105" r="22" fill="url(#g-pur)"/><circle cx="234" cy="105" r="22" fill="url(#g-pur)"/><circle cx="278" cy="105" r="22" fill="url(#g-pur)"/><circle cx="322" cy="105" r="22" fill="url(#g-pur)"/>
      <path d="M212 76 Q 256 14 300 76" fill="none" stroke="#f3a764" stroke-width="7" stroke-dasharray="12 10" stroke-linecap="round" marker-end="url(#mk-warm)"/>
      <g><line x1="240" y1="22" x2="274" y2="56" stroke="#f0707a" stroke-width="9" stroke-linecap="round"/><line x1="274" y1="22" x2="240" y2="56" stroke="#f0707a" stroke-width="9" stroke-linecap="round"/></g></svg>`
  const gasDots = `${ball(360, 112, 11, 'warm')}${ball(480, 152, 11, 'warm')}${ball(630, 118, 11, 'warm')}${ball(770, 156, 11, 'warm')}`
  EZ.scene('details', {
    html: `<div class="kicker" data-at="in" data-fx="left">Key details</div><h2 class="h1" data-at="0">What the AP® exam likes</h2>
      <div class="card" style="left:120px;top:290px;width:540px;height:330px" data-at="1"><h3 class="pri">Crystalline</h3>
        <svg style="position:absolute;left:0;top:84px" width="540" height="180"><g data-at="2" data-fx="pop">${grid(9, 4, 110, 28, 40, 18, 0)}</g></svg>
        <div class="ft" data-at="2@0.3" data-fx="fade">regular, repeating · like <span class="pri">salt</span></div></div>
      <div class="card" style="left:690px;top:290px;width:540px;height:330px" data-at="1@0.5"><h3 class="warm">Amorphous</h3>
        <svg style="position:absolute;left:0;top:84px" width="540" height="180"><g data-at="3" data-fx="pop">${grid(9, 4, 110, 28, 40, 18, 9)}</g></svg>
        <div class="ft" style="font-size:28px" data-at="3@0.3" data-fx="fade">no orderly arrangement · like <span class="warm">glass</span></div></div>
      <div class="card" style="left:1260px;top:290px;width:540px;height:330px" data-at="4"><h3>In both kinds</h3>${stuck}
        <div class="ft" style="font-size:33px">can’t move <span class="bad">past each other</span></div></div>
      <div class="card" style="left:120px;top:640px;width:1060px;height:240px" data-at="5">
        <div class="ab" style="left:40px;top:18px">Molar volume</div>
        <svg style="position:absolute;left:0;top:0" width="1060" height="240">
          <g data-at="5@0.3" data-fx="pop">${dots('s', 40, 80, 150, 100, 10)}<text x="115" y="214" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">solid</text></g>
          <text x="226" y="142" text-anchor="middle" font-size="44" font-weight="900" data-at="5@0.55" data-fx="fade">≈</text>
          <g data-at="5@0.45" data-fx="pop">${dots('l', 262, 80, 150, 100, 10)}<text x="337" y="214" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">liquid</text></g>
          <g data-at="6" data-fx="pop"><g transform="translate(176 0)">${box(310, 80, 520, 100)}${gasDots}</g>
            <text x="746" y="214" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">gas: far more space</text></g></svg></div>
      <div class="card" style="left:1210px;top:640px;width:590px;height:240px" data-at="7"><h3 class="warm" style="font-size:36px;padding-top:22px">In a gas, it depends on</h3>
        <div class="rw" style="top:80px;left:40px;font-size:31px"><b class="warm">temperature · pressure · volume</b></div>
        <div class="rw" style="top:128px;left:40px;font-size:27px" data-at="8">little attraction ${ARR}<br><b class="warm" style="font-size:31px">no definite shape or volume</b></div></div>`,
  })

  // ---------- the drawing tip ----------
  const tick = '<span class="good">✓</span> '
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Free response tip</div><h2 class="h1" data-at="0">Drawing particle diagrams</h2>
      <div style="position:absolute;left:120px;top:266px;font-size:32px;font-weight:800;color:var(--muted)" data-at="1" data-fx="fade">Graded on the <span class="warm">details</span></div>
      ${phaseCard('s', 120, 'Solid', 'pri', '2', [[`${tick}touching`, '2'], [`${tick}neat rows <span class="muted">(if crystalline)</span>`, '2@0.5']], 'top:320px;height:510px')}
      ${phaseCard('l', 690, 'Liquid', 'teal', '3', [[`${tick}still touching`, '3'], [`${tick}jumbled`, '3@0.4'], [`${tick}don’t space them out!`, '3@0.7']], 'top:320px;height:510px')}
      ${phaseCard('g', 1260, 'Gas', 'warm', '4', [[`${tick}few particles`, '4'], [`${tick}far apart`, '4@0.4'], [`${tick}randomly placed`, '4@0.7']], 'top:320px;height:510px')}
      <div class="banner" style="top:854px" data-at="5" data-fx="pop">Most common mistake: a liquid drawn <span class="bad">with gaps</span>, like a gas</div>`,
    update(c) {
      move(c)
      const g = c.p('5', 0.4) * (0.7 + 0.3 * Math.sin(c.t * 6)), el = c.$('.lc')
      el.style.borderColor = g ? `rgba(240,112,122,${g})` : ''; el.style.boxShadow = `0 0 ${50 * g}px rgba(240,112,122,${0.5 * g})`
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'The particles are the same size', '1@0.29'], ['B', 'In both phases the particles are in close contact', '1@0.44'],
    ['C', 'Both have definite shapes', '1@0.67'], ['D', 'Neither phase has intermolecular forces', '1@0.8']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:56px" data-at="1">Why do a solid and its liquid typically have<br>similar <span class="teal">molar volumes</span>?</h2>
      ${OPTS.map(([l, s, at], i) => `<div class="opt t${i}" style="top:${330 + i * 104}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:800px;font-size:46px" data-at="4" data-fx="pop">Particles <span class="teal">touch</span> in both ${ARR} similar volume per mole</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const lab = (x, y, t, cls) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="28" font-weight="900" class="${cls}">${t}</text>`
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${dots('s', 15, 30, 130, 120, 9)}${dots('l', 165, 30, 130, 120, 9)}${dots('g', 315, 30, 130, 120, 9)}${lab(80, 184, 'solid', 'f-pri')}${lab(230, 184, 'liquid', 'f-teal')}${lab(380, 184, 'gas', 'f-warm')}</svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210">${grid(5, 4, 44, 28, 38, 17, 0)}${grid(5, 4, 270, 28, 38, 17, 11)}${lab(120, 202, 'crystalline', 'f-pri')}${lab(346, 202, 'amorphous', 'f-warm')}</svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210">${dots('s', 10, 30, 100, 120, 9)}<text x="136" y="104" text-anchor="middle" font-size="44" font-weight="900">≈</text>${dots('l', 162, 30, 100, 120, 9)}${dots('g', 290, 30, 160, 120, 9)}${lab(60, 184, 'solid', 'f-pri')}${lab(212, 184, 'liquid', 'f-teal')}${lab(370, 184, 'gas', 'f-warm')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="pri">Solid:</span> fixed, vibrating<br><span class="teal">Liquid:</span> touching, flowing<br><span class="warm">Gas:</span> far apart, fast, random</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="pri">Crystalline</span> = ordered<br><span class="warm">Amorphous</span> = disordered</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Solids and liquids:<br><span class="teal">similar molar volumes</span><br>Gases: <span class="warm">mostly empty space</span></p></div>`,
  })
})()
