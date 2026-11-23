// Pictures for chem-3.4 "The Ideal Gas Law". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u3.ts). Particles, graphs and
// gauges are schematic: counts, sizes and axis scales are not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:31px;font-weight:800;line-height:68px;white-space:nowrap}
    .tmr{position:absolute;right:40px;top:30px;font-size:44px;font-weight:900;white-space:nowrap}
    .slow{position:absolute;right:40px;top:92px;text-align:right;font-size:26px;font-weight:800;color:var(--muted)}
    .big-eq{position:absolute;left:0;right:0;text-align:center;font-weight:900;white-space:nowrap;letter-spacing:2px}
    .big-eq span{display:inline-block}
    .vr{position:absolute;left:990px;width:810px;height:100px;border-radius:24px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .vr .bd{position:absolute;left:22px;top:14px;width:72px;height:72px;border-radius:50%;font-size:42px;font-weight:900;line-height:70px;text-align:center;color:#10131c}
    .vr .nm{position:absolute;left:118px;top:24px;font-size:40px;font-weight:900;white-space:nowrap}
    .vr .un{position:absolute;right:28px;top:28px;font-size:33px;font-weight:800;white-space:nowrap}
    .sh{position:absolute;left:56px;font-size:38px;font-weight:800;white-space:nowrap}
    .sh i{font-style:normal;display:inline-block;width:46px;color:var(--good)}
    .ln{position:absolute;left:44px;font-size:34px;font-weight:800;white-space:nowrap;color:var(--muted)}
    .prob{left:120px;top:290px;width:1680px;height:130px;padding:36px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .srow{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .srow .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;background:var(--brand);font-size:38px;font-weight:900;line-height:68px;text-align:center}
    .srow .lb{position:absolute;left:124px;top:38px;font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .srow .eq{position:absolute;left:520px;top:30px;font-size:46px;font-weight:900;white-space:nowrap}
    .res{position:absolute;left:1330px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:46px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .gc{top:290px;width:390px;height:540px}
    .gc h3{padding:26px 30px 0;font-size:38px;white-space:nowrap}
    .gtag{position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:36px;font-weight:900}
    .fm{position:absolute;left:0;right:0;text-align:center;font-weight:900;white-space:nowrap}
    .fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle} .fr span{padding:2px 14px;align-self:stretch;text-align:center} .fr span+span{border-top:6px solid var(--text)}
    .zero{position:absolute;left:44px;right:44px;padding:16px;border-radius:22px;text-align:center;font-size:40px;font-weight:900}
    .ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .rc{top:320px;width:540px;height:560px;text-align:center} .rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .rc svg{display:block;margin:14px auto 0} .rc p{margin:14px 20px 0;font-size:31px;font-weight:800;line-height:1.4;white-space:nowrap}
  `
  document.head.appendChild(css)

  const all = (c, q) => (c['_' + q] ??= [...c.root.querySelectorAll(q)])
  const tri = (p, L) => { const m = ((p % (2 * L)) + 2 * L) % (2 * L); return m < L ? m : 2 * L - m }
  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const sb = (s) => `<tspan dy=".3em" font-size=".62em">${s}</tspan>` // SVG subscript (only at the end of a text)

  // a gas particle bouncing inside the box bx,by,bw,bh (r = bounce radius); mol = two-atom molecule
  const pj = (i, x, y, r, g, box, cls = '', mol = false, rot = 0) =>
    `<g class="pj ${cls}" data-i="${i}" data-x="${x}" data-y="${y}" data-r="${r}" data-b="${box.join(',')}" transform="translate(${x} ${y})">${
      mol ? `<g transform="rotate(${rot})">${ball(-r * 0.42, 0, r * 0.58, g)}${ball(r * 0.42, 0, r * 0.58, g)}</g>` : ball(0, 0, r, g)}</g>`
  const move = (c, k = 1) => {
    const t = c.t
    for (const g of all(c, '.pj')) {
      const d = g.dataset, i = +d.i, x = +d.x, y = +d.y, r = +d.r, [bx, by, bw, bh] = d.b.split(',').map(Number)
      const X = bx + r + tri(x - bx - r + (90 + ((i * 47) % 70)) * t * k, bw - 2 * r)
      const Y = by + r + tri(y - by - r + (70 + ((i * 29) % 80)) * t * k * (i % 2 ? 1 : -1), bh - 2 * r)
      g.setAttribute('transform', `translate(${X.toFixed(1)} ${Y.toFixed(1)})`)
    }
  }
  const gas = (n, box, g = 'pur', r = 13, seed = 0) => { const [bx, by, bw, bh] = box; let s = ''
    for (let i = 0; i < n; i++) s += pj(seed + i, (bx + r + ((i * 151 + seed * 37) % (bw - 2 * r))).toFixed(0), (by + r + ((i * 83 + seed * 19) % (bh - 2 * r))).toFixed(0), r, g, box)
    return s }

  // a pressure gauge (needle class n-<id>) and a thermometer (mercury class m-<id>)
  const gauge = (x, y, r, id) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="5"/>
    ${Array.from({ length: 7 }, (_, k) => { const a = Math.PI * (0.75 + k * 0.25); return `<line x1="${x + (r - 14) * Math.cos(a)}" y1="${y + (r - 14) * Math.sin(a)}" x2="${x + (r - 4) * Math.cos(a)}" y2="${y + (r - 4) * Math.sin(a)}" stroke="#7d859c" stroke-width="4"/>` }).join('')}
    <line class="n-${id}" x1="${x}" y1="${y}" x2="${x}" y2="${y - r + 18}" stroke="#f3a764" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="8" fill="#f3a764"/>`
  const needle = (c, id, x, y, r, p) => { const a = Math.PI * (0.75 + 1.5 * p), el = c.$('.n-' + id)
    el.setAttribute('x2', (x + (r - 18) * Math.cos(a)).toFixed(1)); el.setAttribute('y2', (y + (r - 18) * Math.sin(a)).toFixed(1)) }
  const therm = (x, y, h, id) => `<rect x="${x - 16}" y="${y}" width="32" height="${h}" rx="16" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="5"/>
    <rect class="m-${id}" x="${x - 7}" y="${y + h - 40}" width="14" height="40" rx="7" fill="#f0707a"/>
    <circle cx="${x}" cy="${y + h + 18}" r="28" fill="#f0707a" stroke="#c9cee0" stroke-width="5"/>`
  const mercury = (c, id, y, h, p) => { const el = c.$('.m-' + id), top = y + h - 30 - p * (h - 50)
    el.setAttribute('y', top.toFixed(1)); el.setAttribute('height', (y + h + 10 - top).toFixed(1)) }
  // a see-through box drawn in perspective
  const cube = (x, y, s, d, stroke = '#c9cee0') => `<path d="M${x} ${y} L${x + d} ${y - d} H${x + s + d} V${y + s - d} L${x + s} ${y + s}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round" opacity=".6"/>
    <line x1="${x + s}" y1="${y}" x2="${x + s + d}" y2="${y - d}" stroke="${stroke}" stroke-width="4" opacity=".6"/>
    <rect x="${x}" y="${y}" width="${s}" height="${s}" fill="rgba(60,199,188,.08)" stroke="${stroke}" stroke-width="5"/>`

  // ---------- intro artwork: faint gas cylinders with moving pistons on the left and right edges ----------
  const cyl = (cx, id) => `<path d="M${cx - 95} 360 V860 H${cx + 95} V360" fill="none" stroke="#c9cee0" stroke-width="7"/>
    <g class="pis ${id}"><rect x="${cx - 88}" y="-22" width="176" height="22" rx="6" fill="#8d8df0"/><rect x="${cx - 9}" y="-170" width="18" height="150" fill="#8d8df0"/></g>
    ${gas(9, [cx - 88, 560, 176, 296], 'teal', 14, cx)}`
  EZ.intro = {
    chips: [['1@0.3', 'PV = nRT'], ['1@0.6', 'How gases change'], ['1@0.85', 'Gas mixtures']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${cyl(170, 'pa')}${cyl(1750, 'pb')}</svg>`,
    update(c) {
      move(c, 0.8)
      const y = 470 + 60 * Math.sin((c.t - c.sc.start) * 1.2)
      for (const el of all(c, '.pis')) el.setAttribute('transform', `translate(0 ${y.toFixed(1)})`)
    },
  }

  // ---------- hook: the airbag ----------
  let pellets = ''
  for (let k = 0; k < 14; k++) pellets += ball(330 + (k % 5) * 36 + (Math.floor(k / 5) % 2 ? 18 : 0), 330 - Math.floor(k / 5) * 30, 15, 'gold')
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Real world</div><h2 class="h1" data-at="0">An airbag in about 30 ms</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:540px" data-at="0@0.1"><h3>Car airbag</h3><div class="tmr warm"><span class="ms">0</span> ms</div>
        <svg style="position:absolute;left:0;top:90px" width="810" height="440">
          <clipPath id="hk-c"><ellipse class="bagc" cx="405" cy="190" rx="1" ry="1"/></clipPath>
          <line x1="405" y1="300" x2="405" y2="440" stroke="#7d859c" stroke-width="22"/>
          <circle cx="405" cy="300" r="112" fill="none" stroke="#7d859c" stroke-width="18"/>
          <line x1="293" y1="300" x2="517" y2="300" stroke="#7d859c" stroke-width="14"/>
          <ellipse class="bag" cx="405" cy="190" rx="1" ry="1" fill="rgba(238,240,247,.12)" stroke="#eef0f7" stroke-width="5"/>
          <g clip-path="url(#hk-c)">${gas(14, [110, 30, 590, 320], 'pur', 14, 3)}</g>
        </svg>
        <div class="slow">slowed down</div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:540px" data-at="1"><h3>How much chemical?</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="440">
          <rect x="300" y="210" width="210" height="160" rx="24" fill="rgba(242,196,67,.08)" stroke="#c9cee0" stroke-width="5"/>${pellets}
          <text class="qm f-warm" x="405" y="150" text-anchor="middle" font-size="140" font-weight="900">?</text>
          <text x="405" y="420" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">gas-producing chemical</text></svg>
        <div class="chx" style="left:255px;top:150px;border-color:var(--good)" data-at="2@0.4" data-fx="pop"><span class="good">calculated exactly</span></div></div>
      <div class="banner" style="top:860px;font-size:76px;padding:14px 40px" data-at="3" data-fx="pop">P V = n R T</div>`,
    update(c) {
      const b = c.b, s = eo(c.seg(b[0].start + 0.3, b[0].start + 1.6))
      for (const q of ['.bag', '.bagc']) { c.$(q).setAttribute('rx', (1 + 300 * s).toFixed(1)); c.$(q).setAttribute('ry', (1 + 165 * s).toFixed(1)) }
      c.$('.ms').textContent = Math.round(30 * s)
      move(c, 1.4)
      const q = c.$('.qm'); q.setAttribute('transform', `translate(0 ${(8 * Math.sin(c.t * 3)).toFixed(1)})`)
      q.style.opacity = 1 - c.seg(b[2].start + 0.2, b[2].start + 0.6)
    },
  })

  // ---------- what each letter means ----------
  const LET = [['P', 'pressure', 'atm', '#8d8df0'], ['V', 'volume', 'L', '#3cc7bc'], ['n', 'moles', 'mol', '#f2c443'], ['T', 'temperature', '<span class="warm">kelvin!</span> K = °C + 273.15', '#f3a764'], ['R', 'gas constant', '0.08206 L·atm/(mol·K)', '#c9c9ff']]
  const BX = [250, 70, 300, 290]
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="0">One equation, five letters</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:620px" data-at="0@0.2">
        <div class="big-eq" style="top:34px;font-size:110px">${['P', 'V', ' = ', 'n', 'R', 'T'].map((l) => `<span class="${l.trim() ? 'lt-' + l : ''}">${l === ' = ' ? '&nbsp;=&nbsp;' : l}</span>`).join('')}</div>
        <svg style="position:absolute;left:0;top:190px" width="810" height="420">
          <g data-at="3" data-fx="fade">${gas(10, BX, 'gold', 15, 5)}</g>
          <rect x="${BX[0]}" y="${BX[1]}" width="${BX[2]}" height="${BX[3]}" rx="10" fill="none" stroke="#c9cee0" stroke-width="5"/>
          <g data-at="1" data-fx="pop">${gauge(680, 150, 66, 'eq')}<text x="680" y="262" text-anchor="middle" font-size="40" font-weight="900" class="f-pri">P</text></g>
          <g data-at="2" data-fx="fade"><line x1="${BX[0] + 4}" y1="390" x2="${BX[0] + BX[2] - 4}" y2="390" stroke="#3cc7bc" stroke-width="6" marker-start="url(#mk-teal)" marker-end="url(#mk-teal)"/>
            <text x="${BX[0] + BX[2] + 22}" y="404" font-size="40" font-weight="900" class="f-teal">V</text></g>
          <text x="${BX[0] + BX[2] / 2}" y="52" text-anchor="middle" font-size="40" font-weight="900" class="f-gold" data-at="3@0.3" data-fx="fade">n</text>
          <g data-at="4" data-fx="pop">${therm(130, 80, 220, 'eq')}<text x="130" y="60" text-anchor="middle" font-size="40" font-weight="900" class="f-warm">T</text></g>
        </svg></div>
      ${LET.map(([l, nm, un, col], i) => `<div class="vr" style="top:${290 + i * 124}px" data-at="${i + 1}" data-fx="right"><div class="bd" style="background:${col}">${l}</div><div class="nm">${nm}</div><div class="un">${un}</div></div>`).join('')}`,
    update(c) {
      move(c)
      const b = c.b, t = c.t
      const on = (k) => t >= b[k].start && t < b[k].end + (b[k + 1] ? b[k + 1].start - b[k].end : 9)
      ;['P', 'V', 'n', 'T', 'R'].forEach((l, i) => { const el = c.$('.lt-' + l), lit = on(i + 1)
        el.style.color = lit ? LET[i][3] : ''; el.style.transform = `scale(${lit ? 1.12 : 1})` })
      needle(c, 'eq', 680, 150, 66, 0.35 + 0.08 * Math.sin(t * 2.4))
      mercury(c, 'eq', 80, 220, 0.55 + 0.05 * Math.sin(t * 1.3))
    },
  })

  // ---------- the equation sheet and STP ----------
  const SHEET = ['R = 8.314 J/(mol·K)', 'R = 0.08206 L·atm/(mol·K)', 'STP', '22.4 L/mol']
  EZ.scene('stp', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Good news</div><h2 class="h1" data-at="0">It’s on your equation sheet</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:600px" data-at="1"><h3>Equation sheet</h3>
        ${SHEET.map((s, i) => `<div class="sh" style="top:${130 + i * 96}px" data-at="${i < 2 ? `1@${0.2 + i * 0.35}` : `2@${0.15 + (i - 2) * 0.4}`}" data-fx="left"><i>✓</i>${s}</div>`).join('')}
        <div class="ln" style="top:520px" data-at="2@0.8" data-fx="fade">no need to memorize R</div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:600px" data-at="3"><h3>STP</h3>
        <svg style="position:absolute;left:0;top:80px" width="810" height="500">
          <g data-at="3@0.15" data-fx="pop">${therm(90, 40, 200, 'st')}<text x="90" y="330" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">273.15 K</text></g>
          <g data-at="3@0.6" data-fx="pop">${gauge(700, 130, 70, 'st')}<text x="700" y="250" text-anchor="middle" font-size="34" font-weight="900" class="f-pri">1.0 atm</text></g>
          <g data-at="4" data-fx="pop">${cube(270, 120, 240, 60)}${gas(9, [276, 126, 228, 228], 'teal', 15, 11)}</g>
          <text x="390" y="420" text-anchor="middle" font-size="46" font-weight="900" data-at="4@0.4" data-fx="fade"><tspan class="f-good">1 mol</tspan> = <tspan class="f-teal">22.4 L</tspan></text>
          <text x="390" y="466" text-anchor="middle" font-size="28" font-weight="800" class="f-muted" data-at="4@0.6" data-fx="fade">of an ideal gas at STP</text>
        </svg></div>`,
    update(c) {
      move(c, 0.8)
      needle(c, 'st', 700, 130, 70, 0.4 + 0.02 * Math.sin(c.t * 3))
      mercury(c, 'st', 40, 200, 0.3)
    },
  })

  // ---------- worked example ----------
  const srow = (i, top, at, label, eq, res) => `<div class="srow" style="top:${top}px" data-at="${at}"><div class="n">${i}</div><div class="lb">${label}</div>
      <div class="eq">${eq}</div>${res ? `<div class="res" data-at="${res[1]}" data-fx="pop">${res[0]}</div>` : ''}</div>`
  const piece = (at, s) => `<span data-at="${at}" data-fx="fade">${s}</span>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Find the pressure</h2>
      <div class="card prob" data-at="1"><span class="pri">2.00 mol</span> of gas · <span class="teal">10.0 L</span> container · <span class="warm">25 °C</span>. <span class="muted">Pressure?</span></div>
      ${srow(1, 450, '2', 'Kelvin first', piece('2@0.4', '25 + 273 ='), ['298 K', '2@0.8'])}
      ${srow(2, 590, '3', 'Solve for P', piece('3@0.4', 'P = nRT / V'))}
      ${srow(3, 730, '4', 'Plug in', `${piece('4@0.05', '(2.00)')}${piece('4@0.25', '(0.08206)')}${piece('4@0.5', '(<span class="warm">298</span>)')}${piece('4@0.75', ' ÷ 10.0 =')}`, ['4.89 atm', '5@0.2'])}
      <div class="banner" style="top:880px;padding:16px 40px" data-at="5@0.3" data-fx="pop">P = <span class="good">4.89 atm</span></div>`,
    update(c) {
      const w = eo(c.seg(c.b[5].start + 0.4, c.b[5].start + 0.9)) * (0.75 + 0.25 * Math.sin(c.t * 4))
      c.root.querySelectorAll('.res')[1].style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.5 * w})`
    },
  })

  // ---------- relationships ----------
  const O = [60, 300], GW = 290, GH = 260
  const gx = (u) => O[0] + u * GW, gy = (v) => O[1] - v * GH
  const axes = (xl, yl) => `<line x1="${O[0]}" y1="${O[1]}" x2="${O[0] + GW + 10}" y2="${O[1]}" stroke="#c9cee0" stroke-width="4" marker-end="url(#mk-text)"/>
    <line x1="${O[0]}" y1="${O[1]}" x2="${O[0]}" y2="${O[1] - GH - 10}" stroke="#c9cee0" stroke-width="4" marker-end="url(#mk-text)"/>
    <text x="${O[0] + GW + 6}" y="${O[1] + 40}" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">${xl}</text>
    <text x="${O[0] - 22}" y="${O[1] - GH + 4}" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">${yl}</text>`
  let hyp = ''
  for (let u = 0.2; u <= 1.0001; u += 0.02) hyp += (hyp ? 'L' : 'M') + gx(u).toFixed(1) + ' ' + gy(0.2 / u).toFixed(1)
  const line = `M${gx(0)} ${gy(0)} L${gx(0.95)} ${gy(0.9)}`
  const gcard = (i, at, title, xl, yl, path, color, tag, extra = '') => `<div class="card gc" style="left:${120 + i * 430}px" data-at="${at}"><h3>${title}</h3>
      <svg style="position:absolute;left:0;top:96px" width="390" height="340">${axes(xl, yl)}
        <path d="${path}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" data-at="${at}@0.3" data-fx="draw"/>${extra}</svg>
      <div class="gtag" style="color:${color}" data-at="${at}@0.5" data-fx="pop">${tag}</div></div>`
  const P1 = [0.4, 0.38], P2 = [0.8, 0.76]
  const dbl = `<g data-at="4@0.55" data-fx="fade">${[P1, P2].map(([u, v]) => `<line x1="${gx(u)}" y1="${gy(v)}" x2="${gx(u)}" y2="${O[1]}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="8 8"/><line x1="${gx(u)}" y1="${gy(v)}" x2="${O[0]}" y2="${gy(v)}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="8 8"/><circle cx="${gx(u)}" cy="${gy(v)}" r="11" fill="#fff"/>`).join('')}
    <text x="${gx(P1[0])}" y="${O[1] + 34}" text-anchor="middle" font-size="26" font-weight="900">T</text><text x="${gx(P2[0])}" y="${O[1] + 34}" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">2T</text>
    <text x="${O[0] - 10}" y="${gy(P1[1]) + 9}" text-anchor="end" font-size="26" font-weight="900">P</text><text x="${O[0] - 10}" y="${gy(P2[1]) + 9}" text-anchor="end" font-size="26" font-weight="900" class="f-warm">2P</text></g>`
  EZ.scene('relations', {
    html: `<div class="kicker" data-at="in" data-fx="left">Relationships</div><h2 class="h1" data-at="0">Hold the others constant</h2>
      ${gcard(0, '1', 'P and V', 'V', 'P', hyp, '#8d8df0', 'inverse', `<g class="hd"><circle r="14" fill="#fff"/></g><text x="${gx(0.62)}" y="${gy(0.62)}" font-size="28" font-weight="900" class="f-pri" data-at="2@0.3" data-fx="fade">a curve</text>`)}
      ${gcard(1, '3', 'V and T(K)', 'T', 'V', line, '#3cc7bc', 'direct', `<text x="${O[0] + 4}" y="${O[1] + 34}" text-anchor="middle" font-size="24" font-weight="900" class="f-teal" data-at="3@0.6" data-fx="fade">0 K</text>`)}
      ${gcard(2, '4', 'P and T(K)', 'T', 'P', line, '#f3a764', 'direct', dbl)}
      ${gcard(3, '5', 'V and n', 'n', 'V', line, '#f2c443', 'direct')}
      <div class="banner" style="top:858px;padding:16px 40px" data-at="6@0.3" data-fx="pop">Before and after: <span class="pri">P<sub>1</sub>V<sub>1</sub>/T<sub>1</sub></span> = <span class="teal">P<sub>2</sub>V<sub>2</sub>/T<sub>2</sub></span></div>`,
    update(c) {
      const u = 0.6 + 0.38 * Math.sin(c.t * 1.1), el = c.$('.hd')
      el.setAttribute('transform', `translate(${gx(u).toFixed(1)} ${gy(0.2 / u).toFixed(1)})`)
      el.style.opacity = c.seg(c.b[1].end - 0.3, c.b[1].end + 0.2)
    },
  })

  // ---------- Dalton's law ----------
  const MB = [60, 30, 690, 300]
  let mix = ''
  for (let i = 0; i < 12; i++) { const o2 = i % 4 === 3
    mix += pj(i, 90 + ((i * 197) % 600), 60 + ((i * 89) % 240), 30, o2 ? 'warm' : 'teal', MB, o2 ? 'o2' : 'n2', true, (i * 53) % 180) }
  EZ.scene('dalton', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Gas mixtures</div><h2 class="h1" data-at="0">Dalton’s law</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:600px" data-at="0@0.3"><h3>A gas mixture</h3>
        <svg style="position:absolute;left:0;top:90px" width="810" height="420">
          <rect x="${MB[0]}" y="${MB[1]}" width="${MB[2]}" height="${MB[3]}" rx="14" fill="rgba(255,255,255,.03)" stroke="#c9cee0" stroke-width="5"/>${mix}</svg>
        <div class="ln" style="top:450px" data-at="1@0.5" data-fx="fade">each gas acts <span style="color:var(--text)">as if it were alone</span></div>
        <div class="ln" style="top:510px" data-at="5@0.1" data-fx="fade"><span class="teal">3 mol N<sub>2</sub></span> + <span class="warm">1 mol O<sub>2</sub></span> · <span style="color:var(--text)">2.0 atm total</span></div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:600px" data-at="3"><h3>Partial pressures</h3>
        <div class="fm" style="top:110px;font-size:46px">P<sub>total</sub> = P<sub>A</sub> + P<sub>B</sub> + P<sub>C</sub> + …</div>
        <div class="fm" style="top:190px;font-size:46px" data-at="4@0.1" data-fx="fade">P<sub>A</sub> = P<sub>total</sub> × <span class="pri">X<sub>A</sub></span></div>
        <div class="fm" style="top:262px;font-size:32px;color:var(--muted)" data-at="4@0.6" data-fx="fade"><span class="pri">X<sub>A</sub></span> = moles A ÷ total moles</div>
        <div data-at="5@0.3" data-fx="fade">
          <div style="position:absolute;left:50px;top:350px;font-size:30px;font-weight:900;white-space:nowrap">2.0 atm total</div>
          <div style="position:absolute;left:50px;top:396px;width:710px;height:60px;border-radius:16px;background:#2c3145;overflow:hidden">
            <div style="position:absolute;left:0;top:0;width:532px;height:60px;background:linear-gradient(90deg,#1b7f77,#3cc7bc)"></div>
            <div style="position:absolute;left:532px;top:0;width:178px;height:60px;background:linear-gradient(90deg,#b96a26,#f3a764)" data-at="6@0.4" data-fx="grow"></div></div>
          <div style="position:absolute;left:60px;top:404px;font-size:32px;font-weight:900;color:#10131c">N<sub>2</sub></div></div>
        <div style="position:absolute;left:50px;top:480px;font-size:34px;font-weight:900;white-space:nowrap" data-at="6@0.1" data-fx="fade"><span class="pri">X<sub>O<sub>2</sub></sub> = 1/4</span> <span class="muted">so</span> P<sub>O<sub>2</sub></sub> = <span class="warm">0.50 atm</span></div></div>`,
    update(c) {
      move(c, 0.9)
      const b = c.b, dim = c.seg(b[2].start + 0.2, b[2].start + 0.6) * (1 - c.seg(b[3].start, b[3].start + 0.4))
      for (const g of all(c, '.n2')) g.style.opacity = 1 - 0.85 * dim
      const glow = c.seg(b[6].start + 0.3, b[6].start + 0.8) * (1 - c.seg(b[6].end + 0.4, b[6].end + 0.9))
      for (const g of all(c, '.o2')) g.style.filter = glow ? `drop-shadow(0 0 ${14 * glow}px rgba(243,167,100,.9))` : ''
    },
  })

  // ---------- Kelvin, always ----------
  const frac = (top, bot, fs) => `<span class="fr" style="font-size:${fs}px"><span>${top}</span><span>${bot}</span></span>`
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">Kelvin, always</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:600px" data-at="0@0.2"><h3>The #1 mistake: <span class="bad">°C</span></h3>
        <div class="fm" style="top:105px;font-size:56px">n = ${frac('PV', 'R<span class="tt warm">T</span>', 56)}</div>
        <div class="fm" style="top:300px;font-size:50px" data-at="1@0.45" data-fx="up"><span class="bad">0 °C</span>${EZ.ARR}${frac('PV', 'R × <span class="bad">0</span>', 50)} <span class="bad zz">÷ 0 !</span></div>
        <div class="zero good" style="top:490px;background:rgba(76,199,129,.14);border:2px solid var(--good)" data-at="2" data-fx="pop">Convert to kelvin first</div></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:600px" data-at="3"><h3>Bonus: molar mass</h3>
        <div class="fm" style="top:110px;font-size:70px" data-at="4" data-fx="pop"><span class="pri">M</span> = ${frac('<span class="teal">d</span>RT', 'P', 70)}</div>
        <div class="ln" style="top:350px;left:0;right:0;text-align:center" data-at="4@0.5" data-fx="fade"><span class="pri">M</span> = molar mass · <span class="teal">d</span> = density</div>
        <div class="zero" style="top:450px;background:rgba(141,141,240,.12);border:2px solid var(--primary)" data-at="5@0.2" data-fx="pop">from PV = nRT, with n = m/M</div></div>`,
    update(c) {
      const b = c.b, w = c.seg(b[1].start + 0.6, b[1].start + 1)
      c.$('.zz').style.opacity = w * (0.65 + 0.35 * Math.sin(c.t * 7))
      const h = c.seg(b[0].start + 0.5, b[0].start + 1) * (1 - c.seg(b[2].start, b[2].start + 0.5))
      c.$('.tt').style.textShadow = `0 0 ${24 * h}px rgba(243,167,100,${h})`
    },
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What volume does <span class="teal">0.500 mol</span> of an ideal gas<br>occupy at STP?</h2>
      <div class="chx" style="left:120px;top:350px" data-at="1@0.6" data-fx="pop">n = <span class="teal">0.500 mol</span></div>
      <div class="chx" style="left:410px;top:350px" data-at="1@0.75" data-fx="pop">at <span class="pri">STP</span></div>
      <div class="chx" style="left:600px;top:350px" data-at="1@0.9" data-fx="pop">V = <span class="warm">?</span></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="ans" data-at="3" data-fx="pop"><span class="good">11.2 L</span>${CHECK}</div>
      ${srow(1, 620, '4', 'At STP', '1 mol = <span class="teal">22.4 L</span>')}
      ${srow(2, 760, '5', 'Multiply', '0.500 mol × 22.4 L/mol = <span class="good">11.2 L</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><text x="230" y="102" text-anchor="middle" font-size="76" font-weight="900">PV = nRT</text>
    <text x="230" y="170" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">K = °C + 273.15</text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="30" y="60" width="400" height="56" rx="14" fill="#2c3145"/>
    <rect x="30" y="60" width="300" height="56" rx="14" fill="#3cc7bc"/><rect x="316" y="60" width="114" height="56" rx="14" fill="#f3a764"/><rect x="316" y="60" width="20" height="56" fill="#f3a764"/>
    <text x="180" y="100" text-anchor="middle" font-size="30" font-weight="900" style="fill:#10131c">A</text><text x="373" y="100" text-anchor="middle" font-size="30" font-weight="900" style="fill:#10131c">B</text>
    <text x="230" y="170" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">= P total</text></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${cube(150, 50, 130, 34)}${ball(190, 95, 12, 'teal')}${ball(240, 140, 12, 'teal')}${ball(205, 160, 12, 'teal')}${ball(255, 85, 12, 'teal')}
    <text x="330" y="130" font-size="32" font-weight="900" class="f-teal">22.4 L</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>T in <span class="warm">kelvin</span><br>R = 0.08206<br>L·atm/(mol·K)</p></div>
      <div class="card rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>P<sub>total</sub> = sum of the<br><span class="teal">partial pressures</span><br>P<sub>A</sub> = <span class="pri">X<sub>A</sub></span> × P<sub>total</sub></p></div>
      <div class="card rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>At <span class="pri">STP</span>:<br>1 mol of gas<br>= <span class="teal">22.4 L</span></p></div>`,
  })
})()
