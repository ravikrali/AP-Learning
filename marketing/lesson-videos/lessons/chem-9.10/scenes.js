// Pictures for chem-9.10 "Cell Potential Under Nonstandard Conditions". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, chem/book.ts): a battery dies as reactants drop and
// products build up, voltage falls to 0 at equilibrium; E° = standard (all 1 M, 1 atm) = Q = 1; farther from
// equilibrium → |E| up, closer → down, Q = K → E = 0; E = E° − (RT/nF) ln Q used qualitatively; Q < 1 → E > E°,
// Q > 1 → E < E°; Zn/Cu: raising [Cu²⁺] or lowering [Zn²⁺] lowers Q → higher voltage; concentration cell
// (0.010 M / 1.0 M Cu²⁺, E° = 0, dilute = anode, e⁻ to the concentrated side, runs until equal, E = 0);
// Le Châtelier does not apply to a working cell; the try (Q = 0.10 → E > 1.10 V).
// The E-versus-Q graph carries no numbers: only Q = 1 (E°) and Q = K (E = 0), on a log scale for Q.
(() => {
  const { lerp, eio, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-lab small{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .x-hl{position:absolute;font-size:42px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-hl small{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-size:80px;font-weight:900;white-space:nowrap}
    .x-sr{position:absolute;left:120px;width:1680px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-c{position:absolute;top:0;line-height:124px;font-size:44px;font-weight:900;white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:120px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:42px;font-weight:900;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:26px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:24px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:32px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', BAD = '#f0707a', LINE = '#363c54', MUT = '#a3abbd', CU = '#c9845a'
  const E0 = 'E°', CU2 = 'Cu<sup>2+</sup>', ZN2 = 'Zn<sup>2+</sup>'
  // a bar that grows from base y: g.cls holds a 1-px rect scaled by update
  const bar = (cls, x, w, col) => `<g class="${cls}"><rect x="${x}" y="0" width="${w}" height="1" style="fill:${col}"/></g>`
  const setBar = (c, sel, base, h) => c.$(sel).setAttribute('transform', `translate(0 ${(base - h).toFixed(1)}) scale(1 ${Math.max(0.01, h).toFixed(1)})`)

  // ---------- intro: a faint falling E-versus-Q line ----------
  EZ.intro = {
    chips: [['1@0.2', 'Q vs. 1'], ['1@0.4', 'Nernst equation'], ['1@0.6', 'Concentration cells']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.22"><path d="M680 830V935H1260" fill="none" stroke="${MUT}" stroke-width="4"/>
      <line x1="700" y1="842" x2="1180" y2="935" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/><circle cx="880" cy="877" r="10" fill="${GOLD}"/></svg>`,
  }

  // ---------- hook: why a battery dies ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Why does a battery die?</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:520px" data-at="0@0.3"><h3>Concentrations</h3></div>
      <div class="card" style="left:1020px;top:300px;width:780px;height:520px" data-at="0@0.6"><h3>Voltage</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.5" data-fx="fade">${bar('x-hr', 295, 150, TEAL)}${bar('x-hp', 575, 150, WARM)}
          <line x1="220" y1="740" x2="800" y2="740" stroke="${MUT}" stroke-width="4"/>
          <text x="370" y="788" text-anchor="middle" font-size="32" font-weight="900" class="f-teal">reactants</text>
          <text x="650" y="788" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">products</text></g>
        <g data-at="0@0.8" data-fx="pop"><rect x="1370" y="380" width="80" height="24" rx="8" fill="${MUT}"/>
          ${bar('x-hb', 1322, 176, GOLD)}
          <rect x="1310" y="400" width="200" height="330" rx="28" fill="none" stroke="${MUT}" stroke-width="5"/></g>
      </svg>
      <div class="x-hl teal" style="left:450px;top:430px;font-size:40px" data-at="1@0.6" data-fx="fade">↓</div>
      <div class="x-hl warm" style="left:735px;top:430px;font-size:40px" data-at="2@0.6" data-fx="fade">↑</div>
      <div class="x-lab gold" style="left:1540px;width:220px;top:600px;font-size:64px" data-at="3@0.85" data-fx="pop">0 V</div>
      <div class="banner" style="top:860px" data-at="4" data-fx="pop">Voltage 0 ${ARR} the cell is at <span class="teal">equilibrium</span></div>`,
    update(c) {
      setBar(c, '.x-hr', 740, lerp(280, 90, eio(c.p('1', 1.4))))
      setBar(c, '.x-hp', 740, lerp(90, 280, eio(c.p('2', 1.4))))
      setBar(c, '.x-hb', 718, lerp(306, 0, eio(c.p('3', 1.6))))
    },
  })

  // ---------- voltage = drive toward equilibrium: E against Q ----------
  const AX = 260, Y0 = 800, X1 = 600, XK = 1100, EY = 560, SL = (Y0 - EY) / (XK - X1)
  const ly = (x) => EY + (x - X1) * SL
  EZ.scene('drive', {
    html: `<div class="kicker" data-at="in" data-fx="left">The drive</div><h2 class="h1" data-at="in+0.2">Voltage is the drive toward equilibrium</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><line x1="${AX}" y1="${Y0 + 20}" x2="${AX}" y2="330" stroke="${MUT}" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-muted)"/>
          <line x1="${AX}" y1="${Y0}" x2="1255" y2="${Y0}" stroke="${MUT}" stroke-width="5" stroke-linecap="round" marker-end="url(#mk-muted)"/>
          <text x="${AX - 22}" y="350" text-anchor="end" font-size="38" font-weight="900" class="f-muted">E</text>
          <text x="${AX - 22}" y="${Y0 + 12}" text-anchor="end" font-size="30" font-weight="900" class="f-muted">0</text>
          <text x="1272" y="${Y0 + 12}" font-size="38" font-weight="900" class="f-muted">Q</text>
          <text x="1272" y="${Y0 + 46}" font-size="24" font-weight="800" class="f-muted">(log scale)</text></g>
        <path d="M300 ${ly(300).toFixed(1)}L${XK} ${Y0}" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" data-at="3" data-fx="draw"/>
        <g data-at="2" data-fx="fade"><line x1="${X1}" y1="${Y0 - 12}" x2="${X1}" y2="${Y0 + 12}" stroke="${MUT}" stroke-width="5"/>
          <text x="${X1}" y="${Y0 + 50}" text-anchor="middle" font-size="32" font-weight="900" class="f-muted">Q = 1</text>
          <text x="${AX - 16}" y="${EY + 12}" text-anchor="end" font-size="34" font-weight="900" class="f-gold">E°</text>
          <line class="x-lv" x1="${AX}" y1="${EY}" x2="${X1}" y2="${EY}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="10 10"/>
          <g class="x-pt"><circle cx="0" cy="0" r="17" style="fill:${GOLD}" stroke="#10131c" stroke-width="5"/></g></g>
        <g data-at="6" data-fx="fade"><line x1="${XK}" y1="${Y0 - 12}" x2="${XK}" y2="${Y0 + 12}" stroke="${MUT}" stroke-width="5"/>
          <text x="${XK}" y="${Y0 + 50}" text-anchor="middle" font-size="32" font-weight="900" class="f-bad">Q = K</text></g>
        <text x="${(AX + X1) / 2 + 10}" y="${Y0 + 100}" text-anchor="middle" font-size="30" font-weight="800" class="f-teal" data-at="4" data-fx="fade">← farther</text>
        <text x="${(X1 + XK) / 2}" y="${Y0 + 100}" text-anchor="middle" font-size="30" font-weight="800" class="f-warm" data-at="5" data-fx="fade">closer to equilibrium →</text>
      </svg>
      <div class="x-hl" style="left:1440px;top:300px" data-at="1" data-fx="fade">Standard<small>all 1 M, 1 atm</small></div>
      <div class="x-hl gold" style="left:1440px;top:410px" data-at="2@0.3" data-fx="fade">Q = 1<small>E = E°</small></div>
      <div class="x-hl teal" style="left:1440px;top:520px" data-at="4@0.3" data-fx="fade">Farther<small>|E| increases</small></div>
      <div class="x-hl warm" style="left:1440px;top:630px" data-at="5@0.3" data-fx="fade">Closer<small>|E| decreases</small></div>
      <div class="x-hl bad" style="left:1440px;top:740px" data-at="7" data-fx="pop">Q = K: E = 0<small>a dead battery</small></div>`,
    update(c) {
      let x = X1
      x = lerp(x, 340, eio(c.p('4', 1.3)))
      x = lerp(x, 880, eio(c.p('5', 1.3)))
      x = lerp(x, XK, eio(c.p('6', 1.1)))
      const y = ly(x)
      c.$('.x-pt').setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
      const lv = c.$('.x-lv'); lv.setAttribute('x2', x.toFixed(1)); lv.setAttribute('y1', y.toFixed(1)); lv.setAttribute('y2', y.toFixed(1)); lv.style.opacity = 1 - c.p('6', 1.1)
    },
  })

  // ---------- the Nernst equation, qualitatively ----------
  EZ.scene('nernst', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">Nernst equation</div><h2 class="h1" data-at="in+0.2">Q &lt; 1 boosts the voltage, Q &gt; 1 drains it</h2>
      <div class="x-eq" style="top:285px" data-at="1">E = ${E0} − (<span class="teal">RT</span>/<span class="gold">nF</span>) ln <span class="pri">Q</span></div>
      <div class="x-line muted" style="top:400px;font-size:38px" data-at="2" data-out="5">use it qualitatively: watch the sign of ln Q</div>
      <div class="x-sr" style="top:480px" data-at="3" data-out="5"><div class="x-c" style="left:44px">Q &lt; 1 ${ARR} ln Q &lt; 0 ${ARR} <span class="teal">E &gt; ${E0}</span></div><div class="x-c muted" style="left:1060px;font-size:36px">more reactant, less product</div></div>
      <div class="x-sr" style="top:640px" data-at="4" data-out="5"><div class="x-c" style="left:44px">Q &gt; 1 ${ARR} ln Q &gt; 0 ${ARR} <span class="warm">E &lt; ${E0}</span></div><div class="x-c muted" style="left:1060px;font-size:36px">more product</div></div>
      <div class="x-line" style="top:400px;font-size:48px" data-at="5@0.3">Zn + ${CU2} ${ARR} ${ZN2} + Cu</div>
      <div class="card" style="left:120px;top:490px;width:810px;height:380px" data-at="6"><h3>Reaction quotient</h3>
        <div class="x-row" style="top:110px;font-size:56px">Q = <span class="warm">[${ZN2}]</span> / <span class="teal">[${CU2}]</span></div>
        <div class="x-row" style="top:215px" data-at="7@0.8"><span class="pri">Q</span> gets smaller</div>
        <div class="x-row" style="top:285px" data-at="8">${ARR} <span class="gold">higher voltage</span></div></div>
      <div class="card" style="left:990px;top:490px;width:810px;height:380px" data-at="6@0.3"><h3>Concentrations</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="6@0.4" data-fx="fade">${bar('x-nz', 1160, 140, WARM)}${bar('x-nc', 1490, 140, TEAL)}
        <line x1="1080" y1="810" x2="1720" y2="810" stroke="${MUT}" stroke-width="4"/></g></svg>
      <div class="x-lab warm" style="left:1130px;width:200px;top:816px;font-size:34px" data-at="6@0.5" data-fx="fade">[${ZN2}]</div>
      <div class="x-lab teal" style="left:1460px;width:200px;top:816px;font-size:34px" data-at="6@0.5" data-fx="fade">[${CU2}]</div>`,
    update(c) {
      setBar(c, '.x-nz', 810, lerp(120, 60, eio(c.p('7@0.5', 1.0))))
      setBar(c, '.x-nc', 810, lerp(120, 225, eio(c.p('7', 1.0))))
    },
  })

  // ---------- concentration cell ----------
  const beaker = (x0) => `<path d="M${x0} 520V800Q${x0} 820 ${x0 + 20} 820H${x0 + 380}Q${x0 + 400} 820 ${x0 + 400} 800V520" fill="none" stroke="${MUT}" stroke-width="5"/>`
  EZ.scene('conc', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Concentration cells</div><h2 class="h1" data-at="in+0.2">Same metal, different concentrations</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade">
          <rect class="x-sl" x="336" y="590" width="388" height="225" style="fill:${TEAL}" fill-opacity=".14"/>
          <rect class="x-sr2" x="1196" y="590" width="388" height="225" style="fill:${TEAL}" fill-opacity=".6"/>
          ${beaker(330)}${beaker(1190)}
          <path d="M690 650V545H1230V650" fill="none" stroke="rgba(170,177,196,.32)" stroke-width="34" stroke-linejoin="round"/>
          <path class="x-wire" d="M530 430V360H1390V430" fill="none" stroke="${MUT}" stroke-width="5" stroke-linejoin="round"/>
          <rect x="505" y="430" width="50" height="330" rx="6" fill="${CU}"/><rect x="1365" y="430" width="50" height="330" rx="6" fill="${CU}"/></g>
        <g data-at="7">${[0, 1, 2, 3].map((i) => `<circle class="x-e${i}" cx="530" cy="430" r="10" style="fill:${TEAL}"/>`).join('')}</g>
        <g data-at="1" data-fx="fade"><circle cx="960" cy="360" r="46" fill="#1b1f2c" stroke="${MUT}" stroke-width="5"/>
          <text x="960" y="374" text-anchor="middle" font-size="40" font-weight="900" class="f-gold">V</text></g>
      </svg>
      <div class="x-lab" style="left:330px;width:400px;top:838px;font-size:36px" data-at="2@0.2" data-out="8@0.5" data-fx="fade">0.010 M ${CU2}<small>dilute</small></div>
      <div class="x-lab" style="left:1190px;width:400px;top:838px;font-size:36px" data-at="2@0.6" data-out="8@0.5" data-fx="fade">1.0 M ${CU2}<small>concentrated</small></div>
      <div class="x-lab" style="left:330px;width:400px;top:838px;font-size:36px" data-at="8@0.7" data-fx="fade">equal [${CU2}]</div>
      <div class="x-lab" style="left:1190px;width:400px;top:838px;font-size:36px" data-at="8@0.7" data-fx="fade">equal [${CU2}]</div>
      <div class="x-hl gold" style="right:1010px;top:292px;font-size:38px" data-at="3" data-fx="fade">${E0} = 0</div>
      <div class="x-hl gold" style="left:1020px;top:292px;font-size:38px" data-at="3@0.6" data-out="8@0.6" data-fx="fade">still a voltage</div>
      <div class="x-hl bad" style="left:1020px;top:292px;font-size:38px" data-at="8@0.8" data-fx="pop">E = 0</div>
      <div class="x-lab muted" style="left:560px;width:800px;top:440px;font-size:34px" data-at="4" data-fx="fade">wants to equalize the concentrations</div>
      <div class="x-hl warm" style="left:120px;top:450px" data-at="5" data-fx="pop">anode<small>oxidizes Cu</small></div>
      <div class="x-hl teal" style="left:1625px;top:450px" data-at="6" data-fx="pop">cathode<small>reduces ${CU2}</small></div>
      <div class="x-hl teal" style="left:690px;top:372px;font-size:38px" data-at="7@0.3" data-out="8@0.9" data-fx="fade">e<sup>−</sup> ${ARR}</div>`,
    update(c) {
      const k = eio(c.p('8', 3.0))
      c.$('.x-sl').setAttribute('fill-opacity', lerp(0.14, 0.37, k).toFixed(3))
      c.$('.x-sr2').setAttribute('fill-opacity', lerp(0.6, 0.37, k).toFixed(3))
      const w = c.$('.x-wire'), L = w.getTotalLength(), b = c.b
      const t7 = b[7].start, ts = b[8].start + 3.0
      const run = Math.max(0, Math.min(c.t, ts) - t7) * 170
      const op = 1 - c.seg(ts - 0.8, ts)
      for (let i = 0; i < 4; i++) {
        const pt = w.getPointAtLength((run + i * L / 4) % L)
        const e = c.$('.x-e' + i)
        e.setAttribute('cx', pt.x.toFixed(1)); e.setAttribute('cy', pt.y.toFixed(1)); e.style.opacity = op
      }
    },
  })

  // ---------- trap: Le Châtelier does not apply to a working cell ----------
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">No Le Châtelier for a working cell</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:520px" data-at="1"><h3>Le Châtelier's principle</h3></div>
      <div class="card" style="left:1020px;top:300px;width:780px;height:520px" data-at="4"><h3>Instead</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <path d="M410 540H610L572 512M610 600H410L448 628" fill="none" stroke="${MUT}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" data-at="1@0.4" data-fx="fade"/>
        <path d="M400 450L620 690M620 450L400 690" fill="none" stroke="${BAD}" stroke-width="16" stroke-linecap="round" data-at="2@0.4" data-fx="draw"/>
      </svg>
      <div class="x-lab" style="left:120px;width:780px;top:725px;font-size:38px" data-at="3">a working cell is <span class="bad">not</span> at equilibrium</div>
      <div class="x-lab gold" style="left:1020px;width:780px;top:410px;font-size:72px" data-at="4@0.2" data-fx="pop">Q vs. K</div>
      <div class="x-lab" style="left:1020px;width:780px;top:510px;font-size:44px" data-at="4@0.55" data-fx="fade">+ the Nernst equation</div>
      <div class="x-lab" style="left:1020px;width:780px;top:625px;font-size:38px" data-at="5">Q vs. 1 ${ARR} E vs. ${E0}</div>
      <div class="x-lab" style="left:1020px;width:780px;top:700px;font-size:38px" data-at="5@0.6">Q = K ${ARR} <span class="bad">E = 0</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['greater than 1.10 V', 'exactly 1.10 V', 'less than 1.10 V', '0 V']
  const OK = 0
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Predict the cell potential</h2>
      <div class="x-line" style="top:262px;font-size:42px" data-at="1@0.3">Zn(s) + ${CU2}(aq) ${ARR} ${ZN2}(aq) + Cu(s) &nbsp; ${E0} = <span class="gold">1.10 V</span></div>
      <div class="x-line" style="top:326px;font-size:42px" data-at="2@0.3">[${ZN2}] = <span class="warm">0.10 M</span> &nbsp; [${CU2}] = <span class="teal">1.0 M</span></div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${410 + Math.floor(i / 2) * 140}px" data-at="3@${(0.12 + i * 0.2).toFixed(2)}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === OK ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="${LINE}" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:685px" data-at="6" data-fx="pop">Q = [${ZN2}] / [${CU2}] = 0.10 / 1.0 = <span class="gold">0.10</span></div>
      <div class="x-line" style="top:832px" data-at="7">Q &lt; 1 ${ARR} <span class="teal">farther</span> from equilibrium than standard</div>
      <div class="x-line" style="top:905px" data-at="8">E <span class="gold">&gt; 1.10 V</span></div>`,
    update(c) {
      const b = c.b, t0 = b[4].start + 0.3, t1 = b[5].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = c.seg(b[5].start + 0.2, b[5].start + 0.65)
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === OK) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><path d="M50 10V125H440" fill="none" stroke="${MUT}" stroke-width="4"/>
    <line x1="70" y1="25" x2="360" y2="125" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/><circle cx="190" cy="66" r="11" fill="${GOLD}"/>
    <text x="190" y="148" text-anchor="middle" font-size="22" font-weight="900" class="f-muted">Q = 1</text><text x="360" y="148" text-anchor="middle" font-size="22" font-weight="900" class="f-bad">Q = K</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><rect x="60" y="42" width="130" height="70" rx="10" style="fill:${TEAL}" fill-opacity=".14" stroke="${MUT}" stroke-width="3"/>
    <rect x="270" y="42" width="130" height="70" rx="10" style="fill:${TEAL}" fill-opacity=".6" stroke="${MUT}" stroke-width="3"/>
    <line x1="150" y1="22" x2="300" y2="22" stroke="${TEAL}" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-muted)"/>
    <text x="125" y="148" text-anchor="middle" font-size="22" font-weight="900" class="f-warm">dilute</text><text x="335" y="148" text-anchor="middle" font-size="22" font-weight="900" class="f-teal">concentrated</text></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="70" text-anchor="middle" font-size="54" font-weight="900" class="f-gold">Q vs. K</text>
    <text x="230" y="128" text-anchor="middle" font-size="34" font-weight="900" class="f-muted">Le Châtelier</text><line x1="120" y1="117" x2="340" y2="117" stroke="${BAD}" stroke-width="6" stroke-linecap="round"/></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p style="font-size:30px">Q = 1 ${ARR} E = ${E0}<br>Q &lt; 1 ${ARR} E &gt; ${E0}<br>Q &gt; 1 ${ARR} E &lt; ${E0}<br>Q = K ${ARR} <span class="bad">E = 0</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p style="font-size:30px">Concentration cell:<br>dilute side = <span class="warm">anode</span><br>e<sup>−</sup> flow to the<br>concentrated side</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Working cells:<br>Q, K and <span class="gold">Nernst</span><br>not <span class="bad">Le Châtelier</span></p></div>`,
  })
})()
