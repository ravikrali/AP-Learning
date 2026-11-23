// Pictures for chem-9.4 "Thermodynamic vs. Kinetic Control". One EZ.scene per scene id in script.mjs.
// Every fact shown is the lesson's own (app/src/content/chem/u9.ts, book.ts): dG says whether, not how fast;
// favored but no measurable rate = kinetic control, usually a high Ea; energy profile: products vs reactants =
// favorability, barrier height = rate; diamond -> graphite (many strong C-C bonds, rate effectively zero);
// wood + O2 needs a match; a catalyst lowers Ea but leaves dG unchanged (a higher T also helps); slow is not
// equilibrium; the dG = -200 kJ try. Curve heights show order only, never values.
(() => {
  const { lerp, eio, eo, ball, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-line{position:absolute;left:0;width:1920px;text-align:center;font-size:44px;font-weight:900;white-space:nowrap}
    .x-lab{position:absolute;text-align:center;font-size:38px;font-weight:900;white-space:nowrap;line-height:1.2}
    .x-lab small{display:block;margin-top:4px;font-size:28px;font-weight:800;color:var(--muted)}
    .x-row{position:absolute;left:44px;right:30px;font-size:40px;font-weight:900;white-space:nowrap}
    .x-chip{position:absolute;padding:8px 26px;border-radius:999px;font-size:30px;font-weight:900;white-space:nowrap;border:2px solid}
    .x-tile{position:absolute;width:800px;height:130px;border-radius:28px;background:rgba(36,40,56,.92);border:4px solid var(--line);display:flex;align-items:center;font-size:33px;font-weight:900;line-height:1.2}
    .x-tile .l{flex:none;margin:0 24px 0 24px;width:56px;height:56px;border-radius:50%;background:var(--surface2);border:2px solid var(--line);font-size:30px;line-height:52px;text-align:center;color:var(--muted)}
    .x-tile .tx{padding-right:96px}
    .x-tile .ok{position:absolute;right:18px;top:33px;width:60px;height:60px}
    .x-rc{top:320px;width:540px;height:580px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const TEAL = '#3cc7bc', GOLD = '#f2c443', WARM = '#f3a764', PRI = '#8d8df0', TXT = '#eef0f7'
  const EA = 'E<sub>a</sub>'
  const sEA = (cls = 'f-warm') => `<tspan class="${cls}">E<tspan dy="9" font-size=".62em">a</tspan></tspan>`
  const mv = (c, sel, x, y) => c.$(sel).setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
  // energy profile: reactant plateau x0..xa at yR, peak at (xp, yK), product plateau xb..x1 at yP
  const prof = (x0, xa, yR, xp, yK, xb, yP, x1, w1 = 110, w2 = 110) =>
    `M${x0} ${yR}H${xa}C${xa + w1} ${yR} ${xp - w1} ${yK} ${xp} ${yK}C${xp + w2} ${yK} ${xb - w2} ${yP} ${xb} ${yP}H${x1}`
  const curve = (d, col = TXT, w = 7, cls = '') => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${cls ? ` class="${cls}" pathLength="1" stroke-dasharray="1 2"` : ''}/>`
  const vArrow = (x, y1, y2, col) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${MKC[col]}" stroke-width="5" marker-end="url(#mk-${col})"/>`
  const MKC = { warm: WARM, teal: TEAL, gold: GOLD, muted: '#a3abbd' }
  const dash = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#a3abbd" stroke-width="3" stroke-dasharray="10 10" opacity=".7"/>`
  const lens = {}
  const along = (c, sel, u) => { const p = c.$(sel); if (!lens[sel]) lens[sel] = p.getTotalLength(); return p.getPointAtLength(Math.max(0, Math.min(1, u)) * lens[sel]) }
  const uAtX = (c, sel, x) => { const k = sel + x; if (lens[k] == null) { along(c, sel, 0); let u = 0; while (u < 1 && along(c, sel, u).x < x) u += 0.002; lens[k] = u } return lens[k] }
  const roll = (c, sampler, ball, u, r) => { const q = along(c, sampler, u); mv(c, ball, q.x, q.y - r) }

  // ---------- intro: a faint energy profile along the bottom, a ball resting before the barrier ----------
  const IP = prof(120, 430, 892, 960, 842, 1490, 940, 1800, 220, 220)
  EZ.intro = {
    chips: [['1@0.3', 'Favored ≠ fast'], ['1@0.55', 'Kinetic control'], ['1@0.85', 'Slow vs. equilibrium']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.3">${curve(IP, '#a3abbd', 6)}<g class="x-ib">${ball(0, 0, 18, 'pur')}</g></svg>`,
    update(c) { mv(c, '.x-ib', 300 + 8 * Math.sin((c.t - c.sc.start) * 1.3), 872) },
  }

  // ---------- hook: diamond -> graphite, favored but unseen ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Why it matters</div><h2 class="h1" data-at="in+0.2">A surprise about diamond</h2>
      <div class="card" style="left:120px;top:320px;width:600px;height:420px" data-at="0@0.3"><h3 class="teal">Diamond</h3></div>
      <div class="card" style="left:1200px;top:320px;width:600px;height:420px" data-at="1@0.45"><h3 class="muted">Graphite</h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.5" data-fx="pop"><path d="M330 520L370 480H470L510 520L420 650Z" fill="rgba(60,199,188,.22)" stroke="${TEAL}" stroke-width="5" stroke-linejoin="round"/>
          <path d="M330 520H510M370 480L400 520L420 650L440 520L470 480M400 520L420 480L440 520" fill="none" stroke="${TEAL}" stroke-width="3" stroke-linejoin="round" opacity=".8"/></g>
        <g data-at="1@0.55" data-fx="pop"><path d="M1420 500Q1440 470 1500 476Q1570 470 1590 510Q1610 570 1570 620Q1520 650 1460 636Q1405 620 1408 560Z" fill="url(#g-gray)" opacity=".75" stroke="#a3abbd" stroke-width="4"/></g>
        <g data-at="1@0.2" data-fx="fade"><line x1="760" y1="530" x2="1160" y2="530" stroke="#a3abbd" stroke-width="6" marker-end="url(#mk-muted)"/></g>
      </svg>
      <div class="x-lab" style="left:740px;width:440px;top:420px" data-at="1@0.6" data-fx="pop"><small style="margin:0 0 4px">thermodynamically</small><span class="good">favored</span></div>
      <div class="x-lab bad" style="left:740px;width:440px;top:575px" data-at="3" data-fx="fade">so slowly<small>you'll never see it</small></div>
      <div class="banner" style="top:800px" data-at="4" data-out="5-0.35" data-fx="pop">Favored, but <span class="warm">far too slow</span> to notice</div>
      <div class="banner" style="top:800px" data-at="5" data-fx="pop">That's <span class="gold">kinetic control</span></div>`,
  })

  // ---------- favored is not fast ----------
  EZ.scene('favored', {
    html: `<div class="kicker" data-at="in" data-fx="left">The idea</div><h2 class="h1" data-at="in+0.2">Two different questions</h2>
      <div class="card" style="left:120px;top:320px;width:810px;height:500px" data-at="1"><h3 class="pri">Thermodynamics</h3>
        <div class="x-row" style="top:120px;font-size:50px">Is it favored?</div>
        <div class="x-row" style="top:230px;font-size:38px" data-at="2"><span class="gold">ΔG</span> tells you <span class="good">whether</span></div>
        <div class="x-row" style="top:300px;font-size:38px" data-at="3"><span class="gold">ΔG</span> says <span class="bad">nothing</span> about how fast</div>
        <div class="x-row good" style="top:400px;font-size:40px" data-at="5@0.45" data-fx="pop">strongly favored</div></div>
      <div class="card" style="left:990px;top:320px;width:810px;height:500px" data-at="4"><h3 class="teal">Kinetics</h3>
        <div class="x-row" style="top:120px;font-size:50px">How fast does it go?</div>
        <div class="x-row bad" style="top:430px;font-size:40px;text-align:center;left:0;right:0" data-at="5@0.6" data-fx="pop">extremely slow</div></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="4@0.2" data-fx="fade">
        <path d="M1265 690A130 130 0 0 1 1525 690" fill="none" stroke="#363c54" stroke-width="16" stroke-linecap="round"/>
        <path d="M1265 690A130 130 0 0 1 1525 690" fill="none" stroke="${TEAL}" stroke-width="6" stroke-linecap="round" opacity=".5"/>
        <text x="1250" y="728" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">slow</text><text x="1540" y="728" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">fast</text>
        <g transform="translate(1395 690)"><g class="x-nd"><line x1="0" y1="0" x2="112" y2="0" stroke="${WARM}" stroke-width="8" stroke-linecap="round"/></g><circle r="13" fill="${WARM}"/></g></g></svg>
      <div class="banner" style="top:860px" data-at="6" data-fx="pop">Favored <span class="gold">≠</span> fast</div>`,
    update(c) {
      const b = c.b
      let a = 180 - 85 * eio(c.seg(b[4].start + 0.4, b[4].start + 1.6))
      a = lerp(a, 168, eio(c.seg(b[5].start + 0.6, b[5].start + 2.0)))
      c.$('.x-nd').setAttribute('transform', `rotate(${(-a).toFixed(1)})`)
    },
  })

  // ---------- one diagram: favorability and rate ----------
  const BP = prof(340, 560, 560, 950, 370, 1340, 800, 1560, 140, 130)
  EZ.scene('barrier', {
    html: `<div class="kicker" data-at="in" data-fx="left">Energy profile</div><h2 class="h1" data-at="in+0.2">One diagram, two answers</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0" data-fx="fade"><line x1="300" y1="900" x2="300" y2="330" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/><line x1="300" y1="900" x2="1620" y2="900" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/>
          <text x="300" y="312" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">energy</text>
          <text x="1620" y="940" text-anchor="end" font-size="26" font-weight="800" class="f-muted">reaction progress</text></g>
        <g data-at="0@0.2">${curve(BP, TXT, 7, 'x-bp')}</g>
        <path class="x-bs" d="${BP}" fill="none" stroke="none"/>
        <g data-at="0@0.6" data-fx="fade"><text x="450" y="604" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">reactants</text>
          <text x="1450" y="772" text-anchor="middle" font-size="30" font-weight="900" class="f-pri">products</text></g>
        <g data-at="1@0.3" data-fx="fade">${dash(560, 1625, 560)}${vArrow(1610, 566, 790, 'gold')}
          <text x="1640" y="690" font-size="32" font-weight="900" class="f-gold">favorability</text></g>
        <g data-at="2@0.5" data-fx="fade"><text x="1640" y="736" font-size="30" font-weight="900" class="f-good">favored</text></g>
        <g data-at="3@0.4" data-fx="fade">${vArrow(950, 556, 382, 'warm')}<text x="932" y="485" text-anchor="end" font-size="44" font-weight="900">${sEA()}</text></g>
        <g data-at="4@0.2" data-fx="fade"><text x="950" y="628" text-anchor="middle" font-size="32" font-weight="900" class="f-warm">sets the rate</text></g>
        <g data-at="0@0.8" data-fx="fade"><g class="x-bb">${ball(0, 0, 22, 'pur')}</g></g>
      </svg>
      <div class="x-lab" style="left:330px;width:560px;top:700px;font-size:32px" data-at="5@0.5" data-fx="fade">almost no collisions<br>get over the barrier</div>
      <div class="x-lab" style="left:330px;width:560px;top:800px;font-size:34px" data-at="6@0.3" data-fx="pop"><span class="good">favored</span>, but <span class="bad">barely moves</span></div>`,
    update(c) {
      const b = c.b
      c.$('.x-bp').setAttribute('stroke-dashoffset', 1 - eio(c.seg(b[0].start + 0.2, b[0].start + 2.2)))
      const k = c.seg(b[5].start + 0.3, b[5].end - 0.2)
      roll(c, '.x-bs', '.x-bb', 0.08 + 0.15 * Math.pow(Math.sin(Math.PI * 2 * k), 2), 24)
    },
  })

  // ---------- kinetic control, two examples ----------
  const DP = prof(170, 300, 790, 520, 570, 740, 850, 870, 80, 80)
  const WP = prof(1040, 1170, 740, 1390, 620, 1610, 870, 1740, 80, 80)
  EZ.scene('control', {
    html: `<div class="kicker" data-at="in" data-fx="left">Name it</div><h2 class="h1" data-at="in+0.2">Kinetic control</h2>
      <div class="x-line" style="top:282px;font-size:40px" data-at="1">Favored, but <span class="warm">no measurable rate</span> ${ARR} <span class="gold">kinetic control</span></div>
      <div class="x-line muted" style="top:346px;font-size:34px" data-at="2">the usual reason: a <span class="warm">high ${EA}</span></div>
      <div class="card" style="left:120px;top:420px;width:810px;height:500px" data-at="3"><h3 class="teal">Diamond ${ARR} graphite</h3></div>
      <div class="card" style="left:990px;top:420px;width:810px;height:500px" data-at="6"><h3 class="warm">Wood + O<sub>2</sub></h3></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="3@0.3" data-fx="fade">${curve(DP, TXT, 6)}<text x="235" y="830" text-anchor="middle" font-size="26" font-weight="900" class="f-teal">diamond</text>
          <text x="805" y="828" text-anchor="middle" font-size="26" font-weight="900" class="f-muted">graphite</text>${ball(235, 772, 16, 'teal')}</g>
        <g data-at="5" data-fx="fade">${dash(300, 560, 790)}${vArrow(520, 786, 580, 'warm')}<text x="480" y="842" text-anchor="middle" font-size="28" font-weight="900"><tspan class="f-warm">huge </tspan>${sEA()}<tspan dy="-9" class="f-bad"> · rate ≈ 0</tspan></text></g>
        <g data-at="6@0.3" data-fx="fade">${curve(WP, TXT, 6)}<text x="1105" y="780" text-anchor="middle" font-size="26" font-weight="900" class="f-warm">wood + O<tspan dy="7" font-size=".62em">2</tspan></text>
          <text x="1690" y="830" text-anchor="middle" font-size="26" font-weight="900" class="f-muted">products</text></g>
        <path class="x-ws" d="${WP}" fill="none" stroke="none"/>
        <g data-at="6@0.5" data-fx="fade"><g class="x-wb">${ball(0, 0, 16, 'warm')}</g></g>
        <g data-at="8@0.3" data-out="8@0.3+1.6" data-fx="pop"><path d="M1045 790C1020 765 1030 740 1048 718C1050 738 1062 742 1066 730C1078 752 1076 776 1045 790Z" fill="${GOLD}" stroke="${WARM}" stroke-width="4" stroke-linejoin="round"/></g>
      </svg>
      <div class="x-lab" style="left:120px;width:810px;top:866px;font-size:28px" data-at="4@0.3" data-fx="fade">many strong C–C bonds to break</div>
      <div class="x-lab" style="left:990px;width:810px;top:866px;font-size:28px"><span class="good" data-at="7@0.2" data-fx="fade">very favored</span><span data-at="8@0.4" data-fx="fade"> · needs a match to get over ${EA}</span></div>`,
    update(c) {
      const b = c.b, t0 = b[8].start + 0.9
      roll(c, '.x-ws', '.x-wb', lerp(uAtX(c, '.x-ws', 1100), uAtX(c, '.x-ws', 1620), eio(c.seg(t0, t0 + 2.6))), 18)
    },
  })

  // ---------- catalyst and temperature ----------
  const SP = prof(200, 360, 560, 660, 370, 980, 800, 1140, 110, 100)
  const CP = prof(200, 360, 560, 660, 480, 980, 800, 1140, 110, 100)
  const CPmid = `M360 560C470 560 550 480 660 480C760 480 880 800 980 800`
  const CH = [['1', 'teal', 'Add a catalyst'], ['2@0.4', 'teal', `lowers ${EA} ${ARR} faster`], ['3@0.2', 'warm', 'higher T also helps'], ['4@0.4', 'gold', 'ΔG° unchanged'],
    ['5@0.3', 'muted', 'same reactant and product energies'], ['6@0.4', 'bad', 'unfavored stays unfavored'], ['7@0.4', 'good', 'favored: equilibrium sooner']]
  const BGC = { teal: 'rgba(60,199,188,.12)', warm: 'rgba(243,167,100,.12)', gold: 'rgba(242,196,67,.12)', muted: 'rgba(163,171,189,.10)', bad: 'rgba(240,112,122,.12)', good: 'rgba(76,199,129,.12)' }
  EZ.scene('speed', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Speed it up</div><h2 class="h1" data-at="in+0.2">Getting it going</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <g data-at="0@0.3" data-fx="fade"><line x1="160" y1="880" x2="160" y2="330" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/><line x1="160" y1="880" x2="1180" y2="880" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/>
          <text x="160" y="312" text-anchor="middle" font-size="26" font-weight="800" class="f-muted">energy</text>
          ${curve(SP, TXT, 7)}${dash(360, 1175, 560)}${vArrow(630, 556, 380, 'warm')}<text x="612" y="352" text-anchor="end" font-size="40" font-weight="900">${sEA()}</text>
          <text x="280" y="532" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">reactants</text><text x="1080" y="772" text-anchor="middle" font-size="28" font-weight="900" class="f-pri">products</text></g>
        <g data-at="2@0.1">${curve(CPmid, TEAL, 7, 'x-cp')}</g>
        <path class="x-cs" d="${CP}" fill="none" stroke="none"/>
        <g data-at="2@0.4" data-fx="fade">${vArrow(690, 556, 490, 'teal')}</g>
        <g data-at="4@0.3" data-fx="fade">${vArrow(1160, 566, 790, 'gold')}<text x="1160" y="840" text-anchor="middle" font-size="32" font-weight="900" class="f-gold">ΔG°</text></g>
        <g data-at="0@0.6" data-fx="fade"><g class="x-sb">${ball(0, 0, 20, 'pur')}</g></g>
      </svg>
      ${CH.map(([at, col, t], i) => `<div class="x-chip ${col}" style="left:1250px;top:${330 + i * 80}px;background:${BGC[col]}" data-at="${at}" data-fx="pop">${t}</div>`).join('')}`,
    update(c) {
      const b = c.b
      c.$('.x-cp').setAttribute('stroke-dashoffset', 1 - eio(c.seg(b[2].start + 0.1, b[2].start + 1.1)))
      const t0 = b[2].start + 1.3
      roll(c, '.x-cs', '.x-sb', lerp(uAtX(c, '.x-cs', 280), uAtX(c, '.x-cs', 995), eio(c.seg(t0, t0 + 2.6))), 22)
    },
  })

  // ---------- trap: slow is not equilibrium ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Trap</div><h2 class="h1" data-at="in+0.2">Slow is not equilibrium</h2>
      <div class="card" style="left:120px;top:310px;width:700px;height:510px" data-at="1"><h3>A favored reaction</h3></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1@0.2" data-fx="fade">
        <path d="M430 470V530L360 670Q352 690 372 690H568Q588 690 580 670L510 530V470Z" fill="rgba(141,141,240,.06)" stroke="#a3abbd" stroke-width="5" stroke-linejoin="round"/>
        <path d="M384 625H556L580 670Q588 690 568 690H372Q352 690 360 670Z" fill="rgba(60,199,188,.35)"/></g></svg>
      <div class="x-lab muted" style="left:120px;width:700px;top:720px;font-size:34px" data-at="1@0.3" data-fx="fade">no visible change</div>
      <div class="card" style="left:880px;top:310px;width:920px;height:510px" data-at="1@0.5"><h3>So it is…</h3>
        <div class="x-row" style="top:130px;font-size:44px" data-at="1@0.6"><span class="bad">✗</span> &nbsp;at equilibrium</div>
        <div class="x-row" style="top:230px;font-size:44px" data-at="2" data-fx="pop"><span class="good">✓</span> &nbsp;just slow <span class="muted" style="font-size:34px">(high ${EA})</span></div>
        <div class="x-row muted" style="top:360px;font-size:32px" data-at="3">no visible change can <i>look</i> like equilibrium</div></div>
      <div class="banner" style="top:860px" data-at="4" data-out="5-0.35" data-fx="pop">Don't confuse <span class="warm">no visible change</span> with <span class="gold">equilibrium</span></div>
      <div class="banner" style="top:860px" data-at="5" data-fx="pop">Diamond: <span class="bad">not</span> at equilibrium with graphite, <span class="warm">just slow</span></div>`,
  })

  // ---------- try it ----------
  const OPTS = [['A', 'The reaction is at equilibrium'], ['B', 'ΔG° is actually positive'], ['C', 'The reaction has a very high activation energy'], ['D', 'The products are less stable']]
  const OPT_AT = ['2@0.14', '2@0.36', '2@0.56', '2@0.84']
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" data-at="1">ΔG° = −200 kJ, yet <span class="teal">no product</span>. Why?</h2>
      <div class="x-line muted" style="top:276px;font-size:34px" data-at="1@0.55">no product forms after weeks at room temperature</div>
      ${OPTS.map(([l, f], i) => `<div class="x-tile x-t${i}" style="left:${140 + (i % 2) * 840}px;top:${350 + Math.floor(i / 2) * 160}px" data-at="${OPT_AT[i]}" data-fx="pop"><div class="l">${l}</div><span class="tx">${f}</span>
        ${i === 2 ? '<svg class="ok" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</div>`).join('')}
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="770" r="74" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="770" r="74" fill="none" stroke="${TEAL}" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 770)"/>
        <text class="x-num" x="960" y="796" text-anchor="middle" font-size="76" font-weight="900">3</text><text x="960" y="900" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="banner" style="top:690px" data-at="5" data-fx="pop">Favored but too slow to see: <span class="gold">kinetic control</span></div>
      <div class="x-line" style="top:830px;font-size:38px" data-at="5@0.6">most likely a <span class="warm">large ${EA}</span></div>
      <div class="x-line" style="top:900px;font-size:38px" data-at="6"><span class="bad">not</span> at equilibrium, <span class="good">just slow</span></div>`,
    update(c) {
      const b = c.b, t0 = b[3].start + 0.3, t1 = b[4].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const win = eo(c.seg(b[4].start + 0.3, b[4].start + 0.8))
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
  const r1 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="110" y="100" text-anchor="middle" font-size="56" font-weight="900" class="f-gold">ΔG</text>
    <path d="M230 125A90 90 0 0 1 410 125" fill="none" stroke="#363c54" stroke-width="12" stroke-linecap="round"/><line x1="320" y1="125" x2="${(320 - 80 * Math.cos(Math.PI * 12 / 180)).toFixed(1)}" y2="${(125 - 80 * Math.sin(Math.PI * 12 / 180)).toFixed(1)}" stroke="${WARM}" stroke-width="7" stroke-linecap="round"/><circle cx="320" cy="125" r="10" fill="${WARM}"/></svg>`
  const r2 = `<svg width="460" height="150" viewBox="0 0 460 150"><path d="M20 105H90C140 105 170 18 230 18C290 18 330 135 380 135H440" fill="none" stroke="${TXT}" stroke-width="6" stroke-linecap="round"/>${ball(58, 89, 15, 'pur')}
    <line x1="230" y1="102" x2="230" y2="30" stroke="${WARM}" stroke-width="5" marker-end="url(#mk-warm)"/></svg>`
  const r3 = `<svg width="460" height="150" viewBox="0 0 460 150"><text x="230" y="95" text-anchor="middle" font-size="46" font-weight="900"><tspan class="f-warm">slow</tspan><tspan class="f-gold"> ≠ </tspan><tspan class="f-pri">equilibrium</tspan></text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Thermodynamics:<br>whether it's <span class="gold">favored</span><br>Kinetics: <span class="teal">how fast</span></p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p>Favored but slow<br>= <span class="gold">kinetic control</span><br>(high ${EA})</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>A slow reaction<br>isn't necessarily<br>at <span class="gold">equilibrium</span></p></div>`,
  })
})()
