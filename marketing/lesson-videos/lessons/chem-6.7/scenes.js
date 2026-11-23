// Pictures for chem-6.7 "Bond Enthalpies". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u6.ts and chem/book.ts): the
// H2 + Cl2 worked example, the 1500/1200 quick check, the methane combustion estimate and the
// H2 + F2 try question. Energy levels and bar lengths show order and direction, not exact scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-card3{position:absolute;padding:0}
    .x-foot{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-size:46px;font-weight:900}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900}
    .x-formula{position:absolute;left:120px;top:300px;width:1680px;height:110px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid rgba(141,141,240,.6);text-align:center;font-size:56px;font-weight:900;line-height:104px;white-space:nowrap}
    .x-note{position:absolute;left:1240px;width:560px;height:104px;padding:14px 20px 0 82px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-note i{position:absolute;left:22px;top:28px;width:44px;height:44px;border-radius:50%}
    .x-note b{display:block;font-size:31px;font-weight:900;line-height:1.15;white-space:nowrap} .x-note>span{display:block;font-size:25px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-lab{position:absolute;width:320px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-be{position:absolute;width:320px;text-align:center;font-size:30px;font-weight:800;white-space:nowrap}
    .x-tally{position:absolute;width:820px;height:170px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-tally .H{margin-top:18px;font-size:30px;font-weight:900;letter-spacing:.08em;color:var(--muted);white-space:nowrap}
    .x-tally .V{margin-top:12px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-rowlab{position:absolute;left:120px;width:380px;font-size:36px;font-weight:900;line-height:1.1}
    .x-rowlab span{display:block;font-size:26px;font-weight:700;color:var(--muted)}
    .x-bar{position:absolute;left:520px;height:70px;border-radius:20px}
    .x-val{position:absolute;font-size:44px;font-weight:900;white-space:nowrap}
    .x-res{position:absolute;left:120px;top:590px;width:1680px;height:200px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(243,167,100,.7);text-align:center}
    .x-res .A{margin-top:26px;font-size:62px;font-weight:900;white-space:nowrap} .x-res .B{margin-top:12px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-wrong{position:absolute;left:420px;top:830px;width:1080px;height:100px;border-radius:26px;background:rgba(240,112,122,.12);border:3px solid rgba(240,112,122,.7);text-align:center;font-size:44px;font-weight:900;line-height:94px;white-space:nowrap}
    .x-wrong s{text-decoration-color:var(--bad);text-decoration-thickness:6px;color:var(--muted)}
    .x-mini{position:absolute;font-size:30px;font-weight:800;white-space:nowrap}
    .x-eq{position:absolute;left:0;width:1920px;top:290px;text-align:center;font-size:120px;font-weight:900;letter-spacing:1px;line-height:1.1;white-space:nowrap}
    .x-side{top:540px;width:820px;height:280px;text-align:center}
    .x-side .T{margin-top:28px;font-size:36px;font-weight:900;color:var(--muted)} .x-side .E{margin-top:24px;font-size:66px;font-weight:900;white-space:nowrap} .x-side .S{margin-top:20px;font-size:34px;font-weight:800;white-space:nowrap}
    .x-gv{position:absolute;top:310px;width:530px;height:190px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-gv .N{margin-top:26px;font-size:30px;font-weight:900;letter-spacing:.1em;color:var(--muted)}
    .x-gv .V{margin-top:16px;font-size:58px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:360px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900}
    .x-ans .W{position:absolute;left:60px;font-size:44px;font-weight:800;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // n parallel bond lines between two points (single, double, triple)
  const bond = (x1, y1, x2, y2, n = 1, col = TXT, w = 8, extra = '') => {
    const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L
    return Array.from({ length: n }, (_, i) => { const o = (i - (n - 1) / 2) * 16
      return `<line x1="${x1 + nx * o}" y1="${y1 + ny * o}" x2="${x2 + nx * o}" y2="${y2 + ny * o}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${extra}/>` }).join('')
  }
  // an HTML label centred on x
  const lab = (cls, x, top, html, at, extra = '') => `<div class="${cls}" style="left:${x - 160}px;top:${top}px${extra}" data-at="${at}" data-fx="fade">${html}</div>`

  // ---------- intro artwork: a faint energy staircase on the left, a bond breaking on the right ----------
  EZ.intro = {
    chips: [['1@0.5', 'Break'], ['1@0.64', 'Make'], ['1@0.8', 'Estimate ΔH']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <line x1="70" y1="720" x2="180" y2="720" stroke="${TXT}" stroke-width="8" stroke-linecap="round"/>
      <line x1="200" y1="430" x2="300" y2="430" stroke="${TXT}" stroke-width="8" stroke-linecap="round"/>
      <line x1="320" y1="820" x2="420" y2="820" stroke="${TXT}" stroke-width="8" stroke-linecap="round"/>
      <line x1="190" y1="710" x2="190" y2="450" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
      <line x1="310" y1="440" x2="310" y2="800" stroke="${TEAL}" stroke-width="8" marker-end="url(#mk-teal)"/>
      <g class="x-il">${ball(0, 0, 44, 'pur')}</g><g class="x-ir">${ball(0, 0, 44, 'teal')}</g>
      <line class="x-ib" y1="560" y2="560" stroke="${TXT}" stroke-width="9"/>
    </svg>`,
    update(c) {
      const s = c.sc.start, p = eio(c.seg(s + 0.8, s + 2.4))
      const gap = lerp(100, 190, p), cx = 1720
      c.$('.x-il').setAttribute('transform', `translate(${cx - gap / 2} 560)`)
      c.$('.x-ir').setAttribute('transform', `translate(${cx + gap / 2} 560)`)
      const ib = c.$('.x-ib'); ib.setAttribute('x1', cx - gap / 2 + 40); ib.setAttribute('x2', cx + gap / 2 - 40); ib.style.opacity = 1 - p
    },
  }

  // ---------- hook: breaking costs, forming releases ----------
  const pair = (id) => `<g class="${id}a">${ball(0, 0, 62, 'pur')}</g><g class="${id}b">${ball(0, 0, 62, 'teal')}</g>`
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="0">Breaking costs, forming releases</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:400px" data-at="1">
        <h3>Breaking a bond</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="230" viewBox="0 0 810 230">
          <g class="x-ein"><line x1="405" y1="6" x2="405" y2="60" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/><line x1="405" y1="224" x2="405" y2="170" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/>
          <text x="436" y="40" font-size="32" font-weight="900" class="f-warm">energy in</text></g>${pair('x-l')}</svg>
        <div class="x-foot warm">costs energy</div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:400px" data-at="2">
        <h3>Forming a bond</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="230" viewBox="0 0 810 230">
          <g class="x-rays">${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="0" x2="0" y2="0" stroke="${TEAL}" stroke-width="9" stroke-linecap="round" data-a="${i * 30 + 15}"/>`).join('')}</g>
          <text class="x-eout f-teal" x="600" y="40" font-size="32" font-weight="900">energy out</text>${pair('x-r')}</svg>
        <div class="x-foot teal">releases energy</div></div>
      <div class="x-line" style="top:750px" data-at="3" data-fx="fade">Reactants: bonds <span class="warm">break</span> &nbsp;${ARR}&nbsp; Products: bonds <span class="teal">form</span></div>
      <div class="banner" style="top:840px" data-at="4" data-fx="pop">Add up both ${ARR} does the reaction <span class="teal">release heat</span>?</div>`,
    update(c) {
      const b = c.b, y = 115
      const sL = lerp(84, 320, eio(c.seg(b[1].start + 0.3, b[1].end)))
      c.$('.x-la').setAttribute('transform', `translate(${405 - sL / 2} ${y})`); c.$('.x-lb').setAttribute('transform', `translate(${405 + sL / 2} ${y})`)
      c.$('.x-ein').style.opacity = c.seg(b[1].start + 0.1, b[1].start + 0.5)
      const join = b[2].start + 1.2
      const sR = lerp(320, 84, eio(c.seg(b[2].start + 0.2, join)))
      c.$('.x-ra').setAttribute('transform', `translate(${405 - sR / 2} ${y})`); c.$('.x-rb').setAttribute('transform', `translate(${405 + sR / 2} ${y})`)
      const since = c.t - join, live = since >= 0 && since < 3 * 1.4, ph = live ? (since % 1.4) / 1.4 : 0
      c.$('.x-rays').style.opacity = live ? Math.sin(Math.PI * ph) : 0
      for (const l of c.root.querySelectorAll('.x-rays line')) {
        const a = (+l.dataset.a * Math.PI) / 180, r1 = 110 + 60 * ph, r2 = r1 + 40
        l.setAttribute('x1', 405 + r1 * Math.cos(a)); l.setAttribute('y1', y + r1 * 0.6 * Math.sin(a)); l.setAttribute('x2', 405 + r2 * Math.cos(a)); l.setAttribute('y2', y + r2 * 0.6 * Math.sin(a))
      }
      c.$('.x-eout').style.opacity = clamp(since / 0.4)
    },
  })

  // ---------- the rule: an energy staircase ----------
  const RY = 800, TY = 500, PEXO = 900, PENDO = 680 // reactants, all bonds broken, products (exo / endo)
  const note = (i, at, color, a, s) => `<div class="x-note" style="top:${440 + i * 122}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${s}</span></div>`
  EZ.scene('rule', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rule</div><h2 class="h1" data-at="0">Broken minus formed</h2>
      <div class="x-formula" data-at="1" data-fx="pop">ΔH ≈ Σ(<span class="warm">bonds broken</span>) − Σ(<span class="teal">bonds formed</span>)</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade">
          <line x1="170" y1="960" x2="170" y2="470" stroke="#c9cee0" stroke-width="4" marker-end="url(#mk-text)"/>
          <text transform="translate(140 720) rotate(-90)" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">energy</text>
          <line x1="230" y1="${RY}" x2="450" y2="${RY}" stroke="${TXT}" stroke-width="9" stroke-linecap="round"/>
          <text x="340" y="${RY + 44}" text-anchor="middle" font-size="32" font-weight="900">reactants</text>
          <line x1="500" y1="${TY}" x2="820" y2="${TY}" stroke="#a3abbd" stroke-width="9" stroke-linecap="round" stroke-dasharray="2 18"/>
          <text x="660" y="${TY - 22}" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">all bonds broken</text>
          <line x1="475" y1="${RY - 10}" x2="475" y2="${TY + 16}" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/>
          <text x="455" y="610" text-anchor="end" font-size="34" font-weight="900" class="f-warm">break</text>
          <text x="455" y="650" text-anchor="end" font-size="28" font-weight="800" class="f-warm">energy in (+)</text>
        </g>
        <g data-at="3" data-fx="fade">
          <line class="x-down" x1="825" y1="${TY + 10}" x2="825" y2="${PEXO - 16}" stroke="${TEAL}" stroke-width="10" marker-end="url(#mk-teal)"/>
          <text x="845" y="566" font-size="34" font-weight="900" class="f-teal">form</text>
          <text x="845" y="604" font-size="28" font-weight="800" class="f-teal">energy out (−)</text>
          <g class="x-prod"><line x1="860" y1="0" x2="1070" y2="0" stroke="${TXT}" stroke-width="9" stroke-linecap="round"/>
            <text x="965" y="44" text-anchor="middle" font-size="32" font-weight="900">products</text></g>
        </g>
        <g data-at="4" data-fx="fade">
          <line x1="455" y1="${RY}" x2="1130" y2="${RY}" stroke="#7d859c" stroke-width="3" stroke-dasharray="10 10"/>
          <line class="x-dexo" x1="1110" y1="${RY + 6}" x2="1110" y2="${PEXO - 14}" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/>
          <line class="x-dendo" x1="1110" y1="${RY - 6}" x2="1110" y2="${PENDO + 14}" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/>
          <text class="x-dh" x="1124" font-size="36" font-weight="900">ΔH</text>
        </g>
      </svg>
      ${note(0, '2', WARM, 'Bonds broken: reactants', 'energy in, counts as +')}
      ${note(1, '3', TEAL, 'Bonds formed: products', 'energy out, counts as −')}
      <div class="x-note x-nexo" style="top:684px" data-at="4" data-fx="right"><i style="background:${TEAL}"></i><b>More out than in</b><span>ΔH &lt; 0: <span class="teal">exothermic</span></span></div>
      ${note(3, '5', WARM, 'More in than out', 'ΔH &gt; 0: endothermic')}`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[5].start + 0.3, b[5].start + 1.4))
      const py = lerp(PEXO, PENDO, p)
      c.$('.x-prod').setAttribute('transform', `translate(0 ${py})`)
      c.$('.x-down').setAttribute('y2', py - 16)
      c.$('.x-dexo').style.opacity = 1 - clamp(p * 3)
      c.$('.x-dendo').style.opacity = clamp(p * 3 - 2)
      c.$('.x-dh').setAttribute('y', (RY + py) / 2 + 12)
    },
  })

  // ---------- worked example: H2 + Cl2 -> 2HCl ----------
  const EY = 440
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Hydrogen + chlorine</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade">
        <line class="x-hh" x1="400" y1="${EY}" x2="480" y2="${EY}" stroke="${TXT}" stroke-width="9"/>
        <line class="x-clcl" x1="700" y1="${EY}" x2="800" y2="${EY}" stroke="${TXT}" stroke-width="9"/>
        <g class="x-hhw" style="opacity:0"><line x1="400" y1="${EY}" x2="480" y2="${EY}" stroke="${WARM}" stroke-width="7" stroke-dasharray="8 10"/><line x1="700" y1="${EY}" x2="800" y2="${EY}" stroke="${WARM}" stroke-width="7" stroke-dasharray="8 10"/></g>
        <g class="x-a1">${ball(0, 0, 32, 'gray', 'H')}</g><g class="x-a2">${ball(0, 0, 32, 'gray', 'H')}</g>
        <g class="x-a3">${ball(0, 0, 48, 'teal', 'Cl', 34)}</g><g class="x-a4">${ball(0, 0, 48, 'teal', 'Cl', 34)}</g>
        <text x="590" y="${EY + 18}" text-anchor="middle" font-size="60" font-weight="900" class="f-muted">+</text>
        <line x1="910" y1="${EY}" x2="1040" y2="${EY}" stroke="${TXT}" stroke-width="8" marker-end="url(#mk-text)"/>
        ${bond(1160, EY, 1250, EY)}${bond(1400, EY, 1490, EY)}
        <g data-at="4" data-fx="fade">${bond(1160, EY, 1250, EY, 1, TEAL, 14)}${bond(1400, EY, 1490, EY, 1, TEAL, 14)}</g>
        ${ball(1160, EY, 32, 'gray', 'H')}${ball(1250, EY, 48, 'teal', 'Cl', 34)}${ball(1400, EY, 32, 'gray', 'H')}${ball(1490, EY, 48, 'teal', 'Cl', 34)}
      </g></svg>
      ${lab('x-lab', 440, 505, 'H<sub>2</sub>(g)', '1@0.2')}${lab('x-lab', 750, 505, 'Cl<sub>2</sub>(g)', '1@0.35')}${lab('x-lab', 1325, 505, '2HCl(g)', '1@0.6')}
      ${lab('x-be warm', 440, 566, 'H–H: 436 kJ/mol', '2@0.12')}${lab('x-be warm', 750, 566, 'Cl–Cl: 242 kJ/mol', '2@0.42')}${lab('x-be teal', 1325, 566, 'H–Cl: 431 kJ/mol', '2@0.72')}
      <div class="x-tally" style="left:120px;top:640px;border-color:rgba(243,167,100,.7)" data-at="3" data-fx="pop"><div class="H">BREAK: 1 H–H + 1 Cl–Cl</div><div class="V warm" data-at="3@0.55" data-fx="fade">436 + 242 = 678 kJ</div></div>
      <div class="x-tally" style="left:980px;top:640px;border-color:rgba(60,199,188,.7)" data-at="4" data-fx="pop"><div class="H">MAKE: 2 H–Cl</div><div class="V teal" data-at="4@0.5" data-fx="fade">2 × 431 = 862 kJ</div></div>
      <div class="banner" style="top:850px" data-at="5" data-fx="pop">ΔH = <span class="warm">678</span> − <span class="teal">862</span> = −184 kJ<span data-at="6" data-fx="fade"> &nbsp;·&nbsp; <span class="good">exothermic</span></span></div>`,
    update(c) {
      const p = eo(c.seg(c.b[3].start + 0.2, c.b[3].start + 0.9)), d = 22 * p
      c.$('.x-a1').setAttribute('transform', `translate(${400 - d} ${EY})`); c.$('.x-a2').setAttribute('transform', `translate(${480 + d} ${EY})`)
      c.$('.x-a3').setAttribute('transform', `translate(${700 - d} ${EY})`); c.$('.x-a4').setAttribute('transform', `translate(${800 + d} ${EY})`)
      c.$('.x-hh').style.opacity = 1 - p; c.$('.x-clcl').style.opacity = 1 - p; c.$('.x-hhw').style.opacity = p
    },
  })

  // ---------- quick check on the sign: 1500 in, 1200 out ----------
  const K = 1000 / 1500
  EZ.scene('sign', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Quick check</div><h2 class="h1" data-at="0">Which way does it go?</h2>
      <div class="x-rowlab warm" style="top:330px" data-at="1" data-fx="fade">BREAK<span>energy in</span></div>
      <div class="x-bar" style="top:330px;width:${1500 * K}px;background:linear-gradient(90deg,#b96a26,${WARM})" data-at="1@0.2" data-fx="grow"></div>
      <div class="x-val warm" style="left:${540 + 1500 * K}px;top:338px" data-at="1@0.4" data-fx="fade">1500 kJ</div>
      <div class="x-rowlab teal" style="top:450px" data-at="1@0.55" data-fx="fade">MAKE<span>energy out</span></div>
      <div class="x-bar" style="top:450px;width:${1200 * K}px;background:linear-gradient(90deg,#1b7f77,${TEAL})" data-at="1@0.7" data-fx="grow"></div>
      <div class="x-val" style="left:${1200 * K + 330}px;top:458px;color:#10131c" data-at="1@0.85" data-fx="fade">1200 kJ</div>
      <div class="x-bar" style="top:450px;left:${520 + 1200 * K}px;width:${300 * K}px;border:4px dashed ${WARM};box-sizing:border-box" data-at="2@0.3" data-fx="fade"></div>
      <div class="x-val warm" style="left:${540 + 1500 * K}px;top:458px" data-at="2@0.4" data-fx="fade">+300 kJ</div>
      <div class="x-res" data-at="2@0.2" data-fx="pop"><div class="A">ΔH = <span class="warm">1500</span> − <span class="teal">1200</span> = +300 kJ</div>
        <div class="B" data-at="3" data-fx="fade">More in than out ${ARR} <span class="warm">endothermic</span></div></div>
      <div class="x-wrong" data-at="4" data-fx="pop"><s>1500 + 1200 = 2700</s> &nbsp; <span class="bad">Don't add. Subtract.</span></div>`,
  })

  // ---------- count every bond: burning methane ----------
  const OX = 160, MY = 450
  const P = { C1: [300, MY], H1: [210, MY], H2: [390, MY], H3: [300, MY - 90], H4: [300, MY + 90],
    O1: [560, 400], O2: [650, 400], O3: [560, 510], O4: [650, 510],
    Oa: [920, MY], C2: [1010, MY], Ob: [1100, MY],
    W1: [1330, 395], W1a: [1270, 435], W1b: [1390, 435], W2: [1330, 510], W2a: [1270, 550], W2b: [1390, 550] }
  for (const k in P) P[k] = [P[k][0] + OX, P[k][1]]
  const B = (a, b, n = 1, col = TXT, w = 8) => bond(P[a][0], P[a][1], P[b][0], P[b][1], n, col, w)
  const CH = [['C1', 'H1'], ['C1', 'H2'], ['C1', 'H3'], ['C1', 'H4']], OO = [['O1', 'O2'], ['O3', 'O4']]
  const CO = [['Oa', 'C2'], ['C2', 'Ob']], OH = [['W1', 'W1a'], ['W1', 'W1b'], ['W2', 'W2a'], ['W2', 'W2b']]
  const atom = (k, el) => { const [x, y] = P[k], g = { C: ['gray', 34], H: ['gray', 24], O: ['red', 30] }[el]; return ball(x, y, g[1], g[0], el, el === 'H' ? 22 : 28) }
  EZ.scene('count', {
    html: `<div class="kicker" data-at="in" data-fx="left">Count every bond</div><h2 class="h1" data-at="0">Burning methane</h2>
      <div class="x-mini f-gold" style="left:1300px;top:290px;color:var(--gold)" data-at="5" data-fx="pop">every double bond counts</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.5" data-fx="fade">
        ${CH.map(([a, b]) => B(a, b)).join('')}${OO.map(([a, b]) => B(a, b, 2)).join('')}${CO.map(([a, b]) => B(a, b, 2)).join('')}${OH.map(([a, b]) => B(a, b)).join('')}
        <g data-at="2@0.1" data-fx="fade">${CH.map(([a, b]) => B(a, b, 1, WARM, 12)).join('')}</g>
        <g data-at="2@0.4" data-fx="fade">${OO.map(([a, b]) => B(a, b, 2, WARM, 10)).join('')}</g>
        <g data-at="3@0.1" data-fx="fade">${CO.map(([a, b]) => B(a, b, 2, TEAL, 10)).join('')}</g>
        <g data-at="3@0.4" data-fx="fade">${OH.map(([a, b]) => B(a, b, 1, TEAL, 12)).join('')}</g>
        <g class="x-dbl" style="opacity:0">${[...OO, ...CO].map(([a, b]) => B(a, b, 2, GOLD, 10)).join('')}</g>
        ${atom('C1', 'C')}${['H1', 'H2', 'H3', 'H4'].map((k) => atom(k, 'H')).join('')}${['O1', 'O2', 'O3', 'O4'].map((k) => atom(k, 'O')).join('')}
        ${atom('Oa', 'O')}${atom('C2', 'C')}${atom('Ob', 'O')}${atom('W1', 'O')}${atom('W1a', 'H')}${atom('W1b', 'H')}${atom('W2', 'O')}${atom('W2a', 'H')}${atom('W2b', 'H')}
        <text x="${470 + OX}" y="${MY + 18}" text-anchor="middle" font-size="56" font-weight="900" class="f-muted">+</text>
        <line x1="${720 + OX}" y1="${MY}" x2="${840 + OX}" y2="${MY}" stroke="${TXT}" stroke-width="8" marker-end="url(#mk-text)"/>
        <text x="${1180 + OX}" y="${MY + 18}" text-anchor="middle" font-size="56" font-weight="900" class="f-muted">+</text>
      </g></svg>
      ${lab('x-lab', 300 + OX, 580, 'CH<sub>4</sub>', '1@0.15')}${lab('x-lab', 605 + OX, 580, '2O<sub>2</sub>', '1@0.3')}${lab('x-lab', 1010 + OX, 580, 'CO<sub>2</sub>', '1@0.5')}${lab('x-lab', 1330 + OX, 580, '2H<sub>2</sub>O(g)', '1@0.7')}
      <div class="x-tally" style="left:120px;top:650px;border-color:rgba(243,167,100,.7)" data-at="2" data-fx="pop"><div class="H">BREAK: 4 C–H (413) + 2 O=O (495)</div><div class="V warm" data-at="2@0.75" data-fx="fade">= 2642 kJ</div></div>
      <div class="x-tally" style="left:980px;top:650px;border-color:rgba(60,199,188,.7)" data-at="3" data-fx="pop"><div class="H">MAKE: 2 C=O (799) + 4 O–H (463)</div><div class="V teal" data-at="3@0.75" data-fx="fade">= 3450 kJ</div></div>
      <div class="banner" style="top:855px;font-size:44px" data-at="4" data-fx="pop">ΔH ≈ <span class="warm">2642</span> − <span class="teal">3450</span> = −808 kJ<span data-at="4@0.45" data-fx="fade"> &nbsp;·&nbsp; <span class="muted">measured: about −802 kJ</span></span></div>`,
    update(c) {
      const t = c.t - c.b[5].start, on = t > 0 && t < 3.2
      c.$('.x-dbl').style.opacity = on ? 0.5 + 0.5 * Math.sin(t * 5) : 0
    },
  })

  // ---------- why only an estimate ----------
  const avgRow = (y, label, len, at) => `<g data-at="${at}" data-fx="fade"><text x="40" y="${y + 10}" font-size="30" font-weight="800">${label}</text>
    <rect x="280" y="${y - 16}" width="${len}" height="34" rx="17" fill="${WARM}"/></g>`
  const dots = (x, y, w, h, n, packed, seed) => Array.from({ length: n }, (_, i) => {
    const col = i % (packed ? 5 : 3), row = Math.floor(i / (packed ? 5 : 3))
    const cx = packed ? x + 30 + col * 46 : x + 40 + col * 100 + ((i * seed) % 37), cy = packed ? y + h - 30 - row * 44 : y + 40 + row * 90 + ((i * seed * 3) % 41)
    return `<circle cx="${cx}" cy="${cy}" r="18" fill="url(#g-${packed ? 'pur' : 'teal'})"/>` }).join('')
  EZ.scene('estimate', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Only an estimate</div><h2 class="h1" data-at="0">Why “approximately”?</h2>
      <div class="card" style="left:120px;top:300px;width:820px;height:480px" data-at="1"><h3>Tables list <span class="warm">averages</span></h3>
        <svg style="position:absolute;left:0;top:100px" width="820" height="400" viewBox="0 0 820 400">
          <text x="40" y="70" font-size="34" font-weight="900">C–H, average</text><rect x="280" y="44" width="300" height="34" rx="17" fill="#7d859c"/>
          <line x1="580" y1="30" x2="580" y2="370" stroke="${TXT}" stroke-width="4" stroke-dasharray="10 10"/>
          ${avgRow(170, 'in methane', 290, '2@0.3')}${avgRow(250, 'in ethane', 320, '2@0.45')}${avgRow(330, 'in chloroform', 278, '2@0.6')}
        </svg></div>
      <div class="x-mini muted" style="left:160px;top:794px" data-at="2@0.8" data-fx="fade">slightly different: neighboring atoms matter</div>
      <div class="card" style="left:980px;top:300px;width:820px;height:480px" data-at="3"><h3>Gases only</h3>
        <svg style="position:absolute;left:0;top:100px" width="820" height="400" viewBox="0 0 820 400">
          <rect x="60" y="20" width="320" height="250" rx="22" fill="rgba(255,255,255,.04)" stroke="#7d859c" stroke-width="3"/>${dots(60, 20, 320, 250, 6, false, 7)}
          <rect x="440" y="20" width="320" height="250" rx="22" fill="rgba(255,255,255,.04)" stroke="#7d859c" stroke-width="3"/>${dots(440, 20, 320, 250, 15, true, 0)}
          <text x="220" y="320" text-anchor="middle" font-size="32" font-weight="900" class="f-good">gas: use it</text>
          <text x="600" y="320" text-anchor="middle" font-size="32" font-weight="900" class="f-bad">liquid or solid:</text>
          <text x="600" y="360" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">phase change left out</text>
        </svg></div>
      <div class="banner" style="top:860px;font-size:44px" data-at="4" data-fx="pop">An <span class="gold">estimate</span> &nbsp;·&nbsp; accurate values: <span class="teal">enthalpies of formation</span></div>
      <div class="x-line muted" style="top:975px;font-size:34px;font-weight:800" data-at="5" data-fx="fade">Best for: <span class="warm">why</span> a reaction is exothermic or endothermic</div>`,
  })

  // ---------- the trick: BREAK minus MAKE ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The trick</div><h2 class="h1" data-at="0">Keep the order straight</h2>
      <div class="x-eq" data-at="1" data-fx="pop">ΔH = <span class="warm">BREAK</span> − <span class="teal">MAKE</span></div>
      <div class="x-line" style="top:450px" data-at="2" data-fx="fade">Bond energies: always <span class="warm">reactants first</span></div>
      <div class="card x-side x-s1" style="left:120px" data-at="3@0.1"><div class="T">Bond enthalpies</div><div class="E"><span class="warm">BREAK</span> − <span class="teal">MAKE</span></div><div class="S">reactants first</div></div>
      <div class="card x-side x-s2" style="left:980px" data-at="3@0.45"><div class="T">Enthalpies of formation</div><div class="E">products − reactants</div><div class="S bad">the opposite order</div></div>
      <div class="banner" style="top:860px;font-size:44px" data-at="4" data-fx="pop">Bonds: <span class="warm">break</span> − <span class="teal">make</span> &nbsp;·&nbsp; Formation: products − reactants</div>`,
    update(c) {
      const g = eo(c.seg(c.b[4].start, c.b[4].start + 0.5))
      c.$('.x-s1').style.borderColor = g ? `rgba(243,167,100,${0.8 * g})` : ''
      c.$('.x-s2').style.borderColor = g ? `rgba(141,141,240,${0.8 * g})` : ''
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Estimate ΔH for H<sub>2</sub>(g) + F<sub>2</sub>(g) ${ARR} 2HF(g)</h2>
      <div class="x-gv" style="left:120px" data-at="1@0.45" data-fx="pop"><div class="N">H–H</div><div class="V">436 kJ/mol</div></div>
      <div class="x-gv" style="left:695px" data-at="1@0.62" data-fx="pop"><div class="N">F–F</div><div class="V">155 kJ/mol</div></div>
      <div class="x-gv" style="left:1270px" data-at="1@0.8" data-fx="pop"><div class="N">H–F</div><div class="V teal">567 kJ/mol</div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">−543 kJ</div>
        <div class="W" style="top:160px" data-at="4" data-fx="fade"><span class="warm">BREAK</span> = 436 + 155 = 591</div>
        <div class="W" style="top:222px" data-at="5" data-fx="fade"><span class="teal">MAKE</span> = 2 × 567 = 1134</div>
        <div class="W" style="top:284px" data-at="6" data-fx="fade">ΔH = 591 − 1134 = <span class="good">−543 kJ</span></div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.45 * win})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="190" viewBox="-20 0 460 190">${ball(60, 52, 28, 'pur')}${ball(160, 52, 28, 'teal')}<line x1="110" y1="14" x2="110" y2="90" stroke="${WARM}" stroke-width="6" stroke-dasharray="8 8"/><text x="215" y="64" font-size="30" font-weight="900" class="f-warm">energy in</text>
    ${bond(86, 140, 134, 140)}${ball(86, 140, 28, 'pur')}${ball(134, 140, 28, 'teal')}<text x="215" y="152" font-size="30" font-weight="900" class="f-teal">energy out</text></svg>`
  const r2 = `<svg width="440" height="190" viewBox="0 0 440 190"><text x="220" y="80" text-anchor="middle" font-size="44" font-weight="900">ΔH ≈</text>
    <text x="220" y="150" text-anchor="middle" font-size="52" font-weight="900"><tspan class="f-warm">BREAK</tspan> − <tspan class="f-teal">MAKE</tspan></text></svg>`
  const r3 = `<svg width="440" height="190" viewBox="0 0 440 190">${[[60, 200], [110, 240], [160, 186]].map(([y, w]) => `<rect x="70" y="${y - 14}" width="${w}" height="28" rx="14" fill="${WARM}" opacity=".8"/>`).join('')}
    <line x1="330" y1="30" x2="330" y2="185" stroke="${TXT}" stroke-width="4" stroke-dasharray="8 8"/><text x="345" y="118" font-size="30" font-weight="900" class="f-gold">avg</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Breaking bonds<br><span class="warm">absorbs</span> energy.<br>Forming bonds<br><span class="teal">releases</span> it.</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>ΔH ≈ Σ broken<br>− Σ formed<br><span class="warm">BREAK</span> − <span class="teal">MAKE</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Average bond<br>enthalpies give<br>an <span class="gold">estimate</span></p></div>`,
  })
})()
