// Pictures for chem-8.3b "Weak Bases, Kb & Ka × Kb = Kw". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u8.ts): 0.20 M NH3 with Kb = 1.8 x 10^-5
// -> [OH-] = 1.9 x 10^-3 M, pOH 2.72, pH 11.28; Ka(NH4+) = 5.6 x 10^-10; HX pKa 3 / HY pKa 9 (pKb 11 / 5);
// HF Ka = 6.8 x 10^-4 -> Kb(F-) = 1.5 x 10^-11. Molecules are 2-D sketches, not shapes or sizes to scale.
// The two concentration bars in 'example' are drawn to scale (0.20 M vs 1.9 x 10^-3 M); other bars are not.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:52px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;width:300px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-kc{position:absolute;top:720px;width:810px;height:160px;text-align:center;white-space:nowrap}
    .x-kc .a{margin-top:44px;font-size:58px;font-weight:900}
    .x-pc{position:absolute;top:300px;width:810px;height:420px}
    .x-pc h3{text-align:center}
    .x-bar{position:absolute;width:150px;border-radius:14px 14px 4px 4px}
    .x-bl{position:absolute;width:300px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-sm{position:absolute;left:0;right:0;text-align:center;font-size:24px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-big{position:absolute;left:0;right:0;text-align:center;font-size:64px;font-weight:900;white-space:nowrap}
    .x-mid{position:absolute;left:0;right:0;text-align:center;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-strip{position:absolute;left:120px;top:770px;width:1680px;height:120px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-strip>div{position:absolute;left:0;right:0;top:0;text-align:center;line-height:116px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-no{text-decoration:line-through;text-decoration-color:var(--bad);text-decoration-thickness:6px}
    .x-row{position:absolute;left:120px;width:1680px;height:84px;font-size:46px;font-weight:900;line-height:84px;white-space:nowrap}
    .x-row .n{display:inline-block;width:64px;height:64px;margin:0 26px 0 0;border-radius:50%;background:var(--brand);text-align:center;line-height:62px;font-size:36px;vertical-align:4px}
    .x-hb{position:absolute;height:44px;border-radius:8px}
    .x-ht{position:absolute;font-size:36px;font-weight:900;white-space:nowrap}
    .x-mc{position:absolute;top:290px;width:700px;height:320px}
    .x-mc h3{text-align:center;font-size:40px}
    .x-mc .v{position:absolute;left:0;right:0;top:250px;text-align:center;font-size:38px;font-weight:900;white-space:nowrap}
    .x-tc{position:absolute;top:290px;width:780px;height:480px}
    .x-tc h3{text-align:center}
    .x-tc .k{position:absolute;left:0;right:0;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-verd{position:absolute;left:170px;width:440px;top:384px;height:68px;border-radius:34px;text-align:center;font-size:40px;font-weight:900;line-height:64px;border:3px solid;white-space:nowrap}
    .x-qc{position:absolute;top:330px;width:640px;height:300px;text-align:center}
    .x-qc h3{font-size:44px}
    .x-qc .v{margin-top:36px;font-size:60px;font-weight:900;white-space:nowrap}
    .x-qc .ok{position:absolute;right:20px;top:18px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', MUTED = '#a3abbd', GOOD = '#4cc781'
  const EQ = '<i class="x-eq"></i>'
  const H3O = 'H<sub>3</sub>O<sup>+</sup>', OH = 'OH<sup>−</sup>', NH3 = 'NH<sub>3</sub>', NH4 = 'NH<sub>4</sub><sup>+</sup>', H2O = 'H<sub>2</sub>O'
  const Ka = 'K<sub>a</sub>', Kb = 'K<sub>b</sub>', Kw = 'K<sub>w</sub>', pKa = 'pK<sub>a</sub>', pKb = 'pK<sub>b</sub>'
  const e = (n) => `10<sup>−${n}</sup>`
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- molecules (2-D sketches), centred on (0,0), scaled by k ----------
  // NH3: N with H at top, left and bottom; the right side is open for the proton it gains
  const nh3 = (k = 1) => `${ball(0, -54 * k, 22 * k, 'gray', 'H', 20 * k)}${ball(-54 * k, 0, 22 * k, 'gray', 'H', 20 * k)}${ball(0, 54 * k, 22 * k, 'gray', 'H', 20 * k)}${ball(0, 0, 38 * k, 'pur', 'N', 32 * k)}`
  const nh4 = (k = 1) => `${ball(54 * k, 0, 22 * k, 'gray', 'H', 20 * k)}${nh3(k)}`
  const hO = (k = 1) => `${ball(34 * k, 44 * k, 22 * k, 'gray', 'H', 20 * k)}${ball(0, 0, 38 * k, 'red', 'O', 32 * k)}`

  // ---------- intro: a faint NH3 + H2O => NH4+ + OH- strip under the chips ----------
  EZ.intro = {
    chips: [['1@0.45', 'Weak bases'], ['1@0.65', `${Kb} &amp; ${pKb}`], ['1@0.85', `${Ka} × ${Kb} = ${Kw}`]],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <g transform="translate(560 880)">${nh3(0.7)}</g><text x="700" y="896" text-anchor="middle" font-size="50" font-weight="900">+</text>
      <g transform="translate(820 880)">${ball(-34 * 0.7, 44 * 0.7 - 70, 15, 'gray', 'H', 14)}${hO(0.7)}</g>
      <path d="M930 868 h120 l-16 -12 M1050 892 h-120 l16 12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="x-ib" transform="translate(1180 880)">${nh4(0.7)}</g><text x="1310" y="896" text-anchor="middle" font-size="50" font-weight="900">+</text>
      <g transform="translate(1420 880)">${hO(0.7)}</g></svg>`,
    update(c) {
      c.$('.x-ib').setAttribute('transform', `translate(1180 ${880 + 6 * Math.sin((c.t - c.sc.start) * 1.2)})`)
    },
  }

  // ---------- hook: a solution of ammonia; only one molecule reacts ----------
  const GRID = []
  for (let r = 0; r < 3; r++) for (let q = 0; q < 7; q++) GRID.push([450 + q * 170, 380 + r * 135])
  const HIT = 10
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why weak?</div><h2 class="h1" data-at="in+0.2">Ammonia: a weak base</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <rect x="330" y="300" width="1260" height="430" rx="34" fill="rgba(60,199,188,.06)" stroke="#363c54" stroke-width="3" data-at="in+0.3" data-fx="fade"/>
        ${GRID.map(([x, y], i) => `<g class="x-m${i}" data-at="1@${(0.1 + (i % 7) * 0.05).toFixed(2)}" data-fx="fade"><g transform="translate(${x} ${y})">${nh3(0.6)}</g></g>`).join('')}
        <g data-at="2@0.35" data-fx="pop"><g transform="translate(${GRID[HIT][0] + 32} ${GRID[HIT][1]})">${ball(0, 0, 13, 'gold', 'H', 13)}</g></g>
        <g data-at="2@0.55" data-fx="pop"><g transform="translate(${GRID[HIT][0] + 92} ${GRID[HIT][1] - 50})">${ball(0, 0, 24, 'teal')}</g></g>
        <text x="${GRID[HIT][0] + 92}" y="${GRID[HIT][1] - 86}" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="2@0.55" data-fx="fade">${sup('OH', '−')}</text>
        <circle cx="${GRID[HIT][0]}" cy="${GRID[HIT][1]}" r="60" fill="none" stroke="${GOLD}" stroke-width="5" data-at="2@0.35" data-fx="pop"/>
      </svg>
      <div class="x-line" style="top:752px;font-size:44px" data-at="2@0.6" data-out="3" data-fx="fade"><span class="gold">A tiny fraction</span> takes a proton from water</div>
      <div class="x-line" style="top:752px;font-size:44px" data-at="3" data-fx="fade">Most stay as <span class="pri">${NH3}</span></div>
      <div class="banner" style="top:850px" data-at="4" data-fx="pop">The math is the <span class="gold">mirror image</span> of weak acids</div>`,
    update(c) {
      const dim = c.seg(c.b[3].start, c.b[3].start + 0.6)
      for (let i = 0; i < GRID.length; i++) if (i !== HIT) c.$('.x-m' + i).style.filter = `brightness(${1 - 0.25 * dim})`
    },
  })

  // ---------- Kb: the reaction, B / HB+, the expression ----------
  const NL = [760, 545], OR = [1160, 545], K = 0.8
  EZ.scene('kb', {
    html: `<div class="kicker" data-at="in" data-fx="left">Base constant</div><h2 class="h1" data-at="in+0.2">A weak base and water</h2>
      <div class="x-line" style="top:290px" data-at="1"><span class="pri">${NH3}(aq)</span> + ${H2O}(l)${EQ}<span class="pri">${NH4}(aq)</span> + <span class="teal">${OH}(aq)</span></div>
      <div class="x-line" style="top:378px;font-size:44px" data-at="2"><span class="gold">B</span> + ${H2O}${EQ}<span class="gold">HB<sup>+</sup></span> + <span class="teal">${OH}</span></div>
      <svg class="full" viewBox="0 0 1920 1080" data-at="in+0.3" data-fx="fade">
        <g class="x-ml">${nh3(K)}</g>
        <g class="x-or">${hO(K)}</g>
        <g class="x-hop">${ball(0, 0, 22 * K, 'gold', 'H', 20 * K)}</g>
      </svg>
      <div class="x-lab x-l1" style="top:640px" data-at="in+0.3" data-out="1@0.8" data-fx="fade">${NH3}</div>
      <div class="x-lab muted x-l2" style="top:640px" data-at="in+0.3" data-out="1@0.8" data-fx="fade">${H2O}</div>
      <div class="x-lab pri x-l3" style="top:640px" data-at="1@0.8" data-fx="fade">${NH4}</div>
      <div class="x-lab teal x-l4" style="top:640px" data-at="1@0.8" data-fx="fade">${OH}</div>
      <div class="card x-kc" style="left:120px" data-at="3"><div class="a">${Kb} = <span class="teal">[${OH}]</span><span class="gold">[HB<sup>+</sup>]</span> / <span class="gold">[B]</span></div></div>
      <div class="card x-kc" style="left:990px" data-at="4"><div class="a">${pKb} = −log ${Kb}</div></div>`,
    update(c) {
      const b = c.b, s = b[1].start, d = b[1].end - s
      const hop = eio(c.seg(s + 0.3 * d, s + 0.7 * d)), sep = eio(c.seg(s + 0.72 * d, b[1].end + 0.3))
      const xl = NL[0] - 50 * sep, xr = OR[0] + 50 * sep
      c.$('.x-ml').setAttribute('transform', `translate(${xl} ${NL[1]})`)
      c.$('.x-or').setAttribute('transform', `translate(${xr} ${OR[1]})`)
      const hx = lerp(xr - 54 * K, xl + 54 * K, hop), hy = NL[1] - 80 * Math.sin(Math.PI * hop)
      c.$('.x-hop').setAttribute('transform', `translate(${hx} ${hy})`)
      c.$('.x-l1').style.left = (xl - 150) + 'px'; c.$('.x-l3').style.left = (xl - 150) + 'px'
      c.$('.x-l2').style.left = (xr - 150) + 'px'; c.$('.x-l4').style.left = (xr - 150) + 'px'
    },
  })

  // ---------- shortcut: [OH-] << [B]initial, then the square-root shortcut ----------
  EZ.scene('shortcut', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="in+0.2">Only a little base reacts</h2>
      <div class="card x-pc" style="left:120px" data-at="0"><h3>At equilibrium</h3>
        <div class="x-bar" style="left:170px;top:110px;height:200px;background:linear-gradient(180deg,#c9c9ff,#5b5bd6)"></div>
        <div class="x-bar" style="left:490px;top:304px;height:6px;background:#3cc7bc" data-at="1@0.3" data-fx="fade"></div>
        <div class="x-bl pri" style="left:95px;top:322px">[B]<sub>initial</sub></div>
        <div class="x-bl teal" style="left:415px;top:322px" data-at="1@0.3" data-fx="fade">[${OH}]</div>
        <div class="x-big gold" style="top:160px;font-size:80px" data-at="1@0.55" data-fx="pop">≪</div>
        <div class="x-sm" style="top:384px">bars not to scale</div></div>
      <div class="card x-pc" style="left:990px" data-at="2"><h3>The shortcut</h3>
        <div class="x-big" style="top:150px" data-at="3">[<span class="teal">${OH}</span>] ≈ √(${Kb} · C)</div>
        <div class="x-mid" style="top:270px" data-at="3@0.5" data-fx="fade">C = starting concentration of the base</div></div>
      <div class="x-strip" data-at="4">
        <div data-at="4" data-out="5" data-fx="fade">This gives [<span class="teal">${OH}</span>], <span class="x-no muted">not [${H3O}]</span></div>
        <div data-at="5" data-fx="fade">[<span class="teal">${OH}</span>] ${ARR} <span class="teal">pOH</span> ${ARR} <span class="pri">pH</span></div>
      </div>`,
  })

  // ---------- worked example: 0.20 M NH3 ----------
  const W = 1200, OHW = (1.9e-3 / 0.2) * W
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">pH of 0.20 M NH<sub>3</sub></h2>
      <div class="x-strip" style="top:290px;height:110px" data-at="0@0.1">
        <div style="line-height:106px;font-size:48px">0.20 M ${NH3} &nbsp;·&nbsp; ${Kb} = <span class="gold">1.8 × ${e(5)}</span> &nbsp;·&nbsp; pH = <span class="x-q">?</span></div></div>
      <div class="x-row" style="top:430px" data-at="1"><span class="n">1</span>[<span class="teal">${OH}</span>] ≈ √(1.8 × ${e(5)} × 0.20) <span data-at="2" data-fx="fade">= <span class="teal">1.9 × ${e(3)} M</span></span></div>
      <div class="x-row" style="top:530px" data-at="3"><span class="n">2</span>pOH = −log(1.9 × ${e(3)}) = <span class="teal">2.72</span></div>
      <div class="x-row" style="top:630px" data-at="4"><span class="n">3</span>pH = 14.00 − 2.72 = <span class="pri">11.28</span></div>
      <div data-at="5" data-fx="fade">
        <div class="x-hb" style="left:120px;top:770px;width:${W}px;background:linear-gradient(90deg,#5b5bd6,#8d8df0)"></div>
        <div class="x-ht pri" style="left:${120 + W + 30}px;top:772px">0.20 M ${NH3} at the start</div>
        <div class="x-hb" style="left:120px;top:846px;width:${OHW.toFixed(1)}px;background:#3cc7bc"></div>
        <div class="x-ht teal" style="left:160px;top:848px">[${OH}] = 1.9 × ${e(3)} M</div>
        <div class="x-sm" style="top:912px">bars drawn to scale</div>
      </div>`,
    update(c) {
      const q = c.$('.x-q'), done = c.t >= c.at('4@0.6')
      q.innerHTML = done ? '<span class="pri">11.28</span>' : '?'
    },
  })

  // ---------- conjugate pair: Ka x Kb = Kw ----------
  EZ.scene('pair', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Conjugate pairs</div><h2 class="h1" data-at="0">One link for every pair</h2>
      <div class="card x-mc" style="left:120px" data-at="1"><h3><span class="pri">${NH4}</span> <span class="muted">· conjugate acid</span></h3>
        <svg width="700" height="200" viewBox="-350 -100 700 200" style="position:absolute;left:0;top:80px"><g>${nh4(0.85)}</g></svg>
        <div class="v" data-at="6" data-out="7" data-fx="fade">${Ka} = 1.0 × ${e(14)} ÷ 1.8 × ${e(5)}</div>
        <div class="v" data-at="7" data-fx="pop">${Ka} = <span class="gold">5.6 × ${e(10)}</span></div></div>
      <div class="card x-mc" style="left:1100px" data-at="1@0.3"><h3><span class="pri">${NH3}</span> <span class="muted">· base</span></h3>
        <svg width="700" height="200" viewBox="-350 -100 700 200" style="position:absolute;left:0;top:80px"><g>${nh3(0.85)}</g></svg>
        <div class="v" data-at="5" data-fx="fade">${Kb} = <span class="gold">1.8 × ${e(5)}</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.6" data-fx="fade"><line x1="1080" y1="420" x2="840" y2="420" stroke="${MUTED}" stroke-width="6" marker-end="url(#mk-muted)"/>
          <line x1="840" y1="480" x2="1080" y2="480" stroke="${MUTED}" stroke-width="6" marker-end="url(#mk-muted)"/>
          <text x="960" y="396" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">+ ${sup('H', '+')}</text>
          <text x="960" y="530" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">− ${sup('H', '+')}</text></g>
        <circle class="x-run" r="13" fill="${GOLD}"/>
      </svg>
      <div class="x-line" style="top:650px;font-size:58px" data-at="2">${Ka} × ${Kb} = ${Kw} = <span class="gold">1.0 × ${e(14)}</span></div>
      <div class="x-line" style="top:746px;font-size:48px" data-at="3">${pKa} + ${pKb} = <span class="gold">14</span> <span class="muted" style="font-size:38px">(at 25 °C)</span></div>
      <div class="banner" style="top:846px;font-size:46px" data-at="4" data-fx="pop">Know one ${ARR} <span class="gold">find the other</span></div>`,
    update(c) {
      const s = c.at('6'), p = c.seg(s, s + 1.4), r = c.$('.x-run')
      r.style.opacity = p > 0 && p < 1 ? 1 : 0
      r.setAttribute('cx', lerp(1080, 840, eio(p))); r.setAttribute('cy', 420)
    },
  })

  // ---------- trap: stronger acid, weaker conjugate base ----------
  const BASE = 700, HMAX = 330
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="in+0.2">Stronger acid, weaker conjugate base</h2>
      <div data-at="in+0.3" data-out="3" data-fx="fade">
        <div class="x-bar x-ka" style="left:585px;background:linear-gradient(180deg,#ffe0bf,#b96a26)"></div>
        <div class="x-bar x-kb" style="left:1185px;background:linear-gradient(180deg,#b4f3ec,#1b7f77)"></div>
        <div class="x-bl warm" style="left:510px;top:${BASE + 14}px">${Ka} <span class="muted" style="font-size:30px">acid</span></div>
        <div class="x-bl teal" style="left:1110px;top:${BASE + 14}px">${Kb} <span class="muted" style="font-size:30px">conj. base</span></div>
        <div class="x-line" style="top:292px;font-size:46px" data-at="1" data-fx="fade">${Ka} × ${Kb} = ${Kw} <span class="muted">(fixed)</span></div>
        <div class="x-line" style="top:800px;font-size:46px" data-at="2" data-out="2@0.5" data-fx="fade"><span class="warm">stronger acid</span> ${ARR} <span class="teal">weaker conjugate base</span></div>
        <div class="x-line" style="top:800px;font-size:46px" data-at="2@0.5" data-fx="fade"><span class="warm">weaker acid</span> ${ARR} <span class="teal">stronger conjugate base</span></div>
      </div>
      <div class="card x-tc" style="left:120px" data-at="3"><h3>Acid <span class="warm">HX</span></h3>
        <div class="k" style="top:104px">${pKa} = <span class="warm">3</span></div>
        <div class="k warm" style="top:166px;font-size:34px" data-at="4" data-fx="fade">stronger acid</div>
        <div class="k" style="top:236px">conjugate base: <span class="teal">X<sup>−</sup></span></div>
        <div class="k muted" style="top:300px;font-size:36px" data-at="6@0.5" data-fx="fade">${pKb} = 14 − 3 = 11</div>
        <div class="x-verd warm" style="border-color:var(--warm);background:rgba(243,167,100,.14)" data-at="4@0.3" data-out="5" data-fx="pop">stronger base?</div>
        <div class="x-verd" style="border-color:var(--line);background:rgba(240,112,122,.10)" data-at="5" data-fx="pop"><span class="x-no muted">stronger base</span></div></div>
      <div class="card x-tc" style="left:1020px" data-at="3@0.4"><h3>Acid <span class="pri">HY</span></h3>
        <div class="k" style="top:104px">${pKa} = <span class="pri">9</span></div>
        <div class="k muted" style="top:166px;font-size:34px" data-at="5" data-fx="fade">weaker acid (larger ${pKa})</div>
        <div class="k" style="top:236px">conjugate base: <span class="teal">Y<sup>−</sup></span></div>
        <div class="k muted" style="top:300px;font-size:36px" data-at="6@0.2" data-fx="fade">${pKb} = 14 − 9 = <span class="gold">5</span></div>
        <div class="x-verd good x-win" style="border-color:var(--good);background:rgba(76,199,129,.14)" data-at="5@0.5" data-fx="pop">stronger base</div></div>
      <div class="banner" style="top:830px;font-size:46px" data-at="3@0.75" data-fx="pop">Which has the <span class="teal">stronger conjugate base</span>?</div>`,
    update(c) {
      const b = c.b
      // sentence 1: Ka goes up and down, Kb always the mirror; settles on "stronger acid"
      const s1 = b[1].start, d1 = b[1].end - s1
      let u = 0.5 + 0.38 * Math.sin(Math.PI * 2 * c.seg(s1 + 0.2 * d1, s1 + d1) * 1.25)
      if (c.t >= s1 + d1) u = 0.88
      if (c.t < s1 + 0.2 * d1) u = 0.5
      // sentence 2 halfway: swap to "weaker acid"
      const s2 = b[2].start, d2 = b[2].end - s2
      u = lerp(u, 0.12, eio(c.seg(s2 + 0.45 * d2, s2 + 0.6 * d2)))
      const ha = 40 + (HMAX - 40) * u, hb = 40 + (HMAX - 40) * (1 - u)
      const a = c.$('.x-ka'), k = c.$('.x-kb')
      a.style.top = (BASE - ha) + 'px'; a.style.height = ha + 'px'
      k.style.top = (BASE - hb) + 'px'; k.style.height = hb + 'px'
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is ${Kb} for F<sup>−</sup>?</h2>
      <div class="card x-qc" style="left:200px" data-at="1@0.3"><h3><span class="warm">HF</span> <span class="muted">· acid</span></h3><div class="v">${Ka} = <span class="warm">6.8 × ${e(4)}</span></div></div>
      <div class="card x-qc x-ans" style="left:1080px" data-at="1@0.55"><h3><span class="teal">F<sup>−</sup></span> <span class="muted">· conjugate base</span></h3>
        <div class="ok" style="opacity:0">${CHECK}</div>
        <div class="v">${Kb} = <span class="x-kv gold">?</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.45" data-fx="fade"><line x1="852" y1="480" x2="1068" y2="480" stroke="${MUTED}" stroke-width="6" marker-end="url(#mk-muted)"/>
          <text x="960" y="456" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">− ${sup('H', '+')}</text></g>
      </svg>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-line" style="top:690px;font-size:54px" data-at="3">${Kb} = ${Kw} ÷ ${Ka}</div>
      <div class="banner" style="top:800px;font-size:48px" data-at="4" data-fx="pop">1.0 × ${e(14)} ÷ 6.8 × ${e(4)} = <span class="teal">1.5 × ${e(11)}</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.6 * (b[4].end - b[4].start), b[4].end))
      c.$('.x-kv').innerHTML = win > 0 ? `1.5 × ${e(11)}` : '?'
      const el = c.$('.x-ans')
      el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`
      c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><g transform="translate(150 75)">${nh3(0.62)}</g>
    <text x="250" y="88" text-anchor="middle" font-size="40" font-weight="900" class="f-muted">→</text>
    <g transform="translate(340 75)">${ball(0, 0, 34, 'teal')}</g><text x="340" y="86" text-anchor="middle" font-size="26" font-weight="900" class="f-dark">${sup('OH', '−')}</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150" font-weight="900" text-anchor="middle">
    <rect x="40" y="40" width="150" height="64" rx="14" fill="none" stroke="${WARM}" stroke-width="4"/><text x="115" y="84" font-size="34" class="f-warm">K<tspan dy="8" font-size="22">a</tspan></text>
    <rect x="270" y="40" width="150" height="64" rx="14" fill="none" stroke="${TEAL}" stroke-width="4"/><text x="345" y="84" font-size="34" class="f-teal">K<tspan dy="8" font-size="22">b</tspan></text>
    <text x="230" y="86" font-size="40" style="fill:${TXT}">×</text></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">
    <rect x="150" y="20" width="60" height="120" rx="8" fill="url(#g-warm)"/><rect x="250" y="100" width="60" height="40" rx="8" fill="url(#g-teal)"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>${Kb} = [${OH}][HB<sup>+</sup>]/[B]<br>[${OH}] ≈ √(${Kb}·C)<br>then <span class="teal">pOH</span> ${ARR} <span class="pri">pH</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>${Ka} × ${Kb} = <span class="gold">${Kw}</span><br><br>${pKa} + ${pKb} = <span class="gold">14</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="warm">Stronger acid</span><br>${ARR}<br><span class="teal">weaker</span><br><span class="teal">conjugate base</span></p></div>`,
  })
  void clamp; void GOOD; void PRI
})()
