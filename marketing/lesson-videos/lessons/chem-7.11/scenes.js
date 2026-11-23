// Pictures for chem-7.11 "Solubility Equilibria (Ksp)". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): AgCl
// (Ksp 1.8 x 10^-10, s = 1.3 x 10^-5 M), Ag2CrO4 (s = 6.5 x 10^-5 M, Ksp 1.1 x 10^-12), the precipitate
// check (0.0010 M -> 0.00050 M, Q = 2.5 x 10^-7), the AgCl / AgBr / AgI quick check and the CaF2 try
// question (Ksp 3.9 x 10^-11, s = 2.1 x 10^-4 M). Ion sizes are in the right order, not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:48px;font-weight:900;white-space:nowrap}
    .x-note{position:absolute;left:960px;width:840px;height:120px;padding:18px 26px 0 96px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-note i{position:absolute;left:26px;top:32px;width:50px;height:50px;border-radius:50%}
    .x-note b{display:block;font-size:38px;font-weight:900;line-height:1.15;white-space:nowrap} .x-note span{display:block;font-size:28px;font-weight:700;color:var(--muted);white-space:nowrap}
    .x-big{position:absolute;left:960px;top:780px;width:840px;height:150px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line);text-align:center;font-size:46px;font-weight:900;line-height:144px;white-space:nowrap}
    .x-blk{position:absolute;left:120px;width:1680px;height:220px}
    .x-blk .E{position:absolute;left:44px;top:30px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-blk .K{position:absolute;left:44px;top:118px;font-size:58px;font-weight:900;white-space:nowrap}
    .x-blk svg{position:absolute;left:1120px;top:0}
    .x-hl{border-radius:10px;padding:0 4px;transition:none}
    .x-tag{position:absolute;height:60px;padding:0 22px;border-radius:30px;font-size:32px;font-weight:900;line-height:56px;white-space:nowrap}
    .x-tag.r{background:rgba(240,112,122,.16);border:2px solid rgba(240,112,122,.75);color:var(--bad)}
    .x-th{position:absolute;top:372px;font-size:26px;font-weight:900;letter-spacing:.12em;color:var(--muted)}
    .x-row{position:absolute;left:120px;width:1680px;height:130px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-row>div{position:absolute;top:0;line-height:126px;font-weight:900;white-space:nowrap}
    .x-row .T{left:34px;font-size:54px} .x-row .X{left:240px;font-size:46px} .x-row svg{position:absolute;left:500px;top:0}
    .x-row .I{left:760px;font-size:44px} .x-row .S{right:34px;font-size:50px}
    .x-steps{position:absolute;padding:30px 44px}
    .x-steps .s{position:absolute;left:44px;font-size:46px;font-weight:900;white-space:nowrap}
    .x-steps .lab{position:absolute;left:44px;top:28px;font-size:26px;font-weight:900;letter-spacing:.14em;color:var(--muted)}
    .x-res{position:absolute;left:44px;right:44px;height:120px;border-radius:24px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;line-height:114px;font-size:56px;font-weight:900;white-space:nowrap}
    .x-tr{position:absolute;left:40px;right:40px;height:84px;border-radius:20px;font-size:46px;font-weight:900;line-height:84px;white-space:nowrap}
    .x-tr .k{position:absolute;right:24px} .x-tr .f{position:absolute;left:24px}
    .x-ic{display:inline-block;width:46px;height:46px;vertical-align:-8px;margin-left:12px}
    .x-pr{position:absolute;left:120px;width:1680px;height:100px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-pr .L{position:absolute;left:28px;top:0;line-height:96px;font-size:30px;font-weight:900;color:var(--muted);letter-spacing:.06em;white-space:nowrap}
    .x-pr .E{position:absolute;left:300px;top:0;line-height:96px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-pr .D{position:absolute;right:34px;top:0;line-height:96px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:560px;width:1680px;height:360px;border-radius:30px;background:rgba(36,40,56,.92);border:3px solid rgba(76,199,129,.8)}
    .x-ans .ok{position:absolute;left:44px;top:44px;width:84px;height:84px}
    .x-ans .A{position:absolute;left:156px;top:30px;font-size:96px;font-weight:900;white-space:nowrap}
    .x-ans .W{position:absolute;left:60px;font-size:46px;font-weight:800;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:590px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:10px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', BAD = '#f0707a'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const CROSS = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#f0707a"/><path d="M21 21l22 22M43 21L21 43" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round"/></svg>'
  const EQ = '<i class="x-eq"></i>'
  const KSP = 'K<sub>sp</sub>'
  const AG = 'Ag<sup>+</sup>', CL = 'Cl<sup>−</sup>', CA = 'Ca<sup>2+</sup>', FL = 'F<sup>−</sup>'
  const CAF2 = 'CaF<sub>2</sub>', AG2CRO4 = 'Ag<sub>2</sub>CrO<sub>4</sub>', CRO4 = 'CrO<sub>4</sub><sup>2−</sup>'
  const sci = (m, e) => `${m} × 10<sup>${e}</sup>`
  // SVG labels for balls
  const sAg = sup('Ag', '+'), sCl = sup('Cl', '−'), sCa = sup('Ca', '2+'), sF = sup('F', '−')
  const sCrO4 = 'CrO<tspan dy="7" font-size=".62em">4</tspan><tspan dy="-19" font-size=".62em">2−</tspan>'
  const ag = (x, y, r = 30) => ball(x, y, r, 'gray', sAg, r * 0.72)
  const cl = (x, y, r = 40) => ball(x, y, r, 'teal', sCl, r * 0.62)
  const ca = (x, y, r = 32) => ball(x, y, r, 'warm', sCa, r * 0.62)
  const fl = (x, y, r = 38) => ball(x, y, r, 'teal', sF, r * 0.7)
  const cro4 = (x, y, r = 54) => ball(x, y, r, 'gold', sCrO4, 25)

  // a beaker outline with its water: x0..x1 wide, top..bot tall, water from wy down
  const beaker = (x0, x1, top, bot, wy, cls = '') => `<path d="M${x0} ${top} V${bot - 30} Q${x0} ${bot} ${x0 + 30} ${bot} H${x1 - 30} Q${x1} ${bot} ${x1} ${bot - 30} V${top}" fill="none" stroke="#c9cee0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <rect class="${cls}" x="${x0 + 6}" y="${wy}" width="${x1 - x0 - 12}" height="${bot - wy - 6}" rx="22" fill="rgba(60,199,188,.13)"/>`

  // ---------- intro artwork: a faint beaker on the left edge, faint Ksp forms on the right ----------
  EZ.intro = {
    chips: [['1@0.4', `Write ${KSP}`], ['1@0.62', 'Molar solubility'], ['1@0.84', 'Compare salts']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${beaker(60, 330, 160, 420, 230)}
      <g class="x-ia">${[[110, 300, 1], [200, 270, 0], [270, 340, 1], [150, 370, 0]].map(([x, y, a], i) => `<g class="x-ii${i}" data-x="${x}" data-y="${y}">${a ? ball(0, 0, 22, 'teal', '−', 30) : ball(0, 0, 16, 'warm', '+', 24)}</g>`).join('')}</g>
      <g font-weight="900" text-anchor="middle">
        <text x="1740" y="250" font-size="92" style="fill:${TEAL}">K<tspan dy="22" font-size="52">sp</tspan></text>
        <text x="1740" y="390" font-size="76" style="fill:${WARM}">s<tspan dy="-32" font-size="44">2</tspan><tspan dy="32" style="fill:${PRI}"> · 4s</tspan><tspan dy="-32" font-size="44" style="fill:${PRI}">3</tspan></text>
      </g>
      <g>${Array.from({ length: 9 }, (_, i) => (i % 2 ? ball(260 + i * 60, 900, 22, 'teal') : ball(260 + i * 60, 900, 16, 'warm'))).join('')}
        ${Array.from({ length: 9 }, (_, i) => (i % 2 ? ball(1180 + i * 60, 900, 16, 'warm') : ball(1180 + i * 60, 900, 22, 'teal'))).join('')}</g></svg>`,
    update(c) {
      const t = c.t - c.sc.start
      for (let i = 0; i < 4; i++) {
        const g = c.$('.x-ii' + i), x = +g.dataset.x, y = +g.dataset.y
        g.setAttribute('transform', `translate(${x + 10 * Math.sin(t * 1.2 + i * 1.7)} ${y + 8 * Math.cos(t * 1.0 + i)})`)
      }
    },
  }

  // ---------- hook: a slightly soluble salt in water ----------
  const SOLID = []
  for (let row = 0; row < 3; row++) for (let k = 0; k < 12 - row; k++) SOLID.push([254 + row * 22 + k * 44, 892 - row * 40, (k + row) % 2])
  // ions: home spot in the water, when they appear, and (for the extra ones) where they settle back on the solid
  const IONS = [
    { a: 1, h: [320, 520], t: '2@0.05', from: [320, 812] }, { a: 0, h: [520, 610], t: '2@0.2', from: [518, 812] },
    { a: 1, h: [690, 500], t: '2@0.35', from: [694, 812] }, { a: 0, h: [430, 700], t: '2@0.5', from: [430, 812] },
    { a: 0, h: [270, 640], t: '3@0.02', land: [408, 772] }, { a: 1, h: [400, 470], t: '3@0.08', land: [452, 772] },
    { a: 0, h: [610, 700], t: '3@0.14', land: [496, 772] }, { a: 1, h: [740, 620], t: '3@0.2', land: [540, 772] },
    { a: 0, h: [580, 480], t: '3@0.26', land: [584, 772] }, { a: 1, h: [340, 740], t: '3@0.32', land: [628, 772] },
  ]
  const ion = (a) => (a ? ball(0, 0, 21, 'teal', '−', 30) : ball(0, 0, 15, 'warm', '+', 24))
  const note = (top, at, color, a, b) => `<div class="x-note" style="top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="0">Slightly soluble salts</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.3" data-fx="fade">${beaker(200, 820, 330, 930, 420)}
        ${SOLID.map(([x, y, a]) => (a ? ball(x, y, 21, 'teal') : ball(x, y, 15, 'warm'))).join('')}</g>
        ${IONS.map((_, i) => `<g class="x-i${i}" style="opacity:0">${ion(IONS[i].a)}</g>`).join('')}
        <text x="510" y="990" text-anchor="middle" font-size="32" font-weight="800" class="f-muted" data-at="1" data-fx="fade">the solid sits at the bottom</text></svg>
      ${note(330, '1', GOLD, 'Slightly soluble salt', 'kidney stones: calcium oxalate')}
      ${note(470, '2', TEAL, 'A little dissolves', 'the solid breaks into ions')}
      ${note(610, '3', BAD, 'Ions too concentrated?', 'the solid precipitates')}
      <div class="x-big muted" data-at="4" data-out="5" data-fx="pop">How much can dissolve?</div>
      <div class="x-big" style="border-color:rgba(60,199,188,.8)" data-at="5" data-fx="pop"><span class="teal">${KSP}</span> tells you exactly</div>`,
    update(c) {
      const t = c.t, tp = c.at('3@0.6')
      IONS.forEach((o, i) => {
        const g = c.$('.x-i' + i), t0 = c.at(o.t)
        if (t < t0) { g.style.opacity = 0; return }
        const wob = [8 * Math.sin(t * 1.3 + i * 1.9), 8 * Math.cos(t * 1.1 + i * 2.3)]
        let x, y, s = 1, w = 1
        if (o.from) { const p = eio(c.seg(t0, t0 + 1.2)); x = lerp(o.from[0], o.h[0], p); y = lerp(o.from[1], o.h[1], p); w = p }
        else {
          s = 0.5 + 0.5 * eo(c.seg(t0, t0 + 0.35))
          const p = eio(c.seg(tp + i * 0.06, tp + 1.1 + i * 0.06)); x = lerp(o.h[0], o.land[0], p); y = lerp(o.h[1], o.land[1], p); w = 1 - p
        }
        g.style.opacity = 1
        g.setAttribute('transform', `translate(${x + wob[0] * w} ${y + wob[1] * w}) scale(${s})`)
      })
    },
  })

  // ---------- Ksp: writing the expression ----------
  EZ.scene('ksp', {
    html: `<div class="kicker" data-at="in" data-fx="left">The solubility product</div><h2 class="h1" data-at="0">Dissolving is an equilibrium</h2>
      <div class="x-line muted" style="top:282px;font-size:36px;font-weight:800" data-at="1">Saturated solution: the solid is at equilibrium with its ions</div>
      <div class="card x-blk" style="top:352px" data-at="2">
        <div class="E">AgCl<span class="x-hl x-s1">(s)</span> ${EQ} ${AG}(aq) + ${CL}(aq)</div>
        <div class="K" data-at="3" data-fx="fade"><span class="teal">${KSP}</span> = [${AG}][${CL}]</div>
        <div class="x-tag r" style="left:760px;top:132px" data-at="7@0.2" data-fx="pop">no solid</div>
        <svg width="540" height="220"><g class="x-p1a">${ag(0, 0, 32)}</g><g class="x-p1b">${cl(0, 0, 42)}</g></svg></div>
      <div class="card x-blk" style="top:600px" data-at="4">
        <div class="E">${CAF2}<span class="x-hl x-s2">(s)</span> ${EQ} ${CA}(aq) + <span class="x-hl x-c2">2</span>${FL}(aq)</div>
        <div class="K" data-at="5" data-fx="fade"><span class="teal">${KSP}</span> = [${CA}][${FL}]<sup class="x-hl x-e2">2</sup></div>
        <div class="x-tag r" style="left:760px;top:132px" data-at="7@0.4" data-fx="pop">no solid</div>
        <svg width="540" height="220"><g class="x-p2a">${fl(0, 0)}</g><g class="x-p2b">${ca(0, 0)}</g><g class="x-p2c">${fl(0, 0)}</g></svg></div>
      <div class="banner" style="top:856px;font-size:42px" data-at="8" data-fx="pop"><span class="teal">${KSP} &gt; 1</span> ${ARR} soluble salts, like Na<sup>+</sup>, K<sup>+</sup>, NH<sub>4</sub><sup>+</sup> and NO<sub>3</sub><sup>−</sup> salts</div>`,
    update(c) {
      const b = c.b, t = c.t
      const p1 = eio(c.seg(c.at('2@0.45'), c.at('2@0.45') + 1.1)), p2 = eio(c.seg(c.at('4@0.45'), c.at('4@0.45') + 1.1))
      c.$('.x-p1a').setAttribute('transform', `translate(${lerp(233, 130, p1)} 110)`)
      c.$('.x-p1b').setAttribute('transform', `translate(${lerp(307, 420, p1)} 110)`)
      c.$('.x-p2a').setAttribute('transform', `translate(${lerp(200, 300, p2)} ${lerp(110, 62, p2)})`)
      c.$('.x-p2b').setAttribute('transform', `translate(${lerp(270, 110, p2)} 110)`)
      c.$('.x-p2c').setAttribute('transform', `translate(${lerp(340, 440, p2)} ${lerp(110, 158, p2)})`)
      const on6 = t >= b[6].start && t < b[7].start, on7 = t >= b[7].start && t < b[8].start
      for (const q of ['.x-c2', '.x-e2']) { const e = c.$(q); e.style.color = on6 ? GOLD : ''; e.style.background = on6 ? 'rgba(242,196,67,.22)' : 'transparent' }
      for (const q of ['.x-s1', '.x-s2']) { const e = c.$(q); e.style.color = on7 ? BAD : ''; e.style.background = on7 ? 'rgba(240,112,122,.2)' : 'transparent' }
    },
  })

  // ---------- molar solubility table ----------
  const ROWS = [
    ['A<span class="teal">B</span>', 'AgCl', [0, 1], `[${AG}] = s, [${CL}] = s`, 's<sup>2</sup>', 3],
    ['A<span class="teal">B</span><sub class="teal">2</sub>', CAF2, [0, 1, 1], `[${CA}] = s, [${FL}] = 2s`, 's(2s)<sup>2</sup> = <span class="gold">4s<sup>3</sup></span>', 4],
    ['A<sub>2</sub><span class="teal">B</span>', AG2CRO4, [0, 0, 1], `[${AG}] = 2s, [${CRO4}] = s`, '(2s)<sup>2</sup>s = <span class="gold">4s<sup>3</sup></span>', 5],
  ]
  const icons = (list) => list.map((a, i) => (a ? ball(40 + i * 66, 65, 26, 'teal') : ball(40 + i * 66, 65, 19, 'warm'))).join('')
  EZ.scene('molar', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Molar solubility</div><h2 class="h1" data-at="0">Ions in terms of <span class="teal">s</span></h2>
      <div class="x-line" style="top:276px;font-size:44px;text-align:left;left:120px" data-at="1"><span class="teal">s</span> = moles of salt that dissolve per liter (M)</div>
      <div class="x-th" style="left:154px" data-at="2" data-fx="fade">TYPE</div><div class="x-th" style="left:360px" data-at="2" data-fx="fade">EXAMPLE</div>
      <div class="x-th" style="left:880px" data-at="2" data-fx="fade">EACH ION</div><div class="x-th" style="left:1640px" data-at="2" data-fx="fade">${KSP}</div>
      ${ROWS.map(([ty, ex, ic, io, ks, beat], i) => `<div class="x-row x-r${i}" style="top:${420 + i * 150}px" data-at="${beat}">
        <div class="T">${ty}</div><div class="X">${ex}</div><svg width="220" height="130">${icons(ic)}</svg>
        <div class="I" data-at="${beat}@0.35" data-fx="fade">${io}</div><div class="S" data-at="${beat}@0.7" data-fx="pop">${ks}</div></div>`).join('')}`,
    update(c) {
      const b = c.b
      for (let i = 0; i < 3; i++) {
        const on = c.t >= b[3 + i].start && (i === 2 || c.t < b[4 + i].start)
        c.$('.x-r' + i).style.borderColor = on ? 'rgba(60,199,188,.8)' : ''
      }
    },
  })

  // ---------- example: AgCl, Ksp -> s (the square: side s, area Ksp) ----------
  EZ.scene('agcl', {
    html: `<div class="kicker" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">Solubility of AgCl</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="pop"><rect x="240" y="340" width="420" height="420" rx="10" fill="rgba(141,141,240,.18)" stroke="${PRI}" stroke-width="6"/>
          <text x="450" y="574" text-anchor="middle" font-size="64" font-weight="900">s<tspan dy="-26" font-size="38">2</tspan><tspan dy="26"> = K</tspan><tspan dy="14" font-size="38">sp</tspan></text></g>
        <g data-at="2@0.3" data-fx="fade"><text x="450" y="830" text-anchor="middle" font-size="44" font-weight="900" class="f-warm">s</text>
          <text x="450" y="874" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">[Ag<tspan dy="-12" font-size=".62em">+</tspan><tspan dy="12">]</tspan></text>
          <text x="196" y="560" text-anchor="middle" font-size="44" font-weight="900" class="f-teal">s</text>
          <text x="196" y="604" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">[Cl<tspan dy="-12" font-size=".62em">−</tspan><tspan dy="12">]</tspan></text></g>
        <g data-at="3@0.2" data-fx="fade"><line x1="240" y1="782" x2="660" y2="782" stroke="${GOLD}" stroke-width="8" marker-start="url(#mk-gold)" marker-end="url(#mk-gold)"/></g>
      </svg>
      <div class="card x-steps" style="left:820px;top:330px;width:980px;height:580px" data-at="1"><div class="lab">FIND THE MOLAR SOLUBILITY</div>
        <div class="s" style="top:96px">${KSP} = ${sci('1.8', '−10')}</div>
        <div class="s" style="top:196px" data-at="2" data-fx="fade">AB salt: <span class="teal">${KSP} = s<sup>2</sup></span></div>
        <div class="s" style="top:296px" data-at="3" data-fx="fade">s = √(${sci('1.8', '−10')})</div>
        <div class="x-res" style="top:420px" data-at="4@0.3" data-fx="pop">s = <span class="good">${sci('1.3', '−5')} M</span></div></div>`,
  })

  // ---------- example: Ag2CrO4, s -> Ksp ----------
  EZ.scene('chromate', {
    html: `<div class="kicker" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">${KSP} from solubility</h2>
      <div class="card" style="left:120px;top:300px;width:640px;height:620px" data-at="1"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="440" y="370" text-anchor="middle" font-size="44" font-weight="900" data-at="1@0.2" data-out="2@0.05" data-fx="fade">Ag<tspan dy="12" font-size=".62em">2</tspan><tspan dy="-12">CrO</tspan><tspan dy="12" font-size=".62em">4</tspan><tspan dy="-12" font-size=".7em" class="f-muted"> (one unit)</tspan></text>
        <g data-at="1@0.2" data-fx="fade"><g class="x-u1">${ag(0, 0, 34)}</g><g class="x-u2">${cro4(0, 0)}</g><g class="x-u3">${ag(0, 0, 34)}</g></g>
        <g data-at="2@0.55" data-fx="fade"><text x="270" y="690" text-anchor="middle" font-size="64" font-weight="900" class="f-pri">2s</text>
          <text x="270" y="736" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">two Ag<tspan dy="-12" font-size=".62em">+</tspan></text></g>
        <g data-at="3@0.2" data-fx="fade"><text x="600" y="690" text-anchor="middle" font-size="64" font-weight="900" class="f-gold">s</text>
          <text x="600" y="736" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">one CrO<tspan dy="8" font-size=".62em">4</tspan><tspan dy="-20" font-size=".62em">2−</tspan></text></g>
      </svg>
      <div class="card x-steps" style="left:820px;top:300px;width:980px;height:620px" data-at="1"><div class="lab">GIVEN</div>
        <div class="s" style="top:80px">s = ${sci('6.5', '−5')} M</div>
        <div class="s" style="top:180px" data-at="2@0.3" data-fx="fade">[${AG}] = <span class="pri">2s</span> = ${sci('1.3', '−4')} M</div>
        <div class="s" style="top:270px" data-at="3" data-fx="fade">[${CRO4}] = <span class="gold">s</span> = ${sci('6.5', '−5')} M</div>
        <div class="s" style="top:370px" data-at="4" data-fx="fade">${KSP} = (2s)<sup>2</sup>(s) = <span class="teal">4s<sup>3</sup></span></div>
        <div class="x-res" style="top:470px;font-size:50px" data-at="5" data-fx="pop">${KSP} = <span class="good">${sci('1.1', '−12')}</span></div></div>`,
    update(c) {
      const p = eio(c.seg(c.at('2@0.1'), c.at('2@0.1') + 1.2))
      c.$('.x-u1').setAttribute('transform', `translate(${lerp(352, 270, p)} ${lerp(470, 450, p)})`)
      c.$('.x-u2').setAttribute('transform', `translate(${lerp(440, 600, p)} ${lerp(470, 500, p)})`)
      c.$('.x-u3').setAttribute('transform', `translate(${lerp(528, 270, p)} ${lerp(470, 550, p)})`)
    },
  })

  // ---------- will a precipitate form? ----------
  const SPECK = Array.from({ length: 12 }, (_, i) => [330 + ((i * 97) % 380), 720 + ((i * 53) % 120), 360 + (i % 6) * 64 + (i > 5 ? 32 : 0), i > 5 ? 900 : 918])
  EZ.scene('precip', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Will it precipitate?</div><h2 class="h1" data-at="0">Compare Q with ${KSP}</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><g class="x-bA">${beaker(-110, 110, 0, 170, 50)}<text y="222" text-anchor="middle" font-size="36" font-weight="900">AgNO<tspan dy="10" font-size=".62em">3</tspan></text><text y="264" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">0.0010 M</text></g></g>
        <g data-at="2@0.3" data-fx="fade"><g class="x-bB">${beaker(-110, 110, 0, 170, 50)}<text y="222" text-anchor="middle" font-size="36" font-weight="900">NaCl</text><text y="264" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">0.0010 M</text></g></g>
        <g data-at="2@0.6" data-fx="fade">${beaker(290, 800, 600, 940, 940, 'x-water')}</g>
        <text x="545" y="680" text-anchor="middle" font-size="36" font-weight="900" class="f-teal" data-at="3@0.6" data-fx="fade">each ion: 0.00050 M</text>
        ${SPECK.map((_, i) => `<g class="x-sp${i}" style="opacity:0">${ball(0, 0, 13, 'gray')}</g>`).join('')}
        <text x="545" y="980" text-anchor="middle" font-size="34" font-weight="900" class="f-bad" data-at="5@0.75" data-fx="fade">AgCl(s) forms</text>
      </svg>
      <div class="card x-steps" style="left:1000px;top:300px;width:800px;height:620px" data-at="1"><div class="lab">ION PRODUCT Q</div>
        <div class="s" style="top:84px;font-size:40px" data-at="3@0.4" data-fx="fade">[${AG}] = [${CL}] = 0.00050 M</div>
        <div class="s" style="top:170px;font-size:40px" data-at="4" data-fx="fade">Q = (0.00050)(0.00050)</div>
        <div class="s" style="top:240px;font-size:40px" data-at="4@0.4" data-fx="fade">&nbsp;&nbsp;= <span class="warm">${sci('2.5', '−7')}</span></div>
        <div class="s" style="top:340px;font-size:40px" data-at="5" data-fx="fade">Q &gt; ${KSP} = ${sci('1.8', '−10')}</div>
        <div class="x-res" style="top:410px;height:96px;line-height:90px;font-size:40px;background:rgba(240,112,122,.14);border-color:var(--bad)" data-at="5@0.5" data-fx="pop"><span class="bad">AgCl precipitates</span></div>
        <div class="s muted" style="top:530px;font-size:38px" data-at="6" data-fx="fade">Q &lt; ${KSP} ${ARR} no precipitate</div></div>`,
    update(c) {
      const t3 = c.at('3'), p = eio(c.seg(t3, t3 + 0.8)), tilt = 115 * eio(c.seg(t3 + 0.3, t3 + 1.0))
      c.$('.x-bA').setAttribute('transform', `translate(${lerp(320, 400, p)} ${lerp(300, 490, p)}) rotate(${tilt})`)
      c.$('.x-bB').setAttribute('transform', `translate(${lerp(770, 690, p)} ${lerp(300, 490, p)}) rotate(${-tilt})`)
      c.$('.x-bA').style.opacity = 1 - c.seg(t3 + 1.5, t3 + 2.0)
      c.$('.x-bB').style.opacity = 1 - c.seg(t3 + 1.5, t3 + 2.0)
      const lab = 1 - c.seg(t3, t3 + 0.3)
      for (const e of c.root.querySelectorAll('.x-bA text, .x-bB text')) e.style.opacity = lab
      const lvl = lerp(940, 720, eio(c.seg(c.at('3') + 0.8, c.at('3') + 1.9)))
      const w = c.$('.x-water'); w.setAttribute('y', lvl); w.setAttribute('height', Math.max(0, 940 - lvl - 6))
      const t0 = c.at('5@0.3')
      SPECK.forEach(([x, y, lx, ly], i) => {
        const g = c.$('.x-sp' + i), a = t0 + i * 0.08
        g.style.opacity = c.seg(a, a + 0.3)
        const q = eio(c.seg(a + 0.3, a + 1.4))
        g.setAttribute('transform', `translate(${lerp(x, lx, q)} ${lerp(y, ly, q)})`)
      })
    },
  })

  // ---------- the trap: compare Ksp only for the same type ----------
  const TR = [['AgCl', '1.8', '−10'], ['AgBr', '5.0', '−13'], ['AgI', '8.3', '−17']]
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="1">Compare ${KSP} only for the same type</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:600px" data-at="2"><h3>Same type (AB)<span class="x-ic">${CHECK}</span></h3>
        ${TR.map(([f, m, e], i) => `<div class="x-tr x-t${i}" style="top:${130 + i * 100}px" data-at="2@${0.12 + i * 0.12}" data-fx="fade"><span class="f">${f}</span><span class="k muted">${sci(m, e)}</span></div>`).join('')}
        <div class="x-res" style="top:450px;height:100px;line-height:94px;font-size:40px" data-at="2@0.75" data-fx="pop">largest ${KSP} ${ARR} <span class="good">AgCl most soluble</span></div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:600px" data-at="3"><h3>Different types<span class="x-ic">${CROSS}</span></h3>
        <div class="x-tr" style="top:130px"><span class="f">AgCl</span><span class="k teal">${KSP} = s<sup>2</sup></span></div>
        <div class="x-tr" style="top:230px" data-at="3@0.45" data-fx="fade"><span class="f">${AG2CRO4}</span><span class="k gold">${KSP} = 4s<sup>3</sup></span></div>
        <div class="x-res" style="top:450px;height:100px;line-height:94px;font-size:42px;background:rgba(243,167,100,.14);border-color:var(--warm)" data-at="4" data-fx="pop"><span class="warm">Calculate s for each!</span></div></div>`,
    update(c) {
      const on = c.t >= c.at('2@0.75')
      c.$('.x-t0').style.background = on ? 'rgba(76,199,129,.16)' : 'transparent'
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is the molar solubility?</h2>
      <div class="x-pr" style="top:300px" data-at="1@0.15" data-fx="pop"><div class="L">GIVEN</div><div class="E">${CAF2}(s) ${EQ} ${CA}(aq) + 2${FL}(aq)</div><div class="D">${KSP} = ${sci('3.9', '−11')}</div></div>
      <div class="x-pr" style="top:420px;border:3px solid rgba(242,196,67,.75)" data-at="1@0.6" data-fx="pop"><div class="L gold">FIND</div><div class="E">molar solubility, s</div><div class="D gold"><span data-at="in" data-fx="fade" data-out="3">s = ?</span></div></div>
      <div class="x-pr" style="top:420px;background:none;border:none" data-at="3@0.3" data-fx="pop"><div class="D good">s = ${sci('2.1', '−4')} M</div></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="700" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="700" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 700)"/>
        <text class="x-num" x="960" y="726" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="830" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><div class="ok">${CHECK}</div><div class="A good">${sci('2.1', '−4')} M</div>
        <div class="W" style="top:180px" data-at="4" data-fx="fade">AB<sub>2</sub> salt ${ARR} <span class="teal">${KSP} = 4s<sup>3</sup></span></div>
        <div class="W" style="top:258px" data-at="5" data-fx="fade">s = ∛(${sci('3.9', '−11')} / 4) = <span class="good">${sci('2.1', '−4')} M</span></div></div>`,
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
  const r1 = `<svg width="440" height="170" viewBox="0 0 440 170">${ca(90, 85, 34)}<path d="M150 85 h60" stroke="#c9cee0" stroke-width="6" marker-end="url(#mk-text)"/>${fl(290, 55, 36)}${fl(370, 115, 36)}</svg>`
  const r2 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <rect x="40" y="40" width="100" height="100" rx="6" fill="rgba(60,199,188,.2)" stroke="${TEAL}" stroke-width="5"/><text x="90" y="104" font-size="44" style="fill:${TEAL}">s<tspan dy="-18" font-size="28">2</tspan></text>
    <text x="310" y="112" font-size="70" style="fill:${GOLD}">4s<tspan dy="-30" font-size="42">3</tspan></text></svg>`
  const r3 = `<svg width="440" height="170" viewBox="0 0 440 170">${ball(60, 85, 20, 'gray')}${ball(110, 85, 28, 'teal')}<text x="220" y="104" text-anchor="middle" font-size="60" font-weight="900" class="f-bad">≠</text>${ball(300, 85, 20, 'gray')}${ball(340, 85, 30, 'gold')}${ball(380, 85, 20, 'gray')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="teal">${KSP}</span> = product of<br>the ion concentrations,<br>each to its coefficient.<br><span class="bad">No solid.</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>AB: <span class="teal">${KSP} = s<sup>2</sup></span><br>AB<sub>2</sub> or A<sub>2</sub>B:<br><span class="gold">${KSP} = 4s<sup>3</sup></span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Compare ${KSP} directly<br>only for salts with<br>the <span class="warm">same ion ratio</span></p></div>`,
  })
  void clamp; void WARM
})()
