// Pictures for chem-7.8 "Particle Diagrams of Equilibrium". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u7.ts and chem/book.ts): the 2 A2 /
// 2 B2 / 8 AB box at 0.10 M per particle (K = 16), the 3 X / 9 Y box (K = 3), the 4 / 4 / 4 box
// (Q = 1 < 16), atoms conserved in every frame, and the try question (2, 5, 7, 7, 7).
// Molecules are drawn as two shaded balls; sizes are not to scale.
(() => {
  const { eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-f{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 .12em;line-height:1.12}
    .x-f>span{display:block;padding:0 .14em}
    .x-f>span+span{border-top:.07em solid currentColor}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:48px;font-weight:900;white-space:nowrap}
    .x-t{position:absolute;font-size:46px;font-weight:900;white-space:nowrap}
    .x-tag{position:absolute;height:64px;padding:0 26px;border-radius:32px;font-size:32px;font-weight:900;line-height:60px;white-space:nowrap}
    .x-tag.g{background:rgba(242,196,67,.14);border:2px solid rgba(242,196,67,.7);color:var(--gold)}
    .x-tag.k{background:rgba(60,199,188,.14);border:2px solid rgba(60,199,188,.7);color:var(--accent)}
    .x-tag.m{background:rgba(255,255,255,.06);border:2px solid var(--line);color:var(--muted)}
    .x-q{position:absolute;left:820px;width:980px;height:136px;border-radius:28px;background:rgba(36,40,56,.92);border:3px solid var(--line);padding-left:120px;font-size:54px;font-weight:900;line-height:130px;white-space:nowrap}
    .x-q i{position:absolute;left:30px;top:30px;width:70px;height:70px;border-radius:50%;background:var(--brand);font-style:normal;font-size:44px;line-height:70px;text-align:center}
    .x-tb{position:absolute;left:760px;top:470px;border-collapse:collapse;font-size:44px;font-weight:900}
    .x-tb td{padding:6px 22px;white-space:nowrap}
    .x-tb td:first-child{width:130px}
    .x-tb .c{color:var(--muted)}
    .x-stamp{position:absolute;left:160px;top:530px;width:460px;text-align:center}
    .x-stamp span{display:inline-block;padding:10px 28px;border:5px solid var(--bad);border-radius:18px;background:rgba(14,16,24,.85);color:var(--bad);font-size:44px;font-weight:900;transform:rotate(-8deg);white-space:nowrap}
    .x-fl{position:absolute;width:340px;text-align:center;font-weight:900;white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:118px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:36px;font-weight:800;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:25px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:23px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', BAD = '#f0707a', GOOD = '#4cc781'
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const EQ = '<i class="x-eq"></i>'
  const A2 = 'A<sub>2</sub>', B2 = 'B<sub>2</sub>'
  const fr = (top, bot, style = '') => `<span class="x-f" style="${style}"><span>${top}</span><span>${bot}</span></span>`
  const RXN = `${A2}(g) + ${B2}(g) ${EQ} 2AB(g)`

  // ---------- molecules and boxes ----------
  const KIND = { A2: ['teal', 'A', 'teal', 'A'], B2: ['warm', 'B', 'warm', 'B'], AB: ['teal', 'A', 'warm', 'B'] }
  const mol = (x, y, k, r = 20, rot = 0) => {
    const [c1, l1, c2, l2] = KIND[k], d = r * 0.86
    return `<g transform="translate(${x} ${y}) rotate(${rot})">${ball(-d, 0, r, c1, l1)}${ball(d, 0, r, c2, l2)}</g>`
  }
  const ROT = [-20, 15, 0, 25, -10, 30, -25, 10, 5, -15, 20, -30]
  const JIT = [[0.1, -0.12], [-0.14, 0.08], [0.06, 0.14], [-0.08, -0.1], [0.12, 0.06], [-0.1, 0.12], [0.14, -0.06], [0, 0.1], [-0.12, -0.14], [0.08, 0.1], [-0.06, -0.08], [0.1, 0]]
  const PERM = [0, 4, 8, 5, 9, 1, 10, 2, 6, 3, 7, 11]
  /** positions of 12 slots in a box (3 columns x 4 rows, a little scattered) */
  const slots = (x, y, w, h) => Array.from({ length: 12 }, (_, i) => {
    const cw = w / 3, ch = h / 4, col = i % 3, row = Math.floor(i / 3)
    return [x + cw * (col + 0.5) + JIT[i][0] * cw, y + ch * (row + 0.5) + JIT[i][1] * ch]
  })
  /** 12 molecules: a A2, b B2, ab AB, mixed through the box */
  const kinds = (a, b, ab) => { const l = [...Array(a).fill('A2'), ...Array(b).fill('B2'), ...Array(ab).fill('AB')]; return PERM.map((p) => l[p]) }
  const boxR = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="rgba(26,29,42,.8)" stroke="#4a5170" stroke-width="4"/>`
  const box = (x, y, s, ks, r, cls = '') => boxR(x, y, s, s) + slots(x + 10, y + 10, s - 20, s - 20).map(([px, py], i) => `<g class="${cls ? cls + i : ''}">${mol(px.toFixed(1), py.toFixed(1), ks[i], r, ROT[i])}</g>`).join('')

  // ---------- intro artwork: faint molecules at the left and right edges ----------
  const edge = [[150, 280, 'A2', -20], [100, 660, 'B2', 10], [330, 680, 'AB', 25], [250, 850, 'AB', -30], [1770, 280, 'AB', 15], [1820, 660, 'A2', 30], [1590, 680, 'B2', -25], [1670, 850, 'AB', -10]]
  EZ.intro = {
    chips: [['1@0.5', 'Count'], ['1@0.62', 'Find K'], ['1@0.78', 'Q vs. K']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22"><g class="x-ia">${edge.map(([x, y, k, r]) => mol(x, y, k, 34, r)).join('')}</g></svg>`,
    update(c) {
      c.$('.x-ia').setAttribute('transform', `translate(0 ${8 * Math.sin((c.t - c.sc.start) * 0.9)})`)
    },
  }

  // ---------- hook: a box of molecules, two questions ----------
  const HOOK = kinds(4, 4, 4)
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">On the exam</div><h2 class="h1" data-at="0">A box of molecules</h2>
      <div class="x-tag m" style="left:820px;top:320px" data-at="0@0.4" data-fx="pop">No concentrations given</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="pop">${box(160, 310, 540, HOOK, 26, 'x-hj')}</g></svg>
      <div class="x-q" style="top:430px" data-at="2@0.3" data-fx="pop"><i>1</i>What is <span class="teal">K</span>?</div>
      <div class="x-q" style="top:600px" data-at="2@0.65" data-fx="pop"><i>2</i>Is it at <span class="gold">equilibrium</span> yet?</div>
      <div class="x-line" style="top:900px;font-size:54px" data-at="4" data-fx="pop">Count the particles ${ARR} <span class="teal">numbers</span></div>`,
    update(c) {
      const a = 6 * (1 - c.seg(c.b[4].start, c.b[4].start + 1.2)), t = c.t
      for (let i = 0; i < 12; i++) c.$('.x-hj' + i).setAttribute('transform', `translate(${(a * Math.sin(t * 1.3 + i)).toFixed(2)} ${(a * Math.cos(t * 1.1 + i * 1.7)).toFixed(2)})`)
    },
  })

  // ---------- same volume: count is proportional to concentration ----------
  const dots = (x, y, s, pts) => boxR(x, y, s, s) + pts.map(([px, py]) => ball(x + px * s, y + py * s, 30, 'pur')).join('')
  const P3 = [[0.28, 0.3], [0.7, 0.42], [0.38, 0.74]]
  const P6 = [[0.22, 0.22], [0.62, 0.18], [0.82, 0.5], [0.42, 0.5], [0.2, 0.78], [0.66, 0.8]]
  EZ.scene('volume', {
    html: `<div class="kicker" data-at="in" data-fx="left">Key idea</div><h2 class="h1" data-at="0">Same box, same volume</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="pop">${dots(300, 320, 400, P3)}</g>
        <g data-at="1@0.3" data-fx="pop">${dots(1220, 320, 400, P6)}</g>
        <g data-at="1@0.5" data-fx="fade"><line x1="740" y1="430" x2="1180" y2="430" stroke="${PRI}" stroke-width="5" marker-start="url(#mk-pri)" marker-end="url(#mk-pri)"/>
          <text x="960" y="400" text-anchor="middle" font-size="40" font-weight="900" class="f-pri">same volume</text></g>
        <g data-at="3" data-fx="fade"><line x1="760" y1="590" x2="1170" y2="590" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/>
          <text x="960" y="560" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">× 2 particles</text>
          <text x="960" y="650" text-anchor="middle" font-size="40" font-weight="900" class="f-teal">× 2 concentration</text></g>
      </svg>
      <div class="x-t" style="left:300px;width:400px;text-align:center;top:740px;font-size:38px" data-at="1" data-fx="fade">3 particles</div>
      <div class="x-t" style="left:1220px;width:400px;text-align:center;top:740px;font-size:38px" data-at="1@0.3" data-fx="fade">6 particles</div>
      <div class="x-line" style="top:818px;font-size:46px" data-at="2" data-fx="fade">Particle count is <span class="gold">proportional</span> to concentration</div>
      <div class="banner" style="top:896px;font-size:42px" data-at="4" data-fx="pop">1 particle = a fixed concentration ${ARR} counts stand in for concentrations</div>`,
  })

  // ---------- from picture to K: the 2 / 2 / 8 box ----------
  const EQB = kinds(2, 2, 8)
  EZ.scene('convert', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Count and calculate</div><h2 class="h1" data-at="0">From picture to K</h2>
      <div class="x-line" style="left:60px;width:660px;top:296px;font-size:44px" data-at="1">${RXN}</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="pop">${box(140, 380, 520, EQB, 24)}</g></svg>
      <div class="x-tag g" style="left:760px;top:300px" data-at="3" data-fx="pop">each particle = 0.10 M</div>
      <table class="x-tb">
        <tr data-at="2@0.2" data-fx="fade"><td>${A2}</td><td class="c">2 particles</td><td data-at="4@0.25" data-fx="fade">${ARR} 0.20 M</td></tr>
        <tr data-at="2@0.4" data-fx="fade"><td>${B2}</td><td class="c">2 particles</td><td data-at="4@0.5" data-fx="fade">${ARR} 0.20 M</td></tr>
        <tr data-at="2@0.6" data-fx="fade"><td>AB</td><td class="c">8 particles</td><td data-at="4@0.75" data-fx="fade">${ARR} 0.80 M</td></tr>
      </table>
      <div class="x-t" style="left:760px;top:700px" data-at="5">K = ${fr('[AB]<sup>2</sup>', `[${A2}][${B2}]`)}
        <span data-at="6" data-fx="fade">= ${fr('(0.80)<sup>2</sup>', '(0.20)(0.20)')}</span>
        <span data-at="7" data-fx="pop">= <span class="gold" style="font-size:64px">16</span></span></div>
      <div class="x-t teal" style="left:760px;top:890px;font-size:42px" data-at="8" data-fx="fade">K &gt; 1 ${ARR} mostly product</div>`,
  })

  // ---------- shortcut: equal exponent totals, raw counts give K ----------
  const XY = [...'XXX', ...'YYYYYYYYY']
  const XYP = [[0.2, 0.18], [0.55, 0.6], [0.82, 0.86], [0.5, 0.17], [0.82, 0.22], [0.2, 0.5], [0.5, 0.38], [0.84, 0.54], [0.2, 0.84], [0.5, 0.86], [0.32, 0.66], [0.68, 0.4]]
  EZ.scene('cancel', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="0">When the volume cancels</h2>
      <div class="card" style="left:120px;top:296px;width:900px;height:560px" data-at="0@0.5"><h3>${RXN}</h3></div>
      <div class="x-t" style="left:200px;top:410px;font-size:60px" data-at="0@0.6" data-fx="fade">K = ${fr('[AB]<sup class="gold">2</sup>', `[${A2}]<sup class="gold">1</sup>[${B2}]<sup class="gold">1</sup>`)}</div>
      <div class="x-t" style="left:660px;top:405px;font-size:36px" data-at="1@0.25" data-fx="fade">top: <span class="gold">2</span></div>
      <div class="x-t" style="left:660px;top:490px;font-size:36px" data-at="1@0.6" data-fx="fade">bottom: <span class="gold">1 + 1 = 2</span></div>
      <div class="x-tag k" style="left:200px;top:610px" data-at="2" data-fx="pop">same total ${ARR} volume cancels</div>
      <div class="x-t" style="left:200px;top:712px;font-size:46px" data-at="3">raw counts: <span data-at="4" data-fx="fade">${fr('8<sup>2</sup>', '2 × 2')} = ${fr('64', '4')} = <span class="gold">16</span></span></div>
      <div class="card" style="left:1080px;top:296px;width:720px;height:560px" data-at="5"><h3>X(g) ${EQ} Y(g)</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="5@0.4" data-fx="pop">${boxR(1140, 400, 300, 300)}${XY.map((l, i) => ball(1140 + 300 * XYP[i][0], 400 + 300 * XYP[i][1], 24, l === 'X' ? 'pur' : 'gold', l)).join('')}</g></svg>
      <div class="x-t" style="left:1480px;top:440px;font-size:42px" data-at="5@0.6" data-fx="fade"><span class="pri">3 X</span></div>
      <div class="x-t" style="left:1480px;top:520px;font-size:42px" data-at="5@0.8" data-fx="fade"><span class="gold">9 Y</span></div>
      <div class="x-t" style="left:1140px;top:730px;font-size:46px" data-at="6">K = ${fr('[Y]', '[X]')} = ${fr('9', '3')} = <span class="gold">3</span></div>
      <div class="banner" style="top:890px;font-size:38px;background:rgba(243,167,100,.14);border-color:rgba(243,167,100,.7)" data-at="7" data-fx="pop">Different numbers of gas particles on each side ${ARR} use the <span class="warm">actual concentrations</span></div>`,
  })

  // ---------- is this box at equilibrium? 4 / 4 / 4, Q = 1 < K = 16 ----------
  EZ.scene('qbox', {
    html: `<div class="kicker" data-at="in" data-fx="left">Q vs. K</div><h2 class="h1" data-at="0">Is this box at equilibrium?</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="pop">${box(140, 320, 520, HOOK, 24)}</g></svg>
      <div class="x-t" style="left:760px;top:310px;font-size:44px" data-at="1">${RXN} &nbsp;<span class="muted">·</span>&nbsp; <span class="gold">K = 16</span></div>
      <div class="x-t" style="left:760px;top:400px;font-size:42px" data-at="2@0.3" data-fx="fade">4 ${A2} &nbsp;·&nbsp; 4 ${B2} &nbsp;·&nbsp; 4 AB</div>
      <div class="x-tag k" style="left:760px;top:480px" data-at="3" data-fx="pop">exponent totals match ${ARR} use the counts</div>
      <div class="x-t" style="left:760px;top:580px;font-size:54px" data-at="4">Q = ${fr('4<sup>2</sup>', '4 × 4')} = <span class="teal">1</span></div>
      <div class="x-t" style="left:760px;top:760px;font-size:54px" data-at="5"><span class="teal">Q = 1</span> &lt; <span class="gold">K = 16</span></div>
      <div class="x-stamp" data-at="6" data-fx="pop"><span>NOT at equilibrium</span></div>
      <div class="banner" style="top:880px;font-size:46px" data-at="7" data-fx="pop">Proceeds <span class="teal">forward</span>, forming more AB, until Q = 16</div>`,
  })

  // ---------- frame by frame: atoms conserved, counts stop changing ----------
  const FX = [120, 566, 1012, 1458], FS = 340, FY = 300
  const FR = [kinds(4, 4, 4), kinds(3, 3, 6), kinds(2, 2, 8), kinds(2, 2, 8)]
  const CNT = ['4 · 4 · 4', '3 · 3 · 6', '2 · 2 · 8', '2 · 2 · 8']
  const AT = ['0@0.15', '3', '4', '6']
  const s0 = slots(FX[0] + 10, FY + 10, FS - 20, FS - 20)
  const iA = FR[0].indexOf('A2'), iB = FR[0].indexOf('B2')
  EZ.scene('frames', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Frame by frame</div><h2 class="h1" data-at="0">Atoms are conserved</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${FR.map((k, f) => `<g data-at="${AT[f]}" data-fx="pop">${box(FX[f], FY, FS, k, 17)}</g>`).join('')}
        ${[0, 1, 2].map((f) => `<g data-at="${AT[f + 1]}-0.2" data-fx="fade"><line x1="${FX[f] + FS + 18}" y1="${FY + FS / 2}" x2="${FX[f + 1] - 18}" y2="${FY + FS / 2}" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></g>`).join('')}
        <g data-at="2" data-fx="fade" data-out="3"><circle cx="${s0[iA][0]}" cy="${s0[iA][1]}" r="44" fill="none" stroke="${GOLD}" stroke-width="6"/><circle cx="${s0[iB][0]}" cy="${s0[iB][1]}" r="44" fill="none" stroke="${GOLD}" stroke-width="6"/></g>
      </svg>
      ${FR.map((_, f) => `<div class="x-fl" style="left:${FX[f]}px;top:660px;font-size:38px" data-at="${f ? AT[f] + '@0.2' : '0@0.3'}" data-fx="fade">${CNT[f]}</div>
        <div class="x-fl muted" style="left:${FX[f]}px;top:712px;font-size:28px" data-at="${f ? AT[f] + '@0.4' : '1@0.3'}" data-fx="fade">12 A atoms · 12 B atoms</div>`).join('')}
      <div class="x-fl muted" style="left:120px;top:258px;width:1680px;font-size:26px;text-align:left" data-at="0@0.4" data-fx="fade">counts: ${A2} · ${B2} · AB</div>
      <div class="x-fl" style="left:${FX[0]}px;top:762px;font-size:38px" data-at="0@0.3" data-fx="fade">Q = 1</div>
      <div class="x-fl good" style="left:${FX[2]}px;top:762px;font-size:38px" data-at="5@0.5" data-fx="pop">Q = 16 = K</div>
      <div class="x-fl good" style="left:${FX[3]}px;top:762px;font-size:38px" data-at="6@0.4" data-fx="pop">no change</div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="2" data-fx="fade" data-out="7">
        ${mol(560, 880, 'A2', 22)}<text x="635" y="893" font-size="44" font-weight="900" text-anchor="middle">+</text>${mol(710, 880, 'B2', 22)}
        <line x1="790" y1="880" x2="900" y2="880" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/>
        ${mol(980, 880, 'AB', 22)}<text x="1055" y="893" font-size="44" font-weight="900" text-anchor="middle">+</text>${mol(1130, 880, 'AB', 22)}
        <text x="1220" y="893" font-size="34" font-weight="800" class="f-muted">one ${'A'}<tspan dy="8" font-size="22">2</tspan><tspan dy="-8"> and one B</tspan><tspan dy="8" font-size="22">2</tspan><tspan dy="-8"> gone</tspan></text></g></svg>
      <div class="banner" style="top:850px;font-size:50px" data-at="7" data-fx="pop">Counts stop changing ${ARR} <span class="gold">equilibrium</span></div>`,
  })

  // ---------- try it ----------
  const SEQ = [2, 5, 7, 7, 7], SX = (i) => 120 + i * 362
  const OPTS = ['At the first box', 'When the count first reached 7', 'Never', 'At the last box only']
  const prod = (x, y, n) => Array.from({ length: n }, (_, i) => mol(x + 52 + (i % 3) * 63, y + 36 + Math.floor(i / 3) * 46, 'AB', 14, ROT[i])).join('')
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1@0.62">When was <span class="teal">equilibrium</span> reached?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${SEQ.map((n, i) => `<g data-at="1@${(0.2 + i * 0.08).toFixed(2)}" data-fx="pop">${boxR(SX(i), 290, 236, 160)}${prod(SX(i), 290, n)}<text x="${SX(i) + 118}" y="500" text-anchor="middle" font-size="40" font-weight="900">${n}</text></g>`).join('')}
        <g data-at="4" data-fx="fade"><rect class="x-hi" x="${SX(2) - 12}" y="278" width="${2 * 362 + 260}" height="240" rx="30" fill="none" stroke="${GOOD}" stroke-width="5" stroke-dasharray="16 12"/>
          <text x="${SX(3) + 118}" y="262" text-anchor="middle" font-size="30" font-weight="900" class="f-good">no further change</text></g>
      </svg>
      <div class="x-t muted" style="left:120px;top:520px;font-size:30px;font-weight:800" data-at="1@0.15" data-fx="fade">product molecules in each box</div>
      ${OPTS.map((o, i) => `<div class="x-opt x-o${i}" style="left:${120 + (i % 2) * 860}px;top:${580 + Math.floor(i / 2) * 140}px" data-at="1@${(0.75 + i * 0.06).toFixed(2)}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? CHECK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="920" r="58" fill="none" stroke="#363c54" stroke-width="11"/><circle class="x-arc" cx="960" cy="920" r="58" fill="none" stroke="${TEAL}" stroke-width="11" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 920)"/>
        <text class="x-num" x="960" y="942" text-anchor="middle" font-size="62" font-weight="900">3</text><text x="1050" y="932" font-size="30" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-line" style="top:880px;font-size:46px" data-at="4" data-fx="pop">Equilibrium = <span class="good">no further change</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-o' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.x-o1 .ok').style.opacity = win; c.$('.x-o1 .ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="190" viewBox="0 0 460 190">${boxR(20, 10, 170, 170)}${mol(70, 60, 'AB', 16, -15)}${mol(140, 95, 'AB', 16, 20)}${mol(80, 140, 'A2', 16, 10)}
    <line x1="210" y1="95" x2="270" y2="95" stroke="${GOLD}" stroke-width="6" marker-end="url(#mk-gold)"/>
    <text x="370" y="80" text-anchor="middle" font-size="38" font-weight="900" class="f-gold">× 0.10 M</text><text x="370" y="145" text-anchor="middle" font-size="44" font-weight="900" class="f-teal">then K</text></svg>`
  const r2 = `<svg width="460" height="190" viewBox="0 0 460 190" font-weight="900" text-anchor="middle">
    <text x="130" y="120" font-size="90" class="f-teal">Q</text><text x="230" y="116" font-size="70" class="f-muted">vs.</text><text x="330" y="120" font-size="90" class="f-gold">K</text></svg>`
  const r3 = `<svg width="460" height="190" viewBox="0 0 460 190" font-weight="900" text-anchor="middle">
    ${[0, 1, 2].map((i) => `${boxR(28 + i * 142, 40, 120, 110)}<text x="${88 + i * 142}" y="118" font-size="64" class="f-good">7</text>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Counts ${ARR} concentrations<br>(or ratios), then<br>plug into <span class="teal">K</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Find <span class="teal">Q</span> from the counts,<br>compare it with <span class="gold">K</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Equilibrium =<br>the counts <span class="good">stop</span><br><span class="good">changing</span></p></div>`,
  })
  void eio; void WARM; void BAD
})()
