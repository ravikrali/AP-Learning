// Pictures for chem-3.1a "Intermolecular Forces: The Four Types". One EZ.scene per scene id in
// script.mjs. Everything shown is the lesson's own (app/src/content/chem/u3.ts). Molecules, ions and
// electron clouds are schematic: no sizes, distances or strengths are claimed beyond the lesson's order.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .nt{position:absolute;width:510px;height:150px;padding:22px 30px 0;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .nt b{display:block;font-size:36px;font-weight:900;line-height:1.15;white-space:nowrap} .nt span{display:block;margin-top:10px;font-size:28px;font-weight:700;color:var(--muted);white-space:nowrap}
    .sub2{position:absolute;left:40px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .ft{position:absolute;left:0;right:0;text-align:center;font-size:31px;font-weight:800;white-space:nowrap}
    .q{position:absolute;left:120px;width:880px;height:100px;padding-left:104px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);display:flex;align-items:center;font-size:38px;font-weight:800;white-space:nowrap}
    .q .n{position:absolute;left:24px;top:18px;width:60px;height:60px;border-radius:50%;background:var(--brand);font-size:34px;font-weight:900;line-height:60px;text-align:center}
    .yes{position:absolute;left:1012px;width:80px;height:100px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:var(--good)}
    .res{position:absolute;left:1100px;width:700px;height:100px;padding-left:36px;border-radius:26px;border:3px solid;display:flex;align-items:center;gap:18px;font-size:42px;font-weight:900;white-space:nowrap}
    .res span{font-size:28px;font-weight:800;color:var(--muted)}
    .lad{position:absolute;left:120px;width:1680px;height:116px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line);display:flex;align-items:center;justify-content:center;gap:22px;font-size:42px;font-weight:900;white-space:nowrap}
    .lad i{font-style:normal;color:var(--muted)} .lad small{font-size:28px;font-weight:800;color:var(--muted);margin-left:18px}
    .stmp{position:absolute} .stmp div{transform:rotate(-8deg);padding:4px 22px;border:7px solid var(--bad);border-radius:16px;color:var(--bad);font-size:42px;font-weight:900;letter-spacing:.05em;background:rgba(14,16,24,.85);white-space:nowrap}
    .nm{position:absolute;left:0;right:0;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .nm .st{position:relative;display:inline-block} .nm .st i{position:absolute;left:-10px;right:-10px;top:52%;height:8px;border-radius:4px;background:var(--bad)}
    .tile{position:absolute;top:330px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:96px;font-size:68px;font-weight:900;line-height:1} .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .why{position:absolute;left:120px;width:1680px;text-align:center;font-size:40px;font-weight:800;white-space:nowrap}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:10px 20px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- drawing helpers ----------
  const BOND = '#c9cee0'
  const line = (x1, y1, x2, y2, w = 10, col = BOND) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`
  // a molecule: atoms [[x, y, r, gradient, label]], bonds [[i, j]] drawn underneath
  const mol = (atoms, bonds, w = 10) => bonds.map(([i, j]) => line(atoms[i][0], atoms[i][1], atoms[j][0], atoms[j][1], w)).join('') + atoms.map(([x, y, r, g, l]) => ball(x, y, r, g, l ?? '')).join('')
  // water: O at (x, y), H atoms at angles a1, a2 (degrees), distance d
  const pol = (x, y, a, d) => [x + d * Math.cos((a * Math.PI) / 180), y + d * Math.sin((a * Math.PI) / 180)]
  const water = (x, y, a1, a2, s = 1, lab = true) => {
    const d = 78 * s, h1 = pol(x, y, a1, d), h2 = pol(x, y, a2, d)
    return mol([[x, y, 40 * s, 'teal', lab ? 'O' : ''], [...h1, 26 * s, 'gray', lab ? 'H' : ''], [...h2, 26 * s, 'gray', lab ? 'H' : '']], [[0, 1], [0, 2]], 10 * s)
  }
  // a lone pair of electrons on an atom at (x, y), pointing at angle a
  const lp = (x, y, a, d = 56) => { const [cx, cy] = pol(x, y, a, d), [px, py] = [Math.cos(((a + 90) * Math.PI) / 180) * 9, Math.sin(((a + 90) * Math.PI) / 180) * 9]
    return `<circle cx="${cx + px}" cy="${cy + py}" r="7" fill="#f2c443"/><circle cx="${cx - px}" cy="${cy - py}" r="7" fill="#f2c443"/>` }
  const dash = (x1, y1, x2, y2, col = '#f2c443', w = 6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-dasharray="10 10" stroke-linecap="round"/>`
  const txt = (x, y, t, cls = '', fs = 32, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${fs}" font-weight="900" class="${cls}">${t}</text>`
  // a generic polar molecule: a δ+ end (warm) and a δ− end (teal)
  const polar = (x, y, s = 1) => mol([[x - 40 * s, y, 26 * s, 'warm'], [x + 26 * s, y, 38 * s, 'teal']], [[0, 1]], 10 * s)
  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const DM = 'δ−', DP = 'δ+'
  const nt = (left, top, at, b, s) => `<div class="nt" style="left:${left}px;top:${top}px" data-at="${at}"><b>${b}</b><span>${s}</span></div>`
  const check = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- intro artwork: faint molecules on the left and right edges (all above y = 950) ----------
  let art = '<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">'
  art += water(110, 300, 60, 160, 0.8, false) + water(90, 560, 20, 120, 0.8, false) + water(130, 800, -40, 60, 0.8, false)
  art += dash(150, 360, 110, 500) + dash(130, 620, 120, 740)
  art += water(1810, 330, 30, 130, 0.8, false) + water(1830, 590, 100, 200, 0.8, false) + water(1790, 830, -100, 0, 0.8, false)
  art += dash(1800, 400, 1820, 530) + dash(1800, 660, 1790, 770)
  art += '</svg>'
  EZ.intro = {
    chips: [['1@0.3', 'The four IMFs'], ['1@0.55', 'An IMF flowchart'], ['1@0.8', 'The H-bond trap']],
    art,
  }

  // ---------- hook: a gecko on the ceiling, and forces between molecules ----------
  const gecko = `<g class="gk">
      <path d="M-120 92 C -190 96 -230 140 -260 120" fill="none" stroke="#4cc781" stroke-width="16" stroke-linecap="round"/>
      ${[[-70, -1], [60, 1]].map(([x, k]) => `<path class="lg" d="M${x} 90 L ${x - 18 * k} 40" stroke="#4cc781" stroke-width="12" stroke-linecap="round" fill="none"/><ellipse cx="${x - 18 * k}" cy="36" rx="20" ry="7" fill="#c9f5da"/><ellipse class="stk" cx="${x - 18 * k}" cy="36" rx="34" ry="16" fill="none" stroke="#f2c443" stroke-width="4" opacity="0"/>`).join('')}
      <ellipse cx="0" cy="96" rx="130" ry="30" fill="url(#g-green)"/>
      <ellipse cx="160" cy="94" rx="46" ry="26" fill="url(#g-green)"/><circle cx="176" cy="104" r="6" fill="#10131c"/></g>`
  const mini = (k, x, y) => {
    let s = `<rect x="${x}" y="${y}" width="150" height="110" rx="14" fill="rgba(255,255,255,.03)" stroke="#4a5170" stroke-width="3"/>`
    if (k === 's') for (let a = 0; a < 4; a++) for (let b = 0; b < 6; b++) s += ball(x + 25 + b * 20, y + 25 + a * 20, 9, 'pur')
    else if (k === 'l') for (let a = 0; a < 3; a++) for (let b = 0; b < 6; b++) s += ball(x + 22 + b * 21 + (a % 2 ? 8 : 0), y + 92 - a * 19, 9, 'teal')
    else [[30, 30], [110, 40], [60, 82], [125, 90]].forEach(([dx, dy]) => (s += ball(x + dx, y + dy, 9, 'warm')))
    return s
  }
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Look closer</div><h2 class="h1" data-at="0">Forces between molecules</h2>
      <div class="card" style="left:120px;top:300px;width:800px;height:540px" data-at="0"><h3 class="good">A gecko on the ceiling</h3>
        <svg style="position:absolute;left:0;top:100px" width="800" height="420">
          <rect x="40" y="20" width="720" height="26" rx="6" fill="#4a5170"/>${[...Array(18)].map((_, i) => line(60 + i * 40, 20, 80 + i * 40, 0, 4, '#4a5170')).join('')}
          <g transform="translate(400 10)">${gecko}</g>
          <text x="400" y="290" text-anchor="middle" font-size="36" font-weight="900" class="f-gold" data-at="1@0.4" data-fx="fade">weak, “sticky” forces</text>
          <text x="400" y="340" text-anchor="middle" font-size="28" font-weight="800" class="f-muted" data-at="1@0.6" data-fx="fade">the same ones that hold molecules together in liquids</text></svg></div>
      <div class="card" style="left:980px;top:300px;width:820px;height:300px" data-at="2"><h3><span class="teal">Inter</span>molecular forces (IMFs)</h3>
        <svg style="position:absolute;left:0;top:90px" width="820" height="210">
          <g data-at="2@0.3" data-fx="pop">${water(250, 90, 30, 150, 0.9)}</g><g data-at="2@0.3" data-fx="pop">${water(570, 110, -30, 70, 0.9)}</g>
          <g data-at="2@0.6" data-fx="fade">${dash(345, 132, 520, 116)}</g>
          ${txt(380, 196, 'between molecules', 'f-gold', 30)}</svg></div>
      <div class="card" style="left:980px;top:630px;width:820px;height:210px" data-at="3">
        <svg style="position:absolute;left:0;top:0" width="820" height="210">
          ${mini('g', 60, 24)}${mini('l', 335, 24)}${mini('s', 610, 24)}
          ${txt(135, 176, 'gas', 'f-warm', 30)}${txt(410, 176, 'liquid', 'f-teal', 30)}${txt(685, 176, 'solid', 'f-pri', 30)}</svg></div>
      <div class="ft" style="top:870px;font-size:36px" data-at="3@0.4" data-fx="fade">IMFs decide which one, <span class="teal">at room temperature</span></div>`,
    update(c) {
      const g = c.$('.gk'), t = c.t
      const x = clamp(-120 + 12 * (t - c.at('in')), -120, 130)
      g.setAttribute('transform', `translate(${x.toFixed(1)} 0)`)
      const s = c.p('1', 0.5) * (0.7 + 0.3 * Math.sin(t * 5))
      all(c, '.stk').forEach((e) => e.setAttribute('opacity', s.toFixed(2)))
      all(c, '.lg').forEach((l, i) => l.setAttribute('transform', `rotate(${(8 * Math.sin(t * 5 + i * Math.PI)).toFixed(1)} ${i ? 60 : -70} 90)`))
    },
  })

  // ---------- inside vs between: two water molecules, then boiling separates them ----------
  // molecule A: O (740, 540); molecule B: O (1080, 560)
  const molA = water(740, 540, 32, 150), molB = water(1080, 560, -30, 60)
  EZ.scene('inside', {
    html: `<div class="kicker" data-at="in" data-fx="left">Inside vs. between</div><h2 class="h1" data-at="0"><span class="pri">Intra</span> vs. <span class="warm">inter</span></h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:510px" data-at="0"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="pop"><g class="ma">${molA}</g></g>
        <g data-at="0@0.5" data-fx="pop"><g class="mb">${molB}</g></g>
        <g class="att"><g data-at="2" data-fx="fade">${dash(836, 582, 1036, 566, '#f3a764', 7)}</g></g>
        <g data-at="1" data-out="3" data-fx="fade"><text x="400" y="430" text-anchor="middle" font-size="38" font-weight="900" class="f-pri">Intramolecular</text>
          <text x="400" y="474" text-anchor="middle" font-size="30" font-weight="800">bond <tspan class="f-pri">inside</tspan> a molecule</text>
          <text x="400" y="516" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">covalent · strong</text>
          <path d="M520 500 L 700 552" stroke="#8d8df0" stroke-width="5" fill="none" marker-end="url(#mk-pri)"/></g>
        <g data-at="2" data-out="3" data-fx="fade"><text x="940" y="690" text-anchor="middle" font-size="38" font-weight="900" class="f-warm">Intermolecular</text>
          <text x="940" y="734" text-anchor="middle" font-size="30" font-weight="800">attraction <tspan class="f-warm">between</tspan> molecules</text>
          <text x="940" y="776" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">much weaker</text></g>
        <g data-at="3" data-fx="fade">${txt(960, 400, 'Water boils', 'f-warm', 44)}</g>
        <g data-at="3@0.5" data-fx="pop">${txt(960, 740, 'O–H bonds don’t break ✓', 'f-good', 40)}</g>
        <g data-at="4@0.4" data-fx="fade">${txt(960, 460, 'the molecules separate', 'f-muted', 32)}</g>
      </svg>
      <div class="banner" style="top:830px" data-at="5" data-fx="pop">Boiling overcomes <span class="warm">intermolecular</span> forces only</div>`,
    update(c) {
      const p = eio(c.p('4', 1.6)), t = c.t
      const wa = 3 * Math.sin(t * 3), wb = 3 * Math.cos(t * 2.6)
      c.$('.ma').setAttribute('transform', `translate(${(-120 * p + wa * p).toFixed(1)} ${(wb * p).toFixed(1)})`)
      c.$('.mb').setAttribute('transform', `translate(${(330 * p + wb * p).toFixed(1)} ${(wa * p).toFixed(1)})`)
      c.$('.att').setAttribute('opacity', (1 - c.p('4', 0.5)).toFixed(2))
    },
  })

  // ---------- 1. London dispersion forces: a shifting electron cloud induces a dipole ----------
  const cloud = (cls, x, y) => `<g class="${cls}"><ellipse cx="${x}" cy="${y}" rx="150" ry="104" fill="url(#g-cloud)" stroke="rgba(141,141,240,.55)" stroke-width="3"/></g>${ball(x, y, 34, 'gray')}`
  EZ.scene('ldf', {
    html: `<div class="kicker" data-at="in" data-fx="left">The four IMFs · weakest → strongest, generally</div><h2 class="h1" data-at="1"><span class="pri">1.</span> London dispersion forces</h2>
      <div class="card" style="left:120px;top:300px;width:1120px;height:500px" data-at="1"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.4" data-fx="pop">${cloud('ca', 470, 560)}</g><g data-at="1@0.6" data-fx="pop">${cloud('cb', 890, 560)}</g>
        <g data-at="3@0.5" data-fx="pop">${txt(370, 440, DP, 'f-warm', 50)}${txt(580, 440, DM, 'f-teal', 50)}</g>
        <g data-at="4@0.4" data-fx="pop">${txt(800, 440, DP, 'f-warm', 50)}${txt(1010, 440, DM, 'f-teal', 50)}</g>
        <g data-at="4@0.7" data-fx="fade">${dash(670, 560, 770, 560, '#f2c443', 7)}${txt(720, 740, 'attract', 'f-gold', 34)}</g>
        <g data-at="3" data-out="4" data-fx="fade">${txt(470, 740, 'electrons shift', 'f-muted', 30)}</g>
        <g data-at="4" data-fx="fade">${txt(940, 740, 'induced dipole', 'f-muted', 30)}</g>
      </svg>
      ${nt(1290, 300, '2', 'Every molecule', 'has dispersion forces')}
      ${nt(1290, 475, '3', 'Temporary dipole', 'fluctuating: electrons shift')}
      ${nt(1290, 650, '4', 'Induced dipole', `in a neighbor ${ARR} they attract`)}
      <div class="banner" style="top:830px" data-at="5" data-fx="pop">More electrons ${ARR} more <span class="pri">polarizable</span> ${ARR} stronger LDFs</div>`,
    update(c) {
      const t = c.t, a = eio(c.p('3', 0.9)), b = eio(c.p('4', 0.9))
      c.$('.ca').setAttribute('transform', `translate(${(8 * Math.sin(t * 3.1) * (1 - a) + 40 * a).toFixed(1)} 0)`)
      c.$('.cb').setAttribute('transform', `translate(${(8 * Math.sin(t * 2.7 + 1) * (1 - b) + 40 * b).toFixed(1)} 0)`)
    },
  })

  // ---------- 2. dipole–dipole and 3. hydrogen bonding ----------
  // H-bond: molecule A O (1170, 560), its H at angle 25 -> (1241, 593); molecule B O (1500, 620) with a lone pair toward A
  const hA = pol(1170, 560, 25, 78)
  EZ.scene('polar', {
    html: `<div class="kicker" data-at="in" data-fx="left">The four IMFs</div><h2 class="h1" data-at="0"><span class="pri">2.</span> Dipole–dipole <span class="muted">&nbsp;·&nbsp;</span> <span class="pri">3.</span> H-bonding</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:560px" data-at="0"><h3 class="teal">Dipole–dipole</h3>
        <div class="sub2" style="top:92px" data-at="1" data-fx="fade">between <span class="teal">polar</span> molecules</div>
        <svg style="position:absolute;left:0;top:150px" width="810" height="400">
          <g data-at="1@0.3" data-fx="pop"><g class="pm" data-i="0">${polar(230, 180, 1.3)}</g></g>
          <g data-at="1@0.5" data-fx="pop"><g class="pm" data-i="1">${polar(560, 180, 1.3)}</g></g>
          <g data-at="2" data-fx="pop">${txt(178, 100, DP, 'f-warm', 46)}${txt(264, 100, DM, 'f-teal', 46)}${txt(508, 100, DP, 'f-warm', 46)}${txt(594, 100, DM, 'f-teal', 46)}</g>
          <g data-at="2@0.4" data-fx="fade">${dash(316, 180, 486, 180, '#f2c443', 7)}</g>
          <text x="405" y="330" text-anchor="middle" font-size="34" font-weight="900" data-at="2@0.6" data-fx="fade"><tspan class="f-warm">δ+</tspan> end attracts <tspan class="f-teal">δ−</tspan> end</text></svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:560px" data-at="3"><h3 class="gold">Hydrogen bonding</h3>
        <div class="sub2" style="top:92px" data-at="4" data-fx="fade">a strong, special case of dipole–dipole</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.3" data-fx="pop">${water(1170, 560, 25, 145)}</g>
        <g data-at="3@0.5" data-fx="pop">${water(1500, 640, -40, 60)}${lp(1500, 640, 190)}${lp(1500, 640, 250)}</g>
        <g data-at="5" data-fx="fade"><circle cx="${hA[0]}" cy="${hA[1]}" r="38" fill="none" stroke="#f2c443" stroke-width="5"/>
          <text x="1260" y="480" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">H bonded directly to N, O or F</text></g>
        <g data-at="6" data-fx="fade">${dash(hA[0] + 30, hA[1] + 4, 1430, 627, '#f2c443', 7)}
          <text x="1470" y="770" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">lone pair on N, O or F</text>
          <path d="M1446 740 L 1444 652" stroke="#f2c443" stroke-width="4" fill="none" marker-end="url(#mk-gold)"/></g>
        <g data-at="6@0.6" data-fx="fade">${txt(1395, 830, '…in another molecule, or another part of the same one', 'f-muted', 26)}</g>
      </svg>`,
    update(c) {
      for (const g of all(c, '.pm')) g.setAttribute('transform', `translate(${(3 * Math.sin(c.t * 2 + +g.dataset.i * 2)).toFixed(1)} ${(3 * Math.cos(c.t * 1.7 + +g.dataset.i)).toFixed(1)})`)
    },
  })

  // ---------- 4. ion–dipole: Na+ surrounded by water, O ends pointing in ----------
  const ring = [0, 60, 120, 180, 240, 300].map((a, i) => `<g data-at="1@${(0.35 + i * 0.08).toFixed(2)}" data-fx="fade"><g class="wr" data-a="${a}" transform="translate(650 545) rotate(${a})">${mol([[120, 0, 32, 'teal'], [165, -34, 21, 'gray'], [165, 34, 21, 'gray']], [[0, 1], [0, 2]], 8)}</g></g>`).join('')
  EZ.scene('ion', {
    html: `<div class="kicker" data-at="in" data-fx="left">The four IMFs</div><h2 class="h1" data-at="0"><span class="pri">4.</span> Ion–dipole</h2>
      <div class="card" style="left:120px;top:300px;width:1060px;height:500px" data-at="0"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="pop">${ball(650, 545, 50, 'pur', sup('Na', '+'), 36)}</g>
        ${ring}
        <g data-at="1@0.9" data-fx="fade">${ball(930, 400, 16, 'teal')}${txt(956, 410, 'O', 'f-teal', 28, 'start')}${ball(1010, 400, 12, 'gray')}${txt(1032, 410, 'H', 'f-muted', 28, 'start')}${txt(970, 450, 'water', 'f-muted', 26)}</g>
      </svg>
      ${nt(1230, 300, '1', 'Ion + polar molecule', 'like Na<sup>+</sup> surrounded by water')}
      ${nt(1230, 475, '2', 'Na<sup>+</sup> attracts the <i class="teal" style="font-style:normal">δ−</i> O', 'of each water molecule')}
      ${nt(1230, 650, '3', 'Generally stronger', 'than dipole–dipole')}
      <div class="lad" style="top:830px" data-at="4" data-fx="pop">LDFs <i>&lt;</i> dipole–dipole <i>&lt;</i> H-bonding <i>&lt;</i> <span class="pri">ion–dipole</span><small>(generally)</small></div>`,
    update(c) {
      for (const g of all(c, '.wr')) { const a = +g.dataset.a
        g.setAttribute('transform', `translate(650 545) rotate(${(a + 4 * Math.sin(c.t * 1.8 + a)).toFixed(1)}) translate(${(3 * Math.sin(c.t * 2.3 + a)).toFixed(1)} 0)`) }
    },
  })

  // ---------- big molecules, big forces ----------
  const chain = (x0, y, n, step, g, r, amp) => { let s = '', pts = []
    for (let i = 0; i < n; i++) pts.push([x0 + i * step, y + (i % 2 ? amp : -amp)])
    for (let i = 1; i < n; i++) s += line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], 6)
    return s + pts.map(([x, yy]) => ball(x, yy, r, g)).join('') }
  const hairpin = (() => { let s = '', pts = []
    for (let i = 0; i < 11; i++) pts.push([1140 + i * 50, 560])
    for (let k = 1; k < 6; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 6; pts.push([1640 + 60 * Math.cos(a), 620 + 60 * Math.sin(a)]) }
    for (let i = 10; i >= 0; i--) pts.push([1140 + i * 50, 680])
    for (let i = 1; i < pts.length; i++) s += line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], 6)
    return s + pts.map(([x, y], i) => ball(x, y, 16, i % 3 ? 'teal' : 'pur')).join('') })()
  EZ.scene('big', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch the word “generally”</div><h2 class="h1" data-at="0">Big molecules, big forces</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:580px" data-at="1"><h3 class="pri">LDFs are in everything</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="480">
          <g data-at="2" data-fx="pop"><ellipse cx="405" cy="70" rx="330" ry="56" fill="url(#g-cloud)"/>${chain(135, 70, 12, 49, 'gray', 17, 12)}
            <ellipse cx="405" cy="190" rx="330" ry="56" fill="url(#g-cloud)"/>${chain(135, 190, 12, 49, 'gray', 17, 12)}</g>
          <g data-at="2@0.4" data-fx="fade">${[0, 1, 2, 3, 4, 5].map((i) => dash(160 + i * 98, 100, 160 + i * 98, 160, '#f2c443', 5)).join('')}</g>
          <text x="405" y="282" text-anchor="middle" font-size="32" font-weight="900" data-at="2@0.5" data-fx="fade">Large molecules: LDFs often the <tspan class="f-pri">strongest</tspan></text>
          <g data-at="3" data-fx="pop">${polar(110, 380, 0.9)}${polar(270, 380, 0.9)}${dash(174, 380, 204, 380, '#f2c443', 5)}</g>
          <text x="360" y="370" font-size="28" font-weight="800" class="f-muted" data-at="3@0.3" data-fx="fade">can beat the dipole–dipole</text>
          <text x="360" y="408" font-size="28" font-weight="800" class="f-muted" data-at="3@0.3" data-fx="fade">of smaller polar molecules</text></svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:580px" data-at="4"><h3 class="teal">Proteins and DNA</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="4@0.2" data-fx="fade"><g class="hp">${hairpin}</g></g>
        <g data-at="4@0.45" data-fx="fade">${[0, 1, 2, 3, 4, 5].map((i) => dash(1165 + i * 90, 585, 1165 + i * 90, 655, '#f2c443', 5)).join('')}</g>
        <g data-at="4@0.55" data-fx="fade">${txt(1395, 780, 'attractions between different parts', '', 32)}${txt(1395, 824, 'of the same molecule hold its shape', 'f-muted', 30)}</g>
      </svg>`,
  })

  // ---------- the IMF flowchart ----------
  const ROWS = [
    ['Ion + polar molecule?', 'ion–dipole', '', '#8d8df0', '1'],
    ['H bonded directly to N, O or F?', 'H-bonding', '+ dipole–dipole + LDFs', '#f2c443', '2'],
    ['Polar molecule?', 'dipole–dipole', '+ LDFs', '#3cc7bc', '3'],
    ['Otherwise', 'LDFs only', '', '#f3a764', '4'],
  ]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Exam hack</div><h2 class="h1" data-at="0">The IMF flowchart: ask in order</h2>
      ${ROWS.map(([q, r, extra, col, at], i) => `<div class="q r${i}" style="top:${300 + i * 126}px" data-at="${at}" data-fx="left"><div class="n">${i + 1}</div>${q}</div>
        <div class="yes" style="top:${300 + i * 126}px" data-at="${at}@0.45" data-fx="fade">${i < 3 ? 'yes' : ''}${ARR}</div>
        <div class="res s${i}" style="top:${300 + i * 126}px;border-color:${col};color:${col}" data-at="${at}@0.5" data-fx="right">${r}${extra ? `<span>${extra}</span>` : ''}</div>`).join('')}
      <div class="banner" style="top:822px" data-at="5" data-out="6" data-fx="pop"><span>CO<sub>2</sub></span>: linear, symmetric ${ARR} nonpolar ${ARR} <span class="warm">LDFs only</span></div>
      <div class="banner" style="top:822px" data-at="6" data-fx="pop">“H-bonding is <span class="gold">FON</span>!” &nbsp;<span class="muted" style="font-size:40px">F, O, N</span></div>`,
    update(c) {
      const g = c.p('5', 0.4) * (1 - c.p('6', 0.35)) * (0.75 + 0.25 * Math.sin(c.t * 6))
      for (const k of ['.r3', '.s3']) { const el = c.$(k); el.style.boxShadow = `0 0 ${50 * g}px rgba(243,167,100,${0.55 * g})` }
      c.$('.r3').style.borderColor = g ? `rgba(243,167,100,${g})` : ''
    },
  })

  // ---------- the trap: CH3F ----------
  // C (470, 600), F (640, 600), H atoms around C
  const CH3F = [[470, 600, 46, 'gray', 'C'], [640, 600, 46, 'green', 'F'], [400, 490, 30, 'gray', 'H'], [350, 650, 30, 'gray', 'H'], [460, 730, 30, 'gray', 'H']]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="0">H and F … but no H-bonding</h2>
      <div class="card" style="left:120px;top:300px;width:880px;height:580px" data-at="1"><h3 class="warm">CH<sub>3</sub>F</h3>
        <div class="ft" style="bottom:28px;font-size:33px" data-at="4" data-fx="fade">The H must be <span class="good">directly</span> on N, O or F</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="pop">${mol(CH3F, [[0, 1], [0, 2], [0, 3], [0, 4]], 12)}</g>
        <g data-at="1@0.4" data-fx="fade">${txt(250, 500, 'H atoms', 'f-muted', 30)}${txt(702, 610, 'F atom', 'f-good', 30, 'start')}</g>
        <g data-at="2" data-fx="fade">${[2, 3, 4].map((i) => line(470, 600, CH3F[i][0], CH3F[i][1], 22, 'rgba(243,167,100,.55)')).join('')}${mol(CH3F, [[0, 2], [0, 3], [0, 4]], 12)}</g>
        <g data-at="2@0.4" data-fx="fade">${txt(740, 720, 'H on C, not F', 'f-warm', 36)}</g>
      </svg>
      <div class="stmp" style="left:560px;top:400px" data-at="3" data-fx="pop"><div>NO H-bonding</div></div>
      <div class="card" style="left:1060px;top:300px;width:740px;height:580px" data-at="5"><h3>Use the specific name</h3>
        <div class="sub2" style="top:100px;font-size:28px">College Board course description</div>
        <div class="nm" style="top:220px" data-at="5@0.3" data-fx="fade"><span class="st muted">van der Waals forces<i></i></span></div>
        <div class="nm" style="top:310px;font-size:40px;color:var(--muted)" data-at="5@0.6" data-fx="fade">is not another name for</div>
        <div class="nm" style="top:400px" data-at="6" data-fx="pop"><span class="good">London dispersion forces</span></div></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'CH<sub>4</sub>', '1@0.2'], ['B', 'CH<sub>3</sub>OCH<sub>3</sub>', '1@0.38'], ['C', 'CH<sub>3</sub>OH', '1@0.66'], ['D', 'HCl', '1@0.86']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">Which substance can form <span class="gold">hydrogen bonds</span> with itself?</h2>
      ${OPTS.map(([l, f, at], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="${at}" data-fx="pop"><div class="l">${l}</div><div class="f"><span>${f}</span></div>
        ${i === 2 ? check : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="740" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="740" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 740)"/>
        <text class="num" x="960" y="764" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="860" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:640px;font-size:46px" data-at="4" data-fx="pop">Only <span>CH<sub>3</sub>OH</span> has an <span class="teal">O–H</span> bond</div>
      <div class="why" style="top:790px" data-at="5" data-fx="fade"><span>CH<sub>3</sub>OCH<sub>3</sub></span>: all its H atoms are on C</div>
      <div class="why" style="top:850px" data-at="5@0.6" data-fx="fade"><span>HCl</span>: Cl isn’t N, O or F</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="190" viewBox="0 0 460 190">${water(120, 80, 30, 150, 0.8)}${water(340, 100, -30, 70, 0.8)}${dash(200, 116, 300, 104, '#f3a764', 6)}</svg>`
  const bars = [['LDFs', 40, 'gray'], ['dip–dip', 75, 'teal'], ['H-bond', 110, 'gold'], ['ion–dip', 145, 'pur']]
  const BC = { gray: '#aab1c4', teal: '#3cc7bc', gold: '#f2c443', pur: '#8d8df0' }
  const m2 = `<svg width="460" height="190" viewBox="0 0 460 190">${bars.map(([l, h, g], i) => `<rect x="${30 + i * 106}" y="${150 - h}" width="80" height="${h}" rx="10" fill="${BC[g]}"/>${txt(70 + i * 106, 182, l, 'f-muted', 22)}`).join('')}</svg>`
  const m3 = `<svg width="460" height="190" viewBox="0 0 460 190"><ellipse cx="120" cy="85" rx="62" ry="46" fill="url(#g-cloud)" stroke="rgba(141,141,240,.55)" stroke-width="3"/>${ball(120, 85, 18, 'gray')}
      <ellipse cx="330" cy="85" rx="110" ry="74" fill="url(#g-cloud)" stroke="rgba(141,141,240,.55)" stroke-width="3"/>${ball(330, 85, 26, 'gray')}
      ${txt(120, 180, 'fewer e⁻', 'f-muted', 24)}${txt(330, 180, 'more e⁻', 'f-pri', 24)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>IMFs are <span class="warm">between</span> molecules<br>Boiling and melting<br>break IMFs, <span class="pri">not</span> covalent bonds</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>LDFs &lt; dipole–dipole<br>&lt; H-bonding (H on N/O/F)<br>&lt; <span class="pri">ion–dipole</span> (generally)</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>More electrons<br>= more <span class="pri">polarizable</span><br>= stronger LDFs</p></div>`,
  })
})()
