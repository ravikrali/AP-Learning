// Pictures for chem-4.3 "Particle Diagrams of Reactions". One EZ.scene per scene id in script.mjs.
// Every count shown is the lesson's own (app/src/content/chem/u4.ts; drawing states and the
// "NaCl molecule" warning are from book.ts). Atom and ion sizes are drawn in the right order,
// not to scale.
(() => {
  const { lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-term{position:absolute;top:26px;width:360px;margin-left:-180px;text-align:center;font-size:78px;font-weight:900;line-height:1;white-space:nowrap}
    .x-term small{display:block;margin-top:18px;font-size:32px;font-weight:900}
    .x-step{position:absolute;left:780px;width:360px;text-align:center;font-size:40px;font-weight:900;line-height:1.25;white-space:nowrap}
    .x-tag{position:absolute;font-size:30px;font-weight:900;white-space:nowrap}
    .x-foot{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-st{top:320px;width:390px;height:480px;text-align:center}
    .x-st .t{margin-top:26px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-st svg{position:absolute;left:0;top:96px}
    .x-st .lb{position:absolute;left:0;right:0;bottom:28px;font-size:30px;font-weight:800;line-height:1.25;color:var(--muted)}
    .x-chx{position:absolute;height:84px;padding:0 30px;border-radius:22px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:44px;font-weight:900;line-height:80px;white-space:nowrap}
    .x-tile{position:absolute;top:470px;width:390px;height:190px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .lt{position:absolute;left:20px;top:16px;width:52px;height:52px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:28px;font-weight:900;line-height:48px;color:var(--muted)}
    .x-tile .f{margin-top:66px;font-size:52px;font-weight:900;line-height:1.05;white-space:nowrap} .x-tile .f.sm{margin-top:52px;font-size:40px}
    .x-tile .ok{position:absolute;right:16px;top:14px;width:58px;height:58px}
    .x-row{position:absolute;left:120px;width:1680px;height:110px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-row .n{position:absolute;left:26px;top:22px;width:64px;height:64px;border-radius:50%;font-size:36px;font-weight:900;line-height:64px;text-align:center;color:#10131c}
    .x-row .eq{position:absolute;left:124px;top:26px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = (x, y, r = 34) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#f0707a"/><path d="M${-r * 0.4} ${-r * 0.4}L${r * 0.4} ${r * 0.4}M${r * 0.4} ${-r * 0.4}L${-r * 0.4} ${r * 0.4}" stroke="#10131c" stroke-width="${r * 0.22}" stroke-linecap="round"/></g>`
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', RED = '#f0707a'
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)

  // atoms: N and O drawn larger than H (right order, not to scale)
  const H = (x, y, k = 1) => ball(x, y, 26 * k, 'gray', k >= 0.7 ? 'H' : '', 20 * k)
  const O = (x, y, k = 1) => ball(x, y, 36 * k, 'teal', k >= 0.7 ? 'O' : '', 28 * k)
  const N = (x, y, k = 1) => ball(x, y, 40 * k, 'pur', k >= 0.7 ? 'N' : '', 31 * k)
  const h2 = (x, y, k = 1) => H(x - 24 * k, y, k) + H(x + 24 * k, y, k)
  const o2 = (x, y, k = 1) => O(x - 34 * k, y, k) + O(x + 34 * k, y, k)
  const n2 = (x, y, k = 1) => N(x - 40 * k, y, k) + N(x + 40 * k, y, k)
  const h2o = (x, y, k = 1) => H(x - 46 * k, y + 30 * k, k) + H(x + 46 * k, y + 30 * k, k) + O(x, y, k)
  // ions: Mg2+ drawn smaller than Cl- (right order, not to scale)
  const MG = (x, y, k = 1) => ball(x, y, 34 * k, 'warm', k >= 0.7 ? sup('Mg', '2+') : '', 22 * k)
  const CL = (x, y, k = 1) => ball(x, y, 46 * k, 'green', k >= 0.7 ? sup('Cl', '−') : '', 26 * k)
  const ring = (x, y, r, col = WARM) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="5" stroke-dasharray="12 10"/>`

  // ---------- intro artwork: faint molecules at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Equation → picture'], ['1@0.55', 'Before & after'], ['1@0.8', 'The leftover reactant']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${h2o(190, 300)}${h2(160, 570)}${o2(230, 830)}${h2o(1730, 330)}${h2(1770, 590)}${o2(1690, 840)}</svg>`,
  }

  // ---------- hook: a reaction drawn as molecules ----------
  const HK = [[h2, 300, 520], [h2, 530, 700], [o2, 670, 470], [h2o, 1290, 520], [h2o, 1570, 680]]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Pictures, not formulas</div><h2 class="h1" data-at="0">A reaction, drawn as molecules</h2>
      <div class="card" style="left:120px;top:300px;width:740px;height:520px" data-at="1"><h3 data-at="2" data-fx="fade">Before</h3></div>
      <div class="card" style="left:1060px;top:300px;width:740px;height:520px" data-at="1@0.4"><h3 data-at="2@0.4" data-fx="fade">After</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <line x1="886" y1="560" x2="1030" y2="560" stroke="#eef0f7" stroke-width="9" marker-end="url(#mk-text)" data-at="2@0.2" data-fx="fade"/>
        ${HK.map(([f], i) => `<g data-at="1@${i < 3 ? 0.2 + i * 0.12 : 0.55 + (i - 3) * 0.12}" data-fx="fade"><g class="hk${i}">${f(0, 0)}</g></g>`).join('')}
      </svg>
      <div class="banner" style="top:860px" data-at="3" data-fx="pop">Translate between <span class="teal">pictures</span> and <span class="pri">equations</span></div>`,
    update(c) {
      HK.forEach(([, x, y], i) => place(c.$('.hk' + i), x + 12 * Math.sin(c.t * 0.7 + i * 1.9), y + 10 * Math.cos(c.t * 0.6 + i * 2.3)))
    },
  })

  // ---------- equation -> picture: 2H2 + O2 -> 2H2O ----------
  const FROM = [[236, 690], [284, 690], [396, 690], [444, 690], [606, 690], [674, 690]]
  const TO = [[1244, 710], [1336, 710], [1514, 710], [1606, 710], [1290, 680], [1560, 680]]
  EZ.scene('translate', {
    html: `<div class="kicker" data-at="in" data-fx="left">Equation to picture</div><h2 class="h1" data-at="in+0.2">Coefficients = molecules to draw</h2>
      <div class="card" style="left:120px;top:290px;width:1680px;height:190px" data-at="0">
        <div class="x-term" style="left:420px"><span class="warm">2</span>H<sub>2</sub><small class="warm" data-at="1@0.3" data-fx="pop">2 molecules</small></div>
        <div class="x-term muted" style="left:640px">+</div>
        <div class="x-term" style="left:820px">O<sub>2</sub><small class="warm" data-at="1@0.5" data-fx="pop">1 molecule</small></div>
        <div class="x-term muted" style="left:1010px">→</div>
        <div class="x-term" style="left:1240px"><span class="warm">2</span>H<sub>2</sub>O<small class="warm" data-at="1@0.7" data-fx="pop">2 molecules</small></div>
      </div>
      <div class="card" style="left:120px;top:510px;width:740px;height:340px" data-at="2"><h3>Before</h3></div>
      <div class="card" style="left:1060px;top:510px;width:740px;height:340px" data-at="3"><h3>After</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.2" data-fx="pop">${h2(260, 690)}</g><g data-at="2@0.35" data-fx="pop">${h2(420, 690)}</g><g data-at="2@0.55" data-fx="pop">${o2(640, 690)}</g>
        <line x1="886" y1="690" x2="1030" y2="690" stroke="#eef0f7" stroke-width="9" marker-end="url(#mk-text)" data-at="3" data-fx="fade"/>
        <g class="mv">${FROM.map((_, i) => `<g class="m${i}">${i < 4 ? H(0, 0) : O(0, 0)}</g>`).join('')}</g>
        <text x="490" y="808" text-anchor="middle" font-size="40" font-weight="900" data-at="5@0.15" data-fx="fade">4 H · <tspan class="f-teal">2 O</tspan></text>
        <text x="1430" y="808" text-anchor="middle" font-size="40" font-weight="900" data-at="5@0.6" data-fx="fade">4 H · <tspan class="f-teal">2 O</tspan></text>
        <text x="958" y="822" text-anchor="middle" font-size="64" font-weight="900" class="f-good" data-at="5@0.85" data-fx="pop">=</text>
      </svg>
      <div class="banner" style="top:880px;padding:18px 40px" data-at="6" data-fx="pop">Rule 1: <span class="good">conserve atoms</span>. Count each element, before and after.</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.2, t1 = t0 + 1.9
      const p = eio(c.seg(t0, t1))
      c.$('.mv').style.opacity = c.seg(t0 - 0.2, t0)
      FROM.forEach(([x, y], i) => {
        const [tx, ty] = TO[i], arc = Math.sin(Math.PI * p) * (i % 2 ? -70 : 70)
        place(c.$('.m' + i), lerp(x, tx, p), lerp(y, ty, p) + arc)
      })
    },
  })

  // ---------- worked example: 6 H2 + 2 O2 ----------
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Read the before and after boxes</h2>
      <div class="card" style="left:120px;top:300px;width:640px;height:470px" data-at="1"><h3>Before</h3></div>
      <div class="card" style="left:1160px;top:300px;width:640px;height:470px" data-at="2"><h3>After <span class="warm" data-at="2@0.3" data-fx="fade">?</span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.3" data-fx="fade">${h2(220, 560)}${h2(340, 560)}${h2(540, 560)}${h2(660, 560)}${h2(380, 690)}${h2(500, 690)}</g>
        <g data-at="1@0.5" data-fx="fade">${o2(280, 450)}${o2(600, 450)}</g>
        <rect x="160" y="404" width="240" height="196" rx="26" fill="rgba(60,199,188,.08)" stroke="${TEAL}" stroke-width="4" stroke-dasharray="14 10" data-at="3@0.3" data-fx="fade"/>
        <rect x="480" y="404" width="240" height="196" rx="26" fill="rgba(60,199,188,.08)" stroke="${TEAL}" stroke-width="4" stroke-dasharray="14 10" data-at="4@0.1" data-fx="fade"/>
        <g data-at="5@0.4" data-fx="fade">${ring(380, 690, 56)}${ring(500, 690, 56)}</g>
        <text x="736" y="356" text-anchor="end" font-size="30" font-weight="900" class="f-pri" data-at="7@0.6" data-fx="fade">O₂ = limiting</text>
        <line x1="786" y1="335" x2="1134" y2="335" stroke="#eef0f7" stroke-width="8" marker-end="url(#mk-text)" data-at="2" data-fx="fade"/>
        ${[[1330, 450], [1630, 450], [1330, 578], [1630, 578]].map(([x, y], i) => `<g data-at="4@${0.5 + i * 0.1}" data-fx="pop">${h2o(x, y)}</g>`).join('')}
        <g data-at="6@0.1" data-fx="pop">${h2(1400, 694)}${h2(1560, 694)}</g>
        <g data-at="6@0.3" data-fx="fade">${ring(1400, 694, 56)}${ring(1560, 694, 56)}</g>
        <text x="1776" y="356" text-anchor="end" font-size="30" font-weight="900" class="f-warm" data-at="6@0.4" data-fx="fade">2 H₂ left over</text>
        <text x="440" y="826" text-anchor="middle" font-size="40" font-weight="900" data-at="8@0.3" data-fx="fade">Before: 12 H · <tspan class="f-teal">4 O</tspan></text>
        <text x="1480" y="826" text-anchor="middle" font-size="40" font-weight="900" data-at="9@0.1" data-fx="fade">After: 8 H + 4 H = 12 H · <tspan class="f-teal">4 O</tspan></text>
        <text x="960" y="838" text-anchor="middle" font-size="64" font-weight="900" class="f-good" data-at="9@0.8" data-fx="pop">=</text>
      </svg>
      <div class="x-step" style="top:410px" data-at="3" data-fx="pop">1 O<sub>2</sub> : 2 H<sub>2</sub></div>
      <div class="x-step" style="top:500px" data-at="4" data-fx="pop">2 O<sub>2</sub> + 4 H<sub>2</sub><br><span class="teal">→ 4 H<sub>2</sub>O</span></div>
      <div class="x-step warm" style="top:650px" data-at="5@0.5" data-fx="pop">6 − 4 = 2 H<sub>2</sub></div>
      <div class="banner" style="top:880px;padding:18px 40px" data-at="6" data-fx="pop">Rule 2: show the <span class="warm">excess reactant</span> in the after box</div>`,
  })

  // ---------- rule 3: dissolved ionic compounds are separate ions ----------
  const CLU = [[170, 190], [440, 190], [710, 190]]
  const MGT = [[170, 110], [450, 240], [720, 110]]
  const CLT = [[90, 270], [300, 90], [300, 280], [620, 290], [580, 100], [790, 260]]
  const miniClu = (x, y) => CL(x - 40, y, 0.6) + CL(x + 40, y, 0.6) + MG(x, y, 0.6)
  EZ.scene('ions', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Rule 3</div><h2 class="h1" data-at="1">Dissolved ionic compound <span class="teal">= separate ions</span></h2>
      <div class="card" style="left:120px;top:300px;width:880px;height:560px" data-at="2"><h3>3 MgCl<sub>2</sub> in water</h3>
        <svg style="position:absolute;left:0;top:96px" width="880" height="460" viewBox="0 0 880 460">
          <rect x="40" y="20" width="800" height="340" rx="26" fill="rgba(60,199,188,.08)" stroke="rgba(60,199,188,.45)" stroke-width="3"/>
          <g data-at="2@0.3" data-fx="fade">${CLT.map((_, i) => `<g class="ic${i}">${CL(0, 0)}</g>`).join('')}${MGT.map((_, i) => `<g class="ig${i}">${MG(0, 0)}</g>`).join('')}</g>
          <text x="440" y="420" text-anchor="middle" font-size="44" font-weight="900" data-at="4@0.3" data-fx="fade"><tspan class="f-warm">3 Mg²⁺</tspan> + <tspan class="f-good">6 Cl⁻</tspan></text>
        </svg></div>
      <div class="card" style="left:1060px;top:300px;width:740px;height:560px" data-at="5"><h3 class="bad">Not like this</h3>
        <svg style="position:absolute;left:0;top:96px" width="740" height="460" viewBox="0 0 740 460">
          <g data-at="5@0.15" data-fx="fade">${miniClu(130, 90)}${miniClu(290, 90)}${miniClu(450, 90)}
            <text x="290" y="180" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">3 MgCl₂ clusters</text></g>
          <g data-at="5@0.3" data-fx="pop">${CROSS(640, 92)}</g>
          <g data-at="5@0.5" data-fx="fade">${[90, 230, 370].map((x) => ball(x, 280, 30, 'gray', 'Mg', 22)).join('')}${[130, 270, 410].map((x) => ball(x - 18, 360, 24, 'green') + ball(x + 18, 360, 24, 'green')).join('')}
            <text x="290" y="428" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">Mg atoms + Cl₂ molecules</text></g>
          <g data-at="5@0.7" data-fx="pop">${CROSS(640, 320)}</g>
        </svg></div>
      <div class="banner" style="top:890px;padding:18px 40px" data-at="6" data-fx="pop">A “molecule” of NaCl in water <span class="bad">misrepresents</span> the solution</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, p = eio(c.seg(t0, t0 + 1.8))
      MGT.forEach(([tx, ty], i) => place(c.$('.ig' + i), lerp(CLU[i][0], tx, p), lerp(CLU[i][1], ty, p)))
      CLT.forEach(([tx, ty], j) => {
        const k = Math.floor(j / 2), [cx, cy] = CLU[k], sx = cx + (j % 2 ? 66 : -66)
        place(c.$('.ic' + j), lerp(sx, tx, p), lerp(cy, ty, p))
      })
    },
  })

  // ---------- drawing states ----------
  const GAS = [[80, 70], [290, 60], [190, 150], [70, 230], [300, 220]]
  const LIQ = [[60, 214], [104, 214], [148, 214], [192, 214], [236, 214], [280, 214], [324, 214], [82, 176], [126, 174], [170, 177], [214, 175], [258, 176], [302, 174], [104, 138], [150, 139], [196, 137], [240, 139], [284, 138]]
  const u = (a) => [Math.cos(a), Math.sin(a)]
  const waterAt = (cx, cy, r, a, cation) => {
    const [ux, uy] = u(a)
    if (cation) { // O toward the positive ion
      const ox = cx + ux * (r + 14), oy = cy + uy * (r + 14), [h1x, h1y] = u(a - 0.75), [h2x, h2y] = u(a + 0.75)
      return ball(ox + h1x * 16, oy + h1y * 16, 9, 'gray') + ball(ox + h2x * 16, oy + h2y * 16, 9, 'gray') + ball(ox, oy, 14, 'teal')
    }
    const hx = cx + ux * (r + 9), hy = cy + uy * (r + 9), ox = cx + ux * (r + 25), oy = cy + uy * (r + 25), [qx, qy] = u(a + 1.9)
    return ball(hx, hy, 9, 'gray') + ball(ox + qx * 16, oy + qy * 16, 9, 'gray') + ball(ox, oy, 14, 'teal')
  }
  const hyd = (cx, cy, r, n, cation, a0) => Array.from({ length: n }, (_, i) => waterAt(cx, cy, r, a0 + (i * 2 * Math.PI) / n, cation)).join('')
  const PPT = Array.from({ length: 15 }, (_, i) => [i % 5, Math.floor(i / 5)])
  const stCard = (i, at, title, svg, label) => `<div class="card x-st" style="left:${120 + i * 430}px" data-at="${at}"><div class="t">${title}</div>
      <svg width="390" height="300" viewBox="0 0 390 300">${svg}</svg><div class="lb">${label}</div></div>`
  EZ.scene('states', {
    html: `<div class="kicker" data-at="in" data-fx="left">Drawing states</div><h2 class="h1" data-at="0">Show states, as well as formulas</h2>
      ${stCard(0, '1', 'Gas', GAS.map((_, i) => `<g class="gs${i}">${o2(0, 0, 0.6)}</g>`).join(''), 'spread far apart')}
      ${stCard(1, '2', 'Liquid or solid', LIQ.map(([x, y]) => ball(x + 8, y + 40, 22, 'pur')).join(''), 'particles touching')}
      ${stCard(2, '3', 'Dissolved', `${hyd(115, 120, 26, 6, true, 0.3)}${MG(115, 120, 0.76)}${hyd(270, 190, 34, 6, false, 0.1)}${CL(270, 190, 0.74)}`, 'separate, hydrated ions')}
      ${stCard(3, '4', 'Precipitate', PPT.map(([cx, cy]) => ((cx + cy) % 2 ? CL(91 + cx * 52, 96 + cy * 52, 0.56) : MG(91 + cx * 52, 96 + cy * 52, 0.7))).join(''), 'a regular cluster of ions')}
      <div class="banner" style="top:850px;padding:18px 40px" data-at="5" data-fx="pop">Before you count, look at how the particles are <span class="teal">spread out</span></div>`,
    update(c) {
      GAS.forEach(([x, y], i) => place(c.$('.gs' + i), x + 10 * Math.sin(c.t * 0.8 + i * 2.1), y + 8 * Math.cos(c.t * 0.7 + i * 1.3)))
    },
  })

  // ---------- the trick: count atoms, not molecules ----------
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Count atoms, not molecules</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3>Molecules</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="440" viewBox="0 0 810 440">
          <g data-at="1@0.15" data-fx="fade">${h2(80, 110, 0.8)}${h2(190, 110, 0.8)}${o2(320, 110, 0.8)}
            <line x1="396" y1="110" x2="470" y2="110" stroke="#eef0f7" stroke-width="7" marker-end="url(#mk-text)"/>${h2o(570, 104, 0.8)}${h2o(710, 104, 0.8)}</g>
          <text x="200" y="220" text-anchor="middle" font-size="34" font-weight="900" class="f-muted" data-at="1@0.45" data-fx="fade">3 molecules in</text>
          <text x="640" y="220" text-anchor="middle" font-size="34" font-weight="900" class="f-muted" data-at="1@0.8" data-fx="fade">2 molecules out</text>
          <text x="405" y="356" text-anchor="middle" font-size="96" font-weight="900" class="f-warm" data-at="2" data-fx="pop">3 → 2</text>
        </svg>
        <div class="x-foot warm" data-at="2@0.4" data-fx="fade">can change</div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="3"><h3>Atoms of each element</h3>
        <svg style="position:absolute;left:0;top:96px" width="810" height="440" viewBox="0 0 810 440">
          <g data-at="3@0.15" data-fx="fade"><text x="60" y="124" font-size="40" font-weight="900" class="f-muted">Before</text>
            ${H(320, 110)}<text x="362" y="124" font-size="44" font-weight="900">× 4</text>${O(540, 110)}<text x="590" y="124" font-size="44" font-weight="900" class="f-teal">× 2</text></g>
          <g data-at="3@0.45" data-fx="fade"><text x="60" y="264" font-size="40" font-weight="900" class="f-muted">After</text>
            ${H(320, 250)}<text x="362" y="264" font-size="44" font-weight="900">× 4</text>${O(540, 250)}<text x="590" y="264" font-size="44" font-weight="900" class="f-teal">× 2</text></g>
          <text x="405" y="196" text-anchor="middle" font-size="56" font-weight="900" class="f-good" data-at="3@0.6" data-fx="pop">=</text>
        </svg>
        <div class="x-foot good" data-at="3@0.7" data-fx="fade">never changes</div></div>
      <div class="banner" style="top:870px;padding:18px 40px" data-at="4" data-fx="pop">Always check a diagram by counting <span class="good">atoms</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', '1 N<sub>2</sub> left'], ['B', '3 H<sub>2</sub> left'], ['C', '1 H<sub>2</sub> left'], ['D', 'Nothing is<br>left over']]
  const NX = [820, 920, 1020, 1120], HXS = Array.from({ length: 9 }, (_, j) => 1214 + j * 66)
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which reactant is <span class="teal">left over</span>, and how much?</h2>
      <div class="x-chx" style="left:120px;top:322px" data-at="1@0.45" data-fx="pop">N<sub>2</sub> + <span class="warm">3</span>H<sub>2</sub> → <span class="warm">2</span>NH<sub>3</sub></div>
      <div class="card" style="left:740px;top:290px;width:1060px;height:150px" data-at="1@0.15"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.2" data-fx="fade">${NX.map((x) => n2(x, 352, 0.5)).join('')}${HXS.map((x) => h2(x, 352, 0.5)).join('')}
          <text x="970" y="422" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">4 N₂</text><text x="1478" y="422" text-anchor="middle" font-size="28" font-weight="900" class="f-muted">9 H₂</text></g>
        <g data-at="5@0.45" data-fx="fade">${ring(1120, 352, 52)}</g>
      </svg>
      ${OPTS.map(([l, f], i) => `<div class="x-tile t${i}" style="left:${120 + i * 430}px" data-at="1@${0.55 + i * 0.1}" data-fx="pop"><div class="lt">${l}</div>
        ${i === 0 ? `<div class="ok">${CHECK}</div>` : ''}<div class="f${i === 3 ? ' sm' : ''}">${f}</div></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="800" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="800" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 800)"/>
        <text class="num" x="960" y="824" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="922" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-row" style="top:700px" data-at="4"><div class="n" style="background:${WARM}">1</div><div class="eq">9 H<sub>2</sub> needs 9 ÷ 3 = <span class="warm">3 N<sub>2</sub></span></div></div>
      <div class="x-row" style="top:830px" data-at="5"><div class="n" style="background:${TEAL}">2</div><div class="eq">4 − 3 = <span class="good">1 N<sub>2</sub> left over</span> <span class="muted">·</span> 6 NH<sub>3</sub> form</div></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 0) {
          el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''
          el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.5 * win})`
          c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})`
        } else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="64" text-anchor="middle" font-size="44" font-weight="900"><tspan class="f-warm">2</tspan>H₂ + O₂ → <tspan class="f-warm">2</tspan>H₂O</text>
    ${h2(40, 150, 0.5)}${h2(105, 150, 0.5)}${o2(180, 150, 0.5)}<line x1="228" y1="150" x2="272" y2="150" stroke="#eef0f7" stroke-width="5" marker-end="url(#mk-text)"/>${h2o(320, 146, 0.5)}${h2o(400, 146, 0.5)}</svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="84" text-anchor="middle" font-size="40" font-weight="900">4 H, <tspan class="f-teal">2 O</tspan> <tspan class="f-good">=</tspan> 4 H, <tspan class="f-teal">2 O</tspan></text>
    <text x="230" y="160" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">molecules: 3 → 2</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="60" y="14" width="340" height="182" rx="22" fill="rgba(255,255,255,.04)" stroke="#4a5068" stroke-width="3"/>
    ${h2o(150, 70, 0.6)}${h2o(310, 70, 0.6)}${h2(230, 150, 0.7)}${ring(230, 150, 50)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Equation ${ARR} picture:<br>coefficients =<br><span class="gold">molecule counts</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p><span class="teal">Atoms</span> are conserved.<br>The number of<br>molecules <span class="warm">may change</span>.</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>Show the<br><span class="warm">excess reactant</span><br>in the after picture</p></div>`,
  })
})()
