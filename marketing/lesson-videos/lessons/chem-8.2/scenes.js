// Pictures for chem-8.2 "Strong Acids & Strong Bases". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u8.ts and chem/book.ts): Ba(OH)2 0.0050 M
// -> pH 12.00, KOH 0.0010 M -> pH 11.00, Ca(OH)2 0.10 M -> 0.20 M OH-, HNO3 0.010 M -> pH 2.00 and
// 0.0010 M -> pH 3.00, and the try question (0.025 M HNO3 -> pH 1.60). Particle sizes are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .s-line{position:absolute;left:0;width:1920px;text-align:center;font-size:48px;font-weight:900;white-space:nowrap}
    .s-side{position:absolute;left:1000px;width:800px;height:150px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);padding:0 36px;display:flex;flex-direction:column;justify-content:center}
    .s-side b{display:block;font-size:46px;font-weight:900;line-height:1.15;white-space:nowrap} .s-side span{display:block;margin-top:6px;font-size:30px;font-weight:700;color:var(--muted);white-space:nowrap}
    .s-acid{position:absolute;width:520px;height:170px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .s-acid .F{margin-top:22px;font-size:72px;font-weight:900;line-height:1} .s-acid .N{margin-top:12px;font-size:30px;font-weight:800;color:var(--muted)}
    .s-wd{position:absolute;top:330px;width:280px;text-align:center}
    .s-wd .W{font-size:64px;font-weight:900;white-space:nowrap} .s-wd .W b{font-weight:900}
    .s-wd .F{margin-top:26px;height:120px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:50px;font-weight:900;line-height:116px;white-space:nowrap}
    .s-weak{position:absolute;top:790px;height:96px;padding:0 36px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:46px;font-weight:900;line-height:92px;color:var(--muted);white-space:nowrap}
    .s-chip{position:absolute;top:372px;height:80px;padding:0 30px;border-radius:20px;background:rgba(240,112,122,.1);border:2px solid rgba(240,112,122,.5);font-size:36px;font-weight:800;line-height:76px;white-space:nowrap}
    .s-chip s{text-decoration-color:var(--bad);text-decoration-thickness:5px}
    .s-pc{position:absolute;top:480px;width:810px;height:420px}
    .s-pc h3{text-align:center}
    .s-pc .S{position:absolute;left:0;right:0;bottom:24px;text-align:center;font-size:36px;font-weight:900}
    .s-bc{position:absolute;top:370px;width:810px;height:440px}
    .s-bc .R{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:50px;font-weight:900;white-space:nowrap}
    .s-row{position:absolute;left:120px;width:1680px;height:104px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .s-row .L{position:absolute;left:30px;top:0;line-height:100px;font-size:30px;font-weight:900;color:var(--muted);letter-spacing:.06em;white-space:nowrap}
    .s-row .E{position:absolute;left:250px;top:0;line-height:100px;font-size:52px;font-weight:900;white-space:nowrap}
    .s-row .D{position:absolute;right:36px;top:0;line-height:100px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .s-tile{position:absolute;top:330px;width:390px;height:230px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .s-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .s-tile .f{margin-top:60px;font-size:84px;font-weight:900;line-height:1} .s-tile .ch{margin-top:20px;font-size:34px;font-weight:800}
    .s-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px;opacity:0}
    .s-ans{position:absolute;left:120px;width:1680px;height:110px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);font-size:50px;font-weight:900;line-height:106px;padding:0 40px;white-space:nowrap}
    .s-rc{top:320px;width:540px;height:580px;text-align:center} .s-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .s-rc svg{display:block;margin:14px auto 0} .s-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', MUTED = '#a3abbd', BAD = '#f0707a', GOOD = '#4cc781'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  // HTML formulas
  const s = (n) => `<sub>${n}</sub>`, p = (n) => `<sup>${n}</sup>`
  const H3O = `H${s(3)}O${p('+')}`, OH = `OH${p('−')}`
  const F = { HCl: 'HCl', HBr: 'HBr', HI: 'HI', HClO4: `HClO${s(4)}`, HNO3: `HNO${s(3)}`, H2SO4: `H${s(2)}SO${s(4)}`, HF: 'HF', AC: `CH${s(3)}COOH`, H2CO3: `H${s(2)}CO${s(3)}`, CaOH2: `Ca(OH)${s(2)}`, BaOH2: `Ba(OH)${s(2)}`, KNO3: `KNO${s(3)}`, NO3: `NO${s(3)}${p('−')}` }
  // SVG labels (lowered / raised tspans)
  const lo = (n) => `<tspan dy=".28em" font-size=".62em">${n}</tspan><tspan dy="-.28em"></tspan>`
  const hi = (n) => `<tspan dy="-.5em" font-size=".62em">${n}</tspan><tspan dy=".5em"></tspan>`
  const sH3O = `H${lo(3)}O${hi('+')}`, sOH = `OH${hi('−')}`

  // ---------- intro artwork: a faint beaker of ions (left) and a pH scale (right) ----------
  const IONS = [[120, 720, 'warm'], [210, 760, 'teal'], [150, 820, 'teal'], [260, 700, 'warm'], [240, 850, 'warm'], [110, 880, 'teal']]
  EZ.intro = {
    chips: [['1@0.25', 'Six strong acids'], ['1@0.4', 'Strong bases'], ['1@0.55', 'pH in one step']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2" font-weight="900">
      <path d="M70 650 V880 Q70 920 110 920 H290 Q330 920 330 880 V650" fill="none" stroke="#c9cee0" stroke-width="7" stroke-linejoin="round"/>
      ${IONS.map(([x, y, g], i) => `<g class="s-ii${i}">${ball(x, y, 26, g)}</g>`).join('')}
      <rect x="1700" y="650" width="44" height="270" rx="22" fill="none" stroke="#c9cee0" stroke-width="5"/>
      <text x="1722" y="630" font-size="46" text-anchor="middle" style="fill:#c9cee0">pH</text>
      <g class="s-ipd"><circle cx="1722" cy="0" r="26" fill="${WARM}"/></g>
    </svg>`,
    update(c) {
      const t = c.t - c.sc.start
      IONS.forEach((_, i) => c.$('.s-ii' + i).setAttribute('transform', `translate(${6 * Math.sin(t * 1.2 + i * 1.9)} ${6 * Math.cos(t + i * 2.3)})`))
      c.$('.s-ipd').setAttribute('transform', `translate(0 ${lerp(890, 680, eio(c.seg(c.sc.start + 0.8, c.sc.start + 3.4)))})`)
    },
  }

  // ---------- hook: a strong acid ionizes completely ----------
  const PAIRS = [[290, 450], [500, 450], [710, 450], [290, 700], [500, 700], [710, 700]]
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Strong acids</div><h2 class="h1" data-at="0">The easy ones</h2>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900">
        <g data-at="0@0.3" data-fx="fade">
          <path d="M150 330 V860 Q150 920 210 920 H770 Q830 920 830 860 V330" fill="rgba(141,141,240,.07)" stroke="#c9cee0" stroke-width="7" stroke-linejoin="round"/>
          <text x="490" y="980" text-anchor="middle" font-size="34" class="f-muted">HCl in water</text>
        </g>
        ${PAIRS.map((_, i) => `<g class="s-hh${i}">${ball(0, 0, 30, 'warm', sH3O, 22)}</g><g class="s-hc${i}">${ball(0, 0, 40, 'teal', `Cl${hi('−')}`, 26)}</g>`).join('')}
      </svg>
      <div class="s-side" style="top:330px;border-color:rgba(243,167,100,.6)" data-at="1" data-fx="right"><b class="warm">Ionizes 100%</b><span>every molecule gives up its proton</span></div>
      <div class="s-side" style="top:520px;border-color:rgba(60,199,188,.6)" data-at="3" data-fx="right"><b>[${H3O}] = [<i class="teal" style="font-style:normal">acid</i>]</b><span>acid concentration = hydronium concentration</span></div>
      <div class="s-side" style="top:710px;border-color:rgba(141,141,240,.6)" data-at="4" data-fx="right"><b class="pri">One step ${ARR} pH</b><span>straight from the concentration</span></div>`,
    update(c) {
      const b = c.b, sp = eio(c.seg(b[2].start + 0.3, b[2].start + 1.8))
      PAIRS.forEach(([x, y], i) => {
        c.$('.s-hh' + i).setAttribute('transform', `translate(${x - 36 - sp * 30} ${y + sp * 75})`)
        c.$('.s-hc' + i).setAttribute('transform', `translate(${x + 30 + sp * 20} ${y - sp * 50})`)
        const vis = c.seg(b[0].start + 0.3, b[0].start + 0.8)
        c.$('.s-hh' + i).style.opacity = vis; c.$('.s-hc' + i).style.opacity = vis
      })
    },
  })

  // ---------- the six strong acids ----------
  const SIX = [[F.HCl, 'hydrochloric', '1@0.1'], [F.HBr, 'hydrobromic', '1@0.4'], [F.HI, 'hydroiodic', '1@0.7'], [F.HClO4, 'perchloric', '2@0.1'], [F.HNO3, 'nitric', '2@0.6'], [F.H2SO4, 'sulfuric', '3@0.1']]
  EZ.scene('acids', {
    html: `<div class="kicker" data-at="in" data-fx="left">Memorize these</div><h2 class="h1" data-at="0">The six strong acids</h2>
      ${SIX.map(([f, n, at], i) => `<div class="s-acid${i === 5 ? ' s-so4' : ''}" style="left:${120 + (i % 3) * 580}px;top:${320 + Math.floor(i / 3) * 200}px" data-at="${at}" data-fx="pop"><div class="F">${f}</div><div class="N">${n}</div></div>`).join('')}
      <div class="banner" style="top:740px" data-at="4" data-fx="pop">Completely ionized ${ARR} [${H3O}] = [acid]</div>
      <div class="s-line gold" style="top:890px;font-size:42px" data-at="5@0.3" data-fx="fade">${F.H2SO4}: only the first proton is strong</div>`,
    update(c) {
      const on = c.at('5') <= c.t
      const el = c.$('.s-so4')
      el.style.borderColor = on ? GOLD : ''
      el.style.boxShadow = on ? '0 0 40px rgba(242,196,67,.4)' : ''
    },
  })

  // ---------- mnemonic ----------
  const WORDS = [['S', 'o', F.H2SO4, '1@0.05'], ['I', '', F.HI, '1@0.4'], ['Br', 'ought', F.HBr, '1@0.7'], ['N', 'o', F.HNO3, '2@0.05'], ['Cl', 'ean', F.HCl, '2@0.4'], ['Cl', 'othes', F.HClO4, '2@0.75']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">“So I Brought No Clean Clothes”</h2>
      ${WORDS.map(([a, r, f, at], i) => `<div class="s-wd" style="left:${120 + i * 280}px"><div class="W" data-at="0@${0.3 + i * 0.08}" data-fx="up"><b class="warm">${a}</b>${r}</div>
        <div class="F" style="margin-left:14px;margin-right:14px" data-at="${at}" data-fx="pop">${f}</div></div>`).join('')}
      <div class="banner" style="top:620px" data-at="3" data-fx="pop">Not on the list? Treat it as <span class="warm">weak</span></div>
      <div class="s-weak" style="left:430px" data-at="4@0.1" data-fx="pop">${F.HF}</div>
      <div class="s-weak" style="left:700px" data-at="4@0.35" data-fx="pop">${F.AC}</div>
      <div class="s-weak" style="left:1180px" data-at="4@0.7" data-fx="pop">${F.H2CO3}</div>`,
  })

  // ---------- what "strong" means ----------
  const SION = [[110, 70, 'w'], [220, 120, 'c'], [340, 60, 'w'], [460, 120, 'c'], [580, 60, 'w'], [700, 120, 'c'], [150, 200, 'c'], [290, 190, 'w'], [420, 210, 'c'], [560, 200, 'w'], [690, 220, 'c']]
  const ionOf = (k) => (k === 'w' ? ball(0, 0, 26, 'warm', sH3O, 18) : ball(0, 0, 32, 'teal', `Cl${hi('−')}`, 22))
  const MOLS = [[140, 80], [320, 70], [500, 80], [670, 70], [200, 200], [640, 205]]
  const hf = `${ball(-22, 0, 22, 'gray', 'H', 20)}${ball(18, 0, 30, 'teal', 'F', 24)}`
  EZ.scene('strong', {
    html: `<div class="kicker" data-at="in" data-fx="left">What it means</div><h2 class="h1" data-at="0">What does “strong” mean?</h2>
      <div class="s-line" style="top:286px;text-align:left;left:120px;width:auto;font-size:46px" data-at="1">Strong = <span class="teal">how far the acid ionizes</span></div>
      <div class="s-chip" style="left:120px" data-at="2@0.2" data-fx="pop"><s>how concentrated</s></div>
      <div class="s-chip" style="left:520px" data-at="2@0.6" data-fx="pop"><s>how dangerous</s></div>
      <div class="card s-pc" style="left:120px" data-at="3"><h3 class="warm">Strong acid (HCl)</h3>
        <svg style="position:absolute;left:0;top:70px" width="810" height="300" font-weight="900">${SION.map(([x, y, k]) => `<g transform="translate(${x} ${y})">${ionOf(k)}</g>`).join('')}</svg>
        <div class="S">all ions</div></div>
      <div class="card s-pc" style="left:990px" data-at="4"><h3 class="teal">Weak acid (HF)</h3>
        <svg style="position:absolute;left:0;top:70px" width="810" height="300" font-weight="900">${MOLS.map(([x, y]) => `<g transform="translate(${x} ${y})">${hf}</g>`).join('')}
          <g transform="translate(360 200)">${ball(0, 0, 26, 'warm', sH3O, 18)}</g><g transform="translate(460 215)">${ball(0, 0, 30, 'teal', `F${hi('−')}`, 22)}</g></svg>
        <div class="S muted">mostly molecules</div></div>
      <div class="s-line" style="top:930px;font-size:38px" data-at="5">A dilute <span class="warm">strong</span> acid can be less acidic than a concentrated <span class="teal">weak</span> acid</div>`,
  })

  // ---------- conjugate bases and neutral salts ----------
  EZ.scene('salts', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Bonus</div><h2 class="h1" data-at="0">Neutral salts</h2>
      <div class="card" style="left:120px;top:330px;width:810px;height:520px" data-at="1"><h3>Conjugate bases</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="260" font-weight="900">
          <g data-at="1@0.4" data-fx="pop">${ball(250, 120, 70, 'teal', `Cl${hi('−')}`, 46)}</g>
          <g data-at="1@0.55" data-fx="pop">${ball(560, 120, 80, 'pur', `NO${lo(3)}${hi('−')}`, 42)}</g></svg>
        <div style="position:absolute;left:0;right:0;bottom:40px;text-align:center;font-size:40px;font-weight:900" class="muted" data-at="1@0.8" data-fx="fade">too weak to change the pH</div></div>
      <div class="card" style="left:990px;top:330px;width:810px;height:520px" data-at="2"><h3>Their salts</h3>
        <div style="position:absolute;left:0;right:0;top:150px;text-align:center;font-size:80px;font-weight:900" data-at="2@0.4" data-fx="pop">NaCl &nbsp; ${F.KNO3}</div>
        <div style="position:absolute;left:170px;right:170px;top:330px;padding:18px;border-radius:22px;text-align:center;font-size:48px;font-weight:900;background:rgba(76,199,129,.16);border:2px solid var(--good)" class="good" data-at="2@0.7" data-fx="pop">neutral solutions</div></div>`,
  })

  // ---------- strong bases ----------
  EZ.scene('bases', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Strong bases</div><h2 class="h1" data-at="0">The strong hydroxides</h2>
      <div class="s-line" style="top:286px;text-align:left;left:120px;width:auto;font-size:40px" data-at="0@0.3">Group 1 hydroxides, and Group 2 like ${F.CaOH2}, ${F.BaOH2}<span data-at="1" data-fx="fade"> · dissociate <span class="teal">completely</span></span></div>
      <div class="card s-bc" style="left:120px" data-at="2"><h3><small>1</small>Group 1: NaOH, KOH</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="200" font-weight="900">
          <g class="s-na">${ball(0, 0, 44, 'warm', `Na${hi('+')}`, 28)}</g><g class="s-o1">${ball(0, 0, 44, 'teal', sOH, 28)}</g></svg>
        <div class="R" data-at="3" data-fx="pop">[${OH}] = <span class="teal">[base]</span></div></div>
      <div class="card s-bc" style="left:990px" data-at="4"><h3><small>2</small>Group 2: ${F.CaOH2}</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="200" font-weight="900">
          <g class="s-ca">${ball(0, 0, 48, 'gold', `Ca${hi('2+')}`, 26)}</g><g class="s-o2">${ball(0, 0, 44, 'teal', sOH, 28)}</g><g class="s-o3">${ball(0, 0, 44, 'teal', sOH, 28)}</g></svg>
        <div class="R" data-at="5" data-fx="pop">[${OH}] = <span class="gold">2 ×</span> <span class="teal">[base]</span></div></div>
      <div class="banner" style="top:850px" data-at="6" data-fx="pop">0.10 M ${F.CaOH2} ${ARR} [${OH}] = <span class="gold">0.20 M</span></div>`,
    update(c) {
      const b = c.b, a = eio(c.seg(b[2].start + 1.2, b[2].start + 2.4)), g = eio(c.seg(b[4].start + 0.6, b[4].start + 1.8))
      c.$('.s-na').setAttribute('transform', `translate(${lerp(365, 250, a)} 100)`)
      c.$('.s-o1').setAttribute('transform', `translate(${lerp(445, 560, a)} 100)`)
      c.$('.s-ca').setAttribute('transform', `translate(405 100)`)
      c.$('.s-o2').setAttribute('transform', `translate(${lerp(318, 210, g)} 100)`)
      c.$('.s-o3').setAttribute('transform', `translate(${lerp(492, 600, g)} 100)`)
    },
  })

  // ---------- worked example ----------
  EZ.scene('example', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">pH of 0.0050 M ${F.BaOH2}</h2>
      <div class="s-row" style="top:300px" data-at="1"><div class="L">STEP 1</div><div class="E">[${OH}] = <span class="gold">2</span> × 0.0050 = <span class="teal">0.010 M</span></div><div class="D">two ${OH} per unit</div></div>
      <div class="s-row" style="top:424px" data-at="2"><div class="L">STEP 2</div><div class="E">pOH = −log(0.010) = <span class="teal">2.00</span></div></div>
      <div class="s-row" style="top:548px;border-color:rgba(242,196,67,.7)" data-at="3"><div class="L">STEP 3</div><div class="E">pH = 14.00 − 2.00 = <span class="gold">12.00</span></div></div>
      <div class="card" style="left:120px;top:710px;width:1680px;height:200px" data-at="4"><h3 class="muted" style="font-size:34px;padding-top:24px">Compare: Group 1, 0.0010 M KOH</h3>
        <div style="position:absolute;left:40px;top:96px;font-size:48px;font-weight:900;white-space:nowrap" data-at="5">No doubling: [${OH}] = 0.0010 M ${ARR} pOH = 3.00 ${ARR} <span class="gold">pH = 11.00</span></div></div>`,
  })

  // ---------- dilution ----------
  const PX = (v) => 200 + v * 108.6
  EZ.scene('dilute', {
    html: `<div class="kicker" data-at="in" data-fx="left">Handy pattern</div><h2 class="h1" data-at="0">Dilute a strong acid</h2>
      <div class="banner" style="top:300px" data-at="1" data-fx="pop">Each tenfold dilution ${ARR} pH goes up by <span class="gold">1</span></div>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900" text-anchor="middle">
        <g data-at="2" data-fx="fade">
          <rect x="${PX(0)}" y="660" width="${PX(14) - PX(0)}" height="24" rx="12" fill="#2c3145"/>
          ${Array.from({ length: 15 }, (_, v) => `<line x1="${PX(v)}" y1="694" x2="${PX(v)}" y2="712" stroke="#c9cee0" stroke-width="3"/><text x="${PX(v)}" y="750" font-size="30" class="f-muted">${v}</text>`).join('')}
          <text x="${PX(7)}" y="800" font-size="30" class="f-muted">pH</text>
          <g transform="translate(${PX(2)} 0)"><circle cy="672" r="22" fill="${WARM}" opacity=".45"/><text y="570" font-size="36" class="f-warm">0.010 M</text><text y="610" font-size="30" class="f-muted">pH 2.00</text></g>
        </g>
        <g data-at="3@0.3" data-fx="fade"><g transform="translate(${PX(3)} 0)"><text y="470" font-size="36" class="f-teal">0.0010 M</text><text y="510" font-size="30" class="f-muted">pH 3.00</text></g>
          <text x="${PX(2.5)}" y="880" font-size="34" class="f-gold">÷10 ${'→'} +1</text></g>
        <g class="s-dot"><circle cy="672" r="26" fill="${WARM}"/></g>
        <g data-at="4@0.3" data-fx="fade"><line x1="${PX(7)}" y1="610" x2="${PX(7)}" y2="720" stroke="${GOLD}" stroke-width="8" stroke-linecap="round"/>
          <rect x="${PX(7) + 8}" y="660" width="${PX(14) - PX(7) - 8}" height="24" rx="12" fill="${BAD}" opacity=".35"/>
          <text x="${PX(10.5)}" y="620" font-size="36" class="f-gold">diluting can't go past 7</text>
          <text x="${PX(10.5)}" y="880" font-size="32" class="f-muted">water itself adds ${sH3O}</text></g>
      </svg>`,
    update(c) {
      const b = c.b, v = lerp(2, 3, eio(c.seg(b[3].start + 1.0, b[3].start + 2.2)))
      c.$('.s-dot').setAttribute('transform', `translate(${PX(v)} 0)`)
      c.$('.s-dot').style.opacity = c.seg(b[2].start + 0.2, b[2].start + 0.6)
    },
  })

  // ---------- trap: HF ----------
  const TOPTS = [['A', F.HCl], ['B', F.HNO3], ['C', F.HF], ['D', F.HClO4]]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="1">Which is a <span class="warm">weak</span> acid?</h2>
      ${TOPTS.map(([l, f], i) => `<div class="s-tile s-tt${i}" style="left:${120 + i * 430}px" data-at="1@${0.4 + i * 0.12}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok">${CHECK}</div>` : ''}<div class="f">${f}</div>
        <div class="ch ${i === 2 ? 'warm' : 'muted'}" data-at="${i === 2 ? '3' : '2@0.4'}" data-fx="fade">${i === 2 ? 'weak' : 'one of the six'}</div></div>`).join('')}
      <div class="s-line" style="top:620px;font-size:46px" data-at="2">HF is <span class="warm">not one of the six</span></div>
      <div class="s-line muted" style="top:700px;font-size:40px" data-at="3">only partly ionized</div>
      <div class="banner" style="top:820px" data-at="4" data-fx="pop">Not on the list ${ARR} treat it as <span class="warm">weak</span></div>`,
    update(c) {
      const win = eo(c.seg(c.b[2].start + 0.2, c.b[2].start + 0.7))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.s-tt' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.s-tt2 .ok').style.opacity = win }
        else el.style.filter = `brightness(${1 - 0.4 * win})`
      }
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is the pH of <span class="teal">0.025 M ${F.HNO3}</span>?</h2>
      <svg class="full s-count" viewBox="0 0 1920 1080"><circle cx="960" cy="560" r="90" fill="none" stroke="#363c54" stroke-width="14"/><circle class="s-arc" cx="960" cy="560" r="90" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 560)"/>
        <text class="s-num" x="960" y="590" text-anchor="middle" font-size="90" font-weight="900">3</text><text x="960" y="710" text-anchor="middle" font-size="34" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="s-ans" style="top:330px;border-color:rgba(76,199,129,.7);font-size:64px;height:130px;line-height:126px;text-align:center" data-at="3" data-fx="pop">pH = <span class="good">1.60</span></div>
      <div class="s-ans" style="top:510px" data-at="4"><span class="muted" style="font-size:36px">Strong acid ${ARR}</span> [${H3O}] = <span class="teal">0.025 M</span></div>
      <div class="s-ans" style="top:650px" data-at="5">pH = −log(0.025) = <span class="good">1.60</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, q = c.seg(t0, t1)
      c.$('.s-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.s-arc').setAttribute('stroke-dashoffset', q)
      c.$('.s-num').textContent = Math.max(1, Math.ceil(3 * (1 - q)))
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900">${ball(120, 90, 30, 'warm', sH3O, 20)}${ball(200, 100, 36, 'teal', `Cl${hi('−')}`, 24)}${ball(290, 80, 30, 'warm', sH3O, 20)}${ball(360, 110, 36, 'teal', `Cl${hi('−')}`, 24)}</svg>`
  const r2 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900">${ball(60, 85, 34, 'warm', `Na${hi('+')}`, 22)}${ball(135, 85, 34, 'teal', sOH, 22)}${ball(300, 85, 38, 'gold', `Ca${hi('2+')}`, 20)}${ball(225, 50, 32, 'teal', sOH, 20)}${ball(380, 120, 32, 'teal', sOH, 20)}</svg>`
  const r3 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <text x="220" y="70" font-size="40" class="f-muted">HF, CH<tspan dy=".28em" font-size=".62em">3</tspan><tspan dy="-.28em">COOH…</tspan></text>
    <text x="220" y="140" font-size="46" class="f-warm">weak</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card s-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Six strong acids:<br>[${H3O}] =<br><span class="warm">[acid]</span></p></div>
      <div class="card s-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Group 1: [${OH}] = [base]<br>Group 2:<br>[${OH}] = <span class="gold">2</span>[base]</p></div>
      <div class="card s-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Every other acid<br>is <span class="warm">weak</span></p></div>`,
  })
  void clamp; void PRI; void MUTED; void GOOD
})()
