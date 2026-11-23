// Pictures for chem-9.7 "Coupled Reactions". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, book.ts): protein building is uphill, paired
// with ATP breakdown (downhill), like a counterweight elevator; external energy (electricity: electrolytic cells,
// recharging batteries; light: photosynthesis, CO2 + H2O -> glucose, large positive dG on its own; energy supplied
// >= the positive dG); coupling (dG > 0 + dG << 0, common intermediate, dG values add like Hess's law, sum < 0 ->
// favored; in cells a phosphorylated species formed from ATP); +14 + (-30.5) = -16.5 kJ; +22 + (-30.5) = -8.5 kJ;
// linked, not side by side; the +40 / -25 try. The example's arrows are drawn to scale (8 px per kJ).
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:40px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-lab small{display:block;font-size:30px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-eq{position:absolute;left:120px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-tile{position:absolute;width:800px;height:130px;border-radius:28px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:36px;font-weight:900;line-height:1.2}
    .x-tile .l{flex:none;margin:0 24px 0 24px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;line-height:52px;text-align:center;color:var(--muted)}
    .x-tile .tx{padding-right:96px}
    .x-tile .ok{position:absolute;right:18px;top:33px;width:60px;height:60px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', TXT = '#eef0f7', BAD = '#f0707a', GOOD = '#4cc781'
  const mv = (c, sel, x, y, o) => { const el = c.$(sel); el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); if (o != null) el.style.opacity = o }
  const frac = (x) => x - Math.floor(x)
  const arrow = (x1, y1, x2, y2, col = 'warm', w = 5, cls = '') => `<line ${cls ? `class="${cls}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${{ warm: WARM, teal: TEAL, gold: GOLD, bad: BAD, pri: '#8d8df0' }[col]}" stroke-width="${w}" marker-end="url(#mk-${col})"/>`
  const grow = (c, sel, y1, y2, p) => { const el = c.$(sel); el.setAttribute('y2', lerp(y1, y1 + (y2 - y1) * 0.02, 0) + (y2 - y1) * Math.max(0.02, p)) }
  const bolt = (x, y, s = 1) => `<path d="M${x + 20 * s} ${y}L${x - 25 * s} ${y + 90 * s}H${x + 10 * s}L${x - 5 * s} ${y + 160 * s}L${x + 60 * s} ${y + 60 * s}H${x + 22 * s}L${x + 40 * s} ${y}Z" fill="${GOLD}" stroke="${WARM}" stroke-width="3" stroke-linejoin="round"/>`
  const sun = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${GOLD}"/>` + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${(x + Math.cos(a) * r * 1.3).toFixed(1)}" y1="${(y + Math.sin(a) * r * 1.3).toFixed(1)}" x2="${(x + Math.cos(a) * r * 1.65).toFixed(1)}" y2="${(y + Math.sin(a) * r * 1.65).toFixed(1)}" stroke="${GOLD}" stroke-width="${Math.max(3, r / 9).toFixed(1)}" stroke-linecap="round"/>` }).join('')
  // a ramp: up = rises left to right, down = falls left to right. x0 = left edge, yb = bottom, w, h
  const ramp = (x0, yb, w, h, up, col = 'rgba(141,141,240,.22)') => `<path d="M${x0} ${yb}L${x0 + w} ${up ? yb - h : yb}L${up ? x0 + w : x0} ${up ? yb : yb - h}Z" fill="${col}" stroke="#c9cee0" stroke-width="4" stroke-linejoin="round"/>`
  const onRamp = (x0, yb, w, h, up, p, r = 20) => { const x = lerp(x0 + 0.12 * w, x0 + 0.88 * w, p); const f = (x - x0) / w; const y = up ? yb - h * f : yb - h * (1 - f); return [x, y - r - 2] }

  // ---------- intro: faint uphill and downhill ramps low at the sides ----------
  EZ.intro = {
    chips: [['1@0.25', 'Energy from outside'], ['1@0.55', 'Adding ΔG'], ['1@0.85', 'The common link']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.3">
      ${ramp(110, 940, 260, 90, true)}${ball(170, 915, 16, 'warm')}
      ${ramp(1550, 940, 260, 90, false, 'rgba(60,199,188,.25)')}${ball(1770, 915, 16, 'teal')}</svg>`,
  }

  // ---------- hook: the counterweight elevator ----------
  // pulley (960,380) r100: ropes at x 860 (car) and 1060 (weight). car 200x140, weight 120x160; travel 200 px.
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Uphill, with help</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <line x1="600" y1="840" x2="1320" y2="840" stroke="#6a7194" stroke-width="6" stroke-linecap="round"/>
        <g data-at="4@0.1" data-fx="fade"><line class="x-r1" x1="860" y1="380" x2="860" y2="690" stroke="#c9cee0" stroke-width="5"/>
          <line class="x-r2" x1="1060" y1="380" x2="1060" y2="470" stroke="#c9cee0" stroke-width="5"/>
          <circle cx="960" cy="380" r="100" fill="#1a1d2a" stroke="${TXT}" stroke-width="8"/><circle cx="960" cy="380" r="16" fill="${TXT}"/></g>
        <g data-at="0@0.1" data-fx="fade"><g class="x-car"><rect x="-100" y="0" width="200" height="140" rx="16" fill="rgba(141,141,240,.3)" stroke="#8d8df0" stroke-width="5"/>
          <text x="0" y="82" text-anchor="middle" font-size="32" font-weight="900" class="f-pri">protein</text></g></g>
        <g data-at="4@0.3" data-fx="fade"><g class="x-wt"><rect x="-60" y="0" width="120" height="160" rx="12" fill="rgba(60,199,188,.45)" stroke="${TEAL}" stroke-width="5"/>
          <text x="0" y="92" text-anchor="middle" font-size="32" font-weight="900">ATP</text></g></g>
        <g data-at="2@0.1" data-out="3" data-fx="pop"><text x="860" y="640" text-anchor="middle" font-size="90" font-weight="900" class="f-gold">?</text></g>
        <g data-at="5@0.2" data-fx="fade">${arrow(700, 780, 700, 560, 'pri', 6)}${arrow(1220, 520, 1220, 760, 'teal', 6)}</g>
      </svg>
      <div class="x-lab" style="left:120px;width:540px;top:640px" data-at="0@0.2">Building proteins<small data-at="1@0.1">uphill · <span class="bad">unfavored</span></small></div>
      <div class="x-lab" style="left:1280px;width:560px;top:640px" data-at="3@0.4">Breaking down ATP<small>strongly <span class="teal">downhill</span></small></div>
      <div class="banner" style="top:880px" data-at="6" data-fx="pop">Chemistry's version: <span class="gold">coupling</span></div>`,
    update(c) {
      const b = c.b, d = 200 * eio(c.seg(b[5].start + 0.3, b[5].start + 2.6))
      mv(c, '.x-car', 860, 690 - d); mv(c, '.x-wt', 1060, 470 + d)
      c.$('.x-r1').setAttribute('y2', (690 - d).toFixed(1)); c.$('.x-r2').setAttribute('y2', (470 + d).toFixed(1))
    },
  })

  // ---------- way 1: energy from outside ----------
  EZ.scene('external', {
    html: `<div class="kicker" data-at="in" data-fx="left">Way 1</div><h2 class="h1" data-at="in+0.2">Energy from outside</h2>
      <div class="x-line" style="top:420px" data-at="0@0.2" data-out="2">two ways to drive an <span class="bad">unfavored</span> reaction</div>
      <div class="x-line muted" style="top:500px;font-size:38px" data-at="1@0.2" data-out="2">first: an external energy source</div>
      <div class="card" style="left:120px;top:300px;width:810px;height:520px" data-at="2"><h3 class="gold">Electricity</h3>
        <div class="x-row" style="top:310px" data-at="2@0.35">drives electrolytic cells</div>
        <div class="x-row" style="top:380px" data-at="2@0.7">recharges batteries</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:520px" data-at="3"><h3 class="warm">Light</h3>
        <div class="x-row" style="top:310px" data-at="3@0.4">drives photosynthesis</div>
        <div class="x-row" style="top:380px" data-at="4@0.3">CO<sub>2</sub> + H<sub>2</sub>O ${ARR} glucose</div>
        <div class="x-row" style="top:440px;font-size:34px" data-at="5@0.2">on its own: <span class="bad">large positive ΔG°</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.2" data-fx="fade">${bolt(420, 420, 1)}
          <rect x="580" y="450" width="220" height="110" rx="14" fill="none" stroke="${TXT}" stroke-width="6"/><rect x="800" y="482" width="16" height="46" rx="4" fill="${TXT}"/>
          <rect class="x-bat" x="592" y="462" width="40" height="86" rx="6" fill="${TEAL}"/></g>
        <g data-at="3@0.2" data-fx="fade">${sun(1180, 505, 46)}
          <path d="M1540 560Q1550 440 1700 440Q1700 560 1540 560Z" fill="${GOOD}"/><path d="M1545 555L1690 446" stroke="#2c7d50" stroke-width="4"/>
          <line x1="1540" y1="560" x2="1520" y2="590" stroke="#2c7d50" stroke-width="6" stroke-linecap="round"/></g>
        <g data-at="3@0.6" data-fx="fade">${[0, 1, 2].map((i) => `<g class="x-ph${i}">${ball(0, 0, 9, 'warm')}</g>`).join('')}</g>
      </svg>
      <div class="banner" style="top:860px" data-at="6" data-fx="pop">Energy supplied <span class="gold">≥</span> the positive ΔG</div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[2].start + 2.0, b[2].start + 4.5))
      c.$('.x-bat').setAttribute('width', (40 + 156 * p).toFixed(1))
      const t0 = b[3].start + 0.6
      for (let i = 0; i < 3; i++) { const k = frac(Math.max(0, c.t - t0) / 1.8 + i / 3); mv(c, '.x-ph' + i, lerp(1260, 1530, k), 505, Math.min(1, 6 * k, 6 * (1 - k))) }
    },
  })

  // ---------- way 2: coupling ----------
  EZ.scene('coupling', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Way 2</div><h2 class="h1" data-at="in+0.2">Coupling</h2>
      <div class="card" style="left:120px;top:300px;width:740px;height:200px" data-at="1"><h3 class="bad">Unfavored</h3><div class="x-row" style="top:110px">ΔG <span class="bad">&gt; 0</span></div></div>
      <div class="card" style="left:120px;top:560px;width:740px;height:200px" data-at="2"><h3 class="teal">Strongly favored</h3><div class="x-row" style="top:110px">ΔG <span class="teal">≪ 0</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.2" data-fx="fade"><line x1="860" y1="450" x2="960" y2="530" stroke="${GOLD}" stroke-width="5"/><line x1="860" y1="580" x2="960" y2="530" stroke="${GOLD}" stroke-width="5"/>
          ${ball(960, 530, 26, 'gold')}</g>
        <g data-at="3@0.45" data-fx="fade"><text x="960" y="650" text-anchor="middle" font-size="28" font-weight="900" class="f-gold">common</text><text x="960" y="684" text-anchor="middle" font-size="28" font-weight="900" class="f-gold">intermediate</text></g>
        <g data-at="1@0.4" data-fx="fade"><line x1="1100" y1="560" x2="1800" y2="560" stroke="#6a7194" stroke-width="4" stroke-dasharray="14 10"/>
          ${arrow(1180, 560, 1180, 400, 'bad', 7, 'x-a1')}</g>
        <g data-at="1@0.7" data-fx="fade"><text x="1180" y="372" text-anchor="middle" font-size="32" font-weight="900" class="f-bad">ΔG &gt; 0</text></g>
        <g data-at="2@0.4" data-fx="fade"><line x1="1180" y1="400" x2="1380" y2="400" stroke="#6a7194" stroke-width="3" stroke-dasharray="8 8"/>${arrow(1380, 400, 1380, 760, 'teal', 7, 'x-a2')}</g>
        <g data-at="2@0.7" data-fx="fade"><text x="1400" y="620" font-size="32" font-weight="900" class="f-teal">ΔG ≪ 0</text></g>
        <g data-at="4@0.2" data-fx="fade"><text x="1460" y="340" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">free energies add</text>
          <text x="1460" y="380" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">like Hess's law</text></g>
        <g data-at="5@0.2" data-fx="fade"><line x1="1380" y1="760" x2="1660" y2="760" stroke="#6a7194" stroke-width="3" stroke-dasharray="8 8"/>${arrow(1660, 560, 1660, 760, 'gold', 8, 'x-a3')}</g>
        <g data-at="5@0.6" data-fx="fade"><text x="1680" y="650" font-size="32" font-weight="900" class="f-gold">sum</text></g>
        <g data-at="6@0.3" data-fx="pop"><text x="1680" y="694" font-size="30" font-weight="900" class="f-good">&lt; 0 ✓</text><text x="1680" y="728" font-size="26" font-weight="800" class="f-good">favored</text></g>
      </svg>
      <div class="banner" style="top:860px" data-at="7" data-fx="pop">In cells: often a <span class="gold">phosphorylated species</span> formed from ATP</div>`,
    update(c) {
      const b = c.b
      grow(c, '.x-a1', 560, 400, eio(c.seg(b[1].start + 0.4, b[1].start + 1.2)))
      grow(c, '.x-a2', 400, 760, eio(c.seg(b[2].start + 0.4, b[2].start + 1.4)))
      grow(c, '.x-a3', 560, 760, eio(c.seg(b[5].start + 0.2, b[5].start + 1.1)))
    },
  })

  // ---------- worked example: arrows to scale, 8 px per kJ ----------
  // baseline 600; +14 -> 488; -30.5 -> 732; net -16.5 -> 732
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">ATP coupling</h2>
      <div class="x-eq" style="top:320px" data-at="1@0.1">Reaction A: ΔG° = <span class="bad">+14 kJ</span></div>
      <div class="x-eq" style="top:400px" data-at="2@0.1">ATP ${ARR} ADP: ΔG° = <span class="teal">−30.5 kJ</span></div>
      <div class="x-eq muted" style="top:480px;font-size:34px" data-at="3@0.1">coupled through a shared intermediate</div>
      <div class="x-eq" style="top:580px;font-size:52px" data-at="4@0.3">+14 + (−30.5) = <span class="gold">−16.5 kJ</span></div>
      <div class="x-eq muted" style="top:700px;font-size:34px" data-at="6@0.2">Reaction X: +22 + (−30.5) = <span class="good" data-at="7@0.3">−8.5 kJ, favored</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade"><line x1="1100" y1="600" x2="1800" y2="600" stroke="#6a7194" stroke-width="4" stroke-dasharray="14 10"/>${arrow(1200, 600, 1200, 488, 'bad', 8, 'x-e1')}</g>
        <g data-at="1@0.6" data-fx="fade"><text x="1200" y="460" text-anchor="middle" font-size="34" font-weight="900" class="f-bad">+14</text></g>
        <g data-at="2@0.4" data-fx="fade"><line x1="1200" y1="488" x2="1400" y2="488" stroke="#6a7194" stroke-width="3" stroke-dasharray="8 8"/>${arrow(1400, 488, 1400, 732, 'teal', 8, 'x-e2')}</g>
        <g data-at="2@0.7" data-fx="fade"><text x="1424" y="630" font-size="34" font-weight="900" class="f-teal">−30.5</text></g>
        <g data-at="4@0.5" data-fx="fade"><line x1="1400" y1="732" x2="1650" y2="732" stroke="#6a7194" stroke-width="3" stroke-dasharray="8 8"/>${arrow(1650, 600, 1650, 732, 'gold', 9, 'x-e3')}</g>
        <g data-at="4@0.8" data-fx="fade"><text x="1674" y="676" font-size="34" font-weight="900" class="f-gold">−16.5</text></g>
        <text x="1450" y="800" text-anchor="middle" font-size="26" font-weight="800" class="f-muted" data-at="1@0.6">ΔG° in kJ, to scale</text>
      </svg>
      <div class="banner" style="top:860px" data-at="5" data-fx="pop">ΔG° overall <span class="good">&lt; 0</span> ${ARR} <span class="good">favored</span></div>`,
    update(c) {
      const b = c.b
      grow(c, '.x-e1', 600, 488, eio(c.seg(b[1].start + 0.3, b[1].start + 1.1)))
      grow(c, '.x-e2', 488, 732, eio(c.seg(b[2].start + 0.4, b[2].start + 1.5)))
      grow(c, '.x-e3', 600, 732, eio(c.seg(b[4].start + 0.5 * (b[4].end - b[4].start), b[4].start + 0.5 * (b[4].end - b[4].start) + 1.0)))
    },
  })

  // ---------- the trap: linked, not side by side ----------
  // left card: uphill ramp x 160..430, downhill ramp x 610..880, gold intermediate tied to both balls
  // right card: one container, the same two ramps, no link
  const RW = 270, RH = 160, RB = 680
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="in+0.2">They must be linked</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:520px" data-at="1"><h3 class="teal">Linked</h3></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:520px" data-at="2"><h3 class="warm">Side by side</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.15" data-fx="fade">${ramp(160, RB, RW, RH, true)}${ramp(610, RB, RW, RH, false, 'rgba(60,199,188,.22)')}
          <line class="x-l1" x1="520" y1="430" x2="520" y2="430" stroke="${GOLD}" stroke-width="4"/><line class="x-l2" x1="520" y1="430" x2="520" y2="430" stroke="${GOLD}" stroke-width="4"/>
          ${ball(520, 430, 22, 'gold')}<g class="x-p1">${ball(0, 0, 20, 'pur')}</g><g class="x-p2">${ball(0, 0, 20, 'teal')}</g>
          <text x="295" y="716" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">unfavored</text><text x="745" y="716" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">favored</text></g>
        <g data-at="1@0.5" data-fx="fade"><text x="525" y="780" text-anchor="middle" font-size="32" font-weight="900" class="f-teal">✓ a common species links them</text></g>
        <g data-at="2@0.15" data-fx="fade"><path d="M1030 420V700Q1030 730 1060 730H1730Q1760 730 1760 700V420" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/>
          ${ramp(1050, RB, RW, RH, true)}${ramp(1470, RB, RW, RH, false, 'rgba(60,199,188,.22)')}
          <g class="x-q1">${ball(0, 0, 20, 'pur')}</g><g class="x-q2">${ball(0, 0, 20, 'teal')}</g></g>
        <g data-at="2@0.6" data-fx="fade"><text x="1395" y="780" text-anchor="middle" font-size="32" font-weight="900" class="f-bad">✗ no link: no help</text></g>
        <g data-at="3@0.3" data-fx="pop"><text x="1185" y="470" text-anchor="middle" font-size="28" font-weight="900" class="f-bad">not driven</text></g>
      </svg>
      <div class="banner" style="top:860px" data-at="4" data-fx="pop">Always check: overall ΔG <span class="good">&lt; 0</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[1].start + 0.9, b[1].start + 3.0)), q = eio(c.seg(b[2].start + 0.9, b[2].start + 2.6))
      const a1 = onRamp(160, RB, RW, RH, true, p), a2 = onRamp(610, RB, RW, RH, false, p)
      mv(c, '.x-p1', a1[0], a1[1]); mv(c, '.x-p2', a2[0], a2[1])
      c.$('.x-l1').setAttribute('x2', a1[0].toFixed(1)); c.$('.x-l1').setAttribute('y2', a1[1].toFixed(1))
      c.$('.x-l2').setAttribute('x2', a2[0].toFixed(1)); c.$('.x-l2').setAttribute('y2', a2[1].toFixed(1))
      const s1 = onRamp(1050, RB, RW, RH, true, 0), s2 = onRamp(1470, RB, RW, RH, false, q)
      mv(c, '.x-q1', s1[0], s1[1]); mv(c, '.x-q2', s2[0], s2[1])
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'favored (ΔG° = −15 kJ)'], ['B', 'not favored (ΔG° = +15 kJ)'], ['C', 'favored (ΔG° = −65 kJ)'], ['D', 'at equilibrium']]
  const OPT_AT = ['2@0.02', '2@0.3', '2@0.55', '2@0.85']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Couple <span class="bad">+40 kJ</span> with <span class="teal">−25 kJ</span></h2>
      <div class="x-line muted" style="top:276px;font-size:34px" data-at="1@0.6">the overall process is…</div>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${140 + (i % 2) * 840}px;top:${350 + Math.floor(i / 2) * 160}px" data-at="${OPT_AT[i]}" data-fx="pop"><div class="l">${l}</div><span class="tx">${f}</span>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px" data-at="5" data-fx="pop">+40 + (−25) = <span class="bad">+15 kJ</span></div>
      <div class="x-line" style="top:820px;font-size:40px" data-at="6">still positive ${ARR} <span class="bad">not favored</span></div>
      <div class="x-line" style="top:890px;font-size:38px" data-at="7">the driver needs ΔG° more negative than <span class="teal">−40 kJ</span></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.3, b[4].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 1) {
          el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''
          el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`
          c.$('.ok').style.opacity = win
          c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})`
        } else el.style.filter = `brightness(${1 - 0.4 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${bolt(140, 10, 0.8)}${sun(320, 75, 36)}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><line x1="40" y1="60" x2="420" y2="60" stroke="#6a7194" stroke-width="3" stroke-dasharray="10 8"/>
    ${arrow(110, 60, 110, 16, 'bad', 6)}${arrow(220, 16, 220, 138, 'teal', 6)}${arrow(340, 60, 340, 138, 'gold', 7)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="30" y="50" width="140" height="80" rx="14" fill="rgba(240,112,122,.2)" stroke="${BAD}" stroke-width="4"/>
    <rect x="290" y="50" width="140" height="80" rx="14" fill="rgba(60,199,188,.2)" stroke="${TEAL}" stroke-width="4"/>
    <line x1="170" y1="90" x2="290" y2="90" stroke="${GOLD}" stroke-width="5"/>${ball(230, 90, 22, 'gold')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>External energy:<br><span class="gold">electricity</span>, <span class="warm">light</span><br>can drive<br>unfavored processes</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Coupling:<br>add the ΔG values<br>overall ΔG <span class="good">&lt; 0</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>A <span class="gold">common<br>intermediate</span><br>in cells: often a<br>phosphorylated<br>species from ATP</p></div>`,
  })
})()
