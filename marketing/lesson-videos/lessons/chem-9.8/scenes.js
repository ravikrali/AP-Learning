// Pictures for chem-9.8 "Galvanic & Electrolytic Cells". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, book.ts, diagram 'galvanic-cell'):
// Zn | Zn2+ || Cu2+ | Cu; anode = oxidation, loses mass; cathode = reduction, gains mass; e- flow anode -> cathode
// in the wire; voltmeter = cell potential; salt bridge keeps each half-cell neutral (anions -> anode, cations ->
// cathode), moves ions not electrons; "An Ox, Red Cat"; galvanic favored / produces energy vs electrolytic
// unfavored / needs a power source; molten NaCl (Na+ reduced at the cathode, Cl- oxidized to Cl2 at the anode).
// Sizes of electrodes and ions show order only, never scale.
(() => {
  const { lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:36px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-lab small{display:block;font-size:26px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-big{position:absolute;left:0;right:0;text-align:center;font-size:120px;font-weight:900;letter-spacing:4px;white-space:nowrap}
    .x-tile{position:absolute;width:800px;height:130px;border-radius:28px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:36px;font-weight:900;line-height:1.2}
    .x-tile .l{flex:none;margin:0 24px 0 24px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;line-height:52px;text-align:center;color:var(--muted)}
    .x-tile .tx{padding-right:96px}
    .x-tile .ok{position:absolute;right:18px;top:33px;width:60px;height:60px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', TXT = '#eef0f7', CU = '#c27a43', ZN = '#aab1c4'
  const E = 'e<sup>−</sup>'
  const sE = sup('e', '−')
  const lo = (s) => `<tspan dy="8" font-size=".62em">${s}</tspan>`
  const mv = (c, sel, x, y, o) => { const el = c.$(sel); el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); if (o != null) el.style.opacity = o }
  const lens = {}
  const along = (c, sel, u) => { const p = c.$(sel); if (!lens[sel]) lens[sel] = p.getTotalLength(); return p.getPointAtLength(Math.max(0, Math.min(1, u)) * lens[sel]) }
  const frac = (x) => x - Math.floor(x)
  const wire = (d, w = 6) => `<path d="${d}" fill="none" stroke="${TXT}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`
  const arrow = (x1, y1, x2, y2, col = 'warm', w = 5) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${{ warm: WARM, teal: TEAL, gold: GOLD, bad: '#f0707a', pri: '#8d8df0' }[col]}" stroke-width="${w}" marker-end="url(#mk-${col})"/>`
  const beaker = (x1, x2, y1, y2) => `<path d="M${x1} ${y1}V${y2 - 20}Q${x1} ${y2} ${x1 + 20} ${y2}H${x2 - 20}Q${x2} ${y2} ${x2} ${y2 - 20}V${y1}" fill="none" stroke="#c9cee0" stroke-width="6" stroke-linejoin="round"/>`
  // electron dots running along a sampler path; phase = how far along (0..1 loops)
  const dots = (cls, n, r = 9) => Array.from({ length: n }, (_, i) => `<g class="${cls}${i}">${ball(0, 0, r, 'warm')}</g>`).join('')
  const runDots = (c, sampler, cls, n, phase, op = 1) => { for (let i = 0; i < n; i++) { const q = along(c, sampler, frac(phase + i / n)); mv(c, '.' + cls + i, q.x, q.y, op) } }

  // ---------- the galvanic cell (both 'parts' and 'bridge') ----------
  const WIRE = 'M550 470V380H1370V470'
  const TUBE = 'M690 700V520H1230V700'
  const ion = (cls, g, lab, r = 24) => `<g class="${cls}">${ball(0, 0, r, g, lab, 17)}</g>`
  const cellBase = (fx) => `
    <g ${fx}><rect x="364" y="640" width="392" height="216" fill="rgba(60,199,188,.16)"/><rect x="1164" y="640" width="392" height="216" fill="rgba(141,141,240,.2)"/>
      <text x="560" y="846" text-anchor="middle" font-size="26" font-weight="800" class="f-teal">${sup('Zn', '2+')} ions</text>
      <text x="1370" y="846" text-anchor="middle" font-size="26" font-weight="800" class="f-pri">${sup('Cu', '2+')} ions</text></g>`
  const cellFrame = (fx) => `
    <g ${fx}>${beaker(360, 760, 560, 860)}${beaker(1160, 1560, 560, 860)}${wire(WIRE)}
      <text x="500" y="530" text-anchor="end" font-size="42" font-weight="900" style="fill:${ZN}">Zn</text>
      <text x="1420" y="530" font-size="42" font-weight="900" style="fill:${CU}">Cu</text></g>`
  const electrodes = `<rect class="x-zn" x="520" y="470" width="60" height="340" rx="6" fill="${ZN}"/><rect class="x-cu" x="1340" y="470" width="60" height="340" rx="6" fill="${CU}"/>`
  const voltmeter = (fx) => `<g ${fx}><circle class="x-vm" cx="960" cy="380" r="50" fill="#1a1d2a" stroke="${TXT}" stroke-width="5"/><text x="960" y="398" text-anchor="middle" font-size="50" font-weight="900">V</text></g>`
  const tube = (op = 1) => `<g opacity="${op}"><path d="${TUBE}" fill="none" stroke="#6a7194" stroke-width="50"/><path d="${TUBE}" fill="none" stroke="#2a2f44" stroke-width="38"/></g>`
  const eArrows = (fx) => `<g ${fx}>${arrow(640, 345, 820, 345)}${arrow(1100, 345, 1280, 345)}
    <text x="730" y="326" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">${sE}</text><text x="1190" y="326" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">${sE}</text></g>`

  // ---------- intro: two faint half-cells low at the sides ----------
  EZ.intro = {
    chips: [['1@0.25', 'Anode & cathode'], ['1@0.55', 'An Ox, Red Cat'], ['1@0.85', 'Galvanic vs. electrolytic']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.3">
      <rect x="124" y="890" width="232" height="51" fill="rgba(60,199,188,.5)"/><rect x="1564" y="890" width="232" height="51" fill="rgba(141,141,240,.5)"/>
      ${beaker(120, 360, 860, 945)}${beaker(1560, 1800, 860, 945)}
      <rect x="222" y="845" width="36" height="85" rx="4" fill="${ZN}"/><rect x="1662" y="845" width="36" height="85" rx="4" fill="${CU}"/></svg>`,
  }

  // ---------- hook: electrons forced the long way ----------
  const HW = 'M440 470V380H1480V470'
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Electrons take the long way</h2>
      <div class="x-line" style="top:300px" data-at="0@0.3" data-out="2"><span class="pri">redox</span> reaction, with a twist</div>
      <div class="card" style="left:200px;top:470px;width:480px;height:300px" data-at="1@0.05"><h3 class="teal">Oxidation</h3>
        <div class="x-row" style="top:130px">${E} released</div><div class="x-row muted" style="top:200px;font-size:32px">in one place</div></div>
      <div class="card" style="left:1240px;top:470px;width:480px;height:300px" data-at="1@0.5"><h3 class="pri">Reduction</h3>
        <div class="x-row" style="top:130px">${E} used</div><div class="x-row muted" style="top:200px;font-size:32px">in another</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.1" data-fx="fade">${wire(HW)}</g>
        <path class="x-hs" d="${HW}" fill="none" stroke="none"/>
        <g data-at="2@0.4" data-fx="fade">${dots('x-hd', 7)}</g>
        <g data-at="2@0.5" data-fx="fade"><text x="700" y="350" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">through a wire</text>${arrow(810, 340, 870, 340)}</g>
        <g data-at="3@0.1" data-fx="pop"><rect x="905" y="285" width="110" height="190" rx="18" fill="#1a1d2a" stroke="${TXT}" stroke-width="5"/>
          <rect class="x-scr" x="917" y="305" width="86" height="140" rx="6" fill="${TEAL}" opacity="0"/><circle cx="960" cy="458" r="6" fill="#a3abbd"/></g>
        <g data-at="3@0.5" data-fx="fade"><text x="1210" y="350" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">useful work</text></g>
      </svg>
      <div class="banner" style="top:830px" data-at="4" data-fx="pop">A <span class="gold">galvanic</span> cell, also called a <span class="teal">voltaic</span> cell</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.4
      runDots(c, '.x-hs', 'x-hd', 7, Math.max(0, c.t - t0) * 0.1)
      c.$('.x-scr').setAttribute('opacity', (0.75 * eio(c.seg(b[3].start + 0.4, b[3].start + 1.4))).toFixed(2))
    },
  })

  // ---------- the parts of a galvanic cell ----------
  const ZI = [[430, 700], [470, 790], [410, 790]]
  const CI = [[1480, 690], [1510, 780], [1450, 770]]
  EZ.scene('parts', {
    html: `<div class="kicker" data-at="in" data-fx="left">The parts</div><h2 class="h1" data-at="in+0.2">Inside a galvanic cell</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.1" data-fx="fade">${cellBase('')}</g>
        <g data-at="0@0.2" data-fx="fade">${tube(0.3)}</g>
        <g data-at="0@0.1" data-fx="fade">${cellFrame('')}${electrodes}</g>
        <g data-at="3@0.3" data-fx="fade">${ZI.map((_, i) => ion('x-zi' + i, 'gray', sup('Zn', '2+'))).join('')}</g>
        <g data-at="1@0.4" data-fx="fade">${CI.map((_, i) => ion('x-ci' + i, 'pur', sup('Cu', '2+'))).join('')}</g>
        <path class="x-ws" d="${WIRE}" fill="none" stroke="none"/>
        <g data-at="8@0.3" data-fx="fade">${dots('x-wd', 6)}</g>
        ${eArrows('data-at="8@0.2" data-fx="fade"')}
        ${voltmeter('data-at="0@0.1" data-fx="fade"')}
        <g data-at="9@0.3" data-fx="fade"><text x="960" y="300" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">cell potential</text></g>
      </svg>
      <div class="x-lab" style="left:300px;width:520px;top:874px" data-at="2@0.1"><span class="teal">Anode</span> · oxidation</div>
      <div class="x-lab" style="left:300px;width:520px;top:924px;font-size:34px" data-at="3@0.1">Zn ${ARR} Zn<sup>2+</sup> + 2${E}</div>
      <div class="x-lab bad" style="left:40px;width:300px;top:690px;font-size:34px" data-at="4@0.3" data-fx="pop"><small>often</small>loses mass</div>
      <div class="x-lab" style="left:1110px;width:520px;top:874px" data-at="5@0.1"><span class="pri">Cathode</span> · reduction</div>
      <div class="x-lab" style="left:1110px;width:520px;top:924px;font-size:34px" data-at="6@0.1">Cu<sup>2+</sup> + 2${E} ${ARR} Cu</div>
      <div class="x-lab good" style="left:1580px;width:300px;top:690px;font-size:34px" data-at="7@0.3" data-fx="pop"><small>often</small>gains mass</div>`,
    update(c) {
      const b = c.b
      const pz = eio(c.seg(b[3].start + 0.3, b[4].end))
      const zw = 60 - 18 * pz
      c.$('.x-zn').setAttribute('x', (550 - zw / 2).toFixed(1)); c.$('.x-zn').setAttribute('width', zw.toFixed(1))
      ZI.forEach(([x, y], i) => { const p = eo(c.seg(b[3].start + 0.3 + 0.5 * i, b[3].start + 1.8 + 0.5 * i)); mv(c, '.x-zi' + i, lerp(548, x, p), lerp(y - 40, y, p), p > 0 ? 1 : 0) })
      const pc = eio(c.seg(b[6].start + 0.3, b[7].end))
      const cw = 60 + 18 * pc
      c.$('.x-cu').setAttribute('x', (1370 - cw / 2).toFixed(1)); c.$('.x-cu').setAttribute('width', cw.toFixed(1))
      CI.forEach(([x, y], i) => { const p = eio(c.seg(b[6].start + 0.3 + 0.5 * i, b[6].start + 1.8 + 0.5 * i)); mv(c, '.x-ci' + i, lerp(x, 1380, p), lerp(y, y - 20, p), 1 - c.seg(b[6].start + 1.4 + 0.5 * i, b[6].start + 1.9 + 0.5 * i)) })
      runDots(c, '.x-ws', 'x-wd', 6, Math.max(0, c.t - b[8].start) * 0.12)
      c.$('.x-vm').setAttribute('stroke', c.t > b[9].start + 0.3 ? GOLD : TXT)
    },
  })

  // ---------- the salt bridge ----------
  const BZ = [[430, 700], [470, 790], [410, 790], [450, 745]]
  const BC = [[1480, 700], [1510, 790], [1450, 780]]
  EZ.scene('bridge', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Salt bridge</div><h2 class="h1" data-at="in+0.2">Why the salt bridge?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${cellBase('')}
        <g data-at="4@0.1" data-fx="fade">${tube(1)}<text x="960" y="478" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">salt bridge</text></g>
        ${cellFrame('')}${electrodes}
        <text x="440" y="455" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">anode</text>
        <text x="1480" y="455" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">cathode</text>
        <g data-at="1@0.2" data-fx="fade">${BZ.map((_, i) => ion('x-bz' + i, 'gray', sup('Zn', '2+'))).join('')}</g>
        ${BC.map((_, i) => ion('x-bc' + i, 'pur', sup('Cu', '2+'))).join('')}
        <path class="x-ts" d="${TUBE}" fill="none" stroke="none"/>
        <g data-at="5@0.4" data-fx="fade">${[0, 1, 2].map((i) => `<g class="x-an${i}">${ball(0, 0, 14, 'red', '−', 20)}</g><g class="x-ca${i}">${ball(0, 0, 14, 'teal', '+', 20)}</g>`).join('')}</g>
        <g data-at="6@0.1" data-fx="fade"><text x="850" y="610" text-anchor="middle" font-size="30" font-weight="900" class="f-bad">← anions</text><text x="850" y="648" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">to anode</text></g>
        <g data-at="6@0.5" data-fx="fade"><text x="1070" y="610" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">cations →</text><text x="1070" y="648" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">to cathode</text></g>
        <g data-at="7@0.2" data-fx="pop"><text x="960" y="740" text-anchor="middle" font-size="34" font-weight="900" class="f-bad">✗ no ${sE}</text></g>
        <path class="x-ws" d="${WIRE}" fill="none" stroke="none"/>
        ${dots('x-bd', 6)}
        ${eArrows('')}
        ${voltmeter('')}
        <g data-at="3@0.3" data-out="5" data-fx="pop"><text x="440" y="628" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">+ + +</text><text x="1480" y="628" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">− − −</text></g>
        <g data-at="3@0.6" data-out="4" data-fx="pop"><text x="960" y="300" text-anchor="middle" font-size="34" font-weight="900" class="f-bad">electron flow stops</text></g>
        <g data-at="5@0.3" data-fx="pop"><text x="440" y="628" text-anchor="middle" font-size="30" font-weight="900" class="f-good">neutral</text><text x="1480" y="628" text-anchor="middle" font-size="30" font-weight="900" class="f-good">neutral</text></g>
      </svg>
      <div class="banner" style="top:880px" data-at="8" data-fx="pop">Wire: <span class="warm">electrons</span> &nbsp;·&nbsp; Salt bridge: <span class="teal">ions</span></div>`,
    update(c) {
      const b = c.b, s0 = b[0].start, a = b[3].start + 1.5, z = b[3].start + 4, r = b[4].start + 0.8
      const sg = (t, t0, t1) => Math.max(0, Math.min(1, (t - t0) / (t1 - t0)))
      const sp = (t) => (t < r ? 1 - sg(t, a, z) : sg(t, r, r + 1.2))
      let ph = 0
      for (let t = s0; t < c.t; t += 1 / 30) ph += sp(t) * 0.12 / 30
      runDots(c, '.x-ws', 'x-bd', 6, ph)
      BZ.forEach(([x, y], i) => { const p = eo(c.seg(b[1].start + 0.3 + 0.4 * i, b[1].start + 1.6 + 0.4 * i)); mv(c, '.x-bz' + i, lerp(548, x, p), lerp(y - 40, y, p), p > 0 ? 1 : 0) })
      BC.forEach(([x, y], i) => { const p = eio(c.seg(b[2].start + 0.2 + 0.4 * i, b[2].start + 1.5 + 0.4 * i)); mv(c, '.x-bc' + i, lerp(x, 1380, p), lerp(y, y - 20, p), 1 - c.seg(b[2].start + 1.1 + 0.4 * i, b[2].start + 1.6 + 0.4 * i)) })
      const ip = Math.max(0, c.t - b[5].start) * 0.09
      for (let i = 0; i < 3; i++) {
        const qa = along(c, '.x-ts', 1 - frac(ip + i / 3)), qc = along(c, '.x-ts', frac(ip + i / 3 + 0.16))
        mv(c, '.x-an' + i, qa.x, qa.y); mv(c, '.x-ca' + i, qc.x, qc.y)
      }
    },
  })

  // ---------- the trick: An Ox, Red Cat ----------
  EZ.scene('redcat', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Memory trick</div><h2 class="h1" data-at="in+0.2">An Ox, Red Cat</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:380px" data-at="1@0.05">
        <div class="x-big" style="top:60px"><span class="teal">AN</span> · <span class="teal">OX</span></div>
        <div class="x-row" style="top:250px;left:0;right:0;text-align:center;font-size:46px" data-at="2@0.1"><span class="teal">An</span>ode = <span class="teal">Ox</span>idation</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:380px" data-at="1@0.5">
        <div class="x-big" style="top:60px"><span class="pri">RED</span> · <span class="pri">CAT</span></div>
        <div class="x-row" style="top:250px;left:0;right:0;text-align:center;font-size:46px" data-at="2@0.55"><span class="pri">Red</span>uction = <span class="pri">Cat</span>hode</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3@0.1" data-fx="fade">
        <circle cx="560" cy="770" r="52" fill="rgba(60,199,188,.18)" stroke="${TEAL}" stroke-width="5"/><text x="560" y="790" text-anchor="middle" font-size="56" font-weight="900" class="f-teal">A</text>
        <circle cx="1360" cy="770" r="52" fill="rgba(141,141,240,.18)" stroke="#8d8df0" stroke-width="5"/><text x="1360" y="790" text-anchor="middle" font-size="56" font-weight="900" class="f-pri">C</text>
        <text x="490" y="782" text-anchor="end" font-size="34" font-weight="900" class="f-muted">anode</text><text x="1430" y="782" font-size="34" font-weight="900" class="f-muted">cathode</text>
        ${arrow(625, 770, 1290, 770, 'warm', 6)}<text x="960" y="740" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">${sE}</text></g>
        <g data-at="3@0.3" data-fx="fade"><g class="x-re">${ball(0, 0, 13, 'warm')}</g></g></svg>
      <div class="banner" style="top:860px" data-at="4" data-fx="pop">True for <span class="gold">every</span> cell: galvanic or electrolytic</div>`,
    update(c) {
      const k = frac(Math.max(0, c.t - c.b[3].start - 0.3) / 2.4)
      mv(c, '.x-re', lerp(640, 1250, k), 770, Math.min(1, 6 * k, 6 * (1 - k)))
    },
  })

  // ---------- galvanic vs electrolytic ----------
  const GS = 'M220 680C440 680 560 800 820 800', ES = 'M1090 800C1350 800 1470 680 1690 680'
  EZ.scene('compare', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two kinds of cell</div><h2 class="h1" data-at="in+0.2">Galvanic vs. electrolytic</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:520px" data-at="1"><h3 class="teal">Galvanic (voltaic)</h3>
        <div class="x-row" style="top:110px" data-at="1@0.3">thermodynamically <span class="good">favored</span></div>
        <div class="x-row" style="top:175px" data-at="2@0.1"><span class="teal">produces</span> electrical energy</div>
        <div class="x-row muted" style="top:240px;font-size:34px" data-at="2@0.5">e.g. a battery discharging</div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:520px" data-at="3"><h3 class="warm">Electrolytic</h3>
        <div class="x-row" style="top:110px" data-at="3@0.3">thermodynamically <span class="bad">unfavored</span></div>
        <div class="x-row" style="top:175px;font-size:36px" data-at="4@0.1"><span class="warm">requires</span> an external power source</div>
        <div class="x-row muted" style="top:240px;font-size:34px" data-at="5@0.1">e.g. electroplating, charging a battery</div>
        <div class="x-row" style="top:290px;font-size:34px" data-at="6@0.2">recharging a phone ${ARR} <span class="warm">electrolytic</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.6" data-fx="fade"><path class="x-gs" d="${GS}" fill="none" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/><g class="x-gb">${ball(0, 0, 20, 'teal')}</g></g>
        <g data-at="3@0.6" data-fx="fade"><path class="x-es" d="${ES}" fill="none" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/><g class="x-eb">${ball(0, 0, 20, 'warm')}</g></g>
        <g data-at="4@0.3" data-fx="pop"><path d="M1050 690L1026 740H1046L1036 784L1072 726H1050L1062 690Z" fill="${GOLD}" stroke="${WARM}" stroke-width="3" stroke-linejoin="round"/></g>
      </svg>
      <div class="banner" style="top:860px" data-at="7" data-fx="pop">Both: oxidation at the <span class="teal">anode</span>, reduction at the <span class="pri">cathode</span></div>`,
    update(c) {
      const b = c.b
      const g = along(c, '.x-gs', eio(c.seg(b[2].start + 0.2, b[2].start + 2.2))); mv(c, '.x-gb', g.x, g.y - 22)
      const e = along(c, '.x-es', eio(c.seg(b[4].start + 0.6, b[4].start + 2.6))); mv(c, '.x-eb', e.x, e.y - 22)
    },
  })

  // ---------- electrolysis of molten NaCl ----------
  const NA = [[820, 660], [1000, 760], [900, 790], [1100, 660]]
  const CL = [[930, 700], [1080, 780], [800, 760], [1010, 670]]
  const MW = 'M705 450V380H1215V450'
  EZ.scene('molten', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Electrolysis</div><h2 class="h1" data-at="in+0.2">Molten sodium chloride</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.1" data-fx="fade"><rect x="564" y="580" width="792" height="276" fill="rgba(243,167,100,.2)"/>${beaker(560, 1360, 520, 860)}${wire(MW)}
          <rect x="680" y="450" width="50" height="350" rx="6" fill="${ZN}"/><rect x="1190" y="450" width="50" height="350" rx="6" fill="${ZN}"/>
          <rect x="850" y="335" width="220" height="90" rx="16" fill="#1a1d2a" stroke="${GOLD}" stroke-width="5"/>
          <text x="960" y="370" text-anchor="middle" font-size="28" font-weight="900" class="f-gold">power</text><text x="960" y="405" text-anchor="middle" font-size="28" font-weight="900" class="f-gold">source</text>
          <text x="960" y="845" text-anchor="middle" font-size="26" font-weight="800" class="f-warm">molten NaCl</text></g>
        <g data-at="0@0.5" data-fx="fade">${NA.map((_, i) => ion('x-na' + i, 'pur', sup('Na', '+'))).join('')}${CL.map((_, i) => ion('x-cl' + i, 'green', sup('Cl', '−'), 26)).join('')}</g>
        <g data-at="1@0.2" data-fx="fade">${arrow(760, 345, 830, 345)}${arrow(1090, 345, 1160, 345)}
          <text x="795" y="326" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">${sE}</text><text x="1125" y="326" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">${sE}</text></g>
        <g data-at="1@0.4" data-out="4" data-fx="fade"><text x="960" y="490" text-anchor="middle" font-size="30" font-weight="900">forces an <tspan class="f-bad">unfavored</tspan> reaction</text></g>
        <g data-at="4@0.3" data-fx="pop"><text x="960" y="490" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">An Ox, Red Cat ✓</text></g>
        <g data-at="2@0.8" data-fx="fade"><rect x="1180" y="600" width="10" height="200" rx="4" fill="#d9dde8"/><text x="1110" y="560" text-anchor="middle" font-size="26" font-weight="900" class="f-pri">Na metal</text></g>
        <g data-at="3@0.6" data-fx="fade">${[0, 1, 2].map((i) => `<circle class="x-bb${i}" cx="0" cy="0" r="${9 + 3 * i}" fill="none" stroke="#7fe0a6" stroke-width="3"/>`).join('')}
          <text x="800" y="560" text-anchor="middle" font-size="26" font-weight="900" class="f-good">Cl${lo('2')}<tspan dy="-8"> gas</tspan></text></g>
        <g data-at="5@0.3" data-fx="fade"><text x="960" y="620" text-anchor="middle" font-size="28" font-weight="900" class="f-muted">ions free to move</text></g>
      </svg>
      <div class="x-lab" style="left:455px;width:500px;top:876px" data-at="3@0.1"><span class="teal">Anode</span> · oxidation</div>
      <div class="x-lab" style="left:455px;width:500px;top:926px;font-size:34px" data-at="3@0.2">2Cl<sup>−</sup> ${ARR} Cl<sub>2</sub> + 2${E}</div>
      <div class="x-lab" style="left:965px;width:500px;top:876px" data-at="2@0.1"><span class="pri">Cathode</span> · reduction</div>
      <div class="x-lab" style="left:965px;width:500px;top:926px;font-size:34px" data-at="2@0.2">Na<sup>+</sup> + ${E} ${ARR} Na</div>`,
    update(c) {
      const b = c.b
      NA.forEach(([x, y], i) => { const p = i < 2 ? eio(c.seg(b[2].start + 0.3 + 0.5 * i, b[2].start + 1.8 + 0.5 * i)) : 0; mv(c, '.x-na' + i, lerp(x, 1162, p), lerp(y, 640 + 80 * i, p), 1 - (i < 2 ? c.seg(b[2].start + 1.6 + 0.5 * i, b[2].start + 2.0 + 0.5 * i) : 0)) })
      CL.forEach(([x, y], i) => { const p = i < 2 ? eio(c.seg(b[3].start + 0.3 + 0.5 * i, b[3].start + 1.8 + 0.5 * i)) : 0; mv(c, '.x-cl' + i, lerp(x, 758, p), lerp(y, 680 + 80 * i, p), 1 - (i < 2 ? c.seg(b[3].start + 1.6 + 0.5 * i, b[3].start + 2.0 + 0.5 * i) : 0)) })
      const t0 = b[3].start + 1.8
      for (let i = 0; i < 3; i++) {
        const k = frac(Math.max(0, c.t - t0) / 2.2 + i / 3)
        mv(c, '.x-bb' + i, 752 + 6 * Math.sin(k * 9), lerp(760, 600, k), c.t > t0 ? Math.min(1, 5 * (1 - k)) : 0)
      }
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'It increases'], ['B', 'It decreases'], ['C', 'It stays the same'], ['D', 'It first increases and then decreases']]
  const OPT_AT = ['2@0.02', '2@0.22', '2@0.42', '2@0.64']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Zn/Cu cell: the <span class="teal">Zn electrode</span>'s mass?</h2>
      <div class="x-line muted" style="top:276px;font-size:34px" data-at="1@0.55">what happens to it over time?</div>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${140 + (i % 2) * 840}px;top:${350 + Math.floor(i / 2) * 160}px" data-at="${OPT_AT[i]}" data-fx="pop"><div class="l">${l}</div><span class="tx">${f}</span>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px" data-at="5" data-fx="pop">Zn is the <span class="teal">anode</span>: it is <span class="warm">oxidized</span></div>
      <div class="x-line" style="top:830px;font-size:40px" data-at="5@0.5">Zn(s) ${ARR} Zn<sup>2+</sup>(aq) + 2${E}</div>
      <div class="x-line" style="top:900px;font-size:38px" data-at="6">atoms dissolve as ions ${ARR} mass <span class="bad">decreases</span></div>`,
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
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="40" y="30" width="34" height="100" rx="5" fill="${ZN}"/><rect x="386" y="30" width="34" height="100" rx="5" fill="${CU}"/>
    <text x="57" y="22" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">A</text><text x="403" y="22" text-anchor="middle" font-size="26" font-weight="900" class="f-pri">C</text>
    ${arrow(100, 80, 350, 80, 'warm', 6)}<text x="225" y="62" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">${sE}</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><path d="M70 150V40H390V150" fill="none" stroke="#6a7194" stroke-width="40"/><path d="M70 150V40H390V150" fill="none" stroke="#2a2f44" stroke-width="28"/>
    ${ball(170, 40, 12, 'red', '−', 18)}${arrow(150, 40, 100, 40, 'bad', 4)}${ball(290, 40, 12, 'teal', '+', 18)}${arrow(310, 40, 360, 40, 'teal', 4)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><path d="M20 40C90 40 130 120 200 120" fill="none" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/>${ball(60, 26, 13, 'teal')}
    <path d="M260 120C330 120 370 40 440 40" fill="none" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/>${ball(286, 106, 13, 'warm')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Anode = <span class="teal">oxidation</span><br>Cathode = <span class="pri">reduction</span><br>${E}: anode ${ARR} cathode</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Salt bridge:<br><span class="bad">anions</span> ${ARR} anode<br><span class="teal">cations</span> ${ARR} cathode</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Galvanic: <span class="good">favored</span>,<br>produces energy<br>Electrolytic: <span class="bad">unfavored</span>,<br>needs energy</p></div>`,
  })
})()
