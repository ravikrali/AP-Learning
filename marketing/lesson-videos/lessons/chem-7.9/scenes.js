// Pictures for chem-7.9 "Le Châtelier's Principle". One EZ.scene per scene id in script.mjs.
// Everything shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): the N2 + 3H2 <=> 2NH3
// stress table, the Q = K/4 volume argument, catalysts and inert gases, dilution, heat as a reactant or
// product, the pink/blue cobalt equilibrium and the SO2 try question. Graphs and particle pictures carry
// no numbers: their heights and counts only show which way things move.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.12}
    .x-f>span{display:block;padding:0 .14em}
    .x-f>span+span{border-top:.07em solid currentColor}
    .x-line{position:absolute;white-space:nowrap;font-weight:900}
    .x-row{position:absolute;left:120px;width:1680px;height:110px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-row .L{position:absolute;left:30px;top:0;line-height:106px;font-size:30px;font-weight:900;color:var(--muted);white-space:nowrap;letter-spacing:.06em}
    .x-row .E{position:absolute;left:400px;top:0;line-height:106px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-row .D{position:absolute;right:34px;top:0;line-height:106px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-heat{display:inline-block;padding:0 18px;border-radius:18px;background:rgba(243,167,100,.2);border:2px solid rgba(243,167,100,.8);color:var(--warm);line-height:1.25}
    .x-note{position:absolute;left:1180px;width:620px;height:118px;padding:16px 22px 0 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-note i{position:absolute;left:22px;top:32px;width:46px;height:46px;border-radius:50%}
    .x-note b{display:block;font-size:34px;font-weight:900;line-height:1.15;white-space:nowrap} .x-note span{display:block;margin-top:4px;font-size:29px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-step{position:absolute;top:300px;width:480px;height:150px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);display:flex;align-items:center;justify-content:center;text-align:center;font-size:40px;font-weight:900;line-height:1.15}
    .x-sarr{position:absolute;top:346px;font-size:50px;font-weight:900;color:var(--muted)}
    .x-box{position:absolute;padding:20px 30px;border-radius:24px;background:rgba(36,40,56,.92);border:3px solid var(--line);font-size:40px;font-weight:900;line-height:1.25;white-space:nowrap}
    .x-tag{position:absolute;height:60px;padding:0 24px;border-radius:30px;font-size:32px;font-weight:900;line-height:56px;white-space:nowrap}
    .x-foot{position:absolute;left:0;right:0;text-align:center;font-size:40px;font-weight:900}
    .x-tab{width:100%;border-collapse:collapse;font-size:40px;font-weight:900}
    .x-tab td{padding:18px 40px;border-bottom:2px solid var(--line);white-space:nowrap}
    .x-tab tr:last-child td{border-bottom:none}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:40px;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px;opacity:0}
    .x-ans{position:absolute;left:120px;top:250px;width:1680px;height:600px;padding:34px 56px;font-size:48px;font-weight:700;line-height:1.5}
    .x-ans .lab{display:block;font-size:26px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:10px} .x-ans b{font-weight:900}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', MUT = '#a3abbd', GOOD = '#4cc781'
  const PINK = [240, 140, 184], BLUE = [79, 127, 240]
  const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], p))).join(',')})`
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const EQ = '<i class="x-eq"></i>'
  const N2 = 'N<sub>2</sub>', H2 = 'H<sub>2</sub>', NH3 = 'NH<sub>3</sub>'
  const HAB = `${N2} + 3${H2} ${EQ} 2${NH3}`
  const HABg = `${N2}(g) + 3${H2}(g) ${EQ} 2${NH3}(g)`
  const sb = (base, s) => `${base}<tspan dy="9" font-size=".64em">${s}</tspan><tspan dy="-9"> </tspan>`
  // SVG harpoon pair (equilibrium arrows), from the 7.6 intro
  const harp = (x, y, w, col, sw = 8) => `<path d="M${x} ${y} h${w} l-26 -20" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${x + w} ${y + 34} h${-w} l26 20" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
  // small gas molecules (not to scale): N2 purple pair, H2 small teal pair, NH3 warm N with three H
  const mN2 = (x, y) => `<g transform="translate(${x} ${y})">${ball(-13, 0, 17, 'pur')}${ball(13, 0, 17, 'pur')}</g>`
  const mH2 = (x, y) => `<g transform="translate(${x} ${y})">${ball(-9, 0, 11, 'teal')}${ball(9, 0, 11, 'teal')}</g>`
  const mNH3 = (x, y) => `<g transform="translate(${x} ${y})">${ball(-19, 12, 10, 'gray')}${ball(19, 12, 10, 'gray')}${ball(0, -20, 10, 'gray')}${ball(0, 2, 18, 'warm')}</g>`
  const mOf = { n: mN2, h: mH2, a: mNH3 }

  // ---------- intro artwork: faint equilibrium arrows at the left edge, a settling balance at the right ----------
  EZ.intro = {
    chips: [['1@0.5', 'Stress'], ['1@0.64', 'Shift'], ['1@0.82', 'Q and K']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      ${harp(70, 330, 210, TEAL)}${harp(70, 560, 210, WARM)}${harp(70, 790, 210, PRI)}
      <g transform="translate(1735 740)"><path d="M0 0 L-60 150 H60 Z" fill="${MUT}"/>
        <g class="x-ib"><line x1="-120" y1="0" x2="120" y2="0" stroke="${TXT}" stroke-width="10" stroke-linecap="round"/>
          <circle cx="-120" cy="40" r="34" fill="${GOLD}"/><circle cx="120" cy="40" r="34" fill="${TEAL}"/></g></g></svg>`,
    update(c) {
      const s = c.t - c.sc.start
      c.$('.x-ib').setAttribute('transform', `rotate(${14 * Math.exp(-0.7 * s) * Math.cos(s * 2.2)})`)
    },
  }

  // ---------- hook: push on it, it pushes back; making ammonia ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Push and it pushes back</div><h2 class="h1" data-at="0">A system at equilibrium</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0" data-fx="fade"><line x1="360" y1="560" x2="1560" y2="560" stroke="#363c54" stroke-width="6" stroke-linecap="round"/></g>
        <g class="x-blk"><g data-at="0" data-fx="pop"><rect x="-200" y="-110" width="400" height="200" rx="28" fill="#242838" stroke="${PRI}" stroke-width="4"/>
          <g transform="translate(-90 -40)">${harp(0, 0, 180, TXT, 9)}</g><text y="64" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">equilibrium</text></g></g>
        <g class="x-push"><line x1="-170" y1="0" x2="-30" y2="0" stroke="${WARM}" stroke-width="16" marker-end="url(#mk-warm)"/><text x="-110" y="-44" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">push</text></g>
        <g class="x-back"><line x1="170" y1="0" x2="30" y2="0" stroke="${TEAL}" stroke-width="16" marker-end="url(#mk-teal)"/><text x="140" y="-44" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">pushes back</text></g>
      </svg>
      <div class="x-tag" style="left:735px;top:620px;width:450px;text-align:center;background:rgba(141,141,240,.16);border:2px solid rgba(141,141,240,.7);color:var(--primary)" data-at="1" data-fx="pop">Le Châtelier’s principle</div>
      <div class="card" style="left:120px;top:730px;width:1680px;height:200px" data-at="2"><svg class="full" viewBox="0 0 1680 200" style="width:1680px;height:200px">
        <g data-at="2@0.4" data-fx="pop">${mN2(150, 100)}</g><text x="240" y="114" text-anchor="middle" font-size="46" font-weight="900" class="f-muted" data-at="2@0.5" data-fx="fade">+</text>
        <g data-at="2@0.6" data-fx="pop">${mH2(320, 100)}${mH2(400, 100)}${mH2(480, 100)}</g>
        <g data-at="2@0.1" data-fx="fade"><text x="150" y="176" text-anchor="middle" font-size="30" font-weight="800" class="f-pri">${sb('N', '2')}</text><text x="400" y="176" text-anchor="middle" font-size="30" font-weight="800" class="f-teal">${sb('H', '2')}</text></g>
        <g data-at="2@0.75" data-fx="fade"><line x1="560" y1="100" x2="700" y2="100" stroke="${TXT}" stroke-width="8" marker-end="url(#mk-text)"/></g>
        <g data-at="2@0.85" data-fx="pop">${mNH3(800, 104)}${mNH3(890, 104)}</g>
        <text x="845" y="176" text-anchor="middle" font-size="30" font-weight="800" class="f-warm" data-at="2@0.9" data-fx="fade">the most ${sb('NH', '3')}</text>
        <g data-at="3" data-fx="fade"><line x1="1000" y1="100" x2="1140" y2="100" stroke="${TXT}" stroke-width="8" marker-end="url(#mk-text)"/></g>
        <g data-at="3@0.2" data-fx="pop"><rect x="1180" y="50" width="400" height="100" rx="50" fill="rgba(76,199,129,.16)" stroke="${GOOD}" stroke-width="3"/>
          <text x="1380" y="114" text-anchor="middle" font-size="42" font-weight="900" class="f-good">fertilizer</text></g>
      </svg></div>`,
    update(c) {
      const b = c.b, t = c.t
      const p1 = eio(c.seg(b[0].start + 0.5, b[0].start + 1.1)), p2 = eio(c.seg(b[0].start + 1.6, b[0].start + 2.4))
      const x = 960 + 110 * p1 - 70 * p2
      c.$('.x-blk').setAttribute('transform', `translate(${x} 450)`)
      c.$('.x-push').setAttribute('transform', `translate(${x - 200 - 40 * (1 - c.seg(b[0].start + 0.2, b[0].start + 0.6))} 450)`)
      c.$('.x-push').style.opacity = c.seg(b[0].start + 0.2, b[0].start + 0.5)
      c.$('.x-back').setAttribute('transform', `translate(${x + 200 + 40 * (1 - c.seg(b[0].start + 1.3, b[0].start + 1.7))} 450)`)
      c.$('.x-back').style.opacity = c.seg(b[0].start + 1.3, b[0].start + 1.6)
    },
  })

  // ---------- the rule: stress -> shift -> new equilibrium; Q leaves K and comes back ----------
  EZ.scene('rule', {
    html: `<div class="kicker" data-at="in" data-fx="left">The rule</div><h2 class="h1" data-at="0">Le Châtelier’s principle</h2>
      <div class="x-step" style="left:120px;border-color:rgba(243,167,100,.8)" data-at="1@0.05" data-fx="pop"><span class="warm">A stress is<br>applied</span></div>
      <div class="x-sarr" style="left:622px" data-at="1@0.3" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:720px;border-color:rgba(60,199,188,.8)" data-at="1@0.35" data-fx="pop"><span class="teal">The system shifts<br>to counteract it</span></div>
      <div class="x-sarr" style="left:1222px" data-at="1@0.7" data-fx="fade">${ARR}</div>
      <div class="x-step" style="left:1320px;border-color:rgba(76,199,129,.8)" data-at="1@0.75" data-fx="pop"><span class="good">A new<br>equilibrium</span></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="fade">
        <line x1="360" y1="720" x2="1560" y2="720" stroke="#363c54" stroke-width="10" stroke-linecap="round"/>
        <line x1="1160" y1="680" x2="1160" y2="760" stroke="${TEAL}" stroke-width="8" stroke-linecap="round"/>
        <text x="1160" y="660" text-anchor="middle" font-size="46" font-weight="900" class="f-teal">K</text>
        <g class="x-q"><circle r="26" fill="${GOLD}"/><text y="84" text-anchor="middle" font-size="46" font-weight="900" class="f-gold">Q</text></g>
        <line class="x-qa" y1="620" y2="620" stroke="${GOLD}" stroke-width="8" marker-end="url(#mk-gold)"/>
        <text class="x-st" x="960" y="900" text-anchor="middle" font-size="46" font-weight="900"></text>
      </g></svg>`,
    update(c) {
      const b = c.b, t = c.t
      const away = eo(c.seg(b[2].start + 0.6, b[2].start + 1.0)), back = eio(c.seg(b[3].start + 0.5, b[3].start + 2.2))
      const x = 1160 - 520 * away + 520 * back
      c.$('.x-q').setAttribute('transform', `translate(${x} 720)`)
      const moving = t > b[3].start + 0.3 && back < 1
      c.$('.x-qa').style.opacity = moving ? 1 : 0
      c.$('.x-qa').setAttribute('x1', x + 10); c.$('.x-qa').setAttribute('x2', Math.min(x + 150, 1140))
      const st = c.$('.x-st')
      if (away < 1) { st.textContent = 'Q = K: at equilibrium'; st.setAttribute('class', 'x-st f-good') }
      else if (back < 1) { st.textContent = 'Q ≠ K: the reaction proceeds to bring Q back to K'; st.setAttribute('class', 'x-st f-gold') }
      else { st.textContent = 'Q = K again: a new equilibrium'; st.setAttribute('class', 'x-st f-good') }
    },
  })

  // ---------- concentration: add N2, remove NH3, and the concentration-time graph ----------
  const GX = (x) => 170 + x * 900, GY = (cv) => 940 - cv * 520
  const ex = (x, x0) => (x <= x0 ? 0 : 1 - Math.exp(-(x - x0) / 0.055))
  const J1 = 0.2, J2 = 0.58
  const cN = (x) => (x < J1 ? 0.4 : x < J2 ? 0.78 - 0.08 * ex(x, J1) : 0.7 - 0.06 * ex(x, J2))
  const cH = (x) => (x < J1 ? 0.86 : x < J2 ? 0.86 - 0.24 * ex(x, J1) : 0.62 - 0.18 * ex(x, J2))
  const cA = (x) => (x < J1 ? 0.18 : x < J2 ? 0.18 + 0.16 * ex(x, J1) : 0.1 + 0.12 * ex(x, J2))
  const gpath = (f) => { const p = []; for (let i = 0; i <= 1000; i++) { const x = i / 1000; p.push(`${GX(x).toFixed(1)} ${GY(f(x)).toFixed(1)}`) } return 'M' + p.join('L') }
  const xnote = (top, at, color, a, b2) => `<div class="x-note" style="top:${top}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b2}</span></div>`
  EZ.scene('conc', {
    html: `<div class="kicker" data-at="in" data-fx="left">Stress 1: concentration</div><h2 class="h1" data-at="0">Add a reactant, remove a product</h2>
      <div class="x-row" style="top:290px" data-at="0@0.2"><div class="L">EXOTHERMIC</div><div class="E">${HABg}</div><div class="D warm">ΔH &lt; 0</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="x-gclip"><rect class="x-gcr" x="160" y="400" width="0" height="560"/></clipPath></defs>
        <g data-at="0@0.6" data-fx="fade">
          <line x1="170" y1="440" x2="170" y2="940" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/><line x1="170" y1="940" x2="1080" y2="940" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/>
          <text x="625" y="990" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">time</text>
          <text transform="translate(130 690) rotate(-90)" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">concentration</text>
          <text x="186" y="${GY(0.86) - 16}" font-size="32" font-weight="900" class="f-teal">${sb('H', '2')}</text>
          <text x="186" y="${GY(0.4) - 16}" font-size="32" font-weight="900" class="f-pri">${sb('N', '2')}</text>
          <text x="186" y="${GY(0.18) - 16}" font-size="32" font-weight="900" class="f-warm">${sb('NH', '3')}</text>
        </g>
        <g clip-path="url(#x-gclip)" fill="none" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
          <path d="${gpath(cH)}" stroke="${TEAL}"/><path d="${gpath(cN)}" stroke="${PRI}"/><path d="${gpath(cA)}" stroke="${WARM}"/></g>
        <g data-at="4@0.5" data-fx="fade" data-out="5"><ellipse cx="${GX(J1)}" cy="${(GY(0.4) + GY(0.78)) / 2}" rx="40" ry="130" fill="none" stroke="${GOLD}" stroke-width="5" stroke-dasharray="14 10"/>
          <text x="${GX(J1) + 54}" y="${GY(0.4) + 8}" font-size="32" font-weight="900" class="f-gold">sudden jump</text></g>
        <g data-at="5@0.3" data-fx="fade"><rect x="${GX(J1) + 6}" y="440" width="${GX(0.55) - GX(J1) - 6}" height="500" fill="rgba(242,196,67,.08)"/>
          <text x="${GX(0.41)}" y="${GY(0.4) + 8}" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">adjust, then level off</text></g>
      </svg>
      ${xnote(440, '1', PRI, `Add ${N2}`, 'Q &lt; K: shifts right')}
      ${xnote(580, '3', WARM, `Remove ${NH3}`, 'Q &lt; K: shifts right')}
      ${xnote(720, '4', GOLD, 'On the graph', 'a jump, then all lines adjust')}`,
    update(c) {
      const b = c.b
      const head = c.t < b[1].start ? lerp(0, 0.17, c.seg(b[0].start + 1, b[0].end))
        : c.t < b[2].start ? lerp(0.17, 0.28, c.seg(b[1].start, b[1].end))
        : c.t < b[3].start ? lerp(0.28, 0.54, c.seg(b[2].start, b[2].end))
        : lerp(0.54, 1, c.seg(b[3].start, b[3].end + 0.4))
      c.$('.x-gcr').setAttribute('width', GX(head) - 160)
    },
  })

  // ---------- volume: squeeze the container, shift to fewer gas moles; Q = K/4 ----------
  const SLOTS = [[0.12, 0.15], [0.45, 0.08], [0.82, 0.16], [0.25, 0.45], [0.6, 0.38], [0.9, 0.5], [0.08, 0.78], [0.4, 0.72], [0.72, 0.8], [0.2, 0.98], [0.55, 0.98], [0.9, 0.95]]
  // [type, slot, role]: role 'go' fades out on the shift, 'new' fades in, '' stays
  const MOLS = [['n', 0, 'go'], ['n', 7, ''], ['h', 1, 'go'], ['h', 3, 'go'], ['h', 5, ''], ['h', 6, ''], ['h', 9, 'go'], ['h', 11, ''], ['a', 4, ''], ['a', 10, ''], ['a', 2, 'new'], ['a', 8, 'new']]
  EZ.scene('volume', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Stress 2: volume</div><h2 class="h1" data-at="0">Squeeze the container</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0" data-fx="fade">
        <path d="M160 300 V940 H720 V300" fill="rgba(141,141,240,.05)" stroke="#c9cee0" stroke-width="8" stroke-linejoin="round"/>
        ${MOLS.map(([k, , role], i) => `<g class="x-m${i}">${mOf[k](0, 0)}</g>`).join('')}
        <g class="x-pist"><rect x="166" y="0" width="548" height="26" rx="6" fill="#646c82"/><rect class="x-rod" x="425" y="0" width="30" height="0" fill="#646c82"/></g>
        <line class="x-parr" x1="800" x2="800" stroke="${WARM}" stroke-width="10" marker-end="url(#mk-warm)"/>
      </g>
      <text x="440" y="1000" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="0@0.7" data-fx="fade">volume ↓ &nbsp; pressure ↑</text></svg>
      <div data-at="in" data-out="3" data-fx="fade">
        <div class="x-line" style="left:880px;top:300px;font-size:54px" data-at="1">${HAB}</div>
        <div class="x-tag" style="left:880px;top:390px;background:rgba(141,141,240,.16);border:2px solid rgba(141,141,240,.7);color:var(--primary)" data-at="1@0.35" data-fx="pop">1 + 3 = 4 gas moles</div>
        <div class="x-tag" style="left:1250px;top:390px;background:rgba(243,167,100,.16);border:2px solid rgba(243,167,100,.7);color:var(--warm)" data-at="1@0.85" data-fx="pop">2 gas moles</div>
        <div class="x-box" style="left:880px;top:520px;border-color:rgba(60,199,188,.8)" data-at="2" data-fx="pop">Shift toward <span class="teal">fewer gas moles</span> ${ARR} <span class="teal">right</span></div>
      </div>
      <div data-at="3" data-fx="fade">
        <div class="x-line" style="left:880px;top:300px;font-size:44px">Halve V ${ARR} every concentration <span class="warm">× 2</span></div>
        <div class="x-line" style="left:880px;top:400px;font-size:64px" data-at="4">Q = <span class="x-f"><span>[${NH3}]<sup>2</sup></span><span>[${N2}][${H2}]<sup>3</sup></span></span></div>
        <div class="x-tag" style="left:1470px;top:396px;background:rgba(243,167,100,.16);border:2px solid rgba(243,167,100,.7);color:var(--warm)" data-at="4@0.3" data-fx="pop">top × 2<sup>2</sup> = 4</div>
        <div class="x-tag" style="left:1470px;top:496px;background:rgba(141,141,240,.16);border:2px solid rgba(141,141,240,.7);color:var(--primary)" data-at="4@0.65" data-fx="pop">bottom × 2<sup>4</sup> = 16</div>
        <div class="x-box" style="left:880px;top:640px;border-color:rgba(76,199,129,.8)" data-at="5" data-fx="pop">Q = ¼ K &nbsp;${ARR}&nbsp; Q &lt; K &nbsp;${ARR}&nbsp; <span class="good">forward</span></div>
        <div class="x-line muted" style="left:880px;top:810px;font-size:34px;font-weight:800" data-at="6">Same gas moles on each side ${ARR} factors cancel ${ARR} <span class="gold">no shift</span></div>
      </div>`,
    update(c) {
      const b = c.b, t = c.t
      const pc = eio(c.seg(b[0].start + 0.4, b[0].start + 2.0)), pY = lerp(320, 620, pc)
      c.$('.x-pist').setAttribute('transform', `translate(0 ${pY})`); c.$('.x-rod').setAttribute('y', 290 - pY); c.$('.x-rod').setAttribute('height', pY - 290)
      const ar = c.seg(b[0].start + 0.2, b[0].start + 0.5) * (1 - c.seg(b[0].start + 2.0, b[0].start + 2.4))
      c.$('.x-parr').style.opacity = ar; c.$('.x-parr').setAttribute('y1', pY - 80); c.$('.x-parr').setAttribute('y2', pY + 10)
      const top = pY + 26 + 34, bot = 940 - 34
      const sh = c.seg(b[2].start + 0.3, b[2].start + 1.3)
      MOLS.forEach(([, s, role], i) => {
        const [fx, fy] = SLOTS[s], el = c.$('.x-m' + i)
        el.setAttribute('transform', `translate(${200 + fx * 480} ${top + fy * (bot - top)})`)
        el.style.opacity = role === 'go' ? 1 - sh : role === 'new' ? sh : 1
      })
      void t
    },
  })

  // ---------- no shift: catalyst and inert gas ----------
  const bar = (x, h, col, lab) => `<rect x="${x}" y="${300 - h}" width="60" height="${h}" rx="8" fill="${col}"/><text x="${x + 30}" y="340" text-anchor="middle" font-size="28" font-weight="900" style="fill:${col}">${lab}</text>`
  EZ.scene('noshift', {
    html: `<div class="kicker" data-at="in" data-fx="left">No shift</div><h2 class="h1" data-at="0">Catalysts and inert gases</h2>
      <div class="card" style="left:120px;top:310px;width:810px;height:620px" data-at="1"><h3>A catalyst</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="360" viewBox="0 0 810 360">
          <text x="130" y="150" text-anchor="middle" font-size="36" font-weight="900" class="f-pri">reactants</text>
          <text x="680" y="150" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">products</text>
          <line x1="250" y1="100" x2="560" y2="100" stroke="${TEAL}" stroke-width="10" marker-end="url(#mk-teal)"/>
          <line x1="560" y1="180" x2="250" y2="180" stroke="${TEAL}" stroke-width="10" marker-end="url(#mk-teal)"/>
          <g class="x-dash" fill="none" stroke="#fff" stroke-width="10" stroke-dasharray="12 40" stroke-linecap="round" opacity=".7">
            <line class="x-d1" x1="250" y1="100" x2="540" y2="100"/><line class="x-d2" x1="560" y1="180" x2="270" y2="180"/></g>
          <text x="405" y="60" text-anchor="middle" font-size="30" font-weight="800" class="f-teal" data-at="1@0.2" data-fx="fade">forward: faster</text>
          <text x="405" y="236" text-anchor="middle" font-size="30" font-weight="800" class="f-teal" data-at="1@0.35" data-fx="fade">reverse: faster</text>
          <text x="405" y="320" text-anchor="middle" font-size="34" font-weight="900" data-at="1@0.45" data-fx="fade">both sped up <tspan class="f-gold">equally</tspan></text>
        </svg>
        <div class="x-foot" style="top:520px" data-at="1@0.75" data-fx="pop"><span class="muted">reaches equilibrium faster:</span> <span class="good">no shift</span></div></div>
      <div class="card" style="left:990px;top:310px;width:810px;height:620px" data-at="2"><h3>An inert gas, constant V</h3>
        <svg style="position:absolute;left:0;top:110px" width="810" height="400" viewBox="0 0 810 400">
          <rect x="40" y="20" width="360" height="320" rx="12" fill="rgba(141,141,240,.05)" stroke="#c9cee0" stroke-width="6"/>
          ${mN2(110, 80)}${mH2(250, 70)}${mH2(340, 150)}${mNH3(120, 210)}${mH2(200, 290)}${mNH3(320, 280)}${mN2(220, 170)}
          <g data-at="2@0.3" data-fx="pop">${ball(90, 140, 15, 'gray')}${ball(300, 220, 15, 'gray')}${ball(170, 250, 15, 'gray')}${ball(360, 60, 15, 'gray')}</g>
          <text x="220" y="386" text-anchor="middle" font-size="28" font-weight="800" class="f-muted" data-at="2@0.3" data-fx="fade">gray: the inert gas</text>
          ${bar(470, 120, PRI, sb('N', '2'))}${bar(570, 180, TEAL, sb('H', '2'))}${bar(670, 90, WARM, sb('NH', '3'))}
          <text x="600" y="60" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">partial pressures</text>
          <text x="600" y="100" text-anchor="middle" font-size="30" font-weight="900" class="f-gold" data-at="2@0.6" data-fx="fade">unchanged</text>
        </svg>
        <div class="x-foot" style="top:520px" data-at="2@0.8" data-fx="pop"><span class="muted">no partial pressure changes:</span> <span class="good">no shift</span></div></div>`,
    update(c) {
      const b = c.b, on = c.seg(b[1].start, b[1].start + 0.4) * (1 - c.seg(b[2].start, b[2].start + 0.6))
      c.$('.x-dash').style.opacity = 0.7 * on
      const off = -((c.t * 120) % 52)
      c.$('.x-d1').setAttribute('stroke-dashoffset', off); c.$('.x-d2').setAttribute('stroke-dashoffset', off)
    },
  })

  // ---------- dilution ----------
  const DOTS = [[0.15, 0.3, 'pur'], [0.4, 0.7, 'warm'], [0.7, 0.25, 'pur'], [0.85, 0.75, 'warm'], [0.3, 0.9, 'warm'], [0.55, 0.45, 'pur'], [0.1, 0.65, 'warm'], [0.75, 0.55, 'pur'], [0.48, 0.15, 'warm']]
  EZ.scene('dilute', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">In solution</div><h2 class="h1" data-at="0">Adding water</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0" data-fx="fade">
        <rect class="x-liq" x="186" width="508" fill="rgba(79,127,240,.22)"/>
        ${DOTS.map(([, , g], i) => `<g class="x-dot${i}">${ball(0, 0, 16, g)}</g>`).join('')}
        <path d="M180 330 V930 Q180 950 200 950 H680 Q700 950 700 930 V330" fill="none" stroke="#c9cee0" stroke-width="8" stroke-linejoin="round"/>
        <rect class="x-pour" x="425" y="300" width="30" fill="rgba(79,127,240,.55)"/>
        <text x="440" y="1010" text-anchor="middle" font-size="32" font-weight="900" class="f-muted" data-at="1@0.5" data-fx="fade">more water: lower concentrations</text>
      </g></svg>
      <div class="x-box" style="left:820px;top:320px;border-color:rgba(79,127,240,.8)" data-at="1" data-fx="pop">Add water ${ARR} <span class="teal">all dissolved concentrations ↓</span></div>
      <div class="x-box" style="left:820px;top:520px;width:430px;height:180px;white-space:normal;text-align:center;font-size:36px" data-at="2" data-fx="pop"><span class="muted">side with</span><br>fewer dissolved particles</div>
      <div class="x-box" style="left:1370px;top:520px;width:430px;height:180px;white-space:normal;text-align:center;font-size:36px;border-color:rgba(60,199,188,.9);background:rgba(60,199,188,.14)" data-at="2@0.3" data-fx="pop"><span class="muted">side with</span><br><span class="teal">more dissolved particles</span></div>
      <div class="x-line" style="left:1268px;top:574px;font-size:60px" data-at="2@0.15" data-fx="fade">${EQ}</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2@0.45" data-fx="fade"><line x1="1040" y1="770" x2="1560" y2="770" stroke="${TEAL}" stroke-width="12" marker-end="url(#mk-teal)"/>
        <text x="1300" y="840" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">the system shifts this way</text>
        <text x="1300" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">to partly make up for it</text></g></svg>`,
    update(c) {
      const b = c.b
      const pw = c.seg(b[1].start + 0.1, b[1].start + 2.0), lv = lerp(700, 440, eio(pw))
      c.$('.x-liq').setAttribute('y', lv); c.$('.x-liq').setAttribute('height', 946 - lv)
      const pour = pw > 0 && pw < 1
      c.$('.x-pour').style.opacity = pour ? 1 : 0; c.$('.x-pour').setAttribute('height', Math.max(0, lv - 300))
      DOTS.forEach(([fx, fy], i) => c.$('.x-dot' + i).setAttribute('transform', `translate(${220 + fx * 440} ${lv + 30 + fy * (920 - lv - 50)})`))
    },
  })

  // ---------- temperature: heat as reactant or product; only T changes K ----------
  const mini = (jump) => {
    const pts = (f) => Array.from({ length: 61 }, (_, i) => { const x = i / 60; return `${(20 + x * 300).toFixed(1)} ${(200 - f(x) * 170).toFixed(1)}` }).join('L')
    const g = (x) => (x < 0.35 ? 0 : 1 - Math.exp(-(x - 0.35) / 0.12))
    const a = jump ? (x) => (x < 0.35 ? 0.35 : 0.8 - 0.15 * g(x)) : (x) => 0.35 + 0.3 * g(x)
    const bb = jump ? (x) => 0.7 - 0.2 * g(x) : (x) => 0.75 - 0.25 * g(x)
    return `<svg width="340" height="220" viewBox="0 0 340 220"><path d="M20 10 V200 H330" fill="none" stroke="#c9cee0" stroke-width="4"/>
      <path d="M${pts(bb)}" fill="none" stroke="${TEAL}" stroke-width="6"/><path d="M${pts(a)}" fill="none" stroke="${PRI}" stroke-width="6"/></svg>`
  }
  EZ.scene('temp', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Temperature is the special one</h2>
      <div data-at="in" data-out="5" data-fx="fade">
        <div class="x-line" style="left:120px;top:300px;font-size:40px" data-at="1">Write <span class="x-heat">heat</span> into the equation</div>
        <div class="x-row" style="top:400px" data-at="2"><div class="L">EXOTHERMIC</div><div class="E">A ${EQ} B + <span class="x-heat x-h1">heat</span></div>
          <div class="D warm" data-at="3@0.4" data-fx="fade">add heat: shifts left</div></div>
        <div class="x-row" style="top:530px" data-at="2@0.5"><div class="L">ENDOTHERMIC</div><div class="E">A + <span class="x-heat x-h2">heat</span> ${EQ} B</div>
          <div class="D warm" data-at="3@0.6" data-fx="fade">add heat: shifts right</div></div>
        <div class="x-line" style="left:120px;top:672px;font-size:38px" data-at="3" data-fx="fade">Adding heat pushes <span class="warm">away from the heat side</span></div>
        <div class="x-row" style="top:770px;border:3px solid rgba(243,167,100,.75)" data-at="4"><div class="L">MAKING ${NH3}</div><div class="E">${HAB} + <span class="x-heat">heat</span></div>
          <div class="D warm" data-at="4@0.6" data-fx="pop">T ↑: shifts left</div></div>
      </div>
      <div class="card" style="left:120px;top:300px;width:810px;height:470px" data-at="5"><h3>Only <span class="gold">temperature</span> changes K</h3>
        <div style="position:absolute;left:0;right:0;top:110px"><table class="x-tab">
          <tr data-at="6@0.1" data-fx="fade"><td>Concentration</td><td class="muted">Q only</td></tr>
          <tr data-at="6@0.35" data-fx="fade"><td>Pressure, volume</td><td class="muted">Q only</td></tr>
          <tr data-at="5@0.3" data-fx="fade"><td class="gold">Temperature</td><td class="gold">K changes</td></tr></table></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:470px" data-at="8"><h3>On a graph</h3>
        <div style="position:absolute;left:40px;top:120px;text-align:center" data-at="8@0.1" data-fx="fade">${mini(true)}<div style="font-size:30px;font-weight:900" class="muted">add a reactant:<br>sudden jump</div></div>
        <div style="position:absolute;left:430px;top:120px;text-align:center" data-at="8@0.4" data-fx="fade">${mini(false)}<div style="font-size:30px;font-weight:900" class="gold">change T:<br>gradual drift</div></div></div>
      <div class="banner" style="top:820px" data-at="7" data-fx="pop">Exothermic: T ↑ ${ARR} <span class="gold">K ↓</span></div>`,
    update(c) {
      const b = c.b, on = c.t >= b[3].start && c.t < b[4].start
      const g = on ? 0.5 + 0.5 * Math.sin((c.t - b[3].start) * 6) : 0
      for (const k of ['.x-h1', '.x-h2']) c.$(k).style.boxShadow = `0 0 ${30 * g}px rgba(243,167,100,${0.8 * g})`
    },
  })

  // ---------- the cobalt colour equilibrium ----------
  const COL = `Co(${H2}O)<sub>6</sub><sup>2+</sup>(aq) + 4Cl<sup>−</sup>(aq) ${EQ} CoCl<sub>4</sub><sup>2−</sup>(aq) + 6${H2}O(l)`
  const flask = (i) => `<g transform="translate(0 0)"><path class="x-lq${i}" d="M-56 150 H56 L112 270 Q116 282 104 282 H-104 Q-116 282 -112 270 Z"/>
    <path d="M-34 0 V92 L-114 266 Q-122 286 -100 286 H100 Q122 286 114 266 L34 92 V0" fill="rgba(255,255,255,.04)" stroke="#c9cee0" stroke-width="7" stroke-linejoin="round"/>
    <line x1="-46" y1="0" x2="46" y2="0" stroke="#c9cee0" stroke-width="7" stroke-linecap="round"/></g>`
  const FX = [400, 960, 1520]
  EZ.scene('color', {
    html: `<div class="kicker" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="0">A color-change equilibrium</h2>
      <div class="x-row" style="top:290px" data-at="1"><div class="E" style="left:0;width:1680px;text-align:center;font-size:46px">${COL}</div></div>
      <div class="x-tag" style="left:380px;top:420px;background:rgba(240,140,184,.18);border:2px solid rgb(240,140,184);color:rgb(240,140,184)" data-at="2" data-fx="pop">left side: pink</div>
      <div class="x-tag" style="left:1280px;top:420px;background:rgba(79,127,240,.2);border:2px solid rgb(120,160,250);color:rgb(140,175,255)" data-at="2@0.3" data-fx="pop">right side: blue</div>
      <div class="x-tag" style="left:698px;top:420px;background:rgba(242,196,67,.14);border:2px solid rgba(242,196,67,.8);color:var(--gold)" data-at="2@0.65" data-fx="pop">forward reaction: endothermic</div>
      <svg class="full" viewBox="0 0 1920 1080">
        ${FX.map((x, i) => `<g data-at="${i + 3}" data-fx="fade"><g transform="translate(${x} 596)">${flask(i)}</g></g>`).join('')}
        <g data-at="3" data-fx="fade"><path d="M400 952 q-26 -30 0 -62 q8 26 22 30 q14 -18 4 -36 q30 30 -2 68 z" fill="${WARM}" opacity=".9"/></g>
        <g data-at="4@0.2" data-fx="pop"><circle cx="960" cy="660" r="11" fill="${TXT}"/><circle cx="960" cy="628" r="8" fill="${TXT}" opacity=".7"/></g>
        <g data-at="5" data-fx="fade">${[[1370, 830], [1670, 840], [1410, 880], [1630, 885]].map(([x, y]) => `<rect x="${x - 26}" y="${y - 26}" width="52" height="52" rx="10" fill="rgba(180,220,255,.35)" stroke="rgba(200,230,255,.8)" stroke-width="3"/>`).join('')}</g>
      </svg>
      <div class="x-line warm" style="left:250px;top:530px;width:300px;text-align:center;font-size:38px" data-at="3" data-fx="fade">heat</div>
      <div class="x-line" style="left:810px;top:530px;width:300px;text-align:center;font-size:38px;color:${TXT}" data-at="4" data-fx="fade">+ HCl</div>
      <div class="x-line teal" style="left:1370px;top:530px;width:300px;text-align:center;font-size:38px" data-at="5" data-fx="fade">ice bath</div>
      <div class="x-line" style="left:150px;top:960px;width:500px;text-align:center;font-size:32px" data-at="3@0.75" data-fx="fade">heat is a reactant ${ARR} <span style="color:rgb(140,175,255)">right, blue</span></div>
      <div class="x-line" style="left:710px;top:960px;width:500px;text-align:center;font-size:32px" data-at="4@0.7" data-fx="fade">adds Cl<sup>−</sup>, Q &lt; K ${ARR} <span style="color:rgb(140,175,255)">right, blue</span></div>
      <div class="x-line" style="left:1270px;top:960px;width:500px;text-align:center;font-size:32px" data-at="5@0.6" data-fx="fade">shifts left ${ARR} <span style="color:rgb(240,140,184)">pink</span></div>`,
    update(c) {
      const b = c.b
      c.$('.x-lq0').setAttribute('fill', mix(PINK, BLUE, eio(c.seg(b[3].start + 0.5 * (b[3].end - b[3].start), b[3].end))))
      c.$('.x-lq1').setAttribute('fill', mix(PINK, BLUE, eio(c.seg(b[4].start + 0.6 * (b[4].end - b[4].start), b[4].end))))
      c.$('.x-lq2').setAttribute('fill', mix(BLUE, PINK, eio(c.seg(b[5].start + 0.4 * (b[5].end - b[5].start), b[5].end))))
    },
  })

  // ---------- try it ----------
  const OPTS = [`right (toward SO<sub>3</sub>)`, `left (toward SO<sub>2</sub> + O<sub>2</sub>)`, 'not at all', 'right, and K increases']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which way does it <span class="teal">shift</span>?</h2>
      <div class="x-line" style="left:120px;top:272px;font-size:40px" data-at="1@0.05">2SO<sub>2</sub>(g) + O<sub>2</sub>(g) ${EQ} 2SO<sub>3</sub>(g) <span class="muted" style="font-size:34px;font-weight:800">&nbsp;· volume <b class="warm">increased</b>, constant T</span></div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${360 + Math.floor(i / 2) * 150}px" data-at="1@${0.62 + i * 0.09}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? `<div class="ok">${CHECK}</div>` : ''}<span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="800" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="800" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 800)"/>
        <text class="x-num" x="960" y="826" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="930" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:700px;font-size:44px" data-at="4" data-fx="pop">Bigger volume ${ARR} side with <span class="teal">more gas moles</span>: left 3, right 2</div>
      <div class="x-tag" style="left:760px;top:850px;width:400px;text-align:center;background:rgba(242,196,67,.14);border:2px solid rgba(242,196,67,.8);color:var(--gold)" data-at="5" data-fx="pop">K is unchanged</div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; const ok = c.$('.ok'); ok.style.opacity = win; ok.style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- free-response tip ----------
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="0">Explain with Q vs. K</h2>
      <div class="x-box" style="left:120px;top:300px;border-color:rgba(240,112,122,.8)" data-at="1@0.5" data-fx="pop"><span class="bad">✗</span> <span style="text-decoration:line-through;text-decoration-color:var(--bad);text-decoration-thickness:5px">“Le Châtelier says so”</span></div>
      <div class="x-box" style="left:1000px;top:300px;border-color:rgba(76,199,129,.8)" data-at="1@0.25" data-fx="pop"><span class="good">✓</span> Q vs. K, step by step</div>
      <div class="card x-ans" style="top:460px;height:440px" data-at="2-0.2"><span class="lab">Model answer</span>
        <span data-at="2@0.05" data-fx="fade">Adding N<sub>2</sub> increases the <b class="pri">denominator of Q</b>,</span>
        <span data-at="2@0.7" data-fx="fade"> so <b class="gold">Q &lt; K</b>.</span>
        <span data-at="3" data-fx="fade"> The reaction proceeds in the <b class="teal">forward direction</b>,</span>
        <span data-at="3@0.3" data-fx="fade"> consuming N<sub>2</sub> and H<sub>2</sub> and producing NH<sub>3</sub>,</span>
        <span data-at="3@0.75" data-fx="fade"> until <b class="good">Q = K</b> again.</span></div>`,
  })

  // ---------- recap ----------
  const r1 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900" text-anchor="middle">
    <line x1="30" y1="100" x2="410" y2="100" stroke="#363c54" stroke-width="8" stroke-linecap="round"/>
    <line x1="320" y1="68" x2="320" y2="132" stroke="${TEAL}" stroke-width="7" stroke-linecap="round"/><text x="320" y="52" font-size="40" style="fill:${TEAL}">K</text>
    <circle cx="110" cy="100" r="20" fill="${GOLD}"/><text x="110" y="160" font-size="38" style="fill:${GOLD}">Q</text>
    <line x1="140" y1="60" x2="290" y2="60" stroke="${GOLD}" stroke-width="7" marker-end="url(#mk-gold)"/></svg>`
  const r2 = `<svg width="440" height="170" viewBox="0 0 440 170">
    <path d="M110 30 V150 H330 V30" fill="none" stroke="#c9cee0" stroke-width="6"/><rect x="114" y="70" width="212" height="14" rx="4" fill="#646c82"/>
    <line x1="220" y1="10" x2="220" y2="60" stroke="${WARM}" stroke-width="8" marker-end="url(#mk-warm)"/>
    ${mN2(160, 118)}${mNH3(220, 120)}${mNH3(285, 120)}</svg>`
  const r3 = `<svg width="440" height="170" viewBox="0 0 440 170" font-weight="900">
    <rect x="130" y="14" width="34" height="110" rx="17" fill="none" stroke="#c9cee0" stroke-width="6"/><rect x="141" y="50" width="12" height="80" fill="${WARM}"/><circle cx="147" cy="136" r="26" fill="${WARM}"/>
    <text x="210" y="80" font-size="40" style="fill:${GOLD}">→ K</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>A stress ${ARR} the system<br>shifts to counteract it,<br>so <span class="gold">Q returns to K</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Volume ↓ ${ARR} toward<br><span class="pri">fewer gas moles</span><br>Catalysts, inert gases:<br><span class="good">no shift</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Only <span class="gold">temperature</span><br>changes K</p></div>`,
  })
  void clamp
})()
