// Pictures for chem-7.4 "Calculating K & What Its Size Means". One EZ.scene per scene id in
// script.mjs. Numbers shown are the lesson's own (app/src/content/chem/u7.ts and chem/book.ts).
// Concentration bars are drawn to the lesson's values; the particle mixtures are only pictures of
// "mostly products", "both" and "mostly reactants" and carry no numbers.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', TXT = '#eef0f7'
  const css = document.createElement('style')
  css.textContent = `
    .k-eq{position:absolute;left:120px;top:186px;margin:0;font-size:68px;font-weight:900;letter-spacing:-1px;line-height:1.05;white-space:nowrap}
    .k-half{top:330px;width:810px;height:560px}
    .k-bar{position:absolute;left:40px;width:730px;height:120px}
    .k-bar .lab{position:absolute;left:0;top:0;font-size:40px;font-weight:900;white-space:nowrap}
    .k-bar .trk{position:absolute;left:0;top:62px;width:480px;height:40px;border-radius:20px;background:#2c3145}
    .k-bar .bf{position:absolute;left:0;top:62px;height:40px;border-radius:20px}
    .k-bar .val{position:absolute;left:504px;top:52px;font-size:40px;font-weight:900;white-space:nowrap}
    .k-row{position:absolute;left:40px;right:40px;display:flex;align-items:center;gap:22px;font-size:54px;font-weight:900;white-space:nowrap}
    .k-fr{display:inline-flex;flex-direction:column;align-items:center}
    .k-fr > span{display:block;padding:0 14px;line-height:1.15}
    .k-fr > i{display:block;align-self:stretch;height:6px;border-radius:3px;background:var(--text);margin:6px 0}
    .k-res{position:absolute;left:40px;right:40px;padding:18px 0;border-radius:24px;text-align:center;font-size:56px;font-weight:900;background:rgba(76,199,129,.14);border:3px solid var(--good)}
    .k-tag{position:absolute;padding:10px 26px;border-radius:999px;font-size:34px;font-weight:800;white-space:nowrap;background:rgba(36,40,56,.92);border:2px solid var(--line);color:var(--muted)}
    .k-tag b{font-weight:900}
    .k-end{position:absolute;width:560px;height:250px;padding:26px 30px;text-align:center}
    .k-end b{display:block;font-size:46px;font-weight:900;line-height:1.1} .k-end span{display:block;margin-top:10px;font-size:32px;font-weight:700;line-height:1.25;color:var(--muted)}
    .k-lvl{position:absolute;left:760px;width:1040px;height:156px}
    .k-lvl .k{position:absolute;left:34px;top:30px;font-size:52px;font-weight:900;white-space:nowrap} .k-lvl .lk{position:absolute;left:36px;top:98px;font-size:28px;font-weight:800;color:var(--muted);white-space:nowrap}
    .k-lvl .m{position:absolute;left:615px;top:24px;font-size:38px;font-weight:900;line-height:1.15;white-space:nowrap}
    .k-lvl .m span{display:block;font-size:27px;font-weight:700;color:var(--muted)}
    .k-lvl svg{position:absolute;left:300px;top:18px}
    .k-mix{top:390px;width:300px;height:400px;text-align:center}
    .k-mix h4{margin:22px 0 0;font-size:34px;font-weight:900;color:var(--muted)}
    .k-mix svg{display:block;margin:6px auto 0}
    .k-same{position:absolute;left:30px;right:30px;bottom:24px;padding:10px 0;border-radius:18px;font-size:34px;font-weight:900;background:rgba(242,196,67,.14);border:2px solid var(--gold)}
    .k-chg{position:absolute;left:1180px;width:620px;height:104px;padding:0 24px 0 100px;display:flex;align-items:center;border-radius:24px;font-size:38px;font-weight:900;background:rgba(36,40,56,.92);border:2px solid var(--line);white-space:nowrap}
    .k-chg i{position:absolute;left:24px;top:22px;width:60px;height:60px;border-radius:50%;font-style:normal;font-size:40px;font-weight:900;line-height:58px;text-align:center;color:#10131c}
    .k-mtr{position:absolute;left:40px;right:40px;height:150px}
    .k-mtr .q{font-size:40px;font-weight:900;white-space:nowrap} .k-mtr .q span{color:var(--muted);font-weight:800}
    .k-mtr .trk{position:absolute;left:0;top:70px;width:730px;height:46px;border-radius:23px;background:#2c3145;overflow:hidden}
    .k-mtr .bf{position:absolute;left:0;top:0;height:46px;border-radius:23px}
    .k-mtr .note{position:absolute;left:0;top:124px;font-size:28px;font-weight:800;color:var(--muted);white-space:nowrap}
    .k-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:38px;font-weight:800;line-height:1.2}
    .k-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .k-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .k-rcap{top:320px;width:540px;height:560px;text-align:center} .k-rcap .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .k-rcap svg{display:block;margin:14px auto 0} .k-rcap p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- shared pieces ----------
  /** a double harpoon (reversible arrow) from x to x + w, centred on y */
  const harpoon = (x, y, w, sw = 6, cf = TXT, cr = TXT) => `<path d="M${x} ${y - 9}H${x + w}l-20 -15" fill="none" stroke="${cf}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${x + w} ${y + 9}H${x}l20 15" fill="none" stroke="${cr}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
  const harpIn = `<svg width="80" height="48" viewBox="0 0 80 48" style="vertical-align:middle;margin:0 14px">${harpoon(6, 24, 68, 5)}</svg>`
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const frac = (top, bot, tc = '', bc = '') => `<span class="k-fr"><span class="${tc}">${top}</span><i></i><span class="${bc}">${bot}</span></span>`
  const N2O4 = 'N<sub>2</sub>O<sub>4</sub>', NO2 = 'NO<sub>2</sub>', H2 = 'H<sub>2</sub>', I2 = 'I<sub>2</sub>'
  const Kc = 'K<sub>c</sub>'
  const bar = (top, at, label, frac01, color, val) => `<div class="k-bar" style="top:${top}px" data-at="${at}" data-fx="fade">
      <div class="lab">${label}</div><div class="trk"></div>
      <div class="bf" style="width:${Math.round(480 * frac01)}px;background:${color}" data-at="${at}+0.2" data-fx="grow"></div>
      <div class="val ${color === PUR ? 'pri' : 'teal'}" data-at="${at}+0.4" data-fx="fade">${val}</div></div>`
  // a box of particles: n products (teal) and the rest reactants (purple), on a fixed grid
  const SPOTS = [[30, 30], [78, 58], [128, 26], [176, 62], [222, 30], [40, 96], [100, 108], [150, 100], [204, 104], [250, 80]]
  const mix = (nProd, w = 280, h = 130) => `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="20" fill="rgba(255,255,255,.03)" stroke="#363c54" stroke-width="3"/>
    ${SPOTS.map(([x, y], i) => `<g class="pt">${ball(x * (w / 280), y * (h / 130), 17, i < nProd ? 'teal' : 'pur')}</g>`).join('')}`

  // the log scale of K, from 10^-50 to 10^50
  const LX0 = 260, LX1 = 1660
  const lx = (e) => lerp(LX0, LX1, (e + 50) / 100)
  const scale = (y, big) => `<line x1="${LX0}" y1="${y}" x2="${LX1}" y2="${y}" stroke="#c9cee0" stroke-width="${big ? 6 : 8}" stroke-linecap="round"/>
    ${[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map((e) => `<line x1="${lx(e)}" y1="${y - (e % 50 === 0 || e === 0 ? 22 : 12)}" x2="${lx(e)}" y2="${y + (e % 50 === 0 || e === 0 ? 22 : 12)}" stroke="#c9cee0" stroke-width="4"/>`).join('')}`

  // ---------- intro artwork: the K scale, faintly, below the chips ----------
  EZ.intro = {
    chips: [['1@0.5', 'Calculate K'], ['1@0.7', 'Read its size'], ['1@0.86', 'What changes K']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      ${scale(880, true)}
      <text x="${lx(-50)}" y="934" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">${sup('10', '−50')}</text>
      <text x="${lx(50)}" y="934" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">${sup('10', '50')}</text>
      <g class="idot"><circle r="18" fill="${GOLD}"/></g></svg>`,
    update(c) {
      const s = c.t - c.sc.start, e = 50 * Math.sin(s * 0.7) * eo(clamp(s / 2))
      c.$('.idot').setAttribute('transform', `translate(${lx(e)} 880)`)
    },
  }

  // ---------- hook: the range of K ----------
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Equilibrium constant</div><h2 class="h1" data-at="0">K covers an enormous range</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.4" data-fx="fade">${scale(560)}
          <text x="${lx(0)}" y="630" text-anchor="middle" font-size="38" font-weight="900" class="f-muted">1</text></g>
        <text x="${lx(50)}" y="640" text-anchor="middle" font-size="54" font-weight="900" class="f-teal" data-at="1@0.4" data-fx="pop">${sup('10', '50')}</text>
        <text x="${lx(-50)}" y="640" text-anchor="middle" font-size="54" font-weight="900" class="f-pri" data-at="2@0.4" data-fx="pop">${sup('10', '−50')}</text>
        <g class="ptr"><path d="M0 -24L-22 -62H22Z" fill="${GOLD}"/><circle r="14" fill="${GOLD}"/><text y="-82" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">K</text></g>
      </svg>
      <div class="card k-end" style="left:120px;top:690px;border-color:rgba(141,141,240,.7)" data-at="3@0.55" data-fx="left"><b class="pri">Tiny K</b><span>the reaction<br>barely happens</span></div>
      <div class="card k-end" style="left:1240px;top:690px;border-color:rgba(60,199,188,.7)" data-at="3@0.3" data-fx="right"><b class="teal">Huge K</b><span>mostly products</span></div>
      <div style="position:absolute;left:0;top:790px;width:1920px;text-align:center"><div class="k-tag" style="position:relative;display:inline-block" data-at="4" data-fx="pop">Where does it <b class="gold">come from?</b></div></div>`,
    update(c) {
      const b = c.b
      let e = 0
      e = lerp(0, 50, eio(c.seg(b[1].start + 0.1, b[1].start + 1.2)))
      if (c.t > b[2].start) e = lerp(50, -50, eio(c.seg(b[2].start + 0.1, b[2].start + 1.4)))
      if (c.t > b[3].start) e = lerp(-50, 50, eio(c.seg(b[3].start + 0.3, b[3].end - 0.2)))
      if (c.t > b[4].start) e = lerp(50, 0, eio(c.seg(b[4].start, b[4].start + 1.2)))
      c.$('.ptr').setAttribute('transform', `translate(${lx(e)} 560)`)
      c.$('.ptr').style.opacity = c.seg(b[0].start + 0.6, b[0].start + 1)
    },
  })

  // ---------- calc: K from equilibrium data ----------
  EZ.scene('calc', {
    html: `<div class="kicker" data-at="in" data-fx="left">K from equilibrium data</div>
      <div class="k-eq" data-at="0@0.3"><span class="pri">${N2O4}(g)</span>${harpIn}<span class="teal">2${NO2}(g)</span></div>
      <div class="card k-half" style="left:120px;height:640px" data-at="1"><h3>At equilibrium</h3>
        ${bar(130, '1@0.3', `[${N2O4}]`, 0.045 / 0.05, PUR, '0.0450 M')}
        ${bar(290, '2@0.2', `[${NO2}]`, 0.016 / 0.05, TEAL, '0.0160 M')}
        <div class="k-tag" style="left:40px;top:450px" data-at="8@0.3" data-fx="pop">K has <b class="gold">no units</b></div></div>
      <div class="card k-half" style="left:990px;height:640px" data-at="3"><h3><small>1</small>Write the expression</h3>
        <div class="k-row" style="top:96px" data-at="4"><span>${Kc} =</span>${frac(`[${NO2}]<sup>2</sup>`, `[${N2O4}]`, 'teal', 'pri')}</div>
        <div style="position:absolute;left:40px;top:262px;font-size:42px;font-weight:900" data-at="5"><span style="display:inline-block;width:60px;height:60px;margin-right:18px;border-radius:50%;background:var(--brand);text-align:center;line-height:60px;font-size:34px">2</span>Plug in</div>
        <div class="k-row" style="top:330px" data-at="6"><span>${Kc} =</span>${frac('(0.0160)<sup>2</sup>', '0.0450', 'teal', 'pri')}</div>
        <div class="k-res" style="top:506px" data-at="7" data-fx="pop">${Kc} = 5.69 × 10<sup>−3</sup></div></div>`,
  })

  // ---------- calc2: the H2 + I2 example ----------
  EZ.scene('calc2', {
    html: `<div class="kicker" data-at="in" data-fx="left">One more</div>
      <div class="k-eq" data-at="1"><span class="pri">${H2}(g) + ${I2}(g)</span>${harpIn}<span class="teal">2HI(g)</span></div>
      <div class="card k-half" style="left:120px;height:520px" data-at="2"><h3>At equilibrium</h3>
        ${bar(110, '2@0.3', `[${H2}]`, 0.02 / 0.15, PUR, '0.020 M')}
        ${bar(240, '2@0.55', `[${I2}]`, 0.02 / 0.15, PUR, '0.020 M')}
        ${bar(370, '3@0.2', '[HI]', 0.14 / 0.15, TEAL, '0.14 M')}</div>
      <div class="card k-half" style="left:990px;height:520px" data-at="4"><h3>Calculate K</h3>
        <div class="k-row" style="top:110px;font-size:46px" data-at="4"><span>K =</span>${frac('[HI]<sup>2</sup>', `[${H2}][${I2}]`, 'teal', 'pri')}</div>
        <div class="k-row" style="top:290px;font-size:46px"><span data-at="4@0.2">=</span>${frac('<span data-at="4@0.6" data-fx="fade">0.0196</span>', '<span data-at="5@0.6" data-fx="fade">0.00040</span>', 'teal', 'pri')}<span class="k-res" style="position:relative;left:auto;right:auto;padding:12px 40px;margin-left:30px" data-at="6" data-fx="pop">= 49</span></div></div>
      <div class="banner" style="top:880px;font-size:46px" data-at="7" data-fx="pop">Write the expression ${ARR} plug in <span class="teal">equilibrium</span> values ${ARR} calculate</div>`,
  })

  // ---------- size: reading K ----------
  const LV = [['3', 'K ≫ 1', 9, 'teal', 'Mostly products', 'goes essentially to completion', 'f-teal'],
    ['5', 'K ≈ 1', 5, 'gold', 'Both', 'significant amounts of each', ''],
    ['6', 'K ≪ 1', 1, 'pri', 'Mostly reactants', 'barely proceeds', '']]
  EZ.scene('size', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reading K</div><h2 class="h1" data-at="0">What does the size of K mean?</h2>
      <div class="card" style="left:120px;top:330px;width:580px;height:480px" data-at="1">
        <div class="k-row" style="top:110px;justify-content:center;font-size:60px"><span>K =</span><span class="k-fr"><span class="teal knum" style="transform-origin:50% 100%">products</span><i></i><span class="pri">reactants</span></span></div>
        <div style="position:absolute;left:0;right:0;top:360px;text-align:center;font-size:40px;font-weight:900" data-at="2@0.3" data-fx="pop">big K ${ARR} <span class="teal">big numerator</span></div></div>
      ${LV.map(([at, k, n, col, m, s], i) => `<div class="card k-lvl" style="top:${330 + i * 176}px" data-at="${at}">
        <div class="k">${k}</div>${i === 0 ? '<div class="lk" data-at="3@0.6" data-fx="fade">like 10<sup>10</sup></div>' : i === 2 ? '<div class="lk" data-at="6@0.6" data-fx="fade">like 10<sup>−10</sup></div>' : ''}
        <svg width="280" height="130" viewBox="0 0 280 130">${mix(n)}</svg>
        <div class="m ${col}">${m}<span data-at="${i === 0 ? '4' : i === 1 ? '5@0.4' : '7'}" data-fx="fade">${s}</span></div></div>`).join('')}
      <div class="banner" style="top:880px" data-at="8" data-fx="pop">K is a <span class="teal">“product-favored”</span> meter</div>`,
    update(c) {
      const b = c.b, g = eio(c.seg(b[2].start + 0.2, b[2].start + 1))
      c.$('.knum').style.transform = `scale(${1 + 0.22 * g})`
    },
  })

  // ---------- temp: only temperature changes K ----------
  const MIXES = [[3, 4], [5, 7], [8, 10]] // [products, total] in each picture
  const flask = (p, tot) => `<svg width="220" height="190" viewBox="0 0 220 190"><path d="M80 10H140V64L206 172Q210 182 198 182H22Q10 182 14 172L80 64Z" fill="rgba(255,255,255,.04)" stroke="#a3abbd" stroke-width="5" stroke-linejoin="round"/>
    ${[[110, 150], [70, 156], [150, 156], [92, 122], [130, 122], [50, 166], [170, 166], [110, 100], [88, 166], [134, 166]].slice(0, tot).map(([x, y], i) => ball(x, y, 13, i < p ? 'teal' : 'pur')).join('')}</svg>`
  const CHG = [['4@0.05', 'Add more reactant', 'bad', '✕'], ['4@0.45', 'Compress the container', 'bad', '✕'], ['4@0.75', 'Add a catalyst', 'bad', '✕'], ['6', 'Change the temperature', 'good', '✓']]
  EZ.scene('temp', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">What changes K?</div><h2 class="h1" style="font-size:58px" data-at="1">Same reaction, same temperature: <span class="gold">same K</span></h2>
      ${MIXES.map(([p, tot], i) => `<div class="card k-mix" style="left:${120 + i * 330}px" data-at="2@${0.15 + i * 0.25}" data-fx="pop"><h4>Mixture ${i + 1}</h4>${flask(p, tot)}
        <div class="k-same gold" data-at="3@${0.3 + i * 0.15}" data-fx="pop">same K</div></div>`).join('')}
      <div class="k-tag" style="left:120px;top:820px;width:960px;text-align:center" data-at="5" data-fx="pop">These shift the <b class="teal">position</b> of equilibrium, <b class="warm">not K</b> ${ARR}</div>
      ${CHG.map(([at, t, col, mk], i) => `<div class="k-chg" style="top:${390 + i * 124}px;${i === 3 ? 'border-color:var(--good);background:rgba(76,199,129,.14)' : ''}" data-at="${at}" data-fx="right"><i style="background:var(--${col})">${mk}</i>${t}</div>`).join('')}
      <div class="banner" style="top:900px;font-size:46px" data-at="6@0.3" data-fx="pop">K depends only on <span class="warm">temperature</span></div>`,
    update(c) {
      // the tag points right at the list while it is up; hide it behind the banner after
      c.$('.k-tag').style.visibility = c.t < c.b[6].start + 0.2 ? '' : 'hidden'
    },
  })

  // ---------- trap: K is not speed ----------
  const mol = (x, y, g, lab) => `<g class="mo" data-x="${x}" data-y="${y}">${ball(-17, 0, 22, g)}${ball(17, 0, 22, g)}<text y="58" text-anchor="middle" font-size="26" font-weight="900" class="f-muted">${lab}</text></g>`
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The trap</div><h2 class="h1" data-at="1">K says <span class="warm">nothing</span> about speed</h2>
      <div class="card k-half" style="left:120px;height:520px" data-at="2"><h3>K = 10<sup>40</sup></h3>
        <div class="k-mtr" style="top:120px"><div class="q">How far? <span>(K)</span></div><div class="trk"><div class="bf" style="width:100%;background:linear-gradient(90deg,#1b7f77,#3cc7bc)" data-at="2@0.3" data-fx="grow"></div></div><div class="note">mostly products</div></div>
        <div class="k-mtr" style="top:330px" data-at="2@0.55" data-fx="fade"><div class="q">How fast? <span>(kinetics)</span></div><div class="trk"><div class="bf slow" style="width:0;background:linear-gradient(90deg,#b96a26,#f3a764)"></div></div><div class="note">can be incredibly slow</div></div></div>
      <div class="card k-half" style="left:990px;height:520px" data-at="3"><h3>${H2} and O<sub>2</sub> ${ARR} water</h3>
        <svg style="position:absolute;left:0;top:100px" width="810" height="300" viewBox="0 0 810 300">
          <rect x="150" y="20" width="510" height="250" rx="34" fill="rgba(255,255,255,.03)" stroke="#a3abbd" stroke-width="5"/>
          ${mol(250, 90, 'gray', 'H<tspan dy="7" font-size=".7em">2</tspan>')}${mol(400, 80, 'red', 'O<tspan dy="7" font-size=".7em">2</tspan>')}${mol(550, 100, 'gray', 'H<tspan dy="7" font-size=".7em">2</tspan>')}${mol(320, 190, 'gray', 'H<tspan dy="7" font-size=".7em">2</tspan>')}${mol(480, 190, 'red', 'O<tspan dy="7" font-size=".7em">2</tspan>')}
        </svg>
        <div class="k-tag" style="left:40px;top:420px;border-color:var(--accent)" data-at="3@0.6" data-fx="pop"><b class="teal">enormous K</b></div>
        <div class="k-tag" style="left:330px;top:420px;border-color:var(--warm)" data-at="4@0.3" data-fx="pop">unchanged for <b class="warm">years</b></div></div>
      <div class="k-tag" style="left:990px;top:880px;width:810px;text-align:center" data-at="4@0.7" data-fx="fade">because of a <b class="warm">large activation energy</b></div>
      <div class="banner" style="top:880px;width:810px;font-size:44px;padding:20px 20px" data-at="5" data-fx="pop">K: how <span class="teal">far</span>, not how <span class="warm">fast</span></div>`,
    update(c) {
      const b = c.b, s = Math.max(0, c.t - b[2].start - 1)
      c.$('.slow').style.width = `${Math.min(4, 0.25 * s)}%`
      for (const [i, m] of [...c.root.querySelectorAll('.mo')].entries()) {
        const dx = 5 * Math.sin(c.t * 1.3 + i * 1.7), dy = 4 * Math.cos(c.t * 1.1 + i * 2.3)
        m.setAttribute('transform', `translate(${+m.dataset.x + dx} ${+m.dataset.y + dy})`)
      }
    },
  })

  // ---------- try it ----------
  const OPTS = ['mostly products', 'mostly reactants', 'equal amounts', 'nothing: the reaction is complete']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">K = 2.5 × 10<sup>−12</sup>. At equilibrium, the mixture contains…</h2>
      ${OPTS.map((o, i) => `<div class="k-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${330 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? CHECK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="card" style="left:120px;top:680px;width:1680px;height:200px" data-at="8" data-fx="pop">
        <div class="k-row" style="top:62px;justify-content:center;font-size:50px"><span>K ≪ 1</span><i class="arr"></i><span>numerator (<span class="teal">products</span>) is tiny</span><i class="arr"></i><span class="pri">mostly reactants</span></div></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.5, b[7].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="190" viewBox="0 0 440 190"><text x="70" y="108" text-anchor="middle" font-size="46" font-weight="900">K =</text>
    <rect x="140" y="20" width="240" height="64" rx="16" fill="rgba(60,199,188,.18)" stroke="${TEAL}" stroke-width="3"/><text x="260" y="64" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">[products]</text>
    <line x1="130" y1="96" x2="390" y2="96" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/>
    <rect x="140" y="108" width="240" height="64" rx="16" fill="rgba(141,141,240,.18)" stroke="${PUR}" stroke-width="3"/><text x="260" y="152" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">[reactants]</text></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190"><g transform="translate(20 20) scale(.62)">${mix(9, 280, 130)}</g><text x="220" y="70" font-size="30" font-weight="900" class="f-teal">K ≫ 1</text>
    <g transform="translate(20 110) scale(.62)">${mix(1, 280, 130)}</g><text x="220" y="160" font-size="30" font-weight="900" class="f-pri">K ≪ 1</text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190"><path d="M70 30V128" stroke="#a3abbd" stroke-width="20" stroke-linecap="round"/><circle cx="70" cy="146" r="28" fill="${WARM}"/><path d="M70 80V146" stroke="${WARM}" stroke-width="12" stroke-linecap="round"/>
    <text x="140" y="80" font-size="32" font-weight="900" class="f-teal">how far ✓</text><text x="140" y="140" font-size="32" font-weight="900" class="f-warm">how fast ✕</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card k-rcap" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Plug the<br><span class="teal">equilibrium</span><br>concentrations<br>into K</p></div>
      <div class="card k-rcap" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>K ≫ 1: <span class="teal">mostly products</span><br>K ≪ 1: <span class="pri">mostly<br>reactants</span></p></div>
      <div class="card k-rcap" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Extent, <span class="warm">not speed</span><br>Only <span class="warm">temperature</span><br>changes K</p></div>`,
  })
})()
