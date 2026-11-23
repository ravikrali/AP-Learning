// Pictures for chem-9.3 "Gibbs Free Energy & Favorability". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, book.ts): dG° = dH° - TdS°; dG° < 0 favored,
// > 0 reverse favored; "thermodynamically favored", favored can be slow; the four-row sign table; water freezing
// (-,-) favored below 0 °C; NaNO3 dissolving (+,+) cools the water, entropy wins; dG° from formation values;
// NH3: -92.2 kJ, -198.7 J/K, 298 K, -0.1987 kJ/K, +59.2, -33.0 kJ, ~464 K; tug-of-war, T = dH/dS; J -> kJ;
// the +50 kJ / +150 J/K try (~333 K). Arrow lengths and marker positions show direction only, never values,
// except the NH3 bars, which are drawn to the lesson's own numbers.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:38px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-eq{position:absolute;left:0;width:1920px;top:290px;display:flex;justify-content:center;gap:64px}
    .x-tm{position:relative;display:flex;flex-direction:column;align-items:center}
    .x-f{height:96px;display:flex;align-items:center;font-size:84px;font-weight:900;white-space:nowrap}
    .x-n{position:absolute;top:104px;left:50%;transform:translateX(-50%);font-size:30px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:34px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-th{position:absolute;font-size:32px;font-weight:900;color:var(--muted);text-align:center;white-space:nowrap}
    .x-td{position:absolute;font-size:52px;font-weight:900;text-align:center;white-space:nowrap}
    .x-tr{position:absolute;font-size:40px;font-weight:900;white-space:nowrap;line-height:1.15}
    .x-tr small{display:block;font-size:28px;font-weight:800;color:var(--muted)}
    .x-hl{position:absolute;border:4px solid #f2c443;border-radius:22px;box-shadow:0 0 30px rgba(242,196,67,.25)}
    .x-step{position:absolute;left:150px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-step .s{display:inline-block;width:56px;height:56px;margin-right:20px;border-radius:50%;background:var(--brand);font-size:32px;line-height:56px;text-align:center;vertical-align:middle}
    .x-ph{position:absolute;font-size:34px;font-weight:900;white-space:nowrap;line-height:1.3}
    .x-ph small{display:block;font-size:30px;font-weight:800}
    .x-tile{position:absolute;width:800px;height:122px;border-radius:28px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:40px;font-weight:900;white-space:nowrap}
    .x-tile .l{flex:none;margin:0 26px 0 24px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;line-height:52px;text-align:center;color:var(--muted)}
    .x-tile .ok{position:absolute;right:18px;top:29px;width:60px;height:60px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', GOOD = '#4cc781', BAD = '#f0707a', MUT = '#a3abbd'
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  const arrow = (cls, x1, y, x2, col) => `<line class="${cls}" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="10" stroke-linecap="round"/>`
  const head = (cls, col) => `<path class="${cls}" d="M0 -16L26 0L0 16Z" fill="${col}"/>`
  // point an arrow head at (x, y), facing right (dir 1) or left (dir -1)
  const aim = (c, sel, x, y, dir) => c.$(sel).setAttribute('transform', `translate(${x.toFixed(1)} ${y}) scale(${dir} 1)`)
  const cube = (x, y, s) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.16}" fill="rgba(170,220,255,.28)" stroke="#bfe3ff" stroke-width="4"/><path d="M${x + s * 0.2} ${y + s * 0.28}L${x + s * 0.45} ${y + s * 0.18}" stroke="#eaf6ff" stroke-width="6" stroke-linecap="round"/>`

  // ---------- intro: a faint tug-of-war rope along the bottom ----------
  EZ.intro = {
    chips: [['1@0.3', 'What ΔG tells you'], ['1@0.55', 'The sign table'], ['1@0.85', 'When temperature decides']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.3"><line x1="320" y1="900" x2="1600" y2="900" stroke="${MUT}" stroke-width="8" stroke-linecap="round"/>
      <g class="x-ik">${ball(0, 0, 18, 'warm')}</g>${ball(320, 900, 26, 'warm')}${ball(1600, 900, 26, 'teal')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      mv(c, '.x-ik', 960 + 40 * Math.sin(t * 0.7), 900)
    },
  }

  // ---------- hook: ice on a warm day vs in the freezer ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">Same ice, different outcome</h2>
      <div class="card" style="left:160px;top:300px;width:760px;height:520px" data-at="0"><h3 class="warm">Warm day</h3></div>
      <div class="card" style="left:1000px;top:300px;width:760px;height:520px" data-at="1"><h3 class="teal">Freezer</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.2" data-fx="fade"><circle cx="790" cy="420" r="34" fill="${GOLD}"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return `<line x1="${(790 + 48 * Math.cos(a)).toFixed(1)}" y1="${(420 + 48 * Math.sin(a)).toFixed(1)}" x2="${(790 + 66 * Math.cos(a)).toFixed(1)}" y2="${(420 + 66 * Math.sin(a)).toFixed(1)}" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>` }).join('')}
          <ellipse class="x-pud" cx="540" cy="720" rx="40" ry="10" fill="rgba(170,220,255,.30)"/><rect class="x-ice" x="460" y="560" width="160" height="160" rx="26" fill="rgba(170,220,255,.28)" stroke="#bfe3ff" stroke-width="4"/></g>
        <g data-at="1@0.2" data-fx="fade">${cube(1300, 560, 160)}
          ${[[1180, 450], [1560, 470], [1250, 700], [1620, 640], [1440, 440]].map(([x, y]) => `<path d="M${x - 16} ${y}H${x + 16}M${x} ${y - 16}V${y + 16}M${x - 11} ${y - 11}L${x + 11} ${y + 11}M${x - 11} ${y + 11}L${x + 11} ${y - 11}" stroke="#bfe3ff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`).join('')}</g>
      </svg>
      <div class="x-lab bad" style="left:160px;width:760px;top:750px;font-size:34px" data-at="0@0.7" data-fx="fade">melts</div>
      <div class="x-lab good" style="left:1000px;width:760px;top:750px;font-size:34px" data-at="1@0.6" data-fx="fade">doesn't melt</div>
      <div class="banner" style="top:870px" data-at="2" data-out="4-0.35" data-fx="pop">Same process, <span class="gold">different outcome</span>: which way?</div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop"><span class="gold">Gibbs free energy, ΔG</span>: combines <span class="warm">ΔH</span>, <span class="teal">ΔS</span> and <span class="gold">T</span></div>`,
    update(c) {
      const p = eio(c.seg(c.b[0].start + 0.5, c.b[0].start + 2.6))
      const h = lerp(160, 40, p), w = lerp(160, 120, p)
      const ice = c.$('.x-ice')
      ice.setAttribute('height', h.toFixed(1)); ice.setAttribute('y', (720 - h).toFixed(1))
      ice.setAttribute('width', w.toFixed(1)); ice.setAttribute('x', (540 - w / 2).toFixed(1))
      ice.setAttribute('rx', lerp(26, 18, p).toFixed(1))
      c.$('.x-pud').setAttribute('rx', lerp(40, 190, p).toFixed(1))
      c.$('.x-pud').setAttribute('ry', lerp(10, 22, p).toFixed(1))
    },
  })

  // ---------- the equation and the meaning of its sign ----------
  const tm = (f, n, cls, at) => `<div class="x-tm"><div class="x-f ${cls}"><span>${f}</span></div>${n ? `<div class="x-n ${cls}" data-at="${at}" data-fx="fade">${n}</div>` : ''}</div>`
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">The idea</div><h2 class="h1" data-at="in+0.2">The Gibbs equation</h2>
      <div class="x-eq" data-at="1">${tm('ΔG°', '', 'gold')}${tm('=', '', 'muted')}${tm('ΔH°', 'enthalpy', 'warm', '1@0.5')}${tm('−', '', 'muted')}${tm('T', 'temperature', 'gold', '1@0.7')}${tm('ΔS°', 'entropy', 'teal', '1@0.85')}</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2" data-fx="fade"><line x1="380" y1="580" x2="1540" y2="580" stroke="#363c54" stroke-width="8" stroke-linecap="round"/>
          <rect x="380" y="568" width="580" height="24" rx="12" fill="rgba(76,199,129,.35)"/><line x1="960" y1="545" x2="960" y2="615" stroke="#c9cee0" stroke-width="5"/>
          <text x="960" y="535" text-anchor="middle" font-size="30" font-weight="900" class="f-muted">0</text></g>
        <g data-at="3" data-fx="fade"><rect x="960" y="568" width="580" height="24" rx="12" fill="rgba(240,112,122,.35)"/></g>
        <g data-at="2" data-fx="fade"><g class="x-dg"><circle r="22" fill="${GOLD}"/></g></g>
      </svg>
      <div class="x-lab" style="left:380px;width:580px;top:620px" data-at="2@0.3" data-fx="fade"><span class="gold">ΔG° &lt; 0</span><br><span class="good" style="font-size:32px">favored (products)</span></div>
      <div class="x-lab" style="left:960px;width:580px;top:620px" data-at="3@0.3" data-fx="fade"><span class="gold">ΔG° &gt; 0</span><br><span class="bad" style="font-size:32px">not favored (reverse is)</span></div>
      <div class="x-line" style="top:770px;font-size:40px" data-at="4">say <span class="gold">“thermodynamically favored”</span><span data-at="5" data-fx="fade">, not <s class="muted">“spontaneous”</s></span></div>
      <div class="x-line muted" style="top:840px;font-size:34px" data-at="6" data-out="7-0.3">“spontaneous” sounds like “happens instantly”</div>
      <div class="banner" style="top:850px" data-at="7" data-fx="pop">Favored can still be <span class="warm">extremely slow</span></div>`,
    update(c) {
      const b = c.b
      const p = eio(c.seg(b[2].start + 0.3, b[2].start + 1.3)), q = eio(c.seg(b[3].start + 0.3, b[3].start + 1.3))
      mv(c, '.x-dg', lerp(lerp(960, 670, p), 1250, q), 580)
    },
  })

  // ---------- the sign table ----------
  const CX = [430, 690, 1130], RY = [440, 555, 670, 785]
  const ROWS = [['−', '+', '<span class="good">all</span> temperatures', ''], ['+', '−', '<span class="bad">no</span> temperature', ''], ['+', '+', '<span class="warm">high</span> T', 'the entropy term wins'], ['−', '−', '<span class="teal">low</span> T', 'the enthalpy term wins']]
  const sg = (s, helps) => `<span class="${helps ? 'good' : 'bad'}">${s}</span>`
  EZ.scene('table', {
    html: `<div class="kicker" data-at="in" data-fx="left">The signs</div><h2 class="h1" data-at="in+0.2">Four cases</h2>
      <div class="card" style="left:220px;top:300px;width:1260px;height:620px" data-at="1"></div>
      <div data-at="1@0.3" data-fx="fade"><div class="x-th" style="left:${CX[0] - 120}px;width:240px;top:340px">ΔH°</div><div class="x-th" style="left:${CX[1] - 120}px;width:240px;top:340px">ΔS°</div><div class="x-th" style="left:930px;width:420px;top:340px;text-align:left">favored at</div>
        <div style="position:absolute;left:260px;width:1180px;top:395px;height:4px;background:#363c54;border-radius:2px"></div></div>
      ${ROWS.map(([h, s, r, why], i) => `<div data-at="${i + 2}" data-fx="fade"><div class="x-td" style="left:${CX[0] - 80}px;width:160px;top:${RY[i] + 8}px">${sg(h, h === '−')}</div><div class="x-td" style="left:${CX[1] - 80}px;width:160px;top:${RY[i] + 8}px">${sg(s, s === '+')}</div>
        <div class="x-tr" style="left:930px;top:${RY[i] + (why ? 8 : 26)}px">${r}${why ? `<small>${why}</small>` : ''}</div></div>`).join('')}
      <div class="x-hl" style="left:236px;top:${RY[0] - 6}px;width:1228px;height:222px" data-at="6" data-fx="fade"></div>
      <div class="x-lab gold" style="left:1500px;width:380px;top:${RY[0] + 50}px;font-size:36px" data-at="6@0.2" data-fx="pop">no calculation<br>needed</div>
      <div class="x-lab muted" style="left:1500px;width:380px;top:${RY[2] + 30}px;font-size:28px" data-at="2@0.5" data-fx="fade"><span class="good">green</span> = pushes ΔG down<br><span class="bad">red</span> = pushes ΔG up</div>`,
  })

  // ---------- real examples ----------
  const ION = Array.from({ length: 10 }, (_, i) => ({ s: [1180 + (i % 4) * 26, 720 - Math.floor(i / 4) * 26], e: [1110 + (i * 53) % 240, 520 + (i * 71) % 200], k: i % 2 ? 'warm' : 'pur' }))
  EZ.scene('real', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Real examples</div><h2 class="h1" data-at="in+0.2">Freezing and dissolving</h2>
      <div class="card" style="left:120px;top:290px;width:810px;height:550px" data-at="1"><h3>Water freezing</h3></div>
      <div class="card" style="left:990px;top:290px;width:810px;height:550px" data-at="5"><h3>NaNO<sub>3</sub> dissolving</h3></div>
      <div class="x-chip" style="left:520px;top:310px;border-color:${GOOD};background:rgba(76,199,129,.12)" data-at="1@0.3" data-fx="pop">ΔH &lt; 0</div>
      <div class="x-chip" style="left:720px;top:310px;border-color:${BAD};background:rgba(240,112,122,.12)" data-at="1@0.7" data-fx="pop">ΔS &lt; 0</div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1@0.1" data-fx="fade"><rect x="210" y="420" width="44" height="340" rx="22" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="4"/><circle cx="232" cy="780" r="34" fill="${MUT}"/><rect x="224" y="560" width="16" height="210" rx="8" fill="${MUT}"/>
          <line x1="262" y1="600" x2="880" y2="600" stroke="#c9cee0" stroke-width="4" stroke-dasharray="14 10"/><text x="290" y="590" font-size="30" font-weight="900" class="f-muted">0 °C</text></g>
        <g data-at="2@0.4" data-fx="fade"><rect x="300" y="606" width="580" height="190" rx="16" fill="rgba(60,199,188,.12)"/><text x="590" y="690" text-anchor="middle" font-size="36" font-weight="900" class="f-teal">freezing favored</text></g>
        <g data-at="3" data-fx="fade"><text x="590" y="745" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">the freezer</text></g>
        <g data-at="4" data-fx="fade"><rect x="300" y="404" width="580" height="190" rx="16" fill="rgba(243,167,100,.12)"/><text x="590" y="490" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">reverse favored:</text><text x="590" y="540" text-anchor="middle" font-size="36" font-weight="900" class="f-warm">ice melts</text></g>
        <g data-at="5@0.3" data-fx="fade"><path d="M1060 420V730Q1060 770 1100 770H1340Q1380 770 1380 730V420" fill="rgba(60,199,188,.08)" stroke="${MUT}" stroke-width="5" stroke-linecap="round"/>
          ${ION.map((o, i) => `<g class="x-i${i}">${ball(0, 0, 13, o.k)}</g>`).join('')}</g>
        <g data-at="6@0.5" data-fx="fade"><text x="1220" y="410" text-anchor="middle" font-size="30" font-weight="900" class="f-teal">cools the water</text></g>
      </svg>
      <div class="x-chip" style="left:1440px;top:430px;border-color:${BAD};background:rgba(240,112,122,.12)" data-at="6" data-fx="pop">ΔH &gt; 0</div>
      <div class="x-chip" style="left:1440px;top:530px;border-color:${GOOD};background:rgba(76,199,129,.12)" data-at="7" data-fx="pop">ΔS &gt; 0</div>
      <div class="x-ph good" style="left:1420px;top:640px" data-at="7@0.6" data-fx="fade">favored<small class="muted">entropy term wins</small></div>
      <div class="banner" style="top:870px;font-size:36px" data-at="8" data-fx="pop">ΔG°<sub>rxn</sub> = ΣΔG°<sub>f</sub>(products) − ΣΔG°<sub>f</sub>(reactants)</div>`,
    update(c) {
      const p = eio(c.seg(c.b[5].start + 0.8, c.b[5].start + 3.2))
      ION.forEach(({ s, e }, i) => mv(c, '.x-i' + i, lerp(s[0], e[0], p), lerp(s[1], e[1], p)))
    },
  })

  // ---------- worked example: ammonia ----------
  const K = 3.5, Z = 1530
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="in+0.2">Is forming ammonia favored?</h2>
      <div class="x-line" style="top:285px" data-at="1">N<sub>2</sub>(g) + 3H<sub>2</sub>(g) ${ARR} 2NH<sub>3</sub>(g) &nbsp;<span class="muted">at</span> <span class="gold">298 K</span></div>
      <div class="x-chip" style="left:520px;top:370px;border-color:${WARM};background:rgba(243,167,100,.12)" data-at="2" data-fx="pop">ΔH° = −92.2 kJ</div>
      <div class="x-chip" style="left:990px;top:370px;border-color:${TEAL};background:rgba(60,199,188,.12)" data-at="2@0.5" data-fx="pop">ΔS° = −198.7 J/K</div>
      <div class="card" style="left:110px;top:470px;width:1700px;height:440px" data-at="3"></div>
      <div class="x-step" style="top:500px" data-at="3"><span class="s">1</span>ΔS° = <span class="teal">−0.1987 kJ/K</span> <span class="muted" style="font-size:30px">(÷ 1000)</span></div>
      <div class="x-step" style="top:600px" data-at="4"><span class="s">2</span>ΔG° = −92.2 − (298)(−0.1987)</div>
      <div class="x-step" style="top:700px;left:226px" data-at="5">= <span class="warm">−92.2</span> + <span class="teal">59.2</span></div>
      <div class="x-step" style="top:800px;left:226px" data-at="6">ΔG° = <span class="gold">−33.0 kJ</span> &nbsp;<span class="good">favored ✓</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="5" data-fx="fade"><line x1="${Z}" y1="530" x2="${Z}" y2="880" stroke="#c9cee0" stroke-width="4"/><text x="${Z}" y="520" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">0</text>
          <rect class="x-b1" x="${Z}" y="600" width="0" height="44" rx="8" fill="${WARM}"/><text x="${Z - 92.2 * K / 2}" y="586" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">ΔH° = −92.2</text>
          <rect class="x-b2" x="${Z}" y="700" width="0" height="44" rx="8" fill="${TEAL}"/><text x="${Z + 14}" y="686" font-size="28" font-weight="900" class="f-teal">−TΔS° = +59.2</text></g>
        <g data-at="6" data-fx="fade"><rect class="x-b3" x="${Z}" y="800" width="0" height="44" rx="8" fill="${GOLD}"/><text x="${Z - 14}" y="786" text-anchor="end" font-size="28" font-weight="900" class="f-gold">ΔG° = −33.0</text></g>
      </svg>`,
    update(c) {
      const b = c.b
      const grow = (sel, v, t0) => { const w = Math.abs(v) * K * eio(c.seg(t0, t0 + 0.9)); const el = c.$(sel); el.setAttribute('width', w.toFixed(1)); el.setAttribute('x', (v < 0 ? Z - w : Z).toFixed(1)) }
      grow('.x-b1', -92.2, b[5].start + 0.1); grow('.x-b2', 59.2, b[5].start + 0.8); grow('.x-b3', -33.0, b[6].start + 0.2)
    },
  })

  // ---------- trick: tug-of-war, then the crossover temperature ----------
  const track = (y) => `<line x1="760" y1="${y}" x2="1600" y2="${y}" stroke="#363c54" stroke-width="8" stroke-linecap="round"/><line x1="1180" y1="${y - 30}" x2="1180" y2="${y + 30}" stroke="#c9cee0" stroke-width="4"/>
    <text x="745" y="${y + 10}" text-anchor="end" font-size="28" font-weight="900" class="f-good">favored</text><text x="1615" y="${y + 10}" font-size="28" font-weight="900" class="f-bad">not</text>`
  EZ.scene('tug', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trick</div><h2 class="h1" data-at="in+0.2">Who wins the tug-of-war?</h2>
      <div data-at="0@0.3" data-out="6-0.35" data-fx="fade">
        <div class="card" style="left:120px;top:290px;width:1680px;height:230px"></div>
        <div class="card" style="left:120px;top:545px;width:1680px;height:250px" data-at="4"></div>
        <div class="x-ph" style="left:160px;top:320px">They agree<small><span class="good">ΔH &lt; 0</span>, <span class="good">ΔS &gt; 0</span></small></div>
        <div class="x-ph good" style="left:160px;top:440px" data-at="3@0.3" data-fx="fade">always favored</div>
        <div class="x-ph" style="left:160px;top:575px" data-at="4">They disagree<small><span class="bad">ΔH &gt; 0</span>, <span class="good">ΔS &gt; 0</span></small></div>
        <div class="x-ph warm" style="left:160px;top:695px" data-at="5@0.5" data-fx="fade">high T: entropy wins</div>
        <svg class="full" viewBox="0 0 1920 1080">
          <g>${track(420)}</g>
          <g data-at="1" data-fx="fade">${arrow('x-a1', 1180, 365, 1000, WARM)}<g class="x-h1">${head('', WARM)}</g><text x="1090" y="345" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">ΔH</text></g>
          <g data-at="2" data-fx="fade">${arrow('x-a2', 1180, 475, 1000, TEAL)}<g class="x-h2">${head('', TEAL)}</g><text x="1090" y="510" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">−TΔS</text></g>
          <g class="x-m1"><circle r="22" fill="${GOLD}"/></g>
          <g data-at="4" data-fx="fade">${track(680)}
            ${arrow('x-a3', 1180, 625, 1340, WARM)}<g class="x-h3">${head('', WARM)}</g><text x="1260" y="605" text-anchor="middle" font-size="28" font-weight="900" class="f-warm">ΔH</text>
            ${arrow('x-a4', 1180, 735, 1080, TEAL)}<g class="x-h4">${head('', TEAL)}</g><text class="x-l4" x="1130" y="770" text-anchor="middle" font-size="28" font-weight="900" class="f-teal">−TΔS</text>
            <g class="x-m2"><circle r="22" fill="${GOLD}"/></g></g>        </svg>
        <div class="x-chip gold" style="left:1420px;top:560px;border-color:${GOLD};background:rgba(242,196,67,.12);font-size:30px" data-at="4@0.4" data-fx="pop">T = referee</div>
        <div class="x-line" style="top:830px;font-size:38px" data-at="5">higher <span class="gold">T</span> ${ARR} bigger <span class="teal">TΔS</span> term</div>
      </div>
      <div class="x-line" style="top:300px;font-size:60px" data-at="6">crossover (ΔG° = 0): &nbsp;<span class="gold">T = ΔH° / ΔS°</span></div>
      <div class="x-line" style="top:410px;font-size:44px" data-at="7">NH<sub>3</sub>: (−92.2) / (−0.1987) ≈ <span class="gold">464 K</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="7@0.5" data-fx="fade"><line x1="360" y1="680" x2="1560" y2="680" stroke="#c9cee0" stroke-width="5" marker-end="url(#mk-muted)"/><text x="1580" y="690" font-size="32" font-weight="900" class="f-muted">T</text>
          <line x1="960" y1="640" x2="960" y2="720" stroke="${GOLD}" stroke-width="6"/><text x="960" y="620" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">≈ 464 K</text></g>
        <g data-at="8" data-fx="fade"><rect x="360" y="700" width="596" height="110" rx="16" fill="rgba(76,199,129,.14)"/><text x="658" y="770" text-anchor="middle" font-size="36" font-weight="900" class="f-good">favored</text>
          <rect x="964" y="700" width="596" height="110" rx="16" fill="rgba(240,112,122,.12)"/><text x="1262" y="770" text-anchor="middle" font-size="36" font-weight="900" class="f-bad">not favored</text></g>
      </svg>
      <div class="x-line" style="top:860px;font-size:36px" data-at="8@0.4">ΔH &lt; 0 and ΔS &lt; 0: favored only <span class="teal">below</span> the crossover</div>`,
    update(c) {
      const b = c.b
      aim(c, '.x-h1', 1000, 365, -1); aim(c, '.x-h2', 1000, 475, -1); aim(c, '.x-h3', 1340, 625, 1)
      mv(c, '.x-m1', lerp(1180, 900, eio(c.seg(b[3].start + 0.2, b[3].start + 1.4))), 420)
      c.$('.x-m1').style.opacity = c.seg(b[0].start + 0.3, b[0].start + 0.8) * (1 - c.seg(b[6].start - 0.35, b[6].start))
      // the -TdS arrow grows with temperature; the marker follows the net pull
      const g = eio(c.seg(b[5].start + 0.3, b[5].start + 2.0)), L = lerp(100, 300, g), x4 = 1180 - L
      c.$('.x-a4').setAttribute('x2', x4.toFixed(1)); aim(c, '.x-h4', x4, 735, -1); c.$('.x-l4').setAttribute('x', (1180 - L / 2).toFixed(1))
      mv(c, '.x-m2', 1180 + (160 - L) * 0.9, 680)
    },
  })

  // ---------- trap: units ----------
  EZ.scene('units', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Match the units</h2>
      <div class="card" style="left:160px;top:320px;width:700px;height:300px" data-at="1"><h3 class="warm">ΔH°</h3><div class="x-lab" style="left:0;width:700px;top:130px;font-size:72px">kJ</div></div>
      <div class="card" style="left:1060px;top:320px;width:700px;height:300px" data-at="1@0.5"><h3 class="teal">ΔS°</h3>
        <div class="x-lab" style="left:0;width:700px;top:130px;font-size:72px" data-at="1@0.5" data-out="2@0.6">J/K</div>
        <div class="x-lab teal" style="left:0;width:700px;top:130px;font-size:72px" data-at="2@0.6" data-fx="pop">kJ/K</div></div>
      <div class="x-chip gold" style="left:1270px;top:650px;border-color:${GOLD};background:rgba(242,196,67,.12);font-size:44px" data-at="2" data-fx="pop">÷ 1000</div>
      <div class="x-lab good" style="left:160px;width:1600px;top:760px;font-size:40px" data-at="2@0.8" data-fx="fade">now both use kJ ✓</div>
      <div class="banner" style="top:860px" data-at="3" data-fx="pop">Skip it ${ARR} the <span class="teal">TΔS</span> term is <span class="bad">1000 × too big</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'At all temperatures'], ['B', 'At no temperature'], ['C', 'Only at high temperatures'], ['D', 'Only at low temperatures']]
  const OPT_AT = ['1@0.6', '1@0.7', '1@0.79', '1@0.9']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">ΔH° = <span class="warm">+50 kJ</span>, ΔS° = <span class="teal">+150 J/K</span>. When is it favored?</h2>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${140 + (i % 2) * 840}px;top:${320 + Math.floor(i / 2) * 150}px" data-at="${OPT_AT[i]}" data-fx="pop"><div class="l">${l}</div><span>${f}</span>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="740" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="740" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 740)"/>
        <text class="x-num" x="960" y="766" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="870" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:660px" data-at="4" data-fx="pop">(<span class="good">+</span>, <span class="good">+</span>): <span class="gold">temperature decides</span></div>
      <div class="x-line" style="top:800px;font-size:40px" data-at="5">above 50 / 0.150 ≈ <span class="gold">333 K</span>, <span class="teal">TΔS</span> outweighs <span class="warm">ΔH</span></div>`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[3].start + 0.3, b[3].start + 0.8))
      for (let i = 0; i < 4; i++) {
        const el = c.$('.x-t' + i)
        if (i === 2) {
          el.style.borderColor = win ? `rgba(76,199,129,${win})` : ''
          el.style.boxShadow = `0 0 ${60 * win}px rgba(76,199,129,${0.55 * win})`
          c.$('.ok').style.opacity = win
          c.$('.ok').style.transform = `scale(${0.5 + 0.5 * win})`
        } else el.style.filter = `brightness(${1 - 0.4 * win})`
      }
    },
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="90" text-anchor="middle" font-size="42" font-weight="900" class="f-gold">ΔG° = ΔH° − TΔS°</text></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150">${[['#4cc781', 'all'], ['#f0707a', 'none'], [WARM, 'high T'], [TEAL, 'low T']].map(([col, s], i) => { const x = 110 + (i % 2) * 130, y = 8 + Math.floor(i / 2) * 72; return `<rect x="${x}" y="${y}" width="120" height="62" rx="12" fill="${col}" opacity=".85"/><text x="${x + 60}" y="${y + 41}" text-anchor="middle" font-size="26" font-weight="900" class="f-dark">${s}</text>` }).join('')}</svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="110" y="92" text-anchor="middle" font-size="46" font-weight="900" class="f-teal">J/K</text>
    <line x1="175" y1="80" x2="275" y2="80" stroke="${MUT}" stroke-width="6" marker-end="url(#mk-muted)"/><text x="225" y="58" text-anchor="middle" font-size="26" font-weight="900" class="f-gold">÷ 1000</text>
    <text x="360" y="92" text-anchor="middle" font-size="46" font-weight="900" class="f-warm">kJ/K</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>ΔG° &lt; 0 means<br><span class="good">thermodynamically</span><br><span class="good">favored</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>(−,+) <span class="good">always</span><br>(+,−) <span class="bad">never</span><br>(+,+) <span class="warm">high T</span><br>(−,−) <span class="teal">low T</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Convert ΔS<br>from <span class="teal">J</span> to <span class="warm">kJ</span><br>before combining</p></div>`,
  })
})()
