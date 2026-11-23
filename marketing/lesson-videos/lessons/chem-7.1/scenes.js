// Pictures for chem-7.1 "What Is Equilibrium?". One EZ.scene per scene id in script.mjs.
// Words shown are the lesson's own (app/src/content/chem/u7.ts and chem/book.ts). The graphs follow
// the lesson's "equilibrium-approach" diagram and carry no numbers; particle counts are just the
// balls drawn. Ion sizes are in the right order (iodide larger than silver) but not to scale.
(() => {
  const { clamp, lerp, eio, eo, ball, sup, ARR } = EZ
  const PUR = '#8d8df0', TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', MUTED = '#a3abbd', TXT = '#eef0f7', BAD = '#f0707a'
  const css = document.createElement('style')
  css.textContent = `
    .e-note{position:absolute;left:1360px;width:490px;min-height:112px;padding:14px 20px 14px 84px;border-radius:22px;background:rgba(36,40,56,.92);border:2px solid var(--line)}
    .e-note i{position:absolute;left:22px;top:28px;width:46px;height:46px;border-radius:50%}
    .e-note b{display:block;font-size:31px;font-weight:900;line-height:1.15} .e-note span{display:block;margin-top:4px;font-size:25px;font-weight:700;line-height:1.2;color:var(--muted)}
    .e-tag{position:absolute;padding:10px 26px;border-radius:999px;font-size:32px;font-weight:800;white-space:nowrap;background:rgba(36,40,56,.92);border:2px solid var(--line);color:var(--muted)}
    .e-tag b{font-weight:900}
    .e-ctr{position:absolute;left:0;width:1920px;text-align:center}
    .e-pc{position:absolute;top:470px;width:540px;height:470px;text-align:center}
    .e-pc > svg{display:block;margin:20px auto 0} .e-pc p{margin:10px 16px 0;font-size:33px;font-weight:900;line-height:1.25;white-space:nowrap}
    .e-pc p em{font-style:normal;color:var(--muted)}
    .e-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round;fill:none}
    .e-axl{font-size:30px;font-weight:800;text-anchor:middle}
    .e-gt{font-size:38px;font-weight:900;text-anchor:middle}
    .e-eqv{stroke:#7d859c;stroke-width:3;stroke-dasharray:10 10}
    .e-crv{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:8}
    .e-feat{position:absolute;left:990px;width:810px;height:150px;padding:20px 30px 0 130px}
    .e-feat .n{position:absolute;left:30px;top:37px;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:42px;font-weight:900;line-height:76px;text-align:center}
    .e-feat b{display:block;font-size:42px;font-weight:900;line-height:1.15} .e-feat span{display:block;margin-top:6px;font-size:29px;font-weight:700;line-height:1.2;color:var(--muted)}
    .e-rc{position:absolute;left:1060px;width:740px;padding:24px 34px}
    .e-rc .q{font-size:38px;font-weight:900} .e-rc .no{position:absolute;right:40px;top:30px;font-size:64px;font-weight:900;color:var(--bad)}
    .e-rc .lab{display:block;font-size:24px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .e-rc .big{font-size:40px;font-weight:900} .e-rc .sub{display:block;margin-top:6px;font-size:29px;font-weight:700;color:var(--muted)}
    .e-rc .num{position:absolute;right:40px;top:22px;font-size:72px;font-weight:900}
    .e-quote{left:120px;top:286px;width:1680px;height:170px;display:flex;align-items:center;justify-content:center;font-size:62px;font-weight:900}
    .e-quote .q{position:relative} .e-quote .strike{position:absolute;left:-12px;right:-12px;top:52%;height:9px;border-radius:5px;background:var(--bad)}
    .e-stamp{position:absolute;right:70px;top:150px} .e-stamp div{transform:rotate(-11deg);padding:4px 30px;border:9px solid var(--bad);border-radius:18px;color:var(--bad);font-size:78px;font-weight:900;letter-spacing:.08em;background:rgba(14,16,24,.85)}
    .e-half{top:500px;width:810px;height:430px}
    .e-half .foot{position:absolute;left:0;right:0;bottom:30px;text-align:center;font-size:46px;font-weight:900}
    .e-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:36px;font-weight:800;line-height:1.2}
    .e-opt .l{position:absolute;left:26px;top:33px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .e-opt .ok{position:absolute;right:20px;top:31px;width:64px;height:64px}
    .e-pill{position:absolute;top:850px;width:810px;height:110px;border-radius:28px;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;white-space:nowrap}
    .e-rcap{top:320px;width:540px;height:560px;text-align:center} .e-rcap .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .e-rcap svg{display:block;margin:14px auto 0} .e-rcap p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.3;white-space:nowrap}
  `
  document.head.appendChild(css)

  // ---------- shared pieces ----------
  const note = (i, at, color, a, b) => `<div class="e-note" style="top:${330 + i * 132}px" data-at="${at}" data-fx="right"><i style="background:${color}"></i><b>${a}</b><span>${b}</span></div>`
  /** a double harpoon (reversible arrow) from x to x + w, centred on y */
  const harpoon = (x, y, w, sw = 6, cf = TEAL, cr = WARM) => `<path d="M${x} ${y - 9}H${x + w}l-20 -15" fill="none" stroke="${cf}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M${x + w} ${y + 9}H${x}l20 15" fill="none" stroke="${cr}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
  const harpIn = `<svg width="60" height="40" viewBox="0 0 60 40" style="vertical-align:middle;margin:0 10px">${harpoon(4, 20, 52, 4.5, TXT, TXT)}</svg>`
  const CHECK = '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const tri = (x) => { const f = x - Math.floor(x); return f < 0.5 ? f * 2 : 2 - f * 2 }

  // the lesson's approach-to-equilibrium curves (time 0..10, equilibrium reached by time 5)
  const K = 0.9
  const fwd = (t) => 0.3 + 0.62 * Math.exp(-K * t)
  const rev = (t) => 0.3 - 0.3 * Math.exp(-K * t)
  const reac = (t) => 0.92 - 0.36 * (1 - Math.exp(-K * t))
  const prod = (t) => 0.36 * (1 - Math.exp(-K * t))
  /** a curve as a path, plus how long it is up to time t (for the dash "drawing" trick) */
  function curve(fn, X, Y) {
    const pts = []
    for (let i = 0; i <= 200; i++) pts.push([X(i / 20), Y(fn(i / 20))])
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    const L = cum.at(-1)
    return {
      L, d: 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'),
      at: (t) => { const i = clamp(t * 20, 0, 200), k = Math.floor(i); return lerp(cum[k], cum[Math.min(k + 1, 200)], i - k) },
    }
  }
  const drawTo = (el, cv, t) => el.setAttribute('stroke-dashoffset', cv.L - cv.at(t))

  // ---------- intro artwork: the two graphs, faint, at the left and right edges ----------
  const iA = { X: (t) => 70 + t * 27, Y: (v) => 700 - v * 300 }, iB = { X: (t) => 1580 + t * 27, Y: (v) => 700 - v * 300 }
  const iCurves = [curve(fwd, iA.X, iA.Y), curve(rev, iA.X, iA.Y), curve(reac, iB.X, iB.Y), curve(prod, iB.X, iB.Y)]
  EZ.intro = {
    chips: [['1@0.5', 'Both ways'], ['1@0.66', 'Equal rates'], ['1@0.82', 'Constant, not equal']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <path d="M70 380V700H350M1580 380V700H1860" class="e-ax"/>
      ${iCurves.map((cv, i) => `<path d="${cv.d}" class="e-crv ic${i}" stroke="${i % 2 ? WARM : PUR}" stroke-dasharray="${cv.L} ${cv.L * 3}" stroke-dashoffset="${cv.L}"/>`).join('')}
    </svg>`,
    update(c) {
      const t = 10 * eio(c.seg(c.sc.start + 0.3, c.sc.start + 3.6))
      iCurves.forEach((cv, i) => drawTo(c.$('.ic' + i), cv, t))
    },
  }

  // ---------- hook: the escalator ----------
  const person = (col) => `<circle cy="-50" r="14" fill="${col}"/><rect x="-14" y="-33" width="28" height="33" rx="11" fill="${col}"/>`
  const UPA = [560, 900], UPB = [880, 440], DNA = [660, 900], DNB = [980, 440]
  EZ.scene('hook', {
    html: `<div class="kicker" data-at="in" data-fx="left">Picture this</div><h2 class="h1" data-at="0">A busy escalator</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <line x1="140" y1="900" x2="660" y2="900" stroke="#7d859c" stroke-width="10" stroke-linecap="round"/>
          <line x1="880" y1="440" x2="1280" y2="440" stroke="#7d859c" stroke-width="10" stroke-linecap="round"/>
          <line x1="${UPA[0]}" y1="${UPA[1]}" x2="${UPB[0]}" y2="${UPB[1]}" stroke="#2c3145" stroke-width="34" stroke-linecap="round"/>
          <line x1="${UPA[0]}" y1="${UPA[1]}" x2="${UPB[0]}" y2="${UPB[1]}" stroke="${TEAL}" stroke-width="4" opacity=".7"/>
          <line x1="${DNA[0]}" y1="${DNA[1]}" x2="${DNB[0]}" y2="${DNB[1]}" stroke="#2c3145" stroke-width="34" stroke-linecap="round"/>
          <line x1="${DNA[0]}" y1="${DNA[1]}" x2="${DNB[0]}" y2="${DNB[1]}" stroke="${WARM}" stroke-width="4" opacity=".7"/>
          <text x="300" y="955" class="e-axl f-muted">lower floor</text><text x="1080" y="495" class="e-axl f-muted">upper floor</text>
          ${[230, 300, 370, 440].map((x) => `<g transform="translate(${x} 895)">${person('#aab1c4')}</g>`).join('')}
          ${[1010, 1080, 1150, 1220].map((x) => `<g transform="translate(${x} 435)">${person('#aab1c4')}</g>`).join('')}
        </g>
        <g data-at="1@0.2" data-fx="fade">
          <line x1="560" y1="720" x2="620" y2="635" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/><text x="545" y="700" text-anchor="end" font-size="40" font-weight="900" class="f-teal">up</text>
          <line x1="1000" y1="620" x2="940" y2="705" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/><text x="1020" y="690" font-size="40" font-weight="900" class="f-warm">down</text>
        </g>
        ${[0, 1, 2, 3].map((i) => `<g class="pu${i}">${person(TEAL)}</g><g class="pd${i}">${person(WARM)}</g>`).join('')}
        <g data-at="2@0.3" data-fx="pop"><rect x="200" y="760" width="300" height="56" rx="28" fill="rgba(60,199,188,.16)" stroke="${TEAL}" stroke-width="2"/><text x="350" y="799" text-anchor="middle" font-size="29" font-weight="900" class="f-teal">same number</text></g>
        <g data-at="2@0.5" data-fx="pop"><rect x="980" y="300" width="300" height="56" rx="28" fill="rgba(60,199,188,.16)" stroke="${TEAL}" stroke-width="2"/><text x="1130" y="339" text-anchor="middle" font-size="29" font-weight="900" class="f-teal">same number</text></g>
      </svg>
      ${note(0, '1', TEAL, 'Up and down', 'at the same rate')}
      ${note(1, '2', PUR, 'Each floor', 'the same number of people')}
      ${note(2, '3', WARM, 'Still moving', 'nobody has stopped')}
      <div class="e-note" style="top:740px;border-color:var(--accent);background:rgba(60,199,188,.14)" data-at="4" data-fx="pop"><i style="background:${TEAL}"></i><b class="teal">Dynamic equilibrium</b><span>moving, but balanced</span></div>`,
    update(c) {
      const t = c.t, show = c.seg(c.b[0].start + 0.6, c.b[0].start + 1.2)
      for (let i = 0; i < 4; i++) {
        const s = (t * 0.16 + i / 4) % 1, fade = show * Math.min(1, s / 0.08, (1 - s) / 0.08)
        const u = c.$('.pu' + i), d = c.$('.pd' + i)
        u.setAttribute('transform', `translate(${lerp(UPA[0], UPB[0], s)} ${lerp(UPA[1], UPB[1], s) - 14})`); u.style.opacity = fade
        d.setAttribute('transform', `translate(${lerp(DNB[0], DNA[0], s)} ${lerp(DNB[1], DNA[1], s) - 14})`); d.style.opacity = fade
      }
    },
  })

  // ---------- reversible processes ----------
  const water = (cls) => `<rect x="60" y="150" width="340" height="100" rx="14" fill="rgba(60,199,188,.25)" stroke="${TEAL}" stroke-width="3"/>
    <line x1="140" y1="140" x2="140" y2="50" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/>
    <line x1="320" y1="50" x2="320" y2="140" stroke="${WARM}" stroke-width="6" marker-end="url(#mk-warm)"/>
    <g class="${cls}u">${ball(0, 0, 15, 'teal')}</g><g class="${cls}d">${ball(0, 0, 15, 'teal')}</g>`
  const crystal = (x0, y0, n, m, r) => { let s = ''; for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) s += ball(x0 + i * r * 2.1, y0 + j * r * 2.1, r, (i + j) % 2 ? 'pur' : 'gray'); return s }
  EZ.scene('twoway', {
    html: `<div class="kicker" data-at="in" data-fx="left">Reversible processes</div><h2 class="h1" data-at="0">Many processes run both ways</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <text x="690" y="398" text-anchor="end" font-size="52" font-weight="900" class="f-pri">reactants</text>
          ${harpoon(740, 382, 440, 8)}
          <text x="1230" y="398" font-size="52" font-weight="900" class="f-warm">products</text>
        </g>
        <text x="960" y="340" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="5@0.05" data-fx="fade">forward</text>
        <text x="960" y="452" text-anchor="middle" font-size="32" font-weight="900" class="f-warm" data-at="5@0.55" data-fx="fade">reverse</text>
      </svg>
      <div class="card e-pc" style="left:120px" data-at="2"><svg width="460" height="270" viewBox="0 0 460 270">${water('ev')}</svg>
        <p>evaporation ${harpIn}<br>condensation</p></div>
      <div class="card e-pc" style="left:690px" data-at="3"><svg width="460" height="270" viewBox="0 0 460 270">
        <rect x="40" y="40" width="380" height="216" rx="16" fill="rgba(141,141,240,.08)" stroke="#5a6080" stroke-width="3"/>
        ${crystal(150, 200, 4, 2, 17)}
        <g class="dsu">${ball(0, 0, 17, 'pur')}</g><g class="dsd">${ball(0, 0, 17, 'gray')}</g>
        <line x1="100" y1="170" x2="100" y2="80" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/><line x1="380" y1="80" x2="380" y2="170" stroke="${WARM}" stroke-width="6" marker-end="url(#mk-warm)"/></svg>
        <p>dissolving ${harpIn}<br>precipitating</p></div>
      <div class="card e-pc" style="left:1260px" data-at="4"><svg width="460" height="270" viewBox="0 0 460 270">
        ${ball(110, 80, 40, 'pur')}${ball(350, 80, 40, 'teal')}<g class="hop1">${ball(0, 0, 17, 'warm', sup('H', '+'), 16)}</g>
        <text x="230" y="150" text-anchor="middle" font-size="26" font-weight="800" class="f-warm">proton transfer</text>
        ${ball(110, 210, 40, 'pur')}${ball(350, 210, 40, 'teal')}<g class="hop2">${ball(0, 0, 14, 'gold', sup('e', '−'), 16)}</g>
        <text x="230" y="268" text-anchor="middle" font-size="26" font-weight="800" class="f-gold">electron transfer</text></svg>
        <p>acid–base<br><em>and</em> redox</p></div>`,
    update(c) {
      const t = c.t, s = (t * 0.45) % 1, sw = Math.sin(Math.PI * s)
      c.$('.evu').setAttribute('transform', `translate(200 ${lerp(170, 40, s)})`); c.$('.evu').style.opacity = sw
      c.$('.evd').setAttribute('transform', `translate(260 ${lerp(40, 170, s)})`); c.$('.evd').style.opacity = sw
      c.$('.dsu').setAttribute('transform', `translate(${lerp(150, 100, s)} ${lerp(165, 60, s)})`); c.$('.dsu').style.opacity = sw
      c.$('.dsd').setAttribute('transform', `translate(${lerp(380, 300, s)} ${lerp(60, 165, s)})`); c.$('.dsd').style.opacity = sw
      const h = 0.5 - 0.5 * Math.cos(Math.PI * tri(t * 0.35))
      c.$('.hop1').setAttribute('transform', `translate(${lerp(160, 300, h)} 80)`)
      const e = 0.5 - 0.5 * Math.cos(Math.PI * tri(t * 0.35 + 0.5))
      c.$('.hop2').setAttribute('transform', `translate(${lerp(160, 300, e)} 210)`)
    },
  })

  // ---------- which way? compare the rates ----------
  const slot = (side, k) => [(side ? 1220 : 180) + 80 + (k % 5) * 92, 520 + Math.floor(k / 5) * 104]
  EZ.scene('rates', {
    html: `<div class="kicker" data-at="in" data-fx="left">Which way?</div><h2 class="h1" data-at="0">Compare the rates</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade">
          <rect x="180" y="440" width="520" height="290" rx="26" fill="rgba(141,141,240,.08)" stroke="${PUR}" stroke-width="3"/>
          <rect x="1220" y="440" width="520" height="290" rx="26" fill="rgba(243,167,100,.08)" stroke="${WARM}" stroke-width="3"/>
          <text x="440" y="412" class="e-gt f-pri">Reactants</text><text x="1480" y="412" class="e-gt f-warm">Products</text>
          <line class="fa" x1="745" y1="535" x2="1170" y2="535" stroke="${TEAL}" marker-end="url(#mk-teal)"/>
          <line class="ra" x1="1175" y1="640" x2="750" y2="640" stroke="${WARM}" marker-end="url(#mk-warm)"/>
          <text x="960" y="495" class="e-axl f-teal">forward rate</text><text x="960" y="705" class="e-axl f-warm">reverse rate</text>
        </g>
        <g data-at="0@0.5" data-fx="fade">${Array.from({ length: 10 }, (_, k) => `<g class="m${k}">${ball(0, 0, 34, 'pur')}<g class="w">${ball(0, 0, 34, 'warm')}</g></g>`).join('')}</g>
      </svg>
      <div class="e-ctr" style="top:790px" data-at="1@0.3" data-out="2@0.5" data-fx="pop"><span class="e-tag" style="position:static;display:inline-block;border-color:var(--accent);color:var(--accent)">forward &gt; reverse ${ARR} net: <b>reactants into products</b></span></div>
      <div class="e-ctr" style="top:790px" data-at="2@0.5" data-out="3" data-fx="pop"><span class="e-tag" style="position:static;display:inline-block;border-color:var(--primary);color:var(--primary)">until the rates are <b>equal</b></span></div>
      <div class="e-ctr" style="top:790px" data-at="3@0.3" data-out="4" data-fx="pop"><span class="e-tag" style="position:static;display:inline-block;border-color:var(--warm);color:var(--warm)">reverse &gt; forward ${ARR} net: <b>products back into reactants</b></span></div>
      <div class="banner" style="top:880px" data-at="4@0.2" data-fx="pop">Rates <span class="teal">equal</span> ${ARR} the system is at <span class="warm">equilibrium</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      // stroke widths follow the rates: forward faster, then equal, then reverse faster, then equal
      const st = (i) => eio(c.seg(b[i].start + 0.1, b[i].start + 0.8))
      let fw = lerp(9, 16, st(1)), rw = lerp(9, 5, st(1))
      if (t > b[2].start) { fw = lerp(16, 9, st(2)); rw = lerp(5, 9, st(2)) }
      if (t > b[3].start) { fw = lerp(9, 5, st(3)); rw = lerp(9, 16, st(3)) }
      if (t > b[4].start) { fw = lerp(5, 9, st(4)); rw = lerp(16, 9, st(4)) }
      c.$('.fa').setAttribute('stroke-width', fw); c.$('.ra').setAttribute('stroke-width', rw)
      // particle moves: [ball, time, +1 forward / -1 back]
      const d1 = (b[1].end - b[1].start - 0.8) / 5
      const ev = [[1, b[1].start + 0.6, 1], [2, b[1].start + 0.6 + d1, 1], [3, b[1].start + 0.6 + 2 * d1, 1], [4, b[1].start + 0.6 + 3 * d1, 1], [5, b[1].start + 0.6 + 4 * d1, 1],
        [6, b[2].start + 0.9, 1], [1, b[2].start + 0.9, -1],
        [5, b[3].start + 0.8, -1], [4, b[3].start + 2.0, -1],
        [7, b[4].start + 1.0, 1], [3, b[4].start + 1.0, -1]]
      for (let k = 0; k < 10; k++) {
        let side = k === 0 ? 1 : 0, x, y, w
        ;[x, y] = slot(side, k); w = side
        for (const [m, te, dir] of ev) {
          if (m !== k || t < te) continue
          const p = eio(clamp((t - te) / 0.9))
          const [x0, y0] = slot(side, k), [x1, y1] = slot(dir > 0 ? 1 : 0, k)
          x = lerp(x0, x1, p); y = lerp(y0, y1, p) + (dir > 0 ? -1 : 1) * 150 * Math.sin(Math.PI * p)
          side = dir > 0 ? 1 : 0; w = dir > 0 ? p : 1 - p
        }
        c.$('.m' + k).setAttribute('transform', `translate(${x} ${y})`)
        c.$(`.m${k} .w`).style.opacity = w
      }
    },
  })

  // ---------- approaching equilibrium: rates, then concentrations ----------
  const A = { X: (t) => 170 + t * 68, Y: (v) => 820 - v * 400 }, B = { X: (t) => 1050 + t * 68, Y: (v) => 820 - v * 400 }
  const cF = curve(fwd, A.X, A.Y), cR = curve(rev, A.X, A.Y), cA = curve(reac, B.X, B.Y), cP = curve(prod, B.X, B.Y)
  const panel = (P, title, at) => `<g data-at="${at}" data-fx="fade"><path d="M${P.X(0)} 390V820H${P.X(10) + 10}" class="e-ax"/>
    <text x="${P.X(5)}" y="365" class="e-gt">${title}</text><text x="${P.X(5)}" y="866" class="e-axl f-muted">time</text>
    <line x1="${P.X(5)}" y1="400" x2="${P.X(5)}" y2="820" class="e-eqv"/><text x="${P.X(5) + 12}" y="420" font-size="27" font-weight="800" class="f-muted">equilibrium</text></g>`
  const trail = (cv, cls, col) => `<path d="${cv.d}" class="e-crv ${cls}" stroke="${col}" stroke-dasharray="${cv.L} ${cv.L * 3}" stroke-dashoffset="${cv.L}"/>`
  EZ.scene('approach', {
    html: `<div class="kicker" data-at="in" data-fx="left">Getting there</div><h2 class="h1" data-at="0">Approaching equilibrium</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        ${panel(A, 'Rate', '1')}
        ${trail(cF, 'tf', PUR)}${trail(cR, 'tr', WARM)}
        <g data-at="1@0.3" data-fx="pop"><circle cx="${A.X(0)}" cy="${A.Y(fwd(0))}" r="13" fill="${PUR}"/></g>
        <g data-at="1@0.6" data-fx="pop"><circle cx="${A.X(0)}" cy="${A.Y(0)}" r="13" fill="${WARM}"/></g>
        <text x="${A.X(0.5)}" y="${A.Y(fwd(0)) - 6}" font-size="30" font-weight="900" class="f-pri" data-at="1@0.3" data-fx="fade">forward: high</text>
        <text x="${A.X(0.5)}" y="${A.Y(0) - 20}" font-size="30" font-weight="900" class="f-warm" data-at="1@0.6" data-fx="fade">reverse: zero</text>
        <g data-at="3@0.3" data-fx="pop"><circle cx="${A.X(5)}" cy="${A.Y(0.302)}" r="16" fill="none" stroke="${TEAL}" stroke-width="5"/></g>
        <text x="${A.X(7.5)}" y="${A.Y(0.3) - 34}" text-anchor="middle" font-size="32" font-weight="900" class="f-teal" data-at="3@0.4" data-fx="fade">rates equal</text>
        ${panel(B, 'Concentration', '4')}
        ${trail(cA, 'ta', PUR)}${trail(cP, 'tp', WARM)}
        <text x="${B.X(0.25)}" y="${B.Y(0.92) - 22}" font-size="30" font-weight="900" class="f-pri" data-at="5@0.1" data-fx="fade">[reactant]</text>
        <text x="${B.X(2.1)}" y="${B.Y(prod(2.1)) + 44}" font-size="30" font-weight="900" class="f-warm" data-at="5@0.3" data-fx="fade">[product]</text>
        <g data-at="6@0.2" data-fx="fade"><line x1="${B.X(9.3)}" y1="${B.Y(0.56) + 12}" x2="${B.X(9.3)}" y2="${B.Y(0.36) - 12}" stroke="${TXT}" stroke-width="5" marker-start="url(#mk-text)" marker-end="url(#mk-text)"/>
          <text x="${B.X(9.0)}" y="${B.Y(0.46) + 11}" text-anchor="end" font-size="30" font-weight="900">different levels</text></g>
        <g data-at="7@0.1" data-fx="fade"><path d="M${B.X(5)} ${B.Y(0.56) - 26}V${B.Y(0.56) - 40}H${B.X(10)}V${B.Y(0.56) - 26}" fill="none" stroke="${TEAL}" stroke-width="5"/>
          <text x="${B.X(7.5)}" y="${B.Y(0.56) - 56}" text-anchor="middle" font-size="32" font-weight="900" class="f-teal">flat = constant</text></g>
      </svg>
      <div class="banner" style="top:910px" data-at="7@0.3" data-fx="pop">Equilibrium: the curves go <span class="teal">flat</span>, they don’t have to <span class="warm">meet</span></div>`,
    update(c) {
      const b = c.b
      const tA = c.t < b[3].start ? 2.5 * eio(c.seg(b[2].start + 0.2, b[2].end)) : lerp(2.5, 10, eio(c.seg(b[3].start, b[3].start + 0.75 * (b[3].end - b[3].start))))
      drawTo(c.$('.tf'), cF, tA); drawTo(c.$('.tr'), cR, tA)
      const tB = 10 * eio(c.seg(b[5].start + 0.1, b[5].end))
      drawTo(c.$('.ta'), cA, tB); drawTo(c.$('.tp'), cP, tB)
    },
  })

  // ---------- three things that are true at equilibrium ----------
  const BOX = Array.from({ length: 12 }, (_, i) => [250 + (i % 4) * 165 + (Math.floor(i / 4) % 2) * 50, 420 + Math.floor(i / 4) * 110])
  const START = [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1] // 1 = product (warm): 7 reactants, 5 products
  EZ.scene('features', {
    html: `<div class="kicker" data-at="in" data-fx="left">At equilibrium</div><h2 class="h1" data-at="0">Three things are true</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><rect x="160" y="330" width="760" height="420" rx="30" fill="rgba(36,40,56,.6)" stroke="#5a6080" stroke-width="3"/></g>
        ${BOX.map(([x, y], i) => `<g data-at="0@0.4" data-fx="pop"><g class="q${i}" transform="translate(${x} ${y})">${ball(0, 0, 36, 'pur')}<g class="w">${ball(0, 0, 36, 'warm')}</g><circle class="rg" r="44" fill="none" stroke="${TEAL}" stroke-width="5" opacity="0"/></g></g>`).join('')}
        <g data-at="1@0.6" data-fx="fade"><text x="340" y="810" class="e-gt f-pri">reactants: 7</text><text x="740" y="810" class="e-gt f-warm">products: 5</text></g>
      </svg>
      <div class="card e-feat" style="top:320px;height:170px" data-at="1" data-fx="right"><div class="n">1</div><b>No observable change</b><span>concentrations and partial pressures stay constant</span></div>
      <div class="card e-feat" style="top:510px" data-at="2" data-fx="right"><div class="n">2</div><b>Both are present</b><span>reactants and products</span></div>
      <div class="card e-feat" style="top:680px" data-at="3" data-fx="right"><div class="n">3</div><b class="teal">Dynamic</b><span>both reactions keep happening, at equal rates</span></div>
      <div class="banner" style="top:880px" data-at="4" data-fx="pop">Particles keep changing ${ARR} the totals <span class="teal">hold steady</span></div>`,
    update(c) {
      const t = c.t, t0 = c.b[3].start + 0.6, gap = 1.7
      const kind = START.slice(), last = new Array(12).fill(-9)
      const n = t < t0 ? 0 : Math.floor((t - t0) / gap) + 1
      for (let s = 0; s < n; s++) {
        const R = kind.map((k, i) => (k ? -1 : i)).filter((i) => i >= 0), P = kind.map((k, i) => (k ? i : -1)).filter((i) => i >= 0)
        const a = R[(s * 5 + 2) % R.length], p = P[(s * 3 + 1) % P.length], ts = t0 + s * gap
        kind[a] = 1; kind[p] = 0; last[a] = ts; last[p] = ts
      }
      for (let i = 0; i < 12; i++) {
        const q = clamp((t - last[i]) / 0.5)
        c.$(`.q${i} .w`).style.opacity = kind[i] ? q : 1 - q
        const rg = c.$(`.q${i} .rg`), r = clamp((t - last[i]) / 0.9)
        rg.style.opacity = r < 1 ? 1 - r : 0; rg.setAttribute('r', 40 + 24 * r)
      }
    },
  })

  // ---------- the sealed bottle ----------
  const BOT = 'M500 340V400C500 440 300 440 300 490V900Q300 930 330 930H770Q800 930 800 900V490C800 440 600 440 600 400V340Z'
  EZ.scene('bottle', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Classic example</div><h2 class="h1" data-at="0">A sealed bottle of water</h2>
      <svg class="full" viewBox="0 0 1920 1080"><defs><clipPath id="e-bclip"><path d="${BOT}"/></clipPath></defs>
        <g data-at="1" data-fx="fade">
          <g clip-path="url(#e-bclip)"><rect class="wat" x="290" width="520" height="400" fill="rgba(60,199,188,.3)"/><line class="surf" x1="290" x2="810" stroke="${TEAL}" stroke-width="4"/></g>
          <path d="${BOT}" fill="none" stroke="#c9cee0" stroke-width="6"/>
          <rect x="482" y="300" width="136" height="44" rx="10" fill="#646c82"/><text x="550" y="290" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">sealed</text>
          ${Array.from({ length: 6 }, (_, i) => `<g class="v${i}">${ball(0, 0, 13, 'teal')}</g>`).join('')}
          <g class="eu">${ball(0, 0, 13, 'teal')}</g><g class="ed">${ball(0, 0, 13, 'teal')}</g>
          <text x="550" y="985" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">constant temperature</text>
        </g>
        <g data-at="2@0.5" data-fx="fade"><line x1="290" y1="730" x2="840" y2="730" stroke="${TXT}" stroke-width="3" stroke-dasharray="10 10"/><text x="850" y="740" font-size="28" font-weight="900">level holds</text></g>
        <g data-at="4@0.1" data-fx="fade"><line x1="250" y1="760" x2="250" y2="560" stroke="${TEAL}" stroke-width="7" marker-end="url(#mk-teal)"/><text x="235" y="660" text-anchor="end" font-size="28" font-weight="900" class="f-teal">evaporating</text>
          <line x1="850" y1="520" x2="850" y2="680" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/><text x="868" y="610" font-size="28" font-weight="900" class="f-warm">condensing</text></g>
      </svg>
      <div class="card e-rc" style="top:330px;height:130px" data-at="3"><div class="q">Has evaporation stopped?</div><span class="sub">at the particle level</span><div class="no" data-at="3@0.55" data-fx="pop">No.</div></div>
      <div class="card e-rc" style="top:490px;height:250px" data-at="4"><span class="lab">rates</span>
        <svg width="670" height="170" viewBox="0 0 670 170">
          <text x="0" y="56" font-size="32" font-weight="900" class="f-teal">evaporating</text><rect x="230" y="30" width="400" height="34" rx="17" fill="${TEAL}" data-at="4@0.3" data-fx="grow"/>
          <text x="0" y="136" font-size="32" font-weight="900" class="f-warm">condensing</text><rect x="230" y="110" width="400" height="34" rx="17" fill="${WARM}" data-at="4@0.55" data-fx="grow"/>
        </svg></div>
      <div class="card e-rc" style="top:770px;height:150px;border-color:var(--accent);background:rgba(60,199,188,.14)" data-at="5"><span class="big teal">Dynamic equilibrium</span><span class="sub">the molecules have not stopped moving</span></div>`,
    update(c) {
      const t = c.t, b = c.b
      const lev = lerp(700, 730, eio(c.seg(b[1].start, b[2].start + 0.6)))
      c.$('.wat').setAttribute('y', lev); c.$('.surf').setAttribute('y1', lev); c.$('.surf').setAttribute('y2', lev)
      for (let i = 0; i < 6; i++) {
        const x = 340 + 420 * tri(t * (0.07 + i * 0.011) + i * 0.37), y = 500 + (lev - 560) * tri(t * (0.09 + i * 0.013) + i * 0.21)
        c.$('.v' + i).setAttribute('transform', `translate(${x} ${y})`)
      }
      const s = (t * 0.42) % 1, f = Math.sin(Math.PI * s)
      c.$('.eu').setAttribute('transform', `translate(420 ${lerp(lev + 10, 520, s)})`); c.$('.eu').style.opacity = f
      c.$('.ed').setAttribute('transform', `translate(680 ${lerp(520, lev + 10, s)})`); c.$('.ed').style.opacity = f
    },
  })

  // ---------- evidence: radioactive iodide ----------
  const SOL = [[300, 540], [430, 500], [560, 560], [700, 510], [810, 580], [350, 680], [480, 640], [620, 700], [760, 660], [420, 770]]
  // solution slots: even = iodide, odd = silver
  const HOT = [[680, 870], [726, 870], [772, 870], [703, 826], [749, 826]] // added solid: [0],[2],[4] iodide
  const SWAPS = [[0, 2], [2, 4], [4, 6]] // [hot iodide slot, solution iodide slot]
  const ion = (g, lab, r) => ball(0, 0, r, g, lab, r * 0.75)
  const IOD = (g) => ion(g, sup('I', '−'), 25), AG = () => ion('gray', sup('Ag', '+'), 18)
  EZ.scene('evidence', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The evidence</div><h2 class="h1" data-at="0">Do the reactions really keep going?</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <rect x="200" y="450" width="700" height="470" fill="rgba(60,199,188,.12)"/>
          <path d="M200 380V900Q200 920 220 920H880Q900 920 900 900V380" fill="none" stroke="#c9cee0" stroke-width="6"/>
          <text x="550" y="364" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">saturated AgI solution</text>
          ${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${250 + i * 46} 870)">${i % 2 ? AG() : IOD('pur')}</g>`).join('')}
          ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${273 + i * 46} 826)">${i % 2 ? IOD('pur') : AG()}</g>`).join('')}
          ${SOL.map(([x, y], i) => (i % 2 ? `<g transform="translate(${x} ${y})">${AG()}</g>` : '')).join('')}
        </g>
        ${SOL.map(([x, y], i) => (i % 2 ? '' : `<g data-at="1" data-fx="fade"><g class="si${i}" transform="translate(${x} ${y})">${IOD('pur')}</g></g>`)).join('')}
        <g class="hot">
          <circle class="glow" cx="726" cy="850" r="80" fill="${GOLD}" opacity=".12"/>
          ${HOT.map(([x, y], i) => (i % 2 ? `<g transform="translate(${x} ${y})">${AG()}</g>` : `<g class="hi${i}" transform="translate(${x} ${y})">${IOD('gold')}</g>`)).join('')}
        </g>
        <text x="726" y="975" text-anchor="middle" font-size="28" font-weight="900" class="f-gold" data-at="1@0.75" data-fx="fade">solid AgI made with radioactive iodine</text>
      </svg>
      <div class="card e-rc" style="top:330px;height:150px" data-at="2"><span class="lab">radioactive iodide dissolved</span><span class="big gold">shows up in the solution</span><div class="num gold hn">0</div></div>
      <div class="card e-rc" style="top:510px;height:150px" data-at="3"><span class="lab">total dissolved iodide</span><span class="big">does not change</span><div class="num ti">5</div></div>
      <div class="card e-rc" style="top:690px;height:120px" data-at="4"><span class="big"><span class="teal">dissolving</span> = <span class="warm">precipitating</span></span><span class="sub" style="margin-top:2px">equal amounts, at the same time</span></div>
      <div class="card e-rc" style="top:840px;height:110px;padding-top:28px;border-color:var(--accent);background:rgba(60,199,188,.14)" data-at="5"><span class="big teal" style="font-size:36px">They continue. They simply balance.</span></div>`,
    update(c) {
      const b = c.b, t = c.t
      // the radioactive solid drops in
      const drop = eio(c.seg(b[1].start + 0.5 * (b[1].end - b[1].start), b[1].start + 0.5 * (b[1].end - b[1].start) + 0.9))
      c.$('.hot').setAttribute('transform', `translate(0 ${lerp(-480, 0, drop)})`); c.$('.hot').style.opacity = c.seg(b[1].start + 0.45 * (b[1].end - b[1].start), b[1].start + 0.5 * (b[1].end - b[1].start))
      const times = [b[2].start + 0.3, b[2].start + 1.5, b[3].start + 0.4]
      let hot = 0
      SWAPS.forEach(([h, s], j) => {
        const p = eio(clamp((t - times[j]) / 1.3)), lift = 90 * Math.sin(Math.PI * p)
        const [hx, hy] = HOT[h], [sx, sy] = SOL[s]
        c.$('.hi' + h).setAttribute('transform', `translate(${lerp(hx, sx, p)} ${lerp(hy, sy, p) - lift})`)
        c.$('.si' + s).setAttribute('transform', `translate(${lerp(sx, hx, p)} ${lerp(sy, hy, p) + lift * 0.3})`)
        if (p >= 0.5) hot++
      })
      c.$('.hn').textContent = hot
      c.$('.glow').style.opacity = 0.12 + 0.06 * Math.sin(t * 3)
    },
  })

  // ---------- the trap ----------
  const flat = `<svg width="600" height="230" viewBox="0 0 600 230"><path d="M40 20V210H580" class="e-ax"/>
    <path d="M40 40C120 90 200 110 300 112H570" class="e-crv" stroke="${PUR}"/><path d="M40 208C120 160 200 150 300 150H570" class="e-crv" stroke="${WARM}"/></svg>`
  const meet = `<svg width="600" height="230" viewBox="0 0 600 230"><path d="M40 20V210H580" class="e-ax"/>
    <path d="M40 40C120 120 200 128 300 130H570" class="e-crv" stroke="${PUR}"/><path d="M40 208C120 150 200 132 300 130H570" class="e-crv" stroke="${WARM}"/>
    <circle cx="300" cy="130" r="14" fill="none" stroke="${TEAL}" stroke-width="5"/></svg>`
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The #1 myth</div>
      <div class="card e-quote" data-at="1"><span class="q">“At equilibrium, [reactants] = [products]”<i class="strike" data-at="2" data-fx="grow" data-dur="0.35"></i></span></div>
      <div class="e-stamp" data-at="2+0.15" data-fx="pop"><div>MYTH</div></div>
      <div class="card e-half" style="left:120px" data-at="3"><h3>Concentrations</h3>${flat}<div class="foot"><span class="teal">constant</span>, not equal</div></div>
      <div class="card e-half" style="left:990px" data-at="4"><h3>Rates</h3>${meet}<div class="foot">the <span class="warm">rates</span> are equal</div></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['The reaction has stopped', '[reactants] = [products]', 'The forward and reverse rates are equal', 'Only products are present']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">Which is <span class="teal">true</span> for a system at chemical equilibrium?</h2>
      ${OPTS.map((o, i) => `<div class="e-opt t${i}" style="left:${120 + (i % 2) * 860}px;top:${330 + Math.floor(i / 2) * 150}px" data-at="${i + 2}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 2 ? CHECK : ''}<span>${o}</span></div>`).join('')}
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:680px;font-size:46px" data-at="8" data-fx="pop">Dynamic: both reactions continue at <span class="teal">equal rates</span></div>
      <div class="e-pill" style="left:120px;border-color:var(--accent);background:rgba(60,199,188,.12)" data-at="9" data-fx="pop">Concentrations:&nbsp;<span class="teal">constant</span></div>
      <div class="e-pill" style="left:990px;border-color:var(--warm);background:rgba(243,167,100,.12)" data-at="9@0.5" data-fx="pop">Usually&nbsp;<span class="warm">not equal</span></div>`,
    update(c) {
      const b = c.b, t0 = b[6].start + 0.3, t1 = b[7].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[7].start + 0.5, b[7].start + 0.95))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.t' + i)
        if (i === 2) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M30 20V190H440" class="e-ax"/>
    <path d="M30 34C110 110 180 116 260 118H430" class="e-crv" stroke="${PUR}"/><path d="M30 188C110 140 180 120 260 118H430" class="e-crv" stroke="${WARM}"/>
    <circle cx="260" cy="118" r="13" fill="none" stroke="${TEAL}" stroke-width="5"/></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M30 20V190H440" class="e-ax"/>
    <path d="M30 34C110 80 180 92 260 94H430" class="e-crv" stroke="${PUR}"/><path d="M30 188C110 150 180 142 260 140H430" class="e-crv" stroke="${WARM}"/></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210">${ball(90, 105, 46, 'pur')}${harpoon(160, 105, 140, 7)}${ball(370, 105, 46, 'warm')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card e-rcap" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Equilibrium:<br><span class="pri">forward rate</span> =<br><span class="warm">reverse rate</span></p></div>
      <div class="card e-rcap" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Concentrations are<br><span class="teal">constant</span>,<br>not equal</p></div>
      <div class="card e-rcap" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p><span class="teal">Dynamic</span>:<br>both reactions<br>keep going</p></div>`,
  })
})()
