// Pictures for chem-9.6 "Free Energy of Dissolution". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, chem/book.ts): three contributions
// (break the lattice: ΔH > 0, ΔS > 0; solvent reorganizes: often ΔS < 0; ion–dipole attractions form: ΔH < 0);
// ΔG° of dissolution is their sum and they partly cancel; NaNO₃ dissolving is endothermic yet entropy-driven
// (TΔS > ΔH, ΔG = ΔH − TΔS < 0); the try (solution warms → ΔH < 0, dissolves readily → ΔG < 0).
// Bars carry no numbers: they show signs and "which is bigger" only. Ions are generic + and − balls.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:46px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:42px;font-weight:900;white-space:nowrap}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-row em{font-style:normal;font-size:30px;font-weight:800;color:var(--muted)}
    .x-eq{position:absolute;left:0;width:1920px;text-align:center;font-size:56px;font-weight:900;white-space:nowrap}
    .x-tl{position:absolute;height:200px;border-radius:30px;background:rgba(36,40,56,.92);border:4px solid var(--line);text-align:center}
    .x-tl .f{margin-top:40px;font-size:56px;font-weight:900;line-height:1;white-space:nowrap}
    .x-tl .s{margin-top:22px;font-size:32px;font-weight:800;color:var(--muted);white-space:nowrap}
    .x-opt{position:absolute;width:820px;height:130px;border-radius:26px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;padding:0 96px 0 106px;font-size:40px;font-weight:900;line-height:1.2}
    .x-opt .l{position:absolute;left:26px;top:31px;width:60px;height:60px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:32px;font-weight:900;line-height:56px;text-align:center;color:var(--muted)}
    .x-opt .ok{position:absolute;right:20px;top:29px;width:64px;height:64px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:36px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', LINE = '#363c54', MUTED = '#a3abbd', RED = '#f0707a'
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x} ${y})`)
  // a little deterministic scatter
  const rnd = (i, s = 1) => { const v = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return v - Math.floor(v) }
  const ion = (x, y, i, r) => (i % 2 ? ball(x, y, r, 'teal', '−') : ball(x, y, r, 'pur', '+'))
  // a water molecule at the origin: O ball and two H balls; `a` = direction (radians) the H atoms point
  const wat = (a) => {
    const h = (d) => ball(24 * Math.cos(a + d), 24 * Math.sin(a + d), 11, 'gray')
    return `${h(0.92)}${h(-0.92)}${ball(0, 0, 18, 'red')}`
  }
  // thermometer: tube top y0, bulb at y1; liquid rect gets class cls
  const thermo = (x, y0, y1, cls, top) => `<rect x="${x - 17}" y="${y0}" width="34" height="${y1 - y0}" rx="17" style="fill:#1a1d2a" stroke="${MUTED}" stroke-width="4"/>
    <rect class="${cls}" x="${x - 8}" y="${top}" width="16" height="${y1 - top}" rx="8" style="fill:${RED}"/>
    <circle cx="${x}" cy="${y1 + 18}" r="32" style="fill:${RED}" stroke="${MUTED}" stroke-width="4"/>`

  // ---------- intro: a faint row of ions ----------
  const IX = [180, 340, 500, 660, 820, 1100, 1260, 1420, 1580, 1740]
  EZ.intro = {
    chips: [['1@0.3', 'Three steps'], ['1@0.55', 'Partly cancelling'], ['1@0.85', 'Entropy-driven']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.24">${IX.map((x, i) => `<g class="x-im${i}">${ion(0, 0, i, 26)}</g>`).join('')}</svg>`,
    update(c) {
      const t = c.t - c.sc.start
      IX.forEach((x, i) => mv(c, '.x-im' + i, x, 880 + 8 * Math.sin(t * 1.1 + i * 1.3)))
    },
  }

  // ---------- hook: the water gets colder, yet it dissolves ----------
  const HG = Array.from({ length: 12 }, (_, i) => [860 + ((i % 4) - 1.5) * 44, 784 - Math.floor(i / 4) * 44])
  const HT = HG.map((_, i) => [665 + (i % 4) * 130 + (rnd(i) - 0.5) * 50, 490 + Math.floor(i / 4) * 120 + (rnd(i, 2) - 0.5) * 50])
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Puzzle</div><h2 class="h1" data-at="in+0.2">The water gets colder</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.3" data-fx="fade"><rect x="606" y="430" width="508" height="394" rx="24" style="fill:rgba(60,199,188,.12)"/>
          <path d="M600 330V800Q600 830 630 830H1090Q1120 830 1120 800V330" fill="none" stroke="${MUTED}" stroke-width="6" stroke-linecap="round"/>
          ${HG.map((_, i) => `<g class="x-hi${i}">${ion(0, 0, i, 20)}</g>`).join('')}
          ${thermo(1400, 360, 790, 'x-hq', 450)}</g>
        <g data-at="0@0.6" data-fx="fade"><path d="M1490 470V640" stroke="${TEAL}" stroke-width="8" stroke-linecap="round" marker-end="url(#mk-teal)"/></g>
      </svg>
      <div class="x-lab teal" style="left:1520px;top:520px" data-at="0@0.6" data-fx="fade">colder</div>
      <div class="x-tl" style="left:120px;top:360px;width:420px" data-at="1" data-fx="pop"><div class="f warm">endothermic</div><div class="s">absorbs heat · uphill</div></div>
      <div class="x-tl" style="left:120px;top:600px;width:420px" data-at="2" data-fx="pop"><div class="f teal">dissolves</div><div class="s">readily</div></div>
      <div class="banner" style="top:870px" data-at="3" data-out="4" data-fx="pop">How can an uphill process be favored?</div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Entropy to the rescue</div>`,
    update(c) {
      const p = eio(c.p('0+0.6', 4.5))
      HG.forEach(([x, y], i) => mv(c, '.x-hi' + i, lerp(x, HT[i][0], p), lerp(y, HT[i][1], p)))
      const top = lerp(450, 640, eio(c.p('0+0.6', 3.5)))
      const q = c.$('.x-hq'); q.setAttribute('y', top); q.setAttribute('height', 790 - top)
    },
  })

  // ---------- step 1: the lattice breaks up ----------
  const LG = Array.from({ length: 16 }, (_, i) => [((i % 4) - 1.5) * 76, (Math.floor(i / 4) - 1.5) * 76])
  const LC = [510, 610]
  const LT = LG.map(([dx, dy], i) => [LC[0] + dx * 1.6 + (rnd(i, 3) - 0.5) * 50, LC[1] + dy * 1.6 + (rnd(i, 4) - 0.5) * 40])
  const LL = []
  LG.forEach(([dx, dy], i) => { if (i % 4 < 3) LL.push([dx, dy, dx + 76, dy]); if (i < 12) LL.push([dx, dy, dx, dy + 76]) })
  EZ.scene('lattice', {
    html: `<div class="kicker" data-at="in" data-fx="left">Three things happen</div><h2 class="h1" data-at="in+0.2">1 · The solid breaks up</h2>
      <div class="card" style="left:120px;top:300px;width:780px;height:540px" data-at="in+0.3" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="in+0.4" data-fx="fade"><g class="x-ll">${LL.map(([a, b, c2, d]) => `<line x1="${LC[0] + a}" y1="${LC[1] + b}" x2="${LC[0] + c2}" y2="${LC[1] + d}" stroke="${GOLD}" stroke-width="5" opacity=".7"/>`).join('')}</g>
          ${LG.map((_, i) => `<g class="x-li${i}">${ion(0, 0, (i + Math.floor(i / 4)) % 2, 28)}</g>`).join('')}</g>
      </svg>
      <div class="x-lab gold" style="left:120px;width:780px;top:322px;font-size:32px" data-at="1" data-out="1+2.6" data-fx="fade">overcome the attractions</div>
      <div class="x-tl" style="left:1000px;top:330px;width:800px" data-at="2" data-fx="pop"><div class="f warm">ΔH &gt; 0</div><div class="s">costs energy</div></div>
      <div class="x-tl" style="left:1000px;top:580px;width:800px" data-at="3" data-fx="pop"><div class="f teal">ΔS &gt; 0</div><div class="s">ions more dispersed</div></div>
      <div class="banner" style="top:870px" data-at="4" data-fx="pop">Dispersal <span class="teal">favors</span> dissolving</div>`,
    update(c) {
      const p = eio(c.p('1+0.4', 2.4))
      LG.forEach(([dx, dy], i) => mv(c, '.x-li' + i, lerp(LC[0] + dx, LT[i][0], p), lerp(LC[1] + dy, LT[i][1], p)))
      c.$('.x-ll').style.opacity = Math.max(0, 1 - p * 3)
    },
  })

  // ---------- steps 2 and 3: water around the ions ----------
  const WI = [[370, 590, 0], [850, 590, 1]] // x, y, anion?
  const WA = Array.from({ length: 6 }, (_, k) => Math.PI / 6 + (k * Math.PI) / 3)
  EZ.scene('water', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Around the ions</div><h2 class="h1" data-at="in+0.2">2 · Solvent reorganizes &nbsp;3 · Attractions form</h2>
      <div class="card" style="left:120px;top:300px;width:980px;height:540px" data-at="in+0.3" data-fx="fade"></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3" data-fx="fade">${WI.map(([x, y, an]) => WA.map((a) => `<line x1="${x + 46 * Math.cos(a)}" y1="${y + 46 * Math.sin(a)}" x2="${x + (an ? 88 : 98) * Math.cos(a)}" y2="${y + (an ? 88 : 98) * Math.sin(a)}" stroke="${GOLD}" stroke-width="5" stroke-dasharray="8 8" stroke-linecap="round"/>`).join('')).join('')}</g>
        <g data-at="in+0.4" data-fx="fade">${WI.map(([x, y, an]) => ion(x, y, an, 40)).join('')}</g>
        <g data-at="0@0.3" data-fx="fade">${WI.map(([, , an], j) => WA.map((a, k) => `<g class="x-w${j}${k}">${wat(an ? a + Math.PI : a)}</g>`).join('')).join('')}</g>
      </svg>
      <div class="x-lab gold" style="left:120px;width:980px;top:770px;font-size:36px" data-at="3@0.6" data-fx="fade">ion–dipole attractions</div>
      <div class="x-tl" style="left:1160px;top:330px;width:640px" data-at="2" data-fx="pop"><div class="f warm">ΔS &lt; 0 <span style="font-size:34px">(often)</span></div><div class="s">water more ordered</div></div>
      <div class="x-tl" style="left:1160px;top:580px;width:640px" data-at="4" data-fx="pop"><div class="f teal">ΔH &lt; 0</div><div class="s">forming attractions releases energy</div></div>
      <div class="banner" style="top:870px;font-size:46px" data-at="5" data-fx="pop">Breaking <span class="warm">costs</span> energy · forming <span class="teal">releases</span> it</div>`,
    update(c) {
      const p = eio(c.p('1+0.2', 2.2))
      const rad = lerp(195, 120, p)
      WI.forEach(([x, y], j) => WA.forEach((a, k) => { const aa = a + (1 - p) * 0.5; mv(c, `.x-w${j}${k}`, x + rad * Math.cos(aa), y + rad * Math.sin(aa)) }))
    },
  })

  // ---------- the balance: contributions partly cancel ----------
  const BASE = 650
  const BARS = [
    { x: 230, up: 1, h: 140, col: WARM, cue: '1@0.25', lab: 'break lattice' },
    { x: 430, up: 0, h: 130, col: TEAL, cue: '1@0.65', lab: 'hydration' },
    { x: 1090, up: 1, h: 130, col: TEAL, cue: '3+0.2', lab: 'ions disperse' },
    { x: 1290, up: 0, h: 130, col: WARM, cue: '3@0.6', lab: 'water orders' },
  ]
  EZ.scene('balance', {
    html: `<div class="kicker gold" data-at="in" data-fx="left">Add them up</div><h2 class="h1" data-at="in+0.2">They partly cancel</h2>
      <div class="x-eq" style="top:282px" data-at="0">ΔG°<sub>dissolution</sub> = <span class="gold">sum</span> of the contributions</div>
      <div class="card" style="left:120px;top:380px;width:800px;height:460px" data-at="1"><h3>Enthalpy, <span class="pri">ΔH</span></h3></div>
      <div class="card" style="left:1000px;top:380px;width:800px;height:460px" data-at="3"><h3>Entropy, <span class="pri">ΔS</span></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="1" data-fx="fade"><line x1="170" y1="${BASE}" x2="870" y2="${BASE}" stroke="${MUTED}" stroke-width="4"/></g>
        <g data-at="3" data-fx="fade"><line x1="1050" y1="${BASE}" x2="1750" y2="${BASE}" stroke="${MUTED}" stroke-width="4"/></g>
        ${BARS.map((b, i) => `<rect class="x-b${i}" x="${b.x}" y="${BASE}" width="130" height="0" rx="10" style="fill:${b.col}"/>
          <g data-at="${b.cue}" data-fx="fade"><text x="${b.x + 65}" y="815" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">${b.lab}</text>
          <text x="${b.x + 65}" y="${b.up ? BASE - b.h / 2 + 18 : BASE + b.h / 2 + 18}" text-anchor="middle" font-size="52" font-weight="900" class="f-dark">${b.up ? '+' : '−'}</text></g>`).join('')}
        <g data-at="2@0.4" data-fx="fade"><text x="740" y="${BASE - 40}" text-anchor="middle" font-size="34" font-weight="900" class="f-gold">nearly cancel</text></g>
        <g data-at="4" data-fx="pop"><text x="740" y="${BASE + 110}" text-anchor="middle" font-size="110" font-weight="900" class="f-gold">?</text></g>
        <g data-at="4" data-fx="pop"><text x="1610" y="${BASE + 110}" text-anchor="middle" font-size="110" font-weight="900" class="f-gold">?</text></g>
      </svg>
      <div class="banner" style="top:870px" data-at="5" data-fx="pop">Some salts dissolve, others <span class="warm">don't</span></div>`,
    update(c) {
      BARS.forEach((b, i) => {
        const h = b.h * eo(c.p(b.cue, 0.8)), r = c.$('.x-b' + i)
        r.setAttribute('height', h); r.setAttribute('y', b.up ? BASE - h : BASE)
      })
    },
  })

  // ---------- worked example: NaNO3 ----------
  const EB = 700
  const EBARS = [
    { x: 1110, up: 1, h: 160, col: WARM, cue: '2@0.5', lab: 'ΔH' },
    { x: 1310, up: 1, h: 260, col: TEAL, cue: '4', lab: 'TΔS' },
    { x: 1510, up: 0, h: 100, col: GOLD, cue: '5@0.4', lab: 'ΔG' },
  ]
  EZ.scene('example', {
    html: `<div class="kicker" data-at="in" data-fx="left">Example</div><h2 class="h1" data-at="in+0.2">NaNO<sub>3</sub> in water</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="0@0.3"><h3>What we see</h3>
        <div class="x-row" style="top:96px" data-at="1">colder water, <span class="teal">very soluble</span></div>
        <div class="x-row" style="top:176px" data-at="2">absorbs heat ${ARR} <span class="warm">ΔH &gt; 0</span> <em>unfavorable</em></div>
        <div class="x-row" style="top:256px" data-at="3">ions spread out ${ARR} <span class="teal">ΔS &gt; 0</span> <em>favorable</em></div>
        <div class="x-row" style="top:336px" data-at="4">room temperature: <span class="gold">TΔS &gt; ΔH</span></div>
        <div class="x-row" style="top:416px;font-size:44px" data-at="5">ΔG = ΔH − TΔS <span class="gold">&lt; 0</span></div></div>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2@0.3"><h3>Compare</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="2@0.3" data-fx="fade"><line x1="1040" y1="${EB}" x2="1750" y2="${EB}" stroke="${MUTED}" stroke-width="4"/></g>
        ${EBARS.map((b, i) => `<rect class="x-e${i}" x="${b.x}" y="${EB}" width="140" height="0" rx="10" style="fill:${b.col}"/>
          <g data-at="${b.cue}" data-fx="fade"><text x="${b.x + 70}" y="${b.up ? EB - b.h - 18 : EB - 20}" text-anchor="middle" font-size="40" font-weight="900" style="fill:${b.col}">${b.lab}</text></g>`).join('')}
        <g data-at="5@0.6" data-fx="fade"><text x="1580" y="${EB + 60}" text-anchor="middle" font-size="40" font-weight="900" class="f-dark">−</text></g>
      </svg>
      <div class="banner" style="top:870px" data-at="6" data-fx="pop"><span class="teal">Entropy-driven</span>: TΔS outweighs ΔH</div>`,
    update(c) {
      EBARS.forEach((b, i) => {
        const h = b.h * eo(c.p(b.cue, 0.9)), r = c.$('.x-e' + i)
        r.setAttribute('height', h); r.setAttribute('y', b.up ? EB - h : EB)
      })
    },
  })

  // ---------- trap: the thermometer gives ΔH, not ΔG ----------
  EZ.scene('trap', {
    html: `<div class="kicker bad" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Colder does <span class="gold">not</span> mean unfavored</h2>
      <div class="card" style="left:120px;top:300px;width:810px;height:540px" data-at="1"><h3>The thermometer tells you</h3>
        <div class="x-row" style="left:260px;top:150px" data-at="1@0.3">colder ${ARR} <span class="warm">ΔH &gt; 0</span></div>
        <div class="x-row" style="left:260px;top:250px" data-at="1@0.7"><span class="bad">✗</span> not the sign of ΔG</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade">${thermo(270, 430, 740, 'x-tq', 640)}</g></svg>
      <div class="card" style="left:990px;top:300px;width:810px;height:540px" data-at="2"><h3>Still favored if</h3>
        <div class="x-row" style="top:110px" data-at="2@0.4"><span class="teal">ΔS &gt; 0</span></div>
        <div class="x-row" style="top:190px" data-at="2@0.6">and <span class="gold">TΔS &gt; ΔH</span></div>
        <div class="x-row" style="top:290px;font-size:44px" data-at="2@0.85">${ARR} ΔG &lt; 0 <span class="good">✓</span></div></div>
      <div class="banner" style="top:870px;font-size:46px" data-at="3" data-fx="pop">Endothermic + very soluble ${ARR} <span class="teal">ΔS &gt; 0</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = ['ΔH &gt; 0', 'ΔH &lt; 0 for the dissolution', 'ΔS must be negative', 'ΔG &gt; 0']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">Which must be true?</h2>
      <div class="x-line" style="top:268px;font-size:44px" data-at="1@0.2">A salt dissolves readily, and the solution gets <span class="warm">warmer</span>.</div>
      ${OPTS.map((o, i) => `<div class="x-opt x-t${i}" style="left:${120 + (i % 2) * 860}px;top:${360 + Math.floor(i / 2) * 150}px" data-at="2@${(0.08 + i * 0.22).toFixed(2)}" data-fx="pop"><div class="l">${'ABCD'[i]}</div>
        ${i === 1 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        <span>${o}</span></div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="790" r="74" fill="none" stroke="${LINE}" stroke-width="12"/><circle class="x-arc" cx="960" cy="790" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 790)"/>
        <text class="x-num" x="960" y="816" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="920" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px" data-at="5" data-fx="pop">Warmer ${ARR} heat released ${ARR} ΔH &lt; 0</div>
      <div class="x-line" style="top:830px;font-size:44px" data-at="6">Dissolves readily ${ARR} <span class="teal">ΔG &lt; 0</span></div>`,
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
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150">${[0, 1, 2, 3].map((i) => ion(70 + (i % 2) * 44, 53 + Math.floor(i / 2) * 44, (i + Math.floor(i / 2)) % 2, 20)).join('')}
    <path d="M170 75H250" stroke="${MUTED}" stroke-width="6" stroke-linecap="round" marker-end="url(#mk-muted)"/>
    ${[[310, 40], [400, 60], [330, 115], [420, 120]].map(([x, y], i) => ion(x, y, i, 20)).join('')}</svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><line x1="60" y1="75" x2="400" y2="75" stroke="${MUTED}" stroke-width="4"/>
    <rect x="90" y="15" width="80" height="60" rx="8" style="fill:${WARM}"/><rect x="200" y="75" width="80" height="56" rx="8" style="fill:${TEAL}"/>
    <text x="350" y="62" text-anchor="middle" font-size="80" font-weight="900" class="f-gold">?</text></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="92" text-anchor="middle" font-size="54" font-weight="900" class="f-gold">TΔS &gt; ΔH</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Break lattice: <span class="warm">+ΔH</span><br>Attractions form: <span class="teal">−ΔH</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>They partly cancel<br>ΔG is <span class="gold">hard to predict</span></p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>Endothermic can still<br>be favored if <span class="teal">ΔS &gt; 0</span></p></div>`,
  })
})()
