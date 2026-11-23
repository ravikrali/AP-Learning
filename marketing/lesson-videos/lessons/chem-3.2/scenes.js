// Pictures for chem-3.2 "Types of Solids & Their Properties". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u3.ts; why graphite conducts and the
// four-question check are from book.ts). Lattices and particles are schematic: ion sizes are in the
// right order (cation smaller than anion) but nothing is to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .ex{margin-left:26px;font-size:40px;font-weight:800;letter-spacing:0;color:var(--muted)}
    .pic{left:120px;top:300px;width:900px;height:600px}
    .prop{position:absolute;left:1080px;width:720px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .prop i{position:absolute;left:22px;top:28px;width:46px;height:46px;border-radius:50%}
    .prop b{display:block;font-size:34px;font-weight:900;line-height:1.15;white-space:nowrap} .prop span{display:block;font-size:26px;font-weight:700;color:var(--muted);white-space:nowrap}
    .cp{position:absolute;left:0;right:0;text-align:center;font-size:34px;font-weight:900;white-space:nowrap}
    .ln{position:absolute;left:44px;font-size:31px;font-weight:800;white-space:nowrap}
    .hk{top:290px;width:810px;height:520px}
    .tag{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:40px;font-weight:900}
    .hr{position:absolute;left:120px;width:1680px;height:130px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .hr .r{position:absolute;left:40px;top:14px;font-size:46px;font-weight:900;white-space:nowrap}
    .hr .e{position:absolute;left:40px;top:76px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .hr .ar{position:absolute;left:1000px;top:34px;font-size:56px;color:var(--muted)}
    .ty{position:absolute;left:1120px;top:20px;width:520px;height:88px;border-radius:22px;text-align:center;font-size:44px;font-weight:900;line-height:82px;border:3px solid;white-space:nowrap}
    .memo{position:absolute;left:720px;top:30px;padding:4px 18px;border:5px solid var(--gold);border-radius:14px;color:var(--gold);font-size:34px;font-weight:900;transform:rotate(-7deg);background:rgba(14,16,24,.85)}
    .qr{position:absolute;left:120px;width:1680px;height:104px;border-radius:24px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .qr .n{position:absolute;left:24px;top:18px;width:66px;height:66px;border-radius:50%;background:var(--brand);font-size:36px;font-weight:900;line-height:66px;text-align:center}
    .qr .q{position:absolute;left:118px;top:24px;font-size:40px;font-weight:900;white-space:nowrap}
    .qr .ty{left:1180px;top:12px;width:470px;height:76px;font-size:38px;line-height:70px}
    .why{left:120px;top:780px;width:1680px;height:160px;padding:24px 48px;font-size:36px;font-weight:800;line-height:1.4}
    .why .lab{display:block;font-size:24px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .chx{position:absolute;top:300px;height:76px;padding:0 28px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:900;line-height:72px;white-space:nowrap}
    .tile{position:absolute;top:420px;width:390px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{position:absolute;left:0;right:0;top:84px;font-size:50px;font-weight:900;line-height:1.05}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const rnd = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
  const wrap = (v, a, b) => a + ((((v - a) % (b - a)) + (b - a)) % (b - a))
  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const prop = (i, at, color, a, b, out) => `<div class="prop" style="top:${300 + i * 122}px" data-at="${at}"${out ? ` data-out="${out}"` : ''} data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`

  // ---------- diamond: a 3-D network (diamond cubic cell), spun in update ----------
  const DIA = (() => { const N = 6, P = []
    for (let a = 0; a <= N; a += 2) for (let b = 0; b <= N; b += 2) for (let c = 0; c <= N; c += 2) if ((a + b + c) % 4 === 0) P.push([a, b, c])
    const n = P.length
    for (let k = 0; k < n; k++) if (P[k].every((v) => v + 1 <= N)) P.push(P[k].map((v) => v + 1))
    const B = []
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) if (P[i].reduce((s, v, k) => s + (v - P[j][k]) ** 2, 0) === 3) B.push([i, j])
    const used = [...new Set(B.flat())].sort((x, y) => x - y), idx = new Map(used.map((v, k) => [v, k]))
    return { P: used.map((i) => P[i].map((v) => v - N / 2)), B: B.map(([i, j]) => [idx.get(i), idx.get(j)]) }
  })()
  const dia = (cls, r = 12, w = 5) => `<g class="${cls}">${DIA.B.map(() => `<line class="db" stroke="#c9cee0" stroke-width="${w}" stroke-linecap="round"/>`).join('')}${DIA.P.map(() => `<g class="da">${ball(0, 0, r, 'gray')}</g>`).join('')}</g>`
  function spin(c, cls, cx, cy, s, ang, o = {}) {
    const tl = o.tilt ?? 0.42, ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tl), st = Math.sin(tl)
    const Q = DIA.P.map(([x, y, z]) => { const X = x * ca - z * sa, Z = x * sa + z * ca; return [cx + s * X, cy + s * (y * ct - Z * st), y * st + Z * ct] })
    all(c, `.${cls} .db`).forEach((l, k) => { const [i, j] = DIA.B[k]
      l.setAttribute('x1', Q[i][0].toFixed(1)); l.setAttribute('y1', Q[i][1].toFixed(1)); l.setAttribute('x2', Q[j][0].toFixed(1)); l.setAttribute('y2', Q[j][1].toFixed(1))
      l.style.stroke = o.stroke ?? '' })
    all(c, `.${cls} .da`).forEach((g, k) => { const [x, y, d] = Q[k]
      g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(1 - d * 0.045).toFixed(3)})`); g.style.opacity = clamp(0.95 - d * 0.07, 0.45, 1) })
  }

  // ---------- graphite: flat honeycomb layers seen at an angle ----------
  const honey = (W, H, a, k) => { const P = []
    for (let j = -10; j <= 10; j++) for (let i = -12; i <= 12; i++) { const x = i * Math.sqrt(3) * a + (j * Math.sqrt(3) * a) / 2, y = j * 1.5 * a
      for (const p of [[x, y], [x, y + a]]) if (Math.abs(p[0]) <= W / 2 && Math.abs(p[1]) <= H / 2) P.push(p) }
    const B = []
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) if (Math.abs(Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]) - a) < 0.5) B.push([i, j])
    return { P: P.map(([x, y]) => [x, y * k]), B } }
  const sheet = (L, r, w = 4) => `${L.B.map(([i, j]) => `<line x1="${L.P[i][0].toFixed(1)}" y1="${L.P[i][1].toFixed(1)}" x2="${L.P[j][0].toFixed(1)}" y2="${L.P[j][1].toFixed(1)}" stroke="#c9cee0" stroke-width="${w}"/>`).join('')}${L.P.map(([x, y]) => ball(x, y, r, 'gray')).join('')}`
  const BIG = honey(520, 130, 40, 0.55), SM = honey(280, 80, 26, 0.5)
  // weak forces between layers: short dashes in the gap
  const weak = (x0, y0, w, n) => Array.from({ length: n }, (_, i) => { const x = x0 + (i + 0.5) * (w / n); return `<line x1="${x}" x2="${x}" y1="${y0 - 7}" y2="${y0 + 7}" stroke="#a3abbd" stroke-width="4" stroke-dasharray="4 5"/>` }).join('')

  // ---------- ionic lattice: + small, − large, split into a top and a bottom block ----------
  const ionLat = (cls, cols, rows, s, split) => { let top = '', bot = ''
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = (i - (cols - 1) / 2) * s, y = (j - (rows - 1) / 2) * s
      const b = (i + j) % 2 === 0 ? ball(x, y, s * 0.3, 'warm', '+', s * 0.36) : ball(x, y, s * 0.46, 'teal', '−', s * 0.42)
      if (j < split) top += b; else bot += b }
    return `<g class="${cls}b">${bot}</g><g class="${cls}t">${top}</g>` }
  function shatter(c, cls, cx, cy, s, tShift, tCrack) {
    const p1 = eio(c.seg(tShift, tShift + 0.9)), p2 = eo(c.seg(tCrack, tCrack + 0.7)), j = 1.5 * Math.sin(c.t * 9)
    c.$(`.${cls}t`).setAttribute('transform', `translate(${(cx + s * p1 - 34 * p2 + j).toFixed(1)} ${(cy - 45 * p2).toFixed(1)}) rotate(${(-5 * p2).toFixed(2)})`)
    c.$(`.${cls}b`).setAttribute('transform', `translate(${(cx + 16 * p2 - j).toFixed(1)} ${(cy + 22 * p2).toFixed(1)}) rotate(${(4 * p2).toFixed(2)})`)
    return p2
  }

  // ---------- I2 molecules ----------
  const i2 = (x, y, a, cls = 'mo', i = 0) => `<g class="${cls}" data-i="${i}" data-x="${x}" data-y="${y}" data-a="${a}" transform="translate(${x} ${y}) rotate(${a})">${ball(-24, 0, 26, 'pur', 'I', 26)}${ball(24, 0, 26, 'pur', 'I', 26)}</g>`

  // ---------- intro artwork: a faint graphite layer (top left) and diamond (top right) ----------
  EZ.intro = {
    chips: [['1@0.3', 'Four types of solids'], ['1@0.55', 'What holds them'], ['1@0.82', 'How to identify them']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2"><g class="ih">${sheet(honey(300, 420, 34, 0.5), 9)}</g>${dia('idia', 9, 4)}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      c.$('.ih').setAttribute('transform', `translate(${220 + 8 * Math.sin(t * 0.8)} 290)`)
      spin(c, 'idia', 1720, 290, 24, t * 0.45)
    },
  }

  // ---------- hook: diamond vs graphite ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">A puzzle</div><h2 class="h1" data-at="0">Same atoms, different solids</h2>
      <div class="card hk" style="left:120px" data-at="1"><h3>Diamond <span class="muted" style="font-size:32px">pure carbon</span></h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="340">${dia('hd', 11, 5)}</svg>
        <div class="tag teal" data-at="1@0.5" data-fx="pop">hardest natural material</div></div>
      <div class="card hk" style="left:990px" data-at="2"><h3>Graphite <span class="muted" style="font-size:32px">pure carbon</span></h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="340">
          ${[0, 1, 2].map((k) => `<g class="hl${k}" transform="translate(405 ${70 + k * 100})">${sheet(BIG, 8, 4)}</g>`).join('')}</svg>
        <div class="tag warm" data-at="2@0.6" data-fx="pop">soft enough to write with</div></div>
      <div class="banner" style="top:840px" data-at="3" data-out="4" data-fx="pop">Same atoms ${ARR} different <span class="pri">structure</span> ${ARR} different <span class="warm">properties</span></div>
      <div class="banner" style="top:840px" data-at="4" data-fx="pop">Sort solids by their <span class="teal">particles</span> and the <span class="warm">forces</span> between them</div>`,
    update(c) {
      spin(c, 'hd', 405, 168, 32, c.t * 0.5)
      for (let k = 0; k < 3; k++) c.$('.hl' + k).setAttribute('transform', `translate(${405 + (2 - k) * 6 * Math.sin(c.t * 1.2 + k)} ${70 + k * 100})`)
    },
  })

  // ---------- ionic solids ----------
  const FI = []
  for (let j = 0; j < 4; j++) for (let i = 0; i < 5; i++) FI.push([450 + (i - 2) * 80, 340 + (j - 1.5) * 80, (i + j) % 2 === 0 ? 1 : -1, 450 + (i - 2) * 112, 340 + (j - 1.5) * 98])
  EZ.scene('ionic', {
    html: `<div class="kicker" data-at="in" data-fx="left">Type 1</div><h2 class="h1" data-at="0">Ionic solids<span class="ex">NaCl, MgO</span></h2>
      <div class="card pic" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="900" height="600">
          <g data-at="in" data-out="4" data-fx="fade">${ionLat('il', 7, 5, 78, 2)}
            <text x="450" y="576" text-anchor="middle" font-size="34" font-weight="900" class="f-bad" data-at="3@0.55" data-fx="pop">layers shift: it shatters</text></g>
          <g data-at="4" data-fx="fade">
            <path d="M170 520 V160 M730 520 V160" stroke="#c9cee0" stroke-width="12" stroke-linecap="round"/>
            <path d="M170 160 V80 H412 M488 80 H730 V160" fill="none" stroke="#7d859c" stroke-width="6"/>
            <circle class="glow" cx="450" cy="80" r="70" fill="#f2c443" opacity="0"/>
            <circle class="bulb" cx="450" cy="80" r="34" fill="#242838" stroke="#c9cee0" stroke-width="6"/>
            <text x="130" y="200" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">−</text><text x="770" y="200" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">+</text>
            ${FI.map(([x, y, q, mx, my], i) => `<g class="fi" data-i="${i}" data-x="${x}" data-y="${y}" data-mx="${mx}" data-my="${my}" data-q="${q}" transform="translate(${x} ${y})">${q > 0 ? ball(0, 0, 24, 'warm', '+', 30) : ball(0, 0, 37, 'teal', '−', 34)}</g>`).join('')}
            <text x="450" y="574" text-anchor="middle" font-size="34" font-weight="900" class="f-muted" data-at="4@0.3" data-out="5" data-fx="fade">solid: no current</text>
            <text x="450" y="574" text-anchor="middle" font-size="34" font-weight="900" class="f-good" data-at="5@0.55" data-fx="fade">melted: the ions move, so it conducts</text></g>
        </svg></div>
      ${prop(0, '1', '#3cc7bc', 'Ions', 'held by Coulombic attractions')}
      ${prop(1, '2', '#f3a764', 'High melting point', 'and low vapor pressure')}
      ${prop(2, '3', '#f0707a', 'Brittle', 'shatters when layers shift')}
      ${prop(3, '4', '#7d859c', 'Solid: does not conduct', 'the ions stay put')}
      ${prop(4, '5', '#4cc781', 'Conducts when melted', 'or dissolved: ions can move')}`,
    update(c) {
      const b = c.b, t = c.t
      shatter(c, 'il', 450, 288, 78, b[3].start + 0.2, b[3].start + 1.3)
      const m = eio(c.seg(b[5].start + 0.3, b[5].start + 1.8))
      all(c, '.fi').forEach((g) => { const d = g.dataset, i = +d.i
        const x = lerp(+d.x, +d.mx, m) + m * 11 * Math.sin(t * 1.7 + i * 2.1) + 2 * Math.sin(t * 11 + i), y = lerp(+d.y, +d.my, m) + m * 10 * Math.cos(t * 1.4 + i * 1.3) + 2 * Math.cos(t * 10 + i)
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`) })
      c.$('.glow').setAttribute('opacity', (0.35 * m * (0.8 + 0.2 * Math.sin(t * 6))).toFixed(3))
      c.$('.bulb').style.fill = m > 0.02 ? `rgba(242,196,67,${m})` : ''
    },
  })

  // ---------- covalent network solids ----------
  EZ.scene('network', {
    html: `<div class="kicker" data-at="in" data-fx="left">Type 2</div><h2 class="h1" data-at="0">Covalent network solids</h2>
      <div class="card pic" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="900" height="600">${dia('nd', 13, 6)}
          <text x="450" y="574" text-anchor="middle" font-size="34" font-weight="900" class="f-teal" data-at="1@0.4" data-fx="fade">atoms joined by covalent bonds</text></svg></div>
      ${prop(0, '1', '#3cc7bc', 'Atoms in a network', 'of covalent bonds')}
      ${prop(1, '2', '#8d8df0', 'Nonmetals and metalloids', 'diamond, graphite, SiO₂, SiC')}
      ${prop(2, '3', '#f3a764', 'Very high melting point', 'melting breaks covalent bonds')}
      ${prop(3, '4', '#aab1c4', 'Very hard (3-D)', 'and non-conducting')}
      ${prop(4, '5', '#f2c443', 'Exception: graphite', 'graphite conducts')}`,
    update(c) {
      const b = c.b, t = c.t, heat = c.seg(b[3].start, b[3].start + 0.5) * (1 - c.seg(b[4].start, b[4].start + 0.5))
      const h = heat * (0.65 + 0.35 * Math.sin(t * 7))
      spin(c, 'nd', 450, 270, 54, t * 0.4, { stroke: heat > 0.01 ? `rgb(${Math.round(lerp(201, 243, h))},${Math.round(lerp(206, 167, h))},${Math.round(lerp(224, 100, h))})` : undefined })
    },
  })

  // ---------- diamond vs graphite ----------
  let ele = ''
  for (let k = 0; k < 9; k++) ele += `<circle class="el" data-i="${k}" r="7" fill="#3cc7bc"/>`
  EZ.scene('carbon', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Back to the puzzle</div><h2 class="h1" data-at="0">Diamond vs. graphite</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:620px" data-at="0@0.3"><h3>Diamond</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="350">${dia('cd', 11, 5)}</svg>
        <div class="ln teal" style="top:452px" data-at="1@0.2" data-fx="left">3-D network, fixed bond angles</div>
        <div class="ln" style="top:506px" data-at="1@0.65" data-fx="left">${ARR}rigid and super hard</div>
        <div class="ln muted" style="top:560px" data-at="6@0.3" data-fx="left">4 bonds per C ${ARR}<span class="bad">insulator</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:620px" data-at="2"><h3>Graphite</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="350">
          <g class="gl0" transform="translate(405 80)">${sheet(BIG, 8, 4)}</g>
          <g data-at="3@0.5" data-fx="fade">${weak(165, 130, 480, 9)}${weak(165, 230, 480, 9)}</g>
          <g class="gl1" transform="translate(405 180)">${sheet(BIG, 8, 4)}</g><g class="gl2" transform="translate(405 280)">${sheet(BIG, 8, 4)}</g>
          <g class="els">${ele}</g>
          <g data-at="4" data-fx="fade"><line x1="700" y1="22" x2="770" y2="22" stroke="#f3a764" stroke-width="7" marker-end="url(#mk-warm)"/></g></svg>
        <div class="ln teal" style="top:452px" data-at="3" data-fx="left">strong in a layer, <span class="muted">weak between</span></div>
        <div class="ln warm" style="top:506px" data-at="4@0.2" data-fx="left">layers slide ${ARR}soft and slippery</div>
        <div class="ln good" style="top:560px" data-at="5@0.5" data-fx="left">4th electron moves in the layer ${ARR}conducts</div></div>`,
    update(c) {
      const b = c.b, t = c.t
      spin(c, 'cd', 405, 172, 32, t * 0.45)
      const s = eio(c.seg(b[4].start + 0.2, b[4].start + 1.4)), wob = s * 40 * Math.sin((t - b[4].start) * 1.6) * c.seg(b[4].start + 1.4, b[4].start + 2.2)
      c.$('.gl0').setAttribute('transform', `translate(${(405 + 70 * s + wob).toFixed(1)} 80)`)
      c.$('.gl1').setAttribute('transform', `translate(${(405 + 25 * s - wob * 0.4).toFixed(1)} 180)`)
      const e = c.seg(b[5].start + 0.3, b[5].start + 0.8)
      c.$('.els').style.opacity = e
      all(c, '.el').forEach((el) => { const i = +el.dataset.i, L = i % 3
        const x = wrap(140 + i * 61 + 90 * (t - b[5].start), 150, 660), y = [80, 180, 280][L] + (rnd(i) - 0.5) * 50
        const off = L === 0 ? 70 * s + wob : L === 1 ? 25 * s - wob * 0.4 : 0
        el.setAttribute('cx', (x + off).toFixed(1)); el.setAttribute('cy', y.toFixed(1)) })
    },
  })

  // ---------- molecular solids ----------
  const MOL = []
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) MOL.push([130 + i * 160, 100 + j * 135, (i + j) % 2 ? 28 : -28])
  const imf = []
  MOL.forEach(([x, y], k) => { if (k % 5 < 4) imf.push([x + 56, y, x + 104, y]); if (k < 10) imf.push([x, y + 44, x, y + 91]) })
  EZ.scene('molecular', {
    html: `<div class="kicker" data-at="in" data-fx="left">Type 3</div><h2 class="h1" data-at="0">Molecular solids<span class="ex">ice, sugar, I₂, CO₂(s)</span></h2>
      <div class="card pic" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="900" height="600">
          <g class="imfs" data-at="1@0.4" data-fx="fade">${imf.map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a3abbd" stroke-width="5" stroke-dasharray="7 8"/>`).join('')}</g>
          ${MOL.map(([x, y, a], i) => i2(x, y, a, 'mo', i)).join('')}
          <g data-at="3@0.1" data-fx="pop"><rect x="700" y="18" width="170" height="56" rx="16" fill="rgba(243,167,100,.18)" stroke="#f3a764" stroke-width="3"/><text x="785" y="58" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">114 °C</text></g>
          <g data-at="1@0.6" data-fx="fade"><line x1="60" y1="500" x2="120" y2="500" stroke="#8d8df0" stroke-width="10" stroke-linecap="round"/><text x="140" y="511" font-size="30" font-weight="800">covalent bond, inside a molecule</text>
            <line x1="60" y1="552" x2="120" y2="552" stroke="#a3abbd" stroke-width="6" stroke-dasharray="7 8"/><text x="140" y="563" font-size="30" font-weight="800">intermolecular force, between molecules</text></g>
        </svg></div>
      ${prop(0, '1', '#8d8df0', 'Molecules', 'held by intermolecular forces')}
      ${prop(1, '2', '#3cc7bc', 'Soft', 'with a low melting point')}
      ${prop(2, '3', '#f3a764', 'I₂ melts at 114 °C', 'London dispersion forces only')}
      ${prop(3, '4', '#7d859c', 'Does not conduct', 'electrons held in bonds and lone pairs')}`,
    update(c) {
      const b = c.b, t = c.t, m = eio(c.seg(b[3].start + 0.6, b[3].start + 2.4))
      all(c, '.mo').forEach((g) => { const d = g.dataset, i = +d.i, amp = 2 + 13 * m
        const x = +d.x + amp * Math.sin(t * (1.4 + m) + i * 2.3), y = +d.y + amp * Math.cos(t * (1.2 + m) + i * 1.7), a = +d.a + 30 * m * Math.sin(t * 0.9 + i)
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})`) })
      c.$('.imfs').style.opacity = Math.min(c.p('1@0.4', 0.55), 1 - 0.85 * m)
    },
  })

  // ---------- metallic solids ----------
  const CAT = []
  for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) CAT.push([130 + i * 100, 120 + j * 100, j < 2])
  let sea = ''
  for (let k = 0; k < 48; k++) sea += `<circle class="es" data-i="${k}" r="7" fill="#3cc7bc"/>`
  EZ.scene('metallic', {
    html: `<div class="kicker" data-at="in" data-fx="left">Type 4</div><h2 class="h1" data-at="0">Metallic solids<span class="ex">Cu, Fe, alloys</span></h2>
      <div class="card pic" data-at="0@0.3">
        <svg style="position:absolute;left:0;top:0" width="900" height="600">
          <g class="ct">${CAT.filter((p) => p[2]).map(([x, y]) => ball(x, y, 34, 'gold', '+', 36)).join('')}</g>
          <g class="cb">${CAT.filter((p) => !p[2]).map(([x, y]) => ball(x, y, 34, 'gold', '+', 36)).join('')}</g>
          <g class="sea" data-at="1@0.4" data-fx="fade">${sea}</g>
          <g data-at="2@0.2" data-fx="fade" data-out="4"><line x1="230" y1="536" x2="670" y2="536" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/><text x="450" y="586" text-anchor="middle" font-size="32" font-weight="900" class="f-teal">conducts</text></g>
          <g data-at="4@0.15" data-fx="fade"><line x1="20" y1="170" x2="76" y2="170" stroke="#f3a764" stroke-width="9" marker-end="url(#mk-warm)"/></g>
          <text x="450" y="574" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="4@0.5" data-fx="fade">layers slide within the electron sea</text>
        </svg></div>
      ${prop(0, '1', '#f2c443', 'Metal cations', 'in a sea of electrons', '5')}
      ${prop(1, '2', '#3cc7bc', 'Conducts', 'heat and electricity', '5')}
      ${prop(2, '3', '#8d8df0', 'Malleable and ductile', 'layers can slide', '5')}
      <div class="card" style="left:1080px;top:300px;width:720px;height:600px" data-at="5"><h3><span class="warm">Metal</span> vs. <span class="teal">ionic</span></h3>
        <svg style="position:absolute;left:0;top:70px" width="720" height="400">${ionLat('mx', 6, 4, 62, 2)}</svg>
        <div class="ln bad" style="top:470px" data-at="5@0.3" data-fx="left">ionic: layers shift ${ARR}shatters</div>
        <div class="ln good" style="top:528px" data-at="5@0.65" data-fx="left">malleable: metals only</div></div>`,
    update(c) {
      const b = c.b, t = c.t, sl = eio(c.seg(b[4].start + 0.3, b[4].start + 1.5))
      c.$('.ct').setAttribute('transform', `translate(${(100 * sl).toFixed(1)} 0)`)
      const drift = 130 * clamp(t - b[2].start - 0.3, 0, Math.max(0, b[4].start - b[2].start - 0.3))
      all(c, '.es').forEach((el) => { const i = +el.dataset.i
        const x = wrap(90 + rnd(i) * 720 + drift + 14 * Math.sin(t * 2.1 + i * 1.9), 90, 810), y = 80 + rnd(i + 50) * 380 + 12 * Math.cos(t * 1.8 + i * 2.6)
        el.setAttribute('cx', x.toFixed(1)); el.setAttribute('cy', y.toFixed(1)) })
      shatter(c, 'mx', 360, 210, 62, b[5].start + 0.3, b[5].start + 1.3)
    },
  })

  // ---------- quick trick: name the solid from its formula ----------
  const HR = [['Metal + nonmetal', 'NaCl, MgO', 'Ionic', '#f3a764', '1'], ['Only metal atoms', 'Cu, Fe, alloys', 'Metallic', '#f2c443', '2'],
    ['C, Si, SiO₂, SiC', 'diamond, graphite, quartz', 'Covalent network', '#3cc7bc', '3'], ['Other nonmetal compounds', 'ice, sugar, I₂, CO₂', 'Molecular', '#8d8df0', '4']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Name the solid from its formula</h2>
      ${HR.map(([r, e, ty, col, at], i) => `<div class="hr" style="top:${300 + i * 150}px" data-at="${at}">
        <div class="r">${r}</div><div class="e">${e}</div>${i === 2 ? '<div class="memo" data-at="3@0.75" data-fx="pop">MEMORIZE!</div>' : ''}
        <div class="ar" data-at="${at}@0.45" data-fx="left">${ARR}</div>
        <div class="ty" style="border-color:${col};color:${col};background:rgba(255,255,255,.04)" data-at="${at}@0.55" data-fx="pop">${ty}</div></div>`).join('')}`,
  })

  // ---------- data questions: four checks in order ----------
  const QR = [['Conducts as a solid?', 'Metallic (or graphite)', '#f2c443'], ['Conducts only when melted or dissolved?', 'Ionic', '#f3a764'],
    ['Very high mp, very hard, never conducts?', 'Covalent network', '#3cc7bc'], ['Low mp, soft, never conducts?', 'Molecular', '#8d8df0']]
  EZ.scene('data', {
    html: `<div class="kicker" data-at="in" data-fx="left">From data</div><h2 class="h1" data-at="0">Ask four questions, in order</h2>
      ${QR.map(([q, ty, col], i) => `<div class="qr q${i}" style="top:${300 + i * 116}px" data-at="${i + 1}"><div class="n">${i + 1}</div><div class="q">${q}</div>
        <div class="ty" style="border-color:${col};color:${col};background:rgba(255,255,255,.04)" data-at="${i + 1}@0.6" data-fx="pop">${ty}</div></div>`).join('')}
      <div class="card why" data-at="5"><span class="lab">Then explain with particles and forces</span>
        “The very high melting point shows that melting requires breaking <span class="warm">strong covalent bonds</span> throughout a network.”</div>`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 4; i++) { const on = c.seg(b[i + 1].start, b[i + 1].start + 0.3) * (1 - c.seg(b[i + 1].end, b[i + 1].end + 0.4))
        c.$('.q' + i).style.borderColor = on > 0.01 ? `rgba(141,141,240,${on})` : '' }
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'Ionic'], ['B', 'Molecular'], ['C', 'Covalent<br>network'], ['D', 'Metallic']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What type of solid is it <span class="teal">most likely</span>?</h2>
      <div class="chx" style="left:120px" data-at="1@0.12" data-fx="pop">very hard</div>
      <div class="chx" style="left:375px" data-at="1@0.25" data-fx="pop">melts above <span class="warm">1600 °C</span></div>
      <div class="chx" style="left:820px" data-at="1@0.42" data-fx="pop">no conduction: <span class="bad">solid or melted</span></div>
      ${OPTS.map(([l, f], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.7 + i * 0.07}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok">${CHECK}</div>` : ''}<div class="f" style="${i === 2 ? 'top:58px' : ''}">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="800" r="70" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="800" r="70" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 800)"/>
        <text class="num" x="960" y="826" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="930" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px;font-size:40px" data-at="4" data-fx="pop">Very hard + very high mp + never conducts ${ARR}<span class="teal">network solid</span>, like SiO₂ (quartz)</div>
      <div class="banner" style="top:830px;font-size:40px;background:rgba(240,112,122,.12);border-color:rgba(240,112,122,.6)" data-at="5" data-fx="pop">Not ionic: an ionic solid <span class="bad">would conduct when molten</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="-230 -105 460 210">${ionLat('ra', 7, 4, 46, 0)}</svg>`
  const r2 = `<svg width="460" height="210" viewBox="-230 -105 460 210"><g transform="translate(0 -50)">${sheet(SM, 6, 3)}</g>${weak(-120, 0, 240, 7)}<g transform="translate(30 50)">${sheet(SM, 6, 3)}</g>
    <line x1="160" y1="-50" x2="205" y2="-50" stroke="#f3a764" stroke-width="6" marker-end="url(#mk-warm)"/></svg>`
  let r3 = '<svg width="460" height="210" viewBox="0 0 460 210">'
  for (let k = 0; k < 4; k++) r3 += `<g transform="translate(${60 + (k % 2) * 110} ${60 + Math.floor(k / 2) * 90}) rotate(${k % 3 ? 25 : -25}) scale(.7)">${ball(-24, 0, 26, 'pur')}${ball(24, 0, 26, 'pur')}</g>`
  for (let k = 0; k < 6; k++) r3 += ball(290 + (k % 3) * 64, 60 + Math.floor(k / 3) * 90, 24, 'gold', '+', 26)
  for (let k = 0; k < 14; k++) r3 += `<circle cx="${(270 + rnd(k) * 170).toFixed(1)}" cy="${(30 + rnd(k + 9) * 150).toFixed(1)}" r="5" fill="#3cc7bc"/>`
  r3 += '</svg>'
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="warm">Ionic:</span> high mp,<br>brittle, conducts only<br>when the ions move</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="teal">Covalent network:</span><br>very high mp, hard<br>(graphite: layers slide)</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="pri">Molecular:</span> low mp,<br>non-conducting<br><span class="gold">Metallic:</span> conducting,<br>malleable</p></div>`,
  })
  void sup
})()
