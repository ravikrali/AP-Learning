// Pictures for chem-8.1 "pH, pOH & Water". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u8.ts and chem/book.ts): lemon juice
// pH ~2 and bleach ~12, Kw = 1.0 x 10^-14 at 25 C, the [OH-] = 2.5 x 10^-4 M example, Kw = 5.5 x 10^-14
// and pH ~6.6 at 50 C, pH 3.00 -> [OH-] = 1.0 x 10^-11 M. Bars show order only, not a scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-eq{display:inline-block;width:1.15em;height:.72em;margin:0 .24em;vertical-align:-.02em;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 22'%3E%3Cpath d='M2 7h29l-7-5.5M32 15H3l7 5.5' fill='none' stroke='black' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:52px;font-weight:900;white-space:nowrap}
    .x-tk{font-size:30px;font-weight:800;text-anchor:middle}
    .x-fc{position:absolute;top:300px;width:810px;height:150px;text-align:center;font-size:66px;font-weight:900;line-height:146px;white-space:nowrap}
    .x-kc{position:absolute;top:660px;width:810px;height:180px;text-align:center;white-space:nowrap}
    .x-kc .a{margin-top:28px;font-size:56px;font-weight:900} .x-kc .b{margin-top:10px;font-size:40px;font-weight:800;color:var(--muted)}
    .x-lab{position:absolute;width:300px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-pc{position:absolute;top:392px;width:810px;height:446px}
    .x-pc h3{text-align:center}
    .x-bar{position:absolute;width:140px;border-radius:14px 14px 4px 4px}
    .x-bl{position:absolute;width:300px;text-align:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-bv{position:absolute;width:300px;text-align:center;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-pb{position:absolute;left:0;right:0;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-cn{position:absolute;width:500px;height:110px;border-radius:26px;background:rgba(36,40,56,.95);border:3px solid var(--line)}
    .x-cn>div{position:absolute;left:0;right:0;top:0;text-align:center;line-height:104px;font-size:48px;font-weight:900;white-space:nowrap}
    .x-cn>div.v{font-size:40px}
    .x-strip{position:absolute;left:120px;top:800px;width:1680px;height:120px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .x-strip>div{position:absolute;left:0;right:0;top:0;text-align:center;line-height:116px;font-size:50px;font-weight:900;white-space:nowrap}
    .x-tc{position:absolute;top:300px;width:810px;height:540px}
    .x-tc h3{text-align:center}
    .x-tc .k{position:absolute;left:0;right:0;top:100px;text-align:center;font-size:38px;font-weight:800;white-space:nowrap}
    .x-verd{position:absolute;left:205px;width:400px;top:452px;height:66px;border-radius:33px;text-align:center;font-size:40px;font-weight:900;line-height:62px;border:3px solid}
    .x-no{text-decoration:line-through;text-decoration-color:var(--bad);text-decoration-thickness:6px}
    .x-tile{position:absolute;top:400px;width:390px;height:250px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:54px;font-size:92px;font-weight:900;line-height:1} .x-tile .ch{margin-top:16px;font-size:38px;font-weight:800;color:var(--muted)}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', TXT = '#eef0f7', GOLD = '#f2c443', PRI = '#8d8df0', MUTED = '#a3abbd', GOOD = '#4cc781'
  const EQ = '<i class="x-eq"></i>'
  const H3O = 'H<sub>3</sub>O<sup>+</sup>', OH = 'OH<sup>−</sup>'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- the pH scale: 0..14 from x0, `u` px per unit ----------
  const grad = (id) => `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#f0707a"/><stop offset=".22" stop-color="#f3a764"/><stop offset=".38" stop-color="#f2c443"/><stop offset=".5" stop-color="#4cc781"/><stop offset=".68" stop-color="#3cc7bc"/><stop offset=".85" stop-color="#8d8df0"/><stop offset="1" stop-color="#5b5bd6"/></linearGradient></defs>`
  const scaleBar = (id, x0, u, y, h, ticks = true) => `${grad(id)}<rect x="${x0 - 10}" y="${y}" width="${14 * u + 20}" height="${h}" rx="${h / 2}" fill="url(#${id})"/>
    ${ticks ? Array.from({ length: 15 }, (_, i) => `<text x="${x0 + i * u}" y="${y + h + 46}" class="x-tk f-muted">${i}</text>`).join('') : ''}`
  const X = (p) => 200 + p * 108

  // ---------- intro: a faint pH scale below the chips ----------
  EZ.intro = {
    chips: [['1@0.45', 'pH &amp; pOH'], ['1@0.65', 'Water’s K<sub>w</sub>'], ['1@0.85', 'The pH square']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">${scaleBar('x-gi', 260, 100, 880, 34, false)}<circle class="x-idot" cx="0" cy="897" r="26" fill="#fff"/></svg>`,
    update(c) {
      const p = 7 + 5 * Math.sin((c.t - c.sc.start) * 0.45)
      c.$('.x-idot').setAttribute('cx', 260 + p * 100)
    },
  }

  // ---------- hook: lemon juice vs bleach ----------
  const pin = (p, col, name, num) => `<g transform="translate(${X(p)} 0)">
    <text y="366" text-anchor="middle" font-size="38" font-weight="900" style="fill:${col}">${name}</text>
    <path d="M-20 470 L0 522 L20 470Z" fill="${col}"/><circle cy="436" r="46" fill="${col}"/>
    <text y="448" text-anchor="middle" font-size="34" font-weight="900" class="f-dark">${num}</text></g>`
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why pH?</div><h2 class="h1" data-at="in+0.2">Lemon juice vs. bleach</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${scaleBar('x-gh', 200, 108, 530, 56)}</g>
        <g data-at="0@0.3" data-fx="pop">${pin(2, GOLD, 'lemon juice', '≈2')}</g>
        <g data-at="1@0.3" data-fx="pop">${pin(12, PRI, 'bleach', '≈12')}</g>
        <g data-at="2" data-fx="fade"><line x1="${X(2) + 6}" y1="672" x2="${X(12) - 6}" y2="672" stroke="${GOLD}" stroke-width="6" marker-start="url(#mk-gold)" marker-end="url(#mk-gold)"/>
          <text x="${X(7)}" y="728" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">10 pH units</text></g>
        <g class="x-walk"><circle r="30" fill="#fff" opacity=".3"/><circle r="17" fill="#fff"/></g>
      </svg>
      <div class="x-line" style="top:756px;font-size:60px" data-at="3" data-fx="fade"><span class="gold x-n">1</span>× more ${H3O} in lemon juice</div>
      <div class="banner" style="top:876px" data-at="4" data-fx="pop">Huge numbers ${ARR} <span class="gold">small, friendly ones</span></div>`,
    update(c) {
      const b = c.b, s = b[3].start, p = lerp(12, 2, eio(c.seg(s + 0.3, s + 0.62 * (b[3].end - s))))
      c.$('.x-walk').setAttribute('transform', `translate(${X(p)} 558)`)
      c.$('.x-walk').style.opacity = c.seg(s, s + 0.3)
      c.$('.x-n').textContent = (10 ** Math.round(12 - p)).toLocaleString('en-US')
    },
  })

  // ---------- definitions and the scale ----------
  EZ.scene('define', {
    html: `<div class="kicker" data-at="in" data-fx="left">Definitions</div><h2 class="h1" data-at="0">On your equation sheet</h2>
      <div class="card x-fc" style="left:120px" data-at="1"><span class="pri">pH</span> = −log[${H3O}]</div>
      <div class="card x-fc" style="left:990px" data-at="2"><span class="teal">pOH</span> = −log[${OH}]</div>
      <div class="x-line" style="top:474px;font-size:38px;font-weight:800" data-at="3" data-fx="fade"><span class="muted">${H3O} (hydronium)</span> = <span class="muted">H<sup>+</sup></span> &nbsp;·&nbsp; both accepted on the AP® exam</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="4" data-fx="fade">${scaleBar('x-gd', 200, 108, 610, 50)}</g>
        <text x="${X(3.5)}" y="590" text-anchor="middle" font-size="38" font-weight="900" class="f-warm" data-at="4@0.05" data-fx="fade">acidic (&lt; 7)</text>
        <g data-at="4@0.3" data-fx="fade"><line x1="${X(7)}" y1="600" x2="${X(7)}" y2="670" stroke="#fff" stroke-width="6"/><text x="${X(7)}" y="590" text-anchor="middle" font-size="38" font-weight="900" class="f-good">neutral (25 °C)</text></g>
        <text x="${X(10.5) + 40}" y="590" text-anchor="middle" font-size="38" font-weight="900" class="f-pri" data-at="4@0.75" data-fx="fade">basic (&gt; 7)</text>
        ${Array.from({ length: 14 }, (_, i) => `<g data-at="5@${(0.15 + i * 0.045).toFixed(3)}" data-fx="fade"><path d="M${X(i) + 14} 722 Q${X(i + 0.5)} 760 ${X(i + 1) - 14} 722" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>
          <text x="${X(i + 0.5)}" y="796" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">×10</text></g>`).join('')}
        <circle cx="${X(3)}" cy="${610 + 50 + 35}" r="30" fill="none" stroke="${GOLD}" stroke-width="5" data-at="6@0.75" data-fx="pop"/>
      </svg>
      <div class="banner" style="top:840px;font-size:48px" data-at="6@0.1" data-fx="pop">[${H3O}] = 1.0 × 10<sup>−3</sup> M ${ARR} pH = <span class="gold">3.00</span></div>`,
  })

  // ---------- water ionizes itself ----------
  const OL = [760, 470], OR = [1160, 470]
  EZ.scene('water', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Water</div><h2 class="h1" data-at="in+0.2">Water ionizes itself</h2>
      <div class="x-line" style="top:300px" data-at="1"><span>2H<sub>2</sub>O(l)</span>${EQ}<span class="pri">${H3O}(aq)</span> + <span class="teal">${OH}(aq)</span></div>
      <div data-at="in" data-out="5" data-fx="fade">
        <svg class="full" viewBox="0 0 1920 1080">
          <g class="x-ml">${ball(-48, 40, 28, 'gray', 'H', 26)}${ball(48, 40, 28, 'gray', 'H', 26)}${ball(0, 0, 50, 'red', 'O', 40)}</g>
          <g class="x-mr">${ball(48, 40, 28, 'gray', 'H', 26)}${ball(0, 0, 50, 'red', 'O', 40)}</g>
          <g class="x-hop">${ball(0, 0, 28, 'gold', 'H', 26)}</g>
        </svg>
        <div class="x-lab muted x-l1" style="top:560px" data-at="in+0.3" data-out="1@0.8" data-fx="fade">H<sub>2</sub>O</div>
        <div class="x-lab muted x-l2" style="top:560px" data-at="in+0.3" data-out="1@0.8" data-fx="fade">H<sub>2</sub>O</div>
        <div class="x-lab pri x-l3" style="top:560px" data-at="1@0.8" data-fx="fade">${H3O}</div>
        <div class="x-lab teal x-l4" style="top:560px" data-at="1@0.8" data-fx="fade">${OH}</div>
        <div class="card x-kc" style="left:120px" data-at="2"><div class="a">K<sub>w</sub> = [${H3O}][${OH}]</div><div class="b" data-at="3" data-fx="fade">= <span class="gold" style="font-weight:900">1.0 × 10<sup>−14</sup></span> at 25 °C</div></div>
        <div class="card x-kc" style="left:990px" data-at="4"><div class="a"><span class="pri">pH</span> + <span class="teal">pOH</span> = <span class="gold">14</span></div><div class="b">at 25 °C</div></div>
      </div>
      <div class="card x-pc" style="left:120px" data-at="5"><h3>Pure water</h3>
        <div class="x-bar" style="left:180px;top:100px;height:200px;background:linear-gradient(180deg,#c9c9ff,#5b5bd6)"></div>
        <div class="x-bar" style="left:490px;top:100px;height:200px;background:linear-gradient(180deg,#b4f3ec,#1b7f77)"></div>
        <div class="x-bl pri" style="left:100px;top:308px">${H3O}</div><div class="x-bl teal" style="left:410px;top:308px">${OH}</div>
        <div class="x-pb gold" style="top:158px;font-size:70px" data-at="5@0.45" data-fx="pop">=</div>
        <div class="x-pb" style="top:368px" data-at="5@0.6" data-fx="fade">pH = pOH = <span class="gold">7.0</span></div></div>
      <div class="card x-pc" style="left:990px" data-at="6"><h3>pH 3.00</h3>
        <div class="x-bar" style="left:180px;top:90px;height:230px;background:linear-gradient(180deg,#c9c9ff,#5b5bd6)"></div>
        <div class="x-bar" style="left:490px;top:314px;height:6px;background:#3cc7bc" data-at="6@0.45" data-fx="fade"></div>
        <div class="x-bl pri" style="left:100px;top:330px">${H3O}</div><div class="x-bl teal" style="left:410px;top:330px">${OH}</div>
        <div class="x-bv" style="left:100px;top:392px" data-at="6@0.2" data-fx="fade">1.0 × 10<sup>−3</sup> M</div>
        <div class="x-bv" style="left:410px;top:392px" data-at="6@0.6" data-fx="fade">1.0 × 10<sup>−11</sup> M</div>
        <div class="x-bv" style="left:470px;top:24px;font-size:24px;text-align:right;width:300px" data-at="6@0.6" data-fx="fade">bars not to scale</div></div>
      <div class="banner" style="top:870px" data-at="7" data-fx="pop">Acidic or basic? It’s which ion is <span class="gold">in excess</span></div>`,
    update(c) {
      const b = c.b, s = b[1].start, d = b[1].end - s
      const hop = eio(c.seg(s + 0.3 * d, s + 0.7 * d)), sep = eio(c.seg(s + 0.72 * d, b[1].end + 0.3))
      const xl = OL[0] - 50 * sep, xr = OR[0] + 50 * sep
      c.$('.x-ml').setAttribute('transform', `translate(${xl} ${OL[1]})`)
      c.$('.x-mr').setAttribute('transform', `translate(${xr} ${OR[1]})`)
      const hx = lerp(xr - 62, xl + 62, hop), hy = OL[1] - 22 - 70 * Math.sin(Math.PI * hop)
      c.$('.x-hop').setAttribute('transform', `translate(${hx} ${hy})`)
      c.$('.x-l1').style.left = (xl - 150) + 'px'; c.$('.x-l3').style.left = (xl - 150) + 'px'
      c.$('.x-l2').style.left = (xr - 150) + 'px'; c.$('.x-l4').style.left = (xr - 150) + 'px'
    },
  })

  // ---------- the pH square (shared by 'square' and 'example') ----------
  // corners: TL [H3O+], TR pH, BR pOH, BL [OH-]; boxes 500 x 110
  const CX = { l: 120, r: 1300 }, CY = { t: 320, b: 640 }
  const edges = (cls = '', col = MUTED, w = 6, mk = 'muted') => ({
    top: `<line x1="650" y1="358" x2="1270" y2="358" stroke="${col}" stroke-width="${w}" marker-end="url(#mk-${mk})"/><text x="960" y="338" text-anchor="middle" font-size="36" font-weight="900" style="fill:${col}">−log</text>`,
    topBack: `<line x1="1270" y1="394" x2="650" y2="394" stroke="${col}" stroke-width="${w}" marker-end="url(#mk-${mk})"/><text x="960" y="448" text-anchor="middle" font-size="36" font-weight="900" style="fill:${col}">${sup('10', '−p')}</text>`,
    bot: `<line x1="650" y1="678" x2="1270" y2="678" stroke="${col}" stroke-width="${w}" marker-end="url(#mk-${mk})"/><text x="960" y="658" text-anchor="middle" font-size="36" font-weight="900" style="fill:${col}">−log</text>`,
    botBack: `<line x1="1270" y1="714" x2="650" y2="714" stroke="${col}" stroke-width="${w}" marker-end="url(#mk-${mk})"/><text x="960" y="768" text-anchor="middle" font-size="36" font-weight="900" style="fill:${col}">${sup('10', '−p')}</text>`,
    right: `<line x1="1550" y1="448" x2="1550" y2="622" stroke="${col}" stroke-width="${w}" marker-start="url(#mk-${mk})" marker-end="url(#mk-${mk})"/><text x="1590" y="548" font-size="40" font-weight="900" style="fill:${col}">14 −</text>`,
    left: `<line x1="370" y1="448" x2="370" y2="622" stroke="${col}" stroke-width="${w}" marker-start="url(#mk-${mk})" marker-end="url(#mk-${mk})"/><text x="330" y="548" text-anchor="end" font-size="40" font-weight="900" style="fill:${col}">K<tspan dy="9" font-size="26">w</tspan><tspan dy="-9"> ÷</tspan></text>`,
    cls,
  })
  const corner = (x, y, at, name, val, valAt) => `<div class="x-cn" style="left:${x}px;top:${y}px" data-at="${at}" data-fx="pop">
    <div ${val ? `data-at="in" data-out="${valAt}" data-fx="fade" class="muted"` : ''}>${name}</div>${val ? `<div class="v" data-at="${valAt}" data-fx="fade">${val}</div>` : ''}</div>`

  EZ.scene('square', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">The pH square</h2>
      ${corner(CX.l, CY.t, '1@0.25', `<span class="pri">[${H3O}]</span>`)}${corner(CX.r, CY.t, '1@0.42', '<span class="pri">pH</span>')}
      ${corner(CX.r, CY.b, '1@0.58', '<span class="teal">pOH</span>')}${corner(CX.l, CY.b, '1@0.78', `<span class="teal">[${OH}]</span>`)}
      <svg class="full" viewBox="0 0 1920 1080">
        ${(() => { const e = edges('', TXT, 6, 'text'); return `
        <g data-at="2" data-fx="fade">${e.top}${e.bot}</g>
        <g data-at="3" data-fx="fade">${e.topBack}${e.botBack}</g>
        <g data-at="4" data-fx="fade">${e.right}</g>
        <g data-at="5" data-fx="fade">${e.left}</g>` })()}
        <circle class="x-run" r="13" fill="${GOLD}"/><circle class="x-run2" r="13" fill="${GOLD}"/>
      </svg>`,
    update(c) {
      const b = c.b, t = c.t
      const go = (i) => (t >= b[i].start + 0.4 && t < b[i].end + 0.3 ? ((t - b[i].start - 0.4) % 1.4) / 1.4 : -1)
      let p, a = null, z = null
      if ((p = go(2)) >= 0) { a = [650 + 600 * p, 358]; z = [650 + 600 * p, 678] }
      else if ((p = go(3)) >= 0) { a = [1270 - 600 * p, 394]; z = [1270 - 600 * p, 714] }
      else if ((p = go(4)) >= 0) { const y = 460 + 150 * (0.5 - 0.5 * Math.cos(Math.PI * 2 * p)); a = [1550, y] }
      else if ((p = go(5)) >= 0) { const y = 460 + 150 * (0.5 - 0.5 * Math.cos(Math.PI * 2 * p)); a = [370, y] }
      const r1 = c.$('.x-run'), r2 = c.$('.x-run2')
      r1.style.opacity = a ? 1 : 0; r2.style.opacity = z ? 1 : 0
      if (a) { r1.setAttribute('cx', a[0]); r1.setAttribute('cy', a[1]) }
      if (z) { r2.setAttribute('cx', z[0]); r2.setAttribute('cy', z[1]) }
    },
  })

  // ---------- worked example: go around the square ----------
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Go around the square</h2>
      ${corner(CX.l, CY.b, 'in+0.3', `<span class="teal">[${OH}]</span>`, `[${OH}] = <span class="teal">2.5 × 10<sup>−4</sup> M</span>`, '1@0.3')}
      ${corner(CX.r, CY.b, 'in+0.4', '<span class="teal">pOH</span>', 'pOH = <span class="teal">3.60</span>', '2@0.7')}
      ${corner(CX.r, CY.t, 'in+0.5', '<span class="pri">pH</span>', 'pH = <span class="pri">10.40</span>', '3@0.6')}
      ${corner(CX.l, CY.t, 'in+0.6', `<span class="pri">[${H3O}]</span>`, `[${H3O}] = <span class="pri">4.0 × 10<sup>−11</sup> M</span>`, '4@0.75')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${(() => { const e = edges('', '#5a6178', 5, 'muted'), g = edges('', GOLD, 8, 'gold'); return `
        <g data-at="in+0.5" data-fx="fade" opacity=".55">${e.top}${e.topBack}${e.bot}${e.botBack}${e.right}${e.left}</g>
        <g data-at="2" data-out="3" data-fx="fade">${g.bot}</g>
        <g data-at="3" data-out="4" data-fx="fade">${g.right}</g>
        <g data-at="4" data-out="5" data-fx="fade">${g.topBack}</g>` })()}
      </svg>
      <div class="x-strip" data-at="1">
        <div data-at="1" data-out="2" data-fx="fade">Given: [${OH}] = 2.5 × 10<sup>−4</sup> M</div>
        <div data-at="2" data-out="3" data-fx="fade"><span class="muted">1</span>&nbsp; pOH = −log(2.5 × 10<sup>−4</sup>) = <span class="teal">3.60</span></div>
        <div data-at="3" data-out="4" data-fx="fade"><span class="muted">2</span>&nbsp; pH = 14.00 − 3.60 = <span class="pri">10.40</span> &nbsp;<span class="muted">(basic)</span></div>
        <div data-at="4" data-out="5" data-fx="fade"><span class="muted">3</span>&nbsp; [${H3O}] = 10<sup>−10.40</sup> = <span class="pri">4.0 × 10<sup>−11</sup> M</span></div>
        <div data-at="5" data-fx="fade" style="font-size:44px">Sig figs in the concentration = <span class="gold">decimal places in pH</span></div>
      </div>
      <div class="x-line" style="top:946px;font-size:40px" data-at="6@0.2" data-fx="fade"><span class="gold">2.5</span>: two sig figs ${ARR} pOH = 3.<span class="gold">60</span>: two decimal places</div>`,
  })

  // ---------- trap: neutral is not always pH 7 ----------
  const bars = (h, top) => `<div class="x-bar" style="left:230px;top:${top}px;height:${h}px;width:110px;background:linear-gradient(180deg,#c9c9ff,#5b5bd6)"></div>
    <div class="x-bar" style="left:470px;top:${top}px;height:${h}px;width:110px;background:linear-gradient(180deg,#b4f3ec,#1b7f77)"></div>
    <div class="x-bl pri" style="left:135px;top:388px;font-size:36px">${H3O}</div><div class="x-bl teal" style="left:375px;top:388px;font-size:36px">${OH}</div>`
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Common trap</div><h2 class="h1" data-at="0">Is neutral always pH 7?</h2>
      <div class="card x-tc" style="left:120px" data-at="in+0.3"><h3>At 25 °C</h3>
        <div class="k">K<sub>w</sub> = 1.0 × 10<sup>−14</sup> &nbsp;·&nbsp; pH = <span class="gold">7.0</span></div>
        ${bars(170, 210)}<div class="x-pb gold" style="top:250px;font-size:70px" data-at="4" data-fx="pop">=</div>
        <div class="x-verd good" style="border-color:var(--good);background:rgba(76,199,129,.14)">neutral</div></div>
      <div class="card x-tc" style="left:990px" data-at="1"><h3>At 50 °C</h3>
        <div class="k">K<sub>w</sub> = 5.5 × 10<sup>−14</sup> &nbsp;·&nbsp; pH ≈ <span class="warm">6.6</span></div>
        ${bars(210, 170)}<div class="x-pb gold" style="top:250px;font-size:70px" data-at="4" data-fx="pop">=</div>
        <div class="x-verd warm" style="border-color:var(--warm);background:rgba(243,167,100,.14)" data-at="2" data-out="3" data-fx="pop">acidic?</div>
        <div class="x-verd good" style="border-color:var(--good);background:rgba(76,199,129,.14)" data-at="3" data-fx="pop"><span class="x-no bad" style="color:var(--muted)">acidic</span>&nbsp; neutral</div></div>
      <div class="banner" style="top:880px;font-size:46px" data-at="5" data-fx="pop">K<sub>w</sub> depends on temperature: pH 7 is neutral <span class="gold">only at 25 °C</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', '2×', 'more'], ['B', '20×', 'more'], ['C', '100×', 'more'], ['D', '2×', 'less']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Compared to B, solution A has…</h2>
      <div style="position:absolute;left:120px;top:278px;font-size:42px;font-weight:800;color:var(--muted);white-space:nowrap" data-at="1@0.05">Solution A: <b class="warm">pH 3</b> &nbsp;·&nbsp; Solution B: <b class="teal">pH 5</b></div>
      ${OPTS.map(([l, f, w], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${0.55 + i * 0.1}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}
        <div class="f">${f}</div><div class="ch">${w} ${H3O}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="820" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="820" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 820)"/>
        <text class="x-num" x="960" y="846" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="950" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:760px" data-at="4" data-fx="pop">Each pH unit = 10× ${ARR} two units = 10<sup>2</sup> = <span class="teal">100×</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.5, b[3].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${scaleBar('x-gr', 40, 27, 60, 34, false)}
    <text x="${40 + 27 * 3}" y="40" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">acidic</text><text x="${40 + 27 * 11}" y="40" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">basic</text>
    <text x="${40 + 27 * 7}" y="134" text-anchor="middle" font-size="30" font-weight="900" class="f-good">7</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150" font-weight="900" text-anchor="middle">
    <rect x="60" y="14" width="120" height="44" rx="12" fill="none" stroke="${PRI}" stroke-width="4"/><text x="120" y="46" font-size="28" class="f-pri">pH</text>
    <rect x="280" y="14" width="120" height="44" rx="12" fill="none" stroke="${TEAL}" stroke-width="4"/><text x="340" y="46" font-size="28" class="f-teal">pOH</text>
    <text x="230" y="46" font-size="34" style="fill:${TXT}">+</text><text x="230" y="124" font-size="48" class="f-gold">= 14</text></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150" font-weight="900" text-anchor="middle">
    <rect x="150" y="30" width="60" height="100" rx="8" fill="url(#g-pur)"/><rect x="250" y="30" width="60" height="100" rx="8" fill="url(#g-teal)"/>
    <text x="230" y="96" font-size="44" class="f-gold">=</text>
    <rect x="44" y="20" width="24" height="96" rx="12" fill="none" stroke="${MUTED}" stroke-width="4"/><circle cx="56" cy="122" r="18" fill="${WARM}"/><rect x="50" y="56" width="12" height="66" fill="${WARM}"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="pri">pH</span> = −log[${H3O}]<br><br><span class="teal">pOH</span> = −log[${OH}]</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>At 25 °C:<br>K<sub>w</sub> = <span class="gold">1.0 × 10<sup>−14</sup></span><br>pH + pOH = <span class="gold">14</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>K<sub>w</sub> changes with<br>temperature.<br>Neutral means<br><span class="gold">[${H3O}] = [${OH}]</span></p></div>`,
  })
  void clamp; void GOOD
})()
