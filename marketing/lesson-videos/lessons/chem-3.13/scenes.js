// Pictures for chem-3.13 "Beer–Lambert Law". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u3.ts; the "why proportional" and
// colour ideas are from book.ts). Graphs are schematic: no axis values, shapes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .bl-note{position:absolute;left:1300px;width:500px;height:106px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .bl-note i{position:absolute;left:22px;top:28px;width:46px;height:46px;border-radius:50%}
    .bl-note b{display:block;font-size:30px;font-weight:900;line-height:1.15;white-space:nowrap} .bl-note span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .bl-fm{left:120px;top:290px;width:1680px;height:170px;text-align:center;font-size:112px;font-weight:900;line-height:166px;letter-spacing:4px}
    .bl-fm span{display:inline-block}
    .bl-def{position:absolute;left:120px;width:1680px;height:96px;border-radius:24px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .bl-def .k{position:absolute;left:44px;top:6px;font-size:64px;font-weight:900}
    .bl-def .nm{position:absolute;left:150px;top:22px;font-size:40px;font-weight:900;white-space:nowrap}
    .bl-def .ds{position:absolute;left:640px;top:29px;font-size:31px;font-weight:700;color:var(--muted);white-space:nowrap}
    .bl-def .u{position:absolute;right:28px;top:16px;height:62px;padding:0 24px;border-radius:18px;background:rgba(255,255,255,.06);border:2px solid var(--line);font-size:34px;font-weight:900;line-height:58px;white-space:nowrap}
    .bl-strip{left:120px;top:290px;width:1680px;height:96px;text-align:center;font-size:46px;font-weight:900;line-height:92px;white-space:nowrap}
    .bl-ft{position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:34px;font-weight:900;white-space:nowrap}
    .bl-box{left:1300px;top:680px;width:500px;height:250px;padding:22px 30px}
    .bl-box b{display:block;font-size:31px;font-weight:900;white-space:nowrap} .bl-box div{margin-top:14px;font-size:31px;font-weight:800;white-space:nowrap}
    .bl-prob{left:120px;top:290px;width:1680px;height:130px;padding:36px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .bl-srow{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .bl-srow .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:68px;text-align:center}
    .bl-srow .lb{position:absolute;left:124px;top:38px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .bl-srow .eq{position:absolute;left:520px;top:30px;font-size:46px;font-weight:900;white-space:nowrap}
    .bl-res{position:absolute;left:1310px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:46px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(76,199,129,.16);border:2px solid var(--good)}
    .bl-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);padding:0 96px 0 106px;font-size:40px;font-weight:800;line-height:122px;white-space:nowrap}
    .bl-opt .l{position:absolute;left:26px;top:31px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .bl-opt .ok{position:absolute;right:20px;top:29px;width:64px;height:64px}
    .bl-ask{position:absolute;left:120px;top:290px;height:80px;padding:0 34px;border-radius:999px;background:rgba(141,141,240,.14);border:2px solid var(--primary);font-size:40px;font-weight:900;line-height:76px;white-space:nowrap}
    .bl-row{position:absolute;left:120px;width:1680px;height:124px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .bl-row svg{position:absolute;left:24px;top:12px}
    .bl-row .cs{position:absolute;left:160px;top:16px;font-size:38px;font-weight:900;white-space:nowrap}
    .bl-row .sb{position:absolute;left:160px;top:70px;font-size:27px;font-weight:700;color:var(--muted);white-space:nowrap}
    .bl-pl{position:absolute;top:28px;height:68px;padding:0 24px;border-radius:18px;font-size:34px;font-weight:900;line-height:64px;white-space:nowrap;border:2px solid}
    .bl-rc{top:320px;width:540px;height:560px;text-align:center} .bl-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .bl-rc svg{display:block;margin:14px auto 0} .bl-rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const SUP = (s) => `<tspan dy="-.5em" font-size=".62em">${s}</tspan>`

  // a cuvette (open-topped, square-bottomed cell) with liquid
  const cuv = (x, y, w, h, fill, sw = 5) =>
    `<rect x="${x + 4}" y="${y + h * 0.18}" width="${w - 8}" height="${h * 0.82 - 4}" rx="6" fill="${fill}"/>
     <path d="M${x} ${y} V${y + h - 10} Q${x} ${y + h} ${x + 10} ${y + h} H${x + w - 10} Q${x + w} ${y + h} ${x + w} ${y + h - 10} V${y}" fill="none" stroke="#c9cee0" stroke-width="${sw}" stroke-linejoin="round"/>`
  // a beam of light from x0 to x1 centred on y; photons = moving dashes along it
  const beam = (x0, x1, y, h, op, cls = '') =>
    `<rect x="${x0}" y="${y - h / 2}" width="${x1 - x0}" height="${h}" rx="${h / 2}" fill="#f2c443" opacity="${op}"/>
     <line class="ph ${cls}" x1="${x0 + 6}" x2="${x1 - 6}" y1="${y}" y2="${y}" stroke="#fff6d8" stroke-width="${Math.max(3, h / 5)}" stroke-linecap="round" stroke-dasharray="10 34" opacity="${Math.min(1, op + 0.25)}"/>`
  const lamp = (x, y, r = 30) => `<circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="#f2c443" opacity=".14"/>${ball(x, y, r, 'gold')}`
  const flow = (c, speed = 60) => { for (const l of all(c, '.ph')) l.setAttribute('stroke-dashoffset', (-c.t * speed) % 44) }
  // small particles that tremble a little
  const pj = (i, x, y, r, g) => `<g class="pj" data-i="${i}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y})">${ball(0, 0, r, g)}</g>`
  const jig = (c) => { for (const g of all(c, '.pj')) { const d = g.dataset, i = +d.i
    g.setAttribute('transform', `translate(${(+d.x + 2.5 * Math.sin(c.t * 2.3 + i * 1.7)).toFixed(1)} ${(+d.y + 2.5 * Math.cos(c.t * 2.1 + i * 2.3)).toFixed(1)})`) } }
  const fill = (n, x, y, w, h, r, g, seed = 0) => { let s = '', cols = n > 4 ? 2 : 1, rows = Math.ceil(n / cols)
    for (let k = 0; k < n; k++) { const cx = x + w * ((k % cols) + 0.5) / cols + ((k * 37 + seed) % 11 - 5), cy = y + h * (Math.floor(k / cols) + 0.5) / rows
      s += pj(k + seed, cx.toFixed(1), cy.toFixed(1), r, g) }
    return s }

  // visible spectrum, violet to red (used as a band under the wavelength axis)
  const RAINBOW = (id) => `<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#7a4fd8"/><stop offset=".18" stop-color="#3f6cf0"/><stop offset=".38" stop-color="#3cc7bc"/><stop offset=".55" stop-color="#7fd34e"/><stop offset=".68" stop-color="#f2e04a"/><stop offset=".82" stop-color="#f39a3e"/><stop offset="1" stop-color="#e5484d"/></linearGradient>`

  // ---------- intro artwork: a lamp, beam and cuvette on the left; a calibration line on the right ----------
  EZ.intro = {
    chips: [['1@0.42', 'A = εbc'], ['1@0.62', 'Calibration lines'], ['1@0.86', 'Lab errors']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${lamp(70, 620, 26)}${beam(100, 230, 620, 30, 0.85)}${cuv(230, 520, 90, 170, 'rgba(60,199,188,.55)', 6)}${beam(322, 380, 620, 18, 0.4)}
      <line x1="1600" y1="800" x2="1600" y2="420" stroke="#c9cee0" stroke-width="6"/><line x1="1600" y1="800" x2="1880" y2="800" stroke="#c9cee0" stroke-width="6"/>
      <line class="iln" x1="1600" y1="800" x2="1860" y2="450" stroke="#8d8df0" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>
      ${[0.25, 0.5, 0.75].map((f, i) => `<circle class="ipt" data-i="${i}" cx="${1600 + f * 260}" cy="${800 - f * 350}" r="16" fill="#3cc7bc"/>`).join('')}</svg>`,
    update(c) {
      flow(c, 40)
      c.$('.iln').setAttribute('stroke-dashoffset', 1 - eio(c.seg(c.sc.start + 0.4, c.sc.start + 2.6)))
      for (const p of all(c, '.ipt')) p.style.opacity = c.seg(c.sc.start + 0.8 + +p.dataset.i * 0.5, c.sc.start + 1.1 + +p.dataset.i * 0.5)
    },
  }

  // ---------- hook: darker tea is stronger; a spectrophotometer makes that a number ----------
  const cup = (x, col) => `<path d="M${x - 80} 120 H${x + 80} L${x + 64} 290 Q${x + 62} 310 ${x + 42} 310 H${x - 42} Q${x - 62} 310 ${x - 64} 290 Z" fill="${col}"/>
    <path d="M${x - 86} 100 H${x + 86} L${x + 66} 292 Q${x + 63} 314 ${x + 42} 314 H${x - 42} Q${x - 63} 314 ${x - 66} 292 Z" fill="none" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
    <path d="M${x + 78} 150 Q${x + 128} 156 ${x + 118} 206 Q${x + 110} 244 ${x + 70} 246" fill="none" stroke="#c9cee0" stroke-width="5"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Darker means stronger</h2>
      <div class="card" style="left:120px;top:290px;width:760px;height:560px" data-at="0@0.4"><h3>A cup of tea</h3>
        <svg style="position:absolute;left:0;top:70px" width="760" height="420">
          <g data-at="1" data-fx="pop">${cup(150, '#e8b97a')}</g><g data-at="1@0.25" data-fx="pop">${cup(380, '#b8702e')}</g><g data-at="1@0.5" data-fx="pop">${cup(610, '#5e3416')}</g>
          <g data-at="1@0.75" data-fx="fade"><line x1="80" y1="380" x2="680" y2="380" stroke="#f3a764" stroke-width="7" marker-end="url(#mk-warm)"/></g></svg>
        <div class="bl-ft warm" data-at="1@0.75" data-fx="fade">darker ${ARR} stronger</div></div>
      <div class="card" style="left:940px;top:290px;width:860px;height:560px" data-at="2"><h3 class="teal">Spectrophotometer</h3>
        <svg style="position:absolute;left:0;top:90px" width="860" height="380">
          ${lamp(80, 200)}
          <g data-at="3" data-fx="fade">${beam(118, 330, 200, 44, 0.85)}<text x="224" y="152" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">light in</text></g>
          ${cuv(330, 100, 100, 200, 'rgba(185,106,38,.75)')}
          <text x="380" y="346" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">sample</text>
          <g data-at="3@0.45" data-fx="fade">${beam(432, 650, 200, 26, 0.35)}<text x="540" y="152" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">less light out</text></g>
          <rect x="650" y="140" width="160" height="120" rx="18" fill="#242838" stroke="#c9cee0" stroke-width="4"/>
          <text x="730" y="215" text-anchor="middle" font-size="44" font-weight="900" class="f-teal" data-at="3@0.75" data-fx="pop">A</text>
          <text x="730" y="300" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">detector</text></svg>
        <div class="bl-ft" data-at="3@0.6" data-fx="fade">measures how much light is <span class="teal">absorbed</span></div></div>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="4" data-fx="pop">Concentration, with <span class="warm">no chemical reaction</span> at all</div>`,
    update: (c) => flow(c),
  })

  // ---------- the equation ----------
  const DEFS = [
    ['A', 'warm', 'absorbance', 'how much light is absorbed', 'no units'],
    ['ε', 'pri', 'molar absorptivity', 'how strongly it absorbs one wavelength', 'M<sup>−1</sup>cm<sup>−1</sup>'],
    ['b', 'teal', 'path length', 'width of the cuvette (usually 1.00 cm)', 'cm'],
    ['c', 'gold', 'concentration', 'of the solution', 'M'],
  ]
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="0">The Beer–Lambert law</h2>
      <div class="card bl-fm" data-at="1"><span class="eL0 warm">A</span> = <span class="eL1 pri">ε</span><span class="eL2 teal">b</span><span class="eL3 gold">c</span></div>
      ${DEFS.map(([k, cl, nm, ds, u], i) => `<div class="bl-def" style="top:${494 + i * 110}px" data-at="${i + 2}" data-fx="left">
        <div class="k ${cl}">${k}</div><div class="nm">${nm}</div><div class="ds">${ds}</div><div class="u">${u}</div></div>`).join('')}`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 4; i++) {
        const t0 = b[i + 2].start, k = c.seg(t0, t0 + 0.35) * (1 - c.seg(t0 + 1.4, t0 + 2.0))
        const el = c.$('.eL' + i)
        el.style.transform = `translateY(${-14 * k}px) scale(${1 + 0.22 * k})`
        el.style.textShadow = `0 0 ${36 * k}px currentColor`
      }
    },
  })

  // ---------- why A is proportional to c ----------
  const PROW = [
    ['concentration c', 4, 100, 0.55, 22, 'A', 'warm'],
    ['2 × concentration', 8, 100, 0.25, 12, '2A', 'warm'],
    ['2 × path length', 8, 200, 0.25, 12, '2A', 'teal'],
  ]
  const GX = (f) => 90 + f * 500, GY = (f) => 420 - f * 340
  EZ.scene('proportion', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it works</div><h2 class="h1" data-at="0@0.3">Absorbance ∝ concentration</h2>
      <div class="card bl-strip" data-at="0">b and λ held constant <span data-at="1" data-fx="fade">${ARR} <span class="warm">A</span> ∝ <span class="gold">c</span></span></div>
      <div class="card" style="left:120px;top:410px;width:1000px;height:520px" data-at="2">
        <svg style="position:absolute;left:0;top:0" width="1000" height="520">
          ${PROW.map(([lab, n, w, op, h, a, col], i) => { const y = 100 + i * 160, x0 = 330, x1 = x0 + w
            return `<g data-at="${i === 2 ? 5 : 2 + i}${i ? '+0.2' : '@0.3'}" data-fx="fade">
              <text x="40" y="${y - 40}" font-size="30" font-weight="900" class="f-${i === 2 ? 'teal' : 'gold'}">${lab}</text>
              ${lamp(60, y + 6, 18)}${beam(84, x0, y + 6, 34, 0.85)}${cuv(x0, y - 58, w, 128, 'rgba(60,199,188,.16)')}
              ${fill(n, x0 + 8, y - 28, w - 16, 92, 11, 'pur', i * 10)}
              ${beam(x1 + 2, 820, y + 6, h, op)}
              <text x="${860}" y="${y + 20}" font-size="44" font-weight="900" class="f-${col}" ${i === 1 ? 'data-at="4" data-fx="pop"' : ''}>${a}</text></g>` }).join('')}
        </svg></div>
      <div class="card" style="left:1160px;top:410px;width:640px;height:520px" data-at="2@0.5">
        <svg style="position:absolute;left:0;top:20px" width="640" height="500">
          <line x1="90" y1="420" x2="600" y2="420" stroke="#c9cee0" stroke-width="5"/><line x1="90" y1="420" x2="90" y2="50" stroke="#c9cee0" stroke-width="5"/>
          <text x="600" y="494" text-anchor="end" font-size="28" font-weight="800" class="f-muted">concentration</text>
          <text x="100" y="40" font-size="28" font-weight="800" class="f-muted">absorbance</text>
          <line x1="${GX(0)}" y1="${GY(0)}" x2="${GX(1)}" y2="${GY(1)}" stroke="#8d8df0" stroke-width="7" stroke-linecap="round" data-at="2@0.7" data-fx="draw"/>
          <g data-at="3" data-fx="fade"><line x1="${GX(0.4)}" y1="420" x2="${GX(0.4)}" y2="${GY(0.4)}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="8 8"/><line x1="90" y1="${GY(0.4)}" x2="${GX(0.4)}" y2="${GY(0.4)}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="8 8"/>
            <text x="${GX(0.4)}" y="456" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">c</text><text x="76" y="${GY(0.4) + 10}" text-anchor="end" font-size="30" font-weight="900" class="f-warm">A</text></g>
          <g data-at="4" data-fx="fade"><line x1="${GX(0.8)}" y1="420" x2="${GX(0.8)}" y2="${GY(0.8)}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="8 8"/><line x1="90" y1="${GY(0.8)}" x2="${GX(0.8)}" y2="${GY(0.8)}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="8 8"/>
            <text x="${GX(0.8)}" y="456" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">2c</text><text x="76" y="${GY(0.8) + 10}" text-anchor="end" font-size="30" font-weight="900" class="f-warm">2A</text></g>
          <g class="gdot"><circle r="24" fill="#f3a764" opacity=".3"/><circle r="13" fill="#fff"/></g>
        </svg></div>`,
    update(c) {
      flow(c, 50); jig(c)
      const b = c.b, f = lerp(0.4, 0.8, eio(c.seg(b[3].start + 0.6, b[4].start + 0.4)))
      const d = c.$('.gdot')
      d.setAttribute('transform', `translate(${GX(f)} ${GY(f)})`)
      d.style.opacity = c.seg(b[3].start, b[3].start + 0.4)
    },
  })

  // ---------- calibration curve ----------
  const CX = (f) => 240 + f * 900, CY = (f) => 880 - f * 500
  const STD = [0.2, 0.4, 0.6, 0.8], UNK = 0.5
  const note = (i, at, color, a, b) => `<div class="bl-note" style="top:${300 + i * 124}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  EZ.scene('calibration', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Calibration curve</div><h2 class="h1" data-at="0">Find an unknown</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.5" data-fx="fade"><line x1="240" y1="880" x2="1180" y2="880" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/><line x1="240" y1="880" x2="240" y2="330" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>
          <text x="1180" y="935" text-anchor="end" font-size="30" font-weight="800" class="f-muted">Concentration (M)</text>
          <text x="250" y="316" font-size="30" font-weight="800" class="f-muted">Absorbance</text></g>
        ${STD.map((f, i) => `<g data-at="1@${0.35 + i * 0.15}" data-fx="pop"><circle cx="${CX(f)}" cy="${CY(f)}" r="${17}" fill="#3cc7bc" opacity="${0.45 + i * 0.18}"/><circle cx="${CX(f)}" cy="${CY(f)}" r="17" fill="none" stroke="#3cc7bc" stroke-width="4"/></g>`).join('')}
        <line x1="${CX(0)}" y1="${CY(0)}" x2="${CX(0.95)}" y2="${CY(0.95)}" stroke="#8d8df0" stroke-width="7" stroke-linecap="round" data-at="2" data-fx="draw"/>
        <g data-at="3@0.3" data-fx="fade"><line x1="240" y1="${CY(UNK)}" x2="${CX(UNK)}" y2="${CY(UNK)}" stroke="#f3a764" stroke-width="5" stroke-dasharray="12 10"/>
          <text x="226" y="${CY(UNK) + 10}" text-anchor="end" font-size="28" font-weight="900" class="f-warm">unknown A</text></g>
        <g data-at="3@0.55" data-fx="pop"><circle cx="${CX(UNK)}" cy="${CY(UNK)}" r="20" fill="#f3a764"/></g>
        <g data-at="3@0.7" data-fx="fade"><line x1="${CX(UNK)}" y1="${CY(UNK)}" x2="${CX(UNK)}" y2="880" stroke="#f3a764" stroke-width="5" stroke-dasharray="12 10"/>
          <text x="${CX(UNK)}" y="925" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">unknown c</text></g>
      </svg>
      ${note(0, '1', '#3cc7bc', 'Standards', 'known concentrations')}
      ${note(1, '2', '#8d8df0', 'Plot them', 'a straight line')}
      ${note(2, '3', '#f3a764', 'The unknown', 'measure A, read c')}
      <div class="card bl-box" data-at="4"><b>ε: one substance, one λ</b>
        <div data-at="5@0.25" data-fx="left"><span class="good">✓</span> same substance</div>
        <div data-at="5@0.45" data-fx="left"><span class="good">✓</span> same wavelength</div>
        <div data-at="5@0.7" data-fx="left"><span class="good">✓</span> same cuvette</div></div>`,
  })

  // ---------- choosing the wavelength: λmax ----------
  const PK = 720, SX0 = 90, SX1 = 860, SY0 = 420
  const spec = (x) => SY0 - 30 - 290 * Math.exp(-(((x - PK) / 115) ** 2))
  let SD = ''
  for (let x = SX0 + 10; x <= SX1 - 10; x += 5) SD += `${SD ? 'L' : 'M'}${x} ${spec(x).toFixed(1)}`
  let TOP = ''
  for (let x = PK - 55; x <= PK + 55; x += 5) TOP += `${TOP ? 'L' : 'M'}${x} ${(spec(x) - 2).toFixed(1)}`
  const STRIPES = ['#7a4fd8', '#3f6cf0', '#3cc7bc', '#7fd34e', '#f2e04a', '#f39a3e', '#e5484d']
  EZ.scene('lmax', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Pick the wavelength</div><h2 class="h1" data-at="0">Measure at λ<sub>max</sub></h2>
      <div class="card" style="left:1060px;top:290px;width:740px;height:300px" data-at="1"><h3>A colored solution</h3>
        <svg style="position:absolute;left:0;top:76px" width="740" height="220">
          ${STRIPES.map((s, i) => `<line class="ph" x1="40" x2="296" y1="${66 + i * 8}" y2="${66 + i * 8}" stroke="${s}" stroke-width="6" stroke-dasharray="26 8"/>`).join('')}
          ${cuv(300, 14, 100, 140, 'rgba(63,108,240,.6)')}
          <g data-at="1@0.45" data-fx="fade">${STRIPES.slice(0, 3).map((s, i) => `<line class="ph" x1="404" x2="680" y1="${74 + i * 10}" y2="${74 + i * 10}" stroke="${s}" stroke-width="6" stroke-dasharray="26 8"/>`).join('')}
            <text x="545" y="40" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">the color you see</text></g>
          <text x="168" y="40" text-anchor="middle" font-size="28" font-weight="900" class="f-gold">white light</text>
          <text x="350" y="194" text-anchor="middle" font-size="27" font-weight="900" class="f-warm" data-at="2@0.6" data-fx="fade">absorbs orange-red</text></svg></div>
      <div class="card" style="left:120px;top:290px;width:900px;height:640px" data-at="2"><h3>Blue copper(II) solution</h3>
        <svg style="position:absolute;left:0;top:96px" width="900" height="530">
          <defs>${RAINBOW('lm-rb')}</defs>
          <line x1="${SX0}" y1="${SY0}" x2="${SX1}" y2="${SY0}" stroke="#c9cee0" stroke-width="5"/><line x1="${SX0}" y1="${SY0}" x2="${SX0}" y2="40" stroke="#c9cee0" stroke-width="5"/>
          <rect x="${SX0}" y="${SY0 + 12}" width="${SX1 - SX0}" height="24" rx="8" fill="url(#lm-rb)" opacity=".9"/>
          <text x="${(SX0 + SX1) / 2 - 80}" y="${SY0 + 80}" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">wavelength</text>
          <text x="${SX0 + 12}" y="34" font-size="28" font-weight="800" class="f-muted">absorbance</text>
          <path d="${SD}" fill="none" stroke="#3f6cf0" stroke-width="8" stroke-linecap="round" data-at="2@0.3" data-fx="draw" data-dur="1.6"/>
          <g data-at="3@0.5" data-fx="fade"><line x1="${PK}" y1="${spec(PK) + 14}" x2="${PK}" y2="${SY0}" stroke="#f2c443" stroke-width="4" stroke-dasharray="10 8"/>
            <text x="${PK}" y="${SY0 + 80}" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">λ<tspan dy=".3em" font-size=".62em">max</tspan></text></g>
          <g data-at="5@0.2" data-fx="fade"><path d="${TOP}" fill="none" stroke="#4cc781" stroke-width="16" stroke-linecap="round" opacity=".55"/>
            <text x="${PK - 80}" y="74" text-anchor="end" font-size="27" font-weight="900" class="f-good">flat top: small λ errors</text>
            <text x="${PK - 80}" y="106" text-anchor="end" font-size="27" font-weight="900" class="f-good">matter least</text></g>
        </svg></div>
      <div class="card" style="left:1060px;top:620px;width:740px;height:310px" data-at="4"><h3>At λ<sub>max</sub>: most <span class="teal">sensitive</span></h3>
        <svg style="position:absolute;left:0;top:90px" width="740" height="215">
          <line x1="60" y1="180" x2="440" y2="180" stroke="#c9cee0" stroke-width="4"/><line x1="60" y1="180" x2="60" y2="10" stroke="#c9cee0" stroke-width="4"/>
          <text x="440" y="206" text-anchor="end" font-size="22" font-weight="800" class="f-muted">concentration</text>
          <line x1="60" y1="180" x2="400" y2="22" stroke="#3cc7bc" stroke-width="7" stroke-linecap="round" data-at="4@0.25" data-fx="draw"/>
          <line x1="60" y1="180" x2="430" y2="130" stroke="#7d859c" stroke-width="7" stroke-linecap="round" data-at="4@0.45" data-fx="draw"/>
          <text x="470" y="48" font-size="28" font-weight="900" class="f-teal" data-at="4@0.5" data-fx="fade">at λ<tspan dy=".3em" font-size=".62em">max</tspan><tspan dy="-.3em">: biggest</tspan></text>
          <text x="470" y="84" font-size="28" font-weight="900" class="f-teal" data-at="4@0.5" data-fx="fade">change in A</text>
          <text x="470" y="148" font-size="28" font-weight="900" class="f-muted" data-at="4@0.7" data-fx="fade">off the peak</text></svg></div>`,
    update: (c) => flow(c, 45),
  })

  // ---------- worked example ----------
  const srow = (i, top, at, label, eq, res) => `<div class="bl-srow" style="top:${top}px" data-at="${at}"><div class="n">${i}</div><div class="lb">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div>${res ? `<div class="bl-res" data-at="${res[1]}" data-fx="pop">${res[0]}</div>` : ''}</div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Find the concentration</h2>
      <div class="card bl-prob" data-at="1">Dye: <span class="pri">ε = 1.50 × 10<sup>4</sup> M<sup>−1</sup>cm<sup>−1</sup></span> · <span class="teal">b = 1.00 cm</span> · <span class="warm">A = 0.450</span> · <span class="gold">c = ?</span></div>
      ${srow(1, 460, '2', 'Rearrange', 'A = εbc &nbsp;' + ARR + '&nbsp; <span class="gold">c</span> = A / (εb)')}
      ${srow(2, 600, '3', 'Plug in', '0.450 / [(1.50 × 10<sup>4</sup>)(1.00)]')}
      ${srow(3, 740, '4', 'Concentration', '<span class="gold">c</span> =', ['3.00 × 10<sup>−5</sup> M', '4@0.3'])}
      <div class="banner" style="top:890px;padding:14px 40px;font-size:46px" data-at="5" data-fx="pop">Same idea for ε: &nbsp;<span class="pri">ε = A / (bc)</span></div>`,
    update(c) {
      const w = eo(c.seg(c.b[4].start + 0.5, c.b[4].start + 1.0))
      c.$('.bl-res').style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- try it ----------
  const OPTS = ['is cut to one-third', 'stays the same', 'triples', 'increases 9 times']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">At constant ε and b, <span class="gold">c</span> is <span class="teal">tripled</span>. Absorbance…</h2>
      ${OPTS.map((o, i) => `<div class="bl-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="2@${0.05 + i * 0.22}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 2 ? CHECK : ''}${o}</div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:700px" data-at="5" data-fx="pop"><span class="warm">A</span> = εb<span class="gold">c</span>, so <span class="warm">A</span> ∝ <span class="gold">c</span>: triple <span class="gold">c</span> ${ARR} triple <span class="warm">A</span></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.4, b[4].start + 0.85))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- free-response tip: lab errors ----------
  const icoCuv = (extra) => `<svg width="100" height="100" viewBox="0 0 100 100">${cuv(26, 8, 48, 84, 'rgba(60,199,188,.3)', 4)}${extra}</svg>`
  const print = '<g fill="none" stroke="#f0d2b0" stroke-width="2.5" opacity=".9">' + [8, 13, 18, 23].map((r) => `<ellipse cx="50" cy="56" rx="${r * 0.8}" ry="${r}"/>`).join('') + '</g><line x1="30" y1="30" x2="68" y2="44" stroke="#fff" stroke-width="3" opacity=".7"/>'
  const drops = [[38, 30], [60, 42], [46, 60]].map(([x, y]) => `<path d="M${x} ${y - 9} Q${x + 7} ${y} ${x} ${y + 6} Q${x - 7} ${y} ${x} ${y - 9}Z" fill="#9fd8ff"/>`).join('')
  const peakIco = `<svg width="100" height="100" viewBox="0 0 100 100"><line x1="8" y1="88" x2="94" y2="88" stroke="#c9cee0" stroke-width="3"/><path d="M10 84 Q40 82 55 20 Q70 82 92 84" fill="none" stroke="#3f6cf0" stroke-width="5"/>
    <line x1="80" y1="88" x2="80" y2="72" stroke="#f0707a" stroke-width="4"/><circle cx="80" cy="72" r="5" fill="#f0707a"/></svg>`
  const pl = (left, at, cls, txt) => `<div class="bl-pl ${cls}" style="left:${left}px;border-color:currentColor;background:rgba(255,255,255,.04)" data-at="${at}" data-fx="pop">${txt}</div>`
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="1">How does a lab error change the result?</h2>
      <div class="bl-ask" data-at="2" data-fx="pop">Ask: does the measured <span class="warm">A</span> go up, or down?</div>
      <div class="bl-row" style="top:400px" data-at="3">${icoCuv(print)}<div class="cs">Fingerprints or scratches</div><div class="sb">block extra light</div>
        ${pl(1000, '3@0.45', 'warm', 'A too high ↑')}<div style="position:absolute;left:1296px;top:40px;font-size:40px" class="muted" data-at="3@0.75" data-fx="fade">${ARR}</div>${pl(1370, '3@0.8', 'warm', 'c too high ↑')}</div>
      <div class="bl-row" style="top:544px" data-at="4">${icoCuv(drops)}<div class="cs">Cuvette still wet with water</div><div class="sb">dilutes the sample</div>
        ${pl(1000, '4@0.5', 'teal', 'A too low ↓')}<div style="position:absolute;left:1296px;top:40px;font-size:40px" class="muted" data-at="4@0.75" data-fx="fade">${ARR}</div>${pl(1370, '4@0.8', 'teal', 'c too low ↓')}</div>
      <div class="bl-row" style="top:688px" data-at="5">${peakIco}<div class="cs">Wavelength away from λ<sub>max</sub></div><div class="sb">lower sensitivity</div>
        ${pl(1000, '5@0.6', 'pri', 'smaller A for every solution')}</div>
      <div class="banner" style="top:850px;padding:16px 40px" data-at="6" data-fx="pop">State the <span class="warm">direction</span> AND the <span class="teal">reason</span></div>`,
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="96" text-anchor="middle" font-size="76" font-weight="900"><tspan class="f-warm">A</tspan> = <tspan class="f-pri">ε</tspan><tspan class="f-teal">b</tspan><tspan class="f-gold">c</tspan></text>
    <line x1="120" y1="190" x2="340" y2="190" stroke="#c9cee0" stroke-width="4"/><line x1="120" y1="190" x2="120" y2="120" stroke="#c9cee0" stroke-width="4"/><line x1="120" y1="190" x2="330" y2="126" stroke="#8d8df0" stroke-width="7" stroke-linecap="round"/></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210"><line x1="80" y1="190" x2="400" y2="190" stroke="#c9cee0" stroke-width="4"/><line x1="80" y1="190" x2="80" y2="14" stroke="#c9cee0" stroke-width="4"/>
    <line x1="80" y1="190" x2="390" y2="24" stroke="#8d8df0" stroke-width="6" stroke-linecap="round"/>${[0.2, 0.4, 0.6, 0.8].map((f) => `<circle cx="${80 + f * 310}" cy="${190 - f * 166}" r="10" fill="#3cc7bc"/>`).join('')}
    <line x1="80" y1="107" x2="235" y2="107" stroke="#f3a764" stroke-width="4" stroke-dasharray="8 7"/><line x1="235" y1="107" x2="235" y2="190" stroke="#f3a764" stroke-width="4" stroke-dasharray="8 7"/><circle cx="235" cy="107" r="11" fill="#f3a764"/></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><defs>${RAINBOW('rc-rb')}</defs><line x1="40" y1="170" x2="300" y2="170" stroke="#c9cee0" stroke-width="4"/><rect x="40" y="178" width="260" height="12" rx="5" fill="url(#rc-rb)"/>
    <path d="M44 160 Q170 158 215 30 Q260 158 298 160" fill="none" stroke="#3f6cf0" stroke-width="7"/><line x1="215" y1="40" x2="215" y2="170" stroke="#f2c443" stroke-width="4" stroke-dasharray="8 7"/>
    <text x="370" y="90" text-anchor="middle" font-size="64" font-weight="900" class="f-warm">↑</text><text x="370" y="160" text-anchor="middle" font-size="64" font-weight="900" class="f-teal">↓</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card bl-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p><span class="warm">A</span> = εb<span class="gold">c</span><br>With b and λ fixed:<br><span class="warm">A</span> ∝ <span class="gold">concentration</span></p></div>
      <div class="card bl-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>A calibration line<br>from <span class="teal">standards</span><br>finds the <span class="warm">unknown</span></p></div>
      <div class="card bl-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Measure at <span class="gold">λ<sub>max</sub></span><br>Lab errors: does<br><span class="warm">A</span> go up or down?</p></div>`,
  })
  void SUP; void clamp
})()
