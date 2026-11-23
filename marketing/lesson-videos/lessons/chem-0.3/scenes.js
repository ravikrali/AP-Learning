// Pictures for chem-0.3 "Atoms, Isotopes & Ions". One EZ.scene per scene id in script.mjs.
// All facts shown are the lesson's own (app/src/content/chem/u0.ts, lesson chem-0.3).
(() => {
  const { clamp, lerp, eio, eo, ball, sup } = EZ
  const css = document.createElement('style')
  css.textContent = `
    sub{font-size:.6em} sup{font-size:.6em;line-height:0}
    .pc{position:absolute;top:300px;width:540px;height:580px;text-align:center}
    .pc h3{font-size:50px;font-weight:900;margin-top:8px}
    .pc .row{position:absolute;left:0;right:0;text-align:center}
    .pc .row i{display:block;font-style:normal;font-size:28px;font-weight:800;color:var(--muted)}
    .pc .row b{display:block;font-size:42px;font-weight:900;margin-top:2px;white-space:nowrap}
    .bigc{position:absolute;top:300px;width:810px;text-align:center}
    .bigc h3{font-size:54px;font-weight:900;padding-top:28px}
    .bigc .big1{font-size:130px;font-weight:900;line-height:1.1;margin-top:10px}
    .bigc p{font-size:42px;font-weight:900;margin-top:14px;white-space:nowrap}
    .tile{position:absolute;top:360px;width:390px;height:220px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .tile .f{margin-top:58px;font-size:104px;font-weight:900;line-height:1}
    .tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .work{position:absolute;left:120px;top:650px;width:1680px;height:280px;text-align:center}
    .work .dg{position:absolute;left:0;right:0;top:10px;font-size:110px;font-weight:900}
    .work .lb{position:absolute;left:0;right:0;top:150px;font-size:40px;font-weight:900}
    .ex3{position:absolute;top:470px;width:540px;height:380px;text-align:center}
    .ex3 .n{font-size:120px;font-weight:900;line-height:1;margin-top:36px}
    .ex3 .w{font-size:40px;font-weight:900;margin-top:8px}
    .ex3 .s{font-size:34px;font-weight:800;color:var(--muted);margin-top:16px;line-height:1.3}
    .ch{position:absolute;top:810px;width:316px;height:96px;border-radius:24px;border:3px solid rgba(141,141,240,.6);background:rgba(141,141,240,.12);text-align:center;font-size:36px;font-weight:900;line-height:90px;white-space:nowrap}
    .ptx{position:absolute;left:1350px;width:450px;font-size:34px;font-weight:900;white-space:nowrap}
    .rc{top:320px;width:540px;height:580px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc .pic{height:190px;margin-top:20px;font-size:56px;font-weight:900;line-height:1.4;white-space:nowrap} .rc p{margin:14px 10px 0;font-size:34px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // a cluster of nucleus balls: protons warm, neutrons gray, alternating, packed in a spiral
  const nucParts = (cx, cy, np, nn, r) => {
    const list = []; let p = np, n = nn
    while (p > 0 || n > 0) { if (p > 0) { list.push('warm'); p-- } if (n > 0) { list.push('gray'); n-- } }
    const out = { warm: '', gray: '' }
    list.forEach((g, k) => {
      const rho = r * 1.7 * Math.sqrt(k + 0.4), a = k * 2.39996
      out[g] += ball(cx + rho * Math.cos(a), cy + rho * Math.sin(a), r, g)
    })
    return out
  }
  const nuc = (cx, cy, np, nn, r) => { const o = nucParts(cx, cy, np, nn, r); return o.gray + o.warm }
  const legend = (x, y) => `<g>${ball(x, y, 18, 'warm')}<text x="${x + 32}" y="${y + 11}" font-size="30" font-weight="800" class="f-text">proton</text>${ball(x + 190, y, 18, 'gray')}<text x="${x + 222}" y="${y + 11}" font-size="30" font-weight="800" class="f-text">neutron</text>${ball(x + 400, y, 18, 'pur')}<text x="${x + 432}" y="${y + 11}" font-size="30" font-weight="800" class="f-text">electron</text></g>`

  // ---------- intro artwork: faint symbols at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Three particles'], ['1@0.6', 'Isotopes'], ['1@0.86', 'Ions']],
    art: `<div style="position:absolute;left:36px;top:190px;font-size:84px;font-weight:900;color:#f3a764;opacity:.12;white-space:nowrap">Na<sup>+</sup></div>
      <div style="position:absolute;right:36px;top:190px;font-size:84px;font-weight:900;color:#3cc7bc;opacity:.12;white-space:nowrap">Cl<sup>−</sup></div>
      <div style="position:absolute;left:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap"><sup>12</sup>C</div>
      <div style="position:absolute;right:36px;top:850px;font-size:84px;font-weight:900;color:#8d8df0;opacity:.12;white-space:nowrap"><sup>14</sup>C</div>`,
  }

  // ---------- hook ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">One atom, three changes</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <circle cx="960" cy="520" r="190" fill="none" stroke="#363c54" stroke-width="3" stroke-dasharray="10 12" data-at="3"/>
        <g data-at="2" data-fx="fade">${nucParts(960, 520, 6, 6, 26).gray}</g>
        <g data-at="0@0.2" data-fx="fade">${nucParts(960, 520, 6, 6, 26).warm}</g>
        <g data-at="3"><g class="orb" transform="rotate(0 960 520)">${[0, 1, 2, 3, 4, 5].map((i) => ball(960 + 190 * Math.cos(i * Math.PI / 3), 520 + 190 * Math.sin(i * Math.PI / 3), 17, 'pur')).join('')}</g></g>
        <text x="960" y="770" text-anchor="middle" font-size="36" font-weight="900" style="fill:#f3a764" data-at="0@0.5">carbon: 6 protons</text>
      </svg>
      <div style="position:absolute;left:120px;top:810px;width:540px;height:110px;border-radius:26px;background:rgba(243,167,100,.14);border:3px solid rgba(243,167,100,.6);text-align:center;font-size:36px;font-weight:900;line-height:104px;white-space:nowrap" data-at="1" data-fx="pop"><span class="warm">Protons</span> → the element</div>
      <div style="position:absolute;left:690px;top:810px;width:540px;height:110px;border-radius:26px;background:rgba(170,177,196,.14);border:3px solid rgba(170,177,196,.6);text-align:center;font-size:36px;font-weight:900;line-height:104px;white-space:nowrap" data-at="2" data-fx="pop"><span style="color:#aab1c4">Neutrons</span> → an isotope</div>
      <div style="position:absolute;left:1260px;top:810px;width:540px;height:110px;border-radius:26px;background:rgba(141,141,240,.14);border:3px solid rgba(141,141,240,.6);text-align:center;font-size:36px;font-weight:900;line-height:104px;white-space:nowrap" data-at="3" data-fx="pop"><span class="pri">Electrons</span> → an ion</div>`,
    update(c) {
      const o = c.$('.orb'); if (o) o.setAttribute('transform', `rotate(${c.t * 40} 960 520)`)
    },
  })

  // ---------- three particles ----------
  const PART = [
    ['Proton', 'p', '⁺', 'warm', 'rgba(243,167,100,.7)', '+1', 'nucleus', '≈ 1 amu'],
    ['Neutron', 'n', '⁰', 'gray', 'rgba(170,177,196,.7)', '0', 'nucleus', '≈ 1 amu'],
    ['Electron', 'e', '⁻', 'pur', 'rgba(141,141,240,.7)', '−1', 'around nucleus', 'tiny'],
  ]
  EZ.scene('particles', {
    html: `<div class="kicker" data-at="in" data-fx="left">Inside the atom</div><h2 class="h1" data-at="0">Three particles</h2>
      ${PART.map(([nm, s, sg, g, col, ch, loc, mass], i) => `<div class="card pc" style="left:${120 + i * 570}px;border-color:${col}" data-at="${i + 1}">
        <svg viewBox="0 0 200 170" width="200" height="170" style="display:block;margin:26px auto 0">${ball(100, 85, i === 2 ? 34 : 64, g)}</svg>
        <h3>${nm} <span style="color:var(--muted)">(${s}${sg})</span></h3>
        <div class="row" style="top:300px" data-at="${i + 1}@0.3" data-fx="fade"><i>Charge</i><b>${ch}</b></div>
        <div class="row" style="top:388px" data-at="${i + 1}@0.5" data-fx="fade"><i>Location</i><b>${loc}</b></div>
        <div class="row" style="top:476px" data-at="${i + 1}@0.7" data-fx="fade"><i>Mass</i><b>${mass}</b></div></div>`).join('')}`,
  })

  // ---------- atomic number and mass number ----------
  EZ.scene('numbers', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two numbers</div><h2 class="h1" data-at="0">Describing an atom</h2>
      <div class="card bigc" style="left:120px;height:450px;border-color:rgba(243,167,100,.7)" data-at="1" data-fx="pop"><h3 class="warm">Atomic number (Z)</h3>
        <div class="big1 warm" data-at="1@0.3" data-fx="fade">Z</div><p data-at="1@0.5" data-fx="fade">= number of protons</p><p class="muted" style="font-size:36px;margin-top:6px" data-at="1@0.7" data-fx="fade">defines the element</p></div>
      <div class="card bigc" style="left:990px;height:450px;border-color:rgba(141,141,240,.7)" data-at="2" data-fx="pop"><h3 class="pri">Mass number (A)</h3>
        <div class="big1 pri" data-at="2@0.3" data-fx="fade">A</div><p data-at="2@0.5" data-fx="fade">= protons + neutrons</p></div>
      <div class="banner" style="top:800px;font-size:46px" data-at="3" data-fx="pop">Neutral atom: <span class="pri">electrons</span> = <span class="warm">protons</span></div>`,
  })

  // ---------- isotopes ----------
  EZ.scene('iso', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Isotopes</div><h2 class="h1" data-at="0">Same element, different neutrons</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:480px;border-color:rgba(60,199,188,.6)" data-at="1" data-fx="pop"></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:480px;border-color:rgba(60,199,188,.6)" data-at="1@0.5" data-fx="pop"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="525" y="370" text-anchor="middle" font-size="46" font-weight="900" class="f-text" data-at="1">Carbon-12</text>
        <text x="1395" y="370" text-anchor="middle" font-size="46" font-weight="900" class="f-text" data-at="1@0.5">Carbon-14</text>
        <g data-at="1" data-fx="fade">${nuc(525, 545, 6, 6, 22)}</g>
        <g data-at="1@0.5" data-fx="fade">${nuc(1395, 545, 6, 8, 22)}</g>
        <text x="525" y="745" text-anchor="middle" font-size="38" font-weight="900" style="fill:#aab1c4" data-at="1@0.35">6 neutrons</text>
        <text x="1395" y="745" text-anchor="middle" font-size="38" font-weight="900" style="fill:#aab1c4" data-at="1@0.8">8 neutrons</text>
        <g data-at="1@0.5" data-fx="fade">${legend(740, 840)}</g>
      </svg>
      <div class="banner" style="top:880px;font-size:44px" data-at="2" data-fx="pop">Both have <span class="warm">6 protons</span>, so both are carbon</div>`,
  })

  // ---------- ions ----------
  EZ.scene('ions', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Ions</div><h2 class="h1" data-at="0">Gain or lose electrons</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:470px;border-color:rgba(243,167,100,.6)" data-at="1" data-fx="pop"></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:470px;border-color:rgba(60,199,188,.6)" data-at="2" data-fx="pop"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1">${ball(525, 520, 95, 'warm', sup('Na', '+'), 62)}</g>
        <g data-at="2">${ball(1395, 520, 95, 'teal', sup('Cl', '−'), 62)}</g>
        <g class="e1" opacity="0">${ball(0, 0, 17, 'pur')}</g>
        <g class="e2" opacity="0">${ball(0, 0, 17, 'pur')}</g>
        <text x="525" y="690" text-anchor="middle" font-size="38" font-weight="900" style="fill:#f3a764" data-at="1@0.5">lost e⁻ → positive (cation)</text>
        <text x="1395" y="690" text-anchor="middle" font-size="38" font-weight="900" style="fill:#3cc7bc" data-at="2@0.5">gained e⁻ → negative (anion)</text>
        <text x="525" y="745" text-anchor="middle" font-size="32" font-weight="800" class="f-muted" data-at="1@0.6">more protons than electrons</text>
      </svg>
      <div class="banner" style="top:820px;font-size:48px" data-at="3" data-fx="pop"><span class="warm">Protons</span> never change. Only <span class="pri">electrons</span> move.</div>`,
    update(c) {
      const b = c.b
      const p1 = c.seg(b[1].start + 0.8, b[1].start + 2.4), e1 = c.$('.e1')
      e1.setAttribute('transform', `translate(${525 + 95 * 0.8 + p1 * 190} ${520 - 60 - p1 * 50})`)
      e1.setAttribute('opacity', p1 > 0 ? 1 - Math.pow(p1, 3) : 0)
      const p2 = c.seg(b[2].start + 0.8, b[2].start + 2.4), e2 = c.$('.e2')
      e2.setAttribute('transform', `translate(${1395 + 95 * 0.8 + (1 - p2) * 190} ${520 - 60 - (1 - p2) * 50})`)
      e2.setAttribute('opacity', p2 > 0 ? 1 - Math.pow(Math.max(0, p2 - 0.85) / 0.15, 2) : 0)
    },
  })

  // ---------- worked example ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Count the particles</div><h2 class="h1" data-at="0">How many in <sup style="font-size:.6em">56</sup>Fe<sup style="font-size:.6em">3+</sup>?</h2>
      <div class="card ex3" style="left:120px;border-color:rgba(243,167,100,.7)" data-at="1"><div class="n warm" data-at="1@0.3" data-fx="pop">26</div><div class="w warm">protons</div><div class="s" data-at="1@0.6" data-fx="fade">iron is element 26</div></div>
      <div class="card ex3" style="left:690px;border-color:rgba(170,177,196,.7)" data-at="2"><div class="n" style="color:#aab1c4" data-at="2@0.3" data-fx="pop">30</div><div class="w" style="color:#aab1c4">neutrons</div><div class="s" data-at="2@0.6" data-fx="fade">56 − 26 = 30<br>mass number − protons</div></div>
      <div class="card ex3" style="left:1260px;border-color:rgba(141,141,240,.7)" data-at="3"><div class="n pri" data-at="3@0.3" data-fx="pop">23</div><div class="w pri">electrons</div><div class="s" data-at="3@0.6" data-fx="fade">3+ → lost 3 electrons<br>26 − 3 = 23</div></div>`,
  })

  // ---------- memory trick ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Cations are “paws-itive”</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:300px;text-align:center;border-color:rgba(243,167,100,.7)" data-at="1" data-fx="pop">
        <div style="margin-top:36px;font-size:104px;font-weight:900">Ca<span class="warm" style="font-size:132px">t</span>ion</div>
        <div style="font-size:42px;font-weight:900;margin-top:6px" data-at="1@0.5" data-fx="fade">the <span class="warm">t</span> looks like a <span class="warm">+</span></div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:300px;text-align:center;border-color:rgba(60,199,188,.7)" data-at="2" data-fx="pop">
        <div style="margin-top:36px;font-size:104px;font-weight:900">A<span class="teal" style="font-size:132px">n</span>ion</div>
        <div style="font-size:42px;font-weight:900;margin-top:6px" data-at="2@0.5" data-fx="fade"><span class="teal">N</span>egative</div></div>
      <div class="banner" style="top:700px;font-size:46px" data-at="3" data-fx="pop">Losing a <span class="pri">negative</span> thing (an electron) makes you <span class="warm">more positive</span></div>`,
  })

  // ---------- periodic table map ----------
  const ROWS_N = 7, PITCH = 66, TX = 120, TY = 300
  const kind = (r, c) => {
    // schematic of the table: metalloids along the staircase, nonmetals upper right, metals elsewhere
    if (r === 0 && c === 0) return 'nm'
    const stair = { 1: 12, 2: 13, 3: 14, 4: 15 }
    if (stair[r] === c) return 'mt'
    if (r === 0) return 'nm'
    if (r >= 1 && r <= 4 && c > stair[r]) return 'nm'
    return 'me'
  }
  const COLK = { me: 'rgba(243,167,100,.55)', nm: 'rgba(60,199,188,.55)', mt: 'rgba(242,196,67,.75)' }
  const cells = []
  for (let r = 0; r < ROWS_N; r++) for (let c = 0; c < 18; c++) {
    if (r === 0 && c > 0 && c < 17) continue
    if ((r === 1 || r === 2) && c > 1 && c < 12) continue
    cells.push(`<div style="position:absolute;left:${TX + c * PITCH}px;top:${TY + r * PITCH}px;width:62px;height:62px;border-radius:10px;background:${COLK[kind(r, c)]}"></div>`)
  }
  const colHi = (c, at, col) => `<div style="position:absolute;left:${TX + c * PITCH - 4}px;top:${TY - 6}px;width:70px;height:${ROWS_N * PITCH + 4}px;border-radius:14px;border:4px solid ${col}" data-at="${at}" data-fx="fade"></div>`
  const CH = [['Group 1', '+1'], ['Group 2', '+2'], ['Al', '+3'], ['Group 16', '−2'], ['Group 17', '−1']]
  EZ.scene('table', {
    html: `<div class="kicker" data-at="in" data-fx="left">Periodic table map</div><h2 class="h1" data-at="0">Reading the table</h2>
      <div data-at="0" data-fx="fade">${cells.join('')}</div>
      <div class="ptx" style="top:300px" data-at="1" data-fx="right"><span class="pri">Rows</span> = periods</div>
      <div class="ptx" style="top:350px" data-at="1@0.4" data-fx="right"><span class="teal">Columns</span> = groups</div>
      <div class="ptx" style="top:430px;color:#f3a764" data-at="2" data-fx="right">■ metals: left and center</div>
      <div class="ptx" style="top:476px;color:#3cc7bc" data-at="2@0.3" data-fx="right">■ nonmetals: upper right</div>
      <div class="ptx" style="top:522px;color:#f2c443" data-at="2@0.6" data-fx="right">■ metalloids: the staircase</div>
      <div class="ptx" style="top:610px;font-size:30px" data-at="3" data-fx="right"><span class="warm">1</span> alkali metals</div>
      <div class="ptx" style="top:650px;font-size:30px" data-at="3@0.3" data-fx="right"><span class="warm">2</span> alkaline earth metals</div>
      <div class="ptx" style="top:690px;font-size:30px" data-at="3@0.6" data-fx="right"><span class="teal">17</span> halogens</div>
      <div class="ptx" style="top:730px;font-size:30px" data-at="3@0.85" data-fx="right"><span class="teal">18</span> noble gases</div>
      ${colHi(0, '3', '#f3a764')}${colHi(1, '3@0.3', '#f3a764')}${colHi(16, '3@0.6', '#3cc7bc')}${colHi(17, '3@0.85', '#3cc7bc')}
      ${CH.map(([g, ch], i) => `<div class="ch" style="left:${120 + i * 338}px" data-at="4@${(i * 0.17).toFixed(2)}" data-fx="pop">${g} <span class="${ch[0] === '+' ? 'warm' : 'teal'}">${ch}</span></div>`).join('')}
      <div style="position:absolute;left:120px;top:772px;width:1188px;text-align:left;font-size:26px;font-weight:800;color:var(--muted)" data-at="4" data-fx="fade">typical ion charges</div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'Mg', '⁺'], ['B', 'Mg', '²⁺'], ['C', 'Mg', '²⁻'], ['D', 'Mg', '⁻']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What ion does <span class="teal">magnesium</span><br>(Group 2) usually form?</h2>
      ${OPTS.map(([l, e, s], i) => `<div class="tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.5 + i * 0.125}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <div class="f">${e}${s}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="760" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="760" r="74" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 760)"/>
        <text class="num" x="960" y="786" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="890" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card work" data-at="4-0.1">
        <div class="dg" data-at="4@0.05" data-fx="fade"><span class="good">Mg<sup>2+</sup></span></div>
        <div class="lb" data-at="4@0.3" data-fx="fade"><span class="warm">Group 2 metals lose their 2 outer electrons</span></div>
        <div class="lb" style="top:205px" data-at="5@0.1" data-fx="fade"><span class="muted">losing electrons</span> &nbsp;→&nbsp; <span class="good">positive ion</span></div></div>`,
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
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div><div class="pic"><svg viewBox="0 0 400 190" width="400" height="190">${ball(90, 95, 44, 'warm')}${ball(200, 95, 44, 'gray')}${ball(310, 95, 26, 'pur')}</svg></div><p>Protons decide the element.<br>Neutrons decide the isotope.<br>Electrons decide the charge.</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div><div class="pic" style="font-size:72px"><span class="pri">A</span> = <span class="warm">p</span> + <span style="color:#aab1c4">n</span></div><p>Mass number =<br>protons + neutrons</p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div><div class="pic"><span class="warm">Na<sup>+</sup></span> &nbsp; <span class="teal">Cl<sup>−</sup></span></div><p><span class="warm">Positive ion</span> = lost electrons<br><span class="teal">Negative ion</span> = gained electrons</p></div>`,
  })
})()
