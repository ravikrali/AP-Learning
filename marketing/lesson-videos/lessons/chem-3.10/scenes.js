// Pictures for chem-3.10 "Solubility: Like Dissolves Like". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u3.ts; the three changes of dissolving and
// the sugar / hydrocarbon line are from book.ts). Particles are schematic: counts and sizes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .sl-tag{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:34px;font-weight:900;white-space:nowrap}
    .sl-def{left:120px;top:280px;width:1680px;height:200px;padding:0 50px;display:flex;flex-direction:column;justify-content:center}
    .sl-def .q{font-size:46px;font-weight:900;line-height:1.3}
    .sl-def .m{margin-top:12px;font-size:34px;font-weight:800;color:var(--muted)}
    .sl-col{top:520px;width:810px;height:380px}
    .sl-col .lab{position:absolute;left:40px;top:104px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .sl-chip{position:absolute;top:200px;height:76px;padding:0 30px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:38px;font-weight:900;line-height:72px;white-space:nowrap}
    .sl-st{top:280px;width:540px;height:340px} .sl-st h3{font-size:36px;white-space:nowrap}
    .sl-st .tx{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:31px;font-weight:800;white-space:nowrap}
    .sl-eth{position:absolute;left:120px;top:790px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line);font-size:40px;font-weight:900;line-height:116px;text-align:center;white-space:nowrap}
    .sl-note{position:absolute;left:1080px;width:720px;height:112px;padding:16px 24px 0 96px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .sl-note i{position:absolute;left:26px;top:30px;width:48px;height:48px;border-radius:50%}
    .sl-note b{display:block;font-size:36px;font-weight:900;line-height:1.15;white-space:nowrap} .sl-note span{display:block;font-size:27px;font-weight:700;color:var(--muted);white-space:nowrap}
    .sl-nm{position:absolute;left:120px;font-size:40px;font-weight:900;white-space:nowrap}
    .sl-sol{position:absolute;left:1420px;height:72px;padding:0 28px;border-radius:20px;font-size:34px;font-weight:900;line-height:68px;white-space:nowrap;border:2px solid}
    .sl-hd{position:absolute;top:290px;font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
    .sl-more{position:absolute;left:120px;top:800px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line);font-size:38px;font-weight:900;line-height:116px;text-align:center;white-space:nowrap}
    .sl-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .sl-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .sl-tile .f{margin-top:60px;font-size:84px;font-weight:900;line-height:1} .sl-tile .ch{margin-top:20px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .sl-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .sl-rc{top:320px;width:540px;height:560px;text-align:center} .sl-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .sl-rc svg{display:block;margin:14px auto 0} .sl-rc p{margin:14px 20px 0;font-size:33px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const sb = (s) => `<tspan dy=".3em" font-size=".62em">${s}</tspan>` // SVG subscript (only at the end of a text)
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // glassware
  const beakerD = (x, y, w, h) => `M${x - 12} ${y} H${x} V${y + h - 26} Q${x} ${y + h} ${x + 26} ${y + h} H${x + w - 26} Q${x + w} ${y + h} ${x + w} ${y + h - 26} V${y} H${x + w + 12}`
  const liqD = (x, y, w, h, lv, top) => { const t = y + h - lv, i = 7, b = top == null ? y + h - 26 : Math.min(y + h - 26, y + h - top)
    if (top != null) return `M${x + i} ${t} H${x + w - i} V${y + h - top} H${x + i} Z`
    return `M${x + i} ${t} H${x + w - i} V${b} Q${x + w - i} ${y + h - i} ${x + w - 26} ${y + h - i} H${x + 26} Q${x + i} ${y + h - i} ${x + i} ${y + h - 26} Z` }
  const glass = (x, y, w, h, sw = 5) => `<path d="${beakerD(x, y, w, h)}" fill="none" stroke="#c9cee0" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
  // water (lower part) with an oil layer of thickness `oil` on top
  const layered = (x, y, w, h, water, oil, sw = 5) =>
    `<path d="${liqD(x, y, w, h, water)}" fill="rgba(60,199,188,.22)"/><path d="${liqD(x, y, w, h, water + oil, water)}" fill="rgba(242,196,67,.42)"/>${glass(x, y, w, h, sw)}`

  // ---------- intro artwork: faint oil-on-water beakers at the left and right edges (above y = 950) ----------
  EZ.intro = {
    chips: [['1@0.3', 'Like dissolves like'], ['1@0.55', 'Oil & water'], ['1@0.8', 'Long tails lose']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${layered(40, 600, 170, 300, 170, 50, 6)}${layered(1710, 600, 170, 300, 170, 50, 6)}</svg>`,
  }

  // ---------- hook: oil floats on water; acetone cleans paint that water can't ----------
  const smear = (cx, cls) => `<path class="${cls}" d="M${cx - 110} 150 C${cx - 80} 100 ${cx - 20} 120 ${cx} 108 C${cx + 40} 98 ${cx + 100} 112 ${cx + 110} 150 C${cx + 100} 196 ${cx + 30} 186 ${cx} 196 C${cx - 50} 206 ${cx - 104} 196 ${cx - 110} 150 Z" fill="#f0707a"/>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Two puzzles</div><h2 class="h1" data-at="0">What dissolves in what?</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:520px" data-at="0@0.2"><h3 class="gold">Oil floats on water</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="340">
          <clipPath id="hk-b"><path d="${liqD(255, 10, 300, 310, 290)}"/></clipPath>
          <g clip-path="url(#hk-b)"><rect x="240" y="20" width="330" height="320" fill="rgba(60,199,188,.22)"/><path class="hk-oil" d="" fill="rgba(242,196,67,.5)"/></g>
          ${glass(255, 10, 300, 310)}
          <text x="600" y="88" font-size="32" font-weight="900" class="f-gold">oil</text>
          <text x="600" y="240" font-size="32" font-weight="900" class="f-teal">water</text></svg>
        <div class="sl-tag muted">two layers, no mixing</div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:520px" data-at="1"><h3 class="warm">Nail polish remover</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="340">
          ${smear(220, 'hk-s1')}${smear(590, 'hk-s2')}
          <text x="220" y="62" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">water</text>
          <text x="590" y="62" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">acetone</text>
          <text x="220" y="290" text-anchor="middle" font-size="40" font-weight="900" class="f-bad" data-at="1@0.75" data-fx="pop">✗ stays</text>
          <text x="590" y="290" text-anchor="middle" font-size="40" font-weight="900" class="f-good" data-at="1@0.75" data-fx="pop">✓ cleans off</text></svg>
        <div class="sl-tag muted">paint</div></div>
      <div class="banner" style="top:840px" data-at="3" data-fx="pop">Solubility: <span class="teal">match the intermolecular forces</span></div>`,
    update(c) {
      let d = 'M240 20'
      for (let x = 240; x <= 570; x += 10) d += ` L${x} ${(110 + 4 * Math.sin(x / 34 + c.t * 1.4)).toFixed(1)}`
      c.$('.hk-oil').setAttribute('d', d + ' L570 20 Z')
      c.$('.hk-s2').style.opacity = 1 - 0.9 * eio(c.seg(c.b[1].start + 1.2, c.b[1].start + 3))
    },
  })

  // ---------- the rule ----------
  EZ.scene('rule', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rule</div><h2 class="h1" data-at="0">Like dissolves like</h2>
      <div class="card sl-def" data-at="1"><div class="q">Similar <span class="pri">intermolecular interactions</span> ${ARR} <span class="teal">soluble</span> or <span class="teal">miscible</span></div>
        <div class="m" data-at="2" data-fx="fade"><span style="color:var(--text)">Miscible:</span> two liquids mix in <span class="gold">all proportions</span></div></div>
      <div class="card sl-col" style="left:120px" data-at="3"><h3><span class="teal">Polar / ionic</span> solutes</h3>
        <div class="lab">${ARR} dissolve in <span class="teal">polar solvents</span>, like water</div>
        <div class="sl-chip" style="left:40px" data-at="4" data-fx="pop">NaCl</div>
        <div class="sl-chip" style="left:230px" data-at="4@0.35" data-fx="pop">sugar</div>
        <div class="sl-chip" style="left:430px" data-at="4@0.65" data-fx="pop">ethanol</div>
        <svg style="position:absolute;left:40px;top:300px" width="740" height="60" data-at="4@0.8" data-fx="fade">${ball(20, 30, 18, 'teal')}${ball(64, 30, 18, 'teal')}<text x="100" y="42" font-size="30" font-weight="800" class="f-muted">polar with polar</text></svg></div>
      <div class="card sl-col" style="left:990px" data-at="5"><h3><span class="gold">Nonpolar</span> solutes</h3>
        <div class="lab">${ARR} dissolve in <span class="gold">nonpolar solvents</span>, like hexane</div>
        <div class="sl-chip" style="left:40px" data-at="6" data-fx="pop">oils</div>
        <div class="sl-chip" style="left:200px" data-at="6@0.3" data-fx="pop">fats</div>
        <div class="sl-chip" style="left:360px" data-at="6@0.6" data-fx="pop">I<sub>2</sub></div>
        <svg style="position:absolute;left:40px;top:300px" width="740" height="60" data-at="6@0.8" data-fx="fade">${ball(20, 30, 18, 'gold')}${ball(64, 30, 18, 'gold')}<text x="100" y="42" font-size="30" font-weight="800" class="f-muted">nonpolar with nonpolar</text></svg></div>`,
  })

  // ---------- why matching matters: the three changes of dissolving ----------
  const S1 = [[-30, -24], [30, -24], [-30, 28], [30, 28]]
  const S2 = [[-110, -50], [-50, -50], [50, -50], [110, -50], [-110, 10], [-50, 10], [50, 10], [110, 10], [-110, 70], [-50, 70], [50, 70], [110, 70]]
  const MIX = [[-110, -50, 't'], [-50, -50, 'w'], [10, -50, 't'], [70, -50, 'w'], [130, -50, 't'], [-80, 10, 't'], [-20, 10, 'w'], [40, 10, 't'], [100, 10, 'w'], [-110, 70, 'w'], [-50, 70, 't'], [10, 70, 'w'], [70, 70, 't'], [130, 70, 't']]
  let mixLines = ''
  for (let i = 0; i < MIX.length; i++) for (let j = i + 1; j < MIX.length; j++) {
    const [a, b] = [MIX[i], MIX[j]]
    if (a[2] !== b[2] && Math.hypot(a[0] - b[0], a[1] - b[1]) < 75) mixLines += `<line x1="${270 + a[0]}" y1="${108 + a[1]}" x2="${270 + b[0]}" y2="${108 + b[1]}" stroke="#eef0f7" stroke-opacity=".5" stroke-width="3" stroke-dasharray="6 6"/>`
  }
  EZ.scene('swap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it works</div><h2 class="h1" data-at="0">Dissolving: three changes</h2>
      <div class="card sl-st" style="left:120px" data-at="2"><h3><small>1</small><span class="warm">Solute</span> separates</h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="225">${S1.map((_, i) => `<g class="sw-a" data-i="${i}">${ball(0, 0, 22, 'warm')}</g>`).join('')}</svg></div>
      <div class="card sl-st" style="left:690px" data-at="3"><h3><small>2</small><span class="teal">Solvent</span> makes room</h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="225">${S2.map((_, i) => `<g class="sw-b" data-i="${i}">${ball(0, 0, 20, 'teal')}</g>`).join('')}</svg></div>
      <div class="card sl-st" style="left:1260px" data-at="4"><h3><small>3</small>New attractions</h3>
        <svg style="position:absolute;left:0;top:100px" width="540" height="225"><g data-at="4@0.5" data-fx="fade">${mixLines}</g>
          ${MIX.map(([x, y, k]) => ball(270 + x, 108 + y, k === 'w' ? 22 : 20, k === 'w' ? 'warm' : 'teal')).join('')}</svg></div>
      <div class="banner" style="top:650px;padding:18px 40px;font-size:44px" data-at="5" data-fx="pop">New attractions <span class="gold">similar to, or stronger than,</span> those broken ${ARR} <span class="teal">mixing</span></div>
      <div class="sl-eth" data-at="6" data-out="7" data-fx="up">Ethanol + water ${ARR} mix in <span class="gold">all proportions</span></div>
      <div class="sl-eth" data-at="7" data-fx="up">Ethanol’s <span class="warm">O–H</span> ${ARR} <span class="teal">H-bonds with water</span><span data-at="8" data-fx="fade">, similar to <span class="good">each pure liquid</span></span></div>`,
    update(c) {
      const b = c.b, p1 = eio(c.seg(b[2].start + 0.4, b[2].start + 1.6)), p2 = eio(c.seg(b[3].start + 0.3, b[3].start + 1.4))
      all(c, '.sw-a').forEach((g, i) => { const [x, y] = S1[i]; const k = lerp(1, 3.4, p1)
        g.setAttribute('transform', `translate(${270 + x * k} ${108 + y * lerp(1, 1.9, p1)})`) })
      all(c, '.sw-b').forEach((g, i) => { const [x, y] = S2[i]; const dx = x < 0 ? -1 : 1
        g.setAttribute('transform', `translate(${270 + x + dx * 22 * p2 - dx * 22} ${108 + y})`) })
    },
  })

  // ---------- why oil and water don't mix ----------
  const BX = 160, BY = 330, BW = 760, BH = 560, WTOP = 470 // water surface; oil layer above it
  const W = []
  for (let r = 0; r < 5; r++) for (let q = 0; q < 10; q++) W.push([220 + q * 72 + (r % 2 ? 22 : 0), 520 + r * 76])
  let hb = ''
  for (let i = 0; i < W.length; i++) for (let j = i + 1; j < W.length; j++) {
    const d = Math.hypot(W[i][0] - W[j][0], W[i][1] - W[j][1])
    if (d < 82) hb += `<line x1="${W[i][0]}" y1="${W[i][1]}" x2="${W[j][0]}" y2="${W[j][1]}" stroke="#3cc7bc" stroke-opacity=".75" stroke-width="3" stroke-dasharray="7 6"/>`
  }
  const OH = Array.from({ length: 9 }, (_, i) => [230 + i * 80, 420])
  const OM = [[256, 558], [472, 558], [688, 558], [364, 634], [580, 634], [796, 634], [256, 710], [472, 710], [688, 710]]
  EZ.scene('oil', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Oil and water</div><h2 class="h1" data-at="0">Why they don’t mix</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <path d="${liqD(BX, BY, BW, BH, BY + BH - WTOP)}" fill="rgba(60,199,188,.14)"/>
          <path class="ol-layer" d="${liqD(BX, BY, BW, BH, BY + BH - WTOP + 90, BY + BH - WTOP)}" fill="rgba(242,196,67,.3)"/>
          <g class="ol-hb">${hb}</g>
          ${W.map(([x, y]) => ball(x, y, 17, 'teal')).join('')}
          ${OH.map((_, i) => `<g class="ol-o" data-i="${i}">${ball(0, 0, 25, 'gold')}</g>`).join('')}
          ${glass(BX, BY, BW, BH)}
          <text x="${BX + BW + 30}" y="430" font-size="32" font-weight="900" class="f-gold">oil</text>
          <text x="${BX + BW + 30}" y="660" font-size="32" font-weight="900" class="f-teal">water</text></g>
      </svg>
      <div class="sl-note" style="top:300px" data-at="1"><i style="background:#3cc7bc"></i><b>Water: <span class="teal" style="display:inline;font-size:inherit">strong H-bonds</span></b><span>to each other (dashed lines)</span></div>
      <div class="sl-note" style="top:432px" data-at="2"><i style="background:#f2c443"></i><b>Oil: <span class="gold" style="display:inline;font-size:inherit">weak LDFs only</span></b><span>nonpolar molecules</span></div>
      <div class="sl-note" style="top:564px" data-at="3"><i style="background:#f0707a"></i><b>To dissolve oil…</b><span>water gives up strong H-bonds for weak ones</span></div>
      <div class="sl-note" style="top:696px;height:96px;padding-top:24px" data-at="4" data-fx="pop"><i style="background:#f0707a;top:24px"></i><b class="bad">A bad trade ✗</b></div>
      <div class="banner" style="top:830px;left:1080px;width:720px;padding:18px 20px;font-size:38px" data-at="5" data-out="6" data-fx="pop">Water sticks together ${ARR} <span class="gold">oil layer</span></div>
      <div class="banner" style="top:830px;left:1080px;width:720px;padding:18px 20px;font-size:38px" data-at="6" data-fx="pop">Hexane + water: <span class="gold">same reason</span></div>`,
    update(c) {
      const b = c.b, inn = eio(c.seg(b[3].start + 0.3, b[3].start + 2)), out = eio(c.seg(b[5].start + 0.2, b[5].start + 2.2)), m = inn * (1 - out)
      all(c, '.ol-o').forEach((g, i) => { const [x0, y0] = OH[i], [x1, y1] = OM[i]
        g.setAttribute('transform', `translate(${lerp(x0, x1, m).toFixed(1)} ${lerp(y0, y1, m).toFixed(1)})`) })
      c.$('.ol-hb').style.opacity = 1 - 0.8 * m
      c.$('.ol-layer').style.opacity = 1 - m
    },
  })

  // ---------- trick: long tails lose ----------
  const ALC = [['methanol', 1, 'mixes completely', 'good'], ['ethanol', 2, 'mixes completely', 'good'], ['1-butanol', 4, 'only partly', 'gold'], ['1-octanol', 8, 'barely soluble', 'bad']]
  const CLR = { good: '#4cc781', gold: '#f2c443', bad: '#f0707a' }
  const chain = (n) => { let s = '', x0 = 50
    for (let k = 0; k < n; k++) s += `<line x1="${x0 + k * 64}" y1="40" x2="${x0 + (k + 1) * 64}" y2="40" stroke="#aab1c4" stroke-width="6"/>`
    for (let k = n - 1; k >= 0; k--) s += ball(x0 + 64 + k * 64, 40, 24, 'gray', 'C', 20)
    return s + ball(x0, 40, 30, 'teal', 'OH', 22) }
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Long tails lose</h2>
      <div class="sl-hd teal" style="left:500px" data-at="1" data-fx="fade">polar O–H head</div>
      <div class="sl-hd muted" style="left:820px" data-at="1@0.5" data-fx="fade">nonpolar carbon tail ${ARR}</div>
      ${ALC.map(([nm, n, sol, k], i) => `<div data-at="${i < 2 ? `3@${0.1 + i * 0.4}` : i + 2}" data-fx="left">
        <div class="sl-nm" style="top:${358 + i * 108}px">${nm}</div>
        <svg style="position:absolute;left:510px;top:${340 + i * 108}px" width="640" height="80">${chain(n)}</svg>
        <div class="sl-sol" style="top:${348 + i * 108}px;color:${CLR[k]};border-color:${CLR[k]};background:${CLR[k]}22">${sol}</div></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="fade"><line x1="1380" y1="340" x2="1380" y2="720" stroke="#f0707a" stroke-width="7" marker-end="url(#mk-bad)"/></g>
        <text x="1366" y="760" text-anchor="end" font-size="28" font-weight="900" class="f-bad" data-at="2@0.4" data-fx="fade">less water-soluble</text></svg>
      <div class="sl-more" data-at="6" data-fx="up" data-out="7">The nonpolar part <span class="warm">takes over</span> as the chain grows</div>
      <div class="sl-more" style="font-size:36px" data-at="7" data-out="9" data-fx="up">Look for <span class="teal">O–H, N–H, lone pairs on O or N</span><span data-at="8" data-fx="fade"> &nbsp;vs.&nbsp; <span class="muted">size of the nonpolar part</span></span></div>
      <div class="sl-more" style="font-size:36px" data-at="9" data-fx="up">Sugars: <span class="teal">many O–H</span> ${ARR} very soluble &nbsp;·&nbsp; Large hydrocarbons: <span class="gold">none</span> ${ARR} insoluble</div>`,
  })

  // ---------- caution: ionic compounds ----------
  let lat = ''
  for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) { const big = (r + q) % 2
    lat += ball(150 + q * 78, 40 + r * 78, big ? 32 : 22, big ? 'pur' : 'warm') }
  const RULE = [['sodium', 'Na<sup>+</sup>'], ['potassium', 'K<sup>+</sup>'], ['ammonium', 'NH<sub>4</sub><sup>+</sup>'], ['nitrate', 'NO<sub>3</sub><sup>−</sup>']]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Caution</div><h2 class="h1" data-at="0">Ionic compounds</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:560px" data-at="1"><h3>More than <span class="teal">like dissolves like</span></h3>
        <svg style="position:absolute;left:60px;top:120px" width="690" height="320" data-at="2" data-fx="fade">${lat}</svg>
        <div class="sl-tag" data-at="2@0.4" data-fx="fade">also depends on <span class="warm">lattice strength</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:560px" data-at="3"><h3>Learned from <span class="gold">data and rules</span></h3>
        <div class="lab muted" style="position:absolute;left:40px;top:110px;font-size:32px;font-weight:800" data-at="4" data-fx="fade">These salts are all soluble in water:</div>
        ${RULE.map(([n, f], i) => `<div class="sl-chip" style="left:${30 + (i % 2) * 385}px;top:${180 + Math.floor(i / 2) * 110}px;width:365px" data-at="4@${0.15 + i * 0.17}" data-fx="pop">${n} <span class="teal" style="margin-left:8px">${f}</span></div>`).join('')}
        </div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'NaCl', 'ionic'], ['B', 'I<sub>2</sub>', 'nonpolar · LDFs'], ['C', 'CH<sub>3</sub>OH', 'highly polar'], ['D', 'KNO<sub>3</sub>', 'ionic']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="1">Most soluble in <span class="gold">hexane, C<sub>6</sub>H<sub>14</sub></span> (nonpolar)?</h2>
      ${OPTS.map(([l, f, ch], i) => `<div class="sl-tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.45 + i * 0.12}" data-fx="pop"><div class="l">${l}</div>${i === 1 ? CHECK : ''}
        <div class="f" style="${i === 2 ? 'font-size:72px' : ''}">${f}</div><div class="ch" data-at="${i === 1 ? '4@0.1' : '5@0.1'}" data-fx="fade">${ch}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="820" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:740px" data-at="4@0.3" data-fx="pop">I<sub>2</sub> is <span class="gold">nonpolar</span>, like hexane ${ARR} <span class="teal">like dissolves like</span></div>
      <div class="banner" style="top:860px;padding:16px 40px;font-size:42px;background:rgba(36,40,56,.9);border-color:var(--line)" data-at="5" data-fx="pop">Ionic and highly polar choices <span class="teal">prefer water</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="200" viewBox="0 0 460 200">${ball(120, 90, 34, 'teal')}${ball(200, 90, 34, 'teal')}
    ${ball(290, 90, 34, 'gold')}${ball(370, 90, 34, 'gold')}<text x="245" y="170" text-anchor="middle" font-size="27" font-weight="900" class="f-teal">like with like</text></svg>`
  const m2 = `<svg width="460" height="200" viewBox="0 0 460 200"><path d="${liqD(60, 20, 150, 140, 110)}" fill="rgba(60,199,188,.25)"/>${glass(60, 20, 150, 140, 4)}${ball(110, 110, 14, 'teal')}${ball(160, 125, 14, 'teal')}
    <path d="${liqD(260, 20, 150, 140, 110)}" fill="rgba(242,196,67,.25)"/>${glass(260, 20, 150, 140, 4)}${ball(310, 110, 14, 'gold')}${ball(360, 125, 14, 'gold')}
    <text x="135" y="196" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">polar</text><text x="335" y="196" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">nonpolar</text></svg>`
  const mini = (n, y) => { let s = ''; for (let k = 0; k < n; k++) s += ball(110 + k * 40, y, 14, 'gray'); return s + ball(80, y, 18, 'teal') }
  const m3 = `<svg width="460" height="200" viewBox="0 0 460 200">${mini(2, 60)}${mini(7, 140)}
    <text x="200" y="69" font-size="26" font-weight="900" class="f-good">more soluble</text><text x="235" y="190" text-anchor="middle" font-size="26" font-weight="900" class="f-bad">less soluble</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card sl-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Similar IMFs ${ARR}<br><span class="teal">soluble / miscible</span><br>“Like dissolves like”</p></div>
      <div class="card sl-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="teal">Polar / ionic</span> ${ARR}<br>polar solvents<br><span class="gold">Nonpolar</span> ${ARR} nonpolar</p></div>
      <div class="card sl-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Longer <span class="warm">nonpolar chain</span><br>${ARR} <span class="bad">lower</span> water<br>solubility</p></div>`,
  })
})()
