// Pictures for chem-8.5 "Titration Curves". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u8.ts, chem/book.ts): the five landmarks of a
// weak acid + strong base curve; pH at equivalence for the three titration types; strong vs. weak acid curves;
// the pKa example (30.0 mL, 15.0 mL, pH 4.20, Ka 6.3 x 10^-5); the 0.100 M concentration check; polyprotic
// acids; the H2CO3 question. Curve shapes are computed from a charge balance, but no axis value is shown except
// those the lesson gives (7, 4.20, 15.0 mL, 30.0 mL).
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-tag{position:absolute;font-size:30px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:36px;right:24px;font-size:36px;font-weight:900;white-space:nowrap}
    .x-row small{font-size:28px;font-weight:800;color:var(--muted)}
    .x-big{position:absolute;left:0;right:0;text-align:center;font-size:64px;font-weight:900;white-space:nowrap}
    .x-why{position:absolute;left:0;right:0;text-align:center;font-size:28px;font-weight:800;line-height:1.3;color:var(--muted);white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:32px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-eqn{position:absolute;left:120px;top:870px;width:1680px;height:110px;border-radius:28px;background:rgba(36,40,56,.92);border:2px solid var(--line);text-align:center;font-size:48px;font-weight:900;line-height:106px;white-space:nowrap}
    .x-tile{position:absolute;top:380px;width:390px;height:210px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tile .l{position:absolute;left:22px;top:16px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;font-weight:900;line-height:52px;color:var(--muted)}
    .x-tile .f{margin-top:100px;font-size:54px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tile .ok{position:absolute;right:18px;top:14px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', WARM = '#f3a764', GOLD = '#f2c443', PRI = '#8d8df0', GOOD = '#4cc781'
  const AM = 'A<sup>−</sup>', OH = 'OH<sup>−</sup>', PKA = 'pK<sub>a</sub>', KA = 'K<sub>a</sub>'
  const NH3 = 'NH<sub>3</sub>', NH4 = 'NH<sub>4</sub><sup>+</sup>', H2CO3 = 'H<sub>2</sub>CO<sub>3</sub>', H3PO4 = 'H<sub>3</sub>PO<sub>4</sub>'
  const CHECK = '<svg viewBox="0 0 64 64" style="display:block;width:100%;height:100%"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  // ---------- curve maths: pH from a charge balance (30 mL of 0.1 M acid, 0.1 M NaOH; equivalence at 30 mL) ----------
  const solve = (V, ks) => {
    const Vt = 30 + V, Na = 0.1 * V / Vt, CA = 0.1 * 30 / Vt
    let lo = -14.5, hi = 1
    for (let i = 0; i < 50; i++) {
      const m = (lo + hi) / 2, h = 10 ** m
      let t = 1, den = 1, num = 0
      ks.forEach((k, j) => { t *= k / h; den += t; num += (j + 1) * t })
      if (h + Na - 1e-14 / h - CA * num / den > 0) hi = m; else lo = m
    }
    return -(lo + hi) / 2
  }
  const sample = (fn, vmax, n = 400) => Array.from({ length: n + 1 }, (_, i) => { const v = vmax * i / n; return [v, fn(v)] })
  const WK = sample((v) => solve(v, [10 ** -4.2]), 50)
  const ST = sample((v) => solve(v, [1e8]), 50)
  const WB = WK.map(([v, p]) => [v, 14 - p])
  const DP = sample((v) => solve(v, [10 ** -3.5, 1e-8]), 80, 500)
  const phAt = (pts, v) => { const i = pts.findIndex((q) => q[0] >= v); if (i <= 0) return pts[Math.max(i, 0)][1]; const [a, b] = [pts[i - 1], pts[i]]; return lerp(a[1], b[1], (v - a[0]) / (b[0] - a[0])) }
  const mkG = (x0, y0, w, h, vmax) => ({ x0, y0, w, h, vmax, X: (v) => x0 + v / vmax * w, Y: (p) => y0 - p / 14 * h })
  const pathTo = (G, pts, v1, v0 = 0) => {
    let d = ''
    for (const [v, p] of pts) { if (v < v0) continue; if (v > v1) break; d += (d ? 'L' : 'M') + G.X(v).toFixed(1) + ' ' + G.Y(p).toFixed(1) }
    if (v1 > v0) d += (d ? 'L' : 'M') + G.X(v1).toFixed(1) + ' ' + G.Y(phAt(pts, v1)).toFixed(1)
    return d || 'M0 0'
  }
  const axes = (G, xlab, seven) => `<path d="M${G.x0} ${G.y0 - G.h - 20}V${G.y0}H${G.x0 + G.w + 20}" fill="none" stroke="#a3abbd" stroke-width="5" stroke-linecap="round"/>
    <text x="${G.x0 - 18}" y="${G.y0 - G.h - 4}" text-anchor="end" font-size="32" font-weight="900" class="f-muted">pH</text>
    <text x="${G.x0 + G.w}" y="${G.y0 + 66}" text-anchor="end" font-size="26" font-weight="800" class="f-muted">${xlab}</text>
    ${seven ? `<line x1="${G.x0}" x2="${G.x0 + G.w}" y1="${G.Y(7)}" y2="${G.Y(7)}" stroke="#5a6178" stroke-width="3" stroke-dasharray="12 10"/><text x="${G.x0 - 16}" y="${G.Y(7) + 10}" text-anchor="end" font-size="28" font-weight="900" class="f-muted">7</text>` : ''}`
  const curve = (G, pts, cls, color, v1, w = 8, extra = '') => `<path class="${cls}" d="${pathTo(G, pts, v1)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  const dot = (c, sel, G, pts, v) => mv(c, sel, G.X(v), G.Y(phAt(pts, v)))
  const draw = (c, sel, G, pts, v, v0 = 0) => c.$(sel).setAttribute('d', pathTo(G, pts, v, v0))

  // the main graph and its card, used by most scenes
  const G = mkG(260, 740, 800, 370, 50)
  const GCARD = '<div class="card" style="left:120px;top:290px;width:1040px;height:550px" data-at="in+0.2" data-fx="fade"></div>'
  const RCARD = (h3, inner, at = 'in+0.3') => `<div class="card" style="left:1220px;top:290px;width:580px;height:550px" data-at="${at}" data-fx="fade">${h3 ? `<h3>${h3}</h3>` : ''}${inner}</div>`
  const XEQ = G.X(30), YEQ = G.Y(phAt(WK, 30))
  // particles in the right card: 8 slots that are HA (purple + gold H) or A- (teal)
  const SLOTS = Array.from({ length: 8 }, (_, i) => [1340 + (i % 4) * 115, 470 + Math.floor(i / 4) * 105])
  const ha = (x, y) => `${ball(x, y, 26, 'pur')}${ball(x + 30, y - 20, 15, 'gold')}`
  const slots = (pre) => SLOTS.map(([x, y], i) => `<g class="${pre}h${i}">${ha(x, y)}</g><g class="${pre}a${i}" style="opacity:0">${ball(x, y, 26, 'teal')}</g>`).join('')
  const setSlots = (c, pre, nA) => SLOTS.forEach((_, i) => { const k = Math.max(0, Math.min(1, nA - i)); c.$(`.${pre}a${i}`).style.opacity = k; c.$(`.${pre}h${i}`).style.opacity = 1 - k })
  const LEGEND = `<div class="x-row" style="top:96px;font-size:32px"><span class="pri">HA</span> <small>weak acid</small> &nbsp; <span class="teal">${AM}</span> <small>conj. base</small></div>`

  // ---------- intro: a faint titration curve along the bottom ----------
  const GI = mkG(260, 940, 1400, 110, 50)
  EZ.intro = {
    chips: [['1@0.25', 'The landmarks'], ['1@0.45', 'Equivalence pH'], ['1@0.75', `${PKA} and concentration`]],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.3">${curve(GI, WK, 'x-ic', TEAL, 50, 6)}<g class="x-id">${ball(0, 0, 12, 'gold')}</g></svg>`,
    update(c) {
      const p = 0.5 - 0.5 * Math.cos((c.t - c.sc.start) * 0.5)
      dot(c, '.x-id', GI, WK, lerp(4, 46, p))
    },
  }

  // ---------- hook: creeps, then jumps ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">The plot twist</div><h2 class="h1" data-at="in+0.2">pH creeps, then jumps</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0" data-fx="fade">${axes(G, 'volume of titrant added')}</g>
        ${curve(G, WK, 'x-c', TEAL, 0)}
        <g data-at="2" data-fx="fade"><g class="x-d">${ball(0, 0, 14, 'gold')}</g></g>
        <circle cx="${XEQ}" cy="${YEQ}" r="34" fill="none" stroke="${GOLD}" stroke-width="5" data-at="3@0.6" data-fx="pop"/>
      </svg>
      <div class="x-tag muted" style="left:${G.X(12) - 100}px;top:${G.Y(phAt(WK, 12)) - 80}px" data-at="2@0.5" data-fx="fade">creeps along</div>
      <div class="x-tag gold" style="left:${XEQ + 50}px;top:${YEQ + 30}px" data-at="3@0.6" data-fx="fade">equivalence point</div>
      ${RCARD('A titration curve', `<div class="x-row" style="top:100px">up: <span class="teal">pH</span></div>
        <div class="x-row" style="top:160px">across: <span class="teal">volume of titrant</span></div>
        <div class="x-chip muted" style="left:40px;top:270px;background:rgba(163,171,189,.12)" data-at="2" data-fx="pop">1 · pH creeps</div>
        <div class="x-chip gold" style="left:40px;top:360px;background:rgba(242,196,67,.12)" data-at="3" data-fx="pop">2 · then JUMPS</div>`, '0@0.3')}
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Learn the <span class="gold">landmarks</span>, read the whole story</div>`,
    update(c) {
      const b = c.b
      const v = 25 * eio(c.seg(b[2].start, b[2].end + 0.4)) + 25 * eio(c.seg(b[3].start, b[3].start + 1.6))
      draw(c, '.x-c', G, WK, v); dot(c, '.x-d', G, WK, v)
    },
  })

  // ---------- landmarks 1 and 2: start and buffer region ----------
  EZ.scene('start', {
    html: `<div class="kicker" data-at="in" data-fx="left">Landmarks 1–2</div><h2 class="h1" data-at="in+0.2">Weak acid + strong base</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${axes(G, 'volume of NaOH added')}</g>
        <rect x="${G.X(3)}" y="${G.y0 - G.h}" width="${G.X(27) - G.X(3)}" height="${G.h}" fill="rgba(60,199,188,.09)" data-at="3" data-fx="fade"/>
        ${curve(G, WK, 'x-c', TEAL, 0)}
        <g data-at="1@0.4" data-fx="fade"><g class="x-d">${ball(0, 0, 14, 'gold')}</g></g>
      </svg>
      <div class="x-tag gold" style="left:${G.X(0) + 30}px;top:${G.Y(phAt(WK, 0)) + 14}px" data-at="2@0.5" data-fx="fade">1 · start: fairly low</div>
      <div class="x-tag teal" style="left:${G.X(15) - 130}px;top:${G.y0 - G.h + 12}px" data-at="3@0.3" data-fx="fade">2 · buffer region</div>
      <div class="x-tag muted" style="left:${G.X(15) - 90}px;top:${G.Y(phAt(WK, 15)) - 74}px" data-at="5@0.5" data-fx="fade">rises slowly</div>
      ${RCARD('Weak acid + NaOH', `${LEGEND}
        <div class="x-row" style="top:400px" data-at="5">HA and ${AM} <span class="gold">both</span> present</div>
        <div class="x-row" style="top:460px;color:var(--muted)" data-at="5@0.5" data-fx="fade">→ pH rises slowly</div>`)}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="in+0.3" data-fx="fade">${slots('x-s')}</g></svg>
      <div class="banner" style="top:870px" data-at="6" data-fx="pop">This gentle stretch is a <span class="teal">buffer</span> at work</div>`,
    update(c) {
      const b = c.b
      const v = 24 * eio(c.seg(b[4].start, b[5].end))
      draw(c, '.x-c', G, WK, v); dot(c, '.x-d', G, WK, v)
      setSlots(c, 'x-s', 8 * v / 30)
    },
  })

  // ---------- landmark 3: half-equivalence ----------
  EZ.scene('half', {
    html: `<div class="kicker" data-at="in" data-fx="left">Landmark 3</div><h2 class="h1" data-at="in+0.2">Half-equivalence point</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${axes(G, 'volume of NaOH added')}
          ${curve(G, WK, '', TEAL, 50, 6, 'opacity=".22"')}${curve(G, WK, '', TEAL, 15)}
          <line x1="${XEQ}" x2="${XEQ}" y1="${G.y0}" y2="${G.y0 - 14}" stroke="#a3abbd" stroke-width="4"/>
          ${ball(G.X(15), G.Y(phAt(WK, 15)), 14, 'gold')}</g>
        <line class="x-lv" x1="${G.X(15)}" x2="${G.X(15)}" y1="${G.y0}" y2="${G.y0}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/>
        <line class="x-lh" x1="${G.X(15)}" x2="${G.X(15)}" y1="${G.Y(phAt(WK, 15))}" y2="${G.Y(phAt(WK, 15))}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/>
      </svg>
      <div class="x-tag muted" style="left:${XEQ - 80}px;top:${G.y0 + 12}px;font-size:24px" data-at="in+0.3" data-fx="fade">equivalence</div>
      <div class="x-tag gold" style="left:${G.X(15) - 70}px;top:${G.y0 + 12}px;font-size:24px" data-at="1@0.3" data-fx="fade">halfway</div>
      <div class="x-tag gold" style="left:150px;width:96px;text-align:right;top:${G.Y(phAt(WK, 15)) - 22}px" data-at="3@0.4" data-fx="fade">${PKA}</div>
      ${RCARD('Half the HA converted', `${LEGEND}
        <div class="x-row" style="top:400px;font-size:44px;text-align:center;left:0;right:0" data-at="2">[HA] = [${AM}]</div>
        <div class="x-row" style="top:465px;font-size:44px;text-align:center;left:0;right:0" data-at="3"><span class="gold">pH = ${PKA}</span></div>`)}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="in+0.3" data-fx="fade">${slots('x-s')}</g></svg>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">This is how <span class="gold">${PKA}</span> is measured</div>`,
    update(c) {
      const b = c.b, yh = G.Y(phAt(WK, 15))
      c.$('.x-lv').setAttribute('y2', lerp(G.y0, yh, eio(c.seg(b[1].start, b[1].start + 0.8))))
      c.$('.x-lh').setAttribute('x2', lerp(G.X(15), G.x0, eio(c.seg(b[3].start, b[3].start + 0.8))))
      setSlots(c, 'x-s', 4 * eio(c.seg(b[1].start + 0.3, b[1].start + 1.5)))
    },
  })

  // ---------- landmarks 4 and 5: equivalence and beyond ----------
  EZ.scene('equiv', {
    html: `<div class="kicker" data-at="in" data-fx="left">Landmarks 4–5</div><h2 class="h1" data-at="in+0.2">Equivalence and beyond</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${axes(G, 'volume of NaOH added')}${curve(G, WK, '', TEAL, 15)}</g>
        <g data-at="3" data-fx="fade"><line x1="${G.x0}" x2="${G.x0 + G.w}" y1="${G.Y(7)}" y2="${G.Y(7)}" stroke="#5a6178" stroke-width="3" stroke-dasharray="12 10"/>
          <text x="${G.x0 - 16}" y="${G.Y(7) + 10}" text-anchor="end" font-size="28" font-weight="900" class="f-muted">7</text></g>
        ${curve(G, WK, 'x-c', TEAL, 15)}
        <g data-at="in+0.3" data-fx="fade"><g class="x-d">${ball(0, 0, 14, 'gold')}</g></g>
        <circle cx="${XEQ}" cy="${YEQ}" r="34" fill="none" stroke="${GOLD}" stroke-width="5" data-at="0@0.7" data-fx="pop"/>
      </svg>
      <div class="x-tag gold" style="left:${XEQ - 300}px;top:${YEQ - 70}px" data-at="0@0.7" data-fx="fade">4 · equivalence</div>
      <div class="x-tag gold" style="left:${XEQ + 50}px;top:${YEQ - 14}px;font-size:36px" data-at="3" data-fx="pop">pH &gt; 7</div>
      <div class="x-tag warm" style="left:${G.X(40) - 90}px;top:${G.Y(phAt(WK, 45)) - 70}px" data-at="5@0.3" data-fx="fade">5 · excess ${OH}</div>
      ${RCARD('', `<div class="x-row" style="top:30px;font-size:34px" data-at="1">mol ${OH} added</div>
        <div class="x-row" style="top:80px;font-size:34px" data-at="1@0.4" data-fx="fade">= mol HA at the start</div>
        <div class="x-row" style="top:330px;text-align:center;left:0;right:0" data-at="2@0.3" data-fx="fade">only <span class="teal">${AM}</span> remains</div>
        <div class="x-row" style="top:470px;text-align:center;left:0;right:0;font-size:32px;color:var(--muted)" data-at="5@0.4" data-fx="fade">excess <span class="warm">${OH}</span> controls pH</div>`)}
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="in+0.3" data-fx="fade">${slots('x-s')}</g><g data-at="5@0.3" data-fx="fade">${ball(1455, 700, 20, 'red')}${ball(1570, 700, 20, 'red')}${ball(1685, 700, 20, 'red')}</g></svg>`,
    update(c) {
      const b = c.b
      const v = 15 + 15 * eio(c.seg(b[0].start, b[0].start + 1.6)) + 20 * eio(c.seg(b[4].start + 0.3, b[5].start + 1.2))
      draw(c, '.x-c', G, WK, v, 15); dot(c, '.x-d', G, WK, v)
      setSlots(c, 'x-s', 4 + 4 * eio(c.seg(b[2].start, b[2].start + 1.0)))
    },
  })

  // ---------- pH at the equivalence point: three cases ----------
  const CASES = [
    ['Strong acid + strong base', ST, '= 7', 'only neutral ions + water', 'muted'],
    ['Weak acid + strong base', WK, '&gt; 7', `${AM} reacts with water → ${OH}`, 'teal'],
    ['Weak base + strong acid', WB, '&lt; 7', 'HB<sup>+</sup> makes H<sub>3</sub>O<sup>+</sup>', 'warm'],
  ]
  const CL = [120, 700, 1280]
  const GM = CL.map((L) => mkG(L + 90, 620, 380, 220, 50))
  EZ.scene('eqph', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">pH at equivalence</div><h2 class="h1" data-at="in+0.2">It depends on what you titrate</h2>
      ${CASES.map(([t, , r, why, col], i) => `<div class="card x-cc${i}" style="left:${CL[i]}px;top:290px;width:520px;height:550px" data-at="${i + 1}"><h3 style="text-align:center;font-size:34px">${t}</h3>
        <div class="x-big ${col}" style="top:370px">pH ${r}</div><div class="x-why" style="top:460px">${why}</div></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${CASES.map(([, pts], i) => `<g data-at="${i + 1}@0.1" data-fx="fade">${axes(GM[i], '', true).replace(/font-size="32"/, 'font-size="26"')}</g>
          ${curve(GM[i], pts, 'x-m' + i, i === 0 ? WARM : TEAL, 0, 6)}
          <g data-at="${i + 1}@0.5" data-fx="pop">${ball(GM[i].X(30), GM[i].Y(phAt(pts, 30)), 12, 'gold')}</g>`).join('')}
      </svg>
      <div class="banner" style="top:870px;font-size:44px" data-at="4" data-fx="pop">${NH3} + HCl: only <span class="pri">${NH4}</span> (weak acid) remains ${ARR} pH <span class="gold">&lt; 7</span></div>`,
    update(c) {
      const b = c.b
      CASES.forEach(([, pts], i) => draw(c, '.x-m' + i, GM[i], pts, 50 * eio(c.seg(b[i + 1].start, b[i + 1].start + 1.4))))
      const hl = eo(c.seg(b[4].start, b[4].start + 0.5))
      c.$('.x-cc2').style.boxShadow = `0 0 ${50 * hl}px rgba(243,167,100,${0.45 * hl})`
    },
  })

  // ---------- strong vs. weak acid ----------
  EZ.scene('compare', {
    html: `<div class="kicker" data-at="in" data-fx="left">Side by side</div><h2 class="h1" data-at="in+0.2">Strong acid vs. weak acid</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${axes(G, 'volume of NaOH added', true)}</g>
        <rect x="${G.X(3)}" y="${G.y0 - G.h}" width="${G.X(27) - G.X(3)}" height="${G.h}" fill="rgba(60,199,188,.09)" data-at="2@0.3" data-fx="fade"/>
        ${curve(G, ST, 'x-cs', WARM, 0, 7)}${curve(G, WK, 'x-cw', TEAL, 0, 7)}
        <g data-at="1@0.2" data-fx="pop"><circle cx="${G.X(0)}" cy="${G.Y(phAt(WK, 0))}" r="22" fill="none" stroke="${TEAL}" stroke-width="5"/><circle cx="${G.X(0)}" cy="${G.Y(phAt(ST, 0))}" r="22" fill="none" stroke="${WARM}" stroke-width="5"/></g>
        <line x1="${XEQ}" x2="${XEQ}" y1="${G.y0}" y2="${G.y0 - G.h}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8" data-at="4@0.3" data-fx="fade"/>
      </svg>
      <div class="x-tag teal" style="left:${G.X(15) - 130}px;top:${G.y0 - G.h + 12}px" data-at="2@0.4" data-fx="fade">buffer region</div>
      <div class="x-tag gold" style="left:${XEQ + 20}px;top:${G.y0 - 60}px;font-size:26px" data-at="4@0.3" data-fx="fade">same volume</div>
      ${RCARD('', `<div class="x-row" style="top:30px;font-size:32px"><span class="warm">━ strong acid</span> &nbsp; <span class="teal">━ weak acid</span></div>
        <div class="x-row" style="top:130px;font-size:34px" data-at="1">Weak: <span class="teal">higher start</span></div>
        <div class="x-row" style="top:180px" data-at="1@0.4" data-fx="fade"><small>only partly ionized</small></div>
        <div class="x-row" style="top:250px;font-size:34px" data-at="2">Weak: <span class="teal">buffer region</span></div>
        <div class="x-row" style="top:330px;font-size:34px" data-at="3">Weak: <span class="teal">smaller jump</span></div>
        <div class="x-row" style="top:380px" data-at="3@0.4" data-fx="fade"><small>centered above pH 7</small></div>
        <div class="x-row" style="top:450px;font-size:34px" data-at="4">Both: <span class="gold">same volume</span></div>`, '0@0.2')}
      <div class="banner" style="top:870px;font-size:44px" data-at="4@0.5" data-fx="pop">Base needed depends on <span class="gold">moles of acid</span>, not strength</div>`,
    update(c) {
      const b = c.b, v = 50 * eio(c.seg(b[0].start + 0.6, b[0].start + 3.2))
      draw(c, '.x-cs', G, ST, v); draw(c, '.x-cw', G, WK, v)
    },
  })

  // ---------- reading pKa from a curve ----------
  const Y15 = G.Y(phAt(WK, 15))
  EZ.scene('pka', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Finding ${PKA} from a curve</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${axes(G, 'volume of NaOH added')}${curve(G, WK, '', TEAL, 50)}</g>
        <g data-at="1@0.3" data-fx="pop"><circle cx="${XEQ}" cy="${YEQ}" r="30" fill="none" stroke="${GOLD}" stroke-width="5"/></g>
        <line class="x-l1" x1="${XEQ}" x2="${XEQ}" y1="${G.y0}" y2="${G.y0}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/>
        <line class="x-l2" x1="${G.X(15)}" x2="${G.X(15)}" y1="${G.y0}" y2="${G.y0}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/>
        <line class="x-l3" x1="${G.X(15)}" x2="${G.X(15)}" y1="${Y15}" y2="${Y15}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/>
        <g data-at="2@0.5" data-fx="pop">${ball(G.X(15), Y15, 14, 'gold')}</g>
      </svg>
      <div class="x-tag gold" style="left:${XEQ - 50}px;top:${G.y0 + 10}px;font-size:26px" data-at="1@0.5" data-fx="fade">30.0 mL</div>
      <div class="x-tag gold" style="left:${G.X(15) - 50}px;top:${G.y0 + 10}px;font-size:26px" data-at="2@0.3" data-fx="fade">15.0 mL</div>
      <div class="x-tag gold" style="left:140px;width:106px;text-align:right;top:${Y15 - 22}px" data-at="2@0.7" data-fx="fade">4.20</div>
      <div class="x-tag teal" style="left:${G.X(15) - 120}px;top:${Y15 - 70}px;font-size:28px" data-at="3@0.4" data-fx="fade">half-equivalence</div>
      ${RCARD('', `<div class="x-row" style="top:30px" data-at="1">Equivalence: <span class="gold">30.0 mL</span></div>
        <div class="x-row" style="top:100px" data-at="2">pH at <span class="gold">15.0 mL</span>: 4.20</div>
        <div class="x-row" style="top:190px;font-size:32px" data-at="3">15.0 mL = half of 30.0 mL</div>
        <div class="x-row" style="top:240px;font-size:32px" data-at="3@0.4" data-fx="fade">→ pH = ${PKA}</div>
        <div class="x-row" style="top:340px;font-size:56px;text-align:center;left:0;right:0" data-at="4" data-fx="pop"><span class="gold">${PKA} = 4.20</span></div>`, '0@0.3')}
      <div class="x-eqn" data-at="5">${KA} = 10<sup>−4.20</sup> = <span class="gold">6.3 × 10<sup>−5</sup></span></div>`,
    update(c) {
      const b = c.b
      c.$('.x-l1').setAttribute('y2', lerp(G.y0, YEQ + 30, eio(c.seg(b[1].start + 0.3, b[1].start + 1.1))))
      c.$('.x-l2').setAttribute('y2', lerp(G.y0, Y15, eio(c.seg(b[2].start, b[2].start + 0.7))))
      c.$('.x-l3').setAttribute('x2', lerp(G.X(15), G.x0, eio(c.seg(b[2].start + 0.6, b[2].start + 1.3))))
    },
  })

  // ---------- concentration from the equivalence volume ----------
  EZ.scene('conc', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Concentration</div><h2 class="h1" data-at="in+0.2">Moles at equivalence</h2>
      <div class="x-line" style="top:290px" data-at="1">Monoprotic, at equivalence: <span class="warm">mol titrant</span> = <span class="pri">mol analyte</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade">
          <rect class="x-liq" x="283" y="380" width="54" height="200" fill="${WARM}" opacity=".55"/>
          <path d="M280 370V580L300 600V625M340 370V580L320 600V625" fill="none" stroke="#a3abbd" stroke-width="5" stroke-linejoin="round"/>
          <path d="M270 650V690L190 830H430L350 690V650" fill="none" stroke="#a3abbd" stroke-width="6" stroke-linejoin="round"/>
          <path d="M213 790H407L430 830H190Z" fill="${PRI}" opacity=".4"/>
          <g class="x-drop">${ball(0, 0, 9, 'red')}</g></g>
      </svg>
      <div class="x-tag warm" style="left:370px;top:400px;font-size:34px;line-height:1.3" data-at="2@0.3" data-fx="fade">16.0 mL of<br>0.125 M NaOH</div>
      <div class="x-tag pri" style="left:460px;top:720px;font-size:34px;line-height:1.3" data-at="2@0.6" data-fx="fade">20.0 mL of<br>a weak acid</div>
      <div class="card" style="left:860px;top:380px;width:940px;height:460px" data-at="3">
        <div class="x-row" style="top:50px">mol NaOH = 0.125 M × 0.0160 L</div>
        <div class="x-row" style="top:115px;left:250px" data-at="3@0.6" data-fx="fade">= <span class="warm">0.00200 mol</span></div>
        <div class="x-row" style="top:215px" data-at="4">= <span class="pri">mol HA</span> <small>(monoprotic)</small></div>
        <div class="x-row" style="top:315px" data-at="5">[HA] = 0.00200 mol ÷ 0.0200 L</div></div>
      <div class="banner" style="top:870px" data-at="5@0.6" data-fx="pop">The acid is <span class="gold">0.100 M</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[2].start + 0.3, b[2].end + 0.3))
      const liq = c.$('.x-liq'); liq.setAttribute('y', lerp(380, 480, p)); liq.setAttribute('height', lerp(200, 100, p))
      const f = ((c.t - b[2].start) * 1.6) % 1, on = c.t > b[2].start + 0.3 && c.t < b[2].end + 0.3
      mv(c, '.x-drop', 310, lerp(635, 780, f)); c.$('.x-drop').style.opacity = on ? 1 - f * 0.6 : 0
    },
  })

  // ---------- polyprotic acids ----------
  const GP = mkG(260, 740, 800, 370, 80)
  EZ.scene('poly', {
    html: `<div class="kicker pri" data-at="in" data-fx="left">Polyprotic acids</div><h2 class="h1" data-at="in+0.2">Count the jumps</h2>
      ${GCARD}
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">${axes(GP, 'volume of NaOH added')}</g>
        <g data-at="2" data-fx="fade"><rect x="${GP.X(3)}" y="${GP.y0 - GP.h}" width="${GP.X(27) - GP.X(3)}" height="${GP.h}" fill="${TEAL}" opacity=".09"/>
          <rect x="${GP.X(33)}" y="${GP.y0 - GP.h}" width="${GP.X(57) - GP.X(33)}" height="${GP.h}" fill="${PRI}" opacity=".1"/></g>
        ${curve(GP, DP, 'x-c', TEAL, 0)}
        <g data-at="3@0.2" data-fx="pop">${ball(GP.X(30) - 44, GP.Y(phAt(DP, 30)), 24, 'gold', '1', 28)}</g>
        <g data-at="3@0.45" data-fx="pop">${ball(GP.X(60) - 44, GP.Y(phAt(DP, 60)), 24, 'gold', '2', 28)}</g>
      </svg>
      <div class="x-tag muted" style="left:290px;top:300px;font-size:26px" data-at="1" data-fx="fade">a diprotic acid + NaOH</div>
      <div class="x-tag teal" style="left:${GP.X(15) - 90}px;top:${GP.Y(phAt(DP, 15)) + 30}px;font-size:28px" data-at="2@0.3" data-fx="fade">buffer 1</div>
      <div class="x-tag pri" style="left:${GP.X(45) - 90}px;top:${GP.Y(phAt(DP, 45)) + 30}px;font-size:28px" data-at="2@0.5" data-fx="fade">buffer 2</div>
      ${RCARD('', `<div class="x-row" style="top:30px;font-size:32px">${H2CO3}, ${H3PO4}: <span class="pri">several</span> acidic H</div>
        <div class="x-row" style="top:110px;font-size:32px" data-at="1">Up to <span class="gold">one jump per proton</span></div>
        <div class="x-row" style="top:158px" data-at="1@0.5" data-fx="fade"><small>when the ${KA} values are well separated</small></div>
        <div class="x-row" style="top:230px;font-size:32px" data-at="2">Each: own buffer region + ${PKA}</div>
        <div class="x-row" style="top:310px;font-size:32px" data-at="3">Count jumps → <span class="gold">count protons</span></div>
        <div class="x-row" style="top:390px;font-size:32px" data-at="4">${H3PO4}: <span class="gold">up to 3</span></div>
        <div class="x-row" style="top:460px" data-at="5"><small>Just identify the major species</small></div>`, '0@0.2')}`,
    update(c) {
      const b = c.b
      draw(c, '.x-c', GP, DP, 80 * eio(c.seg(b[1].start, b[1].start + 3.2)))
    },
  })

  // ---------- try it ----------
  const OPTS = [['A', 'HCl'], ['B', 'CH<sub>3</sub>COOH'], ['C', H2CO3], ['D', 'HNO<sub>3</sub>']]
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Two equivalence points: which acid?</h2>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${120 + i * 430}px" data-at="1@${(0.45 + i * 0.12).toFixed(2)}" data-fx="pop"><div class="l">${l}</div>
        ${i === 2 ? `<div class="ok" style="opacity:0">${CHECK}</div>` : ''}<div class="f">${f}</div></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:680px" data-at="4" data-fx="pop">2 equivalence points ${ARR} <span class="gold">2 acidic protons</span> ${ARR} diprotic <span class="pri">${H2CO3}</span></div>`,
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
  const GR = mkG(60, 140, 360, 120, 50), GR3 = mkG(60, 140, 360, 120, 80)
  const r1 = `<svg width="460" height="160" viewBox="0 0 460 160">${curve(GR, WK, '', TEAL, 50, 5)}${ball(GR.X(15), GR.Y(phAt(WK, 15)), 11, 'gold')}</svg>`
  const r2 = `<svg width="460" height="160" viewBox="0 0 460 160"><line x1="40" x2="420" y1="80" y2="80" stroke="#5a6178" stroke-width="3" stroke-dasharray="10 8"/>
    ${ball(110, 80, 22, 'gray')}${ball(230, 36, 22, 'teal')}${ball(350, 124, 22, 'red')}</svg>`
  const r3 = `<svg width="460" height="160" viewBox="0 0 460 160">${curve(GR3, DP, '', TEAL, 80, 5)}${ball(GR3.X(30), GR3.Y(phAt(DP, 30)), 11, 'gold')}${ball(GR3.X(60), GR3.Y(phAt(DP, 60)), 11, 'gold')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Half-equivalence:<br><span class="gold">pH = ${PKA}</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p style="font-size:30px">Equivalence pH:<br>strong/strong <span class="muted">= 7</span><br>weak acid/strong base <span class="teal">&gt; 7</span><br>weak base/strong acid <span class="bad">&lt; 7</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Each acidic proton can<br>give its own<br>equivalence point<br><span class="muted">(up to one per proton)</span></p></div>`,
  })
})()
