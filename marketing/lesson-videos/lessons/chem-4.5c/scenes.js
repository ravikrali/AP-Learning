// Pictures for chem-4.5c "Stoichiometry with Gases & Solutions". One EZ.scene per scene id in
// script.mjs. Every number shown is the lesson's own (app/src/content/chem/u4.ts; the 298 K volume
// and the 40.0 mL example are from book.ts). Ion sizes are in the right order, not to scale.
(() => {
  const { lerp, eio, eo, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-icon{top:300px;width:420px;height:280px;text-align:center}
    .x-icon p{position:absolute;left:0;right:0;bottom:22px;margin:0;font-size:36px;font-weight:900;white-space:nowrap}
    .x-door{position:absolute;width:480px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-door .l{position:absolute;left:28px;top:16px;font-size:28px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-door .f{position:absolute;left:28px;top:56px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-side{position:absolute;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
    .x-prob{left:120px;top:290px;width:1140px;height:170px;padding:24px 40px 0}
    .x-prob .e{font-size:34px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-prob .q{margin-top:14px;font-size:38px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1140px;height:110px;border-radius:24px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-row .n{position:absolute;left:22px;top:21px;width:68px;height:68px;border-radius:50%;font-size:38px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .x-row .lb{position:absolute;left:112px;top:10px;font-size:26px;font-weight:900;white-space:nowrap}
    .x-row .eq{position:absolute;left:112px;top:46px;font-size:38px;font-weight:900;white-space:nowrap}
    .x-row .res{position:absolute;right:18px;top:16px;height:76px;padding:0 26px;border-radius:20px;font-size:38px;font-weight:900;line-height:72px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .x-pic{left:1310px;top:290px;width:490px;height:570px}
    .x-wide{left:120px;width:1680px;text-align:center;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;font-weight:900;white-space:nowrap}
    .x-box{position:absolute;top:60px;width:260px;height:90px;border-radius:22px;text-align:center;font-size:40px;font-weight:900;line-height:84px;border:3px solid}
    .x-strip{left:120px;top:515px;width:1140px;height:88px;padding:0 36px;font-size:34px;font-weight:800;line-height:84px;white-space:nowrap}
    .x-chip{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:68px;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .x-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .x-trow{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-trow .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;font-size:38px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .x-trow .lb{position:absolute;left:124px;top:36px;font-size:36px;font-weight:900;white-space:nowrap}
    .x-trow .eq{position:absolute;left:420px;top:34px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', GOLD = '#f2c443', LINE = '#c9cee0'
  const place = (el, x, y) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  /** SVG formula text with lowered subscripts: F('CO2') */
  const F = (s) => s.replace(/([A-Za-z)])(\d+)(.*)$/, (_, a, d, rest) => `${a}<tspan dy=".46em" font-size=".65em">${d}</tspan><tspan dy="-.3em">${F(rest)}</tspan>`)

  // ---------- shared drawings ----------
  const balloon = (r, fill = 'url(#g-teal)') => `<path d="M0 0 q-10 14 0 26" fill="none" stroke="${LINE}" stroke-width="3"/>
    <ellipse cx="0" cy="${-r}" rx="${r * 0.92}" ry="${r}" fill="${fill}"/><ellipse cx="${-r * 0.32}" cy="${-r * 1.4}" rx="${r * 0.26}" ry="${r * 0.16}" fill="#fff" opacity=".22"/>
    <path d="M-7 2 L7 2 L0 -8 Z" fill="${fill}"/>`
  const beaker = (x, y, w, h) => `<path d="M${x} ${y} L${x} ${y + h - 20} Q${x} ${y + h} ${x + 20} ${y + h} L${x + w - 20} ${y + h} Q${x + w} ${y + h} ${x + w} ${y + h - 20} L${x + w} ${y}" fill="rgba(255,255,255,.04)" stroke="${LINE}" stroke-width="5" stroke-linejoin="round"/>`
  const cylinder = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="rgba(255,255,255,.04)" stroke="${LINE}" stroke-width="5"/>
    <rect x="${x - 34}" y="${y + h}" width="${w + 68}" height="20" rx="8" fill="${LINE}"/>`

  // ---------- intro artwork: faint lab glassware at the left and right edges ----------
  EZ.intro = {
    chips: [['1@0.3', 'Three doors to moles'], ['1@0.55', 'Gas volumes'], ['1@0.8', 'Solution volumes']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">
      <g transform="translate(200 420)">${balloon(100)}</g>
      <g transform="translate(110 640)">${beaker(0, 0, 220, 230)}<rect x="4" y="100" width="212" height="126" rx="14" fill="${PUR}" opacity=".6"/></g>
      <g transform="translate(1770 120)">${cylinder(0, 0, 90, 290)}<rect x="4" y="150" width="82" height="136" fill="${TEAL}" opacity=".6"/></g>
      <g transform="translate(1600 760)"><rect x="0" y="80" width="250" height="56" rx="14" fill="#363c54" stroke="${LINE}" stroke-width="4"/><rect x="115" y="40" width="20" height="40" fill="${LINE}"/><rect x="20" y="24" width="210" height="18" rx="9" fill="${LINE}"/></g></svg>`,
  }

  // ---------- hook: lab problems give liters and milliliters; moles are the hub ----------
  const scaleIcon = `<rect x="130" y="140" width="160" height="40" rx="10" fill="#363c54" stroke="${LINE}" stroke-width="4"/><rect x="200" y="112" width="20" height="30" fill="${LINE}"/>
    <rect x="110" y="98" width="200" height="16" rx="8" fill="${LINE}"/><rect x="170" y="62" width="34" height="34" rx="6" fill="${GOLD}"/><rect x="210" y="70" width="28" height="26" rx="6" fill="${GOLD}" opacity=".8"/>
    <text x="210" y="171" text-anchor="middle" font-size="22" font-weight="900" class="f-teal">g</text>`
  const DOTS = [[180, 70], [235, 60], [205, 110], [250, 130], [175, 150], [228, 160], [190, 95], [245, 95]]
  const gasIcon = `<rect x="145" y="30" width="130" height="160" rx="24" fill="rgba(60,199,188,.08)" stroke="${LINE}" stroke-width="4"/><rect x="170" y="14" width="80" height="22" rx="6" fill="${LINE}"/>
    ${DOTS.map((_, i) => `<circle class="gd${i}" r="9" fill="${TEAL}"/>`).join('')}`
  const solIcon = `${beaker(150, 30, 120, 160)}<rect x="153" y="95" width="114" height="92" rx="10" fill="${PUR}" opacity=".55"/>
    ${[60, 95, 130, 165].map((y) => `<line x1="250" y1="${y}" x2="268" y2="${y}" stroke="${LINE}" stroke-width="3"/>`).join('')}`
  const HUB = [960, 770]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">In the lab</div><h2 class="h1" data-at="0">Moles are still the hub</h2>
      <div class="card x-icon x-mass" style="left:270px" data-at="0@0.3"><svg width="420" height="200" viewBox="0 0 420 200" style="margin-top:20px">${scaleIcon}</svg><p class="gold">mass (g)</p></div>
      <div class="card x-icon" style="left:750px" data-at="1@0.25"><svg width="420" height="200" viewBox="0 0 420 200" style="margin-top:20px">${gasIcon}</svg><p class="teal">gas volume (L)</p></div>
      <div class="card x-icon" style="left:1230px" data-at="1@0.6"><svg width="420" height="200" viewBox="0 0 420 200" style="margin-top:20px">${solIcon}</svg><p class="pri">solution volume (mL)</p></div>
      <svg class="full" viewBox="0 0 1920 1080">
        ${[[480, 598, 878, 724], [960, 598, 960, 668], [1440, 598, 1042, 724]].map(([a, b, c, d], i) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#eef0f7" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-text)" data-at="3@${0.15 + i * 0.15}" data-fx="draw"/>`).join('')}
        <g data-at="2@0.2" data-fx="pop"><g transform="translate(${HUB[0]} ${HUB[1]})"><circle r="92" fill="url(#g-gold)"/><ellipse cx="-28" cy="-36" rx="32" ry="18" fill="#fff" opacity=".2"/>
          <text y="14" text-anchor="middle" font-size="42" font-weight="900" class="f-dark">moles</text></g></g>
      </svg>
      <div class="banner" style="top:890px;padding:16px 40px" data-at="5" data-fx="pop">Moles connect substances through the <span class="gold">balanced equation</span></div>`,
    update(c) {
      const b = c.b
      // grams are "rarely" given: the mass card dims, then comes back as one of the three ways in
      c.$('.x-mass').style.filter = `brightness(${1 - 0.5 * c.seg(b[0].end - 0.6, b[0].end) + 0.5 * c.seg(b[4].start, b[4].start + 0.6)})`
      const k = 1 - eo(c.seg(b[4].start + 0.5, b[5].start)) // gas particles settle as the scene goes on
      DOTS.forEach(([x, y], i) => place(c.$('.gd' + i), x + Math.sin(c.t * 2.3 + i * 1.7) * 7 * k, y + Math.cos(c.t * 2.9 + i * 2.1) * 7 * k))
    },
  })

  // ---------- three doors into moles, then the mole ratio, then out ----------
  const DY = [395, 565, 735], AX = 810, BX = 1110, CY = 565, R = 88
  const OUT = ['grams', 'liters of gas', 'liters of solution']
  const DOORS = [['mass (g)', 'm ÷ M', 'pri', PUR], ['gas (P, V, T)', 'PV ÷ RT', 'teal', TEAL], ['solution (M, L)', 'molarity × liters', 'warm', WARM]]
  const toward = (x0, y0, x1, y1, d) => { const L = Math.hypot(x1 - x0, y1 - y0); return [x0 + (x1 - x0) * (1 - d / L), y0 + (y1 - y0) * (1 - d / L)] }
  const hub = (x, label, g) => `<g transform="translate(${x} ${CY})"><circle r="${R}" fill="url(#g-${g})"/><ellipse cx="-26" cy="-34" rx="30" ry="16" fill="#fff" opacity=".2"/>
    <text y="4" text-anchor="middle" font-size="36" font-weight="900" class="f-dark">moles</text><text y="42" text-anchor="middle" font-size="30" font-weight="900" class="f-dark">${label}</text></g>`
  EZ.scene('doors', {
    html: `<div class="kicker" data-at="in" data-fx="left">The big idea</div><h2 class="h1" data-at="0">Three doors into moles</h2>
      ${DOORS.map(([l, f, cls], i) => `<div class="x-door" style="left:120px;top:${DY[i] - 65}px" data-at="${i + 1}" data-fx="left"><div class="l">${l}</div><div class="f ${cls}">${f}</div></div>`).join('')}
      ${DOORS.map(([l, f, cls], i) => `<div class="x-door xo${i}" style="left:1320px;top:${DY[i] - 65}px" data-at="5@${0.45 + i * 0.06}" data-fx="right"><div class="l">${l}</div><div class="f ${cls}">${OUT[i]}</div></div>`).join('')}
      <div class="x-side" style="left:120px;top:262px" data-at="1" data-fx="fade">in</div>
      <div class="x-side" style="left:1320px;top:262px" data-at="5@0.45" data-fx="fade">out</div>
      <svg class="full" viewBox="0 0 1920 1080">
        ${DY.map((y, i) => { const [x1, y1] = toward(608, y, AX, CY, R + 10); return `<line x1="608" y1="${y}" x2="${x1.toFixed(0)}" y2="${y1.toFixed(0)}" stroke="${DOORS[i][3]}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-${['pri', 'teal', 'warm'][i]})" data-at="${i + 1}@0.3" data-fx="draw"/>` }).join('')}
        ${DY.map((y, i) => { const [x0, y0] = toward(1312, y, BX, CY, R + 4); return `<line x1="${x0.toFixed(0)}" y1="${y0.toFixed(0)}" x2="1306" y2="${y}" stroke="#7d859c" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-muted)" data-at="5@${0.5 + i * 0.06}" data-fx="draw"/>` }).join('')}
        <g data-at="0@0.3" data-fx="pop">${hub(AX, 'A', 'gold')}</g>
        <g data-at="4@0.2" data-fx="pop">${hub(BX, 'B', 'gold')}</g>
        <line x1="${AX + R + 8}" y1="${CY}" x2="${BX - R - 14}" y2="${CY}" stroke="${WARM}" stroke-width="8" stroke-linecap="round" marker-end="url(#mk-warm)" data-at="4@0.45" data-fx="draw"/>
        <text x="960" y="446" text-anchor="middle" font-size="34" font-weight="900" class="f-warm" data-at="4@0.6" data-fx="fade">× mole ratio</text>
        <g class="trav"><circle r="30" fill="${WARM}" opacity=".3"/><circle r="15" fill="#fff"/></g>
      </svg>
      <div class="banner" style="top:880px;padding:16px 40px" data-at="6" data-fx="pop">The <span class="warm">mole ratio</span> sits in the middle, every time</div>`,
    update(c) {
      const b = c.b, t0 = b[5].start + 0.2, t1 = b[5].end - 0.1, u = 3 * eio(c.seg(t0, t1))
      const el = c.$('.trav')
      el.style.opacity = c.t < t0 || c.t > t1 + 0.4 ? 0 : Math.min(1, (c.t - t0) * 4, (t1 + 0.4 - c.t) * 4)
      // in through the mass door, across the ratio, out through the gas door
      const P = [[608, DY[0]], [AX, CY], [BX, CY], [1312, DY[1]]]
      const k = Math.min(2, Math.floor(u)), f = u - k
      place(el, lerp(P[k][0], P[k + 1][0], f), lerp(P[k][1], P[k + 1][1], f))
      const hi = eo(c.seg(t1 - 0.3, t1 + 0.2))
      c.$('.xo1').style.borderColor = hi ? `rgba(60,199,188,${hi})` : ''
    },
  })

  // ---------- worked example: solid to gas ----------
  const row = (i, top, at, col, label, eq, res, resAt) => `<div class="x-row" style="top:${top}px" data-at="${at}"><div class="n" style="background:${col}">${i}</div><div class="lb" style="color:${col}">${label}</div>
      <div class="eq" data-at="${at}@0.25" data-fx="fade">${eq}</div><div class="res" data-at="${resAt}" data-fx="pop">${res}</div></div>`
  EZ.scene('gas', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Solid → gas</h2>
      <div class="card x-prob" data-at="1"><div class="e">CaCO<sub>3</sub>(s) → CaO(s) + CO<sub>2</sub>(g)</div>
        <div class="q" data-at="2" data-fx="fade">Volume of <span class="teal">CO<sub>2</sub></span> at STP from <span class="pri">25.0 g CaCO<sub>3</sub></span>?</div></div>
      ${row(1, 490, '3', PUR, 'in: mass door', '25.0 g ÷ 100.09 g/mol =', '0.250 mol CaCO<sub>3</sub>', '3@0.85')}
      ${row(2, 615, '4', WARM, 'mole ratio', '1 : 1 &nbsp;→', '0.250 mol CO<sub>2</sub>', '4@0.7')}
      ${row(3, 740, '5', TEAL, 'out: gas door (STP)', '0.250 mol × 22.4 L/mol =', '<span class="good">5.60 L CO<sub>2</sub></span>', '6@0.75')}
      <div class="card x-pic" data-at="1@0.3"><svg width="490" height="570" viewBox="0 0 490 570">
        <g data-at="5@0.2" data-fx="fade"><text x="245" y="52" text-anchor="middle" font-size="36" font-weight="900" class="f-gold">1 mol gas = 22.4 L</text>
          <text x="245" y="90" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">at STP</text></g>
        <g class="bal" transform="translate(245 330)">${balloon(1)}</g>
        <text class="balt f-dark" x="245" y="270" text-anchor="middle" font-size="40" font-weight="900" style="fill:#10131c">${F('CO2')}</text>
        <path d="M210 330 L210 450 Q210 482 245 482 Q280 482 280 450 L280 330" fill="rgba(255,255,255,.05)" stroke="${LINE}" stroke-width="5"/>
        ${[[228, 462], [250, 466], [266, 458], [238, 446], [258, 442]].map(([x, y]) => `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="3" fill="#eef0f7"/>`).join('')}
        <g data-at="1@0.5" data-fx="fade"><g class="flame"><path d="M245 498 C222 528 226 556 245 560 C264 556 268 528 245 498 Z" fill="${WARM}"/><path d="M245 522 C236 538 238 552 245 554 C252 552 254 538 245 522 Z" fill="${GOLD}"/></g></g>
      </svg></div>`,
    update(c) {
      const b = c.b, r = 18 + 82 * eio(c.seg(b[1].start + 1, b[6].start + 1.6))
      c.$('.bal').innerHTML = balloon(r)
      c.$('.balt').style.opacity = c.seg(b[3].start, b[3].start + 0.6) * (r > 50 ? 1 : 0)
      c.$('.balt').setAttribute('y', (330 - r + 14).toFixed(1))
      const fl = 1 + 0.06 * Math.sin(c.t * 9) * (1 - c.seg(b[6].end - 0.5, b[6].end)) // a small flicker while heating
      c.$('.flame').setAttribute('transform', `translate(245 560) scale(1 ${fl.toFixed(3)}) translate(-245 -560)`)
    },
  })

  // ---------- watch out: 22.4 L/mol only at STP ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="1">22.4 L/mol works only at STP</h2>
      <div class="card x-wide" style="top:290px;height:120px;font-size:54px;line-height:116px" data-at="2">PV = nRT &nbsp;${ARR}&nbsp; <span class="warm">V = nRT / P</span></div>
      <div class="card x-wide" style="top:430px;height:100px;font-size:44px;line-height:96px" data-at="4">V = 0.250 × 0.08206 × 298 ÷ 1.00 ≈ <span class="good">6.11 L</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.4" data-fx="fade"><g transform="translate(720 800)">${balloon(88)}</g><line x1="720" y1="826" x2="720" y2="862" stroke="${LINE}" stroke-width="3"/>
          <text x="720" y="726" text-anchor="middle" font-size="38" font-weight="900" class="f-dark" style="fill:#10131c">${F('CO2')}</text>
          <text x="580" y="700" text-anchor="end" font-size="34" font-weight="800" class="f-muted">at STP</text>
          <text x="580" y="752" text-anchor="end" font-size="46" font-weight="900" class="f-teal">5.60 L</text></g>
        <g data-at="3@0.3" data-fx="fade"><g class="wb" transform="translate(1210 800)">${balloon(88)}</g><line x1="1210" y1="826" x2="1210" y2="862" stroke="${LINE}" stroke-width="3"/>
          <text class="wt f-dark" x="1210" y="726" text-anchor="middle" font-size="38" font-weight="900" style="fill:#10131c">${F('CO2')}</text>
          <text x="1350" y="700" font-size="34" font-weight="800" class="f-muted">1.00 atm, 298 K</text></g>
        <text x="1350" y="752" font-size="46" font-weight="900" class="f-warm" data-at="4@0.85" data-fx="fade">≈ 6.11 L</text>
        <g data-at="5@0.3" data-fx="fade"><line x1="830" y1="712" x2="1080" y2="712" stroke="${WARM}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-warm)"/>
          <text x="955" y="690" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">warmer</text></g>
      </svg>
      <div class="banner" style="top:886px;padding:16px 40px" data-at="6" data-fx="pop">Check the conditions before you use <span class="gold">22.4 L/mol</span></div>`,
    update(c) {
      const b = c.b, p = eio(c.seg(b[5].start + 0.3, b[5].start + 1.6)), r = 88 + 16 * p
      c.$('.wb').innerHTML = balloon(r, p > 0.5 ? 'url(#g-warm)' : 'url(#g-teal)')
      c.$('.wt').setAttribute('y', (800 - r + 14).toFixed(1))
    },
  })

  // ---------- worked example: solution to precipitate ----------
  const AG = [[150, 300], [260, 280], [340, 350], [190, 410], [300, 440]]
  const CL = [[222, 336], [336, 262], [170, 456], [258, 384], [356, 452], [170, 252], [240, 296]]
  const SLOT = [[140, 478], [220, 478], [300, 478], [180, 442], [260, 442]]
  EZ.scene('solution', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Solution → precipitate</h2>
      <div class="card x-prob" data-at="1"><div class="e">Ag<sup>+</sup>(aq) + Cl<sup>−</sup>(aq) → AgCl(s)</div>
        <div class="q" data-at="1@0.2" data-fx="fade"><span class="pri">50.0 mL of 0.200 M AgNO<sub>3</sub></span>, excess NaCl. Grams of <span class="teal">AgCl</span>?</div></div>
      <div class="x-row" style="top:490px" data-at="2"><div class="n" style="background:${WARM}">1</div><div class="lb" style="color:${WARM}">in: solution door</div>
        <div class="eq" data-at="2@0.4" data-fx="fade" data-out="3"><span class="muted">50.0 mL =</span> 0.0500 L</div>
        <div class="eq" data-at="3+0.3" data-fx="fade">0.200 M × 0.0500 L =</div><div class="res" data-at="3@0.85" data-fx="pop">0.0100 mol Ag<sup>+</sup></div></div>
      ${row(2, 615, '4', GOLD, 'mole ratio', 'Ag<sup>+</sup> : AgCl = 1 : 1 &nbsp;→', '0.0100 mol AgCl', '4@0.8')}
      ${row(3, 740, '5', PUR, 'out: mass door', '0.0100 mol × 143.32 g/mol =', '<span class="good">1.43 g AgCl</span>', '5@0.85')}
      <div class="card x-pic" data-at="1@0.4"><svg width="490" height="570" viewBox="0 0 490 570">
        <circle cx="110" cy="60" r="16" fill="url(#g-gray)"/><text x="136" y="72" font-size="34" font-weight="900">${sup('Ag', '+')}</text>
        <circle cx="290" cy="60" r="20" fill="url(#g-green)"/><text x="320" y="72" font-size="34" font-weight="900">${sup('Cl', '−')}</text>
        <rect x="98" y="210" width="294" height="292" rx="16" fill="${PUR}" opacity=".14"/>
        ${beaker(95, 140, 300, 365)}
        ${CL.map((_, i) => `<g class="cl${i}">${ball(0, 0, 20, 'green')}</g>`).join('')}
        ${AG.map((_, i) => `<g class="ag${i}">${ball(0, 0, 16, 'gray')}</g>`).join('')}
        <text x="245" y="548" text-anchor="middle" font-size="30" font-weight="900" class="f-teal" data-at="5@0.6" data-fx="fade">AgCl precipitate</text>
      </svg></div>`,
    update(c) {
      const b = c.b, t = c.t
      const pair = eio(c.seg(b[4].start + 0.3, b[4].start + 1.8)), sink = eio(c.seg(b[5].start + 0.3, b[5].start + 2.2))
      const w = 1 - c.seg(b[4].start, b[4].start + 0.6) // gentle drifting until the ions pair up
      CL.forEach(([x, y], i) => {
        let cx = x + Math.sin(t * 1.3 + i) * 6 * w, cy = y + Math.cos(t * 1.1 + i * 2) * 6 * w
        if (i < SLOT.length) { cx = lerp(cx, SLOT[i][0] + 18, sink); cy = lerp(cy, SLOT[i][1], sink) }
        place(c.$('.cl' + i), cx, cy)
      })
      AG.forEach(([x, y], i) => {
        const [qx, qy] = CL[i]
        let cx = lerp(x + Math.cos(t * 1.2 + i) * 6 * w, qx - 36, pair), cy = lerp(y + Math.sin(t * 1.4 + i) * 6 * w, qy, pair)
        cx = lerp(cx, SLOT[i][0] - 18, sink); cy = lerp(cy, SLOT[i][1], sink)
        place(c.$('.ag' + i), cx, cy)
      })
    },
  })

  // ---------- molarity in both directions ----------
  EZ.scene('reverse', {
    html: `<div class="kicker" data-at="in" data-fx="left">Both directions</div><h2 class="h1" data-at="0">Molarity works both ways</h2>
      <div class="card" style="left:120px;top:290px;width:1140px;height:210px" data-at="0@0.3">
        <div class="x-box" style="left:60px;border-color:${TEAL};color:${TEAL}">liters</div>
        <div class="x-box" style="left:820px;border-color:${GOLD};color:${GOLD}">moles</div>
        <svg style="position:absolute;left:0;top:0" width="1140" height="210" viewBox="0 0 1140 210">
          <line x1="345" y1="88" x2="800" y2="88" stroke="${PUR}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-pri)"/>
          <text x="572" y="68" text-anchor="middle" font-size="32" font-weight="900" class="f-pri">× molarity</text>
          <g data-at="1@0.2" data-fx="fade"><line x1="795" y1="124" x2="340" y2="124" stroke="${WARM}" stroke-width="7" stroke-linecap="round" marker-end="url(#mk-warm)"/>
            <text x="572" y="172" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">÷ molarity</text></g>
        </svg></div>
      <div class="card x-strip" data-at="2">All the Ag<sup>+</sup> from <span class="pri">0.0100 mol AgNO<sub>3</sub></span>, using <span class="teal">0.250 M NaCl</span></div>
      ${row(1, 625, '3', GOLD, 'mole ratio 1 : 1', '0.0100 mol Ag<sup>+</sup> needs', '0.0100 mol Cl<sup>−</sup>', '3@0.6')}
      ${row(2, 750, '4', WARM, 'volume = mol ÷ M', '0.0100 mol ÷ 0.250 mol/L =', '<span class="good">0.0400 L = 40.0 mL</span>', '4@0.8')}
      <div class="card x-pic" data-at="2@0.3"><svg width="490" height="570" viewBox="0 0 490 570">
        <text x="245" y="58" text-anchor="middle" font-size="34" font-weight="900" class="f-teal">0.250 M NaCl</text>
        <rect class="liq" x="188" y="500" width="114" height="0" fill="${TEAL}" opacity=".55"/>
        ${cylinder(185, 100, 120, 405)}
        ${[150, 200, 250, 300, 350, 400, 450].map((y) => `<line x1="185" y1="${y}" x2="${y % 100 ? 205 : 215}" y2="${y}" stroke="${LINE}" stroke-width="3"/>`).join('')}
        <g data-at="4@0.85" data-fx="fade"><line x1="170" y1="300" x2="320" y2="300" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 8"/>
          <text x="330" y="312" font-size="32" font-weight="900" class="f-gold">40.0 mL</text></g>
      </svg></div>
      <div class="banner" style="top:886px;padding:16px 40px" data-at="5" data-fx="pop">Small volumes: <span class="gold">mmol = M × mL</span></div>`,
    update(c) {
      const b = c.b, lvl = lerp(500, 300, eio(c.seg(b[4].start + 0.4, b[4].start + 2.6)))
      const el = c.$('.liq')
      el.setAttribute('y', lvl.toFixed(1)); el.setAttribute('height', (502 - lvl).toFixed(1))
    },
  })

  // ---------- try it ----------
  const prow = (i, top, at, label, eq) => `<div class="x-trow" style="top:${top}px" data-at="${at}"><div class="n" style="background:${i === 1 ? WARM : TEAL}">${i}</div><div class="lb">${label}</div><div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:60px" data-at="2">How many <span class="teal">moles of H<sub>2</sub></span> form from 100. mL of 1.00 M HCl?</h2>
      <div class="x-chip" style="left:120px;top:330px" data-at="1@0.5" data-fx="pop">Zn + <span class="warm">2</span>HCl → ZnCl<sub>2</sub> + H<sub>2</sub></div>
      <div class="x-chip" style="left:660px;top:330px" data-at="2@0.55" data-fx="pop">HCl: <span class="pri">100. mL, 1.00 M</span></div>
      <div class="x-chip" style="left:1150px;top:330px" data-at="2@0.8" data-fx="pop">Zn: excess</div>
      <div class="x-chip" style="left:1440px;top:330px" data-at="2@0.9" data-fx="pop">H<sub>2</sub>: <span class="warm">?</span></div>
      <svg class="full count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="4" data-fx="pop"><span class="good">0.0500 mol H<sub>2</sub></span>${CHECK}</div>
      ${prow(1, 620, '5', 'Moles of HCl', '1.00 M × 0.100 L = <span class="pri">0.100 mol HCl</span>')}
      ${prow(2, 760, '6', 'Mole ratio', 'H<sub>2</sub> : HCl = <span class="warm">1 : 2</span> &nbsp;→&nbsp; 0.100 ÷ 2 = <span class="good">0.0500 mol H<sub>2</sub></span>')}`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.arc').setAttribute('stroke-dashoffset', p)
      c.$('.num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[4].start + 0.4, b[4].start + 0.9))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- recap ----------
  const mrect = (y, label, col) => `<rect x="20" y="${y}" width="170" height="48" rx="12" fill="${col}"/><text x="105" y="${y + 34}" text-anchor="middle" font-size="26" font-weight="900" class="f-dark">${label}</text>`
  const m1 = `<svg width="460" height="210" viewBox="0 0 460 210">${mrect(14, 'g ÷ M', PUR)}${mrect(81, 'PV / RT', TEAL)}${mrect(148, 'M × L', WARM)}
    ${[38, 105, 172].map((y) => `<line x1="198" y1="${y}" x2="${y === 105 ? 300 : 306}" y2="${105 + (y - 105) * 0.25}" stroke="#eef0f7" stroke-width="5" marker-end="url(#mk-text)"/>`).join('')}
    <circle cx="370" cy="105" r="62" fill="url(#g-gold)"/><text x="370" y="115" text-anchor="middle" font-size="30" font-weight="900" class="f-dark">moles</text></svg>`
  const m2 = `<svg width="460" height="210" viewBox="0 0 460 210"><circle cx="80" cy="120" r="62" fill="url(#g-gold)"/><text x="80" y="130" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">mol A</text>
    <circle cx="380" cy="120" r="62" fill="url(#g-gold)"/><text x="380" y="130" text-anchor="middle" font-size="28" font-weight="900" class="f-dark">mol B</text>
    <line x1="150" y1="120" x2="302" y2="120" stroke="${WARM}" stroke-width="7" marker-end="url(#mk-warm)"/><text x="230" y="44" text-anchor="middle" font-size="30" font-weight="900" class="f-warm">× ratio</text></svg>`
  const m3 = `<svg width="460" height="210" viewBox="0 0 460 210"><g transform="translate(130 176)">${balloon(78)}</g>
    <text x="130" y="108" text-anchor="middle" font-size="30" font-weight="900" class="f-dark" style="fill:#10131c">22.4 L</text>
    <text x="340" y="80" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">STP</text>
    <text x="340" y="128" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">otherwise</text>
    <text x="340" y="170" text-anchor="middle" font-size="34" font-weight="900" class="f-warm">PV = nRT</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${m1}<p>Moles from<br>m ÷ M, PV/RT,<br>or M × L</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${m2}<p>Mole ratio<br>in the middle,<br><span class="gold">every time</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${m3}<p>At STP, 1 mol gas<br>= 22.4 L. Otherwise,<br>use PV = nRT</p></div>`,
  })
})()
