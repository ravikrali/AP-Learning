// Pictures for chem-1.7 "Periodic Trends". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u1.ts). Atoms and ions are schematic: only the
// order of sizes is claimed, and the only numbers are the ones the lesson gives.
(() => {
  const { clamp, eio, eo, back, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .zn{position:absolute;left:1180px;width:620px;padding:20px 30px 22px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .zn b{display:block;font-size:40px;font-weight:900;line-height:1.15} .zn span{display:block;margin-top:6px;font-size:30px;font-weight:700;line-height:1.3;color:var(--muted)}
    .ft{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:35px;font-weight:800;white-space:nowrap}
    .ln{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap}
    .cx{position:absolute;left:120px;width:1680px;padding:22px 40px 24px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:50px;font-weight:900;line-height:1.35;white-space:nowrap}
    .opt{position:absolute;left:120px;width:1680px;height:100px;padding-left:112px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:40px;font-weight:800;white-space:nowrap}
    .opt .l{position:absolute;left:26px;top:20px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;text-align:center;color:var(--muted)}
    .opt .ok{position:absolute;right:24px;top:16px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.3;white-space:nowrap}
    .rw{position:absolute;left:0;right:0;text-align:center;font-size:33px;font-weight:800;white-space:nowrap}
    .tr{position:absolute;left:120px;width:1680px;height:100px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:42px;font-weight:900;white-space:nowrap}
    .tr i{position:absolute;top:0;line-height:96px;font-style:normal} .tr .a{left:560px;color:var(--teal)} .tr .d{left:1130px;color:var(--warm)} .tr .nm{left:36px}
    .th{position:absolute;top:300px;font-size:30px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .pil{position:absolute;top:310px;height:74px;padding:0 34px;border-radius:40px;background:rgba(36,40,56,.92);border:3px solid var(--line);font-size:38px;font-weight:900;line-height:68px;white-space:nowrap}
  `
  document.head.appendChild(css)
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', BAD = '#f0707a', MUTED = '#a3abbd'

  const nucleus = (x, y, r = 34) => ball(x, y, r, 'warm', '+', r * 1.2)
  const electron = (x, y, r = 16, g = 'teal') => ball(x, y, r, g, '−', r * 1.3)
  const arrow = (x1, y1, x2, y2, w, col = 'warm') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col === 'warm' ? WARM : TEAL}" stroke-width="${w}" marker-end="url(#mk-${col})"/>`
  const cross = (col) => `<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="50" fill="none" stroke="${col}" stroke-width="7"/><path d="M36 36L74 74M74 36L36 74" stroke="${col}" stroke-width="9" stroke-linecap="round"/></svg>`
  const tick = '<svg width="110" height="110" viewBox="0 0 110 110"><circle cx="55" cy="55" r="52" fill="#4cc781"/><path d="M30 57l17 17 33-37" fill="none" stroke="#10131c" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- intro artwork: faint atoms on the left and right edges (all above y = 950) ----------
  const orbitArt = (x, y) => `<g>${[70, 130, 190].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8d8df0" stroke-width="3"/>`).join('')}${nucleus(x, y, 28)}${electron(x + 130, y, 14)}${electron(x - 92, y - 92, 14)}${electron(x + 190 * 0.7, y + 190 * 0.7, 14)}</g>`
  EZ.intro = {
    chips: [['1@0.28', 'Two moves'], ['1@0.52', 'The four trends'], ['1@0.76', 'Ion sizes']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${orbitArt(40, 400)}${orbitArt(1880, 620)}</svg>`,
  }

  // ---------- hook: fluorine vs cesium ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Greediest and most generous</h2>
      <div class="card" style="left:120px;top:320px;width:760px;height:450px" data-at="0@0.2"><h3>Fluorine</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="450" viewBox="0 0 760 450">
          <circle cx="380" cy="220" r="130" fill="url(#g-cloud)"/>${nucleus(380, 220, 44)}${electron(520, 220, 22)}${arrow(496, 220, 440, 220, 14)}</svg>
        <div class="ft"><span class="teal">greediest for electrons</span></div></div>
      <div class="card" style="left:1040px;top:320px;width:760px;height:450px" data-at="0@0.6"><h3>Cesium</h3>
        <svg style="position:absolute;left:0;top:0" width="760" height="450" viewBox="0 0 760 450">
          <circle cx="380" cy="220" r="130" fill="url(#g-cloud)"/>${nucleus(380, 220, 44)}${electron(610, 220, 22)}${arrow(586, 220, 556, 220, 4)}</svg>
        <div class="ft"><span class="warm">most generous</span></div></div>
      <div class="ln" style="top:800px;font-size:44px;color:var(--muted)" data-at="1" data-fx="fade">One tug-of-war</div>
      <div class="banner" style="top:896px" data-at="2" data-fx="pop"><span class="warm">Nucleus</span> vs <span class="teal">electrons</span></div>`,
  })

  // ---------- the two moves ----------
  const MX = 415, MY = 245
  EZ.scene('moves', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="0">Two moves explain every trend</h2>
      <div class="card" style="left:120px;top:300px;width:830px;height:610px" data-at="1" data-fx="right"><h3>Across a period →</h3>
        <svg style="position:absolute;left:0;top:0" width="830" height="610" viewBox="0 0 830 610">
          <circle cx="${MX}" cy="${MY}" r="120" fill="none" stroke="#3cc7bc" stroke-width="3" stroke-dasharray="8 8"/>
          <g class="l-nu"></g><g class="l-el"></g><g class="l-ar"></g></svg>
        <div class="rw" style="top:440px" data-at="2" data-fx="fade"><span class="warm">Protons increase</span></div>
        <div class="rw" style="top:492px" data-at="2@0.55" data-fx="fade">Same shell, similar shielding</div>
        <div class="rw" style="top:545px;font-size:37px" data-at="3" data-fx="pop"><span class="teal">Effective nuclear charge rises</span></div></div>
      <div class="card" style="left:970px;top:300px;width:830px;height:610px" data-at="4" data-fx="left"><h3>Down a group ↓</h3>
        <svg style="position:absolute;left:0;top:0" width="830" height="610" viewBox="0 0 830 610">
          <circle cx="${MX}" cy="${MY}" r="58" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>
          <circle class="r-ring" cx="${MX}" cy="${MY}" r="110" fill="none" stroke="#3cc7bc" stroke-width="3" stroke-dasharray="8 8"/>
          <g class="r-nu">${nucleus(MX, MY, 36)}</g><g class="r-el"></g><g class="r-ar"></g></svg>
        <div class="rw" style="top:440px" data-at="5" data-fx="fade"><span class="warm">A new shell each row</span></div>
        <div class="rw" style="top:492px" data-at="5@0.55" data-fx="fade">Farther away, more shielded</div>
        <div class="rw" style="top:545px;font-size:37px" data-at="6" data-fx="pop"><span class="bad">Held more loosely</span></div></div>`,
    update(c) {
      const a = c.t * 1.2
      const grow = eio(c.p('2', 1.4))
      const pull = eio(c.p('3', 0.8))
      const nr = 28 + 22 * grow
      c.$('.l-nu').innerHTML = nucleus(MX, MY, nr)
      const ex = MX + 120 * Math.cos(a), ey = MY + 120 * Math.sin(a)
      c.$('.l-el').innerHTML = electron(ex, ey, 18) + electron(MX + 120 * Math.cos(a + 2.1), MY + 120 * Math.sin(a + 2.1), 18)
      const ux = Math.cos(a), uy = Math.sin(a)
      c.$('.l-ar').innerHTML = pull > 0 ? arrow(ex - ux * 24, ey - uy * 24, ex - ux * 64, ey - uy * 64, 4 + 10 * pull) : ''
      const out = 110 + 55 * eio(c.p('5', 1.4))
      c.$('.r-ring').setAttribute('r', out)
      const b = -c.t * 0.7 + 1
      const bx = MX + out * Math.cos(b), by = MY + out * Math.sin(b)
      c.$('.r-el').innerHTML = [0, Math.PI].map((o) => electron(MX + 58 * Math.cos(a + o), MY + 58 * Math.sin(a + o), 15, 'pur')).join('') + electron(bx, by, 18)
      const k = c.p('4@0.3', 0.5) * (1 - 0.6 * eio(c.p('5', 1.4)))
      const cx = Math.cos(b), cy = Math.sin(b)
      c.$('.r-ar').innerHTML = k > 0.02 ? arrow(bx - cx * 26, by - cy * 26, bx - cx * (26 + 40), by - cy * (26 + 40), 4 + 6 * k) : ''
    },
  })

  // ---------- the four trends ----------
  const ROWS = [['Atomic radius', 'decreases', 'increases', '1'], ['Ionization energy', 'increases', 'decreases', '2'], ['Electronegativity', 'increases', 'decreases', '3'], ['Electron affinity', 'generally more released', 'generally less released', '5']]
  EZ.scene('trends', {
    html: `<div class="kicker" data-at="in" data-fx="left">The four trends</div><h2 class="h1" data-at="0">Across and down</h2>
      <div class="th" style="left:680px" data-at="0@0.3" data-fx="fade">Across →</div><div class="th" style="left:1250px" data-at="0@0.3" data-fx="fade">Down ↓</div>
      ${ROWS.map(([n, a, d, at], i) => `<div class="tr" style="top:${350 + i * 118}px" data-at="${at}" data-fx="right"><i class="nm">${n}</i><i class="a" style="${i === 3 ? 'font-size:34px' : ''}">${a}</i><i class="d" style="${i === 3 ? 'font-size:34px' : ''}">${d}</i></div>`).join('')}
      <div class="banner" style="top:840px;font-size:44px" data-at="4" data-fx="pop">Electronegativity: pull on <span class="teal">shared electrons</span> in a bond. <span class="warm">F is highest.</span></div>
      <div class="ln" style="top:972px;font-size:30px;color:var(--muted)" data-at="5" data-fx="fade">Electron affinity: energy released on gaining an electron</div>`,
  })

  // ---------- ion sizes ----------
  const dot = (x, y, r, g, label) => `${ball(x, y, r, g)}<text x="${x}" y="${y + 10}" text-anchor="middle" font-size="${Math.min(34, Math.round(r * 0.6))}" font-weight="900" style="fill:#10131c">${label}</text>`
  const ISO = [['O²⁻', 'red', 78], ['F⁻', 'warm', 66], ['Na⁺', 'teal', 56], ['Mg²⁺', 'pur', 48]]
  EZ.scene('ions', {
    html: `<div class="kicker" data-at="in" data-fx="left">Ion sizes</div><h2 class="h1" data-at="0">Cations shrink, anions grow</h2>
      <div class="card" style="left:120px;top:300px;width:820px;height:290px" data-at="1" data-fx="right"><h3>Cations are smaller</h3>
        <svg style="position:absolute;left:0;top:0" width="820" height="290" viewBox="0 0 820 290">
          <g data-at="1@0.4" data-fx="pop">${dot(250, 170, 76, 'gray', 'Na')}</g>
          <g data-at="2" data-fx="fade"><path d="M345 170H455" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></g>
          <g data-at="2@0.3" data-fx="pop">${dot(570, 170, 46, 'warm', 'Na⁺')}</g></svg></div>
      <div class="card" style="left:980px;top:300px;width:820px;height:290px" data-at="3" data-fx="left"><h3>Anions are larger</h3>
        <svg style="position:absolute;left:0;top:0" width="820" height="290" viewBox="0 0 820 290">
          <g data-at="3@0.4" data-fx="pop">${dot(250, 170, 52, 'gray', 'Cl')}</g>
          <g data-at="4" data-fx="fade"><path d="M345 170H455" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></g>
          <g data-at="4@0.3" data-fx="pop">${dot(580, 170, 80, 'teal', 'Cl⁻')}</g></svg></div>
      <div class="card" style="left:120px;top:620px;width:1680px;height:330px" data-at="5" data-fx="up"><h3>Isoelectronic: same number of electrons</h3>
        <svg style="position:absolute;left:0;top:0" width="1680" height="330" viewBox="0 0 1680 330">
          ${ISO.map(([l, g, r], i) => `<g data-at="6@${(i * 0.2).toFixed(2)}" data-fx="pop">${dot(240 + i * 400, 190, r, g, l)}</g>${i < 3 ? `<text x="${440 + i * 400}" y="206" text-anchor="middle" font-size="56" font-weight="900" style="fill:#a3abbd" data-at="6@${(i * 0.2 + 0.1).toFixed(2)}" data-fx="fade">&gt;</text>` : ''}`).join('')}</svg>
        <div class="ft" style="bottom:14px;font-size:33px;color:var(--muted)" data-at="5@0.3" data-fx="fade">more protons = <span class="teal">smaller</span></div></div>`,
  })

  // ---------- trick: successive ionization energies ----------
  const BB = 470
  const BARS = [['IE₁', 738, 36], ['IE₂', 1451, 71], ['IE₃', 7733, 380]]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Successive ionization energies reveal the group</h2>
      <div class="card" style="left:120px;top:320px;width:900px;height:580px" data-at="0@0.4">
        <svg style="position:absolute;left:0;top:0" width="900" height="580" viewBox="0 0 900 580">
          <path d="M60 ${BB}H860" stroke="#a3abbd" stroke-width="4"/>
          <g class="bars"></g>
          ${BARS.map(([n], i) => `<text x="${180 + i * 250}" y="${BB + 48}" text-anchor="middle" font-size="36" font-weight="900" style="fill:#a3abbd" data-at="${i === 2 ? 2 : 1}${i === 1 ? '@0.4' : ''}" data-fx="fade">${n}</text>`).join('')}
          ${BARS.map(([, v, h], i) => `<text x="${180 + i * 250}" y="${BB - h - 18}" text-anchor="middle" font-size="36" font-weight="900" style="fill:${i === 2 ? WARM : '#eef0f7'}" data-at="4@${(i * 0.22).toFixed(2)}" data-fx="fade">${v.toLocaleString('en-US')}</text>`).join('')}
          <text x="60" y="64" text-anchor="start" font-size="30" font-weight="800" style="fill:#a3abbd" data-at="4" data-fx="fade">kJ/mol</text>
        </svg></div>
      <div class="zn" style="top:320px" data-at="2" data-fx="right"><b class="warm">Core electron: huge jump</b><span>the energy climbs gradually, then leaps</span></div>
      <div class="zn" style="top:520px" data-at="3" data-fx="right"><b class="teal">Electrons removed before the jump</b><span>= number of valence electrons</span></div>
      <div class="zn" style="top:735px;padding-top:16px;padding-bottom:18px" data-at="5" data-fx="pop"><b class="pri">Jump after 2: Group 2</b><span>this is magnesium</span></div>`,
    update(c) {
      const t1 = c.at('1'), t2 = c.at('2')
      const ps = [c.seg(t1, t1 + 0.6), c.seg(t1 + 0.7, t1 + 1.3), c.seg(t2, t2 + 0.8)]
      const hi = c.p('3', 0.6)
      c.$('.bars').innerHTML = BARS.map(([, , h], i) => {
        const p = eo(ps[i]), hh = h * p
        const col = i < 2 ? (hi ? 'teal' : 'pur') : 'warm'
        return `<rect x="${95 + i * 250}" y="${BB - hh}" width="170" height="${hh}" rx="10" fill="${{ pur: PUR, teal: TEAL, warm: WARM }[col]}" opacity="${i < 2 && hi ? 1 : 0.92}"/>`
      }).join('')
    },
  })

  // ---------- trap: the full octet ----------
  const pillar = (col, t, s) => `${tick.replace('width="110" height="110"', 'width="80" height="80"')}<p><span class="${col}">${t}</span></p><p style="font-size:30px;margin-top:6px;color:var(--muted)">${s}</p>`
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="0">A trap on free response</h2>
      <div class="cx" style="top:310px;border-color:rgba(240,112,122,.7);display:flex;align-items:center;gap:36px;padding-top:20px;padding-bottom:20px" data-at="1" data-fx="up"><span style="display:inline-block;width:80px;height:80px">${cross(BAD).replace('width="110" height="110"', 'width="80" height="80"')}</span><span>“Atoms want a <span class="bad">full octet</span>”</span></div>
      <div class="ln" style="top:450px;font-size:40px;color:var(--muted)" data-at="2" data-fx="fade">not accepted as a reason on AP® free response</div>
      <div class="ln" style="top:540px;font-size:38px" data-at="3" data-fx="fade"><span class="good">Always use</span></div>
      <div class="card" style="left:120px;top:610px;width:540px;height:260px;text-align:center;padding-top:32px" data-at="3@0.2" data-fx="up"><b class="warm" style="font-size:48px;line-height:1.2">Protons</b><br><span style="font-size:36px;font-weight:800;color:var(--muted)">nuclear charge</span></div>
      <div class="card" style="left:690px;top:610px;width:540px;height:260px;text-align:center;padding-top:32px" data-at="3@0.4" data-fx="up"><b class="teal" style="font-size:48px;line-height:1.2">Distance</b><br><span style="font-size:36px;font-weight:800;color:var(--muted)">shells</span></div>
      <div class="card" style="left:1260px;top:610px;width:540px;height:260px;text-align:center;padding-top:32px" data-at="3@0.6" data-fx="up"><b class="pri" style="font-size:48px;line-height:1.2">Shielding</b><br><span style="font-size:36px;font-weight:800;color:var(--muted)">core electrons</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'O²⁻', '1@0.3'], ['B', 'F⁻', '1@0.5'], ['C', 'Na⁺', '1@0.66'], ['D', 'Mg²⁺', '1@0.86']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which has the <span class="teal">largest radius</span>?</h2>
      <div class="ln" style="top:260px;font-size:32px;color:var(--muted)" data-at="1@0.2" data-fx="fade">All have 10 electrons</div>
      ${OPTS.map(([l, s, at], i) => `<div class="opt t${i}" style="top:${310 + i * 108}px" data-at="${at}" data-fx="left"><div class="l">${l}</div>${s}
        ${i === 0 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="862" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="862" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 862)"/>
        <text class="num" x="960" y="886" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="982" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:775px;font-size:46px" data-at="4" data-fx="pop">Same electrons ${ARR} compare <span class="warm">protons</span></div>
      <div class="ln" style="top:912px;font-size:42px" data-at="5" data-fx="fade"><span class="teal">O²⁻</span> has the fewest (8) ${ARR} weakest pull ${ARR} <span class="teal">largest</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 0) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- FRQ tip: the Coulomb sentence ----------
  EZ.scene('frq', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Free response tip</div><h2 class="h1" data-at="0">The Coulomb sentence</h2>
      <div class="pil" style="left:120px;color:var(--warm)" data-at="1" data-fx="pop">Name the particles</div>
      <div class="pil" style="left:700px;color:var(--teal)" data-at="1@0.3" data-fx="pop">the cause</div>
      <div class="pil" style="left:1030px;color:var(--pri)" data-at="1@0.6" data-fx="pop">and the effect</div>
      <div class="cx" style="top:420px;font-size:40px;border-color:rgba(240,112,122,.7);padding:18px 40px 20px" data-at="2" data-fx="up"><span class="bad">✗</span> &nbsp;“Mg has a higher IE because it’s farther right.”</div>
      <div class="cx" style="top:545px;font-size:41px;border-color:rgba(76,199,129,.7);line-height:1.5;padding:16px 40px 18px" data-at="3" data-fx="up"><span class="good">✓</span> &nbsp;Mg has <span class="warm">more protons</span> (12 vs. 11) than Na,
        <div data-at="3@0.5" data-fx="fade" style="padding-left:60px">valence electrons in the <span class="teal">same shell</span> (n = 3), similar shielding,</div>
        <div data-at="4" data-fx="fade" style="padding-left:60px"><span class="pri">greater Coulombic attraction</span>, so more energy to remove one</div></div>
      <div class="banner" style="top:880px;font-size:44px" data-at="5" data-fx="pop">Trends are <span class="warm">where</span>. Coulomb’s law is <span class="teal">why</span>.</div>`,
  })

  // ---------- recap ----------
  const mAcross = `<svg width="460" height="210" viewBox="0 0 460 210">${nucleus(150, 105, 48)}${electron(340, 105, 18)}<line x1="312" y1="105" x2="215" y2="105" stroke="#f3a764" stroke-width="12" marker-end="url(#mk-warm)"/></svg>`
  const mDown = `<svg width="460" height="210" viewBox="0 0 460 210">${nucleus(110, 105, 32)}<circle cx="110" cy="105" r="62" fill="none" stroke="#8d8df0" stroke-width="3" stroke-dasharray="8 8"/>${electron(400, 105, 18)}<line x1="372" y1="105" x2="320" y2="105" stroke="#f3a764" stroke-width="4" marker-end="url(#mk-warm)"/></svg>`
  const mJump = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M60 180H400" stroke="#a3abbd" stroke-width="4"/><rect x="90" y="156" width="70" height="24" rx="6" fill="${PUR}"/><rect x="195" y="140" width="70" height="40" rx="6" fill="${PUR}"/><rect x="300" y="30" width="70" height="150" rx="6" fill="${WARM}"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${mAcross}<p><span class="teal">Across</span>: more protons,<br>same shell, stronger pull<br>smaller radius,<br>higher IE and EN</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${mDown}<p><span class="warm">Down</span>: more shells,<br>more shielding, weaker pull<br>bigger radius,<br>lower IE and EN</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${mJump}<p>A big jump in successive IEs<br>means you have reached<br>the <span class="pri">core electrons</span></p></div>`,
  })
})()
