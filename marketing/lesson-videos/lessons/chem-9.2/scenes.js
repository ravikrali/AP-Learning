// Pictures for chem-9.2 "Calculating ΔS°". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, chem/book.ts): S° is absolute and > 0
// (perfect crystal at 0 K = 0); ΔS° = ΣS°(products) − ΣS°(reactants) × coefficients; J/(mol·K), not kJ;
// elements have S° ≠ 0 (O₂ 205.0), only ΔH°f and ΔG°f are zero; the NH₃ example (191.6, 130.7, 192.5 ->
// 385.0 − 583.7 = −198.7 J/K); the water check (69.9 -> 188.8, +118.9); the SO₂/SO₃ try (−187.8 J/K).
// Bar heights use the lesson's own S° values on one scale; molecule sizes are not to scale.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-row em{font-style:normal;font-size:30px;font-weight:800;color:var(--muted)}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-size:60px;font-weight:900;white-space:nowrap}
    .x-tile{position:absolute;top:380px;width:480px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .f{margin-top:52px;font-size:56px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tile .s{margin-top:18px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-k{position:relative;display:inline-block}
    .x-k::after{content:'';position:absolute;left:-6px;right:-6px;top:50%;height:6px;border-radius:3px;background:#f0707a;transform:rotate(-20deg)}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', PRI = '#8d8df0', GOOD = '#4cc781', LINE = '#363c54'
  const S0 = 'S°', DS = 'ΔS°'
  const H2 = 'H<sub>2</sub>', N2 = 'N<sub>2</sub>', O2 = 'O<sub>2</sub>', NH3 = 'NH<sub>3</sub>', H2O = 'H<sub>2</sub>O'
  const SO2 = 'SO<sub>2</sub>', SO3 = 'SO<sub>3</sub>'
  const DHF = 'ΔH°<sub>f</sub>', DGF = 'ΔG°<sub>f</sub>'
  // SVG text with a lowered subscript (kept at the end of a label)
  const lo = (base, s) => `${base}<tspan dy=".3em" font-size=".62em">${s}</tspan>`
  // small molecules: a diatomic pair, ammonia, water
  const di = (x, y, r, k) => `<g transform="translate(${x} ${y})">${ball(-r * 0.62, 0, r, k)}${ball(r * 0.62, 0, r, k)}</g>`
  const nh3 = (x, y, s = 1) => `<g transform="translate(${x} ${y})">${ball(-20 * s, 16 * s, 11 * s, 'gray')}${ball(20 * s, 16 * s, 11 * s, 'gray')}${ball(0, 0, 20 * s, 'pur')}${ball(0, 24 * s, 11 * s, 'gray')}</g>`
  const h2o = (x, y, s = 1) => `<g transform="translate(${x} ${y})">${ball(-19 * s, 13 * s, 11 * s, 'gray')}${ball(19 * s, 13 * s, 11 * s, 'gray')}${ball(0, 0, 19 * s, 'red')}</g>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)

  // ---------- intro: a faint row of gas molecules ----------
  const IX = Array.from({ length: 12 }, (_, i) => 330 + i * 115)
  EZ.intro = {
    chips: [['1@0.3', 'The equation'], ['1@0.55', 'A worked example'], ['1@0.85', 'The element trap']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.26">${IX.map((x, i) => `<g class="x-im${i}">${i % 3 === 0 ? nh3(0, 0, 1.2) : i % 3 === 1 ? di(0, 0, 16, 'gray') : di(0, 0, 22, 'pur')}</g>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      IX.forEach((x, i) => mv(c, '.x-im' + i, x, 885 + 10 * Math.sin(t * 1.1 + i * 0.9)))
    },
  }

  // ---------- hook: entropy has absolute values ----------
  const LAT = Array.from({ length: 20 }, (_, i) => [300 + (i % 5) * 100, 470 + Math.floor(i / 5) * 80])
  const HB = [['x-hb0', `${H2O}(l)`, 69.9, PRI], ['x-hb1', `${H2O}(g)`, 188.8, TEAL], ['x-hb2', `${O2}(g)`, 205.0, GOLD]]
  const HX = [1110, 1340, 1570], HAT = [3, 5, 4], HS = 1.4, HZ = 760
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it's different</div><h2 class="h1" data-at="1">Entropy has <span class="gold">absolute</span> values</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="2"><h3>Perfect crystal at 0 K</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.2" data-fx="fade">${LAT.map(([x, y]) => ball(x, y, 30, 'gray')).join('')}</g>
      </svg>
      <div class="x-lab gold" style="left:120px;width:810px;top:760px;font-size:46px" data-at="2@0.6" data-fx="pop">S = 0</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="3"><h3>Real substances</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3" data-fx="fade"><line x1="1040" y1="${HZ}" x2="1760" y2="${HZ}" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/>
          <text x="1030" y="${HZ + 10}" text-anchor="end" font-size="30" font-weight="900" class="f-muted">0</text></g>
        ${HB.map(([k, , v, col], i) => `<rect class="${k}" x="${HX[i] - 70}" y="${HZ}" width="140" height="0" rx="10" style="fill:${col}"/>
          <g data-at="${HAT[i]}@0.5" data-fx="fade"><text x="${HX[i]}" y="${HZ - v * HS - 16}" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">${v.toFixed(1)}</text></g>`).join('')}
      </svg>
      ${HB.map(([, n], i) => `<div class="x-lab" style="left:${HX[i] - 110}px;width:220px;top:${HZ + 12}px;font-size:32px" data-at="${HAT[i]}" data-fx="fade">${n}</div>`).join('')}
      <div class="x-chip gold" style="left:1530px;top:326px;background:rgba(242,196,67,.12)" data-at="4" data-fx="pop">every ${S0} &gt; 0</div>
      <div class="x-lab muted" style="left:1040px;width:400px;top:400px;font-size:28px;text-align:left" data-at="3@0.5" data-fx="fade">${S0} in J/(mol·K)</div>
      <div class="banner" style="top:870px" data-at="6" data-fx="pop">${DS} = <span class="teal">products</span> − <span class="pri">reactants</span></div>`,
    update(c) {
      const b = c.b
      HB.forEach(([k, , v], i) => {
        const t0 = b[HAT[i]].start, h = v * HS * eio(c.seg(t0, t0 + 0.9))
        const el = c.$('.' + k)
        el.setAttribute('y', HZ - h)
        el.setAttribute('height', h)
      })
    },
  })

  // ---------- the equation ----------
  const TL = [['×', 'coefficients', `2${NH3} counts 2 × ${S0}`, 2], [null, 'J/(mol·K)', '', 3], [null, `elements: ${S0} ≠ 0`, `unlike ${DHF}`, 5]]
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="in+0.2">Products minus reactants</h2>
      <div class="card" style="left:120px;top:300px;width:1680px;height:540px" data-at="0" data-fx="fade"></div>
      <div class="x-eq" style="top:345px" data-at="1">${DS}<sub>rxn</sub> = Σ${S0}(<span class="teal">products</span>) − Σ${S0}(<span class="pri">reactants</span>)</div>
      <div class="x-tile" style="left:200px;top:540px;width:480px" data-at="2" data-fx="pop"><div class="f">× <span class="gold">coefficients</span></div><div class="s">2${NH3} counts 2 × ${S0}</div></div>
      <div class="x-tile" style="left:720px;top:540px;width:480px" data-at="3" data-fx="pop"><div class="f gold">J/(mol·K)</div><div class="s" data-at="4">joules, <span class="x-k">not kJ</span></div></div>
      <div class="x-tile" style="left:1240px;top:540px;width:480px" data-at="5" data-fx="pop"><div class="f">elements: <span class="gold">${S0} ≠ 0</span></div><div class="s">unlike ${DHF}</div></div>`,
  })

  // ---------- worked example: making ammonia ----------
  const SC = 0.55, BZ = 770
  const RX = 1060, PXB = 1520, BW = 180
  const RSEG = [['pur', N2, 191.6], ['gray', H2, 130.7], ['gray', H2, 130.7], ['gray', H2, 130.7]]
  const PSEG = [['teal', NH3, 192.5], ['teal', NH3, 192.5]]
  const stack = (x, segs, cp) => {
    let y = BZ
    return `<g clip-path="url(#${cp})">${segs.map(([k, n, v]) => {
      const h = v * SC; y -= h
      const sub = n.match(/^(\w+)<sub>(\d)<\/sub>$/)
      return `<rect x="${x}" y="${y + 2}" width="${BW}" height="${h - 4}" rx="8" fill="url(#g-${k})"/><text x="${x + BW / 2}" y="${y + h / 2 + 8}" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">${lo(sub[1], sub[2])}</text>`
    }).join('')}</g>`
  }
  const RT = 583.7 * SC, PT = 385.0 * SC
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Making ammonia</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.3"><h3>Given</h3>
        <div class="x-row" style="top:90px;font-size:44px" data-at="1">${N2}(g) + 3${H2}(g) ${ARR} 2${NH3}(g)</div>
        <div class="x-row" style="top:170px" data-at="2"><span class="pri">${N2}</span> &nbsp;191.6</div>
        <div class="x-row" style="top:230px" data-at="2@0.33"><span class="muted">${H2}</span> &nbsp;130.7</div>
        <div class="x-row" style="top:290px" data-at="2@0.66"><span class="teal">${NH3}</span> &nbsp;192.5 &nbsp;<em>${S0} in J/(mol·K)</em></div>
        <div class="x-row" style="top:385px;font-size:34px" data-at="3"><span class="teal">Products:</span> 2(192.5) = 385.0</div>
        <div class="x-row" style="top:445px;font-size:34px" data-at="4"><span class="pri">Reactants:</span> 191.6 + 3(130.7) = 583.7</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="3"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="x-cpR"><rect class="x-cr" x="${RX - 5}" y="${BZ}" width="${BW + 10}" height="0"/></clipPath>
          <clipPath id="x-cpP"><rect class="x-cp" x="${PXB - 5}" y="${BZ}" width="${BW + 10}" height="0"/></clipPath></defs>
        <g data-at="3" data-fx="fade"><line x1="1030" y1="${BZ}" x2="1760" y2="${BZ}" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/>
          <text x="${RX + BW / 2}" y="${BZ + 42}" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">reactants</text>
          <text x="${PXB + BW / 2}" y="${BZ + 42}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">products</text></g>
        ${stack(RX, RSEG, 'x-cpR')}${stack(PXB, PSEG, 'x-cpP')}
        <g data-at="3@0.7" data-fx="fade"><text x="${PXB + BW / 2}" y="${BZ - PT - 16}" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">385.0</text></g>
        <g data-at="4@0.8" data-fx="fade"><text x="${RX + BW / 2}" y="${BZ - RT - 16}" text-anchor="middle" font-size="36" font-weight="900" class="f-pri">583.7</text></g>
        <g data-at="5" data-fx="fade"><line x1="${RX + BW + 8}" y1="${BZ - PT}" x2="${PXB - 8}" y2="${BZ - PT}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="12 10"/>
          <path d="M${RX + BW + 22} ${BZ - RT}H${RX + BW + 36}V${BZ - PT}H${RX + BW + 22}" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linejoin="round"/></g>
        <g data-at="6" data-fx="fade"><text x="${(RX + BW + PXB) / 2 + 20}" y="${BZ - (RT + PT) / 2 + 14}" text-anchor="middle" font-size="44" font-weight="900" class="f-gold">−198.7</text></g>
      </svg>
      <div class="banner" style="top:870px" data-at="6" data-fx="pop">${DS} = 385.0 − 583.7 = <span class="gold">−198.7 J/K</span></div>`,
    update(c) {
      const b = c.b
      const hp = PT * eio(c.seg(b[3].start + 0.3, b[3].start + 1.4)), hr = RT * eio(c.seg(b[4].start + 0.3, b[4].start + 1.8))
      const p = c.$('.x-cp'), r = c.$('.x-cr')
      p.setAttribute('y', BZ - hp); p.setAttribute('height', hp)
      r.setAttribute('y', BZ - hr); r.setAttribute('height', hr)
    },
  })

  // ---------- check the sign ----------
  const GL = [[320, 1, 1], [470, 0, 0.35], [470, 0, 0.6], [470, 0, 0.85]]
  const VAP = [[1430, 470], [1560, 540], [1690, 460], [1470, 640], [1640, 650], [1560, 730]]
  const LIQ = [[1090, 700], [1150, 700], [1210, 700], [1120, 650], [1180, 650], [1150, 750]]
  EZ.scene('check', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Check the sign</div><h2 class="h1" data-at="in+0.2">Does the sign make sense?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3>Making ammonia</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="fade">${di(250, 520, 26, 'pur')}${[0, 1, 2].map((i) => di(370 + i * 95, 520, 17, 'gray')).join('')}</g>
        <g data-at="1@0.5" data-fx="fade"><path d="M600 520H665" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>${nh3(730, 505, 1.3)}${nh3(840, 505, 1.3)}</g>
      </svg>
      <div class="x-lab pri" style="left:150px;width:420px;top:600px;font-size:36px" data-at="1@0.3" data-fx="fade">4 mol gas</div>
      <div class="x-lab teal" style="left:650px;width:260px;top:600px;font-size:36px" data-at="1@0.6" data-fx="fade">2 mol gas</div>
      <div class="x-lab" style="left:120px;width:810px;top:690px;font-size:38px" data-at="2" data-fx="fade">less dispersal ${ARR} <span class="gold">${DS} &lt; 0</span> <span class="good">✓</span></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="3"><h3>Water boiling</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.3" data-fx="fade"><rect x="1040" y="610" width="230" height="180" rx="20" fill="rgba(141,141,240,.12)" stroke="${PRI}" stroke-width="3"/>${LIQ.map(([x, y]) => h2o(x + 5, y)).join('')}
          <path d="M1295 640H1360" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></g>
        <g data-at="3@0.6" data-fx="fade">${VAP.map((_, i) => `<g class="x-v${i}">${h2o(0, 0)}</g>`).join('')}</g>
      </svg>
      <div class="x-lab pri" style="left:1015px;width:280px;top:548px;font-size:32px" data-at="4" data-fx="fade">${H2O}(l) 69.9</div>
      <div class="x-lab teal" style="left:1440px;width:300px;top:370px;font-size:32px" data-at="4@0.5" data-fx="fade">${H2O}(g) 188.8</div>
      <div class="x-lab good" style="left:1360px;width:440px;top:770px;font-size:40px" data-at="5" data-fx="pop">${DS} = +118.9 J/K</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="5@0.6" data-fx="pop">The sign should match the <span class="gold">dispersal</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      const p = eo(c.seg(b[3].start + 0.6, b[3].start + 2.0))
      VAP.forEach(([x, y], i) => {
        const w = t > b[5].start + 2 ? 0 : 1
        mv(c, '.x-v' + i, lerp(1180, x, p) + w * 4 * Math.sin(t * 2 + i), lerp(680, y, p) + w * 4 * Math.cos(t * 1.7 + i * 2))
      })
    },
  })

  // ---------- trap: elements have S° ≠ 0 ----------
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Elements are <span class="gold">not</span> zero</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="pop">${di(380, 530, 62, 'red')}</g>
        <g data-at="1@0.5" data-fx="pop">${di(700, 545, 38, 'gray')}</g>
      </svg>
      <div class="x-lab" style="left:230px;width:300px;top:625px" data-at="1@0.3" data-fx="fade">${O2}(g)</div>
      <div class="x-lab" style="left:600px;width:200px;top:625px" data-at="1@0.6" data-fx="fade">${H2}(g)</div>
      <div class="x-lab gold" style="left:120px;width:810px;top:720px;font-size:50px" data-at="1@0.8" data-fx="pop">${S0} ≠ 0</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2"><h3>For ${O2}(g)</h3>
        <div class="x-row" style="top:100px;font-size:52px" data-at="2@0.5" data-out="3+0.9"><span class="muted">${S0} = ?</span></div>
        <div class="x-row" style="top:100px;font-size:52px" data-at="3+0.9" data-out="4-0.2"><span class="bad">${S0} = 0 ?</span> <em>✗ not for an element</em></div>
        <div class="x-row" style="top:100px;font-size:52px" data-at="4"><span class="gold">${S0} = 205.0</span> <em>J/(mol·K)</em></div>
        <div class="x-row" style="top:200px;height:4px;background:${LINE};right:44px" data-at="5"></div>
        <div class="x-row" style="top:240px;font-size:48px" data-at="5@0.2">${DHF} = <span class="good">0</span></div>
        <div class="x-row" style="top:320px;font-size:48px" data-at="5@0.5">${DGF} = <span class="good">0</span></div>
        <div class="x-row muted" style="top:420px;font-size:34px" data-at="5@0.8">only these are zero for elements</div></div>
      <div class="banner" style="top:870px" data-at="6" data-fx="pop">Never drop an element from a <span class="gold">${DS}</span> calculation</div>`,
  })

  // ---------- try it ----------
  const GIV = [[SO2, '248.2', 'pri'], [O2, '205.0', 'gold'], [SO3, '256.8', 'teal']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Find <span class="teal">${DS}</span></h2>
      <div class="x-line" style="top:282px;font-size:48px" data-at="1@0.3">2${SO2}(g) + ${O2}(g) ${ARR} 2${SO3}(g)</div>
      ${GIV.map(([f, v, k], i) => `<div class="x-tile" style="left:${180 + i * 540}px" data-at="2@${(0.1 + i * 0.3).toFixed(2)}" data-fx="pop"><div class="f"><span class="${k}">${f}</span> &nbsp;${v}</div><div class="s">${S0} in J/(mol·K)</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="${LINE}" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:650px" data-at="4" data-fx="pop">${DS} = <span class="gold">−187.8 J/K</span></div>
      <div class="x-line" style="top:780px;font-size:38px" data-at="5"><span class="teal">Products</span> 2(256.8) = 513.6 &nbsp;·&nbsp; <span class="pri">Reactants</span> 2(248.2) + <span class="gold">205.0</span> = 701.4</div>
      <div class="x-line" style="top:850px;font-size:38px" data-at="6">513.6 − 701.4 = −187.8 &nbsp;·&nbsp; the <span class="gold">${O2}</span> counted, even as an element</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><line x1="80" y1="140" x2="380" y2="140" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/>
    <rect x="120" y="20" width="90" height="118" rx="8" style="fill:${PRI}"/><rect x="250" y="62" width="90" height="76" rx="8" style="fill:${TEAL}"/></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="92" text-anchor="middle" font-size="58" font-weight="900" class="f-gold">J/(mol·K)</text></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${di(160, 78, 40, 'red')}<text x="320" y="92" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">S° &gt; 0</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Σ${S0}(<span class="teal">products</span>)<br>− Σ${S0}(<span class="pri">reactants</span>),<br>× <span class="gold">coefficients</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Units of ${S0}<br>joules, not kJ</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Elements have<br><span class="gold">nonzero</span> ${S0}</p></div>`,
  })
})()
