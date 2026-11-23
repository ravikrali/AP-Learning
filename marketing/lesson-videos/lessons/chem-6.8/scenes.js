// Pictures for chem-6.8 "Enthalpy of Formation". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u6.ts and chem/book.ts): CO2 −393.5,
// H2O(l) −285.8, H2O(g) −241.8, CH4 −74.8, CO −110.5, the methane worked example and the CaCO3 try
// question. The two-stage path picture has no energy axis: it shows the route, not values.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-tab{position:absolute;left:120px;top:300px;width:760px;height:640px}
    .x-row{position:absolute;left:40px;width:680px;height:72px;border-bottom:2px solid var(--line);font-size:42px;font-weight:900;line-height:72px}
    .x-row span{position:absolute;right:10px;top:0;color:var(--warm)}
    .x-rx{position:absolute;left:1000px;width:800px;height:110px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:40px;font-weight:900;line-height:106px;padding-left:34px;white-space:nowrap}
    .x-rx b{position:absolute;right:30px;top:0;color:var(--gold)}
    .x-def{position:absolute;left:120px;top:290px;width:1680px;padding:20px 36px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid rgba(141,141,240,.7);text-align:center;font-size:42px;font-weight:800;line-height:1.35}
    .x-eqc{position:absolute;left:0;width:100%;text-align:center;font-size:50px;font-weight:900;white-space:nowrap}
    .x-val{position:absolute;left:0;width:100%;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-el{position:absolute;top:440px;width:300px;height:280px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line);text-align:center}
    .x-el svg{display:block;margin:14px auto 0} .x-el .N{margin-top:4px;font-size:40px;font-weight:900} .x-el .Z{margin-top:6px;font-size:32px;font-weight:900;color:var(--good)}
    .x-lead{position:absolute;left:120px;top:742px;font-size:34px;font-weight:800;color:var(--muted)}
    .x-vs{position:absolute;top:800px;width:540px;height:86px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line);text-align:center;font-size:40px;font-weight:900;line-height:82px;white-space:nowrap}
    .x-vs i{font-style:normal;font-size:32px;color:var(--muted);margin:0 14px}
    .x-form{position:absolute;left:0;width:1920px;top:282px;text-align:center;font-size:58px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;height:76px;padding:0 30px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:72px;white-space:nowrap}
    .x-box{position:absolute;height:104px;border-radius:26px;background:rgba(36,40,56,.95);border:3px solid var(--line);text-align:center;font-size:40px;font-weight:900;line-height:98px;white-space:nowrap}
    .x-lab{position:absolute;font-size:32px;font-weight:900;line-height:1.3;white-space:nowrap}
    .x-lab .s{display:block;font-size:32px}
    .x-sp{position:absolute;top:290px;text-align:center;font-size:58px;font-weight:900;white-space:nowrap;transform:translateX(-50%)}
    .x-spv{position:absolute;top:392px;width:240px;margin-left:-120px;text-align:center;font-size:38px;font-weight:900;white-space:nowrap}
    .x-ul{position:absolute;top:378px;height:8px;border-radius:4px}
    .x-step{position:absolute;left:120px;width:1680px;height:132px;padding:16px 36px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-step .H{font-size:30px;font-weight:900;color:var(--muted)}
    .x-step .B{margin-top:4px;font-size:46px;font-weight:900;white-space:nowrap} .x-step .B em{font-style:normal;display:inline-block}
    .x-ck{top:300px;width:540px;height:350px;text-align:center} .x-ck .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px;color:#fff}
    .x-ck .T{margin-top:24px;font-size:46px;font-weight:900;white-space:nowrap} .x-ck .S{margin-top:16px;font-size:32px;font-weight:800;color:var(--muted);line-height:1.3;white-space:nowrap}
    .x-ph{position:absolute;left:120px;top:720px;width:1680px;height:230px}
    .x-ph .P{position:absolute;top:30px;width:560px;text-align:left;font-size:48px;font-weight:900;white-space:nowrap} .x-ph .P span{display:block;margin-top:6px;font-size:40px;color:var(--warm)}
    .x-ans{position:absolute;left:120px;top:540px;width:1680px;height:400px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900}
    .x-ans .W{position:absolute;left:60px;top:168px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-ans .K{position:absolute;left:60px;top:236px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-ans .E{position:absolute;left:60px;top:312px;font-size:40px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px;color:#fff}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', PUR = '#8d8df0', GOLD = '#f2c443'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // chemical formula in HTML: digits after a letter or ")" become subscripts ("2O2(g)" -> 2O<sub>2</sub>(g))
  const F = (s) => s.replace(/([A-Za-z)])(\d+)/g, '$1<sub>$2</sub>')
  const DHF = 'ΔH°<sub>f</sub>', DHR = 'ΔH°<sub>rxn</sub>'
  // SVG text ending in a lowered part: sv('O', '2')
  const sv = (base, s) => `${base}<tspan dy="9" font-size=".62em">${s}</tspan>`
  const hex = (cx, cy, r) => 'M' + Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}` }).join('L') + 'Z'
  const graphite = (cx, cy, r) => [[-1, 0], [1, 0], [0, 1.5]].map(([dx, dy]) => `<path d="${hex(cx + dx * r * 0.866, cy + (dy - 0.5) * r, r)}" fill="none" stroke="#aab1c4" stroke-width="6" stroke-linejoin="round"/>`).join('')

  // ---------- intro artwork: a faint table at the left edge, a faint two-stage path at the right ----------
  EZ.intro = {
    chips: [['1@0.35', '1 mol from elements'], ['1@0.55', 'Elements = 0'], ['1@0.75', 'Products − reactants']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${Array.from({ length: 7 }, (_, i) => `<rect class="x-ir${i}" x="40" y="${300 + i * 82}" width="250" height="56" rx="14" fill="${i % 2 ? TEAL : PUR}"/>`).join('')}
      <rect x="1640" y="330" width="230" height="80" rx="20" fill="none" stroke="${GOLD}" stroke-width="6"/>
      <rect x="1600" y="760" width="130" height="80" rx="20" fill="none" stroke="${WARM}" stroke-width="6"/>
      <rect x="1770" y="760" width="130" height="80" rx="20" fill="none" stroke="${TEAL}" stroke-width="6"/>
      <path class="x-ip" d="M1665 755 L1720 420 L1835 755" fill="none" stroke="#eef0f7" stroke-width="7" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/>
    </svg>`,
    update(c) {
      const t = c.t - c.sc.start
      for (let i = 0; i < 7; i++) c.$('.x-ir' + i).style.opacity = c.seg(c.sc.start + 0.3 + i * 0.25, c.sc.start + 0.7 + i * 0.25)
      c.$('.x-ip').setAttribute('stroke-dashoffset', 1 - eio(clamp((t - 1) / 2.5)))
    },
  }

  // ---------- hook: one table, many reactions ----------
  const rows = [['CO2(g)', '−393.5'], ['H2O(l)', '−285.8'], ['CO(g)', '−110.5'], ['CH4(g)', '−74.8'], ['CaO(s)', '−635'], ['CaCO3(s)', '−1207']]
  const rx = [['CH4 + 2O2 → CO2 + 2H2O', '2'], ['2CO + O2 → 2CO2', '2@0.3'], ['CaCO3 → CaO + CO2', '2@0.6']]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">One table</div><h2 class="h1" data-at="0">Measured once, used everywhere</h2>
      <div class="card x-tab" data-at="0@0.3"><h3>${DHF} table <span class="muted" style="font-size:30px;margin-left:12px">kJ/mol</span></h3>
        ${rows.map((r, i) => `<div class="x-row" style="top:${120 + i * 82}px" data-at="${i < 3 ? '0@' + (0.45 + i * 0.15).toFixed(2) : '1@' + ((i - 3) * 0.25).toFixed(2)}" data-fx="left">${F(r[0])}<span>${r[1]}</span></div>`).join('')}
        <div class="x-row muted" style="top:612px;border:0;height:40px;line-height:20px;font-size:40px" data-at="1@0.8" data-fx="fade">⋮</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="fade">${[365, 515, 665].map((y) => `<path d="M890 620 C930 620 950 ${y} 992 ${y}" fill="none" stroke="${GOLD}" stroke-width="5" stroke-dasharray="12 10" marker-end="url(#mk-gold)"/>`).join('')}</g></svg>
      ${rx.map((r, i) => `<div class="x-rx" style="top:${310 + i * 150}px" data-at="${r[1]}" data-fx="right">${F(r[0])}<b>ΔH = ?</b></div>`).join('')}
      <div class="x-chip" style="left:1000px;top:770px;border-color:rgba(242,196,67,.7)" data-at="2@0.8" data-fx="pop"><span class="gold">millions</span> of reactions</div>
      <div class="banner" style="left:1000px;width:800px;top:862px;font-size:46px" data-at="3" data-fx="pop">All it takes: <span class="teal">subtraction</span></div>`,
  })

  // ---------- definition and the CO2 / H2O examples ----------
  EZ.scene('define', {
    html: `<div class="kicker" data-at="in" data-fx="left">Definition</div><h2 class="h1" data-at="0">Standard enthalpy of formation</h2>
      <div class="x-def" data-at="1"><span class="pri">${DHF}</span> = the enthalpy change to make <span class="x-mol gold" style="display:inline-block">1 mol</span> of a compound<br>from its <span class="teal">elements in their standard states</span></div>
      <div class="card" style="left:120px;top:480px;width:810px;height:470px" data-at="2"><h3>Example</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="210" viewBox="0 0 810 210">
          ${ball(120, 125, 44, 'gray', 'C')}<text x="205" y="140" text-anchor="middle" font-size="50" font-weight="900">+</text>
          ${ball(278, 125, 36, 'teal', 'O')}${ball(342, 125, 36, 'teal', 'O')}
          <line x1="410" y1="125" x2="500" y2="125" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)"/>
          <g data-at="2@0.6" data-fx="pop">${ball(596, 125, 34, 'teal', 'O')}${ball(664, 125, 40, 'gray', 'C')}${ball(732, 125, 34, 'teal', 'O')}</g>
          <g data-at="4" data-fx="fade"><ellipse cx="664" cy="125" rx="126" ry="58" fill="none" stroke="${GOLD}" stroke-width="5" stroke-dasharray="14 10"/>
            <text x="664" y="48" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">1 mol</text></g>
        </svg>
        <div class="x-eqc" style="top:300px" data-at="2@0.3" data-fx="fade">${F('C(s) + O2(g)')} ${ARR} ${F('CO2(g)')}</div>
        <div class="x-val" style="top:385px" data-at="3" data-fx="pop">${DHF} = <span class="warm">−393.5 kJ/mol</span></div></div>
      <div class="card" style="left:990px;top:480px;width:810px;height:470px" data-at="5"><h3>Fractional coefficients</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="210" viewBox="0 0 810 210">
          <g data-at="6@0.5" data-fx="pop">${ball(345, 158, 28, 'gray', 'H')}${ball(465, 158, 28, 'gray', 'H')}${ball(405, 120, 42, 'teal', 'O')}</g>
          <g data-at="6@0.8" data-fx="fade"><text x="405" y="48" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">1 mol</text></g>
        </svg>
        <div class="x-eqc" style="top:300px" data-at="6" data-fx="fade">${F('H2(g) + ')}<span class="gold">½</span>${F('O2(g)')} ${ARR} ${F('H2O(l)')}</div>
        <div class="x-val" style="top:385px" data-at="7" data-fx="pop">${DHF} = <span class="warm">−285.8 kJ/mol</span></div></div>`,
    update(c) {
      const b = c.b, on = c.seg(b[4].start, b[4].start + 0.3) * (1 - c.seg(b[4].end, b[4].end + 0.3))
      c.$('.x-mol').style.transform = `scale(${1 + 0.25 * on})`
    },
  })

  // ---------- the zero ----------
  const els = [
    ['O2(g)', `${ball(118, 75, 34, 'teal', 'O')}${ball(182, 75, 34, 'teal', 'O')}`, '3'],
    ['H2(g)', `${ball(126, 75, 26, 'gray', 'H')}${ball(174, 75, 26, 'gray', 'H')}`, '3@0.18'],
    ['C(graphite)', graphite(150, 82, 34), '3@0.36'],
    ['Fe(s)', [0, 1, 2].flatMap((r) => [0, 1, 2].map((k) => ball(108 + k * 42, 33 + r * 42, 19, 'gray'))).join(''), '3@0.56'],
    ['Br2(l)', `<path d="M150 6 C178 44 205 70 205 100 A55 55 0 0 1 95 100 C95 70 122 44 150 6Z" fill="${WARM}" opacity=".25"/>${ball(128, 104, 24, 'red', 'Br', 17)}${ball(172, 104, 24, 'red', 'Br', 17)}`, '3@0.76'],
  ]
  EZ.scene('zero', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">An important zero</div><h2 class="h1" data-at="0">Elements start at zero</h2>
      <div class="banner" style="top:290px" data-at="1" data-fx="pop">Element in its standard state: <span class="good">${DHF} = 0</span></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-out="3" data-fx="fade">
        ${ball(640, 560, 46, 'teal', 'O')}${ball(726, 560, 46, 'teal', 'O')}
        <line x1="830" y1="560" x2="1060" y2="560" stroke="#eef0f7" stroke-width="8" marker-end="url(#mk-text)"/>
        ${ball(1150, 560, 46, 'teal', 'O')}${ball(1236, 560, 46, 'teal', 'O')}
        <text x="945" y="530" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">from itself</text>
        <text x="945" y="680" text-anchor="middle" font-size="40" font-weight="900" class="f-good">no change</text></g></svg>
      ${els.map((e, i) => `<div class="x-el" style="left:${120 + i * 345}px" data-at="${e[2]}" data-fx="pop"><svg width="300" height="150" viewBox="0 0 300 150">${e[1]}</svg><div class="N">${F(e[0]).replace('(graphite)', '<span style="font-size:32px">(graphite)</span>')}</div><div class="Z">${DHF} = 0</div></div>`).join('')}
      <div class="x-lead" data-at="4" data-fx="fade">The most stable form at standard conditions:</div>
      <div class="x-vs" style="left:120px" data-at="5" data-fx="pop"><span class="good">${F('O2(g)')}</span><i>not</i><span class="bad">O(g)</span></div>
      <div class="x-vs" style="left:690px" data-at="5@0.35" data-fx="pop"><span class="good">graphite</span><i>not</i><span class="bad">diamond</span></div>
      <div class="x-vs" style="left:1260px" data-at="5@0.65" data-fx="pop"><span class="good">${F('Br2(l)')}</span><i>not</i><span class="bad">${F('Br2(g)')}</span></div>
      <div class="x-vs" style="left:120px;top:910px;width:1680px;border-color:rgba(240,112,122,.8)" data-at="6" data-fx="pop">Ozone, <span class="bad">${F('O3')}</span>, is <span class="bad">not</span> oxygen’s standard state: <span class="good">${F('O2')}</span> is</div>`,
  })

  // ---------- the equation, and why it works ----------
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="0">Products minus reactants</h2>
      <div class="x-form" data-at="1" data-fx="pop"><span class="pri">${DHR}</span> = Σ${DHF}(<span class="teal">products</span>) − Σ${DHF}(<span class="warm">reactants</span>)</div>
      <div class="x-chip" style="left:640px;top:390px;width:640px;text-align:center;border-color:rgba(242,196,67,.7)" data-at="2" data-fx="pop">× each <span class="gold">coefficient</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <path class="x-p1" d="M400 818 C430 690 520 600 650 572" fill="none" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)" data-at="4" data-fx="draw"/>
        <path class="x-p2" d="M1270 572 C1400 600 1490 690 1520 818" fill="none" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)" data-at="5" data-fx="draw"/>
        <path d="M612 878 L1306 878" fill="none" stroke="${PUR}" stroke-width="9" marker-end="url(#mk-pri)" data-at="6" data-fx="draw"/>
        <g class="x-dot"><circle r="26" fill="${GOLD}" opacity=".3"/><circle r="13" fill="#fff"/></g>
      </svg>
      <div class="x-box" style="left:660px;top:510px;width:600px;border-color:rgba(242,196,67,.7)" data-at="4@0.3" data-fx="pop">Elements <span class="muted" style="font-size:30px">(standard states)</span></div>
      <div class="x-box" style="left:160px;top:826px;width:440px;border-color:rgba(243,167,100,.8)" data-at="3@0.3" data-fx="pop"><span class="warm">Reactants</span></div>
      <div class="x-box" style="left:1320px;top:826px;width:440px;border-color:rgba(60,199,188,.8)" data-at="3@0.5" data-fx="pop"><span class="teal">Products</span></div>
      <div class="x-lab" style="left:120px;top:560px" data-at="4@0.5" data-fx="fade"><span class="s warm">1. break down</span>− Σ${DHF}(reactants)</div>
      <div class="x-lab" style="left:1450px;top:560px" data-at="5@0.3" data-fx="fade"><span class="s teal">2. build up</span>+ Σ${DHF}(products)</div>
      <div class="x-lab" style="left:0;width:1920px;text-align:center;top:900px" data-at="6@0.4" data-fx="fade">same start, same end: <span class="pri">same ΔH</span></div>
      <div class="x-chip" style="left:810px;top:962px;width:300px;text-align:center;border-color:rgba(141,141,240,.7)" data-at="7" data-fx="pop">= Hess’s law</div>`,
    update(c) {
      const b = c.b, p1 = c.$('.x-p1'), p2 = c.$('.x-p2'), dot = c.$('.x-dot')
      const a = eio(c.seg(b[4].start + 0.6, b[4].end)), d = eio(c.seg(b[5].start + 0.3, b[5].end))
      const L1 = p1.getTotalLength(), L2 = p2.getTotalLength()
      const pt = d > 0 ? p2.getPointAtLength(L2 * d) : p1.getPointAtLength(L1 * a)
      dot.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
      dot.style.opacity = c.seg(b[4].start + 0.4, b[4].start + 0.7) * (1 - c.seg(b[6].start, b[6].start + 0.4))
    },
  })

  // ---------- worked example: methane ----------
  const SP = [['CH4(g)', 400, '−74.8', 'warm'], ['+', 560], ['2O2(g)', 720, '0', 'warm'], ['→', 900], ['CO2(g)', 1090, '−393.5', 'teal'], ['+', 1250], ['2H2O(l)', 1430, '−285.8', 'teal']]
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Combustion of methane</h2>
      ${SP.map((s) => `<div class="x-sp" style="left:${s[1]}px" data-at="1@0.1" data-fx="fade">${F(s[0]).replace(/^2/, '<span class="gold">2</span>')}</div>`).join('')}
      ${SP.filter((s) => s[2]).map((s, i) => `<div class="x-spv ${s[3]}" style="left:${s[1]}px" data-at="2@${[0.05, 0.85, 0.3, 0.6][i]}" data-fx="pop">${s[2]}</div>`).join('')}
      <div class="x-ul" style="left:960px;width:610px;background:${TEAL}" data-at="3" data-fx="grow"></div>
      <div class="x-ul" style="left:300px;width:540px;background:${WARM}" data-at="4" data-fx="grow"></div>
      <div class="x-step" style="top:500px;border-color:rgba(60,199,188,.7)" data-at="3" data-fx="right"><div class="H">Products</div>
        <div class="B">(−393.5) + <span class="gold">2</span>(−285.8) = <span class="teal">−965.1 kJ</span></div></div>
      <div class="x-step" style="top:654px;border-color:rgba(243,167,100,.7)" data-at="4" data-fx="right"><div class="H">Reactants</div>
        <div class="B">(−74.8) + <span class="gold">2</span>(0) = <span class="warm">−74.8 kJ</span></div></div>
      <div class="x-step" style="top:808px;border-color:rgba(76,199,129,.8)" data-at="5" data-fx="right"><div class="H">Products − reactants</div>
        <div class="B">${DHR} = <span class="teal">−965.1</span> − (<span class="warm">−74.8</span>) <em data-at="6" data-fx="pop">= <span class="good">−890.3 kJ/mol</span></em></div></div>`,
  })

  // ---------- the three-check trick ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Three checks, every time</h2>
      <div class="card x-ck" style="left:120px" data-at="1"><div class="n">1</div><div class="T"><span class="teal">Products</span> − <span class="warm">reactants</span></div><div class="S">the opposite order<br>from bond enthalpies!</div></div>
      <div class="card x-ck" style="left:690px" data-at="2"><div class="n">2</div><div class="T">× <span class="gold">coefficients</span></div><div class="S">every ${DHF}<br>times its coefficient</div></div>
      <div class="card x-ck" style="left:1260px" data-at="3"><div class="n">3</div><div class="T">Elements = <span class="good">0</span></div><div class="S">like ${F('O2')}</div></div>
      <div class="card x-ph" data-at="4">
        <svg style="position:absolute;left:40px;top:40px" width="150" height="150" viewBox="0 0 150 150"><path d="M75 8 C105 50 130 78 130 100 A55 55 0 0 1 20 100 C20 78 45 50 75 8Z" fill="${TEAL}" opacity=".8"/></svg>
        <div class="P" style="left:220px" data-at="5" data-fx="fade">${F('H2O(l)')}<span>−285.8 kJ/mol</span></div>
        <svg style="position:absolute;left:880px;top:40px" width="150" height="150" viewBox="0 0 150 150">${ball(45, 50, 22, 'teal')}${ball(110, 40, 22, 'teal')}${ball(80, 110, 22, 'teal')}</svg>
        <div class="P" style="left:1060px" data-at="5@0.45" data-fx="fade">${F('H2O(g)')}<span>−241.8 kJ/mol</span></div>
        <div class="x-lab gold" style="left:560px;top:84px;font-size:34px" data-at="4@0.2" data-fx="fade">Watch the phase!</div></div>
      <div class="x-chip" style="left:690px;top:972px;width:540px;text-align:center;border-color:rgba(242,196,67,.7)" data-at="5@0.85" data-fx="pop">different values</div>`,
  })

  // ---------- try it: CaCO3 -> CaO + CO2 ----------
  const TS = [['CaCO3(s)', 520, '−1207', 'warm'], ['→', 830], ['CaO(s)', 1110, '−635', 'teal'], ['+', 1310], ['CO2(g)', 1500, '−394', 'teal']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Find ΔH° for this reaction</h2>
      ${TS.map((s) => `<div class="x-sp" style="left:${s[1]}px" data-at="1@0.2" data-fx="fade">${F(s[0])}</div>`).join('')}
      ${TS.filter((s) => s[2]).map((s, i) => `<div class="x-spv ${s[3]}" style="left:${s[1]}px" data-at="2@${[0.05, 0.3, 0.55][i]}" data-fx="pop">${s[2]}</div>`).join('')}
      <div class="x-lab muted" style="left:0;width:1920px;text-align:center;top:452px;font-size:30px" data-at="2@0.8" data-fx="fade">${DHF} in kJ/mol</div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="4" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">+178 kJ</div>
        <div class="W" data-at="5" data-fx="fade">Products: (−635) + (−394) = <span class="teal">−1029</span></div>
        <div class="K" data-at="6" data-fx="fade"><span class="teal">−1029</span> − (<span class="warm">−1207</span>) = <span class="good">+178 kJ</span></div>
        <div class="E" data-at="7" data-fx="fade">positive ΔH ${ARR} <span class="warm">endothermic</span></div></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.3, b[4].start + 0.8))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="170" viewBox="0 0 440 170">${ball(40, 85, 32, 'gray', 'C')}<text x="94" y="99" text-anchor="middle" font-size="40" font-weight="900">+</text>${ball(142, 85, 26, 'teal', 'O')}${ball(188, 85, 26, 'teal', 'O')}
    <line x1="224" y1="85" x2="262" y2="85" stroke="#eef0f7" stroke-width="6" marker-end="url(#mk-text)"/>
    <ellipse cx="352" cy="85" rx="80" ry="48" fill="none" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/><text x="352" y="97" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">1 mol</text></svg>`
  const r2 = `<svg width="440" height="170" viewBox="0 0 440 170"><rect x="20" y="45" width="170" height="80" rx="20" fill="none" stroke="${TEAL}" stroke-width="5"/><text x="105" y="98" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">Σ prod</text>
    <text x="220" y="104" text-anchor="middle" font-size="60" font-weight="900">−</text>
    <rect x="250" y="45" width="170" height="80" rx="20" fill="none" stroke="${WARM}" stroke-width="5"/><text x="335" y="98" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">Σ react</text></svg>`
  const r3 = `<svg width="440" height="170" viewBox="0 0 440 170">${ball(150, 85, 44, 'teal', 'O')}${ball(234, 85, 44, 'teal', 'O')}<text x="330" y="104" font-size="56" font-weight="900" class="f-good">= 0</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>${DHF}&thinsp;: make <span class="gold">1 mol</span><br>of a compound<br>from its elements<br>in standard states</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>${DHR} =<br><span class="teal">Σ products</span><br>− <span class="warm">Σ reactants</span><br>(× coefficients)</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Elements in their<br>standard state<br><span class="good">= 0</span></p></div>`,
  })
})()
