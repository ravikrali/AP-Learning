// Pictures for chem-8.7 "pH vs. pKa & Indicators". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): red cabbage juice pink in
// vinegar, green in baking soda; pH < pKa -> HA, pH = pKa -> equal, pH > pKa -> A-; 10x per pH unit (10 to 1,
// 100 to 1); the pKa 9 indicator (acid form colourless, base form pink) at pH 4; visible at about 10 to 1, so a
// range of about pKa +/- 1; equivalence pH ~7, > 7 (phenolphthalein, pH 8-10), < 7; the 8.7 example with
// pKa 3.5 / 5.0 / 7.0 / 9.0; acetic acid pKa 4.74 at pH 7.0. Scales show order only; the molecule picture
// tracks the real ratio [A-]/[HA] = 10^(pH - pKa).
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-lab small{display:block;margin-top:4px;font-size:28px;font-weight:800;color:var(--muted)}
    .x-say{position:absolute;left:0;right:0;text-align:center;font-size:38px;font-weight:900;white-space:nowrap}
    .x-pink{color:#f27fb0}
    .x-step{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.85);border:2px solid var(--line);font-size:44px;font-weight:900;line-height:116px;white-space:nowrap}
    .x-step .t{position:absolute;left:40px} .x-step .v{position:absolute;left:700px}
    .x-step .c{position:absolute;left:1060px;top:30px;padding:0 24px;height:56px;border-radius:28px;font-size:30px;line-height:52px;border:2px solid var(--teal);background:rgba(60,199,188,.12)}
    .x-ind{position:absolute;top:470px;width:190px;height:62px;border-radius:31px;border:3px solid var(--line);background:rgba(36,40,56,.95);text-align:center;font-size:34px;font-weight:900;line-height:56px;white-space:nowrap}
    .x-tile{position:absolute;top:380px;width:390px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:100px;font-size:54px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', PINK = '#f27fb0', GREEN = '#4cc781', LINE = '#363c54'
  const PKA = 'pK<sub>a</sub>', AM = 'A<sup>−</sup>', HP = 'H<sup>+</sup>'
  const HAC = 'CH<sub>3</sub>COOH', AC = 'CH<sub>3</sub>COO<sup>−</sup>'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const ha = (x, y, s = 1) => `<g transform="translate(${x} ${y})">${ball(0, 0, 17 * s, 'pur')}${ball(20 * s, -13 * s, 10 * s, 'gold')}</g>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  // fraction in the base form A- at a distance d = pH - pKa
  const fA = (d) => 1 / (1 + Math.pow(10, -d))
  // a beaker centred on cx, rim at y0, base at y1, half width w; liquid from yl down
  const beaker = (cx, y0, y1, w, yl, liquid) => `<path d="M${cx - w + 3} ${yl}H${cx + w - 3}V${y1 - 30}Q${cx + w - 3} ${y1 - 3} ${cx + w - 30} ${y1 - 3}H${cx - w + 30}Q${cx - w + 3} ${y1 - 3} ${cx - w + 3} ${y1 - 30}Z" fill="rgba(255,255,255,.07)"/>
    ${liquid ? `<path d="M${cx - w + 3} ${yl}H${cx + w - 3}V${y1 - 30}Q${cx + w - 3} ${y1 - 3} ${cx + w - 30} ${y1 - 3}H${cx - w + 30}Q${cx - w + 3} ${y1 - 3} ${cx - w + 3} ${y1 - 30}Z" ${liquid}/>` : ''}
    <path d="M${cx - w} ${y0}V${y1 - 30}Q${cx - w} ${y1} ${cx - w + 30} ${y1}H${cx + w - 30}Q${cx + w} ${y1} ${cx + w} ${y1 - 30}V${y0}" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>`
  // the molecule that rides a pH pointer: HA (purple + gold H) fading to A- (teal) as the ratio shifts
  const rider = (p) => `<g class="${p}-ptr"><g class="${p}-mA">${ball(0, 470, 44, 'pur')}</g><g class="${p}-mB" style="opacity:0">${ball(0, 470, 44, 'teal')}</g>
    <g class="${p}-mH">${ball(36, 438, 24, 'gold')}</g>
    <text x="0" y="560" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">solution pH</text>
    <path d="M-20 572H20L0 604Z" fill="${WARM}"/></g>`
  // trims the last few percent so a form that is all but gone leaves no faint ghost on screen
  const cl = (f) => Math.min(1, Math.max(0, (f - 0.04) / 0.92))
  const ride = (c, p, x, f0) => {
    const f = cl(f0)
    mv(c, `.${p}-ptr`, x, 0)
    c.$(`.${p}-mA`).style.opacity = 1 - f; c.$(`.${p}-mB`).style.opacity = f
    c.$(`.${p}-mH`).setAttribute('transform', `translate(${30 * f} ${-30 * f})`)
    c.$(`.${p}-mH`).style.opacity = 1 - f
  }

  // ---------- intro: a faint row of HA molecules, one letting go of its proton ----------
  const IX = Array.from({ length: 13 }, (_, i) => 300 + i * 110)
  EZ.intro = {
    chips: [['1@0.35', 'Which form dominates'], ['1@0.6', 'Why indicators change color'], ['1@0.85', 'Picking an indicator']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">${IX.map((x, i) => i === 6 ? `<g transform="translate(${x} 900)"><g class="x-ia">${ball(0, 0, 22, 'pur')}</g><g class="x-ih">${ball(0, 0, 13, 'gold')}</g></g>` : ha(x, 900, 1.3)).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.2)
      c.$('.x-ih').setAttribute('transform', `translate(${lerp(26, 58, p)} ${lerp(-17, -36, p)})`)
    },
  }

  // ---------- hook: red cabbage juice, pink and green ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Kitchen chemistry</div><h2 class="h1" data-at="in+0.2">One juice, two colors</h2>
      <div class="card" style="left:120px;top:300px;width:880px;height:540px" data-at="0" data-fx="fade"><h3>Red cabbage juice</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade">${beaker(340, 420, 740, 120, 540, '')}</g>
        <g data-at="0@0.6" data-fx="fade">${beaker(340, 420, 740, 120, 540, `fill="${PINK}" opacity=".75"`)}</g>
        <g data-at="1" data-fx="fade">${beaker(780, 420, 740, 120, 540, '')}</g>
        <g data-at="1@0.5" data-fx="fade">${beaker(780, 420, 740, 120, 540, `fill="${GREEN}" opacity=".75"`)}</g>
      </svg>
      <div class="x-lab" style="left:190px;width:300px;top:764px;font-size:36px" data-at="0@0.3" data-fx="fade">vinegar: <span class="x-pink">pink</span></div>
      <div class="x-lab" style="left:570px;width:420px;top:764px;font-size:36px" data-at="1@0.2" data-fx="fade">baking soda: <span class="good">green</span></div>
      <div class="card" style="left:1060px;top:300px;width:740px;height:540px" data-at="2"><h3>An indicator</h3>
        <div class="x-say" style="top:100px;font-size:34px" data-at="3">a <span class="gold">weak acid</span> · two forms · two colors</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="4" data-fx="pop">${ball(1250, 570, 66, 'pur')}${ball(1314, 522, 36, 'gold')}</g>
        <g data-at="4@0.5" data-fx="pop">${ball(1610, 570, 66, 'teal')}</g>
      </svg>
      <div class="x-lab pri" style="left:1080px;width:340px;top:666px" data-at="4@0.1" data-fx="fade">HA<small>acid form · one color</small></div>
      <div class="x-lab teal" style="left:1440px;width:340px;top:666px" data-at="4@0.6" data-fx="fade">${AM}<small>base form · another color</small></div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">Which form wins? <span class="warm">pH</span> vs. <span class="gold">${PKA}</span></div>`,
  })

  // ---------- compare: where the pH sits relative to the pKa ----------
  const CX = 960, U = 200
  EZ.scene('compare', {
    html: `<div class="kicker" data-at="in" data-fx="left">Concept</div><h2 class="h1" data-at="0">Which form dominates?</h2>
      <div class="x-line" style="top:286px" data-at="1">Compare the solution's <span class="warm">pH</span> with the acid's <span class="gold">${PKA}</span></div>
      <div class="card" style="left:120px;top:370px;width:1680px;height:480px" data-at="0@0.4" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="fade"><rect x="${CX - 3 * U}" y="610" width="${6 * U}" height="22" rx="11" fill="${LINE}"/>
          <rect x="${CX - 4}" y="590" width="8" height="62" rx="4" fill="${GOLD}"/></g>
        <g data-at="2@0.3" data-fx="fade"><rect x="${CX - 3 * U}" y="610" width="${3 * U}" height="22" rx="11" fill="${PRI}" opacity=".45"/></g>
        <g data-at="4@0.3" data-fx="fade"><rect x="${CX}" y="610" width="${3 * U}" height="22" rx="11" fill="${TEAL}" opacity=".45"/></g>
        <g data-at="1@0.4" data-fx="fade">${rider('x-c')}</g>
      </svg>
      <div class="x-lab muted" style="left:${CX - 3 * U - 100}px;width:200px;top:650px;font-size:28px" data-at="1@0.2" data-fx="fade">lower pH</div>
      <div class="x-lab muted" style="left:${CX + 3 * U - 100}px;width:200px;top:650px;font-size:28px" data-at="1@0.2" data-fx="fade">higher pH</div>
      <div class="x-lab gold" style="left:${CX - 100}px;width:200px;top:656px;font-size:36px" data-at="1@0.2" data-fx="fade">${PKA}</div>
      <div class="x-lab pri" style="left:${CX - 1.6 * U - 150}px;width:300px;top:722px" data-at="2@0.4" data-fx="fade">HA dominates<small>pH &lt; ${PKA}</small></div>
      <div class="x-lab gold" style="left:${CX - 150}px;width:300px;top:722px" data-at="3@0.4" data-fx="fade">[HA] = [${AM}]<small>pH = ${PKA}</small></div>
      <div class="x-lab teal" style="left:${CX + 1.6 * U - 150}px;width:300px;top:722px" data-at="4@0.4" data-fx="fade">${AM} dominates<small>pH &gt; ${PKA}</small></div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">Is the pH <span class="teal">above</span> or <span class="pri">below</span> the ${PKA}?</div>`,
    update(c) {
      const b = c.b
      const d = lerp(lerp(-2.4, 0, eio(c.seg(b[3].start + 0.2, b[3].start + 1.4))), 2.4, eio(c.seg(b[4].start + 0.2, b[4].start + 1.4)))
      ride(c, 'x-c', CX + d * U, fA(d))
    },
  })

  // ---------- trick: low pH = loaded with protons ----------
  const HL = [[200, 420], [290, 475], [215, 535], [340, 405], [390, 520], [700, 412], [780, 470], [850, 410], [690, 530], [830, 545], [190, 605], [860, 605]]
  EZ.scene('trick', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="0">Low pH = <span class="gold">loaded with protons</span></h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:330px" data-at="1"><h3>pH &lt; ${PKA}: plenty of ${HP}</h3></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:330px" data-at="3"><h3>pH &gt; ${PKA}: ${HP} scarce</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${HL.map(([x, y]) => ball(x, y, 14, 'gold')).join('')}</g>
        <g data-at="1@0.1" data-fx="fade">${ball(525, 500, 46, 'pur')}${ball(562, 462, 25, 'gold')}</g>
        <g data-at="3@0.3" data-fx="fade">${ball(1110, 430, 14, 'gold')}${ball(1770, 600, 14, 'gold')}</g>
        <g data-at="3@0.1" data-fx="fade"><g class="x-tA">${ball(1395, 500, 46, 'pur')}</g><g class="x-tB" style="opacity:0">${ball(1395, 500, 46, 'teal')}</g><g class="x-tH">${ball(0, 0, 25, 'gold')}</g></g>
      </svg>
      <div class="x-lab pri" style="left:275px;width:500px;top:566px;font-size:34px" data-at="2@0.2" data-fx="fade">keeps its proton: HA</div>
      <div class="x-lab teal" style="left:1145px;width:500px;top:566px;font-size:34px" data-at="4@0.6" data-fx="fade">loses it: ${AM}</div>
      <div class="card" style="left:120px;top:660px;width:1680px;height:190px" data-at="5">
        <div class="x-say" style="top:16px;font-size:34px">Bigger gap ${ARR} more <span class="gold">lopsided</span> ratio</div>
        <div class="x-say" style="top:74px;font-size:34px" data-at="6">Each pH unit = a <span class="gold">10×</span> change in [<span class="teal">${AM}</span>]/[<span class="pri">HA</span>]</div>
        <div class="x-say" style="top:132px;font-size:34px" data-at="7">[<span class="teal">${AM}</span>] : [<span class="pri">HA</span>] &nbsp; pH = ${PKA} + 1 ${ARR} <span class="gold">10 : 1</span> &nbsp;·&nbsp; pH = ${PKA} + 2 ${ARR} <span class="gold">100 : 1</span></div></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[4].start + 0.1, b[4].start + 1.3))
      mv(c, '.x-tH', lerp(1432, 1680, p), lerp(462, 420, p))
      c.$('.x-tB').style.opacity = p; c.$('.x-tA').style.opacity = 1 - p
    },
  })

  // ---------- indicator: pKa 9, colourless acid form, pink base form ----------
  const px = (pH) => 860 + (pH - 2) * 80
  EZ.scene('indicator', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Indicators</div><h2 class="h1" data-at="1">Color changes around the ${PKA}</h2>
      <div class="card" style="left:120px;top:300px;width:620px;height:540px" data-at="2"><h3>Indicator, ${PKA} = 9</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.2" data-fx="fade">${beaker(320, 420, 740, 120, 540, `class="x-liq" fill="${PINK}" style="opacity:0"`)}</g>
      </svg>
      <div class="x-lab pri" style="left:480px;width:240px;top:440px" data-at="2@0.35" data-fx="fade">HA<small>colorless</small></div>
      <div class="x-lab teal" style="left:480px;width:240px;top:580px" data-at="2@0.7" data-fx="fade">${AM}<small class="x-pink" style="color:${PINK}">pink</small></div>
      <div data-at="3@0.5" data-fx="fade"><div class="x-lab x-cl" style="left:170px;width:300px;top:764px;font-size:36px">colorless</div>
        <div class="x-lab x-pink x-pk" style="left:170px;width:300px;top:764px;font-size:36px;opacity:0">pink</div></div>
      <div class="card" style="left:780px;top:300px;width:1020px;height:540px" data-at="2@0.3" data-fx="fade">
        <div class="x-say" style="top:420px;font-size:34px" data-at="5">Color shows at about <span class="gold">10 : 1</span></div>
        <div class="x-say" style="top:476px;font-size:34px" data-at="6">Change range ≈ <span class="gold">${PKA} ± 1</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.3" data-fx="fade"><rect x="${px(2)}" y="610" width="${px(13) - px(2)}" height="22" rx="11" fill="${LINE}"/></g>
        <g data-at="6@0.2" data-fx="fade"><rect x="${px(8)}" y="604" width="${px(10) - px(8)}" height="34" rx="10" fill="${GOLD}" opacity=".4"/></g>
        <g data-at="2@0.3" data-fx="fade"><rect x="${px(9) - 4}" y="590" width="8" height="62" rx="4" fill="${GOLD}"/></g>
        <g data-at="3" data-fx="fade"><rect x="${px(4) - 3}" y="630" width="6" height="22" fill="#a3abbd"/></g>
        <g data-at="3" data-fx="fade">${rider('x-i')}</g>
      </svg>
      <div class="x-lab gold" style="left:${px(9) - 100}px;width:200px;top:656px;font-size:34px" data-at="2@0.3" data-fx="fade">${PKA} 9</div>
      <div class="x-lab muted" style="left:${px(4) - 100}px;width:200px;top:656px;font-size:34px" data-at="3" data-fx="fade">pH 4</div>`,
    update(c) {
      const b = c.b, pH = lerp(4, 11, eio(c.seg(b[4].start + 0.2, b[4].start + 2.0))), f = cl(fA(pH - 9))
      ride(c, 'x-i', px(pH), f)
      c.$('.x-liq').style.opacity = 0.8 * f
      c.$('.x-cl').style.opacity = 1 - f; c.$('.x-pk').style.opacity = f
    },
  })

  // ---------- choose: pKa close to the equivalence-point pH ----------
  const qx = (pH) => 300 + (pH - 2) * 146.67
  const IND = [['3.5', 3.5], ['5.0', 5], ['7.0', 7], ['9.0', 9]]
  EZ.scene('choose', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">Choosing an indicator</div><h2 class="h1" data-at="in+0.2">Match the equivalence point</h2>
      <div class="x-line" style="top:286px" data-at="1">Pick an indicator with <span class="gold">${PKA}</span> close to the <span class="warm">equivalence-point pH</span></div>
      <div class="x-step" style="top:390px" data-at="2" data-out="5-0.35"><span class="t">strong acid + strong base</span><span class="v">equiv. pH <span class="gold">≈ 7</span></span></div>
      <div class="x-step" style="top:530px" data-at="3" data-out="5-0.35"><span class="t">weak acid + strong base</span><span class="v">equiv. pH <span class="gold">&gt; 7</span></span>
        <span class="c" data-at="3@0.4" data-fx="pop">phenolphthalein: changes ~pH 8–10</span></div>
      <div class="x-step" style="top:670px" data-at="4" data-out="5-0.35"><span class="t">weak base + strong acid</span><span class="v">equiv. pH <span class="gold">&lt; 7</span></span></div>
      <div class="card" style="left:120px;top:380px;width:1680px;height:470px" data-at="5" data-fx="fade">
        <div class="x-say" style="top:20px">Weak acid + NaOH</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="5@0.2" data-fx="fade"><rect x="${qx(2)}" y="630" width="${qx(11) - qx(2)}" height="22" rx="11" fill="${LINE}"/>
          <path d="M${qx(8.7) - 20} 690H${qx(8.7) + 20}L${qx(8.7)} 658Z" fill="${WARM}"/></g>
        ${IND.map(([, v], i) => `<g data-at="6@${(0.1 + i * 0.12).toFixed(2)}" data-fx="fade"><line class="x-st${i}" x1="${qx(v)}" y1="532" x2="${qx(v)}" y2="626" stroke="#a3abbd" stroke-width="5"/></g>`).join('')}
      </svg>
      <div class="x-lab warm" style="left:${qx(8.7) - 250}px;width:500px;top:700px;font-size:36px" data-at="5@0.3" data-fx="fade">equivalence pH ≈ 8.7</div>
      ${IND.map(([l, v], i) => `<div class="x-ind x-i${i}" style="left:${qx(v) - 95}px" data-at="6@${(0.1 + i * 0.12).toFixed(2)}" data-fx="pop">${PKA} ${l}</div>`).join('')}
      <div class="banner" style="top:870px" data-at="6@0.75" data-fx="pop">Closest ${PKA} ${ARR} <span class="gold">9.0</span></div>`,
    update(c) {
      const b = c.b, w = eo(c.seg(b[6].start + (b[6].end - b[6].start) * 0.72, b[6].start + (b[6].end - b[6].start) * 0.72 + 0.5))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-i' + i)
        if (i === 3) { el.style.borderColor = w ? `rgba(242,196,67,${w})` : ''; el.style.boxShadow = `0 0 ${50 * w}px rgba(242,196,67,${0.5 * w})`; c.$('.x-st3').setAttribute('stroke', w > 0.5 ? GOLD : '#a3abbd') }
        else el.style.filter = `brightness(${1 - 0.45 * w})`
      }
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', HAC, 54], ['B', AC, 54], ['C', 'Equal amounts', 44], ['D', 'Neither', 50]]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Acetic acid, ${PKA} 4.74, at pH 7.0</h2>
      <div class="x-line" style="top:286px;color:var(--muted)" data-at="1@0.3">Which form predominates?</div>
      ${OPTS.map(([l, f, fs], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.6 + i * 0.1).toFixed(2)}" data-fx="pop"><div class="l">${l}</div>
        ${i === 1 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}<div class="f" style="font-size:${fs}px">${f}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:660px" data-at="4" data-fx="pop">pH 7.0 &gt; ${PKA} 4.74 ${ARR} <span class="teal">${AC}</span> dominates</div>
      <div class="x-line" style="top:820px;font-size:38px;color:var(--muted)" data-at="5">Equal amounts only when pH = ${PKA}</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.75))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="40" y="110" width="380" height="14" rx="7" fill="${LINE}"/><rect x="226" y="98" width="8" height="38" rx="4" fill="${GOLD}"/>
    ${ball(120, 60, 32, 'pur')}${ball(146, 38, 17, 'gold')}${ball(340, 60, 32, 'teal')}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${beaker(150, 20, 140, 70, 70, '')}${beaker(310, 20, 140, 70, 70, `fill="${PINK}" opacity=".75"`)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="40" y="90" width="380" height="14" rx="7" fill="${LINE}"/><path d="M280 140H312L296 112Z" fill="${WARM}"/>
    <line x1="304" y1="48" x2="304" y2="86" stroke="${GOLD}" stroke-width="5"/><rect x="250" y="10" width="108" height="40" rx="20" fill="none" stroke="${GOLD}" stroke-width="4"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>pH &lt; ${PKA} ${ARR}<br><span class="pri">HA</span> dominates<br><br>pH &gt; ${PKA} ${ARR}<br><span class="teal">${AM}</span> dominates</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Indicators have<br>different colors in their<br><span class="pri">HA</span> and <span class="teal">${AM}</span> forms</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Pick an indicator with<br><span class="gold">${PKA}</span> ≈ the<br><span class="warm">equivalence-point pH</span></p></div>`,
  })
})()
