// Pictures for chem-4.6 "Introduction to Titration". One EZ.scene per scene id in script.mjs.
// Every number shown is the lesson's own (app/src/content/chem/u4.ts). The titration curve has the
// shape of the lesson's own diagram (titration-strong) and is drawn without numbers.
(() => {
  const { clamp, lerp, eio, eo, ARR } = EZ
  const css = document.createElement('style')
  css.textContent = `
    .x-note{position:absolute;left:1010px;width:790px;padding:22px 30px 24px 34px;border-radius:26px;background:rgba(36,40,56,.92);border:2px solid var(--line);border-left-width:10px}
    .x-note b{display:block;font-size:42px;font-weight:900;line-height:1.15} .x-note span{display:block;margin-top:8px;font-size:30px;font-weight:700;color:var(--muted);line-height:1.3}
    .x-note em{font-style:normal} .x-tag{display:inline-block;font-style:normal;margin-top:12px;padding:4px 18px;border-radius:14px;font-size:26px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;background:rgba(255,255,255,.06);border:2px solid currentColor}
    .x-eq{left:120px;width:1680px;text-align:center;font-weight:900;white-space:nowrap}
    .x-big{font-size:80px;line-height:1}
    .x-brace{position:absolute;top:836px;height:60px;border:5px solid var(--good);border-top:0;border-radius:0 0 24px 24px}
    .x-bl{position:absolute;top:910px;font-size:38px;font-weight:900;text-align:center;white-space:nowrap}
    .x-prob{left:120px;top:290px;width:1680px;height:130px;padding:38px 48px 0;font-size:44px;font-weight:800;white-space:nowrap}
    .x-row{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.75);border:2px solid var(--line)}
    .x-row .n{position:absolute;left:28px;top:26px;width:68px;height:68px;border-radius:50%;font-size:38px;font-weight:900;line-height:68px;text-align:center;color:#10131c}
    .x-row .lb{position:absolute;left:124px;top:36px;font-size:36px;font-weight:900;white-space:nowrap}
    .x-row .eq{position:absolute;left:420px;top:34px;font-size:42px;font-weight:900;white-space:nowrap}
    .x-res{position:absolute;right:22px;top:18px;height:80px;padding:0 30px;border-radius:20px;font-size:44px;font-weight:900;line-height:76px;white-space:nowrap;background:rgba(91,91,214,.35);border:2px solid var(--primary)}
    .x-chx{position:absolute;height:72px;padding:0 26px;border-radius:20px;background:rgba(255,255,255,.05);border:2px solid var(--line);font-size:36px;font-weight:800;line-height:68px;white-space:nowrap}
    .x-ans{position:absolute;left:120px;top:460px;width:1680px;height:124px;border-radius:28px;background:rgba(76,199,129,.14);border:3px solid var(--good);text-align:center;font-size:62px;font-weight:900;line-height:118px}
    .x-ans svg{position:absolute;right:30px;top:28px;width:64px;height:64px}
    .x-err{position:absolute;left:120px;width:1680px;height:120px;border-radius:26px;background:rgba(36,40,56,.8);border:2px solid var(--line);font-size:38px;font-weight:900;white-space:nowrap}
    .x-err > span{position:absolute;top:36px} .x-hi{position:absolute;right:24px;top:20px;height:78px;padding:0 28px;border-radius:20px;line-height:74px;background:rgba(240,112,122,.16);border:2px solid var(--bad);color:var(--bad)}
    .x-th{position:absolute;top:296px;font-size:26px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .x-rc{top:320px;width:540px;height:560px;text-align:center} .x-rc .n{margin:30px auto 0;width:76px;height:76px;border-radius:50%;background:var(--brand);font-size:44px;font-weight:900;line-height:76px}
    .x-rc svg{display:block;margin:14px auto 0} .x-rc p{margin:14px 20px 0;font-size:34px;font-weight:800;line-height:1.35;white-space:nowrap}
  `
  document.head.appendChild(css)

  const CHECK = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#4cc781"/><path d="M18 33l10 10 19-21" fill="none" stroke="#10131c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  const TEAL = '#3cc7bc', PUR = '#8d8df0', WARM = '#f3a764', RED = '#f0707a'
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})` }
  const CLEAR = '#4a5272', SIGNAL = '#b968d0' // the analyte before and after the indicator changes colour

  // ---------- a buret over a flask; drawn in its own coordinates (buret top at 0), then placed ----------
  const flaskPath = 'M-34 540 V610 L-150 790 Q-155 806 -136 806 H136 Q155 806 150 790 L34 610 V540'
  const rig = (id, x, y, k, o = {}) => `<g transform="translate(${x} ${y}) scale(${k})">
      <rect x="-24" y="0" width="48" height="424" rx="10" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="3"/>
      <rect class="${id}-liq" x="-18" y="30" width="36" height="388" rx="6" fill="${TEAL}" opacity=".85"/>
      ${Array.from({ length: 10 }, (_, i) => `<line x1="-24" x2="${i % 2 ? -12 : -4}" y1="${40 + i * 38}" y2="${40 + i * 38}" stroke="#eef0f7" stroke-width="2.5" opacity=".7"/>`).join('')}
      <rect x="-44" y="424" width="88" height="18" rx="9" fill="#aab1c4"/>
      <path d="M-14 442 L-4 492 L4 492 L14 442 Z" fill="rgba(255,255,255,.08)" stroke="#c9cee0" stroke-width="3" stroke-linejoin="round"/>
      <circle class="${id}-drop" cx="0" cy="500" r="9" fill="${TEAL}" opacity="0"/>
      <path class="${id}-fl" d="M-92 700 L-150 790 Q-155 806 -136 806 H136 Q155 806 150 790 L92 700 Z" fill="${o.flask ?? CLEAR}"/>
      <path d="${flaskPath}" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="4" stroke-linejoin="round"/>
    </g>`
  // drain: 0..1 of the buret used; drip: 0..1 how visible the falling drop is; color: 0..1 indicator change
  const rigAnim = (c, id, { drain = 0, drip = 0, color = null }) => {
    const liq = c.$(`.${id}-liq`), y = 30 + drain * 210
    liq.setAttribute('y', y); liq.setAttribute('height', 418 - y)
    const ph = (c.t % 0.6) / 0.6, d = c.$(`.${id}-drop`)
    d.setAttribute('cy', 500 + ph * ph * 200)
    d.style.opacity = drip * (ph < 0.85 ? 1 : (1 - ph) / 0.15)
    if (color !== null) c.$(`.${id}-fl`).setAttribute('fill', mix(CLEAR, SIGNAL, color))
  }

  // ---------- the titration curve (the shape of the lesson's strong acid / strong base diagram) ----------
  const pH = (v) => { const acid = 2.5, base = v * 0.1, vol = (25 + v) / 1000
    if (Math.abs(acid - base) < 1e-9) return 7
    return acid > base ? -Math.log10((acid - base) / 1000 / vol) : 14 + Math.log10((base - acid) / 1000 / vol) }
  const GX = (v) => 210 + v * 15.6, GY = (p) => 880 - p * 36
  const CURVE = (() => { const pts = []; for (let v = 0; v <= 50; v += 0.1) pts.push(`${GX(v).toFixed(1)} ${GY(pH(v)).toFixed(1)}`); return 'M' + pts.join('L') })()

  // ---------- intro artwork: a faint buret and flask at the left edge, a faint curve at the right ----------
  EZ.intro = {
    chips: [['1@0.3', 'Analyte &amp; titrant'], ['1@0.52', 'The key equation'], ['1@0.8', 'Lab errors']],
    art: `<svg class="full" viewBox="0 0 1920 1080" style="opacity:.2">${rig('ir', 175, 330, 0.6)}
      <g transform="translate(1610 320) scale(.36 .7)"><path d="${CURVE}" transform="translate(-210 -360)" fill="none" stroke="${PUR}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
    update(c) {
      const s = c.sc.start
      rigAnim(c, 'ir', { drain: 0.5 * c.seg(s + 0.3, s + 5), drip: c.seg(s + 0.3, s + 0.8), color: eio(c.seg(s + 4, s + 5)) })
    },
  }

  // ---------- hook: how much acid is in the juice? ----------
  EZ.scene('hook', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Think about it</div><h2 class="h1" data-at="0">How much acid is in your juice?</h2>
      <div class="card" style="left:120px;top:310px;width:740px;height:560px" data-at="0@0.3"><h3>Orange juice</h3>
        <svg style="position:absolute;left:0;top:90px" width="740" height="460" viewBox="0 0 740 460">
          <path d="M270 60 L300 400 Q302 420 322 420 H418 Q438 420 440 400 L470 60 Z" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="5" stroke-linejoin="round"/>
          <path d="M281 130 L300 400 Q302 414 322 414 H418 Q438 414 440 400 L459 130 Z" fill="${WARM}" opacity=".9"/>
          <ellipse cx="335" cy="190" rx="16" ry="40" fill="#fff" opacity=".18"/>
          <text x="560" y="230" text-anchor="middle" font-size="120" font-weight="900" class="f-gold" data-at="0@0.6" data-fx="pop">?</text>
          <text x="370" y="455" text-anchor="middle" font-size="34" font-weight="900" class="f-muted" data-at="3@0.6" data-fx="fade">amount of acid: measured</text>
        </svg></div>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="1" data-fx="fade">${rig('hk', 1340, 300, 0.7)}</g>
        <text x="1440" y="420" font-size="34" font-weight="900" class="f-teal" data-at="2@0.2" data-fx="fade">known</text>
        <text x="1440" y="460" font-size="34" font-weight="900" class="f-teal" data-at="2@0.2" data-fx="fade">concentration</text>
        <text x="1470" y="600" font-size="34" font-weight="900" class="f-warm" data-at="2@0.5" data-fx="fade">drop by drop</text>
        <text x="1340" y="900" text-anchor="middle" font-size="34" font-weight="900" class="f-pri" data-at="2@0.8" data-fx="fade">until exactly complete</text></svg>
      <div class="banner" style="top:930px;padding:14px 40px;font-size:40px" data-at="4" data-fx="pop">React the unknown <span class="gold">completely</span> with a <span class="teal">known</span> solution</div>`,
    update(c) {
      const b = c.b
      const on = c.seg(b[2].start + 0.3, b[2].start + 0.6) * (1 - c.seg(b[2].end - 0.2, b[2].end + 0.2))
      rigAnim(c, 'hk', { drain: 0.55 * eio(c.seg(b[2].start + 0.3, b[2].end)), drip: on, color: eio(c.seg(b[2].end - 0.6, b[2].end)) })
    },
  })

  // ---------- vocabulary: analyte and titrant ----------
  EZ.scene('vocab', {
    html: `<div class="kicker" data-at="in" data-fx="left">Vocabulary</div><h2 class="h1" data-at="0">Analyte and titrant</h2>
      <svg class="full" viewBox="0 0 1920 1080"><g data-at="0@0.4" data-fx="fade">${rig('vb', 480, 300, 0.72)}</g>
        <g data-at="2@0.2" data-fx="fade"><line x1="680" y1="420" x2="530" y2="420" stroke="${TEAL}" stroke-width="6" marker-end="url(#mk-teal)"/>
          <text x="696" y="432" font-size="40" font-weight="900" class="f-teal">titrant</text></g>
        <g data-at="1@0.2" data-fx="fade"><line x1="740" y1="840" x2="610" y2="840" stroke="${PUR}" stroke-width="6" marker-end="url(#mk-pri)"/>
          <text x="756" y="852" font-size="40" font-weight="900" class="f-pri">analyte</text></g>
        <text x="440" y="330" text-anchor="end" font-size="30" font-weight="900" class="f-muted" data-at="3@0.15" data-fx="fade">buret</text>
        <text x="340" y="900" text-anchor="end" font-size="30" font-weight="900" class="f-muted" data-at="1@0.4" data-fx="fade">flask</text></svg>
      <div class="x-note" style="top:300px;border-left-color:var(--primary)" data-at="1" data-fx="right"><b class="pri">Analyte</b><span>the solution you’re investigating<br>(unknown amount)</span></div>
      <div class="x-note" style="top:500px;border-left-color:var(--accent)" data-at="2" data-fx="right"><b class="teal">Titrant</b><span>known concentration</span>
        <span data-at="3" data-fx="fade">added from a buret; reacts specifically<br>and completely with the analyte</span></div>
      <div class="x-note" style="top:790px;border-left-color:var(--gold);padding-top:18px;padding-bottom:18px" data-at="4" data-fx="pop"><b style="font-size:38px"><em class="teal">Known</em> in from the buret ${ARR}<br><em class="pri">unknown</em> in the flask</b></div>`,
    update(c) {
      const b = c.b
      const on = c.seg(b[3].start + 0.2, b[3].start + 0.5) * (1 - c.seg(b[4].end - 0.3, b[4].end))
      rigAnim(c, 'vb', { drain: 0.4 * eio(c.seg(b[3].start + 0.2, b[4].end)), drip: on })
    },
  })

  // ---------- equivalence point vs. endpoint ----------
  EZ.scene('points', {
    html: `<div class="kicker" data-at="in" data-fx="left">Two key moments</div><h2 class="h1" data-at="0">Equivalence point vs. endpoint</h2>
      <svg class="full" viewBox="0 0 1920 1080">
        <defs><clipPath id="x-clip"><rect class="x-cr" x="0" y="300" width="0" height="700"/></clipPath></defs>
        <g data-at="1" data-fx="fade"><line x1="210" y1="360" x2="210" y2="880" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/><line x1="210" y1="880" x2="1000" y2="880" stroke="#c9cee0" stroke-width="4" stroke-linecap="round"/>
          <text x="605" y="934" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">Volume of titrant added</text>
          <text x="170" y="630" text-anchor="middle" font-size="30" font-weight="800" class="f-muted">pH</text></g>
        <path d="${CURVE}" clip-path="url(#x-clip)" fill="none" stroke="${PUR}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <g data-at="3@0.4" data-fx="fade"><line x1="${GX(25)}" y1="${GY(7)}" x2="${GX(25)}" y2="880" stroke="${TEAL}" stroke-width="4" stroke-dasharray="10 10"/>
          <circle cx="${GX(25)}" cy="${GY(7)}" r="14" fill="${TEAL}"/>
          <text x="${GX(25) + 30}" y="${GY(7) + 12}" font-size="34" font-weight="900" class="f-teal">equivalence point</text>
          <text x="${GX(25) + 30}" y="${GY(7) + 52}" font-size="28" font-weight="800" class="f-muted">middle of the steep jump</text></g>
        <g class="x-dot"><circle r="24" fill="#fff" opacity=".25"/><circle r="11" fill="#fff"/></g>
      </svg>
      <div class="x-note" style="top:330px;border-left-color:var(--accent)" data-at="1" data-fx="right"><b class="teal">Equivalence point</b><span>the analyte is completely consumed</span>
        <span data-at="2" data-fx="fade">moles of titrant exactly match the stoichiometry</span>
        <em class="x-tag teal" data-at="5@0.1" data-fx="pop">true stoichiometric point</em></div>
      <div class="x-note" style="top:620px;border-left-color:var(--warm);padding-right:180px" data-at="4" data-fx="right"><b class="warm">Endpoint</b><span>the observable change, like an<br>indicator’s color change</span>
        <em class="x-tag warm" data-at="5@0.5" data-fx="pop">what you see</em>
        <svg style="position:absolute;right:26px;top:40px" width="130" height="150" viewBox="-160 520 320 300">${'<path class="pf" d="M-92 700 L-150 790 Q-155 806 -136 806 H136 Q155 806 150 790 L92 700 Z" fill="' + CLEAR + '"/><path d="' + flaskPath + '" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="8" stroke-linejoin="round"/>'}</svg></div>
      <div class="banner" style="left:1010px;width:790px;top:900px;padding:14px 20px;font-size:36px" data-at="6" data-fx="pop">Good indicator: endpoint <span class="gold">≈</span> equivalence</div>`,
    update(c) {
      const b = c.b
      let v = 24.6 * eio(c.seg(b[1].start + 0.2, b[2].end))
      if (c.t > b[3].start) v = lerp(24.6, 50, eio(c.seg(b[3].start + 0.1, b[3].start + 1.6)))
      c.$('.x-cr').setAttribute('width', GX(v) + 6)
      c.$('.x-dot').setAttribute('transform', `translate(${GX(v)} ${GY(pH(v))})`)
      c.$('.x-dot').style.opacity = c.seg(b[1].start, b[1].start + 0.3) * (1 - c.seg(b[3].start + 1.6, b[3].start + 2))
      c.$('.pf').setAttribute('fill', mix(CLEAR, SIGNAL, eio(c.seg(b[4].start + 0.8, b[4].start + 1.6))))
    },
  })

  // ---------- the key equation ----------
  const unit = (x, y, label, col) => `<rect x="${x - 70}" y="${y - 32}" width="140" height="64" rx="16" fill="${col}"/><text x="${x}" y="${y + 12}" text-anchor="middle" font-size="32" font-weight="900" class="f-dark">${label}</text>`
  EZ.scene('equation', {
    html: `<div class="kicker" data-at="in" data-fx="left">At equivalence</div><h2 class="h1" data-at="0">The key equation</h2>
      <div class="card x-eq" style="top:296px;height:110px;line-height:106px;font-size:48px" data-at="1"><span class="teal">mol titrant</span> <span class="muted">↔</span> <span class="pri">mol analyte</span> <span class="muted" style="font-size:36px">&nbsp;in the stoichiometric ratio</span></div>
      <svg class="full" viewBox="0 0 1920 1080">
        <text x="260" y="540" text-anchor="middle" font-size="40" font-weight="900" data-at="2" data-fx="fade">1 : 1</text>
        ${[0, 1, 2, 3].map((i) => `<g data-at="2@${0.25 + i * 0.08}" data-fx="pop">${unit(560 + i * 330, 490, 'HCl', PUR)}</g>
          <line x1="${560 + i * 330}" y1="526" x2="${560 + i * 330}" y2="560" stroke="#4cc781" stroke-width="5" data-at="2@0.75" data-fx="fade"/>
          <g data-at="2@${0.4 + i * 0.08}" data-fx="pop">${unit(560 + i * 330, 594, 'NaOH', TEAL)}</g>`).join('')}
        <text x="260" y="600" text-anchor="middle" font-size="30" font-weight="800" class="f-good" data-at="2@0.8" data-fx="fade">equal moles</text>
      </svg>
      <div class="card x-eq x-big" style="top:660px;height:160px;line-height:156px" data-at="3"><span class="pri">M<sub>acid</sub> × V<sub>acid</sub></span> <span class="muted">=</span> <span class="teal">M<sub>base</sub> × V<sub>base</sub></span></div>
      <div class="x-brace" style="left:330px;width:560px" data-at="4" data-fx="fade"></div><div class="x-brace" style="left:1040px;width:560px" data-at="4@0.2" data-fx="fade"></div>
      <div class="x-bl pri" style="left:330px;width:560px" data-at="4" data-fx="fade">= mol acid</div><div class="x-bl teal" style="left:1040px;width:560px" data-at="4@0.2" data-fx="fade">= mol base</div>`,
  })

  // ---------- worked example ----------
  const row = (i, top, at, col, label, eq, res) => `<div class="x-row" style="top:${top}px" data-at="${at}"><div class="n" style="background:${col}">${i}</div><div class="lb" style="color:${col}">${label}</div>
      <div class="eq" data-at="${at}@0.3" data-fx="fade">${eq}</div><div class="x-res" data-at="${res[1]}" data-fx="pop">${res[0]}</div></div>`
  EZ.scene('example', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Worked example</div><h2 class="h1" data-at="0">Find the unknown concentration</h2>
      <div class="card x-prob" data-at="1"><span class="pri">25.00 mL HCl</span> titrated with <span class="teal">0.100 M NaOH</span>: endpoint at <span class="teal">18.50 mL</span>. [HCl] = <span class="warm">?</span></div>
      ${row(1, 450, '2', TEAL, 'mol NaOH', '0.100 M × 0.01850 L =', ['1.85 × 10<sup>−3</sup> mol', '2@0.85'])}
      ${row(2, 590, '3', WARM, '1 : 1 ratio', 'mol HCl = mol NaOH =', ['1.85 × 10<sup>−3</sup> mol', '3@0.7'])}
      ${row(3, 730, '4', PUR, '[HCl]', '1.85 × 10<sup>−3</sup> mol ÷ 0.02500 L =', ['0.0740 M', '4@0.85'])}
      <div class="banner" style="top:880px;padding:16px 40px" data-at="4@0.8" data-fx="pop">Answer: <span class="good">[HCl] = 0.0740 M</span></div>`,
  })

  // ---------- the trap: other mole ratios ----------
  EZ.scene('trap', {
    html: `<div class="kicker warm" data-at="in" data-fx="left">Watch out</div><h2 class="h1" data-at="1">Don’t blindly apply <span class="bad">MV = MV</span></h2>
      <div class="x-chx" style="left:120px;top:286px;border-color:rgba(243,167,100,.6)" data-at="2" data-fx="pop">MV = MV only for <span class="warm">1 : 1</span></div>
      <div class="x-chx" style="left:620px;top:286px;border-color:rgba(76,199,129,.6)" data-at="2@0.55" data-fx="pop">other ratios: use the <span class="good">mole ratio</span></div>
      <div class="card" style="left:120px;top:384px;width:1680px;height:150px" data-at="3">
        <div style="position:absolute;left:44px;top:16px;font-size:52px;font-weight:900;white-space:nowrap">H<sub>2</sub>SO<sub>4</sub> + <span class="warm">2</span>NaOH → Na<sub>2</sub>SO<sub>4</sub> + 2H<sub>2</sub>O</div>
        <div style="position:absolute;right:40px;top:22px;height:64px;padding:0 24px;border-radius:18px;line-height:60px;font-size:40px;font-weight:900;background:rgba(243,167,100,.16);border:2px solid var(--warm)" class="warm" data-at="3@0.5" data-fx="pop">1 : 2</div>
        <div style="position:absolute;left:44px;top:94px;font-size:34px;font-weight:800;white-space:nowrap" class="muted" data-at="4" data-fx="fade"><span class="pri">10.00 mL H<sub>2</sub>SO<sub>4</sub></span> needs <span class="teal">24.00 mL of 0.150 M NaOH</span>. [H<sub>2</sub>SO<sub>4</sub>] = ?</div></div>
      ${row(1, 560, '5', TEAL, 'mol NaOH', '0.150 × 0.02400 =', ['0.00360 mol', '5@0.6'])}
      ${row(2, 700, '6', WARM, 'ratio 1 : 2', '0.00360 ÷ 2 =', ['0.00180 mol H<sub>2</sub>SO<sub>4</sub>', '6@0.7'])}
      ${row(3, 840, '7', PUR, 'concentration', '0.00180 mol ÷ 0.01000 L =', ['0.180 M', '7@0.8'])}`,
  })

  // ---------- try it ----------
  const prow = (i, top, at, label, eq) => `<div class="x-row" style="top:${top}px" data-at="${at}"><div class="n" style="background:${i === 1 ? TEAL : PUR}">${i}</div><div class="lb">${label}</div><div class="eq" style="left:330px" data-at="${at}@0.3" data-fx="fade">${eq}</div></div>`
  EZ.scene('try', {
    html: `<div class="kicker teal" data-at="in" data-fx="left">Your turn</div>
      <h2 class="h1" style="font-size:62px" data-at="1">What is the concentration of <span class="teal">NaOH</span>?</h2>
      <div class="x-chx" style="left:120px;top:310px" data-at="1@0.25" data-fx="pop">NaOH: <span class="teal">20.0 mL</span>, [NaOH] = <span class="warm">?</span></div>
      <div class="x-chx" style="left:680px;top:310px" data-at="1@0.55" data-fx="pop">HCl: <span class="pri">15.0 mL of 0.200 M</span></div>
      <div class="x-chx" style="left:1200px;top:310px" data-at="1@0.75" data-fx="pop">neutralized: <span class="good">1 : 1</span></div>
      <svg class="full x-count" viewBox="0 0 1920 1080"><circle cx="960" cy="640" r="66" fill="none" stroke="#363c54" stroke-width="12"/><circle class="x-arc" cx="960" cy="640" r="66" fill="none" stroke="#3cc7bc" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" transform="rotate(-90 960 640)"/>
        <text class="x-num" x="960" y="664" text-anchor="middle" font-size="70" font-weight="900">3</text><text x="960" y="760" text-anchor="middle" font-size="32" font-weight="800" class="f-muted">pause if you need more time</text></svg>
      <div class="x-ans" data-at="3" data-fx="pop"><span class="good">[NaOH] = 0.150 M</span>${CHECK}</div>
      ${prow(1, 620, '4', 'mol HCl', '0.200 × 0.0150 = <span class="pri">0.00300 mol</span> = mol NaOH')}
      ${prow(2, 760, '5', '[NaOH]', '0.00300 mol ÷ 0.0200 L = <span class="good">0.150 M</span>')}`,
    update(c) {
      const b = c.b, t0 = b[2].start + 0.3, t1 = b[3].start - 0.25, p = c.seg(t0, t1)
      c.$('.x-count').style.opacity = Math.min(c.seg(t0 - 0.3, t0), 1 - c.seg(t1, t1 + 0.25))
      c.$('.x-arc').setAttribute('stroke-dashoffset', p)
      c.$('.x-num').textContent = Math.max(1, Math.ceil(3 * (1 - p)))
      const w = eo(c.seg(b[3].start + 0.4, b[3].start + 0.9))
      c.$('.x-ans').style.boxShadow = `0 0 ${60 * w}px rgba(76,199,129,${0.45 * w})`
    },
  })

  // ---------- free-response tip: lab error reasoning ----------
  const err = (top, at, a, b) => `<div class="x-err" style="top:${top}px" data-at="${at}"><span style="left:40px">${a}</span>
      <span style="left:600px" class="muted" data-at="${at}@0.45" data-fx="fade">${ARR} <span class="pri">${b}</span></span>
      <span class="x-hi" data-at="${at}@0.8" data-fx="pop">too high ↑</span></div>`
  EZ.scene('frq', {
    html: `<div class="kicker" data-at="in" data-fx="left">Free-response tip</div><h2 class="h1" data-at="1">How does a mistake change the result?</h2>
      <div class="x-th" style="left:160px" data-at="2" data-fx="fade">Error</div><div class="x-th" style="left:720px" data-at="2@0.45" data-fx="fade">Measured volume</div><div class="x-th" style="left:1580px" data-at="2@0.8" data-fx="fade">Result</div>
      ${err(340, '2', 'Air bubble in the buret tip', 'recorded volume too large')}
      ${err(480, '3', 'Overshooting the endpoint', 'too much titrant added')}
      ${err(620, '4', 'Buret rinsed with water', 'titrant diluted: more volume')}
      <div class="banner" style="top:800px" data-at="5" data-fx="pop">Error ${ARR} <span class="pri">measured volume</span> ${ARR} <span class="warm">result</span></div>`,
  })

  // ---------- recap ----------
  const r1 = `<svg width="460" height="210" viewBox="0 0 460 210"><g transform="translate(80 6) scale(.25)">${'<rect x="-24" y="0" width="48" height="424" rx="10" fill="rgba(255,255,255,.05)" stroke="#c9cee0" stroke-width="10"/><rect x="-18" y="30" width="36" height="388" fill="' + TEAL + '"/><rect x="-44" y="424" width="88" height="18" rx="9" fill="#aab1c4"/><path d="M-92 700 L-150 790 Q-155 806 -136 806 H136 Q155 806 150 790 L92 700 Z" fill="' + PUR + '"/><path d="' + flaskPath + '" fill="none" stroke="#c9cee0" stroke-width="12"/>'}</g>
    <text x="140" y="70" font-size="30" font-weight="900" class="f-teal">titrant: known</text><text x="140" y="190" font-size="30" font-weight="900" class="f-pri">analyte: unknown</text></svg>`
  const r2 = `<svg width="460" height="210" viewBox="0 0 460 210"><path d="${CURVE}" transform="translate(60 0) scale(.42 .4) translate(-210 -360)" fill="none" stroke="${PUR}" stroke-width="16"/>
    <circle cx="${60 + (GX(25) - 210) * 0.42}" cy="${(GY(7) - 360) * 0.4}" r="12" fill="${TEAL}"/></svg>`
  const r3 = `<svg width="460" height="210" viewBox="0 0 460 210"><rect x="80" y="6" width="300" height="64" rx="16" fill="${TEAL}"/><text x="230" y="50" text-anchor="middle" font-size="32" font-weight="900" class="f-dark">mol titrant</text>
    <text x="230" y="122" text-anchor="middle" font-size="44" font-weight="900" class="f-gold">↕</text>
    <rect x="80" y="140" width="300" height="64" rx="16" fill="${PUR}"/><text x="230" y="184" text-anchor="middle" font-size="32" font-weight="900" class="f-dark">mol analyte</text></svg>`
  EZ.scene('recap', {
    html: `<div class="kicker" data-at="in" data-fx="left">Recap</div><h2 class="h1" data-at="0">Three things to remember</h2>
      <div class="card x-rc" style="left:120px" data-at="1"><div class="n">1</div>${r1}<p>Add <span class="teal">titrant</span> (known)<br>to <span class="pri">analyte</span> (unknown)<br>until equivalence</p></div>
      <div class="card x-rc" style="left:690px" data-at="2"><div class="n">2</div>${r2}<p><span class="teal">Equivalence:</span> analyte<br>completely consumed<br><span class="warm">Endpoint:</span> color change</p></div>
      <div class="card x-rc" style="left:1260px" data-at="3"><div class="n">3</div>${r3}<p>At equivalence,<br>use the<br><span class="gold">mole ratio</span></p></div>`,
  })
})()
