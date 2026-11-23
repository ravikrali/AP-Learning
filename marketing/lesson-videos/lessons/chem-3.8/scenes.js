// Pictures for chem-3.8 "Drawing Solutions at the Particle Level". One EZ.scene per scene id in
// script.mjs. Everything shown is the lesson's own (app/src/content/chem/u3.ts; hydrated ions,
// conductivity and molecular solutes are from book.ts). Particles are schematic: counts, sizes and
// angles are drawn in the right order but not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-t{position:absolute;font-size:34px;font-weight:800;white-space:nowrap}
    .x-chip{position:absolute;left:1360px;width:440px;height:96px;padding:0 26px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:92px;white-space:nowrap}
    .x-chip i{position:absolute;left:24px;top:26px;width:40px;height:40px;border-radius:50%}
    .x-row{position:absolute;left:44px;height:80px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-row small{display:block;font-size:30px;font-weight:800;color:var(--muted)}
    .x-row .x{display:inline-block;width:58px;color:var(--bad)}
    .x-strike{position:absolute;left:-6px;right:-6px;top:52%;height:7px;border-radius:4px;background:var(--bad)}
    .x-pan{position:absolute;left:940px;width:860px;height:265px}
    .x-pan .x-big{position:absolute;left:390px;top:58px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-pan .x-sm{position:absolute;left:390px;top:136px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:34px;font-weight:800;line-height:1.2}
    .opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- water molecules ----------
  // local frame: O at the origin, the two H atoms toward +x. rot turns the H side to that angle.
  const watIn = (s) => `${ball(17 * s, -14 * s, 9 * s, 'gray')}${ball(17 * s, 14 * s, 9 * s, 'gray')}${ball(0, 0, 15 * s, 'red')}`
  let wn = 0
  // a water that can spin into place: rotates from rot + off to rot (see spin)
  const wat = (x, y, rot, s = 1, off = 0, cls = 'wm') => { wn++
    return `<g class="${cls}" data-x="${x.toFixed(1)}" data-y="${y.toFixed(1)}" data-r="${rot.toFixed(1)}" data-o="${off.toFixed(1)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rot + off).toFixed(1)})">${watIn(s)}</g>` }
  const spin = (c, sel, p) => { for (const g of all(c, sel)) { const d = g.dataset
    g.setAttribute('transform', `translate(${d.x} ${d.y}) rotate(${(+d.r + +d.o * (1 - p)).toFixed(1)})`) } }
  // n waters around an ion at (cx, cy): a cation gets the O ends, an anion the H ends
  const shell = (cx, cy, ionR, sign, n, s = 1, a0 = 0, spinOff = 0, cls = 'wm') => {
    let h = ''
    for (let k = 0; k < n; k++) {
      const a = a0 + (k * 360) / n, R = sign > 0 ? ionR + 15 * s + 3 : ionR + 26 * s + 2, rad = (a * Math.PI) / 180
      const off = spinOff ? (rnd(k + cx * 0.37 + cy * 0.11) < 0.5 ? -1 : 1) * spinOff * (0.6 + 0.4 * rnd(k + 9)) : 0
      h += wat(cx + R * Math.cos(rad), cy + R * Math.sin(rad), sign > 0 ? a : a + 180, s, off, cls)
    }
    return h
  }
  const cat = (x, y, r, lab = '+', fs) => ball(x, y, r, 'warm', lab, fs ?? r * 0.9)
  const ani = (x, y, r, lab = '−', fs) => ball(x, y, r, 'teal', lab, fs ?? r * 0.9)
  const naH = (x, y, off = 0, cls = 'wm') => shell(x, y, 30, 1, 5, 1, 18, off, cls) + cat(x, y, 30, sup('Na', '+'), 20)
  const clH = (x, y, off = 0, cls = 'wm') => shell(x, y, 40, -1, 6, 1, 0, off, cls) + ani(x, y, 40, sup('Cl', '−'), 24)

  // glassware (same shapes as chem-3.7)
  const beakerD = (x, y, w, h) => `M${x - 12} ${y} H${x} V${y + h - 26} Q${x} ${y + h} ${x + 26} ${y + h} H${x + w - 26} Q${x + w} ${y + h} ${x + w} ${y + h - 26} V${y} H${x + w + 12}`
  const liqD = (x, y, w, h, lv) => { const t = y + h - lv, i = 7
    return `M${x + i} ${t} H${x + w - i} V${y + h - 26} Q${x + w - i} ${y + h - i} ${x + w - 26} ${y + h - i} H${x + 26} Q${x + i} ${y + h - i} ${x + i} ${y + h - 26} Z` }
  const beaker = (x, y, w, h, lv, sw = 5) =>
    `<path d="${liqD(x, y, w, h, lv)}" fill="rgba(60,199,188,.16)"/><path d="${beakerD(x, y, w, h)}" fill="none" stroke="#c9cee0" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`

  // ---------- intro artwork: faint hydrated ions at the left and right edges (above y = 950) ----------
  EZ.intro = {
    chips: [['1@0.3', 'Correct ratios'], ['1@0.45', 'Concentration'], ['1@0.82', 'Water’s orientation']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${shell(170, 300, 56, 1, 6, 1.5, 0, 150, 'iw')}${cat(170, 300, 56)}
      ${shell(1750, 300, 68, -1, 6, 1.5, 30, 150, 'iw')}${ani(1750, 300, 68)}
      ${shell(190, 790, 68, -1, 6, 1.5, 30, 150, 'iw')}${ani(190, 790, 68)}
      ${shell(1730, 790, 56, 1, 6, 1.5, 0, 150, 'iw')}${cat(1730, 790, 56)}</svg>`,
    update(c) { spin(c, '.iw', eio(c.seg(c.sc.start + 0.4, c.sc.start + 3.2))) },
  }

  // ---------- hook: zoom into a beaker of solution ----------
  const HC = [1000, 590]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">On the exam</div><h2 class="h1" data-at="0">Draw a solution, up close</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade">${beaker(180, 380, 300, 380, 300, 6)}
          <text x="330" y="830" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">NaCl(aq)</text></g>
        <g data-at="0@0.5" data-fx="fade"><line x1="352" y1="560" x2="${HC[0] - 60}" y2="${HC[1] - 264}" stroke="#8d8df0" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>
          <line x1="352" y1="680" x2="${HC[0] - 60}" y2="${HC[1] + 264}" stroke="#8d8df0" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>
          <circle cx="330" cy="620" r="62" fill="none" stroke="#8d8df0" stroke-width="6"/></g>
        <g data-at="0@0.6" data-fx="pop"><g>
          <circle cx="${HC[0]}" cy="${HC[1]}" r="270" fill="rgba(60,199,188,.1)" stroke="#8d8df0" stroke-width="6"/>
          <g class="dr" data-i="0">${naH(HC[0] - 125, HC[1] - 115, 0)}</g>
          <g class="dr" data-i="1">${clH(HC[0] + 110, HC[1] - 105, 0)}</g>
          <g class="dr" data-i="2">${clH(HC[0] - 115, HC[1] + 115, 0)}</g>
          <g class="dr" data-i="3">${naH(HC[0] + 128, HC[1] + 118, 0)}</g>
        </g></g>
      </svg>
      <div class="x-chip" style="top:340px" data-at="1@0.3" data-fx="right"><i style="background:var(--warm)"></i>separate particles</div>
      <div class="x-chip" style="top:456px" data-at="1@0.5" data-fx="right"><i style="background:var(--primary)"></i>how many</div>
      <div class="x-chip" style="top:572px" data-at="1@0.72" data-fx="right"><i style="background:#f0707a"></i>water around them</div>
      <div class="x-chip gold" style="top:720px;border-color:var(--gold)" data-at="2" data-fx="pop"><i style="background:var(--gold)"></i>a few rules = points</div>`,
    update(c) {
      for (const g of all(c, '.dr')) { const i = +g.dataset.i
        g.setAttribute('transform', `translate(${(4 * Math.sin(c.t * 0.9 + i * 1.7)).toFixed(1)} ${(4 * Math.cos(c.t * 0.8 + i * 2.3)).toFixed(1)})`) }
    },
  })

  // ---------- rule 1: correct ratios ----------
  const mover = (cls, x0, y0, x1, y1, inner) => `<g class="${cls}" data-a="${x0},${y0},${x1},${y1}" transform="translate(${x0} ${y0})">${inner}</g>`
  const slide = (c, sel, p) => { for (const g of all(c, sel)) { const [x0, y0, x1, y1] = g.dataset.a.split(',').map(Number)
    g.setAttribute('transform', `translate(${lerp(x0, x1, p).toFixed(1)} ${lerp(y0, y1, p).toFixed(1)})`) } }
  const MG = [[150, 90], [420, 230], [650, 110]], CL = [[90, 240], [270, 120], [280, 280], [560, 260], [520, 90], [720, 240]], UX = [190, 405, 620]
  let mgcl = ''
  MG.forEach(([x, y], k) => {
    mgcl += mover('rmv', UX[k] - 62, 170, ...CL[2 * k], ani(0, 0, 36, sup('Cl', '−'), 22))
    mgcl += mover('rmv', UX[k] + 62, 170, ...CL[2 * k + 1], ani(0, 0, 36, sup('Cl', '−'), 22))
    mgcl += mover('rmv', UX[k], 170, x, y, cat(0, 0, 28, sup('Mg', '2+'), 18))
  })
  const sulf = (x, y, cls = '') => `<g transform="translate(${x} ${y})"><circle class="${cls}" r="50" fill="rgba(242,196,67,.1)" stroke="#f2c443" stroke-width="3" stroke-dasharray="8 7"/>
    ${ball(0, -25, 13, 'red')}${ball(-24, 6, 13, 'red')}${ball(0, 0, 16, 'gold')}${ball(24, 6, 13, 'red')}${ball(0, 27, 13, 'red')}</g>`
  const kI = ball(0, 0, 28, 'pur', sup('K', '+'), 22)
  const kso = `${sulf(230, 150, 'sr')}${sulf(560, 230, 'sr')}
    ${mover('kmv', 150, 150, 90, 270, kI)}${mover('kmv', 310, 150, 380, 70, kI)}${mover('kmv', 480, 230, 400, 300, kI)}${mover('kmv', 640, 230, 700, 100, kI)}`
  const box = '<rect x="30" y="10" width="750" height="330" rx="26" fill="rgba(60,199,188,.07)" stroke="#3a4058" stroke-width="2"/>'
  EZ.scene('ratio', {
    html: `<div class="kicker" data-at="in" data-fx="left">Rule 1</div><h2 class="h1" data-at="0">Correct ratios</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:570px" data-at="2"><h3>0.1 M MgCl<sub>2</sub></h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="345">${box}${mgcl}</svg>
        <div class="x-t" style="left:44px;top:446px" data-at="3@0.2" data-fx="fade"><span class="teal">2×</span> as many Cl<sup>−</sup> as Mg<sup>2+</sup></div>
        <div class="x-t" style="left:44px;top:500px" data-at="4@0.3" data-fx="fade"><span class="bad">✗</span> not “MgCl<sub>2</sub> molecules”</div>
        <svg style="position:absolute;left:560px;top:488px" width="220" height="64" data-at="4@0.3" data-fx="fade">${ani(64, 32, 24)}${cat(108, 32, 18)}${ani(152, 32, 24)}<line x1="30" y1="58" x2="186" y2="6" stroke="#f0707a" stroke-width="7" stroke-linecap="round"/></svg></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:570px" data-at="5"><h3>K<sub>2</sub>SO<sub>4</sub>(aq)</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="345">${box}${kso}</svg>
        <div class="x-t" style="left:44px;top:446px" data-at="5@0.65" data-fx="fade"><span class="pri">2 K<sup>+</sup></span> for every <span class="gold">1 SO<sub>4</sub><sup>2−</sup></span></div>
        <div class="x-t" style="left:44px;top:500px" data-at="6@0.2" data-fx="fade">SO<sub>4</sub><sup>2−</sup> <span class="good">stays together</span> <span class="muted">(not S + O)</span></div></div>
      <div class="banner" style="top:886px;padding:14px 40px;font-size:44px" data-at="1" data-fx="pop">Ionic solutes ${ARR} drawn as <span class="teal">separate ions</span></div>`,
    update(c) {
      const b = c.b
      slide(c, '.rmv', eio(c.seg(b[2].start + 0.9, b[2].start + 2.4)))
      slide(c, '.kmv', eio(c.seg(b[5].start + 0.8, b[5].start + 2.3)))
      const t6 = c.t - b[6].start - 0.6, w = t6 < 0 || t6 > 3 ? 0 : Math.sin((Math.PI * t6) / 3)
      for (const r of all(c, '.sr')) { r.style.strokeWidth = 3 + 4 * w; r.style.filter = `drop-shadow(0 0 ${16 * w}px rgba(242,196,67,${0.9 * w}))` }
    },
  })

  // ---------- rule 2: relative concentration ----------
  const BA = [300, 1240], BY = 360, BW = 380, BH = 400, LV = 320
  const PA = [[0.25, 0.3], [0.7, 0.22], [0.35, 0.72], [0.75, 0.66]]
  const PB = [[0.18, 0.2], [0.5, 0.15], [0.82, 0.24], [0.3, 0.48], [0.68, 0.45], [0.16, 0.78], [0.5, 0.75], [0.84, 0.8]]
  const parts = (x0, P, k0, at0, step) => P.map(([fx, fy], i) => `<g data-at="${at0}@${(0.05 + i * step).toFixed(2)}" data-fx="pop"><g class="cp" data-i="${k0 + i}" data-x="${x0 + 30 + fx * (BW - 60)}" data-y="${BY + BH - LV + 26 + fy * (LV - 60)}">${ball(0, 0, 20, 'warm')}</g></g>`).join('')
  EZ.scene('conc', {
    html: `<div class="kicker" data-at="in" data-fx="left">Rule 2</div><h2 class="h1" data-at="0">Relative concentration</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${beaker(BA[0], BY, BW, BH, LV)}${beaker(BA[1], BY, BW, BH, LV)}
          <text x="${BA[0] + BW / 2}" y="340" text-anchor="middle" font-size="44" font-weight="900">A</text><text x="${BA[1] + BW / 2}" y="340" text-anchor="middle" font-size="44" font-weight="900">B</text></g>
        ${parts(BA[0], PA, 0, 2, 0.08)}${parts(BA[1], PB, 10, 2, 0.06)}
        <g data-at="2@0.75" data-fx="fade"><line x1="${BA[0] + BW + 20}" y1="${BY + BH - LV}" x2="${BA[1] - 20}" y2="${BY + BH - LV}" stroke="#3cc7bc" stroke-width="4" stroke-dasharray="12 10"/>
          <text x="${(BA[0] + BW + BA[1]) / 2}" y="${BY + BH - LV - 18}" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">same volume</text></g>
        <text x="${BA[0] + BW / 2}" y="816" text-anchor="middle" font-size="38" font-weight="900" class="f-warm" data-at="2@0.3" data-fx="fade">4 solute particles</text>
        <text x="${BA[1] + BW / 2}" y="816" text-anchor="middle" font-size="38" font-weight="900" class="f-warm" data-at="2@0.65" data-fx="fade">8 solute particles</text>
        <text x="${BA[1] + BW / 2}" y="862" text-anchor="middle" font-size="36" font-weight="900" class="f-good" data-at="3@0.6" data-fx="fade">double the concentration</text>
      </svg>
      <div class="banner" style="top:900px;padding:14px 40px;font-size:42px" data-at="1" data-out="3" data-fx="pop">More concentrated ${ARR} more solute particles in the <span class="teal">same space</span></div>
      <div class="banner" style="top:900px;padding:14px 40px;font-size:42px" data-at="3" data-fx="pop"><span class="warm">2×</span> the particles, same volume ${ARR} <span class="good">2×</span> the concentration</div>`,
    update(c) {
      for (const g of all(c, '.cp')) { const d = g.dataset, i = +d.i
        g.setAttribute('transform', `translate(${(+d.x + 3 * Math.sin(c.t * 1.6 + i * 1.7)).toFixed(1)} ${(+d.y + 3 * Math.cos(c.t * 1.4 + i * 2.1)).toFixed(1)})`) }
    },
  })

  // ---------- rule 3: orientation of water ----------
  EZ.scene('water', {
    html: `<div class="kicker" data-at="in" data-fx="left">Rule 3</div><h2 class="h1" data-at="0">The orientation of water</h2>
      <div class="card" style="left:120px;top:290px;width:480px;height:530px" data-at="1"><h3>Water</h3>
        <svg style="position:absolute;left:0;top:70px" width="480" height="440">
          ${ball(150, 280, 34, 'gray', 'H', 30)}${ball(330, 280, 34, 'gray', 'H', 30)}${ball(240, 185, 62, 'red', 'O', 50)}
          <text x="240" y="92" text-anchor="middle" font-size="46" font-weight="900" class="f-bad" data-at="1@0.4" data-fx="fade">δ−</text>
          <text x="150" y="372" text-anchor="middle" font-size="46" font-weight="900" class="f-teal" data-at="1@0.8" data-fx="fade">δ+</text>
          <text x="330" y="372" text-anchor="middle" font-size="46" font-weight="900" class="f-teal" data-at="1@0.8" data-fx="fade">δ+</text></svg></div>
      <div class="card" style="left:640px;top:290px;width:560px;height:530px" data-at="2"><h3 class="warm">Cation (+)</h3>
        <svg style="position:absolute;left:0;top:76px" width="560" height="360"><g class="hy" data-i="0">${shell(280, 180, 50, 1, 6, 1.5, 0, 160, 'w2')}${cat(280, 180, 50)}</g></svg>
        <div class="x-t" style="left:0;right:0;top:450px;text-align:center" data-at="2@0.6" data-fx="fade"><span class="bad">O end (δ−)</span> toward the ion</div></div>
      <div class="card" style="left:1240px;top:290px;width:560px;height:530px" data-at="3"><h3 class="teal">Anion (−)</h3>
        <svg style="position:absolute;left:0;top:76px" width="560" height="360"><g class="hy" data-i="1">${shell(280, 180, 60, -1, 6, 1.5, 30, 160, 'w3')}${ani(280, 180, 60)}</g></svg>
        <div class="x-t" style="left:0;right:0;top:450px;text-align:center" data-at="3@0.6" data-fx="fade"><span class="teal">H ends (δ+)</span> toward the ion</div></div>
      <div class="banner" style="top:850px;padding:14px 40px;font-size:42px" data-at="4" data-out="5" data-fx="pop"><span class="pri">Ion–dipole</span> attractions: each ion surrounded by water</div>
      <div class="banner" style="top:850px;padding:14px 40px;font-size:42px" data-at="5" data-out="6" data-fx="pop">Draw <span class="warm">a few</span> waters per ion, facing the right way</div>
      <div class="banner" style="top:850px;padding:14px 40px;font-size:42px" data-at="6" data-fx="pop">Hydrated ions move independently ${ARR} <span class="good">conducts electricity</span></div>`,
    update(c) {
      const b = c.b
      spin(c, '.w2', eio(c.seg(b[2].start + 0.5, b[2].start + 2.2)))
      spin(c, '.w3', eio(c.seg(b[3].start + 0.5, b[3].start + 2.2)))
      const m = eio(c.seg(b[6].start + 0.3, b[6].start + 1.2))
      for (const g of all(c, '.hy')) { const i = +g.dataset.i
        g.setAttribute('transform', `translate(${(m * 10 * Math.sin(c.t * 1.1 + i * 2)).toFixed(1)} ${(m * 12 * Math.cos(c.t * 0.9 + i * 2.6)).toFixed(1)})`) }
    },
  })

  // ---------- molecular solutes ----------
  const molW = (x, y, r, k0) => Array.from({ length: 6 }, (_, k) => { const a = (k * 60 + 15) * Math.PI / 180, R = r + 30
    return wat(x + R * Math.cos(a), y + R * Math.sin(a), rnd(k0 + k) * 360, 1, 0, 'wx') }).join('')
  EZ.scene('molecular', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Ions or molecules?</div><h2 class="h1" data-at="0">Not every solute splits</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:540px" data-at="0@0.3"><h3 class="warm">Ionic solute</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="300">${naH(240, 150)}${clH(570, 150)}</svg>
        <div class="x-t" style="left:44px;top:390px" data-at="0@0.6" data-fx="fade">separate <span class="warm">ions</span></div>
        <div class="x-t" style="left:44px;top:450px" data-at="3" data-fx="fade"><span class="good">✓ conducts electricity</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:540px" data-at="1"><h3 class="pri">Molecular solute</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="300">
          <g data-at="2" data-fx="fade">${molW(230, 135, 54, 3)}${molW(580, 135, 46, 11)}</g>
          ${ball(230, 135, 54, 'pur')}${ball(580, 135, 46, 'pur')}
          <text x="230" y="290" text-anchor="middle" font-size="32" font-weight="900" class="f-pri" data-at="1@0.45" data-fx="fade">glucose</text>
          <text x="580" y="290" text-anchor="middle" font-size="32" font-weight="900" class="f-pri" data-at="1@0.6" data-fx="fade">ethanol</text></svg>
        <div class="x-t" style="left:44px;top:390px" data-at="2" data-fx="fade">intact <span class="pri">molecules</span>: one particle each</div>
        <div class="x-t" style="left:44px;top:450px" data-at="3@0.3" data-fx="fade"><span class="bad">✗</span> no net charge: <span class="bad">does not conduct</span></div></div>
      <div class="banner" style="top:866px;padding:14px 40px;font-size:42px" data-at="4" data-fx="pop"><span class="warm">Ions</span> or <span class="pri">molecules</span>? Often the main thing a diagram tests</div>`,
  })

  // ---------- the trick: water as a tiny head ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="1">Water as a tiny head</h2>
      <div class="card" style="left:120px;top:290px;width:760px;height:560px" data-at="1@0.2">
        <svg style="position:absolute;left:0;top:0" width="760" height="560">
          ${ball(265, 200, 62, 'gray', 'δ+', 44)}${ball(495, 200, 62, 'gray', 'δ+', 44)}${ball(380, 330, 115, 'red', 'δ−', 84)}
          <text x="380" y="78" text-anchor="middle" font-size="40" font-weight="900" class="f-teal" data-at="3" data-fx="fade">ears = H atoms (δ+)</text>
          <text x="380" y="515" text-anchor="middle" font-size="40" font-weight="900" class="f-bad" data-at="2" data-fx="fade">face = O atom (δ−)</text></svg></div>
      <div class="card x-pan" style="top:290px" data-at="4"><svg style="position:absolute;left:0;top:0" width="380" height="265">${cat(140, 132, 50)}${wat(140 + 50 + 30 + 4, 132, 0, 2, 120, 'hw1')}</svg>
        <div class="x-big"><span class="warm">Cation?</span></div><div class="x-sm">Show it the <span class="bad">face</span></div></div>
      <div class="card x-pan" style="top:585px" data-at="5"><svg style="position:absolute;left:0;top:0" width="380" height="265">${ani(130, 132, 60)}${wat(130 + 60 + 4 + 18 + 34, 132, 180, 2, -120, 'hw2')}</svg>
        <div class="x-big"><span class="teal">Anion?</span></div><div class="x-sm">Show it the <span class="teal">ears</span></div></div>
      <div class="banner" style="top:880px;padding:14px 40px;font-size:46px" data-at="6" data-fx="pop">Opposites <span class="gold">face each other</span></div>`,
    update(c) {
      const b = c.b
      spin(c, '.hw1', eio(c.seg(b[4].start + 0.3, b[4].start + 1.3)))
      spin(c, '.hw2', eio(c.seg(b[5].start + 0.3, b[5].start + 1.3)))
    },
  })

  // ---------- trap: what is not tested ----------
  const NOT = [['Colligative properties', 'like freezing point depression', '1@0.3', 380], ['Calculating molality', '', '2@0.3', 330], ['Mass percent', '', '2@0.6', 230], ['Volume percent', '', '2@0.8', 270]]
  const star = (cx, cy, R, r) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 5, q = k % 2 ? r : R; return `${(cx + q * Math.cos(a)).toFixed(1)},${(cy + q * Math.sin(a)).toFixed(1)}` }).join(' ')
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Good news</div><h2 class="h1" data-at="0">Not on the AP® exam</h2>
      <div class="card" style="left:120px;top:290px;width:1000px;height:560px" data-at="1"><h3 class="muted">Not tested</h3>
        ${NOT.map(([a, s, at, w], i) => `<div class="x-row" style="top:${[110, 260, 350, 440][i]}px" data-at="${at}" data-fx="left"><span class="x">✗</span><span style="position:relative">${a}<i class="x-strike" data-at="${at}+0.5" data-fx="grow" data-dur="0.35"></i></span>${s ? `<small style="margin-left:58px">${s}</small>` : ''}</div>`).join('')}</div>
      <div class="card" style="left:1180px;top:290px;width:620px;height:560px" data-at="3"><h3 class="gold">The star</h3>
        <svg style="position:absolute;left:0;top:70px" width="620" height="470"><g class="st"><polygon points="${star(310, 200, 170, 78)}" fill="rgba(242,196,67,.22)" stroke="#f2c443" stroke-width="7" stroke-linejoin="round"/></g>
          <text x="310" y="232" text-anchor="middle" font-size="96" font-weight="900" class="f-gold">M</text>
          <text x="310" y="440" text-anchor="middle" font-size="60" font-weight="900" class="f-gold">Molarity</text></svg></div>`,
    update(c) {
      const t = c.t - c.b[3].start, w = t < 0 || t > 2.4 ? 0 : Math.sin((Math.PI * t) / 2.4)
      c.$('.st').style.filter = `drop-shadow(0 0 ${26 * w}px rgba(242,196,67,${0.9 * w}))`
    },
  })

  // ---------- try it ----------
  const OPTS = ['Oxygen atoms pointing toward Cl<sup>−</sup>', 'Hydrogen atoms pointing toward Cl<sup>−</sup>', 'Randomly', 'Water should not be drawn near ions']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">How should water be oriented around <span class="teal">Cl<sup>−</sup></span>?</h2>
      <div style="position:absolute;left:120px;top:272px;font-size:36px;font-weight:800;color:var(--muted)" data-at="1@0.2">In a correct particle diagram of <b style="color:var(--text)">NaCl(aq)</b></div>
      ${OPTS.map((o, i) => `<div class="opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="2@${[0, 0.27, 0.52, 0.7][i]}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? CHECK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:680px;padding:16px 40px;font-size:44px" data-at="5" data-fx="pop">Cl<sup>−</sup> is <span class="teal">negative</span> ${ARR} attracts the <span class="teal">δ+ H ends</span> of water</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="6" data-fx="pop"><g>${shell(720, 890, 40, -1, 6, 1, 0)}${ani(720, 890, 40, sup('Cl', '−'), 24)}</g></g></svg>
      <div style="position:absolute;left:850px;top:860px;font-size:48px;font-weight:900" data-at="6@0.15" data-fx="right"><span class="teal">Anion?</span> Show it the <span class="teal">ears</span></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.5, b[4].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210">${cat(130, 70, 24, sup('Mg', '2+'), 16)}${ani(260, 50, 32, sup('Cl', '−'), 20)}${ani(330, 140, 32, sup('Cl', '−'), 20)}
    ${cat(110, 160, 24, sup('Mg', '2+'), 16)}${ani(40, 90, 32, sup('Cl', '−'), 20)}${ani(220, 160, 32, sup('Cl', '−'), 20)}</svg>`
  let r2 = `<svg width="460" height="210" viewBox="0 0 460 210">${beaker(40, 20, 160, 170, 130, 4)}${beaker(260, 20, 160, 170, 130, 4)}`
  ;[[0.25, 0.3], [0.72, 0.25], [0.35, 0.75], [0.75, 0.7]].forEach(([fx, fy]) => { r2 += ball(54 + fx * 132, 84 + fy * 96, 11, 'warm') })
  PB.forEach(([fx, fy]) => { r2 += ball(274 + fx * 132, 84 + fy * 96, 11, 'warm') })
  r2 += '</svg>'
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${shell(110, 105, 34, 1, 6, 1, 0)}${cat(110, 105, 34)}${shell(340, 105, 40, -1, 6, 1, 30)}${ani(340, 105, 40)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Show ions <span class="warm">separated</span>,<br>in the <span class="teal">correct ratio</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>More concentrated =<br><span class="warm">more solute particles</span><br>per volume</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Water: <span class="bad">O end</span> faces cations,<br><span class="teal">H ends</span> face anions</p></div>`,
  })
})()
