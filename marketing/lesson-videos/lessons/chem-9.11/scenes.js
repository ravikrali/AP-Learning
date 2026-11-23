// Pictures for chem-9.11 "Electrolysis & Faraday's Law". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, chem/book.ts, chem/glossary.ts):
// q = I × t (C = A × s, time in seconds); mol e⁻ = q ÷ F, F = 96,485 C per mol e⁻; Cu²⁺ + 2e⁻ → Cu(s);
// e⁻ per atom = ion charge (Ag⁺ 1, Cu²⁺ 2, Al³⁺ 3); same charge → half as many mol Cu as Ag; the copper
// example (2.00 A, 30.0 min → 1800 s → 3600 C → 0.0373 mol e⁻ → 0.0187 mol Cu → 1.19 g); the 4-step chain;
// the chain runs backward (book.ts); the try (0.500 A, 965 s → 482.5 C → 0.00500 mol → 0.539 g Ag).
// The plating cell is a picture with no electrode names. Ion and atom sizes keep their order (each cation
// smaller than its atom) and claim no scale.
(() => {
  const { lerp, eio, clamp, ball, sup, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-size:60px;font-weight:900;white-space:nowrap}
    .x-tl{position:absolute;width:480px;height:170px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tl .f{margin-top:30px;font-size:56px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tl .s{margin-top:18px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-cen{position:absolute;text-align:center}
    .x-pl{display:inline-block;padding:10px 32px;border-radius:999px;font-size:36px;font-weight:900;white-space:nowrap;border:3px solid var(--gold);background:rgba(242,196,67,.12)}
    .x-nd{position:absolute;top:360px;width:270px;height:150px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-nd .f{margin-top:24px;font-size:48px;font-weight:900;line-height:1;white-space:nowrap}
    .x-nd .s{margin-top:16px;font-size:26px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-op{position:absolute;top:530px;width:300px;text-align:center;font-size:32px;font-weight:900;white-space:nowrap}
    .x-hl{position:absolute;border-radius:30px;border:6px solid var(--warm);box-shadow:0 0 50px rgba(243,167,100,.45)}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', LINE = '#363c54', MUTED = '#a3abbd'
  const E = 'e<sup>−</sup>' // HTML electron
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  const op = (c, sel, o) => { c.$(sel).style.opacity = o }
  const fadeEnd = (p) => clamp((p - 0.85) / 0.15)

  // ---------- intro: a faint wire with electrons running along it ----------
  const IW0 = 200, IW1 = 1720, IN = 12
  EZ.intro = {
    chips: [['1@0.3', 'q = I × t'], ['1@0.55', "Faraday's constant"], ['1@0.8', 'The 4-step chain']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.26"><line x1="${IW0}" y1="900" x2="${IW1}" y2="900" stroke="${MUTED}" stroke-width="6" stroke-linecap="round"/>
      ${Array.from({ length: IN }, (_, i) => `<g class="x-iw${i}"><circle r="11" style="fill:${GOLD}"/></g>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start, L = IW1 - IW0
      for (let i = 0; i < IN; i++) mv(c, '.x-iw' + i, IW0 + ((t * 90 + (i * L) / IN) % L), 900)
    },
  }

  // ---------- hook: a plating cell ----------
  const WL = 50 + 326 + 50 // wire path length: up from the right bar, across, down to the left bar
  const wire = (s) => (s < 50 ? [743, 440 - s] : s < 376 ? [743 - (s - 50), 390] : [417, 390 + (s - 376)])
  const IONS = [[560, 610], [680, 680], [600, 750], [720, 600], [650, 560]]
  const DEP = [590, 630, 670, 710, 750]
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Electrolysis</div><h2 class="h1" data-at="in+0.2">Current in, metal out</h2>
      <div class="card" style="left:120px;top:300px;width:880px;height:540px" data-at="in" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade">
          <rect x="306" y="550" width="548" height="244" style="fill:rgba(60,199,188,.13)"/>
          <path d="M300 480V800H860V480" fill="none" stroke="${MUTED}" stroke-width="6" stroke-linejoin="round"/>
          <path d="M417 440V390H565M595 390H743V440" fill="none" stroke="${MUTED}" stroke-width="5"/>
          <line x1="570" y1="358" x2="570" y2="422" stroke="#eef0f7" stroke-width="6"/><line x1="590" y1="372" x2="590" y2="408" stroke="#eef0f7" stroke-width="6"/>
          <text x="580" y="345" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">power source</text>
          <rect x="400" y="440" width="34" height="330" rx="6" style="fill:#aab1c4"/>
          <rect x="726" y="440" width="34" height="330" rx="6" style="fill:#646c82"/>
          ${Array.from({ length: 5 }, (_, i) => `<g class="x-ew${i}"><circle r="8" style="fill:${GOLD}"/></g>`).join('')}
          ${IONS.map((_, i) => `<g class="x-io${i}">${ball(0, 0, 24, 'teal', sup('Cu', '2+'), 17)}</g>`).join('')}
          ${DEP.map((y, i) => `<g class="x-dp${i}" style="opacity:0">${ball(452, y, 18, 'warm', 'Cu', 14)}</g>`).join('')}
        </g>
        <g data-at="2" data-fx="fade"><text x="660" y="375" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">${sup('e', '−')}</text></g>
        <g data-at="2@0.7" data-fx="fade"><text x="440" y="832" text-anchor="middle" font-size="28" font-weight="800" class="f-warm">solid metal forms</text></g>
      </svg>
      ${['gold-plated jewelry', 'chrome bumpers', 'aluminum cans'].map((s, i) => `<div class="x-cen" style="left:1060px;width:740px;top:${320 + i * 84}px" data-at="0@${(0.2 + i * 0.2).toFixed(1)}" data-fx="pop"><div class="x-pl">${s}</div></div>`).join('')}
      <div class="card" style="left:1060px;top:600px;width:740px;height:240px" data-at="3"></div>
      <div class="x-lab muted" style="left:1060px;width:740px;top:625px;font-size:30px" data-at="3">for a given metal</div>
      <div class="x-lab" style="left:1060px;width:740px;top:680px;font-size:50px" data-at="3@0.4"><span class="teal">current</span> and <span class="warm">time</span></div>
      <div class="x-lab" style="left:1060px;width:740px;top:760px;font-size:40px" data-at="3@0.7">${ARR} amount of metal</div>
      <div class="banner" style="top:870px;font-size:44px" data-at="1@0.3" data-out="4" data-fx="pop">A current drives a reaction that would not happen by itself</div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Amps and minutes ${ARR} <span class="gold">grams?</span></div>`,
    update(c) {
      const t = c.t - c.sc.start
      for (let i = 0; i < 5; i++) { const [x, y] = wire((t * 110 + (i * WL) / 5) % WL); mv(c, '.x-ew' + i, x, y) }
      IONS.forEach(([sx, sy], i) => {
        const p = eio(c.p(`2+${0.3 * i}`, 1.4)), w = (1 - p) * 5
        mv(c, '.x-io' + i, lerp(sx, 452, p) + w * Math.sin(t * 1.3 + i), lerp(sy, DEP[i], p) + w * Math.cos(t * 1.1 + 2 * i))
        op(c, '.x-io' + i, 1 - fadeEnd(p)); op(c, '.x-dp' + i, fadeEnd(p))
      })
    },
  })

  // ---------- step 1: charge ----------
  const CW0 = 200, CW1 = 1720, CN = 10
  EZ.scene('charge', {
    html: `<div class="kicker" data-at="in" data-fx="left">Step 1 · Charge</div><h2 class="h1" data-at="in+0.2">Current × time = charge</h2>
      <div class="x-eq" style="top:290px;font-size:88px" data-at="1"><span class="gold">q</span> = <span class="teal">I</span> × <span class="warm">t</span></div>
      <div class="x-tl" style="left:200px;top:430px" data-at="2" data-fx="pop"><div class="f gold">q</div><div class="s">charge · coulombs (C)</div></div>
      <div class="x-tl" style="left:720px;top:430px" data-at="2@0.3" data-fx="pop"><div class="f teal">I</div><div class="s">current · amps (A)</div></div>
      <div class="x-tl" style="left:1240px;top:430px;border-color:${GOLD}" data-at="2@0.6" data-fx="pop"><div class="f warm">t</div><div class="s">time · <span class="gold">seconds (s)</span></div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.5" data-fx="fade"><line x1="${CW0}" y1="700" x2="${CW1}" y2="700" stroke="${MUTED}" stroke-width="6" stroke-linecap="round"/>
          ${Array.from({ length: CN }, (_, i) => `<g class="x-ce${i}"><circle r="11" style="fill:${GOLD}"/></g>`).join('')}
          <text x="960" y="770" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">charge flowing</text></g>
      </svg>
      <div class="banner" style="top:860px" data-at="3" data-out="4" data-fx="pop">C = A × s</div>
      <div class="banner" style="top:860px;font-size:44px" data-at="4" data-fx="pop">More <span class="teal">I</span> or more <span class="warm">t</span> ${ARR} more <span class="gold">q</span> ${ARR} more metal</div>`,
    update(c) {
      const t = c.t - c.sc.start, t4 = c.b[4].start - c.sc.start, L = CW1 - CW0
      const d = 120 * t + 150 * Math.max(0, t - t4)
      for (let i = 0; i < CN; i++) mv(c, '.x-ce' + i, CW0 + ((d + (i * L) / CN) % L), 700)
    },
  })

  // ---------- step 2: Faraday's constant ----------
  const BX = 230, BY = 380, BW = 280, BH = 380
  EZ.scene('faraday', {
    html: `<div class="kicker" data-at="in" data-fx="left">Step 2 · Electrons</div><h2 class="h1" data-at="in+0.2">Faraday's constant</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:540px" data-at="in+0.3" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><rect class="x-fl" x="${BX}" y="${BY + BH}" width="${BW}" height="0" style="fill:rgba(242,196,67,.38)"/>
          <rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="10" fill="none" stroke="${MUTED}" stroke-width="5"/>
          <text x="${BX + BW / 2}" y="${BY + BH + 46}" text-anchor="middle" font-size="28" font-weight="800" class="f-muted">holds 1 mol ${sup('e', '−')}</text></g>
      </svg>
      <div class="x-lab muted" style="left:540px;width:340px;top:440px;font-size:30px" data-at="1">charge</div>
      <div class="x-lab gold x-cnt" style="left:540px;width:340px;top:490px;font-size:56px" data-at="1">0 C</div>
      <div class="x-lab teal" style="left:540px;width:340px;top:600px;font-size:40px" data-at="2@0.6" data-fx="pop">= 1 mol ${E}</div>
      <div class="card" style="left:960px;top:300px;width:840px;height:540px" data-at="2" data-fx="fade"></div>
      <div class="x-lab" style="left:960px;width:840px;top:350px;font-size:30px;color:var(--muted)" data-at="2">Faraday's constant</div>
      <div class="x-lab" style="left:960px;width:840px;top:400px;font-size:54px" data-at="2@0.2">F = <span class="gold">96,485</span> C/mol ${E}</div>
      <div class="x-lab" style="left:960px;width:840px;top:560px;font-size:70px" data-at="3">mol ${E} = <span class="gold">q</span> ÷ F</div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Coulombs ÷ F ${ARR} moles of electrons</div>`,
    update(c) {
      const p = eio(c.seg(c.b[1].start, c.b[2].start + 0.5 * (c.b[2].end - c.b[2].start))), h = BH * p
      const r = c.$('.x-fl'); r.setAttribute('y', BY + BH - h); r.setAttribute('height', h)
      c.$('.x-cnt').textContent = Math.round(96485 * p).toLocaleString('en-US') + ' C'
    },
  })

  // ---------- step 3: electrons per atom ----------
  // [center x, electrons, start spec, ion label, atom label, ion r, atom r, appear]
  const COLS = [[480, 1, '5+0.3', sup('Ag', '+'), 'Ag', 48, 62, '5'], [960, 2, '2@0.4', sup('Cu', '2+'), 'Cu', 42, 56, '2'], [1440, 3, '5@0.5', sup('Al', '3+'), 'Al', 36, 62, '5@0.3']]
  const IY = 580
  EZ.scene('ratio', {
    html: `<div class="kicker" data-at="in" data-fx="left">Step 3 · Ratio</div><h2 class="h1" data-at="in+0.2">How many electrons per atom?</h2>
      <div class="x-line" style="top:292px;font-size:50px" data-at="2">Cu<sup>2+</sup> + 2${E} ${ARR} Cu(s)</div>
      ${COLS.map(([cx, , , , , , , at]) => `<div class="card" style="left:${cx - 210}px;top:380px;width:420px;height:440px" data-at="${at}" data-fx="fade"></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${COLS.map(([cx, n, , il, al, ir, ar, at], j) => `<g data-at="${at}" data-fx="fade">
          <g class="x-ri${j}">${ball(cx, IY, ir, 'teal', il, ir * 0.72)}</g>
          <g class="x-ra${j}" style="opacity:0">${ball(cx, IY, ar, 'warm', al, 34)}</g>
          ${Array.from({ length: n }, (_, k) => `<g class="x-re${j}${k}">${ball(0, 0, 17, 'gold', sup('e', '−'), 18)}</g>`).join('')}</g>`).join('')}
      </svg>
      ${COLS.map(([cx, n, , , , , , at], j) => `<div class="x-lab gold" style="left:${cx - 210}px;width:420px;top:690px;font-size:40px" data-at="${j === 1 ? '3' : at + '+1.2'}" data-fx="pop">${n} ${E} per atom</div>`).join('')}
      ${COLS.map(([cx, n, , , , , , at], j) => `<div class="x-lab muted" style="left:${cx - 210}px;width:420px;top:752px;font-size:30px" data-at="${j === 1 ? '4@0.5' : at + '+1.4'}" data-fx="fade">ion charge ${n}+</div>`).join('')}
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-out="6" data-fx="pop">${E} per atom = the ion's charge</div>
      <div class="banner" style="top:870px;font-size:44px" data-at="6" data-fx="pop">Same charge ${ARR} <span class="gold">half</span> as many mol Cu as Ag</div>`,
    update(c) {
      COLS.forEach(([cx, n, spec], j) => {
        const p = eio(c.p(spec, 1.3))
        for (let k = 0; k < n; k++) {
          mv(c, `.x-re${j}${k}`, lerp(cx + (k - (n - 1) / 2) * 84, cx, p), lerp(440, IY, p))
          op(c, `.x-re${j}${k}`, 1 - clamp((p - 0.75) / 0.2))
        }
        op(c, '.x-ri' + j, 1 - fadeEnd(p)); op(c, '.x-ra' + j, fadeEnd(p))
      })
    },
  })

  // ---------- worked example: copper plating ----------
  const OX = 1490
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Copper plating</h2>
      <div class="card" style="left:120px;top:300px;width:1000px;height:540px" data-at="0@0.3"><h3>Given and steps</h3>
        <div class="x-row" style="top:96px" data-at="1"><span class="teal">2.00 A</span> for <span class="warm">30.0 min</span>, Cu<sup>2+</sup></div>
        <div class="x-row" style="top:166px" data-at="2">t = 30.0 × 60 = <span class="gold">1800 s</span></div>
        <div class="x-row" style="top:236px" data-at="3">q = 2.00 × 1800 = <span class="gold">3600 C</span></div>
        <div class="x-row" style="top:306px" data-at="4">3600 ÷ 96,485 = <span class="gold">0.0373 mol ${E}</span></div>
        <div class="x-row" style="top:376px" data-at="5">0.0373 ÷ 2 = <span class="gold">0.0187 mol Cu</span></div>
        <div class="x-row" style="top:446px" data-at="6">0.0187 × 63.55 = <span class="gold">1.19 g Cu</span></div></div>
      <div class="card" style="left:1180px;top:300px;width:620px;height:540px" data-at="1"></div>
      <div class="x-cen" style="left:1180px;width:620px;top:322px" data-at="1@0.3" data-fx="pop"><div class="x-pl" style="border-color:${TEAL};background:rgba(60,199,188,.12)">2.00 A</div> &nbsp; <div class="x-pl" style="border-color:${WARM};background:rgba(243,167,100,.12)">30.0 min</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><rect class="x-ct" x="${OX - 30}" y="444" width="60" height="280" rx="10" style="fill:${WARM}"/>
          <rect x="${OX - 30}" y="444" width="60" height="280" rx="8" style="fill:#aab1c4"/>
          </g>
        <g data-at="3" data-fx="fade"><text x="${OX + 150}" y="610" text-anchor="middle" font-size="28" font-weight="800" class="f-warm">copper coat</text></g>
      </svg>
      <div class="x-lab gold" style="left:1180px;width:620px;top:766px;font-size:46px" data-at="6@0.6" data-fx="pop">1.19 g Cu</div>`,
    update(c) {
      const w = 24 * eio(c.seg(c.b[1].start, c.b[6].end)), r = c.$('.x-ct')
      r.setAttribute('x', OX - 30 - w); r.setAttribute('width', 60 + 2 * w); r.setAttribute('y', 444 - w); r.setAttribute('height', 280 + 2 * w)
    },
  })

  // ---------- the 4-step chain ----------
  const NX = (i) => 105 + i * 360
  const NODES = [['A × s', 'amps × seconds', 'teal'], ['C', 'coulombs', 'gold'], [`mol ${E}`, 'electrons', 'gold'], ['mol', 'metal', 'warm'], ['g', 'grams', 'good']]
  const OPS = ['q = It', '÷ F', `÷ ${E} per atom`, '× molar mass']
  const NAT = ['1', '1@0.6', '2@0.5', '3@0.5', '4@0.5']
  EZ.scene('chain', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">The trick</div><h2 class="h1" data-at="in+0.2">One 4-step chain</h2>
      ${NODES.map(([f, s, col], i) => `<div class="x-nd" style="left:${NX(i)}px" data-at="${NAT[i]}" data-fx="pop"><div class="f ${col}">${f}</div><div class="s">${s}</div></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${OPS.map((_, i) => `<g data-at="${i + 1}@0.3" data-fx="fade"><path d="M${NX(i) + 280} 435H${NX(i + 1) - 16}" stroke="${GOLD}" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-gold)"/></g>`).join('')}
        <g data-at="6" data-fx="fade"><path d="M${NX(4) + 135} 760H${NX(0) + 150}" stroke="${TEAL}" stroke-width="6" stroke-linecap="round" stroke-dasharray="18 14" marker-end="url(#mk-teal)"/></g>
      </svg>
      ${OPS.map((o, i) => `<div class="x-op gold" style="left:${NX(i) + 315 - 150}px" data-at="${i + 1}@0.3" data-fx="fade">${o}</div>`).join('')}
      <div class="x-hl" style="left:${NX(0) - 3}px;top:357px;width:270px;height:150px" data-at="5" data-fx="fade"></div>
      <div class="x-cen" style="left:${NX(0) - 60}px;width:390px;top:620px" data-at="5@0.3" data-fx="pop"><div class="x-pl" style="border-color:${WARM};background:rgba(243,167,100,.12)">min × 60 = s</div></div>
      <div class="banner" style="top:870px" data-at="5" data-out="6" data-fx="pop">Minutes? Convert to <span class="gold">seconds</span> first</div>
      <div class="banner" style="top:870px;font-size:44px" data-at="6" data-fx="pop">It runs <span class="teal">backward</span> too: find t or I</div>`,
  })

  // ---------- try it ----------
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">How many grams of <span class="teal">silver</span>?</h2>
      <div class="card" style="left:120px;top:300px;width:1680px;height:180px" data-at="1@0.2" data-fx="fade"></div>
      <div class="x-line" style="top:322px;font-size:54px" data-at="1@0.3"><span class="teal">0.500 A</span> for <span class="warm">965 s</span></div>
      <div class="x-line" style="top:400px;font-size:40px" data-at="2">Ag<sup>+</sup> + ${E} ${ARR} Ag(s) &nbsp;·&nbsp; Ag = 107.87 g/mol</div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="74" fill="none" stroke="${LINE}" stroke-width="12"/><circle class="x-arc" cx="960" cy="640" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="x-num" x="960" y="666" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="770" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-line gold" style="top:510px;font-size:84px" data-at="4" data-fx="pop">0.539 g</div>
      <div class="x-line" style="top:650px;font-size:42px" data-at="5">q = 0.500 × 965 = <span class="gold">482.5 C</span></div>
      <div class="x-line" style="top:722px;font-size:42px" data-at="6">482.5 ÷ 96,485 = <span class="gold">0.00500 mol ${E}</span> = 0.00500 mol Ag</div>
      <div class="x-line" style="top:794px;font-size:42px" data-at="7">0.00500 × 107.87 = <span class="gold">0.539 g</span></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="95" text-anchor="middle" font-size="60" font-weight="900" class="f-gold">q = I × t</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${ball(100, 75, 40, 'teal', sup('Ag', '+'), 28)}${ball(230, 75, 35, 'teal', sup('Cu', '2+'), 25)}${ball(360, 75, 30, 'teal', sup('Al', '3+'), 22)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${['#3cc7bc', '#f2c443', '#f2c443', '#f3a764', '#4cc781'].map((col, i) => `<circle cx="${50 + i * 90}" cy="75" r="24" style="fill:${col}"/>${i < 4 ? `<path d="M${78 + i * 90} 75H${110 + i * 90}" stroke="${MUTED}" stroke-width="5" marker-end="url(#mk-muted)"/>` : ''}`).join('')}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>t in <span class="gold">seconds!</span><br>mol ${E} = q/F</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>${E} per atom<br>= the ion's charge</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>A·s ${ARR} C ${ARR} mol ${E}<br>${ARR} mol metal ${ARR} g</p></div>`,
  })
})()
