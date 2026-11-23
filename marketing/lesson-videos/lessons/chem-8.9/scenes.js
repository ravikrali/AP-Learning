// Pictures for chem-8.9 "Henderson–Hasselbalch". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): pH = pKa + log([A-]/[HA]);
// ratio 1 -> pH = pKa, more base -> above, more acid -> below; moles work (same volume); the 0.10 M / 0.20 M
// acetate example (pKa 4.74 -> 5.04); the NH4+/NH3 check (9.25 -> 8.25); pick pKa within about 1 of the target
// (the pH 7.2 check: HF 3.17, CH3COOH 4.74, H2PO4- 7.21, HCN 9.21); the HF / NaF try (3.17).
// Ball counts only show which partner there is more of; positions on pH lines are not to scale beyond order.
(() => {
  const { lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-lab small{display:block;margin-top:4px;font-size:28px;font-weight:800;color:var(--muted)}
    .x-tx{position:absolute;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tx em{font-style:normal;font-size:32px;font-weight:800;color:var(--muted)}
    .x-say{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.15;margin:0 6px}
    .x-fr>span{display:block;padding:0 12px}
    .x-fr>span:first-child{border-bottom:5px solid currentColor}
    .x-eq{position:absolute;left:0;width:1920px;display:flex;justify-content:center;align-items:flex-start;gap:30px}
    .x-tm{display:flex;flex-direction:column;align-items:center}
    .x-bg{height:230px;display:flex;align-items:center;font-size:92px;font-weight:900;white-space:nowrap}
    .x-nt{margin-top:14px;font-size:32px;font-weight:800;line-height:1.4;text-align:center;white-space:nowrap}
    .x-v{position:relative;display:inline-block}
    .x-v.x-k::after{content:'';position:absolute;left:-6px;right:-6px;top:48%;height:6px;border-radius:3px;background:#f0707a;transform:rotate(-35deg)}
    .x-bar{position:absolute;height:20px;border-radius:10px;background:#363c54}
    .x-tk{position:absolute;width:6px;height:70px;border-radius:3px;background:var(--muted)}
    .x-pm{position:absolute;width:80px;text-align:center;font-size:30px;font-weight:900;color:var(--gold)}
    .x-pm i{display:block;margin:4px auto 0;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:28px solid var(--gold)}
    .x-rb{position:absolute;height:44px;border-radius:12px;overflow:hidden}
    .x-ac{position:absolute;top:715px;width:250px;margin-left:-125px;padding:10px 0;border-radius:20px;border:3px solid var(--line);background:rgba(36,40,56,.95);text-align:center;font-size:34px;font-weight:900;line-height:1.25;white-space:nowrap}
    .x-ac small{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .x-tile{position:absolute;top:380px;width:480px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .f{margin-top:52px;font-size:56px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tile .s{margin-top:18px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', PRI = '#8d8df0', BAD = '#f0707a', GOOD = '#4cc781'
  const PKA = 'pK<sub>a</sub>', AM = 'A<sup>−</sup>'
  const HAC = 'CH<sub>3</sub>COOH', AC = 'CH<sub>3</sub>COO<sup>−</sup>', NH3 = 'NH<sub>3</sub>', NH4 = 'NH<sub>4</sub><sup>+</sup>'
  const H2PO4 = 'H<sub>2</sub>PO<sub>4</sub><sup>−</sup>'
  const FR = (a, b) => `<span class="x-fr"><span>${a}</span><span>${b}</span></span>`
  const RATIO = FR(`<span class="teal">[${AM}]</span>`, `<span class="pri">[HA]</span>`)
  const S = 1.4
  // a weak acid HA (purple with its gold H) and a conjugate base A- (teal)
  const ha = (x, y, s = S) => `<g transform="translate(${x} ${y})">${ball(0, 0, 17 * s, 'pur')}${ball(20 * s, -13 * s, 10 * s, 'gold')}</g>`
  const am = (x, y, s = S) => ball(x, y, 17 * s, 'teal')
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  // a pH line inside a card that starts at L: bar, a pKa tick in the middle, a pH marker above
  const phLine = (L, cls, tick = true) => `<div class="x-bar" style="left:${L + 105}px;top:660px;width:600px"></div>
    ${tick ? `<div class="x-tk" style="left:${L + 402}px;top:635px"></div><div class="x-lab" style="left:${L + 330}px;width:150px;top:715px;font-size:34px">${PKA}</div>` : ''}
    <div class="x-pm ${cls}" style="left:${L + 365}px;top:580px">pH<i></i></div>
    <div class="x-lab muted" style="left:${L + 45}px;width:120px;top:700px;font-size:28px">lower</div>
    <div class="x-lab muted" style="left:${L + 645}px;width:120px;top:700px;font-size:28px">higher</div>`

  // ---------- intro: a faint row of buffer partners ----------
  const IX = Array.from({ length: 13 }, (_, i) => 300 + i * 110)
  EZ.intro = {
    chips: [['1@0.3', 'The equation'], ['1@0.55', 'How to use it'], ['1@0.85', 'Choosing a buffer']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.28">${IX.map((x, i) => i === 6 ? `<g transform="translate(${x} 890)"><g class="x-ia">${ball(0, 0, 24, 'teal')}</g><g class="x-ih">${ball(0, 0, 14, 'gold')}</g></g>` : i % 2 ? am(x, 890) : ha(x, 890)).join('')}</svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 1.2)
      c.$('.x-ih').setAttribute('transform', `translate(${lerp(28, 60, p)} ${lerp(-18, -38, p)})`)
    },
  }

  // ---------- hook: a buffer at exactly pH 5.04 ----------
  const DROP = [['h', 380, 700], ['h', 600, 620], ['a', 460, 570], ['a', 500, 720], ['a', 650, 725], ['a', 690, 560]]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">A buffer at exactly pH 5.04?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0" data-fx="fade"></div>
      <div class="x-chip gold" style="left:390px;top:330px;background:rgba(242,196,67,.12)" data-at="0@0.4" data-fx="pop">target: pH 5.04</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade"><path d="M303 480H747V760Q747 797 710 797H340Q303 797 303 760Z" fill="rgba(60,199,188,.08)"/>
          <path d="M300 430V760Q300 800 340 800H710Q750 800 750 760V430" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/></g>
        <g data-at="1" data-fx="fade">${DROP.map(([k], i) => `<g class="x-d${i}">${k === 'h' ? ha(0, 0) : am(0, 0)}</g>`).join('')}</g>
      </svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1"><h3>What do you mix?</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade">${ha(1110, 470)}${am(1110, 600)}</g></svg>
      <div class="x-tx" style="left:1170px;top:440px" data-at="1"><span class="pri">weak acid</span> <em>how much?</em></div>
      <div class="x-tx" style="left:1170px;top:570px" data-at="1@0.3"><span class="teal">conjugate base</span> <em>how much?</em></div>
      <div class="x-chip teal" style="left:1200px;top:700px;background:rgba(60,199,188,.12)" data-at="3" data-fx="pop">on your equation sheet</div>
      <div class="banner" style="top:870px" data-at="2" data-out="4-0.35" data-fx="pop">One equation: <span class="gold">Henderson–Hasselbalch</span></div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">No memorizing, but know how to <span class="gold">read it</span></div>`,
    update(c) {
      const b = c.b
      DROP.forEach(([, x, y], i) => {
        const t0 = b[1].start + 0.2 + i * 0.22, p = eio(c.seg(t0, t0 + 0.8))
        mv(c, '.x-d' + i, x, lerp(y - 330, y, p))
      })
    },
  })

  // ---------- the equation ----------
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="in+0.2">Henderson–Hasselbalch</h2>
      <div class="card" style="left:120px;top:300px;width:1680px;height:530px" data-at="0" data-fx="fade"></div>
      <div class="x-eq" style="top:320px" data-at="1">
        <div class="x-tm"><div class="x-bg">pH</div></div>
        <div class="x-tm"><div class="x-bg">=</div></div>
        <div class="x-tm"><div class="x-bg gold">${PKA}</div><div class="x-nt gold" data-at="2" data-fx="fade">from the<br>weak acid</div></div>
        <div class="x-tm"><div class="x-bg">+ log</div></div>
        <div class="x-tm"><div class="x-bg">${RATIO}</div><div class="x-nt" data-at="3" data-fx="fade"><span class="teal">top: conjugate base</span><br><span class="pri">bottom: weak acid</span></div></div>
      </div>
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-fx="pop">pH depends on <span class="gold">${PKA}</span> and the <span class="gold">ratio</span> base : acid</div>`,
  })

  // ---------- the ratio sets pH vs. pKa ----------
  const GRID = Array.from({ length: 8 }, (_, i) => [255 + (i % 4) * 180, 500 + Math.floor(i / 4) * 140])
  const SETS = [[1, 0, 0, 1, 0, 1, 1, 0], [1, 1, 0, 1, 1, 0, 1, 1], [0, 0, 1, 0, 0, 1, 0, 0]]
  const pool = (k) => GRID.map(([x, y], i) => SETS[k][i] ? am(x, y) : ha(x - 8, y + 6)).join('')
  EZ.scene('ratio', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">The ratio</div><h2 class="h1" data-at="in+0.2">Base : acid sets pH vs. ${PKA}</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0"><h3>In the buffer</h3></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="0@0.3"><h3>pH vs. ${PKA}</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-out="3-0.2" data-fx="fade">${pool(0)}</g>
        <g data-at="3" data-out="4-0.2" data-fx="fade">${pool(1)}</g>
        <g data-at="4" data-fx="fade">${pool(2)}</g>
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:740px" data-at="1" data-out="3-0.2" data-fx="fade"><span class="teal">[${AM}]</span> = <span class="pri">[HA]</span></div>
      <div class="x-lab" style="left:120px;width:810px;top:740px" data-at="3" data-out="4-0.2" data-fx="fade">more <span class="teal">base</span> than <span class="pri">acid</span></div>
      <div class="x-lab" style="left:120px;width:810px;top:740px" data-at="4" data-fx="fade">more <span class="pri">acid</span> than <span class="teal">base</span></div>
      <div data-at="1@0.5" data-fx="fade">${phLine(990, 'x-pmR')}</div>
      <div class="x-lab muted" style="left:990px;width:810px;top:400px;font-size:38px" data-at="1@0.4" data-out="3-0.2" data-fx="fade">ratio = 1</div>
      <div class="x-lab" style="left:990px;width:810px;top:460px;font-size:52px" data-at="2" data-out="3-0.2" data-fx="fade">log 1 = 0 ${ARR} <span class="gold">pH = ${PKA}</span></div>
      <div class="x-lab teal" style="left:990px;width:810px;top:440px;font-size:56px" data-at="3" data-out="4-0.2" data-fx="fade">pH &gt; ${PKA}</div>
      <div class="x-lab pri" style="left:990px;width:810px;top:440px;font-size:56px" data-at="4" data-fx="fade">pH &lt; ${PKA}</div>`,
    update(c) {
      const b = c.b
      const p3 = eio(c.seg(b[3].start, b[3].start + 0.8)), p4 = eio(c.seg(b[4].start, b[4].start + 0.8))
      c.$('.x-pmR').style.left = `${990 + 365 + 200 * p3 - 400 * p4}px`
    },
  })

  // ---------- moles work too ----------
  const MB = [['h', 360, 700], ['h', 600, 610], ['a', 440, 570], ['a', 490, 720], ['a', 650, 725], ['a', 690, 550]]
  const V = (i) => `<span class="x-v x-v${i}">V</span>`
  EZ.scene('moles', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="in+0.2">Moles work too</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="in+0.3" data-fx="fade"><h3>One buffer, one volume</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.4" data-fx="fade"><path d="M253 480H737V760Q737 797 700 797H290Q253 797 253 760Z" fill="rgba(60,199,188,.08)"/>
          <path d="M250 430V760Q250 800 290 800H700Q740 800 740 760V430" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>
          ${MB.map(([k, x, y]) => k === 'h' ? ha(x, y) : am(x, y)).join('')}</g>
        <g data-at="2" data-fx="fade"><path class="x-vl" d="M790 480V797M772 480H808M772 797H808" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="round" stroke-dasharray="900 900" stroke-dashoffset="900"/>
          <text x="835" y="652" font-size="44" font-weight="900" class="f-gold">V</text></g>
      </svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1"><h3>The ratio</h3>
        <div class="x-say" style="top:110px">Only the <span class="gold">ratio</span> matters</div>
        <div class="x-say" style="top:200px;font-size:44px" data-at="2">${RATIO} = ${FR(`<span class="teal">mol ${AM}</span> ÷ ${V(0)}`, `<span class="pri">mol HA</span> ÷ ${V(1)}`)}</div>
        <div class="x-say" style="top:360px;font-size:44px" data-at="3">= ${FR(`<span class="teal">mol ${AM}</span>`, `<span class="pri">mol HA</span>`)}</div></div>
      <div class="banner" style="top:870px" data-at="3@0.4" data-fx="pop">Plug in <span class="gold">moles</span> instead of molarity</div>`,
    update(c) {
      const b = c.b
      c.$('.x-vl').setAttribute('stroke-dashoffset', 900 * (1 - eio(c.seg(b[2].start, b[2].start + 1.0))))
      const k = c.t > b[2].start + 1.6
      for (let i = 0; i < 2; i++) {
        const el = c.$('.x-v' + i)
        el.classList.toggle('x-k', k)
        el.style.opacity = k ? '0.55' : '1'
      }
    },
  })

  // ---------- worked example: acetic acid / acetate ----------
  const EX = [['h', 260, 690], ['h', 400, 690], ['a', 540, 690], ['a', 660, 690], ['a', 780, 690], ['a', 470, 780]]
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Acetic acid / acetate buffer</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.3"><h3>Given</h3>
        <div class="x-row" style="top:100px" data-at="1"><span class="pri">${HAC}</span> &nbsp;0.10 M</div>
        <div class="x-row" style="top:170px" data-at="1@0.5"><span class="teal">${AC}</span> &nbsp;0.20 M</div>
        <div class="x-row" style="top:240px" data-at="2"><span class="gold">${PKA}</span> = 4.74</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <rect x="150" y="392" width="750" height="140" rx="18" fill="rgba(242,196,67,.10)" stroke="${GOLD}" stroke-width="3" data-at="3" data-out="4" data-fx="fade"/>
        <g data-at="1@0.7" data-fx="fade">${EX.map(([k, x, y]) => k === 'h' ? ha(x, y) : am(x, y)).join('')}</g>
      </svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="3"><h3>Solve</h3>
        <div class="x-row" style="top:90px;font-size:42px">pH = 4.74 + log ${FR('0.20', '0.10')}</div>
        <div class="x-row" style="top:230px;font-size:42px" data-at="4">&nbsp;&nbsp;&nbsp;= 4.74 + log 2</div>
        <div class="x-row" style="top:300px;font-size:42px" data-at="4@0.6">&nbsp;&nbsp;&nbsp;= 4.74 + 0.30</div>
        <div class="x-row gold" style="top:380px;font-size:64px" data-at="5" data-fx="pop">pH = 5.04</div>
        <div class="x-row" style="top:470px;font-size:34px" data-at="6"><span class="teal">base</span> &gt; <span class="pri">acid</span> ${ARR} pH &gt; ${PKA}</div></div>`,
  })

  // ---------- weak base buffer: NH4+ / NH3 ----------
  const NHP = Array.from({ length: 10 }, (_, i) => [220 + (i % 5) * 110, 470 + Math.floor(i / 5) * 105])
  EZ.scene('basepair', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Weak base buffer</div><h2 class="h1" data-at="in+0.2">Which one is the acid?</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.3"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">${NHP.map(([x, y]) => ball(x, y, 30, 'pur')).join('')}</g>
        <g data-at="1@0.5" data-fx="fade">${ball(805, 522, 30, 'teal')}</g>
        <rect x="160" y="420" width="560" height="205" rx="22" fill="none" stroke="${GOLD}" stroke-width="5" data-at="3" data-fx="fade"/>
      </svg>
      <div class="x-lab pri" style="left:160px;width:560px;top:640px;font-size:38px" data-at="1@0.2" data-fx="fade">${NH4} &nbsp;0.50 M</div>
      <div class="x-lab teal" style="left:685px;width:240px;top:644px;font-size:30px" data-at="1@0.6" data-fx="fade">${NH3} 0.050 M</div>
      <div class="x-lab pri" style="left:160px;width:560px;top:700px;font-size:32px" data-at="3" data-fx="pop">the acid</div>
      <div class="x-lab teal" style="left:685px;width:240px;top:700px;font-size:32px" data-at="3@0.5" data-fx="pop">the base</div>
      <div class="x-lab" style="left:120px;width:810px;top:770px;font-size:36px" data-at="2"><span class="gold">${PKA}</span>(${NH4}) = 9.25</div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="4"><h3>Solve</h3>
        <div class="x-row" style="top:90px;font-size:42px">pH = 9.25 + log ${FR(`<span class="teal">0.050</span>`, `<span class="pri">0.50</span>`)}</div>
        <div class="x-row" style="top:240px;font-size:42px" data-at="4@0.6">&nbsp;&nbsp;&nbsp;= 9.25 − 1.00</div>
        <div class="x-row gold" style="top:320px;font-size:64px" data-at="5" data-fx="pop">pH = 8.25</div>
        <div class="x-row" style="top:420px;font-size:34px" data-at="5@0.5"><span class="pri">acid</span> &gt; <span class="teal">base</span> ${ARR} pH &lt; ${PKA}</div></div>`,
  })

  // ---------- trick: pick pKa near the target pH ----------
  const PX = (v) => 160 + (v - 2) * 200
  const ACIDS = [['HF', 3.17, 5], ['CH<sub>3</sub>COOH', 4.74, 5], ['HCN', 9.21, 5], [H2PO4, 7.21, 6]]
  EZ.scene('trick', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="0">Pick ${PKA} ≈ the pH you want</h2>
      <div class="x-line" style="top:286px;font-size:42px" data-at="1">A weak acid with ${PKA} <span class="gold">close to</span> the target pH <span class="muted">(within about ±1)</span></div>
      <div class="x-say" style="top:362px;font-size:36px"><span class="teal" data-at="2">ratio stays near 1</span><span class="muted" data-at="3"> &nbsp;·&nbsp; </span><span class="pri" data-at="3">neutralizes added acid and added base well</span></div>
      <div class="card" style="left:120px;top:440px;width:1680px;height:400px" data-at="4"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="4" data-fx="fade"><line x1="160" y1="640" x2="1760" y2="640" stroke="#363c54" stroke-width="16" stroke-linecap="round"/>
          ${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => `<line x1="${PX(v)}" y1="626" x2="${PX(v)}" y2="654" stroke="#7d869c" stroke-width="4"/><text x="${PX(v)}" y="694" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">${v}</text>`).join('')}
          <text x="140" y="600" font-size="30" font-weight="900" class="f-muted">pH</text></g>
        <g data-at="4@0.3" data-fx="fade"><rect x="${PX(6.2)}" y="614" width="400" height="52" rx="12" fill="rgba(242,196,67,.16)" stroke="${GOLD}" stroke-width="3" stroke-dasharray="10 8"/>
          <line x1="${PX(7.2)}" y1="530" x2="${PX(7.2)}" y2="640" stroke="${GOLD}" stroke-width="6"/>
          <text x="${PX(7.2)}" y="515" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">target pH 7.2</text>
          <text x="${PX(6.2) + 30}" y="595" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">−1</text>
          <text x="${PX(8.2) - 30}" y="595" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">+1</text></g>
        ${ACIDS.map(([, v, at], i) => `<circle cx="${PX(v)}" cy="640" r="13" class="x-dot${i}" style="fill:${at === 6 ? GOOD : PRI}" data-at="${at}${i === 1 ? '@0.3' : i === 2 ? '@0.6' : ''}" data-fx="pop"/>`).join('')}
      </svg>
      ${ACIDS.map(([n, v, at], i) => `<div class="x-ac x-a${i}" style="left:${PX(v)}px" data-at="${at}${i === 1 ? '@0.3' : i === 2 ? '@0.6' : ''}" data-fx="pop">${n}<small>${PKA} ${v.toFixed(2)}</small></div>`).join('')}`,
    update(c) {
      const b = c.b, w = eo(c.seg(b[6].start + 0.6, b[6].start + 1.1))
      for (let i = 0; i < 3; i++) c.$('.x-a' + i).style.opacity = String(1 - 0.5 * w)
      const el = c.$('.x-a3')
      el.style.borderColor = w ? `rgba(76,199,129,${w})` : ''
      el.style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.5 * w})`
    },
  })

  // ---------- trap: why the pH barely moves ----------
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Why the pH barely moves</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3>The ratio</h3></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1@0.3"><h3>The pH</h3></div>
      <div class="x-chip warm" style="left:520px;top:322px;background:rgba(243,167,100,.12)" data-at="1@0.5" data-fx="pop">+ a little acid</div>
      <div data-at="1@0.2" data-fx="fade">
        <div class="x-rb" style="left:225px;top:480px;width:600px;background:${PRI}"><div class="x-rt" style="height:100%;width:300px;background:${TEAL}"></div></div>
        <div class="x-lab teal" style="left:225px;width:200px;top:534px;font-size:34px;text-align:left">[${AM}]</div>
        <div class="x-lab pri" style="left:625px;width:200px;top:534px;font-size:34px;text-align:right">[HA]</div></div>
      <div class="x-lab good" style="left:120px;width:810px;top:640px;font-size:38px" data-at="2@0.5" data-fx="fade">ratio barely changes</div>
      <div data-at="1@0.4" data-fx="fade">${phLine(990, 'x-pmT', false)}</div>
      <div class="x-lab" style="left:990px;width:810px;top:420px;font-size:40px" data-at="3">pH = ${PKA} + log(<span class="gold">ratio</span>)</div>
      <div class="x-lab good" style="left:990px;width:810px;top:770px;font-size:38px" data-at="3@0.5" data-fx="fade">pH barely moves</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-fx="pop">No calculation needed: <span class="gold">explain why</span> it changes so little</div>`,
    update(c) {
      const b = c.b
      const pr = eio(c.seg(b[2].start + 0.3, b[2].start + 1.2))
      c.$('.x-rt').style.width = `${300 - 24 * pr}px`
      const pm = eio(c.seg(b[3].start + 0.3, b[3].start + 1.2))
      c.$('.x-pmT').style.left = `${990 + 365 - 14 * pm}px`
    },
  })

  // ---------- try it ----------
  const GIV = [['0.30 M <span class="pri">HF</span>', 'weak acid'], ['0.30 M <span class="teal">NaF</span>', 'gives F<sup>−</sup>, its conjugate base'], [`<span class="gold">${PKA}</span>(HF) = 3.17`, 'given']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is the <span class="teal">pH</span>?</h2>
      ${GIV.map(([f, s], i) => `<div class="x-tile" style="left:${180 + i * 540}px" data-at="1@${(0.2 + i * 0.25).toFixed(2)}" data-fx="pop"><div class="f">${f}</div><div class="s">${s}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:660px" data-at="3" data-fx="pop">pH = <span class="gold">3.17</span></div>
      <div class="x-line" style="top:820px;font-size:40px" data-at="4">equal concentrations ${ARR} log 1 = 0 ${ARR} <span class="gold">pH = ${PKA}</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${am(230, 38, 1.3)}<line x1="150" y1="78" x2="310" y2="78" stroke="#a3abbd" stroke-width="6" stroke-linecap="round"/>${ha(222, 122, 1.3)}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${[0, 1, 2].map((i) => ha(50 + i * 60, 80, 1.1)).join('')}<text x="240" y="94" text-anchor="middle" font-size="44" font-weight="900" class="f-muted">=</text>${[0, 1, 2].map((i) => am(295 + i * 60, 80, 1.1)).join('')}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><line x1="40" y1="95" x2="420" y2="95" stroke="#363c54" stroke-width="12" stroke-linecap="round"/>
    <rect x="170" y="72" width="120" height="46" rx="10" fill="rgba(242,196,67,.16)" stroke="${GOLD}" stroke-width="3" stroke-dasharray="8 6"/><line x1="230" y1="40" x2="230" y2="95" stroke="${GOLD}" stroke-width="5"/>
    <circle cx="236" cy="95" r="11" style="fill:${GOOD}"/><text x="230" y="30" text-anchor="middle" font-size="24" font-weight="900" class="f-gold">target pH</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>pH = ${PKA} +<br>log ${RATIO}</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Equal amounts of<br><span class="pri">acid</span> and <span class="teal">base</span><br>${ARR} <span class="gold">pH = ${PKA}</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Pick a weak acid<br>with ${PKA} <span class="gold">near</span><br>the desired pH</p></div>`,
  })
})()
