// Pictures for chem-5.3 "Concentration vs. Time & Half-Life". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u5.ts, book.ts). The three graphs
// follow the lesson's integrated-plots diagram (first-order data, drawn without numbers).
(() => {
  const { clamp, eio, eo, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .h-th{position:absolute;top:300px;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .h-row{position:absolute;left:120px;width:1680px;height:130px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .h-row .n{position:absolute;left:30px;top:27px;width:76px;height:76px;border-radius:50%;font-size:44px;font-weight:900;line-height:76px;text-align:center;color:#10131c}
    .h-row .eq{position:absolute;left:150px;top:30px;font-size:54px;font-weight:900;white-space:nowrap}
    .h-row .gr{position:absolute;left:1000px;top:36px;font-size:44px;font-weight:900;white-space:nowrap}
    .h-row svg{position:absolute;left:1260px;top:20px}
    .h-row .sl{position:absolute;left:1480px;top:26px;height:78px;padding:0 26px;border-radius:20px;font-size:50px;font-weight:900;line-height:74px;white-space:nowrap;border:2px solid currentColor;background:rgba(255,255,255,.05)}
    .h-chip{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:34px;font-weight:800;line-height:68px;white-space:nowrap}
    .h-tag{position:absolute;top:820px;width:520px;text-align:center;font-size:38px;font-weight:900}
    .h-pc{top:300px;width:520px;height:500px}
    .h-hc{top:300px;width:540px;height:480px;text-align:center}
    .h-hc .n{margin:24px auto 0;width:70px;height:70px;border-radius:50%;font-size:40px;font-weight:900;line-height:70px;color:#10131c}
    .h-hc .w{margin-top:10px;font-size:72px;font-weight:900;letter-spacing:.04em;line-height:1}
    .h-hc .s{margin-top:10px;font-size:36px;font-weight:800;color:var(--muted)}
    .h-hc svg{display:block;margin:14px auto 0}
    .h-note{position:absolute;left:1240px;width:560px;padding:18px 26px 20px 30px;border-radius:24px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .h-note b{display:block;font-size:38px;font-weight:900;line-height:1.15} .h-note span{display:block;margin-top:6px;font-size:28px;font-weight:700;color:var(--muted);line-height:1.3}
    .h-fr{font-size:52px;font-weight:900;white-space:nowrap} .h-fr em{font-style:normal}
    .h-big{position:absolute;left:1240px;width:560px;height:100px;border-radius:24px;text-align:center;font-size:52px;font-weight:900;line-height:96px;white-space:nowrap;background:rgba(91,91,214,.3);border:3px solid var(--primary)}
    .h-prob{left:120px;top:290px;width:1680px;height:130px;padding:38px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .h-step{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .h-step .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;font-size:38px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .h-step .lb{position:absolute;left:124px;top:36px;font-size:36px;font-weight:900;white-space:nowrap}
    .h-step .eq{position:absolute;left:300px;top:34px;font-size:42px;font-weight:900;white-space:nowrap}
    .h-res{position:absolute;right:22px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:44px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .h-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .h-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .h-rc{top:320px;width:540px;height:560px;text-align:center} .h-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .h-rc svg{display:block;margin:14px auto 0} .h-rc p{margin:14px 20px 0;font-size:35px;font-weight:800;line-height:1.35;white-space:nowrap}
    .h-ax{stroke:#c9cee0;stroke-width:4;stroke-linecap:round;fill:none}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', GOOD = '#4cc781', BAD = '#f0707a', GOLD = '#f2c443', MUTED = '#a3abbd'
  const poly = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')

  // ---------- first-order data, the same shape as the lesson's diagram (k = 0.25 per time unit, unitless) ----------
  const A = (t) => Math.exp(-0.25 * t)
  const FN = [[(t) => A(t), 0, 1.05], [(t) => Math.log(A(t)), -2.7, 0.15], [(t) => 1 / A(t), 0, 13]]
  const plotPath = (i, x0, y0, w, h, step = 0.25) => {
    const [fn, lo, hi] = FN[i], pts = []
    for (let t = 0; t <= 10.001; t += step) pts.push([x0 + (t / 10) * w, y0 - ((fn(t) - lo) / (hi - lo)) * h])
    return pts
  }

  // ---------- half-life curve: 100. mg, t½ = 8.0 days (book.ts) ----------
  const HX = (d) => 230 + (d / 26) * 820
  const HY = (m) => 870 - (m / 100) * 480
  const decay = (d0, d1) => { const pts = []; for (let d = d0; d <= d1 + 0.001; d += 0.25) pts.push([HX(d), HY(100 * 0.5 ** (d / 8))]); return poly(pts) }

  // ---------- intro artwork: a faint decay curve below the chips ----------
  const IX = (d) => 300 + (d / 32) * 1320, IY = (m) => 836 + (1 - m) * 100
  const introCurve = (() => { const pts = []; for (let d = 0; d <= 32; d += 0.5) pts.push([IX(d), IY(0.5 ** (d / 8))]); return poly(pts) })()
  EZ.intro = {
    chips: [['1@0.45', 'Three graphs'], ['1@0.62', 'Zero, Log, Flip'], ['1@0.82', 'Half-life']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22">
      <path d="${introCurve}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" data-at="in+0.3" data-fx="draw" data-dur="3"/>
      ${[0, 8, 16, 24, 32].map((d, i) => `<circle cx="${IX(d)}" cy="${IY(0.5 ** (d / 8))}" r="13" fill="${TEAL}" data-at="in+${(0.4 + i * 0.7).toFixed(1)}" data-fx="pop"/>`).join('')}
    </svg>`,
  }

  // ---------- hook: dating an ancient bone ----------
  const DOTS = [[420, 600], [470, 585], [520, 612], [570, 590], [620, 608], [670, 586], [720, 610], [770, 592], [820, 604], [445, 625], [595, 628], [745, 626],
    [330, 520], [460, 560], [320, 684], [680, 650], [910, 520], [790, 560], [920, 684], [660, 560], [380, 595], [860, 598], [545, 570], [695, 572]]
  const ORDER = [3, 17, 8, 13, 21, 5, 10, 0, 19, 15, 6, 23, 1, 12, 9, 20, 2, 14, 7, 18, 4, 11, 16, 22] // the order the atoms decay in
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">How do you date an ancient bone?</h2>
      <div class="card" style="left:120px;top:310px;width:1000px;height:560px" data-at="0@0.4">
        <svg style="position:absolute;left:0;top:0" width="1000" height="560" viewBox="120 310 1000 560">
          <g fill="rgba(233,226,206,.16)" stroke="#d9d2bd" stroke-width="5" stroke-linejoin="round">
            <path d="M330 560 C 330 600, 330 600, 330 640 C 270 640, 250 690, 300 712 C 330 726, 370 706, 380 676 L 860 676 C 870 706, 910 726, 940 712 C 990 690, 970 640, 910 640 C 910 600, 910 600, 910 560 C 970 560, 990 510, 940 488 C 910 474, 870 494, 860 524 L 380 524 C 370 494, 330 474, 300 488 C 250 510, 270 560, 330 560 Z"/></g>
          ${DOTS.map(([x, y], i) => `<circle class="h-c${i}" cx="${x}" cy="${y}" r="13" fill="${TEAL}"/>`).join('')}
          <g data-at="1@0.3" data-fx="fade"><circle cx="190" cy="810" r="13" fill="${TEAL}"/><text x="216" y="821" font-size="32" font-weight="900" class="f-teal">carbon-14 left in the bone</text></g>
          <text x="940" y="821" text-anchor="middle" font-size="96" font-weight="900" class="f-gold" data-at="0@0.5" data-fx="pop">?</text>
        </svg></div>
      <div class="h-note" style="top:330px;border-left-color:${TEAL}" data-at="1" data-fx="right"><b class="teal">Measure what is left</b><span>how much carbon-14 remains</span></div>
      <div class="h-note" style="top:500px;border-left-color:${PUR}" data-at="2" data-fx="right"><b class="pri">First order</b><span>radioactive decay is first order</span></div>
      <div class="h-note" style="top:670px;border-left-color:${GOLD}" data-at="3" data-fx="right"><b class="gold">Constant half-life</b><span>the same time to lose half, every time</span></div>
      <div class="banner" style="top:910px;padding:14px 40px;font-size:42px" data-at="4" data-fx="pop">How does <span class="teal">concentration</span> change over <span class="warm">time</span>?</div>`,
    update(c) {
      const b = c.b
      // half of the atoms fade during sentence 1, half of the rest during sentence 3, then the picture settles
      const p1 = eio(c.seg(b[1].start + 0.4, b[1].end)), p2 = eio(c.seg(b[3].start + 0.3, b[3].end))
      ORDER.forEach((k, j) => {
        let o = 1
        if (j < 12) o = 1 - clamp(p1 * 12 - j)
        else if (j < 18) o = 1 - clamp(p2 * 6 - (j - 12))
        c.$('.h-c' + k).style.opacity = 0.12 + 0.88 * o
      })
    },
  })

  // ---------- integrated rate laws ----------
  const mini = (up, col) => `<svg width="170" height="90" viewBox="0 0 170 90"><path d="M10 6 V84 H164" class="h-ax" style="stroke-width:3"/><line x1="22" x2="154" y1="${up ? 74 : 16}" y2="${up ? 16 : 74}" stroke="${col}" stroke-width="7" stroke-linecap="round"/></svg>`
  const LAWS = [
    ['0', TEAL, '[A]<sub>t</sub> − [A]<sub>0</sub> = −kt', '[A] vs t', '−k', false, 'teal'],
    ['1', PUR, 'ln[A]<sub>t</sub> − ln[A]<sub>0</sub> = −kt', 'ln[A] vs t', '−k', false, 'pri'],
    ['2', WARM, '1/[A]<sub>t</sub> − 1/[A]<sub>0</sub> = <span class="warm">+</span>kt', '1/[A] vs t', '+k', true, 'warm'],
  ]
  EZ.scene('laws', {
    html: `<div class="kicker" data-at="in" data-fx="left">Integrated rate laws</div><h2 class="h1" data-at="0">Concentration over time</h2>
      <div class="h-chip" style="left:1300px;top:196px;border-color:rgba(242,196,67,.6)" data-at="1" data-fx="pop">on your <span class="gold">equation sheet</span></div>
      <div class="h-th" style="left:150px" data-at="2" data-fx="fade">Order</div><div class="h-th" style="left:340px" data-at="2" data-fx="fade">Equation</div>
      <div class="h-th" style="left:1120px" data-at="5" data-fx="fade">Straight-line graph</div><div class="h-th" style="left:1600px" data-at="5@0.4" data-fx="fade">Slope</div>
      ${LAWS.map(([n, col, eq, gr, sl, up, cls], i) => `<div class="h-row" style="top:${345 + i * 155}px" data-at="${2 + i}"><div class="n" style="background:${col}">${n}</div>
        <div class="eq">${eq}</div>
        <div class="gr ${cls}" data-at="5@${0.1 + i * 0.12}" data-fx="fade">${gr}</div><div data-at="5@${0.15 + i * 0.12}" data-fx="pop">${mini(up, col)}</div>
        <div class="sl ${cls}" data-at="5@${0.5 + i * 0.12}" data-fx="pop">${sl}</div></div>`).join('')}
      <div class="banner" style="top:840px" data-at="5@0.3" data-fx="pop">Plot the right thing ${ARR} a <span class="good">straight line</span></div>`,
  })

  // ---------- three graphs from the same data ----------
  const PX = (i) => 120 + i * 580
  const panel = (i, title, cls, drawAt) => {
    const x0 = PX(i) + 80, y0 = 720, w = 380, h = 280, pts = plotPath(i, x0, y0, w, h), dots = plotPath(i, x0, y0, w, h, 2)
    return `<path d="M${x0} ${y0 - 300} V${y0} H${x0 + w + 30}" class="h-ax" data-at="1@${0.2 + i * 0.2}" data-fx="fade"/>
      <text x="${x0 + 190}" y="380" text-anchor="middle" font-size="42" font-weight="900" class="${cls}" data-at="1@${0.2 + i * 0.2}" data-fx="fade">${title}</text>
      <text x="${x0 + 200}" y="770" text-anchor="middle" font-size="30" font-weight="800" class="f-muted" data-at="1@${0.2 + i * 0.2}" data-fx="fade">time →</text>
      <path d="${poly(pts)}" fill="none" stroke="${i === 1 ? GOOD : PUR}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" data-at="${drawAt}" data-fx="draw" data-dur="1.4"/>
      <g data-at="2@${0.3 + i * 0.15}" data-fx="fade">${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#eef0f7"/>`).join('')}</g>`
  }
  EZ.scene('plots', {
    html: `<div class="kicker" data-at="in" data-fx="left">Find the order</div><h2 class="h1" data-at="0">Make all three graphs</h2>
      <div class="h-chip" style="left:1260px;top:196px;border-color:rgba(141,141,240,.6)" data-at="2" data-fx="pop">data: a <span class="pri">first-order</span> reaction</div>
      <div class="card h-pc" style="left:${PX(0)}px" data-at="1@0.15" data-fx="fade"></div>
      <div class="card h-pc h-win" style="left:${PX(1)}px" data-at="1@0.35" data-fx="fade"></div>
      <div class="card h-pc" style="left:${PX(2)}px" data-at="1@0.55" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        ${panel(0, '[A] vs t', 'f-teal', '3@0.1')}${panel(1, 'ln[A] vs t', 'f-pri', '5@0.1')}${panel(2, '1/[A] vs t', 'f-warm', '4@0.1')}
        <g data-at="7@0.55" data-fx="fade"><text x="${PX(1) + 300}" y="470" text-anchor="middle" font-size="44" font-weight="900" class="f-warm">slope = −k</text></g>
      </svg>
      <div class="h-tag bad" style="left:${PX(0)}px" data-at="3@0.6" data-fx="pop">curved ✗</div>
      <div class="h-tag bad" style="left:${PX(2)}px" data-at="4@0.6" data-fx="pop">curved ✗</div>
      <div class="h-tag good" style="left:${PX(1)}px" data-at="5@0.6" data-fx="pop">straight line ✓</div>
      <div class="banner" style="top:910px;padding:16px 40px;font-size:44px" data-at="6" data-fx="pop">The <span class="good">straight line</span> tells you the order: here, <span class="pri">first order</span></div>`,
    update(c) {
      const w = eo(c.seg(c.b[5].start + 0.9, c.b[5].start + 1.4))
      const el = c.$('.h-win')
      el.style.borderColor = w ? `rgba(76,199,129,${w})` : ''
      el.style.boxShadow = `0 0 ${50 * w}px rgba(76,199,129,${0.4 * w})`
    },
  })

  // ---------- Zero, Log, Flip ----------
  const hackMini = (up, col, sl, at, slAt) => `<svg width="400" height="170" viewBox="0 0 400 170"><path d="M40 10 V150 H380" class="h-ax"/>
    <line x1="56" x2="350" y1="${up ? 136 : 28}" y2="${up ? 28 : 136}" stroke="${col}" stroke-width="9" stroke-linecap="round" data-at="${at}" data-fx="draw" data-dur="0.9"/>
    <text x="${up ? 100 : 300}" y="${up ? 60 : 60}" text-anchor="middle" font-size="46" font-weight="900" style="fill:${up ? WARM : col}" data-at="${slAt}" data-fx="pop">${sl}</text></svg>`
  const HACK = [['0', TEAL, 'ZERO', 'plot [A] as it is', false, '−k', 'teal'], ['1', PUR, 'LOG', 'plot ln[A]', false, '−k', 'pri'], ['2', WARM, 'FLIP', 'plot 1/[A]', true, '+k', 'warm']]
  EZ.scene('hack', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Quick trick</div><h2 class="h1" data-at="0">“Zero, Log, Flip”</h2>
      ${HACK.map(([n, col, wd, s, up, sl, cls], i) => `<div class="card h-hc" style="left:${120 + i * 570}px" data-at="0@${0.55 + i * 0.13}" data-fx="pop">
        <div class="n" style="background:${col}">${n}</div><div class="w ${cls}">${wd}</div>
        <div class="s" data-at="${i + 1}" data-fx="fade">${s}</div>
        <div data-at="${i + 1}@0.3" data-fx="fade">${hackMini(up, col, sl, `${i + 1}@0.4`, `5@${0.3 + i * 0.22}`)}</div></div>`).join('')}
      <div class="banner" style="top:830px" data-at="4" data-out="6" data-fx="pop">The <span class="good">straight line</span> wins</div>
      <div class="banner" style="top:830px;font-size:44px" data-at="6+0.2" data-fx="pop">Second order: slope <span class="warm">+k</span>, because 1/[A] <span class="warm">grows</span> as [A] <span class="teal">shrinks</span></div>`,
  })

  // ---------- half-life ----------
  const PTS = [[0, '100. mg'], [8, '50.0 mg'], [16, '25.0 mg'], [24, '12.5 mg']]
  const FR = ['', '½ left', '¼ left', '⅛ left']
  const ptAt = ['3@0.1', '3@0.9', '4@0.4', '4@0.95']
  EZ.scene('halflife', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Half-life</div><h2 class="h1" data-at="0">Half-life, t<sub>1/2</sub></h2>
      <div class="h-chip" style="left:640px;top:196px;border-color:rgba(242,196,67,.6)" data-at="9" data-fx="pop">only <span class="gold">first order</span> has a constant t<sub>1/2</sub></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><path d="M${HX(0)} 360 V870 H1090" class="h-ax"/>
          <text transform="translate(176 615) rotate(-90)" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">mass left (mg)</text>
          <text x="1102" y="880" font-size="30" font-weight="800" class="f-muted">days</text>
          ${PTS.map(([d]) => `<line x1="${HX(d)}" x2="${HX(d)}" y1="870" y2="884" class="h-ax"/><text x="${HX(d)}" y="918" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">${d === 8 ? '8.0' : d}</text>`).join('')}
          <text x="330" y="312" font-size="34" font-weight="900" class="f-teal">isotope: t<tspan dy=".3em" font-size=".62em">1/2</tspan><tspan dy="-.3em"> = 8.0 days</tspan></text></g>
        <path d="${decay(0, 8)}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" data-at="3@0.25" data-fx="draw" data-dur="1.6"/>
        <path d="${decay(8, 16)}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" data-at="4@0.02" data-fx="draw" data-dur="1.2"/>
        <path d="${decay(16, 24)}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" data-at="4@0.5" data-fx="draw" data-dur="1.2"/>
        <path d="${decay(24, 26)}" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" stroke-opacity=".5" data-at="7" data-fx="draw" data-dur="0.6"/>
        ${PTS.slice(1).map(([d], i) => `<line x1="${HX(d)}" x2="${HX(d)}" y1="${HY(100 * 0.5 ** (d / 8)) + 14}" y2="866" stroke="${MUTED}" stroke-width="3" stroke-dasharray="8 8" data-at="5@${0.1 + i * 0.15}" data-fx="fade"/>`).join('')}
        ${PTS.slice(1).map(([d], i) => `<g data-at="5@${0.2 + i * 0.15}" data-fx="fade"><path d="M${HX(d - 8) + 8} 940 V952 H${HX(d) - 8} V940" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linejoin="round"/>
          <text x="${HX(d - 4)}" y="990" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">8.0 days</text></g>`).join('')}
        ${PTS.map(([d, lab], i) => { const x = HX(d), y = HY(100 * 0.5 ** (d / 8))
          return `<g data-at="${ptAt[i]}" data-fx="pop"><circle cx="${x}" cy="${y}" r="16" fill="${TEAL}"/></g>
          <text x="${x + 26}" y="${y - 20}" font-size="34" font-weight="900" data-at="${ptAt[i]}" data-fx="fade">${lab}</text>
          ${i ? `<text x="${x + 26}" y="${y - 66}" font-size="36" font-weight="900" class="f-gold" data-at="6@${0.05 + i * 0.27}" data-fx="pop">${FR[i]}</text>` : ''}` }).join('')}
      </svg>
      <div class="h-note" style="top:300px;border-left-color:${TEAL}" data-at="0@0.3" data-fx="right"><b class="teal">Half-life</b><span>the time needed for half of a reactant to be used up</span></div>
      <div class="h-note" style="top:490px;border-left-color:${PUR}" data-at="1" data-fx="right"><b class="pri">Constant (first order)</b><span>doesn’t depend on how much you start with</span></div>
      <div class="h-note" style="top:680px;border-left-color:${GOLD}" data-at="6" data-fx="right"><div class="h-fr">1 ${ARR} <em class="gold">½</em> ${ARR} <em class="gold">¼</em> ${ARR} <em class="gold">⅛</em></div>
        <span data-at="7" data-fx="fade">after n half-lives: <b class="gold" style="display:inline;font-size:34px">(½)<sup>n</sup></b> remains</span></div>
      <div class="h-big" style="top:880px" data-at="8" data-fx="pop">t<sub>1/2</sub> = <span class="teal">0.693</span> / <span class="pri">k</span></div>`,
  })

  // ---------- worked example ----------
  const step = (i, top, at, col, label, eq, res) => `<div class="h-step" style="top:${top}px" data-at="${at}"><div class="n" style="background:${col}">${i}</div><div class="lb" style="color:${col}">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div><div class="h-res" data-at="${res[1]}" data-fx="pop">${res[0]}</div></div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">A first-order calculation</h2>
      <div class="card h-prob" data-at="1"><span class="pri">k = 0.0500 s<sup>−1</sup></span>, <span class="teal">[A]<sub>0</sub> = 0.800 M</span>. Find [A] after <span class="warm">20.0 s</span>, and t<sub>1/2</sub>.</div>
      <div class="h-step" style="top:450px" data-at="2"><div class="n" style="background:${TEAL}">1</div><div class="lb" style="color:${TEAL}">ln[A]</div>
        <div class="eq" data-at="2@0.3" data-fx="fade">= ln(0.800) − (0.0500)(20.0)<span data-at="3" data-fx="fade"> = −0.223 − 1.000</span></div>
        <div class="h-res" data-at="3@0.75" data-fx="pop">−1.223</div></div>
      ${step(2, 590, '4', WARM, '[A]', '= e<sup>−1.223</sup> =', ['0.294 M', '4@0.85'])}
      ${step(3, 730, '5', PUR, 't<sub>1/2</sub>', '= 0.693 ÷ 0.0500 =', ['13.9 s', '5@0.85'])}
      <div class="banner" style="top:880px;padding:16px 40px" data-at="5@0.95" data-fx="pop">[A] = <span class="good">0.294 M</span> after 20.0 s &nbsp;·&nbsp; t<sub>1/2</sub> = <span class="good">13.9 s</span></div>`,
  })

  // ---------- try it ----------
  const prow = (i, top, at, label, eq) => `<div class="h-step" style="top:${top}px" data-at="${at}"><div class="n" style="background:${i === 1 ? TEAL : PUR}">${i}</div><div class="lb">${label}</div><div class="eq" style="left:420px" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What <span class="teal">fraction</span> remains after 30.0 min?</h2>
      <div class="h-chip" style="left:120px;top:310px" data-at="1@0.15" data-fx="pop"><span class="pri">first order</span></div>
      <div class="h-chip" style="left:400px;top:310px" data-at="1@0.3" data-fx="pop">half-life: <span class="teal">10.0 min</span></div>
      <div class="h-chip" style="left:830px;top:310px" data-at="1@0.75" data-fx="pop">time: <span class="warm">30.0 min</span></div>
      <div class="h-chip" style="left:1230px;top:310px" data-at="1@0.85" data-fx="pop">fraction left = <span class="gold">?</span></div>
      <svg class="full h-count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="h-arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="h-num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="h-ans" data-at="3" data-fx="pop"><span class="good">0.125 = ⅛ remains</span>${CHECK}</div>
      ${prow(1, 620, '4', 'half-lives', '30.0 min ÷ 10.0 min = <span class="teal">3 half-lives</span>')}
      ${prow(2, 760, '5', 'fraction', '(½)<sup>3</sup> = <span class="good">⅛ = 0.125</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.h-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.h-arc').setAttribute('stroke-dashoffset', p)
      c.$('.h-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.h-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const tiny = (i, ox, ok) => `<path d="M${ox} 20 V150 H${ox + 120}" class="h-ax" style="stroke-width:4"/><path d="${poly(plotPath(i, ox + 8, 140, 104, 110, 0.5))}" fill="none" stroke="${ok ? GOOD : PUR}" stroke-width="7" stroke-linecap="round"/>`
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210">${tiny(0, 20, false)}${tiny(1, 170, true)}${tiny(2, 320, false)}
    <text x="80" y="196" text-anchor="middle" font-size="26" font-weight="900" class="f-muted">[A]</text><text x="230" y="196" text-anchor="middle" font-size="26" font-weight="900" class="f-good">ln[A]</text><text x="380" y="196" text-anchor="middle" font-size="26" font-weight="900" class="f-muted">1/[A]</text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210">${[[20, TEAL, false, '−k'], [170, PUR, false, '−k'], [320, WARM, true, '+k']].map(([ox, col, up, s]) => `<path d="M${ox} 20 V150 H${ox + 120}" class="h-ax" style="stroke-width:4"/>
    <line x1="${ox + 10}" x2="${ox + 110}" y1="${up ? 140 : 40}" y2="${up ? 40 : 140}" stroke="${col}" stroke-width="7" stroke-linecap="round"/><text x="${ox + 60}" y="196" text-anchor="middle" font-size="30" font-weight="900" style="fill:${col}">${s}</text>`).join('')}</svg>`
  const RX = (d) => 40 + (d / 26) * 380, RY = (m) => 180 - (m / 100) * 160
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="M40 10 V184 H440" class="h-ax" style="stroke-width:4"/>
    <path d="${(() => { const p = []; for (let d = 0; d <= 26; d += 0.5) p.push([RX(d), RY(100 * 0.5 ** (d / 8))]); return poly(p) })()}" fill="none" stroke="${PUR}" stroke-width="7" stroke-linecap="round"/>
    ${[0, 8, 16, 24].map((d) => `<circle cx="${RX(d)}" cy="${RY(100 * 0.5 ** (d / 8))}" r="10" fill="${TEAL}"/>`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card h-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p><span class="teal">[A]</span> vs t ${ARR} 0th order<br><span class="pri">ln[A]</span> vs t ${ARR} 1st order<br><span class="warm">1/[A]</span> vs t ${ARR} 2nd order</p></div>
      <div class="card h-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Slopes:<br><span class="teal">−k</span>, <span class="pri">−k</span>, <span class="warm">+k</span></p></div>
      <div class="card h-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>First order:<br>t<sub>1/2</sub> = <span class="teal">0.693/k</span><br>the half-life is <span class="gold">constant</span></p></div>`,
  })
})()
