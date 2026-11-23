// Pictures for chem-9.5 "Free Energy & Equilibrium". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, chem/book.ts): ΔG° = −RT ln K,
// K = e^(−ΔG°/RT), R = 8.314 J/(mol·K) so ΔG° in joules; the sign table (< 0 → K > 1 → products, = 0 → K = 1
// → neither, > 0 → K < 1 → reactants); RT ≈ 2.5 kJ/mol at 298 K; every 5.7 kJ/mol changes K tenfold
// (−11.4 → ~100, −5.7 → ~10, +5.7 → ~0.1); ammonia −33.0 kJ/mol → ln K 13.3 → K ≈ 6 × 10⁵; forgetting kJ → J
// gives ln K ≈ 0.013, K ≈ 1; the try (K = 3.2 × 10⁻⁸ → ΔG° positive).
// The R ⇌ P arrows of unequal length are a picture of which side is favored, not a measured ratio.
// The number lines place the lesson's ΔG° values on one scale; the shaded zones carry no numbers.
(() => {
  const { lerp, eio, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-row em{font-style:normal;font-size:30px;font-weight:800;color:var(--muted)}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-size:60px;font-weight:900;white-space:nowrap}
    .x-big{position:absolute;text-align:center;font-size:170px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tl{position:absolute;top:470px;width:480px;height:170px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tl .f{margin-top:34px;font-size:48px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tl .s{margin-top:18px;font-size:30px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-sr{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.92);border:3px solid var(--line)}
    .x-c{position:absolute;top:0;line-height:114px;font-size:52px;font-weight:900;text-align:center;white-space:nowrap}
    .x-hd{position:absolute;top:300px;font-size:30px;font-weight:800;color:var(--muted);text-align:center;white-space:nowrap}
    .x-hl{position:absolute;left:114px;width:1680px;height:120px;border-radius:30px;border:6px solid var(--accent);box-shadow:0 0 50px rgba(60,199,188,.45)}
    .x-cen{position:absolute;left:0;width:1920px;text-align:center}
    .x-pl{display:inline-block;padding:10px 32px;border-radius:999px;font-size:38px;font-weight:900;white-space:nowrap;border:3px solid var(--gold);background:rgba(242,196,67,.12)}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:40px;font-weight:900;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:31px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:29px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', LINE = '#363c54', MUTED = '#a3abbd'
  const DG = 'ΔG°'
  const EQ = `${DG} = −RT ln K`
  // R ⇌ P with arrows: f = forward length, r = reverse length (longer arrow = the favored direction)
  const eqa = (cx, cy, f, r, gap = 150, br = 30) =>
    `${ball(cx - gap, cy, br, 'pur', 'R')}${ball(cx + gap, cy, br, 'teal', 'P')}
     <path d="M${cx - f / 2} ${cy - 11}H${cx + f / 2}" stroke="${TEAL}" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-teal)"/>
     <path d="M${cx + r / 2} ${cy + 11}H${cx - r / 2}" stroke="#8d8df0" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-pri)"/>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)

  // ---------- intro: a faint row of R ⇌ P pairs ----------
  const IX = [330, 750, 1170, 1590]
  EZ.intro = {
    chips: [['1@0.3', 'ΔG° = −RT ln K'], ['1@0.55', 'Reading the signs'], ['1@0.85', 'Estimating K']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.24">${IX.map((x, i) => `<g class="x-im${i}">${eqa(0, 0, i % 2 ? 110 : 170, i % 2 ? 170 : 110, 130, 26)}</g>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      IX.forEach((x, i) => mv(c, '.x-im' + i, x, 880 + 8 * Math.sin(t * 1.1 + i * 1.3)))
    },
  }

  // ---------- hook: two units meet ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Two units meet</div><h2 class="h1" data-at="in+0.2">Equilibrium meets thermodynamics</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:520px" data-at="1"><h3>Unit 7 · Equilibrium</h3></div>
      <div class="x-big teal" style="left:120px;width:780px;top:430px" data-at="1@0.5" data-fx="pop">K</div>
      <div class="card" style="left:1020px;top:300px;width:780px;height:520px" data-at="2"><h3>Unit 9 · Thermodynamics</h3></div>
      <div class="x-big pri" style="left:1020px;width:780px;top:430px" data-at="2@0.6" data-fx="pop">${DG}</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <path d="M904 520H1016" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" data-at="3" data-fx="draw"/>
        <g data-at="4@0.4" data-fx="fade"><path d="M915 712H1005" stroke="${GOLD}" stroke-width="6" marker-start="url(#mk-gold)" marker-end="url(#mk-gold)"/></g>
      </svg>
      <div class="x-lab gold" style="left:120px;width:780px;top:680px;font-size:44px" data-at="4@0.6" data-fx="fade">its size</div>
      <div class="x-lab gold" style="left:1020px;width:780px;top:680px;font-size:44px" data-at="4@0.2" data-fx="fade">its sign</div>
      <div class="banner" style="top:860px" data-at="3@0.3" data-fx="pop">${EQ}</div>`,
  })

  // ---------- the equation ----------
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The equation</div><h2 class="h1" data-at="in+0.2">One equation links them</h2>
      <div class="card" style="left:120px;top:300px;width:1680px;height:540px" data-at="0" data-fx="fade"></div>
      <div class="x-eq" style="top:330px;font-size:88px" data-at="1"><span class="pri">${DG}</span> = −RT ln <span class="teal">K</span></div>
      <div class="x-tl" style="left:200px" data-at="2" data-fx="pop"><div class="f">R = <span class="gold">8.314</span></div><div class="s">J/(mol·K)</div></div>
      <div class="x-tl" style="left:720px" data-at="2@0.6" data-fx="pop"><div class="f">T</div><div class="s">in kelvin</div></div>
      <div class="x-tl" style="left:1240px;border-color:${GOLD}" data-at="3" data-fx="pop"><div class="f">${DG} in <span class="gold">J</span></div><div class="s">joules, to match R</div></div>
      <div class="x-eq" style="top:675px;font-size:76px" data-at="4"><span class="teal">K</span> = e<sup>−${DG}/RT</sup></div>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">More negative <span class="pri">${DG}</span> ${ARR} bigger <span class="teal">K</span></div>`,
  })

  // ---------- reading the signs ----------
  const ROWS = [['&lt; 0', '&gt; 1', 'products', 'teal', 210, 90], ['= 0', '= 1', 'neither', 'gold', 150, 150], ['&gt; 0', '&lt; 1', 'reactants', 'pri', 90, 210]]
  const RY = [360, 505, 650]
  EZ.scene('signs', {
    html: `<div class="kicker" data-at="in" data-fx="left">Read the signs</div><h2 class="h1" data-at="in+0.2">The sign of ${DG} sets the size of K</h2>
      <div class="x-hd" style="left:160px;width:420px" data-at="1" data-fx="fade">${DG}</div>
      <div class="x-hd" style="left:600px;width:360px" data-at="1" data-fx="fade">K</div>
      <div class="x-hd" style="left:980px;width:420px" data-at="1" data-fx="fade">equilibrium favors</div>
      ${ROWS.map(([g, k, w, col], i) => `<div class="x-sr" style="top:${RY[i]}px" data-at="${i + 1}"><div class="x-c pri" style="left:40px;width:420px">${DG} ${g}</div>
        <div class="x-c teal" style="left:480px;width:360px">K ${k}</div><div class="x-c ${col}" style="left:860px;width:420px;font-size:46px">${w}</div></div>`).join('')}
      <svg class="full" viewBox="0 0 1920 1080">
        ${ROWS.map(([, , , , f, r], i) => `<g data-at="${i + 1}@0.4" data-fx="fade">${eqa(1560, RY[i] + 60, f, r, 150, 30)}</g>`).join('')}
      </svg>
      <div class="x-hl" style="top:${RY[0] - 3}px" data-at="4" data-fx="fade"></div>
      <div class="banner" style="top:860px;font-size:44px" data-at="4@0.3" data-fx="pop">Thermodynamically favored (${DG} &lt; 0) ${ARR} <span class="teal">products</span> favored</div>`,
  })

  // ---------- estimate without a calculator ----------
  const AX = 960, AY = 650, PK = 18.75 // px per kJ/mol on the number line
  const ax = (v) => AX + v * PK
  const TK = [[-11.4, '−11.4', '≈100'], [-5.7, '−5.7', '≈10'], [0, '0', '1'], [5.7, '+5.7', '≈0.1']]
  EZ.scene('estimate', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">Shortcut</div><h2 class="h1" data-at="in+0.2">Estimate K without a calculator</h2>
      <div class="x-cen" style="top:300px" data-at="1" data-fx="pop"><div class="x-pl">RT ≈ <span class="gold">2.5 kJ/mol</span> at 298 K</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><rect x="${ax(-3)}" y="${AY - 150}" width="${6 * PK}" height="150" rx="10" style="fill:rgba(242,196,67,.16)"/></g>
        <g data-at="3" data-fx="fade"><rect x="${ax(-40)}" y="${AY - 150}" width="${20 * PK}" height="150" rx="10" style="fill:rgba(60,199,188,.16)"/>
          <rect x="${ax(20)}" y="${AY - 150}" width="${20 * PK}" height="150" rx="10" style="fill:rgba(243,167,100,.16)"/></g>
        <g data-at="in+0.4" data-fx="fade"><line x1="${ax(-40)}" y1="${AY}" x2="${ax(40)}" y2="${AY}" stroke="${MUTED}" stroke-width="5" stroke-linecap="round"/>
          <line x1="${AX}" y1="${AY - 16}" x2="${AX}" y2="${AY + 16}" stroke="${MUTED}" stroke-width="5"/>
          <text x="${AX}" y="${AY + 52}" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">0</text>
          <text x="${AX}" y="${AY + 120}" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">${DG} (kJ/mol)</text></g>
        <g data-at="4" data-fx="fade">${TK.filter((k) => k[0]).map(([v, s]) => `<line x1="${ax(v)}" y1="${AY - 14}" x2="${ax(v)}" y2="${AY + 14}" stroke="${MUTED}" stroke-width="4"/>
          <text x="${ax(v)}" y="${AY + 52}" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">${s}</text>`).join('')}</g>
        <g data-at="4@0.5" data-fx="fade"><text x="${ax(-40) - 20}" y="${AY - 64}" text-anchor="end" font-size="30" font-weight="900" class="f-muted">K</text>
          ${TK.map(([v, , k]) => `<text x="${ax(v)}" y="${AY - 64}" text-anchor="middle" font-size="30" font-weight="900" class="f-gold">${k}</text>`).join('')}</g>
        <g data-at="2"><g class="x-mk"><circle r="17" style="fill:${GOLD}" stroke="#10131c" stroke-width="4"/></g></g>
      </svg>
      <div class="x-lab" style="left:${ax(-3) - 150}px;width:${6 * PK + 300}px;top:400px;font-size:30px" data-at="2" data-fx="fade"><span class="muted">a few kJ</span><br><span class="gold" style="font-size:42px">K ≈ 1</span></div>
      <div class="x-lab" style="left:${ax(-40)}px;width:${20 * PK}px;top:400px;font-size:30px" data-at="3" data-fx="fade"><span class="muted">tens of kJ</span><br><span class="teal" style="font-size:42px">K huge</span></div>
      <div class="x-lab" style="left:${ax(20)}px;width:${20 * PK}px;top:400px;font-size:30px" data-at="3@0.5" data-fx="fade"><span class="muted">tens of kJ</span><br><span class="warm" style="font-size:42px">K tiny</span></div>
      <div class="banner" style="top:870px" data-at="4@0.3" data-fx="pop">Every <span class="gold">5.7 kJ/mol</span> of ${DG} ${ARR} K changes ×10</div>`,
    update(c) {
      let v = 0
      v = lerp(v, -30, eio(c.p('3+0.2', 1.2)))
      v = lerp(v, 30, eio(c.p('3@0.6', 1.4)))
      v = lerp(v, -5.7, eio(c.p('5+0.1', 1.0)))
      v = lerp(v, -11.4, eio(c.p('5@0.55', 0.8)))
      mv(c, '.x-mk', ax(v), AY)
    },
  })

  // ---------- worked example: ammonia ----------
  const MX = 1395, MY = 560, MK = 8.875
  const mx = (v) => MX + v * MK
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">K for ammonia at 298 K</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.3"><h3>Given</h3>
        <div class="x-row" style="top:90px;font-size:44px" data-at="1"><span class="pri">${DG}</span> = −33.0 kJ/mol</div>
        <div class="x-row" style="top:160px" data-at="2">= <span class="gold">−33,000 J</span> &nbsp;<em>convert first</em></div>
        <div class="x-row" style="top:250px" data-at="3">ln K = −${DG}/RT</div>
        <div class="x-row" style="top:318px;font-size:36px" data-at="4">= 33,000 ÷ (8.314 × 298)</div>
        <div class="x-row" style="top:380px" data-at="4@0.75">= <span class="gold">13.3</span></div>
        <div class="x-row" style="top:455px;font-size:44px" data-at="5">K = e<sup>13.3</sup> ≈ <span class="gold">6 × 10<sup>5</sup></span></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1"><h3>Where it lands</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><rect x="${mx(-40)}" y="${MY - 70}" width="${20 * MK}" height="70" rx="8" style="fill:rgba(60,199,188,.16)"/>
          <line x1="${mx(-40)}" y1="${MY}" x2="${mx(40)}" y2="${MY}" stroke="${MUTED}" stroke-width="5" stroke-linecap="round"/>
          <line x1="${MX}" y1="${MY - 14}" x2="${MX}" y2="${MY + 14}" stroke="${MUTED}" stroke-width="5"/>
          <text x="${MX}" y="${MY + 48}" text-anchor="middle" font-size="28" font-weight="900" class="f-muted">0</text>
          <text x="${mx(-30)}" y="${MY + 48}" text-anchor="middle" font-size="26" font-weight="800" class="f-teal">tens of kJ</text>
          <text x="${mx(15)}" y="${MY + 48}" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">${DG} (kJ/mol)</text></g>
        <g data-at="1"><g class="x-em"><circle r="16" style="fill:${GOLD}" stroke="#10131c" stroke-width="4"/>
          <g data-at="1+1.6" data-fx="fade"><text y="-34" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">−33.0</text></g></g></g>
        <g data-at="6" data-fx="fade">${eqa(MX, 700, 230, 80, 170, 32)}</g>
      </svg>
      <div class="x-lab gold" style="left:990px;width:810px;top:388px;font-size:48px" data-at="5@0.5" data-fx="pop">K ≈ 6 × 10<sup>5</sup></div>
      <div class="x-lab teal" style="left:990px;width:810px;top:760px;font-size:34px" data-at="6@0.3" data-fx="fade">products strongly favored</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="6@0.5" data-fx="pop">Tens of kJ ${ARR} K far from 1, as estimated</div>`,
    update(c) {
      mv(c, '.x-em', mx(lerp(0, -33, eio(c.p('1+0.3', 1.2)))), MY)
    },
  })

  // ---------- trap: kJ vs J ----------
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Joules, <span class="gold">not</span> kilojoules</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.4"><h3><span class="good">✓</span> In joules</h3>
        <div class="x-row" style="top:100px;font-size:42px">33,000 ÷ RT</div>
        <div class="x-row" style="top:170px;font-size:42px">ln K = <span class="gold">13.3</span></div>
        <div class="x-row" style="top:240px;font-size:42px">K ≈ <span class="gold">6 × 10<sup>5</sup></span></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="1"><h3><span class="bad">✗</span> Left in kJ</h3>
        <div class="x-row" style="top:100px;font-size:42px" data-at="1@0.5"><span class="bad">33</span> ÷ RT</div>
        <div class="x-row" style="top:170px;font-size:42px" data-at="2">ln K ≈ 0.013</div>
        <div class="x-row" style="top:240px;font-size:42px" data-at="2@0.6">K ≈ 1</div></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.8" data-fx="fade">${eqa(525, 690, 230, 80, 170, 32)}</g>
        <g data-at="3" data-fx="fade">${eqa(1395, 690, 150, 150, 170, 32)}</g>
      </svg>
      <div class="x-lab teal" style="left:120px;width:810px;top:755px;font-size:34px" data-at="0@0.9" data-fx="fade">products favored</div>
      <div class="x-lab bad" style="left:990px;width:810px;top:755px;font-size:34px" data-at="3@0.4" data-fx="fade">"neither favored": wrong</div>
      <div class="banner" style="top:870px;font-size:46px" data-at="4" data-fx="pop">Put ${DG} in <span class="gold">joules</span> before dividing by RT</div>`,
  })

  // ---------- try it ----------
  const OPTS = ['negative', 'positive', 'zero', 'impossible to determine']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">What is the sign of <span class="teal">${DG}</span>?</h2>
      <div class="x-line" style="top:268px;font-size:44px" data-at="1@0.3">K = 3.2 × 10<sup>−8</sup> at 298 K. Its ${DG} is…</div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${360 + Math.floor(i / 2) * 150}px" data-at="2@${(0.15 + i * 0.18).toFixed(2)}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="${LINE}" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px" data-at="5" data-fx="pop">K &lt; 1 ${ARR} ln K &lt; 0</div>
      <div class="x-line" style="top:830px;font-size:44px" data-at="6">${EQ} &gt; 0 ${ARR} <span class="pri">reactants</span> favored</div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = c.seg(b[4].start + 0.2, b[4].start + 0.65)
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 1) { el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''; el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`; c.$('.ok').style.opacity = win; c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})` }
        else el.style.filter = `brightness(${1 - 0.45 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="92" text-anchor="middle" font-size="50" font-weight="900" class="f-gold">${EQ}</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${eqa(230, 75, 200, 80, 160, 32)}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150">${eqa(230, 75, 140, 140, 160, 32)}</svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>${DG} in <span class="gold">joules</span><br>R = 8.314 J/(mol·K)</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>${DG} &lt; 0 ${ARR} K &gt; 1<br><span class="teal">products</span> favored</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>${DG} near 0<br>K ≈ <span class="gold">1</span></p></div>`,
  })
})()
