// Pictures for chem-9.1 "Introduction to Entropy". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts): entropy = dispersal of matter and energy;
// S(gas) >> S(liquid) > S(solid); larger gas volume (constant T), higher T (broader KE distribution), dissolving
// (usually), more gas moles; dn(gas) predicts the sign of dS (2H2O2 -> 2H2O + O2, CaCO3 -> CaO + CO2);
// the N2 + 3H2 -> 2NH3 try. Particle counts, bar heights and curves show order only, never values.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:38px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-lab small{display:block;margin-top:2px;font-size:28px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-bar{position:absolute;width:140px;border-radius:14px 14px 0 0}
    .x-base{position:absolute;height:6px;border-radius:3px;background:#363c54}
    .x-eqr{position:absolute;left:170px;display:flex;align-items:flex-start;gap:26px}
    .x-tm{display:flex;flex-direction:column;align-items:center}
    .x-f{height:70px;display:flex;align-items:center;font-size:52px;font-weight:900;white-space:nowrap}
    .x-n{margin-top:6px;font-size:30px;font-weight:900;white-space:nowrap}
    .x-res{position:absolute;left:1360px;width:400px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap;line-height:1.3}
    .x-tile{position:absolute;width:800px;height:122px;border-radius:28px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tile .l{flex:none;margin:0 26px 0 24px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;line-height:52px;text-align:center;color:var(--muted)}
    .x-tile .g{position:absolute;right:26px;font-size:32px}
    .x-tile .ok{position:absolute;right:18px;top:29px;width:60px;height:60px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', PRI = '#8d8df0'
  const DN = 'Δn<sub>gas</sub>'
  let seed = 11
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  const box = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="rgba(141,141,240,.06)" stroke="#a3abbd" stroke-width="5"/>`

  // ---------- intro: solid -> liquid -> gas, faintly, along the bottom ----------
  const IS = Array.from({ length: 6 }, (_, i) => [250 + (i % 3) * 30, 880 + Math.floor(i / 3) * 30])
  const IL = [[860, 905], [895, 890], [930, 910], [968, 895], [1000, 912], [1035, 893]]
  const IG = [[1380, 880], [1480, 925], [1570, 870], [1660, 915], [1740, 875], [1820, 920]]
  EZ.intro = {
    chips: [['1@0.3', 'What entropy measures'], ['1@0.55', 'What makes it go up'], ['1@0.85', 'Predicting its sign']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.3">${IS.map(([x, y]) => ball(x, y, 14, 'pur')).join('')}${IL.map(([x, y]) => ball(x, y, 14, 'pur')).join('')}
      ${IG.map((_, i) => `<g class="x-ig${i}">${ball(0, 0, 14, 'pur')}</g>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      IG.forEach(([x, y], i) => mv(c, '.x-ig' + i, x + 18 * Math.sin(t * 0.9 + i * 1.7), y + 12 * Math.cos(t * 0.8 + i * 2.3)))
    },
  }

  // ---------- hook: perfume spreads through a room ----------
  const HP = Array.from({ length: 18 }, (_, i) => ({ s: [238 + (i % 4) * 22, 735 + Math.floor(i / 4) * 20], e: [400 + rnd() * 760, 380 + rnd() * 410] }))
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Why does a smell fill a room?</h2>
      <div class="card" style="left:120px;top:300px;width:1100px;height:540px" data-at="0" data-fx="fade"><h3>A room</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><path d="M252 690V660H290V690L325 712V820Q325 832 313 832H217Q205 832 205 820V712Z" fill="rgba(60,199,188,.10)" stroke="#a3abbd" stroke-width="5" stroke-linejoin="round"/></g>
        <g data-at="0@0.5" data-fx="fade">${HP.map((_, i) => `<g class="x-hp${i}">${ball(0, 0, 10, 'teal')}</g>`).join('')}</g>
      </svg>
      <div class="card" style="left:1280px;top:300px;width:520px;height:540px" data-at="2"><h3>On their own</h3>
        <div class="x-row" style="top:130px">spread out</div><div class="x-row good" style="top:190px;font-size:34px">happens</div>
        <div class="x-row" style="top:300px" data-at="3">gather back</div><div class="x-row bad" style="top:360px;font-size:34px" data-at="3@0.4" data-fx="pop">never</div></div>
      <div class="banner" style="top:870px" data-at="4" data-out="5-0.35" data-fx="pop">Nature tends toward <span class="gold">spreading out</span></div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop"><span class="gold">Entropy (S)</span> measures that spreading</div>`,
    update(c) {
      const b = c.b
      HP.forEach(({ s, e }, i) => {
        const t0 = b[1].start + i * 0.1, p = eio(c.seg(t0, t0 + 2.4))
        const lift = Math.sin(Math.PI * p) * 90
        mv(c, '.x-hp' + i, lerp(s[0], e[0], p), lerp(s[1], e[1], p) - lift)
      })
    },
  })

  // ---------- what entropy measures ----------
  const MC = Array.from({ length: 12 }, (_, i) => ({ s: [470 + (i % 4) * 36, 610 + Math.floor(i / 4) * 34], e: [215 + (i % 4) * 190 + rnd() * 50, 550 + Math.floor(i / 4) * 85 + rnd() * 30] }))
  const EG = Array.from({ length: 12 }, (_, i) => [1160 + (i % 4) * 160, 565 + Math.floor(i / 4) * 90])
  EZ.scene('meaning', {
    html: `<div class="kicker" data-at="in" data-fx="left">The idea</div><h2 class="h1" data-at="in+0.2">What entropy measures</h2>
      <div class="x-line" style="top:282px" data-at="1">Entropy = a measure of the <span class="gold">dispersal</span> of <span class="pri">matter</span> and <span class="warm">energy</span></div>
      <div class="x-line muted" style="top:350px;font-size:34px" data-at="2">dispersal = how spread out something is</div>
      <div class="card" style="left:120px;top:440px;width:810px;height:420px" data-at="3"><h3 class="pri">Matter</h3></div>
      <div class="card" style="left:990px;top:440px;width:810px;height:420px" data-at="4"><h3 class="warm">Energy</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.1" data-fx="fade">${MC.map((_, i) => `<g class="x-m${i}">${ball(0, 0, 17, 'pur')}</g>`).join('')}</g>
        <g data-at="4@0.1" data-fx="fade">${EG.map(([x, y]) => ball(x, y, 22, 'gray')).join('')}<g class="x-eall">${EG.map(([x, y]) => ball(x, y, 22, 'warm')).join('')}</g><g class="x-e1">${ball(EG[5][0], EG[5][1], 22, 'warm')}</g></g>
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:792px;font-size:34px" data-at="3@0.75" data-fx="fade">more spread out ${ARR} <span class="good">S increases</span></div>
      <div class="x-lab" style="left:990px;width:810px;top:792px;font-size:34px" data-at="4@0.75" data-fx="fade">more spread out ${ARR} <span class="good">S increases</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[3].start + 0.4, b[3].start + 2.0))
      MC.forEach(({ s, e }, i) => mv(c, '.x-m' + i, lerp(s[0], e[0], p), lerp(s[1], e[1], p)))
      const q = eio(c.seg(b[4].start + 0.6, b[4].start + 2.0))
      c.$('.x-eall').style.opacity = String(0.45 * q)
      c.$('.x-e1').style.opacity = String(1 - 0.55 * q)
    },
  })

  // ---------- phase changes ----------
  const SOL = Array.from({ length: 9 }, (_, i) => [356 + (i % 3) * 44, 492 + Math.floor(i / 3) * 44])
  const LIQ = [[885, 576], [925, 570], [966, 578], [1008, 572], [1040, 576], [903, 536], [946, 532], [990, 540], [1028, 530]]
  const GAS = [[1410, 395], [1520, 390], [1625, 410], [1450, 470], [1565, 465], [1630, 520], [1415, 545], [1505, 540], [1600, 560]]
  const BARS = [[400, 34, 'rgba(141,141,240,.55)', '3@0.15'], [960, 74, 'rgba(141,141,240,.75)', '3@0.4'], [1520, 200, PRI, '3@0.65']]
  EZ.scene('phases', {
    html: `<div class="kicker" data-at="in" data-fx="left">Phase changes</div><h2 class="h1" data-at="in+0.2">Solid ${ARR} liquid ${ARR} gas</h2>
      <div class="x-line" style="top:272px;font-size:40px" data-at="4@0.25">S(gas) <span class="gold">≫</span> S(liquid) <span class="gold">&gt;</span> S(solid)</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">${box(290, 400, 220, 200)}${SOL.map(([x, y]) => ball(x, y, 19, 'pur')).join('')}</g>
        <g data-at="1@0.3" data-fx="fade">${box(850, 400, 220, 200)}${LIQ.map((_, i) => `<g class="x-l${i}">${ball(0, 0, 19, 'pur')}</g>`).join('')}</g>
        <g data-at="1@0.15" data-fx="fade"><line x1="535" y1="505" x2="822" y2="505" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/><text x="680" y="482" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">freer to move</text></g>
        <g data-at="2@0.2" data-fx="fade">${box(1360, 350, 320, 250)}${GAS.map((_, i) => `<g class="x-g${i}">${ball(0, 0, 19, 'pur')}</g>`).join('')}</g>
        <g data-at="2@0.1" data-fx="fade"><line x1="1095" y1="505" x2="1332" y2="505" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/><text x="1215" y="482" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">freer still</text></g>
      </svg>
      <div class="x-lab" style="left:250px;width:300px;top:612px" data-at="0@0.4" data-fx="fade">solid<small data-at="5" data-fx="fade">H<sub>2</sub>O(s)</small></div>
      <div class="x-lab" style="left:810px;width:300px;top:612px" data-at="1@0.3" data-fx="fade">liquid<small data-at="5" data-fx="fade">H<sub>2</sub>O(l)</small></div>
      <div class="x-lab" style="left:1370px;width:300px;top:612px" data-at="2@0.2" data-fx="fade">gas<small data-at="5" data-fx="fade">H<sub>2</sub>O(g)</small></div>
      <div class="x-lab teal" style="left:1690px;width:200px;top:440px;font-size:28px" data-at="2@0.6" data-fx="fade">larger<br>volume</div>
      <div data-at="3" data-fx="fade"><div class="x-base" style="left:250px;top:920px;width:1420px"></div>
        <div class="x-lab muted" style="left:60px;width:200px;top:870px;font-size:30px">entropy</div></div>
      ${BARS.map(([cx, h, col, at]) => `<div class="x-bar" style="left:${cx - 70}px;top:${920 - h}px;height:${h}px;background:${col}" data-at="${at}"></div>`).join('')}
      <div class="x-bar" style="left:1446px;top:716px;height:204px;width:148px;background:none;border:4px solid ${GOLD}" data-at="5@0.4" data-fx="fade"></div>
      <div class="x-lab gold" style="left:1610px;width:260px;top:790px;font-size:34px" data-at="5@0.4" data-fx="fade">highest</div>`,
    update(c) {
      const t = c.t
      LIQ.forEach(([x, y], i) => mv(c, '.x-l' + i, x + 3 * Math.sin(t * 2.1 + i), y + 2 * Math.cos(t * 1.8 + i * 1.3)))
      GAS.forEach(([x, y], i) => mv(c, '.x-g' + i, x + 16 * Math.sin(t * 0.9 + i * 1.9), y + 12 * Math.cos(t * 0.8 + i * 2.7)))
    },
  })

  // ---------- volume, temperature, dissolving ----------
  const VP = [[0.18, 520], [0.5, 470], [0.82, 545], [0.3, 610], [0.7, 625], [0.5, 560]]
  const kd = (s, peak) => { const pts = []; for (let v = 0; v <= 430; v += 6) pts.push(`${(740 + v).toFixed(0)} ${(720 - (peak * (v * v / (2 * s * s)) * Math.exp(1 - v * v / (2 * s * s)))).toFixed(1)}`); return 'M' + pts.join('L') }
  const DS = Array.from({ length: 9 }, (_, i) => ({ s: [1490 + (i % 3) * 30, 690 + Math.floor(i / 3) * -30], e: [1360 + rnd() * 340, 470 + rnd() * 240] }))
  EZ.scene('more', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">More dispersal</div><h2 class="h1" data-at="in+0.2">Three more ways S goes up</h2>
      <div class="card" style="left:120px;top:320px;width:540px;height:590px" data-at="1"><h3>Bigger volume</h3></div>
      <div class="card" style="left:690px;top:320px;width:540px;height:590px" data-at="3"><h3>Higher temperature</h3></div>
      <div class="card" style="left:1260px;top:320px;width:540px;height:590px" data-at="5"><h3>Dissolving</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.1" data-fx="fade"><rect class="x-vb" x="170" y="440" width="200" height="220" rx="18" fill="rgba(141,141,240,.06)" stroke="#a3abbd" stroke-width="5"/>
          ${VP.map((_, i) => `<g class="x-v${i}">${ball(0, 0, 16, 'pur')}</g>`).join('')}</g>
        <g data-at="3@0.1" data-fx="fade"><line x1="740" y1="440" x2="740" y2="720" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/><line x1="740" y1="720" x2="1190" y2="720" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/>
          <text x="965" y="758" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">kinetic energy</text><text x="756" y="440" font-size="26" font-weight="800" class="f-muted">particles</text>
          <path d="${kd(55, 230)}" fill="none" stroke="${TEAL}" stroke-width="7" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 2" class="x-k1"/>
          <text x="855" y="500" font-size="28" font-weight="900" class="f-teal">low T</text></g>
        <g data-at="3@0.45" data-fx="fade"><path d="${kd(110, 115)}" fill="none" stroke="${WARM}" stroke-width="7" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 2" class="x-k2"/></g>
        <g data-at="3@0.95" data-fx="fade"><text x="1050" y="580" font-size="28" font-weight="900" class="f-warm">high T</text></g>
        <g data-at="5@0.05" data-fx="fade"><path d="M1330 440V720Q1330 750 1360 750H1700Q1730 750 1730 720V440" fill="rgba(60,199,188,.08)" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/>
          ${DS.map((_, i) => `<g class="x-d${i}">${ball(0, 0, 14, 'warm')}</g>`).join('')}</g>
      </svg>
      <div class="x-lab muted" style="left:120px;width:540px;top:690px;font-size:30px" data-at="1@0.5" data-fx="fade">same temperature</div>
      <div class="x-lab" style="left:120px;width:540px;top:780px;font-size:34px" data-at="2@0.3" data-fx="fade">more space ${ARR} <span class="good">S increases</span></div>
      <div class="x-lab" style="left:690px;width:540px;top:800px;font-size:34px" data-at="4@0.3" data-fx="fade">energy more spread out<br><span class="good">S increases</span></div>
      <div class="x-lab" style="left:1260px;width:540px;top:780px;font-size:34px" data-at="5@0.7" data-fx="fade">usually <span class="good">S increases</span></div>`,
    update(c) {
      const b = c.b, w = lerp(200, 440, eio(c.seg(b[1].start + 0.8, b[1].start + 2.4)))
      c.$('.x-vb').setAttribute('width', w.toFixed(1))
      VP.forEach(([f, y], i) => mv(c, '.x-v' + i, 170 + 26 + f * (w - 52) + 6 * Math.sin(c.t * 1.1 + i * 2), y))
      c.$('.x-k1').setAttribute('stroke-dashoffset', 1 - eio(c.seg(b[3].start + 0.1, b[3].start + 1.1)))
      c.$('.x-k2').setAttribute('stroke-dashoffset', 1 - eio(c.seg(b[3].start + 0.45 * (b[3].end - b[3].start), b[3].end)))
      const p = eio(c.seg(b[5].start + 0.5, b[5].start + 3.0))
      DS.forEach(({ s, e }, i) => mv(c, '.x-d' + i, lerp(s[0], e[0], p), lerp(s[1], e[1], p)))
    },
  })

  // ---------- gas moles in reactions ----------
  const gbox = (x, n) => `${box(x, 560, 250, 200)}${(n === 2 ? [[0.3, 0.4], [0.7, 0.65]] : [[0.22, 0.3], [0.7, 0.25], [0.35, 0.72], [0.78, 0.7]]).map(([fx, fy]) => ball(x + fx * 250, 560 + fy * 200, 22, 'teal')).join('')}`
  const side = (L, a, b2) => `${gbox(L + 60, a)}<line x1="${L + 335}" y1="660" x2="${L + 470}" y2="660" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>${gbox(L + 500, b2)}`
  EZ.scene('gas', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reactions</div><h2 class="h1" data-at="in+0.2">Count the moles of gas</h2>
      <div class="x-line" style="top:282px" data-at="1"><span class="pri">reactants</span> ${ARR} <span class="pri">products</span> &nbsp;<span class="muted">· moles of gas on each side?</span></div>
      <div class="x-line teal" style="top:352px;font-size:36px" data-at="2">gas particles: the most spread out of all</div>
      <div class="card" style="left:120px;top:440px;width:810px;height:430px" data-at="3"><h3>More gas moles in the products</h3></div>
      <div class="card" style="left:990px;top:440px;width:810px;height:430px" data-at="4"><h3>Fewer gas moles in the products</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="3@0.2" data-fx="fade">${side(120, 2, 4)}</g><g data-at="4@0.2" data-fx="fade">${side(990, 4, 2)}</g></svg>
      <div class="x-lab good" style="left:120px;width:810px;top:790px;font-size:36px" data-at="3@0.6" data-fx="pop">S increases</div>
      <div class="x-lab bad" style="left:990px;width:810px;top:790px;font-size:36px" data-at="4@0.6" data-fx="pop">S decreases</div>`,
  })

  // ---------- trick: count the gas moles first ----------
  const term = (f, n, at) => `<div class="x-tm"><div class="x-f"><span>${f}</span></div>${n == null ? '' : `<div class="x-n ${n ? 'teal' : 'muted'}" data-at="${at}" data-fx="fade">${n} mol gas</div>`}</div>`
  const op = (s) => `<div class="x-tm"><div class="x-f muted"><span>${s}</span></div></div>`
  EZ.scene('trick', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="in+0.2">Count the gas moles first</h2>
      <div class="x-line" style="top:280px" data-at="1"><span class="gold">${DN}</span> = (mol gas products) − (mol gas reactants)</div>
      <div class="x-chip good" style="left:390px;top:360px;background:rgba(76,199,129,.12)" data-at="2" data-fx="pop">${DN} &gt; 0 ${ARR} ΔS &gt; 0</div>
      <div class="x-chip bad" style="left:1060px;top:360px;background:rgba(240,112,122,.12)" data-at="3" data-fx="pop">${DN} &lt; 0 ${ARR} ΔS &lt; 0</div>
      <div class="card" style="left:120px;top:460px;width:1680px;height:420px" data-at="4"></div>
      <div class="x-eqr" style="top:500px" data-at="4@0.2">${term('2H<sub>2</sub>O<sub>2</sub>(l)', 0, '5@0.15')}${op(ARR)}${term('2H<sub>2</sub>O(l)', 0, '5@0.6')}${op('+')}${term('O<sub>2</sub>(<span class="teal">g</span>)', 1, '5@0.75')}</div>
      <div class="x-res" style="top:505px" data-at="6">0 ${ARR} 1<br><span class="good">ΔS &gt; 0</span></div>
      <div class="x-eqr" style="top:700px" data-at="7@0.2">${term('CaCO<sub>3</sub>(s)', 0, '8@0.1')}${op(ARR)}${term('CaO(s)', 0, '8@0.1')}${op('+')}${term('CO<sub>2</sub>(<span class="teal">g</span>)', 1, '8@0.1')}</div>
      <div class="x-res" style="top:705px" data-at="8@0.4">0 ${ARR} 1<br><span class="good">ΔS &gt; 0</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'Ice melting'], ['B', 'Water evaporating'], ['C', 'N<sub>2</sub>(g) + 3H<sub>2</sub>(g) → 2NH<sub>3</sub>(g)'], ['D', 'Dry ice subliming']]
  const OPT_AT = ['1@0.28', '1@0.38', '1@0.5', '1@0.86']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Which process has <span class="teal">ΔS &lt; 0</span>?</h2>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${140 + (i % 2) * 840}px;top:${320 + Math.floor(i / 2) * 150}px" data-at="${OPT_AT[i]}" data-fx="pop"><div class="l">${l}</div><span>${f}</span>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : `<span class="g good" data-at="5@0.2" data-fx="fade">ΔS &gt; 0</span>`}</div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="740" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="740" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 740)"/>
        <text class="x-num" x="960" y="766" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="870" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:660px" data-at="4" data-fx="pop">4 mol gas ${ARR} 2 mol gas: <span class="gold">less dispersal</span>, ΔS &lt; 0</div>
      <div class="x-line" style="top:800px;font-size:38px" data-at="5"><span class="muted">A, B and D:</span> dispersal <span class="good">increases</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 2) {
          el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''
          el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`
          c.$('.ok').style.opacity = win
          c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})`
        } else el.style.filter = `brightness(${1 - 0.4 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${[[70, 60], [100, 60], [85, 86], [55, 86], [115, 86]].map(([x, y]) => ball(x, y, 14, 'pur')).join('')}
    <line x1="160" y1="75" x2="250" y2="75" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/>${[[290, 30], [380, 50], [430, 115], [320, 120], [400, 90]].map(([x, y]) => ball(x, y, 14, 'pur')).join('')}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><line x1="70" y1="120" x2="390" y2="120" stroke="#363c54" stroke-width="6"/>
    ${[[120, 22], [230, 48], [340, 108]].map(([x, h]) => `<rect x="${x - 34}" y="${120 - h}" width="68" height="${h}" rx="8" fill="${PRI}"/>`).join('')}
    ${[[120, 's'], [230, 'l'], [340, 'g']].map(([x, s]) => `<text x="${x}" y="146" text-anchor="middle" font-size="24" font-weight="900" class="f-muted">${s}</text>`).join('')}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="64" text-anchor="middle" font-size="44" font-weight="900" class="f-gold">Δn<tspan dy="10" font-size="28">gas</tspan><tspan dy="-10"> &gt; 0</tspan></text>
    <text x="230" y="128" text-anchor="middle" font-size="44" font-weight="900" class="f-good">ΔS &gt; 0</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Entropy measures<br>the <span class="gold">dispersal</span> of<br>matter and energy</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>S goes up: s ${ARR} l ${ARR} g,<br>larger volume,<br>more gas moles,<br>higher T</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Count the <span class="teal">gas moles</span><br>to predict<br>the sign of ΔS</p></div>`,
  })
})()
