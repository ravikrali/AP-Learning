// Pictures for chem-3.1b "Comparing IMFs: Boiling Points & Vapor Pressure". One EZ.scene per scene
// id in script.mjs. Every number shown is the lesson's own (app/src/content/chem/u3.ts, and book.ts
// for the vapor pressure scene). Molecules, electron clouds, meters and pressures are schematic:
// they show the lesson's order (bigger, stronger, higher), never an exact size or value.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .nt{position:absolute;left:1270px;width:560px;height:118px;padding:16px 24px 0 80px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .nt i{position:absolute;left:22px;top:32px;width:38px;height:38px;border-radius:50%}
    .nt b{display:block;font-size:32px;font-weight:900;line-height:1.15;white-space:nowrap} .nt span{display:block;margin-top:6px;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .sub2{position:absolute;left:40px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .ft{position:absolute;left:0;right:0;text-align:center;font-size:31px;font-weight:800;white-space:nowrap}
    .lb{position:absolute;left:0;right:0;text-align:center;font-size:36px;font-weight:800;white-space:nowrap;color:var(--muted)} .lb b{font-weight:900}
    .chipb{position:absolute;right:36px;top:30px;padding:6px 22px;border-radius:999px;font-size:34px;font-weight:900;border:2px solid;white-space:nowrap}
    .q{position:absolute;left:120px;width:880px;height:100px;padding-left:104px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);display:flex;align-items:center;font-size:38px;font-weight:800;white-space:nowrap}
    .q .n{position:absolute;left:24px;top:18px;width:60px;height:60px;border-radius:50%;background:var(--brand);font-size:34px;font-weight:900;line-height:60px;text-align:center}
    .yes{position:absolute;left:1012px;width:80px;height:100px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:var(--good)}
    .res{position:absolute;left:1100px;width:700px;height:100px;padding-left:36px;border-radius:26px;border:3px solid;display:flex;align-items:center;gap:18px;font-size:42px;font-weight:900;white-space:nowrap}
    .res span{font-size:28px;font-weight:800;color:var(--muted)}
    .lad{position:absolute;left:120px;width:1680px;height:110px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line);display:flex;align-items:center;justify-content:center;gap:26px;font-size:44px;font-weight:900;white-space:nowrap}
    .lad i{font-style:normal;color:var(--muted)}
    .imfs{position:absolute;left:40px;right:40px;display:flex;gap:14px;flex-wrap:nowrap}
    .imfs div{padding:6px 20px;border-radius:16px;font-size:28px;font-weight:900;border:2px solid var(--line);background:rgba(255,255,255,.04);white-space:nowrap}
    .mrow{position:absolute;left:40px;right:40px;height:40px;font-size:28px;font-weight:800;color:var(--muted);white-space:nowrap}
    .mrow .tr{position:absolute;left:150px;top:6px;width:330px;height:28px;border-radius:14px;background:#2c3145}
    .mrow .fl{position:absolute;left:0;top:0;height:28px;border-radius:14px}
    .mrow em{position:absolute;left:500px;top:0;font-style:normal;font-weight:900}
    .quote{left:120px;top:186px;width:1680px;height:150px;display:flex;align-items:center;justify-content:center;font-size:58px;font-weight:900}
    .quote .qq{position:relative} .quote .strike{position:absolute;left:-12px;right:-12px;top:52%;height:9px;border-radius:5px;background:var(--bad)}
    .stmp{position:absolute} .stmp div{transform:rotate(-8deg);padding:4px 22px;border:7px solid var(--bad);border-radius:16px;color:var(--bad);font-size:40px;font-weight:900;letter-spacing:.04em;background:rgba(14,16,24,.88);white-space:nowrap}
    .opt{position:absolute;left:40px;right:40px;height:92px;padding-left:92px;border-radius:22px;border:3px solid;display:flex;align-items:center;font-size:33px;font-weight:900;white-space:nowrap}
    .opt i{position:absolute;left:22px;top:20px;width:48px;height:48px;border-radius:50%;font-style:normal;font-size:32px;line-height:48px;text-align:center;color:#10131c}
    .tile{position:absolute;top:330px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:94px;font-size:60px;font-weight:900;line-height:1} .tile .s{margin-top:16px;font-size:28px;font-weight:800;color:var(--muted)}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .why{position:absolute;left:120px;width:1680px;text-align:center;font-size:40px;font-weight:800;white-space:nowrap}
    .stp{position:absolute;top:300px;width:540px;height:130px;padding:0 20px 0 100px;border-radius:28px;display:flex;align-items:center;font-size:34px;white-space:nowrap;font-weight:900;line-height:1.15;border:3px solid}
    .stp small{position:absolute;left:24px;top:31px;width:62px;height:62px;border-radius:50%;font-size:36px;line-height:62px;text-align:center;color:#10131c}
    .half{position:absolute;left:120px;top:470px;width:1680px;height:100px;border-radius:26px;border:3px solid var(--bad);background:rgba(240,112,122,.1);display:flex;align-items:center;justify-content:center;gap:24px;font-size:40px;font-weight:900;white-space:nowrap}
    .answer{left:120px;top:604px;width:1680px;height:330px;padding:30px 56px;font-size:44px;font-weight:700;line-height:1.45}
    .answer .lab{display:block;font-size:26px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px} .answer b{font-weight:900}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:10px 16px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- drawing helpers ----------
  const BOND = '#c9cee0'
  const line = (x1, y1, x2, y2, w = 10, col = BOND) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`
  const mol = (atoms, bonds, w = 10) => bonds.map(([i, j]) => line(atoms[i][0], atoms[i][1], atoms[j][0], atoms[j][1], w)).join('') + atoms.map(([x, y, r, g, l]) => ball(x, y, r, g, l ?? '')).join('')
  const pol = (x, y, a, d) => [x + d * Math.cos((a * Math.PI) / 180), y + d * Math.sin((a * Math.PI) / 180)]
  const water = (x, y, a1, a2, s = 1, lab = true) => {
    const d = 78 * s, h1 = pol(x, y, a1, d), h2 = pol(x, y, a2, d)
    return mol([[x, y, 40 * s, 'teal', lab ? 'O' : ''], [...h1, 26 * s, 'gray', lab ? 'H' : ''], [...h2, 26 * s, 'gray', lab ? 'H' : '']], [[0, 1], [0, 2]], 10 * s)
  }
  const methane = (x, y, s = 1, lab = true) => mol([[x, y, 38 * s, 'gray', lab ? 'C' : ''], ...[45, 135, 225, 315].map((a) => [...pol(x, y, a, 74 * s), 24 * s, 'gray', lab ? 'H' : ''])], [[0, 1], [0, 2], [0, 3], [0, 4]], 10 * s)
  const dash = (x1, y1, x2, y2, col = '#f2c443', w = 6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-dasharray="10 10" stroke-linecap="round"/>`
  const txt = (x, y, t, cls = '', fs = 32, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${fs}" font-weight="900" class="${cls}">${t}</text>`
  const cloud = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#g-cloud)" stroke="rgba(141,141,240,.5)" stroke-width="3"/>`
  // a diatomic halogen with its electron cloud (sizes in the right order only)
  const x2 = (x, y, r, g, lab) => cloud(x, y, r * 1.72 + 26, r + 26) + ball(x - r * 0.72, y, r, g, lab) + ball(x + r * 0.72, y, r, g, lab)
  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const tri = (x) => 1 - Math.abs((((x % 2) + 2) % 2) - 1) // 0..1..0 triangle wave
  const check = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const C = '°C'

  // ---------- intro artwork: a thermometer on the left, a beaker with escaping molecules on the right ----------
  let art = '<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">'
  art += '<rect x="96" y="250" width="56" height="540" rx="28" fill="none" stroke="#c9cee0" stroke-width="6"/><circle cx="124" cy="830" r="52" fill="url(#g-warm)"/>'
  art += '<rect class="ith" x="110" y="400" width="28" height="420" rx="14" fill="#f3a764"/>'
  art += [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="164" x2="${i % 2 ? 184 : 200}" y1="${300 + i * 60}" y2="${300 + i * 60}" stroke="#c9cee0" stroke-width="5"/>`).join('')
  art += '<path d="M1650 560 V880 H1860 V560" fill="none" stroke="#c9cee0" stroke-width="6"/><rect x="1656" y="720" width="198" height="154" fill="rgba(60,199,188,.35)"/>'
  for (const y of [760, 806, 852]) art += [0, 1, 2, 3].map((k) => ball(1690 + k * 44, y, 16, 'teal')).join('')
  art += [0, 1, 2].map((i) => `<g class="iesc" data-i="${i}">${ball(0, 0, 16, 'teal')}</g>`).join('')
  art += '</svg>'
  EZ.intro = {
    chips: [['1@0.3', 'Boiling points'], ['1@0.45', 'Vapor pressure'], ['1@0.62', 'The 2-step comparison']],
    art,
    update(c) {
      const t = c.t - c.sc.start
      c.$('.ith').setAttribute('y', (560 - 160 * Math.sin(Math.min(t * 0.5, Math.PI / 2))).toFixed(1))
      c.$('.ith').setAttribute('height', (820 - (560 - 160 * Math.sin(Math.min(t * 0.5, Math.PI / 2)))).toFixed(1))
      for (const g of all(c, '.iesc')) {
        const i = +g.dataset.i, f = ((t * 0.28 + i / 3) % 1)
        g.setAttribute('transform', `translate(${(1720 + i * 50 + 20 * Math.sin(t + i)).toFixed(1)} ${(700 - 420 * f).toFixed(1)})`)
        g.style.opacity = (Math.min(f * 6, 1) * (1 - f)).toFixed(2)
      }
    },
  }

  // ---------- hook: water vs methane on one temperature scale ----------
  // tube from y 340 (100 °C) to y 840 (−162 °C)
  const TY = (deg) => 340 + ((100 - deg) * 500) / 262
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">A puzzle</div><h2 class="h1" data-at="0">Almost the same size…</h2>
      <div class="card" style="left:120px;top:300px;width:600px;height:540px" data-at="1"><h3 class="teal">Water</h3>
        <svg style="position:absolute;left:0;top:96px" width="600" height="260">${water(300, 120, 30, 150, 1.25)}</svg>
        <div class="ft" style="top:370px;font-size:40px;color:var(--muted)">18 g/mol</div>
        <div class="ft" style="top:436px;font-size:46px" data-at="1@0.6" data-fx="fade">boils at <span class="teal">100 ${C}</span></div></div>
      <div class="card" style="left:1200px;top:300px;width:600px;height:540px" data-at="2"><h3 class="warm">Methane</h3>
        <svg style="position:absolute;left:0;top:96px" width="600" height="260">${methane(300, 130, 1.15)}</svg>
        <div class="ft" style="top:370px;font-size:40px;color:var(--muted)">16 g/mol</div>
        <div class="ft" style="top:436px;font-size:46px" data-at="2@0.6" data-fx="fade">boils at <span class="warm">−162 ${C}</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><rect x="920" y="320" width="40" height="540" rx="20" fill="#2c3145"/>
          <line x1="900" x2="960" y1="${TY(0)}" y2="${TY(0)}" stroke="#7d859c" stroke-width="3" stroke-dasharray="6 6"/>${txt(890, TY(0) + 9, '0 °C', 'f-muted', 26, 'end')}</g>
        <rect class="thf" x="926" width="28" rx="14" fill="#3cc7bc"/>
        <g data-at="1@0.6" data-fx="fade"><circle cx="940" cy="${TY(100)}" r="16" fill="#3cc7bc"/>${txt(895, TY(100) + 12, '100 °C', 'f-teal', 34, 'end')}</g>
        <g data-at="2@0.6" data-fx="fade"><circle cx="940" cy="${TY(-162)}" r="16" fill="#f3a764"/>${txt(895, TY(-162) + 12, '−162 °C', 'f-warm', 34, 'end')}</g>
        <g data-at="3" data-fx="fade"><line x1="1010" x2="1010" y1="${TY(100) + 18}" y2="${TY(-162) - 18}" stroke="#f2c443" stroke-width="7" marker-start="url(#mk-gold)" marker-end="url(#mk-gold)"/></g>
        <g data-at="3@0.2" data-fx="pop">${txt(1036, 590, '262°', 'f-gold', 50, 'start')}${txt(1036, 628, 'apart', 'f-gold', 30, 'start')}</g>
      </svg>
      <div class="banner" style="top:870px" data-at="4" data-out="5" data-fx="pop">Intermolecular forces explain it</div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">“Which has the higher <span class="teal">boiling point</span>?”</div>`,
    update(c) {
      // the thermometer fill drops from water's boiling point to methane's
      const p = eio(c.p('2@0.5', 1.4)), top = lerp(TY(100), TY(-162), p)
      c.$('.thf').setAttribute('y', top.toFixed(1)); c.$('.thf').setAttribute('height', (854 - top).toFixed(1))
      c.$('.thf').style.opacity = c.p('1@0.4', 0.5)
      c.$('.thf').setAttribute('fill', p > 0.02 ? '#f3a764' : '#3cc7bc')
    },
  })

  // ---------- the rule: stronger IMFs, higher bp, lower vapor pressure ----------
  const beaker = (strong) => {
    let s = '<path d="M255 40 V300 H555 V40" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/><rect x="261" y="168" width="288" height="128" fill="rgba(60,199,188,.16)"/>'
    const P = []
    for (let k = 0; k < 3; k++) for (let j = 0; j < 7; j++) P.push([285 + j * 40, 196 + k * 40])
    if (strong) for (const [x, y] of P) { if (x < 525) s += line(x, y, x + 40, y, 5, 'rgba(242,196,67,.85)'); if (y < 276) s += line(x, y, x, y + 40, 5, 'rgba(242,196,67,.85)') }
    s += P.map(([x, y]) => ball(x, y, 15, 'teal')).join('')
    const n = strong ? 1 : 4
    for (let i = 0; i < n; i++) s += `<g class="esc ${strong ? 'es' : 'ew'}" data-i="${i}" data-n="${n}">${ball(0, 0, 15, 'teal')}</g>`
    return s
  }
  EZ.scene('rule', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big rule</div><h2 class="h1" data-at="0">IMFs set the boiling point</h2>
      <div class="card" style="left:120px;top:322px;width:810px;height:520px" data-at="1"><h3 class="teal">Stronger IMFs</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="320">${beaker(true)}</svg>
        <div class="lb" style="top:410px" data-at="2" data-fx="fade">Boiling point: <b class="teal">higher</b></div>
        <div class="lb" style="top:462px" data-at="3" data-fx="fade">Vapor pressure: <b class="teal">lower</b></div></div>
      <div class="card" style="left:990px;top:322px;width:810px;height:520px" data-at="1@0.4"><h3 class="warm">Weaker IMFs</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="320">${beaker(false)}</svg>
        <div class="lb" style="top:410px" data-at="2@0.4" data-fx="fade">Boiling point: <b class="warm">lower</b></div>
        <div class="lb" style="top:462px" data-at="3@0.3" data-fx="fade">Vapor pressure: <b class="warm">higher</b></div></div>
      <div class="sub2" style="left:122px;top:266px;font-size:28px" data-at="1@0.3" data-fx="fade">boiling and vaporizing <span class="gold">completely overcome</span> the IMFs</div>
      <div class="banner" style="top:866px;font-size:44px" data-at="4" data-out="5" data-fx="pop">Melting points follow IMF strength too, but <span class="warm">less neatly</span></div>
      <div class="banner" style="top:866px;font-size:44px" data-at="5" data-fx="pop">Melting only <span class="teal">rearranges</span> the interactions: packing matters too</div>`,
    update(c) {
      const on = c.p('3@0.2', 0.6), t = c.t
      for (const g of all(c, '.esc')) {
        const i = +g.dataset.i, n = +g.dataset.n, f = ((t * 0.32 + i / n + (n === 1 ? 0.3 : 0)) % 1)
        const x = 300 + ((i * 67 + (n === 1 ? 110 : 0)) % 230) + 18 * Math.sin(t * 1.3 + i)
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${(170 - 160 * f).toFixed(1)})`)
        g.style.opacity = (on * Math.min(f * 8, 1) * Math.min((1 - f) * 4, 1)).toFixed(2)
      }
    },
  })

  // ---------- what vapor pressure is ----------
  const LIQ = []
  for (let k = 0; k < 4; k++) for (let j = 0; j < 11; j++) LIQ.push([238 + j * 49 + (k % 2 ? 12 : 0), 672 + k * 50])
  const note = (i, at, color, a, b) => `<div class="nt" style="top:${300 + i * 126}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  EZ.scene('vapor', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Vapor pressure</div><h2 class="h1" data-at="0">Escaping the liquid</h2>
      <div class="card" style="left:120px;top:300px;width:1110px;height:630px" data-at="0@0.3"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">
          <rect x="200" y="340" width="560" height="520" rx="26" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="6"/>
          <rect x="182" y="322" width="596" height="26" rx="10" fill="#5a6280"/>
          <rect class="liq" x="206" y="640" width="548" height="214" rx="6" fill="rgba(60,199,188,.2)"/>
          ${LIQ.filter(([x]) => x < 740).map(([x, y]) => ball(x, y, 15, 'teal')).join('')}
        </g>
        ${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="bub" data-i="${i}" r="11" fill="none" stroke="#eef0f7" stroke-width="4"/>`).join('')}
        ${[...Array(10)].map((_, i) => `<g class="vp" data-i="${i}">${ball(0, 0, 15, 'teal')}</g>`).join('')}
        <g data-at="1@0.3" data-out="3" data-fx="fade"><line x1="380" y1="660" x2="380" y2="560" stroke="#f3a764" stroke-width="8" marker-end="url(#mk-warm)"/>${txt(366, 600, 'escape', 'f-warm', 30, 'end')}
          <line x1="600" y1="560" x2="600" y2="650" stroke="#3cc7bc" stroke-width="8" marker-end="url(#mk-teal)"/>${txt(616, 600, 'return', 'f-teal', 30, 'start')}</g>
        <g data-at="2" data-fx="fade"><rect x="880" y="380" width="60" height="480" rx="30" fill="#2c3145"/>${txt(910, 902, 'vapor pressure', 'f-pri', 28)}</g>
        <rect class="vpf" x="880" width="60" rx="30" fill="#8d8df0"/>
        <g class="ext"><line x1="845" x2="1190" y1="0" y2="0" stroke="#f3a764" stroke-width="5" stroke-dasharray="14 10"/>${txt(1190, -16, 'external pressure', 'f-warm', 26, 'end')}</g>
        <g data-at="3" data-out="4@0.55" data-fx="fade">${txt(480, 902, 'warmer', 'f-warm', 32)}</g>
        <g data-at="4@0.55" data-out="5" data-fx="pop">${txt(480, 902, 'boils!', 'f-gold', 36)}</g>
        <g data-at="5@0.5" data-fx="pop">${txt(480, 902, 'boils at a lower temperature', 'f-gold', 32)}</g>
      </svg>
      ${note(0, '1', '#3cc7bc', 'Escape and return', 'at the liquid’s surface')}
      ${note(1, '2', '#8d8df0', 'Vapor pressure', 'the vapor’s pressure at equilibrium')}
      ${note(2, '3', '#f3a764', 'Temperature up', 'more escape: vapor pressure up')}
      ${note(3, '4', '#f2c443', 'Boiling', 'vapor pressure = external')}
      ${note(4, '5', '#4cc781', 'High altitude', 'lower air pressure')}`,
    update(c) {
      const t = c.t
      // vapor molecules: a few at first, more when it is warmer
      const n = 3 * c.p('1', 0.6) + 6 * c.p('3', 1.5)
      for (const g of all(c, '.vp')) {
        const i = +g.dataset.i
        const x = 240 + 480 * tri(t * (0.17 + 0.041 * i) + i * 0.53), y = 372 + 240 * tri(t * (0.23 + 0.033 * ((i * 7) % 10)) + ((i * 3) % 10) * 0.19)
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
        g.style.opacity = clamp(n - i).toFixed(2)
      }
      // the vapor pressure bar and the external pressure line
      let top = lerp(760, 700, c.p('2', 0.8))
      top = lerp(top, 560, eio(c.p('3', 1.6)))
      top = lerp(top, 440, eio(c.p('4', 0.55 * (c.b[4].end - c.b[4].start))))
      const drop = eio(c.p('5', 0.4 * (c.b[5].end - c.b[5].start)))
      const P = lerp(440, 600, drop)
      top = lerp(top, 600, drop)
      c.$('.vpf').setAttribute('y', top.toFixed(1)); c.$('.vpf').setAttribute('height', (860 - top).toFixed(1))
      c.$('.vpf').style.opacity = c.p('2', 0.5)
      c.$('.ext').setAttribute('transform', `translate(0 ${P.toFixed(1)})`)
      c.$('.ext').style.opacity = c.p('4', 0.5)
      c.$('.liq').setAttribute('fill', `rgba(${Math.round(lerp(60, 243, 0.35 * c.p('3', 1.2) * (1 - 0.6 * drop)))},${Math.round(lerp(199, 167, 0.35 * c.p('3', 1.2)))},${Math.round(lerp(188, 100, 0.35 * c.p('3', 1.2)))},.22)`)
      // bubbles while it boils
      const boil = c.p('4@0.55', 0.4)
      for (const b of all(c, '.bub')) {
        const i = +b.dataset.i, f = (t * 0.7 + i * 0.173) % 1
        b.setAttribute('cx', (250 + i * 88 + 10 * Math.sin(t * 3 + i)).toFixed(1)); b.setAttribute('cy', (846 - 196 * f).toFixed(1))
        b.style.opacity = (boil * Math.min((1 - f) * 5, 1)).toFixed(2)
      }
    },
  })

  // ---------- step 1: similar size, compare the IMF types ----------
  EZ.scene('step1', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Exam hack · step 1</div><h2 class="h1" data-at="0">The 2-step comparison</h2>
      <div class="q" style="top:300px" data-at="1" data-fx="left"><div class="n">1</div>Similar size and electron count?</div>
      <div class="yes" style="top:300px" data-at="2" data-fx="fade">yes${ARR}</div>
      <div class="res" style="top:300px;border-color:var(--accent);color:var(--accent)" data-at="2@0.1" data-fx="right">compare IMF types</div>
      <div class="lad" style="top:432px" data-at="3" data-fx="pop"><span class="gold">H-bonding</span><i>&gt;</i><span class="teal">dipole–dipole</span><i>&gt;</i><span class="muted">LDFs only</span></div>
      <div class="card c1" style="left:120px;top:576px;width:810px;height:330px" data-at="4"><h3><span class="gold">H<sub>2</sub>O</span> · hydrogen bonds</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="230">
          <g class="wa">${water(190, 112, 25, 145, 0.85)}</g><g class="wb">${water(430, 140, -40, 60, 0.85)}</g>
          <g data-at="4@0.25" data-fx="fade">${dash(258, 140, 382, 140, '#f2c443', 7)}</g>
          <g data-at="5" data-fx="pop">${txt(700, 140, '100 °C', 'f-teal', 52)}</g></svg></div>
      <div class="card" style="left:990px;top:576px;width:810px;height:330px" data-at="4@0.5"><h3><span class="muted">CH<sub>4</sub></span> · LDFs only</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="230">
          ${methane(190, 120, 0.75)}${methane(430, 120, 0.75)}
          <g data-at="4@0.8" data-fx="fade">${dash(268, 120, 352, 120, 'rgba(170,177,196,.6)', 4)}</g>
          <g data-at="5" data-fx="pop">${txt(690, 140, '−162 °C', 'f-warm', 52)}</g></svg></div>`,
    update(c) {
      const g = c.p('5', 0.5) * (0.75 + 0.25 * Math.sin(c.t * 5))
      c.$('.c1').style.borderColor = g ? `rgba(242,196,67,${g})` : ''
      c.$('.c1').style.boxShadow = `0 0 ${50 * g}px rgba(242,196,67,${0.4 * g})`
      const w = 3 * Math.sin(c.t * 2.4)
      c.$('.wa').setAttribute('transform', `translate(${w.toFixed(1)} 0)`); c.$('.wb').setAttribute('transform', `translate(${(-w).toFixed(1)} 0)`)
    },
  })

  // ---------- step 2: very different sizes, LDFs can win ----------
  const HAL = [['F', 30, 'green', 'gas', 360], ['Cl', 40, 'teal', 'gas', 760], ['Br', 48, 'warm', 'liquid', 1160], ['I', 58, 'pur', 'solid', 1560]]
  EZ.scene('step2', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Exam hack · step 2</div><h2 class="h1" data-at="0">When LDFs can win</h2>
      <div class="q" style="top:300px" data-at="0@0.3" data-fx="left"><div class="n">2</div>Very different sizes?</div>
      <div class="yes" style="top:300px" data-at="1" data-fx="fade">yes${ARR}</div>
      <div class="res" style="top:300px;border-color:var(--primary);color:var(--primary)" data-at="1@0.1" data-fx="right">LDFs can win<span>compare electron count</span></div>
      <div class="card" style="left:120px;top:430px;width:1680px;height:430px" data-at="2"><h3>Halogens: <span class="muted">nonpolar, LDFs only</span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        ${HAL.map(([el, r, g, st, x], i) => `<g data-at="2@${(0.3 + i * 0.15).toFixed(2)}" data-fx="pop"><g class="hx" data-i="${i}">${x2(x, 600, r, g, el)}</g></g>
          ${txt(x, 712, `${el}<tspan dy="8" font-size="26">2</tspan>`, '', 44)}
          <g data-at="4@${(0.2 + i * 0.18).toFixed(2)}" data-fx="fade">${txt(x, 756, st, st === 'gas' ? 'f-muted' : st === 'liquid' ? 'f-teal' : 'f-pri', 32)}</g>`).join('')}
        <g data-at="3" data-fx="fade"><line x1="260" y1="792" x2="1670" y2="792" stroke="#8d8df0" stroke-width="5" marker-end="url(#mk-pri)"/></g>
        <g data-at="3@0.3" data-fx="fade">${txt(960, 838, 'more electrons → more polarizable → stronger LDFs', 'f-pri', 30)}</g>
      </svg>
      <div class="banner" style="top:886px;font-size:44px" data-at="5" data-fx="pop"><span class="pri">I<sub>2</sub></span> boils at 184 °C, higher than H<sub>2</sub>O at 100 °C: <span class="pri">LDFs only!</span></div>`,
    update(c) {
      const glow = c.p('3', 0.6)
      for (const g of all(c, '.hx')) {
        const i = +g.dataset.i, k = 1 + 0.03 * Math.sin(c.t * 2.2 + i) * (i === 3 ? 1 + glow : 1)
        g.setAttribute('transform', `translate(${HAL[i][4]} 600) scale(${k.toFixed(3)}) translate(${-HAL[i][4]} -600)`)
      }
    },
  })

  // ---------- shape tiebreaker: n-pentane vs neopentane ----------
  const zig = (x0, y) => { const pts = [0, 1, 2, 3, 4].map((i) => [x0 + i * 82, y + (i % 2 ? 22 : -22)])
    let s = cloud(x0 + 164, y, 230, 58)
    for (let i = 1; i < 5; i++) s += line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], 8)
    return s + pts.map(([x, yy]) => ball(x, yy, 26, 'gray', 'C', 22)).join('') }
  const neo = (x, y) => { const pts = [[0, -50], [50, 0], [0, 50], [-50, 0]].map(([dx, dy]) => [x + dx, y + dy])
    return cloud(x, y, 92, 92) + pts.map(([a, b]) => line(x, y, a, b, 8)).join('') + ball(x, y, 26, 'gray', 'C', 22) + pts.map(([a, b]) => ball(a, b, 24, 'gray', 'C', 20)).join('') }
  EZ.scene('shape', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Tiebreaker</div><h2 class="h1" data-at="0">Shape matters</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="1"><h3 class="teal">n-pentane</h3>
        <div class="sub2" style="top:94px" data-at="2" data-fx="fade">C<sub>5</sub>H<sub>12</sub> · long, straight</div>
        <svg style="position:absolute;left:0;top:140px" width="810" height="320">
          <g class="pa">${zig(241, 80)}</g><g class="pb">${zig(241, 210)}</g>
          <g data-at="1@0.45" data-fx="fade">${[0, 1, 2, 3, 4].map((i) => dash(241 + i * 82, 118, 241 + i * 82, 172, '#f2c443', 6)).join('')}</g>
          <g data-at="1@0.6" data-fx="fade">${txt(405, 310, 'more surface contact', 'f-gold', 30)}</g></svg>
        <div class="ft" style="top:468px;font-size:48px" data-at="3@0.4" data-fx="pop">boils at <span class="teal">36 °C</span></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:560px" data-at="1@0.3"><h3 class="warm">neopentane</h3>
        <div class="sub2" style="top:94px" data-at="2@0.4" data-fx="fade">C<sub>5</sub>H<sub>12</sub> · ball-shaped</div>
        <svg style="position:absolute;left:0;top:140px" width="810" height="320">
          <g class="na">${neo(300, 140)}</g><g class="nb">${neo(510, 140)}</g>
          <g data-at="1@0.75" data-fx="fade">${dash(380, 140, 430, 140, 'rgba(242,196,67,.8)', 6)}</g>
          <g data-at="1@0.85" data-fx="fade">${txt(405, 310, 'less contact', 'f-muted', 30)}</g></svg>
        <div class="ft" style="top:468px;font-size:48px" data-at="4@0.4" data-fx="pop">boils at <span class="warm">9.5 °C</span></div></div>
      <div class="banner" style="top:884px;font-size:44px" data-at="4@0.8" data-fx="pop">Long and straight ${ARR} more contact ${ARR} <span class="teal">stronger LDFs</span></div>`,
    update(c) {
      // the pairs move together as the sentence about contact starts
      const p = eio(c.p('1', 1.2)), t = c.t, w = 2 * Math.sin(t * 2.5)
      c.$('.pa').setAttribute('transform', `translate(0 ${(-30 * (1 - p) + w).toFixed(1)})`)
      c.$('.pb').setAttribute('transform', `translate(0 ${(30 * (1 - p) - w).toFixed(1)})`)
      c.$('.na').setAttribute('transform', `translate(${(-40 * (1 - p) + w).toFixed(1)} 0)`)
      c.$('.nb').setAttribute('transform', `translate(${(40 * (1 - p) - w).toFixed(1)} 0)`)
    },
  })

  // ---------- worked example: HF vs HCl ----------
  const hx = (x1, x2, g, lab, rr) => mol([[x1, 110, rr, g, lab], [x2, 110, 22, 'gray', 'H']], [[0, 1]], 9)
  const meter = (top, at, label, frac, color, note, cls = '') => `<div class="mrow" style="top:${top}px" data-at="${at}" data-fx="fade">${label}<div class="tr"><div class="fl" style="width:${330 * frac}px;background:${color}"></div></div><em class="${cls}">${note}</em></div>`
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">HF vs. HCl</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:510px" data-at="1"><h3>HF</h3><div class="chipb teal" style="border-color:var(--accent)" data-at="1@0.15" data-fx="pop">bp 20 °C</div>
        <svg style="position:absolute;left:0;top:90px" width="810" height="200">
          ${hx(210, 290, 'green', 'F', 40)}${hx(500, 580, 'green', 'F', 40)}
          <g data-at="2@0.5" data-fx="fade">${dash(316, 110, 456, 110, '#f2c443', 7)}${txt(386, 186, 'H-bond', 'f-gold', 30)}</g></svg>
        <div class="imfs" style="top:300px" data-at="2@0.3" data-fx="fade"><div class="gold" style="border-color:var(--gold)">H-bonding</div><div>dipole–dipole</div><div>LDFs</div></div>
        ${meter(386, '4@0.5', 'H-bonds', 1, '#f2c443', 'much stronger', 'gold')}
        ${meter(440, '4', 'LDFs', 0.45, '#7d859c', '')}</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:510px" data-at="1@0.4"><h3>HCl</h3><div class="chipb warm" style="border-color:var(--warm)" data-at="1@0.5" data-fx="pop">bp −85 °C</div>
        <svg style="position:absolute;left:0;top:90px" width="810" height="200">
          ${hx(200, 300, 'teal', 'Cl', 52)}${hx(510, 610, 'teal', 'Cl', 52)}
          <g data-at="3@0.4" data-fx="fade">${dash(326, 110, 452, 110, 'rgba(170,177,196,.7)', 5)}${txt(390, 186, 'dipole–dipole', 'f-muted', 28)}</g>
          <g data-at="1@0.8" data-fx="fade">${txt(680, 40, 'more electrons', 'f-muted', 26)}</g></svg>
        <div class="imfs" style="top:300px" data-at="3" data-fx="fade"><div>dipole–dipole</div><div>LDFs</div><div class="bad" style="border-color:var(--bad)">no H-bonding</div></div>
        ${meter(386, '4@0.5', 'H-bonds', 0, '#f2c443', 'none', 'muted')}
        ${meter(440, '4', 'LDFs', 0.55, '#aab1c4', 'a bit stronger', 'muted')}</div>
      <div class="banner" style="top:840px;font-size:44px" data-at="5" data-fx="pop">Stronger IMFs ${ARR} more energy to overcome ${ARR} <span class="teal">HF boils higher</span></div>`,
  })

  // ---------- the trap: boiling separates molecules, bonds stay intact ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trap</div>
      <div class="card quote" data-at="0@0.3"><span class="qq">“It boils because its bonds break.”<i class="strike" data-at="1@0.6" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="stmp" style="left:1490px;top:204px" data-at="3" data-fx="pop"><div>points off!</div></div>
      <div class="card" style="left:120px;top:380px;width:810px;height:540px" data-at="2"><h3 class="teal">Boiling separates molecules</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.1" data-fx="pop"><g class="ma">${water(420, 640, 30, 150)}</g></g>
        <g data-at="2@0.1" data-fx="pop"><g class="mb">${water(640, 660, -40, 60)}</g></g>
        <g class="att">${dash(495, 680, 600, 668, '#f2c443', 7)}</g>
        <g data-at="2@0.55" data-fx="fade">${txt(525, 840, 'covalent bonds stay intact ✓', 'f-good', 34)}</g>
      </svg>
      <div class="card" style="left:990px;top:380px;width:810px;height:540px" data-at="4"><h3>H<sub>2</sub>O <span class="teal">100 °C</span> · H<sub>2</sub>S <span class="warm">−60 °C</span></h3>
        <div class="sub2" style="top:100px" data-at="4@0.5" data-fx="fade">The best explanation is…</div>
        <div class="opt" style="top:180px;border-color:var(--bad);background:rgba(240,112,122,.08)" data-at="5@0.4" data-fx="fade"><i style="background:var(--bad)">✗</i><span class="muted">The O–H bond is stronger</span></div>
        <div class="opt" style="top:296px;border-color:var(--good);background:rgba(76,199,129,.1)" data-at="5" data-fx="fade"><i style="background:var(--good)">✓</i><span>H<sub>2</sub>O forms H-bonds, H<sub>2</sub>S doesn’t</span></div>
        <div class="ft" style="top:430px;font-size:30px;color:var(--muted)" data-at="5@0.7" data-fx="fade">boiling doesn’t break O–H bonds</div></div>`,
    update(c) {
      const p = eio(c.p('2@0.3', 1.6)), t = c.t
      const wa = 3 * Math.sin(t * 3), wb = 3 * Math.cos(t * 2.6)
      c.$('.ma').setAttribute('transform', `translate(${(-110 * p + wa * p).toFixed(1)} ${(-50 * p + wb * p).toFixed(1)})`)
      c.$('.mb').setAttribute('transform', `translate(${(150 * p + wb * p).toFixed(1)} ${(-40 * p + wa * p).toFixed(1)})`)
      c.$('.att').style.opacity = (c.p('0@0.5', 0.4) * (1 - c.p('2@0.3', 0.5))).toFixed(2)
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'H<sub>2</sub>O', ''], ['B', 'CH<sub>3</sub>OH', ''], ['C', 'CH<sub>3</sub>CH<sub>2</sub>OH', ''], ['D', 'CH<sub>3</sub>OCH<sub>3</sub>', 'dimethyl ether']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">Which has the <span class="teal">highest vapor pressure</span> at 25 °C?</h2>
      ${OPTS.map(([l, f, s], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.42 + i * 0.13).toFixed(2)}" data-fx="pop"><div class="l">${l}</div><div class="f"><span>${f}</span></div>${s ? `<div class="s">${s}</div>` : ''}
        ${i === 3 ? check : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="740" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="740" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 740)"/>
        <text class="num" x="960" y="764" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="860" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:640px;font-size:46px" data-at="4" data-fx="pop">Highest vapor pressure = <span class="teal">weakest IMFs</span></div>
      <div class="why" style="top:790px" data-at="5" data-fx="fade"><span>CH<sub>3</sub>OCH<sub>3</sub></span>: no O–H bond ${ARR} no H-bonding between its molecules</div>
      <div class="why" style="top:856px;color:var(--muted)" data-at="5@0.6" data-fx="fade">they escape most easily: it’s a gas at room temperature</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 3) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- free-response tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="0">Earn the point: compare <span class="teal">BOTH</span></h2>
      <div class="stp" style="left:120px;border-color:var(--primary);background:rgba(141,141,240,.14)" data-at="1" data-fx="pop"><small style="background:var(--primary)">1</small>Name the IMFs in both</div>
      <div class="stp" style="left:690px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="1@0.3" data-fx="pop"><small style="background:var(--accent)">2</small>Which is stronger, why</div>
      <div class="stp" style="left:1260px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="1@0.62" data-fx="pop"><small style="background:var(--warm)">3</small>Link it to the property</div>
      <div class="half" data-at="2" data-fx="pop"><span class="bad">✗</span>“HF has hydrogen bonds.”<span class="muted" style="font-size:32px">only half the story</span></div>
      <div class="card answer" data-at="3-0.2"><span class="lab">✓ Full-credit answer</span>
        <span data-at="3@0.05" data-fx="fade">HF molecules form <b class="pri">hydrogen bonds</b>,</span>
        <span data-at="3@0.3" data-fx="fade"> which are <b class="teal">stronger</b> than the <span style="white-space:nowrap">dipole–dipole</span> and dispersion forces between HCl molecules,</span>
        <span data-at="4" data-fx="fade"> so <b class="warm">more energy is needed</b> to separate HF molecules.</span></div>`,
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="190" viewBox="0 0 460 190"><path d="M60 40 V170 H200 V40" fill="none" stroke="#c9cee0" stroke-width="5"/><rect x="64" y="100" width="132" height="66" fill="rgba(60,199,188,.2)"/>
      ${[0, 1, 2, 3].map((j) => ball(82 + j * 32, 120, 12, 'teal') + ball(82 + j * 32, 148, 12, 'teal')).join('')}${line(82, 120, 178, 120, 4, 'rgba(242,196,67,.85)')}${line(82, 148, 178, 148, 4, 'rgba(242,196,67,.85)')}
      <line x1="270" y1="120" x2="270" y2="50" stroke="#3cc7bc" stroke-width="7" marker-end="url(#mk-teal)"/>${txt(296, 92, 'bp', 'f-teal', 30, 'start')}
      <line x1="370" y1="50" x2="370" y2="120" stroke="#f3a764" stroke-width="7" marker-end="url(#mk-warm)"/>${txt(392, 92, 'VP', 'f-warm', 30, 'start')}</svg>`
  const r2 = `<svg width="460" height="190" viewBox="0 0 460 190">${x2(110, 95, 22, 'green', '')}${x2(310, 95, 44, 'pur', '')}${txt(110, 182, 'fewer electrons', 'f-muted', 22)}${txt(310, 182, 'more electrons', 'f-pri', 22)}</svg>`
  const r3 = `<svg width="460" height="190" viewBox="0 0 460 190">${mol([[90, 80, 34, 'green', 'F'], [150, 80, 20, 'gray', 'H']], [[0, 1]], 8)}${mol([[300, 80, 42, 'teal', 'Cl'], [370, 80, 20, 'gray', 'H']], [[0, 1]], 8)}
      ${txt(120, 160, '✓', 'f-good', 40)}${txt(330, 160, '✓', 'f-good', 40)}${txt(225, 92, 'vs', 'f-muted', 32)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Stronger IMFs:<br><span class="teal">higher boiling point</span><br><span class="warm">lower vapor pressure</span></p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Similar size:<br>compare <span class="teal">IMF types</span><br>Very different size:<br><span class="pri">LDFs</span> can dominate</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Explain <span class="teal">both</span> substances<br>and link “<span class="warm">more energy</span><br>needed to overcome”<br>to the property</p></div>`,
  })
})()
