// Pictures for chem-7.7 "Q vs. K & ICE Tables". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): the N2O4 quick
// check (K = 0.0059, Q = 0.0010), the H2 + I2 ICE example (K = 50.0, 0.100 M, x = 0.0780, 0.156 M,
// 0.022 M) and the try question (K = 10, Q = 25). Number lines show order only, not a scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-larr{display:inline-block;width:.9em;height:.62em;margin:0 .22em;background:currentColor;transform:scaleX(-1);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 20'%3E%3Cpath d='M1 10h25M18 2l9 8-9 8' fill='none' stroke='black' stroke-width='3.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.12}
    .x-f>span{display:block;padding:0 .14em}
    .x-f>span+span{border-top:.07em solid currentColor}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:48px;font-weight:900;white-space:nowrap}
    .x-al{position:absolute;left:120px;font-size:54px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1680px;height:100px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-row .L{position:absolute;left:28px;top:0;line-height:96px;font-size:30px;font-weight:900;color:var(--muted);white-space:nowrap;letter-spacing:.06em}
    .x-row .E{position:absolute;left:250px;top:0;line-height:96px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-row .D{position:absolute;right:34px;top:0;line-height:96px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-q{position:absolute;top:340px;width:810px;height:300px}
    .x-q .Q{margin:34px 40px 0;font-size:54px;font-weight:900;white-space:nowrap}
    .x-q .A{position:absolute;left:40px;top:150px;height:100px;padding:0 34px;border-radius:24px;font-size:52px;font-weight:900;line-height:96px;white-space:nowrap}
    .x-cmp{top:400px;width:540px;height:520px;text-align:center}
    .x-cmp .R{margin-top:26px;font-size:64px;font-weight:900;white-space:nowrap}
    .x-cmp svg{display:block;margin:10px auto 0}
    .x-cmp .S{font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-cmp .D{margin-top:12px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-ice{left:120px;top:300px;width:940px;height:600px}
    .x-ice table{position:absolute;left:30px;top:24px;width:880px;border-collapse:collapse}
    .x-ice th{height:80px;font-size:34px;font-weight:900;color:var(--muted);text-align:center;border-bottom:3px solid var(--line)}
    .x-ice td{height:156px;font-size:40px;font-weight:900;text-align:center;border-bottom:2px solid var(--line);white-space:nowrap}
    .x-ice tr:last-child td{border-bottom:none}
    .x-ice td.rl{width:280px;text-align:left;padding-left:22px;font-size:36px}
    .x-ice td.rl b{font-size:76px;vertical-align:-6px}
    .x-ice small{display:block;font-size:26px;font-weight:800;color:var(--muted)}
    .x-st{position:absolute;left:1110px;width:690px;height:120px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);padding:0 24px 0 100px;display:flex;align-items:center;font-size:34px;font-weight:800;line-height:1.2}
    .x-st i{position:absolute;left:24px;top:30px;width:56px;height:56px;border-radius:50%;background:var(--brand);font-style:normal;font-size:32px;font-weight:900;line-height:56px;text-align:center}
    .x-tab{left:120px;top:400px;width:1680px;height:540px}
    .x-tab table{position:absolute;left:40px;top:20px;width:1600px;border-collapse:collapse;font-size:56px;font-weight:900}
    .x-tab th{height:96px;font-size:50px;text-align:center;border-bottom:3px solid var(--line)}
    .x-tab td{height:136px;text-align:center;border-bottom:2px solid var(--line);white-space:nowrap}
    .x-tab tr:last-child td{border-bottom:none}
    .x-tab td:first-child,.x-tab th:first-child{width:220px;text-align:left;padding-left:30px}
    .x-res{position:absolute;left:1180px;width:620px;height:140px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center}
    .x-res .H{margin-top:16px;font-size:26px;font-weight:900;letter-spacing:.1em;color:var(--muted)}
    .x-res .V{margin-top:4px;font-size:52px;font-weight:900;white-space:nowrap}
    .x-ok{position:absolute;top:310px;width:810px;height:360px}
    .x-ok h3{text-align:center} .x-ok .it{margin:30px 0 0;text-align:center;font-size:52px;font-weight:900;white-space:nowrap}
    .x-no{text-decoration:line-through;text-decoration-color:var(--bad);text-decoration-thickness:6px;color:var(--muted)}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:38px;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:31px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:29px;width:64px;height:64px;opacity:0}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', MUTED = '#a3abbd'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const EQ = '<i class="x-eq"></i>', LARR = '<i class="x-larr"></i>'
  const H2 = 'H<sub>2</sub>', I2 = 'I<sub>2</sub>', NO2 = 'NO<sub>2</sub>', N2O4 = 'N<sub>2</sub>O<sub>4</sub>'
  const fr = (top, bot, style = '') => `<span class="x-f" style="${style}"><span>${top}</span><span>${bot}</span></span>`

  // ---------- intro artwork: a faint ICE grid on the left, Q heading for K on the right ----------
  EZ.intro = {
    chips: [['1@0.5', 'Q vs. K'], ['1@0.64', 'Direction'], ['1@0.78', 'ICE tables']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2" font-weight="900">
      <g stroke="${MUTED}" stroke-width="4" fill="none"><rect x="60" y="300" width="250" height="450" rx="24"/><line x1="60" y1="450" x2="310" y2="450"/><line x1="60" y1="600" x2="310" y2="600"/></g>
      <text x="130" y="405" font-size="84" style="fill:${PRI}">I</text><text x="120" y="555" font-size="84" style="fill:${WARM}">C</text><text x="120" y="705" font-size="84" style="fill:${TEAL}">E</text>
      <text x="230" y="400" font-size="40" style="fill:${TXT}">x</text>
      <line x1="1640" y1="300" x2="1640" y2="800" stroke="${MUTED}" stroke-width="5"/>
      <line x1="1610" y1="660" x2="1670" y2="660" stroke="${TEAL}" stroke-width="8"/><text x="1700" y="680" font-size="64" style="fill:${TEAL}">K</text>
      <g class="x-iq"><circle cx="1640" cy="0" r="22" fill="${WARM}"/><text x="1580" y="20" font-size="64" text-anchor="end" style="fill:${WARM}">Q</text></g>
    </svg>`,
    update(c) {
      const p = eio(clamp(((c.t - c.sc.start) % 6) / 3.2))
      c.$('.x-iq').setAttribute('transform', `translate(0 ${lerp(380, 640, p)})`)
    },
  }

  // ---------- hook: which way, and where does it stop? ----------
  const PARTS = [[200, 640, 'teal'], [300, 700, 'warm'], [420, 650, 'teal'], [260, 790, 'teal'], [380, 770, 'warm'], [500, 740, 'teal'], [180, 730, 'warm'], [470, 830, 'teal'], [330, 850, 'warm'], [560, 820, 'teal']]
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two questions</div><h2 class="h1" data-at="0">Mix some chemicals...</h2>
      <svg class="full" viewBox="0 0 1920 1080" data-at="0@0.3" data-fx="fade">
        <path d="M290 320 V470 L130 880 Q120 930 175 930 H585 Q640 930 630 880 L470 470 V320" fill="rgba(141,141,240,.08)" stroke="#c9cee0" stroke-width="7" stroke-linejoin="round"/>
        <line x1="268" y1="320" x2="492" y2="320" stroke="#c9cee0" stroke-width="7" stroke-linecap="round"/>
        ${PARTS.map(([x, y, g], i) => `<g class="x-p${i}">${ball(x, y, 24, g)}</g>`).join('')}
      </svg>
      <div class="card x-q" style="left:990px" data-at="1"><div class="Q">Which way will it go?</div>
        <div class="A" style="background:rgba(60,199,188,.14);border:2px solid rgba(60,199,188,.6);color:var(--accent)" data-at="3" data-fx="pop">Compare Q to K</div></div>
      <div class="card x-q" style="left:990px;top:680px" data-at="2"><div class="Q">Where will it stop?</div>
        <div class="A" style="background:rgba(243,167,100,.14);border:2px solid rgba(243,167,100,.6);color:var(--warm)" data-at="4" data-fx="pop">Use an ICE table</div></div>`,
    update(c) {
      const t = c.t
      PARTS.forEach((_, i) => {
        c.$('.x-p' + i).setAttribute('transform', `translate(${7 * Math.sin(t * 1.3 + i * 1.7)} ${7 * Math.cos(t * 1.1 + i * 2.3)})`)
      })
    },
  })

  // ---------- compare Q with K: three cases ----------
  const bars = (q, k) => `<svg width="300" height="200" viewBox="0 0 300 200" font-weight="900" text-anchor="middle">
    <line x1="20" y1="160" x2="280" y2="160" stroke="#c9cee0" stroke-width="4"/>
    <rect x="60" y="${160 - q}" width="70" height="${q}" rx="8" style="fill:${WARM}"/><rect x="170" y="${160 - k}" width="70" height="${k}" rx="8" style="fill:${TEAL}"/>
    <text x="95" y="196" font-size="34" class="f-warm">Q</text><text x="205" y="196" font-size="34" class="f-teal">K</text></svg>`
  const LT = '&lt;', GT = '&gt;'
  EZ.scene('compare', {
    html: `<div class="kicker" data-at="in" data-fx="left">Direction</div><h2 class="h1" data-at="0">Compare Q with K</h2>
      <div class="x-line" style="top:296px;font-size:42px" data-at="0@0.3" data-fx="fade">Reaction quotient <span class="warm">Q</span>: same form as <span class="teal">K</span>, at any moment</div>
      <div class="card x-cmp" style="left:120px" data-at="1"><div class="R"><span class="warm">Q</span> ${LT} <span class="teal">K</span></div>${bars(50, 130)}
        <div class="S">too few products</div><div class="D teal" data-at="2" data-fx="pop">forward ${ARR}</div><div class="S" data-at="2@0.5" data-fx="fade">makes products</div></div>
      <div class="card x-cmp" style="left:690px" data-at="3"><div class="R"><span class="warm">Q</span> ${GT} <span class="teal">K</span></div>${bars(130, 50)}
        <div class="S">too many products</div><div class="D warm" data-at="4" data-fx="pop">${LARR} reverse</div><div class="S" data-at="4@0.5" data-fx="fade">makes reactants</div></div>
      <div class="card x-cmp" style="left:1260px" data-at="5"><div class="R"><span class="warm">Q</span> = <span class="teal">K</span></div>${bars(95, 95)}
        <div class="S">already at equilibrium</div><div class="D gold" data-at="5@0.6" data-fx="pop">${EQ}</div><div class="S" data-at="6" data-fx="fade">forward rate = reverse rate</div></div>`,
  })

  // ---------- worked check: N2O4 <=> 2NO2 ----------
  EZ.scene('check', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Try one</div><h2 class="h1" data-at="0">Which way will it shift?</h2>
      <div class="x-row" style="top:290px" data-at="1"><div class="L">REACTION</div><div class="E">${N2O4}(g) ${EQ} 2${NO2}(g)</div><div class="D teal">K = 0.0059</div></div>
      <div class="x-row" style="top:410px" data-at="2"><div class="L">FLASK</div><div class="E">[${N2O4}] = 0.10 M &nbsp;&nbsp; [${NO2}] = 0.010 M</div></div>
      <div class="x-line" style="top:560px;font-size:60px" data-at="3"><span class="warm">Q</span> = ${fr(`[${NO2}]<sup>2</sup>`, `[${N2O4}]`)}
        <span data-at="4" data-fx="fade">= ${fr('0.00010', '0.10')} = <span class="warm">0.0010</span></span></div>
      <div class="banner" style="top:800px;font-size:48px" data-at="5" data-fx="pop"><span class="warm">0.0010</span> &lt; <span class="teal">0.0059</span> &nbsp;${ARR} Q &lt; K ${ARR} <span class="teal">forward</span>, making more ${NO2}</div>`,
  })

  // ---------- the ICE table: rows and steps ----------
  const STEPS = [['2', 'Fill in the <b class="pri">initial</b> concentrations'], ['3', '<b class="warm">Changes</b>: ±(coefficient)·x'], ['5', '<b class="teal">Equilibrium</b> row = I + C'], ['6', 'Plug the E row into K, <b class="gold">solve for x</b>']]
  EZ.scene('ice', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The amounts</div><h2 class="h1" data-at="0">The ICE table</h2>
      <div class="card x-ice" data-at="1"><table>
        <tr><th></th><th>Reactant</th><th>Product</th></tr>
        <tr class="x-r1"><td class="rl"><b class="pri">I</b>nitial</td><td data-at="2@0.5" data-fx="fade">start</td><td data-at="2@0.6" data-fx="fade">start</td></tr>
        <tr class="x-r2"><td class="rl"><b class="warm">C</b>hange</td>
          <td><span data-at="3@0.6" data-fx="fade">−(coef.)·x</span><small class="warm" data-at="4@0.5" data-fx="fade">goes down</small></td>
          <td><span data-at="3@0.7" data-fx="fade">+(coef.)·x</span><small class="teal" data-at="4@0.7" data-fx="fade">goes up</small></td></tr>
        <tr class="x-r3"><td class="rl"><b class="teal">E</b>quilibrium</td><td data-at="5@0.5" data-fx="fade">I + C</td><td data-at="5@0.6" data-fx="fade">I + C</td></tr>
      </table></div>
      <div class="muted" style="position:absolute;left:180px;top:920px;font-size:30px;font-weight:800;white-space:nowrap" data-at="4" data-fx="fade">Changes shown for Q &lt; K</div>
      ${STEPS.map(([at, txt], i) => `<div class="x-st" style="top:${300 + i * 150}px" data-at="${at}" data-fx="left"><i>${i + 1}</i><span>${txt}</span></div>`).join('')}`,
    update(c) {
      const b = c.b, rows = [[2, 3], [3, 5], [5, 7]]
      rows.forEach(([a, z], i) => {
        const on = c.t >= b[a].start && (b[z] ? c.t < b[z].start : true) && c.t < b[6].start
        c.$('.x-r' + (i + 1)).style.background = on ? 'rgba(141,141,240,.14)' : 'transparent'
      })
    },
  })

  // ---------- worked example: building the table for H2 + I2 <=> 2HI ----------
  EZ.scene('table', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">${H2} + ${I2} ${EQ} 2HI &nbsp;<span class="teal">K = 50.0</span></h2>
      <div class="x-line" style="top:300px;font-size:44px;text-align:left;left:120px;width:auto" data-at="1">Start: <span class="pri">0.100 M</span> ${H2}, <span class="pri">0.100 M</span> ${I2}, <span class="muted">no HI</span></div>
      <div class="card x-tab" data-at="1@0.4"><table>
        <tr><th></th><th>${H2}</th><th>${I2}</th><th><span class="x-co">2</span>HI</th></tr>
        <tr><td class="pri">I</td><td data-at="2@0.2" data-fx="fade">0.100</td><td data-at="2@0.45" data-fx="fade">0.100</td><td data-at="2@0.75" data-fx="fade">0</td></tr>
        <tr><td class="warm">C</td><td class="warm" data-at="3@0.15" data-fx="fade">−x</td><td class="warm" data-at="3@0.25" data-fx="fade">−x</td><td class="teal" data-at="3@0.4" data-fx="pop">+2x</td></tr>
        <tr><td class="teal">E</td><td data-at="4@0.2" data-fx="fade">0.100 − x</td><td data-at="4@0.45" data-fx="fade">0.100 − x</td><td class="teal" data-at="4@0.75" data-fx="fade">2x</td></tr>
      </table></div>`,
    update(c) {
      const b = c.b, on = c.t >= b[3].start + 0.6 * (b[3].end - b[3].start) && c.t < b[4].start
      const el = c.$('.x-co')
      el.style.color = on ? GOLD : ''
      el.style.background = on ? 'rgba(242,196,67,.22)' : 'transparent'
      el.style.borderRadius = '10px'
    },
  })

  // ---------- solving for x ----------
  EZ.scene('solve', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Solve for x</h2>
      <div class="x-row" style="top:290px" data-at="0@0.2"><div class="L teal">E ROW</div><div class="E">[${H2}] = [${I2}] = 0.100 − x &nbsp;&nbsp; [HI] = 2x</div></div>
      <div class="x-al" style="top:430px" data-at="1">50.0 = ${fr('(2x)<sup>2</sup>', '(0.100 − x)<sup>2</sup>')}</div>
      <div class="x-al" style="top:600px" data-at="2@0.45"><span class="muted" style="font-size:40px">√ both sides:</span> 7.07 = ${fr('2x', '0.100 − x')}</div>
      <div class="x-al" style="top:790px;font-size:46px" data-at="3">0.707 = 9.07x ${ARR} <span class="gold" style="font-size:60px">x = 0.0780</span></div>
      <div class="x-res" style="top:430px;border-color:rgba(60,199,188,.7)" data-at="4" data-fx="pop"><div class="H">[HI] = 2x</div><div class="V teal">0.156 M</div></div>
      <div class="x-res" style="top:600px;border-color:rgba(141,141,240,.7)" data-at="5" data-fx="pop"><div class="H">[H<sub>2</sub>] = [I<sub>2</sub>] = 0.100 − x</div><div class="V pri">0.022 M</div></div>
      <div class="x-res" style="top:770px;border-color:rgba(76,199,129,.7)" data-at="6" data-fx="pop"><div class="H">CHECK</div><div class="V" style="font-size:46px">${fr('(0.156)<sup>2</sup>', '(0.022)<sup>2</sup>', 'font-size:28px')} ≈ <span class="good">50</span></div></div>`,
  })

  // ---------- the trick: Q always moves toward K ----------
  const NL = 1, KX = 960
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Q always moves toward K</h2>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900" text-anchor="middle">
        <g data-at="1" data-fx="fade">
          <line x1="200" y1="560" x2="1700" y2="560" stroke="#c9cee0" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-text)"/>
          <text x="330" y="640" font-size="30" class="f-muted">smaller</text><text x="1590" y="640" font-size="30" class="f-muted">bigger</text>
          <line x1="${KX}" y1="520" x2="${KX}" y2="600" stroke="${TEAL}" stroke-width="10" stroke-linecap="round"/>
          <text x="${KX}" y="660" font-size="54" class="f-teal">K</text>
        </g>
        <g data-at="3" data-out="4" data-fx="fade"><path d="M520 440 Q730 370 925 440" fill="none" stroke="${TEAL}" stroke-width="7" stroke-dasharray="16 12" marker-end="url(#mk-teal)"/></g>
        <g data-at="4" data-fx="fade"><path d="M1400 440 Q1190 370 995 440" fill="none" stroke="${WARM}" stroke-width="7" stroke-dasharray="16 12" marker-end="url(#mk-warm)"/></g>
        <g data-at="1@0.4" data-fx="fade"><g class="x-qm"><circle cx="0" cy="560" r="24" fill="${WARM}"/><text x="0" y="510" font-size="54" class="f-warm">Q</text></g></g>
      </svg>
      <div class="x-line" style="top:300px;font-size:52px" data-at="2" data-fx="pop">The reaction moves <span class="warm">Q</span> toward <span class="teal">K</span></div>
      <div class="x-line" style="top:730px;font-size:46px" data-at="3">Q left of K (Q &lt; K) ${ARR} moves right: <span class="teal">forward ${ARR}</span></div>
      <div class="x-line" style="top:830px;font-size:46px" data-at="4">Q right of K (Q &gt; K) ${ARR} moves left: <span class="warm">${LARR} reverse</span></div>`,
    update(c) {
      const b = c.b
      let x = 480
      if (c.t >= b[4].start) x = lerp(1440, KX, eio(c.seg(b[4].start + 0.9, b[4].start + 2.4)))
      else if (c.t >= b[3].start) x = lerp(480, KX, eio(c.seg(b[3].start + 1.2, b[3].start + 2.7)))
      c.$('.x-qm').setAttribute('transform', `translate(${x} 0)`)
    },
  })
  void NL

  // ---------- trap: concentrations, not moles ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="0">What goes in an ICE table?</h2>
      <div class="card x-ok" style="left:120px;border-color:rgba(76,199,129,.7)" data-at="1"><h3 class="good">Use</h3>
        <div class="it">Concentrations (M)</div><div class="it" style="margin-top:24px">Partial pressures</div></div>
      <div class="card x-ok" style="left:990px;border-color:rgba(240,112,122,.7)" data-at="2"><h3 class="bad">Not</h3>
        <div class="it"><span class="x-no">Moles</span></div><div class="it" style="margin-top:24px"><span class="x-no">Grams</span></div></div>
      <div class="x-line" style="top:720px;font-size:56px" data-at="3">moles ÷ volume ${ARR} <span class="teal">concentration (M)</span></div>
      <div class="banner" style="top:850px;font-size:48px" data-at="3@0.5" data-fx="pop">Given moles and a volume? <span class="gold">Divide first!</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['Forward (toward products)', 'Reverse (toward reactants)', 'It’s at equilibrium', 'It can’t be determined']
  const X0 = 360, SC = 40 // number line: value v sits at X0 + SC * v (order only)
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which way does the reaction proceed?</h2>
      <div style="position:absolute;left:120px;top:272px;font-size:40px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="1@0.1">For a reaction, <b class="teal">K = 10</b>. At some moment, <b class="warm">Q = 25</b>.</div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${350 + Math.floor(i / 2) * 150}px" data-at="1@${0.62 + i * 0.09}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}<span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-line" style="top:680px;font-size:46px" data-at="4"><span class="warm">Q = 25</span> &gt; <span class="teal">K = 10</span> ${ARR} too many products</div>
      <svg class="full" viewBox="0 0 1920 1080" font-weight="900" text-anchor="middle">
        <g data-at="5" data-fx="fade">
          <line x1="${X0 - 60}" y1="870" x2="${X0 + SC * 30 + 60}" y2="870" stroke="#c9cee0" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-text)"/>
          <line x1="${X0 + SC * 10}" y1="840" x2="${X0 + SC * 10}" y2="900" stroke="${TEAL}" stroke-width="9" stroke-linecap="round"/>
          <text x="${X0 + SC * 10}" y="950" font-size="38" class="f-teal">K = 10</text>
          <line x1="${X0 + SC * 25}" y1="855" x2="${X0 + SC * 25}" y2="885" stroke="${MUTED}" stroke-width="5"/>
          <text x="${X0 + SC * 25}" y="950" font-size="38" class="f-muted">25</text>
          <path d="M${X0 + SC * 25 - 30} 800 Q${X0 + SC * 17.5} 770 ${X0 + SC * 10 + 40} 800" fill="none" stroke="${WARM}" stroke-width="6" stroke-dasharray="14 10" marker-end="url(#mk-warm)"/>
        </g>
        <g data-at="5@0.1" data-fx="fade"><g class="x-tq"><circle cx="0" cy="870" r="20" fill="${WARM}"/><text x="0" y="836" font-size="40" class="f-warm">Q</text></g></g>
      </svg>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
      const q = lerp(25, 10, eio(c.seg(b[5].start + 0.8, b[5].start + 2.4)))
      c.$('.x-tq').setAttribute('transform', `translate(${X0 + SC * q} 0)`)
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <line x1="30" y1="100" x2="410" y2="100" stroke="#c9cee0" stroke-width="5" stroke-linecap="round"/>
    <line x1="290" y1="74" x2="290" y2="126" stroke="${TEAL}" stroke-width="9" stroke-linecap="round"/><text x="290" y="166" font-size="40" style="fill:${TEAL}">K</text>
    <circle cx="110" cy="100" r="18" fill="${WARM}"/><text x="110" y="62" font-size="40" style="fill:${WARM}">Q</text>
    <path d="M140 60 Q200 26 262 60" fill="none" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/></svg>`
  const r2 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900">
    <rect x="70" y="10" width="300" height="150" rx="16" fill="none" stroke="${MUTED}" stroke-width="4"/><line x1="70" y1="60" x2="370" y2="60" stroke="${MUTED}" stroke-width="3"/><line x1="70" y1="110" x2="370" y2="110" stroke="${MUTED}" stroke-width="3"/>
    <text x="95" y="50" font-size="38" style="fill:${PRI}">I</text><text x="92" y="100" font-size="38" style="fill:${WARM}">C</text><text x="92" y="150" font-size="38" style="fill:${TEAL}">E</text>
    <text x="270" y="100" font-size="36" text-anchor="middle" style="fill:${TXT}">±(coef.)·x</text></svg>`
  const r3 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <text x="100" y="100" font-size="50" style="fill:${TEAL}">E row</text>
    <line x1="200" y1="86" x2="262" y2="86" stroke="${TXT}" stroke-width="6" marker-end="url(#mk-text)"/>
    <text x="330" y="100" font-size="56" style="fill:${TXT}">K</text>
    <text x="220" y="158" font-size="46" style="fill:${GOLD}">solve for x</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Q &lt; K ${ARR} <span class="teal">forward</span><br>Q &gt; K ${ARR} <span class="warm">reverse</span><br>Q = K ${ARR} <span class="gold">equilibrium</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="pri">Initial</span>, <span class="warm">Change</span><br>(coefficients × x),<br><span class="teal">Equilibrium</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Substitute the<br>E row into K,<br>then solve for x</p></div>`,
  })
  void TXT
})()
