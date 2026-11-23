// Pictures for chem-6.6 "Enthalpy of Reaction". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u6.ts and book.ts): methane −890 kJ,
// the 4.00 g worked example, the +50 kJ/mol and ammonia quick checks, and the hydrogen try question.
// Energy levels and thermometers show direction only, never a value the lesson does not give.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-weight:900;white-space:nowrap;line-height:1.1}
    .x-heat{display:inline-block;margin-left:14px}
    .x-chip{position:absolute;height:90px;padding:0 34px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:40px;font-weight:800;line-height:86px;white-space:nowrap}
    .x-big{position:absolute;padding:20px 30px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-big b{display:block;font-size:40px;font-weight:900;line-height:1.2;white-space:nowrap} .x-big span{display:block;margin-top:6px;font-size:30px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1680px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-row .T{position:absolute;left:36px;top:12px;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .x-row .E{position:absolute;left:36px;top:50px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-row .H{position:absolute;right:40px;top:36px;font-size:50px;font-weight:900;white-space:nowrap;text-align:right}
    .x-step{position:absolute;left:820px;width:980px;padding:18px 32px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-step .H{font-size:34px;font-weight:900;color:var(--muted)} .x-step .H i{display:inline-block;width:46px;height:46px;margin-right:14px;border-radius:50%;background:var(--brand);color:#fff;font-style:normal;text-align:center;line-height:46px;font-size:28px}
    .x-step .B{margin-top:8px;font-size:40px;font-weight:900;line-height:1.3;white-space:nowrap}
    .x-lab{font-size:32px;font-weight:900}
    .x-ln{position:absolute;left:40px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-gv{position:absolute;top:310px;height:190px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-gv .N{margin-top:26px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
    .x-gv .V{margin-top:16px;font-size:54px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:330px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900}
    .x-ans .W{position:absolute;left:60px;top:170px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-ans .K{position:absolute;left:60px;top:240px;font-size:40px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', RED = '#f0707a', GOLD = '#f2c443'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const SUB = (b, s) => `${b}<sub>${s}</sub>`
  const CH4 = SUB('CH', 4), O2 = SUB('O', 2), CO2 = SUB('CO', 2), H2O = SUB('H', 2) + 'O', H2 = SUB('H', 2), N2 = SUB('N', 2), NH3 = SUB('NH', 3)

  // schematic molecules (no sizes claimed): s scales the whole molecule
  const methane = (x, y, s = 1) => `<g>${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => ball(x + a * 38 * s, y + b * 38 * s, 22 * s, 'teal', 'H')).join('')}${ball(x, y, 38 * s, 'gray', 'C')}</g>`
  const o2 = (x, y, s = 1) => `<g>${ball(x - 22 * s, y, 30 * s, 'red', 'O')}${ball(x + 22 * s, y, 30 * s, 'red', 'O')}</g>`
  const co2 = (x, y, s = 1) => `<g>${ball(x - 50 * s, y, 30 * s, 'red', 'O')}${ball(x + 50 * s, y, 30 * s, 'red', 'O')}${ball(x, y, 32 * s, 'gray', 'C')}</g>`
  const h2o = (x, y, s = 1) => `<g>${ball(x - 32 * s, y + 24 * s, 20 * s, 'teal', 'H')}${ball(x + 32 * s, y + 24 * s, 20 * s, 'teal', 'H')}${ball(x, y, 32 * s, 'red', 'O')}</g>`
  const nh3 = (x, y, s = 1) => `<g>${ball(x - 34 * s, y + 22 * s, 18 * s, 'teal', 'H')}${ball(x + 34 * s, y + 22 * s, 18 * s, 'teal', 'H')}${ball(x, y + 40 * s, 18 * s, 'teal', 'H')}${ball(x, y, 30 * s, 'pur', 'N')}</g>`

  // a thermometer: tube from y0 down h px, bulb below it; the liquid column has class `cls`
  const thermo = (x, y0, h, cls, col = RED) => `<rect x="${x - 18}" y="${y0}" width="36" height="${h}" rx="18" fill="rgba(255,255,255,.06)" stroke="#c9cee0" stroke-width="4"/>
    <rect class="${cls}" x="${x - 9}" y="${y0 + h - 30}" width="18" height="60" rx="9" fill="${col}"/>
    <circle cx="${x}" cy="${y0 + h + 22}" r="32" fill="${col}" stroke="#c9cee0" stroke-width="4"/>`
  const level = (c, sel, y0, h, f) => {
    const el = c.$(sel), top = y0 + 14 + (h - 28) * (1 - clamp(f))
    el.setAttribute('y', top); el.setAttribute('height', y0 + h + 20 - top)
  }
  // a gas flame centred at (x, y): outer and inner tongue
  const flame = (cls, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}">
    <path d="M0 -150 C 40 -90 80 -50 70 10 C 62 60 30 80 0 80 C -30 80 -62 60 -70 10 C -80 -50 -40 -90 0 -150 Z" fill="${WARM}" opacity=".9"/>
    <path d="M0 -80 C 22 -44 40 -20 36 14 C 32 44 16 56 0 56 C -16 56 -32 44 -36 14 C -40 -20 -22 -44 0 -80 Z" fill="${GOLD}"/></g></g>`
  const flicker = (c, sel, k = 1) => { c.$(sel).setAttribute('transform', `scale(${1 + 0.03 * Math.sin(c.t * 9 * k)} ${1 + 0.06 * Math.sin(c.t * 7 * k + 1)})`) }

  // ---------- intro artwork: a faint energy diagram (left) and a faint methane molecule (right) ----------
  EZ.intro = {
    chips: [['1@0.4', 'ΔH'], ['1@0.6', 'Per mole of reaction'], ['1@0.8', 'Scale with moles']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      <line x1="60" y1="420" x2="260" y2="420" stroke="#eef0f7" stroke-width="8"/><line x1="60" y1="760" x2="260" y2="760" stroke="#eef0f7" stroke-width="8"/>
      <line x1="160" y1="440" x2="160" y2="730" stroke="${WARM}" stroke-width="9" marker-end="url(#mk-warm)"/>
      ${methane(1780, 560, 1.5)}</svg>`,
  }

  // ---------- hook: burning methane heats a house ----------
  const house = `<path d="M1250 590 L1450 430 L1650 590" fill="none" stroke="#c9cee0" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
    <rect x="1290" y="580" width="320" height="250" fill="rgba(238,240,247,.08)" stroke="#c9cee0" stroke-width="6"/>
    <rect x="1330" y="630" width="90" height="80" fill="rgba(242,196,67,.35)" stroke="#c9cee0" stroke-width="4"/>
    <rect x="1490" y="700" width="80" height="130" fill="rgba(36,40,56,.9)" stroke="#c9cee0" stroke-width="4"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Heat from burning fuel</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="pop">${methane(300, 640, 1.3)}</g>
        <text x="300" y="790" text-anchor="middle" class="x-lab f-muted" data-at="0@0.3" data-fx="fade">methane</text>
        <g data-at="0@0.4" data-fx="fade"><line x1="410" y1="640" x2="540" y2="640" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)"/></g>
        <g data-at="0@0.5" data-fx="fade">${flame('x-hf', 700, 660)}<rect x="630" y="740" width="140" height="40" rx="10" fill="#646c82"/></g>
        <g class="x-hh"><line x1="830" y1="560" x2="1220" y2="600" stroke="${WARM}" stroke-width="7" stroke-dasharray="16 14" marker-end="url(#mk-warm)"/>
          <line x1="830" y1="660" x2="1220" y2="680" stroke="${WARM}" stroke-width="7" stroke-dasharray="16 14" marker-end="url(#mk-warm)"/>
          <line x1="830" y1="760" x2="1220" y2="760" stroke="${WARM}" stroke-width="7" stroke-dasharray="16 14" marker-end="url(#mk-warm)"/></g>
        <g data-at="2" data-fx="pop">${house}</g>
        <text x="1450" y="890" text-anchor="middle" class="x-lab f-muted" data-at="2@0.3" data-fx="fade">a house, for a winter</text>
      </svg>
      <div class="x-big" style="left:520px;top:300px;border-color:rgba(243,167,100,.8)" data-at="1" data-fx="pop"><b class="warm" style="font-size:64px">890 kJ</b><span>released per mole burned</span></div>
      <div class="banner" style="top:930px" data-at="3" data-fx="pop">What does it mean? <span class="teal">How do we use it?</span></div>`,
    update(c) {
      const b = c.b
      flicker(c, '.x-hf')
      const h = c.$('.x-hh')
      h.style.opacity = c.seg(b[2].start, b[2].start + 0.4)
      h.querySelectorAll('line').forEach((l) => l.setAttribute('stroke-dashoffset', -30 * clamp(c.t - b[2].start, 0, b[3].start - b[2].start + 1)))
    },
  })

  // ---------- meaning: ΔH per mole of reaction ----------
  EZ.scene('meaning', {
    html: `<div class="kicker" data-at="in" data-fx="left">Per mole of reaction</div><h2 class="h1" data-at="0">What ΔH means</h2>
      <div class="x-eq" style="top:290px;font-size:68px" data-at="1" data-fx="up">${CH4}(g) + 2${O2}(g) ${ARR} ${CO2}(g) + 2${H2O}(l)</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.15" data-fx="pop">${methane(380, 510)}</g>
        <text x="560" y="525" text-anchor="middle" font-size="60" font-weight="900" class="f-muted" data-at="1@0.2" data-fx="fade">+</text>
        <g data-at="1@0.3" data-fx="pop">${o2(720, 470, 0.85)}</g><g data-at="1@0.35" data-fx="pop">${o2(720, 560, 0.85)}</g>
        <g data-at="1@0.45" data-fx="fade"><line x1="850" y1="510" x2="1010" y2="510" stroke="#eef0f7" stroke-width="8" marker-end="url(#mk-text)"/></g>
        <g data-at="1@0.6" data-fx="pop">${co2(1160, 510)}</g>
        <text x="1330" y="525" text-anchor="middle" font-size="60" font-weight="900" class="f-muted" data-at="1@0.65" data-fx="fade">+</text>
        <g data-at="1@0.75" data-fx="pop">${h2o(1480, 470, 0.85)}</g><g data-at="1@0.8" data-fx="pop">${h2o(1620, 555, 0.85)}</g>
        <text x="380" y="640" text-anchor="middle" class="x-lab f-pri" data-at="3@0.2" data-fx="pop">1 mol</text>
        <text x="720" y="640" text-anchor="middle" class="x-lab f-pri" data-at="3@0.35" data-fx="pop">2 mol</text>
      </svg>
      <div class="x-big" style="left:120px;top:690px;width:800px;border-color:rgba(141,141,240,.7)" data-at="2" data-fx="pop"><b style="font-size:52px">ΔH = <span class="warm" style="display:inline;font-size:52px;color:var(--warm)">−890</span> kJ/mol<sub>rxn</sub></b></div>
      <div class="x-big" style="left:1000px;top:690px;width:800px;border-color:rgba(243,167,100,.7)" data-at="3@0.5" data-fx="pop"><b class="warm">890 kJ released</b><span>when 1 mol ${CH4} reacts with 2 mol ${O2}</span></div>
      <div class="banner" style="top:880px" data-at="4" data-out="5" data-fx="pop">ΔH applies to the reaction <span class="teal">as written</span></div>
      <div class="banner" style="top:880px" data-at="5" data-fx="pop">At constant pressure: <span class="gold">ΔH = heat of the reaction</span></div>`,
  })

  // ---------- the sign: exothermic and endothermic ----------
  const levels = (exo) => {
    const yr = exo ? 90 : 250, yp = exo ? 250 : 90, col = exo ? WARM : TEAL
    return `<line x1="60" y1="${yr}" x2="260" y2="${yr}" stroke="#eef0f7" stroke-width="8" stroke-linecap="round"/>
      <line x1="380" y1="${yp}" x2="580" y2="${yp}" stroke="#eef0f7" stroke-width="8" stroke-linecap="round"/>
      <text x="160" y="${yr - 20}" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">reactants</text>
      <text x="480" y="${yp - 20}" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">products</text>
      <line x1="320" y1="${yr + (exo ? 10 : -10)}" x2="320" y2="${yp + (exo ? -14 : 14)}" stroke="${col}" stroke-width="9" marker-end="url(#mk-${exo ? 'warm' : 'teal'})"/>`
  }
  EZ.scene('sign', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The sign</div><h2 class="h1" data-at="0">Released or absorbed?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:440px;border-color:rgba(243,167,100,.7)" data-at="1"><h3>ΔH <span class="warm">negative</span></h3>
        <div style="position:absolute;left:40px;top:96px;font-size:34px;font-weight:800" class="muted">heat <span class="warm">released</span> · exothermic</div>
        <svg style="position:absolute;left:40px;top:150px" width="740" height="280" viewBox="0 0 740 280">${levels(true)}
          <g class="x-out">${[0, 1, 2].map((i) => `<line x1="610" y1="${180 + i * 40}" x2="700" y2="${150 + i * 40}" stroke="${WARM}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-warm)"/>`).join('')}</g></svg></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:440px;border-color:rgba(60,199,188,.7)" data-at="2"><h3>ΔH <span class="teal">positive</span></h3>
        <div style="position:absolute;left:40px;top:96px;font-size:34px;font-weight:800" class="muted">heat <span class="teal">absorbed</span> · endothermic</div>
        <svg style="position:absolute;left:40px;top:150px" width="740" height="280" viewBox="0 0 740 280">${levels(false)}
          ${thermo(680, 10, 170, 'x-st')}
          <text x="680" y="270" text-anchor="middle" font-size="24" font-weight="800" class="f-muted" data-at="4" data-fx="fade">solution</text></svg></div>
      <div class="x-big" style="left:120px;top:790px;width:1680px;border-color:rgba(60,199,188,.7)" data-at="3" data-fx="up"><b>ΔH = <span class="teal" style="display:inline;font-size:40px;color:var(--accent)">+50 kJ/mol</span>
        <em data-at="4" data-fx="fade" style="font-style:normal;display:inline-block">&nbsp;${ARR} absorbs heat from the solution ${ARR} <span class="teal" style="display:inline;font-size:40px;color:var(--accent)">temperature falls</span></em></b></div>`,
    update(c) {
      const b = c.b, out = c.$('.x-out')
      out.style.opacity = c.seg(b[1].start + 0.3, b[1].start + 0.7)
      const drop = eio(c.seg(b[4].start + 0.2, b[4].start + 1.8))
      level(c, '.x-st', 10, 170, lerp(0.7, 0.25, drop))
    },
  })

  // ---------- the equation as written ----------
  const row = (top, at, T, E, H, col) => `<div class="x-row" style="top:${top}px;border-color:${col}" data-at="${at}" data-fx="right"><div class="T">${T}</div><div class="E">${E}</div><div class="H">${H}</div></div>`
  EZ.scene('written', {
    html: `<div class="kicker" data-at="in" data-fx="left">As written</div><h2 class="h1" data-at="0">Change the equation, change ΔH</h2>
      ${row(290, '0@0.5', 'as written', `${CH4} + 2${O2} ${ARR} ${CO2} + 2${H2O}(l)`, '<span class="warm">−890 kJ</span>', 'rgba(141,141,240,.7)')}
      ${row(450, '1', 'double every coefficient', `2${CH4} + 4${O2} ${ARR} 2${CO2} + 4${H2O}(l)`, '<span class="warm">ΔH doubles</span>', 'rgba(243,167,100,.7)')}
      ${row(610, '2', 'reverse it', `${CO2} + 2${H2O}(l) ${ARR} ${CH4} + 2${O2}`, '<span class="teal">+890 kJ</span>', 'rgba(60,199,188,.7)')}
      ${row(770, '3', 'change a state', `${CH4} + 2${O2} ${ARR} ${CO2} + 2${H2O}<span class="gold">(g)</span>`, '<span class="gold" data-at="4" data-fx="fade" style="display:inline-block">releases less</span>', 'rgba(242,196,67,.7)')}
      <div class="banner" style="top:920px;padding:16px 40px;font-size:40px" data-at="4@0.4" data-fx="pop">Some energy remains in the <span class="gold">vapor</span></div>`,
  })

  // ---------- why the temperature changes ----------
  const PX = [[1040, 420], [1150, 400], [1270, 430], [1080, 520], [1200, 540], [1320, 510], [1040, 640], [1160, 650], [1290, 630], [1110, 720], [1240, 730], [1340, 700]]
  EZ.scene('why', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Why it gets hot</div><h2 class="h1" data-at="0">Potential energy becomes motion</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <line x1="160" y1="840" x2="160" y2="350" stroke="#a3abbd" stroke-width="5" marker-end="url(#mk-muted)"/>
          <text x="190" y="370" font-size="28" font-weight="800" class="f-muted">chemical potential energy</text>
          <line x1="220" y1="470" x2="460" y2="470" stroke="#eef0f7" stroke-width="9" stroke-linecap="round"/><text x="340" y="450" text-anchor="middle" class="x-lab">reactants</text>
          <line x1="580" y1="760" x2="820" y2="760" stroke="#eef0f7" stroke-width="9" stroke-linecap="round"/><text x="700" y="740" text-anchor="middle" class="x-lab">products</text>
          <line x1="460" y1="470" x2="840" y2="470" stroke="#a3abbd" stroke-width="3" stroke-dasharray="10 10"/></g>
        <g data-at="1@0.6" data-fx="fade"><line x1="790" y1="480" x2="790" y2="744" stroke="${WARM}" stroke-width="9" marker-end="url(#mk-warm)"/>
          <text x="560" y="600" text-anchor="middle" class="x-lab f-warm">energy</text><text x="560" y="640" text-anchor="middle" class="x-lab f-warm">difference</text></g>
        <text x="520" y="830" text-anchor="middle" font-size="28" font-weight="800" class="f-muted" data-at="1@0.3" data-fx="fade">bonds break and form</text>
        <g data-at="2" data-fx="fade"><rect x="980" y="350" width="420" height="440" rx="24" fill="rgba(238,240,247,.05)" stroke="#c9cee0" stroke-width="4"/>
          <text x="1190" y="830" text-anchor="middle" class="x-lab f-warm">kinetic energy changes</text>
          ${PX.map((_, i) => `<g class="x-p${i}">${ball(0, 0, 22, 'warm')}</g>`).join('')}</g>
        <g data-at="3" data-fx="fade">${thermo(1500, 380, 330, 'x-tp')}<text x="1500" y="800" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">products</text></g>
        <g data-at="4" data-fx="fade">${thermo(1730, 380, 330, 'x-ts', TEAL)}<text x="1730" y="800" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">surroundings</text></g>
        <g class="x-flow">${[0, 1].map((i) => `<line x1="1540" y1="${470 + i * 70}" x2="1680" y2="${470 + i * 70}" stroke="${WARM}" stroke-width="7" stroke-dasharray="14 12" marker-end="url(#mk-warm)"/>`).join('')}</g>
      </svg>
      <div class="banner" style="top:880px;left:980px;width:820px;font-size:40px;padding:18px 30px" data-at="3" data-out="4" data-fx="pop">We see it as a <span class="warm">temperature change</span></div>
      <div class="banner" style="top:880px;left:980px;width:820px;font-size:40px;padding:18px 30px" data-at="4@0.6" data-fx="pop">Heat flows until <span class="teal">thermal equilibrium</span></div>`,
    update(c) {
      const b = c.b
      // particles: slow at first, faster once the energy shows up as motion, calmer after heat flows out
      const fast = eio(c.seg(b[2].start + 0.2, b[2].start + 1.5)), calm = eio(c.seg(b[4].start + 0.5, b[4].end))
      const amp = 3 + 15 * fast - 8 * calm
      const tt = Math.min(c.t, b[4].end + 2)
      PX.forEach(([x, y], i) => {
        const dx = amp * Math.sin(tt * (5 + i % 3) + i * 1.7), dy = amp * Math.cos(tt * (4 + i % 4) + i * 2.3)
        c.$('.x-p' + i).setAttribute('transform', `translate(${x + dx} ${y + dy})`)
      })
      const rise = eio(c.seg(b[3].start, b[3].start + 1.4)), eq = eio(c.seg(b[4].start + 0.3, b[4].end))
      level(c, '.x-tp', 380, 330, lerp(0.3, 0.85, rise) - 0.3 * eq)
      level(c, '.x-ts', 380, 330, 0.3 + 0.25 * eq)
      const f = c.$('.x-flow')
      f.style.opacity = c.seg(b[4].start, b[4].start + 0.4)
      f.querySelectorAll('line').forEach((l) => l.setAttribute('stroke-dashoffset', -26 * clamp(c.t - b[4].start, 0, b[4].end - b[4].start)))
    },
  })

  // ---------- worked example: 4.00 g of methane ----------
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Scale ΔH with stoichiometry</h2>
      <div class="card" style="left:120px;top:300px;width:660px;height:600px" data-at="1"></div>
      <div style="position:absolute;left:330px;top:350px;font-size:52px;font-weight:900" data-at="1@0.3" data-fx="fade">4.00 g ${CH4}</div>
      <div style="position:absolute;left:330px;top:420px;font-size:30px;font-weight:800;color:var(--muted)" data-at="1@0.5" data-fx="fade">burns: heat released?</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="pop">${methane(230, 410, 0.9)}</g>
        <g data-at="3" data-fx="fade"><text x="170" y="560" font-size="30" font-weight="800" class="f-muted">1 mol ${'CH'}<tspan dy="8" font-size="20">4</tspan></text>
          <rect x="170" y="580" width="560" height="56" rx="16" fill="none" stroke="#a3abbd" stroke-width="3" stroke-dasharray="12 8"/>
          <text x="720" y="618" text-anchor="end" font-size="30" font-weight="900" class="f-muted">890 kJ</text>
          <text x="170" y="710" font-size="30" font-weight="800" class="f-warm">0.249 mol</text></g>
        <rect class="x-bar" x="170" y="730" width="0" height="56" rx="16" fill="${WARM}"/>
        <text x="330" y="770" font-size="32" font-weight="900" class="f-warm" data-at="4" data-fx="fade">222 kJ</text>
      </svg>
      <div class="x-step" style="top:300px" data-at="2" data-fx="right"><div class="H"><i>1</i>Grams to moles</div>
        <div class="B" data-at="2@0.4" data-fx="fade">mol ${CH4} = 4.00 ÷ 16.04 = <span class="teal">0.249 mol</span></div></div>
      <div class="x-step" style="top:500px;border-color:rgba(76,199,129,.8)" data-at="3" data-fx="right"><div class="H"><i>2</i>Multiply by the heat per mole</div>
        <div class="B" data-at="3@0.4" data-fx="fade">q = 0.249 mol × 890 kJ/mol</div>
        <div class="B" data-at="4" data-fx="fade">q = <span class="good">222 kJ released</span></div></div>
      <div class="x-chip" style="left:820px;top:810px;border-color:rgba(242,196,67,.7)" data-at="5" data-fx="pop">Comparing fuels: 890 kJ ÷ 16.04 g ≈ <span class="gold">55.5 kJ/g</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[4].start, b[4].start + 1.2))
      c.$('.x-bar').setAttribute('width', 560 * 0.249 * p)
    },
  })

  // ---------- the trick: heat as a product ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Treat ΔH like a product</h2>
      <div class="x-eq" style="top:290px;font-size:66px" data-at="1" data-fx="up">${CH4} + 2${O2} ${ARR} ${CO2} + 2${H2O}<span class="x-heat warm" data-at="2" data-fx="pop">+ 890 kJ</span></div>
      <div class="x-chip" style="left:240px;top:420px;border-color:rgba(141,141,240,.7)" data-at="3" data-fx="pop">1 mol ${CH4} <span class="muted">↔</span> <span class="warm">890 kJ</span></div>
      <div class="x-chip" style="left:1020px;top:420px;border-color:rgba(141,141,240,.7)" data-at="3@0.6" data-fx="pop">2 mol ${O2} <span class="muted">↔</span> <span class="warm">890 kJ</span></div>
      <div class="banner" style="top:560px" data-at="4" data-out="5" data-fx="pop">Now it’s just <span class="teal">stoichiometry</span></div>
      <div class="card" style="left:120px;top:560px;width:1680px;height:390px" data-at="5"><h3>Ammonia</h3>
        <div class="x-ln" style="top:110px">${N2} + 3${H2} ${ARR} 2${NH3} &nbsp; ΔH = <span class="warm">−92 kJ</span></div>
        <div class="x-ln" style="top:200px" data-at="6" data-fx="fade"><span class="warm">92 kJ</span> <span class="muted">↔</span> 2 mol ${NH3}</div>
        <div class="x-ln" style="top:290px" data-at="7" data-fx="fade">4.0 mol ${NH3}: 2 × 92 = <span class="good">184 kJ</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="6@0.3" data-fx="pop">${nh3(1240, 790)}${nh3(1350, 790)}</g>
        <text x="1295" y="720" text-anchor="middle" class="x-lab f-warm" data-at="6@0.5" data-fx="fade">92 kJ</text>
        <g data-at="7@0.2" data-fx="pop">${nh3(1530, 790)}${nh3(1640, 790)}</g>
        <text x="1585" y="720" text-anchor="middle" class="x-lab f-warm" data-at="7@0.35" data-fx="fade">92 kJ</text>
        <text x="1440" y="910" text-anchor="middle" font-size="38" font-weight="900" class="f-good" data-at="7@0.6" data-fx="pop">184 kJ</text>
      </svg>`,
    update(c) {
      const b = c.b, on = c.seg(b[3].start, b[3].start + 0.3) * (1 - c.seg(b[4].start, b[4].start + 0.4))
      c.$('.x-heat').style.textShadow = `0 0 ${30 * on}px rgba(243,167,100,${0.9 * on})`
    },
  })

  // ---------- try it: hydrogen + oxygen ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">How much heat is released?</h2>
      <div class="x-gv" style="left:120px;width:760px" data-at="1@0.2" data-fx="pop"><div class="N">reaction</div><div class="V" style="font-size:50px">2${H2}(g) + ${O2}(g) ${ARR} 2${H2O}(l)</div></div>
      <div class="x-gv" style="left:920px;width:420px" data-at="1@0.4" data-fx="pop"><div class="N">ΔH</div><div class="V warm">−572 kJ</div></div>
      <div class="x-gv" style="left:1380px;width:420px" data-at="1@0.7" data-fx="pop"><div class="N">reacting</div><div class="V teal">1.00 mol ${H2}</div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">286 kJ</div>
        <div class="W" data-at="4" data-fx="fade"><span class="warm">572 kJ</span> is for 2 mol ${H2}</div>
        <div class="K" data-at="5" data-fx="fade">1.00 mol releases half: 572 ÷ 2 = 286 kJ</div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190"><text x="220" y="100" text-anchor="middle" font-size="90" font-weight="900" class="f-gold">ΔH</text>
    <text x="220" y="160" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">per mole of reaction</text></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190"><text x="220" y="115" text-anchor="middle" font-size="64" font-weight="900"><tspan class="f-warm">q</tspan> = <tspan class="f-pri">n</tspan> × |ΔH|</text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190">${ball(60, 95, 30, 'gray')}${ball(110, 95, 30, 'red')}
    <line x1="160" y1="95" x2="210" y2="95" stroke="#eef0f7" stroke-width="6" marker-end="url(#mk-text)"/>${ball(260, 95, 30, 'warm')}
    <path d="M232 60 l-14 -12 M288 60 l14 -12 M232 130 l-14 12 M288 130 l14 12" stroke="${WARM}" stroke-width="5" stroke-linecap="round"/>
    <line x1="310" y1="95" x2="345" y2="95" stroke="#eef0f7" stroke-width="6" marker-end="url(#mk-text)"/>${thermo(390, 20, 110, 'x-r3')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>ΔH applies to the<br>reaction <span class="teal">as written</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Scale it with moles:<br>heat = n × |ΔH|<br><span class="muted" style="font-size:30px">per mole of that substance</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Bond energy changes<br>${ARR}particle KE changes<br>${ARR}<span class="warm">temperature change</span></p></div>`,
    update(c) { level(c, '.x-r3', 20, 110, 0.8) },
  })
})()
